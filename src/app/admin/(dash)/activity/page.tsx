import { supabaseAdmin } from "@/lib/supabase/server";

import styles from "../../admin.module.css";

export const dynamic = "force-dynamic";

export default async function AdminActivityPage({
  searchParams,
}: {
  searchParams: Promise<{ entity?: string }>;
}) {
  const { entity = "all" } = await searchParams;
  const db = supabaseAdmin();

  let query = db
    .from("activity_log")
    .select("id, actor_id, action, entity, entity_id, diff, created_at")
    .order("created_at", { ascending: false })
    .limit(150);
  if (entity !== "all") query = query.eq("entity", entity);
  const [{ data: rows }, { data: authUsers }] = await Promise.all([
    query,
    db.auth.admin.listUsers({ perPage: 200 }),
  ]);
  const emailOf = new Map(authUsers.users.map((u) => [u.id, u.email ?? "?"]));

  const entities = [
    "all",
    "sections",
    "posts",
    "pages",
    "profiles",
    "media",
    "form_submissions",
    "navigation_menus",
    "settings",
  ];

  return (
    <div className={styles.panel}>
      <div className={styles.panelHead}>
        Activity log
        <div className={styles.filterBar}>
          {entities.map((e) => (
            <a
              key={e}
              href={`/admin/activity?entity=${e}`}
              className={`${styles.filterLink} ${e === entity ? styles.filterActive : ""}`}
            >
              {e.replace("_", " ")}
            </a>
          ))}
        </div>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>When</th>
            <th>Who</th>
            <th>Action</th>
            <th>Target</th>
          </tr>
        </thead>
        <tbody>
          {(rows ?? []).map((row) => (
            <tr key={row.id}>
              <td style={{ whiteSpace: "nowrap" }}>
                {new Date(row.created_at).toLocaleString("en-GB")}
              </td>
              <td>{row.actor_id ? (emailOf.get(row.actor_id) ?? "system") : "system"}</td>
              <td style={{ color: "#fff" }}>{row.action}</td>
              <td>
                {row.entity}
                <div style={{ opacity: 0.5, fontSize: 11 }}>{row.entity_id?.slice(0, 24)}</div>
              </td>
            </tr>
          ))}
          {(rows ?? []).length === 0 ? (
            <tr>
              <td colSpan={4} className={styles.empty}>
                No activity for this filter.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
