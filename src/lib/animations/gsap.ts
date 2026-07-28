"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

/**
 * GSAP setup.
 *
 * The original drives every animation through Bricksforge, which is GSAP with
 * a UI on top. Reproducing the tweens in CSS would mean approximating GSAP's
 * eases with cubic-beziers and giving up scrub entirely — four of Home's
 * timelines are scrubbed to scroll position. Phase 11's instruction is not to
 * change timing, duration or behaviour, so the same engine is the honest
 * choice. PHASE-6 §1 left the licence question open pending Phase 7; GSAP
 * 3.15 ships under the standard no-charge licence and includes both
 * ScrollTrigger and SplitText, so the Club-plugin constraint no longer exists.
 */
let registered = false;

export function initGsap(): typeof gsap {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, SplitText);
    registered = true;
  }
  return gsap;
}

/** True when the visitor asked for less motion. */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export { gsap, ScrollTrigger, SplitText };
