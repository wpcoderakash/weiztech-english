import { Icon, Text } from "@/components/primitives";

import styles from "./CheckList.module.css";

export interface CheckListProps {
  items: readonly string[];
}

/**
 * CheckList — `.wcu-list`, the six checkmark rows beside "Why Choose Us?" on
 * the Web Design page.
 *
 * A grid--auto-4 of flex rows, each a 24px var(--primary) checkmark and a
 * label. Rendered as a <ul>: it is a list, and the source's plain divs give a
 * screen reader no count.
 */
export function CheckList({ items }: CheckListProps) {
  return (
    <ul className={styles.list}>
      {items.map((item) => (
        <li key={item} className={styles.item}>
          <Icon name="ion-ios-checkmark-circle" size="24px" color="var(--primary)" />
          <Text as="span">{item}</Text>
        </li>
      ))}
    </ul>
  );
}
