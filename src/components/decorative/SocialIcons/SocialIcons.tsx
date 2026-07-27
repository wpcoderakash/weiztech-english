import { Icon } from "@/components/primitives";
import type { IconName } from "@/components/primitives";
import { SOCIALS } from "@/content/site";

import styles from "./SocialIcons.module.css";

/** SocialIcons — footer only. X, LinkedIn, WhatsApp (FontAwesome Brands). */
export function SocialIcons() {
  return (
    <ul className={styles.list} role="list">
      {SOCIALS.map((social) => (
        <li key={social.href}>
          <a
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            className={styles.link}
          >
            <Icon name={social.icon as IconName} size="20px" />
          </a>
        </li>
      ))}
    </ul>
  );
}
