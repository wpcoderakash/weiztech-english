"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { rebuildFromForm } from "@/lib/cms/jsonform";
import { currentAdmin, supabaseAdmin } from "@/lib/supabase/server";

import type { EditorState } from "./editor-state";

const CAN_EDIT = new Set(["super_admin", "admin", "editor", "content_manager"]);
const CAN_PUBLISH = new Set(["super_admin", "admin", "editor"]);

/**
 * Every editor action answers the only question the person clicking has:
 * did it work? These used to return void, so a permission failure, a database
 * error and a success were all indistinguishable — the page just sat there.
 */
function done(ok: boolean, message: string): EditorState {
  return { ok, message, at: Date.now() };
}

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
export async function saveDraft(
  sectionId: string,
  _prev: EditorState,
  formData: FormData,
): Promise<EditorState> {
  const admin = await currentAdmin();
  if (!admin || !CAN_EDIT.has(admin.role)) {
    return done(false, "You do not have permission to edit this section.");
  }

  const section = await sectionWithPage(sectionId);
  const base = section.draft_data ?? section.data;
  const next = rebuildFromForm(base, "", formData);

  const { error } = await supabaseAdmin()
    .from("sections")
    .update({ draft_data: next })
    .eq("id", sectionId);
  if (error) {
    console.error(`[pages] draft save failed for ${sectionId}: ${error.message}`);
    return done(false, "Could not save. Your changes are still on screen — try again.");
  }
  await supabaseAdmin().from("activity_log").insert({
    actor_id: admin.userId,
    action: "section.save_draft",
    entity: "sections",
    entity_id: sectionId,
  });
  revalidatePath(`/admin/pages/${section.pages.slug}/${sectionId}`);
  return done(true, "Draft saved. Click Publish to put it on the live site.");
}

/** Publish: previous published data becomes a revision; draft goes live. */
export async function publishSection(
  sectionId: string,
  _prev: EditorState,
  _formData: FormData,
): Promise<EditorState> {
  const admin = await currentAdmin();
  if (!admin || !CAN_PUBLISH.has(admin.role)) {
    return done(false, "You do not have permission to publish. Ask an editor or admin.");
  }

  const section = await sectionWithPage(sectionId);
  if (section.draft_data == null) return done(false, "There is no draft to publish.");

  const db = supabaseAdmin();
  /* The revision IS the backup of what is about to be overwritten. If it does
     not land, publishing would destroy the current live version with nothing
     to roll back to — so this must succeed before the section is touched. */
  const { error: revisionError } = await db.from("section_revisions").insert({
    section_id: sectionId,
    data: section.data as object,
    editor_id: admin.userId,
  });
  if (revisionError) {
    console.error(`[pages] publish aborted — revision backup failed: ${revisionError.message}`);
    return done(
      false,
      "Could not publish: the backup of the current version failed. Nothing changed.",
    );
  }
  const { error: publishError } = await db
    .from("sections")
    .update({ data: section.draft_data as object, draft_data: null })
    .eq("id", sectionId);
  if (publishError) {
    console.error(`[pages] publish failed for ${sectionId}: ${publishError.message}`);
    return done(false, "Could not publish. Nothing changed — try again.");
  }
  await db.from("activity_log").insert({
    actor_id: admin.userId,
    action: "section.publish",
    entity: "sections",
    entity_id: sectionId,
  });
  revalidateTag(`page:${section.pages.slug}`, "max");
  revalidatePath(`/admin/pages/${section.pages.slug}/${sectionId}`);
  return done(
    true,
    `Published. It is live on /${section.pages.slug === "home" ? "" : section.pages.slug + "/"} now.`,
  );
}

export async function discardDraft(
  sectionId: string,
  _prev: EditorState,
  _formData: FormData,
): Promise<EditorState> {
  const admin = await currentAdmin();
  if (!admin || !CAN_EDIT.has(admin.role)) {
    return done(false, "You do not have permission to edit this section.");
  }
  const section = await sectionWithPage(sectionId);
  const { error } = await supabaseAdmin()
    .from("sections")
    .update({ draft_data: null })
    .eq("id", sectionId);
  if (error) {
    console.error(`[pages] discard draft failed for ${sectionId}: ${error.message}`);
    return done(false, "Could not discard the draft — try again.");
  }
  /* Discarding destroys unpublished work — it belongs in the audit trail
     alongside save_draft and publish. */
  await supabaseAdmin().from("activity_log").insert({
    actor_id: admin.userId,
    action: "section.discard_draft",
    entity: "sections",
    entity_id: sectionId,
  });
  revalidatePath(`/admin/pages/${section.pages.slug}/${sectionId}`);
  return done(true, "Draft discarded. You are back to the published version.");
}

/** Restore a past revision as the LIVE data (current live becomes a revision). */
export async function restoreRevision(
  revisionId: string,
  _prev: EditorState,
  _formData: FormData,
): Promise<EditorState> {
  const admin = await currentAdmin();
  if (!admin || !CAN_PUBLISH.has(admin.role)) {
    return done(false, "You do not have permission to restore a version.");
  }

  const db = supabaseAdmin();
  const { data: rev, error } = await db
    .from("section_revisions")
    .select("id, data, section_id")
    .eq("id", revisionId)
    .single();
  if (error) throw error;
  const section = await sectionWithPage(rev.section_id);

  /* Same rule as publish: back up the live version before replacing it. */
  const { error: revisionError } = await db.from("section_revisions").insert({
    section_id: rev.section_id,
    data: section.data as object,
    editor_id: admin.userId,
  });
  if (revisionError) {
    console.error(`[pages] restore aborted — revision backup failed: ${revisionError.message}`);
    return done(
      false,
      "Could not restore: backing up the current version failed. Nothing changed.",
    );
  }
  const { error: restoreError } = await db
    .from("sections")
    .update({ data: rev.data, draft_data: null })
    .eq("id", rev.section_id);
  if (restoreError) {
    console.error(`[pages] restore failed for ${rev.section_id}: ${restoreError.message}`);
    return done(false, "Could not restore that version — try again.");
  }
  await db.from("activity_log").insert({
    actor_id: admin.userId,
    action: "section.restore",
    entity: "sections",
    entity_id: rev.section_id,
    diff: { revision: revisionId },
  });
  revalidateTag(`page:${section.pages.slug}`, "max");
  revalidatePath(`/admin/pages/${section.pages.slug}/${rev.section_id}`);
  return done(true, "That version is restored and live.");
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
