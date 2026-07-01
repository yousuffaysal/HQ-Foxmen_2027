import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Project Price Calculator",
  description:
    "Estimate your web, app, or AI project budget instantly. Compare Foxmen Studio rates against UK/US agency prices — free tool, no sign-up.",
  url: "/tools/price-calculator",
  keywords: ["project price calculator", "web development cost estimator", "app development cost", "AI project budget", "agency pricing tool"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
