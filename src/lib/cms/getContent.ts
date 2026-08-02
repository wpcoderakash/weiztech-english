import "server-only";

import { unstable_cache } from "next/cache";

import { supabaseAdmin } from "@/lib/supabase/server";

/**
 * C2 read path — pages fetch their published sections from Supabase, keyed
 * by the export name the section was seeded from (HOME_HERO, PRIVACY_BLOCKS…).
 *
 * Resilience contract (the kill switch of the migration plan):
 *  - `CMS_READS=off` → every call returns its fallback (the in-repo constant)
 *  - any fetch/shape error → fallback, with a server-side warning
 * So a Supabase outage can never take a public page down, and reverting the
 * whole CMS is one env var — no deploy.
 *
 * Caching: tag-based (`page:{slug}`), so a future publish action calls
 * revalidateTag and statically-generated pages regenerate; there is no
 * per-request DB round trip on hot paths.
 */
const sectionsFor = (slug: string) =>
  unstable_cache(
    async () => {
      const { data, error } = await supabaseAdmin()
        .from("sections")
        .select("type, data, enabled")
        .eq("page_id", await pageId(slug))
        .is("deleted_at", null);
      if (error) throw error;
      return data;
    },
    ["cms-sections", slug],
    { tags: [`page:${slug}`] },
  )();

async function pageId(slug: string): Promise<string> {
  const { data, error } = await supabaseAdmin()
    .from("pages")
    .select("id")
    .eq("slug", slug)
    .single();
  if (error) throw error;
  return data.id;
}

export async function getSection<T>(pageSlug: string, key: string, fallback: T): Promise<T> {
  if (process.env.CMS_READS === "off") return fallback;
  try {
    const rows = await sectionsFor(pageSlug);
    const hit = rows.find((r) => r.type === key && r.enabled);
    if (!hit) return fallback;
    return hit.data as T;
  } catch (cause) {
    console.warn(`[cms] getSection(${pageSlug}, ${key}) fell back:`, cause);
    return fallback;
  }
}
