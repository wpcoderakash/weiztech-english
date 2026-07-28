import type { RevealStep } from "@/components/motion";

/**
 * HOME ANIMATIONS — transcribed from bricksforge_timelines.json [0]–[4].
 *
 * Selectors are `data-anim` attributes rather than the source's `#brxe-*`
 * IDs, which do not survive the migration. Every duration, ease, offset and
 * sequence position below is the source's, unchanged.
 *
 * 🔴 The export contains the Home timelines TWICE — [0..4] and [5..9], same
 * names, same trigger selectors. Two of the five pairs are byte-identical and
 * the other three differ only in step order, so Bricksforge animates every
 * Home element with two timelines at once on the live site. Only one copy is
 * reproduced here: running the duplicate would tween the same element twice
 * per scroll frame for no visible gain. CHANGE #28.
 *
 * Where the source lists each card as its own step at the same offset, that
 * is expressed as one step with a stagger — same elements, same order, same
 * 0.3s/power1.out, fewer lines.
 */

/* [0] Hero — pageLoad on #hero-container */
export const HOME_HERO_STEPS: RevealStep[] = [
  { target: "[data-anim=badge]", from: { scaleX: 0, opacity: 0 }, duration: 0.3 },
  {
    target: "[data-anim=heading]",
    from: { y: "25px", opacity: 0 },
    duration: 0.5,
    splitWords: true,
    stagger: 0.01,
  },
  { target: "[data-anim=body]", from: { y: "25px", opacity: 0 }, duration: 0.3 },
  { target: "[data-anim=cta-primary]", from: { y: "25px", opacity: 0 }, duration: 0.3 },
  {
    /* The only `back` ease on the site — the secondary CTA scales in. */
    target: "[data-anim=cta-secondary]",
    from: { y: "25px", scale: 0, opacity: 0 },
    duration: 0.3,
    ease: "back",
  },
  {
    target: "[data-anim=marquee]",
    from: { y: "25px", opacity: 0, filter: "blur(4px)" },
    duration: 0.3,
    position: "<",
  },
];

/* [1] Services — scrollTrigger, scrubbed, on section#kwgztb */
export const HOME_SERVICES_STEPS: RevealStep[] = [
  { target: "[data-anim=eyebrow]", from: { opacity: 0, y: "15px" }, duration: 0.3 },
  {
    target: "[data-anim=heading]",
    from: { y: "25px", opacity: 0 },
    duration: 0.5,
    splitWords: true,
    position: "<",
  },
  { target: "[data-anim=body]", from: { y: "25px", opacity: 0 }, duration: 0.3 },
  { target: "[data-anim=card]", from: { y: "25px", opacity: 0 }, duration: 0.3, stagger: 0.1 },
];

/* [2] Why Choose Us — scrollTrigger, scrubbed, on section#mwtwmq */
export const HOME_WHY_STEPS: RevealStep[] = [
  { target: "[data-anim=eyebrow]", from: { opacity: 0, y: "15px" }, duration: 0.3 },
  {
    target: "[data-anim=heading]",
    from: { y: "25px", opacity: 0 },
    duration: 0.5,
    splitWords: true,
  },
  {
    /* The one power1.inOut on the page, and a 10px offset rather than 25. */
    target: "[data-anim=body]",
    from: { y: "10px", opacity: 0 },
    duration: 0.3,
    ease: "power1.inOut",
  },
  { target: "[data-anim=star]", from: { y: "25px", opacity: 0 }, duration: 0.3, stagger: 0.01 },
  { target: "[data-anim=card]", from: { y: "25px", opacity: 0 }, duration: 0.3, stagger: 0.1 },
];

/* [3] FAQs — scrollTrigger, scrubbed, on section#zcijad. The five questions
   come in from the left rather than from below. */
export const HOME_FAQ_STEPS: RevealStep[] = [
  { target: "[data-anim=eyebrow]", from: { opacity: 0, y: "15px" }, duration: 0.3 },
  {
    target: "[data-anim=heading]",
    from: { y: "25px", opacity: 0 },
    duration: 0.5,
    splitWords: true,
  },
  { target: "[data-anim=body]", from: { y: "25px", opacity: 0 }, duration: 0.3 },
  {
    target: "[data-anim=faq-item]",
    from: { x: "-10px", opacity: 0 },
    duration: 0.3,
    stagger: 0.1,
    position: "<",
  },
];

/* [4] Contact CTA — scrollTrigger, scrubbed, on section#lmbrvu */
export const HOME_CONTACT_STEPS: RevealStep[] = [
  { target: "[data-anim=eyebrow]", from: { opacity: 0, y: "15px" }, duration: 0.3 },
  {
    target: "[data-anim=heading]",
    from: { opacity: 0, y: "25px" },
    duration: 0.5,
    splitWords: true,
  },
  { target: "[data-anim=body]", from: { y: "25px", opacity: 0 }, duration: 0.3 },
  { target: "[data-anim=form]", from: { x: "-10px", opacity: 0 }, duration: 0.3, position: "<" },
];
