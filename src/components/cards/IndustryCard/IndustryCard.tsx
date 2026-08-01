import { Heading, Link, Text } from "@/components/primitives";

import styles from "./IndustryCard.module.css";

export interface IndustryCardProps {
  number: string;
  title: string;
  body: string;
  href: string;
}

/**
 * IndustryCard — `.industry-cards`, the six numbered tiles in "Industries We
 * Serve". Same shell as IconFeatureCard but numbered rather than iconed, and
 * without the transition the other carries.
 *
 * The heading carries no class and no per-element rule — it is an h3 at the
 * theme's default size and 600 weight, measured at 21.3px on the live page.
 *
 * The number is decorative — an ordinal label above the heading, not content a
 * screen reader needs — so it is aria-hidden.
 */
export function IndustryCard({ number, title, body, href }: IndustryCardProps) {
  return (
    <Link
      href={href}
      className={`${styles.card} cta-cursor-glow cta-cursor-glow--hover cta-cursor-glow--spot`}
    >
      <span className={styles.number} aria-hidden="true">
        {number}
      </span>
      <Heading as="h3">{title}</Heading>
      <Text className={styles.body}>{body}</Text>
    </Link>
  );
}
