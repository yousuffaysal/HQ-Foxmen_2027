import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { sql } from "@/lib/db";
import { parseMarkdown } from "@/lib/parseMarkdown";
import { constructMetadata, DEFAULT_OG_IMAGE, BASE_URL } from "@/lib/metadata";
import TocScrollspy from "./TocScrollspy";
import CopyLinkButton from "./CopyLinkButton";
import NewsletterCard from "./NewsletterCard";

export const revalidate = 60; // ISR — serve cached SSR HTML, refresh at most every 60s

type Post = {
  id?: number; slug: string; title: string; category: string;
  author_init: string; author_name: string; read_time: string;
  published_at?: string | null; body: string; cover_image?: string;
  excerpt: string; tags: string;
};

/* ── fallback thumb gradients (no cover image) ── */
const THUMB_BG: Record<string, string> = {
  t1: "radial-gradient(60% 60% at 30% 30%, rgba(184,108,249,.6), transparent 60%), #0a0a0a",
  t2: "linear-gradient(140deg, #b86cf9, #1a0c2c)",
  t3: "radial-gradient(50% 60% at 70% 60%, rgba(184,108,249,.4), transparent 60%), #efece6",
};
const fallbackThumb = (slug: string) => {
  const keys = Object.keys(THUMB_BG);
  let h = 0; for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return THUMB_BG[keys[h % keys.length]];
};

/* ── data (React-cached so generateMetadata + the page share one query) ── */
const getPost = cache(async (slug: string): Promise<Post | null> => {
  try {
    const rows = await sql`SELECT * FROM posts WHERE slug = ${slug} AND status = 'live' LIMIT 1` as Record<string, unknown>[];
    return rows.length ? (rows[0] as unknown as Post) : null;
  } catch { return null; }
});

const getRelated = cache(async (slug: string, category: string): Promise<Post[]> => {
  try {
    const rows = await sql`
      SELECT slug, title, category, excerpt, read_time, author_name, cover_image
      FROM posts WHERE status = 'live' AND category = ${category} AND slug <> ${slug}
      ORDER BY published_at DESC NULLS LAST LIMIT 3
    ` as Record<string, unknown>[];
    return rows as unknown as Post[];
  } catch { return []; }
});

function extractTOC(body: string): Array<{ text: string; id: string; level: number }> {
  const items: Array<{ text: string; id: string; level: number }> = [];
  for (const line of body.split("\n")) {
    const m = line.match(/^(#{1,3})\s+(.+)/);
    if (m) {
      const text = m[2].replace(/[*_`]/g, "").trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      items.push({ text, id, level: m[1].length });
    }
  }
  return items;
}

/* ── per-post metadata (server-rendered, crawlable) ── */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) {
    return constructMetadata({ title: "Article", url: `/journal/${slug}`, type: "article", noIndex: true });
  }
  return constructMetadata({
    title: post.title,
    description: post.excerpt || "An article from the Foxmen Studio journal.",
    url: `/journal/${slug}`,
    image: post.cover_image || DEFAULT_OG_IMAGE,
    keywords: post.tags ? post.tags.split(",").map(t => t.trim()).filter(Boolean) : [post.category, "Foxmen Studio"],
    type: "article",
    publishedTime: post.published_at ? new Date(post.published_at).toISOString() : undefined,
    authors: [{ name: post.author_name || "Foxmen Studio", url: BASE_URL }],
  });
}

function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h18M13 5l7 7-7 7" />
    </svg>
  );
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const related = await getRelated(slug, post.category);
  const bodyHtml = post.body ? parseMarkdown(post.body) : "";
  const toc = extractTOC(post.body ?? "");
  const dateStr = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "";
  const pageUrl = `${BASE_URL}/journal/${slug}`;
  const aiQuery = encodeURIComponent(`Summarize this article: ${pageUrl}`);
  const AI_TOOLS = [
    { name: "ChatGPT",    badge: "G", href: `https://chatgpt.com/?q=${aiQuery}` },
    { name: "Claude",     badge: "C", href: `https://claude.ai/new?q=${aiQuery}` },
    { name: "Perplexity", badge: "P", href: `https://www.perplexity.ai/search?q=${aiQuery}` },
    { name: "Grok",       badge: "✕", href: `https://grok.com/?q=${aiQuery}` },
    { name: "Gemini",     badge: "◆", href: `https://gemini.google.com/app` },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || "",
    author: { "@type": "Person", name: post.author_name || "Foxmen Studio" },
    publisher: { "@type": "Organization", name: "Foxmen Studio", url: BASE_URL, logo: { "@type": "ImageObject", url: DEFAULT_OG_IMAGE } },
    datePublished: post.published_at ? new Date(post.published_at).toISOString() : undefined,
    image: post.cover_image || DEFAULT_OG_IMAGE,
    url: pageUrl,
    keywords: post.tags || post.category,
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <style>{`
        .post-prose { font-family:var(--f-sans); font-size:19px; line-height:1.62; color:#2b2b2b; }
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

        .bd-grid { display:grid; grid-template-columns:262px minmax(0,1fr) 320px; gap:56px; align-items:start; }
        .bd-rail { position:sticky; top:100px; display:flex; flex-direction:column; gap:30px; }
        .bd-railh { font-family:var(--f-display); font-size:28px; font-weight:400; letter-spacing:-.01em; color:var(--ink); margin:0 0 14px; }

        .bd-author { display:flex; align-items:center; gap:11px; padding-bottom:22px; border-bottom:1px solid var(--line); }
        .bd-author .av { width:42px; height:42px; border-radius:50%; background:var(--ink); color:#fff; display:flex; align-items:center; justify-content:center; font-family:var(--f-mono); font-size:12px; letter-spacing:.05em; flex-shrink:0; }
        .bd-author .nm { font-family:var(--f-sans); font-size:18px; font-weight:600; color:var(--ink); }
        .bd-author .rl { font-family:var(--f-mono); font-size:10.5px; letter-spacing:.1em; text-transform:uppercase; color:var(--muted); margin-top:2px; }

        .bd-tocbox { background:#fff; border:1px solid var(--line); border-radius:16px; padding:20px 22px; }
        .bd-tocbox .bd-railh { margin-bottom:8px; }
        .bd-toc a { display:block; padding:11px 0; border-bottom:1px solid var(--line); font-family:var(--f-sans); font-size:15px; line-height:1.4; color:var(--ink); font-weight:600; text-decoration:none; transition:color .2s; }
        .bd-toc a:last-child { border-bottom:none; padding-bottom:0; }
        .bd-toc a:first-of-type { padding-top:4px; }
        .bd-toc a:hover { color:var(--brand); }
        .bd-toc a.active { color:var(--brand); }
        .bd-toc a.l3 { padding-left:16px; font-size:14px; }

        .bd-share-row { display:flex; align-items:center; gap:9px; flex-wrap:wrap; }
        .bd-share-btn { width:36px; height:36px; border-radius:50%; border:1px solid var(--line); background:transparent; display:flex; align-items:center; justify-content:center; color:var(--ink); cursor:pointer; transition:background .2s, border-color .2s, color .2s; text-decoration:none; }
        .bd-share-btn:hover { background:var(--brand); border-color:var(--brand); color:#fff; }

        .bd-ai-btn { display:flex; align-items:center; gap:10px; width:100%; padding:9px 12px; border:1px solid var(--line); border-radius:11px; background:transparent; font-family:var(--f-sans); font-size:14px; font-weight:500; color:var(--ink); text-decoration:none; transition:border-color .2s, background .2s; margin-bottom:8px; }
        .bd-ai-btn:hover { border-color:var(--brand); background:rgba(184,108,249,.06); }
        .bd-ai-badge { width:25px; height:25px; border-radius:7px; background:var(--ink); color:#fff; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; font-family:var(--f-sans); flex-shrink:0; }

        .bd-eyebrow { font-family:var(--f-mono); font-size:11px; letter-spacing:.18em; text-transform:uppercase; color:var(--brand); margin-bottom:16px; }
        .bd-title { font-family:var(--f-display); font-size:clamp(38px,4.4vw,58px); line-height:1.06; letter-spacing:-.02em; color:var(--ink); font-weight:400; margin:0 0 22px; }
        .bd-updated { display:flex; align-items:center; gap:8px; padding:16px 0 0; border-top:1px solid var(--line); font-family:var(--f-sans); font-size:13px; color:var(--muted); margin-bottom:26px; }
        .bd-updated strong { color:var(--ink); font-weight:600; }
        .bd-cover { position:relative; width:100%; height:clamp(300px,38vw,520px); border-radius:18px; overflow:hidden; margin-bottom:40px; }
        .bd-cover img { width:100%; height:100%; object-fit:cover; display:block; }

        .bd-news { background:var(--brand); border-radius:20px; padding:26px 24px; }
        .bd-news h3 { font-family:var(--f-display); font-size:32px; font-weight:400; line-height:1.12; color:#fff; margin:0 0 18px; letter-spacing:-.01em; }
        .bd-news input { width:100%; padding:13px 15px; border-radius:11px; border:none; background:#fff; font-family:var(--f-sans); font-size:14px; color:var(--ink); outline:none; margin-bottom:10px; box-sizing:border-box; }
        .bd-news button { width:100%; padding:13px; border-radius:11px; border:none; background:var(--ink); color:#fff; font-family:var(--f-sans); font-size:14px; font-weight:600; cursor:pointer; transition:opacity .2s; }
        .bd-news button:hover { opacity:.88; }
        .bd-news .fine { font-family:var(--f-sans); font-size:11px; line-height:1.55; color:rgba(255,255,255,.82); margin:12px 0 0; }

        .bd-cta { background:var(--ink); border-radius:20px; padding:28px 24px; color:#fff; position:relative; overflow:hidden; }
        .bd-cta h3 { font-family:var(--f-display); font-size:32px; font-weight:400; line-height:1.12; margin:0 0 8px; letter-spacing:-.01em; }
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
            {post.author_name && (
              <div className="bd-author">
                <div className="av">{post.author_init}</div>
                <div>
                  <div className="nm">{post.author_name}</div>
                  {post.category && <div className="rl">{post.category}</div>}
                </div>
              </div>
            )}

            {toc.length > 0 && (
              <div className="bd-rail-hide-mobile bd-tocbox">
                <div className="bd-railh">Table of Contents</div>
                <TocScrollspy toc={toc} />
              </div>
            )}

            <div>
              <div className="bd-railh">Share</div>
              <div className="bd-share-row">
                <a className="bd-share-btn" href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(pageUrl)}`} target="_blank" rel="noopener noreferrer" title="Share on X" aria-label="Share on X">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2H21.5l-7.5 8.57L23 22h-6.844l-5.36-7.005L4.7 22H1.44l8.04-9.183L1 2h7.014l4.844 6.405L18.244 2Zm-1.2 18h1.84L7.04 4H5.07l11.974 16Z"/></svg>
                </a>
                <a className="bd-share-btn" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`} target="_blank" rel="noopener noreferrer" title="Share on LinkedIn" aria-label="Share on LinkedIn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21H18.6v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.07 1.4-2.07 2.85V21H10z"/></svg>
                </a>
                <a className="bd-share-btn" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`} target="_blank" rel="noopener noreferrer" title="Share on Facebook" aria-label="Share on Facebook">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z"/></svg>
                </a>
                <CopyLinkButton url={pageUrl} />
              </div>
            </div>

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

            <div className="bd-cover">
              {post.cover_image
                ? <img src={post.cover_image} alt={post.title} />
                : <div style={{ width: "100%", height: "100%", background: fallbackThumb(slug) }} />}
            </div>

            <article className="post-prose" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
          </main>

          {/* ── RIGHT RAIL ── */}
          <aside className="bd-rail bd-right">
            <NewsletterCard />
            <div className="bd-cta">
              <h3>Got a project <em>in mind?</em></h3>
              <p>Tell us what you&apos;re building — we&apos;ll help you ship it end to end.</p>
              <Link href="/contact" className="btn-talk">Let&apos;s talk <ArrowIcon /></Link>
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
              <Link href="/journal" style={{ fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--muted)", textDecoration: "none" }}>All articles →</Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20 }}>
              {related.map((r) => (
                <Link key={r.slug} href={`/journal/${r.slug}`} style={{ textDecoration: "none", display: "block", border: "1px solid var(--line)", borderRadius: 20, overflow: "hidden", background: "var(--paper)" }}>
                  <div style={{ position: "relative", height: 140, background: r.cover_image ? undefined : fallbackThumb(r.slug) }}>
                    {r.cover_image && <img src={r.cover_image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
                  </div>
                  <div style={{ padding: "18px 20px 20px", display: "flex", flexDirection: "column", gap: 5 }}>
                    <span style={{ fontFamily: "var(--f-mono)", fontSize: 9, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--brand)" }}>{r.category}</span>
                    <h4 style={{ fontFamily: "var(--f-display)", fontSize: 17, lineHeight: 1.25, letterSpacing: "-.015em", color: "var(--ink)", margin: 0, fontWeight: 400 }}>{r.title}</h4>
                    {r.excerpt && <p style={{ fontFamily: "var(--f-sans)", fontSize: "var(--fs-caption)", lineHeight: 1.4, color: "var(--muted)", margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{r.excerpt}</p>}
                    <span style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--muted)", marginTop: 2 }}>{r.read_time}{r.author_name ? ` · ${r.author_name}` : ""}</span>
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
