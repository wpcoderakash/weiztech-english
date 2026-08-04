"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { mfaState, supabaseAuth } from "@/lib/supabase/server";

export interface LoginState {
  error: string | null;
  needsCode?: boolean;
}

/**
 * Brute-force protection — 10 attempts per IP per 15 minutes, covering both
 * the password step and the 2FA code step. Same in-memory pattern as the
 * public forms (per-instance, resets on deploy): with the hidden gate slug
 * in front this stops credential stuffing without a new dependency.
 */
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;
const attempts = new Map<string, number[]>();

async function loginRateLimited(): Promise<boolean> {
  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headerList.get("x-real-ip") ??
    "unknown";
  const now = Date.now();
  const recent = (attempts.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  attempts.set(ip, recent);
  if (attempts.size > 5000) {
    for (const [key, times] of attempts) {
      if (times.every((t) => now - t >= WINDOW_MS)) attempts.delete(key);
    }
  }
  return recent.length > MAX_ATTEMPTS;
}

const RATE_LIMIT_MESSAGE = "Too many attempts. Wait a few minutes and try again.";

export async function signIn(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Email and password are required." };
  if (await loginRateLimited()) return { error: RATE_LIMIT_MESSAGE };

  const supabase = await supabaseAuth();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Wrong email or password." };

  /* 2FA: a user with a verified authenticator must enter a code. */
  const mfa = await mfaState();
  if (mfa.needsCode) return { error: null, needsCode: true };
  redirect("/admin");
}

export async function verifyLoginCode(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const code = String(formData.get("code") ?? "").replace(/\s+/g, "");
  if (!/^\d{6}$/.test(code)) return { error: "Enter the 6-digit code.", needsCode: true };
  if (await loginRateLimited()) return { error: RATE_LIMIT_MESSAGE, needsCode: true };

  const supabase = await supabaseAuth();
  const mfa = await mfaState();
  if (!mfa.signedIn || !mfa.factorId) return { error: "Session expired — sign in again." };

  const { data: challenge, error: cErr } = await supabase.auth.mfa.challenge({
    factorId: mfa.factorId,
  });
  if (cErr || !challenge) return { error: "Could not start verification.", needsCode: true };
  const { error: vErr } = await supabase.auth.mfa.verify({
    factorId: mfa.factorId,
    challengeId: challenge.id,
    code,
  });
  if (vErr) return { error: "Wrong code — try again.", needsCode: true };
  redirect("/admin");
}

export async function signOut(): Promise<void> {
  const supabase = await supabaseAuth();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
