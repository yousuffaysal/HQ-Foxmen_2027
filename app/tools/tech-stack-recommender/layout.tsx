import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tech Stack Recommender",
  description:
    "Tell us what you're building and get an AI-recommended tech stack — frontend, backend, database, infrastructure, and AI layer — free from Foxmen Studio.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
