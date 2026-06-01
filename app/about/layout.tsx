import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet the Foxmen Studio team — a focused creative agency led by Yousuf H. Faysal (Founder & CEO) and Rayhan Ahmed (Co-founder, Head of Engineering). Building world-class digital products since 2025.",
  keywords: [
    "Foxmen Studio team", "Yousuf H. Faysal", "Rayhan Ahmed",
    "creative agency team", "web design agency founders", "digital product studio",
  ],
  openGraph: {
    title: "About — Foxmen Studio",
    description:
      "Meet the Foxmen Studio team — founders, engineers, and designers building world-class digital products.",
    url: "https://foxmen.studio/about",
    images: [{ url: "/assets/og-image.png", width: 1200, height: 630, alt: "Foxmen Studio Team" }],
  },
  twitter: {
    title: "About — Foxmen Studio",
    description: "Meet the founders and team behind Foxmen Studio.",
    images: ["/assets/og-image.png"],
  },
  alternates: { canonical: "https://foxmen.studio/about" },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
