"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { isBlockArray } from "@/lib/cms/blocks";
import { currentAdmin, supabaseAdmin } from "@/lib/supabase/server";
import type { Post } from "@/types/content";

const CAN_EDIT = new Set(["super_admin", "admin", "editor", "content_manager", "author"]);

export async function savePostBody(id: string, formData: FormData): Promise<void> {
  const admin = await currentAdmin();
  if (!admin || !CAN_EDIT.has(admin.role)) return;

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
    return;
  }
  if (!title || !isBlockArray(blocks)) return;

  const db = supabaseAdmin();
  const { data: row } = await db.from("posts").select("body").eq("id", id).single();
  if (!row) return;
  const body = { ...(row.body as Post), title, excerpt, blocks };

  await db.from("posts").update({ title, excerpt, body }).eq("id", id);
  await db.from("activity_log").insert({
    actor_id: admin.userId,
    action: "post.update_body",
    entity: "posts",
    entity_id: id,
  });
  revalidateTag("posts", "max");
  revalidatePath("/admin/blog");
}
