"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════════════════════
   FOXMEN STUDIO — SERVICE DETAIL PAGE (PIXEL-PERFECT ARCHITECTURE)
   Matches /Details/Foxmen Studio.dc.html 1-to-1 in Layout, Style & Animation
   ═══════════════════════════════════════════════════════════════════════ */

/* ── Animated Counter Hook ── */
function AnimatedCounter({ target, suffix = "", duration = 1600 }: { target: number; suffix?: string; duration?: number }) {
  const [val, setVal] = useState(0);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.3 });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setVal(easeProgress * target);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setVal(target);
      }
    };
    window.requestAnimationFrame(step);
  }, [inView, target, duration]);

  return (
    <span ref={ref} style={{ fontVariantNumeric: "tabular-nums" }}>
      {Math.round(val)}{suffix}
    </span>
  );
}

/* ── Universal Service Data Engine (Defaults to Web Design & Development exact copy) ── */
interface ServiceContent {
  h1Top: string;
  h1MidPrefix: string;
  h1MidEm: string;
  h1Bottom: string;
  heroDesc: string;
  manifestoText: { before: string; em: string; after: string };
  servicesTitle: { before: string; em: string };
  servicesList: Array<{ title: string; desc: string }>;
  caseStudies: Array<{ title: string; desc: string; tags: string[]; grad: string; image?: string; href?: string }>;
  industries: Array<{ name: string; tag: string; grad: string }>;
  faqs: Array<{ q: string; a: string }>;
}

const SERVICE_CONFIGS: Record<string, ServiceContent> = {
  "default": {
    h1Top: "Web design",
    h1MidPrefix: "& ",
    h1MidEm: "development",
    h1Bottom: "for bold brands",
    heroDesc: "Foxmen Studio builds websites with the care of a print shop and the speed of a product team.",
    manifestoText: {
      before: "Your website is your hardest-working employee. It never sleeps, never goes off-script, and either earns trust in seconds — or loses it forever. We build the kind that ",
      em: "earns it",
      after: "."
    },
    servicesTitle: { before: "Everything a website needs, ", em: "under one roof" },
    servicesList: [
      { title: "Web strategy", desc: "Positioning, sitemaps and user journeys mapped before a single pixel is drawn." },
      { title: "UX / UI design", desc: "Interfaces that feel effortless to use and unmistakably yours to look at." },
      { title: "Web development", desc: "Fast, accessible builds in modern frameworks — no bloat, no shortcuts." },
      { title: "eCommerce", desc: "Storefronts engineered to convert — from product page to checkout." },
      { title: "CMS & WordPress", desc: "Publishing workflows your team will actually enjoy using." },
      { title: "SEO & performance", desc: "Technical SEO, Core Web Vitals and tuning that compounds over time." }
    ],
    caseStudies: [
      { title: "Celeste — AI-native marketplace", desc: "One conversation, one cart, every verified vendor — shopping, intelligently calm.", tags: ["E-commerce", "AI", "Branding"], grad: "repeating-linear-gradient(-45deg, #1e1b26, #1e1b26 12px, #272134 12px, #272134 24px)", image: "https://res.cloudinary.com/djofqa3vc/image/upload/v1780465629/foxmen-studio/ma7yhwsyq82ral5op4hg.png", href: "/work/celeste-ai-marketplace" },
      { title: "Redleaf — AI-Powered Ecommerce", desc: "Revolutionizing Ecommerce with AI — high-converting storefronts with intelligent product recommendations.", tags: ["E-commerce", "AI", "Design"], grad: "repeating-linear-gradient(-45deg, #16202a, #16202a 12px, #1b2938 12px, #1b2938 24px)", image: "https://res.cloudinary.com/djofqa3vc/image/upload/v1778950272/foxmen-studio/i475h5xtcyrqofdgeuzl.png", href: "/work/redleaf-ai-powered-ecommerce" },
      { title: "Skill-Bridge — Intelligent Learning Platform", desc: "An intelligent learning platform designed for seamless student engagement and AI-powered course delivery.", tags: ["E-Learning", "Web", "AI"], grad: "repeating-linear-gradient(-45deg, #241a2c, #241a2c 12px, #2f2138 12px, #2f2138 24px)", image: "https://res.cloudinary.com/djofqa3vc/image/upload/v1779473367/foxmen-studio/wwfc4njv26awz1jqufke.png", href: "/work/skill-bridge" }
    ],
    industries: [
      { name: "Fintech", tag: "fintech project", grad: "repeating-linear-gradient(-45deg, #efeae2, #efeae2 10px, #e6e0d5 10px, #e6e0d5 20px)" },
      { name: "Healthcare", tag: "health project", grad: "repeating-linear-gradient(-45deg, #f0e4fd, #f0e4fd 10px, #e5d2fb 10px, #e5d2fb 20px)" },
      { name: "SaaS", tag: "saas project", grad: "repeating-linear-gradient(-45deg, #e9e9e9, #e9e9e9 10px, #dedede 10px, #dedede 20px)" },
      { name: "E-commerce", tag: "retail project", grad: "repeating-linear-gradient(-45deg, #efeae2, #efeae2 10px, #e6e0d5 10px, #e6e0d5 20px)" },
      { name: "Education", tag: "edtech project", grad: "repeating-linear-gradient(-45deg, #f0e4fd, #f0e4fd 10px, #e5d2fb 10px, #e5d2fb 20px)" }
    ],
    faqs: [
      { q: "How much does a website cost?", a: "Most projects land between a focused landing page and a full replatform. After one scoping call we send a fixed quote — no hourly surprises, no scope creep." },
      { q: "How long does a project take?", a: "A typical site ships in six to ten weeks: two for strategy, three to four for design, the rest for build and QA. Rebrands and eCommerce run longer." },
      { q: "Do you work with in-house teams?", a: "Constantly. We slot in as the design-and-build arm next to your marketing or product team, working in your tools and handing off clean, documented code." },
      { q: "What happens after launch?", a: "Thirty days of included support, then an optional care plan: performance monitoring, content updates and a quarterly conversion review." },
      { q: "Can you redesign without replatforming?", a: "Yes — if your stack is healthy we redesign on top of it. If it's fighting you, we'll say so and show you the honest cost of both paths." }
    ]
  },
  "ios-android-mobile-apps": {
    h1Top: "iOS & Android",
    h1MidPrefix: "& ",
    h1MidEm: "mobile apps",
    h1Bottom: "for bold brands",
    heroDesc: "Foxmen Studio engineers native mobile experiences that feel like Apple Design Award winners from day one.",
    manifestoText: {
      before: "A mobile application lives in your customer's pocket. If it stutters, drains battery, or feels clunky, it gets uninstalled in seconds. We design and build apps that become a daily ",
      em: "obsession",
      after: "."
    },
    servicesTitle: { before: "Everything a mobile app needs, ", em: "under one roof" },
    servicesList: [
      { title: "Mobile Strategy", desc: "Platform architecture, offline data sync, and monetization models mapped before writing code." },
      { title: "Native iOS (Swift)", desc: "High-performance iOS experiences with custom SwiftUI animations and Metal shaders." },
      { title: "Native Android", desc: "Kotlin architectures engineered for seamless frame rates across every Android device." },
      { title: "React Native / Expo", desc: "Cross-platform mobile apps with native bridges that share code without sacrificing speed." },
      { title: "App Store Optimization", desc: "Iconography, preview videos, and keyword strategy to rank #1 in the App Store." },
      { title: "Backend API Integration", desc: "Real-time WebSockets, push notifications, and low-latency edge API synchronization." }
    ],
    caseStudies: [
      { title: "Celeste — AI-native marketplace", desc: "One conversation, one cart, every verified vendor — shopping, intelligently calm.", tags: ["E-commerce", "AI", "Branding"], grad: "repeating-linear-gradient(-45deg, #1e1b26, #1e1b26 12px, #272134 12px, #272134 24px)", image: "https://res.cloudinary.com/djofqa3vc/image/upload/v1780465629/foxmen-studio/ma7yhwsyq82ral5op4hg.png", href: "/work/celeste-ai-marketplace" },
      { title: "Redleaf — AI-Powered Ecommerce", desc: "Revolutionizing Ecommerce with AI — high-converting storefronts with intelligent product recommendations.", tags: ["E-commerce", "AI", "Design"], grad: "repeating-linear-gradient(-45deg, #16202a, #16202a 12px, #1b2938 12px, #1b2938 24px)", image: "https://res.cloudinary.com/djofqa3vc/image/upload/v1778950272/foxmen-studio/i475h5xtcyrqofdgeuzl.png", href: "/work/redleaf-ai-powered-ecommerce" },
      { title: "Skill-Bridge — Intelligent Learning Platform", desc: "An intelligent learning platform designed for seamless student engagement and AI-powered course delivery.", tags: ["E-Learning", "Web", "AI"], grad: "repeating-linear-gradient(-45deg, #241a2c, #241a2c 12px, #2f2138 12px, #2f2138 24px)", image: "https://res.cloudinary.com/djofqa3vc/image/upload/v1779473367/foxmen-studio/wwfc4njv26awz1jqufke.png", href: "/work/skill-bridge" }
    ],
    industries: [
      { name: "Fintech", tag: "mobile banking", grad: "repeating-linear-gradient(-45deg, #efeae2, #efeae2 10px, #e6e0d5 10px, #e6e0d5 20px)" },
      { name: "Travel & GPS", tag: "offline maps", grad: "repeating-linear-gradient(-45deg, #f0e4fd, #f0e4fd 10px, #e5d2fb 10px, #e5d2fb 20px)" },
      { name: "Health & Fit", tag: "healthkit sync", grad: "repeating-linear-gradient(-45deg, #e9e9e9, #e9e9e9 10px, #dedede 10px, #dedede 20px)" },
      { name: "E-commerce", tag: "apple pay checkout", grad: "repeating-linear-gradient(-45deg, #efeae2, #efeae2 10px, #e6e0d5 10px, #e6e0d5 20px)" },
      { name: "Media", tag: "audio streaming", grad: "repeating-linear-gradient(-45deg, #f0e4fd, #f0e4fd 10px, #e5d2fb 10px, #e5d2fb 20px)" }
    ],
    faqs: [
      { q: "Should we build native iOS/Android or React Native?", a: "We analyze your performance needs, team structure, and budget. For maximum GPU animation and sensor usage, we build native Swift/Kotlin. For rapid cross-platform scale, we deploy custom Expo React Native." },
      { q: "How long does a mobile app build take?", a: "An initial production release typically ships in 8 to 12 weeks, including App Store and Google Play review cycles." },
      { q: "Do you handle App Store submission and compliance?", a: "Yes. We manage certificates, provisioning profiles, privacy disclosures, and Apple/Google review negotiations end-to-end." },
      { q: "Can we integrate existing web backend systems?", a: "Constantly. We build secure mobile API gateways that authenticate directly with your legacy databases or cloud infrastructure." },
      { q: "What post-launch support do you provide?", a: "We monitor crash telemetry, OS update compatibility (iOS 19 / Android 16 ready), and continuous conversion rate optimization." }
    ]
  }
};

export type DbProject = {
  id?: number;
  name?: string;
  tagline?: string;
  industry?: string;
  scope?: string;
  thumbnail?: string;
  slug?: string;
};

export default function ServiceDetailClient({ slug, dbProjects }: { slug: string; dbProjects?: DbProject[] }) {
  const baseContent = SERVICE_CONFIGS[slug] || SERVICE_CONFIGS["default"];
  const content = React.useMemo(() => {
    if (!dbProjects || dbProjects.length === 0) return baseContent;
    const mappedCases = dbProjects.slice(0, 3).map((p, idx) => ({
      title: p.name ? p.name.trim() : "Featured Case Study",
      desc: p.tagline || "An award-winning digital experience engineered for conversion and scalability.",
      tags: p.scope ? p.scope.split("·").map(t => t.trim()).slice(0, 3) : [p.industry || "Web", "AI"],
      grad: idx % 3 === 0
        ? "repeating-linear-gradient(-45deg, #1e1b26, #1e1b26 12px, #272134 12px, #272134 24px)"
        : idx % 3 === 1
        ? "repeating-linear-gradient(-45deg, #16202a, #16202a 12px, #1b2938 12px, #1b2938 24px)"
        : "repeating-linear-gradient(-45deg, #241a2c, #241a2c 12px, #2f2138 12px, #2f2138 24px)",
      image: p.thumbnail || undefined,
      href: p.slug ? `/work/${p.slug}` : "/work"
    }));
    return {
      ...baseContent,
      caseStudies: mappedCases
    };
  }, [baseContent, dbProjects]);

  /* ── State for FAQ Accordions ── */
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  /* ── Scroll Animations Engine (Parallax, Scrub, Horizontal, Rail) ── */
  const [scrollY, setScrollY] = useState(0);
  const [windowHeight, setWindowHeight] = useState(800);
  const [windowWidth, setWindowWidth] = useState(1200);

  /* Horizontal Scroll Section Refs */
  const hWrapRef = useRef<HTMLDivElement>(null);
  const hTrackRef = useRef<HTMLDivElement>(null);
  const [hExtra, setHExtra] = useState(0);

  /* Case Studies Rail Active State */
  const caseRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeCase, setActiveCase] = useState(0);

  /* Manifesto Scrub Ref */
  const manifestoRef = useRef<HTMLDivElement>(null);
  const [manifestoWords, setManifestoWords] = useState<string[]>([]);
  const [manifestoScrubCount, setManifestoScrubCount] = useState(0);

  useEffect(() => {
    // Split manifesto text into words
    const fullText = `${content.manifestoText.before} ${content.manifestoText.em} ${content.manifestoText.after}`;
    setManifestoWords(fullText.split(/\s+/).filter(Boolean));
  }, [content]);

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
      setWindowWidth(window.innerWidth);
      if (hTrackRef.current) {
        const extra = Math.max(0, hTrackRef.current.scrollWidth + 112 - window.innerWidth);
        setHExtra(extra);
        if (hWrapRef.current) {
          hWrapRef.current.style.height = `${window.innerHeight + extra}px`;
        }
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [content]);

  useEffect(() => {
    let rafId: number;
    const handleScroll = () => {
      const sy = window.scrollY;
      setScrollY(sy);

      const vh = window.innerHeight;

      // Case studies active tracker
      let activeIdx = 0;
      caseRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.top < vh * 0.55) {
          activeIdx = i;
        }
      });
      setActiveCase(activeIdx);

      // Manifesto word scrub
      if (manifestoRef.current && manifestoWords.length > 0) {
        const r = manifestoRef.current.getBoundingClientRect();
        const p = Math.max(0, Math.min(1, (vh * 0.9 - r.top) / (r.height + vh * 0.55)));
        const n = Math.floor(p * (manifestoWords.length + 2));
        setManifestoScrubCount(n);
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [manifestoWords.length]);

  /* Calculate Horizontal Progress */
  let hProgress = 0;
  if (hWrapRef.current && hExtra > 0) {
    const r = hWrapRef.current.getBoundingClientRect();
    const total = hWrapRef.current.offsetHeight - windowHeight;
    if (total > 0) {
      hProgress = Math.max(0, Math.min(1, -r.top / total));
    }
  }

  /* Font Styles matching Foxmen Studio.dc.html */
  const serifFont = "var(--font-instrument-serif, 'Instrument Serif', serif)";
  const monoFont = "var(--font-geist-mono, ui-monospace, Menlo, monospace)";
  const sansFont = "var(--font-geist-sans, Geist, system-ui, sans-serif)";

  return (
    <div style={{ background: "#f5f3ee", color: "#141414", fontFamily: sansFont, WebkitFontSmoothing: "antialiased" } as React.CSSProperties}>
      
      {/* Inline styles for marquee and specific animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fx-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .fx-hover-bg:hover {
          background: #fbfaf6 !important;
        }
        .fx-hover-scale:hover {
          transform: scale(1.04) !important;
        }
        .fx-hover-scale-lg:hover {
          transform: scale(1.05) !important;
        }
        .fx-hover-white:hover {
          color: #fff !important;
        }
      `}} />

      {/* ============ HERO — LEDGER GRID ============ */}
      <div data-screen-label="Hero" style={{ background: "#f5f3ee" }}>
        
        {/* Row 1 */}
        <div style={{ borderBottom: "1px solid rgba(0,0,0,0.12)", padding: "64px 56px 10px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", overflow: "hidden" }}>
          <h1 style={{ fontFamily: serifFont, fontWeight: 400, fontSize: "clamp(64px, 8.5vw, 148px)", lineHeight: 1, letterSpacing: "-0.015em", color: "#141414", margin: 0 }}>
            {content.h1Top}
          </h1>
          <span style={{ font: `500 12px ${monoFont}`, color: "rgba(0,0,0,0.4)", paddingBottom: "20px" }}>(01)</span>
        </div>

        {/* Row 2 */}
        <div style={{ borderBottom: "1px solid rgba(0,0,0,0.12)", padding: "24px 56px 10px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", overflow: "hidden" }}>
          <h1 style={{ fontFamily: serifFont, fontWeight: 400, fontSize: "clamp(64px, 8.5vw, 148px)", lineHeight: 1, letterSpacing: "-0.015em", color: "#141414", margin: 0 }}>
            {content.h1MidPrefix}<em style={{ color: "#B86CF9", fontStyle: "italic" }}>{content.h1MidEm}</em>
          </h1>
          <span style={{ font: `500 12px ${monoFont}`, color: "rgba(0,0,0,0.4)", paddingBottom: "20px" }}>(02)</span>
        </div>

        {/* Row 3 */}
        <div style={{ borderBottom: "1px solid rgba(0,0,0,0.12)", padding: "24px 56px 10px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", overflow: "hidden" }}>
          <h1 style={{ fontFamily: serifFont, fontWeight: 400, fontSize: "clamp(64px, 8.5vw, 148px)", lineHeight: 1, letterSpacing: "-0.015em", color: "rgba(20,20,20,0.35)", margin: 0 }}>
            {content.h1Bottom}
          </h1>
          <span style={{ font: `500 12px ${monoFont}`, color: "rgba(0,0,0,0.4)", paddingBottom: "20px" }}>(03)</span>
        </div>

        {/* Meta Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", borderBottom: "1px solid rgba(0,0,0,0.12)" }}>
          <div style={{ padding: "28px 32px 28px 56px", borderRight: "1px solid rgba(0,0,0,0.12)", fontSize: "15px", lineHeight: 1.55, color: "rgba(20,20,20,0.68)", display: "flex", alignItems: "center" }}>
            {content.heroDesc}
          </div>
          <div style={{ padding: "28px 32px", borderRight: "1px solid rgba(0,0,0,0.12)" }}>
            <div style={{ fontFamily: serifFont, fontSize: "42px", lineHeight: 1, color: "#141414" }}>
              <AnimatedCounter target={120} suffix="+" />
            </div>
            <div style={{ fontSize: "12px", color: "rgba(0,0,0,0.45)", marginTop: "6px" }}>launches</div>
          </div>
          <div style={{ padding: "28px 32px", borderRight: "1px solid rgba(0,0,0,0.12)" }}>
            <div style={{ fontFamily: serifFont, fontSize: "42px", lineHeight: 1, color: "#141414" }}>
              <AnimatedCounter target={98} suffix="%" />
            </div>
            <div style={{ fontSize: "12px", color: "rgba(0,0,0,0.45)", marginTop: "6px" }}>return clients</div>
          </div>
          <div style={{ padding: "24px 56px 24px 32px", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
            <a href="#contact" className="fx-hover-scale" style={{ display: "flex", alignItems: "center", gap: "10px", background: "#141414", color: "#fff", borderRadius: "999px", padding: "10px 10px 10px 24px", fontSize: "15px", fontWeight: 500, textDecoration: "none", cursor: "pointer", transition: "transform 0.3s ease" }}>
              Start a project
              <span style={{ width: "36px", height: "36px", background: "#fff", color: "#141414", borderRadius: "999px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px" }}>↗</span>
            </a>
          </div>
        </div>

        {/* Work Strip with Parallax */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1px", background: "rgba(0,0,0,0.12)", borderBottom: "1px solid rgba(0,0,0,0.12)" }}>
          <div style={{ height: "220px", overflow: "hidden", position: "relative" }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: "-50px", bottom: "-50px", background: "repeating-linear-gradient(-45deg, #efeae2, #efeae2 10px, #e6e0d5 10px, #e6e0d5 20px)", display: "flex", alignItems: "center", justifyContent: "center", transform: `translateY(${(-scrollY * 0.12).toFixed(1)}px)` }}>
              <span style={{ font: `500 10px ${monoFont}`, color: "rgba(0,0,0,0.45)", background: "rgba(255,255,255,0.85)", padding: "3px 8px", borderRadius: "4px" }}>work 01</span>
            </div>
          </div>
          <div style={{ height: "220px", overflow: "hidden", position: "relative" }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: "-50px", bottom: "-50px", background: "repeating-linear-gradient(-45deg, #f0e4fd, #f0e4fd 10px, #e5d2fb 10px, #e5d2fb 20px)", display: "flex", alignItems: "center", justifyContent: "center", transform: `translateY(${(-scrollY * 0.2).toFixed(1)}px)` }}>
              <span style={{ font: `500 10px ${monoFont}`, color: "rgba(0,0,0,0.45)", background: "rgba(255,255,255,0.85)", padding: "3px 8px", borderRadius: "4px" }}>work 02</span>
            </div>
          </div>
          <div style={{ height: "220px", overflow: "hidden", position: "relative" }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: "-50px", bottom: "-50px", background: "repeating-linear-gradient(-45deg, #e9e9e9, #e9e9e9 10px, #dedede 10px, #dedede 20px)", display: "flex", alignItems: "center", justifyContent: "center", transform: `translateY(${(-scrollY * 0.12).toFixed(1)}px)` }}>
              <span style={{ font: `500 10px ${monoFont}`, color: "rgba(0,0,0,0.45)", background: "rgba(255,255,255,0.85)", padding: "3px 8px", borderRadius: "4px" }}>work 03</span>
            </div>
          </div>
        </div>

      </div>

      {/* ============ LOGO MARQUEE ============ */}
      <div data-screen-label="Trusted by" style={{ background: "#f5f3ee", borderBottom: "1px solid rgba(0,0,0,0.12)", padding: "36px 0", overflow: "hidden" }}>
        <div style={{ textAlign: "center", font: `500 11px ${monoFont}`, letterSpacing: "0.14em", color: "rgba(0,0,0,0.4)", textTransform: "uppercase", marginBottom: "26px" }}>
          Trusted by teams at
        </div>
        <div style={{ display: "flex", gap: "72px", width: "max-content", animation: "fx-marquee 26s linear infinite", fontSize: "17px", fontWeight: 600, color: "rgba(20,20,20,0.38)", whiteSpace: "nowrap", alignItems: "center" }}>
          <span>NORTHWIND</span><span style={{ fontSize: "10px" }}>◆</span><span>ARC&amp;CO</span><span style={{ fontSize: "10px" }}>◆</span><span>HELIOTROPE</span><span style={{ fontSize: "10px" }}>◆</span><span>KILN</span><span style={{ fontSize: "10px" }}>◆</span><span>MARLOW</span><span style={{ fontSize: "10px" }}>◆</span><span>VESSEL</span><span style={{ fontSize: "10px" }}>◆</span>
          <span>NORTHWIND</span><span style={{ fontSize: "10px" }}>◆</span><span>ARC&amp;CO</span><span style={{ fontSize: "10px" }}>◆</span><span>HELIOTROPE</span><span style={{ fontSize: "10px" }}>◆</span><span>KILN</span><span style={{ fontSize: "10px" }}>◆</span><span>MARLOW</span><span style={{ fontSize: "10px" }}>◆</span><span>VESSEL</span><span style={{ fontSize: "10px" }}>◆</span>
        </div>
      </div>

      {/* ============ MANIFESTO — SCROLL-SCRUB WORD REVEAL ============ */}
      <div data-screen-label="Manifesto" style={{ background: "#f5f3ee", borderBottom: "1px solid rgba(0,0,0,0.12)", padding: "160px 56px" }}>
        <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
          <div style={{ font: `500 11px ${monoFont}`, letterSpacing: "0.14em", color: "rgba(0,0,0,0.4)", textTransform: "uppercase", marginBottom: "32px" }}>
            (Why we exist)
          </div>
          <p ref={manifestoRef} style={{ fontFamily: serifFont, fontSize: "clamp(42px, 4.4vw, 66px)", lineHeight: 1.22, letterSpacing: "-0.01em", color: "#141414", margin: 0 }}>
            {manifestoWords.map((word, idx) => {
              const isEm = word.toLowerCase().includes(content.manifestoText.em.toLowerCase()) || content.manifestoText.em.toLowerCase().includes(word.toLowerCase());
              const isRevealed = idx < manifestoScrubCount;
              return (
                <span key={idx} style={{
                  display: "inline-block",
                  opacity: isRevealed ? 1 : 0.14,
                  transition: "opacity 0.25s linear",
                  marginRight: "0.24em",
                  color: isEm ? "#B86CF9" : "inherit",
                  fontStyle: isEm ? "italic" : "normal"
                }}>
                  {word}
                </span>
              );
            })}
          </p>
        </div>
      </div>

      {/* ============ SERVICES — STAGGERED REVEAL ============ */}
      <div id="services" data-screen-label="Services" style={{ background: "#f5f3ee", borderBottom: "1px solid rgba(0,0,0,0.12)" }}>
        <div style={{ padding: "96px 56px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20 }}>
          <h2 style={{ fontFamily: serifFont, fontWeight: 400, fontSize: "clamp(48px, 5.6vw, 84px)", lineHeight: 1.02, letterSpacing: "-0.01em", margin: 0, maxWidth: "560px" }}>
            {content.servicesTitle.before}<em style={{ color: "#B86CF9", fontStyle: "italic" }}>{content.servicesTitle.em}</em>
          </h2>
          <span style={{ font: `500 12px ${monoFont}`, color: "rgba(0,0,0,0.4)", paddingBottom: "10px" }}>(services — 06)</span>
        </div>
        <div style={{ marginTop: "64px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1px", background: "rgba(0,0,0,0.12)", borderTop: "1px solid rgba(0,0,0,0.12)" }}>
          {content.servicesList.map((srv, i) => (
            <div key={i} className="fx-hover-bg" style={{ background: "#f5f3ee", padding: "40px 40px 48px", transition: "background 0.4s ease" }}>
              <div style={{ font: `500 12px ${monoFont}`, color: "rgba(0,0,0,0.4)" }}>(0{i + 1})</div>
              <div style={{ fontFamily: serifFont, fontSize: "31px", marginTop: "44px", color: "#141414" }}>{srv.title}</div>
              <p style={{ fontSize: "14.5px", lineHeight: 1.6, color: "rgba(20,20,20,0.6)", margin: "12px 0 0" }}>{srv.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ============ CASE STUDIES — STICKY + SCRUB ============ */}
      <div id="work" data-screen-label="Case studies" style={{ background: "#101013", color: "#f5f2ec" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "72px", padding: "130px 56px", alignItems: "start", maxWidth: 1600, margin: "0 auto" }}>
          
          {/* Sticky Rail */}
          <div style={{ position: "sticky", top: "110px" }}>
            <div style={{ font: `500 11px ${monoFont}`, letterSpacing: "0.14em", color: "rgba(245,242,236,0.45)", textTransform: "uppercase" }}>(Selected work)</div>
            <h2 style={{ fontFamily: serifFont, fontWeight: 400, fontSize: "clamp(56px, 6vw, 72px)", lineHeight: 1.02, letterSpacing: "-0.01em", margin: "22px 0 0", color: "#f5f2ec" }}>
              Case<br />studies
            </h2>
            <p style={{ fontSize: "15px", lineHeight: 1.6, color: "rgba(245,242,236,0.6)", margin: "22px 0 0", maxWidth: "300px" }}>
              This panel stays put while the work scrolls past. Images move at their own pace inside their frames.
            </p>
            <div style={{ marginTop: "44px", display: "flex", flexDirection: "column", gap: "14px" }}>
              {content.caseStudies.map((cs, idx) => {
                const isAct = activeCase === idx;
                return (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", fontWeight: 500, opacity: isAct ? 1 : 0.38, transition: "opacity 0.4s ease", cursor: "pointer" }} onClick={() => caseRefs.current[idx]?.scrollIntoView({ behavior: "smooth", block: "center" })}>
                    <span style={{ height: "1.5px", width: isAct ? "28px" : "12px", background: "#B86CF9", transition: "width 0.4s ease" }} />
                    {cs.title}
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: "40px", font: `500 12px ${monoFont}`, color: "rgba(245,242,236,0.4)" }}>
              0{activeCase + 1} / 0{content.caseStudies.length}
            </div>
          </div>

          {/* Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "96px" }}>
            {content.caseStudies.map((cs, idx) => (
              <div key={idx} ref={el => { caseRefs.current[idx] = el; }}>
                <Link href={cs.href || "/work"} style={{ display: "block", textDecoration: "none" }} className="fx-hover-scale">
                  <div style={{ borderRadius: "18px", overflow: "hidden", height: "520px", position: "relative", border: "1px solid rgba(255,255,255,0.1)", background: "#1c1a24" }}>
                    {cs.image ? (
                      <>
                        <img src={cs.image} alt={cs.title} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85, transform: `scale(${1.05 - 0.02 * idx})` }} />
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(16,16,19,0.8) 0%, transparent 60%)" }} />
                      </>
                    ) : (
                      <div style={{ position: "absolute", left: 0, right: 0, top: "-70px", bottom: "-70px", background: cs.grad, display: "flex", alignItems: "center", justifyContent: "center" }} />
                    )}
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                      <span style={{ font: `500 11px ${monoFont}`, color: "rgba(255,255,255,0.7)", background: "rgba(0,0,0,0.65)", padding: "6px 14px", borderRadius: "6px", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.15)" }}>
                        {cs.title}
                      </span>
                    </div>
                  </div>
                </Link>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: "26px", gap: "32px", flexWrap: "wrap" }}>
                  <div>
                    <Link href={cs.href || "/work"} style={{ textDecoration: "none" }}>
                      <div className="fx-hover-white" style={{ fontFamily: serifFont, fontSize: "34px", color: "#f5f2ec", transition: "color 0.2s ease" }}>
                        {cs.title} <span style={{ fontSize: "22px", opacity: 0.5 }}>↗</span>
                      </div>
                    </Link>
                    <p style={{ fontSize: "15px", lineHeight: 1.6, color: "rgba(245,242,236,0.6)", margin: "10px 0 0", maxWidth: "520px" }}>
                      {cs.desc}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "8px", flex: "none", paddingTop: "8px" }}>
                    {cs.tags.map((tg, ti) => (
                      <span key={ti} style={{ fontSize: "12px", fontWeight: 500, padding: "6px 12px", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "999px", color: "#f5f2ec" }}>
                        {tg}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ============ HORIZONTAL SCROLL — INDUSTRIES ============ */}
      <div ref={hWrapRef} data-screen-label="Industries" style={{ background: "#f5f3ee", position: "relative", borderBottom: "1px solid rgba(0,0,0,0.12)" }}>
        <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", padding: "0 56px", marginBottom: "44px", flexWrap: "wrap", gap: 20 }}>
            <h2 style={{ fontFamily: serifFont, fontWeight: 400, fontSize: "clamp(48px, 5.6vw, 84px)", lineHeight: 1.02, letterSpacing: "-0.01em", margin: 0, color: "#141414" }}>
              Industry <em style={{ color: "#B86CF9", fontStyle: "italic" }}>expertise</em>
            </h2>
            <span style={{ font: `500 12px ${monoFont}`, color: "rgba(0,0,0,0.4)", paddingBottom: "10px" }}>(keep scrolling — it moves sideways)</span>
          </div>

          <div ref={hTrackRef} style={{ display: "flex", gap: "24px", padding: "0 56px", width: "max-content", willChange: "transform", transform: `translateX(${(-hProgress * hExtra).toFixed(1)}px)`, transition: "transform 0.05s linear" }}>
            {content.industries.map((ind, i) => (
              <div key={i} style={{ width: "min(400px, 80vw)", height: "440px", borderRadius: "18px", border: "1px solid rgba(0,0,0,0.1)", background: "#fbfaf6", overflow: "hidden", display: "flex", flexDirection: "column", flexShrink: 0 }}>
                <div style={{ flex: 1, background: ind.grad, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ font: `500 10px ${monoFont}`, color: "rgba(0,0,0,0.45)", background: "rgba(255,255,255,0.85)", padding: "3px 8px", borderRadius: "4px" }}>
                    {ind.tag}
                  </span>
                </div>
                <div style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: serifFont, fontSize: "26px", color: "#141414" }}>{ind.name}</span>
                  <span style={{ font: `500 12px ${monoFont}`, color: "rgba(0,0,0,0.4)" }}>(0{i + 1})</span>
                </div>
              </div>
            ))}

            {/* Final Dark CTA Card */}
            <div style={{ width: "min(400px, 80vw)", height: "440px", borderRadius: "18px", background: "#141414", color: "#f5f2ec", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "32px", flexShrink: 0 }}>
              <div style={{ fontFamily: serifFont, fontSize: "34px", lineHeight: 1.15 }}>
                Your industry<br /><em style={{ color: "#B86CF9", fontStyle: "italic" }}>next?</em>
              </div>
              <a href="#contact" className="fx-hover-scale" style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: "#f5f2ec", color: "#141414", borderRadius: "999px", padding: "10px 10px 10px 24px", fontSize: "15px", fontWeight: 500, textDecoration: "none", cursor: "pointer", alignSelf: "flex-start", transition: "transform 0.3s ease" }}>
                Start a project
                <span style={{ width: "36px", height: "36px", background: "#141414", color: "#fff", borderRadius: "999px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px" }}>↗</span>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* ============ STATS — COUNTERS ============ */}
      <div data-screen-label="Stats" style={{ background: "#f5f3ee", borderBottom: "1px solid rgba(0,0,0,0.12)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1px", background: "rgba(0,0,0,0.12)" }}>
          <div style={{ background: "#f5f3ee", padding: "64px 32px 64px 56px" }}>
            <div style={{ fontFamily: serifFont, fontSize: "clamp(48px, 5vw, 84px)", lineHeight: 1, color: "#141414" }}>
              <AnimatedCounter target={120} suffix="+" />
            </div>
            <div style={{ fontSize: "13px", color: "rgba(0,0,0,0.5)", marginTop: "12px" }}>websites shipped</div>
          </div>
          <div style={{ background: "#f5f3ee", padding: "64px 32px" }}>
            <div style={{ fontFamily: serifFont, fontSize: "clamp(48px, 5vw, 84px)", lineHeight: 1, color: "#141414" }}>
              <AnimatedCounter target={98} suffix="%" />
            </div>
            <div style={{ fontSize: "13px", color: "rgba(0,0,0,0.5)", marginTop: "12px" }}>clients who come back</div>
          </div>
          <div style={{ background: "#f5f3ee", padding: "64px 32px" }}>
            <div style={{ fontFamily: serifFont, fontSize: "clamp(48px, 5vw, 84px)", lineHeight: 1, color: "#141414" }}>
              <AnimatedCounter target={14} />
            </div>
            <div style={{ fontSize: "13px", color: "rgba(0,0,0,0.5)", marginTop: "12px" }}>industries served</div>
          </div>
          <div style={{ background: "#f5f3ee", padding: "64px 56px 64px 32px" }}>
            <div style={{ fontFamily: serifFont, fontSize: "clamp(48px, 5vw, 84px)", lineHeight: 1, color: "#141414" }}>
              <AnimatedCounter target={26} />
            </div>
            <div style={{ fontSize: "13px", color: "rgba(0,0,0,0.5)", marginTop: "12px" }}>awards &amp; mentions</div>
          </div>
        </div>
      </div>

      {/* ============ TESTIMONIALS ============ */}
      <div id="testimonials" data-screen-label="Testimonials" style={{ background: "#f5f3ee", borderBottom: "1px solid rgba(0,0,0,0.12)", padding: "120px 0 0" }}>
        <div style={{ padding: "0 56px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20 }}>
          <h2 style={{ fontFamily: serifFont, fontWeight: 400, fontSize: "clamp(48px, 5.6vw, 84px)", lineHeight: 1.02, letterSpacing: "-0.01em", margin: 0, color: "#141414" }}>
            Kind words
          </h2>
          <span style={{ font: `500 12px ${monoFont}`, color: "rgba(0,0,0,0.4)", paddingBottom: "10px" }}>(client testimonial)</span>
        </div>
        <div style={{ marginTop: "56px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1px", background: "rgba(0,0,0,0.12)", borderTop: "1px solid rgba(0,0,0,0.12)" }}>
          <div style={{ background: "#f5f3ee", padding: "48px 40px 56px 56px", display: "flex", flexDirection: "column", gap: "28px" }}>
            <div style={{ fontFamily: serifFont, fontSize: "64px", lineHeight: 0.6, color: "#B86CF9" }}>“</div>
            <p style={{ fontFamily: serifFont, fontSize: "23px", lineHeight: 1.35, margin: 0, flex: 1, color: "#141414" }}>
              Foxmen rebuilt our site in eight weeks and demo bookings doubled the month we launched.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ width: "40px", height: "40px", borderRadius: "999px", background: "repeating-linear-gradient(-45deg, #e9e4da, #e9e4da 6px, #dfd8ca 6px, #dfd8ca 12px)", border: "1px solid rgba(0,0,0,0.1)" }} />
              <div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#141414" }}>Dana Keller</div>
                <div style={{ fontSize: "12.5px", color: "rgba(0,0,0,0.5)" }}>VP Marketing, Marlow</div>
              </div>
            </div>
          </div>

          <div style={{ background: "#f5f3ee", padding: "48px 40px 56px", display: "flex", flexDirection: "column", gap: "28px" }}>
            <div style={{ fontFamily: serifFont, fontSize: "64px", lineHeight: 0.6, color: "#B86CF9" }}>“</div>
            <p style={{ fontFamily: serifFont, fontSize: "23px", lineHeight: 1.35, margin: 0, flex: 1, color: "#141414" }}>
              They think like a product team, not an agency. Every decision came with a reason attached.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ width: "40px", height: "40px", borderRadius: "999px", background: "repeating-linear-gradient(-45deg, #f0e4fd, #f0e4fd 6px, #e5d2fb 6px, #e5d2fb 12px)", border: "1px solid rgba(0,0,0,0.1)" }} />
              <div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#141414" }}>Sam Okafor</div>
                <div style={{ fontSize: "12.5px", color: "rgba(0,0,0,0.5)" }}>Founder, Kiln</div>
              </div>
            </div>
          </div>

          <div style={{ background: "#f5f3ee", padding: "48px 56px 56px 40px", display: "flex", flexDirection: "column", gap: "28px" }}>
            <div style={{ fontFamily: serifFont, fontSize: "64px", lineHeight: 0.6, color: "#B86CF9" }}>“</div>
            <p style={{ fontFamily: serifFont, fontSize: "23px", lineHeight: 1.35, margin: 0, flex: 1, color: "#141414" }}>
              The rebrand paid for itself before the year was out. Our site finally sounds like us.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ width: "40px", height: "40px", borderRadius: "999px", background: "repeating-linear-gradient(-45deg, #e9e9e9, #e9e9e9 6px, #dedede 6px, #dedede 12px)", border: "1px solid rgba(0,0,0,0.1)" }} />
              <div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#141414" }}>Ines Marchetti</div>
                <div style={{ fontSize: "12.5px", color: "rgba(0,0,0,0.5)" }}>CEO, Heliotrope</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============ FAQ ============ */}
      <div id="faq" data-screen-label="FAQ" style={{ background: "#f5f3ee", borderBottom: "1px solid rgba(0,0,0,0.12)", padding: "120px 56px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "72px", alignItems: "start", maxWidth: 1400, margin: "0 auto" }}>
          
          <div style={{ position: "sticky", top: "110px" }}>
            <div style={{ font: `500 11px ${monoFont}`, letterSpacing: "0.14em", color: "rgba(0,0,0,0.4)", textTransform: "uppercase" }}>(Have questions?)</div>
            <h2 style={{ fontFamily: serifFont, fontWeight: 400, fontSize: "clamp(56px, 6vw, 72px)", lineHeight: 1.02, letterSpacing: "-0.01em", margin: "22px 0 0", color: "#141414" }}>
              Fair <em style={{ color: "#B86CF9", fontStyle: "italic" }}>asks</em>
            </h2>
            <p style={{ fontSize: "15px", lineHeight: 1.6, color: "rgba(0,0,0,0.6)", margin: "22px 0 0", maxWidth: "300px" }}>
              The things every client asks before starting — answered straight.
            </p>
          </div>

          <div style={{ borderTop: "1px solid rgba(0,0,0,0.12)" }}>
            {content.faqs.map((f, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} style={{ borderBottom: "1px solid rgba(0,0,0,0.12)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "24px", padding: "26px 4px", cursor: "pointer" }} onClick={() => setOpenFaq(isOpen ? null : idx)}>
                    <span style={{ fontFamily: serifFont, fontSize: "24px", color: "#141414" }}>{f.q}</span>
                    <span style={{ fontSize: "22px", fontWeight: 400, color: "rgba(0,0,0,0.5)", transition: "transform 0.4s ease", transform: isOpen ? "rotate(45deg)" : "rotate(0deg)", flex: "none" }}>+</span>
                  </div>
                  {isOpen && (
                    <div style={{ overflow: "hidden", transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)" }}>
                      <p style={{ fontSize: "15px", lineHeight: 1.65, color: "rgba(0,0,0,0.65)", margin: 0, padding: "0 48px 28px 4px", maxWidth: "640px" }}>
                        {f.a}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* ============ CTA (At last, followed by site's current Footer) ============ */}
      <div id="contact" data-screen-label="CTA" style={{ background: "#101013", color: "#f5f2ec", position: "relative", overflow: "hidden", padding: "170px 56px 150px", textAlign: "center" }}>
        
        {/* Floating Parallax Card Right */}
        <div style={{ position: "absolute", top: "80px", right: "8%", width: "220px", height: "150px", borderRadius: "14px", background: "repeating-linear-gradient(-45deg, #1e1b26, #1e1b26 10px, #272134 10px, #272134 20px)", border: "1px solid rgba(255,255,255,0.1)", transform: `rotate(5deg) translateY(${(-scrollY * 0.08).toFixed(1)}px)` }}>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ font: `500 10px ${monoFont}`, color: "rgba(255,255,255,0.45)" }}>recent work</span>
          </div>
        </div>

        {/* Floating Parallax Card Left */}
        <div style={{ position: "absolute", bottom: "80px", left: "6%", width: "150px", height: "200px", borderRadius: "14px", background: "repeating-linear-gradient(-45deg, #1c1c22, #1c1c22 10px, #232330 10px, #232330 20px)", border: "1px solid rgba(255,255,255,0.1)", transform: `rotate(-6deg) translateY(${(-scrollY * 0.06).toFixed(1)}px)` }}>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ font: `500 10px ${monoFont}`, color: "rgba(255,255,255,0.45)" }}>mobile</span>
          </div>
        </div>

        <div style={{ position: "relative", zIndex: 2, maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ font: `500 11px ${monoFont}`, letterSpacing: "0.14em", color: "rgba(245,242,236,0.45)", textTransform: "uppercase" }}>(Ready when you are)</div>
          <h2 style={{ fontFamily: serifFont, fontWeight: 400, fontSize: "clamp(54px, 7vw, 116px)", lineHeight: 1.02, letterSpacing: "-0.015em", margin: "28px auto 0", color: "#f5f2ec" }}>
            Have a project in mind? Let&apos;s make it <em style={{ color: "#B86CF9", fontStyle: "italic" }}>happen</em>
          </h2>
          <p style={{ fontSize: "16px", lineHeight: 1.6, color: "rgba(245,242,236,0.6)", maxWidth: "460px", margin: "26px auto 0" }}>
            Tell us where your website is falling short. We&apos;ll reply within one business day with an honest read.
          </p>
          <div style={{ display: "flex", justifyContent: "center", marginTop: "40px" }}>
            <a href="/portal" className="fx-hover-scale-lg" style={{ display: "flex", alignItems: "center", gap: "10px", background: "#B86CF9", color: "#141414", borderRadius: "999px", padding: "14px 14px 14px 32px", fontSize: "17px", fontWeight: 600, textDecoration: "none", cursor: "pointer", transition: "transform 0.3s ease" }}>
              Start a project
              <span style={{ width: "44px", height: "44px", background: "#101013", color: "#fff", borderRadius: "999px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>↗</span>
            </a>
          </div>
        </div>

      </div>

    </div>
  );
}
