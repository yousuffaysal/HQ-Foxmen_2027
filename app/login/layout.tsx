import { SessionProvider } from "next-auth/react";
import "../admin/admin.css";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
