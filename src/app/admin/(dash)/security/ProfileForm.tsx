"use client";

import { useActionState } from "react";

import styles from "../../admin.module.css";

import { updateProfile, type ProfileState } from "./actions";

const INITIAL: ProfileState = { message: null, ok: false };

export function ProfileForm({ name, email }: { name: string; email: string }) {
  const [state, action, pending] = useActionState(updateProfile, INITIAL);

  return (
    <form
      action={action}
      className="jf-form"
      style={{ display: "grid", gap: 10, maxInlineSize: 460 }}
    >
      <label className="jf-label">
        <span className="jf-key">email</span>
        <input
          className={styles.loginField}
          value={email}
          disabled
          style={{ marginBlockEnd: 0, opacity: 0.6 }}
        />
      </label>
      <label className="jf-label">
        <span className="jf-key">display name</span>
        <input
          className={styles.loginField}
          name="name"
          defaultValue={name}
          maxLength={80}
          style={{ marginBlockEnd: 0 }}
        />
      </label>
      <label className="jf-label">
        <span className="jf-key">new password (leave empty to keep current)</span>
        <input
          className={styles.loginField}
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          style={{ marginBlockEnd: 0 }}
        />
      </label>
      <label className="jf-label">
        <span className="jf-key">confirm new password</span>
        <input
          className={styles.loginField}
          name="confirm"
          type="password"
          autoComplete="new-password"
          style={{ marginBlockEnd: 0 }}
        />
      </label>
      <button
        type="submit"
        className={styles.exportBtn}
        style={{ border: 0, justifySelf: "start" }}
        disabled={pending}
      >
        {pending ? "Saving…" : "Save profile"}
      </button>
      {state.message ? (
        <div style={{ fontSize: 13, color: state.ok ? "#6fdfb8" : "#ff9d9d" }}>{state.message}</div>
      ) : null}
    </form>
  );
}
