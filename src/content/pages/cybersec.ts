/**
 * CYBERSEC PAGE CONTENT — route /cybersec/
 *
 * Transcribed from the Bricks export (cybersec.json, page ID 10790) and
 * checked against uploads/bricks/css/post-10790.min.css and the live page.
 */

export const CYBERSEC_HERO = {
  heading: "Protect Your Business from Online Threats",
  /* Two U+200B ZERO WIDTH SPACE characters sit between "Cyber " and "and" — a
     leftover from the Hebrew original. Stripped: they render as nothing but
     break search, copy-paste and screen-reader output. CHANGE #22. */
  body: "Cyber and Information Security Department.",
} as const;

export const CYBERSEC_INTRO = {
  eyebrow: "Advanced Cyber Solutions",
  heading: "Protecting You from Cyber Attacks",
  /* NOTE: "At Wise Technologies" — the company is Weiz Technologies. Carried
     verbatim; it is a copy error in the source, not a transcription slip.
     Flagged as open item, not silently corrected. */
  body: "In today's world, it's very important to keep your information safe. Computers, phones, and other devices can be attacked by bad guys online. At Wise Technologies, we want to protect your digital stuff and keep you safe. Our cyber team, led by Mr. Uri Levy, will make sure your business is safe and secure.",
} as const;

/**
 * Vendor marquee — eleven logos, a different set from the Hardware/Home one.
 * Two carry an explicit 20px height in the source (Nvidia, Nokia); the rest
 * run at natural size, capped at the slide's 110px content box. See
 * LogoMarquee for why intrinsic dimensions matter.
 */
export const CYBERSEC_LOGOS = [
  { src: "/images/Apple-Logo.svg", alt: "Apple", width: 98, height: 34 },
  { src: "/images/Nvidia-Logo.svg", alt: "Nvidia", width: 148, height: 28, renderHeight: "20px" },
  { src: "/images/Mcafee-Logo.svg", alt: "McAfee", width: 124, height: 28 },
  { src: "/images/Lenovo-1.svg", alt: "Lenovo", width: 117, height: 24 },
  { src: "/images/Audi-Logo.svg", alt: "Audi", width: 81, height: 28 },
  { src: "/images/Ferrari-Logo.svg", alt: "Ferrari", width: 111, height: 24 },
  { src: "/images/Samsung.svg", alt: "Samsung", width: 156, height: 24 },
  { src: "/images/Panasonic.svg", alt: "Panasonic", width: 152, height: 24 },
  { src: "/images/Huawei-Logo.svg", alt: "Huawei", width: 128, height: 28 },
  { src: "/images/Nokia-Logo.svg", alt: "Nokia", width: 143, height: 24, renderHeight: "20px" },
  { src: "/images/Philips-Logo.svg", alt: "Philips", width: 131, height: 24 },
] as const;

/**
 * The four capability tiles — `.ce-card`, structurally the same tile as
 * `.software-page-card` on Hardware and Software (same 16px radius, 224px
 * minimum, same scrim and hover), reusing `.product-card-heading` and
 * `.product-card-text`. They carry no link.
 */
export const CYBERSEC_CAPABILITIES = [
  {
    title: "Website Security Test",
    body: "Code review and OSINT",
    image: "/images/Web-Security.webp",
  },
  {
    title: "App Security Test",
    body: "iOS and Android apps",
    image: "/images/Mobilesec.webp",
  },
  {
    title: "Network Security Test",
    body: "A complete test of your network",
    image: "/images/InfSec.webp",
  },
  {
    title: "Cloud Data Security",
    body: "Stopping bad things from happening to your data",
    image: "/images/Overview-Cyber-Security.webp",
  },
] as const;

/**
 * "Our Experience" — ten client banners.
 *
 * 🔴 RETRACTION. PHASE-5 §10 item 11 and PHASE-9 (Home) §1 both list "20
 * placeholder strings, all Cybersec cards" as copy the client still owes.
 * They are placeholders — `שם מותג` ("brand name") and `פתרונות אבטחת מידע
 * מנוהלים` ("managed information security solutions") — but `.oe-card-heading`
 * and `.oe-card-text` are BOTH `display: none`, verified on the live page:
 *
 *     .oe-card-heading  display: none    (10 elements)
 *     .oe-card-text     display: none    (10 elements)
 *
 * They have never been visible. Each card renders a banner and a "View"
 * button, nothing else. The strings are kept below as `hiddenLabel` /
 * `hiddenBlurb` so the intent is not lost, but they are not rendered — the
 * same call as the FAQ icons in PHASE-9 (Home) §1.
 *
 * **Nothing is owed for this page.** The site-wide placeholder count drops
 * from 20 to 0.
 *
 * The brand names below come from each card's own `View` link and banner
 * filename — not inferred from the artwork. They give the ten otherwise
 * identical "View" buttons a distinguishable accessible name and the banners
 * real alt text. CHANGE #23.
 *
 * 🔴 The last three links are missing their leading slash in the source
 * (`cybersec/lg/` rather than `/cybersec/lg/`). As relative URLs on
 * /cybersec/ they resolve to /cybersec/cybersec/lg/ and 404 on the live site
 * today. Corrected here. CHANGE #24.
 */
const HIDDEN_LABEL = "שם מותג";
const HIDDEN_BLURB = "פתרונות אבטחת מידע מנוהלים";

export const CYBERSEC_EXPERIENCE = [
  {
    brand: "University of Cambridge",
    image: "/images/UOC-Banner.svg",
    href: "/cybersec/university-of-cambridge/",
  },
  { brand: "McAfee", image: "/images/Mcafee-Banner.svg", href: "/cybersec/mcafee/" },
  {
    brand: "University of San Diego",
    image: "/images/USD-Banner.svg",
    href: "/cybersec/university-of-san-diego/",
  },
  { brand: "Panasonic", image: "/images/Panasonic-Banner.svg", href: "/cybersec/panasonic/" },
  { brand: "Audi", image: "/images/Audi-Banner.svg", href: "/cybersec/audi/" },
  { brand: "Huawei", image: "/images/Huawei-Banner.svg", href: "/cybersec/huawei/" },
  { brand: "Lenovo", image: "/images/Lenovo-Banner.svg", href: "/cybersec/lenovo/" },
  /* Leading slash added — CHANGE #24 */
  { brand: "LG", image: "/images/LG-Banner.svg", href: "/cybersec/lg/" },
  { brand: "Eset", image: "/images/Eset-Banner.svg", href: "/cybersec/eset/" },
  {
    brand: "University of Leiden",
    image: "/images/UOL-Banner.svg",
    href: "/cybersec/university-of-leiden/",
  },
] as const;

/** Kept for the record; never rendered. See the note above. */
export const CYBERSEC_HIDDEN_PLACEHOLDERS = {
  label: HIDDEN_LABEL,
  blurb: HIDDEN_BLURB,
  count: CYBERSEC_EXPERIENCE.length * 2,
} as const;

export const CYBERSEC_EXPERIENCE_HEADING = "Our Experience";
export const CYBERSEC_VIEW_LABEL = "View";

/* "Connect With Us Today" — capital W, as on Hardware and Web Design. */
export const CYBERSEC_CONTACT_CTA = {
  eyebrow: "Get in Touch",
  heading: "Connect With Us Today",
  body: "Have a question or need assistance? Contact us today. Our team is ready to help you.",
} as const;
