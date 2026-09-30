import type { Metadata } from "next";
import AboutPage from "@/components/site/pages/AboutPage";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({ title: "About", description: "Foxmen Studio is a web and AI agency. We design and build websites, online stores, AI assistants and custom software for businesses all over the world.", url: "/about" });

export default function Page() {
  return <AboutPage />;
}
