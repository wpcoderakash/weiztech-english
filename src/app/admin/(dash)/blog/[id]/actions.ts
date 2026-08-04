"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { isBlockArray } from "@/lib/cms/blocks";
import { currentAdmin, supabaseAdmin } from "@/lib/supabase/server";
import type { Post } from "@/types/content";

import type { EditorState } from "../../pages/editor-state";

const CAN_EDIT = new Set(["super_admin", "admin", "editor", "content_manager", "author"]);

function done(ok: boolean, message: string): EditorState {
  return { ok, message, at: Date.now() };
}

export async function savePostBody(
  id: string,
  _prev: EditorState,
  formData: FormData,
): Promise<EditorState> {
  const admin = await currentAdmin();
  if (!admin || !CAN_EDIT.has(admin.role)) {
    return done(false, "You do not have permission to edit posts.");
  }

  const title = String(formData.get("title") ?? "")
    .trim()
    .slice(0, 200);
  const excerpt = String(formData.get("excerpt") ?? "")
    .trim()
    .slice(0, 500);
  let blocks: unknown;
  try {
    blocks = JSON.parse(String(formData.get("blocks") ?? "[]"));
  } catch {
    return done(false, "The post content could not be read. Reload the page and try again.");
  }
  if (!title) return done(false, "A title is required.");
  if (!isBlockArray(blocks)) {
    return done(false, "The post content is empty or malformed — nothing was saved.");
  }

  const db = supabaseAdmin();
  const { data: row } = await db.from("posts").select("body").eq("id", id).single();
  if (!row) return done(false, "That post no longer exists.");
  const body = { ...(row.body as Post), title, excerpt, blocks };

  const { error } = await db.from("posts").update({ title, excerpt, body }).eq("id", id);
  if (error) {
    console.error(`[blog] save failed for ${id}: ${error.message}`);
    return done(false, "Could not save. Your text is still on screen — try again.");
  }
  await db.from("activity_log").insert({
    actor_id: admin.userId,
    action: "post.update_body",
    entity: "posts",
    entity_id: id,
  });
  revalidateTag("posts", "max");
  revalidatePath("/admin/blog");
  return done(true, "Published. The post is live.");
}
