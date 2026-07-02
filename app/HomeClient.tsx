"use client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import ProjectEstimator from "@/app/components/ProjectEstimator";
import { VisualAI } from "@/app/services/ServicesClient";
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
function XIcon({ light = false }: { light?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={light ? "rgba(255,255,255,.55)" : "rgba(0,0,0,.3)"}>
      <path d="M18.244 2H21.5l-7.5 8.57L23 22h-6.844l-5.36-7.005L4.7 22H1.44l8.04-9.183L1 2h7.014l4.844 6.405L18.244 2Zm-1.2 18h1.84L7.04 4H5.07l11.974 16Z"/>
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
  const [count, setCount] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (orbitRef.current) orbitRef.current.style.translate = `0 ${window.scrollY * 0.15}px`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const TARGET = 50;
    const DURATION = 1800; // ms

    function startCount() {
      const start = performance.now();
      function frame(now: number) {
        const progress = Math.min((now - start) / DURATION, 1);
        // ease-out
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(eased * TARGET));
        if (progress < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }

    if (document.body.classList.contains("page-revealed")) {
      startCount();
      return;
    }
    const obs = new MutationObserver(() => {
      if (document.body.classList.contains("page-revealed")) {
        obs.disconnect();
        startCount();
      }
    });
    obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
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
          <span className="eyebrow">International Digital Studio</span>
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
            <div className="stat">{count}+</div>
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
    </section>
  );
}

function Reel() {
  const reelRef   = useRef<HTMLElement>(null);
  const frameRef  = useRef<HTMLDivElement>(null);
  const labelRef  = useRef<HTMLDivElement>(null);
  const videoRef  = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const obs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) { video.play().catch(() => {}); obs.disconnect(); } },
        { threshold: 0.25 }
      );
      obs.observe(video);
      return () => { obs.disconnect(); video.pause(); };
    }
  }, []);
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
        <div className="frame" ref={frameRef}>
          <div className="reel-video">
            <video
              ref={videoRef}
              className="reel-iframe"
              src="https://ik.imagekit.io/2lax2ytm2/Foxmen.mov"
              muted
              loop
              playsInline
            />
            <div className="reel-video-overlay" />
            <div className="ticker">
              <span>50+ products shipped</span><span>5 countries</span>
              <span>98% retention</span><span>Code · Craft · Care</span>
              <span>50+ products shipped</span><span>5 countries</span>
              <span>98% retention</span><span>Code · Craft · Care</span>
            </div>
          </div>
        </div>
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
type DbProject = { id:number; name:string; tagline:string; industry:string; year:string; scope:string; status:string; thumbnail:string; slug:string; color_cls:string; live_url:string; home_featured:boolean; home_order:number };
type DbClient  = { id:number; name:string; industry:string; country:string };
type DbTesti   = { id:number; quote:string; name:string; role:string; av:string; hi:string; rating:number; img:string; date?:string };

const PROOF_SYMBOLS = ["◆","●","▲","✦","◇","★","◐","⬡","⌬","⟁","⌖","◈","◉","▼","◫","⌑","⌀","⊕","⟐","⌘"];

function toSlug(n: string) { return n.toLowerCase().replace(/[—–]/g,"-").replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").trim(); }

const STATIC_TESTIS = [
  { id:-1, av:"SK", img:"", name:"Sara Köhler",  role:"CEO · Nestaro",          hi:"actually used", rating:5, date:"09/30/2024", quote:"Foxmen turned a vague pitch deck into a product our investors actually used during the round. They ship like a product team, not an agency." },
  { id:-2, av:"DA", img:"", name:"Devon Arias",  role:"Head of Product · Pulse", hi:"activation rate", rating:5, date:"08/14/2024", quote:"The AI copilot they built drove our activation rate from 28% to 71%. Every meeting felt like we got our money back twice." },
  { id:-3, av:"RM", img:"", name:"Rina Mehta",   role:"CTO · Marketo",           hi:"zero", rating:5, date:"07/02/2024", quote:"Care is in the name and it shows. Our launch had zero P0s in week one — a first for us across three agencies." },
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
.pf-section { padding: 120px 0 100px; }
.pf-section .display { font-size:clamp(44px,5.5vw,72px) !important; line-height:1.08 !important; }
.pf-intro { max-width:560px; margin-top:24px; font-size:20px; line-height:1.65; opacity:.58; }

.pf-split {
  display:grid; grid-template-columns:1fr 1fr;
  gap:80px; margin-top:72px; align-items:start;
}

/* steps */
.pf-step {
  display:flex; gap:28px; padding:36px 0;
  border-top:1px solid rgba(10,10,10,.09);
  opacity:.22; transition:opacity .5s cubic-bezier(.16,1,.3,1);
  cursor:default;
}
.pf-step:first-child { border-top:none; }
.pf-step--active { opacity:1; }

.pf-step-num {
  font-family:var(--font-geist-mono,monospace); font-size:12px;
  color:var(--brand,#b86cf9); letter-spacing:.07em; padding-top:7px; min-width:28px;
}
.pf-step-title {
  font-size:36px; font-weight:600;
  font-family:var(--font-instrument-serif,Georgia,serif);
  margin-bottom:14px; transition:color .35s ease; line-height:1.1;
}
.pf-step--active .pf-step-title { color:var(--brand,#b86cf9); }
.pf-step-copy { font-size:17px; line-height:1.72; opacity:.62; max-width:380px; }

/* sticky col */
.pf-sticky-col { position:sticky; top:80px; }

/* mock window */
.pf-mock {
  background:#111; border-radius:16px; overflow:hidden;
  box-shadow:0 0 0 1px rgba(255,255,255,.08),
             0 48px 120px rgba(0,0,0,.45),
             0 8px 24px rgba(0,0,0,.2);
}

/* title bar */
.pf-titlebar {
  display:flex; align-items:center; gap:6px;
  padding:12px 16px;
  background:rgba(255,255,255,.04);
  border-bottom:1px solid rgba(255,255,255,.06);
}
.pf-tb-dot { display:inline-block; width:11px; height:11px; border-radius:50%; }
.pf-tb-dot--r { background:#ff5f57; }
.pf-tb-dot--y { background:#febc2e; }
.pf-tb-dot--g { background:#28c840; }
.pf-tb-url {
  margin-left:10px; font-family:var(--font-geist-mono,monospace);
  font-size:11px; color:rgba(255,255,255,.22); letter-spacing:.02em;
}

/* app chrome */
.pf-app { display:flex; height:480px; }

/* sidebar */
.pf-sidebar {
  width:52px; background:rgba(255,255,255,.025);
  border-right:1px solid rgba(255,255,255,.06);
  display:flex; flex-direction:column; align-items:center;
  padding:18px 0 14px; gap:4px;
}
.pf-sb-logo { margin-bottom:18px; display:flex; }
.pf-sb-nav {
  width:36px; height:32px; border-radius:9px;
  display:flex; align-items:center; justify-content:center;
  transition:background .3s ease;
}
.pf-sb-nav--active { background:rgba(184,108,249,.2); }
.pf-sb-icon {
  width:15px; height:15px; border-radius:4px;
  background:rgba(255,255,255,.18); transition:background .3s ease;
}
.pf-sb-nav--active .pf-sb-icon { background:var(--brand,#b86cf9); }
.pf-sb-avatar {
  margin-top:auto; width:30px; height:30px; border-radius:50%;
  background:linear-gradient(135deg,#7c3aed,#b86cf9);
  display:flex; align-items:center; justify-content:center;
  font-size:11px; font-weight:700; color:#fff;
}

/* main panel */
.pf-main {
  flex:1; padding:18px 18px 16px;
  display:flex; flex-direction:column; gap:14px; overflow:hidden; min-width:0;
}

/* topbar */
.pf-topbar { display:flex; align-items:center; gap:10px; }
.pf-proj-name { font-size:13px; font-weight:600; color:rgba(255,255,255,.85); flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.pf-live-pill {
  display:flex; align-items:center; gap:5px; flex-shrink:0;
  background:rgba(255,255,255,.06); border-radius:20px;
  padding:3px 9px; font-size:10px; color:rgba(255,255,255,.45); font-weight:500;
}
.pf-live-dot {
  width:6px; height:6px; border-radius:50%; background:#4ade80;
  animation:pfPulse 2s ease-in-out infinite;
}
@keyframes pfPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.45;transform:scale(.65)} }
.pf-profile-row { display:flex; align-items:center; gap:6px; flex-shrink:0; }
.pf-profile-av {
  width:26px; height:26px; border-radius:50%;
  background:linear-gradient(135deg,#7c3aed,#b86cf9);
  display:flex; align-items:center; justify-content:center;
  font-size:10px; font-weight:700; color:#fff;
}
.pf-profile-name { font-size:11px; color:rgba(255,255,255,.4); }

/* progress */
.pf-progress-hd {
  display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;
}
.pf-progress-lbl {
  font-size:10px; text-transform:uppercase; letter-spacing:.07em; color:rgba(255,255,255,.3);
}
.pf-progress-pct {
  font-size:14px; font-weight:700; color:var(--brand,#b86cf9);
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
  font-size:12px; color:rgba(255,255,255,.32);
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

/* bento bottom */
.pf-bento {
  display:grid; grid-template-columns:1fr 1fr;
  gap:8px; margin-top:auto;
}
.pf-bcard {
  background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.07);
  border-radius:10px; padding:11px; overflow:hidden;
  opacity:0; transform:translateY(8px);
  transition:opacity .5s cubic-bezier(.16,1,.3,1), transform .5s cubic-bezier(.16,1,.3,1);
}
.pf-bcard--show { opacity:1; transform:translateY(0); }
.pf-bcard-label {
  font-size:9px; text-transform:uppercase; letter-spacing:.07em;
  color:rgba(255,255,255,.28); margin-bottom:7px;
}
.pf-bcard-title { font-size:11px; font-weight:600; color:rgba(255,255,255,.78); margin-bottom:3px; line-height:1.35; }
.pf-bcard-sub   { font-size:10px; color:rgba(255,255,255,.32); line-height:1.4; }
.pf-bcard-dot   { display:inline-block; width:6px; height:6px; border-radius:50%; background:var(--brand,#b86cf9); margin-right:5px; vertical-align:middle; }
.pf-bcard-green { background:#4ade80; }

/* approve row */
.pf-approve {
  display:grid; grid-template-columns:1fr 1fr; gap:8px;
  animation:pfApprove .55s cubic-bezier(.16,1,.3,1) both;
}
@keyframes pfApprove { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
.pf-approve-btn {
  background:var(--brand,#b86cf9); color:#fff; border:none;
  border-radius:8px; padding:9px; font-size:11px; font-weight:600; cursor:default; text-align:center;
}
.pf-comment-btn {
  background:rgba(255,255,255,.07); color:rgba(255,255,255,.55);
  border:none; border-radius:8px; padding:9px; font-size:11px; cursor:default; text-align:center;
}

/* ── responsive ── */
@media(max-width:1024px) {
  .pf-split { gap:48px; }
}
@media(max-width:900px) {
  .pf-section { padding:80px 0 72px; }
  .pf-section .display { font-size:clamp(36px,8vw,56px) !important; }
  .pf-intro { font-size:18px; max-width:100%; }
  /* Switch to flex-column so sticky spans the full section height */
  .pf-split { display:flex; flex-direction:column; gap:0; margin-top:48px; }
  .pf-sticky-col {
    position:sticky; top:72px; z-index:10; order:-1;
    width:100%; margin-bottom:0;
  }
  .pf-left { position:relative; z-index:1; padding-top:48px; }
  .pf-app { height:380px; }
  .pf-profile-name { display:none; }
  .pf-step { opacity:1; }
  /* premium glow on mockup */
  .pf-mock {
    box-shadow:0 0 0 1px rgba(184,108,249,.2),
               0 32px 80px rgba(184,108,249,.15),
               0 8px 24px rgba(0,0,0,.4);
  }
}
@media(max-width:600px) {
  .pf-section { padding:64px 0 60px; }
  .pf-section .display { font-size:clamp(30px,9.5vw,44px) !important; line-height:1.1 !important; }
  .pf-intro { font-size:16px; line-height:1.65; }
  .pf-split { gap:0; margin-top:36px; }
  .pf-left { padding-top:36px; }
  /* mockup — premium framing with purple glow */
  .pf-mock {
    border-radius:18px;
    box-shadow:0 0 0 1px rgba(184,108,249,.2),
               0 24px 64px rgba(184,108,249,.15),
               0 6px 20px rgba(0,0,0,.4);
  }
  .pf-app { height:330px; }
  .pf-titlebar { padding:10px 14px; }
  /* hide profile row — topbar too cramped */
  .pf-profile-row { display:none; }
  /* sidebar compact */
  .pf-sidebar { width:40px; padding:14px 0 10px; }
  .pf-sb-nav { width:28px; height:28px; border-radius:7px; }
  .pf-sb-icon { width:12px; height:12px; }
  .pf-sb-avatar { width:24px; height:24px; font-size:9px; }
  /* main panel compact */
  .pf-main { padding:14px 13px 12px; gap:11px; }
  .pf-proj-name { font-size:11px; }
  .pf-live-pill { font-size:9px; padding:2px 7px; }
  .pf-progress-lbl { font-size:9px; }
  .pf-progress-pct { font-size:12px; }
  .pf-bar-track { height:4px; }
  .pf-task { padding:6px 8px; font-size:11px; }
  .pf-task-chk { width:14px; height:14px; }
  /* bento — single col, one card */
  .pf-bento { grid-template-columns:1fr; gap:6px; }
  .pf-bento .pf-bcard:last-child { display:none; }
  .pf-bcard { padding:9px 10px; }
  .pf-bcard-title { font-size:10px; }
  /* steps */
  .pf-step { padding:22px 0; gap:20px; }
  .pf-step-title { font-size:24px; margin-bottom:10px; }
  .pf-step-copy { font-size:15px; line-height:1.65; }
  /* CTA — fit content width, compact chip */
  .pf-section a.btn { padding:8px 8px 8px 24px; font-size:15px; }
  .pf-section a.btn .chip { width:40px; height:40px; }
  .pf-section a.btn .chip svg { width:18px; height:18px; }
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
    // track latest ratio per step so we always activate the most-visible one
    const ratios: Record<number, number> = {};
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          const step = Number((e.target as HTMLElement).dataset.step ?? -1);
          ratios[step] = e.intersectionRatio;
        });
        let best = -1, bestRatio = -1;
        Object.entries(ratios).forEach(([s, r]) => {
          if (r > bestRatio) { bestRatio = r; best = Number(s); }
        });
        if (best >= 0 && bestRatio > 0) setActive(best);
      },
      { rootMargin: "-15% 0px -15% 0px", threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
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
                <span className="pf-tb-url">foxmen.studio/portal</span>
              </div>

              {/* App layout */}
              <div className="pf-app">
                {/* Sidebar with profile at bottom */}
                <div className="pf-sidebar">
                  <div className="pf-sb-logo">
                    <img src="/assets/logo-mark.svg" width={22} height={22} alt="" style={{ filter: "brightness(0) invert(1)", opacity: .7 }} />
                  </div>
                  {[0,1,2,3,4].map(i => (
                    <div key={i} className={`pf-sb-nav${NAV_ACTIVE[active] === i ? " pf-sb-nav--active" : ""}`}>
                      <span className="pf-sb-icon" />
                    </div>
                  ))}
                  <div className="pf-sb-avatar">YF</div>
                </div>

                {/* Main panel */}
                <div className="pf-main">
                  {/* Topbar: project + live pill + profile */}
                  <div className="pf-topbar">
                    <span className="pf-proj-name">Nestaro · Real Estate OS</span>
                    <span className="pf-live-pill"><span className="pf-live-dot" /> In progress</span>
                    <div className="pf-profile-row">
                      <div className="pf-profile-av">YF</div>
                      <span className="pf-profile-name">Yousuf</span>
                    </div>
                  </div>

                  {/* Progress */}
                  <div>
                    <div className="pf-progress-hd">
                      <span className="pf-progress-lbl">Sprint progress</span>
                      <span className="pf-progress-pct" key={active}>{PROGRESS[active]}%</span>
                    </div>
                    <div className="pf-bar-track">
                      <div className="pf-bar-fill" style={{ width: `${PROGRESS[active]}%` }} />
                    </div>
                  </div>

                  {/* Tasks */}
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

                  {/* Bento bottom: notification + activity */}
                  {active < 3 ? (
                    <div className="pf-bento">
                      <div className={`pf-bcard${active >= 1 ? " pf-bcard--show" : ""}`} style={{ transitionDelay: "0.05s" }}>
                        <div className="pf-bcard-label">🔔 Notification</div>
                        <div className="pf-bcard-title">
                          <span className="pf-bcard-dot" />
                          {active === 0 ? "Invite sent" : active === 1 ? "Design System merged" : "API Integration done"}
                        </div>
                        <div className="pf-bcard-sub">Yousuf · just now</div>
                      </div>
                      <div className={`pf-bcard${active >= 1 ? " pf-bcard--show" : ""}`} style={{ transitionDelay: "0.15s" }}>
                        <div className="pf-bcard-label">💬 Latest update</div>
                        <div className="pf-bcard-title">
                          {active === 0 ? "Welcome to your portal!" : active === 1 ? "Sprint 2 kicked off" : "Ready for review"}
                        </div>
                        <div className="pf-bcard-sub">
                          {active === 0
                            ? "Your project starts tomorrow."
                            : active === 1
                            ? "Figma files shared in Files tab."
                            : "Check the staging link below."}
                        </div>
                      </div>
                    </div>
                  ) : (
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

/* ─────────────────────────────────────────────────────────────────────────
   Live Chat / Foxo AI Support Section
───────────────────────────────────────────────────────────────────────── */
const LC_CSS = `
.lc-section {
  padding:120px 0; background:#0a0a0a; overflow:hidden; position:relative;
}
.lc-bg-glow {
  position:absolute; inset:0; pointer-events:none;
  background:radial-gradient(ellipse 60% 55% at 75% 50%, rgba(184,108,249,.13) 0%, transparent 70%);
}
.lc-inner {
  display:grid; grid-template-columns:1fr 1fr;
  gap:80px; align-items:center; position:relative; z-index:1;
}
.lc-copy .eyebrow { color:rgba(184,108,249,.85); }
.lc-copy h2 {
  color:#fff; margin-top:20px;
  font-size:clamp(44px,5.5vw,72px) !important; line-height:1.08 !important;
}
.lc-copy h2 .it { color:var(--brand,#b86cf9); }
.lc-desc {
  margin-top:22px; font-size:19px; line-height:1.68;
  color:rgba(255,255,255,.5); max-width:480px;
}
.lc-opts { display:flex; flex-direction:column; gap:14px; margin-top:40px; }
.lc-opt {
  display:flex; align-items:flex-start; gap:16px;
  background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.07);
  border-radius:14px; padding:22px; transition:border-color .3s ease, background .3s ease;
}
.lc-opt:hover { border-color:rgba(184,108,249,.35); background:rgba(184,108,249,.06); }
.lc-opt-ico {
  width:44px; height:44px; border-radius:12px; flex-shrink:0;
  display:flex; align-items:center; justify-content:center;
}
.lc-opt-ico--ai   { background:rgba(184,108,249,.18); color:var(--brand,#b86cf9); }
.lc-opt-ico--live { background:rgba(74,222,128,.12); color:#4ade80; }
.lc-opt-title { font-size:16px; font-weight:600; color:#fff; margin-bottom:5px; }
.lc-opt-desc  { font-size:14px; color:rgba(255,255,255,.45); line-height:1.58; }
.lc-opt-badge {
  margin-left:auto; align-self:flex-start; flex-shrink:0;
  font-size:10px; font-weight:600; letter-spacing:.05em;
  padding:3px 9px; border-radius:20px;
}
.lc-opt-badge--ai   { background:rgba(184,108,249,.15); color:var(--brand,#b86cf9); }
.lc-opt-badge--live { background:rgba(74,222,128,.12);  color:#4ade80; }

/* chat widget mockup */
.lc-widget {
  background:#1a1a1a; border-radius:20px; overflow:hidden;
  border:1px solid rgba(255,255,255,.07);
  box-shadow:0 0 0 1px rgba(255,255,255,.04), 0 40px 100px rgba(0,0,0,.5);
  max-width:380px; margin:0 auto;
}
.lc-widget-hd {
  padding:18px 20px 16px;
  background:rgba(255,255,255,.035);
  border-bottom:1px solid rgba(255,255,255,.06);
  display:flex; align-items:center; gap:12px;
}
.lc-widget-av {
  width:36px; height:36px; border-radius:50%; flex-shrink:0;
  background:linear-gradient(135deg,#7c3aed,#b86cf9);
  display:flex; align-items:center; justify-content:center;
  font-size:14px; font-weight:700; color:#fff;
}
.lc-widget-hd-name  { font-size:14px; font-weight:600; color:#fff; }
.lc-widget-hd-sub   { font-size:11px; color:rgba(255,255,255,.38); margin-top:1px; }
.lc-widget-hd-badge {
  margin-left:auto; display:flex; align-items:center; gap:5px;
  font-size:11px; color:#4ade80; font-weight:500;
}
.lc-widget-hd-dot {
  width:7px; height:7px; border-radius:50%; background:#4ade80;
  animation:lcPulse 2s ease-in-out infinite;
}
@keyframes lcPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.6)} }

/* chat body */
.lc-chat-body {
  padding:20px 16px; display:flex; flex-direction:column; gap:10px;
  min-height:280px;
}
.lc-msg {
  display:flex; flex-direction:column; gap:2px;
  animation:lcMsgIn .5s cubic-bezier(.16,1,.3,1) both;
}
@keyframes lcMsgIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
.lc-msg--out { align-items:flex-end; }
.lc-msg--in  { align-items:flex-start; }
.lc-bubble {
  max-width:82%; padding:10px 14px; border-radius:16px;
  font-size:13px; line-height:1.55;
}
.lc-msg--in  .lc-bubble { background:rgba(255,255,255,.08); color:rgba(255,255,255,.85); border-bottom-left-radius:4px; }
.lc-msg--out .lc-bubble { background:var(--brand,#b86cf9); color:#fff; border-bottom-right-radius:4px; }
.lc-msg-time { font-size:10px; color:rgba(255,255,255,.22); padding:0 4px; }

/* typing indicator */
.lc-typing {
  display:flex; gap:4px; padding:12px 14px;
  background:rgba(255,255,255,.07); border-radius:16px; border-bottom-left-radius:4px;
  width:fit-content; align-items:center;
  animation:lcMsgIn .4s cubic-bezier(.16,1,.3,1) both;
}
.lc-typing-dot {
  width:6px; height:6px; border-radius:50%; background:rgba(255,255,255,.4);
  animation:lcTypeDot 1.2s ease-in-out infinite;
}
.lc-typing-dot:nth-child(2) { animation-delay:.15s; }
.lc-typing-dot:nth-child(3) { animation-delay:.3s; }
@keyframes lcTypeDot { 0%,60%,100%{transform:translateY(0);opacity:.4} 30%{transform:translateY(-5px);opacity:1} }

/* input bar */
.lc-input-row {
  display:flex; align-items:center; gap:10px;
  padding:14px 16px;
  border-top:1px solid rgba(255,255,255,.06);
  background:rgba(255,255,255,.02);
}
.lc-input-bar {
  flex:1; background:rgba(255,255,255,.07); border-radius:20px;
  padding:9px 14px; font-size:13px; color:rgba(255,255,255,.25);
  border:1px solid rgba(255,255,255,.06);
}
.lc-send {
  width:34px; height:34px; border-radius:50%; flex-shrink:0;
  background:var(--brand,#b86cf9); display:flex; align-items:center; justify-content:center;
  cursor:default;
}

/* tab switcher */
.lc-tabs {
  display:flex; gap:2px; padding:10px 16px 0;
}
.lc-tab {
  flex:1; padding:8px; border-radius:10px; font-size:12px; font-weight:500;
  text-align:center; cursor:default; transition:background .25s ease, color .25s ease;
  color:rgba(255,255,255,.35);
}
.lc-tab--active { background:rgba(184,108,249,.2); color:var(--brand,#b86cf9); }

/* ── responsive ── */
@media(max-width:900px) {
  .lc-section { padding:72px 0; }
  .lc-inner { grid-template-columns:1fr; gap:44px; }
  .lc-copy h2 { font-size:clamp(36px,8vw,56px) !important; }
  .lc-desc { font-size:17px; max-width:100%; }
  .lc-opts { margin-top:28px; gap:12px; }
  .lc-widget { max-width:100%; }
  .lc-chat-body { min-height:220px; }
  .lc-bg-glow { background:radial-gradient(ellipse 80% 40% at 50% 20%, rgba(184,108,249,.11) 0%, transparent 70%); }
}
@media(max-width:600px) {
  .lc-section { padding:56px 0; }
  .lc-copy h2 { font-size:clamp(30px,9vw,44px) !important; }
  .lc-desc { font-size:16px; }
  /* option cards — tighter on phones */
  .lc-opt { padding:16px; gap:12px; }
  .lc-opt-ico { width:36px; height:36px; flex-shrink:0; }
  .lc-opt-ico svg { width:16px; height:16px; }
  .lc-opt-title { font-size:14px; }
  .lc-opt-desc { font-size:13px; }
  .lc-opt-badge { display:none; }
  /* widget — chat body shorter on phones */
  .lc-chat-body { min-height:180px; padding:14px 12px; gap:8px; }
  .lc-bubble { font-size:12px; padding:9px 12px; }
  .lc-widget-hd { padding:14px 16px 12px; }
  .lc-widget-hd-name { font-size:13px; }
  .lc-input-row { padding:10px 12px; }
  .lc-input-bar { font-size:12px; padding:8px 12px; }
}
`;

const CONVERSATIONS: { from: "in" | "out"; text: string; delay: number }[][] = [
  [
    { from: "out", text: "Hey, what services do you offer?", delay: 0 },
    { from: "in",  text: "We build websites, mobile apps, AI software, ecommerce and real estate platforms — and we handle brand & design too.", delay: 900 },
    { from: "in",  text: "What kind of project are you thinking about?", delay: 1800 },
    { from: "out", text: "A mobile app with AI features 👀", delay: 2700 },
    { from: "in",  text: "Perfect fit. We've shipped 30+ of those. Want a quick estimate?", delay: 3600 },
  ],
  [
    { from: "out", text: "How long does a website project take?", delay: 0 },
    { from: "in",  text: "Typically 4–8 weeks from kickoff to launch, depending on scope.", delay: 900 },
    { from: "in",  text: "Marketing sites are faster — 3–4 weeks. Full apps take 8–14 weeks.", delay: 1800 },
    { from: "out", text: "And pricing?", delay: 2700 },
    { from: "in",  text: "Web projects start around $3K. Apps from $8K. We can scope yours properly on a quick call.", delay: 3600 },
  ],
];

function LiveChatSection() {
  const [tab,      setTab]      = useState<0 | 1>(0);
  const [visible,  setVisible]  = useState<number[]>([]);
  const [typing,   setTyping]   = useState(false);
  const [convKey,  setConvKey]  = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const started    = useRef(false);

  useEffect(() => {
    const el = document.createElement("style");
    el.id = "lc-css";
    el.textContent = LC_CSS;
    if (!document.getElementById("lc-css")) document.head.appendChild(el);
    return () => { document.getElementById("lc-css")?.remove(); };
  }, []);

  const runConversation = () => {
    const msgs = CONVERSATIONS[convKey % CONVERSATIONS.length];
    setVisible([]);
    setTyping(false);
    msgs.forEach((m, i) => {
      if (m.from === "in" && i > 0) {
        setTimeout(() => setTyping(true),  m.delay - 600);
        setTimeout(() => { setTyping(false); setVisible(v => [...v, i]); }, m.delay);
      } else {
        setTimeout(() => setVisible(v => [...v, i]), m.delay);
      }
    });
    setTimeout(() => {
      setConvKey(k => k + 1);
    }, msgs[msgs.length - 1].delay + 4000);
  };

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting && !started.current) { started.current = true; runConversation(); } },
      { threshold: 0.3 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (convKey === 0) return;
    runConversation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [convKey]);

  const msgs = CONVERSATIONS[convKey % CONVERSATIONS.length];

  return (
    <section className="lc-section" ref={sectionRef}>
      <div className="lc-bg-glow" aria-hidden="true" />
      <div className="wrap">
        <div className="lc-inner">

          {/* LEFT: copy */}
          <div className="lc-copy">
            <div className="fade"><span className="eyebrow">Always-on support</span></div>
            <h2 className="display fade d1">
              Help that&apos;s there<br />
              <span className="it">when you need it.</span>
            </h2>
            <p className="lc-desc fade d2">
              Whether it&apos;s a quick question at midnight or a project kickoff call at noon — we&apos;re covered. AI answers instantly, humans follow up when it matters.
            </p>

            <div className="lc-opts fade d3">
              <div className="lc-opt">
                <div className="lc-opt-ico lc-opt-ico--ai">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 6v6l4 2"/><circle cx="19" cy="5" r="3" fill="currentColor" stroke="none"/>
                  </svg>
                </div>
                <div>
                  <div className="lc-opt-title">Foxo AI</div>
                  <div className="lc-opt-desc">Instant answers about services, pricing, timelines and case studies — 24 hours a day.</div>
                </div>
                <span className="lc-opt-badge lc-opt-badge--ai">24 / 7</span>
              </div>

              <div className="lc-opt">
                <div className="lc-opt-ico lc-opt-ico--live">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </div>
                <div>
                  <div className="lc-opt-title">Live Chat</div>
                  <div className="lc-opt-desc">Real people from the team. For scoping, briefs, or anything that deserves a proper conversation.</div>
                </div>
                <span className="lc-opt-badge lc-opt-badge--live">Mon – Fri</span>
              </div>
            </div>
          </div>

          {/* RIGHT: animated chat widget */}
          <div className="fade d2">
            <div className="lc-widget">
              {/* Header */}
              <div className="lc-widget-hd">
                <div className="lc-widget-av">F</div>
                <div>
                  <div className="lc-widget-hd-name">{tab === 0 ? "Foxo AI" : "Yousuf · Foxmen"}</div>
                  <div className="lc-widget-hd-sub">{tab === 0 ? "Powered by Foxmen Studio" : "Founder & CEO"}</div>
                </div>
                <span className="lc-widget-hd-badge"><span className="lc-widget-hd-dot" />{tab === 0 ? "Active" : "Online"}</span>
              </div>

              {/* Tab switcher */}
              <div className="lc-tabs">
                <div className={`lc-tab${tab === 0 ? " lc-tab--active" : ""}`} onClick={() => setTab(0)}>Foxo AI</div>
                <div className={`lc-tab${tab === 1 ? " lc-tab--active" : ""}`} onClick={() => setTab(1)}>Live Chat</div>
              </div>

              {/* Chat body */}
              <div className="lc-chat-body" key={`${tab}-${convKey}`}>
                {msgs.map((m, i) =>
                  visible.includes(i) ? (
                    <div key={i} className={`lc-msg lc-msg--${m.from}`} style={{ animationDelay: "0ms" }}>
                      <div className="lc-bubble">{m.text}</div>
                      {m.from === "out" && <span className="lc-msg-time">Just now</span>}
                    </div>
                  ) : null
                )}
                {typing && (
                  <div className="lc-typing">
                    <span className="lc-typing-dot" />
                    <span className="lc-typing-dot" />
                    <span className="lc-typing-dot" />
                  </div>
                )}
              </div>

              {/* Input bar */}
              <div className="lc-input-row">
                <div className="lc-input-bar">Ask anything…</div>
                <div className="lc-send">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 19V5M5 12l7-7 7 7"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function TwitterBird({ light = false }: { light?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={light ? "#fff" : "#1d9bf0"} aria-hidden="true">
      <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733a4.67 4.67 0 0 0 2.048-2.578 9.3 9.3 0 0 1-2.958 1.13 4.66 4.66 0 0 0-7.938 4.25 13.229 13.229 0 0 1-9.602-4.868c-.4.69-.63 1.49-.63 2.342A4.66 4.66 0 0 0 3.96 9.824a4.647 4.647 0 0 1-2.11-.583v.06a4.66 4.66 0 0 0 3.737 4.568 4.692 4.692 0 0 1-2.104.08 4.661 4.661 0 0 0 4.352 3.234 9.348 9.348 0 0 1-5.786 1.995 9.5 9.5 0 0 1-1.112-.065 13.175 13.175 0 0 0 7.14 2.093c8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602a9.47 9.47 0 0 0 2.323-2.41z"/>
    </svg>
  );
}

function leadSplit(q: string): [string, string] {
  const clean = q.replace(/^[“”"'\s]+/, "").replace(/[“”"'\s]+$/, "");
  const words = clean.split(/\s+/);
  const lead = words.slice(0, 3).join(" ");
  const rest = words.slice(3).join(" ");
  return [lead, rest];
}

function TestiCard({ t, active, onClick }: { t: DbTesti; active: boolean; onClick?: () => void }) {
  const [lead, rest] = leadSplit(t.quote);
  return (
    <div className={`tv-card${active ? " is-active" : ""}`} onClick={onClick}>
      <div className="tv-card-top">
        <div className="tv-id">
          <span className="tv-av">{t.img ? <img src={t.img} alt={t.name} /> : t.av}</span>
          <span className="tv-id-text">
            <span className="tv-id-name">{t.name}</span>
            <span className="tv-id-role">{t.role}</span>
          </span>
        </div>
        <span className="tv-tw"><TwitterBird /></span>
      </div>
      <p className="tv-quote">
        <strong>&ldquo;{lead}{rest ? "" : "”"}</strong>
        {rest && <span className="tv-quote-rest">{rest}&rdquo;</span>}
      </p>
      <div className="tv-foot">
        <span className="tv-stars" aria-label={`${t.rating || 5} out of 5 stars`}>{"★".repeat(t.rating || 5)}</span>
        <span className="tv-date">{t.date || "09/30/2024"}</span>
      </div>
    </div>
  );
}

function TestimonialsSection({ testis }: { testis: DbTesti[] }) {
  const items = testis.length > 0 ? testis : STATIC_TESTIS;
  const N = items.length;
  // Triple the list so the carousel can loop infinitely without a visible jump.
  const slides = useMemo(() => [...items, ...items, ...items], [items]);

  const [pos, setPos] = useState(N);          // index into `slides`; start in the middle copy
  const [noAnim, setNoAnim] = useState(false); // disable transition for the seamless wrap snap
  const lock = useRef(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [m, setM] = useState({ cardW: 360, gap: 24, vpW: 0 });

  // Measure viewport so we can centre the active card.
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const measure = () => {
      const vpW = vp.clientWidth;
      const cardW = Math.max(252, Math.min(380, vpW - 96));
      setM({ cardW, gap: 24, vpW });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(vp);
    return () => ro.disconnect();
  }, []);

  const move = useCallback((delta: number) => {
    if (lock.current || delta === 0) return;
    lock.current = true;
    setPos((p) => p + delta);
  }, []);

  const next = useCallback(() => move(1), [move]);
  const prev = useCallback(() => move(-1), [move]);
  const goTo = useCallback((real: number) => {
    const current = ((pos % N) + N) % N;
    let delta = real - current;
    if (delta > N / 2) delta -= N;
    if (delta < -N / 2) delta += N;
    move(delta);
  }, [pos, N, move]);

  // Autoplay.
  useEffect(() => {
    const id = setInterval(() => move(1), 5000);
    return () => clearInterval(id);
  }, [move]);

  // After the slide finishes, silently snap back into the middle copy.
  const onTrackEnd = (e: React.TransitionEvent) => {
    if (e.target !== e.currentTarget || e.propertyName !== "transform") return;
    lock.current = false;
    if (pos >= 2 * N || pos < N) {
      setNoAnim(true);
      setPos((p) => (((p % N) + N) % N) + N);
    }
  };

  // Re-enable the transition the frame after a snap.
  useEffect(() => {
    if (!noAnim) return;
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setNoAnim(false)));
    return () => cancelAnimationFrame(id);
  }, [noAnim]);

  const activeReal = ((pos % N) + N) % N;
  const offset = m.vpW / 2 - m.cardW / 2 - pos * (m.cardW + m.gap);

  return (
    <section className="tv-section">
      <div className="wrap-tight">
        <header className="tv-head fade">
          <div>
            <span className="tv-badge">Testimonial</span>
            <h2 className="tv-title">Chosen by 50+ growing<br /><span className="tv-title-dim">businesses worldwide!</span></h2>
          </div>
          <Link href="/contact" className="tv-contact">Contact Now</Link>
        </header>

        <div className="tv-stage" ref={viewportRef}>
          <div
            className={`tv-row${noAnim ? " no-anim" : ""}`}
            style={{ transform: `translate3d(${offset}px,0,0)` }}
            onTransitionEnd={onTrackEnd}
          >
            {slides.map((t, i) => {
              const d = i - pos;
              const isActive = d === 0;
              const near = Math.abs(d) <= 1;
              return (
                <div
                  key={i}
                  className="tv-slide"
                  style={{
                    width: m.cardW,
                    transform: `scale(${isActive ? 1 : 0.86})`,
                    opacity: near ? (isActive ? 1 : 0.5) : 0,
                    pointerEvents: near ? "auto" : "none",
                  }}
                >
                  <TestiCard t={t} active={isActive} onClick={() => move(d)} />
                </div>
              );
            })}
          </div>

          <button className="tv-arrow tv-arrow--prev" onClick={prev} aria-label="Previous testimonial">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button className="tv-arrow tv-arrow--next" onClick={next} aria-label="Next testimonial">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>

        <div className="tv-dots">
          {items.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} className={`tv-dot${i === activeReal ? ' active' : ''}`} aria-label={`Review ${i + 1}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomeClient({
  initialServices = [],
  initialProjects = [],
  initialClients  = [],
  initialTestis   = [],
}: {
  initialServices?: DbService[];
  initialProjects?: DbProject[];
  initialClients?:  DbClient[];
  initialTestis?:   DbTesti[];
}) {
  useScrollReveal(".fade, .reveal, .bento .tile, .split .shot");

  const [dbServices] = useState<DbService[]>(initialServices);
  const [dbProjects] = useState<DbProject[]>(initialProjects);
  const [dbClients]  = useState<DbClient[]>(initialClients);
  const [dbTestis]   = useState<DbTesti[]>(initialTestis);

  return (
    <>
      <div className="page-curtain" aria-hidden="true">
        <div className="pc-layer pc-1" />
        <div className="pc-layer pc-2" />
        <div className="pc-layer pc-3" />
      </div>
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
                  image: s.image || (i === 0 || s.name.toLowerCase().includes("web") ? "/assets/hero-showcase.png" : (i === 1 || s.name.toLowerCase().includes("ios") || s.name.toLowerCase().includes("android") ? "/assets/ios-showcase.png" : (i === 3 || s.name.toLowerCase().includes("ecom") ? "/assets/ecom-showcase.png" : null))),
                }))
              : svcRows.map((s, i) => ({ ...s, image: (i === 0 ? "/assets/hero-showcase.png" : (i === 1 ? "/assets/ios-showcase.png" : (i === 3 ? "/assets/ecom-showcase.png" : null))) as string | null }))
            ).map((s, i) => (
              <Link className="svc-row" href="/services" key={i}>
                <span className="idx">{s.idx}</span>
                <span className="title">{s.title}</span>
                <span className="desc">{s.desc}</span>
                <span className="tags">{s.tags}</span>
                <span className="arrow"><SmArrow /></span>
                <span className="preview">
                  {i === 2 || s.title.toLowerCase().includes("ai") ? (
                    <div style={{ width: "100%", height: "100%", borderRadius: 15, overflow: "hidden", position: "relative", background: "#06060c", pointerEvents: "none" }}>
                      <div style={{ position: "absolute", inset: 0, transform: "scale(0.85)", transformOrigin: "center center" }}>
                        <VisualAI />
                      </div>
                    </div>
                  ) : s.image ? (
                    <img src={s.image} alt={s.title} style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:15,display:"block"}} />
                  ) : (
                    s.preview
                  )}
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

      {/* Portal Feature */}
      <PortalFeatureSection />

      {/* Live Chat Support */}
      <LiveChatSection />

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


      {/* Testimonials */}
      <TestimonialsSection testis={dbTestis} />

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
              <a href="mailto:hello@foxmenstudio.com" className="btn btn--lg">
                <span className="label">hello@foxmenstudio.com</span>
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
