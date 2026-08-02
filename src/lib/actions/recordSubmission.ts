import "server-only";

import { createHash } from "node:crypto";

import { supabaseAdmin } from "@/lib/supabase/server";

/**
 * C1 — persist every form submission alongside the existing mail flow.
 * A DB failure must never lose a lead's mail (and vice versa), so this
 * only logs on error and never throws into the action.
 */
export async function recordSubmission(input: {
  form: "contact" | "quote" | "careers";
  payload: object;
  pageSource?: string | undefined;
  ip?: string | undefined;
  turnstileOk: boolean;
}): Promise<string | null> {
  try {
    const ipHash = input.ip
      ? createHash("sha256").update(input.ip).digest("hex").slice(0, 32)
      : null;
    const { data, error } = await supabaseAdmin()
      .from("form_submissions")
      .insert({
        form: input.form,
        payload: input.payload,
        page_source: input.pageSource ?? null,
        ip_hash: ipHash,
        turnstile_ok: input.turnstileOk,
      })
      .select("id")
      .single();
    if (error) throw error;
    return data.id as string;
  } catch (cause) {
    console.error("[recordSubmission] failed:", cause);
    return null;
  }
}

/**
 * Careers: submission row + CV into the private `cv-uploads` bucket + an
 * `applications` row pointing at both. Same never-throw contract.
 */
export async function recordApplication(
  value: {
    fullName?: string;
    name?: string;
    email: string;
    phone?: string;
    cv?: { filename: string; contentType: string; bytes: Buffer | Uint8Array } | null;
  } & object,
  ip: string | undefined,
  turnstileOk: boolean,
): Promise<void> {
  try {
    const db = supabaseAdmin();
    const { cv, ...payload } = value;
    const submissionId = await recordSubmission({
      form: "careers",
      payload: { ...payload, cvFilename: cv?.filename ?? null },
      pageSource: "/careers/",
      ip,
      turnstileOk,
    });

    let cvPath: string | null = null;
    if (cv) {
      const safe = cv.filename.replace(/[^\w.-]+/g, "_").slice(-80);
      cvPath = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}-${safe}`;
      const { error } = await db.storage
        .from("cv-uploads")
        .upload(cvPath, cv.bytes, { contentType: cv.contentType, upsert: false });
      if (error) {
        console.error("[recordApplication] cv upload failed:", error.message);
        cvPath = null;
      }
    }

    const { error } = await db.from("applications").insert({
      submission_id: submissionId,
      name: value.fullName ?? value.name ?? "",
      email: value.email,
      phone: value.phone ?? "",
      cv_storage_path: cvPath,
    });
    if (error) throw error;
  } catch (cause) {
    console.error("[recordApplication] failed:", cause);
  }
}
