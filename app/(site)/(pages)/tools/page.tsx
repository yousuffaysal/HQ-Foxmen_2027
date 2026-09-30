import type { Metadata } from "next";
import ToolsPage from "@/components/site/pages/ToolsPage";
import { constructMetadata } from "@/lib/metadata";
import { getToolSettings } from "@/lib/site/tools-store";

export const revalidate = 300;

export const metadata: Metadata = constructMetadata({ title: "Free AI tools", description: "Free AI tools for your business: website copy, SEO meta, product descriptions, name ideas, chatbot FAQs, translation and more.", url: "/tools" });

export default async function Page() {
  return <ToolsPage settings={await getToolSettings()} />;
}
