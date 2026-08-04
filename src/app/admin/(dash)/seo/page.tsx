import { SaveForm } from "@/components/admin";
import { supabaseAdmin } from "@/lib/supabase/server";

import styles from "../../admin.module.css";

import { saveSeo } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminSeoPage() {
  const { data: pages } = await supabaseAdmin()
    .from("pages")
    .select("slug, name, seo")
    .is("deleted_at", null)
    .order("slug");

  return (
    <div className={styles.panel}>
      <div className={styles.panelHead}>
        SEO — per page
        <span style={{ fontSize: 12, opacity: 0.6 }}>
          Empty fields keep the site&apos;s built-in defaults.
        </span>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Page</th>
            <th>Title & description override</th>
          </tr>
        </thead>
        <tbody>
          {(pages ?? []).map((page) => {
            const seo = (page.seo ?? {}) as { title?: string; description?: string };
            return (
              <tr key={page.slug}>
                <td style={{ color: "#fff", fontWeight: 600, whiteSpace: "nowrap" }}>
                  {page.name}
                  <div style={{ opacity: 0.5, fontWeight: 400 }}>
                    /{page.slug === "home" ? "" : `${page.slug}/`}
                  </div>
                </td>
                <td>
                  <SaveForm
                    action={saveSeo.bind(null, page.slug)}
                    label="Save & publish"
                    pendingLabel="Saving…"
                    buttonClassName={styles.exportBtn ?? ""}
                    buttonStyle={{ border: 0, justifySelf: "start" }}
                  >
                    <input
                      className={styles.loginField}
                      name="title"
                      defaultValue={seo.title ?? ""}
                      placeholder="SEO title (default in use)"
                      maxLength={120}
                    />
                    <textarea
                      className={styles.loginField}
                      name="description"
                      defaultValue={seo.description ?? ""}
                      placeholder="Meta description (default in use)"
                      rows={2}
                      maxLength={300}
                    />
                  </SaveForm>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
