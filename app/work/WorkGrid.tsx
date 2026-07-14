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
const STATUS_LABEL: Record<string, string> = { draft: "Draft", review: "In review", live: "Live", archived: "Archived" };

function toSlug(name: string): string {
  return name.toLowerCase().replace(/[—–]/g, "-").replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}

/** Project names arrive from the DB as "Celeste — AI-native marketplace"; the page shows no dashes, and the trailing half is already the tagline's job. */
function shortName(name: string): string {
  return name.split(/\s+[—–]\s+/)[0].trim();
}
/** Dashes inside DB prose become commas rather than being dropped. */
function dedash(s: string): string {
  return s.replace(/\s*[—–]\s*/g, ", ");
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
    <section className="section" id="work-archive" style={{ paddingTop: 48 }}>
      <div className="wrap">
        <div className="work-rule fade in">
          <h2>Selected <span className="it">work.</span></h2>
          <span className="count">
            {visible.length === projects.length
              ? `${String(projects.length).padStart(2, "0")} projects`
              : `${String(visible.length).padStart(2, "0")} of ${String(projects.length).padStart(2, "0")}`}
          </span>
        </div>

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
                <article
                  key={p.id}
                  className={`item ${tone}${i === 0 ? " is-feature" : ""} fade${i % 4 === 0 ? "" : ` d${i % 4}`}`}
                  style={{ ["--si" as string]: i }}
                >
                  <div className="thumb">
                    {img
                      ? <img src={img} alt={p.name} loading="lazy" decoding="async" />
                      : <span className="proj-thumb-empty">No image yet</span>
                    }
                    <span className="work-index" aria-hidden="true">{num}</span>
                    {p.status !== "live" && (
                      <span className="proj-status-badge">{STATUS_LABEL[p.status] ?? p.status}</span>
                    )}
                  </div>

                  <div className="body">
                    <div className="meta">
                      <span>Case {num}</span>
                      <span>{p.year}</span>
                    </div>
                    <h3>{shortName(p.name)}</h3>
                    {p.tagline && <p className="proj-tagline">{dedash(p.tagline)}</p>}
                    {p.scope && <div className="proj-scope">{dedash(p.scope)}</div>}
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
