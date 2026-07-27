import Image from "next/image";

import { Heading, Icon, Link, Text } from "@/components/primitives";

import styles from "./ShowcaseCard.module.css";

export interface ShowcaseCardProps {
  title: string;
  body: string;
  image: string;
  href: string;
  demoLabel: string;
}

/**
 * ShowcaseCard — `.demo-card`, the six portfolio tiles in "Our Web Design
 * Showcase".
 *
 * The source makes the image, heading, body and the overlay's "View Demo" all
 * separate links to the same external demo site. That is four tab stops to one
 * destination; here the overlay link covers the whole card via a ::after, so
 * the card is one target. The heading and body are plain text as a result.
 *
 * `.demo-hover-link` is an absolutely positioned 100% panel with a
 * rgba(27,27,67,0.7) fill and backdrop-filter blur(4px), holding a 38px round
 * icon and an underlined label. It is always painted in the source — no hover
 * timeline drives it, despite the name — so it is not revealed on hover here
 * either.
 */
export function ShowcaseCard({ title, body, image, href, demoLabel }: ShowcaseCardProps) {
  return (
    <div className={styles.card}>
      <Image src={image} alt="" width={1024} height={683} className={styles.image} />
      <Heading as="h3" className={styles.title}>
        {title}
      </Heading>
      <Text className={styles.body}>{body}</Text>

      <div className={styles.overlay}>
        <Link href={href} className={styles.demoLink}>
          <span className={styles.demoIcon}>
            <Icon name="ion-ios-link" size="18px" color="var(--white)" />
          </span>
          <span className={styles.demoText}>{demoLabel}</span>
        </Link>
      </div>
    </div>
  );
}
