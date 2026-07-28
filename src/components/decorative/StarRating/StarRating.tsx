import { Icon } from "@/components/primitives";

import styles from "./StarRating.module.css";

/** StarRating — the five-star row in the Home "Why Choose Us" heading block. */
export function StarRating({ count = 5 }: { count?: number | undefined }) {
  return (
    <div className={styles.stars} role="img" aria-label={`${count} out of ${count} stars`}>
      {Array.from({ length: count }, (_, i) => (
        <Icon key={i} data-anim="star" name="ion-ios-star" size="28px" color="#ffd900" />
      ))}
    </div>
  );
}
