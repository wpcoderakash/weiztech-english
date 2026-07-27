import type { CSSProperties, ElementType, ReactNode } from "react";

import styles from "./Stack.module.css";

type SpaceToken = "xs" | "s" | "m" | "l" | "xl" | "xxl";

export interface StackProps {
  children: ReactNode;
  as?: "div" | "ul" | "li" | "nav" | "section" | "header" | "footer" | undefined;
  direction?: "row" | "column" | undefined;
  gap?: SpaceToken | string | undefined;
  align?: CSSProperties["alignItems"] | undefined;
  justify?: CSSProperties["justifyContent"] | undefined;
  wrap?: boolean | undefined;
  className?: string | undefined;
  style?: CSSProperties | undefined;
}

const SPACE: Record<SpaceToken, string> = {
  xs: "var(--space-xs)",
  s: "var(--space-s)",
  m: "var(--space-m)",
  l: "var(--space-l)",
  xl: "var(--space-xl)",
  xxl: "var(--space-xxl)",
};

function resolveGap(gap: StackProps["gap"]): string | undefined {
  if (!gap) return undefined;
  return gap in SPACE ? SPACE[gap as SpaceToken] : gap;
}

/**
 * Stack — flex layout primitive.
 *
 * The dominant layout mechanism in the source: 695 of 1,450 elements are
 * flex containers (div/block/container/section). Grid is used sparingly.
 */
export function Stack({
  children,
  as = "div",
  direction = "column",
  gap,
  align,
  justify,
  wrap,
  className,
  style,
}: StackProps) {
  const Tag = as as ElementType;
  return (
    <Tag
      className={[styles.stack, className].filter(Boolean).join(" ")}
      style={{
        flexDirection: direction,
        gap: resolveGap(gap),
        alignItems: align,
        justifyContent: justify,
        flexWrap: wrap ? "wrap" : undefined,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
