"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { currentAdmin, supabaseAdmin } from "@/lib/supabase/server";

const CAN_EDIT = new Set(["super_admin", "admin", "editor"]);

export async function saveSeo(slug: string, formData: FormData): Promise<void> {
  const admin = await currentAdmin();
  if (!admin || !CAN_EDIT.has(admin.role)) return;

  const title = String(formData.get("title") ?? "")
    .trim()
    .slice(0, 120);
  const description = String(formData.get("description") ?? "")
    .trim()
    .slice(0, 300);
  const seo: Record<string, string> = {};
  if (title) seo.title = title;
  if (description) seo.description = description;

  await supabaseAdmin().from("pages").update({ seo }).eq("slug", slug);
  await supabaseAdmin().from("activity_log").insert({
    actor_id: admin.userId,
    action: "seo.update",
    entity: "pages",
    entity_id: slug,
  });
  revalidateTag(`page:${slug}`, "max");
  revalidatePath("/admin/seo");
}
