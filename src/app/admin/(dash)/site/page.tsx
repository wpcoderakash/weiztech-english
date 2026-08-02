import Link from "next/link";

import { supabaseAdmin } from "@/lib/supabase/server";

import styles from "../../admin.module.css";

export const dynamic = "force-dynamic";

const NAV_LABELS: Record<string, string> = {
  header: "Header menu",
  footer_quick: "Footer — Quick Links",
  footer_services: "Footer — Our Services",
  mobile: "Mobile drawer menu",
};

const SETTING_LABELS: Record<string, string> = {
  site: "Site identity",
  contact: "Contact information",
  offices: "Offices",
  socials: "Social links",
  footer_intro: "Footer intro",
  copyright: "Copyright line",
  vendor_logos: "Vendor logos",
  language_toggle: "Language toggle",
};

export default async function AdminSitePage() {
  const db = supabaseAdmin();
  const [menus, settings] = await Promise.all([
    db.from("navigation_menus").select("key, updated_at").order("key"),
    db.from("settings").select("key, updated_at").neq("key", "admin_slug").order("key"),
  ]);

  const block = (
    title: string,
    kind: string,
    rows: { key: string; updated_at: string }[],
    labels: Record<string, string>,
  ) => (
    <div className={styles.panel} style={{ marginBlockEnd: 16 }}>
      <div className={styles.panelHead}>{title}</div>
      <table className={styles.table}>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key}>
              <td style={{ color: "#fff", fontWeight: 600 }}>{labels[row.key] ?? row.key}</td>
              <td>{new Date(row.updated_at).toLocaleString("en-GB")}</td>
              <td>
                <Link className={styles.miniBtn} href={`/admin/site/${kind}/${row.key}`}>
                  edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      {block("Navigation", "navigation", menus.data ?? [], NAV_LABELS)}
      {block("Global settings", "settings", settings.data ?? [], SETTING_LABELS)}
    </>
  );
}
