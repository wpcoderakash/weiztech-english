/**
 * SOFTWARE PAGE CONTENT — route /software/
 *
 * Every string transcribed verbatim from the Bricks export (Software.json,
 * page ID 810), checked against uploads/bricks/css/post-810.min.css. Source
 * quirks are preserved unless noted.
 *
 * The header links to this route under the label "Technologies" with an
 * aria-label of "Software" — see site.ts HEADER_NAV.
 */

/* The h1 is `{post_title}` in the source, resolving to the WordPress post
   title. Hard-coded here — the page is static and has no post to read from.

   The h1 declares `width: var(--width-l)` and the body `width: var(--width--l)`
   — the second with a doubled dash. That variable does not exist, so the
   declaration is invalid at computed-value time and the paragraph falls back to
   auto. The hero column is already --width-l wide, so neither has any effect;
   not reproduced. */
export const SOFTWARE_HERO = {
  heading: "Software",
  body: "Comprehensive IT solutions tailored to your needs.",
} as const;

export const SOFTWARE_INTRO = {
  eyebrow: "IT Experts",
  heading: "Comprehensive IT Solutions",
  body: "Experience the future of IT with Weiz Technologies. Our expert team provides tailored solutions to meet your unique business challenges. From cloud computing to cybersecurity, we deliver the technology you need to succeed. We're committed to helping you achieve your goals and stay ahead of the curve in today's rapidly evolving digital landscape.",
} as const;

/**
 * The nine tech-stack logos in `marquee#cewbwb`.
 *
 * A different set from Home and Hardware's eleven vendor logos (VENDOR_LOGOS in
 * site.ts), and the only marquee on the site that pins a logo height — all nine
 * are `height: 42px; object-fit: contain`, against the others' unset height.
 *
 * None of the nine carries alt text in the export. Named here after the
 * technology each mark stands for. CHANGE #21.
 */
export const SOFTWARE_TECH_LOGOS = [
  { src: "/images/icon-wordpress.svg", alt: "WordPress", width: 150, height: 150 },
  { src: "/images/icon-Woocom.svg", alt: "WooCommerce", width: 800, height: 162 },
  { src: "/images/icon-python.svg", alt: "Python", width: 151, height: 150 },
  { src: "/images/icon-php.svg", alt: "PHP", width: 800, height: 421 },
  { src: "/images/icon-kalilinux.svg", alt: "Kali Linux", width: 800, height: 595 },
  { src: "/images/icon-javascript.svg", alt: "JavaScript", width: 150, height: 150 },
  { src: "/images/icon-java.svg", alt: "Java", width: 394, height: 532 },
  { src: "/images/icon-database-sql.svg", alt: "SQL", width: 358, height: 400 },
  { src: "/images/icon-Cordova.svg", alt: "Apache Cordova", width: 964, height: 336 },
] as const;

/**
 * The six service tiles.
 *
 * Five link to the quote form, written in the source as absolute external URLs
 * with a LEADING SPACE (`" https://weiztech.com/quote/"`). Rewritten to the
 * internal `/quote/` so they route through next/link rather than a full page
 * load, as on Hardware. CHANGE #14.
 *
 * The first is already an internal link in the source — Bricks `postId: 817`,
 * which is the Web Design & Development page at /webapps/.
 *
 * OPEN: "Robust Cybersecurity" points at /quote/, not at the /cybersec/ page it
 * describes. Left as the source has it — the same class of mis-target as the
 * footer's "Cybersecurity" link (CHANGE #1), but here the quote form is a
 * plausible deliberate destination, so it is not silently redirected.
 */
export const SOFTWARE_SERVICES = [
  {
    title: "Custom Websites That Convert",
    body: "Designed to impress and convert.",
    image: "/images/Custom-Web-Design.webp",
    href: "/webapps/",
  },
  {
    title: "Mobile App Development",
    body: "Expertly crafted for iOS and Android.",
    image: "/images/Mobile-and-App-Development.webp",
    href: "/quote/",
  },
  {
    title: "Tailored IT Solutions",
    body: "Perfectly fit for your unique needs.",
    image: "/images/IT-Solutions.webp",
    href: "/quote/",
    /* The only tile on either product page not centred: `top center`. */
    backgroundPosition: "top center",
  },
  {
    title: "Seamless API Integration",
    body: "Connect your systems effortlessly.",
    image: "/images/API-Setup.webp",
    href: "/quote/",
  },
  {
    title: "Robust Cybersecurity",
    body: "Protect your data, peace of mind.",
    image: "/images/Cyber-Security.webp",
    href: "/quote/",
  },
  {
    title: "Cloud Solutions",
    body: "Grow with your business, securely.",
    image: "/images/Cloud-Solutions.jpg",
    href: "/quote/",
  },
] as const;

/* "Connect with Us Today" — lowercase w, as on Home. Hardware's is capitalised.
   All three preserved as written. */
export const SOFTWARE_CONTACT_CTA = {
  eyebrow: "Get in Touch",
  heading: "Connect with Us Today",
  body: "Have a question or need assistance? Contact us today. Our team is ready to help you.",
} as const;
