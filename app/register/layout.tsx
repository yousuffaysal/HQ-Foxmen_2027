import { SessionProvider } from "next-auth/react";
import "../admin/admin.css";

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
