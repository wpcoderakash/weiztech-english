import type { Metadata } from "next";

import { ProductCard } from "@/components/cards";
import { LogoMarquee } from "@/components/decorative";
import { Container, Grid, Section } from "@/components/layout";
import { Reveal } from "@/components/motion";
import { ContactCTA, HeroIntro, PageHero } from "@/components/sections";
import { CONTACT_BAND_STEPS, PRODUCTS_HERO_STEPS } from "@/content/animations/pages";
import {
  PRODUCTS_CATEGORIES as PRODUCTS_CATEGORIES_FALLBACK,
  PRODUCTS_CONTACT_CTA as PRODUCTS_CONTACT_CTA_FALLBACK,
  PRODUCTS_HERO as PRODUCTS_HERO_FALLBACK,
  PRODUCTS_INTRO as PRODUCTS_INTRO_FALLBACK,
} from "@/content/pages/products";
import { getSection } from "@/lib/cms/getContent";
import { VENDOR_LOGOS } from "@/content/site";
import { DESCRIPTIONS, pageMetadata } from "@/lib/seo";

import styles from "./page.module.css";

/** Rank Math-resolved title; the description is CHANGE #30 (lib/seo.ts). */
export const metadata: Metadata = pageMetadata({
  title: "Hardware",
  description: DESCRIPTIONS.products,
  path: "/products/",
});

export default async function ProductsPage() {
  /* C3: content from the CMS; the aliased imports are the byte-identical
     fallbacks (and the CMS_READS=off kill switch). */
  const PRODUCTS_CATEGORIES = await getSection(
    "products",
    "PRODUCTS_CATEGORIES",
    PRODUCTS_CATEGORIES_FALLBACK,
  );
  const PRODUCTS_CONTACT_CTA = await getSection(
    "products",
    "PRODUCTS_CONTACT_CTA",
    PRODUCTS_CONTACT_CTA_FALLBACK,
  );
  const PRODUCTS_HERO = await getSection("products", "PRODUCTS_HERO", PRODUCTS_HERO_FALLBACK);
  const PRODUCTS_INTRO = await getSection("products", "PRODUCTS_INTRO", PRODUCTS_INTRO_FALLBACK);

  return (
    <>
      <Reveal steps={PRODUCTS_HERO_STEPS}>
        <PageHero
          className={styles.hero}
          innerClassName={styles.heroInner}
          headingId="hero-heading"
          heading={PRODUCTS_HERO.heading}
          bodyTone="muted"
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

        {/* Category tiles — source section#mcalbu. The tiles are the last
          step of the hero timeline, so they sit inside it. */}
        <Section id="categories">
          <Container>
            <Grid columns="auto-3" gap="var(--space-m)" className={styles.categoryGrid}>
              {PRODUCTS_CATEGORIES.map((category) => (
                <ProductCard key={category.title} {...category} />
              ))}
            </Grid>
          </Container>
        </Section>
      </Reveal>

      {/* The body paragraph here carries ACSS `.text--s`; Home's does not. */}
      <Reveal steps={CONTACT_BAND_STEPS}>
        <ContactCTA {...PRODUCTS_CONTACT_CTA} bodyScaled />
      </Reveal>
    </>
  );
}
