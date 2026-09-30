import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ToolProductPage from "@/components/site/pages/ToolProductPage";
import { constructMetadata } from "@/lib/metadata";
import { AI_TOOLS, toolBySlug } from "@/lib/site/data";
import { getToolSettings } from "@/lib/site/tools-store";

export const revalidate = 300;
export const dynamicParams = false;
export const generateStaticParams = () => AI_TOOLS.map(t => ({ slug: t.slug! }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const t = toolBySlug((await params).slug);
  if (!t) return {};
  return constructMetadata({ title: `${t.name}, free AI tool`, description: `${t.tagline} ${t.about}`, url: `/tools/${t.slug}` });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const t = toolBySlug((await params).slug);
  if (!t) notFound();
  const all = await getToolSettings();
  const mine = all.find(s => s.id === t.id)!;
  if (!mine.enabled) notFound();
  return <ToolProductPage toolId={t.id} settings={mine} related={all} />;
}
