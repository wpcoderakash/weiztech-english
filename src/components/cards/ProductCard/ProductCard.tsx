import type { CSSProperties } from "react";

import { Heading, Link, Text } from "@/components/primitives";

import styles from "./ProductCard.module.css";

export interface ProductCardProps {
  title: string;
  body: string;
  /** Background photo, served from /public/images. */
  image: string;
  href: string;
  /**
   * Bricks `_background.position`. Every tile but one is `center center`;
   * Software's "Tailored IT Solutions" (`#wtfgbc`) is `top center`.
   */
  backgroundPosition?: string | undefined;
}

/**
 * ProductCard — the `.software-page-card` grid tile. 15 instances: 9 on
 * Hardware, 6 on Software (Phase 4 recorded 8 for Hardware; the export has 9).
 *
 * The whole tile is the link, over a `cover` background photo with a
 * translucent scrim that darkens on hover. In the source the scrim is a
 * ::before overlay (Bricks `_gradient.applyTo: overlay`), which the Customizer
 * then gives a matching 16px radius:
 *   `.software-page-card.brxe-div::before { border-radius: 16px }`
 * Reproduced here as a ::before for the same stacking behaviour.
 *
 * The 8px hover lift comes from the Bricksforge "Product Cards" timeline
 * (fromTo y 0 → -8px, 0.3s, power2.out, trigger hover). It is expressed in CSS
 * with the power2.out equivalent so the card needs no JS; Phase 11 verifies it
 * against the GSAP original. The separate *entrance* timeline for this
 * selector (from y 25px / opacity 0, stagger 0.2) is Phase 11's.
 *
 * Headings render as h3. The source leaves the tag unset, so Bricks emits h2 —
 * which would put nine sibling h2s under the page h1. Every other card on the
 * site uses h3, and `.product-card-heading` sizes the text independently of
 * the heading scale, so this is a semantic fix with no visual change.
 * Change-log item #13.
 */
export function ProductCard({
  title,
  body,
  image,
  href,
  backgroundPosition = "center center",
}: ProductCardProps) {
  return (
    <Link
      href={href}
      className={styles.card}
      style={
        {
          "--card-image": `url("${image}")`,
          "--card-image-position": backgroundPosition,
        } as CSSProperties
      }
    >
      <Heading as="h3" className={styles.title}>
        {title}
      </Heading>
      <Text className={styles.body}>{body}</Text>
    </Link>
  );
}
