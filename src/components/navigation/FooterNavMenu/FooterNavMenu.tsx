import { Heading, Link } from "@/components/primitives";
import type { NavItem } from "@/content/site";

import styles from "./FooterNavMenu.module.css";

export interface FooterNavMenuProps {
  title: string;
  items: readonly NavItem[];
  /** The source underlines only the first column's heading. */
  underlineTitle?: boolean | undefined;
}

/**
 * FooterNavMenu — replaces the Bricks `nav-menu` element (2 instances).
 *
 * Renders as static data rather than a WordPress menu: 14px white links,
 * 4px vertical margins, hover to --secondary over 0.2s ease-in-out.
 */
export function FooterNavMenu({ title, items, underlineTitle }: FooterNavMenuProps) {
  return (
    <div className={styles.column}>
      <Heading
        as="h3"
        className={[styles.title, underlineTitle ? styles.titleUnderlined : ""].join(" ")}
      >
        {title}
      </Heading>

      <ul className={styles.list} role="list">
        {items.map((item) => (
          <li key={item.href + item.label}>
            <Link
              href={item.href}
              aria-label={item.ariaLabel ?? item.label}
              className={styles.link}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
