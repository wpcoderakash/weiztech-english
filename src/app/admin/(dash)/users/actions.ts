"use server";

import { revalidatePath } from "next/cache";

import { randomBytes } from "node:crypto";

import { currentAdmin, supabaseAdmin, type AppRole } from "@/lib/supabase/server";

const ROLES: AppRole[] = ["super_admin", "admin", "editor", "content_manager", "author", "viewer"];

/* Bound Server Action args are client-supplied — a malformed id would
   otherwise produce a no-op update plus a misleading audit row. */
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export interface InviteState {
  message: string | null;
  password: string | null;
}

/** Only super admins manage users; admins may look. */
export async function inviteUser(_prev: InviteState, formData: FormData): Promise<InviteState> {
  const admin = await currentAdmin();
  if (!admin || admin.role !== "super_admin") {
    return { message: "Only a super admin can invite users.", password: null };
  }
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const name = String(formData.get("name") ?? "")
    .trim()
    .slice(0, 80);
  const role = String(formData.get("role") ?? "viewer") as AppRole;
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
    return { message: "Invalid email.", password: null };
  if (!ROLES.includes(role)) {
    return { message: "Pick a valid role.", password: null };
  }

  /* Manual password if provided (min 8 chars); otherwise a generated
     one-time password shown exactly once. */
  const manual = String(formData.get("password") ?? "").trim();
  if (manual && manual.length < 8) {
    return {
      message: "Password must be at least 8 characters (or leave empty to auto-generate).",
      password: null,
    };
  }
  const password = manual || randomBytes(9).toString("base64url");
  const db = supabaseAdmin();
  const { data, error } = await db.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) {
    /* Do not forward GoTrue's text: "User already registered" turns this form
       into an account-enumeration oracle. Log the detail, return a generic. */
    console.error(`[users] createUser failed for ${email}: ${error.message}`);
    return {
      message: "Could not create that user. Check the address and try again.",
      password: null,
    };
  }

  const { error: profileError } = await db
    .from("profiles")
    .insert({ user_id: data.user.id, name, role });
  if (profileError) {
    /* Without the profile row currentAdmin() rejects the account, leaving a
       credentialed ghost nobody can see or delete from the UI. Roll back. */
    console.error(`[users] profile insert failed for ${email}: ${profileError.message}`);
    await db.auth.admin.deleteUser(data.user.id);
    return { message: "Could not create that user. Please try again.", password: null };
  }
  await db.from("activity_log").insert({
    actor_id: admin.userId,
    action: "user.invite",
    entity: "profiles",
    entity_id: data.user.id,
    diff: { email, role },
  });
  revalidatePath("/admin/users");
  return manual
    ? {
        message: `${email} created as ${role.replace("_", " ")} with the password you set.`,
        password: null,
      }
    : {
        message: `${email} created as ${role.replace("_", " ")}. Share the one-time password now — it is not shown again:`,
        password,
      };
}

export async function setRole(userId: string, formData: FormData): Promise<void> {
  const admin = await currentAdmin();
  if (!admin || admin.role !== "super_admin" || userId === admin.userId) return;
  if (!UUID.test(userId)) return;
  const role = String(formData.get("role") ?? "") as AppRole;
  if (!ROLES.includes(role)) return;

  const db = supabaseAdmin();
  /* A super admin is not demotable, exactly as they are not deletable below.
     Server Actions are callable with arbitrary bound args, so the UI hiding
     this form is not the control — this check is. Without it the two paths
     disagree: delete refuses, demote succeeds, and since a super admin cannot
     change their own role there is no way back. */
  const { data: target } = await db.from("profiles").select("role").eq("user_id", userId).single();
  if (!target) return;
  if (target.role === "super_admin") {
    console.warn(`[users] blocked demotion of super_admin ${userId} by ${admin.email}`);
    return;
  }

  const { error } = await db.from("profiles").update({ role }).eq("user_id", userId);
  if (error) {
    console.error(`[users] set role failed for ${userId}: ${error.message}`);
    return;
  }
  await db.from("activity_log").insert({
    actor_id: admin.userId,
    action: "user.set_role",
    entity: "profiles",
    entity_id: userId,
    diff: { role },
  });
  revalidatePath("/admin/users");
}

export async function removeUser(userId: string): Promise<void> {
  const admin = await currentAdmin();
  if (!admin || admin.role !== "super_admin" || userId === admin.userId) return;
  if (!UUID.test(userId)) return;

  const db = supabaseAdmin();
  const { data: target } = await db.from("profiles").select("role").eq("user_id", userId).single();
  if (!target) return;
  if (target.role === "super_admin") return;

  const { error } = await db.auth.admin.deleteUser(userId);
  if (error) {
    /* Before the FK fix in migration 0003 this always failed for any user who
       had ever acted, and the failure was swallowed — the account stayed live
       while the UI reported nothing. Never fail silently here. */
    console.error(`[users] delete failed for ${userId}: ${error.message}`);
    return;
  }
  await db.from("activity_log").insert({
    actor_id: admin.userId,
    action: "user.remove",
    entity: "profiles",
    entity_id: userId,
  });
  revalidatePath("/admin/users");
}
