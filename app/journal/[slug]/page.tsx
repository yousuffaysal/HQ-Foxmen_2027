"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { parseMarkdown } from "@/lib/parseMarkdown";

/* ── types ── */
type Post = {
  id?: number; slug: string; title: string; category: string;
  author_init: string; author_name: string; read_time: string;
  published_at?: string; body: string; cover_image?: string;
  excerpt: string; tags: string; thumb?: string; sym?: string;
  status?: string;
};

/* ── thumb gradients (fallback when a post has no cover image) ── */
const THUMB_BG: Record<string, string> = {
  t1: "radial-gradient(60% 60% at 30% 30%, rgba(184,108,249,.6), transparent 60%), #0a0a0a",
  t2: "linear-gradient(140deg, #b86cf9, #1a0c2c)",
  t3: "radial-gradient(50% 60% at 70% 60%, rgba(184,108,249,.4), transparent 60%), #efece6",
  t4: "linear-gradient(160deg, #0a0a0a 0%, #1a0c2c 100%)",
  t5: "linear-gradient(140deg, #efece6, #b86cf9)",
  t6: "radial-gradient(60% 60% at 80% 80%, rgba(184,108,249,.6), transparent 60%), #0a0a0a",
  t7: "linear-gradient(180deg, #b86cf9, #5a26a8)",
  t8: "repeating-linear-gradient(45deg, #0a0a0a 0 14px, #1a0c2c 14px 28px)",
  t9: "radial-gradient(50% 60% at 30% 70%, rgba(184,108,249,.5), transparent 60%), #efece6",
  featured: "radial-gradient(60% 60% at 25% 30%, rgba(184,108,249,.55), transparent 60%), radial-gradient(50% 60% at 80% 80%, rgba(184,108,249,.25), transparent 60%), #0a0a0a",
};
const LIGHT_THUMBS = new Set(["t3", "t5", "t9"]);
const fallbackThumb = (p: Post) => THUMB_BG[p.thumb ?? "t1"] ?? THUMB_BG.t1;

/* ── table of contents ── */
function extractTOC(body: string): Array<{ text: string; id: string; level: number }> {
  const items: Array<{ text: string; id: string; level: number }> = [];
  for (const line of body.split("\n")) {
    const m = line.match(/^(#{2,3})\s+(.+)/);
    if (m) {
      const text = m[2].replace(/[*_`]/g, "").trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      items.push({ text, id, level: m[1].length });
    }
  }
  return items;
}

function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h18M13 5l7 7-7 7" />
    </svg>
  );
}

/* ── newsletter card (right rail) ── */
function NewsletterCard() {
  const [sent, setSent] = useState(false);
  return (
    <div className="bd-news">
      <h3>Design insight,<br /><em style={{ fontStyle: "italic" }}>straight to your inbox.</em></h3>
      <form onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
        <input type="email" required placeholder="you@company.com" aria-label="Email" />
        <button type="submit">{sent ? "Subscribed ✓" : "Subscribe"}</button>
      </form>
      <p className="fine">By subscribing you agree to receive occasional emails from Foxmen Studio. No spam — unsubscribe anytime.</p>
    </div>
  );
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug as string;
  useScrollReveal(".fade, .reveal");

  const [post, setPost] = useState<Post | null>(null);
  const [related, setRelated] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);
  const [activeId, setActiveId] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/blog/slug/${slug}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => { setPost(data); setLoading(false); })
      .catch(() => { setMissing(true); setLoading(false); });
  }, [slug]);

  useEffect(() => {
    if (!post) return;
    fetch("/api/blog")
      .then(r => (r.ok ? r.json() : []))
      .then((rows: Post[]) => {
        const list = Array.isArray(rows) ? rows.filter(p => p.status === "live") : [];
        setRelated(list.filter(p => p.slug !== post.slug && p.category === post.category).slice(0, 3));
      })
      .catch(() => setRelated([]));
  }, [post]);

  // scrollspy — highlight the current section in the TOC
  useEffect(() => {
    if (!post) return;
    const headings = Array.from(document.querySelectorAll<HTMLElement>(".post-prose h2, .post-prose h3"));
    if (!headings.length) return;
    const obs = new IntersectionObserver((entries) => {
      const vis = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (vis[0]?.target.id) setActiveId(vis[0].target.id);
    }, { rootMargin: "-96px 0px -68% 0px" });
    headings.forEach(h => obs.observe(h));
    return () => obs.disconnect();
  }, [post]);

  if (loading) return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="post-loader" />
    </div>
  );

  if (missing) return (
    <div style={{ minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
      <p style={{ fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--muted)" }}>404</p>
      <h1 style={{ fontFamily: "var(--f-display)", fontSize: "clamp(36px,6vw,72px)", lineHeight: 1.0, letterSpacing: "-.01em" }}>Article not found.</h1>
      <Link href="/journal" className="btn"><span className="label">Back to journal</span><span className="chip"><ArrowIcon /></span></Link>
    </div>
  );

  if (!post) return null;

  const bg = post.cover_image ? undefined : fallbackThumb(post);
  const bodyHtml = post.body ? parseMarkdown(post.body) : "";
  const dateStr = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "";
  const toc = extractTOC(post.body ?? "");
  const pageUrl = `https://foxmen.studio/journal/${slug}`;
  const aiQuery = encodeURIComponent(`Summarize this article: ${pageUrl}`);
  const AI_TOOLS = [
    { name: "ChatGPT",    badge: "G", href: `https://chatgpt.com/?q=${aiQuery}` },
    { name: "Claude",     badge: "C", href: `https://claude.ai/new?q=${aiQuery}` },
    { name: "Perplexity", badge: "P", href: `https://www.perplexity.ai/search?q=${aiQuery}` },
    { name: "Grok",       badge: "✕", href: `https://grok.com/?q=${aiQuery}` },
    { name: "Gemini",     badge: "◆", href: `https://gemini.google.com/app` },
  ];

  return (
    <>
      <style>{`
        .post-prose { font-family:var(--f-sans); font-size:19px; line-height:1.62; color:#2b2b2b; }
        /* in-article headings — serif, scaled in proportion to body */
        .post-prose h1 { font-family:var(--f-display); font-size:clamp(36px,4vw,52px); font-weight:400; line-height:1.1; letter-spacing:-.02em; margin:48px 0 18px; color:var(--ink); scroll-margin-top:110px; }
        .post-prose h2 { font-family:var(--f-display); font-size:clamp(30px,3.2vw,42px); font-weight:400; line-height:1.14; letter-spacing:-.018em; margin:44px 0 16px; color:var(--ink); scroll-margin-top:110px; }
        .post-prose h3 { font-family:var(--f-display); font-size:clamp(23px,2.4vw,30px); font-weight:400; line-height:1.25; letter-spacing:-.012em; margin:32px 0 10px; color:var(--ink); scroll-margin-top:110px; }
        .post-prose > :first-child { margin-top:0; }
        .post-prose p { margin:0 0 20px; }
        .post-prose strong { font-weight:600; }
        .post-prose em { font-style:italic; color:var(--brand); }
        .post-prose del { text-decoration:line-through; color:var(--muted); }
        .post-prose a { color:var(--brand); text-decoration:underline; text-underline-offset:3px; }
        .post-prose blockquote { margin:28px 0; padding:18px 26px; border-left:3px solid var(--brand); background:rgba(184,108,249,.06); border-radius:0 12px 12px 0; font-style:italic; }
        .post-prose blockquote p { margin:0; }
        .post-prose ul,.post-prose ol { margin:0 0 18px; padding-left:24px; }
        .post-prose li { margin-bottom:6px; }
        .post-prose hr { border:none; border-top:1px solid var(--line); margin:40px 0; }
        .post-prose img { max-width:100%; border-radius:14px; display:block; margin:28px auto; }
        .post-prose .ic { font-family:var(--f-mono); font-size:.86em; padding:2px 7px; background:var(--bone); border:1px solid var(--line); border-radius:6px; color:var(--ink); }
        .post-prose .cb { position:relative; margin:24px 0; padding:22px 26px; background:var(--ink); border-radius:14px; overflow-x:auto; }
        .post-prose .cb code { font-family:var(--f-mono); font-size:13px; line-height:1.7; color:rgba(255,255,255,.82); white-space:pre; display:block; }
        .post-prose .cb::before { content:attr(data-lang); position:absolute; top:10px; right:14px; font-family:var(--f-mono); font-size:9px; letter-spacing:.16em; text-transform:uppercase; color:rgba(255,255,255,.22); }
        .post-prose .cm{color:rgba(255,255,255,.32);} .post-prose .cs{color:#b9f0a0;} .post-prose .ck{color:#c792ea;} .post-prose .cn{color:#f78c6c;} .post-prose .ct{color:#89ddff;}

        /* ── 3-column layout ── */
        .bd-grid { display:grid; grid-template-columns:262px minmax(0,1fr) 320px; gap:56px; align-items:start; }
        .bd-rail { position:sticky; top:100px; display:flex; flex-direction:column; gap:30px; }
        .bd-railh { font-family:var(--f-display); font-size:25px; font-weight:400; letter-spacing:-.01em; color:var(--ink); margin:0 0 12px; }

        /* author */
        .bd-author { display:flex; align-items:center; gap:11px; padding-bottom:22px; border-bottom:1px solid var(--line); }
        .bd-author .av { width:42px; height:42px; border-radius:50%; background:var(--ink); color:#fff; display:flex; align-items:center; justify-content:center; font-family:var(--f-mono); font-size:12px; letter-spacing:.05em; flex-shrink:0; }
        .bd-author .nm { font-family:var(--f-sans); font-size:17px; font-weight:600; color:var(--ink); }
        .bd-author .rl { font-family:var(--f-mono); font-size:10.5px; letter-spacing:.1em; text-transform:uppercase; color:var(--muted); margin-top:2px; }

        /* toc */
        .bd-tocbox { background:#fff; border:1px solid var(--line); border-radius:16px; padding:20px 22px; }
        .bd-tocbox .bd-railh { margin-bottom:8px; }
        .bd-toc a { display:block; padding:11px 0; border-bottom:1px solid var(--line); font-family:var(--f-sans); font-size:15px; line-height:1.4; color:var(--ink); font-weight:600; text-decoration:none; transition:color .2s; }
        .bd-toc a:last-child { border-bottom:none; padding-bottom:0; }
        .bd-toc a:first-of-type { padding-top:4px; }
        .bd-toc a:hover { color:var(--brand); }
        .bd-toc a.active { color:var(--brand); }
        .bd-toc a.l3 { padding-left:16px; font-size:14px; }

        /* share */
        .bd-share-row { display:flex; align-items:center; gap:9px; flex-wrap:wrap; }
        .bd-share-btn { width:36px; height:36px; border-radius:50%; border:1px solid var(--line); background:transparent; display:flex; align-items:center; justify-content:center; color:var(--ink); cursor:pointer; transition:background .2s, border-color .2s, color .2s; text-decoration:none; }
        .bd-share-btn:hover { background:var(--brand); border-color:var(--brand); color:#fff; }

        /* ai summary */
        .bd-ai-btn { display:flex; align-items:center; gap:10px; width:100%; padding:9px 12px; border:1px solid var(--line); border-radius:11px; background:transparent; font-family:var(--f-sans); font-size:14px; font-weight:500; color:var(--ink); text-decoration:none; cursor:pointer; transition:border-color .2s, background .2s; margin-bottom:8px; }
        .bd-ai-btn:hover { border-color:var(--brand); background:rgba(184,108,249,.06); }
        .bd-ai-badge { width:25px; height:25px; border-radius:7px; background:var(--ink); color:#fff; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; font-family:var(--f-sans); flex-shrink:0; }

        /* center */
        .bd-eyebrow { font-family:var(--f-mono); font-size:11px; letter-spacing:.18em; text-transform:uppercase; color:var(--brand); margin-bottom:16px; }
        .bd-title { font-family:var(--f-display); font-size:clamp(38px,4.4vw,58px); line-height:1.06; letter-spacing:-.02em; color:var(--ink); font-weight:400; margin:0 0 22px; }
        .bd-updated { display:flex; align-items:center; gap:8px; padding:16px 0 0; border-top:1px solid var(--line); font-family:var(--f-sans); font-size:13px; color:var(--muted); margin-bottom:26px; }
        .bd-updated strong { color:var(--ink); font-weight:600; }
        .bd-cover { position:relative; width:100%; height:clamp(300px,38vw,520px); border-radius:18px; overflow:hidden; margin-bottom:40px; }
        .bd-cover img { width:100%; height:100%; object-fit:cover; display:block; }

        /* newsletter card */
        .bd-news { background:var(--brand); border-radius:20px; padding:26px 24px; }
        .bd-news h3 { font-family:var(--f-display); font-size:29px; font-weight:400; line-height:1.15; color:#fff; margin:0 0 18px; letter-spacing:-.01em; }
        .bd-news input { width:100%; padding:13px 15px; border-radius:11px; border:none; background:#fff; font-family:var(--f-sans); font-size:14px; color:var(--ink); outline:none; margin-bottom:10px; box-sizing:border-box; }
        .bd-news button { width:100%; padding:13px; border-radius:11px; border:none; background:var(--ink); color:#fff; font-family:var(--f-sans); font-size:14px; font-weight:600; cursor:pointer; transition:opacity .2s; }
        .bd-news button:hover { opacity:.88; }
        .bd-news .fine { font-family:var(--f-sans); font-size:11px; line-height:1.55; color:rgba(255,255,255,.82); margin:12px 0 0; }

        /* cta card */
        .bd-cta { background:var(--ink); border-radius:20px; padding:28px 24px; color:#fff; position:relative; overflow:hidden; }
        .bd-cta h3 { font-family:var(--f-display); font-size:29px; font-weight:400; line-height:1.15; margin:0 0 6px; letter-spacing:-.01em; }
        .bd-cta h3 em { font-style:italic; color:var(--brand); }
        .bd-cta p { font-family:var(--f-sans); font-size:13.5px; line-height:1.55; color:rgba(255,255,255,.6); margin:0 0 20px; }
        .bd-cta .btn-talk { display:inline-flex; align-items:center; gap:8px; background:var(--brand); color:#fff; padding:12px 22px; border-radius:999px; font-family:var(--f-sans); font-size:14px; font-weight:600; text-decoration:none; transition:opacity .2s; }
        .bd-cta .btn-talk:hover { opacity:.9; }

        @media (max-width:1080px) {
          .bd-grid { grid-template-columns:1fr; gap:40px; }
          .bd-rail { position:static; }
          .bd-main { order:1; }
          .bd-right { order:2; }
          .bd-left { order:3; }
          .bd-rail-hide-mobile { display:none; }
        }
      `}</style>

      <div className="wrap" style={{ paddingTop: 128, paddingBottom: 90 }}>
        <div className="bd-grid">

          {/* ── LEFT RAIL ── */}
          <aside className="bd-rail bd-left">
            {/* Author */}
            {post.author_name && (
              <div className="bd-author">
                <div className="av">{post.author_init}</div>
                <div>
                  <div className="nm">{post.author_name}</div>
                  {post.category && <div className="rl">{post.category}</div>}
                </div>
              </div>
            )}

            {/* Table of contents */}
            {toc.length > 0 && (
              <div className="bd-rail-hide-mobile bd-tocbox">
                <div className="bd-railh">Table of Contents</div>
                <nav className="bd-toc">
                  {toc.map((item) => (
                    <a key={item.id} href={`#${item.id}`} className={`${item.level === 3 ? "l3" : ""}${activeId === item.id ? " active" : ""}`}>{item.text}</a>
                  ))}
                </nav>
              </div>
            )}

            {/* Share */}
            <div>
              <div className="bd-railh">Share</div>
              <div className="bd-share-row">
                <a className="bd-share-btn" href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(pageUrl)}`} target="_blank" rel="noopener noreferrer" title="Share on X">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2H21.5l-7.5 8.57L23 22h-6.844l-5.36-7.005L4.7 22H1.44l8.04-9.183L1 2h7.014l4.844 6.405L18.244 2Zm-1.2 18h1.84L7.04 4H5.07l11.974 16Z"/></svg>
                </a>
                <a className="bd-share-btn" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`} target="_blank" rel="noopener noreferrer" title="Share on LinkedIn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21H18.6v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.07 1.4-2.07 2.85V21H10z"/></svg>
                </a>
                <a className="bd-share-btn" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`} target="_blank" rel="noopener noreferrer" title="Share on Facebook">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z"/></svg>
                </a>
                <button className="bd-share-btn" onClick={() => { navigator.clipboard.writeText(pageUrl); setCopied(true); setTimeout(() => setCopied(false), 1600); }} title={copied ? "Copied!" : "Copy link"}>
                  {copied
                    ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>}
                </button>
              </div>
            </div>

            {/* AI Summary */}
            <div className="bd-rail-hide-mobile">
              <div className="bd-railh">AI Summary</div>
              {AI_TOOLS.map((t) => (
                <a key={t.name} className="bd-ai-btn" href={t.href} target="_blank" rel="noopener noreferrer">
                  <span className="bd-ai-badge">{t.badge}</span>
                  <span style={{ flex: 1 }}>{t.name}</span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M9 7h8v8"/></svg>
                </a>
              ))}
            </div>
          </aside>

          {/* ── CENTER ── */}
          <main className="bd-main" style={{ minWidth: 0 }}>
            {post.category && <div className="bd-eyebrow">{post.category}{post.read_time ? ` · ${post.read_time} read` : ""}</div>}
            <h1 className="bd-title">{post.title}</h1>
            {(dateStr || post.published_at) && (
              <div className="bd-updated">Last update: <strong>{dateStr || post.published_at}</strong></div>
            )}

            {/* cover */}
            <div className="bd-cover">
              {post.cover_image
                ? <img src={post.cover_image} alt={post.title} />
                : <div style={{ width: "100%", height: "100%", background: bg }} />}
              {!post.cover_image && post.sym && (
                <span style={{ position: "absolute", bottom: -10, right: 20, fontFamily: "var(--f-display)", fontSize: "clamp(80px,14vw,160px)", lineHeight: 1, color: LIGHT_THUMBS.has(post.thumb ?? "") ? "rgba(10,10,10,.07)" : "rgba(255,255,255,.1)", pointerEvents: "none", userSelect: "none" as const }}>{post.sym}</span>
              )}
            </div>

            {/* prose */}
            <article className="post-prose" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
          </main>

          {/* ── RIGHT RAIL ── */}
          <aside className="bd-rail bd-right">
            <NewsletterCard />
            <div className="bd-cta">
              <h3>Got a project <em>in mind?</em></h3>
              <p>Tell us what you&apos;re building — we&apos;ll help you ship it end to end.</p>
              <Link href="/contact" className="btn-talk">
                Let&apos;s talk <ArrowIcon />
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* ── RELATED ── */}
      {related.length > 0 && (
        <section style={{ borderTop: "1px solid var(--line)", padding: "60px 0 80px" }}>
          <div className="wrap">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
              <span className="eyebrow">More from {post.category}</span>
              <Link href="/journal" style={{ fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase" as const, color: "var(--muted)", textDecoration: "none" }}>All articles →</Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20 }}>
              {related.map((r) => (
                <Link key={r.slug} href={`/journal/${r.slug}`} style={{ textDecoration: "none", display: "block", border: "1px solid var(--line)", borderRadius: 20, overflow: "hidden", background: "var(--paper)" }}>
                  <div style={{ position: "relative", height: 140, background: r.cover_image ? undefined : fallbackThumb(r) }}>
                    {r.cover_image
                      ? <img src={r.cover_image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                      : r.sym && <span style={{ position: "absolute", bottom: -6, right: 14, fontFamily: "var(--f-display)", fontSize: 80, lineHeight: 1, color: LIGHT_THUMBS.has(r.thumb ?? "") ? "rgba(10,10,10,.08)" : "rgba(255,255,255,.13)", userSelect: "none" as const, pointerEvents: "none" }}>{r.sym}</span>}
                  </div>
                  <div style={{ padding: "18px 20px 20px", display: "flex", flexDirection: "column" as const, gap: 5 }}>
                    <span style={{ fontFamily: "var(--f-mono)", fontSize: 9, letterSpacing: ".16em", textTransform: "uppercase" as const, color: "var(--brand)" }}>{r.category}</span>
                    <h4 style={{ fontFamily: "var(--f-display)", fontSize: 17, lineHeight: 1.25, letterSpacing: "-.015em", color: "var(--ink)", margin: 0, fontWeight: 400 }}>{r.title}</h4>
                    {r.excerpt && <p style={{ fontFamily: "var(--f-sans)", fontSize: "var(--fs-caption)", lineHeight: 1.4, color: "var(--muted)", margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>{r.excerpt}</p>}
                    <span style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase" as const, color: "var(--muted)", marginTop: 2 }}>{r.read_time}{r.author_name ? ` · ${r.author_name}` : ""}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
