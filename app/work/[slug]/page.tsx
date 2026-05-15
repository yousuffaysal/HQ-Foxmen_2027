"use client";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { projectMap } from "../data";
import type { HeadingParts } from "../data";

const chapters = ["overview", "challenge", "approach", "solution", "results", "credits"];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h18M13 5l7 7-7 7" />
    </svg>
  );
}

function H({ parts }: { parts: HeadingParts }) {
  return <>{parts.pre}<span className="it">{parts.it}</span>{parts.post ?? ""}</>;
}

const monoMuted: React.CSSProperties = {
  fontSize: 14, color: "var(--muted)", fontFamily: "var(--f-mono)",
  letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 12,
};

export default function CasePage({ params }: { params: { slug: string } }) {
  const d = projectMap[params.slug];
  if (!d) notFound();

  useScrollReveal(".fade, .reveal, .bento .tile, .split .shot");

  const [activeChap, setActiveChap] = useState(0);
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const update = () => {
      const scrollY = window.scrollY + window.innerHeight * 0.4;
      let idx = 0;
      chapters.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) idx = i;
      });
      setActiveChap(idx);
      const total = document.body.scrollHeight - window.innerHeight;
      const p = Math.min(100, Math.max(0, (window.scrollY / total) * 100));
      if (progressRef.current) progressRef.current.style.width = p + "%";
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
  };

  const delays = ["", " d1", " d2", " d3"];

  return (
    <>
      {/* ── CASE HERO ─────────────────────────────────────────────────────── */}
      <section className="case-hero">
        <div className="wrap">
          <div className="case-meta">
            <span><span className="dot" />{d.caseLabel}</span>
            <span>·</span><span>{d.industry}</span>
            <span>·</span><span>{d.scope}</span>
            <span>·</span><span>{d.year}</span>
          </div>
          <h1 className="case-title">
            {d.titleLines.map((line, i) => (
              <span key={i} className={`reveal in${i > 0 ? ` reveal-delay-${i}` : ""}`}>
                <span className={`reveal-inner${line.it ? " it" : ""}`}>{line.text}</span>
              </span>
            ))}
          </h1>
          <p className="case-sub">{d.sub}</p>
          <div className="case-keys">
            {d.keys.map(({ k, v }) => (
              <div key={k}><div className="k">{k}</div><div className="v">{v}</div></div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HERO SHOT ────────────────────────────────────────────────────── */}
      <div className="hero-shot fade">
        <div className="frame">
          <span className="badge">{d.badge}</span>
          <div className="device-mock" />
        </div>
      </div>

      {/* ── CHAPTER NAV ──────────────────────────────────────────────────── */}
      <nav className="chapter-nav">
        <div className="wrap inner">
          {chapters.map((id, i) => (
            <a key={id} onClick={() => scrollTo(id)} className={activeChap === i ? "on" : ""} style={{ cursor: "pointer" }}>
              <span className="n">0{i + 1}</span>
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </a>
          ))}
          <span className="progress-line" ref={progressRef} />
        </div>
      </nav>

      {/* ── 01 OVERVIEW ──────────────────────────────────────────────────── */}
      <section className="chap" id="overview">
        <div className="wrap-tight">
          <div className="chap-head">
            <div className="num fade">01</div>
            <div>
              <div className="label fade">Overview</div>
              <h2 className="fade d1"><H parts={d.overview.title} /></h2>
            </div>
          </div>
          <div className="chap-body">
            <aside className="side fade">
              <div className="label">At a glance</div>
              <ul>{d.overview.sideItems.map((it) => <li key={it}>{it}</li>)}</ul>
            </aside>
            <div className="fade d1">
              <p className="lede">{d.overview.lede}</p>
              <p>{d.overview.body}</p>
            </div>
            <div className="meta-stats fade d2">
              {d.overview.stats.map((s) => (
                <div className="stat-big" key={s.k}>
                  <div className="k">{s.k}</div>
                  <div className="v">{s.v}{s.it && <span className="it">{s.it}</span>}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 02 CHALLENGE ─────────────────────────────────────────────────── */}
      <section className="chap" id="challenge">
        <div className="wrap-tight">
          <div className="chap-head">
            <div className="num fade">02</div>
            <div>
              <div className="label fade">Challenge</div>
              <h2 className="fade d1"><H parts={d.challenge.title} /></h2>
            </div>
          </div>
          <div className="chap-body">
            <aside className="side fade">
              <div className="label">{d.challenge.sideLabel}</div>
              <ul>{d.challenge.sideItems.map((it) => <li key={it}>{it}</li>)}</ul>
            </aside>
            <div className="fade d1">
              <p className="lede">{d.challenge.lede}</p>
              {d.challenge.body.map((p, i) => <p key={i}>{p}</p>)}
            </div>
            {d.challenge.metric && (
              <div className="fade d2">
                <p style={monoMuted}>Before / After</p>
                <div style={{ display: "flex", gap: 32, fontFamily: "var(--f-display)", fontSize: 48, lineHeight: 1, letterSpacing: "-.02em", alignItems: "baseline" }}>
                  <div>
                    <div style={{ ...monoMuted, marginBottom: 8 }}>Before</div>
                    {d.challenge.metric.before}<small style={{ fontFamily: "var(--f-sans)", fontSize: 20, fontWeight: 400 }}>{d.challenge.metric.u1}</small>
                  </div>
                  <div style={{ color: "var(--brand)", fontStyle: "italic" }}>→</div>
                  <div>
                    <div style={{ ...monoMuted, marginBottom: 8 }}>After</div>
                    <span style={{ color: "var(--brand)", fontStyle: "italic" }}>
                      {d.challenge.metric.after}<small style={{ fontFamily: "var(--f-sans)", fontSize: 20, fontWeight: 400 }}>{d.challenge.metric.u2}</small>
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="split">
            <div className="shot dark fade"><span className="label">{d.challenge.splitLabels[0]}</span></div>
            <div className="shot brand fade delay"><span className="label">{d.challenge.splitLabels[1]}</span></div>
          </div>
        </div>
      </section>

      {/* ── 03 APPROACH ──────────────────────────────────────────────────── */}
      <section className="chap" id="approach">
        <div className="wrap-tight">
          <div className="chap-head">
            <div className="num fade">03</div>
            <div>
              <div className="label fade">Approach</div>
              <h2 className="fade d1"><H parts={d.approach.title} /></h2>
            </div>
          </div>
          <div style={{ maxWidth: "60ch", marginBottom: 24 }}>
            <p className="lede fade d1" style={{ fontSize: 22, lineHeight: 1.5, color: "#1a1a1a", margin: 0 }}>
              {d.approach.lede}
            </p>
          </div>
          <div className="pillars">
            {d.approach.pillars.map((p, i) => (
              <div className={`pillar fade${delays[i]}`} key={i}>
                <div className="ix">{p.ix}</div>
                <h4>{p.pre}<span className="it">{p.it}</span></h4>
                <p>{p.p}</p>
              </div>
            ))}
          </div>
          <div className="bento">
            {d.approach.bento.map((b, i) => (
              <div key={i} className={`tile ${b.cls}${b.dark ? " dark-bg" : ""} fade${delays[i % 4]}`}>
                <span className="label">{b.label}</span>
                <span className="sym">{b.sym}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PULL QUOTE ───────────────────────────────────────────────────── */}
      <section className="quote-full">
        <div className="wrap-tight">
          <p className="text">{d.quote.text}</p>
          <div className="meta">
            <span className="av">{d.quote.av}</span>
            <span>{d.quote.who}</span>
            <span style={{ opacity: 0.5 }}>·</span>
            <span>{d.quote.role}</span>
          </div>
        </div>
      </section>

      {/* ── 04 SOLUTION ──────────────────────────────────────────────────── */}
      <section className="chap" id="solution">
        <div className="wrap-tight">
          <div className="chap-head">
            <div className="num fade">04</div>
            <div>
              <div className="label fade">Solution</div>
              <h2 className="fade d1"><H parts={d.solution.title} /></h2>
            </div>
          </div>
          <div className="chap-body">
            <aside className="side fade">
              <div className="label">{d.solution.sideLabel}</div>
              <ul>{d.solution.sideItems.map((it) => <li key={it}>{it}</li>)}</ul>
            </aside>
            <div className="fade d1">
              <p className="lede">{d.solution.lede}</p>
              <p>{d.solution.body}</p>
            </div>
            <div className="fade d2" style={{ display: "grid", gap: 18 }}>
              <div style={{ padding: 20, border: "1px solid var(--line)", borderRadius: 15, background: "#fff" }}>
                <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: ".18em", color: "var(--muted)", textTransform: "uppercase" }}>Stack</div>
                <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {d.solution.stack.map((t) => (
                    <span key={t} style={{ padding: "5px 12px", border: "1px solid var(--line)", borderRadius: 999, fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--muted)" }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="split">
            <div className="shot dark fade"><span className="label">{d.solution.splitLabels[0]}</span></div>
            <div className="shot brand fade delay"><span className="label">{d.solution.splitLabels[1]}</span></div>
          </div>
        </div>
      </section>

      {/* ── 05 RESULTS ───────────────────────────────────────────────────── */}
      <section className="chap" id="results">
        <div className="wrap">
          <div className="results-hero">
            <div className="fade"><span className="eyebrow">{d.results.h1}</span></div>
            <h2 className="fade d1" style={{ marginTop: 24 }}>
              {d.results.h2.pre}<br /><span className="it">{d.results.h2.it}</span>
            </h2>
          </div>
          <div className="results-grid">
            {d.results.metrics.map((r, i) => (
              <div key={i} className={`r fade${delays[i % 4]}`}>
                <div className="k">{r.k}</div>
                <div className="v">
                  {r.v}
                  {r.it  && <span className="it">{r.it}</span>}
                  {r.small && <small>{r.small}</small>}
                </div>
                <div className="ctx">{r.ctx}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 06 CREDITS ───────────────────────────────────────────────────── */}
      <section id="credits" style={{ padding: "48px 0" }}>
        <div className="credits">
          <div className="inner">
            <div className="credits-grid">
              <div>
                <div className="label">06 — Behind the build</div>
                <h3><H parts={d.credits.title} /></h3>
                <p style={{ color: "#bdbdbd", fontSize: 16, lineHeight: 1.6, maxWidth: "42ch", margin: 0 }}>{d.credits.desc}</p>
              </div>
              <div>
                <div className="label">Technology</div>
                <div className="tech-list">
                  {d.credits.tech.map((t) => <span key={t}>{t}</span>)}
                </div>
              </div>
              <div>
                <div className="label">Credits</div>
                <div className="team-list">
                  {d.credits.team.map(({ name, role }) => (
                    <div className="row" key={name}>
                      <span className="name">{name}</span>
                      <span className="role">{role}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SHARE BAR ────────────────────────────────────────────────────── */}
      <section style={{ padding: "0 24px" }}>
        <div className="wrap-tight">
          <div className="share-bar fade">
            <div>
              <div className="label">Share this case study</div>
              <div style={{ marginTop: 8, fontFamily: "var(--f-display)", fontSize: 24, lineHeight: 1, letterSpacing: "-.01em" }}>
                {d.shareTitle}
              </div>
            </div>
            <div className="links">
              <a href="#" aria-label="Twitter">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2H21.5l-7.5 8.57L23 22h-6.844l-5.36-7.005L4.7 22H1.44l8.04-9.183L1 2h7.014l4.844 6.405L18.244 2Z" /></svg>
              </a>
              <a href="#" aria-label="LinkedIn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6 0h3.84v1.71h.05c.54-1 1.87-2.08 3.84-2.08C20.6 8.63 22 11 22 14.18V21h-4v-6.06c0-1.45-.03-3.31-2.02-3.31-2.02 0-2.33 1.58-2.33 3.21V21H9V9Z" /></svg>
              </a>
              <a href="#" aria-label="Email">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── NEXT PROJECT ─────────────────────────────────────────────────── */}
      <section style={{ padding: "48px 0" }}>
        <Link href={`/work/${d.next.slug}`} className="next-project">
          <div className="wrap">
            <div className="eye">Next case · {d.next.caseNum}</div>
            <h2>
              {d.next.name}{d.next.nameSep} <span className="it">{d.next.nameIt}</span><br />
              <span className="it">{d.next.nameIt2}</span>
            </h2>
            <div className="preview">
              {d.next.meta.map((m, i) => (
                <>
                  {i > 0 && <span key={`sep-${i}`} className="sep">·</span>}
                  <span key={m}>{m}</span>
                </>
              ))}
            </div>
            <div className="cta-row">
              <span className="btn btn--lg" style={{ background: "#fff", color: "var(--ink)", pointerEvents: "none" }}>
                <span className="label">View case study</span>
                <span className="chip" style={{ background: "var(--ink)", color: "#fff" }}><ArrowIcon /></span>
              </span>
            </div>
          </div>
        </Link>
      </section>
    </>
  );
}
