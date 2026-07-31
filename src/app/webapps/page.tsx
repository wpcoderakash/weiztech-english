import Image from "next/image";

import type { Metadata } from "next";

import { IconFeatureCard, IndustryCard, ShowcaseCard } from "@/components/cards";
import { EyebrowBadge, ParticlesField } from "@/components/decorative";
import { Container, Grid, Section } from "@/components/layout";
import { Reveal } from "@/components/motion";
import { Button, Heading, Text } from "@/components/primitives";
import {
  CheckList,
  ContactCTA,
  FaqAccordion,
  PricingTabs,
  ProcessTimeline,
  SectionHeader,
} from "@/components/sections";
import { WEBAPPS_SERVICES_STEPS, WEBAPPS_SHOWCASE_STEPS } from "@/content/animations/pages";
import {
  WEBAPPS_CONTACT_CTA,
  WEBAPPS_FAQ,
  WEBAPPS_HERO,
  WEBAPPS_INDUSTRIES,
  WEBAPPS_PRICING,
  WEBAPPS_PROCESS,
  WEBAPPS_SERVICES,
  WEBAPPS_SHOWCASE,
  WEBAPPS_WHY_CHOOSE_US,
} from "@/content/pages/webapps";

import styles from "./page.module.css";

/**
 * Placeholder metadata; the full set lands in Phase 13.
 *
 * The title resolves through the site pattern `%title% - Weiz Technologies`.
 * No description: the source's is Hebrew on an English page — open decision B
 * in PHASE-5 §11.
 */
export const metadata: Metadata = {
  title: "Web Design & Development - Weiz Technologies",
};

export default function WebappsPage() {
  return (
    <>
      {/*
        Hero — source section#xgdyhu. Not PageHero: this one has no inner
        60%-wide column. Its container is the column, and each child sets its
        own width (h1 and body width--l, the image panel width--xl), which
        PageHero's fixed `.column` would override.
      */}
      <Section spacing="none" className={styles.hero}>
        <ParticlesField />
        <Container className={styles.heroInner}>
          <EyebrowBadge label={WEBAPPS_HERO.eyebrow} />
          <Heading as="h1" id="hero-heading" className={styles.heroHeading}>
            {WEBAPPS_HERO.heading}
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
          <div className={styles.heroPanel}>
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
          <Container>
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
          <Container>
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
        <Container>
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
        <Container>
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
