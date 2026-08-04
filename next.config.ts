import type { NextConfig } from "next";

/**
 * Content-Security-Policy.
 *
 * Origins are exactly the ones the site uses: Turnstile (script + its own
 * iframe), Supabase (storage images/videos + auth/REST from the browser).
 * `unsafe-inline` stays because Next injects inline scripts/styles and the
 * JSON-LD blocks are inline; `unsafe-eval` is dev-only (React Refresh).
 */
const SUPABASE_HOST = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").host;
  } catch {
    return "dewmgdusgpoqhvwdfcgj.supabase.co";
  }
})();

const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV !== "production" ? " 'unsafe-eval'" : ""} https://challenges.cloudflare.com`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: https://${SUPABASE_HOST}`,
  "font-src 'self' data:",
  `connect-src 'self' https://${SUPABASE_HOST} wss://${SUPABASE_HOST} https://challenges.cloudflare.com`,
  `media-src 'self' blob: https://${SUPABASE_HOST}`,
  "frame-src https://challenges.cloudflare.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CSP },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  /* Only meaningful over HTTPS; harmless elsewhere. 180 days + subdomains. */
  { key: "Strict-Transport-Security", value: "max-age=15552000; includeSubDomains" },
];

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

  experimental: {
    /**
     * The careers form accepts a CV up to 8 MB (MAX_CV_BYTES in
     * careers-schema.ts). Server Actions default to a 1 MB body, which
     * rejected anything larger at the framework level — before the schema
     * could return its own field error. This must stay >= MAX_CV_BYTES.
     */
    serverActions: { bodySizeLimit: "10mb" },
  },

  images: {
    formats: ["image/avif", "image/webp"],
    /** CMS media uploads live in Supabase Storage (public bucket). */
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dewmgdusgpoqhvwdfcgj.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
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
   * The permanent redirects from PHASE-4 §4–5, implemented in Phase 13.
   *
   * The six Hebrew sources are the posts' `_wp_old_slug` values, decoded
   * from the SQL dump programmatically — WordPress resolved these
   * automatically; Next.js has no equivalent, so they would break silently.
   * Next matches `source` against the ENCODED pathname (verified: the
   * decoded literal 404s), so the six sources are percent-encoded.
   */
  async headers() {
    return [{ source: "/(.*)", headers: SECURITY_HEADERS }];
  },

  async redirects() {
    /* 10 retired Cyber Clients brand pages, each with a doubled variant. */
    const cyberBrands = [
      "university-of-cambridge",
      "mcafee",
      "university-of-san-diego",
      "panasonic",
      "audi",
      "huawei",
      "lenovo",
      "lg",
      "eset",
      "university-of-leiden",
    ];

    return [
      /* Hebrew → English post slugs (highest priority — live inbound links). */
      {
        source:
          "/%D7%9E%D7%9E%D7%99%D7%A8-%D7%9E%D7%AA%D7%97-%D7%9C%D7%A8%D7%9B%D7%91-%D7%94%D7%A4%D7%AA%D7%A8%D7%95%D7%9F-%D7%94%D7%9E%D7%95%D7%A9%D7%9C%D7%9D-%D7%9C%D7%98%D7%A2%D7%99%D7%A0%D7%AA-%D7%9E%D7%95%D7%A6/",
        destination: "/car-voltage-converters/",
        permanent: true,
      },
      {
        source:
          "/%D7%90%D7%99%D7%9A-%D7%91%D7%95%D7%97%D7%A8%D7%99%D7%9D-%D7%98%D7%9B%D7%A0%D7%90%D7%99-%D7%9E%D7%97%D7%A9%D7%91%D7%99%D7%9D-%D7%90%D7%99%D7%9B%D7%95%D7%AA%D7%99-%D7%9C%D7%AA%D7%99%D7%A7%D7%95%D7%9F/",
        destination: "/how-to-find-a-reliable-computer-technician/",
        permanent: true,
      },
      {
        source:
          "/%D7%94%D7%9E%D7%93%D7%A8%D7%99%D7%9A-%D7%9C%D7%9E%D7%A6%D7%99%D7%90%D7%AA-%D7%94%D7%9E%D7%97%D7%A9%D7%91%D7%99%D7%9D-%D7%94%D7%A0%D7%99%D7%99%D7%93%D7%99%D7%9D-%D7%94%D7%98%D7%95%D7%91%D7%99%D7%9D/",
        destination: "/finding-the-best-laptops-for-2024/",
        permanent: true,
      },
      {
        source:
          "/%D7%90%D7%99%D7%A0%D7%98%D7%9C%D7%99%D7%92%D7%A0%D7%A6%D7%99%D7%94-%D7%9E%D7%9C%D7%90%D7%9B%D7%95%D7%AA%D7%99%D7%AA-ai-%D7%91%D7%A9%D7%A0%D7%AA-2024-%D7%A2%D7%99%D7%93%D7%9F-%D7%97%D7%93%D7%A9/",
        destination: "/artificial-intelligence-in-2024/",
        permanent: true,
      },
      {
        source:
          "/%D7%90%D7%91%D7%98%D7%97%D7%AA-%D7%9E%D7%99%D7%93%D7%A2-%D7%90%D7%99%D7%9A-%D7%9C%D7%99%D7%99%D7%A9%D7%9D-%D7%91%D7%A2%D7%A1%D7%A7/",
        destination: "/why-information-security-matters/",
        permanent: true,
      },
      {
        source:
          "/%D7%90%D7%99%D7%9A-%D7%9C%D7%94%D7%A4%D7%95%D7%9A-%D7%90%D7%AA-%D7%94%D7%A2%D7%A1%D7%A7-%D7%9C%D7%97%D7%9B%D7%9D-%D7%99%D7%95%D7%AA%D7%A8-%D7%A2%D7%9D-%D7%98%D7%9B%D7%A0%D7%95%D7%9C%D7%95%D7%92%D7%99/",
        destination: "/make-your-business-smarter-with-technology/",
        permanent: true,
      },

      /* Cyber Clients retirement — PHASE-4 §4.2. */
      ...cyberBrands.map((brand) => ({
        source: `/cybersec/${brand}/`,
        destination: "/cybersec/",
        permanent: true,
      })),
      ...cyberBrands.map((brand) => ({
        source: `/cybersec/cybersec/${brand}/`,
        destination: "/cybersec/",
        permanent: true,
      })),
      { source: "/cyber-sec/:slug*", destination: "/cybersec/", permanent: true },

      /* Housekeeping — PHASE-4 §4.3 (approved in §7). */
      { source: "/template/:slug*", destination: "/", permanent: true },
      { source: "/login-customizer/", destination: "/", permanent: true },
      { source: "/category/:slug*", destination: "/blog/", permanent: true },

      /* Legacy Rank Math sitemap paths → the single sitemap (PHASE-4 §5). */
      { source: "/sitemap_index.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/page-sitemap.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/post-sitemap.xml", destination: "/sitemap.xml", permanent: true },
    ];
  },
};

export default nextConfig;
