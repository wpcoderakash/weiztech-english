/**
 * C2 seed — ingests the in-repo content modules VERBATIM into Supabase.
 *
 * Sections are keyed by their export name (HOME_HERO, PRIVACY_BLOCKS, …) so
 * the read path (`getSection(page, key, fallback)`) maps 1:1 onto today's
 * imports and the fallback is always the byte-identical in-repo constant.
 *
 * Run: node --env-file=.env.local --experimental-strip-types supabase/seed.ts
 * Idempotent: upserts by (page slug, key) and by post slug.
 */
import { createClient } from "@supabase/supabase-js";

import * as careers from "../src/content/pages/careers.ts";
import * as contact from "../src/content/pages/contact.ts";
import * as cybersec from "../src/content/pages/cybersec.ts";
import * as home from "../src/content/pages/home.ts";
import * as privacy from "../src/content/pages/privacy.ts";
import * as products from "../src/content/pages/products.ts";
import * as quote from "../src/content/pages/quote.ts";
import * as software from "../src/content/pages/software.ts";
import * as webapps from "../src/content/pages/webapps.ts";
import { POSTS } from "../src/content/posts/index.ts";
import * as site from "../src/content/site.ts";

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const PAGES: Record<string, { name: string; module: Record<string, unknown> }> = {
  home: { name: "Home", module: home },
  products: { name: "Hardware", module: products },
  software: { name: "Technologies", module: software },
  webapps: { name: "Web Development", module: webapps },
  cybersec: { name: "Cybersecurity", module: cybersec },
  careers: { name: "Careers", module: careers },
  "contact-us": { name: "Contact", module: contact },
  quote: { name: "Get a Quote", module: quote },
  "privacy-policy": { name: "Privacy Policy", module: privacy },
};

async function main() {
  // pages + sections
  for (const [slug, { name, module }] of Object.entries(PAGES)) {
    const { data: page, error } = await db
      .from("pages")
      .upsert({ slug, name, status: "published" }, { onConflict: "slug" })
      .select("id")
      .single();
    if (error) throw error;

    let sort = 0;
    for (const [key, value] of Object.entries(module)) {
      if (typeof value === "function") continue;
      const { data: existing } = await db
        .from("sections")
        .select("id")
        .eq("page_id", page.id)
        .eq("type", key)
        .maybeSingle();
      const row = {
        page_id: page.id,
        type: key,
        sort: sort++,
        enabled: true,
        data: value as object,
      };
      const res = existing
        ? await db.from("sections").update(row).eq("id", existing.id)
        : await db.from("sections").insert(row);
      if (res.error) throw res.error;
    }
    console.log(`seeded page ${slug} (${Object.keys(module).length} sections)`);
  }

  // site-wide: navigation + settings
  const navs: Record<string, unknown> = {
    header: site.HEADER_NAV,
    footer_quick: site.FOOTER_QUICK_LINKS,
    footer_services: site.FOOTER_SERVICES,
    mobile: site.MOBILE_MENU,
  };
  for (const [key, items] of Object.entries(navs)) {
    const { error } = await db.from("navigation_menus").upsert({ key, items: items as object });
    if (error) throw error;
  }
  const settings: Record<string, unknown> = {
    site: site.SITE,
    vendor_logos: site.VENDOR_LOGOS,
    language_toggle: site.LANGUAGE_TOGGLE,
    offices: site.OFFICES,
    socials: site.SOCIALS,
    footer_intro: site.FOOTER_INTRO,
    copyright: site.COPYRIGHT,
    contact: site.CONTACT,
  };
  for (const [key, value] of Object.entries(settings)) {
    const { error } = await db.from("settings").upsert({ key, value: value as object });
    if (error) throw error;
  }
  console.log("seeded navigation + settings");

  // blog — category objects carry slug+label; the whole post (incl. blocks)
  // goes into body verbatim so the read path can return it 1:1.
  const cats = new Map<string, string>();
  for (const post of POSTS) {
    if (!cats.has(post.category.slug)) {
      const { data, error } = await db
        .from("categories")
        .upsert({ slug: post.category.slug, name: post.category.label }, { onConflict: "slug" })
        .select("id")
        .single();
      if (error) throw error;
      cats.set(post.category.slug, data.id);
    }
  }
  for (const post of POSTS) {
    const { error } = await db.from("posts").upsert(
      {
        slug: post.slug,
        title: post.title,
        category_id: cats.get(post.category.slug),
        excerpt: post.excerpt,
        body: post as unknown as object,
        status: "published",
        published_at: new Date(post.publishedAt.replace(" ", "T") + "Z").toISOString(),
      },
      { onConflict: "slug" },
    );
    if (error) throw error;
  }
  console.log(`seeded ${POSTS.length} posts, ${cats.size} categories`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
