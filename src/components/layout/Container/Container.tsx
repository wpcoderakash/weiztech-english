import type { ElementType, ReactNode } from "react";

import styles from "./Container.module.css";

export interface ContainerProps {
  children: ReactNode;
  as?: "div" | "section" | "header" | "footer" | "nav" | "main" | undefined;
  className?: string | undefined;
  id?: string | undefined;
}

/**
 * Container — 1200px max width, gutter-aware.
 *
 * All 85 container elements in the source use the default width with no
 * per-instance overrides, so this deliberately exposes no width prop.
 */
export function Container({ children, as = "div", className, id }: ContainerProps) {
  const Tag = as as ElementType;
  return (
    <Tag id={id} className={[styles.container, className].filter(Boolean).join(" ")}>
      {children}
    </Tag>
  );
}
