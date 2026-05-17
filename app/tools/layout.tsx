import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Tools",
  description:
    "Free tools from Foxmen Studio — check your website speed, get an AI roast, estimate project costs, find the right tech stack, and compare agency rates.",
};

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
