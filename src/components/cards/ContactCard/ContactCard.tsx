import { Heading, Icon, Link, Text } from "@/components/primitives";
import type { ContactPoint } from "@/content/pages/contact";

import styles from "./ContactCard.module.css";

export interface ContactCardProps {
  items: readonly ContactPoint[];
}

/**
 * ContactCard — `.contact-us-card`, one of the three cards on /contact-us/,
 * each holding two contact points.
 *
 * The source links the icon, the heading and the value separately, which is
 * three tab stops to one destination — and on the "Call Us" card the icon
 * points at a different phone number than the text. Each point is one link
 * here, taking the text element's target. CHANGE #25.
 *
 * Labels are h2, as the source tags them. An earlier revision demoted them
 * to h3 "for consistency with the other cards" — which created an h1->h3
 * level skip (axe heading-order), since this page has no other h2. The
 * source's own h2 is both faithful and correctly ordered; `.cuc-heading`
 * sizes off the text scale, so the tag has no visual effect. CHANGE #25
 * retracted in part.
 */
export function ContactCard({ items }: ContactCardProps) {
  return (
    /* Full-ring variant (no --spot) on the OUTER panel: the user wants the
       entire card border to glow on hover, not an arc on the inner rows. */
    <div className={`${styles.card} cta-cursor-glow cta-cursor-glow--hover`} data-anim="card">
      {items.map((item) => (
        <Link key={item.label} href={item.href} className={styles.item}>
          <span
            className={[styles.iconRow, item.iconLinked === false ? styles.iconRowBare : ""]
              .filter(Boolean)
              .join(" ")}
          >
            <Icon name={item.icon} size="24px" color="var(--primary)" />
          </span>
          <Heading as="h2" className={styles.label}>
            {item.label}
          </Heading>
          <Text className={styles.value}>{item.value}</Text>
        </Link>
      ))}
    </div>
  );
}
