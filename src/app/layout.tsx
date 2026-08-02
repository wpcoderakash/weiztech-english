import localFont from "next/font/local";
import Script from "next/script";

import type { Metadata } from "next";

import { BgGlow, GlowTracker, Starfield } from "@/components/decorative";
import { CareersFormModal } from "@/components/forms";
import { Footer, Header } from "@/components/layout";
import { MobileMenuDrawer, ScrollReset, SkipLink } from "@/components/navigation";
import { OverlayProvider } from "@/components/overlays";
import { HEADER_NAV, MOBILE_MENU } from "@/content/site";
import { getMenu } from "@/lib/cms/getContent";
import { DESCRIPTIONS, GOOGLE_SITE_VERIFICATION, SITE_URL, pageMetadata } from "@/lib/seo";

import "@/styles/reset.css";
import "@/styles/tokens.css";
import "@/styles/global.css";
import "@/styles/utilities.css";

/**
 * Rubik — self-hosted, the three weights the original ships.
 * Weight 500 is preloaded alongside 400/600 because it is used 89 times,
 * more than 400 and 600 combined. The source only preloaded 400 and 600.
 */
const rubik = localFont({
  src: [
    { path: "../fonts/Rubik-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/Rubik-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/Rubik-600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-rubik",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
});

/**
 * Site-wide metadata — Phase 13, from the Rank Math rules in PHASE-5 §5.
 *
 * The Home title is Rank Math's override `%sitename% - %sitedesc%`, which
 * resolves to the exact live string. Pages replace title and description via
 * `pageMetadata()`; what lives here is only what genuinely applies site-wide:
 * the base URL (canonicals and og:url resolve against it), the robots rule,
 * the Google verification token, and the Home defaults.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...pageMetadata({
    title: "Weiz Technologies - Power Your Business with Cutting-Edge IT",
    description: DESCRIPTIONS.home,
    path: "/",
    ogType: "website",
    absoluteTitle: true,
  }),
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-video-preview": -1,
    "max-image-preview": "large",
  },
  verification: { google: GOOGLE_SITE_VERIFICATION },
};

/**
 * Organization + WebSite JSON-LD, site-wide (PHASE-5 §6.3).
 *
 * The live Organization schema is Hebrew with two typos (`Isreal`, `Weis`) and
 * a logo file that no longer exists — decision PHASE-5 §11-C chose English
 * with the typos fixed. `openingHours` is deliberately OMITTED: the source
 * gives three conflicting versions (decision D, still open) and emitting a
 * wrong one is worse than none.
 */
const ORGANIZATION_JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Weiz Technologies",
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}/images/Weiz-Logo.svg`,
      email: "office@weiztech.com",
      telephone: "09-8989899",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Paz Complex, Moshav Ein Vered",
        addressCountry: "IL",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: "Weiz Technologies",
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en-US",
    },
  ],
};

/**
 * Root layout.
 *
 * Composition follows PHASE-6-NEXTJS-ARCHITECTURE.md §5. Still to be added:
 * MotionProvider and SmoothScroll (Phase 11), CareersFormModal and
 * EmailMarketingModal (Phase 10, once the form stack exists).
 *
 * BgGlow is a sibling of <main>, not a child: it is position:fixed and must
 * persist across route changes without remounting, otherwise it flashes on
 * navigation.
 */
export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [headerNav, mobileMenu] = await Promise.all([
    getMenu("header", HEADER_NAV),
    getMenu("mobile", MOBILE_MENU),
  ]);

  return (
    <html lang="en" className={rubik.variable}>
      <body>
        {/* The reference site's own particle engine, loaded exactly as it
            loads it: beforeInteractive, so the field paints as the HTML
            parses, ahead of React hydration. */}
        <Script src="/particles.js?v=1.3.3" strategy="beforeInteractive" />
        <script
          type="application/ld+json"

          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSONLD) }}
        />
        <OverlayProvider>
          <SkipLink />
          <Header nav={headerNav} />
          <BgGlow />
          <Starfield />
          <GlowTracker />
          <ScrollReset />
          <main id="main">{children}</main>
          <Footer />
          <MobileMenuDrawer menu={mobileMenu} />
          <CareersFormModal />
        </OverlayProvider>
      </body>
    </html>
  );
}
