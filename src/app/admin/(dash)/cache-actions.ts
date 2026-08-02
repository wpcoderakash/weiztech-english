"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { currentAdmin, supabaseAdmin } from "@/lib/supabase/server";

const CAN_CLEAR = new Set(["super_admin", "admin", "editor"]);

export interface ClearCacheState {
  message: string | null;
  ok: boolean;
}

/**
 * Clear every content cache: all page tags, the blog tag, the site-wide
 * chrome tag, and the full route cache. The next visit to any page
 * regenerates it from the database.
 */
export async function clearSiteCache(
  _prev: ClearCacheState,
  _formData: FormData,
): Promise<ClearCacheState> {
  const admin = await currentAdmin();
  if (!admin || !CAN_CLEAR.has(admin.role)) {
    return { message: "You need editor access to clear the cache.", ok: false };
  }

  const { data: pages } = await supabaseAdmin().from("pages").select("slug");
  for (const page of pages ?? []) {
    revalidateTag(`page:${page.slug}`, "max");
  }
  revalidateTag("posts", "max");
  revalidateTag("site", "max");
  revalidatePath("/", "layout");

  await supabaseAdmin().from("activity_log").insert({
    actor_id: admin.userId,
    action: "cache.clear",
    entity: "system",
    entity_id: "site-cache",
  });
  return {
    message: `Cache cleared (${(pages ?? []).length} pages + blog + site chrome). Pages rebuild on next visit.`,
    ok: true,
  };
}
