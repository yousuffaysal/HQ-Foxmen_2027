import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project Price Calculator",
  description:
    "Estimate your web, app, or AI project budget instantly. Compare Foxmen Studio rates against UK/US agency prices — free tool, no sign-up.",
  keywords: ["project price calculator", "web development cost estimator", "app development cost", "AI project budget", "agency pricing tool"],
  openGraph: {
    title: "Project Price Calculator — Foxmen Studio",
    description: "Estimate your web, app, or AI project budget instantly. Compare Foxmen Studio against UK/US agency prices.",
    url: "https://foxmen.studio/tools/price-calculator",
    images: [{ url: "/assets/og-image.png", width: 1200, height: 630, alt: "Project Price Calculator" }],
  },
  twitter: {
    title: "Project Price Calculator — Foxmen Studio",
    description: "Estimate your project budget instantly — free tool from Foxmen Studio.",
    images: ["/assets/og-image.png"],
  },
  alternates: { canonical: "https://foxmen.studio/tools/price-calculator" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
