import Link from "next/link";

import { supabaseAdmin } from "@/lib/supabase/server";

import styles from "../../admin.module.css";

import { setSubmissionStatus } from "./actions";

export const dynamic = "force-dynamic";

const FORMS = ["all", "contact", "quote", "careers"] as const;
const STATUSES = ["all", "new", "read", "replied", "spam"] as const;

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ form?: string; status?: string }>;
}) {
  const { form = "all", status = "all" } = await searchParams;
  const db = supabaseAdmin();

  let query = db
    .from("form_submissions")
    .select("id, form, payload, status, turnstile_ok, page_source, created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  if (form !== "all") query = query.eq("form", form);
  if (status !== "all") query = query.eq("status", status);
  const { data: rows } = await query;

  const href = (f: string, s: string) => `/admin/submissions?form=${f}&status=${s}`;

  return (
    <div className={styles.panel}>
      <div className={styles.panelHead}>
        <div className={styles.filterBar}>
          {FORMS.map((f) => (
            <Link
              key={f}
              href={href(f, status)}
              className={`${styles.filterLink} ${f === form ? styles.filterActive : ""}`}
            >
              {f}
            </Link>
          ))}
          <span aria-hidden="true" style={{ opacity: 0.3 }}>
            |
          </span>
          {STATUSES.map((s) => (
            <Link
              key={s}
              href={href(form, s)}
              className={`${styles.filterLink} ${s === status ? styles.filterActive : ""}`}
            >
              {s}
            </Link>
          ))}
        </div>
        <a
          className={styles.exportBtn}
          href={`/admin/submissions/export?form=${form}&status=${status}`}
        >
          Export CSV
        </a>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Form</th>
            <th>Submission</th>
            <th>Status</th>
            <th>When</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {(rows ?? []).map((row) => {
            const p = row.payload as Record<string, unknown>;
            return (
              <tr key={row.id}>
                <td>
                  <span className={`${styles.formPill} ${formClass(row.form)}`}>{row.form}</span>
                  {!row.turnstile_ok ? <div className={styles.statusSpam}>unverified</div> : null}
                </td>
                <td>
                  <pre className={styles.payload}>{payloadText(p)}</pre>
                </td>
                <td className={statusClass(row.status)}>{row.status}</td>
                <td>
                  {new Date(row.created_at).toLocaleString("en-GB")}
                  {row.page_source ? <div style={{ opacity: 0.6 }}>{row.page_source}</div> : null}
                </td>
                <td>
                  <div className={styles.rowActions}>
                    {(["read", "replied", "spam"] as const).map((s) => (
                      <form key={s} action={setSubmissionStatus.bind(null, row.id, s)}>
                        <button type="submit" className={styles.miniBtn}>
                          {s}
                        </button>
                      </form>
                    ))}
                  </div>
                </td>
              </tr>
            );
          })}
          {(rows ?? []).length === 0 ? (
            <tr>
              <td colSpan={5} className={styles.empty}>
                Nothing here for this filter.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}

function payloadText(p: Record<string, unknown>): string {
  return Object.entries(p)
    .filter(([, v]) => v !== null && v !== "" && v !== undefined)
    .map(([k, v]) => `${k}: ${String(v)}`)
    .join("\n");
}

function formClass(form: string): string {
  if (form === "contact") return styles.formContact ?? "";
  if (form === "quote") return styles.formQuote ?? "";
  return styles.formCareers ?? "";
}

function statusClass(status: string): string {
  if (status === "new") return styles.statusNew ?? "";
  if (status === "replied") return styles.statusReplied ?? "";
  if (status === "spam") return styles.statusSpam ?? "";
  return styles.statusRead ?? "";
}
