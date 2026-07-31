import type { Metadata } from "next";

import { ContactCard } from "@/components/cards";
import { Container, Section } from "@/components/layout";
import { Reveal } from "@/components/motion";
import { ContactCTA, PageHero } from "@/components/sections";
import {
  CONTACT_BAND_STEPS,
  CONTACT_CARDS_STEPS,
  CONTACT_HERO_STEPS,
} from "@/content/animations/pages";
import { CONTACT_CARDS, CONTACT_CTA, CONTACT_HERO } from "@/content/pages/contact";
import { DESCRIPTIONS, pageMetadata } from "@/lib/seo";

import styles from "./page.module.css";

/** Rank Math-resolved title; the description is CHANGE #30 (lib/seo.ts). */
export const metadata: Metadata = pageMetadata({
  title: "Contact Us",
  description: DESCRIPTIONS.contact,
  path: "/contact-us/",
});

export default function ContactUsPage() {
  return (
    <>
      {/* Hero — source section#iwxcpj. The heading and body sit in a
          width--l block (#pbenaf) with a var(--space-s) gap, which is what
          PageHero's own column already reproduces. */}
      <Reveal steps={CONTACT_HERO_STEPS}>
        <PageHero
          className={styles.hero}
          headingId="hero-heading"
          heading={CONTACT_HERO.heading}
          body={CONTACT_HERO.body}
          bodyTone="muted"
          innerClassName={styles.heroInner}
        />
      </Reveal>

      {/* Contact points — source section#exvyzt, three cards of two. */}
      <Reveal steps={CONTACT_CARDS_STEPS}>
        <Section id="contact-points" spacing="compact" className={styles.pointsSection}>
          <Container className={styles.pointsGrid}>
            {CONTACT_CARDS.map((items) => (
              <ContactCard key={items[0]?.label} items={items} />
            ))}
          </Container>
        </Section>
      </Reveal>

      {/* This page's form labels its first field "Full name" and placeholders
          the phone as "Phone number", and sets fieldPadding 8px — the same
          shape as Home's, not the product pages'. */}
      <Reveal steps={CONTACT_BAND_STEPS}>
        <ContactCTA
          copyGap="xs"
          {...CONTACT_CTA}
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
