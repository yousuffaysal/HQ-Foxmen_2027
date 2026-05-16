"use client";
import Link from "next/link";
import { use, useEffect, useRef, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { projectMap } from "../data";

/* ── types ─────────────────────────────────────────────────────── */
type ChapterImage = { url: string; orient: "portrait" | "landscape"; label: string };
type ChapterStat  = { value: string; label: string; context: string };
type Chapter = {
  id: string; title: string; body: string;
  images: ChapterImage[]; video: string;
  stats?: ChapterStat[];
  img_layout?: "side-by-side" | "stacked";
};

type CsProject = {
  id: number; name: string; tagline: string; overview: string;
  tech_stack: string; timeline_duration: string; client_name: string;
  industry: string; year: string; scope: string; status: string;
  hero_image: string; thumbnail: string; gallery: string;
  live_url: string; monogram: string; color_cls: string;
  client_quote: string; client_quote_author: string; client_quote_role: string;
  chapters: string; slug: string;
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
    return arr.filter(c => c.title || c.body || (Array.isArray(c.images) && c.images.filter((i: ChapterImage) => i.url).length > 0) || c.video);
  } catch { return []; }
}

/* ── markdown renderer ──────────────────────────────────────────── */
function parseLine(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
        if (part.startsWith("*") && part.endsWith("*")) return <em key={i}>{part.slice(1, -1)}</em>;
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

const TEXT_COLOR  = "#2a2a2a";
const MUTED_COLOR = "#6b6b6b";

/* helpers — lenient matching for various unicode dashes/bullets */
const isBullet  = (s: string) => /^[-–—•*]\s/.test(s.trimStart());
const isOrdered = (s: string) => /^\d+[.)]\s/.test(s.trimStart());
const isHeading = (s: string) => /^#{1,3}/.test(s.trimStart());
const isQuote   = (s: string) => s.trimStart().startsWith("> ");

function peekNextNonBlank(lines: string[], from: number) {
  for (let j = from; j < lines.length; j++) {
    if (lines[j].trim()) return lines[j];
  }
  return null;
}

function RichText({ text, lede = true }: { text: string; lede?: boolean }) {
  if (!text?.trim()) return null;
  const lines = text.split(/\r?\n/);
  const nodes: React.ReactNode[] = [];
  let i = 0;
  let firstPara = true;

  while (i < lines.length) {
    const raw = lines[i];
    const line = raw.trimStart();

    if (!line.trim()) { i++; continue; }

    /* headings — accept #Word or # Word, 1-3 hashes */
    if (isHeading(raw)) {
      const match = line.match(/^(#{1,3})\s*(.*)/);
      const level = match?.[1].length ?? 1;
      const content = match?.[2].trim() ?? line.replace(/^#+\s*/, "");
      if (level === 1) nodes.push(<h3 key={i} className="md-h3" style={{ color: TEXT_COLOR }}>{parseLine(content)}</h3>);
      else             nodes.push(<h4 key={i} className="md-h4" style={{ color: TEXT_COLOR }}>{parseLine(content)}</h4>);
      i++; continue;
    }

    /* bullet list — group items even when separated by blank lines */
    if (isBullet(raw)) {
      const items: React.ReactNode[] = [];
      while (i < lines.length) {
        const cur = lines[i];
        if (!cur.trim()) {
          /* allow one blank line between bullets */
          const next = peekNextNonBlank(lines, i + 1);
          if (next && isBullet(next)) { i++; continue; }
          break;
        }
        if (!isBullet(cur)) break;
        const content = cur.trimStart().replace(/^[-–—•*]\s*/, "");
        items.push(<li key={i} style={{ color: MUTED_COLOR }}>{parseLine(content)}</li>);
        i++;
      }
      nodes.push(<ul key={`ul-${i}`} className="md-ul">{items}</ul>);
      continue;
    }

    /* ordered list */
    if (isOrdered(raw)) {
      const items: React.ReactNode[] = [];
      while (i < lines.length) {
        const cur = lines[i];
        if (!cur.trim()) {
          const next = peekNextNonBlank(lines, i + 1);
          if (next && isOrdered(next)) { i++; continue; }
          break;
        }
        if (!isOrdered(cur)) break;
        const content = cur.trimStart().replace(/^\d+[.)]\s*/, "");
        items.push(<li key={i} style={{ color: MUTED_COLOR }}>{parseLine(content)}</li>);
        i++;
      }
      nodes.push(<ol key={`ol-${i}`} className="md-ol">{items}</ol>);
      continue;
    }

    /* blockquote */
    if (isQuote(raw)) {
      nodes.push(<blockquote key={i} className="md-bq" style={{ color: MUTED_COLOR }}>{parseLine(line.replace(/^>\s*/, ""))}</blockquote>);
      i++; continue;
    }

    /* paragraph */
    const isLede = lede && firstPara;
    nodes.push(
      <p key={i}
        className={isLede ? "lede" : ""}
        style={{ color: TEXT_COLOR, fontSize: isLede ? "1.15rem" : "1rem", lineHeight: 1.75, margin: "0 0 0.9em" }}
      >{parseLine(line)}</p>
    );
    firstPara = false;
    i++;
  }

  return <div className="chap-rich" style={{ color: TEXT_COLOR }}>{nodes}</div>;
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

/* ── chapter images ─────────────────────────────────────────────── */
function ChapterImages({ images, layout }: { images: ChapterImage[]; layout?: string }) {
  const real = images.filter(img => img.url);
  if (!real.length) return null;
  let cls: string;
  if (real.length === 1) cls = "cs-img-grid--single";
  else if (layout === "stacked") cls = "cs-img-grid--stacked";
  else if (real.length === 2) cls = "cs-img-grid--double";
  else cls = "cs-img-grid--multi";
  return (
    <div className={`cs-img-grid ${cls}`}>
      {real.map((img, i) => (
        <div key={i} className={`cs-img-wrap ${img.orient === "portrait" ? "portrait" : "landscape"} fade`}>
          {img.label && <span className="cs-img-label">{img.label}</span>}
          <img src={img.url} alt={img.label || `Image ${i + 1}`} />
        </div>
      ))}
    </div>
  );
}

/* ── chapter stats ──────────────────────────────────────────────── */
function ChapterStats({ stats }: { stats: ChapterStat[] }) {
  const real = stats.filter(s => s.value || s.label);
  if (!real.length) return null;
  return (
    <div className="cs-stats-grid">
      {real.map((s, i) => (
        <div key={i} className="cs-stat">
          <div className="cs-stat-v">{s.value}</div>
          <div className="cs-stat-k">{s.label}</div>
          {s.context && <div className="cs-stat-ctx">{s.context}</div>}
        </div>
      ))}
    </div>
  );
}

/* ── DB-driven case study ───────────────────────────────────────── */
function DbCasePage({ project: p }: { project: CsProject }) {
  useScrollReveal(".fade");

  const chapters  = parseChapters(p.chapters);
  // eslint-disable-next-line no-console
  console.log("[case-study] chapters:", chapters.map(c => ({ id: c.id, title: c.title, bodyLen: c.body?.length, bodyPreview: c.body?.slice(0, 80) })));
  const gallery   = parseGallery(p.gallery || "[]");
  const techStack = p.tech_stack ? p.tech_stack.split(/[,·]/).map(t => t.trim()).filter(Boolean) : [];

  /* nav items */
  const navItems = [
    ...(p.overview ? [{ id: "cs-overview", label: "Overview" }] : []),
    ...chapters.map((ch, i) => ({ id: `cs-ch-${i}`, label: ch.title || `Chapter ${i + 1}` })),
    ...(p.client_quote ? [{ id: "cs-quote", label: "Quote" }] : []),
    ...(gallery.length > 0 ? [{ id: "cs-gallery", label: "Gallery" }] : []),
    { id: "cs-credits", label: "Credits" },
  ].map((item, i) => ({ ...item, num: String(i + 1).padStart(2, "0") }));

  /* active nav scroll spy */
  const [activeId, setActiveId] = useState(navItems[0]?.id || "");
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ids = navItems.map(n => n.id);
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveId(e.target.id); }),
      { rootMargin: "-35% 0px -60% 0px" }
    );
    ids.forEach(id => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p.id]);

  /* chapter nav progress line */
  useEffect(() => {
    const update = () => {
      const total = document.body.scrollHeight - window.innerHeight;
      const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
      if (progressRef.current) progressRef.current.style.width = `${pct}%`;
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  /* hero parallax */
  const heroInnerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onScroll = () => {
      if (heroInnerRef.current)
        heroInnerRef.current.style.transform = `translateY(${window.scrollY * 0.18}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <ProgressBar />

      {/* ── CASE HERO ── */}
      <section className="case-hero">
        <div className="wrap" ref={heroInnerRef}>
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
              {p.overview.length > 240 ? p.overview.slice(0, 240) + "…" : p.overview}
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
      <nav className="chapter-nav">
        <div className="wrap inner">
          {navItems.map(n => (
            <a
              key={n.id}
              href={`#${n.id}`}
              className={activeId === n.id ? "on" : ""}
              onClick={e => {
                e.preventDefault();
                const el = document.getElementById(n.id);
                if (el) window.scrollTo({ top: el.offsetTop - 100, behavior: "smooth" });
              }}
            >
              <span className="n">{n.num}</span>{n.label}
            </a>
          ))}
          <span className="progress-line" ref={progressRef} />
        </div>
      </nav>

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
              <div>
                <RichText text={p.overview} />
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
        const hasStats = ch.stats && ch.stats.filter(s => s.value || s.label).length > 0;
        const video = ch.video ? getVideoEmbed(ch.video) : null;

        return (
          <section className="chap" id={`cs-ch-${i}`} key={ch.id || i}>
            <div className="wrap-tight">
              <div className="chap-head">
                <div className="num fade">{chNum}</div>
                <div>
                  <div className="label fade">{ch.title}</div>
                  <h2 className="fade d1">
                    {ch.title}
                  </h2>
                </div>
              </div>

              {/* Stats grid — above body text if present */}
              {hasStats && <ChapterStats stats={ch.stats!} />}

              {/* Rich body text — no fade so it's always visible */}
              {ch.body && (
                <div style={{ marginTop: hasStats ? 48 : 0 }}>
                  <RichText text={ch.body} lede={!hasStats} />
                </div>
              )}

              {/* Images */}
              {ch.images && ch.images.filter(img => img.url).length > 0 && (
                <ChapterImages images={ch.images} layout={ch.img_layout} />
              )}

              {/* Video */}
              {video && (
                <div className="cs-video-wrap fade d2" style={{ marginTop: 48 }}>
                  {video.type === "iframe"
                    ? <iframe src={video.src} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                    : <video src={video.src} controls playsInline />
                  }
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
                    {p.client_quote_author.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase()}
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
                <h3>{p.name}<br /><span className="it">{p.industry || "Studio"} project.</span></h3>
                {p.client_name && (
                  <p style={{ color: "#bdbdbd", fontSize: 16, lineHeight: 1.6, maxWidth: "42ch", margin: "16px 0 0" }}>
                    Built for {p.client_name}{p.year ? ` in ${p.year}` : ""}.{p.scope ? ` Scope: ${p.scope}.` : ""}
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

      {/* ── NEXT / BACK CTA ── */}
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
                <span className="chip" style={{ background: "var(--ink)", color: "#fff" }}><ArrowIcon /></span>
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
