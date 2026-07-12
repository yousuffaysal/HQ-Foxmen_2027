import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options",    value: "nosniff" },
  { key: "X-Frame-Options",           value: "SAMEORIGIN" },
  { key: "X-XSS-Protection",          value: "1; mode=block" },
  { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy",        value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
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
    ];
  },
};

export default nextConfig;
