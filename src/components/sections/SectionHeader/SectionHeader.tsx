import { EyebrowBadge } from "@/components/decorative";
import { Heading, Text } from "@/components/primitives";
import type { IconName } from "@/components/primitives";

import styles from "./SectionHeader.module.css";

export interface SectionHeaderProps {
  /** Row gap between eyebrow, heading and body. Defaults to var(--space-xs). */
  gap?: "xs" | "s" | undefined;
  eyebrow?: { label: string; icon?: IconName | undefined } | undefined;
  heading: string;
  headingId?: string | undefined;
  body?: string | undefined;
  /** Constrains the body to 40% of content width, as several sections do. */
  bodyWidth?: "m" | "l" | "full" | undefined;
  /**
   * Constrains the heading the same way. The Web Design page sets
   * `width: var(--width-m)` on two of its section headings, which also pulls
   * the whole header block in to that width.
   */
  headingWidth?: "m" | "l" | "full" | undefined;
  /** #98a2b3 on several section bodies, against the --base default. */
  bodyTone?: "base" | "muted" | undefined;
  /**
   * Heading weight. 600 is the theme default and what most source headings
   * resolve to; only Home's Services heading declares 500.
   */
  headingWeight?: 500 | 600 | undefined;
  /**
   * Extra classes on the body paragraph — for the ACSS text utilities
   * (`text--s` / `text--xs`), which set a line-height the size tokens alone
   * do not. See Text.module.css.
   */
  bodyClassName?: string | undefined;
  align?: "center" | "start" | undefined;
  children?: React.ReactNode | undefined;
}

/**
 * SectionHeader — eyebrow + heading + optional body.
 *
 * The most reused composite on the site (~14 instances). `children` renders
 * below the body, which Home uses for its star rating.
 */
export function SectionHeader({
  gap = "xs",
  eyebrow,
  heading,
  headingId,
  body,
  bodyWidth = "full",
  headingWidth = "full",
  bodyTone = "base",
  headingWeight = 600,
  bodyClassName,
  align = "center",
  children,
}: SectionHeaderProps) {
  return (
    <div className={[styles.header, styles[align], styles[`gap-${gap}`]].join(" ")}>
      {eyebrow ? (
        <EyebrowBadge label={eyebrow.label} icon={eyebrow.icon} data-anim="eyebrow" />
      ) : null}
      <Heading
        as="h2"
        id={headingId}
        data-anim="heading"
        className={[styles[`weight-${headingWeight}`], styles[`body-${headingWidth}`]].join(" ")}
      >
        {heading}
      </Heading>
      {body ? (
        <Text
          size="s"
          tone={bodyTone}
          data-anim="body"
          className={[styles[`body-${bodyWidth}`], bodyClassName].filter(Boolean).join(" ")}
        >
          {body}
        </Text>
      ) : null}
      {children}
    </div>
  );
}
