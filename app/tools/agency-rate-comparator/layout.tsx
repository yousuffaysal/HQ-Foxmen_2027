import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Agency Rate Comparator",
  description:
    "Compare agency hourly rates across London, NYC, UAE, and Foxmen Studio. See real savings on your project budget — free tool, no sign-up needed.",
  url: "/tools/agency-rate-comparator",
  keywords: ["agency rate comparison", "web design hourly rates", "agency pricing", "London agency rates", "NYC agency rates", "UAE agency rates"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
