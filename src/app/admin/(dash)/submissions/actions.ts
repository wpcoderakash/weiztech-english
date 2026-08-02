"use server";

import { revalidatePath } from "next/cache";

import { currentAdmin, supabaseAdmin } from "@/lib/supabase/server";

const CAN_MANAGE = new Set(["super_admin", "admin", "editor"]);

export async function setSubmissionStatus(id: string, status: string): Promise<void> {
  const admin = await currentAdmin();
  if (!admin || !CAN_MANAGE.has(admin.role)) return;
  if (!["new", "read", "replied", "spam"].includes(status)) return;

  const db = supabaseAdmin();
  await db.from("form_submissions").update({ status }).eq("id", id);
  await db.from("activity_log").insert({
    actor_id: admin.userId,
    action: `submission.${status}`,
    entity: "form_submissions",
    entity_id: id,
  });
  revalidatePath("/admin/submissions");
  revalidatePath("/admin");
}
