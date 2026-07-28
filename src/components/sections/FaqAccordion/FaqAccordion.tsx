"use client";

import { useId, useState } from "react";

import { Heading, Icon, Text } from "@/components/primitives";

import styles from "./FaqAccordion.module.css";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqAccordionProps {
  items: readonly FaqItem[];
}

/**
 * FaqAccordion — replaces the NextBricks `expander` element.
 *
 * Both instances (Home, Web Design) use identical settings: rgba(0,0,0,0.25)
 * fill, label var(--base) at --text-s hovering to white, content padding
 * 22/20/16/20, content colour var(--base-light), chevron ti-angle-down.
 * Items carry a 1px #1b1b43 border, 16px radius and 8px bottom margin.
 *
 * Multiple items can be open at once, matching the source's expander.
 */
export function FaqAccordion({ items }: FaqAccordionProps) {
  const [open, setOpen] = useState<ReadonlySet<number>>(new Set());
  const baseId = useId();

  const toggle = (index: number) =>
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });

  return (
    <div className={styles.accordion}>
      {items.map((item, index) => {
        const isOpen = open.has(index);
        const panelId = `${baseId}-panel-${index}`;
        return (
          <div key={item.question} className={styles.item} data-anim="faq-item">
            <button
              type="button"
              className={styles.question}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggle(index)}
            >
              <Heading as="h3" className={styles.label}>
                {item.question}
              </Heading>
              <span className={styles.chevronWrap}>
                <Icon
                  name="ti-angle-down"
                  size="14px"
                  className={[styles.chevron, isOpen ? styles.chevronOpen : ""].join(" ")}
                />
              </span>
            </button>

            <div id={panelId} className={styles.panel} hidden={!isOpen}>
              <Text className={styles.answer}>{item.answer}</Text>
            </div>
          </div>
        );
      })}
    </div>
  );
}
