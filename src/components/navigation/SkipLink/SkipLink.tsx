import styles from "./SkipLink.module.css";

/**
 * SkipLink — NEW, not present in the original.
 *
 * Added alongside the restored focus indicators (change-log #7). The original
 * disables focus outlines site-wide, so keyboard users had neither a visible
 * focus ring nor a way past the header.
 */
export function SkipLink() {
  return (
    <a href="#main" className={styles.skipLink}>
      Skip to content
    </a>
  );
}
