"use client";

import { useActionState, useState } from "react";

import styles from "../../admin.module.css";

import {
  addRecipient,
  saveGraphSettings,
  sendTestEmail,
  testConnection,
  type ActionState,
} from "./actions";

const INITIAL: ActionState = { message: null, ok: false };

function Note({ state }: { state: ActionState }) {
  if (!state.message) return null;
  return (
    <div style={{ fontSize: 13, color: state.ok ? "#6fdfb8" : "#ff9d9d", marginBlockStart: 8 }}>
      {state.message}
    </div>
  );
}

export function GraphSettingsForm({
  senderEmail,
  tenantId,
  clientId,
  hasSecret,
  enabled,
}: {
  senderEmail: string;
  tenantId: string;
  clientId: string;
  hasSecret: boolean;
  enabled: boolean;
}) {
  const [state, action, pending] = useActionState(saveGraphSettings, INITIAL);
  const [showSecret, setShowSecret] = useState(false);

  return (
    <form
      action={action}
      className="jf-form"
      style={{ display: "grid", gap: 10, maxInlineSize: 560 }}
    >
      <label className="jf-label">
        <span className="jf-key">sender email address</span>
        <input
          className={styles.loginField}
          name="sender_email"
          defaultValue={senderEmail}
          placeholder="noreply@weiztech.com"
          style={{ marginBlockEnd: 0 }}
        />
      </label>
      <label className="jf-label">
        <span className="jf-key">tenant id</span>
        <input
          className={styles.loginField}
          name="tenant_id"
          defaultValue={tenantId}
          style={{ marginBlockEnd: 0 }}
        />
      </label>
      <label className="jf-label">
        <span className="jf-key">client id</span>
        <input
          className={styles.loginField}
          name="client_id"
          defaultValue={clientId}
          style={{ marginBlockEnd: 0 }}
        />
      </label>
      <label className="jf-label">
        <span className="jf-key">
          client secret {hasSecret ? "(stored — leave empty to keep)" : ""}
        </span>
        <span style={{ display: "flex", gap: 8 }}>
          <input
            className={styles.loginField}
            name="client_secret"
            type={showSecret ? "text" : "password"}
            placeholder={hasSecret ? "••••••••••••••••" : "paste the secret value"}
            autoComplete="off"
            style={{ marginBlockEnd: 0 }}
          />
          <button
            type="button"
            className={styles.miniBtn}
            onClick={() => setShowSecret(!showSecret)}
          >
            {showSecret ? "hide" : "show"}
          </button>
        </span>
      </label>
      <label
        style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13, color: "#c9c3d9" }}
      >
        <input type="checkbox" name="enabled" defaultChecked={enabled} />
        Email sending enabled
      </label>
      <button
        type="submit"
        className={styles.exportBtn}
        style={{ border: 0, justifySelf: "start" }}
        disabled={pending}
      >
        {pending ? "Saving…" : "Save changes"}
      </button>
      <Note state={state} />
    </form>
  );
}

export function TestConnectionButton() {
  const [state, action, pending] = useActionState(testConnection, INITIAL);
  return (
    <form action={action} style={{ display: "inline-flex", gap: 10, alignItems: "center" }}>
      <button type="submit" className={styles.miniBtn} disabled={pending}>
        {pending ? "Testing…" : "Test connection"}
      </button>
      <Note state={state} />
    </form>
  );
}

export function SendTestEmailForm({ defaultTo }: { defaultTo: string }) {
  const [state, action, pending] = useActionState(sendTestEmail, INITIAL);
  return (
    <form
      action={action}
      style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}
    >
      <input
        className={styles.loginField}
        name="to"
        defaultValue={defaultTo}
        placeholder="you@example.com"
        style={{ marginBlockEnd: 0, maxInlineSize: 240 }}
      />
      <button type="submit" className={styles.miniBtn} disabled={pending}>
        {pending ? "Sending…" : "Send test email"}
      </button>
      <Note state={state} />
    </form>
  );
}

export function AddRecipientForm() {
  const [state, action, pending] = useActionState(addRecipient, INITIAL);
  return (
    <form
      action={action}
      style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}
    >
      <input
        className={styles.loginField}
        name="email"
        type="email"
        placeholder="new@recipient.com"
        required
        style={{ marginBlockEnd: 0, maxInlineSize: 240 }}
      />
      <input
        className={styles.loginField}
        name="name"
        placeholder="Name (optional)"
        style={{ marginBlockEnd: 0, maxInlineSize: 170 }}
      />
      <button type="submit" className={styles.exportBtn} style={{ border: 0 }} disabled={pending}>
        {pending ? "Adding…" : "Add recipient"}
      </button>
      <Note state={state} />
    </form>
  );
}
