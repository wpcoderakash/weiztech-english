import { notFound } from "next/navigation";

import { DEFAULT_AUTO_REPLY_HTML } from "@/lib/email/template";
import { currentAdmin, supabaseAdmin } from "@/lib/supabase/server";

import styles from "../../admin.module.css";

import {
  deleteRecipient,
  retryEmail,
  saveFormSettings,
  saveTemplate,
  setPrimaryRecipient,
  testRecipient,
  toggleRecipient,
  updateRecipient,
} from "./actions";
import {
  AddRecipientForm,
  GraphSettingsForm,
  SendTestEmailForm,
  TestConnectionButton,
} from "./EmailForms";
import { RecipientList, type Recipient } from "./RecipientList";

export const dynamic = "force-dynamic";

export default async function AdminEmailPage() {
  const me = await currentAdmin();
  if (!me || me.role !== "super_admin") notFound();

  const db = supabaseAdmin();
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(startOfDay.getFullYear(), startOfDay.getMonth(), 1);

  const [settings, recipients, forms, templates, logs, today, month, failed, last] =
    await Promise.all([
      db.from("email_settings").select("*").eq("id", true).single(),
      db.from("email_recipients").select("*").order("sort"),
      db.from("form_email_settings").select("*").order("form_key"),
      db.from("email_templates").select("*").order("name"),
      db.from("email_logs").select("*").order("created_at", { ascending: false }).limit(60),
      db
        .from("email_logs")
        .select("id", { count: "exact", head: true })
        .eq("status", "sent")
        .gte("created_at", startOfDay.toISOString()),
      db
        .from("email_logs")
        .select("id", { count: "exact", head: true })
        .eq("status", "sent")
        .gte("created_at", startOfMonth.toISOString()),
      db.from("email_logs").select("id", { count: "exact", head: true }).eq("status", "failed"),
      db
        .from("email_logs")
        .select("created_at")
        .eq("status", "sent")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

  const s = settings.data;
  const recipientRows = (recipients.data ?? []) as Recipient[];
  const connected = s?.last_test_ok === true;

  const stats = [
    { label: "Sent today", value: today.count ?? 0, hint: "successful deliveries" },
    { label: "Sent this month", value: month.count ?? 0, hint: "since the 1st" },
    { label: "Failed", value: failed.count ?? 0, hint: "all time" },
    {
      label: "Graph status",
      value: s?.enabled ? (connected ? "Connected" : "Untested") : "Disabled",
      hint: last.data?.created_at
        ? `last send ${new Date(last.data.created_at).toLocaleString("en-GB")}`
        : "no sends yet",
    },
  ];

  return (
    <>
      <div className={styles.statGrid}>
        {stats.map((stat) => (
          <div key={stat.label} className={styles.statCard}>
            <div className={styles.statLabel}>{stat.label}</div>
            <div
              className={styles.statValue}
              style={{ fontSize: typeof stat.value === "string" ? 20 : 28 }}
            >
              {stat.value}
            </div>
            <div className={styles.statHint}>{stat.hint}</div>
          </div>
        ))}
      </div>

      {/* ---- Microsoft Graph configuration ---- */}
      <div className={styles.panel} style={{ marginBlockEnd: 16 }}>
        <div className={styles.panelHead}>
          Microsoft Graph configuration
          <span className={connected ? styles.statusReplied : styles.statusRead}>
            {s?.last_test_at
              ? `tested ${new Date(s.last_test_at).toLocaleString("en-GB")}`
              : "never tested"}
          </span>
        </div>
        <div className="jf-form" style={{ display: "grid", gap: 14 }}>
          <GraphSettingsForm
            senderEmail={s?.sender_email ?? ""}
            tenantId={s?.tenant_id ?? ""}
            clientId={s?.client_id ?? ""}
            hasSecret={Boolean(s?.client_secret_enc)}
            enabled={Boolean(s?.enabled)}
          />
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
            <TestConnectionButton />
            <SendTestEmailForm defaultTo={recipientRows[0]?.email ?? ""} />
          </div>
          {s?.last_test_error ? <div className={styles.statusSpam}>{s.last_test_error}</div> : null}
        </div>
      </div>

      {/* ---- Recipients ---- */}
      <div className={styles.panel} style={{ marginBlockEnd: 16 }}>
        <div className={styles.panelHead}>
          Notification recipients
          <AddRecipientForm />
        </div>
        <div className="jf-form">
          <RecipientList
            recipients={recipientRows}
            rows={recipientRows.map((r) => (
              <span key={r.id} style={{ display: "contents" }}>
                <form
                  action={updateRecipient.bind(null, r.id)}
                  style={{ display: "flex", gap: 6, flex: 1, flexWrap: "wrap" }}
                >
                  <input
                    className={styles.loginField}
                    name="email"
                    defaultValue={r.email}
                    style={{
                      marginBlockEnd: 0,
                      maxInlineSize: 230,
                      padding: "6px 10px",
                      fontSize: 12.5,
                    }}
                  />
                  <input
                    className={styles.loginField}
                    name="name"
                    defaultValue={r.name}
                    placeholder="name"
                    style={{
                      marginBlockEnd: 0,
                      maxInlineSize: 140,
                      padding: "6px 10px",
                      fontSize: 12.5,
                    }}
                  />
                  <button type="submit" className={styles.miniBtn}>
                    save
                  </button>
                </form>
                {r.is_primary ? <span className={styles.rolePill}>primary</span> : null}
                <span className={r.enabled ? styles.statusReplied : styles.statusRead}>
                  {r.enabled ? "enabled" : "disabled"}
                </span>
                <div className={styles.rowActions}>
                  <form action={toggleRecipient.bind(null, r.id)}>
                    <button type="submit" className={styles.miniBtn}>
                      {r.enabled ? "disable" : "enable"}
                    </button>
                  </form>
                  {!r.is_primary ? (
                    <form action={setPrimaryRecipient.bind(null, r.id)}>
                      <button type="submit" className={styles.miniBtn}>
                        make primary
                      </button>
                    </form>
                  ) : null}
                  <form action={testRecipient.bind(null, r.id)}>
                    <button type="submit" className={styles.miniBtn}>
                      test
                    </button>
                  </form>
                  <form action={deleteRecipient.bind(null, r.id)}>
                    <button type="submit" className={styles.miniBtn} style={{ color: "#ff9d9d" }}>
                      delete
                    </button>
                  </form>
                </div>
              </span>
            ))}
          />
        </div>
      </div>

      {/* ---- Per-form settings ---- */}
      <div className={styles.panel} style={{ marginBlockEnd: 16 }}>
        <div className={styles.panelHead}>Form settings</div>
        <div className="jf-form" style={{ display: "grid", gap: 12 }}>
          {(forms.data ?? []).map((f) => (
            <details key={f.form_key} className="jf-group">
              <summary style={{ cursor: "pointer", color: "#fff", fontWeight: 600 }}>
                {f.label}{" "}
                <span className={f.notify_enabled ? styles.statusReplied : styles.statusRead}>
                  {f.notify_enabled ? "notifications on" : "off"}
                </span>
              </summary>
              <form
                action={saveFormSettings.bind(null, f.form_key)}
                style={{ display: "grid", gap: 8, marginBlockStart: 10 }}
              >
                <label
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    fontSize: 13,
                    color: "#c9c3d9",
                  }}
                >
                  <input type="checkbox" name="notify_enabled" defaultChecked={f.notify_enabled} />{" "}
                  Enable email notifications
                </label>
                <span className="jf-key">recipients (none selected = all enabled)</span>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {recipientRows.map((r) => (
                    <label
                      key={r.id}
                      style={{
                        display: "flex",
                        gap: 6,
                        alignItems: "center",
                        fontSize: 12.5,
                        color: "#c9c3d9",
                      }}
                    >
                      <input
                        type="checkbox"
                        name="recipient_ids"
                        value={r.id}
                        defaultChecked={(f.recipient_ids as string[]).includes(r.id)}
                      />
                      {r.email}
                    </label>
                  ))}
                </div>
                <label className="jf-label">
                  <span className="jf-key">subject</span>
                  <input
                    className={styles.loginField}
                    name="subject"
                    defaultValue={f.subject}
                    style={{ marginBlockEnd: 0 }}
                  />
                </label>
                <label className="jf-label">
                  <span className="jf-key">reply-to (empty = submitter)</span>
                  <input
                    className={styles.loginField}
                    name="reply_to"
                    defaultValue={f.reply_to}
                    style={{ marginBlockEnd: 0 }}
                  />
                </label>
                <label className="jf-label">
                  <span className="jf-key">cc</span>
                  <input
                    className={styles.loginField}
                    name="cc"
                    defaultValue={f.cc}
                    style={{ marginBlockEnd: 0 }}
                  />
                </label>
                <label className="jf-label">
                  <span className="jf-key">bcc</span>
                  <input
                    className={styles.loginField}
                    name="bcc"
                    defaultValue={f.bcc}
                    style={{ marginBlockEnd: 0 }}
                  />
                </label>
                <label
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    fontSize: 13,
                    color: "#c9c3d9",
                  }}
                >
                  <input
                    type="checkbox"
                    name="auto_reply_enabled"
                    defaultChecked={f.auto_reply_enabled}
                  />{" "}
                  Send auto-reply to the submitter
                </label>
                <label className="jf-label">
                  <span className="jf-key">auto-reply subject</span>
                  <input
                    className={styles.loginField}
                    name="auto_reply_subject"
                    defaultValue={f.auto_reply_subject}
                    style={{ marginBlockEnd: 0 }}
                  />
                </label>
                <label className="jf-label">
                  <span className="jf-key">
                    auto-reply html ({"{{name}} {{message}} {{footer}}"})
                  </span>
                  <textarea
                    className={styles.loginField}
                    name="auto_reply_html"
                    rows={6}
                    defaultValue={f.auto_reply_html || DEFAULT_AUTO_REPLY_HTML}
                    style={{ marginBlockEnd: 0, fontFamily: "monospace", fontSize: 12 }}
                  />
                </label>
                <button
                  type="submit"
                  className={styles.exportBtn}
                  style={{ border: 0, justifySelf: "start" }}
                >
                  Save form settings
                </button>
              </form>
            </details>
          ))}
        </div>
      </div>

      {/* ---- Templates ---- */}
      <div className={styles.panel} style={{ marginBlockEnd: 16 }}>
        <div className={styles.panelHead}>Email templates</div>
        <div className="jf-form" style={{ display: "grid", gap: 12 }}>
          {[...(templates.data ?? []), null].map((t, i) => (
            <details key={t?.id ?? `new-${i}`} className="jf-group">
              <summary style={{ cursor: "pointer", color: "#fff", fontWeight: 600 }}>
                {t ? t.name : "+ New template"}
              </summary>
              <form
                action={saveTemplate.bind(null, t?.id ?? null)}
                style={{ display: "grid", gap: 8, marginBlockStart: 10 }}
              >
                <label className="jf-label">
                  <span className="jf-key">key</span>
                  <input
                    className={styles.loginField}
                    name="key"
                    defaultValue={t?.key ?? "notification"}
                    style={{ marginBlockEnd: 0 }}
                  />
                </label>
                <label className="jf-label">
                  <span className="jf-key">name</span>
                  <input
                    className={styles.loginField}
                    name="name"
                    defaultValue={t?.name ?? "Notification"}
                    style={{ marginBlockEnd: 0 }}
                  />
                </label>
                <label className="jf-label">
                  <span className="jf-key">logo url</span>
                  <input
                    className={styles.loginField}
                    name="logo_url"
                    defaultValue={t?.logo_url ?? ""}
                    placeholder="https://…/logo.png"
                    style={{ marginBlockEnd: 0 }}
                  />
                </label>
                <label className="jf-label">
                  <span className="jf-key">footer text</span>
                  <input
                    className={styles.loginField}
                    name="footer_text"
                    defaultValue={t?.footer_text ?? "Weiz Technologies"}
                    style={{ marginBlockEnd: 0 }}
                  />
                </label>
                <label className="jf-label">
                  <span className="jf-key">
                    html — variables:{" "}
                    {
                      "{{form_label}} {{fields}} {{name}} {{email}} {{message}} {{date}} {{logo}} {{footer}}"
                    }
                  </span>
                  <textarea
                    className={styles.loginField}
                    name="html"
                    rows={12}
                    defaultValue={t?.html ?? ""}
                    style={{ marginBlockEnd: 0, fontFamily: "monospace", fontSize: 12 }}
                  />
                </label>
                <button
                  type="submit"
                  className={styles.exportBtn}
                  style={{ border: 0, justifySelf: "start" }}
                >
                  Save template
                </button>
              </form>
            </details>
          ))}
        </div>
      </div>

      {/* ---- Logs ---- */}
      <div className={styles.panel}>
        <div className={styles.panelHead}>Email logs</div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>When</th>
              <th>Form</th>
              <th>Recipient</th>
              <th>Subject</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {(logs.data ?? []).map((l) => (
              <tr key={l.id}>
                <td style={{ whiteSpace: "nowrap" }}>
                  {new Date(l.created_at).toLocaleString("en-GB")}
                </td>
                <td>
                  {l.form_key}
                  <div style={{ opacity: 0.5, fontSize: 11 }}>{l.kind}</div>
                </td>
                <td>{l.recipient}</td>
                <td>{l.subject}</td>
                <td className={l.status === "sent" ? styles.statusReplied : styles.statusSpam}>
                  {l.status}
                  {l.error ? <div style={{ fontSize: 11, opacity: 0.8 }}>{l.error}</div> : null}
                </td>
                <td>
                  {l.status === "failed" ? (
                    <form action={retryEmail.bind(null, l.id)}>
                      <button type="submit" className={styles.miniBtn}>
                        retry
                      </button>
                    </form>
                  ) : null}
                </td>
              </tr>
            ))}
            {(logs.data ?? []).length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.empty}>
                  No email activity yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </>
  );
}
