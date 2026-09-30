import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Website Speed Checker",
  description:
    "Check your website's Core Web Vitals — LCP, FCP, CLS and TBT — for free using Google PageSpeed. Get actionable insights from Foxmen Studio.",
  url: "/tools/website-speed-checker",
  keywords: ["website speed checker", "Core Web Vitals checker", "LCP FCP CLS", "Google PageSpeed tool", "website performance test", "free speed test"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
