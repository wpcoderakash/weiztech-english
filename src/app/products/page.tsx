import type { Metadata } from "next";

import { ProductCard } from "@/components/cards";
import { LogoMarquee } from "@/components/decorative";
import { Container, Grid, Section } from "@/components/layout";
import { ContactCTA, HeroIntro, PageHero } from "@/components/sections";
import {
  PRODUCTS_CATEGORIES,
  PRODUCTS_CONTACT_CTA,
  PRODUCTS_HERO,
  PRODUCTS_INTRO,
} from "@/content/pages/products";
import { VENDOR_LOGOS } from "@/content/site";

import styles from "./page.module.css";

/**
 * Placeholder metadata; the full set lands in Phase 13.
 *
 * The title resolves through the site pattern `%title% - Weiz Technologies`.
 * No description is set here: the source's is Hebrew on an English page, and
 * whether to carry the four Hebrew descriptions forward or write English ones
 * is open decision B in PHASE-5 §11.
 */
export const metadata: Metadata = {
  title: "Hardware - Weiz Technologies",
};

export default function ProductsPage() {
  return (
    <>
      <PageHero
        className={styles.hero}
        innerClassName={styles.heroInner}
        headingId="hero-heading"
        heading={PRODUCTS_HERO.heading}
        body={PRODUCTS_HERO.body}
        after={
          <>
            <HeroIntro
              eyebrow={{ label: PRODUCTS_INTRO.eyebrow, icon: "ion-ios-bookmark" }}
              heading={PRODUCTS_INTRO.heading}
              body={PRODUCTS_INTRO.body}
            />
            <Container>
              <LogoMarquee logos={VENDOR_LOGOS} />
            </Container>
          </>
        }
      />

      {/* Category tiles — source section#mcalbu */}
      <Section id="categories">
        <Container>
          <Grid columns="auto-3" gap="var(--space-m)" className={styles.categoryGrid}>
            {PRODUCTS_CATEGORIES.map((category) => (
              <ProductCard key={category.title} {...category} />
            ))}
          </Grid>
        </Container>
      </Section>

      {/* The body paragraph here carries ACSS `.text--s`; Home's does not. */}
      <ContactCTA {...PRODUCTS_CONTACT_CTA} bodyScaled />
    </>
  );
}
