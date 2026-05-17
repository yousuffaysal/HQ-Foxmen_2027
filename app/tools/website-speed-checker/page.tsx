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
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

type SpeedResult = {
  score: number;
  fcp: string;
  lcp: string;
  cls: string;
  tbt: string;
  speedIndex: string;
  fcpScore: number;
  lcpScore: number;
  clsScore: number;
  tbtScore: number;
};

function scoreColor(score: number): string {
  if (score >= 90) return "#22c55e";
  if (score >= 50) return "#f59e0b";
  return "#ef4444";
}

function metricColor(score: number): string {
  if (score >= 0.9) return "#22c55e";
  if (score >= 0.5) return "#f59e0b";
  return "#ef4444";
}

const METRIC_INFO: Record<string, { label: string; desc: string }> = {
  lcp: { label: "LCP", desc: "Largest Contentful Paint — time until the largest visible element loads. Under 2.5 s is good." },
  fcp: { label: "FCP", desc: "First Contentful Paint — when the first content appears. Under 1.8 s is good." },
  cls: { label: "CLS", desc: "Cumulative Layout Shift — measures visual stability. Under 0.1 is good." },
  tbt: { label: "TBT", desc: "Total Blocking Time — how long the main thread is blocked. Under 200 ms is good." },
};

export default function WebsiteSpeedCheckerPage() {
  useScrollReveal();

  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SpeedResult | null>(null);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  async function handleCheck(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true);
    setResult(null);
    setError("");
    try {
      const res = await fetch("/api/tools/speed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, tool: "speed", summary: { url, ...result } }),
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
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <section className="page-hero">
        <div className="wrap">
          <div className="crumbs fade in">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <Link href="/tools">Free Tools</Link>
            <span className="sep">/</span>
            <span>Website Speed Checker</span>
          </div>
          <h1>
            <span className="reveal in"><span className="reveal-inner">How fast</span></span>
            <span className="reveal in reveal-delay-1"><span className="reveal-inner">is your <span className="it">site?</span></span></span>
          </h1>
          <p className="lede fade in d2">
            Get real Core Web Vitals powered by Google PageSpeed. Paste your URL and see your score in seconds — free, from Foxmen Studio.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 64 }}>
        <div className="wrap" style={{ maxWidth: 860 }}>

          {/* URL Input */}
          <form onSubmit={handleCheck} className="fade in" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <input
              type="url"
              placeholder="https://yourwebsite.com"
              value={url}
              onChange={e => setUrl(e.target.value)}
              required
              style={{
                flex: 1,
                minWidth: 260,
                padding: "14px 20px",
                border: "1px solid var(--line)",
                borderRadius: "var(--r-pill)",
                fontFamily: "var(--f-sans)",
                fontSize: 16,
                background: "#fff",
                color: "var(--ink)",
                outline: "none",
              }}
            />
            <button type="submit" className="btn" disabled={loading}>
              <span className="label">{loading ? "Analysing…" : "Check speed"}</span>
              <span className="chip">{loading ? <SpinnerIcon /> : <ArrowIcon />}</span>
            </button>
          </form>

          {error && (
            <div className="fade in" style={{ marginTop: 24, padding: "14px 20px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, color: "#dc2626", fontSize: 14 }}>
              {error}
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="tool-result fade in" style={{ marginTop: 48 }}>

              {/* Score ring */}
              <div className="score-ring" style={{ "--score-color": scoreColor(result.score) } as React.CSSProperties}>
                <div className="score-ring-inner">
                  <span className="score-ring-number" style={{ color: scoreColor(result.score) }}>{result.score}</span>
                  <span className="score-ring-label">Performance</span>
                </div>
              </div>

              {/* Metric cards */}
              <div className="metric-grid" style={{ marginTop: 40 }}>
                {metrics.map(m => (
                  <div key={m.key} className="metric-card">
                    <div className="metric-card-value" style={{ color: metricColor(m.score) }}>{m.value ?? "—"}</div>
                    <div className="metric-card-label">{METRIC_INFO[m.key].label}</div>
                    <div className="metric-card-desc">{METRIC_INFO[m.key].desc}</div>
                  </div>
                ))}
              </div>

              {/* Speed Index */}
              {result.speedIndex && (
                <div className="fade in" style={{ marginTop: 24, padding: "14px 20px", background: "#fff", border: "1px solid var(--line)", borderRadius: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--muted)" }}>Speed Index</span>
                  <span style={{ fontFamily: "var(--f-display)", fontSize: 28, letterSpacing: "-.02em" }}>{result.speedIndex}</span>
                </div>
              )}

              {/* Email capture */}
              <div className="fade in" style={{ marginTop: 48, padding: 32, background: "var(--ink)", borderRadius: 15, color: "#fff" }}>
                <h3 style={{ fontFamily: "var(--f-display)", fontSize: 28, letterSpacing: "-.02em", color: "#fff", margin: "0 0 8px" }}>
                  Get the full report via email
                </h3>
                <p style={{ color: "rgba(255,255,255,.7)", fontSize: 14, margin: "0 0 20px" }}>
                  We&apos;ll send you a detailed breakdown with actionable fixes — from Foxmen Studio.
                </p>
                {emailSent ? (
                  <p style={{ color: "var(--brand)", fontFamily: "var(--f-mono)", fontSize: 13, letterSpacing: ".12em" }}>Report sent! Check your inbox.</p>
                ) : (
                  <form onSubmit={handleEmailCapture} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      style={{
                        flex: 1,
                        minWidth: 220,
                        padding: "12px 18px",
                        borderRadius: "var(--r-pill)",
                        border: "1px solid rgba(255,255,255,.2)",
                        background: "rgba(255,255,255,.08)",
                        color: "#fff",
                        fontFamily: "var(--f-sans)",
                        fontSize: 15,
                        outline: "none",
                      }}
                    />
                    <button type="submit" className="btn" disabled={emailLoading}
                      style={{ "--bg": "#fff", "--fg": "var(--ink)", "--chip": "var(--ink)", "--chipfg": "#fff" } as React.CSSProperties}>
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
