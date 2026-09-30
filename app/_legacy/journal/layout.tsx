import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";
import { BreadcrumbStructuredData } from "@/components/StructuredData";

export const metadata: Metadata = constructMetadata({
  title: "Journal",
  description:
    "The Foxmen Studio journal — design craft, engineering deep-dives, AI in production, case studies, and studio notes from our team.",
  url: "/journal",
  keywords: [
    "web design blog", "engineering blog", "AI development articles",
    "design system articles", "studio case studies", "Foxmen Studio journal",
    "UI UX articles", "Next.js articles", "software development blog",
  ],
});

export default function JournalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbStructuredData items={[{ name: "Journal", url: "/journal" }]} />
      {children}
    </>
  );
}
