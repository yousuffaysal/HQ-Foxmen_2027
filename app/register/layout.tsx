import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import "../admin/admin.css";

export const metadata: Metadata = {
  title: "Register — Client Portal",
  description: "Create your Foxmen Studio client account to access your project portal.",
  robots: { index: false, follow: false },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
