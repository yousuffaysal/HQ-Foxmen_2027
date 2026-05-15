"use client";
import { useState, useRef, useEffect, useCallback } from "react";

/* ── Types ───────────────────────────────────────────────────── */
type Msg     = { role: "user" | "assistant"; content: string };
type Stage   = "discovery" | "features" | "email" | "done";
type Feature = { id: string; label: string; desc: string; priceMin: number; priceMax: number; checked: boolean };
type Phase   = { phase: string; duration: string; what: string };

/* ── Static data ─────────────────────────────────────────────── */
const FEATURE_SETS: Record<string, Feature[]> = {
  "Website": [
    { id: "cms",        label: "Content Management System", desc: "Edit pages without touching code",           priceMin: 1000, priceMax: 1800,  checked: true  },
    { id: "blog",       label: "Blog / Journal",            desc: "Articles, categories, SEO",                  priceMin: 600,  priceMax: 1200,  checked: false },
    { id: "contact",    label: "Contact Form + Leads",      desc: "Smart form with email notifications",        priceMin: 300,  priceMax: 600,   checked: true  },
    { id: "auth",       label: "User Accounts & Auth",      desc: "Login, registration, protected pages",       priceMin: 1500, priceMax: 3000,  checked: false },
    { id: "animations", label: "Premium Animations",        desc: "GSAP / Framer Motion interactions",          priceMin: 1200, priceMax: 2500,  checked: false },
    { id: "multilang",  label: "Multi-language",            desc: "Full i18n for global reach",                 priceMin: 1800, priceMax: 3500,  checked: false },
    { id: "analytics",  label: "Analytics Dashboard",       desc: "Custom reporting + GA4 integration",         priceMin: 800,  priceMax: 1500,  checked: false },
    { id: "ecom",       label: "E-commerce Integration",    desc: "Product pages, cart, checkout",              priceMin: 3000, priceMax: 6000,  checked: false },
  ],
  "Mobile App": [
    { id: "auth",    label: "User Authentication",     desc: "Email, social login, JWT sessions",             priceMin: 1200, priceMax: 2500,  checked: true  },
    { id: "push",    label: "Push Notifications",      desc: "Firebase / APNs messaging",                     priceMin: 600,  priceMax: 1200,  checked: false },
    { id: "offline", label: "Offline Mode",            desc: "Local-first data sync",                         priceMin: 1800, priceMax: 3500,  checked: false },
    { id: "camera",  label: "Camera & Media Upload",   desc: "Photo, video, file picker",                     priceMin: 1000, priceMax: 2000,  checked: false },
    { id: "maps",    label: "Maps & Location",         desc: "Mapbox / Google Maps integration",              priceMin: 1200, priceMax: 2500,  checked: false },
    { id: "payments",label: "In-app Payments",         desc: "Stripe, Apple Pay, Google Pay",                 priceMin: 1800, priceMax: 3500,  checked: false },
    { id: "social",  label: "Social Features",         desc: "Feed, follow, likes, comments",                 priceMin: 2500, priceMax: 5000,  checked: false },
    { id: "admin",   label: "Web Admin Dashboard",     desc: "Manage users, content, analytics",              priceMin: 2500, priceMax: 5000,  checked: false },
  ],
  "E-commerce": [
    { id: "catalog",     label: "Product Catalog",          desc: "Listings, variants, search & filters",     priceMin: 1500, priceMax: 3000,  checked: true  },
    { id: "cart",        label: "Cart & Checkout",          desc: "Full cart with discount codes",             priceMin: 1200, priceMax: 2500,  checked: true  },
    { id: "payments",    label: "Payment Gateway",          desc: "Stripe / PayPal integration",              priceMin: 1000, priceMax: 2000,  checked: true  },
    { id: "inventory",   label: "Inventory Management",     desc: "Stock tracking, low-stock alerts",         priceMin: 1200, priceMax: 2500,  checked: false },
    { id: "multivendor", label: "Multi-vendor / Marketplace",desc:"Seller onboarding, split payouts",         priceMin: 4000, priceMax: 8000,  checked: false },
    { id: "reviews",     label: "Reviews & Ratings",        desc: "Verified purchase reviews",                priceMin: 600,  priceMax: 1200,  checked: false },
    { id: "email",       label: "Email Marketing",          desc: "Campaigns, abandoned cart, lifecycle",     priceMin: 1200, priceMax: 2500,  checked: false },
    { id: "analytics",   label: "Analytics Dashboard",      desc: "Sales, conversion, customer LTV",         priceMin: 1500, priceMax: 3000,  checked: false },
  ],
  "AI Tool": [
    { id: "llm",       label: "LLM Integration",        desc: "GPT-4o / Claude / Groq API wiring",           priceMin: 1500, priceMax: 3000,  checked: true  },
    { id: "rag",       label: "RAG / Knowledge Base",   desc: "Your docs as AI context",                     priceMin: 2500, priceMax: 5000,  checked: false },
    { id: "agents",    label: "AI Agents",              desc: "Multi-step autonomous task chains",            priceMin: 3500, priceMax: 7000,  checked: false },
    { id: "vectordb",  label: "Vector Database",        desc: "Pinecone / pgvector semantic search",         priceMin: 1200, priceMax: 2500,  checked: false },
    { id: "streaming", label: "Streaming UI",           desc: "Real-time token streaming interface",          priceMin: 600,  priceMax: 1200,  checked: true  },
    { id: "finetune",  label: "Model Fine-tuning",      desc: "Custom model trained on your data",           priceMin: 4000, priceMax: 8000,  checked: false },
    { id: "api",       label: "API / Webhook Layer",    desc: "Connect with your existing stack",            priceMin: 1500, priceMax: 3000,  checked: false },
    { id: "dashboard", label: "Usage Dashboard",        desc: "Costs, logs, conversation analytics",         priceMin: 2000, priceMax: 4000,  checked: false },
  ],
  "Branding": [
    { id: "logo",         label: "Logo Design",           desc: "Primary mark + variations + guidelines",   priceMin: 1500, priceMax: 3500,  checked: true  },
    { id: "colors",       label: "Color System",           desc: "Primary, secondary, semantic tokens",     priceMin: 500,  priceMax: 1000,  checked: true  },
    { id: "typography",   label: "Typography System",      desc: "Font pairing + scale + usage rules",      priceMin: 500,  priceMax: 1000,  checked: true  },
    { id: "guidelines",   label: "Brand Guidelines PDF",   desc: "Full usage rules document",               priceMin: 1000, priceMax: 2000,  checked: false },
    { id: "social",       label: "Social Media Templates", desc: "Figma templates for all channels",        priceMin: 1200, priceMax: 2500,  checked: false },
    { id: "motion",       label: "Motion Design",          desc: "Logo animation, UI transitions",          priceMin: 2000, priceMax: 4500,  checked: false },
    { id: "designsystem", label: "Design System",          desc: "Full Figma component library",            priceMin: 3500, priceMax: 7000,  checked: false },
  ],
};

const BASE_PRICES: Record<string, [number, number]> = {
  "Website":    [3000,  6000],
  "Mobile App": [8000,  15000],
  "E-commerce": [5000,  10000],
  "AI Tool":    [10000, 20000],
  "Branding":   [3000,  6000],
};

const PROCESS_PHASES: Record<string, Phase[]> = {
  "Website": [
    { phase: "Discovery",   duration: "1 wk",   what: "Requirements, sitemap, content audit, tech stack decision" },
    { phase: "Design",      duration: "1–2 wk", what: "Wireframes, UI system, responsive layouts, brand alignment" },
    { phase: "Build",       duration: "3–6 wk", what: "Next.js development, CMS setup, integrations, animations" },
    { phase: "QA & Launch", duration: "1 wk",  what: "Cross-browser testing, Lighthouse audit, deployment, handoff" },
  ],
  "Mobile App": [
    { phase: "Discovery",   duration: "1 wk",   what: "User flows, tech stack, API design, platform decisions" },
    { phase: "Design",      duration: "2 wk",   what: "UI/UX for iOS & Android, design system, prototype" },
    { phase: "Build",       duration: "4–8 wk", what: "React Native / Flutter development, backend, integrations" },
    { phase: "QA & Launch", duration: "1–2 wk", what: "Device testing, App Store / Play Store submission" },
  ],
  "E-commerce": [
    { phase: "Discovery",   duration: "1 wk",   what: "Product structure, payment flows, vendor requirements" },
    { phase: "Design",      duration: "1–2 wk", what: "Commerce UX, product pages, checkout flow, brand" },
    { phase: "Build",       duration: "4–8 wk", what: "Platform setup, integrations, payment wiring, admin panel" },
    { phase: "QA & Launch", duration: "1 wk",  what: "Order flow testing, payment testing, performance, go-live" },
  ],
  "AI Tool": [
    { phase: "Discovery",   duration: "1 wk",   what: "Use-case mapping, data audit, model selection, API review" },
    { phase: "Prototype",   duration: "1–2 wk", what: "Working MVP — model wired, basic UI, proof-of-concept" },
    { phase: "Build",       duration: "3–8 wk", what: "Full stack implementation, RAG pipeline, UI, testing" },
    { phase: "QA & Launch", duration: "1 wk",  what: "Accuracy testing, latency benchmarks, monitoring setup" },
  ],
  "Branding": [
    { phase: "Discovery",   duration: "1 wk",   what: "Brand audit, competitor analysis, positioning workshop" },
    { phase: "Concepts",    duration: "1–2 wk", what: "3 direction concepts, moodboards, logo exploration" },
    { phase: "Refinement",  duration: "1–2 wk", what: "Selected direction refined, full system built out" },
    { phase: "Delivery",    duration: "1 wk",   what: "All files, guidelines PDF, Figma handoff, asset export" },
  ],
};

const GREETING = "Hey — I'm Fox, Foxmen Studio's AI.\n\nWhat are you trying to build?";

/* ── Small components ────────────────────────────────────────── */
function LogoMark({ size = 20 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 114.86 114.86" fill="none">
      <g stroke="rgba(184,108,249,.35)" strokeWidth="1.6" strokeLinejoin="round">
        <polygon fill="#b86cf9" points="86.85 27.97 86.89 43.89 71.15 43.84 56.73 27.97 27.95 27.97 27.76 1.03 58.44 1 86.89 27.97 86.85 27.97"/>
        <polygon fill="#b86cf9" points="113.86 58.46 86.94 86.79 86.94 87.06 71.84 87.17 71.82 71.42 86.85 56.91 86.85 28.01 113.83 27.83 113.86 58.46"/>
        <polygon fill="#b86cf9" points="86.76 86.88 57.23 86.88 43.09 71.99 27.75 72 27.86 86.88 27.86 86.93 27.9 86.97 56.27 113.86 86.95 113.83 86.76 86.88"/>
        <polygon fill="#b86cf9" points="28.02 57.23 28.13 86.84 1.15 87.13 1 56.49 27.77 28.12 27.87 28.01 27.91 28.01 42.49 27.91 42.5 43.25 28.02 57.23"/>
      </g>
    </svg>
  );
}

function Avatar({ size = 28 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: "#0f0f0f", border: "1.5px solid rgba(184,108,249,.25)", display: "grid", placeItems: "center", flexShrink: 0 }}>
      <LogoMark size={Math.round(size * 0.55)} />
    </div>
  );
}

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center", padding: "4px 2px" }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#b86cf9", display: "inline-block", animation: `fox-dot 1.2s ${i * 0.2}s infinite` }} />
      ))}
    </div>
  );
}

/* ── Feature selector card ───────────────────────────────────── */
function FeatureCard({
  projectType, features, onToggle, onGetEstimate,
}: {
  projectType: string;
  features: Feature[];
  onToggle: (id: string) => void;
  onGetEstimate: () => void;
}) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const base  = BASE_PRICES[projectType] ?? [5000, 10000];
  const extra = features.filter(f => f.checked).reduce((s, f) => [s[0] + f.priceMin, s[1] + f.priceMax], [0, 0]);
  const totalMin = base[0] + extra[0];
  const totalMax = base[1] + extra[1];
  const phases   = PROCESS_PHASES[projectType] ?? [];

  const fmt = (n: number) => n >= 1000 ? `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : `$${n}`;

  return (
    <div style={{ background: "#fff", border: "1px solid #e8e6e3", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,.08)" }}>
      {/* Price header */}
      <div style={{ background: "linear-gradient(135deg,#0f0f0f,#1a0a2e)", padding: "18px 18px 16px" }}>
        <div style={{ fontSize: 9, color: "rgba(255,255,255,.4)", letterSpacing: ".16em", textTransform: "uppercase", marginBottom: 3 }}>Live Estimate · {projectType}</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: "-.02em", lineHeight: 1 }}>
          {fmt(totalMin)} <span style={{ color: "rgba(255,255,255,.3)", fontWeight: 300 }}>–</span> {fmt(totalMax)}
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,.35)", marginTop: 5 }}>
          Base {fmt(base[0])}–{fmt(base[1])} + {features.filter(f => f.checked).length} feature{features.filter(f => f.checked).length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Features list */}
      <div style={{ padding: "12px 14px 0" }}>
        <div style={{ fontSize: 10, color: "#999", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 8, paddingLeft: 2 }}>Select your features</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {features.map((f, i) => (
            <label
              key={f.id}
              style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "9px 10px", borderRadius: 10, cursor: "pointer", background: f.checked ? "rgba(184,108,249,.07)" : "transparent", border: `1px solid ${f.checked ? "rgba(184,108,249,.2)" : "transparent"}`, transition: "all .15s" }}
              onMouseEnter={() => setActiveIdx(i)}
              onMouseLeave={() => setActiveIdx(null)}
            >
              {/* Custom checkbox */}
              <div
                onClick={() => onToggle(f.id)}
                style={{ width: 18, height: 18, borderRadius: 5, border: `1.5px solid ${f.checked ? "#b86cf9" : "#d5d2ce"}`, background: f.checked ? "#b86cf9" : "#fff", flexShrink: 0, marginTop: 1, display: "grid", placeItems: "center", transition: "all .15s" }}
              >
                {f.checked && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }} onClick={() => onToggle(f.id)}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#111", lineHeight: 1.3 }}>{f.label}</div>
                {(activeIdx === i || f.checked) && (
                  <div style={{ fontSize: 11, color: "#888", marginTop: 2, lineHeight: 1.4 }}>{f.desc}</div>
                )}
              </div>
              <div style={{ fontSize: 11, fontFamily: "var(--font-geist-mono, monospace)", color: f.checked ? "#b86cf9" : "#bbb", flexShrink: 0, marginTop: 1, fontWeight: f.checked ? 600 : 400 }}>
                +{fmt(f.priceMin)}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Process timeline */}
      <div style={{ margin: "12px 14px 0", background: "#fafaf8", borderRadius: 10, padding: "12px 12px 8px" }}>
        <div style={{ fontSize: 10, color: "#999", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 8 }}>How we build it</div>
        {phases.map((p, i) => (
          <div key={i} style={{ display: "flex", gap: 10, paddingBottom: i < phases.length - 1 ? 10 : 0, marginBottom: i < phases.length - 1 ? 2 : 0, borderBottom: i < phases.length - 1 ? "1px solid #eeece9" : "none" }}>
            <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#0a0a0a", color: "#fff", display: "grid", placeItems: "center", fontSize: 9, fontFamily: "var(--font-geist-mono, monospace)", fontWeight: 700 }}>0{i + 1}</div>
              {i < phases.length - 1 && <div style={{ width: 1, flex: 1, background: "#e0dedd", marginTop: 4 }} />}
            </div>
            <div style={{ paddingBottom: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#111" }}>{p.phase} <span style={{ color: "#b86cf9", fontWeight: 400, fontFamily: "var(--font-geist-mono, monospace)", fontSize: 10 }}>· {p.duration}</span></div>
              <div style={{ fontSize: 11, color: "#888", lineHeight: 1.45, marginTop: 2 }}>{p.what}</div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ padding: "12px 14px 14px" }}>
        <button
          onClick={onGetEstimate}
          style={{ width: "100%", background: "#0a0a0a", color: "#fff", border: "none", borderRadius: 999, padding: "12px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
        >
          Send me the full estimate
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18M13 5l7 7-7 7"/></svg>
        </button>
        <a href="/contact" style={{ display: "block", textAlign: "center", marginTop: 8, fontSize: 12, color: "#888", textDecoration: "none" }}>
          Or <span style={{ color: "#b86cf9", textDecoration: "underline" }}>book a free call</span> directly
        </a>
      </div>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────── */
export default function FoxChat() {
  const [open, setOpen]               = useState(false);
  const [msgs, setMsgs]               = useState<Msg[]>([{ role: "assistant", content: GREETING }]);
  const [input, setInput]             = useState("");
  const [loading, setLoading]         = useState(false);
  const [stage, setStage]             = useState<Stage>("discovery");
  const [projectType, setProjectType] = useState<string | null>(null);
  const [features, setFeatures]       = useState<Feature[]>([]);
  const [emailVal, setEmailVal]       = useState("");
  const [emailSent, setEmailSent]     = useState(false);
  const [unread, setUnread]           = useState(0);
  const bottomRef                     = useRef<HTMLDivElement>(null);
  const inputRef                      = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, loading, stage]);

  useEffect(() => {
    if (open) { setUnread(0); setTimeout(() => inputRef.current?.focus(), 80); }
  }, [open]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;
    const updated: Msg[] = [...msgs, { role: "user", content: text }];
    setMsgs(updated);
    setInput("");
    setLoading(true);
    try {
      const res  = await fetch("/api/fox", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: updated }) });
      const data = await res.json();
      setMsgs(m => [...m, { role: "assistant", content: data.message ?? "I'm here — what are you building?" }]);

      if (data.stage === "features" && data.projectType && FEATURE_SETS[data.projectType]) {
        setProjectType(data.projectType);
        setFeatures(FEATURE_SETS[data.projectType]);
        setStage("features");
      }
      if (!open) setUnread(u => u + 1);
    } catch {
      setMsgs(m => [...m, { role: "assistant", content: "Hit a snag — try again!" }]);
    }
    setLoading(false);
  }, [input, loading, msgs, open]);

  const toggleFeature = useCallback((id: string) => {
    setFeatures(fs => fs.map(f => f.id === id ? { ...f, checked: !f.checked } : f));
  }, []);

  const handleGetEstimate = useCallback(() => {
    setStage("email");
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }, []);

  const submitEmail = useCallback(async () => {
    if (!emailVal.includes("@") || loading || !projectType) return;
    setLoading(true);

    const base      = BASE_PRICES[projectType] ?? [5000, 10000];
    const checked   = features.filter(f => f.checked);
    const extraMin  = checked.reduce((s, f) => s + f.priceMin, 0);
    const extraMax  = checked.reduce((s, f) => s + f.priceMax, 0);
    const totalMin  = base[0] + extraMin;
    const totalMax  = base[1] + extraMax;
    const phases    = PROCESS_PHASES[projectType] ?? [];

    await fetch("/api/fox", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: msgs, email: emailVal, projectType, features: checked, totalMin, totalMax, process: phases }),
    });

    setEmailSent(true);
    setStage("done");
    setLoading(false);
    setMsgs(m => [...m, {
      role: "assistant",
      content: `Estimate sent to ${emailVal}.\n\nIt includes your selected features, the process breakdown, and pricing. Our team will follow up within 24 hours.`,
    }]);
  }, [emailVal, loading, projectType, features, msgs]);

  const checkedCount = features.filter(f => f.checked).length;

  return (
    <>
      {/* ── Chat window ─────────────────────────────────────── */}
      {open && (
        <div
          className="fox-window"
          style={{ position: "fixed", bottom: 92, right: 24, width: 368, maxHeight: 620, background: "#fff", borderRadius: 22, boxShadow: "0 28px 80px rgba(0,0,0,.22), 0 0 0 1px rgba(0,0,0,.06)", display: "flex", flexDirection: "column", overflow: "hidden", zIndex: 9999, animation: "fox-in .3s cubic-bezier(.16,1,.3,1)" }}
        >
          {/* Header */}
          <div style={{ background: "linear-gradient(135deg,#0f0f0f,#1a0a2e)", padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: "rgba(184,108,249,.1)", border: "1.5px solid rgba(184,108,249,.25)", display: "grid", placeItems: "center", flexShrink: 0 }}>
              <LogoMark size={23} />
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, letterSpacing: "-.01em" }}>Fox</div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
                <span style={{ color: "rgba(255,255,255,.4)", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase" }}>Online · Foxmen Studio</span>
              </div>
            </div>
            {stage === "features" && (
              <div style={{ marginLeft: "auto", marginRight: 8, background: "rgba(184,108,249,.15)", border: "1px solid rgba(184,108,249,.25)", borderRadius: 999, padding: "4px 10px", fontSize: 10, color: "#b86cf9", fontWeight: 600, whiteSpace: "nowrap" }}>
                {checkedCount} selected
              </div>
            )}
            <button onClick={() => setOpen(false)} style={{ marginLeft: stage === "features" ? 0 : "auto", background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 9, width: 28, height: 28, color: "rgba(255,255,255,.5)", cursor: "pointer", display: "grid", placeItems: "center" }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: 10, background: "#f8f7f5" }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", gap: 8, alignItems: "flex-end" }}>
                {m.role === "assistant" && <Avatar size={26} />}
                <div style={{ maxWidth: "80%", padding: "10px 13px", borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", background: m.role === "user" ? "#0a0a0a" : "#fff", color: m.role === "user" ? "#fff" : "#111", fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-wrap", boxShadow: "0 1px 6px rgba(0,0,0,.07)" }}>
                  {m.content}
                </div>
              </div>
            ))}

            {/* Typing */}
            {loading && (
              <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                <Avatar size={26} />
                <div style={{ padding: "10px 13px", borderRadius: "16px 16px 16px 4px", background: "#fff", boxShadow: "0 1px 6px rgba(0,0,0,.07)" }}>
                  <TypingDots />
                </div>
              </div>
            )}

            {/* Feature card — shown after features stage triggered */}
            {stage === "features" && projectType && features.length > 0 && (
              <div style={{ marginTop: 4 }}>
                <FeatureCard
                  projectType={projectType}
                  features={features}
                  onToggle={toggleFeature}
                  onGetEstimate={handleGetEstimate}
                />
              </div>
            )}

            {/* Email capture */}
            {stage === "email" && !emailSent && (
              <div style={{ background: "#fff", border: "1px solid #e5e3e0", borderRadius: 14, padding: "14px 14px 12px", boxShadow: "0 2px 10px rgba(0,0,0,.06)" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#111", marginBottom: 4 }}>Where should we send it?</div>
                <div style={{ fontSize: 12, color: "#888", marginBottom: 10 }}>Full breakdown with features, process, and pricing.</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="email"
                    value={emailVal}
                    onChange={e => setEmailVal(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && submitEmail()}
                    placeholder="your@email.com"
                    autoFocus
                    style={{ flex: 1, padding: "10px 13px", borderRadius: 999, border: "1.5px solid #e0dedd", fontSize: 13, outline: "none", background: "#fafaf8", transition: "border-color .2s" }}
                  />
                  <button
                    onClick={submitEmail}
                    disabled={loading || !emailVal.includes("@")}
                    style={{ background: "#0a0a0a", color: "#fff", border: "none", borderRadius: 999, padding: "10px 16px", fontSize: 13, fontWeight: 600, cursor: emailVal.includes("@") ? "pointer" : "default", opacity: emailVal.includes("@") ? 1 : 0.4, transition: "opacity .2s" }}
                  >
                    Send
                  </button>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input bar — hidden on feature/done stages */}
          {stage === "discovery" && (
            <div style={{ padding: "10px 12px", borderTop: "1px solid #eeece9", display: "flex", gap: 8, flexShrink: 0, background: "#fff" }}>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder={loading ? "Fox is thinking…" : "Describe your project…"}
                disabled={loading}
                style={{ flex: 1, padding: "10px 14px", borderRadius: 999, border: "1.5px solid #e5e3e0", fontSize: 13, outline: "none", background: "#fafaf8" }}
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                style={{ width: 38, height: 38, borderRadius: "50%", background: input.trim() && !loading ? "#0a0a0a" : "#e5e3e0", color: "#fff", border: "none", cursor: input.trim() && !loading ? "pointer" : "default", transition: "background .2s", display: "grid", placeItems: "center" }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18M13 5l7 7-7 7"/></svg>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Trigger button ──────────────────────────────────── */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Chat with Fox"
        style={{ position: "fixed", bottom: 24, right: 24, width: 58, height: 58, borderRadius: "50%", background: open ? "#0f0f0f" : "linear-gradient(135deg,#1a0a2e,#0a0a0a)", border: "1.5px solid rgba(184,108,249,.3)", cursor: "pointer", boxShadow: open ? "0 8px 24px rgba(0,0,0,.4)" : "0 6px 28px rgba(0,0,0,.3), inset 0 1px 0 rgba(184,108,249,.15)", display: "grid", placeItems: "center", zIndex: 9999, transition: "all .25s cubic-bezier(.16,1,.3,1)", transform: open ? "scale(.9)" : "scale(1)" }}
      >
        {open
          ? <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          : <LogoMark size={26} />
        }
        {!open && unread > 0 && (
          <span style={{ position: "absolute", top: -3, right: -3, width: 20, height: 20, borderRadius: "50%", background: "#b86cf9", color: "#fff", fontSize: 10, fontWeight: 700, display: "grid", placeItems: "center", border: "2px solid #fff", animation: "fox-ping .5s ease" }}>
            {unread}
          </span>
        )}
      </button>
    </>
  );
}
