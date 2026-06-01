import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agency Rate Comparator",
  description:
    "Compare agency hourly rates across London, NYC, UAE, and Foxmen Studio. See real savings on your project budget — free tool, no sign-up needed.",
  keywords: ["agency rate comparison", "web design hourly rates", "agency pricing", "London agency rates", "NYC agency rates", "UAE agency rates"],
  openGraph: {
    title: "Agency Rate Comparator — Foxmen Studio",
    description: "Compare agency hourly rates across London, NYC, UAE, and Foxmen Studio. See real savings on your project budget.",
    url: "https://foxmen.studio/tools/agency-rate-comparator",
    images: [{ url: "/assets/og-image.png", width: 1200, height: 630, alt: "Agency Rate Comparator" }],
  },
  twitter: {
    title: "Agency Rate Comparator — Foxmen Studio",
    description: "Compare agency rates across London, NYC, UAE, and Foxmen Studio — free tool.",
    images: ["/assets/og-image.png"],
  },
  alternates: { canonical: "https://foxmen.studio/tools/agency-rate-comparator" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
