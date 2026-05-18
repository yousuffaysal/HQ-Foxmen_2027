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

const PROJECT_TYPES = ["Website", "Mobile App", "AI / ML Tool", "E-commerce", "SaaS Platform", "Real-time App", "Data Dashboard"];

const REQUIREMENTS = [
  "Real-time features",
  "AI / ML",
  "Mobile app",
  "High traffic (100k+ users)",
  "Offline capable",
  "Admin dashboard",
  "Payments",
  "Auth / user accounts",
];

const TEAM_SIZES = ["Solo developer", "2–5 people", "5+ people"];

type StackResult = {
  frontend: string;
  backend: string;
  database: string;
  infrastructure: string;
  ai_layer?: string;
  rationale: Record<string, string>;
};

const LAYER_ICONS: Record<string, React.ReactNode> = {
  frontend: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="m9 9 3 3-3 3m4 0h4" /></svg>,
  backend:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10M12 20V4M6 20v-6" /></svg>,
  database: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4.03 3-9 3S3 13.66 3 12" /><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" /></svg>,
  infrastructure: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>,
  ai_layer: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" /><path d="M12 6v4" /><path d="M8 10a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" /><path d="M16 10a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" /><path d="M4 18a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" /><path d="M12 18a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" /><path d="M20 18a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" /><path d="M8 14l-2 4M16 14l2 4M12 14v4" /></svg>,
};

const LAYER_LABELS: Record<string, string> = {
  frontend: "Frontend",
  backend:  "Backend",
  database: "Database",
  infrastructure: "Infrastructure",
  ai_layer: "AI / ML Layer",
};

export default function TechStackRecommenderPage() {
  useScrollReveal(".fade, .reveal");

  const [projectType, setProjectType] = useState("");
  const [requirements, setRequirements] = useState<string[]>([]);
  const [teamSize, setTeamSize] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StackResult | null>(null);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  function toggleReq(r: string) {
    setRequirements(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!projectType || !teamSize) return;
    setLoading(true);
    setResult(null);
    setError("");
    try {
      const res = await fetch("/api/tools/tech-stack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectType, requirements, teamSize }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Recommendation failed");
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
        body: JSON.stringify({ email, tool: "tech-stack", summary: { projectType, requirements, teamSize, stack: result } }),
      });
      setEmailSent(true);
    } finally {
      setEmailLoading(false);
    }
  }

  const canSubmit = projectType && teamSize;

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
            <span>Tech Stack Recommender</span>
          </div>
          <h1 className="display">
            <span className="reveal in"><span className="reveal-inner">The right</span></span>
            <span className="reveal in reveal-delay-1"><span className="reveal-inner">stack for <span className="it">you.</span></span></span>
          </h1>
          <p className="lede fade in d2">
            Tell us what you&apos;re building and our AI architect will recommend the ideal frontend, backend, database, and infrastructure — free from Foxmen Studio.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 64 }}>
        <div className="wrap" style={{ maxWidth: 860 }}>

          <form onSubmit={handleSubmit} className="fade in" style={{ display: "grid", gap: 40 }}>

            {/* Project type */}
            <div>
              <div className="eyebrow" style={{ marginBottom: 20 }}>What are you building?</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {PROJECT_TYPES.map(pt => (
                  <button
                    type="button"
                    key={pt}
                    onClick={() => setProjectType(pt)}
                    style={{
                      padding: "10px 18px",
                      border: `1px solid ${projectType === pt ? "var(--brand)" : "var(--line)"}`,
                      borderRadius: "var(--r-pill)",
                      background: projectType === pt ? "var(--brand-soft)" : "#fff",
                      fontFamily: "var(--f-sans)",
                      fontSize: 14,
                      color: projectType === pt ? "var(--brand-deep)" : "var(--ink)",
                      cursor: "pointer",
                      transition: "all .2s",
                    }}
                  >
                    {pt}
                  </button>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div>
              <div className="eyebrow" style={{ marginBottom: 20 }}>Requirements (select all that apply)</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8 }}>
                {REQUIREMENTS.map(r => (
                  <label key={r} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", border: `1px solid ${requirements.includes(r) ? "var(--brand)" : "var(--line)"}`, borderRadius: 10, background: requirements.includes(r) ? "var(--brand-soft)" : "#fff", cursor: "pointer", transition: "all .2s" }}>
                    <input type="checkbox" checked={requirements.includes(r)} onChange={() => toggleReq(r)} style={{ accentColor: "var(--brand)", width: 15, height: 15 }} />
                    <span style={{ fontSize: 14, color: requirements.includes(r) ? "var(--brand-deep)" : "var(--ink)" }}>{r}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Team size */}
            <div>
              <div className="eyebrow" style={{ marginBottom: 20 }}>Team size</div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {TEAM_SIZES.map(s => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setTeamSize(s)}
                    style={{
                      padding: "10px 20px",
                      border: `1px solid ${teamSize === s ? "var(--brand)" : "var(--line)"}`,
                      borderRadius: "var(--r-pill)",
                      background: teamSize === s ? "var(--brand-soft)" : "#fff",
                      fontFamily: "var(--f-sans)",
                      fontSize: 14,
                      color: teamSize === s ? "var(--brand-deep)" : "var(--ink)",
                      cursor: "pointer",
                      transition: "all .2s",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <button type="submit" className="btn btn--lg" disabled={!canSubmit || loading}>
                <span className="label">{loading ? "Thinking…" : "Recommend my stack"}</span>
                <span className="chip">{loading ? <SpinnerIcon /> : <ArrowIcon />}</span>
              </button>
            </div>
          </form>

          {error && (
            <div className="fade in" style={{ marginTop: 24, padding: "14px 20px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, color: "#dc2626", fontSize: 14 }}>
              {error}
            </div>
          )}

          {result && (
            <div className="tool-result fade in" style={{ marginTop: 56 }}>
              <div style={{ marginBottom: 32 }}>
                <span className="eyebrow">Recommended stack</span>
                <h2 style={{ fontFamily: "var(--f-display)", fontSize: "clamp(28px,4vw,48px)", letterSpacing: "-.025em", margin: "12px 0 0", lineHeight: 1 }}>
                  Your <span className="it">ideal architecture</span>
                </h2>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
                {(["frontend", "backend", "database", "infrastructure", ...(result.ai_layer ? ["ai_layer"] : [])] as (keyof typeof LAYER_LABELS)[]).map((layer, i) => {
                  const value = result[layer as keyof StackResult];
                  if (!value || typeof value !== "string") return null;
                  const rationale = result.rationale?.[layer];
                  return (
                    <div key={layer} className={`stack-layer-card fade d${i}`}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 9, background: "var(--brand-soft)", display: "grid", placeItems: "center", color: "var(--brand-deep)", flexShrink: 0 }}>
                          {LAYER_ICONS[layer]}
                        </div>
                        <div className="stack-layer-label">{LAYER_LABELS[layer]}</div>
                      </div>
                      <div className="stack-layer-value">{value}</div>
                      {rationale && <div className="stack-layer-why">{rationale}</div>}
                    </div>
                  );
                })}
              </div>

              {/* Email capture */}
              <div className="fade" style={{ marginTop: 48, padding: 36, background: "var(--ink)", borderRadius: 20, color: "#fff" }}>
                <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--brand)", marginBottom: 10 }}>
                  Free architecture doc
                </div>
                <h3 style={{ fontFamily: "var(--f-display)", fontSize: 30, letterSpacing: "-.02em", color: "#fff", margin: "0 0 8px" }}>
                  Want a full architecture breakdown?
                </h3>
                <p style={{ color: "rgba(255,255,255,.6)", fontSize: 14, margin: "0 0 24px", lineHeight: 1.6 }}>
                  We&apos;ll send you a detailed architecture doc with rationale and alternatives — from Foxmen Studio.
                </p>
                {emailSent ? (
                  <p style={{ color: "var(--brand)", fontFamily: "var(--f-mono)", fontSize: 13, letterSpacing: ".12em" }}>✓ Doc sent — check your inbox.</p>
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
                      <span className="label">{emailLoading ? "Sending…" : "Send doc"}</span>
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
