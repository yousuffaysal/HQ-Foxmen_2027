import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project Price Calculator",
  description:
    "Estimate your web, app, or AI project budget instantly. Compare Foxmen Studio rates against UK/US agency prices — free tool, no sign-up.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
