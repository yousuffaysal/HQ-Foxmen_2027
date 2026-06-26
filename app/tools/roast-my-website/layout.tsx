import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roast My Website",
  description:
    "Get brutally honest AI feedback on your website's design, UX, conversion rate, and SEO. Straight-talking analysis from Foxmen Studio — free.",
  keywords: ["roast my website", "website feedback AI", "UX audit tool", "website design review", "conversion rate feedback", "SEO audit free"],
  openGraph: {
    title: "Roast My Website — Foxmen Studio",
    description: "Brutally honest AI feedback on your website's design, UX, conversions, and SEO — free.",
    url: "https://www.foxmen.studio/tools/roast-my-website",
    images: [{ url: "/assets/og-image.png", width: 1200, height: 630, alt: "Roast My Website" }],
  },
  twitter: {
    title: "Roast My Website — Foxmen Studio",
    description: "Brutally honest AI feedback on your website — free from Foxmen Studio.",
    images: ["/assets/og-image.png"],
  },
  alternates: { canonical: "https://www.foxmen.studio/tools/roast-my-website" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
