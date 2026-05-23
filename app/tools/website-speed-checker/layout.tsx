import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Website Speed Checker",
  description:
    "Check your website's Core Web Vitals — LCP, FCP, CLS and TBT — for free using Google PageSpeed. Get actionable insights from Foxmen Studio.",
  keywords: ["website speed checker", "Core Web Vitals checker", "LCP FCP CLS", "Google PageSpeed tool", "website performance test", "free speed test"],
  openGraph: {
    title: "Website Speed Checker — Foxmen Studio",
    description: "Check your Core Web Vitals — LCP, FCP, CLS, TBT — free using Google PageSpeed insights.",
    url: "https://foxmenstudio.com/tools/website-speed-checker",
    images: [{ url: "/assets/og-image.png", width: 1200, height: 630, alt: "Website Speed Checker" }],
  },
  twitter: {
    title: "Website Speed Checker — Foxmen Studio",
    description: "Check your Core Web Vitals for free — powered by Google PageSpeed.",
    images: ["/assets/og-image.png"],
  },
  alternates: { canonical: "https://foxmenstudio.com/tools/website-speed-checker" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
