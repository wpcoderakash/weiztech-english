"use server";

import { revalidatePath } from "next/cache";

import { currentAdmin, supabaseAdmin } from "@/lib/supabase/server";

const CAN_UPLOAD = new Set(["super_admin", "admin", "editor", "content_manager", "author"]);
const CAN_DELETE = new Set(["super_admin", "admin"]);

const ALLOWED = new Map<string, string>([
  ["image/png", "png"],
  ["image/jpeg", "jpg"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
  ["image/svg+xml", "svg"],
  ["video/mp4", "mp4"],
]);
const MAX_BYTES = 10 * 1024 * 1024;

export async function uploadMedia(formData: FormData): Promise<void> {
  const admin = await currentAdmin();
  if (!admin || !CAN_UPLOAD.has(admin.role)) return;

  const file = formData.get("file");
  const folder = String(formData.get("folder") ?? "")
    .replace(/[^\w-]+/g, "")
    .slice(0, 40);
  if (!(file instanceof File) || file.size === 0 || file.size > MAX_BYTES) return;
  const ext = ALLOWED.get(file.type);
  if (!ext) return;

  const safe = file.name
    .replace(/\.[^.]+$/, "")
    .replace(/[^\w-]+/g, "-")
    .slice(0, 60);
  const path = `${folder || "uploads"}/${crypto.randomUUID().slice(0, 8)}-${safe}.${ext}`;

  const db = supabaseAdmin();
  const { error } = await db.storage
    .from("media")
    .upload(path, Buffer.from(await file.arrayBuffer()), { contentType: file.type });
  if (error) {
    console.error("[media] upload failed:", error.message);
    return;
  }
  await db.from("media").insert({
    bucket: "media",
    storage_path: path,
    kind: file.type.startsWith("video/")
      ? "video"
      : file.type === "image/svg+xml"
        ? "svg"
        : "image",
    bytes: file.size,
    folder: folder || "uploads",
    alt: "",
  });
  await db.from("activity_log").insert({
    actor_id: admin.userId,
    action: "media.upload",
    entity: "media",
    entity_id: path,
  });
  revalidatePath("/admin/media");
}

export async function updateAlt(id: string, formData: FormData): Promise<void> {
  const admin = await currentAdmin();
  if (!admin || !CAN_UPLOAD.has(admin.role)) return;
  const alt = String(formData.get("alt") ?? "").slice(0, 300);
  await supabaseAdmin().from("media").update({ alt }).eq("id", id);
  revalidatePath("/admin/media");
}

export async function deleteMedia(id: string): Promise<void> {
  const admin = await currentAdmin();
  if (!admin || !CAN_DELETE.has(admin.role)) return;
  const db = supabaseAdmin();
  const { data: row } = await db.from("media").select("storage_path").eq("id", id).single();
  if (!row) return;
  await db.storage.from("media").remove([row.storage_path]);
  await db.from("media").delete().eq("id", id);
  await db.from("activity_log").insert({
    actor_id: admin.userId,
    action: "media.delete",
    entity: "media",
    entity_id: row.storage_path,
  });
  revalidatePath("/admin/media");
}
