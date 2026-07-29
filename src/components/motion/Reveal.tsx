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
  /**
   * ScrollTrigger start. Defaults to the source's own `top+=20% bottom` —
   * the animation begins as soon as the section is 20% into view, not when
   * it is already 80% up the screen.
   */
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
  start = "top+=20% bottom",
  end = "bottom bottom",
  className,
}: RevealProps) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;

    const gsap = initGsap();
    const splits: { revert: () => void }[] = [];

    /* Every element this timeline touches, so the end state can be forced. */
    const allTargets: HTMLElement[] = [];

    /**
     * Only the properties these tweens actually animate are cleared.
     * `clearProps: "all"` is wrong here: it strips every inline style GSAP
     * has touched, including ones React set — the contact form's
     * --field-padding-block and the product tiles' --card-image among them.
     * That silently shortened two Home sections by ~30px each.
     */
    const animatedProps = new Set<string>();
    for (const step of steps) {
      for (const key of Object.keys(step.from)) {
        if (key === "autoAlpha") {
          animatedProps.add("opacity");
          animatedProps.add("visibility");
        } else if (["x", "y", "scale", "scaleX", "scaleY", "rotate"].includes(key)) {
          animatedProps.add("transform");
        } else {
          animatedProps.add(key);
        }
      }
    }
    const clearProps = [...animatedProps].join(",");

    const ctx = gsap.context(() => {
      /* The wrapper is display:contents and so has no box of its own —
         ScrollTrigger needs a real one, which is the section inside it. */
      const measurable = (el.firstElementChild as HTMLElement | null) ?? el;

      const tl = gsap.timeline(
        trigger === "scroll"
          ? { scrollTrigger: { trigger: measurable, start, end, scrub: scrub ? true : false } }
          : {},
      );

      /* Clearing inline styles on completion means a finished section carries
         no residual opacity or transform — and nothing GSAP set can outlive
         the animation that set it. */
      tl.eventCallback("onComplete", () => {
        gsap.set(allTargets, { clearProps });
      });

      for (const step of steps) {
        const nodes = Array.from(el.querySelectorAll<HTMLElement>(step.target));
        if (!nodes.length) continue;
        allTargets.push(...nodes);

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

    /* Failsafe. If a timeline never completes — a ScrollTrigger that cannot
       resolve, a tween that never runs — content must not be left invisible.
       After four seconds anything still hidden is snapped to its end state.
       Nothing on this site animates for longer than ~2s. */
    const failsafe = window.setTimeout(() => {
      const stuck = allTargets.filter((n) => Number(getComputedStyle(n).opacity) < 0.99);
      if (stuck.length) gsap.set(stuck, { clearProps });
    }, 4000);

    return () => {
      window.clearTimeout(failsafe);
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
