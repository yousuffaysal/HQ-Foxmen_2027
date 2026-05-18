"use client";
import { usePathname } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import FoxChat from "@/components/FoxChat";

const NO_SHELL_PATHS = ["/login", "/register", "/portal"];

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const noShell = NO_SHELL_PATHS.some(p => pathname === p || pathname.startsWith(p + "/"));

  if (noShell) return <>{children}</>;

  return (
    <>
      <Preloader />
      <Nav />
      <main>{children}</main>
      <Footer />
      <FoxChat />
    </>
  );
}
