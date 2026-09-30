"use client";
import Link from "next/link";
import Image from "next/image";
import { useScrollReveal } from "@/hooks/useScrollReveal";

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h18M13 5l7 7-7 7" />
    </svg>
  );
}

function ArrowNE() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17L17 7M17 7H7M17 7v10" />
    </svg>
  );
}

/** Decorative 3D product render — floats, masks its own edges into the
 * card background, and gets a subtle glass-lift on card hover. Desktop only
 * (hidden on mobile via .tool-visual media rule, see <style> block below). */
function ToolVisual({
  src, w, h, delay = "0s", style, deep = false,
}: { src: string; w: number; h: number; delay?: string; style?: React.CSSProperties; deep?: boolean }) {
  return (
    <div className={`tool-visual${deep ? " tool-visual--deep" : ""}`} style={{ width: w, height: h, animationDelay: delay, ...style }} aria-hidden="true">
      <span className="tool-visual-glow" />
      <div className="tool-visual-inner">
        <Image src={src} alt="" fill sizes="360px" style={{ objectFit: "contain" }} />
      </div>
    </div>
  );
}

/** Floating cluster of the four product renders, pinned to the hero's
 * bottom-right. Desktop only — purely atmospheric, so it's aria-hidden and
 * sits low enough in the section to never contend with the display headline. */
function HeroStage() {
  return (
    <div className="tools-hero-stage" aria-hidden="true">
      <span className="tools-hero-stage-tag"><span className="dot" />Live previews</span>
      <span className="tools-hero-stage-glow" />
      <ToolVisual src="/assets/tools/market-rate-bars.png" w={148} h={90} delay="0s"
        style={{ position: "absolute", top: 30, left: 6 }} />
      <ToolVisual src="/assets/tools/ai-audit-brain.png" w={140} h={94} delay="1.2s"
        style={{ position: "absolute", top: 8, right: 4 }} />
      <ToolVisual src="/assets/tools/speed-gauge.png" w={220} h={128} delay="0.6s"
        style={{ position: "absolute", bottom: 34, left: 56, zIndex: 2 }} />
      <ToolVisual src="/assets/tools/price-coins.png" w={140} h={90} delay="1.8s"
        style={{ position: "absolute", bottom: 2, right: 2 }} />
    </div>
  );
}

const TOOLS = [
  {
    num: "01", href: "/tools/website-speed-checker",
    tag: "Performance", name: "Website Speed Checker",
    tagline: "Real Core Web Vitals — LCP, FCP, CLS & TBT scored instantly. See if you pass Google's thresholds.",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>,
    bg: "var(--ink)", fg: "#fff", iconBg: "rgba(184,108,249,.18)", iconFg: "var(--brand)",
    accentLabel: "Free · Instant",
    img: "/assets/tools/speed-gauge.png",
  },
  {
    num: "02", href: "/tools/roast-my-website",
    tag: "AI Audit", name: "Roast My Website",
    tagline: "Brutally honest AI critique of your design, UX, conversion, and SEO. No sugarcoating.",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 15s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="3" /><line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="3" /></svg>,
    bg: "var(--brand-soft)", fg: "var(--ink)", iconBg: "var(--brand)", iconFg: "#fff",
    accentLabel: "AI Powered",
    img: "/assets/tools/ai-audit-brain.png",
  },
  {
    num: "03", href: "/tools/price-calculator",
    tag: "Pricing", name: "Price Calculator",
    tagline: "Budget estimate in under 2 minutes. Compare boutique studio vs traditional agency costs.",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="18" rx="2" /><line x1="8" y1="8" x2="16" y2="8" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="8" y1="16" x2="12" y2="16" /></svg>,
    bg: "#fff", fg: "var(--ink)", iconBg: "var(--ink)", iconFg: "#fff",
    accentLabel: "No signup",
    img: "/assets/tools/price-coins.png",
  },
  {
    num: "04", href: "/tools/tech-stack-recommender",
    tag: "Architecture", name: "Tech Stack Recommender",
    tagline: "AI recommends the right frontend, backend, database, and infra — tailored to your project.",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4.03 3-9 3S3 13.66 3 12" /><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" /></svg>,
    bg: "#1a1a2e", fg: "#fff", iconBg: "rgba(184,108,249,.2)", iconFg: "var(--brand)",
    accentLabel: "AI Powered",
    img: undefined as string | undefined,
  },
  {
    num: "05", href: "/tools/agency-rate-comparator",
    tag: "Market Data", name: "Agency Rate Comparator",
    tagline: "See what London, NYC, UAE, and Foxmen Studio charge — live, side by side.",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>,
    bg: "var(--bone)", fg: "var(--ink)", iconBg: "var(--ink)", iconFg: "#fff",
    accentLabel: "Market rates",
    img: "/assets/tools/market-rate-bars.png",
  },
];

export default function ToolsPage() {
  useScrollReveal(".fade, .reveal");

  return (
    <>
      <style>{`
        .tools-bento { padding: 80px 0 120px; }
        .tools-row1 { display: grid; grid-template-columns: 1.15fr 1fr; gap: 12px; margin-bottom: 12px; }
        .tools-row1-right { display: flex; flex-direction: column; gap: 12px; }
        .tools-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .tools-why-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1px; background: rgba(255,255,255,.07); border-radius: 20px; overflow: hidden; }
        .tools-card-featured { min-height: 400px; }
        .tools-divider-row { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; font-family: var(--f-mono); font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); }

        /* ── Product-render visuals (desktop only) ── */
        .tool-card { position: relative; }
        .tool-visual {
          position: relative;
          flex-shrink: 0;
          pointer-events: none;
          animation: tool-float 6.5s ease-in-out infinite;
          will-change: transform;
        }
        .tool-visual-glow {
          position: absolute; inset: 8%;
          background: radial-gradient(closest-side, rgba(184,108,249,.45), rgba(184,108,249,0) 72%);
          filter: blur(26px);
          z-index: 0;
        }
        .tool-visual-inner {
          position: relative; width: 100%; height: 100%; z-index: 1;
          transition: transform .6s cubic-bezier(.16,1,.3,1);
          -webkit-mask-image: radial-gradient(ellipse 70% 72% at 50% 50%, #000 58%, transparent 98%);
          mask-image: radial-gradient(ellipse 70% 72% at 50% 50%, #000 58%, transparent 98%);
        }
        /* Deeper feather for renders sitting on a dark card — softens the
           photo's own light backdrop into the black rather than clipping it. */
        .tool-visual--deep .tool-visual-inner {
          -webkit-mask-image: radial-gradient(ellipse 62% 64% at 50% 52%, #000 0%, rgba(0,0,0,.85) 30%, rgba(0,0,0,.35) 60%, transparent 96%);
          mask-image: radial-gradient(ellipse 62% 64% at 50% 52%, #000 0%, rgba(0,0,0,.85) 30%, rgba(0,0,0,.35) 60%, transparent 96%);
        }
        .tool-card:hover .tool-visual-inner { transform: scale(1.08) rotate(-2deg); }
        @keyframes tool-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50%      { transform: translateY(-10px) rotate(1deg); }
        }
        .tool-icon-orbit { position: relative; }
        .tool-icon-orbit::before {
          content: ""; position: absolute; inset: -14px; border-radius: 50%;
          background: conic-gradient(from 0deg, rgba(184,108,249,0) 0%, var(--brand) 18%, rgba(184,108,249,0) 40%);
          opacity: .55; animation: spin 7s linear infinite;
        }
        .tool-icon-orbit::after {
          content: ""; position: absolute; inset: -14px; border-radius: 50%;
          border: 1px solid rgba(184,108,249,.18);
        }

        /* ── Hero stage — floating render cluster, bottom-right of hero ── */
        .tools-hero-stage {
          position: absolute; right: clamp(24px, 4vw, 64px); bottom: 22px;
          width: 340px; height: 340px;
          pointer-events: none;
        }
        .tools-hero-stage::before {
          content: ""; position: absolute; inset: 32px; border-radius: 50%;
          border: 1px dashed rgba(140,59,217,.2);
          animation: spin 46s linear infinite;
        }
        .tools-hero-stage-glow {
          position: absolute; inset: 12%;
          background: radial-gradient(closest-side, rgba(184,108,249,.28), rgba(184,108,249,0) 72%);
          filter: blur(30px);
        }
        .tools-hero-stage-tag {
          position: absolute; left: 4px; top: -6px; z-index: 3;
          display: inline-flex; align-items: center; gap: 7px;
          font-family: var(--f-mono); font-size: 10px; letter-spacing: .14em; text-transform: uppercase;
          color: var(--brand-deep); background: rgba(255,255,255,.75);
          padding: 6px 12px; border-radius: 999px; border: 1px solid rgba(140,59,217,.18);
        }
        .tools-hero-stage-tag .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--brand); }
        @media (max-width: 1240px) {
          .tools-hero-stage { display: none; }
        }

        /* ── Why-section cards ── */
        .why-cell {
          position: relative;
          transition: background .35s var(--ease, ease), transform .35s var(--ease, ease);
        }
        .why-cell:hover { background: var(--ink-2) !important; }
        .why-cell .why-num {
          font-family: var(--f-mono); font-size: 11px; letter-spacing: .14em;
          color: rgba(255,255,255,.28); margin-bottom: 20px;
        }
        .why-cell .why-icon {
          width: 44px; height: 44px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(184,108,249,.12); color: var(--brand);
          font-size: 18px; margin-bottom: 20px;
          transition: transform .4s cubic-bezier(.16,1,.3,1), background .35s ease;
        }
        .why-cell:hover .why-icon { transform: scale(1.1) rotate(-6deg); background: rgba(184,108,249,.22); }

        @media (prefers-reduced-motion: reduce) {
          .tool-visual, .tool-icon-orbit::before, .tools-hero-stage::before { animation: none; }
          .tool-card:hover .tool-visual-inner { transform: none; }
        }
        @media (max-width: 760px) {
          .tools-bento { padding: 40px 0 72px; }
          .tools-row1 { grid-template-columns: 1fr; }
          .tools-row2 { grid-template-columns: 1fr; }
          .tools-why-grid { grid-template-columns: 1fr; border-radius: 14px; }
          .tools-card-featured { min-height: 300px; padding: 28px 24px 24px !important; }
          .tools-card-sm { padding: 22px 20px !important; }
          .tools-card-md { padding: 26px 24px !important; min-height: 220px !important; }
          .tools-divider-row { gap: 12px; }
          .tools-divider-sep { display: none !important; }
          .tool-visual, .tool-icon-orbit::before, .tool-icon-orbit::after { display: none; }
        }
      `}</style>
      {/* ── HERO ── */}
      <section className="page-hero" style={{ position: "relative" }}>
        <HeroStage />
        <div className="wrap">

          {/* SaaS badge */}
          <div className="fade in" style={{ marginBottom: 28 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "var(--brand-soft)", color: "var(--brand-deep)",
              fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: ".16em",
              textTransform: "uppercase", padding: "6px 14px",
              borderRadius: 999, border: "1px solid rgba(184,108,249,.3)",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--brand)", display: "inline-block" }} />
              5 free tools · No signup required
            </span>
          </div>

          <div className="crumbs fade in">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <span>Free Tools</span>
          </div>
          <h1 className="display">
            <span className="reveal in"><span className="reveal-inner">Free tools,</span></span>
            <span className="reveal in reveal-delay-1"><span className="reveal-inner">real <span className="it">insights.</span></span></span>
          </h1>
          <p className="lede fade in d2">
            No fluff. No paywalls. Five tools built by Foxmen Studio to help you make smarter decisions about your next digital project — in minutes.
          </p>

          {/* Hero CTA row */}
          <div className="fade in d3" style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 36 }}>
            <Link href="/tools/website-speed-checker" className="btn">
              <span className="label">Check your speed</span>
              <span className="chip"><Arrow /></span>
            </Link>
            <Link href="/tools/roast-my-website" className="btn btn--ghost">
              <span className="label">Roast my website</span>
              <span className="chip"><Arrow /></span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div style={{ borderTop: "1px solid var(--line)", padding: "14px 0" }}>
        <div className="wrap">
          <div className="fade in tools-divider-row">
            <span>05 Tools</span>
            <span className="tools-divider-sep" style={{ width: 1, height: 12, background: "var(--line)", display: "inline-block" }} />
            <span>Always free</span>
            <span className="tools-divider-sep" style={{ width: 1, height: 12, background: "var(--line)", display: "inline-block" }} />
            <span>No account needed</span>
            <span className="tools-divider-sep" style={{ width: 1, height: 12, background: "var(--line)", display: "inline-block" }} />
            <span>Built by Foxmen Studio</span>
          </div>
        </div>
      </div>

      {/* ── TOOLS BENTO ── */}
      <section className="tools-bento">
        <div className="wrap">

          <div className="fade in" style={{ marginBottom: 40, maxWidth: 640 }}>
            <span className="eyebrow">The toolkit</span>
            <h2 style={{ fontFamily: "var(--f-display)", fontSize: "clamp(30px,3.6vw,48px)", letterSpacing: "-.025em", lineHeight: 1.08, margin: "16px 0 0", color: "var(--ink)" }}>
              Five tools, <span className="it" style={{ fontStyle: "italic", color: "var(--brand)" }}>zero friction.</span>
            </h2>
          </div>

          {/* Row 1: Featured (01) + Side column (02 + 03) */}
          <div className="tools-row1">

            {/* CARD 01 — Featured dark */}
            <Link href={TOOLS[0].href} className="fade in tool-card tools-card-featured" style={{
              display: "flex", flexDirection: "column",
              background: TOOLS[0].bg, color: TOOLS[0].fg,
              borderRadius: 20, padding: "44px 44px 36px",
              textDecoration: "none", overflow: "hidden",
              transition: "transform .5s cubic-bezier(.16,1,.3,1), box-shadow .5s cubic-bezier(.16,1,.3,1)",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 32px 80px -20px rgba(0,0,0,.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
            >
              {/* Top */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative", zIndex: 1 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: TOOLS[0].iconBg, display: "flex", alignItems: "center", justifyContent: "center", color: TOOLS[0].iconFg }}>
                  {TOOLS[0].icon}
                </div>
                <span style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: ".16em", textTransform: "uppercase", background: "rgba(184,108,249,.2)", color: "var(--brand)", padding: "5px 12px", borderRadius: 999 }}>
                  {TOOLS[0].accentLabel}
                </span>
              </div>

              {/* Body */}
              <div style={{ marginTop: "auto", paddingTop: 40, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24 }}>
                <div style={{ position: "relative", zIndex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(255,255,255,.3)", marginBottom: 8 }}>
                    {TOOLS[0].tag} · {TOOLS[0].num}
                  </div>
                  <h2 style={{ fontFamily: "var(--f-display)", fontSize: "clamp(28px,3.5vw,44px)", letterSpacing: "-.025em", lineHeight: 1.1, margin: "0 0 12px", color: "#fff" }}>
                    {TOOLS[0].name}
                  </h2>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,.55)", lineHeight: 1.65, margin: "0 0 28px", maxWidth: 380 }}>
                    {TOOLS[0].tagline}
                  </p>
                  <span className="btn btn--sm" style={{ "--bg": "var(--brand)", "--fg": "#fff", "--chip": "rgba(0,0,0,.2)", "--chipfg": "#fff", display: "inline-flex" } as React.CSSProperties}>
                    <span className="label">Try free</span>
                    <span className="chip"><Arrow /></span>
                  </span>
                </div>
                {TOOLS[0].img && <ToolVisual src={TOOLS[0].img} w={320} h={184} style={{ marginBottom: 4 }} deep />}
              </div>
            </Link>

            {/* Right column */}
            <div className="tools-row1-right">
              {[TOOLS[1], TOOLS[2]].map((tool, i) => (
                <Link key={tool.href} href={tool.href} className={`fade in d${i + 1} tool-card tools-card-sm`} style={{
                  display: "flex", flexDirection: "column",
                  background: tool.bg, color: tool.fg,
                  borderRadius: 20, padding: "28px 32px",
                  textDecoration: "none", flex: 1, position: "relative", overflow: "hidden",
                  border: tool.bg === "#fff" ? "1px solid var(--line)" : "none",
                  transition: "transform .5s cubic-bezier(.16,1,.3,1), box-shadow .4s cubic-bezier(.16,1,.3,1)",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 20px 50px -16px rgba(0,0,0,.15)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
                >
                  {tool.img && (
                    <ToolVisual
                      src={tool.img} w={208} h={124} delay={i === 0 ? "0s" : "1.4s"}
                      style={{ position: "absolute", right: -18, bottom: -18 }}
                    />
                  )}
                  <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 11, background: tool.iconBg, display: "flex", alignItems: "center", justifyContent: "center", color: tool.iconFg, flexShrink: 0 }}>
                        {tool.icon}
                      </div>
                      <div>
                        <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: tool.fg === "#fff" ? "rgba(255,255,255,.4)" : "var(--muted)" }}>
                          {tool.tag}
                        </div>
                        <div style={{ fontFamily: "var(--f-display)", fontSize: "clamp(17px,1.8vw,22px)", letterSpacing: "-.02em", lineHeight: 1.2 }}>
                          {tool.name}
                        </div>
                      </div>
                    </div>
                    <div style={{
                      width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                      border: `1px solid ${tool.fg === "#fff" ? "rgba(255,255,255,.2)" : "var(--line)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: tool.fg === "#fff" ? "rgba(255,255,255,.5)" : "var(--muted)",
                    }}>
                      <ArrowNE />
                    </div>
                  </div>
                  <p style={{ position: "relative", zIndex: 1, fontSize: 13, color: tool.fg === "#fff" ? "rgba(255,255,255,.55)" : "var(--muted)", lineHeight: 1.6, margin: "16px 0 0", maxWidth: tool.img ? "76%" : "none" }}>
                    {tool.tagline}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Row 2: Tools 04 + 05 */}
          <div className="tools-row2">
            {[TOOLS[3], TOOLS[4]].map((tool, i) => (
              <Link key={tool.href} href={tool.href} className={`fade in d${i + 2} tool-card tools-card-md`} style={{
                display: "flex", flexDirection: "column",
                background: tool.bg, color: tool.fg,
                borderRadius: 20, padding: "36px 40px",
                textDecoration: "none", minHeight: 260, position: "relative", overflow: "hidden",
                border: tool.bg === "var(--bone)" ? "1px solid var(--line)" : "none",
                transition: "transform .5s cubic-bezier(.16,1,.3,1), box-shadow .4s cubic-bezier(.16,1,.3,1)",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 20px 50px -16px ${tool.fg === "#fff" ? "rgba(0,0,0,.35)" : "rgba(0,0,0,.12)"}`;}}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
              >
                {tool.img && (
                  <ToolVisual
                    src={tool.img} w={280} h={162} delay="0.7s"
                    style={{ position: "absolute", right: -6, bottom: -10 }}
                  />
                )}
                <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div className={!tool.img ? "tool-icon-orbit" : undefined} style={{ width: 44, height: 44, borderRadius: 12, background: tool.iconBg, display: "flex", alignItems: "center", justifyContent: "center", color: tool.iconFg }}>
                    {tool.icon}
                  </div>
                  <span style={{
                    fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase",
                    background: tool.fg === "#fff" ? "rgba(184,108,249,.2)" : "var(--brand-soft)",
                    color: tool.fg === "#fff" ? "var(--brand)" : "var(--brand-deep)",
                    padding: "4px 10px", borderRadius: 999,
                  }}>
                    {tool.accentLabel}
                  </span>
                </div>
                <div style={{ position: "relative", zIndex: 1, marginTop: "auto", paddingTop: 28 }}>
                  <div style={{ fontFamily: "var(--f-mono)", fontSize: 10, letterSpacing: ".16em", textTransform: "uppercase", color: tool.fg === "#fff" ? "rgba(255,255,255,.3)" : "var(--muted)", marginBottom: 8 }}>
                    {tool.tag} · {tool.num}
                  </div>
                  <h3 style={{ fontFamily: "var(--f-display)", fontSize: "clamp(20px,2.5vw,30px)", letterSpacing: "-.02em", lineHeight: 1.1, margin: "0 0 8px" }}>
                    {tool.name}
                  </h3>
                  <p style={{ fontSize: 13, color: tool.fg === "#fff" ? "rgba(255,255,255,.5)" : "var(--muted)", lineHeight: 1.6, margin: "0 0 22px", maxWidth: tool.img ? "66%" : "none" }}>
                    {tool.tagline}
                  </p>
                  <span className="btn btn--sm" style={{
                    "--bg": tool.fg === "#fff" ? "rgba(255,255,255,.12)" : "var(--ink)",
                    "--fg": tool.fg === "#fff" ? "#fff" : "#fff",
                    "--chip": tool.fg === "#fff" ? "rgba(255,255,255,.15)" : "rgba(255,255,255,.15)",
                    "--chipfg": "#fff",
                    display: "inline-flex",
                  } as React.CSSProperties}>
                    <span className="label">Try free</span>
                    <span className="chip"><Arrow /></span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY SECTION ── */}
      <section style={{ background: "var(--ink)", padding: "96px 0" }}>
        <div className="wrap">
          <div className="fade in" style={{ marginBottom: 56 }}>
            <span className="eyebrow" style={{ color: "var(--brand)" }}>Why free tools</span>
            <h2 style={{ fontFamily: "var(--f-display)", fontSize: "clamp(32px,4vw,52px)", letterSpacing: "-.025em", lineHeight: 1.05, margin: "16px 0 0", color: "#fff" }}>
              Built to help you <span style={{ fontStyle: "italic", color: "var(--brand)" }}>decide faster.</span>
            </h2>
          </div>

          <div className="tools-why-grid">
            {[
              { icon: "↗", title: "Real data, live", body: "Every tool uses live data — real Core Web Vitals from Google, real market rates from agency research, real AI analysis. Not benchmarks we made up." },
              { icon: "⚡", title: "Results in seconds", body: "Speed checks return in under 30 seconds. AI audits in 10–20. Price estimates instantly. Built for founders who don't have time to wait." },
              { icon: "✉", title: "Email, not spam", body: "Get your full report by email. We follow up only when we can actually help — never automated drip. Just useful context from the team." },
            ].map((w, i) => (
              <div key={w.title} className={`fade d${i + 1} why-cell`} style={{ padding: "40px 36px", background: "var(--ink)" }}>
                <div className="why-num">0{i + 1}</div>
                <div className="why-icon">{w.icon}</div>
                <h3 style={{ fontFamily: "var(--f-display)", fontSize: 22, letterSpacing: "-.02em", margin: "0 0 12px", color: "#fff" }}>{w.title}</h3>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,.5)", lineHeight: 1.65, margin: 0 }}>{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "60px 0" }}>
        <div className="cta">
          <div className="wrap-tight">
            <div className="fade in"><span className="eyebrow">Ready to build?</span></div>
            <h2 className="fade in d1">
              Got your numbers? <span className="it">Let&apos;s talk.</span>
            </h2>
            <div className="row fade in d2">
              <Link href="/contact" className="btn btn--lg">
                <span className="label">Start a project</span>
                <span className="chip"><Arrow /></span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
