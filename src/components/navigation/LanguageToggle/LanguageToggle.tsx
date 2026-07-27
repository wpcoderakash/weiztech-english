import Image from "next/image";

import { LANGUAGE_TOGGLE } from "@/content/site";

import styles from "./LanguageToggle.module.css";

export interface LanguageToggleProps {
  /** `pill` is the header treatment; `outlined` is the mobile-menu treatment. */
  variant?: "pill" | "outlined" | undefined;
}

/**
 * LanguageToggle — links to the separate Hebrew WordPress install at
 * weiz.co.il. The two sites are independent installs, not a multilingual
 * plugin, and there is no hreflang between them (flagged in PHASE-1 §9.5).
 */
export function LanguageToggle({ variant = "pill" }: LanguageToggleProps) {
  return (
    <a
      href={LANGUAGE_TOGGLE.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={LANGUAGE_TOGGLE.ariaLabel}
      className={[styles.toggle, styles[variant]].join(" ")}
    >
      <Image
        src={LANGUAGE_TOGGLE.flag.src}
        alt={LANGUAGE_TOGGLE.flag.alt}
        width={LANGUAGE_TOGGLE.flag.width}
        height={LANGUAGE_TOGGLE.flag.height}
        className={styles.flag}
      />
      <span className={styles.label}>{LANGUAGE_TOGGLE.label}</span>
    </a>
  );
}
