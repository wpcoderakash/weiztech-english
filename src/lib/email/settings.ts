import "server-only";

import { supabaseAdmin } from "@/lib/supabase/server";

import { decryptSecret } from "./crypto";
import type { GraphConfig } from "./graph";

export interface EmailSettingsRow {
  sender_email: string;
  tenant_id: string;
  client_id: string;
  client_secret_enc: string | null;
  enabled: boolean;
  last_test_at: string | null;
  last_test_ok: boolean | null;
  last_test_error: string | null;
}

export interface RecipientRow {
  id: string;
  email: string;
  name: string;
  enabled: boolean;
  is_primary: boolean;
  sort: number;
}

export interface FormSettingsRow {
  form_key: string;
  label: string;
  notify_enabled: boolean;
  recipient_ids: string[];
  subject: string;
  reply_to: string;
  cc: string;
  bcc: string;
  template_id: string | null;
  auto_reply_enabled: boolean;
  auto_reply_subject: string;
  auto_reply_html: string;
}

export async function getEmailSettings(): Promise<EmailSettingsRow | null> {
  const { data } = await supabaseAdmin().from("email_settings").select("*").eq("id", true).single();
  return (data as EmailSettingsRow) ?? null;
}

/** Decrypted Graph config, or null when incomplete/disabled. */
export async function getGraphConfig(): Promise<GraphConfig | null> {
  const row = await getEmailSettings();
  if (!row || !row.enabled) return null;
  if (!row.tenant_id || !row.client_id || !row.client_secret_enc || !row.sender_email) return null;
  try {
    return {
      tenantId: row.tenant_id,
      clientId: row.client_id,
      clientSecret: decryptSecret(row.client_secret_enc),
      senderEmail: row.sender_email,
    };
  } catch (cause) {
    console.error("[email] could not decrypt client secret:", cause);
    return null;
  }
}

export async function getRecipients(): Promise<RecipientRow[]> {
  const { data } = await supabaseAdmin()
    .from("email_recipients")
    .select("*")
    .order("sort", { ascending: true });
  return (data as RecipientRow[]) ?? [];
}

export async function getFormSettings(formKey: string): Promise<FormSettingsRow | null> {
  const { data } = await supabaseAdmin()
    .from("form_email_settings")
    .select("*")
    .eq("form_key", formKey)
    .maybeSingle();
  return (data as FormSettingsRow) ?? null;
}

/**
 * Any form key not yet configured gets a row automatically — future CMS forms
 * work with zero development.
 */
export async function ensureFormSettings(
  formKey: string,
  label?: string,
): Promise<FormSettingsRow> {
  const existing = await getFormSettings(formKey);
  if (existing) return existing;
  const { data } = await supabaseAdmin()
    .from("form_email_settings")
    .insert({
      form_key: formKey,
      label: label ?? formKey,
      subject: `New ${label ?? formKey} submission`,
    })
    .select("*")
    .single();
  return data as FormSettingsRow;
}
