import { Heading, Icon, Link, Text } from "@/components/primitives";
import type { IconName } from "@/components/primitives";

import styles from "./ServiceCard.module.css";

export interface ServiceCardProps {
  icon: IconName;
  title: string;
  body: string;
  ctaLabel: string;
  href: string;
}

/**
 * ServiceCard — the five cards in the Home "Your One-Stop IT Shop" grid
 * (.service-page-card + .service-hover).
 *
 * The overlay covering the card on hover is `.service-hover`: a 90%-opaque
 * scrim with backdrop-filter blur(4px) holding the "Learn More" link.
 * In the source it is driven by a Bricksforge hover timeline
 * (`from { y: 25px, opacity: 0, scale: 0 }`, 0.3s, circ.inOut). Reproduced
 * here in CSS with the equivalent cubic-bezier so it needs no JS; Phase 11
 * will verify against the GSAP original.
 */
export function ServiceCard({ icon, title, body, ctaLabel, href }: ServiceCardProps) {
  return (
    <div className={styles.card}>
      {/* iconColor is var(--primary) at 38px in the source, not white. */}
      <Icon name={icon} size="38px" color="var(--primary)" />
      <Heading as="h3" className={styles.title}>
        {title}
      </Heading>
      {/* Body is #98a2b3 (--text-muted), left-aligned — not the --base default. */}
      <Text tone="muted">{body}</Text>

      <div className={styles.overlay}>
        <Link href={href} className={styles.cta}>
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
}
