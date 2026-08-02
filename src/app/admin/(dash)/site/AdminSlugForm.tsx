"use client";

import { useActionState } from "react";

import styles from "../../admin.module.css";

import { saveAdminSlug, type AdminSlugState } from "./actions";

const INITIAL: AdminSlugState = { message: null, ok: false };

export function AdminSlugForm({ current, origin }: { current: string; origin: string }) {
  const [state, action, pending] = useActionState(saveAdminSlug, INITIAL);

  return (
    <form
      action={action}
      className="jf-form"
      style={{ display: "grid", gap: 10, maxInlineSize: 560 }}
    >
      <span style={{ fontSize: 13, color: "#c9c3d9" }}>
        The dashboard is reachable only through this secret path — <code>/admin</code> shows a 404
        to anyone who hasn&apos;t entered through it. Changing it signs every browser out of the
        gate immediately.
      </span>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <span style={{ opacity: 0.6, fontSize: 13 }}>{origin}/</span>
        <input
          className={styles.loginField}
          style={{ marginBlockEnd: 0, maxInlineSize: 240 }}
          name="slug"
          defaultValue={current}
          pattern="[a-z0-9][a-z0-9-]{2,39}"
          required
        />
        <button type="submit" className={styles.exportBtn} style={{ border: 0 }} disabled={pending}>
          {pending ? "Saving…" : "Save"}
        </button>
      </div>
      {state.message ? (
        <div style={{ fontSize: 13, color: state.ok ? "#6fdfb8" : "#ff9d9d" }}>{state.message}</div>
      ) : null}
    </form>
  );
}
