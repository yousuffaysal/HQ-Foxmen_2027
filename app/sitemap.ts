import type { MetadataRoute } from "next";
import { sql } from "@/lib/db";
import { projectMap } from "@/app/work/data";

const BASE = "https://www.foxmen.studio";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,                          lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/about`,               lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/services`,            lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/work`,                lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/contact`,             lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/journal`,             lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/login`,               lastModified: now, changeFrequency: "yearly",  priority: 0.5 }, // Client Portal sign-in
    { url: `${BASE}/tools`,               lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/tools/website-speed-checker`,  lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/tools/roast-my-website`,       lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/tools/price-calculator`,       lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/tools/tech-stack-recommender`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/tools/agency-rate-comparator`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  /* Live blog posts from DB (only real, published, slugged posts) */
  let dbPosts: { slug: string; published_at: string | null }[] = [];
  try {
    dbPosts = await sql`
      SELECT slug, published_at FROM posts
      WHERE status = 'live' AND slug != ''
      ORDER BY published_at DESC NULLS LAST
    ` as { slug: string; published_at: string | null }[];
  } catch { /* DB not configured — skip */ }

  const journalRoutes: MetadataRoute.Sitemap = dbPosts.map((p) => ({
    url: `${BASE}/journal/${p.slug}`,
    lastModified: p.published_at ? new Date(p.published_at) : now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const workRoutes: MetadataRoute.Sitemap = Object.keys(projectMap).map((slug) => ({
    url: `${BASE}/work/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...workRoutes, ...journalRoutes];
}
