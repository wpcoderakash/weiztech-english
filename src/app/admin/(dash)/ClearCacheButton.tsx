"use client";

import { useActionState } from "react";

import styles from "../admin.module.css";

import { clearSiteCache, type ClearCacheState } from "./cache-actions";

const INITIAL: ClearCacheState = { message: null, ok: false };

export function ClearCacheButton() {
  const [state, action, pending] = useActionState(clearSiteCache, INITIAL);

  return (
    <form
      action={action}
      style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}
    >
      <button type="submit" className={styles.miniBtn} disabled={pending}>
        {pending ? "Clearing…" : "🧹 Clear site cache"}
      </button>
      {state.message ? (
        <span style={{ fontSize: 12.5, color: state.ok ? "#6fdfb8" : "#ff9d9d" }}>
          {state.message}
        </span>
      ) : null}
    </form>
  );
}
