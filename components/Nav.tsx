"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

const links = [
  { href: "/work",     label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/about",    label: "About" },
  { href: "/journal",  label: "Journal" },
  { href: "/tools",    label: "Tools" },
  { href: "/contact",  label: "Contact" },
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h18M13 5l7 7-7 7" />
    </svg>
  );
}

type Profile = { name?: string; avatar?: string };

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [clock, setClock] = useState("— : —");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

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

  useEffect(() => {
    fetch("/api/auth/profile")
      .then(r => r.ok ? r.json() : null)
      .then((d: Profile | null) => setProfile(d))
      .catch(() => {});
  }, []);

  const isLoggedIn = !!profile;
  const firstName  = profile?.name?.split(" ")[0] ?? "Portal";
  const initials   = (profile?.name ?? "U").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <>
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
            <Link href="/portal" className="btn btn--ghost" style={{ marginRight: 4 }}>
              <span className="label">{isLoggedIn ? firstName : "Client Portal"}</span>
              <span className="chip" aria-hidden="true">
                {isLoggedIn ? (
                  profile?.avatar
                    ? <img src={profile.avatar} alt="" style={{ width: 22, height: 22, borderRadius: "50%", objectFit: "cover", display: "block" }} />
                    : <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#b86cf9", color: "#fff", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>{initials}</span>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>
                  </svg>
                )}
              </span>
            </Link>
            <Link href="/contact" className="btn nav-start-btn">
              <span className="label">Start a project</span>
              <span className="chip" aria-hidden="true">
                <ArrowIcon />
              </span>
            </Link>
            <button
              className="nav-hamburger"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(o => !o)}
            >
              <span className={`hb${menuOpen ? " open" : ""}`} />
              <span className={`hb${menuOpen ? " open" : ""}`} />
              <span className={`hb${menuOpen ? " open" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="mob-menu-backdrop" onClick={() => setMenuOpen(false)}>
          <div className="mob-menu" onClick={e => e.stopPropagation()}>
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`mob-link${pathname === href || (href !== "/" && pathname.startsWith(href)) ? " active" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
            <Link href="/contact" className="btn btn--lg mob-cta" onClick={() => setMenuOpen(false)}>
              <span className="label">Start a project</span>
              <span className="chip"><ArrowIcon /></span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
