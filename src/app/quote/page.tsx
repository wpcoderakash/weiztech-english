import type { Metadata } from "next";

import { QuoteForm } from "@/components/forms";
import { Container } from "@/components/layout";
import { PageHero } from "@/components/sections";
import { QUOTE_HERO as QUOTE_HERO_FALLBACK } from "@/content/pages/quote";
import { getSection, getSeo } from "@/lib/cms/getContent";
import { DESCRIPTIONS, pageMetadata } from "@/lib/seo";

import styles from "./page.module.css";

/** Rank Math-resolved title; the description is CHANGE #30 (lib/seo.ts). */
const METADATA_FALLBACK = {
  title: "Get a Quote",
  description: DESCRIPTIONS.quote,
  path: "/quote/",
};

/* C7: SEO title/description from the CMS (pages.seo), falling back to the
   values above; path and og settings stay code-owned. */
export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeo("quote", {
    title: METADATA_FALLBACK.title,
    description: METADATA_FALLBACK.description,
  });
  return pageMetadata({ ...METADATA_FALLBACK, ...seo });
}

/**
 * `/quote/` — source page ID 3725. One section holding a centred hero and,
 * below it, a second container with the eight-field form.
 *
 * `bricksforge_timelines.json` has no entry for 3725, so — like
 * /privacy-policy/ — nothing on this page animates.
 */
export default async function QuotePage() {
  /* C3: content from the CMS; the aliased imports are the byte-identical
     fallbacks (and the CMS_READS=off kill switch). */
  const QUOTE_HERO = await getSection("quote", "QUOTE_HERO", QUOTE_HERO_FALLBACK);

  return (
    <PageHero
      className={styles.hero}
      headingId="quote-heading"
      heading={QUOTE_HERO.heading}
      body={QUOTE_HERO.body}
      bodyTone="white"
      bodyGap="xs"
      innerClassName={styles.heroInner}
      after={
        /* container#gtkmmm — a separate container from the hero copy, centred
           on both axes, holding the form. */
        <Container className={styles.formContainer}>
          <QuoteForm />
        </Container>
      }
    />
  );
}
