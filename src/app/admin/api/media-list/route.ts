import { NextResponse } from "next/server";

import { currentAdmin, supabaseAdmin } from "@/lib/supabase/server";

/** Same roles that may upload — the picker is an editing tool, not a viewer. */
const CAN_BROWSE = new Set(["super_admin", "admin", "editor", "content_manager", "author"]);

/** Media list for the in-editor library picker. */
export async function GET() {
  const admin = await currentAdmin();
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!CAN_BROWSE.has(admin.role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const { data } = await supabaseAdmin()
    .from("media")
    .select("storage_path, alt, kind")
    .in("kind", ["image", "svg"])
    .order("created_at", { ascending: false })
    .limit(60);

  const base = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/`;
  return NextResponse.json({
    items: (data ?? []).map((m) => ({ url: base + m.storage_path, alt: m.alt })),
  });
}
