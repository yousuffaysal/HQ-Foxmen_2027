"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { projectMap } from "../data";

/* ── types ─────────────────────────────────────────────────── */
type CsProject = {
  id: number; name: string; tagline: string; overview: string;
  challenge: string; solution: string; results: string;
  tech_stack: string; timeline_duration: string; client_name: string;
  industry: string; year: string; scope: string; status: string;
  hero_image: string; thumbnail: string; gallery: string;
  video_url: string; live_url: string; monogram: string; color_cls: string;
  challenge_img1: string; challenge_img2: string; split1_label: string;
  solution_img1: string; solution_img2: string; split2_label: string;
  slug: string;
};

/* ── helpers ────────────────────────────────────────────────── */
function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h18M13 5l7 7-7 7" />
    </svg>
  );
}

function getVideoEmbed(url: string): { type: "iframe" | "mp4"; src: string } | null {
  if (!url) return null;
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/);
  if (yt) return { type: "iframe", src: `https://www.youtube.com/embed/${yt[1]}?rel=0` };
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return { type: "iframe", src: `https://player.vimeo.com/video/${vimeo[1]}` };
  return { type: "mp4", src: url };
}

function parseGallery(raw: string): string[] {
  try { const arr = JSON.parse(raw); return Array.isArray(arr) ? arr.filter(Boolean) : []; }
  catch { return []; }
}

/* ── progress bar ───────────────────────────────────────────── */
function ProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const update = () => {
      const total = document.body.scrollHeight - window.innerHeight;
      const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
      if (barRef.current) barRef.current.style.width = `${pct}%`;
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return <div className="cs2-progress-track"><div className="cs2-progress-bar" ref={barRef} /></div>;
}

/* ── DB-driven case study ───────────────────────────────────── */
function DbCasePage({ project: p }: { project: CsProject }) {
  useScrollReveal(".cs2-fade");
  const gallery = parseGallery(p.gallery);
  const video = getVideoEmbed(p.video_url);
  const techStack = p.tech_stack ? p.tech_stack.split(/[,·]/).map(t => t.trim()).filter(Boolean) : [];
  const hasSplit1 = p.challenge_img1 || p.challenge_img2;
  const hasSplit2 = p.solution_img1 || p.solution_img2;

  return (
    <>
      <ProgressBar />

      {/* ── HERO ── */}
      <section className="cs2-hero">
        <div className="cs2-hero-inner wrap">
          <div className="cs2-hero-eye cs2-fade">
            <Link href="/work" className="cs2-back">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Work
            </Link>
            <span className="cs2-dot" />
            <span>{p.industry}</span>
            <span className="cs2-dot" />
            <span>{p.year}</span>
          </div>
          <h1 className="cs2-title">
            {p.name.split(" ").map((word, i, arr) =>
              i === arr.length - 1
                ? <span key={i} className="cs2-title-it">{word}</span>
                : <span key={i}>{word} </span>
            )}
          </h1>
          {p.tagline && <p className="cs2-tagline cs2-fade">{p.tagline}</p>}
          <div className="cs2-hero-meta cs2-fade">
            {p.client_name && <div><div className="cs2-meta-k">Company</div><div className="cs2-meta-v">{p.client_name}</div></div>}
            {p.timeline_duration && <div><div className="cs2-meta-k">Timeline</div><div className="cs2-meta-v">{p.timeline_duration}</div></div>}
            {p.scope && <div><div className="cs2-meta-k">Scope</div><div className="cs2-meta-v">{p.scope}</div></div>}
            {p.industry && <div><div className="cs2-meta-k">Industry</div><div className="cs2-meta-v">{p.industry}</div></div>}
          </div>
        </div>
      </section>

      {/* ── COVER IMAGE ── */}
      <div className="cs2-cover">
        {p.hero_image
          ? <img src={p.hero_image} alt={p.name} className="cs2-cover-img" />
          : <div className="cs2-cover-placeholder">
              <span className="cs2-cover-mono">{p.monogram || p.name.slice(0,2).toUpperCase()}</span>
            </div>
        }
        {p.live_url && (
          <a href={p.live_url} target="_blank" rel="noopener noreferrer" className="cs2-live-btn">
            View live <ArrowIcon />
          </a>
        )}
      </div>

      {/* ── OVERVIEW ── */}
      {p.overview && (
        <section className="cs2-section">
          <div className="wrap-tight">
            <div className="cs2-section-head cs2-fade">
              <span className="cs2-section-num">01</span>
              <span className="cs2-section-label">Overview</span>
            </div>
            <div className="cs2-overview-grid">
              <p className="cs2-lede cs2-fade">{p.overview}</p>
              {techStack.length > 0 && (
                <div className="cs2-stack cs2-fade">
                  <div className="cs2-stack-label">Stack</div>
                  <div className="cs2-stack-chips">
                    {techStack.map(t => <span key={t} className="cs2-chip">{t}</span>)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── CHALLENGE / SPLIT 1 ── */}
      {p.challenge && (
        <section className="cs2-section cs2-section--alt">
          <div className="wrap-tight">
            <div className="cs2-section-head cs2-fade">
              <span className="cs2-section-num">02</span>
              <span className="cs2-section-label">{p.split1_label || "Challenge"}</span>
            </div>
            <div className="cs2-text-block cs2-fade">
              {p.challenge.split("\n").filter(Boolean).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            {hasSplit1 && (
              <div className="cs2-split cs2-fade">
                {p.challenge_img1 && (
                  <div className="cs2-split-img">
                    <img src={p.challenge_img1} alt={`${p.split1_label} — left`} />
                  </div>
                )}
                {p.challenge_img2 && (
                  <div className="cs2-split-img">
                    <img src={p.challenge_img2} alt={`${p.split1_label} — right`} />
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── SOLUTION / SPLIT 2 ── */}
      {p.solution && (
        <section className="cs2-section">
          <div className="wrap-tight">
            <div className="cs2-section-head cs2-fade">
              <span className="cs2-section-num">03</span>
              <span className="cs2-section-label">{p.split2_label || "Solution"}</span>
            </div>
            <div className="cs2-text-block cs2-fade">
              {p.solution.split("\n").filter(Boolean).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            {hasSplit2 && (
              <div className="cs2-split cs2-fade">
                {p.solution_img1 && (
                  <div className="cs2-split-img">
                    <img src={p.solution_img1} alt={`${p.split2_label} — left`} />
                  </div>
                )}
                {p.solution_img2 && (
                  <div className="cs2-split-img">
                    <img src={p.solution_img2} alt={`${p.split2_label} — right`} />
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── RESULTS ── */}
      {p.results && (
        <section className="cs2-results">
          <div className="wrap-tight">
            <div className="cs2-section-head cs2-fade" style={{ color: "#fff", borderColor: "rgba(255,255,255,.1)" }}>
              <span className="cs2-section-num" style={{ color: "var(--brand)" }}>04</span>
              <span className="cs2-section-label" style={{ color: "rgba(255,255,255,.5)" }}>Results</span>
            </div>
            <div className="cs2-results-text cs2-fade">
              {p.results.split("\n").filter(Boolean).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── VIDEO ── */}
      {video && (
        <section className="cs2-section cs2-section--tight">
          <div className="wrap-tight">
            <div className="cs2-section-head cs2-fade">
              <span className="cs2-section-num">05</span>
              <span className="cs2-section-label">Showreel</span>
            </div>
            <div className="cs2-video cs2-fade">
              {video.type === "iframe"
                ? <iframe src={video.src} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                : <video src={video.src} controls playsInline />
              }
            </div>
          </div>
        </section>
      )}

      {/* ── GALLERY ── */}
      {gallery.length > 0 && (
        <section className="cs2-section cs2-section--tight">
          <div className="wrap-tight">
            <div className="cs2-section-head cs2-fade">
              <span className="cs2-section-num">{video ? "06" : "05"}</span>
              <span className="cs2-section-label">Gallery</span>
            </div>
            <div className="cs2-gallery">
              {gallery.map((url, i) => {
                const isVid = /\.(mp4|webm|mov)$/i.test(url);
                return (
                  <div key={i} className={`cs2-gallery-item cs2-fade${i % 3 === 0 ? " cs2-gallery-item--wide" : ""}`}>
                    {isVid
                      ? <video src={url} muted playsInline loop autoPlay />
                      : <img src={url} alt={`${p.name} — ${i + 1}`} />
                    }
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── CREDITS FOOTER ── */}
      <div className="cs2-credits">
        <div className="wrap">
          <div className="cs2-credits-grid">
            <div>
              <div className="cs2-credits-label">Project</div>
              <div className="cs2-credits-val">{p.name}</div>
            </div>
            {p.client_name && (
              <div>
                <div className="cs2-credits-label">Company</div>
                <div className="cs2-credits-val">{p.client_name}</div>
              </div>
            )}
            {p.industry && (
              <div>
                <div className="cs2-credits-label">Industry</div>
                <div className="cs2-credits-val">{p.industry}</div>
              </div>
            )}
            {p.year && (
              <div>
                <div className="cs2-credits-label">Year</div>
                <div className="cs2-credits-val">{p.year}</div>
              </div>
            )}
            {p.timeline_duration && (
              <div>
                <div className="cs2-credits-label">Duration</div>
                <div className="cs2-credits-val">{p.timeline_duration}</div>
              </div>
            )}
          </div>
          {techStack.length > 0 && (
            <div className="cs2-credits-stack">
              <div className="cs2-credits-label" style={{ marginBottom: 12 }}>Technology</div>
              <div className="cs2-stack-chips">
                {techStack.map(t => <span key={t} className="cs2-chip cs2-chip--light">{t}</span>)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── CTA ── */}
      <section className="cs2-cta">
        <div className="wrap-tight">
          <div className="cs2-fade"><span className="eyebrow" style={{ color: "var(--brand)" }}>What&apos;s next</span></div>
          <h2 className="cs2-cta-heading cs2-fade">
            Ready to build<br /><span className="it">something great?</span>
          </h2>
          <div className="cs2-cta-row cs2-fade">
            <Link href="/contact" className="btn btn--lg">
              <span className="label">Start a project</span>
              <span className="chip"><ArrowIcon /></span>
            </Link>
            <Link href="/work" className="btn btn--ghost">
              <span className="label">All case studies</span>
              <span className="chip"><ArrowIcon /></span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

/* ── ROOT: tries DB first, falls back to static data ────────── */
export default function CasePage({ params }: { params: { slug: string } }) {
  const [dbProject, setDbProject] = useState<CsProject | null | "loading">("loading");

  useEffect(() => {
    fetch(`/api/case-study/${params.slug}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => setDbProject(data || null))
      .catch(() => setDbProject(null));
  }, [params.slug]);

  if (dbProject === "loading") {
    return (
      <div style={{ minHeight: "100svh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--muted)" }}>
          Loading…
        </span>
      </div>
    );
  }

  if (dbProject) return <DbCasePage project={dbProject} />;

  /* ── fallback: legacy static pages ── */
  const d = projectMap[params.slug];
  if (!d) {
    return (
      <div style={{ minHeight: "60svh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
        <p style={{ fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: ".2em", color: "var(--muted)", textTransform: "uppercase" }}>
          Case study not found
        </p>
        <Link href="/work" className="btn">
          <span className="label">Back to work</span>
          <span className="chip"><ArrowIcon /></span>
        </Link>
      </div>
    );
  }

  return null;
}
