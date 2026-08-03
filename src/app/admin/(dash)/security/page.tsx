import { SITE_URL } from "@/lib/seo";
import { currentAdmin, mfaState, supabaseAdmin } from "@/lib/supabase/server";

import styles from "../../admin.module.css";
import { AdminSlugForm } from "../site/AdminSlugForm";

import { disable2fa } from "./actions";
import { EnrollForm } from "./EnrollForm";

export const dynamic = "force-dynamic";

export default async function AdminSecurityPage() {
  const me = await currentAdmin();
  const mfa = await mfaState();
  const { data: slugRow } = await supabaseAdmin()
    .from("settings")
    .select("value")
    .eq("key", "admin_slug")
    .maybeSingle();
  const currentSlug = (slugRow?.value as { slug?: string } | null)?.slug ?? "";

  return (
    <>
      {me?.role === "super_admin" ? (
        <div className={styles.panel} style={{ marginBlockEnd: 16 }}>
          <div className={styles.panelHead}>Admin access URL</div>
          <div className="jf-form">
            <AdminSlugForm current={currentSlug} origin={SITE_URL} />
          </div>
        </div>
      ) : null}

      <div className={styles.panel}>
        <div className={styles.panelHead}>
          Two-factor authentication (Google Authenticator)
          {mfa.enrolled ? (
            <span className={styles.statusReplied}>enabled</span>
          ) : (
            <span className={styles.statusRead}>off</span>
          )}
        </div>
        <div className="jf-form">
          {mfa.enrolled ? (
            <form action={disable2fa} style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "#c9c3d9" }}>
                2FA is active on your account. To turn it off, confirm with a current code:
              </span>
              <input
                className={styles.loginField}
                style={{ marginBlockEnd: 0, maxInlineSize: 140 }}
                name="code"
                inputMode="numeric"
                placeholder="6-digit code"
                maxLength={7}
                required
              />
              <button type="submit" className={styles.miniBtn} style={{ color: "#ff9d9d" }}>
                Disable 2FA
              </button>
            </form>
          ) : (
            <EnrollForm />
          )}
        </div>
      </div>
    </>
  );
}
