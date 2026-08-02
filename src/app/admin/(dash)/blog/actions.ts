"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { currentAdmin, supabaseAdmin } from "@/lib/supabase/server";

const CAN_EDIT = new Set(["super_admin", "admin", "editor", "content_manager"]);
const CAN_PUBLISH = new Set(["super_admin", "admin", "editor"]);

export async function setPostStatus(id: string, status: "published" | "draft"): Promise<void> {
  const admin = await currentAdmin();
  if (!admin || !CAN_PUBLISH.has(admin.role)) return;

  const db = supabaseAdmin();
  await db.from("posts").update({ status }).eq("id", id);
  await db.from("activity_log").insert({
    actor_id: admin.userId,
    action: `post.${status}`,
    entity: "posts",
    entity_id: id,
  });
  revalidateTag("posts", "max");
  revalidatePath("/admin/blog");
}

export async function updatePostMeta(id: string, formData: FormData): Promise<void> {
  const admin = await currentAdmin();
  if (!admin || !CAN_EDIT.has(admin.role)) return;

  const title = String(formData.get("title") ?? "")
    .trim()
    .slice(0, 200);
  const excerpt = String(formData.get("excerpt") ?? "")
    .trim()
    .slice(0, 500);
  if (!title) return;

  const db = supabaseAdmin();
  /* `body` carries the verbatim Post object the frontend renders — keep the
     columns and the body copy in lockstep. */
  const { data: row } = await db.from("posts").select("body").eq("id", id).single();
  if (!row) return;
  const body = { ...(row.body as object), title, excerpt };
  await db.from("posts").update({ title, excerpt, body }).eq("id", id);
  await db.from("activity_log").insert({
    actor_id: admin.userId,
    action: "post.update_meta",
    entity: "posts",
    entity_id: id,
  });
  revalidateTag("posts", "max");
  revalidatePath("/admin/blog");
}
