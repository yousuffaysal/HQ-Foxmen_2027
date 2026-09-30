import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options",    value: "nosniff" },
  { key: "X-Frame-Options",           value: "SAMEORIGIN" },
  { key: "X-XSS-Protection",          value: "0" }, // legacy auditor is itself exploitable; CSP below replaces it
  { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy",        value: "camera=(), microphone=(self), geolocation=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
  // Restrictive directives that don't need per-request nonces: no clickjacking, no <base>
  // hijacking, no plugins, and forms may only post back to this site.
  { key: "Content-Security-Policy",   value: "frame-ancestors 'self'; base-uri 'self'; object-src 'none'; form-action 'self'" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Multiple root layouts ((site) and (classic)) need a global 404 page.
  experimental: { globalNotFound: true },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  // Force the canonical domain: anyone landing on the Vercel deployment URL
  // is redirected to www.foxmen.studio (path + query preserved). This keeps
  // portal/dashboard and every other link on our own domain.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "hq-foxmen-2027.vercel.app" }],
        destination: "https://www.foxmen.studio/:path*",
        permanent: false,
      },
      // Pages from the previous site that the redesign retired (code kept in app/_legacy).
      { source: "/journal", destination: "/", permanent: false },
      { source: "/journal/:path*", destination: "/", permanent: false },
      { source: "/tools/:slug(website-speed-checker|roast-my-website|price-calculator|tech-stack-recommender|agency-rate-comparator)", destination: "/tools", permanent: false },
      { source: "/services/:path+", destination: "/services", permanent: false },
      // Case-study slugs from the previous site's database.
      { source: "/work/redleaf-ai-powered-ecommerce", destination: "/work/redleaf", permanent: true },
      { source: "/work/skill-bridge", destination: "/work/skillbridge", permanent: true },
      { source: "/work/celeste-ai-marketplace", destination: "/work/celeste", permanent: true },
      { source: "/work/:slug(orbit|hearth|lumen|northwind)", destination: "/work", permanent: false },
    ];
  },
};

export default nextConfig;
