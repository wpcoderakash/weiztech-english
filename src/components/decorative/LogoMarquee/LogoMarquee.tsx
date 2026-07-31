import type { CSSProperties } from "react";

import Image from "next/image";

import styles from "./LogoMarquee.module.css";

export interface MarqueeLogo {
  src: string;
  alt: string;
  /** The file's intrinsic size — the source renders these at natural size. */
  width: number;
  height: number;
  /**
   * A forced render height, where the source sets one on the image element.
   * Three of Hardware's eleven vendor logos carry `height: 20px`; all nine of
   * Software's carry 42px.
   */
  renderHeight?: string;
}

export interface LogoMarqueeProps {
  logos: readonly MarqueeLogo[];
  /** Forced height for every logo — Software sets 42px on all nine. */
  logoHeight?: string | undefined;
}

/**
 * LogoMarquee — replaces the NextBricks `marquee` element (4 instances, all
 * with identical settings: speed 24, blurEdges, 20% edge width, #121212 edges).
 *
 * The original loads Splide for this, then forces
 * `transition-timing-function: linear` on it via Customizer CSS so it behaves
 * like a constant-speed CSS animation. The project's own `.track` class already
 * defines exactly that as a keyframe animation, so this is pure CSS and ships
 * as a Server Component — no Splide, no JS.
 *
 * Logos render at their intrinsic size, capped at the 110px content width of
 * the slide. Stretching them all to 110px instead — which this component used
 * to do — made the tallest logo 54px against the original's 40px and pushed
 * everything below the Hardware marquee down by 14px.
 *
 * The list is duplicated so translateX(-50%) loops seamlessly.
 */
export function LogoMarquee({ logos, logoHeight }: LogoMarqueeProps) {
  return (
    <div
      data-anim="marquee"
      className={styles.viewport}
      style={logoHeight ? ({ "--logo-height": logoHeight } as CSSProperties) : undefined}
    >
      <div className={styles.track}>
        {[0, 1].map((copy) => (
          <div key={copy} className={styles.group} aria-hidden={copy === 1 ? true : undefined}>
            {logos.map((logo) => {
              /*
               * The img's box is computed HERE, from dimensions we already
               * know, and set inline — so the box exists before a single
               * byte of the image arrives. Deriving it from the loaded
               * image (the old `block-size: var(--logo-height, auto)`)
               * meant the whole band's height depended on image arrival:
               * under Lighthouse's throttling the logos landed late, the
               * band grew from 0 to 67px, and everything below shifted —
               * a 0.4 CLS attributed to the footer.
               *
               * Forced-height logos get exactly height x natural ratio;
               * natural ones get min(slot, natural width) with the ratio
               * supplying the height. Both equal the loaded rendering, so
               * measured parity is unchanged.
               */
              const forced = logo.renderHeight ?? logoHeight;
              const imgStyle: CSSProperties = forced
                ? {
                    blockSize: forced,
                    inlineSize: `calc(${forced} * ${logo.width} / ${logo.height})`,
                    maxInlineSize: "100%",
                  }
                : {
                    inlineSize: `min(100%, ${logo.width}px)`,
                    blockSize: "auto",
                    aspectRatio: `${logo.width} / ${logo.height}`,
                  };
              return (
                <div key={`${copy}-${logo.src}`} className={styles.item}>
                  <Image
                    src={logo.src}
                    alt={copy === 1 ? "" : logo.alt}
                    width={logo.width}
                    height={logo.height}
                    /*
                     * Eager, never lazy. The track animates horizontally, so
                     * slides past the viewport edge never intersect and a lazy
                     * image never STARTS loading — and an unloaded logo with
                     * auto sizing collapses to 0x0, which at 767px silently
                     * shrank the whole marquee band 14px (Fujitsu, the tallest
                     * logo, was the one that never loaded). Measured.
                     */
                    loading="eager"
                    style={imgStyle}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
