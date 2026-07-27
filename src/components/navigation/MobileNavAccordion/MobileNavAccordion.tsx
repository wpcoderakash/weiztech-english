"use client";

import { useId, useState } from "react";

import { Icon, Link } from "@/components/primitives";
import type { NavItem } from "@/content/site";

import styles from "./MobileNavAccordion.module.css";

export interface MobileNavAccordionProps {
  label: string;
  items: readonly NavItem[];
}

/**
 * MobileNavAccordion — the "Services" disclosure inside the mobile menu.
 *
 * Reproduces the Bricks `accordion-nested` element: 50px title row, 15px
 * vertical content padding, chevron rotates when open.
 */
export function MobileNavAccordion({ label, items }: MobileNavAccordionProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className={styles.accordion}>
      <button
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className={styles.title}>{label}</span>
        <Icon
          name="ti-angle-down"
          size="14px"
          className={[styles.chevron, open ? styles.chevronOpen : ""].join(" ")}
        />
      </button>

      <div id={panelId} className={styles.panel} hidden={!open}>
        {items.map((item) => (
          <Link
            key={item.href + item.label}
            href={item.href}
            aria-label={item.ariaLabel ?? item.label}
            className={styles.item}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
