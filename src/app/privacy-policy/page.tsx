import type { Metadata } from "next";

import { PostBody } from "@/components/blog";
import { Container, Section } from "@/components/layout";
import { PageHero } from "@/components/sections";
import { PRIVACY_BLOCKS, PRIVACY_HERO } from "@/content/pages/privacy";

import styles from "./page.module.css";

/** Placeholder metadata; the full set lands in Phase 13. */
export const metadata: Metadata = {
  title: "Terms of Use & Privacy Policy - Weiz Technologies",
};

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
export default function PrivacyPolicyPage() {
  return (
    <>
      {/* Hero — source section#nvfdcd. */}
      <PageHero
        className={styles.hero}
        headingId="privacy-heading"
        heading={PRIVACY_HERO.heading}
      />

      {/* Body — source section#kwvmxa, container#hqesbg at width--l. */}
      <Section className={styles.bodySection}>
        <Container className={styles.bodyInner}>
          <PostBody blocks={PRIVACY_BLOCKS} flow="document" />
        </Container>
      </Section>
    </>
  );
}
