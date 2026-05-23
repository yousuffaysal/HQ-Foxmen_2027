import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import "../admin/admin.css";

export const metadata: Metadata = {
  title: "Login — Client Portal",
  description: "Sign in to the Foxmen Studio client portal to track your project and view updates.",
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
