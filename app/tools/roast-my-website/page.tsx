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

const SECTION_KEYS = [
  {
    key: "FIRST IMPRESSIONS", label: "First Impressions",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
      </svg>
    ),
  },
  {
    key: "DESIGN & UX", label: "Design & UX",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="13.5" cy="6.5" r="1.5"/><circle cx="17.5" cy="10.5" r="1.5"/><circle cx="8.5" cy="7.5" r="1.5"/><circle cx="6.5" cy="12.5" r="1.5"/>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.28 0 .56-.01.84-.03L12 22a10 10 0 0 0 0-20z"/>
      </svg>
    ),
  },
  {
    key: "CONVERSION ISSUES", label: "Conversion",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
      </svg>
    ),
  },
  {
    key: "SEO SIGNALS", label: "SEO Signals",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
  },
  {
    key: "TOP 3 FIXES", label: "Top 3 Actions",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
  },
];

function cleanMarkdown(text: string): string {
  return text
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/^[-*]\s+/gm, "• ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function parseRoast(raw: string): Record<string, string> {
  const sections: Record<string, string> = {};
  for (let i = 0; i < SECTION_KEYS.length; i++) {
    const { key } = SECTION_KEYS[i];
    const nextKey = SECTION_KEYS[i + 1]?.key;
    const startRe = new RegExp(`${key.replace(/[&]/g, "\\&")}[:\\s\\n]+`, "i");
    const startMatch = raw.search(startRe);
    if (startMatch === -1) continue;
    const bodyStart = startMatch + raw.slice(startMatch).search(/[:\s\n]+/) + 1;
    const endRaw = nextKey
      ? raw.toUpperCase().indexOf(nextKey, bodyStart)
      : raw.length;
    const endIdx = endRaw === -1 ? raw.length : endRaw;
    sections[key] = cleanMarkdown(raw.slice(bodyStart, endIdx));
  }
  if (Object.keys(sections).length === 0) {
    sections["FIRST IMPRESSIONS"] = cleanMarkdown(raw);
  }
  return sections;
}

export default function RoastMyWebsitePage() {
  useScrollReveal(".fade, .reveal");

  const [url, setUrl]               = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading]       = useState(false);
  const [roast, setRoast]           = useState<string | null>(null);
  const [error, setError]           = useState("");
  const [email, setEmail]           = useState("");
  const [emailSent, setEmailSent]   = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true); setRoast(null); setError("");
    try {
      const res = await fetch("/api/tools/roast", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), description: description.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Analysis failed");
      setRoast(data.roast);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleEmailCapture(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !roast) return;
    setEmailLoading(true);
    try {
      await fetch("/api/tools/lead", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, tool: "Roast My Website", summary: { url, roast: roast.slice(0, 800) } }),
      });
      setEmailSent(true);
    } finally {
      setEmailLoading(false);
    }
  }

  const sections = roast ? parseRoast(roast) : null;

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
            <span>Roast My Website</span>
          </div>
          <h1 className="display">
            <span className="reveal in"><span className="reveal-inner">Brutally honest</span></span>
            <span className="reveal in reveal-delay-1"><span className="reveal-inner"><span className="it">feedback.</span></span></span>
          </h1>
          <p className="lede fade in d2">
            Submit your URL and get a professional AI audit covering design, UX, conversion rate, and SEO — with clear, actionable recommendations from Foxmen Studio.
          </p>
        </div>
      </section>

      {/* ── TOOL ── */}
      <section className="section" style={{ paddingTop: 64 }}>
        <div className="wrap" style={{ maxWidth: 820 }}>

          {/* Dark input box */}
          <div className="tool-input-box fade in">
            <span className="tool-input-label">Your website URL</span>
            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
              <input
                type="text"
                placeholder="yourwebsite.com"
                value={url}
                onChange={e => setUrl(e.target.value)}
                required
              />
              <textarea
                placeholder="Optional: describe your site in one line — 'SaaS for freelancers to manage invoices'"
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={2}
                style={{
                  width: "100%",
                  padding: "14px 20px",
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,.15)",
                  background: "rgba(255,255,255,.07)",
                  color: "#fff",
                  fontFamily: "var(--f-sans)", fontSize: 15, outline: "none",
                  resize: "vertical",
                }}
              />
              <div>
                <button type="submit" className="btn" disabled={loading}
                  style={{ "--bg": "var(--brand)", "--fg": "#fff", "--chip": "rgba(0,0,0,.25)", "--chipfg": "#fff" } as React.CSSProperties}>
                  <span className="label">{loading ? "Roasting your site…" : "Roast my website"}</span>
                  <span className="chip">{loading ? <SpinnerIcon /> : <ArrowIcon />}</span>
                </button>
              </div>
            </form>
            <p style={{ marginTop: 14, color: "rgba(255,255,255,.3)", fontSize: 12, fontFamily: "var(--f-mono)", letterSpacing: ".1em" }}>
              AI ANALYSIS · TAKES 10–20 SECONDS
            </p>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="fade in" style={{ marginTop: 32, padding: "32px 40px", background: "var(--bone)", border: "1px solid var(--line)", borderRadius: 20, textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 16, color: "var(--brand)" }}>
                <SpinnerIcon />
              </div>
              <p style={{ fontFamily: "var(--f-display)", fontSize: 26, letterSpacing: "-.02em", margin: "0 0 8px" }}>
                Auditing your site<span className="it" style={{ color: "var(--brand)" }}>…</span>
              </p>
              <p style={{ color: "var(--muted)", fontSize: 14, margin: 0 }}>
                Reviewing your design, UX, conversion paths, and SEO signals. Takes 10–20 seconds.
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="fade in" style={{ marginTop: 20, padding: "14px 20px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, color: "#dc2626", fontSize: 14 }}>
              {error}
            </div>
          )}

          {/* Results */}
          {sections && (
            <div style={{ marginTop: 56 }}>
              <div className="fade in" style={{ marginBottom: 40 }}>
                <span className="eyebrow">Roast complete</span>
                <p style={{ marginTop: 10, fontSize: 15, color: "var(--muted)", margin: "8px 0 0" }}>
                  AI audit of <strong style={{ color: "var(--ink)" }}>{url}</strong>
                </p>
              </div>

              <div style={{ display: "grid", gap: 16 }}>
                {SECTION_KEYS.map(({ key, label, icon }, i) => {
                  const content = sections[key];
                  if (!content) return null;
                  return (
                    <div key={key} className={`roast-section-card fade d${i}`}>
                      <div className="roast-section-head">
                        <div style={{
                          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                          background: "rgba(184,108,249,.2)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "var(--brand)",
                        }}>
                          {icon}
                        </div>
                        <div>
                          <div style={{ fontFamily: "var(--f-mono)", fontSize: 9, letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(255,255,255,.35)", marginBottom: 2 }}>
                            {String(i + 1).padStart(2, "0")} of 05
                          </div>
                          <div className="roast-section-title">{label}</div>
                        </div>
                      </div>
                      <div className="roast-section-body">{content}</div>
                    </div>
                  );
                })}
              </div>

              {/* Email capture */}
              <div className="fade" style={{ marginTop: 48, padding: 36, background: "var(--ink)", borderRadius: 20, color: "#fff" }}>
                <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--brand)", marginBottom: 10 }}>
                  Free full report
                </div>
                <h3 style={{ fontFamily: "var(--f-display)", fontSize: 30, letterSpacing: "-.02em", color: "#fff", margin: "0 0 8px" }}>
                  Want a full implementation plan?
                </h3>
                <p style={{ color: "rgba(255,255,255,.6)", fontSize: 14, margin: "0 0 24px", lineHeight: 1.6 }}>
                  We&apos;ll send you the complete audit with a prioritised improvement roadmap — from the Foxmen Studio team.
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
