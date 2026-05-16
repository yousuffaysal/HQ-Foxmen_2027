"use client";
import Link from "next/link";
import { use, useEffect, useRef, useState } from "react";
import { projectMap } from "../data";

/* ── types ─────────────────────────────────────────────────────── */
type ChapterImage = { url: string; orient: "portrait" | "landscape"; label: string };
type Chapter = { id: string; title: string; body: string; images: ChapterImage[]; video: string };

type CsProject = {
  id: number; name: string; tagline: string; overview: string;
  tech_stack: string; timeline_duration: string; client_name: string;
  industry: string; year: string; scope: string; status: string;
  hero_image: string; thumbnail: string; gallery: string;
  live_url: string; monogram: string; color_cls: string;
  client_quote: string; client_quote_author: string; client_quote_role: string;
  chapters: string;
  slug: string;
};

/* ── helpers ────────────────────────────────────────────────────── */
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
  if (yt) return { type: "iframe", src: `https://www.youtube.com/embed/${yt[1]}?rel=0&modestbranding=1` };
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return { type: "iframe", src: `https://player.vimeo.com/video/${vimeo[1]}` };
  return { type: "mp4", src: url };
}

function parseGallery(raw: string): string[] {
  try { const arr = JSON.parse(raw); return Array.isArray(arr) ? arr.filter(Boolean) : []; }
  catch { return []; }
}

function parseChapters(raw: string): Chapter[] {
  try {
    const arr = JSON.parse(raw || "[]");
    if (!Array.isArray(arr)) return [];
    return arr.filter(c => c.title || c.body || (Array.isArray(c.images) && c.images.length > 0) || c.video);
  } catch { return []; }
}

/* ── progress bar ───────────────────────────────────────────────── */
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
  return <div className="cs-progress-track"><div className="cs-progress-bar" ref={barRef} /></div>;
}

/* ── chapter image grid ─────────────────────────────────────────── */
function ChapterImages({ images }: { images: ChapterImage[] }) {
  const real = images.filter(img => img.url);
  if (!real.length) return null;

  const single = real.length === 1;
  const double = real.length === 2;

  return (
    <div className={`cs-img-grid ${single ? "cs-img-grid--single" : double ? "cs-img-grid--double" : "cs-img-grid--multi"}`}>
      {real.map((img, i) => (
        <div key={i} className={`cs-img-wrap ${img.orient === "portrait" ? "portrait" : "landscape"}`}>
          {img.label && <span className="cs-img-label">{img.label}</span>}
          <img src={img.url} alt={img.label || `Image ${i + 1}`} />
        </div>
      ))}
    </div>
  );
}

/* ── chapter video ──────────────────────────────────────────────── */
function ChapterVideo({ url }: { url: string }) {
  const embed = getVideoEmbed(url);
  if (!embed) return null;
  return (
    <div className="cs-video-wrap">
      {embed.type === "iframe"
        ? <iframe src={embed.src} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        : <video src={embed.src} controls playsInline />
      }
    </div>
  );
}

/* ── DB-driven case study ───────────────────────────────────────── */
function DbCasePage({ project: p }: { project: CsProject }) {
  const chapters = parseChapters(p.chapters);
  const gallery  = parseGallery(p.gallery || "[]");
  const techStack = p.tech_stack ? p.tech_stack.split(/[,·]/).map(t => t.trim()).filter(Boolean) : [];

  /* chapter nav IDs */
  const navItems: { id: string; label: string; num: string }[] = [
    ...(p.overview ? [{ id: "cs-overview", label: "Overview", num: "00" }] : []),
    ...chapters.map((ch, i) => ({
      id: `cs-ch-${i}`,
      label: ch.title || `Chapter ${i + 1}`,
      num: String(i + 1 + (p.overview ? 0 : 0)).padStart(2, "0"),
    })),
    ...(p.client_quote ? [{ id: "cs-quote", label: "Quote", num: "--" }] : []),
    ...(gallery.length > 0 ? [{ id: "cs-gallery", label: "Gallery", num: "--" }] : []),
    { id: "cs-credits", label: "Credits", num: "--" },
  ].map((item, i) => ({ ...item, num: String(i + 1).padStart(2, "0") }));

  /* active chapter scroll spy */
  const [activeId, setActiveId] = useState(navItems[0]?.id || "");
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ids = navItems.map(n => n.id);
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => { if (e.isIntersecting) setActiveId(e.target.id); });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    ids.forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p.id]);

  useEffect(() => {
    const update = () => {
      const total = document.body.scrollHeight - window.innerHeight;
      const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
      if (progressRef.current) progressRef.current.style.width = `${pct}%`;
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  /* fade-in on scroll */
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".fade").forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [p.id]);

  return (
    <>
      <ProgressBar />

      {/* ── CASE HERO ── */}
      <section className="case-hero">
        <div className="wrap">
          <div className="case-meta fade in">
            <Link href="/work" className="cs-back">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              All work
            </Link>
            {p.industry && <><span>·</span><span>{p.industry}</span></>}
            {p.scope    && <><span>·</span><span>{p.scope}</span></>}
            {p.year     && <><span>·</span><span>{p.year}</span></>}
          </div>

          <h1 className="case-title">
            <span className="reveal in"><span className="reveal-inner">{p.name}</span></span>
            {p.tagline && (
              <span className="reveal in reveal-delay-1">
                <span className="reveal-inner it">{p.tagline}</span>
              </span>
            )}
          </h1>

          {p.overview && (
            <p className="case-sub fade in">
              {p.overview.length > 220 ? p.overview.slice(0, 220) + "…" : p.overview}
            </p>
          )}

          <div className="case-keys fade in">
            {p.client_name       && <div><div className="k">Company</div><div className="v">{p.client_name}</div></div>}
            {p.industry          && <div><div className="k">Industry</div><div className="v">{p.industry}</div></div>}
            {p.year              && <div><div className="k">Year</div><div className="v">{p.year}</div></div>}
            {p.timeline_duration && <div><div className="k">Timeline</div><div className="v">{p.timeline_duration}</div></div>}
            {p.scope             && <div><div className="k">Scope</div><div className="v">{p.scope}</div></div>}
          </div>
        </div>
      </section>

      {/* ── HERO SHOT ── */}
      <div className="hero-shot fade">
        <div className="frame">
          {p.hero_image
            ? <img src={p.hero_image} alt={p.name} className="hero-shot-img" />
            : <div className="hero-shot-placeholder"><span>{p.monogram || p.name.slice(0, 2).toUpperCase()}</span></div>
          }
          {p.live_url && (
            <a href={p.live_url} target="_blank" rel="noopener noreferrer" className="badge">
              Live · {p.live_url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
            </a>
          )}
        </div>
      </div>

      {/* ── STICKY CHAPTER NAV ── */}
      {navItems.filter(n => !["cs-quote","cs-gallery","cs-credits"].includes(n.id) || n.id === "cs-credits").length > 1 && (
        <nav className="chapter-nav">
          <div className="wrap inner" id="chapter-nav-inner">
            {navItems.map(n => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className={activeId === n.id ? "on" : ""}
                onClick={e => {
                  e.preventDefault();
                  document.getElementById(n.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                <span className="n">{n.num}</span>
                {n.label}
              </a>
            ))}
            <span className="progress-line" ref={progressRef} />
          </div>
        </nav>
      )}

      {/* ── OVERVIEW ── */}
      {p.overview && (
        <section className="chap" id="cs-overview">
          <div className="wrap-tight">
            <div className="chap-head">
              <div className="num fade">01</div>
              <div>
                <div className="label fade">Overview</div>
                <h2 className="fade d1">The project, <span className="it">in full.</span></h2>
              </div>
            </div>
            <div className="chap-body">
              <aside className="side fade">
                {techStack.length > 0 && (
                  <>
                    <div className="label">Stack</div>
                    <ul>{techStack.slice(0, 6).map(t => <li key={t}>{t}</li>)}</ul>
                  </>
                )}
              </aside>
              <div className="fade d1">
                {p.overview.split("\n").filter(Boolean).map((para, i) => (
                  <p key={i} className={i === 0 ? "lede" : ""}>{para}</p>
                ))}
              </div>
              <div className="meta-stats fade d2">
                {p.timeline_duration && <div className="stat-big"><div className="k">Timeline</div><div className="v">{p.timeline_duration}</div></div>}
                {p.year              && <div className="stat-big"><div className="k">Year</div><div className="v">{p.year}</div></div>}
                {p.industry          && <div className="stat-big"><div className="k">Industry</div><div className="v" style={{fontSize:32}}>{p.industry}</div></div>}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── FLEXIBLE CHAPTERS ── */}
      {chapters.map((ch, i) => {
        const chNum = String(i + 1 + (p.overview ? 1 : 0)).padStart(2, "0");
        return (
          <section className="chap" id={`cs-ch-${i}`} key={ch.id || i}>
            <div className="wrap-tight">
              <div className="chap-head">
                <div className="num fade">{chNum}</div>
                <div>
                  <div className="label fade">{ch.title}</div>
                  <h2 className="fade d1">{ch.title} <span className="it">—</span></h2>
                </div>
              </div>

              {ch.body && (
                <div className="chap-text fade d1">
                  {ch.body.split("\n").filter(Boolean).map((para, j) => (
                    <p key={j} className={j === 0 ? "lede" : ""}>{para}</p>
                  ))}
                </div>
              )}

              {ch.images && ch.images.length > 0 && (
                <div className="fade d2">
                  <ChapterImages images={ch.images} />
                </div>
              )}

              {ch.video && (
                <div className="fade d2">
                  <ChapterVideo url={ch.video} />
                </div>
              )}
            </div>
          </section>
        );
      })}

      {/* ── PULL QUOTE ── */}
      {p.client_quote && (
        <section className="quote-full" id="cs-quote">
          <div className="wrap-tight">
            <p className="text">{p.client_quote}</p>
            {(p.client_quote_author || p.client_quote_role) && (
              <div className="meta">
                {p.client_quote_author && (
                  <div className="av">
                    {p.client_quote_author.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()}
                  </div>
                )}
                {p.client_quote_author && <span>{p.client_quote_author}</span>}
                {p.client_quote_role   && <><span style={{ opacity: .5 }}>·</span><span>{p.client_quote_role}</span></>}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── GALLERY ── */}
      {gallery.length > 0 && (
        <section className="chap" id="cs-gallery">
          <div className="wrap-tight">
            <div className="chap-head">
              <div className="num fade">✦</div>
              <div>
                <div className="label fade">Gallery</div>
                <h2 className="fade d1">More <span className="it">visuals.</span></h2>
              </div>
            </div>
            <div className="cs-gallery-grid fade d1">
              {gallery.map((url, i) => {
                const isVid = /\.(mp4|webm|mov)$/i.test(url);
                return (
                  <div key={i} className={`cs-gallery-item${i % 5 === 0 ? " cs-gallery-item--wide" : ""}`}>
                    {isVid
                      ? <video src={url} muted playsInline loop autoPlay />
                      : <img src={url} alt={`${p.name} ${i + 1}`} />
                    }
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── CREDITS ── */}
      <section id="cs-credits" style={{ padding: "48px 0 96px" }}>
        <div className="credits">
          <div className="inner">
            <div className="credits-grid">
              <div>
                <div className="label">Behind the build</div>
                <h3>{p.name} <span className="it">—</span><br />a {p.industry || "studio"} project.</h3>
                {p.client_name && (
                  <p style={{ color: "#bdbdbd", fontSize: 16, lineHeight: 1.6, maxWidth: "42ch", margin: "16px 0 0" }}>
                    Built for {p.client_name}{p.year ? ` in ${p.year}` : ""}.{" "}
                    {p.scope ? `Scope: ${p.scope}.` : ""}
                  </p>
                )}
                {p.live_url && (
                  <a href={p.live_url} target="_blank" rel="noopener noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 24, color: "var(--brand)", fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase" }}>
                    View live site →
                  </a>
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
                <div className="label">Project info</div>
                <div className="team-list">
                  {p.client_name       && <div className="row"><span className="name">{p.client_name}</span><span className="role">Client</span></div>}
                  {p.industry          && <div className="row"><span className="name">{p.industry}</span><span className="role">Industry</span></div>}
                  {p.year              && <div className="row"><span className="name">{p.year}</span><span className="role">Year</span></div>}
                  {p.timeline_duration && <div className="row"><span className="name">{p.timeline_duration}</span><span className="role">Timeline</span></div>}
                  {p.scope             && <div className="row"><span className="name">{p.scope}</span><span className="role">Scope</span></div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── NEXT PROJECT CTA ── */}
      <section style={{ padding: "0 0 96px" }}>
        <Link href="/work" className="next-project" style={{ display: "block" }}>
          <div className="wrap">
            <div className="eye">← Back to all work</div>
            <h2>More <span className="it">case</span><br />studies.</h2>
            <div className="preview">
              <span>Foxmen Studio</span>
              <span className="sep">·</span>
              <span>Code · Craft · Care</span>
            </div>
            <div className="cta-row" style={{ marginTop: 48 }}>
              <span className="btn btn--lg" style={{ background: "#fff", color: "var(--ink)", pointerEvents: "none" }}>
                <span className="label">All case studies</span>
                <span className="chip" style={{ background: "var(--ink)", color: "#fff" }}>
                  <ArrowIcon />
                </span>
              </span>
            </div>
          </div>
        </Link>
      </section>
    </>
  );
}

/* ── ROOT ───────────────────────────────────────────────────────── */
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

  /* fallback: static project map */
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
