import "server-only";

import type { MailAttachment } from "@/lib/mail/types";
import { supabaseAdmin } from "@/lib/supabase/server";

import { sendGraphMail, type GraphConfig } from "./graph";
import { ensureFormSettings, getGraphConfig, getRecipients } from "./settings";
import {
  DEFAULT_AUTO_REPLY_HTML,
  DEFAULT_NOTIFICATION_HTML,
  fieldsTable,
  renderTemplate,
  escapeHtml,
} from "./template";

export interface FormEmailInput {
  formKey: string;
  label?: string;
  payload: Record<string, unknown>;
  /** Submitter address — used for Reply-To and the auto-reply. */
  submitterEmail?: string | undefined;
  submitterName?: string | undefined;
  attachments?: MailAttachment[] | undefined;
}

export interface FormEmailOutcome {
  sent: number;
  failed: number;
  skipped: boolean;
  reason?: string;
}

async function log(entry: {
  formKey: string;
  recipient: string;
  subject: string;
  status: "sent" | "failed";
  kind: "notification" | "auto_reply" | "test";
  error?: string;
  payload?: unknown;
}): Promise<void> {
  await supabaseAdmin()
    .from("email_logs")
    .insert({
      form_key: entry.formKey,
      recipient: entry.recipient,
      subject: entry.subject,
      status: entry.status,
      kind: entry.kind,
      error: entry.error ?? null,
      payload: entry.payload ?? null,
    });
}

/**
 * The single entry point every form uses — existing and future. Reads the
 * form's dashboard configuration, resolves recipients, renders the template,
 * sends through Microsoft Graph, logs every message, and fires the optional
 * auto-reply. Never throws: a mail problem must not fail a submission.
 */
export async function sendFormEmail(input: FormEmailInput): Promise<FormEmailOutcome> {
  try {
    const config = await getGraphConfig();
    if (!config) return { sent: 0, failed: 0, skipped: true, reason: "graph-not-configured" };

    const form = await ensureFormSettings(input.formKey, input.label);
    if (!form.notify_enabled) return { sent: 0, failed: 0, skipped: true, reason: "disabled" };

    const all = await getRecipients();
    const chosen = form.recipient_ids.length
      ? all.filter((r) => r.enabled && form.recipient_ids.includes(r.id))
      : all.filter((r) => r.enabled);
    if (chosen.length === 0) return { sent: 0, failed: 0, skipped: true, reason: "no-recipients" };

    const { data: template } = form.template_id
      ? await supabaseAdmin()
          .from("email_templates")
          .select("*")
          .eq("id", form.template_id)
          .single()
      : { data: null };

    const vars = {
      form_label: form.label,
      date: new Date().toLocaleString("en-GB"),
      fields: fieldsTable(input.payload),
      name: escapeHtml(input.submitterName ?? ""),
      email: escapeHtml(input.submitterEmail ?? ""),
      message: escapeHtml(String(input.payload.message ?? "")),
      logo: template?.logo_url
        ? `<img src="${template.logo_url}" alt="" style="max-height:38px;margin-bottom:10px">`
        : "",
      footer: template?.footer_text ?? "Weiz Technologies",
    };

    const subject = renderTemplate(form.subject || `New ${form.label} submission`, vars);
    const html = renderTemplate(template?.html || DEFAULT_NOTIFICATION_HTML, vars);
    const split = (value: string) =>
      value
        .split(/[,;]/)
        .map((v) => v.trim())
        .filter(Boolean);

    let sent = 0;
    let failed = 0;
    for (const recipient of chosen) {
      const result = await sendGraphMail(config, {
        to: [recipient.email],
        cc: split(form.cc),
        bcc: split(form.bcc),
        subject,
        html,
        ...(form.reply_to || input.submitterEmail
          ? { replyTo: form.reply_to || input.submitterEmail || "" }
          : {}),
        ...(input.attachments?.length ? { attachments: input.attachments } : {}),
      });
      if (result.ok) sent++;
      else failed++;
      await log({
        formKey: input.formKey,
        recipient: recipient.email,
        subject,
        status: result.ok ? "sent" : "failed",
        kind: "notification",
        ...(result.error ? { error: result.error } : {}),
        payload: { to: recipient.email, subject, html },
      });
    }

    if (form.auto_reply_enabled && input.submitterEmail) {
      const arSubject = renderTemplate(form.auto_reply_subject || "We received your message", vars);
      const arHtml = renderTemplate(form.auto_reply_html || DEFAULT_AUTO_REPLY_HTML, vars);
      const result = await sendGraphMail(config, {
        to: [input.submitterEmail],
        subject: arSubject,
        html: arHtml,
      });
      await log({
        formKey: input.formKey,
        recipient: input.submitterEmail,
        subject: arSubject,
        status: result.ok ? "sent" : "failed",
        kind: "auto_reply",
        ...(result.error ? { error: result.error } : {}),
        payload: { to: input.submitterEmail, subject: arSubject, html: arHtml },
      });
    }

    return { sent, failed, skipped: false };
  } catch (cause) {
    console.error("[email] sendFormEmail failed:", cause);
    return {
      sent: 0,
      failed: 0,
      skipped: true,
      reason: cause instanceof Error ? cause.message : "error",
    };
  }
}

/** Direct send used by the dashboard's test buttons and log retries. */
export async function sendDirect(
  config: GraphConfig,
  to: string,
  subject: string,
  html: string,
  formKey = "test",
): Promise<{ ok: boolean; error?: string }> {
  const result = await sendGraphMail(config, { to: [to], subject, html });
  await log({
    formKey,
    recipient: to,
    subject,
    status: result.ok ? "sent" : "failed",
    kind: "test",
    ...(result.error ? { error: result.error } : {}),
    payload: { to, subject, html },
  });
  return result;
}
