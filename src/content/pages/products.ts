/**
 * HARDWARE PAGE CONTENT — route /products/
 *
 * Every string transcribed verbatim from the Bricks export (Hardware.json,
 * page ID 812). Source quirks are preserved unless noted.
 *
 * The route/title mismatch is deliberate: /products/ renders a page titled
 * "Hardware". Both are indexed and carry backlinks. See PHASE-4 §2.1.
 */

/* The h1 is `{post_title}` in the source, resolving to the WordPress post
   title. Hard-coded here — the page is static and has no post to read from. */
export const PRODUCTS_HERO = {
  heading: "Hardware",
  body: "Your Trusted Source for Business Computing.",
} as const;

export const PRODUCTS_INTRO = {
  eyebrow: "Hardware & Computing",
  heading: "Premium Components, Delivered",
  body: "Weiz Technologies is your trusted partner for high-quality hardware solutions. We import and distribute a wide range of premium components, ensuring your business operations run smoothly. From servers and workstations to peripherals and networking equipment, we have the solutions you need. Enjoy fast delivery, expert support, and competitive pricing.",
} as const;

/**
 * The nine category tiles.
 *
 * Every tile links to the quote form. The source writes these as absolute
 * external URLs (`https://weiztech.com/quote/`), which would send same-site
 * navigation through a full page load and, on one card, a new tab. Rewritten
 * to the internal `/quote/` so all nine behave identically and route through
 * next/link. CHANGE #14.
 *
 * Phase 4 recorded 8 tiles for this page; the export has 9.
 */
export const PRODUCTS_CATEGORIES = [
  {
    title: "Laptops",
    body: "Sleek, powerful laptops for work or play.",
    image: "/images/Laptops-Category.webp",
    href: "/quote/",
  },
  {
    title: "Accessories",
    body: "Everything you need for your computer.",
    image: "/images/PC-Accessories.webp",
    href: "/quote/",
  },
  {
    /* Source reads " Laptop Parts" with a leading space. HTML collapses it, so
       the rendered output is identical either way. */
    title: "Laptop Parts",
    body: "Keep your laptop running smoothly.",
    image: "/images/Laptop-Fan.webp",
    href: "/quote/",
  },
  {
    title: "Laptop Adapters",
    body: "Power up your laptop anytime, anywhere.",
    image: "/images/Laptop-Adapters.jpg",
    href: "/quote/",
  },
  {
    title: "Laptop Batteries",
    body: "Extend your laptop's battery life.",
    image: "/images/Laptop-Batteries.webp",
    href: "/quote/",
  },
  {
    title: "Cables",
    body: "Connect your devices with ease.",
    image: "/images/Cables-Mix.webp",
    href: "/quote/",
  },
  {
    title: "Working Station",
    body: "Powerful desktop computers in a small size.",
    image: "/images/Working-Stations.webp",
    href: "/quote/",
  },
  {
    title: "Docking Stations",
    body: "Simplify your setup.",
    image: "/images/Docking-Stations.webp",
    href: "/quote/",
  },
  {
    title: "Screens",
    body: "See more, do more.",
    image: "/images/Screens.webp",
    href: "/quote/",
  },
] as const;

/* NOTE: "Connect With Us Today" — capital W here, lowercase on Home
   ("Connect with Us Today"). Both preserved as written. */
export const PRODUCTS_CONTACT_CTA = {
  eyebrow: "Get in Touch",
  heading: "Connect With Us Today",
  body: "Have a question or need assistance? Contact us today. Our team is ready to help you.",
} as const;
