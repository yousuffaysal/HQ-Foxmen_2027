import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Foxmen Studio services: web design & development, mobile apps, AI-integrated software, ecommerce, real estate platforms, brand & UI/UX design, marketing, and retainer partnerships.",
  keywords: [
    "web design services", "web development services", "mobile app development",
    "AI software development", "ecommerce agency", "real estate platform development",
    "UI UX design services", "brand design agency", "digital marketing agency",
    "retainer agency", "Foxmen Studio services",
  ],
  openGraph: {
    title: "Services — Foxmen Studio",
    description:
      "Web, mobile, AI, ecommerce, real estate, brand, and marketing services — from a focused international creative agency.",
    url: "https://www.foxmen.studio/services",
    images: [{ url: "/assets/og-image.png", width: 1200, height: 630, alt: "Foxmen Studio Services" }],
  },
  twitter: {
    title: "Services — Foxmen Studio",
    description:
      "Web, mobile, AI, ecommerce, real estate, brand, and marketing — Foxmen Studio services.",
    images: ["/assets/og-image.png"],
  },
  alternates: { canonical: "https://www.foxmen.studio/services" },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
