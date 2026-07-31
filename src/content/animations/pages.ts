import type { RevealStep } from "@/components/motion";

/**
 * PAGE ANIMATIONS — transcribed from bricksforge_timelines.json.
 *
 * Selectors are `data-anim` roles; every duration, ease, offset, stagger and
 * sequence position is the source's. Where the source lists sibling cards as
 * separate steps at the same offset, that is one step with a stagger — same
 * elements, same order, same tween.
 *
 * Note the recurring shape: badge (or eyebrow) → split-text heading → body →
 * content, at 0.3s / power1.out with 0.5s on the headings. Only the offsets
 * vary, and Cybersec is the one page that uses 30px and 20px rather than the
 * 25px everything else moves.
 */

/* ── Hardware /products/ ────────────────────────────────────────────────── */

/** [15] pageLoad on section#mzdpgn. The product tiles ride the hero timeline. */
export const PRODUCTS_HERO_STEPS: RevealStep[] = [
  {
    target: "[data-anim=heading]",
    from: { y: "25px", opacity: 0 },
    duration: 0.5,
    splitWords: true,
  },
  { target: "[data-anim=body]", from: { y: "25px", opacity: 0 }, duration: 0.3 },
  {
    target: "[data-anim=intro-badge]",
    from: { scaleX: 0, opacity: 0 },
    duration: 0.3,
    position: "<",
  },
  {
    target: "[data-anim=intro-heading]",
    from: { y: "25px", opacity: 0 },
    duration: 0.5,
    splitWords: true,
  },
  {
    target: "[data-anim=intro-body]",
    from: { y: "25px", opacity: 0 },
    duration: 0.3,
    position: "<",
  },
  { target: "[data-anim=marquee]", from: { y: "25px", opacity: 0 }, duration: 0.3 },
  {
    target: "[data-anim=card]",
    from: { y: "25px", opacity: 0 },
    duration: 0.3,
    stagger: 0.2,
    position: "<",
  },
];

/** [16] pageLoad on section#mczfdc — the closing contact band. */
export const CONTACT_BAND_STEPS: RevealStep[] = [
  { target: "[data-anim=eyebrow]", from: { scaleX: 0, opacity: 0 }, duration: 0.3 },
  {
    target: "[data-anim=heading]",
    from: { y: "25px", opacity: 0 },
    duration: 0.5,
    splitWords: true,
  },
  { target: "[data-anim=body]", from: { y: "25px", opacity: 0 }, duration: 0.3 },
  { target: "[data-anim=form]", from: { x: "-10px", opacity: 0 }, duration: 0.3 },
];

/* ── Software /software/ ────────────────────────────────────────────────── */

/** [17] pageLoad on section#pggkuj — identical in shape to Hardware's [15]. */
export const SOFTWARE_HERO_STEPS: RevealStep[] = PRODUCTS_HERO_STEPS;

/** [18] scrollTrigger (unscrubbed) on section#tvzdkb. Its first step is a
 *  15px lift rather than Hardware's scaleX badge. */
export const SOFTWARE_CONTACT_STEPS: RevealStep[] = [
  { target: "[data-anim=eyebrow]", from: { opacity: 0, y: "15px" }, duration: 0.3 },
  {
    target: "[data-anim=heading]",
    from: { y: "25px", opacity: 0 },
    duration: 0.5,
    splitWords: true,
  },
  { target: "[data-anim=body]", from: { y: "25px", opacity: 0 }, duration: 0.3 },
  { target: "[data-anim=form]", from: { x: "-10px", opacity: 0 }, duration: 0.3, position: "<" },
];

/* ── Cybersec /cybersec/ ────────────────────────────────────────────────── */

/** [19] pageLoad on section#dyxvig. The only page moving 30px and 20px. */
export const CYBERSEC_HERO_STEPS: RevealStep[] = [
  {
    target: "[data-anim=heading]",
    from: { y: "30px", opacity: 0 },
    duration: 0.5,
    splitWords: true,
  },
  { target: "[data-anim=body]", from: { y: "20px", opacity: 0 }, duration: 0.3 },
  {
    target: "[data-anim=intro-badge]",
    from: { opacity: 0, y: "15px" },
    duration: 0.3,
    position: "<",
  },
  {
    target: "[data-anim=intro-heading]",
    from: { y: "30px", opacity: 0 },
    duration: 0.5,
    splitWords: true,
  },
  {
    target: "[data-anim=intro-body]",
    from: { y: "20px", opacity: 0 },
    duration: 0.3,
    position: "<",
  },
];

/** [20] pageLoad on section#apshsx — the four capability tiles. The one
 *  power1.**in** on the site; everything else eases out. */
export const CYBERSEC_CAPABILITY_STEPS: RevealStep[] = [
  {
    target: "[data-anim=card]",
    from: { y: "25px", opacity: 0 },
    duration: 0.3,
    ease: "power1.in",
    stagger: 0.2,
  },
];

/** [21] pageLoad on section#ztpzeq — heading, then the ten client banners. */
export const CYBERSEC_EXPERIENCE_STEPS: RevealStep[] = [
  {
    target: "[data-anim=heading]",
    from: { y: "25px", opacity: 0 },
    duration: 0.5,
    splitWords: true,
  },
  {
    target: "[data-anim=card]",
    from: { opacity: 0, y: "10px" },
    duration: 0.3,
    stagger: 0.2,
  },
];

/* ── Web Design /webapps/ ───────────────────────────────────────────────── */

/** [24] pageLoad on section#3e7d12 */
export const WEBAPPS_SERVICES_STEPS: RevealStep[] = [
  {
    target: "[data-anim=heading]",
    from: { y: "25px", opacity: 0 },
    duration: 0.5,
    splitWords: true,
  },
  { target: "[data-anim=body]", from: { y: "25px", opacity: 0 }, duration: 0.3 },
  { target: "[data-anim=card]", from: { y: "25px", opacity: 0 }, duration: 0.3, stagger: 0.2 },
];

/** [25] pageLoad on section#450756 — the six demo tiles, power1.**in**. */
export const WEBAPPS_SHOWCASE_STEPS: RevealStep[] = [
  {
    target: "[data-anim=heading]",
    from: { y: "25px", opacity: 0 },
    duration: 0.5,
    splitWords: true,
  },
  {
    target: "[data-anim=card]",
    from: { y: "25px", opacity: 0 },
    duration: 0.3,
    ease: "power1.in",
    stagger: 0.2,
  },
];

/* ── Contact /contact-us/ ───────────────────────────────────────────────── */

/** [41] pageLoad on container#ylcgam */
export const CONTACT_HERO_STEPS: RevealStep[] = [
  {
    target: "[data-anim=heading]",
    from: { y: "25px", opacity: 0 },
    duration: 0.5,
    splitWords: true,
  },
  { target: "[data-anim=body]", from: { y: "25px", opacity: 0 }, duration: 0.3 },
];

/** [42] pageLoad on container#dmggqd — the three contact cards, each its own
 *  step in the source at the same 0.3s/power1.out, so one staggered step. */
export const CONTACT_CARDS_STEPS: RevealStep[] = [
  { target: "[data-anim=card]", from: { y: "25px", opacity: 0 }, duration: 0.3, stagger: 0.1 },
];

/* ── Blog /blog/ ────────────────────────────────────────────────────────── */

/** [39] pageLoad on section#lefnrc */
export const BLOG_HERO_STEPS: RevealStep[] = [
  {
    target: "[data-anim=heading]",
    from: { y: "25px", opacity: 0 },
    duration: 0.5,
    splitWords: true,
  },
  { target: "[data-anim=body]", from: { y: "25px", opacity: 0 }, duration: 0.3 },
];

/** [40] pageLoad on `.blog-post` — one second, the slowest tween on the site,
 *  and the only card step with no stagger: all nine move together. */
export const BLOG_POSTS_STEPS: RevealStep[] = [
  { target: "[data-anim=card]", from: { y: "25px", opacity: 0 }, duration: 1 },
];

/* ── Careers /careers/ ──────────────────────────────────────────────────── */

/** [36] pageLoad on section#zgwldk. */
export const CAREERS_HERO_STEPS: RevealStep[] = [
  { target: "[data-anim=badge]", from: { opacity: 0, y: "15px" }, duration: 0.3 },
  {
    target: "[data-anim=heading]",
    from: { y: "25px", opacity: 0 },
    duration: 0.5,
    splitWords: true,
  },
  { target: "[data-anim=body]", from: { y: "25px", opacity: 0 }, duration: 0.3 },
];

/**
 * [37] pageLoad on heading#xpnhbd.
 *
 * The four benefit tiles are four separate steps in the source, at absolute
 * timeline positions 0.7 / 0.9 / 1.1 / 1.3 — evenly spaced, so one step
 * starting at 0.7 with a 0.2 stagger is the same timeline.
 */
export const CAREERS_INTRO_STEPS: RevealStep[] = [
  {
    target: "[data-anim=intro-heading]",
    from: { y: "25px", opacity: 0 },
    duration: 0.5,
    splitWords: true,
  },
  { target: "[data-anim=intro-body]", from: { y: "25px", opacity: 0 }, duration: 0.3 },
  {
    target: "[data-anim=benefit]",
    from: { y: "25px", opacity: 0 },
    duration: 0.3,
    position: 0.7,
    stagger: 0.2,
  },
];

/**
 * [38] pageLoad on section#soskor. All three careers timelines are pageLoad;
 * this one also carries `scrollStart: "+=20% bottom"`, which Bricksforge
 * ignores for a pageLoad trigger — the section animates on load even though
 * it sits below the fold, so by the time it is scrolled to it has finished.
 * Reproduced rather than "fixed" into a scroll trigger.
 *
 * Six cards at 0.4 through 1.4, evenly spaced by 0.2.
 */
export const CAREERS_POSITIONS_STEPS: RevealStep[] = [
  {
    target: "[data-anim=heading]",
    from: { y: "25px", opacity: 0 },
    duration: 0.5,
    splitWords: true,
  },
  {
    target: "[data-anim=job-card]",
    from: { y: "25px", opacity: 0 },
    duration: 0.3,
    position: 0.4,
    stagger: 0.2,
  },
];
