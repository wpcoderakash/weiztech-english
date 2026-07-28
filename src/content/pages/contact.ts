/**
 * CONTACT US PAGE CONTENT — route /contact-us/
 *
 * Transcribed from the Bricks export (contact.json, page ID 640) and checked
 * against uploads/bricks/css/post-640.min.css.
 */

import type { IconName } from "@/components/primitives";

export const CONTACT_HERO = {
  heading: "We're Here for You!",
  body: "Contact our friendly and helpful sales, service, or support team. We're available to assist you from Sundays to Thursdays, between 8:00 AM and 5:00 PM.",
} as const;

export interface ContactPoint {
  icon: IconName;
  label: string;
  /** The visible value — an address, a number, a location. */
  value: string;
  href: string;
  /**
   * Whether the source links the ICON as well as the text. Bricks wraps a
   * linked icon in an anchor whose line box is 32px; an unlinked one is the
   * glyph's own 24px. Five of the six are linked and one — Ukraine — is not,
   * which makes its card 8px shorter. An accident of how the page was built,
   * but it is what the live page measures, so it is reproduced.
   */
  iconLinked?: boolean;
}

/**
 * Six contact points in three cards of two — `.contact-us-card`.
 *
 * 🔴 THREE LABEL/TARGET MISMATCHES IN THE SOURCE, all preserved rather than
 * guessed at. Every one is a business decision, not a transcription question:
 *
 *  1. Sales reads `sales@weiz.co.il` but links to `mailto:sales@weiztech.com`
 *  2. Office reads `office@weiz.co.il` but links to `mailto:office@weiztech.com`
 *  3. "Call Us" shows `+380662169131`, and its text links there — but its
 *     ICON links to `tel:09-8989899`, an Israeli landline. One card, two
 *     different numbers.
 *
 * The visible text is carried verbatim and the link target is taken from the
 * TEXT element, which is the visible label — so the icon's divergent number in
 * (3) is dropped and the card has one destination. The addresses in (1) and
 * (2) still send mail to a different domain than they display; that needs a
 * decision about which mailbox is live. See §7 of the phase report.
 *
 * The source also links icon, heading and text separately, giving three tab
 * stops per contact point. Each card item is one link here. CHANGE #25.
 *
 * `site.ts` already records both spellings: `salesEmail: sales@weiz.co.il`
 * and `officeEmail: office@weiztech.com`.
 */
const MAP_KYIV_STREETVIEW =
  "https://www.google.com/maps/place/%D0%91%D0%A6+%D0%93%D1%83%D0%BB%D0%BB%D0%B8%D0%B2%D0%B5%D1%80+%D0%91%D0%B0%D1%88%D0%BD%D1%8F+%D0%90/@50.4395216,30.523517,3a,75y,179.32h,74.88t/data=!3m6!1e1!3m4!1sPP-J6CSx5XRo2tPTRJE3XA!2e0!7i13312!8i6656!4m6!3m5!1s0x40d4cefe31720db3:0x6bf414a259eaea1a!8m2!3d50.4390665!4d30.5238288!16s%2Fg%2F11bccjwzhy";
const MAP_EIN_VERED =
  "https://www.google.com/maps/place/%D7%95%D7%95%D7%99%D7%99%D7%96+%D7%90%D7%99%D7%99+%D7%98%D7%99+%7C+Weiz+Technologies%E2%80%AD/@32.2604488,34.925937,17z";

export const CONTACT_CARDS: readonly (readonly ContactPoint[])[] = [
  [
    {
      icon: "ion-ios-mail",
      label: "Sales Department",
      value: "sales@weiz.co.il",
      href: "mailto:sales@weiztech.com",
    },
    {
      icon: "ion-ios-mail",
      label: "Our Office",
      value: "office@weiz.co.il",
      href: "mailto:office@weiztech.com",
    },
  ],
  [
    {
      icon: "ion-logo-whatsapp",
      label: "Whatsapp",
      value: "+972544747742",
      href: "https://api.whatsapp.com/send?phone=972544747742",
    },
    {
      icon: "ion-md-call",
      label: "Call Us",
      value: "+380662169131",
      href: "tel:+380662169131",
    },
  ],
  [
    {
      icon: "ion-ios-pin",
      label: "Ukraine",
      value: "Gulliver Business Center, 17 Esplanadna Kyiv, Ukraine",
      href: MAP_KYIV_STREETVIEW,
      /* The only one of the six whose icon the source leaves unlinked. */
      iconLinked: false,
    },
    {
      icon: "ion-ios-pin",
      label: "Israel",
      value: "Paz Complex - Moshav Ein Vered",
      href: MAP_EIN_VERED,
    },
  ],
];

/* "Connect with Us Today" — lowercase w, as on Home. */
export const CONTACT_CTA = {
  eyebrow: "Get in Touch",
  heading: "Connect with Us Today",
  body: "Have a question or need assistance? Contact us today. Our team is ready to help you.",
} as const;
