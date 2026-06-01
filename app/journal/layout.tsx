import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "The Foxmen Studio journal — design craft, engineering deep-dives, AI in production, case studies, and studio notes from our team.",
  keywords: [
    "web design blog", "engineering blog", "AI development articles",
    "design system articles", "studio case studies", "Foxmen Studio journal",
    "UI UX articles", "Next.js articles", "software development blog",
  ],
  openGraph: {
    title: "Journal — Foxmen Studio",
    description:
      "Design craft, engineering deep-dives, AI in production, and case studies from the Foxmen Studio team.",
    url: "https://foxmen.studio/journal",
    images: [{ url: "/assets/og-image.png", width: 1200, height: 630, alt: "Foxmen Studio Journal" }],
  },
  twitter: {
    title: "Journal — Foxmen Studio",
    description: "Design, engineering, AI, and studio notes from Foxmen Studio.",
    images: ["/assets/og-image.png"],
  },
  alternates: { canonical: "https://foxmen.studio/journal" },
};

export default function JournalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
