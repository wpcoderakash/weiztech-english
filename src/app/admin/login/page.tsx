import { redirect } from "next/navigation";

import type { Metadata } from "next";

import { currentAdmin } from "@/lib/supabase/server";

import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin — Sign in",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const admin = await currentAdmin();
  if (admin) redirect("/admin");
  return <LoginForm />;
}
