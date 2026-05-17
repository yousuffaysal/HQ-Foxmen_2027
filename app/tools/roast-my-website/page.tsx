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

const SECTION_KEYS = [
  { key: "FIRST IMPRESSIONS",  label: "First Impressions" },
  { key: "DESIGN & UX",        label: "Design & UX" },
  { key: "CONVERSION ISSUES",  label: "Conversion Issues" },
  { key: "SEO SIGNALS",        label: "SEO Signals" },
  { key: "TOP 3 FIXES",        label: "Top 3 Fixes" },
];

function parseRoast(raw: string): Record<string, string> {
  const sections: Record<string, string> = {};
  for (let i = 0; i < SECTION_KEYS.length; i++) {
    const { key } = SECTION_KEYS[i];
    const nextKey = SECTION_KEYS[i + 1]?.key;
    const startRe = new RegExp(`${key}[:\\s\\n]+`, "i");
    const startMatch = raw.search(startRe);
    if (startMatch === -1) continue;
    const bodyStart = startMatch + raw.slice(startMatch).search(/[:\s\n]+/) + 1;
    const endIdx = nextKey
      ? raw.toUpperCase().indexOf(nextKey, bodyStart)
      : raw.length;
    sections[key] = raw.slice(bodyStart, endIdx === -1 ? undefined : endIdx).trim();
  }
  // If parsing fails, just show the raw text under the first key
  if (Object.keys(sections).length === 0) {
    sections["FIRST IMPRESSIONS"] = raw.trim();
  }
  return sections;
}

export default function RoastMyWebsitePage() {
  useScrollReveal();

  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [roast, setRoast] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true);
    setRoast(null);
    setError("");
    try {
      const res = await fetch("/api/tools/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, tool: "roast", summary: { url, roast: roast.slice(0, 800) } }),
      });
      setEmailSent(true);
    } finally {
      setEmailLoading(false);
    }
  }

  const sections = roast ? parseRoast(roast) : null;

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
            <span>Roast My Website</span>
          </div>
          <h1>
            <span className="reveal in"><span className="reveal-inner">Brutally</span></span>
            <span className="reveal in reveal-delay-1"><span className="reveal-inner">honest <span className="it">feedback.</span></span></span>
          </h1>
          <p className="lede fade in d2">
            Submit your URL and get an AI-powered audit covering design, UX, conversion, and SEO — no sugarcoating, straight from Foxmen Studio.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 64 }}>
        <div className="wrap" style={{ maxWidth: 860 }}>

          <form onSubmit={handleSubmit} className="fade in" style={{ display: "grid", gap: 16 }}>
            <input
              type="url"
              placeholder="https://yourwebsite.com"
              value={url}
              onChange={e => setUrl(e.target.value)}
              required
              style={{
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
            <textarea
              placeholder="Optional: describe your site in one line (e.g. 'SaaS for freelancers to manage invoices')"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
              style={{
                padding: "14px 20px",
                border: "1px solid var(--line)",
                borderRadius: 14,
                fontFamily: "var(--f-sans)",
                fontSize: 15,
                background: "#fff",
                color: "var(--ink)",
                outline: "none",
                resize: "vertical",
              }}
            />
            <div>
              <button type="submit" className="btn" disabled={loading}>
                <span className="label">{loading ? "Analysing your site…" : "Roast my website"}</span>
                <span className="chip">{loading ? <SpinnerIcon /> : <ArrowIcon />}</span>
              </button>
            </div>
          </form>

          {loading && (
            <div className="fade in" style={{ marginTop: 40, padding: 32, background: "var(--ink)", borderRadius: 15, color: "#fff", textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}><SpinnerIcon /></div>
              <p style={{ fontFamily: "var(--f-display)", fontSize: 24, letterSpacing: "-.02em", margin: 0, color: "#fff" }}>
                Analysing your site<span className="it" style={{ fontStyle: "italic", color: "var(--brand)" }}>…</span>
              </p>
              <p style={{ color: "rgba(255,255,255,.55)", fontSize: 14, margin: "8px 0 0" }}>
                Our AI consultant is reading every pixel. This takes 10–20 seconds.
              </p>
            </div>
          )}

          {error && (
            <div className="fade in" style={{ marginTop: 24, padding: "14px 20px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, color: "#dc2626", fontSize: 14 }}>
              {error}
            </div>
          )}

          {sections && (
            <div className="tool-result fade in" style={{ marginTop: 48 }}>
              <div style={{ marginBottom: 32 }}>
                <span className="eyebrow">Roast complete</span>
                <p style={{ marginTop: 8, fontSize: 15, color: "var(--muted)" }}>
                  Analysis of <strong style={{ color: "var(--ink)" }}>{url}</strong>
                </p>
              </div>

              {SECTION_KEYS.map(({ key, label }, i) => {
                const content = sections[key];
                if (!content) return null;
                return (
                  <div key={key} className={`fade d${i}`} style={{ marginBottom: 32, padding: 28, background: "#fff", border: "1px solid var(--line)", borderRadius: 15 }}>
                    <h3 style={{ fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--muted)", margin: "0 0 14px" }}>
                      {String(i + 1).padStart(2, "0")} — {label}
                    </h3>
                    <div style={{ fontSize: 15, lineHeight: 1.7, color: "#1f1f1f", whiteSpace: "pre-wrap" }}>{content}</div>
                  </div>
                );
              })}

              {/* Email capture */}
              <div className="fade" style={{ marginTop: 40, padding: 32, background: "var(--ink)", borderRadius: 15, color: "#fff" }}>
                <h3 style={{ fontFamily: "var(--f-display)", fontSize: 28, letterSpacing: "-.02em", color: "#fff", margin: "0 0 8px" }}>
                  Get the full roast report via email
                </h3>
                <p style={{ color: "rgba(255,255,255,.7)", fontSize: 14, margin: "0 0 20px" }}>
                  We&apos;ll send you the complete analysis plus a personalised action plan from Foxmen Studio.
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
