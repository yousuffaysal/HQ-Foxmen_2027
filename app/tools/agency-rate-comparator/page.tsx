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

type ServiceKey = "Web" | "Mobile" | "AI" | "Design";

const TABS: ServiceKey[] = ["Web", "Mobile", "AI", "Design"];

type Agency = {
  name: string;
  location: string;
  flag: string;
  rateMin: number;
  rateMax: number;
  currency: string;
  note: string;
  highlight?: boolean;
};

const RATES: Record<ServiceKey, Agency[]> = {
  Web: [
    { name: "London Agency",      location: "London, UK",     flag: "🇬🇧", rateMin: 150, rateMax: 250, currency: "£", note: "Senior dev + PM overhead" },
    { name: "NYC Agency",         location: "New York, US",   flag: "🇺🇸", rateMin: 175, rateMax: 300, currency: "$", note: "Top-tier talent, high overhead" },
    { name: "UAE Agency",         location: "Dubai, UAE",     flag: "🇦🇪", rateMin: 80,  rateMax: 150, currency: "$", note: "Mid-market rates" },
    { name: "Foxmen Studio",      location: "Remote-first",   flag: "🦊", rateMin: 65,  rateMax: 95,  currency: "$", note: "Senior team, boutique rates", highlight: true },
  ],
  Mobile: [
    { name: "London Agency",      location: "London, UK",     flag: "🇬🇧", rateMin: 160, rateMax: 270, currency: "£", note: "iOS + Android specialists" },
    { name: "NYC Agency",         location: "New York, US",   flag: "🇺🇸", rateMin: 185, rateMax: 320, currency: "$", note: "Native-first teams" },
    { name: "UAE Agency",         location: "Dubai, UAE",     flag: "🇦🇪", rateMin: 90,  rateMax: 160, currency: "$", note: "React Native focused" },
    { name: "Foxmen Studio",      location: "Remote-first",   flag: "🦊", rateMin: 70,  rateMax: 100, currency: "$", note: "RN + native Swift/Kotlin", highlight: true },
  ],
  AI: [
    { name: "London Agency",      location: "London, UK",     flag: "🇬🇧", rateMin: 200, rateMax: 350, currency: "£", note: "ML engineers + data science" },
    { name: "NYC Agency",         location: "New York, US",   flag: "🇺🇸", rateMin: 225, rateMax: 400, currency: "$", note: "AI/ML specialists" },
    { name: "UAE Agency",         location: "Dubai, UAE",     flag: "🇦🇪", rateMin: 100, rateMax: 180, currency: "$", note: "Growing AI talent pool" },
    { name: "Foxmen Studio",      location: "Remote-first",   flag: "🦊", rateMin: 80,  rateMax: 120, currency: "$", note: "RAG, agents, fine-tuning", highlight: true },
  ],
  Design: [
    { name: "London Agency",      location: "London, UK",     flag: "🇬🇧", rateMin: 130, rateMax: 220, currency: "£", note: "Senior UX + brand" },
    { name: "NYC Agency",         location: "New York, US",   flag: "🇺🇸", rateMin: 150, rateMax: 275, currency: "$", note: "Top branding studios" },
    { name: "UAE Agency",         location: "Dubai, UAE",     flag: "🇦🇪", rateMin: 70,  rateMax: 130, currency: "$", note: "Bilingual design teams" },
    { name: "Foxmen Studio",      location: "Remote-first",   flag: "🦊", rateMin: 60,  rateMax: 90,  currency: "$", note: "UI/UX + design systems", highlight: true },
  ],
};

function fmt(n: number, currency: string) {
  return `${currency}${n.toLocaleString()}`;
}

export default function AgencyRateComparatorPage() {
  useScrollReveal();

  const [activeTab, setActiveTab] = useState<ServiceKey>("Web");
  const [hours, setHours] = useState(100);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  const agencies = RATES[activeTab];
  const foxmen = agencies.find(a => a.highlight)!;

  async function handleEmailCapture(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setEmailLoading(true);
    try {
      await fetch("/api/tools/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, tool: "agency-rate-comparator", summary: { service: activeTab, hours } }),
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
            <span>Agency Rate Comparator</span>
          </div>
          <h1>
            <span className="reveal in"><span className="reveal-inner">What do</span></span>
            <span className="reveal in reveal-delay-1"><span className="reveal-inner">agencies <span className="it">actually</span></span></span>
            <span className="reveal in reveal-delay-2"><span className="reveal-inner">charge?</span></span>
          </h1>
          <p className="lede fade in d2">
            Real hourly rates across London, NYC, UAE, and Foxmen Studio — side by side. See exactly what you save by choosing the right partner.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 64 }}>
        <div className="wrap">

          {/* Service tabs */}
          <div className="fade in" style={{ display: "flex", gap: 8, marginBottom: 48 }}>
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "10px 20px",
                  border: `1px solid ${activeTab === tab ? "var(--ink)" : "var(--line)"}`,
                  borderRadius: "var(--r-pill)",
                  background: activeTab === tab ? "var(--ink)" : "#fff",
                  color: activeTab === tab ? "#fff" : "var(--ink)",
                  fontFamily: "var(--f-sans)",
                  fontSize: 14,
                  cursor: "pointer",
                  transition: "all .25s",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Rate table */}
          <div className="rate-table fade in">
            <div className="rate-table-head">
              <div>Agency</div>
              <div>Location</div>
              <div>Hourly rate</div>
              <div style={{ textAlign: "right" }}>
                {hours} hrs · cost
              </div>
            </div>
            {agencies.map((agency, i) => {
              const projectCostMin = agency.rateMin * hours;
              const projectCostMax = agency.rateMax * hours;
              const savingsVsThis = (agency.rateMin - foxmen.rateMin) * hours;
              return (
                <div key={agency.name} className={`rate-table-row${agency.highlight ? " highlight" : ""} fade d${i}`}>
                  <div className="rate-table-agency">
                    <span className="rate-table-flag">{agency.flag}</span>
                    <div>
                      <div className="rate-table-name">{agency.name}</div>
                      <div className="rate-table-note">{agency.note}</div>
                    </div>
                  </div>
                  <div className="rate-table-location">{agency.location}</div>
                  <div className="rate-table-rate">
                    <span className="rate-table-rate-range">
                      {fmt(agency.rateMin, agency.currency)} – {fmt(agency.rateMax, agency.currency)}<span style={{ fontSize: 12, color: "var(--muted)" }}>/hr</span>
                    </span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "var(--f-display)", fontSize: 20, letterSpacing: "-.02em", color: agency.highlight ? "var(--brand)" : "var(--ink)" }}>
                      {fmt(projectCostMin, agency.currency)} – {fmt(projectCostMax, agency.currency)}
                    </div>
                    {!agency.highlight && savingsVsThis > 0 && (
                      <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: ".12em", color: "#22c55e", marginTop: 4 }}>
                        Save ${savingsVsThis.toLocaleString()}+ vs Foxmen Studio
                      </div>
                    )}
                    {agency.highlight && (
                      <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: ".12em", color: "var(--brand)", marginTop: 4 }}>
                        Best value
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Hours slider */}
          <div className="fade" style={{ marginTop: 48, padding: 32, background: "#fff", border: "1px solid var(--line)", borderRadius: 15 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <span style={{ fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--muted)" }}>
                Estimate by project hours
              </span>
              <span style={{ fontFamily: "var(--f-display)", fontSize: 28, letterSpacing: "-.02em" }}>{hours} hours</span>
            </div>
            <input
              type="range"
              min={10}
              max={1000}
              step={10}
              value={hours}
              onChange={e => setHours(Number(e.target.value))}
              style={{ width: "100%", accentColor: "var(--brand)" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
              <span style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: "var(--muted)" }}>10 hrs</span>
              <span style={{ fontFamily: "var(--f-mono)", fontSize: 10, color: "var(--muted)" }}>1,000 hrs</span>
            </div>
            <div style={{ marginTop: 24, padding: "16px 20px", background: "var(--brand-soft)", borderRadius: 10 }}>
              <p style={{ margin: 0, fontSize: 15, color: "var(--brand-deep)" }}>
                At {hours} hours, choosing Foxmen Studio over a London agency saves you{" "}
                <strong>${((RATES[activeTab].find(a => a.location === "London, UK")!.rateMin - foxmen.rateMin) * hours).toLocaleString()}–${((RATES[activeTab].find(a => a.location === "London, UK")!.rateMax - foxmen.rateMax) * hours).toLocaleString()}</strong> on this project.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="fade" style={{ marginTop: 48, display: "flex", gap: 16, flexWrap: "wrap" }}>
            <Link href="/contact" className="btn btn--lg">
              <span className="label">Get a quote from Foxmen Studio</span>
              <span className="chip"><ArrowIcon /></span>
            </Link>
            <Link href="/tools/price-calculator" className="btn btn--ghost btn--lg">
              <span className="label">Calculate project cost</span>
              <span className="chip"><ArrowIcon /></span>
            </Link>
          </div>

          {/* Email capture */}
          <div className="fade" style={{ marginTop: 48, padding: 32, background: "var(--ink)", borderRadius: 15, color: "#fff" }}>
            <h3 style={{ fontFamily: "var(--f-display)", fontSize: 28, letterSpacing: "-.02em", color: "#fff", margin: "0 0 8px" }}>
              Get the full rate card via email
            </h3>
            <p style={{ color: "rgba(255,255,255,.7)", fontSize: 14, margin: "0 0 20px" }}>
              We&apos;ll send you a detailed breakdown of agency rates by service and region — from Foxmen Studio.
            </p>
            {emailSent ? (
              <p style={{ color: "var(--brand)", fontFamily: "var(--f-mono)", fontSize: 13, letterSpacing: ".12em" }}>Rate card sent! Check your inbox.</p>
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
                  <span className="label">{emailLoading ? "Sending…" : "Send rate card"}</span>
                  <span className="chip"><ArrowIcon /></span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
