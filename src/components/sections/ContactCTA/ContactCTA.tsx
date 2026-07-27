import { ContactForm } from "@/components/forms";
import type { ContactFormProps } from "@/components/forms";
import { Container, Section } from "@/components/layout";

import { SectionHeader } from "../SectionHeader";

import styles from "./ContactCTA.module.css";

export interface ContactCTAProps {
  eyebrow: string;
  heading: string;
  body: string;
  /**
   * The body paragraph carries ACSS's `.text--s` on Hardware (`#brxe-gqraix`)
   * and Software (`#brxe-qkgbqf`) but not on Home (`#brxe-kmpjzj`, which sets
   * the font size inline). Same size either way; the utility also brings
   * line-height 1.7 where Home inherits 1.8.
   */
  bodyScaled?: boolean | undefined;
  /** Per-page form settings — the labels and field padding differ by page. */
  form?: ContactFormProps | undefined;
  /**
   * Closing padding. Home, Hardware and Software end the band on
   * var(--space-m); the Web Design page's #brxe-pmerqq uses var(--space-xl).
   */
  endSpacing?: "m" | "xl" | undefined;
}

/**
 * ContactCTA — the closing band on six of the nine pages, structurally
 * identical each time: a 1fr/2fr grid with the copy on the left and the
 * standard contact form on the right.
 *
 * Its h2 is 600 in the source on every page, unlike the 500 of Home's Services
 * heading — hence the explicit weight.
 */
export function ContactCTA({
  eyebrow,
  heading,
  body,
  bodyScaled = false,
  form,
  endSpacing = "m",
}: ContactCTAProps) {
  return (
    <Section className={[styles.section, styles[`end-${endSpacing}`]].join(" ")}>
      <Container className={styles.grid}>
        <div className={styles.copy}>
          <SectionHeader
            eyebrow={{ label: eyebrow, icon: "ion-ios-bookmark" }}
            heading={heading}
            headingWeight={600}
            body={body}
            {...(bodyScaled ? { bodyClassName: "text--s" } : {})}
            align="start"
          />
        </div>
        <div>
          <ContactForm {...form} />
        </div>
      </Container>
    </Section>
  );
}
