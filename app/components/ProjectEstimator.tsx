"use client";
import { useState } from "react";
import Link from "next/link";

type EstResult = {
  price_min: number;
  price_max: number;
  delivery: string;
  summary: string;
  includes: string[];
  complexity_note: string;
  recommended_stack: string;
};

const TYPE_OPTS = [
  { id: "Website",     icon: "◈", sub: "Marketing sites & web apps" },
  { id: "Mobile App",  icon: "◉", sub: "iOS & Android native apps" },
  { id: "E-commerce",  icon: "◆", sub: "Stores & marketplaces" },
  { id: "AI Tool",     icon: "◎", sub: "AI-powered products & agents" },
  { id: "Branding",    icon: "◐", sub: "Identity & design systems" },
];

const COMPLEXITY_OPTS = [
  { id: "Simple",     tier: "Entry",  sub: "MVP, landing page, core features" },
  { id: "Medium",     tier: "Growth", sub: "Multi-page, auth, integrations" },
  { id: "Advanced",   tier: "Scale",  sub: "Custom platform, complex logic" },
  { id: "Enterprise", tier: "Elite",  sub: "Large-scale, compliance, teams" },
];

const TIMELINE_OPTS = [
  { id: "ASAP",        badge: "Rush",    sub: "Under 4 weeks" },
  { id: "1–2 months",  badge: "Popular", sub: "Standard delivery" },
  { id: "3–6 months",  badge: "Premium", sub: "Full project scope" },
  { id: "Flexible",    badge: "Value",   sub: "No fixed deadline" },
];

const THINKING = [
  "Analyzing your requirements…",
  "Calculating scope & complexity…",
  "Generating your estimate…",
  "Almost ready…",
];

export default function ProjectEstimator() {
  const [step, setStep]           = useState<1|2|3|4|"result">(1);
  const [type, setType]           = useState("");
  const [complexity, setComplexity] = useState("");
  const [timeline, setTimeline]   = useState("");
  const [email, setEmail]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [thinkIdx, setThinkIdx]   = useState(0);
  const [result, setResult]       = useState<EstResult|null>(null);
  const [error, setError]         = useState("");

  const fmtPrice = (n: number) =>
    n >= 1000 ? `$${Math.round(n / 1000)}k` : `$${n.toLocaleString()}`;

  async function submit() {
    if (!email.includes("@")) { setError("Enter a valid email."); return; }
    setError("");
    setLoading(true);
    setThinkIdx(0);

    const interval = setInterval(() =>
      setThinkIdx(i => Math.min(i + 1, THINKING.length - 1)), 1800);

    try {
      const res = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, complexity, timeline, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setResult(data);
      setStep("result");
    } catch (e) {
      setError((e as Error).message || "Something went wrong. Try again.");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  }

  const stepNum = step === "result" ? 4 : step;

  return (
    <section className="est" id="estimator">
      <div className="est-wrap">

        {/* Header */}
        <div className="est-head">
          <div className="fade"><span className="eyebrow" style={{ color:"#b86cf9" }}>AI Project Estimator ✦</span></div>
          <h2 className="fade d1" style={{ color:"#fff", marginTop:16 }}>
            Get an instant price range<br />
            <span className="it" style={{ color:"#b86cf9" }}>for your project</span>
          </h2>
          <p className="fade d2" style={{ color:"#9b9b9b", marginTop:12, maxWidth:440, margin:"12px auto 0" }}>
            Answer 4 quick questions. Our AI generates a real estimate — no fluff, no forms.
          </p>
        </div>

        {/* Wizard card */}
        <div className="est-card fade d2">

          {/* Progress bar */}
          {step !== "result" && (
            <div className="est-progress">
              {[1,2,3,4].map(n => (
                <div key={n} className={`est-dot${n === stepNum ? " est-dot--active" : n < stepNum ? " est-dot--done" : ""}`}>
                  <div className="est-dot-fill" />
                </div>
              ))}
              <div className="est-progress-track">
                <div className="est-progress-fill" style={{ width:`${((stepNum - 1) / 3) * 100}%` }} />
              </div>
            </div>
          )}

          {/* ── Step 1: Type ─────────────────── */}
          {step === 1 && (
            <div className="est-step-body">
              <div className="est-step-label">Step 1 of 4</div>
              <h3 className="est-q">What are you building?</h3>
              <div className="est-grid est-grid--5">
                {TYPE_OPTS.map(o => (
                  <button
                    key={o.id}
                    className={`est-opt${type === o.id ? " est-opt--sel" : ""}`}
                    onClick={() => { setType(o.id); setTimeout(() => setStep(2), 220); }}
                  >
                    <span className="est-opt-icon">{o.icon}</span>
                    <span className="est-opt-label">{o.id}</span>
                    <span className="est-opt-sub">{o.sub}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 2: Complexity ───────────── */}
          {step === 2 && (
            <div className="est-step-body">
              <div className="est-step-label">Step 2 of 4</div>
              <h3 className="est-q">How complex is it?</h3>
              <div className="est-grid est-grid--4">
                {COMPLEXITY_OPTS.map(o => (
                  <button
                    key={o.id}
                    className={`est-opt${complexity === o.id ? " est-opt--sel" : ""}`}
                    onClick={() => { setComplexity(o.id); setTimeout(() => setStep(3), 220); }}
                  >
                    <span className="est-opt-tier">{o.tier}</span>
                    <span className="est-opt-label">{o.id}</span>
                    <span className="est-opt-sub">{o.sub}</span>
                  </button>
                ))}
              </div>
              <button className="est-back" onClick={() => setStep(1)}>← Back</button>
            </div>
          )}

          {/* ── Step 3: Timeline ─────────────── */}
          {step === 3 && (
            <div className="est-step-body">
              <div className="est-step-label">Step 3 of 4</div>
              <h3 className="est-q">What&apos;s your timeline?</h3>
              <div className="est-grid est-grid--4">
                {TIMELINE_OPTS.map(o => (
                  <button
                    key={o.id}
                    className={`est-opt${timeline === o.id ? " est-opt--sel" : ""}`}
                    onClick={() => { setTimeline(o.id); setTimeout(() => setStep(4), 220); }}
                  >
                    <span className="est-opt-tier">{o.badge}</span>
                    <span className="est-opt-label">{o.id}</span>
                    <span className="est-opt-sub">{o.sub}</span>
                  </button>
                ))}
              </div>
              <button className="est-back" onClick={() => setStep(2)}>← Back</button>
            </div>
          )}

          {/* ── Step 4: Email ────────────────── */}
          {step === 4 && (
            <div className="est-step-body">
              <div className="est-step-label">Step 4 of 4</div>
              <h3 className="est-q">Where should we send your estimate?</h3>
              <p style={{ color:"#9b9b9b", fontSize:14, marginBottom:24 }}>
                Your price range appears instantly below. We&apos;ll also email you a full breakdown.
              </p>

              {/* Selection summary */}
              <div className="est-summary">
                {[type, complexity, timeline].map((v, i) => (
                  <span key={i} className="est-tag">{v}</span>
                ))}
              </div>

              <div className="est-email-row">
                <input
                  type="email"
                  className="est-input"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(""); }}
                  onKeyDown={e => e.key === "Enter" && !loading && submit()}
                  autoFocus
                />
                <button
                  className="est-submit"
                  onClick={submit}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="est-spinner" />
                  ) : (
                    <>Get estimate <span style={{ marginLeft:6 }}>→</span></>
                  )}
                </button>
              </div>
              {error && <div className="est-error">{error}</div>}
              {loading && (
                <div className="est-thinking">{THINKING[thinkIdx]}</div>
              )}
              <p style={{ fontSize:12, color:"#555", marginTop:16 }}>
                No spam. Your data is only used to send this estimate.
              </p>
              <button className="est-back" onClick={() => setStep(3)}>← Back</button>
            </div>
          )}

          {/* ── Result ───────────────────────── */}
          {step === "result" && result && (
            <div className="est-result">
              <div className="est-result-label">Your estimate is ready</div>

              <div className="est-price-range">
                {fmtPrice(result.price_min)}&thinsp;–&thinsp;{fmtPrice(result.price_max)}
              </div>

              <div className="est-badges">
                <span className="est-badge">{type}</span>
                <span className="est-badge">{complexity}</span>
                <span className="est-badge">⏱ {result.delivery}</span>
                {result.recommended_stack && (
                  <span className="est-badge est-badge--stack">{result.recommended_stack}</span>
                )}
              </div>

              <p className="est-result-summary">{result.summary}</p>

              <div className="est-includes">
                <div className="est-includes-label">What&apos;s included</div>
                {result.includes.map((item, i) => (
                  <div key={i} className="est-include-row">
                    <span className="est-check">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {result.complexity_note && (
                <div className="est-note">{result.complexity_note}</div>
              )}

              <div className="est-actions">
                <Link href="/contact" className="btn btn--lg">
                  <span className="label">Book a free call</span>
                  <span className="chip" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                      <path d="M3 12h18M13 5l7 7-7 7" />
                    </svg>
                  </span>
                </Link>
                <button
                  className="est-restart"
                  onClick={() => { setStep(1); setType(""); setComplexity(""); setTimeline(""); setEmail(""); setResult(null); }}
                >
                  Start over
                </button>
              </div>

              <p className="est-disclaimer">
                Preliminary estimate only. Final scope & pricing confirmed after discovery call.
                {process.env.NODE_ENV !== "production" ? "" : " A detailed breakdown has been sent to " + email + "."}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
