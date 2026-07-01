import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/lib/auth";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Client Portal",
  description: "Foxmen Studio client portal — track your project, view updates, and collaborate with the team.",
  url: "/portal",
  noIndex: true,
});

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  let session = null;
  try { session = await auth(); } catch {}
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
