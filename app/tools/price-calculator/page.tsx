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

/* ── Price data ─────────────────────────────────────────── */
type ProjectType = keyof typeof BASE_PRICES;

const BASE_PRICES: Record<string, { boutique: [number, number]; agency: [number, number] }> = {
  "Website":          { boutique: [3000, 8000],    agency: [15000, 60000]  },
  "Mobile App":       { boutique: [12000, 35000],  agency: [50000, 150000] },
  "AI Tool":          { boutique: [8000, 25000],   agency: [40000, 120000] },
  "E-commerce":       { boutique: [6000, 20000],   agency: [30000, 100000] },
  "Branding":         { boutique: [2000, 8000],    agency: [15000, 50000]  },
  "Full-stack SaaS":  { boutique: [20000, 60000],  agency: [80000, 250000] },
};

const PROJECT_TYPES = Object.keys(BASE_PRICES);

const FEATURES = [
  "Auth system",
  "Payments",
  "AI integration",
  "Admin panel",
  "Mobile responsive",
  "Custom design",
  "CMS",
  "Analytics",
];

const FEATURE_MULTIPLIERS: Record<string, number> = {
  "Auth system":       0.10,
  "Payments":          0.12,
  "AI integration":    0.22,
  "Admin panel":       0.14,
  "Mobile responsive": 0.06,
  "Custom design":     0.10,
  "CMS":               0.08,
  "Analytics":         0.06,
};

const TIMELINES = [
  { label: "ASAP / 1 month",  multiplier: 1.35 },
  { label: "2–3 months",      multiplier: 1.10 },
  { label: "3–6 months",      multiplier: 1.00 },
  { label: "6+ months",       multiplier: 0.90 },
];

const LOCATIONS = [
  "UK/US agency",
  "Boutique studio like us",
  "Offshore only",
];

function fmt(n: number) {
  return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function calcRange(base: [number, number], features: string[], timelineIdx: number): [number, number] {
  const featureMult = features.reduce((acc, f) => acc + (FEATURE_MULTIPLIERS[f] ?? 0), 1);
  const timeMult = TIMELINES[timelineIdx]?.multiplier ?? 1;
  return [
    Math.round(base[0] * featureMult * timeMult / 500) * 500,
    Math.round(base[1] * featureMult * timeMult / 500) * 500,
  ];
}

export default function PriceCalculatorPage() {
  useScrollReveal();

  const [step, setStep] = useState(0);
  const [projectType, setProjectType] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [timelineIdx, setTimelineIdx] = useState(2);
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  const totalSteps = 4;

  function toggleFeature(f: string) {
    setFeatures(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);
  }

  const prices = projectType
    ? {
        boutique: calcRange(BASE_PRICES[projectType].boutique, features, timelineIdx),
        agency:   calcRange(BASE_PRICES[projectType].agency,   features, timelineIdx),
      }
    : null;

  const savings = prices ? prices.agency[0] - prices.boutique[1] : 0;

  async function handleEmailCapture(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setEmailLoading(true);
    try {
      await fetch("/api/tools/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          tool: "price-calculator",
          summary: { projectType, features, timeline: TIMELINES[timelineIdx]?.label, location, prices },
        }),
      });
      setEmailSent(true);
    } finally {
      setEmailLoading(false);
    }
  }

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="crumbs fade in">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <Link href="/tools">Free Tools</Link>
            <span className="sep">/</span>
            <span>Price Calculator</span>
          </div>
          <h1>
            <span className="reveal in"><span className="reveal-inner">What should</span></span>
            <span className="reveal in reveal-delay-1"><span className="reveal-inner">it <span className="it">cost?</span></span></span>
          </h1>
          <p className="lede fade in d2">
            Get a realistic budget estimate in under 2 minutes. Compare what you&apos;d pay at a boutique like Foxmen Studio vs a traditional UK/US agency.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 64 }}>
        <div className="wrap" style={{ maxWidth: 860 }}>

          {/* Progress bar */}
          <div className="fade in" style={{ display: "flex", gap: 8, marginBottom: 48 }}>
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} style={{ flex: 1, height: 4, borderRadius: 999, background: i <= step ? "var(--brand)" : "var(--line)", transition: "background .4s" }} />
            ))}
          </div>

          {/* STEP 0: Project type */}
          {step === 0 && (
            <div className="calc-step fade in">
              <div className="eyebrow" style={{ marginBottom: 24 }}>Step 1 of 4 — Project type</div>
              <h2 style={{ fontFamily: "var(--f-display)", fontSize: "clamp(32px,5vw,56px)", letterSpacing: "-.025em", margin: "0 0 32px", lineHeight: 1 }}>
                What are you <span className="it">building?</span>
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                {PROJECT_TYPES.map(pt => (
                  <button
                    key={pt}
                    onClick={() => { setProjectType(pt); setStep(1); }}
                    style={{
                      padding: "20px 16px",
                      border: `1px solid ${projectType === pt ? "var(--brand)" : "var(--line)"}`,
                      borderRadius: 12,
                      background: projectType === pt ? "var(--brand-soft)" : "#fff",
                      fontFamily: "var(--f-sans)",
                      fontSize: 15,
                      fontWeight: 500,
                      color: projectType === pt ? "var(--brand-deep)" : "var(--ink)",
                      cursor: "pointer",
                      transition: "all .25s",
                      textAlign: "left",
                    }}
                  >
                    {pt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 1: Features */}
          {step === 1 && (
            <div className="calc-step fade in">
              <div className="eyebrow" style={{ marginBottom: 24 }}>Step 2 of 4 — Scope</div>
              <h2 style={{ fontFamily: "var(--f-display)", fontSize: "clamp(32px,5vw,56px)", letterSpacing: "-.025em", margin: "0 0 8px", lineHeight: 1 }}>
                Which <span className="it">features</span>?
              </h2>
              <p style={{ color: "var(--muted)", fontSize: 15, margin: "0 0 32px" }}>Select all that apply.</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10, marginBottom: 32 }}>
                {FEATURES.map(f => (
                  <label key={f} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", border: `1px solid ${features.includes(f) ? "var(--brand)" : "var(--line)"}`, borderRadius: 10, background: features.includes(f) ? "var(--brand-soft)" : "#fff", cursor: "pointer", transition: "all .2s" }}>
                    <input type="checkbox" checked={features.includes(f)} onChange={() => toggleFeature(f)} style={{ accentColor: "var(--brand)", width: 16, height: 16 }} />
                    <span style={{ fontFamily: "var(--f-sans)", fontSize: 14, color: features.includes(f) ? "var(--brand-deep)" : "var(--ink)" }}>{f}</span>
                  </label>
                ))}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setStep(0)} className="btn btn--ghost">
                  <span className="label">Back</span>
                  <span className="chip"><ArrowIcon /></span>
                </button>
                <button onClick={() => setStep(2)} className="btn">
                  <span className="label">Next</span>
                  <span className="chip"><ArrowIcon /></span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Timeline */}
          {step === 2 && (
            <div className="calc-step fade in">
              <div className="eyebrow" style={{ marginBottom: 24 }}>Step 3 of 4 — Timeline</div>
              <h2 style={{ fontFamily: "var(--f-display)", fontSize: "clamp(32px,5vw,56px)", letterSpacing: "-.025em", margin: "0 0 32px", lineHeight: 1 }}>
                When do you <span className="it">need it?</span>
              </h2>
              <div style={{ display: "grid", gap: 10, marginBottom: 32 }}>
                {TIMELINES.map((t, i) => (
                  <button
                    key={t.label}
                    onClick={() => setTimelineIdx(i)}
                    style={{
                      padding: "18px 24px",
                      border: `1px solid ${timelineIdx === i ? "var(--brand)" : "var(--line)"}`,
                      borderRadius: 12,
                      background: timelineIdx === i ? "var(--brand-soft)" : "#fff",
                      fontFamily: "var(--f-sans)",
                      fontSize: 15,
                      fontWeight: 500,
                      color: timelineIdx === i ? "var(--brand-deep)" : "var(--ink)",
                      cursor: "pointer",
                      transition: "all .25s",
                      textAlign: "left",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>{t.label}</span>
                    {i === 0 && <span style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: ".14em", color: "#ef4444", textTransform: "uppercase" }}>+35% rush fee</span>}
                    {i === 3 && <span style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: ".14em", color: "#22c55e", textTransform: "uppercase" }}>Best value</span>}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setStep(1)} className="btn btn--ghost">
                  <span className="label">Back</span>
                  <span className="chip"><ArrowIcon /></span>
                </button>
                <button onClick={() => setStep(3)} className="btn">
                  <span className="label">Next</span>
                  <span className="chip"><ArrowIcon /></span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Location */}
          {step === 3 && (
            <div className="calc-step fade in">
              <div className="eyebrow" style={{ marginBottom: 24 }}>Step 4 of 4 — Team preference</div>
              <h2 style={{ fontFamily: "var(--f-display)", fontSize: "clamp(32px,5vw,56px)", letterSpacing: "-.025em", margin: "0 0 32px", lineHeight: 1 }}>
                Where&apos;s your <span className="it">team?</span>
              </h2>
              <div style={{ display: "grid", gap: 10, marginBottom: 32 }}>
                {LOCATIONS.map(l => (
                  <button
                    key={l}
                    onClick={() => setLocation(l)}
                    style={{
                      padding: "18px 24px",
                      border: `1px solid ${location === l ? "var(--brand)" : "var(--line)"}`,
                      borderRadius: 12,
                      background: location === l ? "var(--brand-soft)" : "#fff",
                      fontFamily: "var(--f-sans)",
                      fontSize: 15,
                      fontWeight: 500,
                      color: location === l ? "var(--brand-deep)" : "var(--ink)",
                      cursor: "pointer",
                      transition: "all .25s",
                      textAlign: "left",
                    }}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setStep(2)} className="btn btn--ghost">
                  <span className="label">Back</span>
                  <span className="chip"><ArrowIcon /></span>
                </button>
                <button onClick={() => setStep(4)} disabled={!location} className="btn">
                  <span className="label">See my estimate</span>
                  <span className="chip"><ArrowIcon /></span>
                </button>
              </div>
            </div>
          )}

          {/* RESULTS */}
          {step === 4 && prices && (
            <div className="fade in">
              <div className="eyebrow" style={{ marginBottom: 24 }}>Your estimate</div>
              <h2 style={{ fontFamily: "var(--f-display)", fontSize: "clamp(32px,5vw,56px)", letterSpacing: "-.025em", margin: "0 0 40px", lineHeight: 1 }}>
                {projectType} <span className="it">cost estimate</span>
              </h2>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 32 }}>
                {/* Foxmen Studio */}
                <div style={{ padding: 32, background: "var(--ink)", borderRadius: 15, color: "#fff", position: "relative" }}>
                  <span style={{ position: "absolute", top: 16, right: 16, fontFamily: "var(--f-mono)", fontSize: 9, letterSpacing: ".18em", textTransform: "uppercase", background: "var(--brand)", color: "#fff", padding: "4px 10px", borderRadius: 999 }}>Recommended</span>
                  <p style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(255,255,255,.5)", margin: "0 0 16px" }}>Foxmen Studio</p>
                  <p style={{ fontFamily: "var(--f-display)", fontSize: "clamp(28px,4vw,48px)", letterSpacing: "-.03em", color: "var(--brand)", margin: 0, lineHeight: 1 }}>
                    {fmt(prices.boutique[0])} – {fmt(prices.boutique[1])}
                  </p>
                  <p style={{ color: "rgba(255,255,255,.55)", fontSize: 13, margin: "12px 0 0" }}>Boutique studio · Senior team · $65–95/hr</p>
                </div>

                {/* UK/US Agency */}
                <div style={{ padding: 32, background: "#fff", border: "1px solid var(--line)", borderRadius: 15 }}>
                  <p style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--muted)", margin: "0 0 16px" }}>UK / US Agency</p>
                  <p style={{ fontFamily: "var(--f-display)", fontSize: "clamp(28px,4vw,48px)", letterSpacing: "-.03em", color: "var(--ink)", margin: 0, lineHeight: 1 }}>
                    {fmt(prices.agency[0])} – {fmt(prices.agency[1])}
                  </p>
                  <p style={{ color: "var(--muted)", fontSize: 13, margin: "12px 0 0" }}>Traditional agency · $150–300/hr</p>
                </div>
              </div>

              {savings > 0 && (
                <div className="fade" style={{ padding: "18px 24px", background: "var(--brand-soft)", border: "1px solid var(--brand)", borderRadius: 12, marginBottom: 32 }}>
                  <p style={{ margin: 0, color: "var(--brand-deep)", fontWeight: 500 }}>
                    Potential savings with Foxmen Studio: <strong>{fmt(savings)}+</strong>
                  </p>
                </div>
              )}

              <div style={{ padding: "16px 20px", background: "#fff", border: "1px solid var(--line)", borderRadius: 12, marginBottom: 32, fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
                <strong style={{ color: "var(--ink)" }}>Your inputs:</strong> {projectType} · {features.length > 0 ? features.join(", ") : "No additional features"} · {TIMELINES[timelineIdx]?.label} · {location}
              </div>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 48 }}>
                <Link href="/contact" className="btn btn--lg">
                  <span className="label">Get an exact quote</span>
                  <span className="chip"><ArrowIcon /></span>
                </Link>
                <Link href="/tools/agency-rate-comparator" className="btn btn--ghost btn--lg">
                  <span className="label">Compare agency rates</span>
                  <span className="chip"><ArrowIcon /></span>
                </Link>
                <button onClick={() => setStep(0)} className="btn btn--ghost">
                  <span className="label">Start over</span>
                  <span className="chip"><ArrowIcon /></span>
                </button>
              </div>

              {/* Email capture */}
              <div className="fade" style={{ padding: 32, background: "var(--ink)", borderRadius: 15, color: "#fff" }}>
                <h3 style={{ fontFamily: "var(--f-display)", fontSize: 28, letterSpacing: "-.02em", color: "#fff", margin: "0 0 8px" }}>
                  Get a detailed breakdown via email
                </h3>
                <p style={{ color: "rgba(255,255,255,.7)", fontSize: 14, margin: "0 0 20px" }}>
                  We&apos;ll send you a line-by-line cost breakdown from Foxmen Studio — no commitment required.
                </p>
                {emailSent ? (
                  <p style={{ color: "var(--brand)", fontFamily: "var(--f-mono)", fontSize: 13, letterSpacing: ".12em" }}>Breakdown sent! Check your inbox.</p>
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
                      <span className="label">{emailLoading ? "Sending…" : "Send breakdown"}</span>
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
