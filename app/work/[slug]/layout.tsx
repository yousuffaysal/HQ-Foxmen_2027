import type { Metadata } from "next";

export const metadata: Metadata = {
  description:
    "A Foxmen Studio case study — deep-dive into the brief, design decisions, tech stack, and results.",
  openGraph: {
    siteName: "Foxmen Studio",
    images: [{ url: "/assets/og-image.png", width: 1200, height: 630, alt: "Foxmen Studio Case Study" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/assets/og-image.png"],
  },
};

export default function WorkSlugLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
