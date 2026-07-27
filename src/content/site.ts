/**
 * SITE-WIDE CONTENT
 *
 * Navigation, footer, offices, socials and contact points — transcribed from
 * the Bricks header/footer/mobile-menu templates and the three WordPress menus.
 *
 * Deliberate fixes are marked `CHANGE #n` and correspond to the running change
 * log in PHASE-5-DATA-STRATEGY.md §10.
 */

export interface NavItem {
  label: string;
  href: string;
  /** Only when it differs from the visible label. */
  ariaLabel?: string;
}

export const SITE = {
  name: "Weiz Technologies",
  description: "Power Your Business with Cutting-Edge IT",
  url: "https://weiztech.com",
  locale: "en-US",
} as const;

/**
 * Header navigation.
 *
 * Not a WordPress menu — the header template hard-codes five swap-hover
 * elements. The registered "Header" menu still holds Hebrew leftovers and is
 * not rendered anywhere, so it is not migrated.
 *
 * Note the third item: the visible label is "Technologies" while its aria-label
 * is "Software" and it links to /software/. Faithful to the original.
 */
export const HEADER_NAV: readonly NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Hardware", href: "/products/" },
  { label: "Technologies", href: "/software/", ariaLabel: "Software" },
  { label: "Career", href: "/careers/" },
  { label: "Contact", href: "/contact-us/" },
];

/**
 * Vendor logo marquee.
 *
 * The same 11 SVGs in the same order on Home (`marquee#lnopbr`) and Hardware
 * (`marquee#bywkdb`). Software runs a different set — its own tech stack — so
 * that list stays on its page. Every marquee in the source shares the same
 * settings: speed 24, blurred edges at 20%, #121212 edge colour.
 */
export const VENDOR_LOGOS = [
  { src: "/images/Asus.svg", alt: "Asus", width: 114, height: 24, renderHeight: "20px" },
  { src: "/images/Acer.svg", alt: "Acer", width: 100, height: 24, renderHeight: "20px" },
  { src: "/images/Gigabyte.svg", alt: "Gigabyte", width: 120, height: 20 },
  { src: "/images/Dell.svg", alt: "Dell", width: 85, height: 26 },
  { src: "/images/Lenovo-1.svg", alt: "Lenovo", width: 117, height: 24 },
  { src: "/images/Microsoft.svg", alt: "Microsoft", width: 117, height: 25 },
  { src: "/images/Toshiba.svg", alt: "Toshiba", width: 158, height: 24 },
  { src: "/images/Panasonic.svg", alt: "Panasonic", width: 152, height: 24 },
  { src: "/images/Samsung.svg", alt: "Samsung", width: 156, height: 24 },
  /* Asus, Acer and MSI are the only three the source pins to 20px. The other
     eight run at natural height. Reproduced rather than regularised. */
  { src: "/images/MSI.svg", alt: "MSI", width: 99, height: 25, renderHeight: "20px" },
  { src: "/images/Fujitsu.svg", alt: "Fujitsu", width: 82, height: 40 },
] as const;

/** EN/HE toggle. The Hebrew site is a separate WordPress install. */
export const LANGUAGE_TOGGLE = {
  label: "HE",
  href: "https://weiz.co.il/",
  ariaLabel: "Hebrew Version",
  flag: { src: "/images/HE-Site.webp", width: 24, height: 16, alt: "" },
} as const;

/** Mobile menu — Bricks popup template 1851. */
export const MOBILE_MENU = {
  cta: { label: "Get in Touch", href: "/quote/" },
  quickContact: [
    { icon: "ion-ios-mail", href: "mailto:office@weiztech.com", ariaLabel: "Email us" },
    {
      icon: "ion-logo-whatsapp",
      href: "https://api.whatsapp.com/send?phone=972544747742",
      ariaLabel: "WhatsApp",
    },
  ],
  columns: [
    [
      { label: "Home", href: "/" },
      { label: "Careers", href: "/careers/" },
    ],
    [
      { label: "Blog", href: "/blog/" },
      /* aria-label in the source reads "About Us" on a link labelled
         "Contact Us". Corrected to match the visible label. CHANGE #20 */
      { label: "Contact Us", href: "/contact-us/" },
    ],
  ] as readonly (readonly NavItem[])[],
  services: {
    label: "Services",
    items: [
      { label: "Hardware", href: "/products/" },
      { label: "Software", href: "/software/" },
    ] as readonly NavItem[],
  },
  footerCta: { label: "Send us a Message", href: "/contact-us/" },
} as const;

/** Footer "Quick Links" — the WordPress "Footer Menu", in menu_order. */
export const FOOTER_QUICK_LINKS: readonly NavItem[] = [
  { label: "Get a Quote", href: "/quote/" },
  { label: "Blog", href: "/blog/" },
  { label: "Contact", href: "/contact-us/" },
  { label: "Careers", href: "/careers/" },
  { label: "Privacy Policy", href: "/privacy-policy/" },
  { label: "Accessibility Statement", href: "https://weiz.co.il/accessibility-statement/" },
];

/**
 * Footer "Our Services" — the WordPress "Services" menu.
 *
 * CHANGE #1: "Cybersecurity" pointed at /software/ in the original; corrected
 * to /cybersec/, which is the page it describes.
 *
 * OPEN ITEM #2: "Cloud Solutions" also points at /software/. There is no cloud
 * page on the site, so no correct target exists yet. Left as-is pending a
 * decision — do not treat this as verified.
 */
export const FOOTER_SERVICES: readonly NavItem[] = [
  { label: "Website Development", href: "/webapps/" },
  { label: "App Development", href: "/webapps/" },
  { label: "Cybersecurity", href: "/cybersec/" },
  { label: "Cloud Solutions", href: "/software/" },
  { label: "Software", href: "/software/" },
];

/**
 * Offices.
 *
 * CHANGE #8: in the original the "Kiev" heading linked to the *Israeli* office
 * on Google Maps. Labels and addresses were correctly paired; only that one
 * hyperlink was wrong. It now points at the Kyiv map.
 */
const MAP_KYIV = "https://maps.app.goo.gl/WCGvYbKPQu3FDrWy8";
const MAP_EIN_VERED =
  "https://www.google.com/maps/place/%D7%95%D7%95%D7%99%D7%99%D7%96+%D7%90%D7%99%D7%99+%D7%98%D7%99+%7C+Weiz+Technologies%E2%80%AD/@32.2604488,34.925937,17z";

export const OFFICES = [
  {
    label: "Kiev",
    address: "Gulliver Business Center, 17 Esplanadna Kyiv, Ukraine",
    href: MAP_KYIV,
  },
  {
    label: "Israel",
    address: "Paz Complex - Moshav Ein Vered",
    href: MAP_EIN_VERED,
  },
] as const;

export const SOCIALS = [
  { icon: "fa-x-twitter", href: "https://x.com/WeizTech", label: "Twitter" },
  {
    icon: "fa-linkedin-in",
    href: "https://www.linkedin.com/company/weiztechnologies/",
    label: "Linkedin",
  },
  {
    icon: "fa-whatsapp",
    href: "https://api.whatsapp.com/send?phone=972544747742",
    label: "Whatsapp",
  },
] as const;

export const FOOTER_INTRO = {
  text: "Weiz Technologies is your partner for secure and reliable IT solutions that drive business growth. Contact us today to discover how we can propel your success.",
  cta: { label: "Get in Touch", href: "/contact-us/" },
} as const;

export const COPYRIGHT = {
  text: "All Rights Reserved Weiztech LLC.",
  poweredBy: { label: "Weiz", href: "https://weiz.co.il/" },
} as const;

export const CONTACT = {
  officeEmail: "office@weiztech.com",
  salesEmail: "sales@weiz.co.il",
  whatsapp: "+972544747742",
  phoneUa: "+380662169131",
} as const;
