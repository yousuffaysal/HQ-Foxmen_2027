"use client";
import Link from "next/link";
import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h18M13 5l7 7-7 7" />
    </svg>
  );
}

const filters = ["All", "Web", "Mobile", "AI", "Ecommerce", "Real Estate", "Brand"];

const TONE: Record<string, string> = { "(purple)": "violet", "": "violet", b: "dark", c: "brand", d: "bone" };
const THUMB_BG: Record<string, string> = { dark: "#0a0a0a", brand: "#b86cf9", bone: "#efece6", violet: "#1a0c2c" };
const THUMB_FG: Record<string, string> = { dark: "rgba(255,255,255,.4)", brand: "rgba(255,255,255,.8)", bone: "var(--muted)", violet: "rgba(255,255,255,.4)" };
const STATUS_LABEL: Record<string, string> = { draft: "Draft", review: "In review", live: "Live", archived: "Archived" };

function toSlug(name: string): string {
  return name.toLowerCase().replace(/[—–]/g, "-").replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}

type DbProject = {
  id: number; name: string; tagline: string; industry: string;
  year: string; scope: string; status: string;
  thumbnail: string; hero_image: string; color_cls: string;
  live_url: string; slug: string;
};

export default function WorkGrid({ projects }: { projects: DbProject[] }) {
  useScrollReveal(".fade, .reveal");
  const [active, setActive] = useState("All");

  const visible = projects.filter(p => {
    if (active === "All") return true;
    const haystack = `${p.name} ${p.industry} ${p.scope} ${p.tagline}`.toLowerCase();
    return haystack.includes(active.toLowerCase());
  });

  return (
    <section className="section" style={{ paddingTop: 48 }}>
      <div className="wrap">
        <div className="proj-filters fade in">
          {filters.map(f => (
            <button key={f} className={active === f ? "on" : ""} onClick={() => setActive(f)}>{f}</button>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="work-empty">
            <p>No projects yet. Add one from the <Link href="/admin">admin panel</Link>.</p>
          </div>
        )}

        {visible.length === 0 && projects.length > 0 && (
          <div className="work-empty">
            <p>No projects match this filter.</p>
          </div>
        )}

        {visible.length > 0 && (
          <div className="proj-grid">
            {visible.map((p, i) => {
              const tone = TONE[p.color_cls] ?? "violet";
              const img  = p.thumbnail || p.hero_image || "";
              const href = `/work/${p.slug || toSlug(p.name)}`;
              const num  = String(i + 1).padStart(2, "0");

              return (
                <article key={p.id} className={`item ${tone} fade${i % 4 === 0 ? "" : ` d${i % 4}`}`}>
                  <div className="thumb" style={{
                    width: "100%",
                    aspectRatio: "16 / 9",
                    position: "relative",
                    display: "grid",
                    placeItems: "center",
                    overflow: "hidden",
                    background: THUMB_BG[tone] ?? "#1a0c2c",
                    color: THUMB_FG[tone] ?? "rgba(255,255,255,.4)",
                    fontFamily: "var(--f-mono)",
                    fontSize: 10,
                    letterSpacing: ".2em",
                    textTransform: "uppercase",
                  }}>
                    {img
                      ? <img src={img} alt={p.name} loading="lazy" decoding="async" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", display: "block" }} />
                      : <span style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", opacity: .35 }}>No image yet</span>
                    }
                    {p.status !== "live" && (
                      <span className="proj-status-badge">{STATUS_LABEL[p.status] ?? p.status}</span>
                    )}
                  </div>

                  <div className="body" style={{ textAlign: "left" }}>
                    <div className="meta" style={{ textAlign: "left" }}>
                      <span>Case {num}</span>
                      <span>{p.year}</span>
                    </div>
                    <h3 style={{ textAlign: "left" }}>{p.name}</h3>
                    {p.tagline && <p style={{ color: "#3a3a3a", margin: 0, fontSize: 15, lineHeight: 1.55, textAlign: "left" }}>{p.tagline}</p>}
                    {p.scope && (
                      <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--muted)", textAlign: "left" }}>
                        {p.scope}
                      </div>
                    )}
                    <div className="proj-cta-row">
                      {p.live_url && (
                        <a href={p.live_url} target="_blank" rel="noopener noreferrer" className="btn btn--ghost btn--sm">
                          <span className="label">Live site</span>
                          <span className="chip"><ArrowIcon /></span>
                        </a>
                      )}
                      <Link href={href} className="btn btn--sm">
                        <span className="label">Case study</span>
                        <span className="chip"><ArrowIcon /></span>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
