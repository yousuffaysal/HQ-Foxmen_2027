import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CasePage from "@/components/site/pages/CasePage";
import { constructMetadata } from "@/lib/metadata";
import { getProject, listProjects } from "@/lib/site/projects";

export const revalidate = 300;
export const dynamicParams = true; // projects added in the admin get pages without a rebuild
export const generateStaticParams = async () => (await listProjects()).map(p => ({ slug: p.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = await getProject((await params).slug);
  if (!p) return {};
  return constructMetadata({ title: `${p.name} case study`, description: !p.desc || p.desc.startsWith("[") ? p.type : p.desc, url: `/work/${p.slug}`, image: p.heroImage || undefined });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!(await getProject(slug))) notFound();
  return <CasePage slug={slug} />;
}
