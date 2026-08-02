import Link from "next/link";

import { supabaseAdmin } from "@/lib/supabase/server";

import styles from "../../admin.module.css";

export const dynamic = "force-dynamic";

export default async function AdminPagesPage() {
  const db = supabaseAdmin();
  const { data: pages } = await db
    .from("pages")
    .select("slug, name, sections(id)")
    .is("deleted_at", null)
    .order("slug");

  return (
    <div className={styles.panel}>
      <div className={styles.panelHead}>Pages</div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Page</th>
            <th>Route</th>
            <th>Sections</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {(pages ?? []).map((page) => (
            <tr key={page.slug}>
              <td style={{ color: "#fff", fontWeight: 600 }}>{page.name}</td>
              <td>/{page.slug === "home" ? "" : `${page.slug}/`}</td>
              <td>{(page.sections as { id: string }[]).length}</td>
              <td>
                <Link className={styles.miniBtn} href={`/admin/pages/${page.slug}`}>
                  edit sections
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
