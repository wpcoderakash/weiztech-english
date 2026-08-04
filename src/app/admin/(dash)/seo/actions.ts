"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { currentAdmin, supabaseAdmin } from "@/lib/supabase/server";

import type { EditorState } from "../pages/editor-state";

const CAN_EDIT = new Set(["super_admin", "admin", "editor"]);

function done(ok: boolean, message: string): EditorState {
  return { ok, message, at: Date.now() };
}

export async function saveSeo(
  slug: string,
  _prev: EditorState,
  formData: FormData,
): Promise<EditorState> {
  const admin = await currentAdmin();
  if (!admin || !CAN_EDIT.has(admin.role)) {
    return done(false, "You do not have permission to change SEO settings.");
  }

  const title = String(formData.get("title") ?? "")
    .trim()
    .slice(0, 120);
  const description = String(formData.get("description") ?? "")
    .trim()
    .slice(0, 300);
  const seo: Record<string, string> = {};
  if (title) seo.title = title;
  if (description) seo.description = description;

  const { error, count } = await supabaseAdmin()
    .from("pages")
    .update({ seo }, { count: "exact" })
    .eq("slug", slug);
  if (error) {
    console.error(`[seo] save failed for ${slug}: ${error.message}`);
    return done(false, "Could not save — try again.");
  }
  if (count === 0) return done(false, `No page found for "${slug}".`);
  await supabaseAdmin().from("activity_log").insert({
    actor_id: admin.userId,
    action: "seo.update",
    entity: "pages",
    entity_id: slug,
  });
  revalidateTag(`page:${slug}`, "max");
  revalidatePath("/admin/seo");
  return done(true, "Saved and live.");
}
