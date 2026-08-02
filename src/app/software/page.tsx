import type { Metadata } from "next";

import { ProductCard } from "@/components/cards";
import { LogoMarquee } from "@/components/decorative";
import { Container, Grid, Section } from "@/components/layout";
import { Reveal } from "@/components/motion";
import { ContactCTA, HeroIntro, PageHero } from "@/components/sections";
import { SOFTWARE_CONTACT_STEPS, SOFTWARE_HERO_STEPS } from "@/content/animations/pages";
import {
  SOFTWARE_CONTACT_CTA as SOFTWARE_CONTACT_CTA_FALLBACK,
  SOFTWARE_HERO as SOFTWARE_HERO_FALLBACK,
  SOFTWARE_INTRO as SOFTWARE_INTRO_FALLBACK,
  SOFTWARE_SERVICES as SOFTWARE_SERVICES_FALLBACK,
  SOFTWARE_TECH_LOGOS as SOFTWARE_TECH_LOGOS_FALLBACK,
} from "@/content/pages/software";
import { getSection } from "@/lib/cms/getContent";
import { DESCRIPTIONS, pageMetadata } from "@/lib/seo";

import styles from "./page.module.css";

/** Rank Math-resolved title; the description is CHANGE #30 (lib/seo.ts). */
export const metadata: Metadata = pageMetadata({
  title: "Software",
  description: DESCRIPTIONS.software,
  path: "/software/",
});

export default async function SoftwarePage() {
  /* C3: content from the CMS; the aliased imports are the byte-identical
     fallbacks (and the CMS_READS=off kill switch). */
  const SOFTWARE_CONTACT_CTA = await getSection(
    "software",
    "SOFTWARE_CONTACT_CTA",
    SOFTWARE_CONTACT_CTA_FALLBACK,
  );
  const SOFTWARE_HERO = await getSection("software", "SOFTWARE_HERO", SOFTWARE_HERO_FALLBACK);
  const SOFTWARE_INTRO = await getSection("software", "SOFTWARE_INTRO", SOFTWARE_INTRO_FALLBACK);
  const SOFTWARE_SERVICES = await getSection(
    "software",
    "SOFTWARE_SERVICES",
    SOFTWARE_SERVICES_FALLBACK,
  );
  const SOFTWARE_TECH_LOGOS = await getSection(
    "software",
    "SOFTWARE_TECH_LOGOS",
    SOFTWARE_TECH_LOGOS_FALLBACK,
  );

  return (
    <>
      <Reveal steps={SOFTWARE_HERO_STEPS}>
        <PageHero
          className={styles.hero}
          innerClassName={styles.heroInner}
          headingId="hero-heading"
          heading={SOFTWARE_HERO.heading}
          bodyTone="muted"
          body={SOFTWARE_HERO.body}
          after={
            <>
              <HeroIntro
                eyebrow={{ label: SOFTWARE_INTRO.eyebrow, icon: "ion-ios-bookmark" }}
                heading={SOFTWARE_INTRO.heading}
                body={SOFTWARE_INTRO.body}
                bodyTight
              />
              <Container>
                {/* The only marquee on the site with a fixed logo height. */}
                <LogoMarquee logos={SOFTWARE_TECH_LOGOS} logoHeight="42px" />
              </Container>
            </>
          }
        />

        {/* Service tiles — source section#maftgs */}
        <Section id="services">
          <Container>
            <Grid columns="auto-3" gap="var(--space-m)" className={styles.serviceGrid}>
              {SOFTWARE_SERVICES.map((service) => (
                <ProductCard key={service.title} {...service} />
              ))}
            </Grid>
          </Container>
        </Section>
      </Reveal>

      {/* The body paragraph here carries ACSS `.text--s`; Home's does not.
          `fieldPadding: 8px` is set on this page's form and not on Hardware's. */}
      <Reveal steps={SOFTWARE_CONTACT_STEPS} trigger="scroll">
        <ContactCTA {...SOFTWARE_CONTACT_CTA} bodyScaled form={{ fieldPaddingBlock: "8px" }} />
      </Reveal>
    </>
  );
}
