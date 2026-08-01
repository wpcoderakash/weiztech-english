"use client";

import { useId, useRef, useState } from "react";

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
 * Design ported from weiz.co.il's FaqAccordion (verified live 1 Aug 2026):
 * open items tint violet with a #9666ff border, glow and question divider,
 * and the answer slides via an inline measured max-height (see module CSS).
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
          <div
            key={item.question}
            className={[styles.item, isOpen ? styles.itemOpen : ""].join(" ").trim()}
            data-anim="faq-item"
          >
            <button
              type="button"
              className={[styles.question, isOpen ? styles.questionOpen : ""].join(" ").trim()}
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

            {/*
              Collapsed via max-height, not `hidden`: the answer stays in
              layout flow inside a clipped container, so it participates in
              find-in-page and can animate open. The open height is the
              measured scrollHeight — `auto` cannot tween. `inert` keeps the
              closed panel out of the tab order and the accessibility tree.
            */}
            <AnswerPanel id={panelId} isOpen={isOpen} answer={item.answer} />
          </div>
        );
      })}
    </div>
  );
}

function AnswerPanel({ id, isOpen, answer }: { id: string; isOpen: boolean; answer: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const maxBlockSize = isOpen && ref.current ? `${ref.current.scrollHeight}px` : "0px";

  return (
    <div id={id} className={styles.panel} style={{ maxBlockSize }} inert={!isOpen}>
      <div ref={ref}>
        <Text className={styles.answer}>{answer}</Text>
      </div>
    </div>
  );
}
