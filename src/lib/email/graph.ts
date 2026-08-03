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
export async function testGraphConnection(config: GraphConfig): Promise<GraphResult> {
  try {
    const token = await getGraphToken(config);
    const res = await fetch(
      `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(config.senderEmail)}?$select=mail,displayName`,
      { headers: { authorization: `Bearer ${token}` }, cache: "no-store" },
    );
    if (!res.ok) {
      const detail = (await res.json().catch(() => null)) as {
        error?: { message?: string };
      } | null;
      return {
        ok: false,
        error: detail?.error?.message ?? `mailbox lookup failed (${res.status})`,
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
    const detail = (await res.json().catch(() => null)) as { error?: { message?: string } } | null;
    return { ok: false, error: detail?.error?.message ?? `sendMail failed (${res.status})` };
  } catch (cause) {
    return { ok: false, error: cause instanceof Error ? cause.message : String(cause) };
  }
}
