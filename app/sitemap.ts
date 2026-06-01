import type { MetadataRoute } from "next";

const BASE = "https://foxmen.studio";

const JOURNAL_SLUGS = [
  "designing-in-the-browser-not-in-figma",
  "the-eval-loop-that-saved-our-copilot",
  "sticky-scroll-the-right-way",
  "tokens-are-a-product-not-a-deliverable",
  "how-we-shipped-nestaro-in-14-weeks",
  "a-short-defense-of-the-italic-headline",
  "retrieval-but-make-it-boring",
  "the-case-for-monorepos-in-design-agencies",
  "atlas-shipping-an-ios-travel-app-in-9-weeks",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,                          lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/about`,               lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/services`,            lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/work`,                lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/contact`,             lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/journal`,             lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/tools`,               lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/tools/website-speed-checker`,    lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/tools/roast-my-website`,         lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/tools/price-calculator`,         lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/tools/tech-stack-recommender`,   lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/tools/agency-rate-comparator`,   lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  const journalRoutes: MetadataRoute.Sitemap = JOURNAL_SLUGS.map((slug) => ({
    url: `${BASE}/journal/${slug}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...journalRoutes];
}
