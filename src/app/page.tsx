import type { Metadata } from "next";

import { FlipCard, ServiceCard } from "@/components/cards";
import { LogoMarquee, StarRating } from "@/components/decorative";
import { Container, Grid, Section } from "@/components/layout";
import { Reveal } from "@/components/motion";
import { Button } from "@/components/primitives";
import { ContactCTA, FaqAccordion, PageHero, SectionHeader } from "@/components/sections";
import {
  HOME_CONTACT_STEPS,
  HOME_FAQ_STEPS,
  HOME_HERO_STEPS,
  HOME_SERVICES_STEPS,
  HOME_WHY_STEPS,
} from "@/content/animations/home";
import {
  HOME_CONTACT_CTA,
  HOME_FAQ,
  HOME_HERO,
  HOME_SERVICES,
  HOME_WHY_CHOOSE_US,
} from "@/content/pages/home";
import { VENDOR_LOGOS } from "@/content/site";

import styles from "./page.module.css";

/**
 * Placeholder metadata. The full Rank Math-equivalent metadata, Open Graph,
 * Twitter card and JSON-LD land in Phase 13. The source's Home title override
 * is `%sitename% %sep% %sitedesc%`.
 */
export const metadata: Metadata = {
  title: "Weiz Technologies - Power Your Business with Cutting-Edge IT",
  description:
    "Weiz Technologies is your partner for secure and reliable IT solutions that drive business growth. Contact us today to discover how we can propel your success.",
};

export default function HomePage() {
  return (
    <>
      <Reveal steps={HOME_HERO_STEPS}>
        <PageHero
          containerId="hero-container"
          headingId="hero-heading"
          eyebrow={HOME_HERO.eyebrow}
          heading={HOME_HERO.heading}
          body={HOME_HERO.body}
          bodyGap="s"
        >
          <div className={styles.heroActions}>
            <Button
              href={HOME_HERO.primaryCta.href}
              variant="primary"
              icon="ion-ios-paper-plane"
              data-anim="cta-primary"
            >
              {HOME_HERO.primaryCta.label}
            </Button>
            <Button href={HOME_HERO.secondaryCta.href} variant="outline" data-anim="cta-secondary">
              {HOME_HERO.secondaryCta.label}
            </Button>
          </div>
        </PageHero>

        {/* Vendor logo marquee — the last step of the hero timeline. */}
        <Section spacing="compact">
          <Container>
            <LogoMarquee logos={VENDOR_LOGOS} />
          </Container>
        </Section>
      </Reveal>

      {/*
        Services — three containers, exactly as the source has them
        (section#kwgztb). The card grid is deliberately NOT one grid: the first
        row is --grid-auto-3 at gap space-s, the second is --grid-auto-2 at gap
        space-m, so cards 4 and 5 are WIDER than the three above them.
        Phase 9 collapsed these into a single auto-3 grid on the theory that the
        output was identical. It is not — that left cards 4 and 5 at one-third
        width with an empty third column.
      */}
      <Reveal
        steps={HOME_SERVICES_STEPS}
        trigger="scroll"
        scrub
        start="top 80%"
        end="bottom bottom"
      >
        <Section id="services" className={styles.servicesSection}>
          <Container className={styles.servicesHeader}>
            <SectionHeader
              eyebrow={{ label: HOME_SERVICES.eyebrow, icon: "ion-ios-bookmark" }}
              heading={HOME_SERVICES.heading}
              headingId="service-heading"
              /* The one section heading the source drops to 500:
               `#service-heading { font-weight: 500 }`. The Why Choose Us, FAQ
               and contact headings all resolve to the theme's 600. */
              headingWeight={500}
              body={HOME_SERVICES.body}
              bodyWidth="m"
            />
          </Container>
          <Container>
            <Grid columns="auto-3" gap="var(--space-s)" className={styles.serviceGrid}>
              {HOME_SERVICES.cards.slice(0, 3).map((card) => (
                <ServiceCard key={card.title} {...card} />
              ))}
            </Grid>
          </Container>
          <Container>
            <Grid columns="auto-2" gap="var(--space-m)" className={styles.serviceGridWide}>
              {HOME_SERVICES.cards.slice(3).map((card) => (
                <ServiceCard key={card.title} {...card} />
              ))}
            </Grid>
          </Container>
        </Section>
      </Reveal>

      {/*
        Why Choose Us — source section#mwtwmq holds TWO containers, #qoeyvy
        (the header) and #ciyind (the flip grid), so Bricks' own section gap
        of var(--space-xl) sits between them. Collapsing them into one
        container with a var(--space-l) row gap left the section 22px short.
      */}
      <Reveal steps={HOME_WHY_STEPS} trigger="scroll" scrub start="top 80%" end="bottom bottom">
        <Section>
          <Container className={styles.sectionInner}>
            <SectionHeader
              eyebrow={{ label: HOME_WHY_CHOOSE_US.eyebrow, icon: "ion-ios-bookmark" }}
              heading={HOME_WHY_CHOOSE_US.heading}
              body={HOME_WHY_CHOOSE_US.body}
              bodyWidth="m"
            >
              <StarRating />
            </SectionHeader>
          </Container>
          <Container>
            <div className={styles.flipGrid}>
              {HOME_WHY_CHOOSE_US.cards.map((card) => (
                <FlipCard key={card.title} title={card.title} body={card.body} />
              ))}
            </div>
          </Container>
        </Section>
      </Reveal>

      {/* FAQ */}
      <Reveal steps={HOME_FAQ_STEPS} trigger="scroll" scrub start="top 80%" end="bottom bottom">
        <Section>
          <Container className={styles.faqGrid}>
            <div>
              <SectionHeader
                eyebrow={{ label: HOME_FAQ.eyebrow, icon: "ion-ios-bookmark" }}
                heading={HOME_FAQ.heading}
                body={HOME_FAQ.body}
                align="start"
              />
            </div>
            <div>
              <FaqAccordion items={HOME_FAQ.items} />
            </div>
          </Container>
        </Section>
      </Reveal>

      {/* Home's form labels its first field "Full name" and placeholders the
          phone as "Phone number", where the product pages use "Name"/"Phone".
          Its body paragraph carries no ACSS text utility, unlike theirs. */}
      <Reveal steps={HOME_CONTACT_STEPS} trigger="scroll" scrub start="top 80%" end="bottom bottom">
        <ContactCTA
          {...HOME_CONTACT_CTA}
          form={{
            nameLabel: "Full name",
            phonePlaceholder: "Phone number",
            fieldPaddingBlock: "8px",
          }}
        />
      </Reveal>
    </>
  );
}
