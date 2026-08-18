"use client";
import { usePathname } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import SiteLiveChat from "@/components/SiteLiveChat";

const NO_SHELL_PATHS  = ["/login", "/register"];
const NO_NAV_PATHS    = ["/portal"];
const NO_CHAT_PATHS   = ["/admin"];
// Home V2 ships its own footer as part of the Figma redesign, so the
// shared one is suppressed there to avoid rendering two footers.
const NO_FOOTER_PATHS = ["/"];

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const noShell  = NO_SHELL_PATHS.some(p => pathname === p || pathname.startsWith(p + "/"));
  const noNav    = NO_NAV_PATHS.some(p => pathname === p || pathname.startsWith(p + "/"));
  const noChat   = NO_CHAT_PATHS.some(p => pathname === p || pathname.startsWith(p + "/"));
  const noFooter = NO_FOOTER_PATHS.includes(pathname);

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
      {!noFooter && <Footer />}
      {!noChat && <SiteLiveChat />}
    </>
  );
}
