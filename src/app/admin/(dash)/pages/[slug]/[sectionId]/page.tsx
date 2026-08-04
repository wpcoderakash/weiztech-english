import { notFound } from "next/navigation";

import { renderFields } from "@/lib/cms/jsonform";
import { supabaseAdmin } from "@/lib/supabase/server";

import styles from "../../../../admin.module.css";
import { discardDraft, publishSection, restoreRevision, saveDraft } from "../../actions";

import { ActionButton, DraftActions, SaveDraftForm } from "./EditorForms";

export const dynamic = "force-dynamic";

export default async function AdminSectionEditorPage({
  params,
}: {
  params: Promise<{ slug: string; sectionId: string }>;
}) {
  const { sectionId } = await params;
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
            <DraftActions
              hasDraft={hasDraft}
              publish={publishSection.bind(null, section.id)}
              discard={discardDraft.bind(null, section.id)}
              publishClassName={styles.exportBtn ?? ""}
              discardClassName={styles.miniBtn ?? ""}
            />
          </span>
        </div>

        <SaveDraftForm
          action={saveDraft.bind(null, section.id)}
          className="jf-form"
          buttonClassName={styles.exportBtn ?? ""}
        >
          {renderFields(editing, "", styles.loginField ?? "")}
        </SaveDraftForm>
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
                    <ActionButton
                      action={restoreRevision.bind(null, rev.id)}
                      label="restore this version"
                      pendingLabel="Restoring…"
                      className={styles.miniBtn ?? ""}
                      confirm="Restore this version? The current live content will be replaced (it is kept as a revision)."
                    />
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
