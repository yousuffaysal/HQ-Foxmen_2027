"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { parseMarkdown } from "@/lib/parseMarkdown";
import NewsletterForm from "@/components/NewsletterForm";

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

/* ── arrow icon ── */
function ArrowIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h18M13 5l7 7-7 7" />
    </svg>
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

  useEffect(() => {
    fetch(`/api/blog/slug/${slug}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => { setPost(data); setLoading(false); })
      .catch(() => { setMissing(true); setLoading(false); });
  }, [slug]);

  // related posts — other live articles in the same category
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
  const tagList = post.tags ? post.tags.split(",").map(t => t.trim()).filter(Boolean) : [];
  const dateStr = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "";

  const toc = extractTOC(post.body ?? "");

  return (
    <>
      <style>{`
        .post-prose { font-family:var(--f-sans); font-size:var(--fs-body); line-height:1.55; color:var(--ink); }
        .post-prose h2 { font-family:var(--f-display); font-size:clamp(24px,3vw,34px); line-height:1.15; letter-spacing:-.022em; margin:44px 0 14px; color:var(--ink); scroll-margin-top:100px; }
        .post-prose h3 { font-family:var(--f-display); font-size:clamp(18px,2.2vw,24px); line-height:1.25; letter-spacing:-.018em; margin:32px 0 10px; color:var(--ink); scroll-margin-top:100px; }
        .post-prose p { margin:0 0 18px; }
        .post-prose strong { font-weight:600; }
        .post-prose em { font-style:italic; color:var(--brand); }
        .post-prose del { text-decoration:line-through; color:var(--muted); }
        .post-prose a { color:var(--brand); text-decoration:underline; text-underline-offset:3px; }
        .post-prose blockquote { margin:32px 0; padding:20px 28px; border-left:3px solid var(--brand); background:rgba(184,108,249,.06); border-radius:0 12px 12px 0; font-style:italic; }
        .post-prose blockquote p { margin:0; }
        .post-prose ul,.post-prose ol { margin:0 0 24px; padding-left:26px; }
        .post-prose li { margin-bottom:8px; }
        .post-prose hr { border:none; border-top:1px solid var(--line); margin:48px 0; }
        .post-prose img { max-width:100%; border-radius:18px; display:block; margin:32px auto; }
        .post-prose .ic { font-family:var(--f-mono); font-size:.86em; padding:2px 7px; background:var(--bone); border:1px solid var(--line); border-radius:6px; color:var(--ink); }
        .post-prose .cb { position:relative; margin:28px 0; padding:24px 28px; background:var(--ink); border-radius:14px; overflow-x:auto; }
        .post-prose .cb code { font-family:var(--f-mono); font-size:13px; line-height:1.72; color:rgba(255,255,255,.82); white-space:pre; display:block; }
        .post-prose .cb::before { content:attr(data-lang); position:absolute; top:10px; right:14px; font-family:var(--f-mono); font-size:9px; letter-spacing:.16em; text-transform:uppercase; color:rgba(255,255,255,.22); }
        .post-prose .cm{color:rgba(255,255,255,.32);} .post-prose .cs{color:#b9f0a0;} .post-prose .ck{color:#c792ea;} .post-prose .cn{color:#f78c6c;} .post-prose .ct{color:#89ddff;}
        .toc-link { display:block; padding:9px 0 9px 16px; border-left:2px solid var(--line); font-family:var(--f-sans); font-size:var(--fs-caption); line-height:1.4; color:var(--muted); text-decoration:none; transition:border-color .2s, color .2s; }
        .toc-link:hover,.toc-link.active { border-left-color:var(--ink); color:var(--ink); }
        .toc-link.l3 { padding-left:28px; font-size:12.5px; }
        @media(max-width:900px){
          .post-layout { grid-template-columns:1fr !important; }
          .post-sidebar { display:none !important; }
          .post-prose { font-size:16px; }
          .post-prose .cb { padding:18px; border-radius:10px; }
          .post-prose .cb code { font-size:12px; }
        }
      `}</style>

      {/* ── PAGE HEADER (full width) ── */}
      <div className="wrap" style={{ paddingTop: 140, paddingBottom: 0 }}>
        {/* meta row */}
        <div className="fade in" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          {(dateStr || post.published_at) && (
            <span style={{ fontFamily: "var(--f-sans)", fontSize: "var(--fs-caption)", color: "var(--muted)" }}>
              Last Update: <strong style={{ color: "var(--ink)", fontWeight: 500 }}>{dateStr || post.published_at}</strong>
            </span>
          )}
          {post.category && <span style={{ display: "inline-flex", alignItems: "center", padding: "5px 14px", borderRadius: 999, background: "var(--ink)", color: "#fff", fontFamily: "var(--f-sans)", fontSize: 12, fontWeight: 500 }}>{post.category}</span>}
          {post.read_time && <span style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: "var(--muted)", letterSpacing: ".06em" }}>{post.read_time} read</span>}
        </div>
        {/* big title — H2 role */}
        <h1 className="fade in" style={{ fontFamily: "var(--f-display)", fontSize: "clamp(36px,5.5vw,68px)", lineHeight: 1.0, letterSpacing: "-.01em", color: "var(--ink)", fontWeight: 400, maxWidth: 920, marginBottom: 56 }}>{post.title}</h1>
      </div>

      {/* ── TWO-COLUMN LAYOUT ── */}
      <div className="wrap post-layout" style={{ display: "grid", gridTemplateColumns: "268px 1fr", gap: "0 60px", alignItems: "start", paddingBottom: 80 }}>

        {/* ── SIDEBAR ── */}
        <aside className="post-sidebar" style={{ position: "sticky", top: 96 }}>
          {/* author card */}
          {post.author_name && (
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32, paddingBottom: 24, borderBottom: "1px solid var(--line)" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--ink)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: ".07em", flexShrink: 0 }}>{post.author_init}</div>
              <div>
                <div style={{ fontFamily: "var(--f-sans)", fontSize: "var(--fs-caption)", fontWeight: 500, color: "var(--ink)" }}>{post.author_name}</div>
                {tagList.length > 0 && <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: "var(--muted)", marginTop: 2, letterSpacing: ".08em" }}>{tagList[0]}</div>}
              </div>
            </div>
          )}

          {/* table of contents */}
          {toc.length > 0 && (
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontFamily: "var(--f-sans)", fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase" as const, color: "var(--muted)", marginBottom: 14 }}>Table of Contents</div>
              <nav>
                {toc.map((item, i) => (
                  <a key={i} href={`#${item.id}`} className={`toc-link${item.level === 3 ? " l3" : ""}`}>{item.text}</a>
                ))}
              </nav>
            </div>
          )}

          {/* newsletter CTA card */}
          <div style={{ background: "var(--ink)", borderRadius: 18, padding: "28px 24px", color: "#fff" }}>
            <div style={{ fontFamily: "var(--f-display)", fontSize: 20, lineHeight: 1.25, letterSpacing: "-.02em", marginBottom: 16 }}>Fresh insights,<br /><span style={{ color: "var(--brand)" }}>straight to you.</span></div>
            <NewsletterForm dark />
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <div style={{ minWidth: 0 }}>
          {/* cover image / thumb */}
          <div style={{ position: "relative", width: "100%", height: "clamp(340px,48vw,600px)", borderRadius: 20, overflow: "hidden", marginBottom: 48 }}>
            {post.cover_image
              ? <img src={post.cover_image} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              : <div style={{ width: "100%", height: "100%", background: bg }} />
            }
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,10,10,.5) 0%, transparent 50%)", pointerEvents: "none" }} />
            {post.sym && (
              <span style={{ position: "absolute", bottom: -10, right: 20, fontFamily: "var(--f-display)", fontSize: "clamp(80px,14vw,160px)", lineHeight: 1, color: LIGHT_THUMBS.has(post.thumb ?? "") ? "rgba(10,10,10,.07)" : "rgba(255,255,255,.1)", pointerEvents: "none", userSelect: "none" as const }}>{post.sym}</span>
            )}
          </div>

          {/* prose body */}
          <article className="post-prose" dangerouslySetInnerHTML={{ __html: bodyHtml }} />

          {/* share row */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "28px 0", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", marginTop: 8, marginBottom: 0, flexWrap: "wrap" as const }}>
            <span style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase" as const, color: "var(--muted)", marginRight: 4 }}>Share</span>
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://foxmen.studio/journal/${slug}`)}`} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 999, border: "1px solid var(--line)", background: "transparent", cursor: "pointer", fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase" as const, color: "var(--ink)", textDecoration: "none" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2H21.5l-7.5 8.57L23 22h-6.844l-5.36-7.005L4.7 22H1.44l8.04-9.183L1 2h7.014l4.844 6.405L18.244 2Zm-1.2 18h1.84L7.04 4H5.07l11.974 16Z"/></svg>
              Post on X
            </a>
            <button onClick={() => navigator.clipboard.writeText(window.location.href)} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 999, border: "1px solid var(--line)", background: "transparent", cursor: "pointer", fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase" as const, color: "var(--ink)" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              Copy link
            </button>
          </div>
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
                    <h4 style={{ fontFamily: "var(--f-display)", fontSize: 16, lineHeight: 1.25, letterSpacing: "-.015em", color: "var(--ink)", margin: 0, fontWeight: 400 }}>{r.title}</h4>
                    {r.excerpt && <p style={{ fontFamily: "var(--f-sans)", fontSize: "var(--fs-caption)", lineHeight: 1.4, color: "var(--muted)", margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>{r.excerpt}</p>}
                    <span style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase" as const, color: "var(--muted)", marginTop: 2 }}>{r.read_time}{r.author_name ? ` · ${r.author_name}` : ""}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section style={{ padding: "60px 0" }}>
        <div className="cta">
          <div className="wrap-tight">
            <div className="fade in"><span className="eyebrow">Work with us</span></div>
            <h2 className="fade in d1">Got a project in mind?<br /><span className="it">Let&apos;s build it.</span></h2>
            <div className="row fade in d2">
              <Link href="/contact" className="btn btn--lg">
                <span className="label">Start a project</span>
                <span className="chip"><ArrowIcon /></span>
              </Link>
              <Link href="/work" className="btn btn--ghost btn--lg">
                <span className="label">See the work</span>
                <span className="chip"><ArrowIcon /></span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
