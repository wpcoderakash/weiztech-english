import type { ReactNode } from "react";

import styles from "./GlowHeading.module.css";

/**
 * GlowHeading — the weiz.co.il hero-title treatment (design port), in the
 * reference's own "continuous mode": one animated block whose natural
 * wrapping is preserved, with the gradient sweeping across the whole title.
 *
 * Renders a <span>, not a heading — PageHero's existing <Heading as="h1">
 * wraps it, so the document outline, ids and analytics are untouched. GSAP
 * animates the h1 itself (fade + rise, like the reference's fadeUp), which
 * is safe: the background is attached to this span and moves with it.
 */
export function GlowHeading({ children }: { children: ReactNode }) {
  return (
    <span data-glow className={styles.line}>
      {children}
    </span>
  );
}
