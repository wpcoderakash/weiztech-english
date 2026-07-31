import type { Metadata } from "next";

import { JobPositionCard } from "@/components/cards";
import { Container, Section } from "@/components/layout";
import { Reveal } from "@/components/motion";
import { Heading, Icon, Text } from "@/components/primitives";
import { PageHero } from "@/components/sections";
import {
  CAREERS_HERO_STEPS,
  CAREERS_INTRO_STEPS,
  CAREERS_POSITIONS_STEPS,
} from "@/content/animations/pages";
import {
  CAREERS_BENEFITS,
  CAREERS_HERO,
  CAREERS_INTRO,
  CAREERS_POSITIONS,
  CAREERS_SECTION_HEADING,
} from "@/content/pages/careers";
import { DESCRIPTIONS, pageMetadata } from "@/lib/seo";

import styles from "./page.module.css";

/** Rank Math-resolved title; the description is CHANGE #30 (lib/seo.ts). */
export const metadata: Metadata = pageMetadata({
  title: "Careers",
  description: DESCRIPTIONS.careers,
  path: "/careers/",
});

/**
 * `/careers/` — source page ID 807. Three sections and one popup.
 *
 * The application modal itself renders once at the root (layout.tsx) rather
 * than per card, which is how Bricks handled popup template 4521: one
 * instance, opened by interaction. Job cards are the only client components
 * on the page — they need the click handler — so the page stays a Server
 * Component and prerenders.
 */
export default function CareersPage() {
  return (
    <>
      {/* Hero — source section#zgwldk. */}
      <Reveal steps={CAREERS_HERO_STEPS}>
        <PageHero
          className={styles.hero}
          headingId="careers-heading"
          heading={CAREERS_HERO.heading}
          eyebrow={{ ...CAREERS_HERO.eyebrow, className: styles.heroBadge }}
          body={CAREERS_HERO.body}
          /* text-basic#nhhbmz — var(--text-m), #98a2b3, margin-bottom xs. */
          bodySize="m"
          bodyTone="muted"
          bodyGap="xs"
        />
      </Reveal>

      {/* "We Appreciate Talent" — source section#icnbwl, a 40/60 row. */}
      <Reveal steps={CAREERS_INTRO_STEPS}>
        <Section className={styles.introSection}>
          <Container className={styles.introRow}>
            <div className={styles.introCopy}>
              <Heading as="h2" data-anim="intro-heading">
                {CAREERS_INTRO.heading}
              </Heading>
              <Text className={styles.introBody} data-anim="intro-body">
                {CAREERS_INTRO.body}
              </Text>
            </div>

            {/* block#tmjbum — ACSS col-count--2, a two-column masonry column
                count rather than a grid. */}
            <div className={styles.benefits}>
              {CAREERS_BENEFITS.map((benefit) => (
                <div key={benefit.title} className={styles.benefit} data-anim="benefit">
                  <Icon name={benefit.icon} size="28px" color="var(--primary)" />
                  <Heading as="h3" className={styles.benefitTitle}>
                    {benefit.title}
                  </Heading>
                  <Text className={styles.benefitBody}>{benefit.body}</Text>
                </div>
              ))}
            </div>
          </Container>
        </Section>
      </Reveal>

      {/* "Open Positions" — source section#soskor, two containers. */}
      <Reveal steps={CAREERS_POSITIONS_STEPS}>
        <Section className={styles.positionsSection}>
          <Container className={styles.positionsHeader}>
            <Heading as="h2" data-anim="heading">
              {CAREERS_SECTION_HEADING}
            </Heading>
          </Container>
          <Container className={styles.positionsGrid}>
            {CAREERS_POSITIONS.map((position) => (
              <JobPositionCard key={position.title} {...position} />
            ))}
          </Container>
        </Section>
      </Reveal>
    </>
  );
}
