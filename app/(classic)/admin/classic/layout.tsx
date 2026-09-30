import type { Metadata } from "next";
import "./admin.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/lib/auth";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Admin Dashboard",
  description: "Foxmen Studio admin management dashboard.",
  url: "/admin",
  noIndex: true,
});

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let session = null;
  try { session = await auth(); } catch {}
  return (
    <SessionProvider session={session}>
      <div className="adm-root">{children}</div>
    </SessionProvider>
  );
}
