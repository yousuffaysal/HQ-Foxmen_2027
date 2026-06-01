import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a project with Foxmen Studio. Tell us what you're building — we'll reply within 24 hours. Web, mobile, AI, ecommerce, brand, and more.",
  keywords: [
    "contact Foxmen Studio", "hire web design agency", "start a project",
    "web development quote", "agency inquiry", "get a proposal",
  ],
  openGraph: {
    title: "Contact — Foxmen Studio",
    description:
      "Tell us what you're building. We'll reply within 24 hours — no sales calls, no fluff.",
    url: "https://foxmen.studio/contact",
    images: [{ url: "/assets/og-image.png", width: 1200, height: 630, alt: "Contact Foxmen Studio" }],
  },
  twitter: {
    title: "Contact — Foxmen Studio",
    description: "Start your project with Foxmen Studio. We reply within 24 hours.",
    images: ["/assets/og-image.png"],
  },
  alternates: { canonical: "https://foxmen.studio/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
