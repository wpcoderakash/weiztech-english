import type { ElementType, ReactNode } from "react";

import styles from "./Heading.module.css";

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export interface HeadingProps {
  children: ReactNode;
  /** Semantic element. Defaults to h2 — matching Bricks' own default. */
  as?: HeadingLevel | undefined;
  /**
   * Visual size, when it must differ from the semantic level.
   * Keeps document outline and appearance independently correct.
   */
  size?: HeadingLevel | undefined;
  className?: string | undefined;
  id?: string | undefined;
  /** Animation role, read by Reveal. Phase 11. */
  "data-anim"?: string | undefined;
}

/**
 * Heading — Rubik 600, white, sizes from the fluid scale.
 *
 * The source's tag distribution is h2 x122, h3 x24, h1 x14, h4 x4, h5 x2.
 * Bricks defaults untagged headings to h2, so that is the default here too.
 */
export function Heading({
  children,
  as = "h2",
  size,
  className,
  id,
  "data-anim": dataAnim,
}: HeadingProps) {
  const Tag = as as ElementType;
  const visual = size ?? as;

  return (
    <Tag
      id={id}
      data-anim={dataAnim}
      className={[styles.heading, styles[visual], className].filter(Boolean).join(" ")}
    >
      {children}
    </Tag>
  );
}
