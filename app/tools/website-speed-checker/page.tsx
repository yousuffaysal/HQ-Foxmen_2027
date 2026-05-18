"use client";
import { useState } from "react";
import Link from "next/link";
import { useScrollReveal } from "@/hooks/useScrollReveal";

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h18M13 5l7 7-7 7" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

type SpeedResult = {
  score: number;
  fcp: string; lcp: string; cls: string; tbt: string; speedIndex: string;
  fcpScore: number; lcpScore: number; clsScore: number; tbtScore: number;
};

function scoreColor(s: number) { return s >= 90 ? "#22c55e" : s >= 50 ? "#f59e0b" : "#ef4444"; }
function scoreLabel(s: number) { return s >= 90 ? "Fast" : s >= 50 ? "Needs work" : "Slow"; }
function metricColor(s: number) { return s >= 0.9 ? "#22c55e" : s >= 0.5 ? "#f59e0b" : "#ef4444"; }

const METRICS = [
  { key: "lcp", label: "LCP", desc: "Largest Contentful Paint — main content load time. Under 2.5 s = good." },
  { key: "fcp", label: "FCP", desc: "First Contentful Paint — when first content appears. Under 1.8 s = good." },
  { key: "cls", label: "CLS", desc: "Cumulative Layout Shift — visual stability score. Under 0.1 = good." },
  { key: "tbt", label: "TBT", desc: "Total Blocking Time — main thread blocked. Under 200 ms = good." },
];

function ScoreRing({ score }: { score: number }) {
  const color = scoreColor(score);
  const r = 60;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  return (
    <div className="score-ring-v2">
      <div className="score-ring-v2-circle">
        <svg width="160" height="160" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r={r} fill="none" stroke="var(--line)" strokeWidth="8" />
          <circle
            cx="80" cy="80" r={r} fill="none"
            stroke={color} strokeWidth="8"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.16,1,.3,1)" }}
          />
        </svg>
        <div className="score-ring-v2-label-wrap">
          <span className="score-ring-v2-number" style={{ color }}>{score}</span>
          <span className="score-ring-v2-sublabel">{scoreLabel(score)}</span>
        </div>
      </div>
    </div>
  );
}

export default function WebsiteSpeedCheckerPage() {
  useScrollReveal(".fade, .reveal");

  const [url, setUrl]             = useState("");
  const [loading, setLoading]     = useState(false);
  const [result, setResult]       = useState<SpeedResult | null>(null);
  const [error, setError]         = useState("");
  const [email, setEmail]         = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  async function handleCheck(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true); setResult(null); setError("");
    try {
      const res = await fetch("/api/tools/speed", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Analysis failed");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleEmailCapture(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !result) return;
    setEmailLoading(true);
    try {
      await fetch("/api/tools/lead", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, tool: "Website Speed Checker", summary: { url, ...result } }),
      });
      setEmailSent(true);
    } finally {
      setEmailLoading(false);
    }
  }

  const metrics = result
    ? [
        { key: "lcp", value: result.lcp, score: result.lcpScore },
        { key: "fcp", value: result.fcp, score: result.fcpScore },
        { key: "cls", value: result.cls, score: result.clsScore },
        { key: "tbt", value: result.tbt, score: result.tbtScore },
      ]
    : [];

  return (
    <>
      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>

      {/* ── HERO ── */}
      <section className="page-hero">
        <div className="wrap">
          <div className="crumbs fade in">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <Link href="/tools">Free Tools</Link>
            <span className="sep">/</span>
            <span>Website Speed Checker</span>
          </div>
          <h1 className="display">
            <span className="reveal in"><span className="reveal-inner">How fast</span></span>
            <span className="reveal in reveal-delay-1"><span className="reveal-inner">is your <span className="it">site?</span></span></span>
          </h1>
          <p className="lede fade in d2">
            Real Core Web Vitals — LCP, FCP, CLS, and TBT. Paste your URL and see your performance score in seconds, free from Foxmen Studio.
          </p>
        </div>
      </section>

      {/* ── TOOL ── */}
      <section className="section" style={{ paddingTop: 64 }}>
        <div className="wrap" style={{ maxWidth: 820 }}>

          {/* Dark input box */}
          <div className="tool-input-box fade in">
            <span className="tool-input-label">Enter your website URL</span>
            <form onSubmit={handleCheck} style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <input
                type="text"
                placeholder="yourwebsite.com"
                value={url}
                onChange={e => setUrl(e.target.value)}
                required
                autoComplete="url"
              />
              <button type="submit" className="btn" disabled={loading}
                style={{ "--bg": "var(--brand)", "--fg": "#fff", "--chip": "rgba(0,0,0,.25)", "--chipfg": "#fff" } as React.CSSProperties}>
                <span className="label">{loading ? "Analysing…" : "Check speed"}</span>
                <span className="chip">{loading ? <SpinnerIcon /> : <ArrowIcon />}</span>
              </button>
            </form>
            <p style={{ marginTop: 14, color: "rgba(255,255,255,.3)", fontSize: 12, fontFamily: "var(--f-mono)", letterSpacing: ".1em" }}>
              MOBILE SCORE · CORE WEB VITALS
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="fade in" style={{ marginTop: 20, padding: "14px 20px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, color: "#dc2626", fontSize: 14 }}>
              {error}
            </div>
          )}

          {/* Results */}
          {result && (
            <div style={{ marginTop: 56 }}>

              {/* Score row */}
              <div className="fade in" style={{ display: "flex", alignItems: "center", gap: 48, flexWrap: "wrap", marginBottom: 48 }}>
                <ScoreRing score={result.score} />
                <div style={{ flex: 1, minWidth: 220 }}>
                  <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>
                    Performance score
                  </div>
                  <div style={{ fontFamily: "var(--f-display)", fontSize: "clamp(32px, 5vw, 52px)", letterSpacing: "-.03em", lineHeight: 1.1, marginBottom: 12 }}>
                    {result.score >= 90 ? "Your site is fast." : result.score >= 50 ? "Room to improve." : "Your site is slow."}
                  </div>
                  {result.speedIndex && (
                    <div style={{ fontFamily: "var(--f-mono)", fontSize: 12, color: "var(--muted)", letterSpacing: ".08em" }}>
                      Speed Index: <strong style={{ color: "var(--ink)" }}>{result.speedIndex}</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Metric cards */}
              <div className="metric-grid fade in d1">
                {metrics.map(m => {
                  const info = METRICS.find(x => x.key === m.key)!;
                  const color = metricColor(m.score);
                  return (
                    <div key={m.key} className="metric-card-v2">
                      <div className="metric-bar-wrap">
                        <div className="metric-bar" style={{ width: `${m.score * 100}%`, background: color }} />
                      </div>
                      <div className="metric-card-v2-value" style={{ color }}>{m.value ?? "—"}</div>
                      <div className="metric-card-v2-label">{info.label}</div>
                      <div className="metric-card-v2-desc">{info.desc}</div>
                    </div>
                  );
                })}
              </div>

              {/* Email capture */}
              <div className="fade in d2" style={{ marginTop: 48, padding: 36, background: "var(--ink)", borderRadius: 20, color: "#fff" }}>
                <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--brand)", marginBottom: 10 }}>
                  Free full report
                </div>
                <h3 style={{ fontFamily: "var(--f-display)", fontSize: 30, letterSpacing: "-.02em", color: "#fff", margin: "0 0 8px" }}>
                  Want actionable fixes?
                </h3>
                <p style={{ color: "rgba(255,255,255,.6)", fontSize: 14, margin: "0 0 24px", lineHeight: 1.6 }}>
                  We&apos;ll send you a detailed breakdown with specific recommendations — from Foxmen Studio.
                </p>
                {emailSent ? (
                  <p style={{ color: "var(--brand)", fontFamily: "var(--f-mono)", fontSize: 13, letterSpacing: ".12em" }}>
                    ✓ Report sent — check your inbox.
                  </p>
                ) : (
                  <form onSubmit={handleEmailCapture} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      style={{
                        flex: 1, minWidth: 220,
                        padding: "13px 18px",
                        borderRadius: "var(--r-pill)",
                        border: "1px solid rgba(255,255,255,.15)",
                        background: "rgba(255,255,255,.07)",
                        color: "#fff",
                        fontFamily: "var(--f-sans)", fontSize: 15, outline: "none",
                      }}
                    />
                    <button type="submit" className="btn" disabled={emailLoading}
                      style={{ "--bg": "var(--brand)", "--fg": "#fff", "--chip": "rgba(0,0,0,.2)", "--chipfg": "#fff" } as React.CSSProperties}>
                      <span className="label">{emailLoading ? "Sending…" : "Send report"}</span>
                      <span className="chip"><ArrowIcon /></span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
