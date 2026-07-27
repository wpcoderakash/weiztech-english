import { Link } from "@/components/primitives";

import styles from "./NavSwapLink.module.css";

export interface NavSwapLinkProps {
  label: string;
  href: string;
  ariaLabel?: string | undefined;
  className?: string | undefined;
}

/**
 * NavSwapLink — replaces the NextBricks `swap-hover` element (7 instances).
 *
 * On hover the label slides up out of a clipped box while a duplicate slides
 * in from below. The original is pure CSS (no JS), and so is this: the
 * duplicate comes from a ::after using attr(data-text).
 *
 * Timing is transcribed from plugins/nextbricks/elements/css/bc_swap_title.css:
 * 1s, cubic-bezier(0.19, 1, 0.22, 1), 0deg skew, from-below.
 */
export function NavSwapLink({ label, href, ariaLabel, className }: NavSwapLinkProps) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel ?? label}
      className={[styles.anchor, className].filter(Boolean).join(" ")}
    >
      <span className={styles.clip}>
        <span className={styles.text} data-text={label}>
          {label}
        </span>
      </span>
    </Link>
  );
}
