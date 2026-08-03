import "server-only";

import type { MailAttachment } from "@/lib/mail/types";

/**
 * Microsoft Graph mail client (application permissions, client credentials).
 *
 * No SMTP: a token from login.microsoftonline.com is exchanged for
 * `Mail.Send` against the sender mailbox, then messages POST to
 * /users/{sender}/sendMail. Tokens are cached in-process until 60s before
 * expiry.
 */
export interface GraphConfig {
  tenantId: string;
  clientId: string;
  clientSecret: string;
  senderEmail: string;
}

export interface GraphSendMessage {
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  html: string;
  replyTo?: string;
  attachments?: MailAttachment[];
}

export interface GraphResult {
  ok: boolean;
  error?: string;
}

let tokenCache: { key: string; token: string; expiresAt: number } | null = null;

export async function getGraphToken(config: GraphConfig): Promise<string> {
  const cacheKey = `${config.tenantId}:${config.clientId}`;
  if (tokenCache && tokenCache.key === cacheKey && Date.now() < tokenCache.expiresAt) {
    return tokenCache.token;
  }

  const body = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    scope: "https://graph.microsoft.com/.default",
    grant_type: "client_credentials",
  });

  const res = await fetch(
    `https://login.microsoftonline.com/${encodeURIComponent(config.tenantId)}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
    },
  );
  const json = (await res.json()) as {
    access_token?: string;
    expires_in?: number;
    error_description?: string;
    error?: string;
  };
  if (!res.ok || !json.access_token) {
    throw new Error(json.error_description ?? json.error ?? `token request failed (${res.status})`);
  }

  tokenCache = {
    key: cacheKey,
    token: json.access_token,
    expiresAt: Date.now() + Math.max(30, (json.expires_in ?? 3600) - 60) * 1000,
  };
  return json.access_token;
}

/** Cheap credential check: a token round-trip plus a mailbox read. */
/** Roles granted to the app, read from the access token's own claims. */
function tokenRoles(token: string): string[] {
  try {
    const segment = token.split(".")[1];
    if (!segment) return [];
    const claims = JSON.parse(Buffer.from(segment, "base64").toString("utf8")) as {
      roles?: string[];
    };
    return claims.roles ?? [];
  } catch {
    return [];
  }
}

/**
 * Credential check that needs NO extra permissions: acquiring a token proves
 * the tenant/client/secret triple, and the token's own `roles` claim proves
 * whether admin consent for Mail.Send was actually granted. (Probing
 * /users/{id} demanded User.Read.All, which a send-only app should not have —
 * that produced a misleading "Insufficient privileges".)
 */
export async function testGraphConnection(config: GraphConfig): Promise<GraphResult> {
  try {
    const token = await getGraphToken(config);
    const roles = tokenRoles(token);
    if (!roles.some((role) => role === "Mail.Send" || role === "Mail.ReadWrite")) {
      return {
        ok: false,
        error:
          roles.length === 0
            ? "Credentials are valid, but no application permissions are granted yet. In Azure → API permissions add Microsoft Graph → Application permissions → Mail.Send, then click 'Grant admin consent'."
            : `Credentials are valid, but Mail.Send is missing (granted: ${roles.join(", ")}). Add Mail.Send as an APPLICATION permission and grant admin consent.`,
      };
    }
    return { ok: true };
  } catch (cause) {
    return { ok: false, error: cause instanceof Error ? cause.message : String(cause) };
  }
}

export async function sendGraphMail(
  config: GraphConfig,
  message: GraphSendMessage,
): Promise<GraphResult> {
  try {
    const token = await getGraphToken(config);
    const recipients = (list: string[] | undefined) =>
      (list ?? [])
        .map((address) => address.trim())
        .filter(Boolean)
        .map((address) => ({ emailAddress: { address } }));

    const payload = {
      message: {
        subject: message.subject,
        body: { contentType: "HTML", content: message.html },
        toRecipients: recipients(message.to),
        ccRecipients: recipients(message.cc),
        bccRecipients: recipients(message.bcc),
        ...(message.replyTo ? { replyTo: [{ emailAddress: { address: message.replyTo } }] } : {}),
        ...(message.attachments?.length
          ? {
              attachments: message.attachments.map((a) => ({
                "@odata.type": "#microsoft.graph.fileAttachment",
                name: a.filename,
                contentType: a.contentType,
                contentBytes: Buffer.from(a.content).toString("base64"),
              })),
            }
          : {}),
      },
      saveToSentItems: true,
    };

    const res = await fetch(
      `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(config.senderEmail)}/sendMail`,
      {
        method: "POST",
        headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      },
    );
    if (res.status === 202 || res.ok) return { ok: true };
    const detail = (await res.json().catch(() => null)) as {
      error?: { code?: string; message?: string };
    } | null;
    const code = detail?.error?.code ?? "";
    const errorMessage = detail?.error?.message ?? `sendMail failed (${res.status})`;
    /* The two failures every first-time setup hits, named plainly. */
    if (res.status === 403 || code === "ErrorAccessDenied") {
      return {
        ok: false,
        error: `${errorMessage} — check that Mail.Send has admin consent AND that "${config.senderEmail}" is a real mailbox in this tenant (a shared mailbox is fine; an alias or an address on another tenant is not).`,
      };
    }
    if (res.status === 404 || code === "ErrorInvalidUser" || code === "ResourceNotFound") {
      return {
        ok: false,
        error: `Mailbox "${config.senderEmail}" was not found in this tenant. Create it in Microsoft 365 admin (a shared mailbox needs no licence) or use an existing mailbox address.`,
      };
    }
    return { ok: false, error: errorMessage };
  } catch (cause) {
    return { ok: false, error: cause instanceof Error ? cause.message : String(cause) };
  }
}
