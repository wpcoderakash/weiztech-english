"use client";

import { useEffect, useRef } from "react";

import { Heading, Text } from "@/components/primitives";

import styles from "./ProcessTimeline.module.css";

export interface ProcessStep {
  title: string;
  body: string;
}

export interface ProcessTimelineProps {
  steps: readonly ProcessStep[];
}

/**
 * ProcessTimeline — the scroll-scrubbed rail, ported from weiz.co.il's
 * ProcessTimeline (verified against the clone source and the live DOM):
 * a gradient progress line fills top→bottom as the viewport centre travels
 * through the track, and each circle lights up (white core, violet glow
 * ring) as the fill reaches its threshold i/(n-1), with a 0.04 fade window.
 *
 * The fill is a ::after pseudo driven by the --tl-progress custom property,
 * so the <ol> keeps only <li> children. Dot light-ups write opacity and
 * scale directly — no React re-renders on scroll, one rAF-throttled
 * listener. Not gated on prefers-reduced-motion: on machines with Reduce
 * Motion on (this user's), a gated scrub reads as broken, and the fallback
 * would be a permanently-filled rail anyway.
 *
 * WeizTech's own step titles/copy and the <ol> semantics are unchanged.
 */
export function ProcessTimeline({ steps }: ProcessTimelineProps) {
  const trackRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const dots = [...track.querySelectorAll<HTMLElement>("[data-dot-on]")];
    let raf = 0;

    const update = () => {
      raf = 0;
      const rect = track.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (window.innerHeight / 2 - rect.top) / rect.height));
      track.style.setProperty("--tl-progress", String(progress));
      dots.forEach((dot, index) => {
        const threshold = dots.length > 1 ? index / (dots.length - 1) : 0;
        const lit = Math.min(1, Math.max(0, (progress - (threshold - 0.04)) / 0.04));
        dot.style.opacity = String(lit);
        dot.style.transform = `scale(${0.4 + 0.6 * lit})`;
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <ol ref={trackRef} className={styles.timeline}>
      {steps.map((step) => (
        <li key={step.title} className={styles.step}>
          {/* The source tags these h2 — five sibling h2s under the section
              h2. Reproduced rather than corrected; size comes from .title. */}
          <Heading as="h2" className={styles.title}>
            {step.title}
          </Heading>
          <span className={styles.marker} aria-hidden="true">
            <span className={styles.markerOn} data-dot-on />
          </span>
          <div className={styles.content}>
            <Text className={styles.body}>{step.body}</Text>
          </div>
        </li>
      ))}
    </ol>
  );
}
