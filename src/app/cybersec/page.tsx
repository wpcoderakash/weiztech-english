import type { Metadata } from "next";

import { ExperienceCard, ProductCard } from "@/components/cards";
import { LogoMarquee } from "@/components/decorative";
import { Container, Grid, Section } from "@/components/layout";
import { Heading } from "@/components/primitives";
import { ContactCTA, HeroIntro, PageHero } from "@/components/sections";
import {
  CYBERSEC_CAPABILITIES,
  CYBERSEC_CONTACT_CTA,
  CYBERSEC_EXPERIENCE,
  CYBERSEC_EXPERIENCE_HEADING,
  CYBERSEC_HERO,
  CYBERSEC_INTRO,
  CYBERSEC_LOGOS,
  CYBERSEC_VIEW_LABEL,
} from "@/content/pages/cybersec";

import styles from "./page.module.css";

/**
 * Placeholder metadata; the full set lands in Phase 13.
 * No description: the source's is Hebrew on an English page — open decision B
 * in PHASE-5 §11.
 */
export const metadata: Metadata = {
  title: "Cybersec - Weiz Technologies",
};

export default function CybersecPage() {
  return (
    <>
      {/* Hero — source section#dyxvig. Same skeleton as Hardware and Software:
          the centred column, then the 33/67 intro band inside the same section.
          The marquee opens its own section here, unlike on those two pages. */}
      <PageHero
        className={styles.hero}
        innerClassName={styles.heroInner}
        headingId="hero-heading"
        heading={CYBERSEC_HERO.heading}
        body={CYBERSEC_HERO.body}
        bodyTone="muted"
        bodyGap="xs"
        after={
          <HeroIntro
            eyebrow={{ label: CYBERSEC_INTRO.eyebrow, icon: "ion-ios-bookmark" }}
            heading={CYBERSEC_INTRO.heading}
            body={CYBERSEC_INTRO.body}
          />
        }
      />

      {/* Vendor marquee — source section#goulvu, its own band here. */}
      <Section spacing="compact" className={styles.marqueeSection}>
        <Container className={styles.marqueeInner}>
          <LogoMarquee logos={CYBERSEC_LOGOS} />
        </Container>
      </Section>

      {/* Capability tiles — source section#apshsx, a fixed 4-column grid. */}
      <Section id="capabilities" className={styles.section}>
        <Container className={styles.capabilityGrid}>
          {CYBERSEC_CAPABILITIES.map((card) => (
            <ProductCard key={card.title} {...card} className={styles.capabilityCard} />
          ))}
        </Container>
      </Section>

      {/* Our Experience — source section#ztpzeq. This section is the only one
          on the page with no accent fill; it sits on the body background. */}
      <Section id="experience" className={styles.experienceSection}>
        <Container className={styles.experienceHeader}>
          <Heading as="h2">{CYBERSEC_EXPERIENCE_HEADING}</Heading>
        </Container>
        <Container>
          <Grid columns="5" gap="var(--space-m)" className={styles.experienceGrid}>
            {CYBERSEC_EXPERIENCE.map((item) => (
              <ExperienceCard key={item.brand} {...item} label={CYBERSEC_VIEW_LABEL} />
            ))}
          </Grid>
        </Container>
      </Section>

      <ContactCTA {...CYBERSEC_CONTACT_CTA} />
    </>
  );
}
