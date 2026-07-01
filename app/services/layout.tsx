import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Services",
  description:
    "Foxmen Studio services: web design & development, mobile apps, AI-integrated software, ecommerce, real estate platforms, brand & UI/UX design, marketing, and retainer partnerships.",
  url: "/services",
  keywords: [
    "web design services", "web development services", "mobile app development",
    "AI software development", "ecommerce agency", "real estate platform development",
    "UI UX design services", "brand design agency", "digital marketing agency",
    "retainer agency", "Foxmen Studio services",
  ],
});

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
