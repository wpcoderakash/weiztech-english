"use client";

import { useActionState } from "react";
import styles from "../../admin.module.css";
import { saveFormSettings, type ActionState } from "./actions";
import type { Recipient } from "./RecipientList";

interface FormSettings {
  form_key: string;
  label: string;
  notify_enabled: boolean;
  recipient_ids: string[];
  subject: string;
  reply_to: string;
  cc: string;
  bcc: string;
  auto_reply_enabled: boolean;
  auto_reply_subject: string;
  auto_reply_html: string;
}

interface Props {
  formKey: string;
  label: string;
  f: FormSettings;
  recipientRows: Recipient[];
  defaultAutoReplyHtml: string;
}

const INITIAL: ActionState = { message: null, ok: false };

function Note({ state }: { state: ActionState }) {
  if (!state.message) return null;
  return (
    <div style={{ fontSize: 13, color: state.ok ? "#6fdfb8" : "#ff9d9d", marginBlockStart: 8 }}>
      {state.message}
    </div>
  );
}

export function FormSettingsFormWrapper({
  formKey,
  f,
  recipientRows,
  defaultAutoReplyHtml,
}: Props) {
  const [state, action, pending] = useActionState(
    saveFormSettings.bind(null, formKey),
    INITIAL,
  );

  return (
    <form action={action} style={{ display: "grid", gap: 8, marginBlockStart: 10 }}>
      <label
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          fontSize: 13,
          color: "#c9c3d9",
        }}
      >
        <input type="checkbox" name="notify_enabled" defaultChecked={f.notify_enabled} /> Enable
        email notifications
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
        <span className="jf-key">auto-reply html variables: name, message, footer</span>
        <textarea
          className={styles.loginField}
          name="auto_reply_html"
          rows={6}
          defaultValue={f.auto_reply_html || defaultAutoReplyHtml}
          style={{ marginBlockEnd: 0, fontFamily: "monospace", fontSize: 12 }}
        />
      </label>
      <button
        type="submit"
        className={styles.exportBtn}
        style={{ border: 0, justifySelf: "start" }}
        disabled={pending}
      >
        {pending ? "Saving..." : "Save form settings"}
      </button>
      <Note state={state} />
    </form>
  );
}
