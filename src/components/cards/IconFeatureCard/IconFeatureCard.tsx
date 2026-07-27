import { Heading, Icon, Link, Text } from "@/components/primitives";
import type { IconName } from "@/components/primitives";

import styles from "./IconFeatureCard.module.css";

export interface IconFeatureCardProps {
  icon: IconName;
  title: string;
  body: string;
  href: string;
}

/**
 * IconFeatureCard — `.wd3-cards`, the four tiles in the Web Design page's
 * "Comprehensive Web Solutions" grid.
 *
 * The whole tile is the link: the source sets `tag: a` on the div itself
 * rather than wrapping a link inside it. Icon is var(--primary) at 32px,
 * heading --text-l at 500, body --text-s.
 */
export function IconFeatureCard({ icon, title, body, href }: IconFeatureCardProps) {
  return (
    <Link href={href} className={styles.card}>
      <Icon name={icon} size="32px" color="var(--primary)" />
      <Heading as="h3" className={styles.title}>
        {title}
      </Heading>
      <Text className={styles.body}>{body}</Text>
    </Link>
  );
}
