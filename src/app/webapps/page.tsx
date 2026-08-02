import Image from "next/image";

import type { Metadata } from "next";

import { IconFeatureCard, IndustryCard, ShowcaseCard } from "@/components/cards";
import { EyebrowBadge } from "@/components/decorative";
import { Container, Grid, Section } from "@/components/layout";
import { Reveal } from "@/components/motion";
import { Button, Heading, Text } from "@/components/primitives";
import {
  CheckList,
  GlowHeading,
  ContactCTA,
  FaqAccordion,
  PricingTabs,
  ProcessTimeline,
  SectionHeader,
} from "@/components/sections";
import { WEBAPPS_SERVICES_STEPS, WEBAPPS_SHOWCASE_STEPS } from "@/content/animations/pages";
import {
  WEBAPPS_CONTACT_CTA as WEBAPPS_CONTACT_CTA_FALLBACK,
  WEBAPPS_FAQ as WEBAPPS_FAQ_FALLBACK,
  WEBAPPS_HERO as WEBAPPS_HERO_FALLBACK,
  WEBAPPS_INDUSTRIES as WEBAPPS_INDUSTRIES_FALLBACK,
  WEBAPPS_PRICING as WEBAPPS_PRICING_FALLBACK,
  WEBAPPS_PROCESS as WEBAPPS_PROCESS_FALLBACK,
  WEBAPPS_SERVICES as WEBAPPS_SERVICES_FALLBACK,
  WEBAPPS_SHOWCASE as WEBAPPS_SHOWCASE_FALLBACK,
  WEBAPPS_WHY_CHOOSE_US as WEBAPPS_WHY_CHOOSE_US_FALLBACK,
} from "@/content/pages/webapps";
import { getSection, getSeo } from "@/lib/cms/getContent";
import { DESCRIPTIONS, pageMetadata } from "@/lib/seo";

import styles from "./page.module.css";

/** Rank Math-resolved title; the description is CHANGE #30 (lib/seo.ts). */
const METADATA_FALLBACK = {
  title: "Web Design & Development",
  description: DESCRIPTIONS.webapps,
  path: "/webapps/",
};

/* C7: SEO title/description from the CMS (pages.seo), falling back to the
   values above; path and og settings stay code-owned. */
export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeo("webapps", {
    title: METADATA_FALLBACK.title,
    description: METADATA_FALLBACK.description,
  });
  return pageMetadata({ ...METADATA_FALLBACK, ...seo });
}

export default async function WebappsPage() {
  /* C3: content from the CMS; the aliased imports are the byte-identical
     fallbacks (and the CMS_READS=off kill switch). */
  const WEBAPPS_CONTACT_CTA = await getSection(
    "webapps",
    "WEBAPPS_CONTACT_CTA",
    WEBAPPS_CONTACT_CTA_FALLBACK,
  );
  const WEBAPPS_FAQ = await getSection("webapps", "WEBAPPS_FAQ", WEBAPPS_FAQ_FALLBACK);
  const WEBAPPS_HERO = await getSection("webapps", "WEBAPPS_HERO", WEBAPPS_HERO_FALLBACK);
  const WEBAPPS_INDUSTRIES = await getSection(
    "webapps",
    "WEBAPPS_INDUSTRIES",
    WEBAPPS_INDUSTRIES_FALLBACK,
  );
  const WEBAPPS_PRICING = await getSection("webapps", "WEBAPPS_PRICING", WEBAPPS_PRICING_FALLBACK);
  const WEBAPPS_PROCESS = await getSection("webapps", "WEBAPPS_PROCESS", WEBAPPS_PROCESS_FALLBACK);
  const WEBAPPS_SERVICES = await getSection(
    "webapps",
    "WEBAPPS_SERVICES",
    WEBAPPS_SERVICES_FALLBACK,
  );
  const WEBAPPS_SHOWCASE = await getSection(
    "webapps",
    "WEBAPPS_SHOWCASE",
    WEBAPPS_SHOWCASE_FALLBACK,
  );
  const WEBAPPS_WHY_CHOOSE_US = await getSection(
    "webapps",
    "WEBAPPS_WHY_CHOOSE_US",
    WEBAPPS_WHY_CHOOSE_US_FALLBACK,
  );

  return (
    <>
      {/*
        Hero — source section#xgdyhu. Not PageHero: this one has no inner
        60%-wide column. Its container is the column, and each child sets its
        own width (h1 and body width--l, the image panel width--xl), which
        PageHero's fixed `.column` would override.
      */}
      <Section spacing="none" className={styles.hero}>
        <Container className={styles.heroInner}>
          <EyebrowBadge label={WEBAPPS_HERO.eyebrow} />
          {/* This hero renders its own h1 (illustration layout), so it wraps
              GlowHeading itself — PageHero's heading path does it elsewhere. */}
          <Heading as="h1" id="hero-heading" className={styles.heroHeading}>
            <GlowHeading>{WEBAPPS_HERO.heading}</GlowHeading>
          </Heading>
          <Text tone="muted" className={styles.heroBody}>
            {WEBAPPS_HERO.body}
          </Text>
          {/* #brxe-dkndau sets 14px, not the 16px `.primary` carries on Home. */}
          <Button
            href={WEBAPPS_HERO.cta.href}
            variant="primary"
            icon="ion-ios-paper-plane"
            className={styles.heroCta}
          >
            {WEBAPPS_HERO.cta.label}
          </Button>
          {/* div#wcxhnf — a bordered panel holding the 650px illustration. */}
          <div
            /* Full-ring cursor glow, same variant the user chose for the
               contact panels. */
            className={`${styles.heroPanel} cta-cursor-glow cta-cursor-glow--hover`}
          >
            <Image
              src={WEBAPPS_HERO.image.src}
              alt={WEBAPPS_HERO.image.alt}
              width={WEBAPPS_HERO.image.width}
              height={WEBAPPS_HERO.image.height}
              priority
              className={styles.heroImage}
            />
          </div>
        </Container>
      </Section>

      {/* Services — source section#3e7d12 */}
      <Reveal steps={WEBAPPS_SERVICES_STEPS}>
        <Section id="services" className={styles.section}>
          <Container className={styles.centeredHeader}>
            {/* #brxe-c788b1 and #brxe-byxekl both set width: var(--width-m). */}
            <SectionHeader
              heading={WEBAPPS_SERVICES.heading}
              headingWidth="m"
              body={WEBAPPS_SERVICES.body}
              bodyWidth="m"
              bodyTone="muted"
            />
          </Container>
          <Container className={styles.lifted}>
            <Grid columns="auto-2" gap="var(--space-m)" className={styles.stretchGrid}>
              {WEBAPPS_SERVICES.cards.map((card) => (
                <IconFeatureCard key={card.title} {...card} />
              ))}
            </Grid>
          </Container>
        </Section>
      </Reveal>

      {/* Industries — source section#kgbujs. One container holding both the
          header and the grid, with a space-l gap between them. */}
      <Section id="industries" className={styles.section}>
        <Container className={styles.industriesInner}>
          <SectionHeader
            gap="s"
            heading={WEBAPPS_INDUSTRIES.heading}
            body={WEBAPPS_INDUSTRIES.body}
            bodyWidth="l"
            bodyTone="muted"
          />
          <Grid columns="auto-3" gap="var(--space-m)" className={styles.industriesGrid}>
            {WEBAPPS_INDUSTRIES.cards.map((card) => (
              <IndustryCard key={card.number} {...card} />
            ))}
          </Grid>
        </Container>
      </Section>

      {/* Why Choose Us — source section#tcbkkv, a two-column split. */}
      <Section id="why-choose-us" className={styles.section}>
        <Container className={styles.whyGrid}>
          <div className={styles.whyCopy}>
            <Heading as="h2">{WEBAPPS_WHY_CHOOSE_US.heading}</Heading>
            <Text className={styles.whyBody}>{WEBAPPS_WHY_CHOOSE_US.body}</Text>
          </div>
          <CheckList items={WEBAPPS_WHY_CHOOSE_US.points} />
        </Container>
      </Section>

      {/* Showcase — source section#450756 */}
      <Reveal steps={WEBAPPS_SHOWCASE_STEPS}>
        <Section id="showcase" className={styles.section}>
          <Container className={styles.centeredHeader}>
            <SectionHeader
              heading={WEBAPPS_SHOWCASE.heading}
              headingWidth="m"
              body={WEBAPPS_SHOWCASE.body}
              bodyWidth="m"
              bodyTone="muted"
            />
          </Container>
          <Container className={styles.lifted}>
            <Grid columns="auto-3" gap="var(--space-m)" className={styles.stretchGrid}>
              {WEBAPPS_SHOWCASE.cards.map((card) => (
                <ShowcaseCard key={card.title} {...card} demoLabel={WEBAPPS_SHOWCASE.demoLabel} />
              ))}
            </Grid>
          </Container>
        </Section>
      </Reveal>

      {/* Development process — source section#dsvmbh */}
      <Section id="process" className={styles.section}>
        <Container className={styles.processHeader}>
          <SectionHeader
            heading={WEBAPPS_PROCESS.heading}
            body={WEBAPPS_PROCESS.body}
            bodyWidth="l"
          />
        </Container>
        <Container className={styles.lifted}>
          <ProcessTimeline steps={WEBAPPS_PROCESS.steps} />
        </Container>
      </Section>

      {/* Pricing — source section#7a7375 */}
      <Section id="pricing" className={styles.section}>
        <Container className={styles.centeredHeader}>
          <SectionHeader
            eyebrow={{ label: WEBAPPS_PRICING.eyebrow, icon: "ion-ios-bookmark" }}
            heading={WEBAPPS_PRICING.heading}
            body={WEBAPPS_PRICING.body}
            bodyWidth="l"
          />
        </Container>
        <Container className={styles.lifted}>
          <PricingTabs
            tabs={WEBAPPS_PRICING.tabs}
            plans={WEBAPPS_PRICING.plans}
            cta={WEBAPPS_PRICING.cta}
          />
        </Container>
      </Section>

      {/* FAQ — source section#f88548, a 1fr/2fr split */}
      <Section id="faq" className={styles.section}>
        <Container className={styles.faqGrid}>
          <div>
            <SectionHeader
              eyebrow={{ label: WEBAPPS_FAQ.eyebrow, icon: "ion-ios-bookmark" }}
              heading={WEBAPPS_FAQ.heading}
              body={WEBAPPS_FAQ.body}
              align="start"
            />
          </div>
          <div>
            <FaqAccordion items={WEBAPPS_FAQ.items} />
          </div>
        </Container>
      </Section>

      {/* The body paragraph here carries ACSS `.text--s`, as on the product
          pages. This page's form sets no fieldPadding, like Hardware's. */}
      <ContactCTA {...WEBAPPS_CONTACT_CTA} bodyScaled endSpacing="xl" />
    </>
  );
}
