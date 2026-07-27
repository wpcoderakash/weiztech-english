import styles from "./loading.module.css";

/**
 * Route-level loading UI.
 *
 * The original has no loading state — WordPress served fully-rendered HTML.
 * All 19 routes here are static, so this should rarely appear; it exists as a
 * safety net for client-side navigation.
 */
export default function Loading() {
  return (
    <div className={styles.wrapper} role="status" aria-live="polite">
      <span className={styles.spinner} aria-hidden="true" />
      <span className="visually-hidden">Loading</span>
    </div>
  );
}
