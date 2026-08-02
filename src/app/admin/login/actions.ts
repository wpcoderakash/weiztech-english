"use server";

import { redirect } from "next/navigation";

import { supabaseAuth } from "@/lib/supabase/server";

export interface LoginState {
  error: string | null;
}

export async function signIn(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Email and password are required." };

  const supabase = await supabaseAuth();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Wrong email or password." };
  redirect("/admin");
}

export async function signOut(): Promise<void> {
  const supabase = await supabaseAuth();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
