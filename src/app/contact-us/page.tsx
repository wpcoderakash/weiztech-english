import type { Metadata } from "next";

import { ContactCard } from "@/components/cards";
import { Container, Section } from "@/components/layout";
import { ContactCTA, PageHero } from "@/components/sections";
import { CONTACT_CARDS, CONTACT_CTA, CONTACT_HERO } from "@/content/pages/contact";

import styles from "./page.module.css";

/**
 * Placeholder metadata; the full set lands in Phase 13.
 * No description: the source's is Hebrew on an English page — open decision B
 * in PHASE-5 §11.
 */
export const metadata: Metadata = {
  title: "Contact Us - Weiz Technologies",
};

export default function ContactUsPage() {
  return (
    <>
      {/* Hero — source section#iwxcpj. The heading and body sit in a
          width--l block (#pbenaf) with a var(--space-s) gap, which is what
          PageHero's own column already reproduces. */}
      <PageHero
        className={styles.hero}
        headingId="hero-heading"
        heading={CONTACT_HERO.heading}
        body={CONTACT_HERO.body}
        bodyTone="muted"
        innerClassName={styles.heroInner}
      />

      {/* Contact points — source section#exvyzt, three cards of two. */}
      <Section id="contact-points" spacing="compact" className={styles.pointsSection}>
        <Container className={styles.pointsGrid}>
          {CONTACT_CARDS.map((items) => (
            <ContactCard key={items[0]?.label} items={items} />
          ))}
        </Container>
      </Section>

      {/* This page's form labels its first field "Full name" and placeholders
          the phone as "Phone number", and sets fieldPadding 8px — the same
          shape as Home's, not the product pages'. */}
      <ContactCTA
        {...CONTACT_CTA}
        form={{
          nameLabel: "Full name",
          phonePlaceholder: "Phone number",
          fieldPaddingBlock: "8px",
        }}
      />
    </>
  );
}
