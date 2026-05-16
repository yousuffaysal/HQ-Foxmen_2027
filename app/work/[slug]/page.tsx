"use client";
import Link from "next/link";
import { use, useEffect, useRef, useState } from "react";
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
  challenge_img1_label: string; challenge_img2_label: string;
  solution_img1_label: string; solution_img2_label: string;
  challenge_img1_orient: string; challenge_img2_orient: string;
  solution_img1_orient: string; solution_img2_orient: string;
  client_quote: string; client_quote_author: string; client_quote_role: string;
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
  useScrollReveal(".fade");
  const gallery = parseGallery(p.gallery);
  const video = getVideoEmbed(p.video_url);
  const techStack = p.tech_stack ? p.tech_stack.split(/[,·]/).map(t => t.trim()).filter(Boolean) : [];
  const hasSplit1 = p.challenge_img1 || p.challenge_img2;
  const hasSplit2 = p.solution_img1 || p.solution_img2;

  // Chapter nav scroll-spy
  const navRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const sectionIds: string[] = [];
    if (p.overview) sectionIds.push("cs-overview");
    if (p.challenge) sectionIds.push("cs-challenge");
    if (p.solution) sectionIds.push("cs-solution");
    if (p.results) sectionIds.push("cs-results");
    sectionIds.push("cs-credits");

    function update() {
      const scrollY = window.scrollY + window.innerHeight * 0.4;
      let activeId = sectionIds[0] || "";
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) activeId = id;
      }
      if (navRef.current) {
        navRef.current.querySelectorAll("a[data-section]").forEach(a => {
          const s = (a as HTMLAnchorElement).dataset.section || "";
          a.classList.toggle("on", s === activeId);
        });
      }
      const total = document.body.scrollHeight - window.innerHeight;
      const pct = total > 0 ? Math.min(100, Math.max(0, (window.scrollY / total) * 100)) : 0;
      if (progressRef.current) progressRef.current.style.width = pct + "%";
    }

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, [p.overview, p.challenge, p.solution, p.results]);

  // Parse results lines: "key|value|context"
  function parseResults(raw: string) {
    const lines = raw.split("\n").filter(Boolean);
    const parsed = lines.map(l => {
      const parts = l.split("|");
      if (parts.length >= 2) return { k: parts[0].trim(), v: parts[1].trim(), ctx: parts[2]?.trim() || "" };
      return null;
    });
    const valid = parsed.filter(Boolean) as { k: string; v: string; ctx: string }[];
    const unparsed = lines.filter((_, i) => !parsed[i]);
    return { grid: valid, text: unparsed };
  }

  // Avatar initials from author name
  function initials(name: string) {
    return name.split(/\s+/).map(w => w[0]?.toUpperCase() || "").slice(0, 2).join("");
  }

  // Smooth scroll for chapter nav clicks
  function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
  }

  // Build chapter nav entries
  const chapters: { id: string; label: string; num: string }[] = [];
  let chapNum = 1;
  if (p.overview) { chapters.push({ id: "cs-overview", label: "Overview", num: String(chapNum).padStart(2, "0") }); chapNum++; }
  if (p.challenge) { chapters.push({ id: "cs-challenge", label: p.split1_label || "Challenge", num: String(chapNum).padStart(2, "0") }); chapNum++; }
  if (p.solution) { chapters.push({ id: "cs-solution", label: p.split2_label || "Solution", num: String(chapNum).padStart(2, "0") }); chapNum++; }
  if (p.results) { chapters.push({ id: "cs-results", label: "Results", num: String(chapNum).padStart(2, "0") }); chapNum++; }
  chapters.push({ id: "cs-credits", label: "Credits", num: String(chapNum).padStart(2, "0") });

  // For overview: derive glanceable bullets from tech_stack
  const glanceBullets = techStack.slice(0, 5);

  // For challenge: extract pain points from first lines
  const challengeLines = p.challenge ? p.challenge.split("\n").filter(Boolean) : [];
  const challengePainPoints = challengeLines.slice(0, 4);

  // Results parsing
  const { grid: resultsGrid, text: resultsText } = p.results ? parseResults(p.results) : { grid: [], text: [] };

  return (
    <>
      <ProgressBar />

      {/* ── A. CASE HERO ── */}
      <section className="case-hero">
        <div className="wrap">
          <div className="case-meta fade">
            <span>
              <span className="dot" />
              <Link href="/work" style={{ color: "inherit", textDecoration: "none" }}>← Work</Link>
            </span>
            {p.industry && <><span>·</span><span>{p.industry}</span></>}
            {p.scope && <><span>·</span><span>{p.scope}</span></>}
            {p.year && <><span>·</span><span>{p.year}</span></>}
          </div>

          <h1 className="case-title fade">
            {p.name}
            {p.tagline && <><br /><span className="it">{p.tagline}</span></>}
          </h1>

          {p.overview && (
            <p className="case-sub fade">
              {p.overview.length > 200 ? p.overview.slice(0, 200) + "…" : p.overview}
            </p>
          )}

          <div className="case-keys fade">
            {p.client_name && <div><div className="k">Company</div><div className="v">{p.client_name}</div></div>}
            {p.industry && <div><div className="k">Industry</div><div className="v">{p.industry}</div></div>}
            {p.year && <div><div className="k">Year</div><div className="v">{p.year}</div></div>}
            {p.scope && <div><div className="k">Scope</div><div className="v">{p.scope}</div></div>}
          </div>
        </div>
      </section>

      {/* ── B. HERO SHOT ── */}
      <div className="hero-shot fade">
        <div className="frame">
          {p.hero_image
            ? <img src={p.hero_image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            : <div className="device-mock" />
          }
          {p.live_url && (
            <a href={p.live_url} target="_blank" rel="noopener noreferrer" className="badge">
              Live · {p.live_url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
            </a>
          )}
        </div>
      </div>

      {/* ── C. STICKY CHAPTER NAV ── */}
      <nav className="chapter-nav">
        <div className="wrap inner" ref={navRef}>
          {chapters.map(ch => (
            <a
              key={ch.id}
              href={`#${ch.id}`}
              data-section={ch.id}
              onClick={e => { e.preventDefault(); scrollToSection(ch.id); }}
            >
              <span className="n">{ch.num}</span>{ch.label}
            </a>
          ))}
          <span className="progress-line" ref={progressRef} />
        </div>
      </nav>

      {/* ── D. CHAPTER 01 — OVERVIEW ── */}
      {p.overview && (
        <section className="chap" id="cs-overview">
          <div className="wrap-tight">
            <div className="chap-head">
              <div className="num fade">01</div>
              <div>
                <div className="label fade">Overview</div>
                <h2 className="fade">
                  {p.overview.split(".")[0].trim()}.
                </h2>
              </div>
            </div>
            <div className="chap-body">
              <aside className="side fade">
                <div className="label">At a glance</div>
                <ul>
                  {glanceBullets.length > 0
                    ? glanceBullets.map(b => <li key={b}>{b}</li>)
                    : p.timeline_duration ? <li>{p.timeline_duration}</li> : null
                  }
                </ul>
              </aside>
              <div className="fade">
                <p className="lede">{p.overview}</p>
              </div>
              <div className="meta-stats fade">
                {p.timeline_duration && (
                  <div className="stat-big">
                    <div className="k">Timeline</div>
                    <div className="v">{p.timeline_duration}</div>
                  </div>
                )}
                {p.year && (
                  <div className="stat-big">
                    <div className="k">Year</div>
                    <div className="v">{p.year}</div>
                  </div>
                )}
                {p.industry && (
                  <div className="stat-big">
                    <div className="k">Industry</div>
                    <div className="v"><span className="it">{p.industry}</span></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── E. CHAPTER 02 — CHALLENGE ── */}
      {p.challenge && (
        <section className="chap" id="cs-challenge">
          <div className="wrap-tight">
            <div className="chap-head">
              <div className="num fade">{chapters.find(c => c.id === "cs-challenge")?.num || "02"}</div>
              <div>
                <div className="label fade">{p.split1_label || "Challenge"}</div>
                <h2 className="fade">
                  {challengeLines[0] || p.name}
                </h2>
              </div>
            </div>
            <div className="chap-body">
              <aside className="side fade">
                <div className="label">The pain</div>
                <ul>
                  {challengePainPoints.map((pt, i) => <li key={i}>{pt}</li>)}
                </ul>
              </aside>
              <div className="fade">
                {challengeLines.slice(1).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
                {challengeLines.length === 1 && <p className="lede">{challengeLines[0]}</p>}
              </div>
              <div className="fade" />
            </div>
            {hasSplit1 && (
              <div className="split">
                {p.challenge_img1 && (
                  <div className={`shot fade${(p.challenge_img1_orient || "portrait") === "landscape" ? " landscape" : ""}`}>
                    {p.challenge_img1_label && <span className="label">{p.challenge_img1_label}</span>}
                    <img src={p.challenge_img1} alt={p.challenge_img1_label || `${p.split1_label || "Challenge"} — left`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                )}
                {!p.challenge_img1 && (
                  <div className={`shot dark fade${(p.challenge_img1_orient || "portrait") === "landscape" ? " landscape" : ""}`}>
                    {p.challenge_img1_label && <span className="label">{p.challenge_img1_label}</span>}
                  </div>
                )}
                {p.challenge_img2 && (
                  <div className={`shot fade delay${(p.challenge_img2_orient || "portrait") === "landscape" ? " landscape" : ""}`}>
                    {p.challenge_img2_label && <span className="label">{p.challenge_img2_label}</span>}
                    <img src={p.challenge_img2} alt={p.challenge_img2_label || `${p.split1_label || "Challenge"} — right`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                )}
                {!p.challenge_img2 && (
                  <div className={`shot brand fade delay${(p.challenge_img2_orient || "portrait") === "landscape" ? " landscape" : ""}`}>
                    {p.challenge_img2_label && <span className="label">{p.challenge_img2_label}</span>}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── F. CHAPTER 03 — SOLUTION ── */}
      {p.solution && (
        <section className="chap" id="cs-solution">
          <div className="wrap-tight">
            <div className="chap-head">
              <div className="num fade">{chapters.find(c => c.id === "cs-solution")?.num || "03"}</div>
              <div>
                <div className="label fade">{p.split2_label || "Solution"}</div>
                <h2 className="fade">
                  {p.solution.split("\n").filter(Boolean)[0] || p.name}
                </h2>
              </div>
            </div>
            <div className="chap-body">
              <aside className="side fade">
                <div className="label">Surfaces</div>
                <ul>
                  {techStack.slice(0, 4).map(t => <li key={t}>{t}</li>)}
                </ul>
              </aside>
              <div className="fade">
                {p.solution.split("\n").filter(Boolean).slice(1).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
                {p.solution.split("\n").filter(Boolean).length === 1 && (
                  <p className="lede">{p.solution.split("\n").filter(Boolean)[0]}</p>
                )}
              </div>
              <div className="fade" />
            </div>
            {hasSplit2 && (
              <div className="split">
                {p.solution_img1 && (
                  <div className={`shot fade${(p.solution_img1_orient || "portrait") === "landscape" ? " landscape" : ""}`}>
                    {p.solution_img1_label && <span className="label">{p.solution_img1_label}</span>}
                    <img src={p.solution_img1} alt={p.solution_img1_label || `${p.split2_label || "Solution"} — left`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                )}
                {!p.solution_img1 && (
                  <div className={`shot dark fade${(p.solution_img1_orient || "portrait") === "landscape" ? " landscape" : ""}`}>
                    {p.solution_img1_label && <span className="label">{p.solution_img1_label}</span>}
                  </div>
                )}
                {p.solution_img2 && (
                  <div className={`shot fade delay${(p.solution_img2_orient || "portrait") === "landscape" ? " landscape" : ""}`}>
                    {p.solution_img2_label && <span className="label">{p.solution_img2_label}</span>}
                    <img src={p.solution_img2} alt={p.solution_img2_label || `${p.split2_label || "Solution"} — right`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                )}
                {!p.solution_img2 && (
                  <div className={`shot brand fade delay${(p.solution_img2_orient || "portrait") === "landscape" ? " landscape" : ""}`}>
                    {p.solution_img2_label && <span className="label">{p.solution_img2_label}</span>}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── G. FULL-BLEED QUOTE ── */}
      {p.client_quote && (
        <section className="quote-full">
          <div className="wrap-tight">
            <p className="text">{p.client_quote}</p>
            {(p.client_quote_author || p.client_quote_role) && (
              <div className="meta">
                {p.client_quote_author && (
                  <span className="av">{initials(p.client_quote_author)}</span>
                )}
                {p.client_quote_author && <span>{p.client_quote_author}</span>}
                {p.client_quote_author && p.client_quote_role && <span style={{ opacity: 0.5 }}>·</span>}
                {p.client_quote_role && <span>{p.client_quote_role}</span>}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── H. CHAPTER 04 — RESULTS ── */}
      {p.results && (
        <section className="chap" id="cs-results">
          <div className="wrap">
            <div className="results-hero fade">
              <span className="eyebrow">{chapters.find(c => c.id === "cs-results")?.num || "04"} — Results</span>
              <h2 style={{ marginTop: 24 }}>
                {resultsGrid.length > 0
                  ? <>{p.results.split("\n").filter(Boolean)[0]?.split("|")[0] || "Results"}<br /><span className="it">by the numbers.</span></>
                  : <>{p.results.split("\n").filter(Boolean)[0]}<br /><span className="it">delivered.</span></>
                }
              </h2>
            </div>
            {resultsGrid.length > 0 ? (
              <div className="results-grid">
                {resultsGrid.map((r, i) => (
                  <div key={i} className="r fade">
                    <div className="k">{r.k}</div>
                    <div className="v">{r.v}</div>
                    {r.ctx && <div className="ctx">{r.ctx}</div>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="chap-body" style={{ gridTemplateColumns: "1fr" }}>
                <div className="fade">
                  {resultsText.map((para, i) => <p key={i}>{para}</p>)}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── VIDEO ── */}
      {video && (
        <section className="chap" style={{ padding: "80px 0" }}>
          <div className="wrap-tight">
            <div className="chap-head" style={{ marginBottom: 32 }}>
              <div className="num fade" style={{ fontSize: 80 }}>▶</div>
              <div>
                <div className="label fade">Showreel</div>
                <h2 className="fade" style={{ fontSize: "clamp(32px,4vw,56px)" }}>Watch the build.</h2>
              </div>
            </div>
            <div className="cs2-video fade">
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
        <section style={{ padding: "80px 0", borderBottom: "1px solid var(--line)" }}>
          <div className="wrap-tight">
            <div className="cs2-gallery">
              {gallery.map((url, i) => {
                const isVid = /\.(mp4|webm|mov)$/i.test(url);
                return (
                  <div key={i} className={`cs2-gallery-item fade${i % 3 === 0 ? " cs2-gallery-item--wide" : ""}`}>
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

      {/* ── I. CHAPTER 05 — CREDITS ── */}
      <section id="cs-credits" style={{ padding: "48px 0" }}>
        <div className="credits">
          <div className="inner">
            <div className="credits-grid">
              <div>
                <div className="label">{chapters.find(c => c.id === "cs-credits")?.num || "05"} — Behind the build</div>
                <h3>{p.name}{p.tagline && <> — <span className="it">{p.tagline}</span></>}</h3>
                {p.overview && (
                  <p style={{ color: "#bdbdbd", fontSize: 16, lineHeight: 1.6, maxWidth: "42ch", margin: 0 }}>
                    {p.overview.length > 200 ? p.overview.slice(0, 200) + "…" : p.overview}
                  </p>
                )}
              </div>
              {techStack.length > 0 && (
                <div>
                  <div className="label">Technology</div>
                  <div className="tech-list">
                    {techStack.map(t => <span key={t}>{t}</span>)}
                  </div>
                </div>
              )}
              <div>
                <div className="label">Credits</div>
                <div className="team-list">
                  {p.client_name && (
                    <div className="row"><span className="name">{p.client_name}</span><span className="role">Client</span></div>
                  )}
                  {p.industry && (
                    <div className="row"><span className="name">{p.industry}</span><span className="role">Industry</span></div>
                  )}
                  {p.year && (
                    <div className="row"><span className="name">{p.year}</span><span className="role">Year</span></div>
                  )}
                  {p.timeline_duration && (
                    <div className="row"><span className="name">{p.timeline_duration}</span><span className="role">Duration</span></div>
                  )}
                  {p.scope && (
                    <div className="row"><span className="name">{p.scope}</span><span className="role">Scope</span></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── J. SHARE BAR + NEXT PROJECT CTA ── */}
      <section style={{ padding: "0 24px" }}>
        <div className="wrap-tight">
          <div className="share-bar fade">
            <div>
              <div className="label">Share this case study</div>
              <div style={{ marginTop: 8, fontFamily: "var(--f-display)", fontSize: 24, lineHeight: 1, letterSpacing: "-.01em" }}>
                {p.name}{p.tagline && <span style={{ color: "var(--brand)", fontStyle: "italic" }}> — {p.tagline}</span>}
              </div>
            </div>
            <div className="links">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${p.name}${p.tagline ? " — " + p.tagline : ""} | Foxmen Studio`)}&url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                target="_blank" rel="noopener noreferrer" aria-label="Twitter"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2H21.5l-7.5 8.57L23 22h-6.844l-5.36-7.005L4.7 22H1.44l8.04-9.183L1 2h7.014l4.844 6.405L18.244 2Z"/></svg>
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6 0h3.84v1.71h.05c.54-1 1.87-2.08 3.84-2.08C20.6 8.63 22 11 22 14.18V21h-4v-6.06c0-1.45-.03-3.31-2.02-3.31-2.02 0-2.33 1.58-2.33 3.21V21H9V9Z"/></svg>
              </a>
              <a
                href="#"
                aria-label="Copy link"
                onClick={e => { e.preventDefault(); if (typeof navigator !== "undefined") navigator.clipboard?.writeText(window.location.href); }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "48px 0" }}>
        <Link href="/work" className="next-project" style={{ display: "block", textDecoration: "none" }}>
          <div className="wrap">
            <div className="eye">Back to all work</div>
            <h2>All <span className="it">Case</span><br />Studies</h2>
            <div className="cta-row">
              <span className="btn btn--lg" style={{ background: "#fff", color: "var(--ink)", pointerEvents: "none" }}>
                <span className="label">View all projects</span>
                <span className="chip" style={{ background: "var(--ink)", color: "#fff" }}><ArrowIcon /></span>
              </span>
            </div>
          </div>
        </Link>
      </section>
    </>
  );
}

/* ── ROOT: tries DB first, falls back to static data ────────── */
export default function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [dbProject, setDbProject] = useState<CsProject | null | "loading">("loading");

  useEffect(() => {
    fetch(`/api/case-study/${slug}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => setDbProject(data || null))
      .catch(() => setDbProject(null));
  }, [slug]);

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
  const d = projectMap[slug];
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
