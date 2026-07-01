import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Roast My Website",
  description:
    "Get brutally honest AI feedback on your website's design, UX, conversion rate, and SEO. Straight-talking analysis from Foxmen Studio — free.",
  url: "/tools/roast-my-website",
  keywords: ["roast my website", "website feedback AI", "UX audit tool", "website design review", "conversion rate feedback", "SEO audit free"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
