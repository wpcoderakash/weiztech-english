import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * CRITICAL for URL preservation.
   * WordPress serves every URL with a trailing slash (permalink structure
   * /%postname%/). Without this, Next.js 308-redirects all 19 indexed URLs to
   * their slash-less form, changing every canonical.
   * See PHASE-4-ROUTING-PLAN.md §1.
   */
  trailingSlash: true,

  reactStrictMode: true,

  /** Do not advertise the framework. */
  poweredByHeader: false,

  images: {
    formats: ["image/avif", "image/webp"],
    /**
     * All imagery is local (public/images). No remote patterns required.
     * The 42 SVGs bypass the optimiser entirely — it cannot compress SVG,
     * so they are served directly with explicit dimensions.
     * See PHASE-6-NEXTJS-ARCHITECTURE.md §9.
     */
  },

  typescript: {
    /** Type errors must break the build. */
    ignoreBuildErrors: false,
  },

  /**
   * Note: Next 16 removed the `eslint` config key along with `next lint`,
   * so ESLint no longer runs as part of `next build`. It is enforced via the
   * `npm run check` script and in CI instead.
   */

  /**
   * The 30 permanent redirects (6 Hebrew post slugs, 21 Cyber Clients
   * retirement patterns, 3 housekeeping) are specified in
   * PHASE-4-ROUTING-PLAN.md §4 and implemented in Phase 13.
   */
};

export default nextConfig;
