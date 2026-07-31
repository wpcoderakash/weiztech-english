import type { MetadataRoute } from "next";

import { POSTS } from "@/content/posts";
import { SITE_URL } from "@/lib/seo";

/**
 * Single sitemap, 19 URLs — PHASE-4 §5. Replaces Rank Math's three-file
 * index; the legacy sitemap paths 301 here (next.config.ts).
 *
 * The live page-sitemap omits `/blog/` by accident; this one includes it.
 * Post lastModified comes from the WordPress modified timestamps.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "/",
    "/products/",
    "/software/",
    "/webapps/",
    "/cybersec/",
    "/careers/",
    "/contact-us/",
    "/quote/",
    "/privacy-policy/",
    "/blog/",
  ].map((path) => ({ url: `${SITE_URL}${path}` }));

  const posts = POSTS.map((post) => ({
    url: `${SITE_URL}/${post.slug}/`,
    lastModified: post.modified,
  }));

  return [...pages, ...posts];
}
