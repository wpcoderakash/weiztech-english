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
 * Labels are h3. The source tags all six h2, which would put six sibling h2s
 * under the page h1; every other card on the site uses h3. Same call as
 * CHANGE #13, and `.cuc-heading` sizes off the text scale anyway, so there is
 * no visual change.
 */
export function ContactCard({ items }: ContactCardProps) {
  return (
    <div className={styles.card} data-anim="card">
      {items.map((item) => (
        <Link key={item.label} href={item.href} className={styles.item}>
          <span
            className={[styles.iconRow, item.iconLinked === false ? styles.iconRowBare : ""]
              .filter(Boolean)
              .join(" ")}
          >
            <Icon name={item.icon} size="24px" color="var(--primary)" />
          </span>
          <Heading as="h3" className={styles.label}>
            {item.label}
          </Heading>
          <Text className={styles.value}>{item.value}</Text>
        </Link>
      ))}
    </div>
  );
}
