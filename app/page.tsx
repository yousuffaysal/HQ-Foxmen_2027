"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import ProjectEstimator from "@/app/components/ProjectEstimator";
import dynamic from "next/dynamic";
const WorldMapDecoration = dynamic(
  () => import("@/app/components/WorldMapLeaflet"),
  { ssr: false, loading: () => null }
);

function ArrowIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h18M13 5l7 7-7 7" />
    </svg>
  );
}
function SmArrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
      <path d="M3 12h18M13 5l7 7-7 7" />
    </svg>
  );
}

/*
 * SlideButton — looks exactly like btn btn--lg.
 * On mobile: drag the chip (circle) leftward across the label to navigate.
 * On desktop: regular click also navigates.
 */
function SlideButton({ href, label, ghost = false }: {
  href: string;
  label: string;
  ghost?: boolean;
}) {
  const router = useRouter();
  const [offset,   setOffset]   = useState(0);
  const [snapping, setSnapping] = useState(false);
  const [done,     setDone]     = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, moved: false });
  const CHIP = 54;

  // chip starts at left pad (6px), must reach right edge (containerWidth - 6 - CHIP)
  const getMax = () =>
    Math.max(1, (containerRef.current?.clientWidth ?? 300) - CHIP - 12);

  useEffect(() => {
    const move = (x: number) => {
      if (!drag.current.active) return;
      const delta = x - drag.current.startX; // positive = dragged right
      if (Math.abs(delta) > 4) drag.current.moved = true;
      const max = getMax();
      const v = Math.max(0, Math.min(delta, max));
      setOffset(v);
      if (v >= max * 0.93) {
        drag.current.active = false;
        setOffset(max); // snap chip flush to right edge
        setDone(true);
        setTimeout(() => router.push(href), 380);
      }
    };
    const release = () => {
      if (!drag.current.active) return;
      drag.current.active = false;
      setSnapping(true);
      setOffset(0);
      setTimeout(() => setSnapping(false), 540);
    };
    const mm = (e: MouseEvent) => move(e.clientX);
    const tm = (e: TouchEvent) => move(e.touches[0].clientX);
    window.addEventListener("mousemove", mm);
    window.addEventListener("mouseup",   release);
    window.addEventListener("touchmove", tm,     { passive: true });
    window.addEventListener("touchend",  release);
    return () => {
      window.removeEventListener("mousemove", mm);
      window.removeEventListener("mouseup",   release);
      window.removeEventListener("touchmove", tm);
      window.removeEventListener("touchend",  release);
    };
  }, [href, router]);

  const progress = containerRef.current ? offset / getMax() : 0;

  return (
    <div
      ref={containerRef}
      className={`slide-btn${ghost ? " slide-btn--ghost" : ""}${done ? " slide-btn--done" : ""}`}
      onMouseDown={(e)  => { drag.current = { active: true, startX: e.clientX, moved: false }; setSnapping(false); }}
      onTouchStart={(e) => { drag.current = { active: true, startX: e.touches[0].clientX, moved: false }; setSnapping(false); }}
      onClick={() => { if (!drag.current.moved) router.push(href); drag.current.moved = false; }}
      role="link"
      tabIndex={0}
      style={{ userSelect: "none" } as React.CSSProperties}
    >
      {/* Chip on LEFT — slides right to activate */}
      <div
        className="slide-btn-chip"
        style={{
          transform:  `translateX(${offset}px)`,
          transition: snapping ? "transform .55s cubic-bezier(.34,1.56,.64,1)" : "none",
        }}
      >
        <ArrowIcon size={22} />
      </div>
      {/* Label centered — fades as chip slides over it */}
      <span className="slide-btn-label" style={{ opacity: Math.max(0.08, 0.72 - progress * 1.8) }}>
        Slide to {label.toLowerCase()}
      </span>
    </div>
  );
}

function Hero() {
  const orbitRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onScroll = () => {
      if (orbitRef.current) orbitRef.current.style.translate = `0 ${window.scrollY * 0.15}px`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="hero" id="top">
      <div className="hero-orbit" ref={orbitRef} aria-hidden="true">
        <svg viewBox="0 0 200 200">
          <defs>
            <path id="circ" d="M100,100 m -80,0 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0" />

          </defs>
          <text fontFamily="Geist Mono, monospace" fontSize="9.5" letterSpacing="3" fill="#0a0a0a">
            <textPath href="#circ">CODE · CRAFT · CARE · CODE · CRAFT · CARE · CODE · CRAFT · CARE · </textPath>
          </text>
          <image href="/assets/logo_sn_fox.png" x="64" y="64" width="72" height="72" />
        </svg>
      </div>
      <div className="wrap">
        <div className="hero-tag fade in">
          <span className="eyebrow">International Digital Studio — EST. 2025</span>
        </div>
        <h1 className="display in">
          <span className="row">
            <span className="reveal in"><span className="reveal-inner">We build</span></span>
            <span className="reveal in reveal-delay-1"><span className="reveal-inner it">digital</span></span>
          </span>
          <span className="row">
            <span className="reveal in reveal-delay-2"><span className="reveal-inner">products</span></span>
            <span className="reveal in reveal-delay-3"><span className="reveal-inner">that</span></span>
            <span className="reveal in reveal-delay-4"><span className="reveal-inner it">ship.</span></span>
          </span>
        </h1>
        <div className="hero-bottom">
          <p className="fade d2">
            From custom AI to full-stack development — we design, develop and
            deploy digital products that grow with you.
          </p>
          <div className="fade d3">
            <div className="stat">120+</div>
            <div className="stat-sub">Products shipped worldwide</div>
          </div>
          <div className="fade d4 hero-actions">
            {/* Desktop: original btn--lg */}
            <div className="hero-cta-desktop">
              <Link href="/work" className="btn btn--lg">
                <span className="label">See our work</span>
                <span className="chip" aria-hidden="true"><ArrowIcon /></span>
              </Link>
              <button
                className="tlink"
                data-cal-link="yousuf-faysal/project-discussion-call"
                data-cal-namespace="project-discussion-call"
                data-cal-config='{"layout":"week_view","useSlotsViewOnSmallScreen":"true","theme":"auto"}'
                style={{ background: "none", border: "none", padding: 0, cursor: "pointer", font: "inherit" }}
              >Book a 20-min call →</button>
            </div>
            {/* Mobile: slide-to-activate */}
            <div className="hero-cta-mobile">
              <SlideButton href="/work"   label="See our work"  />
              <SlideButton href="/portal" label="Client Portal" ghost />
            </div>
          </div>
        </div>
      </div>
      <div className="hero-scroll" aria-hidden="true">
        <span>Scroll</span>
        <span className="bar" />
      </div>
    </section>
  );
}

function Reel() {
  const reelRef   = useRef<HTMLElement>(null);
  const frameRef  = useRef<HTMLDivElement>(null);
  const labelRef  = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const reel  = reelRef.current;
    const frame = frameRef.current;
    if (!reel || !frame) return;

    // Cache layout values — only re-read on resize, never on scroll
    let reelTop = 0, scrollable = 0, winH = 0;
    let cur = 0, tgt = 0, raf = 0;

    const measure = () => {
      winH       = window.innerHeight;
      reelTop    = reel.getBoundingClientRect().top + window.scrollY;
      scrollable = reel.offsetHeight - winH;
    };

    // Scroll handler reads only window.scrollY — zero layout cost
    const onScroll = () => {
      const raw = (window.scrollY - reelTop) / (scrollable || 1);
      tgt = Math.min(1, Math.max(0, (Math.min(Math.max(raw, 0), 1) - 0.08) / 0.55));
    };

    // 60fps lerp loop — decouples DOM writes from scroll events
    const tick = () => {
      cur += (tgt - cur) * 0.09;
      frame.style.setProperty("--reel-p", cur.toFixed(4));
      if (labelRef.current)
        labelRef.current.style.setProperty("--reel-label-op", (1 - Math.min(1, cur * 1.5)).toFixed(3));
      raf = requestAnimationFrame(tick);
    };

    measure();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure,  { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <section className="reel" id="reel" ref={reelRef} aria-label="Studio showreel">
      <div className="sticky">
        <div className="label fade" ref={labelRef}>
          <span className="it">Showreel</span> · 2026 · selected work
        </div>
        <div className="frame" ref={frameRef}>
          <div className="reel-video">
            <iframe
              className="reel-iframe"
              src="https://www.youtube.com/embed/V_x0ellgYwI?autoplay=1&mute=1&loop=1&controls=0&playlist=V_x0ellgYwI&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
            <div className="reel-video-overlay" />
            <div className="ticker">
              <span>120 products shipped</span><span>17 countries</span>
              <span>42 active clients</span><span>98% retention</span>
              <span>120 products shipped</span><span>17 countries</span>
              <span>42 active clients</span><span>98% retention</span>
            </div>
          </div>
        </div>
        <div className="play-cue" aria-hidden="true"><span className="live" /> Live preview</div>
      </div>
    </section>
  );
}

const svcRows = [
  { idx:"/ 01", title:"Web Design & Development", desc:"Marketing sites, SaaS dashboards, and bespoke web apps built on Next.js, React, and headless CMS — buttery animations and 100/100 Lighthouse out of the box.", tags:"Next.js · Framer · Sanity", preview:"Sites" },
  { idx:"/ 02", title:"Mobile Apps", desc:"Cross-platform iOS & Android apps in React Native and Flutter. From MVP to App Store in 8–12 weeks, with native performance and tight design QA.", tags:"iOS · Android · Flutter", preview:"Apps" },
  { idx:"/ 03", title:"AI-Integrated Software", desc:"Embed GPT-class intelligence into your product — copilots, semantic search, retrieval pipelines, agents, and fine-tuned models that actually ship.", tags:"LLMs · RAG · Agents", preview:"AI" },
  { idx:"/ 04", title:"Ecommerce & Multi-Vendor", desc:"Shopify, custom Medusa stacks, and marketplace platforms with vendor portals, payouts, and the unit economics you need to scale.", tags:"Shopify · Medusa · Stripe", preview:"Stores" },
  { idx:"/ 05", title:"Real-Estate Platforms", desc:"Listings, brokerage CRMs, search with map clustering, mortgage tooling, agent dashboards — performant at portfolio scale.", tags:"Mapbox · Algolia · Postgres", preview:"Real Estate" },
  { idx:"/ 06", title:"UI · UX & Brand", desc:"Identity, design systems, and product flows that hold up at scale. We design for clarity, then make it sing with motion.", tags:"Figma · Tokens · Motion", preview:"Design" },
  { idx:"/ 07", title:"Performance Marketing", desc:"Funnels, paid acquisition, SEO, and creative ops — wired to the same analytics stack as the product you just launched.", tags:"SEO · Ads · Lifecycle", preview:"Growth" },
];

const cards = [
  { tone:"violet", slug:"nestaro", num:"CASE 01 / 06", name:"Nestaro", sub:"— real-estate OS", copy:"A search-first listings platform with map clustering, saved searches, agent CRMs and mortgage tools. We rebuilt the search index from scratch — page-loads dropped from 4.1s to 380ms.", meta:[["Industry","Real Estate"],["Year","2025"],["Scope","Design · Build · AI"]], eyebrow:"Web · iOS · Android", screenTitle:"Nestaro", screenSub:"— real estate", lns:["w2","w1","w3","w4","w2"], ph:"Product · 01", phColor:undefined },
  { tone:"ink",    slug:"pulse",   num:"CASE 02 / 06", name:"Pulse",   sub:"— AI copilot",     copy:"RAG-powered sales copilot for a B2B SaaS, with custom embeddings, agent tooling and an interface that feels closer to Linear than to ChatGPT. Adoption hit 92% in week one.", meta:[["Industry","B2B SaaS"],["Year","2025"],["Scope","AI · UX · Build"]], eyebrow:"LLMs · Vector DB", screenTitle:"Pulse", screenSub:"— ai copilot", lns:["w2","w3","w1","w2","w4"], ph:"Product · 02", phColor:undefined },
  { tone:"bone",   slug:"marketo", num:"CASE 03 / 06", name:"Marketo", sub:"— multi-vendor",   copy:"A multi-vendor marketplace with vendor onboarding, split payouts via Stripe Connect, ratings, and an opinionated commerce design language. Now hosts 2,400+ sellers.", meta:[["Industry","Ecommerce"],["Year","2024"],["Scope","Platform · Brand"]], eyebrow:"Medusa · Stripe", screenTitle:"Marketo", screenSub:"— marketplace", lns:["w1","w2","w3","w4","w2"], ph:"Product · 03", phColor:"rgba(10,10,10,.35)" },
  { tone:"brand",  slug:"atlas",   num:"CASE 04 / 06", name:"Atlas",   sub:"— travel app",     copy:"A native iOS travel planner with AI-generated itineraries and offline maps. The first version shipped in 9 weeks; #6 in App Store Travel within a month.", meta:[["Industry","Travel"],["Year","2025"],["Scope","iOS · AI"]], eyebrow:"Swift · Mapbox", screenTitle:"Atlas", screenSub:"— mobile", lns:["w2","w1","w3","w2","w4"], ph:"Product · 04", phColor:"rgba(255,255,255,.55)" },
];

const proofCells = [
  { mk:"◆", name:"Nestaro",    badge:"Real Estate" },
  { mk:"●", name:"Pulse",      badge:"B2B SaaS" },
  { mk:"▲", name:"Marketo",    badge:"Ecommerce" },
  { mk:"✦", name:"Atlas",      badge:"Travel" },
  { mk:"◇", name:"Orbit Bank", badge:"Fintech" },
  { mk:"★", name:"Hearth",     badge:"Health" },
  { mk:"◐", name:"Lumen",      badge:"AI" },
  { mk:"⬡", name:"Northwind",  badge:"Logistics" },
  { mk:"⌬", name:"Folio",      badge:"Design" },
  { mk:"⟁", name:"Cadence",    badge:"Music" },
  { mk:"⌖", name:"Verse",      badge:"Edu" },
  { mk:"◈", name:"Quill",      badge:"Publishing" },
];

const steps = [
  { num:"01", title:"Discover", copy:"Workshops, audits, user research. We unpack the problem from every angle and write a brief that the founders, engineers and designers all agree on.", items:["Audit","Stakeholder map","JTBD"] },
  { num:"02", title:"Design",   copy:"Information architecture, flows, components, prototypes. We design in the browser so what you see is what ships — no Figma-to-code gap.", items:["IA","Design system","Hi-fi prototypes"] },
  { num:"03", title:"Build",    copy:"Production engineering with weekly demos. CI, observability and analytics from day one — never bolted on at the end.", items:["Next.js · Swift","Postgres","CI / CD"] },
  { num:"04", title:"Care",     copy:"Launch is a milestone, not the finish line. We retain a small pod after launch to ship the next 90 days and tune for growth.", items:["SLA","Experiments","Roadmap"] },
];

const marqueeItems = ["Web Design","Mobile Apps","AI Integration","Ecommerce","Real-Estate Platforms","Multi-Vendor","UI · UX","Brand Systems","Marketing"];
const techItems    = ["React","Next.js","Swift","Flutter","OpenAI","Anthropic","Stripe","Postgres","Figma","Webflow"];

type DbService = { id:number; ord:number; name:string; descr:string; count:string; visible:boolean; badge:string|null; image:string|null };
type DbProject = { id:number; name:string; tagline:string; industry:string; year:string; scope:string; status:string; thumbnail:string; slug:string; color_cls:string; live_url:string };
type DbClient  = { id:number; name:string; industry:string; country:string };
type DbTesti   = { id:number; quote:string; name:string; role:string; av:string; hi:string; rating:number; img:string };

const PROOF_SYMBOLS = ["◆","●","▲","✦","◇","★","◐","⬡","⌬","⟁","⌖","◈","◉","▼","◫","⌑","⌀","⊕","⟐","⌘"];

function toSlug(n: string) { return n.toLowerCase().replace(/[—–]/g,"-").replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").trim(); }

const STATIC_TESTIS = [
  { id:-1, av:"SK", img:"", name:"Sara Köhler",  role:"CEO · Nestaro",          hi:"actually used", rating:5, quote:"Foxmen turned a vague pitch deck into a product our investors actually used during the round. They ship like a product team, not an agency." },
  { id:-2, av:"DA", img:"", name:"Devon Arias",  role:"Head of Product · Pulse", hi:"activation rate", rating:5, quote:"The AI copilot they built drove our activation rate from 28% to 71%. Every meeting felt like we got our money back twice." },
  { id:-3, av:"RM", img:"", name:"Rina Mehta",   role:"CTO · Marketo",           hi:"zero", rating:5, quote:"Care is in the name and it shows. Our launch had zero P0s in week one — a first for us across three agencies." },
];

const BRAND_REPLIES = [
  "Means the world to us 🙏",
  "So grateful for this ✨",
  "This made our day 💜",
];

function splitQuote(q: string): string[] {
  const words = q.split(/\s+/);
  if (words.length <= 13) return [q];
  const mid = Math.floor(words.length * 0.46);
  let cut = mid;
  for (let i = mid; i < Math.min(mid + 7, words.length - 4); i++) {
    if (/[,;.!?—]$/.test(words[i])) { cut = i + 1; break; }
  }
  const a = words.slice(0, cut).join(" ");
  const b = words.slice(cut).join(" ");
  if (words.length > 28) {
    const mid2 = Math.floor(words.slice(cut).length * 0.5) + cut;
    return [a, words.slice(cut, mid2).join(" "), words.slice(mid2).join(" ")].filter(s => s.trim().length > 1);
  }
  return [a, b].filter(s => s.trim().length > 1);
}

function SignalIcon() {
  return (
    <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
      <rect x="0" y="8" width="3" height="4" rx="0.8" fill="black" fillOpacity=".4"/>
      <rect x="4.5" y="5.5" width="3" height="6.5" rx="0.8" fill="black" fillOpacity=".65"/>
      <rect x="9" y="3" width="3" height="9" rx="0.8" fill="black" fillOpacity=".85"/>
      <rect x="13.5" y="0" width="3" height="12" rx="0.8" fill="black"/>
    </svg>
  );
}
function BatteryIcon() {
  return (
    <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
      <rect x=".5" y=".5" width="20" height="11" rx="3.5" stroke="#30d158" strokeOpacity=".6"/>
      <rect x="1.5" y="1.5" width="16.5" height="8.5" rx="2.5" fill="#30d158"/>
      <path d="M22 4.5v3a1.5 1.5 0 0 0 0-3Z" fill="black" fillOpacity=".4"/>
    </svg>
  );
}


/* ─────────────────────────────────────────────────────────────────────────
   Portal Feature Section
   Left: scroll-driven 4-step list  |  Right: sticky animated portal mockup
───────────────────────────────────────────────────────────────────────── */
const PF_CSS = `
.pf-section { padding: 120px 0 80px; }
.pf-intro { max-width:520px; margin-top:20px; font-size:17px; line-height:1.65; opacity:.58; }

.pf-split {
  display:grid; grid-template-columns:1fr 1fr;
  gap:88px; margin-top:72px; align-items:start;
}

/* steps */
.pf-step {
  display:flex; gap:24px; padding:30px 0;
  border-top:1px solid rgba(10,10,10,.09);
  opacity:.3; transition:opacity .5s cubic-bezier(.16,1,.3,1);
  cursor:default;
}
.pf-step:first-child { border-top:none; }
.pf-step--active { opacity:1; }

.pf-step-num {
  font-family:var(--font-geist-mono,monospace); font-size:11px;
  color:var(--brand,#b86cf9); letter-spacing:.07em; padding-top:4px; min-width:26px;
}
.pf-step-title {
  font-size:21px; font-weight:600;
  font-family:var(--font-instrument-serif,Georgia,serif);
  margin-bottom:10px; transition:color .35s ease;
}
.pf-step--active .pf-step-title { color:var(--brand,#b86cf9); }
.pf-step-copy { font-size:15px; line-height:1.68; opacity:.62; max-width:340px; }

/* sticky col */
.pf-sticky-col { position:sticky; top:100px; }

/* mock window */
.pf-mock {
  background:#111; border-radius:14px; overflow:hidden;
  box-shadow:0 0 0 1px rgba(255,255,255,.07),
             0 40px 100px rgba(0,0,0,.35),
             0 8px 24px rgba(0,0,0,.2);
}

/* title bar */
.pf-titlebar {
  display:flex; align-items:center; gap:6px;
  padding:11px 14px;
  background:rgba(255,255,255,.035);
  border-bottom:1px solid rgba(255,255,255,.06);
}
.pf-tb-dot { display:inline-block; width:10px; height:10px; border-radius:50%; }
.pf-tb-dot--r { background:#ff5f57; }
.pf-tb-dot--y { background:#febc2e; }
.pf-tb-dot--g { background:#28c840; }
.pf-tb-url {
  margin-left:10px; font-family:var(--font-geist-mono,monospace);
  font-size:11px; color:rgba(255,255,255,.25); letter-spacing:.02em;
}

/* app chrome */
.pf-app { display:flex; height:380px; }

/* sidebar */
.pf-sidebar {
  width:48px; background:rgba(255,255,255,.025);
  border-right:1px solid rgba(255,255,255,.06);
  display:flex; flex-direction:column; align-items:center;
  padding:16px 0; gap:6px;
}
.pf-sb-logo { margin-bottom:14px; display:flex; }
.pf-sb-nav {
  width:34px; height:30px; border-radius:8px;
  display:flex; align-items:center; justify-content:center;
  transition:background .3s ease;
}
.pf-sb-nav--active { background:rgba(184,108,249,.2); }
.pf-sb-icon {
  width:14px; height:14px; border-radius:3px;
  background:rgba(255,255,255,.2); transition:background .3s ease;
}
.pf-sb-nav--active .pf-sb-icon { background:var(--brand,#b86cf9); }

/* main panel */
.pf-main {
  flex:1; padding:20px 20px 18px;
  display:flex; flex-direction:column; gap:16px; overflow:hidden;
}

/* topbar */
.pf-topbar { display:flex; align-items:center; justify-content:space-between; }
.pf-proj-name { font-size:12px; font-weight:600; color:rgba(255,255,255,.8); }
.pf-live-pill {
  display:flex; align-items:center; gap:5px;
  background:rgba(255,255,255,.06); border-radius:20px;
  padding:3px 9px; font-size:10px; color:rgba(255,255,255,.45); font-weight:500;
}
.pf-live-dot {
  width:6px; height:6px; border-radius:50%; background:#4ade80;
  animation:pfPulse 2s ease-in-out infinite;
}
@keyframes pfPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.45;transform:scale(.65)} }

/* progress */
.pf-progress { }
.pf-progress-hd {
  display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;
}
.pf-progress-lbl {
  font-size:10px; text-transform:uppercase; letter-spacing:.07em; color:rgba(255,255,255,.35);
}
.pf-progress-pct {
  font-size:13px; font-weight:700; color:var(--brand,#b86cf9);
  font-family:var(--font-geist-mono,monospace);
  animation:pfNumIn .4s cubic-bezier(.16,1,.3,1) both;
}
@keyframes pfNumIn { from{opacity:0;transform:translateY(5px)} to{opacity:1;transform:translateY(0)} }
.pf-bar-track { height:5px; background:rgba(255,255,255,.08); border-radius:99px; overflow:hidden; }
.pf-bar-fill {
  height:100%; border-radius:99px;
  background:linear-gradient(90deg,#7c3aed,#b86cf9,#c4b5fd);
  transition:width .9s cubic-bezier(.16,1,.3,1);
}

/* tasks */
.pf-tasks { display:flex; flex-direction:column; gap:5px; }
.pf-task {
  display:flex; align-items:center; gap:9px;
  padding:7px 10px; border-radius:8px;
  background:rgba(255,255,255,.04);
  font-size:12px; color:rgba(255,255,255,.35);
  transition:background .4s ease, color .4s ease;
}
.pf-task--done { color:rgba(255,255,255,.78); background:rgba(184,108,249,.07); }
.pf-task-chk {
  width:16px; height:16px; border-radius:4px; flex-shrink:0;
  border:1.5px solid rgba(255,255,255,.15);
  display:flex; align-items:center; justify-content:center;
  transition:background .35s ease, border-color .35s ease;
}
.pf-task--done .pf-task-chk {
  background:var(--brand,#b86cf9); border-color:var(--brand,#b86cf9);
  animation:pfCheckPop .4s cubic-bezier(.34,1.56,.64,1) both;
}
@keyframes pfCheckPop { from{transform:scale(0);opacity:0} to{transform:scale(1);opacity:1} }
.pf-task-new {
  margin-left:auto; font-size:10px;
  background:rgba(74,222,128,.12); color:#4ade80;
  padding:2px 7px; border-radius:4px;
  animation:pfTagIn .4s cubic-bezier(.16,1,.3,1) both;
}
@keyframes pfTagIn { from{opacity:0;transform:scale(.8)} to{opacity:1;transform:scale(1)} }

/* notification */
.pf-notif {
  display:flex; align-items:flex-start; gap:10px;
  background:rgba(255,255,255,.045); border:1px solid rgba(255,255,255,.07);
  border-radius:10px; padding:11px 13px;
  opacity:0; transform:translateY(-10px) scale(.97);
  transition:opacity .55s cubic-bezier(.16,1,.3,1),
             transform .55s cubic-bezier(.16,1,.3,1);
  pointer-events:none;
}
.pf-notif--show { opacity:1; transform:translateY(0) scale(1); pointer-events:auto; }
.pf-notif-ico {
  width:28px; height:28px; flex-shrink:0; border-radius:8px;
  background:rgba(184,108,249,.15); color:var(--brand,#b86cf9);
  display:flex; align-items:center; justify-content:center;
}
.pf-notif-title { font-size:12px; font-weight:600; color:rgba(255,255,255,.82); margin-bottom:2px; }
.pf-notif-sub   { font-size:11px; color:rgba(255,255,255,.32); }

/* approve row */
.pf-approve {
  display:flex; gap:8px; margin-top:auto;
  animation:pfApprove .55s cubic-bezier(.16,1,.3,1) both;
}
@keyframes pfApprove { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
.pf-approve-btn {
  flex:1; background:var(--brand,#b86cf9); color:#fff; border:none;
  border-radius:8px; padding:9px; font-size:12px; font-weight:600; cursor:default;
}
.pf-comment-btn {
  flex:1; background:rgba(255,255,255,.07); color:rgba(255,255,255,.55);
  border:none; border-radius:8px; padding:9px; font-size:12px; cursor:default;
}

/* responsive */
@media(max-width:900px) {
  .pf-split { grid-template-columns:1fr; gap:48px; margin-top:48px; }
  .pf-sticky-col { position:static; order:-1; }
  .pf-app { height:320px; }
  .pf-step { opacity:1; }
}
`;

function PortalFeatureSection() {
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const el = document.createElement("style");
    el.id = "pf-css";
    el.textContent = PF_CSS;
    if (!document.getElementById("pf-css")) document.head.appendChild(el);
    return () => { document.getElementById("pf-css")?.remove(); };
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step ?? 0));
        });
      },
      { rootMargin: "-38% 0px -38% 0px", threshold: 0 }
    );
    stepRefs.current.forEach(r => r && obs.observe(r));
    return () => obs.disconnect();
  }, []);

  const STEPS = [
    { num: "01", title: "Get invited", copy: "A secure invite lands in your inbox on day one. One click and you're inside your private portal — zero setup, zero friction." },
    { num: "02", title: "See everything", copy: "Live status, file drops, sprint timelines and team progress — one clean view. No chasing emails, no wondering what's happening." },
    { num: "03", title: "Stay notified", copy: "Push alerts the moment a milestone lands, a design is ready, or something needs your eyes. Always in the loop without asking." },
    { num: "04", title: "Approve & ship", copy: "Review deliverables, drop comments, sign off on milestones right inside the portal. No email threads. Pure momentum." },
  ];

  const PROGRESS = [26, 52, 76, 100];
  const TASKS    = ["Design System", "Frontend Build", "API Integration", "QA & Launch"];

  const NAV_ACTIVE: Record<number, number> = { 0: 0, 1: 1, 2: 3, 3: 1 };

  return (
    <section className="section pf-section" id="portal-feature">
      <div className="wrap">
        <div className="fade"><span className="eyebrow">Client Portal</span></div>
        <h2 className="display fade d1">
          Your project, always <span className="it">in the light.</span>
        </h2>
        <p className="pf-intro fade d2">
          Every Foxmen project ships with a private client portal — real-time progress, files, milestones and a direct line to the team.
        </p>

        <div className="pf-split">
          {/* ── LEFT: steps ── */}
          <div>
            {STEPS.map((s, i) => (
              <div
                key={i}
                ref={el => { stepRefs.current[i] = el; }}
                data-step={i}
                className={`pf-step${active === i ? " pf-step--active" : ""}`}
                onClick={() => setActive(i)}
              >
                <div className="pf-step-num">{s.num}</div>
                <div>
                  <div className="pf-step-title">{s.title}</div>
                  <div className="pf-step-copy">{s.copy}</div>
                </div>
              </div>
            ))}
            <div style={{ marginTop: 40 }}>
              <Link href="/portal" className="btn btn--lg fade d3">
                <span className="label">Access client portal</span>
                <span className="chip"><ArrowIcon /></span>
              </Link>
            </div>
          </div>

          {/* ── RIGHT: sticky animated mockup ── */}
          <div className="pf-sticky-col">
            <div className="pf-mock">
              {/* macOS title bar */}
              <div className="pf-titlebar">
                <span className="pf-tb-dot pf-tb-dot--r" />
                <span className="pf-tb-dot pf-tb-dot--y" />
                <span className="pf-tb-dot pf-tb-dot--g" />
                <span className="pf-tb-url">foxmenstudio.com/portal</span>
              </div>

              {/* App layout */}
              <div className="pf-app">
                {/* Sidebar */}
                <div className="pf-sidebar">
                  <div className="pf-sb-logo">
                    <img src="/assets/logo-mark.svg" width={20} height={20} alt="" style={{ filter: "invert(1)", opacity: .85 }} />
                  </div>
                  {[0,1,2,3,4].map(i => (
                    <div key={i} className={`pf-sb-nav${NAV_ACTIVE[active] === i ? " pf-sb-nav--active" : ""}`}>
                      <span className="pf-sb-icon" />
                    </div>
                  ))}
                </div>

                {/* Main panel */}
                <div className="pf-main">
                  {/* Topbar */}
                  <div className="pf-topbar">
                    <span className="pf-proj-name">Nestaro · Real Estate OS</span>
                    <span className="pf-live-pill"><span className="pf-live-dot" /> In progress</span>
                  </div>

                  {/* Progress bar */}
                  <div className="pf-progress">
                    <div className="pf-progress-hd">
                      <span className="pf-progress-lbl">Sprint progress</span>
                      <span className="pf-progress-pct" key={active}>{PROGRESS[active]}%</span>
                    </div>
                    <div className="pf-bar-track">
                      <div className="pf-bar-fill" style={{ width: `${PROGRESS[active]}%` }} />
                    </div>
                  </div>

                  {/* Task list */}
                  <div className="pf-tasks">
                    {TASKS.map((task, i) => {
                      const done = i <= active;
                      const isNew = i === active;
                      return (
                        <div key={i} className={`pf-task${done ? " pf-task--done" : ""}`}>
                          <div className="pf-task-chk" key={`chk-${active}-${i}`}>
                            {done && (
                              <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                                <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </div>
                          <span>{task}</span>
                          {isNew && done && <span className="pf-task-new">Just done</span>}
                        </div>
                      );
                    })}
                  </div>

                  {/* Notification — animates in on step 2 */}
                  <div className={`pf-notif${active >= 2 ? " pf-notif--show" : ""}`}>
                    <div className="pf-notif-ico">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
                      </svg>
                    </div>
                    <div>
                      <div className="pf-notif-title">API Integration complete</div>
                      <div className="pf-notif-sub">Yousuf marked a milestone · just now</div>
                    </div>
                  </div>

                  {/* Approve row — animates in on step 3 */}
                  {active === 3 && (
                    <div className="pf-approve">
                      <button className="pf-approve-btn">✓ Approve milestone</button>
                      <button className="pf-comment-btn">Leave feedback</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection({ testis }: { testis: DbTesti[] }) {
  const items    = testis.length > 0 ? testis : STATIC_TESTIS;
  const [idx,    setIdx]    = useState(0);
  const [show,   setShow]   = useState(true);
  const [bKey,   setBKey]   = useState(0);
  const [phoneZoom,      setPhoneZoom]      = useState(1);
  const [scrollParallax, setScrollParallax] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setPhoneZoom(window.innerWidth >= 761 ? 1.43 : 1);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (!stageRef.current) return;
      const rect = stageRef.current.getBoundingClientRect();
      setScrollParallax((window.innerHeight / 2 - rect.top - rect.height / 2) * 0.07);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (items.length <= 1) return;
    const id = setInterval(() => {
      setShow(false);
      setTimeout(() => {
        setIdx(p => (p + 1) % items.length);
        setBKey(k => k + 1);
        setShow(true);
      }, 380);
    }, 5500);
    return () => clearInterval(id);
  }, [items.length]);

  const t       = items[idx];
  const bubbles = splitQuote(t.quote);
  const reply   = BRAND_REPLIES[idx % BRAND_REPLIES.length];
  const stars   = "★".repeat(t.rating || 5);

  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="svc-head">
          <div className="fade"><span className="eyebrow">Words from clients</span></div>
          <h2 className="display fade d1">What it feels like to <span className="it">work</span> with us.</h2>
        </div>

        {/* ── Desktop: grid cards ── */}
        <div className="testimonials testi-desktop">
          {items.map((t, i) => {
            const hi = t.hi?.trim();
            const qn = hi && t.quote.includes(hi)
              ? <>{t.quote.slice(0,t.quote.indexOf(hi))}<span className="it">{hi}</span>{t.quote.slice(t.quote.indexOf(hi)+hi.length)}</>
              : <>{t.quote}</>;
            return (
              <div className={`testimonial fade${i ? ` d${i}` : ""}`} key={t.id}>
                <div className="stars" style={{color:"#f59e0b"}}>{"★".repeat(t.rating||5)}</div>
                <p className="quote">&ldquo;{qn}&rdquo;</p>
                <div className="meta">
                  <div className="avatar">
                    {t.img ? <img src={t.img} alt={t.name} style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%",display:"block"}}/> : t.av}
                  </div>
                  <div className="who">{t.name}<span>{t.role}</span></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── iPhone mockup (desktop + mobile) ── */}
        <div className="testi-phone-wrap">
          <div className="testi-stage" ref={stageRef}>

            {/* Premium background layer — desktop only */}
            <div className="testi-bg" aria-hidden="true">
              <div className="testi-bg-glow" />
              {[
                {x:6,y:20,s:4,d:0,fast:false},{x:88,y:14,s:3,d:1.4,fast:false},
                {x:14,y:72,s:3.5,d:2.6,fast:false},{x:84,y:68,s:4,d:0.9,fast:false},
                {x:44,y:6,s:3,d:3.8,fast:true},{x:56,y:90,s:3.5,d:1.9,fast:false},
                {x:24,y:46,s:2.5,d:4.4,fast:true},{x:76,y:40,s:2.5,d:3,fast:false},
                {x:50,y:50,s:2,d:5.2,fast:false},{x:32,y:84,s:3,d:0.5,fast:true},
                {x:68,y:22,s:2.5,d:2.1,fast:false},{x:18,y:34,s:2,d:3.3,fast:true},
              ].map((p,i) => (
                <div key={i} className={`testi-bg-dot${p.fast?" fast":""}`}
                  style={{left:`${p.x}%`,top:`${p.y}%`,width:`${p.s}px`,height:`${p.s}px`,animationDelay:`${p.d}s`}}/>
              ))}
              <svg className="testi-bg-arcs" viewBox="0 0 900 500" preserveAspectRatio="xMidYMid meet">
                <path d="M 80 250 Q 220 80 450 60" fill="none" stroke="rgba(184,108,249,.1)" strokeWidth="1" className="arc-1"/>
                <path d="M 820 250 Q 680 80 450 60" fill="none" stroke="rgba(184,108,249,.1)" strokeWidth="1" className="arc-2"/>
                <path d="M 100 300 Q 250 420 450 440" fill="none" stroke="rgba(150,150,150,.07)" strokeWidth="1" className="arc-3"/>
                <path d="M 800 300 Q 650 420 450 440" fill="none" stroke="rgba(150,150,150,.07)" strokeWidth="1" className="arc-3"/>
              </svg>
            </div>

            {/* World map */}
            <WorldMapDecoration scrollOffset={scrollParallax} />

            {/* iPhone */}
            <div className="testi-phone" style={{zoom: phoneZoom}}>
              {/* Screen */}
              <div
                className="testi-screen"
                style={{ opacity: show ? 1 : 0, transform: show ? "scale(1)" : "scale(.95)", transition: "opacity .35s ease, transform .35s ease" }}
              >
                {/* Status bar with inline Dynamic Island */}
                <div className="testi-status">
                  <span className="testi-time">9:41</span>
                  <div className="testi-island" />
                  <div className="testi-status-r">
                    <SignalIcon /><BatteryIcon />
                  </div>
                </div>

                {/* iMessage header */}
                <div className="testi-chat-hd">
                  <div className="testi-back">
                    <svg width="9" height="15" viewBox="0 0 9 15" fill="none"><path d="M8 1 1.5 7.5 8 14" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <div className="testi-chat-center">
                      <div className="testi-chat-av">
                        {t.img ? <img src={t.img} alt={t.name} style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%",display:"block"}}/> : t.av}
                      </div>
                      <div className="testi-chat-info" key={bKey}>
                        <div className="testi-chat-name">{t.name}</div>
                        <div className="testi-chat-role">{t.role}</div>
                      </div>
                    </div>
                  </div>
                  <div className="testi-chat-actions">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    <svg width="19" height="14" viewBox="0 0 22 16" fill="none"><rect x=".5" y=".5" width="13" height="15" rx="2.5" stroke="var(--brand)" strokeWidth="1.5"/><path d="M14 5.5l7-3.5v12l-7-3.5V5.5Z" stroke="var(--brand)" strokeWidth="1.5" strokeLinejoin="round"/></svg>
                  </div>
                </div>

                {/* Bubbles */}
                <div className="testi-bubbles" key={bKey}>
                  <div className="testi-chat-date">Today</div>
                  <div className="testi-stars-bubble">{stars}</div>
                  {bubbles.map((msg, i) => (
                    <div key={i} className="testi-bubble testi-bubble--in" style={{ animationDelay: `${0.15 + i * 0.9}s` }}>{msg}</div>
                  ))}
                  <div className="testi-bubble testi-bubble--out" style={{ animationDelay: `${0.15 + bubbles.length * 0.9}s` }}>{reply}</div>
                </div>

                {/* Input bar */}
                <div className="testi-input-row">
                  <div className="testi-add-btn">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7.5" stroke="rgba(0,0,0,.2)"/><path d="M8 4v8M4 8h8" stroke="rgba(0,0,0,.4)" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  </div>
                  <div className="testi-input-bar">iMessage</div>
                  <div className="testi-send-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
                  </div>
                </div>
              </div>
            </div>

          </div>{/* end testi-stage */}

          {/* Progress dots */}
          <div className="testi-dots">
            {items.map((_, i) => (
              <span key={i} className={`testi-dot${i === idx ? " active" : ""}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  useScrollReveal(".fade, .reveal, .bento .tile, .split .shot");

  const [dbServices, setDbServices]   = useState<DbService[]>([]);
  const [dbProjects, setDbProjects]   = useState<DbProject[]>([]);
  const [dbClients,  setDbClients]    = useState<DbClient[]>([]);
  const [dbTestis,   setDbTestis]     = useState<DbTesti[]>([]);

  useEffect(() => {
    fetch("/api/services?visible=true").then(r => r.json()).then(rows => {
      if (Array.isArray(rows) && rows.length > 0) setDbServices(rows);
    }).catch(() => {});
    fetch("/api/projects").then(r => r.json()).then(rows => {
      if (Array.isArray(rows)) setDbProjects(rows.filter((p:DbProject) => p.status === "live").slice(0, 6));
    }).catch(() => {});
    fetch("/api/clients").then(r => r.json()).then(rows => {
      if (Array.isArray(rows) && rows.length > 0) setDbClients(rows);
    }).catch(() => {});
    fetch("/api/testimonials?public=1").then(r => r.json()).then(rows => {
      if (Array.isArray(rows) && rows.length > 0) setDbTestis(rows);
    }).catch(() => {});
  }, []);

  return (
    <>
      <Hero />

      {/* Reel */}
      <Reel />

      {/* Marquee */}
      <section className="strip" aria-label="Capabilities">
        <div className="marquee">
          {[...marqueeItems, ...marqueeItems].map((s, i) => <span key={i}>{s}</span>)}
        </div>
      </section>

      {/* Services */}
      <section className="section" id="services">
        <div className="wrap">
          <div className="svc-head">
            <div className="fade"><span className="eyebrow">What we do</span></div>
            <h2 className="display fade d1">
              A studio built for <span className="it">every</span> layer of the product —
              strategy, design, code, and care.
            </h2>
          </div>
          <div className="svc-list">
            {(dbServices.length > 0
              ? dbServices.map((s, i) => ({
                  idx: `/ ${String(i + 1).padStart(2, "0")}`,
                  title: s.name,
                  desc: s.descr,
                  tags: s.count,
                  preview: s.badge || s.name.split(" ")[0],
                  image: s.image || null,
                }))
              : svcRows.map(s => ({ ...s, image: null as string | null }))
            ).map((s, i) => (
              <Link className="svc-row" href="/services" key={i}>
                <span className="idx">{s.idx}</span>
                <span className="title">{s.title}</span>
                <span className="desc">{s.desc}</span>
                <span className="tags">{s.tags}</span>
                <span className="arrow"><SmArrow /></span>
                <span className="preview">
                  {s.image
                    ? <img src={s.image} alt={s.title} style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:15,display:"block"}} />
                    : s.preview}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI Project Estimator */}
      <ProjectEstimator />

      {/* Featured Work */}
      <section className="section" id="work" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <div className="work-head">
            <div>
              <div className="fade"><span className="eyebrow">Featured work — 2024 / 2026</span></div>
              <h2 className="display fade d1" style={{ marginTop: 18 }}>
                Selected <span className="it">recent</span> projects
              </h2>
            </div>
            <Link href="/work" className="btn btn--ghost">
              <span className="label">All case studies</span>
              <span className="chip" aria-hidden="true"><ArrowIcon /></span>
            </Link>
          </div>
          <div className="stack">
            {dbProjects.length > 0
              /* Real DB projects */
              ? dbProjects.map((p, i) => {
                  const href = `/work/${p.slug || toSlug(p.name)}`;
                  const tones = ["violet","ink","bone","brand","violet","ink"];
                  const tone  = tones[i % tones.length];
                  return (
                    <article className="card" data-tone={tone} key={p.id}>
                      <div className="card-inner">
                        <div className="card-media">
                          <div className="device">
                            <div className="bar"><i/><i/><i/></div>
                            <div className="screen">
                              {p.thumbnail
                                ? <img src={p.thumbnail} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
                                : <h4>{p.name}</h4>
                              }
                            </div>
                          </div>
                          <span className="ph">Product · {String(i+1).padStart(2,"0")}</span>
                        </div>
                        <div className="card-body">
                          <div>
                            <div className="num">CASE {String(i+1).padStart(2,"0")} / {String(dbProjects.length).padStart(2,"0")}</div>
                            <h3>{p.name}</h3>
                            {p.tagline && <p className="copy">{p.tagline}</p>}
                            <div className="meta">
                              {p.industry && <div><div className="k">Industry</div><div className="v">{p.industry}</div></div>}
                              {p.year     && <div><div className="k">Year</div><div className="v">{p.year}</div></div>}
                              {p.scope    && <div><div className="k">Scope</div><div className="v">{p.scope}</div></div>}
                            </div>
                          </div>
                          <div className="row">
                            <span className="eyebrow">{p.industry || "Studio"}</span>
                            <Link href={href} className="btn">
                              <span className="label">Case study</span>
                              <span className="chip"><ArrowIcon /></span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })
              /* Static curated cards (show instantly while DB loads) */
              : cards.map((c, i) => (
                <article className="card" data-tone={c.tone} key={i}>
                  <div className="card-inner">
                    <div className="card-media">
                      <div className="device">
                        <div className="bar"><i/><i/><i/></div>
                        <div className="screen">
                          <h4>{c.screenTitle} <span style={{ color:"#b86cf9", fontStyle:"italic" }}>{c.screenSub}</span></h4>
                          {c.lns.map((cls, j) => <div key={j} className={`ln ${cls}`} />)}
                        </div>
                      </div>
                      <span className="ph" style={c.phColor ? { color: c.phColor } : undefined}>{c.ph}</span>
                    </div>
                    <div className="card-body">
                      <div>
                        <div className="num">{c.num}</div>
                        <h3>{c.name} <span className="it">{c.sub}</span></h3>
                        <p className="copy">{c.copy}</p>
                        <div className="meta">
                          {c.meta.map(([k, v], j) => (
                            <div key={j}><div className="k">{k}</div><div className="v">{v}</div></div>
                          ))}
                        </div>
                      </div>
                      <div className="row">
                        <span className="eyebrow">{c.eyebrow}</span>
                        <Link href={`/work/${c.slug}`} className="btn">
                          <span className="label">Case study</span>
                          <span className="chip"><ArrowIcon /></span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            }
          </div>
        </div>
      </section>

      {/* Tech strip */}
      <section className="strip strip--dark" aria-label="Tech stack">
        <div className="marquee">
          {[...techItems, ...techItems].map((s, i) => <span key={i}>{s}</span>)}
        </div>
      </section>

      {/* Social proof */}
      <section className="proof" aria-label="Trusted by">
        <div className="wrap">
          <div className="proof-head">
            <div>
              <div className="fade"><span className="eyebrow">Trusted worldwide</span></div>
              <h3 className="fade d1" style={{ marginTop: 14 }}>
                {dbClients.length > 0 ? dbClients.length : 42} active clients across{" "}
                <span className="it">
                  {dbClients.length > 0
                    ? new Set(dbClients.map(c => c.country).filter(Boolean)).size || 17
                    : 17}{" "}
                  countries
                </span>{" "}
                — from seed-stage to listed.
              </h3>
            </div>
            <Link href="/work" className="tlink fade d2">See the work →</Link>
          </div>
        </div>
        <div className="proof-grid fade">
          {(dbClients.length > 0 ? dbClients : proofCells.map(c => ({ name: c.name, industry: c.badge, country: "" }))).map((c, i) => (
            <div className="cell" key={i}>
              <span className="mk">{PROOF_SYMBOLS[i % PROOF_SYMBOLS.length]}</span> {c.name}
              <span className="badge">{c.industry}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection testis={dbTestis} />

      {/* AI feature */}
      <section className="section" style={{ paddingTop: 140 }}>
        <div className="wrap">
          <div className="ai">
            <div className="ai-art fade">
              <div className="grid-lines" />
              <div className="core">AI</div>
              <span className="chip chip-1">Embeddings</span>
              <span className="chip chip-2">RAG · Retrieval</span>
              <span className="chip chip-3">Agents</span>
              <span className="chip chip-4">Fine-tuning</span>
            </div>
            <div className="ai-copy">
              <div className="fade"><span className="eyebrow">AI is our sharpest tool</span></div>
              <h2 className="fade d1" style={{ marginTop: 18 }}>
                We <span className="it">embed</span> intelligence —
                not bolt it on after launch.
              </h2>
              <p className="fade d2">
                AI is no longer a feature; it&apos;s a layer. We design product
                surfaces where AI does the heavy lifting invisibly — fewer clicks,
                faster answers, defensible moats.
              </p>
              <ul>
                <li className="fade d2"><span className="dot" />Production-grade RAG pipelines with eval-driven prompting</li>
                <li className="fade d3"><span className="dot" />Agentic workflows that plan, retrieve, and execute safely</li>
                <li className="fade d4"><span className="dot" />Fine-tuned models scoped to your brand, data and tone</li>
                <li className="fade d5"><span className="dot" />Cost &amp; latency budgets baked into every design choice</li>
              </ul>
              <Link href="/contact" className="btn btn--lg fade d5">
                <span className="label">Talk to our AI team</span>
                <span className="chip"><ArrowIcon /></span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" style={{ padding: "80px 0" }}>
        <div className="process">
          <div className="wrap">
            <div className="process-head">
              <div><div className="fade"><span className="eyebrow" style={{ color:"#bdbdbd" }}>How we work</span></div></div>
              <h2 className="fade d1">
                A <span style={{ fontStyle:"italic", color:"var(--brand)" }}>deliberate</span> process —
                four chapters from brief to launch.
              </h2>
            </div>
            <div className="steps">
              {steps.map((s) => (
                <div className="step fade" key={s.num}>
                  <div className="num">{s.num}</div>
                  <div><div className="title">{s.title}</div></div>
                  <div className="copy">
                    {s.copy}
                    <ul>{s.items.map((it) => <li key={it}>{it}</li>)}</ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="section" id="about" style={{ paddingTop: 60 }}>
        <div className="wrap">
          <div className="svc-head">
            <div className="fade"><span className="eyebrow">The studio</span></div>
            <h2 className="display fade d1">Small, senior team. <span className="it">Outsized</span> output.</h2>
          </div>
          <div className="metrics">
            {[
              { v:<>120<span className="it">+</span></>, k:"Products shipped" },
              { v:"42",                                   k:"Active clients" },
              { v:"17",                                   k:"Countries served" },
              { v:<>98<span className="it">%</span></>,   k:"Retention rate" },
            ].map((m, i) => (
              <div className={`metric fade${i ? ` d${i}` : ""}`} key={i}>
                <div className="v">{m.v}</div>
                <div className="k">{m.k}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portal Feature */}
      <PortalFeatureSection />

      {/* CTA */}
      <section id="contact" style={{ padding: "60px 0" }}>
        <div className="cta">
          <div className="wrap-tight">
            <div className="fade"><span className="eyebrow">Let&apos;s build</span></div>
            <h2 className="fade d1">
              Got a brief? <span className="it">Or just</span><br />
              a half-formed idea?
            </h2>
            <div className="row fade d2">
              <a href="mailto:hello@foxmen.studio" className="btn btn--lg">
                <span className="label">hello@foxmen.studio</span>
                <span className="chip"><ArrowIcon /></span>
              </a>
              <button
                className="btn btn--ghost btn--lg"
                data-cal-link="yousuf-faysal/project-discussion-call"
                data-cal-namespace="project-discussion-call"
                data-cal-config='{"layout":"week_view","useSlotsViewOnSmallScreen":"true","theme":"auto"}'
              >
                <span className="label">Book a 20-min call</span>
                <span className="chip"><ArrowIcon /></span>
              </button>
            </div>
            <div className="ic fade d3">Replies within 24 hours · Mon–Fri</div>
          </div>
        </div>
      </section>
    </>
  );
}
