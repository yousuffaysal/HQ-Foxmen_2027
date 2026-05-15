"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const links = [
  { href: "/work",     label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/#process", label: "Process" },
  { href: "/journal",  label: "Journal" },
  { href: "/contact",  label: "Contact" },
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h18M13 5l7 7-7 7" />
    </svg>
  );
}

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [clock, setClock] = useState("— : —");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", {
      hour: "numeric", minute: "2-digit", hour12: true, timeZone: "Asia/Dhaka",
    });
    const update = () => setClock(fmt.format(new Date()) + " · DHK");
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className={`nav${scrolled ? " scrolled" : ""}`} id="nav">
      <div className="wrap nav-inner">
        <Link href="/" className="brand" aria-label="Foxmen Studio home">
          <Image className="mark" src="/assets/logo-mark.svg" alt="" width={34} height={34} />
          <span className="wm">
            Foxmen Studio
            <span className="small">Code · Craft · Care</span>
          </span>
        </Link>

        <nav className="nav-links" aria-label="Primary">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={pathname === href || (href !== "/" && pathname.startsWith(href)) ? "active" : ""}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="nav-cta">
          <span className="nav-time">
            <span className="dot" />
            <span>{clock}</span>
          </span>
          <Link href="/contact" className="btn">
            <span className="label">Start a project</span>
            <span className="chip" aria-hidden="true">
              <ArrowIcon />
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
