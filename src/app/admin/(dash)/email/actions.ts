"use server";

import { revalidatePath } from "next/cache";

import { encryptSecret } from "@/lib/email/crypto";
import { decryptSecret } from "@/lib/email/crypto";
import { testGraphConnection, type GraphConfig } from "@/lib/email/graph";
import { sendDirect } from "@/lib/email/send";
import { getEmailSettings, getGraphConfig } from "@/lib/email/settings";
import { currentAdmin, supabaseAdmin } from "@/lib/supabase/server";

async function requireSuperAdmin() {
  const admin = await currentAdmin();
  return admin && admin.role === "super_admin" ? admin : null;
}

async function audit(action: string, entity: string, entityId?: string, diff?: unknown) {
  const admin = await currentAdmin();
  await supabaseAdmin()
    .from("activity_log")
    .insert({
      actor_id: admin?.userId ?? null,
      action,
      entity,
      entity_id: entityId ?? null,
      diff: diff ?? null,
    });
}

export interface ActionState {
  message: string | null;
  ok: boolean;
}

/* ---------------- Graph configuration ---------------- */

export async function saveGraphSettings(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await requireSuperAdmin())) return { message: "Super admin only.", ok: false };

  const senderEmail = String(formData.get("sender_email") ?? "").trim();
  const tenantId = String(formData.get("tenant_id") ?? "").trim();
  const clientId = String(formData.get("client_id") ?? "").trim();
  const clientSecret = String(formData.get("client_secret") ?? "").trim();
  const enabled = formData.get("enabled") === "on";

  const update: Record<string, unknown> = {
    sender_email: senderEmail,
    tenant_id: tenantId,
    client_id: clientId,
    enabled,
    updated_at: new Date().toISOString(),
  };
  /* Empty secret = keep the stored one (the field shows a mask, not the value). */
  if (clientSecret) update.client_secret_enc = encryptSecret(clientSecret);

  const { error } = await supabaseAdmin().from("email_settings").update(update).eq("id", true);
  if (error) return { message: error.message, ok: false };

  await audit("email.settings_saved", "email_settings", "singleton", {
    sender: senderEmail,
    secretChanged: Boolean(clientSecret),
  });
  revalidatePath("/admin/email");
  return { message: "Settings saved.", ok: true };
}

export async function testConnection(_prev: ActionState, _fd: FormData): Promise<ActionState> {
  if (!(await requireSuperAdmin())) return { message: "Super admin only.", ok: false };

  const row = await getEmailSettings();
  if (!row?.client_secret_enc || !row.tenant_id || !row.client_id || !row.sender_email) {
    return { message: "Fill in all four fields and save first.", ok: false };
  }
  let config: GraphConfig;
  try {
    config = {
      tenantId: row.tenant_id,
      clientId: row.client_id,
      clientSecret: decryptSecret(row.client_secret_enc),
      senderEmail: row.sender_email,
    };
  } catch {
    return { message: "Stored secret could not be decrypted — re-enter it.", ok: false };
  }

  const result = await testGraphConnection(config);
  await supabaseAdmin()
    .from("email_settings")
    .update({
      last_test_at: new Date().toISOString(),
      last_test_ok: result.ok,
      last_test_error: result.error ?? null,
    })
    .eq("id", true);
  await audit("email.connection_test", "email_settings", "singleton", { ok: result.ok });
  revalidatePath("/admin/email");
  return result.ok
    ? { message: "Connected to Microsoft Graph — mailbox reachable.", ok: true }
    : { message: `Failed: ${result.error}`, ok: false };
}

export async function sendTestEmail(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!(await requireSuperAdmin())) return { message: "Super admin only.", ok: false };
  const to = String(formData.get("to") ?? "").trim();
  if (!to) return { message: "Enter a destination address.", ok: false };

  const config = await getGraphConfig();
  if (!config) return { message: "Graph is not configured or not enabled.", ok: false };

  const result = await sendDirect(
    config,
    to,
    "WeizTech test email",
    `<div style="font-family:Arial,sans-serif;padding:20px">
       <h2 style="color:#7f16e9;margin:0 0 8px">Microsoft Graph is working</h2>
       <p style="color:#333">Sent from the WeizTech dashboard at ${new Date().toLocaleString("en-GB")}.</p>
     </div>`,
  );
  revalidatePath("/admin/email");
  return result.ok
    ? { message: `Test email sent to ${to}.`, ok: true }
    : { message: `Send failed: ${result.error}`, ok: false };
}

/* ---------------- Recipients ---------------- */

export async function addRecipient(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!(await requireSuperAdmin())) return { message: "Super admin only.", ok: false };
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const name = String(formData.get("name") ?? "").trim();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { message: "Invalid email.", ok: false };

  const { data: last } = await supabaseAdmin()
    .from("email_recipients")
    .select("sort")
    .order("sort", { ascending: false })
    .limit(1)
    .maybeSingle();
  const { error } = await supabaseAdmin()
    .from("email_recipients")
    .insert({ email, name, sort: (last?.sort ?? -1) + 1 });
  if (error) return { message: error.message, ok: false };
  await audit("email.recipient_added", "email_recipients", email);
  revalidatePath("/admin/email");
  return { message: `${email} added.`, ok: true };
}

export async function updateRecipient(id: string, formData: FormData): Promise<void> {
  if (!(await requireSuperAdmin())) return;
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const name = String(formData.get("name") ?? "").trim();
  if (!email) return;
  await supabaseAdmin().from("email_recipients").update({ email, name }).eq("id", id);
  await audit("email.recipient_updated", "email_recipients", id);
  revalidatePath("/admin/email");
}

export async function toggleRecipient(id: string): Promise<void> {
  if (!(await requireSuperAdmin())) return;
  const db = supabaseAdmin();
  const { data } = await db.from("email_recipients").select("enabled").eq("id", id).single();
  if (!data) return;
  await db.from("email_recipients").update({ enabled: !data.enabled }).eq("id", id);
  await audit("email.recipient_toggled", "email_recipients", id);
  revalidatePath("/admin/email");
}

export async function deleteRecipient(id: string): Promise<void> {
  if (!(await requireSuperAdmin())) return;
  await supabaseAdmin().from("email_recipients").delete().eq("id", id);
  await audit("email.recipient_deleted", "email_recipients", id);
  revalidatePath("/admin/email");
}

export async function setPrimaryRecipient(id: string): Promise<void> {
  if (!(await requireSuperAdmin())) return;
  const db = supabaseAdmin();
  await db.from("email_recipients").update({ is_primary: false }).neq("id", id);
  await db.from("email_recipients").update({ is_primary: true, enabled: true }).eq("id", id);
  await audit("email.primary_set", "email_recipients", id);
  revalidatePath("/admin/email");
}

/** Drag & drop order: the client posts the full id order. */
export async function reorderRecipients(ids: string[]): Promise<void> {
  if (!(await requireSuperAdmin())) return;
  const db = supabaseAdmin();
  await Promise.all(
    ids.map((id, index) => db.from("email_recipients").update({ sort: index }).eq("id", id)),
  );
  await audit("email.recipients_reordered", "email_recipients", undefined, { order: ids });
  revalidatePath("/admin/email");
}

export async function testRecipient(id: string): Promise<void> {
  if (!(await requireSuperAdmin())) return;
  const { data } = await supabaseAdmin()
    .from("email_recipients")
    .select("email")
    .eq("id", id)
    .single();
  const config = await getGraphConfig();
  if (!data || !config) return;
  await sendDirect(
    config,
    data.email,
    "WeizTech recipient test",
    `<div style="font-family:Arial,sans-serif;padding:20px">
       <h2 style="color:#7f16e9;margin:0 0 8px">You are receiving WeizTech notifications</h2>
       <p style="color:#333">This confirms ${data.email} is wired up correctly.</p>
     </div>`,
  );
  revalidatePath("/admin/email");
}

/* ---------------- Per-form settings ---------------- */

export async function saveFormSettings(
  formKey: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await requireSuperAdmin())) return { message: "Super admin only.", ok: false };

  const recipientIds = formData.getAll("recipient_ids").map(String);
  const { error } = await supabaseAdmin()
    .from("form_email_settings")
    .update({
      notify_enabled: formData.get("notify_enabled") === "on",
      recipient_ids: recipientIds,
      subject: String(formData.get("subject") ?? "").slice(0, 200),
      reply_to: String(formData.get("reply_to") ?? "").slice(0, 200),
      cc: String(formData.get("cc") ?? "").slice(0, 400),
      bcc: String(formData.get("bcc") ?? "").slice(0, 400),
      auto_reply_enabled: formData.get("auto_reply_enabled") === "on",
      auto_reply_subject: String(formData.get("auto_reply_subject") ?? "").slice(0, 200),
      auto_reply_html: String(formData.get("auto_reply_html") ?? "").slice(0, 20000),
      updated_at: new Date().toISOString(),
    })
    .eq("form_key", formKey);

  if (error) return { message: error.message, ok: false };

  await audit("email.form_settings_saved", "form_email_settings", formKey);
  revalidatePath("/admin/email");
  return { message: `${formKey} settings saved.`, ok: true };
}

/* ---------------- Templates ---------------- */

export async function saveTemplate(id: string | null, formData: FormData): Promise<void> {
  if (!(await requireSuperAdmin())) return;
  const row = {
    key: String(formData.get("key") ?? "notification").trim(),
    name: String(formData.get("name") ?? "Notification").trim(),
    subject: String(formData.get("subject") ?? "").slice(0, 200),
    html: String(formData.get("html") ?? "").slice(0, 50000),
    logo_url: String(formData.get("logo_url") ?? "").slice(0, 500),
    footer_text: String(formData.get("footer_text") ?? "").slice(0, 500),
    updated_at: new Date().toISOString(),
  };
  const db = supabaseAdmin();
  if (id) await db.from("email_templates").update(row).eq("id", id);
  else await db.from("email_templates").insert(row);
  await audit("email.template_saved", "email_templates", id ?? row.key);
  revalidatePath("/admin/email");
}

/* ---------------- Logs ---------------- */

export async function retryEmail(logId: string): Promise<void> {
  if (!(await requireSuperAdmin())) return;
  const db = supabaseAdmin();
  const { data: entry } = await db.from("email_logs").select("*").eq("id", logId).single();
  const config = await getGraphConfig();
  if (!entry || !config) return;
  const payload = entry.payload as { to?: string; subject?: string; html?: string } | null;
  if (!payload?.to) return;
  await sendDirect(
    config,
    payload.to,
    payload.subject ?? entry.subject,
    payload.html ?? "",
    entry.form_key,
  );
  await audit("email.retry", "email_logs", logId);
  revalidatePath("/admin/email");
}
