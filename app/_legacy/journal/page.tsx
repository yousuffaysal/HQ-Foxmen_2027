"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import NewsletterForm from "@/components/NewsletterForm";

type Post = {
  id: number; slug: string; title: string; category: string;
  author_init: string; author_name: string; read_time: string;
  published_at: string | null; excerpt: string; cover_image?: string;
  tags?: string; status: string;
};

/* fallback thumb gradients (used when a post has no cover image) */
const FALLBACK_THUMBS = ["t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8", "t9"];
const fmtDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "2-digit" }) : "";

export default function JournalPage() {
  useScrollReveal();
  const [posts, setPosts]       = useState<Post[]>([]);
  const [loading, setLoading]   = useState(true);
  const [activeCat, setActiveCat] = useState("All");
  const [query, setQuery]       = useState("");

  useEffect(() => {
    fetch("/api/blog")
      .then((r) => (r.ok ? r.json() : []))
      .then((rows: Post[]) =>
        setPosts(Array.isArray(rows) ? rows.filter((p) => p.status === "live") : [])
      )
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  const cats = useMemo(
    () => ["All", ...Array.from(new Set(posts.map((p) => p.category).filter(Boolean)))],
    [posts]
  );

  const featured = posts[0]; // latest live post

  const filtered = useMemo(() => {
    let list = activeCat === "All" ? posts : posts.filter((p) => p.category === activeCat);
    const q = query.trim().toLowerCase();
    if (q) list = list.filter((p) => p.title.toLowerCase().includes(q) || (p.excerpt ?? "").toLowerCase().includes(q));
    return list.filter((p) => p.slug !== featured?.slug);
  }, [posts, activeCat, query, featured]);

  return (
    <>
      <section className="page-hero">
        <div className={`wrap${posts.length > 0 ? " page-hero-split" : ""}`}>
          <div>
            <div className="crumbs fade in">
              <Link href="/">Home</Link><span className="sep">/</span><span>Journal</span>
            </div>
            <h1 className="display">
              <span className="reveal in"><span className="reveal-inner">Notes</span></span>
              <span className="reveal in reveal-delay-1"><span className="reveal-inner">from the</span></span>
              <span className="reveal in reveal-delay-2"><span className="reveal-inner it">studio.</span></span>
            </h1>
            <p className="lede fade in d2">
              Essays, deep-dives and case notes from the team — what we&apos;re learning about design systems, AI products, and the craft of shipping.
            </p>
          </div>
          {posts.length > 0 && (
            <div className="page-hero-right" aria-hidden="true">
              <div className="ph-feed">
                {posts.slice(0, 5).map((a, i) => (
                  <div key={a.id} className="ph-feed-row" style={{ "--di": i } as React.CSSProperties}>
                    <span className="fi-tag">{a.category}</span>
                    <div className="fi-meta"><span>{a.author_name}</span><span>{fmtDate(a.published_at)}</span></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {loading ? (
        <div style={{ minHeight: "40vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="post-loader" />
        </div>
      ) : posts.length === 0 ? (
        /* EMPTY STATE */
        <section className="section">
          <div className="wrap" style={{ textAlign: "center", padding: "40px 0 80px" }}>
            <h2 style={{ fontFamily: "var(--f-display)", fontSize: "var(--fs-h3)", lineHeight: 1.1, letterSpacing: "-.01em", color: "var(--ink)", marginBottom: 16 }}>
              No essays yet.
            </h2>
            <p style={{ fontFamily: "var(--f-sans)", fontSize: "var(--fs-body)", lineHeight: 1.65, color: "var(--muted)", maxWidth: "46ch", margin: "0 auto" }}>
              We&apos;re writing the first pieces now. Subscribe below and we&apos;ll send them the moment they&apos;re live.
            </p>
          </div>
        </section>
      ) : (
        <>
          {/* FEATURED — latest live post */}
          {featured && (
            <section className="blog-feat-section">
              <div className="wrap">
                <div className="blog-featured">
                  <Link href={`/journal/${featured.slug}`} className="img fade" style={{ display: "block" }}>
                    {featured.cover_image && (
                      <img
                        src={featured.cover_image}
                        alt={featured.title}
                        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 1 }}
                      />
                    )}
                    <div className="badge-row">
                      <span className="pill">Featured{featured.category ? ` · ${featured.category}` : ""}</span>
                      {featured.read_time && <span>{featured.read_time} read</span>}
                    </div>
                  </Link>
                  <div className="body">
                    <div>
                      <div className="fade">
                        <span className="eyebrow">
                          {fmtDate(featured.published_at)}{featured.author_name ? ` · ${featured.author_name}` : ""}
                        </span>
                      </div>
                      <h2 className="fade d1" style={{ marginTop: 18 }}>{featured.title}</h2>
                      {featured.excerpt && <p className="excerpt fade d2">{featured.excerpt}</p>}
                    </div>
                    {featured.author_name && (
                      <div className="author-row fade d3">
                        <div className="av">{featured.author_init}</div>
                        <div>
                          <div style={{ color: "var(--ink)", fontFamily: "var(--f-sans)", textTransform: "none", letterSpacing: 0, fontSize: "var(--fs-caption)" }}>{featured.author_name}</div>
                          {featured.category && <div style={{ marginTop: 4 }}>{featured.category} · Foxmen Studio</div>}
                        </div>
                      </div>
                    )}
                    <div className="actions fade d4">
                      <Link href={`/journal/${featured.slug}`} className="btn btn--lg">
                        <span className="label">Read the essay</span>
                        <span className="chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18M13 5l7 7-7 7" /></svg></span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* GRID */}
          <section className="section blog-articles-section">
            <div className="wrap">
              <div className="blog-toolbar fade in">
                <div className="cats">
                  {cats.map((c) => (
                    <button key={c} className={activeCat === c ? "on" : ""} onClick={() => setActiveCat(c)}>{c}</button>
                  ))}
                </div>
                <label className="search">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" /></svg>
                  <input type="search" placeholder="Search the journal" value={query} onChange={(e) => setQuery(e.target.value)} />
                </label>
              </div>

              {filtered.length === 0 ? (
                <p style={{ fontFamily: "var(--f-sans)", fontSize: "var(--fs-body)", lineHeight: 1.65, color: "var(--muted)", padding: "24px 0" }}>
                  No articles{activeCat !== "All" ? ` in ${activeCat}` : ""}{query.trim() ? ` matching “${query.trim()}”` : ""} yet.
                </p>
              ) : (
                <div className="blog-grid">
                  {filtered.map((a, i) => {
                    const coverClass = a.cover_image ? "" : FALLBACK_THUMBS[i % FALLBACK_THUMBS.length];
                    return (
                      <Link key={a.id} href={`/journal/${a.slug}`} style={{ textDecoration: "none", display: "contents" }}>
                        <article className="card fade">
                          <div className={`thumb ${coverClass}`.trim()}>
                            {a.cover_image
                              ? <img className="inner" src={a.cover_image} alt="" style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                              : <div className="inner" />}
                            <span className="tag">{a.category}</span>
                            {a.read_time && <span className="read">{a.read_time}</span>}
                            {!a.cover_image && <span className="badge-sym">{(a.title[0] ?? "F").toUpperCase()}</span>}
                          </div>
                          <div className="body">
                            <h3>{a.title}</h3>
                            {a.excerpt && <p>{a.excerpt}</p>}
                            <div className="card-foot">
                              <div className="av">{a.author_init}</div>
                              <span className="who">{a.author_name}</span>
                              <span className="date">{fmtDate(a.published_at)}</span>
                            </div>
                          </div>
                        </article>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* NEWSLETTER */}
      <section style={{ padding: "80px 24px" }}>
        <div className="cta">
          <div className="wrap-tight">
            <div className="fade in"><span className="eyebrow">Monthly</span></div>
            <h2 className="fade in d1">One <span className="it">considered</span> essay,<br />once a month.</h2>
            <div style={{ marginTop: 40 }}>
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
