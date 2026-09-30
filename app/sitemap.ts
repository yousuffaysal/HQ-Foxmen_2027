import type { MetadataRoute } from "next";
import { listProjects } from "@/lib/site/projects";
import { AI_TOOLS } from "@/lib/site/data";

const BASE = "https://www.foxmen.studio";
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const pages: [string, MetadataRoute.Sitemap[number]["changeFrequency"], number][] = [
    ["", "weekly", 1.0], ["/about", "monthly", 0.9], ["/services", "monthly", 0.9],
    ["/work", "weekly", 0.9], ["/tools", "monthly", 0.8], ["/contact", "monthly", 0.8],
  ];
  return [
    ...pages.map(([p, changeFrequency, priority]) => ({ url: BASE + p, lastModified: now, changeFrequency, priority })),
    ...AI_TOOLS.map(t => ({ url: `${BASE}/tools/${t.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...(await listProjects()).map(p => ({ url: `${BASE}/work/${p.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
