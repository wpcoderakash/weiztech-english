import { NextResponse, type NextRequest } from "next/server";

import { currentAdmin, supabaseAdmin } from "@/lib/supabase/server";

/** Exporting every lead's contact details is a manage-level action, not a read. */
const CAN_EXPORT = new Set(["super_admin", "admin", "editor", "content_manager"]);

const FORMS = new Set(["all", "contact", "quote", "careers"]);
const STATUSES = new Set(["all", "new", "read", "replied", "spam"]);

/**
 * CSV escaping.
 *
 * Beyond the usual quote-doubling, a leading =, +, - or @ (optionally after
 * whitespace) makes Excel and Sheets treat the cell as a FORMULA. Since the
 * payload is attacker-supplied — anyone can submit the contact form — those
 * values are prefixed with a single quote so they import as literal text.
 */
function esc(value: unknown): string {
  const text = String(value ?? "").replaceAll('"', '""');
  const neutralised = /^[\s]*[=+\-@\t\r]/.test(text) ? `'${text}` : text;
  return `"${neutralised}"`;
}

export async function GET(request: NextRequest) {
  const admin = await currentAdmin();
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!CAN_EXPORT.has(admin.role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  /* Validate against the known enums — an unknown value would otherwise
     produce a silently empty export that reads as "no leads", and would be
     reflected into the Content-Disposition filename. */
  const formParam = request.nextUrl.searchParams.get("form") ?? "all";
  const statusParam = request.nextUrl.searchParams.get("status") ?? "all";
  const form = FORMS.has(formParam) ? formParam : "all";
  const status = STATUSES.has(statusParam) ? statusParam : "all";

  let query = supabaseAdmin()
    .from("form_submissions")
    .select("id, form, payload, status, page_source, created_at")
    .order("created_at", { ascending: false })
    .limit(5000);
  if (form !== "all") query = query.eq("form", form);
  if (status !== "all") query = query.eq("status", status);
  const { data, error } = await query;

  if (error) {
    console.error(`[submissions] export failed: ${error.message}`);
    return NextResponse.json({ error: "export failed" }, { status: 500 });
  }

  const keys = new Set<string>();
  for (const row of data ?? []) {
    for (const k of Object.keys(row.payload as object)) keys.add(k);
  }
  const payloadKeys = [...keys].sort();
  const header = ["id", "form", "status", "page_source", "created_at", ...payloadKeys];
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

  /* Bulk PII egress is the single largest data movement in the app — it gets
     an audit trail like every mutation does. */
  await supabaseAdmin()
    .from("activity_log")
    .insert({
      actor_id: admin.userId,
      action: "submissions.export",
      entity: "form_submissions",
      entity_id: null,
      diff: { form, status, rows: data?.length ?? 0 },
    });

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="submissions-${form}-${status}.csv"`,
    },
  });
}
