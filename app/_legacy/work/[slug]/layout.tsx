import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";
import { projectMap } from "../data";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const project = projectMap[slug];

  if (!project) {
    return constructMetadata({
      title: "Case Study",
      description: "A Foxmen Studio case study — deep-dive into the brief, design decisions, tech stack, and results.",
      url: `/work/${slug}`,
    });
  }

  const title = `${project.name} — Case Study`;
  const description = project.overview?.lede || project.sub || `How Foxmen Studio designed and engineered ${project.name} — ${project.industry} case study.`;

  return constructMetadata({
    title,
    description,
    url: `/work/${slug}`,
    keywords: [
      project.name,
      project.industry,
      project.client,
      "case study",
      "Foxmen Studio work",
      "digital product design",
    ],
  });
}

export default function WorkSlugLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
