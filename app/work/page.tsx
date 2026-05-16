"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h18M13 5l7 7-7 7" />
    </svg>
  );
}

const filters = ["All","Web","Mobile","AI","Ecommerce","Real Estate","Brand"];

type DbProject = {
  id: number; name: string; tagline: string; industry: string;
  year: string; scope: string; status: string;
  thumbnail: string; hero_image: string; color_cls: string;
  live_url: string; slug: string;
};

const TONE: Record<string, string> = { "(purple)": "violet", "": "violet", b: "dark", c: "brand", d: "bone" };
const STATUS_LABEL: Record<string, string> = { draft: "Draft", review: "In review", live: "Live", archived: "Archived" };

export default function WorkPage() {
  useScrollReveal(".fade, .reveal");

  const [active, setActive]       = useState("All");
  const [projects, setProjects]   = useState<DbProject[] | null>(null);

  useEffect(() => {
    fetch("/api/projects")
      .then(r => r.json())
      .then(rows => {
        if (Array.isArray(rows)) {
          setProjects(rows.filter((p: DbProject) => p.status !== "archived"));
        }
      })
      .catch(() => setProjects([]));
  }, []);

  const visible = (projects ?? []).filter(p => {
    if (active === "All") return true;
    const haystack = `${p.name} ${p.industry} ${p.scope} ${p.tagline}`.toLowerCase();
    return haystack.includes(active.toLowerCase());
  });

  return (
    <>
      {/* ── HERO ── */}
      <section className="page-hero">
        <div className="wrap">
          <div className="crumbs fade in">
            <Link href="/">Home</Link><span className="sep">/</span><span>Work</span>
          </div>
          <h1 className="display">
            <span className="reveal in"><span className="reveal-inner">Selected</span></span>
            <span className="reveal in reveal-delay-1"><span className="reveal-inner it">work.</span></span>
          </h1>
          <p className="lede fade in d2">
            Products built end to end — from seed-stage MVPs to multi-vendor platforms shipping at scale.
          </p>
        </div>
      </section>

      {/* ── GRID ── */}
      <section className="section" style={{ paddingTop: 48 }}>
        <div className="wrap">

          {/* filters */}
          <div className="proj-filters fade in">
            {filters.map(f => (
              <button key={f} className={active === f ? "on" : ""} onClick={() => setActive(f)}>{f}</button>
            ))}
          </div>

          {/* loading skeleton */}
          {projects === null && (
            <div className="proj-grid">
              {[0,1,2,3].map(i => (
                <div key={i} className="proj-item-skeleton" />
              ))}
            </div>
          )}

          {/* empty state */}
          {projects !== null && visible.length === 0 && (
            <div className="work-empty">
              <p>No projects yet. Add one from the <Link href="/admin">admin panel</Link>.</p>
            </div>
          )}

          {/* project cards */}
          {visible.length > 0 && (
            <div className="proj-grid">
              {visible.map((p, i) => {
                const tone = TONE[p.color_cls] ?? "violet";
                const img  = p.thumbnail || p.hero_image || "";
                const href = p.slug ? `/work/${p.slug}` : null;
                const num  = String(i + 1).padStart(2, "0");

                return (
                  <article key={p.id} className={`item ${tone} fade${i % 4 === 0 ? "" : ` d${i % 4}`}`}>

                    {/* thumbnail */}
                    <div className="thumb" style={img ? { backgroundImage: `url(${img})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}>
                      {!img && <span style={{ fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", opacity: .4 }}>No image yet</span>}
                      {p.status !== "live" && (
                        <span className="proj-status-badge">{STATUS_LABEL[p.status] ?? p.status}</span>
                      )}
                    </div>

                    {/* body */}
                    <div className="body">
                      <div className="meta">
                        <span>Case {num}</span>
                        <span>{p.year}</span>
                      </div>
                      <h3>{p.name}</h3>
                      {p.tagline && <p style={{ color: "#3a3a3a", margin: 0, fontSize: 15, lineHeight: 1.55 }}>{p.tagline}</p>}
                      {p.scope && (
                        <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--muted)" }}>
                          {p.scope}
                        </div>
                      )}

                      {/* CTA row */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8, paddingTop: 16, borderTop: "1px solid var(--line)" }}>
                        <span style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--muted)" }}>
                          {p.industry || "Studio"}
                        </span>
                        <div style={{ display: "flex", gap: 8 }}>
                          {p.live_url && (
                            <a href={p.live_url} target="_blank" rel="noopener noreferrer" className="proj-pill">
                              Live site
                            </a>
                          )}
                          {href ? (
                            <Link href={href} className="proj-pill proj-pill--primary">
                              Case study <ArrowIcon />
                            </Link>
                          ) : (
                            <span className="proj-pill proj-pill--muted">No slug yet</span>
                          )}
                        </div>
                      </div>
                    </div>

                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="contact" style={{ padding: "60px 0" }}>
        <div className="cta">
          <div className="wrap-tight">
            <div className="fade in"><span className="eyebrow">Let&apos;s build</span></div>
            <h2 className="fade in d1">Got a brief? <span className="it">Or just</span><br />a half-formed idea?</h2>
            <div className="row fade in d2">
              <Link href="/contact" className="btn btn--lg">
                <span className="label">Start a project</span>
                <span className="chip"><ArrowIcon /></span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
