import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { constructMetadata } from "@/lib/metadata";
import "../admin/admin.css";

export const metadata: Metadata = constructMetadata({
  title: "Client Portal Registration",
  description: "Create your Foxmen Studio client account to access your project portal.",
  url: "/register",
  noIndex: true,
});

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
