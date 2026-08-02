"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import { rebuildFromForm } from "@/lib/cms/jsonform";
import { currentAdmin, supabaseAdmin } from "@/lib/supabase/server";

const CAN_EDIT = new Set(["super_admin", "admin", "editor", "content_manager"]);
const CAN_PUBLISH = new Set(["super_admin", "admin", "editor"]);

async function sectionWithPage(id: string) {
  const { data, error } = await supabaseAdmin()
    .from("sections")
    .select("id, type, data, draft_data, pages(slug)")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as unknown as {
    id: string;
    type: string;
    data: unknown;
    draft_data: unknown;
    pages: { slug: string };
  };
}

/** Save the edited fields as a draft — the live site is untouched. */
export async function saveDraft(sectionId: string, formData: FormData): Promise<void> {
  const admin = await currentAdmin();
  if (!admin || !CAN_EDIT.has(admin.role)) return;

  const section = await sectionWithPage(sectionId);
  const base = section.draft_data ?? section.data;
  const next = rebuildFromForm(base, "", formData);

  await supabaseAdmin().from("sections").update({ draft_data: next }).eq("id", sectionId);
  await supabaseAdmin().from("activity_log").insert({
    actor_id: admin.userId,
    action: "section.save_draft",
    entity: "sections",
    entity_id: sectionId,
  });
  revalidatePath(`/admin/pages/${section.pages.slug}/${sectionId}`);
}

/** Publish: previous published data becomes a revision; draft goes live. */
export async function publishSection(sectionId: string): Promise<void> {
  const admin = await currentAdmin();
  if (!admin || !CAN_PUBLISH.has(admin.role)) return;

  const section = await sectionWithPage(sectionId);
  if (section.draft_data == null) return;

  const db = supabaseAdmin();
  await db.from("section_revisions").insert({
    section_id: sectionId,
    data: section.data as object,
    editor_id: admin.userId,
  });
  await db
    .from("sections")
    .update({ data: section.draft_data as object, draft_data: null })
    .eq("id", sectionId);
  await db.from("activity_log").insert({
    actor_id: admin.userId,
    action: "section.publish",
    entity: "sections",
    entity_id: sectionId,
  });
  revalidateTag(`page:${section.pages.slug}`, "max");
  revalidatePath(`/admin/pages/${section.pages.slug}/${sectionId}`);
}

export async function discardDraft(sectionId: string): Promise<void> {
  const admin = await currentAdmin();
  if (!admin || !CAN_EDIT.has(admin.role)) return;
  const section = await sectionWithPage(sectionId);
  await supabaseAdmin().from("sections").update({ draft_data: null }).eq("id", sectionId);
  revalidatePath(`/admin/pages/${section.pages.slug}/${sectionId}`);
}

/** Restore a past revision as the LIVE data (current live becomes a revision). */
export async function restoreRevision(revisionId: string): Promise<void> {
  const admin = await currentAdmin();
  if (!admin || !CAN_PUBLISH.has(admin.role)) return;

  const db = supabaseAdmin();
  const { data: rev, error } = await db
    .from("section_revisions")
    .select("id, data, section_id")
    .eq("id", revisionId)
    .single();
  if (error) throw error;
  const section = await sectionWithPage(rev.section_id);

  await db.from("section_revisions").insert({
    section_id: rev.section_id,
    data: section.data as object,
    editor_id: admin.userId,
  });
  await db.from("sections").update({ data: rev.data, draft_data: null }).eq("id", rev.section_id);
  await db.from("activity_log").insert({
    actor_id: admin.userId,
    action: "section.restore",
    entity: "sections",
    entity_id: rev.section_id,
    diff: { revision: revisionId },
  });
  revalidateTag(`page:${section.pages.slug}`, "max");
  redirect(`/admin/pages/${section.pages.slug}/${rev.section_id}`);
}

/* ---- C8 pilot: section-level order + visibility (ORDERABLE_PAGES only) ---- */

export async function moveSection(sectionId: string, dir: -1 | 1): Promise<void> {
  const admin = await currentAdmin();
  if (!admin || !CAN_PUBLISH.has(admin.role)) return;

  const db = supabaseAdmin();
  const section = await sectionWithPage(sectionId);
  const { data: siblings } = await db
    .from("sections")
    .select("id, sort")
    .eq(
      "page_id",
      (await db.from("pages").select("id").eq("slug", section.pages.slug).single()).data!.id,
    )
    .is("deleted_at", null)
    .order("sort");
  if (!siblings) return;
  const index = siblings.findIndex((s) => s.id === sectionId);
  const other = siblings[index + dir];
  if (index === -1 || !other) return;

  const current = siblings[index]!;
  await db.from("sections").update({ sort: other.sort }).eq("id", current.id);
  await db.from("sections").update({ sort: current.sort }).eq("id", other.id);
  await db.from("activity_log").insert({
    actor_id: admin.userId,
    action: "section.move",
    entity: "sections",
    entity_id: sectionId,
  });
  revalidateTag(`page:${section.pages.slug}`, "max");
  revalidatePath(`/admin/pages/${section.pages.slug}`);
}

export async function toggleSectionEnabled(sectionId: string): Promise<void> {
  const admin = await currentAdmin();
  if (!admin || !CAN_PUBLISH.has(admin.role)) return;

  const db = supabaseAdmin();
  const section = await sectionWithPage(sectionId);
  const { data: row } = await db.from("sections").select("enabled").eq("id", sectionId).single();
  if (!row) return;
  await db.from("sections").update({ enabled: !row.enabled }).eq("id", sectionId);
  await db.from("activity_log").insert({
    actor_id: admin.userId,
    action: row.enabled ? "section.disable" : "section.enable",
    entity: "sections",
    entity_id: sectionId,
  });
  revalidateTag(`page:${section.pages.slug}`, "max");
  revalidatePath(`/admin/pages/${section.pages.slug}`);
}
