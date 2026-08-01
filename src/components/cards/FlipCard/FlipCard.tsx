import { Heading, Text } from "@/components/primitives";

import styles from "./FlipCard.module.css";

export interface FlipCardProps {
  title: string;
  body: string;
}

/**
 * FlipCard — the four "Why Choose Us" cards on Home (.flipcard).
 *
 * NextBricks `flipbox`, type vertical, trigger hover, duration 1.8s.
 * 324x324, 16px radius, 12/24 padding, centred text, why-choose-bg.png
 * background on both faces.
 *
 * Pure CSS 3D flip — no JS needed. Focus-within flips it for keyboard users,
 * which the original did not support.
 */
export function FlipCard({ title, body }: FlipCardProps) {
  return (
    <div className={styles.scene} data-anim="card">
      <div className={styles.inner}>
        <div
          className={[
            styles.face,
            styles.front,
            "cta-cursor-glow cta-cursor-glow--hover cta-cursor-glow--spot",
          ].join(" ")}
        >
          <Heading as="h3">{title}</Heading>
        </div>
        <div className={[styles.face, styles.back].join(" ")}>
          {/* The source sets the back copy to var(--white) explicitly — see
              #brxe-cvqknh and its three siblings in home.json, each with
              `_typography: { color: white, font-size: var(--text-xs) }`.
              Text's default tone is var(--base) (#aea6ba), which left the copy
              a washed-out mauve against the purple card. */}
          <Text size="xs" tone="white">
            {body}
          </Text>
        </div>
      </div>
    </div>
  );
}
