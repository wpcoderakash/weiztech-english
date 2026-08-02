"use client";

import { useActionState } from "react";

import styles from "../../admin.module.css";

import { confirmEnroll, startEnroll, type EnrollState } from "./actions";

const INITIAL: EnrollState = {
  qrSvg: null,
  secret: null,
  factorId: null,
  message: null,
  done: false,
};

export function EnrollForm() {
  const [state, start, starting] = useActionState(startEnroll, INITIAL);
  const [confirm, confirmAction, confirming] = useActionState(confirmEnroll, INITIAL);

  if (confirm.done) {
    return (
      <div style={{ color: "#6fdfb8", fontSize: 14 }}>
        ✓ Two-factor authentication is ON. From now on, sign-in asks for a code from your app.
      </div>
    );
  }

  const active = confirm.factorId ? confirm : state;

  if (!active.qrSvg) {
    return (
      <form action={start}>
        <p style={{ fontSize: 13, color: "#c9c3d9", marginBlockEnd: 12 }}>
          Protect the dashboard with Google Authenticator (or any TOTP app): after your password,
          sign-in will require a 6-digit code from your phone.
        </p>
        <button
          type="submit"
          className={styles.exportBtn}
          style={{ border: 0 }}
          disabled={starting}
        >
          {starting ? "Preparing…" : "Set up 2FA"}
        </button>
        {state.message ? <div className={styles.loginError}>{state.message}</div> : null}
      </form>
    );
  }

  return (
    <div style={{ display: "grid", gap: 12, maxInlineSize: 480 }}>
      <p style={{ fontSize: 13, color: "#c9c3d9" }}>
        1. Open Google Authenticator → <strong>+</strong> → <em>Scan a QR code</em>
      </p>
      <div style={{ background: "#fff", borderRadius: 12, padding: 10, inlineSize: 190 }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- Supabase returns the QR as a data URI */}
        <img src={active.qrSvg} alt="Scan with Google Authenticator" width={170} height={170} />
      </div>
      <p style={{ fontSize: 12, color: "#8b84a0" }}>
        Can&apos;t scan? Enter this key manually:{" "}
        <code style={{ userSelect: "all" }}>{active.secret}</code>
      </p>
      <form action={confirmAction} style={{ display: "flex", gap: 8 }}>
        <input type="hidden" name="factorId" value={active.factorId ?? ""} />
        <input
          className={styles.loginField}
          style={{ marginBlockEnd: 0, maxInlineSize: 160 }}
          name="code"
          inputMode="numeric"
          placeholder="6-digit code"
          maxLength={7}
          required
        />
        <button
          type="submit"
          className={styles.exportBtn}
          style={{ border: 0 }}
          disabled={confirming}
        >
          {confirming ? "Verifying…" : "Activate"}
        </button>
      </form>
      {active.message ? <div className={styles.loginError}>{active.message}</div> : null}
    </div>
  );
}
