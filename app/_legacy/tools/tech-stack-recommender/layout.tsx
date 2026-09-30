import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Tech Stack Recommender",
  description:
    "Tell us what you're building and get an AI-recommended tech stack — frontend, backend, database, infrastructure, and AI layer — free from Foxmen Studio.",
  url: "/tools/tech-stack-recommender",
  keywords: ["tech stack recommender", "best tech stack 2025", "frontend backend recommendation", "AI tech stack", "startup technology choice", "web app tech stack"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
