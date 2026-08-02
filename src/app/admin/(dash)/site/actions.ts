"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { rebuildFromForm } from "@/lib/cms/jsonform";
import { currentAdmin, supabaseAdmin } from "@/lib/supabase/server";

const CAN_EDIT = new Set(["super_admin", "admin"]);

/** Navigation menus and global settings — one editor, two tables. */
export async function saveSiteEntry(
  kind: "navigation" | "settings",
  key: string,
  formData: FormData,
): Promise<void> {
  const admin = await currentAdmin();
  if (!admin || !CAN_EDIT.has(admin.role)) return;

  const db = supabaseAdmin();
  const table = kind === "navigation" ? "navigation_menus" : "settings";
  const column = kind === "navigation" ? "items" : "value";
  const { data: row } = await db.from(table).select(column).eq("key", key).single();
  if (!row) return;

  const next = rebuildFromForm((row as Record<string, unknown>)[column], "", formData);
  await db
    .from(table)
    .update({ [column]: next, updated_at: new Date().toISOString() })
    .eq("key", key);
  await db.from("activity_log").insert({
    actor_id: admin.userId,
    action: `${kind}.update`,
    entity: table,
    entity_id: key,
  });
  revalidateTag("site", "max");
  revalidatePath(`/admin/site/${kind}/${key}`);
}
