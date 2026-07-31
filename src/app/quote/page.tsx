import type { Metadata } from "next";

import { QuoteForm } from "@/components/forms";
import { Container } from "@/components/layout";
import { PageHero } from "@/components/sections";
import { QUOTE_HERO } from "@/content/pages/quote";

import styles from "./page.module.css";

/** Placeholder metadata; the full set lands in Phase 13. */
export const metadata: Metadata = {
  title: "Get a Quote - Weiz Technologies",
};

/**
 * `/quote/` — source page ID 3725. One section holding a centred hero and,
 * below it, a second container with the eight-field form.
 *
 * `bricksforge_timelines.json` has no entry for 3725, so — like
 * /privacy-policy/ — nothing on this page animates.
 */
export default function QuotePage() {
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
