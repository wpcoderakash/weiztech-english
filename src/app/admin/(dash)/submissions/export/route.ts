import { NextResponse, type NextRequest } from "next/server";

import { currentAdmin, supabaseAdmin } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const admin = await currentAdmin();
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const form = request.nextUrl.searchParams.get("form") ?? "all";
  const status = request.nextUrl.searchParams.get("status") ?? "all";

  let query = supabaseAdmin()
    .from("form_submissions")
    .select("id, form, payload, status, page_source, created_at")
    .order("created_at", { ascending: false })
    .limit(5000);
  if (form !== "all") query = query.eq("form", form);
  if (status !== "all") query = query.eq("status", status);
  const { data } = await query;

  const keys = new Set<string>();
  for (const row of data ?? []) {
    for (const k of Object.keys(row.payload as object)) keys.add(k);
  }
  const payloadKeys = [...keys].sort();
  const header = ["id", "form", "status", "page_source", "created_at", ...payloadKeys];
  const esc = (v: unknown) => `"${String(v ?? "").replaceAll('"', '""')}"`;
  const lines = [header.join(",")];
  for (const row of data ?? []) {
    const p = row.payload as Record<string, unknown>;
    lines.push(
      [
        row.id,
        row.form,
        row.status,
        row.page_source,
        row.created_at,
        ...payloadKeys.map((k) => p[k]),
      ]
        .map(esc)
        .join(","),
    );
  }

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="submissions-${form}-${status}.csv"`,
    },
  });
}
