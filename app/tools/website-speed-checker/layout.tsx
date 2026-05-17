import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Website Speed Checker",
  description:
    "Check your website's Core Web Vitals — LCP, FCP, CLS and TBT — for free using Google PageSpeed. Get actionable insights from Foxmen Studio.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
