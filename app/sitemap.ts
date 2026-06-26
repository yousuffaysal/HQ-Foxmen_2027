import type { MetadataRoute } from "next";
import { sql } from "@/lib/db";

const BASE = "https://www.foxmen.studio";

/* Hardcoded static journal slugs — always included */
const STATIC_JOURNAL_SLUGS = [
  "why-ai-features-fail-in-production",
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,                          lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/about`,               lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/services`,            lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/work`,                lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/contact`,             lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/journal`,             lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/tools`,               lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/tools/website-speed-checker`,  lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/tools/roast-my-website`,       lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/tools/price-calculator`,       lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/tools/tech-stack-recommender`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/tools/agency-rate-comparator`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  /* Fetch live posts from DB; fall back silently if DB is unavailable */
  let dbPosts: { slug: string; published_at: string | null }[] = [];
  try {
    dbPosts = await sql`
      SELECT slug, published_at FROM posts
      WHERE status = 'live' AND slug != ''
      ORDER BY published_at DESC NULLS LAST
    ` as { slug: string; published_at: string | null }[];
  } catch { /* DB not configured — skip */ }

  const dbSlugSet = new Set(dbPosts.map((p) => p.slug));

  const journalRoutes: MetadataRoute.Sitemap = [
    /* Static posts not already covered by DB */
    ...STATIC_JOURNAL_SLUGS.filter((s) => !dbSlugSet.has(s)).map((slug) => ({
      url: `${BASE}/journal/${slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    /* Live DB posts */
    ...dbPosts.map((p) => ({
      url: `${BASE}/journal/${p.slug}`,
      lastModified: p.published_at ? new Date(p.published_at) : now,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];

  return [...staticRoutes, ...journalRoutes];
}
