"use client";
import { usePathname } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import FoxChat from "@/components/FoxChat";
import SiteLiveChat from "@/components/SiteLiveChat";

const NO_SHELL_PATHS  = ["/login", "/register"];
const NO_NAV_PATHS    = ["/portal"];
const NO_CHAT_PATHS   = ["/admin"];

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const noShell  = NO_SHELL_PATHS.some(p => pathname === p || pathname.startsWith(p + "/"));
  const noNav    = NO_NAV_PATHS.some(p => pathname === p || pathname.startsWith(p + "/"));
  const noChat   = NO_CHAT_PATHS.some(p => pathname === p || pathname.startsWith(p + "/"));

  if (noShell) return <>{children}</>;

  if (noNav) {
    return (
      <>
        {children}
        <SiteLiveChat />
      </>
    );
  }

  return (
    <>
      <Preloader />
      <Nav />
      <main>{children}</main>
      <Footer />
      <FoxChat />
      {!noChat && <SiteLiveChat />}
    </>
  );
}
