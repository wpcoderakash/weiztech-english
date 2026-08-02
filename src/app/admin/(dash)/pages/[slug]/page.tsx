import Link from "next/link";

import { notFound } from "next/navigation";

import { ORDERABLE_PAGES } from "@/lib/cms/orderable";
import { supabaseAdmin } from "@/lib/supabase/server";

import styles from "../../../admin.module.css";
import { moveSection, toggleSectionEnabled } from "../actions";

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
    .select("id, name, slug, sections(id, type, sort, enabled, updated_at, draft_data)")
    .eq("slug", slug)
    .single();
  if (!page) notFound();

  const sections = (
    page.sections as {
      id: string;
      type: string;
      sort: number;
      enabled: boolean;
      updated_at: string;
      draft_data: unknown;
    }[]
  ).sort((a, b) => a.sort - b.sort);
  const orderable = ORDERABLE_PAGES.has(slug);

  return (
    <div className={styles.panel}>
      <div className={styles.panelHead}>
        {page.name} — sections
        {!orderable ? (
          <span style={{ fontSize: 12, opacity: 0.55 }}>
            section order fixed on this page (reorder pilot: Web Development)
          </span>
        ) : null}
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
                {!section.enabled ? (
                  <span className={styles.statusSpam}>hidden</span>
                ) : section.draft_data != null ? (
                  <span className={styles.statusNew}>draft pending</span>
                ) : (
                  <span className={styles.statusReplied}>published</span>
                )}
              </td>
              <td>{new Date(section.updated_at).toLocaleString("en-GB")}</td>
              <td>
                <div className={styles.rowActions}>
                  <Link className={styles.miniBtn} href={`/admin/pages/${slug}/${section.id}`}>
                    edit
                  </Link>
                  {orderable ? (
                    <>
                      <form action={moveSection.bind(null, section.id, -1)}>
                        <button type="submit" className={styles.miniBtn} title="Move up">
                          ↑
                        </button>
                      </form>
                      <form action={moveSection.bind(null, section.id, 1)}>
                        <button type="submit" className={styles.miniBtn} title="Move down">
                          ↓
                        </button>
                      </form>
                      <form action={toggleSectionEnabled.bind(null, section.id)}>
                        <button type="submit" className={styles.miniBtn}>
                          {section.enabled ? "hide" : "show"}
                        </button>
                      </form>
                    </>
                  ) : null}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
