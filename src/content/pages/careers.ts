/**
 * CAREERS PAGE CONTENT — route /careers/
 *
 * Transcribed from the Bricks export (careers.json, page ID 807).
 * Three sections: hero, "We Appreciate Talent" + four benefit tiles, and
 * "Open Positions" + six job cards, each with an Apply Now button.
 */

import type { IconName } from "@/components/primitives";

export const CAREERS_HERO = {
  /**
   * "Jobs" is the gradient CHIP (text-basic#xaekoe — 12/500 white on a
   * primary→secondary gradient, 50px radius, #9b62ff border) and
   * "We're Hiring" is the label beside it (#gtwaza — 14/500 var(--base)).
   * The other way round measured 110px out of position.
   */
  eyebrow: { chip: "Jobs", label: "We're Hiring", labelSize: "14px" },
  heading: "Careers",
  /* Curly quotes as in the source (#brxe-nhhbmz). */
  body: "“Whatever a man sows, that he will also reap.”",
} as const;

export const CAREERS_INTRO = {
  heading: "We Appreciate Talent",
  body: "A young, energetic, and inspiring work environment. We are looking for reliable people who are not afraid to take risks and move forward. We would be happy to receive your resume and will get back to you as soon as possible!",
} as const;

export interface CareerBenefit {
  icon: IconName;
  title: string;
  body: string;
}

/** The four tiles in block#tmjbum — a two-column ACSS `col-count--2`. */
export const CAREERS_BENEFITS: readonly CareerBenefit[] = [
  {
    icon: "ion-ios-trending-up",
    title: "Personal Development",
    body: "We offer programs to help you advance your career.",
  },
  {
    icon: "ion-md-briefcase",
    title: "Career Opportunities",
    body: "Join our team and work towards our shared goals.",
  },
  {
    icon: "ion-md-repeat",
    title: "Work-Life Balance",
    body: "Enjoy company outings, vacations, and other perks.",
  },
  {
    icon: "ion-ios-people",
    title: "Positive Culture",
    body: "Benefit from a friendly and encouraging work environment.",
  },
];

export interface JobPosition {
  title: string;
  summary: string;
}

/**
 * Six positions in container#jqdkho, an ACSS `grid--auto-2`.
 *
 * ➖ EVERY Apply Now BUTTON OPENS THE SAME FORM. All six carry the identical
 * Bricks interaction — `startAnimation` → popup template 4521 — and the form
 * in that template has no position field, so a submitted application does not
 * say which job it is for. Reproduced as-is; the fix is noted in the phase
 * report, since sending the title through is a functional change.
 */
export const CAREERS_POSITIONS: readonly JobPosition[] = [
  {
    title: "Backend Developer",
    summary: "Junior Developer - Proficient in JS, Python, NodeJS, PHP, and Java.",
  },
  {
    title: "Sales Representative",
    summary: "Sales experience required. Technical computer knowledge is a plus.",
  },
  {
    title: "Client Account Manager",
    summary: "Detail-oriented, reliable, and a quick learner.",
  },
  {
    title: "Cybersecurity Specialist",
    summary: "Minimum of 2 years' experience in the field.",
  },
  {
    title: "Marketing Specialist",
    summary: "Proven experience managing PPC campaigns and SEO is a plus.",
  },
  {
    title: "Warehouse Worker",
    summary: "Ability to navigate a warehouse, attention to detail, and organizational skills.",
  },
];

export const CAREERS_SECTION_HEADING = "Open Positions";
