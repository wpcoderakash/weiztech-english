/**
 * BREAKPOINTS
 *
 * The original site runs THREE separate breakpoint ladders simultaneously.
 * All three must be reproduced or elements shift at the wrong widths.
 * The 1px offsets between ladders A and B are real, not rounding errors:
 * at exactly 992px the ACSS utility applies but the Bricks override does not.
 *
 * See PHASE-2-DESIGN-TOKENS.md §16.
 *
 * CSS cannot use custom properties in media queries, so these live here as the
 * single source of truth for JS-side queries (GSAP matchMedia, useMediaQuery)
 * and as the reference when hand-writing @media rules in CSS Modules.
 */

/** Ladder A — ACSS utility classes. Applied as `max-width`. */
export const ACSS = {
  xl: 1180,
  l: 992,
  m: 768,
  s: 480,
} as const;

/** Ladder B — Bricks per-element responsive overrides. Applied as `max-width`. */
export const BRICKS = {
  /** 2 overrides in the source */
  tabletPortrait: 991,
  /** 181 overrides — the dominant mobile breakpoint */
  mobileLandscape: 767,
  /** 83 overrides */
  mobilePortrait: 478,
} as const;

/** Ladder C — GSAP matchMedia gates. Applied as `min-width`. */
export const MOTION = {
  /** 5 timelines: the "Home (Desktop)" set. Exists in no other ladder. */
  lg: 1480,
  /** 27 timelines */
  md: 768,
} as const;

/** One-off: `.bg-glow` shrinks from 75% to 55% above this width. */
export const GLOW_BREAKPOINT = 1512;

/** Viewport range across which the fluid type/space scales interpolate. */
export const FLUID_RANGE = { min: 320, max: 1200 } as const;

export const mediaMaxWidth = (px: number) => `(max-width: ${px}px)`;
export const mediaMinWidth = (px: number) => `(min-width: ${px}px)`;
