import type { Metadata } from "next";

import { ProductCard } from "@/components/cards";
import { LogoMarquee } from "@/components/decorative";
import { Container, Grid, Section } from "@/components/layout";
import { Reveal } from "@/components/motion";
import { ContactCTA, HeroIntro, PageHero } from "@/components/sections";
import { SOFTWARE_CONTACT_STEPS, SOFTWARE_HERO_STEPS } from "@/content/animations/pages";
import {
  SOFTWARE_CONTACT_CTA,
  SOFTWARE_HERO,
  SOFTWARE_INTRO,
  SOFTWARE_SERVICES,
  SOFTWARE_TECH_LOGOS,
} from "@/content/pages/software";

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
  title: "Software - Weiz Technologies",
};

export default function SoftwarePage() {
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
