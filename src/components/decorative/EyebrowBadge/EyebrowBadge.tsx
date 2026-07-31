import { Icon } from "@/components/primitives";
import type { IconName } from "@/components/primitives";

import styles from "./EyebrowBadge.module.css";

export interface EyebrowBadgeProps {
  label: string;
  icon?: IconName | undefined;
  /** `hero` is the pill-with-chip in the hero; `section` is the icon+label pill. */
  variant?: "section" | "hero" | undefined;
  /** Hero variant only — the gradient chip before the label. */
  chip?: string | undefined;
  /**
   * Label font size. 12px on the seven badges that leave it alone; /careers/
   * is the exception — its #gtwaza sets 14, and the badge is 12px too narrow
   * without it.
   */
  labelSize?: string | undefined;
  /** Extra classes on the pill, for the per-page shell variations. */
  className?: string | undefined;
  /** Animation role, read by Reveal. Phase 11. */
  "data-anim"?: string | undefined;
}

/**
 * EyebrowBadge — the small pill above section headings (8 instances).
 *
 * Two treatments in the source:
 *  - section (.badge-wrapper > .badge-content): 8/16 padding, #2f2f6a border,
 *    50px radius, var(--tertiary-dark-trans-20) fill, icon + label.
 *  - hero (#brxe-fgciig): 6/6/6/18 padding, --tertiary-dark border,
 *    rgba(0,0,0,0.1) fill, backdrop-filter blur(2px), and a gradient "Weiz"
 *    chip before the label.
 */
export function EyebrowBadge({
  label,
  icon,
  variant = "section",
  chip,
  labelSize,
  className,
  "data-anim": dataAnim,
}: EyebrowBadgeProps) {
  return (
    <div
      data-anim={dataAnim}
      className={[styles.badge, styles[variant], className].filter(Boolean).join(" ")}
    >
      {chip ? <span className={styles.chip}>{chip}</span> : null}
      {icon ? <Icon name={icon} size="16px" color="var(--white)" /> : null}
      <span className={styles.label} style={labelSize ? { fontSize: labelSize } : undefined}>
        {label}
      </span>
    </div>
  );
}
