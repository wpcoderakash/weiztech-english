import localFont from "next/font/local";

import type { Metadata } from "next";

import { BgGlow } from "@/components/decorative";
import { CareersFormModal } from "@/components/forms";
import { Footer, Header } from "@/components/layout";
import { MobileMenuDrawer, SkipLink } from "@/components/navigation";
import { OverlayProvider } from "@/components/overlays";

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
 * Placeholder metadata only. The real per-route metadata, Open Graph, Twitter
 * cards and JSON-LD are built in Phase 13 from the Rank Math rules captured in
 * PHASE-5-DATA-STRATEGY.md §5.
 */
export const metadata: Metadata = {
  title: "Weiz Technologies",
  description: "Power Your Business with Cutting-Edge IT",
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
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={rubik.variable}>
      <body>
        <OverlayProvider>
          <SkipLink />
          <Header />
          <BgGlow />
          <main id="main">{children}</main>
          <Footer />
          <MobileMenuDrawer />
          <CareersFormModal />
        </OverlayProvider>
      </body>
    </html>
  );
}
