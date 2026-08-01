import type { CSSProperties } from "react";

import { Heading, Link, Text } from "@/components/primitives";

import styles from "./ProductCard.module.css";

export interface ProductCardProps {
  title: string;
  body: string;
  /** Background photo, served from /public/images. */
  image: string;
  /** Omit for a non-interactive tile — Cybersec's `.ce-card` carries no link. */
  href?: string | undefined;
  /**
   * Bricks `_background.position`. Every tile but one is `center center`;
   * Software's "Tailored IT Solutions" (`#wtfgbc`) is `top center`.
   */
  backgroundPosition?: string | undefined;
  /** Per-page overrides — `.ce-card` pads and gaps differently from `.software-page-card`. */
  className?: string | undefined;
  /**
   * Wrap the heading and text in an inner block, as `.ce-card` does. That
   * block is shrink-to-fit but stretches its own children, so the heading
   * and the body end up the SAME width — whichever of the two is wider,
   * capped at the card's content box. Without it they size independently
   * and both measure wrong.
   */
  innerWrap?: boolean | undefined;
}

/**
 * ProductCard — the `.software-page-card` grid tile. 19 instances: 9 on
 * Hardware, 6 on Software, and 4 on Cybersec as `.ce-card`, which is the same
 * tile under another name — 16px radius, 224px minimum, the same #1b1b43 scrim
 * darkening to #030118 on hover, and the same `.product-card-heading` /
 * `.product-card-text` inside. Cybersec's carry no link, so `href` is
 * optional and the tile renders as a div.
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
  className,
  innerWrap = false,
}: ProductCardProps) {
  const cardClass = styles.card;
  /* The glow ring lives on an unclipped wrapper — the card root clips
     overflow for its background image. The caller's className stays on the
     wrapper so grid placement is untouched. */
  const wrapClass = ["cta-cursor-glow cta-cursor-glow--hover cta-cursor-glow--spot", className]
    .filter(Boolean)
    .join(" ");
  const wrapStyle: CSSProperties = { blockSize: "100%", borderRadius: "var(--radius-lg)" };
  const inner = (
    <>
      <Heading as="h3" className={styles.title}>
        {title}
      </Heading>
      <Text className={styles.body}>{body}</Text>
    </>
  );
  const content = innerWrap ? <div className={styles.inner}>{inner}</div> : inner;

  const style = {
    "--card-image": `url("${image}")`,
    "--card-image-position": backgroundPosition,
  } as CSSProperties;

  if (!href) {
    return (
      <div className={wrapClass} style={wrapStyle}>
        <div className={cardClass} style={style} data-anim="card">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className={wrapClass} style={wrapStyle}>
      <Link href={href} className={cardClass} style={style} data-anim="card">
        {content}
      </Link>
    </div>
  );
}
