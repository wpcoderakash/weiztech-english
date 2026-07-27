"use client";

import { useId, useState } from "react";

import { PricingCard } from "@/components/cards";
import type { PricingPlan } from "@/components/cards";

import styles from "./PricingTabs.module.css";

export interface PricingTab {
  id: string;
  label: string;
}

export interface PricingTabsProps {
  tabs: readonly PricingTab[];
  plans: Readonly<Record<string, readonly PricingPlan[]>>;
  cta: { label: string; href: string };
}

/**
 * PricingTabs — the Bricks `tabs-nested` element wrapping the Monthly and
 * Annually pricing panels.
 *
 * The only interactive element on this page, so the only client component.
 * Bricks ships its own tab script; this is the standard ARIA tab pattern with
 * arrow-key navigation, which that script does not implement.
 *
 * Both panels are rendered and the inactive one hidden, rather than swapped:
 * the annual prices are content, and hiding them with `hidden` keeps them in
 * the document for search engines while removing them from the a11y tree.
 */
export function PricingTabs({ tabs, plans, cta }: PricingTabsProps) {
  const [active, setActive] = useState(tabs[0]?.id ?? "");
  const base = useId();

  function onKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    const delta = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    event.preventDefault();
    const next = tabs[(index + delta + tabs.length) % tabs.length];
    if (!next) return;
    setActive(next.id);
    document.getElementById(`${base}-tab-${next.id}`)?.focus();
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.tabList} role="tablist" aria-label="Billing period">
        {tabs.map((tab, i) => (
          <button
            key={tab.id}
            id={`${base}-tab-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={tab.id === active}
            aria-controls={`${base}-panel-${tab.id}`}
            tabIndex={tab.id === active ? 0 : -1}
            className={[styles.tab, tab.id === active ? styles.tabActive : ""]
              .filter(Boolean)
              .join(" ")}
            onClick={() => setActive(tab.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tabs.map((tab) => (
        <div
          key={tab.id}
          id={`${base}-panel-${tab.id}`}
          role="tabpanel"
          aria-labelledby={`${base}-tab-${tab.id}`}
          hidden={tab.id !== active}
          className={styles.panel}
        >
          <div className={styles.grid}>
            {(plans[tab.id] ?? []).map((plan) => (
              <PricingCard key={plan.name} plan={plan} cta={cta} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
