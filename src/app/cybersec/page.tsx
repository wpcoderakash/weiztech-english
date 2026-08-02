import type { Metadata } from "next";

import { ExperienceCard, ProductCard } from "@/components/cards";
import { LogoMarquee } from "@/components/decorative";
import { Container, Grid, Section } from "@/components/layout";
import { Reveal } from "@/components/motion";
import { Heading } from "@/components/primitives";
import { ContactCTA, HeroIntro, PageHero } from "@/components/sections";
import {
  CONTACT_BAND_STEPS,
  CYBERSEC_CAPABILITY_STEPS,
  CYBERSEC_EXPERIENCE_STEPS,
  CYBERSEC_HERO_STEPS,
} from "@/content/animations/pages";
import {
  CYBERSEC_CAPABILITIES as CYBERSEC_CAPABILITIES_FALLBACK,
  CYBERSEC_CONTACT_CTA as CYBERSEC_CONTACT_CTA_FALLBACK,
  CYBERSEC_EXPERIENCE as CYBERSEC_EXPERIENCE_FALLBACK,
  CYBERSEC_EXPERIENCE_HEADING as CYBERSEC_EXPERIENCE_HEADING_FALLBACK,
  CYBERSEC_HERO as CYBERSEC_HERO_FALLBACK,
  CYBERSEC_INTRO as CYBERSEC_INTRO_FALLBACK,
  CYBERSEC_LOGOS as CYBERSEC_LOGOS_FALLBACK,
  CYBERSEC_VIEW_LABEL as CYBERSEC_VIEW_LABEL_FALLBACK,
} from "@/content/pages/cybersec";
import { getSection, getSeo } from "@/lib/cms/getContent";
import { DESCRIPTIONS, pageMetadata } from "@/lib/seo";

import styles from "./page.module.css";

/** Rank Math-resolved title; the description is CHANGE #30 (lib/seo.ts). */
const METADATA_FALLBACK = {
  title: "Cybersec",
  description: DESCRIPTIONS.cybersec,
  path: "/cybersec/",
};

/* C7: SEO title/description from the CMS (pages.seo), falling back to the
   values above; path and og settings stay code-owned. */
export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeo("cybersec", {
    title: METADATA_FALLBACK.title,
    description: METADATA_FALLBACK.description,
  });
  return pageMetadata({ ...METADATA_FALLBACK, ...seo });
}

export default async function CybersecPage() {
  /* C3: content from the CMS; the aliased imports are the byte-identical
     fallbacks (and the CMS_READS=off kill switch). */
  const CYBERSEC_CAPABILITIES = await getSection(
    "cybersec",
    "CYBERSEC_CAPABILITIES",
    CYBERSEC_CAPABILITIES_FALLBACK,
  );
  const CYBERSEC_CONTACT_CTA = await getSection(
    "cybersec",
    "CYBERSEC_CONTACT_CTA",
    CYBERSEC_CONTACT_CTA_FALLBACK,
  );
  const CYBERSEC_EXPERIENCE = await getSection(
    "cybersec",
    "CYBERSEC_EXPERIENCE",
    CYBERSEC_EXPERIENCE_FALLBACK,
  );
  const CYBERSEC_EXPERIENCE_HEADING = await getSection(
    "cybersec",
    "CYBERSEC_EXPERIENCE_HEADING",
    CYBERSEC_EXPERIENCE_HEADING_FALLBACK,
  );
  const CYBERSEC_HERO = await getSection("cybersec", "CYBERSEC_HERO", CYBERSEC_HERO_FALLBACK);
  const CYBERSEC_INTRO = await getSection("cybersec", "CYBERSEC_INTRO", CYBERSEC_INTRO_FALLBACK);
  const CYBERSEC_LOGOS = await getSection("cybersec", "CYBERSEC_LOGOS", CYBERSEC_LOGOS_FALLBACK);
  const CYBERSEC_VIEW_LABEL = await getSection(
    "cybersec",
    "CYBERSEC_VIEW_LABEL",
    CYBERSEC_VIEW_LABEL_FALLBACK,
  );

  return (
    <>
      {/* Hero — source section#dyxvig. Same skeleton as Hardware and Software:
          the centred column, then the 33/67 intro band inside the same section.
          The marquee opens its own section here, unlike on those two pages. */}
      <Reveal steps={CYBERSEC_HERO_STEPS}>
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
      </Reveal>

      {/* Vendor marquee — source section#goulvu, its own band here. It carries
          no timeline of its own in the export. */}
      <Section spacing="compact" className={styles.marqueeSection}>
        <Container className={styles.marqueeInner}>
          <LogoMarquee logos={CYBERSEC_LOGOS} />
        </Container>
      </Section>

      {/* Capability tiles — source section#apshsx, a fixed 4-column grid. */}
      <Reveal steps={CYBERSEC_CAPABILITY_STEPS}>
        <Section id="capabilities" className={styles.section}>
          <Container className={styles.capabilityGrid}>
            {/* `innerWrap` rides in on each card's own data — it is per-card
                markup in the source, not a page-wide setting. */}
            {CYBERSEC_CAPABILITIES.map((card) => (
              <ProductCard key={card.title} {...card} className={styles.capabilityCard} />
            ))}
          </Container>
        </Section>
      </Reveal>

      {/* Our Experience — source section#ztpzeq. This section is the only one
          on the page with no accent fill; it sits on the body background. */}
      <Reveal steps={CYBERSEC_EXPERIENCE_STEPS}>
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
      </Reveal>

      <Reveal steps={CONTACT_BAND_STEPS}>
        {/* This page's form labels its name field "Full name" and its phone
            placeholder "Phone number" (cybersec.json) — not the "Name"/"Phone"
            defaults. Placeholders are invisible to the text harness; caught by
            screenshot, and the first attempt at this fix silently missed. */}
        <ContactCTA
          copyGap="xs"
          {...CYBERSEC_CONTACT_CTA}
          form={{ nameLabel: "Full name", phonePlaceholder: "Phone number" }}
        />
      </Reveal>
    </>
  );
}
