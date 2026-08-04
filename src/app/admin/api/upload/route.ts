import { NextResponse, type NextRequest } from "next/server";

import { rejectUpload } from "@/lib/media/validate";
import { currentAdmin, supabaseAdmin } from "@/lib/supabase/server";

const CAN_UPLOAD = new Set(["super_admin", "admin", "editor", "content_manager", "author"]);
const ALLOWED = new Map<string, string>([
  ["image/png", "png"],
  ["image/jpeg", "jpg"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
  ["image/svg+xml", "svg"],
]);
const MAX_BYTES = 10 * 1024 * 1024;

/** Inline uploads from ImageField in the section editors — returns the URL. */
export async function POST(request: NextRequest) {
  const admin = await currentAdmin();
  if (!admin || !CAN_UPLOAD.has(admin.role)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0 || file.size > MAX_BYTES) {
    return NextResponse.json({ error: "invalid file" }, { status: 400 });
  }
  const ext = ALLOWED.get(file.type);
  if (!ext) return NextResponse.json({ error: "unsupported type" }, { status: 400 });

  const bytes = new Uint8Array(await file.arrayBuffer());
  const rejection = rejectUpload(file.type, bytes);
  if (rejection) return NextResponse.json({ error: rejection }, { status: 400 });

  const safe = file.name
    .replace(/\.[^.]+$/, "")
    .replace(/[^\w-]+/g, "-")
    .slice(0, 60);
  const path = `content/${crypto.randomUUID().slice(0, 8)}-${safe}.${ext}`;
  const db = supabaseAdmin();
  const { error } = await db.storage
    .from("media")
    .upload(path, Buffer.from(bytes), { contentType: file.type });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await db.from("media").insert({
    bucket: "media",
    storage_path: path,
    kind: file.type === "image/svg+xml" ? "svg" : "image",
    bytes: file.size,
    folder: "content",
    alt: "",
  });
  await db.from("activity_log").insert({
    actor_id: admin.userId,
    action: "media.upload",
    entity: "media",
    entity_id: path,
  });

  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${path}`;
  return NextResponse.json({ url });
}
