import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "About",
  description:
    "Meet the Foxmen Studio team — a focused creative agency led by Yousuf H. Faysal (Founder & CEO) and Rayhan Ahmed (Co-founder, Head of Engineering). Building world-class digital products since 2025.",
  url: "/about",
  keywords: [
    "Foxmen Studio team", "Yousuf H. Faysal", "Rayhan Ahmed",
    "creative agency team", "web design agency founders", "digital product studio",
  ],
});

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
