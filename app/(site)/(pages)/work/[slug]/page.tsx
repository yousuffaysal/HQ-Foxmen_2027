import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CasePage from "@/components/site/pages/CasePage";
import { constructMetadata } from "@/lib/metadata";
import { PROJECTS, PROJECT_SLUGS } from "@/lib/site/data";

export const dynamicParams = false;
export const generateStaticParams = () => PROJECT_SLUGS.map(slug => ({ slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = PROJECTS[PROJECT_SLUGS.indexOf(slug)];
  if (!p) return {};
  return constructMetadata({ title: `${p.name} case study`, description: p.desc.startsWith("[") ? p.type : p.desc, url: `/work/${slug}` });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const i = PROJECT_SLUGS.indexOf(slug);
  if (i < 0) notFound();
  return <CasePage index={i} />;
}
