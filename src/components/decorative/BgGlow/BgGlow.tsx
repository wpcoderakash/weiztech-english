import styles from "./BgGlow.module.css";

/**
 * BgGlow — the ambient radial orb behind the page (.bg-glow, 12 uses).
 *
 * Fixed-position so it persists across route changes without remounting;
 * that is why it is a sibling of <main> rather than a child.
 * 75% x 75% of viewport, dropping to 55% above 1512px, opacity 0.5.
 */
export function BgGlow() {
  return <div className={styles.glow} aria-hidden="true" />;
}
