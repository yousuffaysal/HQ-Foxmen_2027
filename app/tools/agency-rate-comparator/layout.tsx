import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agency Rate Comparator",
  description:
    "Compare agency hourly rates across London, NYC, UAE, and Foxmen Studio. See real savings on your project budget — free tool, no sign-up needed.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
