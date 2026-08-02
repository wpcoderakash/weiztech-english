import "server-only";

import { cookies } from "next/headers";

import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

/**
 * Two server-side clients:
 *
 * - `supabaseAuth()` — cookie-bound, used ONLY for auth (who is logged in).
 * - `supabaseAdmin()` — service role, bypasses RLS; every call site must
 *   check the caller's role first (RLS is deny-all by design, so nothing
 *   works without coming through here).
 */
export async function supabaseAuth() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (all) => {
          for (const { name, value, options } of all) cookieStore.set(name, value, options);
        },
      },
    },
  );
}

export function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}

export type AppRole = "super_admin" | "admin" | "editor" | "content_manager" | "author" | "viewer";

/** Session + role for the current request, or null when not signed in. */
export async function currentAdmin(): Promise<{
  userId: string;
  email: string;
  role: AppRole;
} | null> {
  const auth = await supabaseAuth();
  const { data } = await auth.auth.getUser();
  if (!data.user) return null;
  const { data: profile } = await supabaseAdmin()
    .from("profiles")
    .select("role, name")
    .eq("user_id", data.user.id)
    .single();
  if (!profile) return null;
  return { userId: data.user.id, email: data.user.email ?? "", role: profile.role as AppRole };
}
