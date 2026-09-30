import type { MetadataRoute } from "next";
import { PROJECT_SLUGS } from "@/lib/site/data";

const BASE = "https://www.foxmen.studio";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: [string, MetadataRoute.Sitemap[number]["changeFrequency"], number][] = [
    ["", "weekly", 1.0], ["/about", "monthly", 0.9], ["/services", "monthly", 0.9],
    ["/work", "weekly", 0.9], ["/tools", "monthly", 0.8], ["/contact", "monthly", 0.8],
  ];
  return [
    ...pages.map(([p, changeFrequency, priority]) => ({ url: BASE + p, lastModified: now, changeFrequency, priority })),
    ...PROJECT_SLUGS.map(s => ({ url: `${BASE}/work/${s}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
