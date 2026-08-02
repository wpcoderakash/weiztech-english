"use server";

import { redirect } from "next/navigation";

import { mfaState, supabaseAuth } from "@/lib/supabase/server";

export interface LoginState {
  error: string | null;
  needsCode?: boolean;
}

export async function signIn(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Email and password are required." };

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
