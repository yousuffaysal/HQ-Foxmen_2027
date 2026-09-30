import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";
import { BreadcrumbStructuredData } from "@/components/StructuredData";

export const metadata: Metadata = constructMetadata({
  title: "Contact",
  description:
    "Start a project with Foxmen Studio. Tell us what you're building — we'll reply within 24 hours. Web, mobile, AI, ecommerce, brand, and more.",
  url: "/contact",
  keywords: [
    "contact Foxmen Studio", "hire web design agency", "start a project",
    "web development quote", "agency inquiry", "get a proposal",
  ],
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbStructuredData items={[{ name: "Contact Us", url: "/contact" }]} />
      {children}
    </>
  );
}
