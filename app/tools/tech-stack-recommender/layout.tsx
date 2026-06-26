import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tech Stack Recommender",
  description:
    "Tell us what you're building and get an AI-recommended tech stack — frontend, backend, database, infrastructure, and AI layer — free from Foxmen Studio.",
  keywords: ["tech stack recommender", "best tech stack 2025", "frontend backend recommendation", "AI tech stack", "startup technology choice", "web app tech stack"],
  openGraph: {
    title: "Tech Stack Recommender — Foxmen Studio",
    description: "Get an AI-recommended tech stack for your project — frontend, backend, database, infra, and AI layer.",
    url: "https://www.foxmen.studio/tools/tech-stack-recommender",
    images: [{ url: "/assets/og-image.png", width: 1200, height: 630, alt: "Tech Stack Recommender" }],
  },
  twitter: {
    title: "Tech Stack Recommender — Foxmen Studio",
    description: "AI-recommended tech stack for your next project — free from Foxmen Studio.",
    images: ["/assets/og-image.png"],
  },
  alternates: { canonical: "https://www.foxmen.studio/tools/tech-stack-recommender" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
