"use server";

import { revalidatePath } from "next/cache";

import { currentAdmin, mfaState, supabaseAuth, supabaseAdmin } from "@/lib/supabase/server";

export interface EnrollState {
  qrSvg: string | null;
  secret: string | null;
  factorId: string | null;
  message: string | null;
  done: boolean;
}

export async function startEnroll(_prev: EnrollState, _formData: FormData): Promise<EnrollState> {
  const admin = await currentAdmin();
  if (!admin)
    return { qrSvg: null, secret: null, factorId: null, message: "Not signed in.", done: false };

  const auth = await supabaseAuth();
  /* Remove stale unverified factors from abandoned attempts. */
  const { data: factors } = await auth.auth.mfa.listFactors();
  for (const f of factors?.totp ?? []) {
    if (f.status !== "verified") await auth.auth.mfa.unenroll({ factorId: f.id });
  }

  const { data, error } = await auth.auth.mfa.enroll({
    factorType: "totp",
    friendlyName: "Google Authenticator",
  });
  if (error || !data) {
    return {
      qrSvg: null,
      secret: null,
      factorId: null,
      message: error?.message ?? "Failed.",
      done: false,
    };
  }
  return {
    qrSvg: data.totp.qr_code,
    secret: data.totp.secret,
    factorId: data.id,
    message: null,
    done: false,
  };
}

export async function confirmEnroll(prev: EnrollState, formData: FormData): Promise<EnrollState> {
  const admin = await currentAdmin();
  const factorId = String(formData.get("factorId") ?? prev.factorId ?? "");
  const code = String(formData.get("code") ?? "").replace(/\s+/g, "");
  if (!admin || !factorId) return { ...prev, message: "Session expired — reload." };
  if (!/^\d{6}$/.test(code)) return { ...prev, factorId, message: "Enter the 6-digit code." };

  const auth = await supabaseAuth();
  const { data: challenge, error: cErr } = await auth.auth.mfa.challenge({ factorId });
  if (cErr || !challenge) return { ...prev, factorId, message: "Could not verify — try again." };
  const { error } = await auth.auth.mfa.verify({ factorId, challengeId: challenge.id, code });
  if (error) return { ...prev, factorId, message: "Wrong code — scan again and retry." };

  await supabaseAdmin().from("activity_log").insert({
    actor_id: admin.userId,
    action: "security.2fa_enabled",
    entity: "profiles",
    entity_id: admin.userId,
  });
  revalidatePath("/admin/security");
  return { qrSvg: null, secret: null, factorId: null, message: null, done: true };
}

export async function disable2fa(formData: FormData): Promise<void> {
  const admin = await currentAdmin();
  const code = String(formData.get("code") ?? "").replace(/\s+/g, "");
  if (!admin || !/^\d{6}$/.test(code)) return;

  const auth = await supabaseAuth();
  const mfa = await mfaState();
  if (!mfa.factorId) return;
  /* Require a fresh code before disabling — prevents drive-by removal. */
  const { data: challenge } = await auth.auth.mfa.challenge({ factorId: mfa.factorId });
  if (!challenge) return;
  const { error } = await auth.auth.mfa.verify({
    factorId: mfa.factorId,
    challengeId: challenge.id,
    code,
  });
  if (error) return;
  await auth.auth.mfa.unenroll({ factorId: mfa.factorId });
  await supabaseAdmin().from("activity_log").insert({
    actor_id: admin.userId,
    action: "security.2fa_disabled",
    entity: "profiles",
    entity_id: admin.userId,
  });
  revalidatePath("/admin/security");
}

/* ---- My profile: display name + password change ---- */

export interface ProfileState {
  message: string | null;
  ok: boolean;
}

export async function updateProfile(
  _prev: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const admin = await currentAdmin();
  if (!admin) return { message: "Not signed in.", ok: false };

  const name = String(formData.get("name") ?? "")
    .trim()
    .slice(0, 80);
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (password || confirm) {
    if (password.length < 8)
      return { message: "Password must be at least 8 characters.", ok: false };
    if (password !== confirm) return { message: "Passwords do not match.", ok: false };
    const auth = await supabaseAuth();
    const { error } = await auth.auth.updateUser({ password });
    if (error) return { message: `Could not change password: ${error.message}`, ok: false };
  }

  if (name) {
    await supabaseAdmin().from("profiles").update({ name }).eq("user_id", admin.userId);
  }

  await supabaseAdmin()
    .from("activity_log")
    .insert({
      actor_id: admin.userId,
      action: password ? "profile.password_changed" : "profile.updated",
      entity: "profiles",
      entity_id: admin.userId,
    });
  revalidatePath("/admin/security");
  return { message: password ? "Password changed." : "Profile saved.", ok: true };
}
