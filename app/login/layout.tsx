import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { constructMetadata } from "@/lib/metadata";
import "../admin/admin.css";

export const metadata: Metadata = constructMetadata({
  title: "Client Portal Login",
  description: "Sign in to the Foxmen Studio client portal to track your project and view updates.",
  url: "/login",
  noIndex: true,
});

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
