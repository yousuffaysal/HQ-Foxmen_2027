import { SessionProvider } from "next-auth/react";
import { auth } from "@/lib/auth";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  let session = null;
  try { session = await auth(); } catch {}
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
