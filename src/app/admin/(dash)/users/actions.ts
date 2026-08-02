"use server";

import { randomBytes } from "node:crypto";

import { revalidatePath } from "next/cache";

import { currentAdmin, supabaseAdmin, type AppRole } from "@/lib/supabase/server";

const ROLES: AppRole[] = ["super_admin", "admin", "editor", "content_manager", "author", "viewer"];

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
  if (error) return { message: `Could not create user: ${error.message}`, password: null };

  await db.from("profiles").insert({ user_id: data.user.id, name, role });
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
  const role = String(formData.get("role") ?? "") as AppRole;
  if (!ROLES.includes(role)) return;

  const db = supabaseAdmin();
  await db.from("profiles").update({ role }).eq("user_id", userId);
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

  const db = supabaseAdmin();
  const { data: target } = await db.from("profiles").select("role").eq("user_id", userId).single();
  if (target?.role === "super_admin") return;

  await db.auth.admin.deleteUser(userId);
  await db.from("activity_log").insert({
    actor_id: admin.userId,
    action: "user.remove",
    entity: "profiles",
    entity_id: userId,
  });
  revalidatePath("/admin/users");
}
