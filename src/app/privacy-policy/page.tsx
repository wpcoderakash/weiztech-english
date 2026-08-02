import type { Metadata } from "next";

import { PostBody } from "@/components/blog";
import { Container, Section } from "@/components/layout";
import { PageHero } from "@/components/sections";
import { PRIVACY_BLOCKS, PRIVACY_HERO } from "@/content/pages/privacy";
import { getSection, getSeo } from "@/lib/cms/getContent";
import { DESCRIPTIONS, pageMetadata } from "@/lib/seo";

import styles from "./page.module.css";

/** Rank Math-resolved title; the description is CHANGE #30 (lib/seo.ts). */
const METADATA_FALLBACK = {
  title: "Terms of Use & Privacy Policy",
  description: DESCRIPTIONS.privacy,
  path: "/privacy-policy/",
};

/* C7: SEO title/description from the CMS (pages.seo), falling back to the
   values above; path and og settings stay code-owned. */
export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeo("privacy-policy", {
    title: METADATA_FALLBACK.title,
    description: METADATA_FALLBACK.description,
  });
  return pageMetadata({ ...METADATA_FALLBACK, ...seo });
}

/**
 * `/privacy-policy/` — source page ID 845, the simplest route on the site:
 * a hero and one rich-text element, no CTA band and no animations.
 *
 * `bricksforge_timelines.json` has no entry for 845, so unlike the seven pages
 * wired in Phase 11 there is nothing to reveal on scroll. The source still
 * carries a stray `brf-prevent-fouc` block (#brxe-feknvf) with no children —
 * a leftover from the animation plugin, and nothing to reproduce.
 *
 * PostBody is the blog's renderer, reused verbatim. It is a typed-block
 * renderer, not a blog-specific one, and the legal copy is the same
 * headings-and-paragraphs shape.
 */
export default async function PrivacyPolicyPage() {
  /* C2 pilot: content comes from the CMS, with the in-repo constants as the
     byte-identical fallback (and the CMS_READS=off kill switch). */
  const [hero, blocks] = await Promise.all([
    getSection("privacy-policy", "PRIVACY_HERO", PRIVACY_HERO),
    getSection("privacy-policy", "PRIVACY_BLOCKS", PRIVACY_BLOCKS),
  ]);

  return (
    <>
      {/* Hero — source section#nvfdcd. */}
      <PageHero className={styles.hero} headingId="privacy-heading" heading={hero.heading} />

      {/* Body — source section#kwvmxa, container#hqesbg at width--l. */}
      <Section className={styles.bodySection}>
        <Container className={styles.bodyInner}>
          <PostBody blocks={blocks} flow="document" />
        </Container>
      </Section>
    </>
  );
}
