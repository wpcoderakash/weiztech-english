import { notFound } from "next/navigation";

import { SaveForm } from "@/components/admin";
import { renderFields } from "@/lib/cms/jsonform";
import { supabaseAdmin } from "@/lib/supabase/server";

import styles from "../../../../admin.module.css";
import { saveSiteEntry } from "../../actions";

export const dynamic = "force-dynamic";

export default async function AdminSiteEditorPage({
  params,
}: {
  params: Promise<{ kind: string; key: string }>;
}) {
  const { kind, key } = await params;
  if (kind !== "navigation" && kind !== "settings") notFound();

  const table = kind === "navigation" ? "navigation_menus" : "settings";
  const column = kind === "navigation" ? "items" : "value";
  const { data: row } = await supabaseAdmin().from(table).select(column).eq("key", key).single();
  if (!row) notFound();

  return (
    <div className={styles.panel}>
      <div className={styles.panelHead}>
        <span>
          {kind} → <strong>{key}</strong>
        </span>
        <span style={{ fontSize: 12, opacity: 0.6 }}>Saving publishes site-wide immediately.</span>
      </div>
      <SaveForm
        action={saveSiteEntry.bind(null, kind, key)}
        className="jf-form"
        label="Save & publish"
        pendingLabel="Saving…"
        buttonClassName={styles.exportBtn ?? ""}
        buttonStyle={{ border: 0 }}
      >
        {renderFields((row as Record<string, unknown>)[column], "", styles.loginField ?? "")}
      </SaveForm>
    </div>
  );
}
