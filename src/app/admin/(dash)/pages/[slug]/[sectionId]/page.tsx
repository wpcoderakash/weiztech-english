import { notFound } from "next/navigation";

import { renderFields } from "@/lib/cms/jsonform";
import { supabaseAdmin } from "@/lib/supabase/server";

import styles from "../../../../admin.module.css";
import { discardDraft, publishSection, restoreRevision, saveDraft } from "../../actions";

export const dynamic = "force-dynamic";

export default async function AdminSectionEditorPage({
  params,
}: {
  params: Promise<{ slug: string; sectionId: string }>;
}) {
  const { slug, sectionId } = await params;
  const db = supabaseAdmin();
  const { data: section } = await db
    .from("sections")
    .select("id, type, data, draft_data, pages(name, slug)")
    .eq("id", sectionId)
    .single();
  if (!section) notFound();

  const { data: revisions } = await db
    .from("section_revisions")
    .select("id, created_at")
    .eq("section_id", sectionId)
    .order("created_at", { ascending: false })
    .limit(10);

  const editing = section.draft_data ?? section.data;
  const hasDraft = section.draft_data != null;

  return (
    <>
      <div className={styles.panel} style={{ marginBlockEnd: 16 }}>
        <div className={styles.panelHead}>
          <span>
            {(section.pages as unknown as { name: string }).name} → <strong>{section.type}</strong>
            {hasDraft ? (
              <span className={styles.statusNew} style={{ marginInlineStart: 10 }}>
                unpublished draft
              </span>
            ) : null}
          </span>
          <span className={styles.rowActions}>
            {hasDraft ? (
              <>
                <form action={publishSection.bind(null, section.id)}>
                  <button type="submit" className={styles.exportBtn} style={{ border: 0 }}>
                    Publish
                  </button>
                </form>
                <form action={discardDraft.bind(null, section.id)}>
                  <button type="submit" className={styles.miniBtn}>
                    Discard draft
                  </button>
                </form>
              </>
            ) : null}
          </span>
        </div>

        <form action={saveDraft.bind(null, section.id)} className="jf-form">
          {renderFields(editing, "", styles.loginField ?? "")}
          <button
            type="submit"
            className={styles.exportBtn}
            style={{ border: 0, marginBlockStart: 14 }}
          >
            Save draft
          </button>
        </form>
      </div>

      {(revisions ?? []).length > 0 ? (
        <div className={styles.panel}>
          <div className={styles.panelHead}>Revision history</div>
          <table className={styles.table}>
            <tbody>
              {(revisions ?? []).map((rev) => (
                <tr key={rev.id}>
                  <td>{new Date(rev.created_at).toLocaleString("en-GB")}</td>
                  <td>
                    <form action={restoreRevision.bind(null, rev.id)}>
                      <button type="submit" className={styles.miniBtn}>
                        restore this version
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </>
  );
}
