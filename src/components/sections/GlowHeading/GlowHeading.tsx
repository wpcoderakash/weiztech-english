"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

import styles from "./GlowHeading.module.css";

/**
 * GlowHeading — the weiz.co.il hero-title treatment (design port, LTR).
 *
 * The reference renders each visual ROW as its own `.line` block and offsets
 * every row's sweep by a quarter cycle (`--line-i * duration / -4`), so
 * stacked rows never share a phase. Its heroes declare their line breaks
 * up front; ours wrap naturally — so the rows are DERIVED from the natural
 * wrap: a hidden measurer (same text, same width, word spans) reports each
 * word's offsetTop, words are grouped by row, and the visible markup becomes
 * the reference's block-per-row structure. A ResizeObserver regroups when
 * the container reflows, so the forced rows always equal the natural ones.
 *
 * Until the first measurement (and on the server) it renders the whole title
 * as one row — same gradient, single phase — then upgrades in place.
 */
export function GlowHeading({ children }: { children: string }) {
  const measureRef = useRef<HTMLSpanElement>(null);
  const [lines, setLines] = useState<string[][] | null>(null);
  const words = children.split(/\s+/).filter(Boolean);

  useEffect(() => {
    const el = measureRef.current;
    if (!el) return;

    const regroup = () => {
      const spans = Array.from(el.children) as HTMLElement[];
      const rows: string[][] = [];
      let lastTop: number | null = null;
      for (const span of spans) {
        const top = span.offsetTop;
        if (lastTop === null || Math.abs(top - lastTop) > 2) {
          rows.push([]);
          lastTop = top;
        }
        rows[rows.length - 1]?.push((span.textContent ?? "").trim());
      }
      setLines((prev) => {
        const next = rows.map((r) => r.join(" "));
        return prev && prev.map((r) => r.join(" ")).join("\n") === next.join("\n") ? prev : rows;
      });
    };

    regroup();
    const ro = new ResizeObserver(regroup);
    ro.observe(el);
    return () => ro.disconnect();
  }, [children]);

  return (
    <span data-glow className={styles.glow}>
      {/* Invisible measurer: the same words wrapping naturally at the same
          width, permanently in the DOM so reflows are observable. */}
      <span ref={measureRef} className={styles.measure} aria-hidden="true">
        {words.map((w, i) => (
          <span key={i} className={styles.word}>
            {w}{" "}
          </span>
        ))}
      </span>
      {lines ? (
        lines.map((row, i) => (
          <span key={i} className={styles.line} style={{ "--line-i": i } as CSSProperties}>
            {row.join(" ")}
          </span>
        ))
      ) : (
        <span className={styles.line}>{children}</span>
      )}
    </span>
  );
}
