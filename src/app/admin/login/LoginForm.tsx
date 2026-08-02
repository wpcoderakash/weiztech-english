"use client";

import { useActionState } from "react";

import styles from "../admin.module.css";

import { signIn, verifyLoginCode, type LoginState } from "./actions";

const INITIAL: LoginState = { error: null };

export function LoginForm() {
  const [state, action, pending] = useActionState(signIn, INITIAL);
  const [codeState, codeAction, codePending] = useActionState(verifyLoginCode, INITIAL);

  if (state.needsCode || codeState.needsCode) {
    return (
      <div className={styles.loginWrap}>
        <form className={styles.loginCard} action={codeAction}>
          <div className={styles.loginTitle}>Two-factor code</div>
          <div className={styles.loginSub}>Enter the 6-digit code from Google Authenticator</div>
          <input
            className={styles.loginField}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            name="code"
            placeholder="123 456"
            maxLength={7}
            autoFocus
            required
          />
          <button className={styles.loginBtn} type="submit" disabled={codePending}>
            {codePending ? "Checking…" : "Verify"}
          </button>
          {codeState.error ? <div className={styles.loginError}>{codeState.error}</div> : null}
        </form>
      </div>
    );
  }

  return (
    <div className={styles.loginWrap}>
      <form className={styles.loginCard} action={action}>
        <div className={styles.loginTitle}>WeizTech Admin</div>
        <div className={styles.loginSub}>Sign in to manage the site</div>
        <input
          className={styles.loginField}
          type="email"
          name="email"
          placeholder="Email"
          autoComplete="email"
          required
        />
        <input
          className={styles.loginField}
          type="password"
          name="password"
          placeholder="Password"
          autoComplete="current-password"
          required
        />
        <button className={styles.loginBtn} type="submit" disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </button>
        {state.error ? <div className={styles.loginError}>{state.error}</div> : null}
      </form>
    </div>
  );
}
