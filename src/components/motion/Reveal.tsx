"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

import { SplitText, initGsap, prefersReducedMotion } from "@/lib/animations/gsap";

export interface RevealStep {
  /** CSS selector, scoped to this Reveal's subtree. */
  target: string;
  /** Bricksforge `controls` — the FROM state. */
  from: gsap.TweenVars;
  duration?: number;
  ease?: string;
  /** Bricksforge `position`: ">" after the previous, "<" alongside it. */
  position?: ">" | "<" | number;
  /** Split the target into words and stagger them. */
  splitWords?: boolean;
  stagger?: number;
}

export interface RevealProps {
  children: ReactNode;
  steps: RevealStep[];
  /**
   * `load` fires once on mount (Bricksforge `pageLoad`); `scroll` ties the
   * timeline to the section entering the viewport. `scrub` links progress to
   * scroll position rather than playing straight through — four of Home's
   * five timelines do this.
   */
  trigger?: "load" | "scroll";
  scrub?: boolean;
  /** ScrollTrigger start, in Bricksforge's own syntax. */
  start?: string;
  end?: string;
  className?: string;
}

/**
 * Reveal — runs one Bricksforge timeline over its own subtree.
 *
 * Elements are hidden by the tween's `from` state, set in JS. The original
 * does the reverse: `.brf-prevent-fouc` hides them in CSS and the script
 * reveals them, which means content is invisible if the script never runs.
 * Setting the initial state here keeps the page readable without JS and looks
 * identical once it loads.
 *
 * With `prefers-reduced-motion: reduce` nothing animates and nothing is
 * hidden — the section renders in its final state.
 */
export function Reveal({
  children,
  steps,
  trigger = "load",
  scrub = false,
  start = "top 80%",
  end = "bottom bottom",
  className,
}: RevealProps) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;

    const gsap = initGsap();
    const splits: { revert: () => void }[] = [];

    const ctx = gsap.context(() => {
      /* The wrapper is display:contents and so has no box of its own —
         ScrollTrigger needs a real one, which is the section inside it. */
      const measurable = (el.firstElementChild as HTMLElement | null) ?? el;

      const tl = gsap.timeline(
        trigger === "scroll"
          ? { scrollTrigger: { trigger: measurable, start, end, scrub: scrub ? true : false } }
          : {},
      );

      for (const step of steps) {
        const nodes = Array.from(el.querySelectorAll<HTMLElement>(step.target));
        if (!nodes.length) continue;

        const vars: gsap.TweenVars = {
          ...step.from,
          duration: step.duration ?? 0.3,
          ease: step.ease ?? "power1.out",
        };

        if (step.splitWords) {
          const split = new SplitText(nodes[0] as HTMLElement, { type: "words" });
          splits.push(split);
          tl.from(split.words, { ...vars, stagger: step.stagger ?? 0.02 }, step.position ?? ">");
          continue;
        }

        tl.from(
          nodes,
          step.stagger ? { ...vars, stagger: step.stagger } : vars,
          step.position ?? ">",
        );
      }
    }, el);

    return () => {
      ctx.revert();
      splits.forEach((s) => s.revert());
    };
  }, [steps, trigger, scrub, start, end]);

  /* `display: contents` keeps this wrapper out of the box tree entirely, so
     inserting a Reveal around a Section cannot disturb the grid or flex
     layout the pages were measured against. */
  return (
    <div ref={root} className={className} style={{ display: "contents" }}>
      {children}
    </div>
  );
}
