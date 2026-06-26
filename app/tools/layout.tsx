import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Tools",
  description:
    "Free tools from Foxmen Studio — check your website speed, get an AI roast, estimate project costs, find the right tech stack, and compare agency rates. No sign-up needed.",
  keywords: [
    "free web tools", "website speed checker", "project price calculator",
    "agency rate comparator", "tech stack recommender", "roast my website",
    "AI website feedback", "Foxmen Studio free tools",
  ],
  openGraph: {
    title: "Free Tools — Foxmen Studio",
    description:
      "Speed checker, AI roast, price calculator, tech stack recommender, and agency rate comparator — all free, no sign-up.",
    url: "https://www.foxmen.studio/tools",
    images: [{ url: "/assets/og-image.png", width: 1200, height: 630, alt: "Foxmen Studio Free Tools" }],
  },
  twitter: {
    title: "Free Tools — Foxmen Studio",
    description: "Speed checker, AI roast, price calculator, and more — all free from Foxmen Studio.",
    images: ["/assets/og-image.png"],
  },
  alternates: { canonical: "https://www.foxmen.studio/tools" },
};

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
