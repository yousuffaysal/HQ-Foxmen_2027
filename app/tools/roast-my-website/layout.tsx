import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roast My Website",
  description:
    "Get brutally honest AI feedback on your website's design, UX, conversion rate, and SEO. Straight-talking analysis from Foxmen Studio — free.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
