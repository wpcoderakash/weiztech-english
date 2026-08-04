"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { rebuildFromForm } from "@/lib/cms/jsonform";
import { currentAdmin, supabaseAdmin } from "@/lib/supabase/server";

const CAN_EDIT = new Set(["super_admin", "admin"]);

/**
 * Settings keys the generic editor must never touch.
 *
 * `admin_slug` has its own action (`saveAdminSlug`) with a super-admin check,
 * a format regex and a reserved-path list. Without this guard an `admin` could
 * open /admin/site/settings/admin_slug directly and rewrite the gate slug
 * through this generic path — bypassing all three protections and either
 * hijacking a public route or locking everyone out of /admin.
 */
const PROTECTED_SETTINGS_KEYS = new Set(["admin_slug"]);

/** Navigation menus and global settings — one editor, two tables. */
export async function saveSiteEntry(
  kind: "navigation" | "settings",
  key: string,
  formData: FormData,
): Promise<void> {
  const admin = await currentAdmin();
  if (!admin || !CAN_EDIT.has(admin.role)) return;
  if (kind === "settings" && PROTECTED_SETTINGS_KEYS.has(key)) {
    console.warn(`[site] blocked generic edit of protected setting "${key}" by ${admin.email}`);
    return;
  }

  const db = supabaseAdmin();
  const table = kind === "navigation" ? "navigation_menus" : "settings";
  const column = kind === "navigation" ? "items" : "value";
  const { data: row } = await db.from(table).select(column).eq("key", key).single();
  if (!row) return;

  const next = rebuildFromForm((row as Record<string, unknown>)[column], "", formData);
  const { error } = await db
    .from(table)
    .update({ [column]: next, updated_at: new Date().toISOString() })
    .eq("key", key);
  if (error) {
    console.error(`[site] ${table}.${key} save failed: ${error.message}`);
    return;
  }
  await db.from("activity_log").insert({
    actor_id: admin.userId,
    action: `${kind}.update`,
    entity: table,
    entity_id: key,
  });
  revalidateTag("site", "max");
  revalidatePath(`/admin/site/${kind}/${key}`);
}

/* ---- Hidden admin entry URL (dashboard-configurable) ---- */

const RESERVED_SLUGS = new Set([
  "admin",
  "api",
  "gate",
  "blog",
  "products",
  "software",
  "webapps",
  "cybersec",
  "careers",
  "contact-us",
  "quote",
  "privacy-policy",
  "images",
  "fonts",
]);

export interface AdminSlugState {
  message: string | null;
  ok: boolean;
}

export async function saveAdminSlug(
  _prev: AdminSlugState,
  formData: FormData,
): Promise<AdminSlugState> {
  const admin = await currentAdmin();
  if (!admin || admin.role !== "super_admin") {
    return { message: "Only a super admin can change the admin URL.", ok: false };
  }
  const slug = String(formData.get("slug") ?? "")
    .trim()
    .toLowerCase();
  if (!/^[a-z0-9][a-z0-9-]{2,39}$/.test(slug)) {
    return { message: "Use 3–40 lowercase letters, numbers or dashes.", ok: false };
  }
  if (RESERVED_SLUGS.has(slug)) {
    return { message: "That path is used by the website — pick another.", ok: false };
  }
  const db = supabaseAdmin();
  const { data: post } = await db.from("posts").select("id").eq("slug", slug).maybeSingle();
  if (post) return { message: "That path is a blog post — pick another.", ok: false };

  await db.from("settings").upsert({ key: "admin_slug", value: { slug } });
  await db.from("activity_log").insert({
    actor_id: admin.userId,
    action: "settings.admin_slug",
    entity: "settings",
    entity_id: "admin_slug",
  });
  revalidatePath("/admin/site");
  return {
    message: `Saved. Your admin entry URL is now /${slug} (live within ~30 seconds; every browser must enter through it again).`,
    ok: true,
  };
}
