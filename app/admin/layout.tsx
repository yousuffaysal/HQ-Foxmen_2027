import "./admin.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let session = null;
  try { session = await auth(); } catch {}
  return (
    <SessionProvider session={session}>
      <div className="adm-root">{children}</div>
    </SessionProvider>
  );
}
