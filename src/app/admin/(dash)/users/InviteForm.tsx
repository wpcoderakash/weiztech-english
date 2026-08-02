"use client";

import { useActionState } from "react";

import styles from "../../admin.module.css";

import { inviteUser, type InviteState } from "./actions";

const INITIAL: InviteState = { message: null, password: null };

export function InviteForm() {
  const [state, action, pending] = useActionState(inviteUser, INITIAL);

  return (
    <form
      action={action}
      className="jf-form"
      style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}
    >
      <input
        className={styles.loginField}
        style={{ maxInlineSize: 220, marginBlockEnd: 0 }}
        name="email"
        type="email"
        placeholder="email@company.com"
        required
      />
      <input
        className={styles.loginField}
        style={{ maxInlineSize: 160, marginBlockEnd: 0 }}
        name="name"
        placeholder="Name"
      />
      <select
        className={styles.loginField}
        style={{ maxInlineSize: 170, marginBlockEnd: 0 }}
        name="role"
        defaultValue="editor"
      >
        <option value="super_admin">super admin</option>
        <option value="admin">admin</option>
        <option value="editor">editor</option>
        <option value="content_manager">content manager</option>
        <option value="author">author</option>
        <option value="viewer">viewer</option>
      </select>
      <input
        className={styles.loginField}
        style={{ maxInlineSize: 200, marginBlockEnd: 0 }}
        name="password"
        type="text"
        minLength={8}
        placeholder="password (empty = auto)"
        autoComplete="off"
      />
      <button type="submit" className={styles.exportBtn} style={{ border: 0 }} disabled={pending}>
        {pending ? "Creating…" : "Add user"}
      </button>
      {state.message ? (
        <div
          style={{
            inlineSize: "100%",
            fontSize: 13,
            color: state.password ? "#6fdfb8" : "#ff9d9d",
          }}
        >
          {state.message}
          {state.password ? (
            <code
              style={{
                marginInlineStart: 8,
                padding: "3px 10px",
                borderRadius: 6,
                background: "rgb(0 0 0 / 50%)",
                color: "#fff",
                userSelect: "all",
              }}
            >
              {state.password}
            </code>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
