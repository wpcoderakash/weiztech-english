import type { CSSProperties, ElementType, ReactNode } from "react";

import styles from "./Grid.module.css";

export interface GridProps {
  children: ReactNode;
  as?: "div" | "ul" | "section" | undefined;
  /**
   * `auto-N` uses the intrinsic ACSS pattern: columns collapse via auto-fit
   * against a 0.7 ideal-width ratio, with no media queries.
   * `1-2` is the fixed 1fr/2fr split.
   */
  columns?: "auto-2" | "auto-3" | "auto-4" | "1-2" | "4" | "5" | undefined;
  gap?: string | undefined;
  className?: string | undefined;
  style?: CSSProperties | undefined;
}

/** Grid — reproduces the six grid patterns the source actually uses. */
export function Grid({
  children,
  as = "div",
  columns = "auto-3",
  gap,
  className,
  style,
}: GridProps) {
  const Tag = as as ElementType;
  return (
    <Tag
      className={[styles.grid, styles[`c-${columns}`], className].filter(Boolean).join(" ")}
      style={{ gap, ...style }}
    >
      {children}
    </Tag>
  );
}
