import Link from "next/link";

import { notFound } from "next/navigation";

import { supabaseAdmin } from "@/lib/supabase/server";

import styles from "../../../admin.module.css";

export const dynamic = "force-dynamic";

export default async function AdminPageSectionsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const db = supabaseAdmin();
  const { data: page } = await db
    .from("pages")
    .select("id, name, slug, sections(id, type, sort, updated_at, draft_data)")
    .eq("slug", slug)
    .single();
  if (!page) notFound();

  const sections = (
    page.sections as {
      id: string;
      type: string;
      sort: number;
      updated_at: string;
      draft_data: unknown;
    }[]
  ).sort((a, b) => a.sort - b.sort);

  return (
    <div className={styles.panel}>
      <div className={styles.panelHead}>
        {page.name} — sections
        <a
          className={styles.miniBtn}
          href={`/${slug === "home" ? "" : `${slug}/`}`}
          target="_blank"
          rel="noreferrer"
        >
          view page
        </a>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Section</th>
            <th>State</th>
            <th>Updated</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sections.map((section) => (
            <tr key={section.id}>
              <td style={{ color: "#fff", fontWeight: 600 }}>{section.type}</td>
              <td>
                {section.draft_data != null ? (
                  <span className={styles.statusNew}>draft pending</span>
                ) : (
                  <span className={styles.statusReplied}>published</span>
                )}
              </td>
              <td>{new Date(section.updated_at).toLocaleString("en-GB")}</td>
              <td>
                <Link className={styles.miniBtn} href={`/admin/pages/${slug}/${section.id}`}>
                  edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
