import type { ElementType, ReactNode } from "react";

import { isRunArray } from "@/lib/cms/runs";
import type { TextRun } from "@/types/content";

import { RichRuns } from "./RichRuns";
import styles from "./Text.module.css";

export interface TextProps {
  /** Plain copy, or TextRun[] once an editor applies bold/italic/link. */
  children: ReactNode | readonly TextRun[];
  /** Defaults to <p>. */
  as?: "p" | "span" | "div" | "li" | "strong" | "em" | undefined;
  /** Maps to the fluid text scale. Defaults to `s` — the theme-style default. */
  size?: "xs" | "s" | "m" | "l" | "xl" | "xxl" | undefined;
  /** `base` is body copy, `muted` is the #98a2b3 caption colour, `white` is emphasis. */
  tone?: "base" | "muted" | "white" | undefined;
  weight?: 400 | 500 | 600 | undefined;
  className?: string | undefined;
  /** Animation role, read by Reveal. Phase 11. */
  "data-anim"?: string | undefined;
}

/**
 * Text — maps the Bricks `text-basic` element (290 instances).
 *
 * Defaults reproduce the theme style: var(--base) at var(--text-s).
 * Note this is NOT the document body colour (#cdd2db) — Bricks overrides
 * every text element to var(--base), and virtually all copy is in text
 * elements. See PHASE-2 §4.2.
 */
export function Text({
  children,
  as = "p",
  size = "s",
  tone = "base",
  weight,
  className,
  "data-anim": dataAnim,
}: TextProps) {
  const Tag = as as ElementType;

  /* CMS rich copy: a runs array renders as inline strong/em/link; plain
     strings and normal children are untouched (identical output). */
  const content = isRunArray(children) ? (
    <RichRuns runs={children} linkClassName={styles.richLink ?? ""} />
  ) : (
    (children as ReactNode)
  );

  return (
    <Tag
      data-anim={dataAnim}
      className={[styles.text, styles[`size-${size}`], styles[`tone-${tone}`], className]
        .filter(Boolean)
        .join(" ")}
      style={weight ? { fontWeight: weight } : undefined}
    >
      {content}
    </Tag>
  );
}
