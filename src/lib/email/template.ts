import "server-only";

/**
 * Template rendering: {{variable}} substitution plus a default responsive
 * shell so a fresh install sends something presentable before anyone edits
 * a template.
 */
export type TemplateVars = Record<string, string>;

export function renderTemplate(template: string, vars: TemplateVars): string {
  return template.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_m, key: string) => vars[key] ?? "");
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/** Submission fields as an HTML table — the {{fields}} variable. */
export function fieldsTable(payload: Record<string, unknown>): string {
  const rows = Object.entries(payload)
    .filter(([, v]) => v !== null && v !== undefined && String(v).trim() !== "")
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px;color:#666;white-space:nowrap;vertical-align:top">${escapeHtml(
          k.replace(/([a-z])([A-Z])/g, "$1 $2"),
        )}</td><td style="padding:6px 12px;color:#111">${escapeHtml(String(v)).replaceAll("\n", "<br>")}</td></tr>`,
    )
    .join("");
  return `<table style="border-collapse:collapse;font-size:14px;font-family:Arial,sans-serif">${rows}</table>`;
}

export const DEFAULT_NOTIFICATION_HTML = `<div style="font-family:Arial,sans-serif;background:#f6f6f9;padding:24px">
  <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e6e6ef">
    <div style="background:#7f16e9;padding:18px 24px">
      {{logo}}
      <div style="color:#fff;font-size:18px;font-weight:700">{{form_label}}</div>
    </div>
    <div style="padding:24px">
      <p style="margin:0 0 16px;color:#333;font-size:14px">A new submission arrived on {{date}}.</p>
      {{fields}}
    </div>
    <div style="padding:16px 24px;border-top:1px solid #eee;color:#888;font-size:12px">{{footer}}</div>
  </div>
</div>`;

export const DEFAULT_AUTO_REPLY_HTML = `<div style="font-family:Arial,sans-serif;background:#f6f6f9;padding:24px">
  <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e6e6ef">
    <div style="background:#7f16e9;padding:18px 24px">{{logo}}</div>
    <div style="padding:24px;color:#333;font-size:14px;line-height:1.6">
      <p>Hi {{name}},</p>
      <p>Thank you for contacting Weiz Technologies. We have received your message and will reply shortly.</p>
      <p style="color:#666">Your message:<br><em>{{message}}</em></p>
    </div>
    <div style="padding:16px 24px;border-top:1px solid #eee;color:#888;font-size:12px">{{footer}}</div>
  </div>
</div>`;
