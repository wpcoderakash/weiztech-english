"use client";

import { useActionState } from "react";

import styles from "../admin.module.css";

import { signIn, type LoginState } from "./actions";

const INITIAL: LoginState = { error: null };

export function LoginForm() {
  const [state, action, pending] = useActionState(signIn, INITIAL);

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
