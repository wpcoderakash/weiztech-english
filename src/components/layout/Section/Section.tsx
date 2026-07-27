import type { ElementType, ReactNode } from "react";

import styles from "./Section.module.css";

export interface SectionProps {
  children: ReactNode;
  as?: "section" | "div" | "footer" | "header" | undefined;
  /**
   * Vertical rhythm. `default` is `var(--space-xl)` top and bottom — used by
   * 24 of the 57 sections in the source. See PHASE-2 §6.4 for the full
   * distribution.
   */
  spacing?: "default" | "large" | "compact" | "tight" | "none" | undefined;
  className?: string | undefined;
  id?: string | undefined;
}

/** Section — full-bleed band with the site's standard padding rhythm. */
export function Section({
  children,
  as = "section",
  spacing = "default",
  className,
  id,
}: SectionProps) {
  const Tag = as as ElementType;
  return (
    <Tag id={id} className={[styles.section, styles[spacing], className].filter(Boolean).join(" ")}>
      {children}
    </Tag>
  );
}
