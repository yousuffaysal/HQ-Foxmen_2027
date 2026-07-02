"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useScrollReveal } from "@/hooks/useScrollReveal";

/* ─────────────── icons ─────────────── */
function ArrowIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h18M13 5l7 7-7 7" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function useIsMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const check = () => setM(window.innerWidth < 761);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return m;
}

/* ─────────────── types ─────────────── */
type DbService = { id: number; name: string; descr: string; count: string; badge: string | null; image: string | null };
type ServiceDetail = {
  icon: string; tagline: string; headline: string;
  about: string[]; features: { title: string; desc: string }[];
  stats: { v: string; k: string }[]; stack: string[]; unique: string[];
  accentColor: string;
};

/* ─────────────── enriched detail data ─────────────── */
const SERVICE_DETAILS: Record<string, ServiceDetail> = {
  "Web Design & Development": {
    icon: "</>", accentColor: "#b86cf9",
    tagline: "Your concept. Our craft. Live on the web.",
    headline: "Any website. Any web app. You bring the vision — we build it.",
    about: [
      "Got an idea? A concept on a napkin, a Figma file halfway done, or just a clear picture in your head of what you want? Good. Bring it to us exactly as it is. We take it from there — any website, any web application, any digital product. No templates, no cookie-cutter themes. We design your thing, build your thing, and ship your thing.",
      "We've built everything that lives on the web: single-page portfolios, high-traffic SaaS platforms, real-time dashboards, booking systems, CRMs, community tools, e-learning platforms, internal tools, customer portals — if it's a website or web application, we build it. You tell us what you want. We design it, engineer it, integrate every service you need, and hand you a production-ready product you fully own. Start to finish, one team, zero handoffs.",
    ],
    features: [
      { title: "Any concept, any scope", desc: "Five-page landing site or 50-screen SaaS platform — no job is too small or too complex." },
      { title: "Sub-second load times", desc: "Every build hits under 1s FCP. SSR, ISR, and edge caching are standard, not upsells." },
      { title: "10K+ concurrent users", desc: "Architected to scale from day one. No retroactive fixes when traffic spikes." },
      { title: "100/100 Lighthouse", desc: "Performance, accessibility, SEO, and best practices — all green, every deploy." },
      { title: "Responsive, pixel-perfect", desc: "Designed and tested across 40+ device and browser combinations — flawless everywhere." },
      { title: "CMS & integrations", desc: "Sanity, Contentful, Stripe, HubSpot, Intercom, Zapier — anything you need, wired in." },
      { title: "Real-time features", desc: "Live dashboards, chat, notifications, collaborative editing — we build it all." },
      { title: "Full ownership", desc: "Your code, your infra, your domain. We hand over everything — no lock-in, ever." },
    ],
    stats: [{ v:"< 1s", k:"Page load" }, { v:"10K+", k:"Concurrent users" }, { v:"100", k:"Lighthouse" }, { v:"40+", k:"Devices tested" }],
    stack: ["Next.js 15","React 19","TypeScript","Tailwind","Framer Motion","Sanity","Postgres","Vercel","Cloudflare"],
    unique: [
      "We design AND engineer — one team, zero handoffs between creative and code",
      "We start in-browser — prototypes that look and feel like the real product before a single production line",
      "Performance budget enforced in CI — regressions are blocked automatically",
      "Full codebase and infrastructure ownership transferred to you at launch",
    ],
  },
  "iOS, Android & Cross-platform": {
    icon: "▢", accentColor: "#7c5cfc",
    tagline: "From idea to App Store — in 8 to 12 weeks.",
    headline: "Your app idea, built and live. We handle everything.",
    about: [
      "You don't need a technical co-founder or an in-house dev team to ship a great app. Show us your idea — a voice note, a sketch, a list of screens — and we'll turn it into a fully working iOS and Android application. We handle UX design, development, QA, App Store submission, and launch. You walk away with a live app and full ownership of the codebase.",
      "Native iOS with Swift when performance demands it, React Native when you need a single codebase for both stores, Flutter when the design requires pixel-perfect custom UI. We match the technology to your product, not to our convenience. Every app we ship gets weekly TestFlight and Play Console builds throughout development — you see progress every single sprint.",
    ],
    features: [
      { title: "Any app, any platform", desc: "Social apps, marketplaces, fintech, health, travel, productivity — any vertical, any complexity." },
      { title: "8–12 week delivery", desc: "From kick-off to live App Store listing. Sprint-based, weekly builds, no surprises." },
      { title: "Native performance", desc: "60fps animations, hardware-accelerated transitions, and native gesture handling." },
      { title: "Offline-first", desc: "SQLite sync, optimistic updates, and seamless reconnect — works on the subway." },
      { title: "Push & notifications", desc: "Rich push notifications with FCM + APNs, deep links, and open-rate analytics." },
      { title: "App Store submission", desc: "We handle screenshots, metadata, review responses, ASO, and featured placement attempts." },
      { title: "Biometric auth", desc: "Face ID, Touch ID, device-level Keychain storage — secure from day one." },
      { title: "10K+ active users", desc: "Load-tested APIs and efficient data strategies for high-traffic real-world conditions." },
    ],
    stats: [{ v:"8–12wk", k:"MVP to launch" }, { v:"60fps", k:"UI performance" }, { v:"10K+", k:"Active users" }, { v:"4.8★", k:"Avg App Store rating" }],
    stack: ["React Native","Expo","Swift","Kotlin","Flutter","Firebase","Supabase","GraphQL","Fastlane"],
    unique: [
      "Weekly TestFlight + Play Console builds every sprint — you see the app growing in real time",
      "Full App Store submission and ASO strategy handled by us",
      "Native modules written when React Native performance isn't enough",
      "One team designed AND built your app — no creative brief gets lost in translation",
    ],
  },
  "AI-Integrated Software": {
    icon: "AI", accentColor: "#9d50ff",
    tagline: "Real AI. Production systems. Not demos.",
    headline: "Add a brain to your product that actually works.",
    about: [
      "We've all seen the AI demos. Ours ship to production. RAG search that answers questions from your own data, AI assistants that understand your business context, agentic workflows that complete multi-step tasks without human babysitting, fine-tuned models that know your domain better than any off-the-shelf API. We build the real thing.",
      "We benchmark every system against multiple models before committing to a provider — GPT-4o, Claude 3.5, Gemini, Mistral — and we pick what's actually best for your use case, not what's trending. Every AI feature ships with evals, observability, fallback logic, and prompt caching strategy that cuts your API bill by 60–90%. Intelligence embedded where it matters.",
    ],
    features: [
      { title: "RAG pipelines", desc: "Chunk, embed, index, retrieve — over your PDFs, databases, docs, and APIs in real-time." },
      { title: "Agentic workflows", desc: "Multi-step tool-calling agents with memory, planning, and structured output guarantees." },
      { title: "Fine-tuning & evals", desc: "Domain-specific models trained on your data with rigorous evaluation suites before every deploy." },
      { title: "Vector search < 100ms", desc: "Semantic search across millions of documents using Pinecone or pgvector at production speed." },
      { title: "Streaming UI", desc: "Token-by-token streaming with partial renders — feels instant even for long completions." },
      { title: "Prompt caching", desc: "Anthropic + OpenAI cache utilisation built in — cuts API costs 60–90% by default." },
      { title: "Safety & guardrails", desc: "Content moderation, PII detection, hallucination-reduction, and rate limiting standard." },
      { title: "Model-agnostic", desc: "Switch between OpenAI, Claude, Gemini, or local Ollama without touching your app code." },
    ],
    stats: [{ v:"< 100ms", k:"Vector search" }, { v:"60–90%", k:"API cost saved" }, { v:"10K+", k:"Requests/day" }, { v:"99.9%", k:"Uptime" }],
    stack: ["OpenAI","Anthropic Claude","LangChain","LlamaIndex","Pinecone","pgvector","Ollama","Python","FastAPI"],
    unique: [
      "Head-to-head model benchmarks run before we commit to any provider",
      "Every AI feature ships with an eval suite — zero regressions at deploy, ever",
      "Prompt caching strategy built in — your API bill drops on day one",
      "Full observability: LangSmith + custom tracing on every agent call",
    ],
  },
  "Ecommerce & Multi-vendor": {
    icon: "$", accentColor: "#22c55e",
    tagline: "A store that sells. A marketplace that scales.",
    headline: "Commerce that converts — from first SKU to marketplace scale.",
    about: [
      "A great ecommerce site isn't just a product grid with a checkout button. It's a conversion machine — fast pages, frictionless checkout, smart search, and a back-end that handles flash sales at 50K concurrent shoppers without breaking a sweat. We build the full stack: storefront design, commerce engine, payment integration, and the analytics that tell you exactly where you're losing customers.",
      "Single-brand Shopify Plus when you need reliability and ecosystem. Headless Medusa when you need the flexibility that hosted platforms can't give you. Fully custom when neither fits your business model. Multi-vendor marketplaces with Stripe Connect split payouts, automated commission reconciliation, vendor self-service dashboards, and dispute workflows — all production-ready from day one.",
    ],
    features: [
      { title: "Any commerce model", desc: "Single-vendor, multi-vendor, subscription, B2B, digital goods — any model, built right." },
      { title: "< 1s product page load", desc: "Headless storefront on Next.js with CDN-cached pages — fast enough for SEO and conversions." },
      { title: "Stripe Connect payouts", desc: "Automated vendor payouts, commission splits, and 1099 reporting for marketplace models." },
      { title: "< 2% checkout abandonment", desc: "One-page checkout, saved cards, Apple Pay, Google Pay — frictionless from cart to confirmed." },
      { title: "50K concurrent shoppers", desc: "Flash sale infrastructure load-tested and ready — no throttling, no apology pages." },
      { title: "Smart search", desc: "Algolia faceted search with personalisation, filters, and A/B-testable ranking models." },
      { title: "Full inventory sync", desc: "Real-time stock across warehouses, channels, and fulfilment partners — no oversells." },
      { title: "Analytics & attribution", desc: "Full-funnel tracking — GTM, GA4, Meta Pixel, and custom dashboards from day one." },
    ],
    stats: [{ v:"< 2%", k:"Cart abandonment" }, { v:"50K+", k:"Concurrent shoppers" }, { v:"< 1s", k:"Page load" }, { v:"$2M+", k:"Monthly GMV handled" }],
    stack: ["Shopify Plus","Medusa","Next.js","Stripe Connect","Algolia","Postgres","Redis","Cloudflare"],
    unique: [
      "Headless by default — your storefront is never hostage to a platform's CDN speed",
      "Stripe Connect multi-party payouts handled end-to-end including reconciliation",
      "Flash sale infra tested to 50K concurrent — proven before launch, not after",
      "SEO-first product pages with structured data, ISR, and canonical strategy",
    ],
  },
  "Real-estate platforms": {
    icon: "⌖", accentColor: "#f59e0b",
    tagline: "Listings, CRMs, map search — built for scale.",
    headline: "Property platforms that perform at portfolio speed.",
    about: [
      "We rebuilt a real estate search engine from scratch and dropped page loads from 4.1 seconds to 380 milliseconds. That's the kind of work we do. Listing portals with polygon search and map clustering that render 100K pins at 60fps, agent CRMs with automated lead routing and commission tracking, mortgage calculators with live rate lookups — the full stack for any property business.",
      "Whether it's a boutique brokerage or a national portal handling millions of listings, we architect for the data volume and geospatial complexity that real estate demands. MLS / RETS feed ingestion, PostGIS-powered queries, school district overlays, commute-time filters, and programmatic city/neighbourhood pages that rank on Google the day you launch.",
    ],
    features: [
      { title: "380ms search", desc: "Rebuilt from first principles — Algolia + PostGIS giving sub-second results on any query." },
      { title: "Map clustering", desc: "Mapbox with custom clustering — 100K pins at 60fps, no lag, no jank." },
      { title: "Polygon & radius search", desc: "Draw-on-map search, school district filters, commute-time overlays, walk score." },
      { title: "Agent CRM", desc: "Lead routing, pipeline, automated follow-ups, commission splits, CDA generation." },
      { title: "MLS feed ingestion", desc: "50K listings/hour — automated ingestion, deduplication, and photo processing." },
      { title: "Mortgage & affordability", desc: "Live rate lookups, amortisation tables, and affordability scoring wired to listings." },
      { title: "Saved searches & alerts", desc: "Email and push notifications when new listings match — in real-time." },
      { title: "SEO pages at scale", desc: "Programmatic city/neighbourhood pages with structured data — organic traffic from launch." },
    ],
    stats: [{ v:"380ms", k:"Search response" }, { v:"100K+", k:"Listings handled" }, { v:"60fps", k:"Map rendering" }, { v:"10K+", k:"Concurrent users" }],
    stack: ["Next.js","Mapbox","Algolia","Postgres","PostGIS","Redis","AWS S3","Cloudflare"],
    unique: [
      "PostGIS-powered geospatial queries — not just bounding boxes, full polygon logic",
      "Custom clustering outperforms Google Maps JS by 3× at 100K points",
      "MLS ingestion pipeline processes 50K listings per hour with zero duplicates",
      "Programmatic SEO pages generate organic traffic before paid ads launch",
    ],
  },
  "UI · UX & Brand": {
    icon: "A", accentColor: "#ec4899",
    tagline: "Identity, systems, motion — designed to ship.",
    headline: "Your brand as a complete design system, not just a logo.",
    about: [
      "A logo is the start, not the finish. What your brand actually needs is a system — colour tokens, typography scales, component libraries, spacing primitives, motion principles, and Figma documentation that your engineers can open and immediately build from. That's what we deliver. Not a PDF nobody reads. A living design system that ships to production.",
      "We've built brand identities for seed-stage startups and comprehensive design system audits for Series B companies. Every token is named to sync with code via Style Dictionary. Every component is spec'd for engineers with no ambiguity. Every motion principle is expressed as Framer Motion variants your developers can copy-paste. Your design system will be the most useful internal tool your team has.",
    ],
    features: [
      { title: "Logo & identity variants", desc: "Primary, secondary, responsive, and monochrome marks with full usage guidelines." },
      { title: "Design tokens to code", desc: "Color, type, spacing, shadow — Figma tokens syncing to CSS/Tailwind/React via Style Dictionary." },
      { title: "50–200 components", desc: "Production-ready component library with all states, variants, and accessibility annotations." },
      { title: "Motion system", desc: "Easing curves, duration scales, and Framer Motion variants — consistent feel everywhere." },
      { title: "Responsive layout system", desc: "8pt grid, breakpoint strategy, and layout primitives — no guessing at spacings." },
      { title: "Figma documentation site", desc: "Living, searchable Figma doc — not a file, a real reference your team actually uses." },
      { title: "Voice & tone guide", desc: "Writing guidelines, UX copy patterns, and error message library — brand in every word." },
      { title: "Engineer-ready handoff", desc: "Every component spec'd with zero ambiguity — no back-and-forth after handoff." },
    ],
    stats: [{ v:"50–200", k:"Components" }, { v:"8pt", k:"Grid system" }, { v:"Figma→CSS", k:"Token sync" }, { v:"WCAG AA", k:"Accessibility" }],
    stack: ["Figma","Tokens Studio","Style Dictionary","Storybook","Framer","Lottie","Adobe CC"],
    unique: [
      "Tokens Studio → Style Dictionary → production CSS pipeline — design changes deploy instantly",
      "Motion system built to match your brand personality, not generic easing curves",
      "Figma documentation site — searchable, maintained, and actually used by your team",
      "Every component signed off by an engineer before handoff — zero ambiguity guaranteed",
    ],
  },
  "Performance marketing": {
    icon: "↗", accentColor: "#10b981",
    tagline: "Growth that compounds. No silos, no gaps.",
    headline: "The full funnel — wired to the same analytics as your product.",
    about: [
      "Most agencies run your ads in isolation. We wire your growth channels directly into your product analytics — so you see the complete journey from first ad impression to retained, paying user in one dashboard. Paid acquisition, technical SEO, lifecycle email and push, and conversion rate optimisation all coordinated by the same team that understands your product.",
      "We run growth as a continuous experiment, not a quarterly campaign. Hypothesis → test → measure → iterate. A/B tests run inside the codebase without third-party script overhead. Attribution models updated weekly based on real conversion window data. Content calendar built from actual search intent, not gut feeling. And the numbers we report are the ones that actually move your business — not vanity metrics.",
    ],
    features: [
      { title: "Paid acquisition", desc: "Meta, Google, TikTok, LinkedIn — creative strategy, targeting, bidding, and weekly reporting." },
      { title: "Technical SEO", desc: "Core Web Vitals, structured data, internal linking, and programmatic page creation for scale." },
      { title: "Lifecycle automation", desc: "Klaviyo or Customer.io — triggered campaigns with real personalisation, not mail merges." },
      { title: "CRO & A/B testing", desc: "Hypothesis-driven experiments with statistical significance guardrails — no fake wins." },
      { title: "Full-funnel attribution", desc: "First-touch, last-touch, and data-driven models — unified in one source of truth." },
      { title: "In-product analytics", desc: "GA4, Mixpanel, Segment — clean event taxonomy and real-time growth dashboards." },
      { title: "Content strategy", desc: "SEO-driven calendar mapped to search intent and conversion stage — content that ranks." },
      { title: "3.2× average ROAS", desc: "Across all active paid clients — proven performance, not projected." },
    ],
    stats: [{ v:"3.2×", k:"Avg ROAS" }, { v:"−42%", k:"CAC reduction" }, { v:"+28%", k:"Conversion lift" }, { v:"10K+", k:"Monthly organic visits" }],
    stack: ["GA4","Segment","Mixpanel","Klaviyo","Customer.io","Hotjar","Semrush","Meta Ads","Google Ads"],
    unique: [
      "Growth team shares the same analytics stack as engineering — one source of truth",
      "A/B tests run in the codebase — no third-party script latency killing your test accuracy",
      "Paid + organic + lifecycle treated as one system, not three separate channels",
      "Attribution model updated every week based on real conversion window data",
    ],
  },
};

/* ─────────────── card visuals ─────────────── */
const CARD_GRADIENTS: Record<string, string> = {
  "Web Design & Development":     "linear-gradient(135deg,#d2c3f6 0%,#a88bf5 50%,#7c3cce 100%)",
  "iOS, Android & Cross-platform":"linear-gradient(135deg,#060618 0%,#160f48 50%,#3730a3 100%)",
  "AI-Integrated Software":       "linear-gradient(135deg,#0d0020 0%,#380d7f 40%,#7c22ce 100%)",
  "Ecommerce & Multi-vendor":     "linear-gradient(135deg,#011a12 0%,#034d31 50%,#059669 100%)",
  "Real-estate platforms":        "linear-gradient(135deg,#120900 0%,#5c2d00 50%,#b45309 100%)",
  "UI · UX & Brand":              "linear-gradient(135deg,#1a0010 0%,#6b0f3a 50%,#db2777 100%)",
  "Performance marketing":        "linear-gradient(135deg,#001810 0%,#025c37 50%,#059669 100%)",
};

/* ─────────────── solid bg colours (one per section) ─────────────── */
const SVC_BG: Record<string, string> = {
  "Web Design & Development":     "#d2c3f6",
  "iOS, Android & Cross-platform":"#111111",
  "AI-Integrated Software":       "#2A0A6B",
  "Ecommerce & Multi-vendor":     "#04422D",
  "Real-estate platforms":        "#6B2E09",
  "UI · UX & Brand":              "#5a0618",
  "Performance marketing":        "#0A3324",
};

/* ─────────────── heading splits: [bold sans, italic serif] ─────────────── */
const SVC_SPLIT: Record<string, [string, string]> = {
  "Web Design & Development":     ["Web Design &", "Development"],
  "iOS, Android & Cross-platform":["iOS, Android &", "Cross-platform"],
  "AI-Integrated Software":       ["AI-Integrated", "Software"],
  "Ecommerce & Multi-vendor":     ["Ecommerce &", "Multi-vendor"],
  "Real-estate platforms":        ["Real-estate", "platforms"],
  "UI · UX & Brand":              ["UI · UX &", "Brand"],
  "Performance marketing":        ["Performance", "marketing"],
};

/* ─────────────── service visual art ─────────────── */
function VisualWeb({ a }: { a:string }) {
  return (
    <svg viewBox="0 0 500 380" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
      <rect x="20" y="14" width="460" height="340" rx="16" stroke={a} strokeOpacity=".22" strokeWidth="1.5"/>
      <rect x="20" y="14" width="460" height="52" rx="16" fill={a} fillOpacity=".05"/>
      <rect x="20" y="52" width="460" height="14" fill={a} fillOpacity=".03"/>
      <line x1="20" y1="66" x2="480" y2="66" stroke={a} strokeOpacity=".13" strokeWidth="1"/>
      <circle cx="46" cy="40" r="8" fill={a} fillOpacity=".45"/>
      <circle cx="70" cy="40" r="8" fill={a} fillOpacity=".25"/>
      <circle cx="94" cy="40" r="8" fill={a} fillOpacity=".13"/>
      <rect x="130" y="27" width="220" height="26" rx="13" stroke={a} strokeOpacity=".18" strokeWidth="1" fill={a} fillOpacity=".05"/>
      {([
        {x1:40,x2:170,y:96,op:.32,w:2},{x1:40,x2:250,y:118,op:.17,w:1.5},
        {x1:60,x2:200,y:140,op:.24,w:1.5},{x1:60,x2:280,y:162,op:.13,w:1.5},
        {x1:40,x2:150,y:184,op:.28,w:2},{x1:40,x2:230,y:206,op:.15,w:1.5},
        {x1:60,x2:185,y:228,op:.2,w:1.5},{x1:60,x2:260,y:250,op:.12,w:1.5},
        {x1:40,x2:160,y:272,op:.22,w:1.5},{x1:40,x2:215,y:294,op:.14,w:1.5},
        {x1:60,x2:180,y:316,op:.18,w:1.5},
      ] as {x1:number;x2:number;y:number;op:number;w:number}[]).map((l,i)=>(
        <line key={i} x1={l.x1} y1={l.y} x2={l.x2} y2={l.y} stroke={a} strokeOpacity={l.op} strokeWidth={l.w} strokeLinecap="round"/>
      ))}
      {Array.from({length:8},(_,r)=>Array.from({length:5},(_,c)=>(
        <circle key={`${r}-${c}`} cx={330+c*26} cy={90+r*30} r="2" fill={a} fillOpacity=".2"/>
      )))}
      <line x1="308" y1="80" x2="308" y2="350" stroke={a} strokeOpacity=".07" strokeWidth="1"/>
    </svg>
  );
}

function VisualMobile({ a }: { a:string }) {
  const phone = (x:number,w:number,h:number,rx:number) => (
    <>
      <rect x={x} y="70" width={w} height={h} rx={rx} stroke={a} strokeOpacity=".28" strokeWidth="1.5"/>
      <rect x={x+9} y="78" width={w-18} height={h-28} rx={rx-8} fill={a} fillOpacity=".05"/>
      <rect x={x+w/2-22} y="75" width="44" height="7" rx="3.5" fill={a} fillOpacity=".28"/>
      <circle cx={x+w/2} cy={70+h-14} r="7" stroke={a} strokeOpacity=".22" strokeWidth="1" fill="none"/>
      {Array.from({length:4},(_,row)=>Array.from({length:3},(_,col)=>(
        <rect key={`${row}-${col}`} x={x+12+col*((w-24)/3)} y={96+row*34} width={(w-24)/3-8} height="22" rx="5" fill={a} fillOpacity={row===0&&col===0?.22:.07}/>
      )))}
    </>
  );
  return (
    <svg viewBox="0 0 500 380" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
      {phone(55,115,215,22)}
      {phone(215,130,230,24)}
      <path d="M172 178 Q194 155 218 178" stroke={a} strokeOpacity=".25" strokeWidth="1.5" strokeDasharray="4 6" fill="none"/>
      <path d="M172 200 Q194 223 218 200" stroke={a} strokeOpacity=".18" strokeWidth="1.5" strokeDasharray="4 6" fill="none"/>
      <circle cx="195" cy="186" r="7" fill={a} fillOpacity=".5"/>
      {[0,1,2].map(i=><circle key={i} cx={165+i*14} cy={324} r="4" fill={a} fillOpacity={i===1?.45:.2}/>)}
    </svg>
  );
}

export function VisualAI({ a }: { a?:string }) {
  return (
    <div style={{
      width: "100%", height: "100%", background: "#06060c",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between",
      padding: "24px 20px 18px", position: "relative", overflow: "hidden",
      fontFamily: "var(--f-sans)", color: "#fff",
      boxSizing: "border-box",
    }}>
      {/* Ambient aurora aura */}
      <div style={{
        position: "absolute", top: "15%", left: "50%", width: 260, height: 260,
        background: "radial-gradient(circle, rgba(138,35,135,0.28) 0%, rgba(0,242,254,0.15) 50%, transparent 70%)",
        transform: "translate(-50%, -50%)", filter: "blur(35px)", pointerEvents: "none",
        animation: "aiPulse 4s ease-in-out infinite alternate",
      }} />

      {/* ── Top: 60 FPS Glowing Orb Ring ── */}
      <div style={{ position: "relative", width: 130, height: 130, display: "grid", placeItems: "center", marginTop: 4, flexShrink: 0 }}>
        {/* Outer ambient glow */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,242,254,0.45) 0%, rgba(255,42,133,0.35) 50%, transparent 70%)",
          filter: "blur(20px)",
          animation: "aiPulse 3s ease-in-out infinite alternate",
        }} />

        {/* Morphing wrapper for organic torus breathing */}
        <div style={{
          position: "absolute", inset: 6,
          animation: "aiMorph 3.5s ease-in-out infinite alternate",
          transformOrigin: "center center",
        }}>
          {/* Ring 1 - Forward spinning aurora ribbon */}
          <div style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            padding: 3.5, background: "conic-gradient(from 0deg, #ff2a85, #7928ca, #00f2fe, #ff2a85)",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor", maskComposite: "exclude",
            animation: "aiSpin 4s linear infinite",
            filter: "drop-shadow(0 0 8px rgba(0,242,254,0.6))",
          }} />
        </div>

        {/* Counter-rotating wrapper */}
        <div style={{
          position: "absolute", inset: 10,
          animation: "aiMorphReverse 4s ease-in-out infinite alternate",
          transformOrigin: "center center",
        }}>
          {/* Ring 2 - Reverse spinning purple/cyan ribbon */}
          <div style={{
            position: "absolute", inset: 0, borderRadius: "48%",
            padding: 2.5, background: "conic-gradient(from 180deg, #00f2fe, #a855f7, #f43f5e, #00f2fe)",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor", maskComposite: "exclude",
            animation: "aiSpinReverse 6s linear infinite",
            opacity: 0.85,
          }} />
        </div>

        {/* Core highlight ring */}
        <div style={{
          position: "absolute", inset: 18, borderRadius: "50%",
          padding: 2, background: "conic-gradient(from 90deg, #fff, rgba(255,255,255,0), #60a5fa, rgba(255,255,255,0), #fff)",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor", maskComposite: "exclude",
          animation: "aiSpin 2.5s linear infinite",
          opacity: 0.9,
        }} />
      </div>

      {/* ── Middle: Greeting & Question ── */}
      <div style={{ textAlign: "center", zIndex: 2, margin: "8px 0", flexShrink: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 500, color: "rgba(255,255,255,0.65)", letterSpacing: "-0.01em", marginBottom: 2 }}>
          Hey Jason
        </div>
        <div style={{ fontSize: "clamp(18px, 2.5vw, 22px)", fontWeight: 700, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.2 }}>
          How can I <span style={{ background: "linear-gradient(135deg, #60a5fa 0%, #c084fc 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>assist you?</span>
        </div>
      </div>

      {/* ── Bottom Cards / Chips ── */}
      <div style={{ width: "100%", maxWidth: 480, zIndex: 2, display: "flex", flexDirection: "column", gap: 10, flexShrink: 0 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[
            { icon: "⚽", text: "Show market value of João Pedro" },
            { icon: "🎾", text: "List recent wins by Carlos Alcaraz" },
            { icon: "⚡", text: "Run RAG query on live database" },
          ].map((c, idx) => (
            <div key={idx} style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 12, padding: "10px 10px", display: "flex", flexDirection: "column", gap: 6,
              transition: "all 0.2s ease", cursor: "pointer",
            }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, background: "rgba(255,255,255,0.06)", display: "grid", placeItems: "center", fontSize: 12 }}>
                {c.icon}
              </div>
              <div style={{ fontSize: 11, lineHeight: 1.3, color: "rgba(255,255,255,0.6)", fontWeight: 400 }}>
                {c.text}
              </div>
            </div>
          ))}
        </div>

        {/* Search / Input Bar */}
        <div style={{
          background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 999, padding: "5px 5px 5px 14px", display: "flex", alignItems: "center", justifyContent: "space-between",
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.5)", fontSize: 12.5 }}>
            <span>📎</span>
            <span>Show market value of Marc Cucurella...</span>
          </div>
          <div style={{
            width: 28, height: 28, borderRadius: "50%",
            background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
            display: "grid", placeItems: "center", color: "#fff", fontSize: 13, fontWeight: "bold",
            boxShadow: "0 0 12px rgba(168,85,247,0.5)", cursor: "pointer",
          }}>
            ↑
          </div>
        </div>
      </div>

      {/* Embedded 60 FPS hardware accelerated keyframes */}
      <style>{`
        @keyframes aiSpin {
          0% { transform: rotate(0deg) translateZ(0); }
          100% { transform: rotate(360deg) translateZ(0); }
        }
        @keyframes aiSpinReverse {
          0% { transform: rotate(360deg) translateZ(0); }
          100% { transform: rotate(0deg) translateZ(0); }
        }
        @keyframes aiMorph {
          0% { transform: scale(0.96, 1.04) skew(-3deg, 2deg) translateZ(0); }
          100% { transform: scale(1.05, 0.95) skew(3deg, -2deg) translateZ(0); }
        }
        @keyframes aiMorphReverse {
          0% { transform: scale(1.04, 0.96) skew(2deg, -3deg) translateZ(0); }
          100% { transform: scale(0.95, 1.05) skew(-2deg, 3deg) translateZ(0); }
        }
        @keyframes aiPulse {
          0% { transform: scale(0.9) translateZ(0); opacity: 0.5; }
          100% { transform: scale(1.15) translateZ(0); opacity: 0.95; }
        }
      `}</style>
    </div>
  );
}

function VisualEcom({ a }: { a:string }) {
  const bars = [55,90,70,122,102,152,128,178,158,198];
  const pts = bars.map((h,i)=>`${50+i*42},${315-h}`).join(" ");
  return (
    <svg viewBox="0 0 500 380" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
      {[195,245,295,315].map(y=>(
        <line key={y} x1="36" y1={y} x2="450" y2={y} stroke={a} strokeOpacity=".08" strokeWidth="1" strokeDasharray="4 8"/>
      ))}
      {bars.map((h,i)=>(
        <rect key={i} x={36+i*42} y={315-h} width="30" height={h} rx="6" fill={a} fillOpacity={.07+i*.025}/>
      ))}
      <polyline points={pts} stroke={a} strokeOpacity=".52" strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round"/>
      {bars.map((h,i)=>(
        <circle key={i} cx={50+i*42} cy={315-h} r="4.5" fill={a} fillOpacity=".78"/>
      ))}
      <path d="M362 54 h88 l-14 98 h-60 z" stroke={a} strokeOpacity=".22" strokeWidth="1.5" fill="none"/>
      <path d="M376 54 q0-28 26-28 q26 0 26 28" stroke={a} strokeOpacity=".25" strokeWidth="1.5" fill="none"/>
      <line x1="378" y1="96" x2="438" y2="96" stroke={a} strokeOpacity=".12" strokeWidth="1"/>
    </svg>
  );
}

function VisualRealEstate({ a }: { a:string }) {
  const blds:{x:number;y:number;w:number;h:number}[] = [
    {x:36,y:222,w:58,h:140},{x:104,y:172,w:54,h:190},{x:168,y:242,w:44,h:120},
    {x:222,y:138,w:72,h:224},{x:304,y:192,w:56,h:170},{x:370,y:158,w:52,h:204},{x:432,y:212,w:50,h:150},
  ];
  return (
    <svg viewBox="0 0 500 390" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
      <line x1="18" y1="362" x2="482" y2="362" stroke={a} strokeOpacity=".18" strokeWidth="2"/>
      {blds.map((b,i)=>(
        <React.Fragment key={i}>
          <rect x={b.x} y={b.y} width={b.w} height={b.h} stroke={a} strokeOpacity={.15+i*.015} strokeWidth="1.2" fill={a} fillOpacity=".04"/>
          {Array.from({length:4},(_,row)=>Array.from({length:2},(_,col)=>(
            <rect key={`${row}-${col}`} x={b.x+6+col*(b.w/2-3)} y={b.y+14+row*32} width={b.w/2-12} height="18" rx="3" fill={a} fillOpacity={(row+col)%2===0?.16:.05}/>
          )))}
        </React.Fragment>
      ))}
      <circle cx="250" cy="72" r="26" stroke={a} strokeOpacity=".38" strokeWidth="2"/>
      <circle cx="250" cy="72" r="12" fill={a} fillOpacity=".55"/>
      <line x1="250" y1="98" x2="250" y2="136" stroke={a} strokeOpacity=".32" strokeWidth="2.5" strokeLinecap="round"/>
      {[0,1,2,3].map(i=><line key={i} x1="18" y1={18+i*28} x2="200" y2={18+i*28} stroke={a} strokeOpacity=".07" strokeWidth="1"/>)}
      {[0,1,2].map(i=><line key={i} x1={42+i*44} y1="10" x2={42+i*44} y2="118" stroke={a} strokeOpacity=".07" strokeWidth="1"/>)}
    </svg>
  );
}

function VisualBrand({ a }: { a:string }) {
  const swColors = ["rgba(255,255,255,.18)","#ec4899","#a855f7","#3b82f6","#10b981","#f59e0b","#ef4444"];
  return (
    <svg viewBox="0 0 500 390" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
      <text x="90" y="310" fontFamily="Georgia, serif" fontSize="280" fill={a} fillOpacity=".07" fontStyle="italic">{'A'}</text>
      {swColors.map((c,i)=>(
        <circle key={i} cx={56+i*56} cy={48} r="22" fill={c} fillOpacity=".48" stroke={c} strokeOpacity=".65" strokeWidth="1"/>
      ))}
      <rect x="36" y="316" width="160" height="56" rx="12" stroke={a} strokeOpacity=".22" strokeWidth="1.5"/>
      <rect x="50" y="332" width="68" height="13" rx="4" fill={a} fillOpacity=".22"/>
      <rect x="50" y="350" width="48" height="10" rx="3" fill={a} fillOpacity=".12"/>
      <rect x="214" y="316" width="234" height="56" rx="12" stroke={a} strokeOpacity=".18" strokeWidth="1.5"/>
      {[0,1,2].map(i=><line key={i} x1="230" y1={330+i*14} x2={418-i*22} y2={330+i*14} stroke={a} strokeOpacity={.22-.06*i} strokeWidth={3-i} strokeLinecap="round"/>)}
      {[0,1,2,3].map(i=><line key={i} x1="36" y1={114+i*46} x2={310-i*48} y2={114+i*46} stroke={a} strokeOpacity={.28-.05*i} strokeWidth={4-i} strokeLinecap="round"/>)}
    </svg>
  );
}

function VisualMarketing({ a }: { a:string }) {
  const data = [38,56,46,70,60,86,76,102,93,118,108,142,130,158];
  const pts = data.map((v,i)=>`${42+i*30},${320-v}`).join(" ");
  return (
    <svg viewBox="0 0 500 390" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%"}}>
      {[0,1,2,3,4].map(i=>(
        <line key={i} x1="34" y1={120+i*50} x2="460" y2={120+i*50} stroke={a} strokeOpacity=".08" strokeWidth="1"/>
      ))}
      <polyline points={`42,320 ${pts} ${42+13*30},320`} fill={a} fillOpacity=".08" stroke="none"/>
      <polyline points={pts} stroke={a} strokeOpacity=".55" strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round"/>
      {data.map((v,i)=>(
        <circle key={i} cx={42+i*30} cy={320-v} r={i===data.length-1?6:4} fill={a} fillOpacity={i===data.length-1?.9:.65}/>
      ))}
      <line x1="400" y1="288" x2="444" y2="96" stroke={a} strokeOpacity=".38" strokeWidth="2.5" strokeLinecap="round"/>
      <polyline points="436,106 444,96 452,114" stroke={a} strokeOpacity=".38" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <rect x="390" y="42" width="82" height="38" rx="8" fill={a} fillOpacity=".11" stroke={a} strokeOpacity=".2" strokeWidth="1"/>
      <rect x="352" y="90" width="62" height="28" rx="7" fill={a} fillOpacity=".07" stroke={a} strokeOpacity=".15" strokeWidth="1"/>
    </svg>
  );
}

const SERVICE_VISUAL: Record<string, React.FC<{ a:string }>> = {
  "Web Design & Development":      VisualWeb,
  "iOS, Android & Cross-platform": VisualMobile,
  "AI-Integrated Software":        VisualAI,
  "Ecommerce & Multi-vendor":      VisualEcom,
  "Real-estate platforms":         VisualRealEstate,
  "UI · UX & Brand":               VisualBrand,
  "Performance marketing":         VisualMarketing,
};

/* ─────────────── budget / timeline ─────────────── */
const BUDGET_OPTIONS = [
  { value:"< $5k",      label:"< $5k",       sub:"Consultation / small scope" },
  { value:"$5k–$15k",   label:"$5k – $15k",  sub:"Landing page / MVP feature" },
  { value:"$15k–$50k",  label:"$15k – $50k", sub:"Full product build" },
  { value:"$50k–$150k", label:"$50k – $150k",sub:"Multi-platform ecosystem" },
  { value:"$150k+",     label:"$150k+",      sub:"Enterprise transformation" },
];
const TIMELINE_OPTIONS = ["ASAP","1–2 months","3–6 months","6+ months","Flexible"];
type IForm = { service:string;name:string;email:string;company:string;description:string;budget:string;budget_custom:string;timeline:string;website:string };

function getShowcaseImage(name: string, idx?: number): string | null {
  const n = name.toLowerCase();
  if (idx === 5 || n.includes("ui") || n.includes("ux") || n.includes("brand")) return "/assets/uiux-showcase.png";
  if (idx === 0 || n.includes("web") || n.includes("design")) return "/assets/hero-showcase.png";
  if (idx === 1 || n.includes("ios") || n.includes("android") || n.includes("cross")) return "/assets/ios-showcase.png";
  if (idx === 3 || n.includes("ecom") || n.includes("commerce") || n.includes("vendor") || n.includes("shop")) return "/assets/ecom-showcase.png";
  if (idx === 4 || n.includes("real-estate") || n.includes("real estate") || n.includes("property") || n.includes("estate")) return "/assets/realestate-showcase.png";
  return null;
}

/* ════════════════════════════════════════════════════
   DETAIL MODAL — redesigned with animations
   ════════════════════════════════════════════════════ */
function ServiceDetailModal({ service, image, onClose, onStartService }: {
  service:string; image:string|null; onClose:()=>void; onStartService:()=>void;
}) {
  const d = SERVICE_DETAILS[service] ?? SERVICE_DETAILS["Web Design & Development"];
  const [tab, setTab] = useState<"overview"|"features"|"stack">("overview");
  const isMobile = useIsMobile();
  const customImg = getShowcaseImage(service);
  const displayImg = customImg || image;

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key==="Escape") onClose(); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [onClose]);

  return (
    <div
      style={{ position:"fixed",inset:0,zIndex:300,display:"flex",alignItems:isMobile?"flex-end":"center",justifyContent:"center",padding:isMobile?"0":"24px 16px",background:"rgba(6,6,10,.82)",backdropFilter:"blur(14px)" }}
      onClick={e => { if(e.target===e.currentTarget) onClose(); }}
    >
      <div style={{ background:"#0a0a0f",width:"100%",maxWidth:820,maxHeight:isMobile?"92vh":"90vh",borderRadius:isMobile?"20px 20px 0 0":24,overflow:"hidden",display:"flex",flexDirection:"column",border:"1px solid rgba(255,255,255,.08)",boxShadow:"0 40px 100px -20px rgba(0,0,0,.8)",animation:"modalIn .45s cubic-bezier(.16,1,.3,1)" }}>

        {/* ── hero header ── */}
        <div style={{ position:"relative",height:isMobile?160:220,flexShrink:0,overflow:"hidden" }}>
          {service.toLowerCase().includes("ai") ? (
            <VisualAI />
          ) : displayImg ? (
            <img src={displayImg} alt={service} style={{ width:"100%",height:"100%",objectFit:"cover",display:"block" }} />
          ) : (
            <div style={{ width:"100%",height:"100%",background:CARD_GRADIENTS[service]??"linear-gradient(135deg,#0d0020,#7c3cce)" }} />
          )}
          {/* blobs */}
          <div style={{ position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none" }}>
            <div style={{ position:"absolute",width:300,height:300,borderRadius:"50%",background:d.accentColor,opacity:.18,filter:"blur(60px)",top:"-30%",left:"60%",animation:"blobFloat 6s ease-in-out infinite" }} />
            <div style={{ position:"absolute",width:200,height:200,borderRadius:"50%",background:"#6366f1",opacity:.12,filter:"blur(50px)",bottom:"-20%",left:"10%",animation:"blobFloat 8s ease-in-out infinite reverse" }} />
          </div>
          {/* gradient */}
          <div style={{ position:"absolute",inset:0,background:`linear-gradient(to top, #0a0a0f 0%, rgba(10,10,15,.6) 50%, transparent 100%)` }} />
          {/* close */}
          <button onClick={onClose} style={{ position:"absolute",top:16,right:16,width:36,height:36,borderRadius:"50%",background:"rgba(255,255,255,.1)",backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,.15)",cursor:"pointer",display:"grid",placeItems:"center",color:"#fff",zIndex:5 }}><CloseIcon /></button>
          {/* icon */}
          <div style={{ position:"absolute",top:16,left:20,width:44,height:44,borderRadius:12,background:d.accentColor,display:"grid",placeItems:"center",fontFamily:"var(--f-display)",fontStyle:"italic",fontSize:18,fontWeight:700,color:"#fff",boxShadow:`0 0 20px ${d.accentColor}66` }}>{d.icon}</div>
          {/* title */}
          <div style={{ position:"absolute",bottom:20,left:24,right:60,zIndex:2 }}>
            <p style={{ margin:"0 0 6px",fontFamily:"var(--f-mono)",fontSize:10,letterSpacing:".2em",textTransform:"uppercase",color:"rgba(255,255,255,.45)" }}>{d.tagline}</p>
            <h2 style={{ margin:0,fontFamily:"var(--f-display)",fontSize:"clamp(20px,3.5vw,30px)",lineHeight:1.1,letterSpacing:"-.02em",color:"#fff" }}>{d.headline}</h2>
          </div>
        </div>

        {/* ── tabs ── */}
        <div style={{ display:"flex",gap:0,borderBottom:"1px solid rgba(255,255,255,.08)",flexShrink:0,padding:"0 24px" }}>
          {(["overview","features","stack"] as const).map(t => (
            <button key={t} onClick={()=>setTab(t)} style={{ padding:"14px 18px",background:"transparent",border:"none",borderBottom:`2px solid ${tab===t?d.accentColor:"transparent"}`,cursor:"pointer",fontFamily:"var(--f-mono)",fontSize:11,letterSpacing:".14em",textTransform:"uppercase",color:tab===t?"#fff":"rgba(255,255,255,.35)",transition:"color .2s",marginBottom:-1 }}>{t}</button>
          ))}
        </div>

        {/* ── scrollable body ── */}
        <div style={{ overflowY:"auto",flex:1 }}>

          {tab==="overview" && (
            <div style={{ padding:isMobile?"20px 16px 80px":"28px 28px 100px" }}>
              {/* about */}
              {d.about.map((p,i) => (
                <p key={i} style={{ fontSize:15,color:"rgba(255,255,255,.68)",lineHeight:1.75,margin:"0 0 16px",maxWidth:"68ch",animation:`fadeUp .5s ease ${i*0.1+0.1}s both` }}>{p}</p>
              ))}
              {/* stats */}
              <div style={{ display:"grid",gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(4,1fr)",gap:1,background:"rgba(255,255,255,.05)",borderRadius:16,overflow:"hidden",marginTop:28 }}>
                {d.stats.map((s,i) => (
                  <div key={i} style={{ padding:"22px 16px",background:"rgba(255,255,255,.04)",textAlign:"center",animation:`fadeUp .5s ease ${i*0.08+0.3}s both` }}>
                    <div style={{ fontFamily:"var(--f-display)",fontSize:"clamp(20px,3vw,30px)",lineHeight:1,letterSpacing:"-.02em",color:"#fff",marginBottom:6 }}>{s.v}</div>
                    <div style={{ fontFamily:"var(--f-mono)",fontSize:9,letterSpacing:".14em",textTransform:"uppercase",color:"rgba(255,255,255,.35)" }}>{s.k}</div>
                  </div>
                ))}
              </div>
              {/* unique */}
              <div style={{ marginTop:28 }}>
                <p style={{ fontFamily:"var(--f-mono)",fontSize:10,letterSpacing:".18em",textTransform:"uppercase",color:"rgba(255,255,255,.28)",marginBottom:14 }}>Why Foxmen is different</p>
                <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10 }}>
                  {d.unique.map((u,i) => (
                    <div key={i} style={{ display:"flex",alignItems:"flex-start",gap:12,padding:"14px 16px",background:"rgba(255,255,255,.04)",borderRadius:10,border:"1px solid rgba(255,255,255,.07)",animation:`fadeUp .4s ease ${i*0.07+0.4}s both` }}>
                      <span style={{ width:18,height:18,borderRadius:"50%",border:`1.5px solid ${d.accentColor}`,display:"grid",placeItems:"center",flexShrink:0,marginTop:1 }}>
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={d.accentColor} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                      </span>
                      <span style={{ fontSize:13,color:"rgba(255,255,255,.65)",lineHeight:1.5 }}>{u}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab==="features" && (
            <div style={{ padding:isMobile?"20px 16px 80px":"28px 28px 100px",display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:12 }}>
              {d.features.map((f,i) => (
                <div key={i} style={{ background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.07)",borderRadius:12,padding:"18px 20px",animation:`fadeUp .4s ease ${i*0.05+0.1}s both`,transition:"border-color .2s" }}>
                  <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:10 }}>
                    <span style={{ width:24,height:24,borderRadius:7,background:d.accentColor,display:"grid",placeItems:"center",flexShrink:0 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    </span>
                    <span style={{ fontWeight:700,fontSize:13,color:"#fff",lineHeight:1.2 }}>{f.title}</span>
                  </div>
                  <p style={{ fontSize:12,color:"rgba(255,255,255,.45)",margin:0,lineHeight:1.6 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          )}

          {tab==="stack" && (
            <div style={{ padding:isMobile?"20px 16px 80px":"28px 28px 100px" }}>
              <p style={{ fontSize:14,color:"rgba(255,255,255,.5)",marginBottom:24,lineHeight:1.6 }}>Technologies we use for {service} engagements. We recommend the right tool for each job — not the one that&apos;s most familiar.</p>
              <div style={{ display:"flex",flexWrap:"wrap",gap:10 }}>
                {d.stack.map((t,i) => (
                  <div key={i} style={{ padding:"10px 18px",borderRadius:999,background:"rgba(255,255,255,.06)",border:`1px solid rgba(255,255,255,.1)`,fontSize:13,fontFamily:"var(--f-mono)",letterSpacing:".1em",color:"rgba(255,255,255,.7)",animation:`fadeUp .4s ease ${i*0.04+0.1}s both`,display:"flex",alignItems:"center",gap:8 }}>
                    <span style={{ width:6,height:6,borderRadius:"50%",background:d.accentColor,flexShrink:0 }} />{t}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── sticky CTA ── */}
        <div style={{ padding:"16px 24px",background:"rgba(10,10,15,.95)",borderTop:"1px solid rgba(255,255,255,.08)",display:"flex",gap:10,alignItems:"center",flexShrink:0 }}>
          <button onClick={onStartService} className="btn btn--brand" style={{flex:1,maxWidth:260}}>
            <span className="label">Start this project</span>
            <span className="chip"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18M13 5l7 7-7 7"/></svg></span>
          </button>
          <button onClick={()=>setTab(tab==="overview"?"features":tab==="features"?"stack":"overview")} style={{ padding:"13px 20px",borderRadius:999,border:"1px solid rgba(255,255,255,.14)",background:"transparent",color:"rgba(255,255,255,.6)",cursor:"pointer",fontSize:13,fontFamily:"var(--f-sans)" }}>
            Next →
          </button>
          <button onClick={onClose} style={{ padding:"13px 20px",borderRadius:999,border:"1px solid rgba(255,255,255,.08)",background:"transparent",color:"rgba(255,255,255,.4)",cursor:"pointer",fontSize:13 }}>Close</button>
        </div>
      </div>

      <style>{`
        @keyframes modalIn { from{opacity:0;transform:scale(.96) translateY(20px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes blobFloat { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-20px) scale(1.05)} }
      `}</style>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   INQUIRY MODAL
   ════════════════════════════════════════════════════ */
function ServiceInquiryModal({ service, onClose }: { service:string; onClose:()=>void }) {
  const [form, setForm] = useState<IForm>({ service,name:"",email:"",company:"",description:"",budget:"",budget_custom:"",timeline:"",website:"" });
  const [submitting,setSubmitting] = useState(false);
  const [done,setDone] = useState(false);
  const [errors,setErrors] = useState<Partial<IForm>>({});
  const isMobile = useIsMobile();
  const sf = (k:keyof IForm, v:string) => setForm(f=>({...f,[k]:v}));

  const validate = () => {
    const e:Partial<IForm>={};
    if(!form.name.trim()) e.name="Required";
    if(!form.email.trim()) e.email="Required";
    else if(!/\S+@\S+\.\S+/.test(form.email)) e.email="Invalid email";
    if(!form.description.trim()) e.description="Required";
    if(!form.budget) e.budget="Required";
    if(form.budget==="custom"&&!form.budget_custom.trim()) e.budget_custom="Enter an amount";
    if(!form.timeline) e.timeline="Required";
    setErrors(e); return Object.keys(e).length===0;
  };

  const submit = async () => {
    if(!validate()) return;
    setSubmitting(true);
    try {
      await fetch("/api/service-orders",{ method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ service_name:form.service,name:form.name,email:form.email,company:form.company,
          description:form.description,budget:form.budget==="custom"?`Custom: ${form.budget_custom}`:form.budget,
          budget_custom:form.budget_custom,timeline:form.timeline,website:form.website }) });
      setDone(true);
    } catch { alert("Something went wrong. Please try again."); }
    setSubmitting(false);
  };

  useEffect(() => {
    const fn = (e:KeyboardEvent) => { if(e.key==="Escape") onClose(); };
    document.addEventListener("keydown",fn);
    return () => document.removeEventListener("keydown",fn);
  },[onClose]);

  return (
    <div style={{ position:"fixed",inset:0,zIndex:400,background:"rgba(10,10,10,.7)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",padding:"20px 16px",overflowY:"auto" }}
      onClick={e=>{ if(e.target===e.currentTarget) onClose(); }}>
      <div style={{ background:"#fff",borderRadius:20,width:"100%",maxWidth:600,boxShadow:"0 32px 80px -20px rgba(0,0,0,.35)",display:"flex",flexDirection:"column",maxHeight:"90vh",overflowY:"auto" }}>
        <div style={{ padding:isMobile?"20px 16px 0":"28px 32px 0",display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:16 }}>
          <div>
            <div style={{ fontFamily:"var(--f-mono)",fontSize:10,letterSpacing:".2em",color:"var(--muted)",textTransform:"uppercase",marginBottom:6 }}>Start a project</div>
            <h2 style={{ fontFamily:"var(--f-display)",fontSize:26,lineHeight:1.1,letterSpacing:"-.02em",margin:0 }}>{service}</h2>
          </div>
          <button onClick={onClose} style={{ marginTop:4,padding:8,borderRadius:8,background:"var(--line)",border:"none",cursor:"pointer",display:"grid",placeItems:"center",flexShrink:0 }}><CloseIcon /></button>
        </div>
        {done ? (
          <div style={{ padding:"48px 32px",textAlign:"center" }}>
            <div style={{ width:64,height:64,borderRadius:"50%",background:"#f0fdf4",border:"2px solid #22c55e",display:"grid",placeItems:"center",margin:"0 auto 20px" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            </div>
            <h3 style={{ fontFamily:"var(--f-display)",fontSize:24,marginBottom:10 }}>Brief received!</h3>
            <p style={{ color:"#555",maxWidth:"38ch",margin:"0 auto" }}>We&apos;ll review your project brief and respond within 24 hours.</p>
            <button onClick={onClose} style={{ marginTop:28,padding:"12px 28px",borderRadius:999,background:"var(--ink)",color:"#fff",border:"none",cursor:"pointer",fontSize:14,fontWeight:600 }}>Close</button>
          </div>
        ) : (
          <div style={{ padding:isMobile?"20px 16px 24px":"24px 32px 32px",display:"flex",flexDirection:"column",gap:20 }}>
            <div style={{ display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:14 }}>
              <div>
                <label style={LS}>Your name *</label>
                <input value={form.name} onChange={e=>sf("name",e.target.value)} placeholder="Ahmed Rahman" style={IS(!!errors.name)} />
                {errors.name&&<span style={ES}>{errors.name}</span>}
              </div>
              <div>
                <label style={LS}>Email *</label>
                <input value={form.email} onChange={e=>sf("email",e.target.value)} placeholder="you@company.com" type="email" style={IS(!!errors.email)} />
                {errors.email&&<span style={ES}>{errors.email}</span>}
              </div>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:14 }}>
              <div>
                <label style={LS}>Company <span style={{opacity:.5}}>(optional)</span></label>
                <input value={form.company} onChange={e=>sf("company",e.target.value)} placeholder="Acme Inc." style={IS(false)} />
              </div>
              <div>
                <label style={LS}>Website <span style={{opacity:.5}}>(optional)</span></label>
                <input value={form.website} onChange={e=>sf("website",e.target.value)} placeholder="https://…" style={IS(false)} />
              </div>
            </div>
            <div>
              <label style={LS}>Project brief *</label>
              <textarea value={form.description} onChange={e=>sf("description",e.target.value)} placeholder="Describe what you want to build, your goals, and any constraints…" rows={4} style={{...IS(!!errors.description),resize:"vertical",lineHeight:1.55}} />
              {errors.description&&<span style={ES}>{errors.description}</span>}
            </div>
            <div>
              <label style={LS}>Budget range *</label>
              <div style={{ display:"grid",gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(3,1fr)",gap:8,marginTop:6 }}>
                {BUDGET_OPTIONS.map(opt=>(
                  <button key={opt.value} onClick={()=>sf("budget",opt.value)} style={{ padding:"10px 12px",borderRadius:10,border:`1.5px solid ${form.budget===opt.value?"var(--brand)":"var(--line)"}`,background:form.budget===opt.value?"var(--brand)":"#fff",color:form.budget===opt.value?"#fff":"var(--ink)",cursor:"pointer",textAlign:"left",transition:"all .2s" }}>
                    <div style={{ fontWeight:600,fontSize:13 }}>{opt.label}</div>
                    <div style={{ fontSize:10,opacity:.75,marginTop:2 }}>{opt.sub}</div>
                  </button>
                ))}
              </div>
              {errors.budget&&<span style={ES}>{errors.budget}</span>}
              {form.budget==="custom"&&<div style={{marginTop:10}}><input value={form.budget_custom} onChange={e=>sf("budget_custom",e.target.value)} placeholder="e.g. $35,000" style={IS(!!errors.budget_custom)}/>{errors.budget_custom&&<span style={ES}>{errors.budget_custom}</span>}</div>}
            </div>
            <div>
              <label style={LS}>Timeline *</label>
              <div style={{ display:"flex",gap:8,flexWrap:"wrap",marginTop:6 }}>
                {TIMELINE_OPTIONS.map(t=>(
                  <button key={t} onClick={()=>sf("timeline",t)} style={{ padding:"8px 16px",borderRadius:999,border:`1.5px solid ${form.timeline===t?"var(--brand)":"var(--line)"}`,background:form.timeline===t?"var(--brand)":"#fff",color:form.timeline===t?"#fff":"var(--ink)",cursor:"pointer",fontSize:13,fontWeight:500,transition:"all .2s" }}>{t}</button>
                ))}
              </div>
              {errors.timeline&&<span style={ES}>{errors.timeline}</span>}
            </div>
            <div style={{ display:"flex",justifyContent:"flex-end",gap:10,paddingTop:16,borderTop:"1px solid var(--line)" }}>
              <button onClick={onClose} style={{ padding:"11px 22px",borderRadius:999,border:"1px solid var(--line)",background:"#fff",cursor:"pointer",fontSize:14 }}>Cancel</button>
              <button onClick={submit} disabled={submitting} style={{ padding:"11px 24px",borderRadius:999,background:"var(--ink)",color:"#fff",border:"none",cursor:"pointer",fontSize:14,fontWeight:600,display:"flex",alignItems:"center",gap:8,opacity:submitting?.7:1 }}>
                {submitting?"Sending…":"Send brief"} <ArrowIcon size={14}/>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── shared styles ── */
const LS: React.CSSProperties = { display:"block",fontSize:11,fontFamily:"var(--f-mono)",letterSpacing:".14em",textTransform:"uppercase",color:"var(--muted)",marginBottom:6 };
function IS(err:boolean): React.CSSProperties { return { width:"100%",padding:"10px 14px",borderRadius:10,border:`1.5px solid ${err?"#e74c3c":"var(--line)"}`,fontFamily:"inherit",fontSize:14,outline:"none",background:"#fafaf9",boxSizing:"border-box" as const }; }
const ES: React.CSSProperties = { fontSize:11,color:"#e74c3c",marginTop:4,display:"block" };

/* ════════════════════════════════════════════════════
   FULL-SCREEN STICKY SERVICE SECTION
   ════════════════════════════════════════════════════ */
function ServiceSection({ service, index, onDetail, onStart }: {
  service: DbService; index: number; onDetail: () => void; onStart: () => void;
}) {
  const d      = SERVICE_DETAILS[service.name];
  const accent = d?.accentColor ?? "#b86cf9";
  const bg     = index === 0 || service.name.toLowerCase().includes("web") || service.name.toLowerCase().includes("design") ? "#d2c3f6" : (SVC_BG[service.name] ?? "#111");
  const isLight = bg.toLowerCase() === "#d2c3f6";
  const split  = SVC_SPLIT[service.name] ?? [service.name, ""];
  const Visual = SERVICE_VISUAL[service.name];
  const isMobile = useIsMobile();

  return (
    <section style={{
      position: isMobile ? "relative" : "sticky",
      top: isMobile ? undefined : 76,
      zIndex: index + 1,
      height: isMobile ? "auto" : "calc(100vh - 76px)",
      minHeight: isMobile ? "min(92vw,520px)" : undefined,
      background: bg,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    }}>
      {/* ── top bar: index on left, Start Project + Explore on right ── */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding: isMobile ? "16px 16px" : "20px 32px", flexShrink:0, flexWrap:"wrap", gap:14 }}>
        <span style={{ fontFamily:"var(--f-mono)", fontSize:13, letterSpacing:".14em", color: isLight ? "rgba(13,0,32,.65)" : "rgba(255,255,255,.45)", fontWeight:600 }}>
          ({String(index + 1).padStart(2, "0")})
        </span>
        <div style={{ display:"flex", alignItems:"center" }}>
          <button onClick={onStart} className="btn btn--brand" style={{ padding: "5px 6px 5px 16px", minHeight: 38 }}>
            <span className="label" style={{ fontSize: 13.5 }}>Start this project</span>
            <span className="chip" style={{ width: 28, height: 28 }}><ArrowIcon size={16} /></span>
          </button>
        </div>
      </div>

      {/* ── big heading ── */}
      <div style={{ textAlign:"center", padding: isMobile ? "4px 20px 14px" : "4px 40px 16px", flexShrink:0 }}>
        <h2 style={{ margin:0, lineHeight:1.0, letterSpacing:"-.025em", fontSize:"clamp(36px,6.5vw,96px)" }}>
          <strong style={{ fontFamily:"var(--f-sans)", fontWeight:800, color: isLight ? "#0d0020" : "#fff", fontStyle:"normal" }}>{split[0]}</strong>
          {split[1] && <>{" "}<em style={{ fontFamily:"var(--f-display)", fontStyle:"italic", fontWeight:400, color: isLight ? "rgba(13,0,32,.82)" : "rgba(255,255,255,.88)" }}>{split[1]}</em></>}
        </h2>
        {service.badge && (
          <span style={{ display:"inline-block", marginTop:10, padding:"3px 12px", borderRadius:999, background:accent, fontFamily:"var(--f-mono)", fontSize:9, letterSpacing:".12em", textTransform:"uppercase", color:"#fff" }}>
            {service.badge}
          </span>
        )}
      </div>

      {/* ── central card mockup ── */}
      <div style={{ flex:1, display:"flex", justifyContent:"center", alignItems:"center", padding: isMobile ? "0 16px 28px" : "0 40px 32px", overflow:"hidden", minHeight:0 }}>
        <div style={{
          background:"#fff",
          borderRadius:20,
          width: isMobile ? "100%" : "min(720px,80%)",
          maxHeight:"100%",
          overflow:"hidden",
          boxShadow:"0 28px 70px rgba(0,0,0,.38)",
          aspectRatio:"4/3",
          position:"relative",
        }}>
          {index === 2 || service.name.toLowerCase().includes("ai") || service.name.toLowerCase().includes("artificial") ? (
            <VisualAI />
          ) : getShowcaseImage(service.name, index) || service.image ? (
            <img
              src={getShowcaseImage(service.name, index) || service.image!}
              alt={service.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          ) : (
            Visual && <Visual a={bg} />
          )}

          {/* ── Floating View Details button inside image ── */}
          <div style={{ position: "absolute", bottom: isMobile ? 12 : 20, right: isMobile ? 12 : 20, zIndex: 10 }}>
            <button
              onClick={onDetail}
              className="btn"
              style={{
                "--bg": isLight ? "rgba(255,255,255,0.88)" : "rgba(10,10,14,0.82)",
                "--fg": isLight ? "#0d0020" : "#fff",
                "--chip": isLight ? "rgba(13,0,32,0.12)" : "rgba(255,255,255,0.18)",
                "--chipfg": isLight ? "#0d0020" : "#fff",
                backdropFilter: "blur(12px)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
                border: isLight ? "1px solid rgba(0,0,0,0.12)" : "1px solid rgba(255,255,255,0.18)",
                padding: "6px 8px 6px 18px",
                minHeight: 42,
              } as React.CSSProperties}
            >
              <span className="label" style={{ fontSize: 13.5, fontWeight: 600 }}>View details</span>
              <span className="chip" style={{ width: 30, height: 30 }}><ArrowIcon size={16} /></span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════ */
const STATIC_SERVICES: DbService[] = [
  { id:1, name:"Web Design & Development",     descr:"Got an idea? A concept, a vision, a half-finished brief? Bring it as it is. We design it, build it, integrate it, and ship it — any website, any web application, start to finish.", count:"Next.js,React,TypeScript,Sanity,Postgres", badge:"Most popular", image:"/assets/hero-showcase.png" },
  { id:2, name:"iOS, Android & Cross-platform",descr:"From your idea to a live App Store listing — in 8 to 12 weeks. We handle design, development, QA, and submission. You walk away with a product you fully own.",                   count:"React Native,Swift,Kotlin,Flutter,Firebase",  badge:null,           image:null },
  { id:3, name:"AI-Integrated Software",        descr:"Real AI that ships to production. RAG search, AI assistants, agentic workflows, fine-tuned models — embedded in your product where they actually change how it works.",              count:"OpenAI,Anthropic,LangChain,Pinecone,pgvector",badge:"New · 2026",   image:null },
  { id:4, name:"Ecommerce & Multi-vendor",      descr:"A store that converts, a marketplace that scales. Single-vendor or multi-vendor with Stripe Connect payouts. Fast, beautiful, and load-tested to 50K concurrent shoppers.",          count:"Shopify Plus,Medusa,Next.js,Stripe,Algolia", badge:null,           image:null },
  { id:5, name:"Real-estate platforms",         descr:"Listing portals, agent CRMs, map clustering, mortgage tools — built for the speed real estate demands. We cut one client's search from 4.1s to 380ms.",                             count:"Mapbox,Algolia,Postgres,PostGIS,Next.js",    badge:null,           image:null },
  { id:6, name:"UI · UX & Brand",               descr:"Your brand as a complete system — logo, tokens, components, motion, and Figma documentation that your engineers can actually build from. Designed for clarity, shipped to production.", count:"Figma,Tokens Studio,Style Dictionary,Framer", badge:null,           image:null },
  { id:7, name:"Performance marketing",         descr:"Paid ads, technical SEO, lifecycle email, CRO — all wired to the same analytics stack as your product. One team, full funnel, no attribution gaps.",                                count:"GA4,Segment,Klaviyo,Meta Ads,Google Ads",    badge:null,           image:null },
];

export default function ServicesPage({ initialServices = [] }: { initialServices?: DbService[] }) {
  useScrollReveal(".fade, .reveal");
  const [dbServices] = useState<DbService[]>(initialServices);
  const [detailService, setDetailService] = useState<DbService | null>(null);
  const [inquiryService, setInquiryService] = useState<string | null>(null);

  const rawServices = dbServices.length > 0 ? dbServices : STATIC_SERVICES;
  const services = rawServices.map((s, idx) => {
    const customImg = getShowcaseImage(s.name, idx);
    if (customImg) {
      return { ...s, image: customImg };
    }
    return s;
  });

  const openDetail   = useCallback((s: DbService) => { setDetailService(s); document.body.style.overflow = "hidden"; }, []);
  const closeDetail  = useCallback(() => { setDetailService(null); document.body.style.overflow = ""; }, []);
  const openInquiry  = useCallback((name: string) => { setDetailService(null); setInquiryService(name); document.body.style.overflow = "hidden"; }, []);
  const closeInquiry = useCallback(() => { setInquiryService(null); document.body.style.overflow = ""; }, []);

  return (
    <>
      {detailService && <ServiceDetailModal service={detailService.name} image={detailService.image} onClose={closeDetail} onStartService={() => openInquiry(detailService.name)} />}
      {inquiryService && <ServiceInquiryModal service={inquiryService} onClose={closeInquiry} />}

      {/* ── HERO ── */}
      <section className="page-hero">
        <div className="wrap">
          <div className="crumbs fade in">
            <Link href="/">Home</Link><span className="sep">/</span><span>Services</span>
          </div>
          <div className="svc-hero-chip fade in">
            <span className="svc-chip-dot" />07 capabilities
          </div>
          <h1 className="display" style={{ margin: "20px 0 24px", fontSize: "clamp(52px,8.5vw,116px)", lineHeight: 0.92, letterSpacing: "-.03em" }}>
            <span className="reveal in"><span className="reveal-inner">Seven ways we</span></span>
            <span className="reveal in reveal-delay-1"><span className="reveal-inner">can help</span></span>
            <span className="reveal in reveal-delay-2"><span className="reveal-inner it">you ship.</span></span>
          </h1>
          <p className="lede fade in d2" style={{ maxWidth: "52ch", marginBottom: 36 }}>
            From concept to code to launch — design, engineering, AI, ecommerce, brand and growth. All under one roof. No handoffs. No gaps.
          </p>
          <div className="fade in d3" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button onClick={() => openInquiry("General Inquiry")} className="btn btn--lg">
              <span className="label">Start a project</span>
              <span className="chip"><ArrowIcon size={16} /></span>
            </button>
            <Link href="/work" className="btn btn--ghost btn--lg" style={{ textDecoration: "none" }}>
              <span className="label">See our work</span>
              <span className="chip"><ArrowIcon size={16} /></span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── STICKY SERVICE SECTIONS ── */}
      <div>
        {services.map((s, i) => (
          <ServiceSection
            key={s.id}
            service={s}
            index={i}
            onDetail={() => openDetail(s)}
            onStart={() => openInquiry(s.name)}
          />
        ))}
      </div>

      {/* ── PROCESS ── */}
      <section id="process" style={{ padding: "100px 0", background: "#0a0a0a" }}>
        <div className="process">
          <div className="wrap">
            <div className="process-head">
              <div><div className="fade"><span className="eyebrow" style={{ color: "#666" }}>How we work</span></div></div>
              <h2 className="fade d1" style={{ color: "#fff" }}>A <span style={{ fontStyle: "italic", color: "var(--brand)" }}>deliberate</span> process — four chapters from brief to launch.</h2>
            </div>
            <div className="steps">
              {[
                { num: "01", title: "Discover", copy: "We unpack the problem — user research, stakeholder workshops, technical audits. We challenge the brief before we execute it.", items: ["Audit", "Stakeholder map", "JTBD"] },
                { num: "02", title: "Design",   copy: "IA, flows, components, prototypes — designed in the browser. What you see is what ships.", items: ["IA", "Design system", "Hi-fi prototypes"] },
                { num: "03", title: "Build",    copy: "Production engineering with weekly demos. CI/CD, observability, and analytics from day one — never retrofitted.", items: ["Next.js · Swift", "Postgres", "CI / CD"] },
                { num: "04", title: "Care",     copy: "Launch is a milestone, not the end. We retain a senior pod after launch to ship the next 90 days of your roadmap.", items: ["SLA", "Experiments", "Roadmap"] },
              ].map((s, i) => (
                <div className={`step fade${i > 0 ? ` d${i}` : ""}`} key={s.num}>
                  <div className="num">{s.num}</div>
                  <div><div className="title">{s.title}</div></div>
                  <div className="copy">{s.copy}<ul>{s.items.map(it => <li key={it}>{it}</li>)}</ul></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="contact" style={{ padding: "60px 0" }}>
        <div className="cta">
          <div className="wrap-tight">
            <div className="fade in"><span className="eyebrow">Let&apos;s build</span></div>
            <h2 className="fade in d1">Pick a craft. <span className="it">Or all of them.</span></h2>
            <div className="row fade in d2">
              <button onClick={() => openInquiry("General Inquiry")} className="btn btn--lg">
                <span className="label">Start a project</span>
                <span className="chip"><ArrowIcon size={16} /></span>
              </button>
              <Link href="/work" className="btn btn--ghost btn--lg">
                <span className="label">See the work</span>
                <span className="chip"><ArrowIcon size={16} /></span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .svc-hero-chip {
          display: inline-flex; align-items: center; gap: 9px;
          padding: 6px 14px 6px 10px; border-radius: 999px;
          border: 1px solid var(--line); margin-bottom: 0;
          font-family: var(--f-mono); font-size: 11px;
          letter-spacing: .14em; text-transform: uppercase; color: var(--muted);
        }
        .svc-chip-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--brand); flex-shrink: 0;
          animation: svcpulse 2s infinite;
        }
        @keyframes svcpulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(184,108,249,.4); }
          70%      { box-shadow: 0 0 0 7px rgba(184,108,249,0); }
        }
      `}</style>
    </>
  );
}
