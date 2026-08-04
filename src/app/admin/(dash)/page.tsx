import Link from "next/link";
import { redirect } from "next/navigation";

import { currentAdmin, supabaseAdmin } from "@/lib/supabase/server";

import styles from "../admin.module.css";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  /* Own guard: a shared layout is not re-executed for every RSC segment
     request, so this page cannot rely on it alone before reading lead data. */
  const me = await currentAdmin();
  if (!me) redirect("/admin/login");

  const db = supabaseAdmin();
  // eslint-disable-next-line react-hooks/purity -- server component, per-request time is the point
  const since = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString();

  const [total, week, unread, recent] = await Promise.all([
    db.from("form_submissions").select("id", { count: "exact", head: true }),
    db
      .from("form_submissions")
      .select("id", { count: "exact", head: true })
      .gte("created_at", since),
    db.from("form_submissions").select("id", { count: "exact", head: true }).eq("status", "new"),
    db
      .from("form_submissions")
      .select("id, form, payload, status, created_at")
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  const stats = [
    { label: "Total submissions", value: total.count ?? 0, hint: "all time" },
    { label: "Last 7 days", value: week.count ?? 0, hint: "new leads this week" },
    { label: "Unread", value: unread.count ?? 0, hint: "waiting for a reply" },
  ];

  return (
    <>
      <div className={styles.statGrid}>
        {stats.map((s) => (
          <div key={s.label} className={styles.statCard}>
            <div className={styles.statLabel}>{s.label}</div>
            <div className={styles.statValue}>{s.value}</div>
            <div className={styles.statHint}>{s.hint}</div>
          </div>
        ))}
      </div>

      <div className={styles.panel}>
        <div className={styles.panelHead}>
          Recent submissions
          <Link className={styles.exportBtn} href="/admin/submissions">
            Open inbox
          </Link>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Form</th>
              <th>From</th>
              <th>Status</th>
              <th>When</th>
            </tr>
          </thead>
          <tbody>
            {(recent.data ?? []).map((row) => {
              const p = row.payload as Record<string, string>;
              return (
                <tr key={row.id}>
                  <td>
                    <span className={`${styles.formPill} ${formClass(row.form)}`}>{row.form}</span>
                  </td>
                  <td>
                    {p.fullName ?? p.name ?? "—"} · {p.email ?? "—"}
                  </td>
                  <td className={statusClass(row.status)}>{row.status}</td>
                  <td>{new Date(row.created_at).toLocaleString("en-GB")}</td>
                </tr>
              );
            })}
            {(recent.data ?? []).length === 0 ? (
              <tr>
                <td colSpan={4} className={styles.empty}>
                  No submissions yet — they will appear here the moment a form is sent.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </>
  );
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
