import type { Metadata } from "next";

/**
 * SEO constants and the per-route metadata builder — Phase 13.
 *
 * The rules are Rank Math's, resolved in PHASE-5 §5.1:
 *   - title template `%title% - Weiz Technologies`, separator `-`
 *   - Home overrides to `%sitename% - %sitedesc%`
 *   - robots `index, follow, max-snippet:-1, max-video-preview:-1,
 *     max-image-preview:large`
 *   - twitter `summary_large_image`, @WeizTech
 *   - og:type `website` on Home, `article` everywhere else (Rank Math's
 *     default for singular content — questionable for marketing pages, but
 *     it is what the live site emits, so it is reproduced)
 *
 * DESCRIPTIONS ARE NEW COPY (CHANGE #30, decision PHASE-5 §11-B). The live
 * site has one real English description (Home); four are Hebrew on English
 * pages and fifteen are Rank Math auto-generations that cannot be reproduced
 * byte-for-byte. Divergence was unavoidable, so the pages carry written
 * English descriptions instead. Post descriptions keep the live behaviour
 * exactly: the excerpt.
 */

export const SITE_URL = "https://weiztech.com";
export const SITE_NAME = "Weiz Technologies";
export const TITLE_SUFFIX = " - Weiz Technologies";
export const TWITTER_HANDLE = "@WeizTech";
export const GOOGLE_SITE_VERIFICATION = "0x9A4HYvoWFiLZZf_OktorOQDR-D1Ckpqlk-vMiJXcA";

export const ROBOTS = {
  index: true,
  follow: true,
  "max-snippet": -1,
  "max-video-preview": -1,
  "max-image-preview": "large",
} as const;

interface PageMeta {
  /** Bare title — the ` - Weiz Technologies` suffix is applied here. */
  title: string;
  description: string;
  /** Route path with trailing slash, e.g. `/products/`. */
  path: string;
  /** Rank Math emits `article` for every singular page except Home. */
  ogType?: "website" | "article";
  /** Home's title is already fully resolved — skip the suffix. */
  absoluteTitle?: boolean;
}

/** Builds the full metadata object for a route, matching the live head. */
export function pageMetadata({
  title,
  description,
  path,
  ogType = "article",
  absoluteTitle = false,
}: PageMeta): Metadata {
  const url = `${SITE_URL}${path}`;
  const fullTitle = absoluteTitle ? title : `${title}${TITLE_SUFFIX}`;
  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_US",
      type: ogType,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
    },
  };
}

/**
 * The written descriptions for the ten static routes (CHANGE #30). ~155
 * characters, one per route, drawn from each page's own copy so they say
 * nothing the page does not.
 */
/**
 * Serialise an object for a JSON-LD <script> block.
 *
 * `JSON.stringify` alone does not escape `<`, so a DB-authored value
 * containing `</script>` would terminate the block and inject markup.
 * Escaping every `<` with its JSON unicode escape is the standard fix.
 */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export const DESCRIPTIONS = {
  home: "Weiz Technologies is your partner for secure and reliable IT solutions that drive business growth. Contact us today to discover how we can propel your success.",
  products:
    "Business computing hardware from Weiz Technologies: laptops, accessories, spare parts, adapters, batteries, docking stations, screens and working stations.",
  software:
    "Custom software from Weiz Technologies: websites that convert, mobile apps for iOS and Android, e-commerce, and tailored IT solutions for your business.",
  webapps:
    "Professional web development in Israel: UI/UX design, custom websites, branding and maintenance for small businesses — from consultation to launch.",
  cybersec:
    "Cybersecurity testing by Weiz Technologies: website, app, network and cloud data security assessments, trusted by universities and global brands.",
  careers:
    "Join Weiz Technologies: open positions in development, sales, cybersecurity, marketing and operations in a young, energetic work environment.",
  contact:
    "Contact the Weiz Technologies sales, service or support team. We are available Sundays to Thursdays, 8:00 AM to 5:00 PM, in Israel and Ukraine.",
  quote:
    "Request a quote from Weiz Technologies for hardware or software. Tell us what you need and we will get back to you with pricing as soon as possible.",
  privacy:
    "The terms of use and privacy policy for the Weiz Technologies website: how we collect, use, retain and protect your personal information.",
  blog: "Insights from the Weiz Technologies team on IT, hardware, web development, information security and getting more from technology in your business.",
} as const;
