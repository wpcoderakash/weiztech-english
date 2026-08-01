import Image from "next/image";

import { LANGUAGE_TOGGLE } from "@/content/site";

import { NavSwapLink } from "../NavSwapLink";

import styles from "./LanguageToggle.module.css";

export interface LanguageToggleProps {
  /** `pill` is the header treatment; `outlined` is the mobile-menu treatment. */
  variant?: "pill" | "outlined" | undefined;
}

/**
 * LanguageToggle — links to the separate Hebrew WordPress install at
 * weiz.co.il. The two sites are independent installs, not a multilingual
 * plugin, and there is no hreflang between them (flagged in PHASE-1 §9.5).
 *
 * Structure follows the live header exactly (probed element-by-element):
 * the PILL IS NOT A LINK. It is a bordered div (1px #1b1b43, 250px radius,
 * 8/16 padding) holding the flag and a `swap-hover` anchor — only the "HE"
 * text is clickable, and it rolls on hover like the nav links. An earlier
 * revision wrapped the whole pill in one <a> with a static label, which is
 * why the header toggle had no hover at all.
 */
export function LanguageToggle({ variant = "pill" }: LanguageToggleProps) {
  return (
    <div className={[styles.toggle, styles[variant]].join(" ")}>
      <Image
        src={LANGUAGE_TOGGLE.flag.src}
        alt={LANGUAGE_TOGGLE.flag.alt}
        width={LANGUAGE_TOGGLE.flag.width}
        height={LANGUAGE_TOGGLE.flag.height}
        className={styles.flag}
      />
      <NavSwapLink
        label={LANGUAGE_TOGGLE.label}
        href={LANGUAGE_TOGGLE.href}
        ariaLabel={LANGUAGE_TOGGLE.ariaLabel}
        className={styles.label}
      />
    </div>
  );
}
