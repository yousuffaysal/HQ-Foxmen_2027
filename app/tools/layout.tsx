import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";
import { BreadcrumbStructuredData } from "@/components/StructuredData";

export const metadata: Metadata = constructMetadata({
  title: "Free Tools",
  description:
    "Free tools from Foxmen Studio — check your website speed, get an AI roast, estimate project costs, find the right tech stack, and compare agency rates. No sign-up needed.",
  url: "/tools",
  keywords: [
    "free web tools", "website speed checker", "project price calculator",
    "agency rate comparator", "tech stack recommender", "roast my website",
    "AI website feedback", "Foxmen Studio free tools",
  ],
});

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbStructuredData items={[{ name: "Free Tools", url: "/tools" }]} />
      {children}
    </>
  );
}
