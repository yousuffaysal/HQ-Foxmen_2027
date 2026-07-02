"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useScrollReveal } from "@/hooks/useScrollReveal";

/* ── Arrow Icon ── */
function ArrowIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.5 12.5L12.5 3.5M12.5 3.5H5.5M12.5 3.5V10.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Check / Plus Icon for Accordions ── */
function AccordionIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <div style={{
      width: 28, height: 28, borderRadius: "50%",
      background: isOpen ? "#000" : "rgba(0,0,0,0.06)",
      color: isOpen ? "#fff" : "#000",
      display: "flex", alignItems: "center", justifyContent: "center",
      transition: "all 0.25s ease", flexShrink: 0,
      fontFamily: "var(--f-mono)", fontSize: 16, fontWeight: 700
    }}>
      {isOpen ? "−" : "+"}
    </div>
  );
}

/* ── DATA DEFINITIONS FOR ALL SERVICES ── */
interface ServicePageData {
  title: string;
  subtitle: string;
  heroImage: string;
  heroBadge: string;
  logos: string[];
  bannerTitle: string;
  bannerDesc: string;
  bannerTag: string;
  bannerColor: string;
  gridTitle: string;
  gridSub: string;
  gridItems: Array<{ title: string; desc: string; color: string; tag: string }>;
  darkRows: Array<{ title: string; desc: string; image: string; tag: string }>;
  whyTitle: string;
  whyItems: Array<{ title: string; desc: string }>;
  industries: Array<{ name: string; desc: string; color: string }>;
  metrics: Array<{ val: string; label: string; desc: string }>;
  testimonials: Array<{ quote: string; name: string; title: string; avatar: string }>;
  team: Array<{ name: string; role: string; bio: string; color: string }>;
  faqs: Array<{ q: string; a: string }>;
}

const SERVICES_DATA: Record<string, ServicePageData> = {
  "web-design-development": {
    title: "Website Design and Development Services",
    subtitle: "Custom web development and award-winning UI/UX design engineered to scale your brand, accelerate performance, and drive high conversions.",
    heroImage: "/assets/hero-showcase.png",
    heroBadge: "Most Popular · Complete Web Ecosystem",
    logos: ["Next.js 15", "React", "TypeScript", "Sanity CMS", "Stripe Connect", "Vercel Edge", "Tailwind CSS", "PostgreSQL", "Mapbox", "Algolia Search", "Figma Design", "GraphQL"],
    bannerTitle: "Ready to reach more users and accelerate your digital transformation?",
    bannerDesc: "We partner with ambitious startups, scale-ups, and global enterprises to craft blazing-fast web apps that outperform the competition.",
    bannerTag: "RECHARGE 34% CONVERSION UPLIFT",
    bannerColor: "#ff7597",
    gridTitle: "Comprehensive Web Design & Development Services For Your Business",
    gridSub: "Every project is architected from scratch using modern frameworks, ensuring zero technical debt and unlimited scalability.",
    gridItems: [
      { title: "UI/UX & Interactive Design", desc: "Award-winning interfaces engineered for visual clarity, intuitive workflows, and maximum customer conversion.", color: "#f3e8ff", tag: "Design Systems" },
      { title: "Full-Stack Web Development", desc: "Custom React & Next.js architectures built for sub-second page loads, modularity, and rock-solid reliability.", color: "#d1fae5", tag: "Next.js & React" },
      { title: "E-Commerce & Marketplaces", desc: "High-converting online stores with custom checkout flows, Stripe Connect multi-vendor payouts, and instant inventory sync.", color: "#fce7f3", tag: "High Conversion" },
      { title: "Custom Web Applications", desc: "Scalable SaaS platforms, B2B customer portals, and internal enterprise dashboards designed for complex business logic.", color: "#ffedd5", tag: "SaaS & Portals" },
      { title: "Headless CMS & API Integration", desc: "Seamless integration with Sanity, Strapi, and custom backend REST/GraphQL APIs for effortless content management.", color: "#dbeafe", tag: "Headless CMS" },
      { title: "Performance & SEO Supremacy", desc: "100/100 Core Web Vitals, lightning-fast edge caching, semantic HTML5, and technical SEO wired into every component.", color: "#fef9c3", tag: "Core Web Vitals" },
      { title: "AI & LLM Integration", desc: "Embed vector search, automated agentic assistants, and generative AI features directly into your core product workflow.", color: "#edd8ff", tag: "AI Powered" },
      { title: "Enterprise Web Security", desc: "Bank-grade authentication, role-based access control (RBAC), end-to-end encryption, and automated security monitoring.", color: "#cffafe", tag: "SOC2 Compliance" },
      { title: "24/7 SLA & Ongoing Scaling", desc: "Continuous monitoring, proactive performance upgrades, and dedicated engineering support after launch.", color: "#ecfdf5", tag: "SLA Support" },
    ],
    darkRows: [
      { title: "Bespoke Enterprise Web Platforms Engineered for Scale", desc: "We replace slow, monolithic legacy systems with modular headless web applications. Our architectures support millions of monthly active users without breaking a sweat.", image: "/assets/hero-showcase.png", tag: "Enterprise Architecture" },
      { title: "High-Conversion Website Design for B2B Industry Leaders", desc: "First impressions dictate trust. We combine cinematic typography, subtle micro-animations, and data-driven UX patterns to turn enterprise visitors into high-value qualified pipelines.", image: "/assets/uiux-showcase.png", tag: "B2B Lead Generation" },
      { title: "Modern Headless E-Commerce & Multi-Vendor Marketplaces", desc: "Unshackle your store from restrictive templates. We build custom front-ends on top of robust e-commerce engines, delivering sub-second checkout speeds and elevated brand experiences.", image: "/assets/ecom-showcase.png", tag: "Headless Commerce" },
    ],
    whyTitle: "Why Partner With Foxmen Studio As Your Web Design Agency?",
    whyItems: [
      { title: "Strategic Alignment With Your Business Goals", desc: "We don't just write code; we analyze your unit economics, target audience, and competitive landscape to build digital assets that directly impact your bottom line." },
      { title: "Lightning-Fast Performance & SEO Supremacy", desc: "By leveraging Next.js server components and Vercel edge networks, our sites consistently hit 100/100 Google Lighthouse scores, driving organic search visibility." },
      { title: "Modern Tech Stack With Zero Vendor Lock-in", desc: "We build on open-source, industry-standard frameworks like React, TypeScript, and PostgreSQL. You own 100% of your source code and intellectual property." },
      { title: "Rigorous QA & Cross-Browser Testing", desc: "Every release undergoes extensive automated testing, responsive layout verification across 30+ devices, and strict accessibility (WCAG 2.1 AA) audits." },
      { title: "Direct Access to Senior Engineers & Designers", desc: "No junior account managers or communication silos. You pair-program and collaborate directly with the senior architects designing and building your product." },
      { title: "Post-Launch Growth & Continuous Optimization", desc: "Our partnership doesn't end at deployment. We monitor user analytics, run A/B conversion tests, and iteratively release enhancements to keep your lead growing." },
    ],
    industries: [
      { name: "Fintech & Banking", desc: "Secure transaction portals, real-time analytics dashboards, and compliant onboarding flows.", color: "#ffedd5" },
      { name: "SaaS & Cloud Platforms", desc: "Intuitive product interfaces, subscription billing engines, and developer documentation portals.", color: "#f3e8ff" },
      { name: "Healthcare & Telemed", desc: "HIPAA-compliant patient portals, virtual appointment booking, and encrypted medical data systems.", color: "#d1fae5" },
      { name: "E-Commerce & Retail", desc: "Luxury brand experiences, headless shopping carts, and multi-currency global checkout systems.", color: "#dbeafe" },
      { name: "Real Estate & PropTech", desc: "Interactive property map clustering, virtual 3D tours, and high-speed listing search engines.", color: "#fce7f3" },
      { name: "Luxury & Lifestyle", desc: "Immersive visual storytelling, smooth WebGL motion graphics, and editorial brand design.", color: "#cffafe" },
    ],
    metrics: [
      { val: "300%+", label: "Organic Search Growth", desc: "Average increase in non-paid search traffic within 6 months of launching our SEO-optimized Next.js architectures." },
      { val: "< 0.8s", label: "Edge Page Load Time", desc: "Sub-second initial page render speeds globally, dramatically reducing bounce rates and boosting user engagement." },
      { val: "45%", label: "Conversion Rate Uplift", desc: "Average increase in lead submission and checkout completion rates through our conversion-focused UX engineering." },
      { val: "100%", label: "IP & Code Ownership", desc: "You retain full intellectual property rights, repository ownership, and zero recurring proprietary licensing fees." },
      { val: "99.99%", label: "Enterprise Uptime", desc: "SLA-backed infrastructure reliability deployed across global multi-region edge networks." },
      { val: "2x", label: "Faster Time-to-Market", desc: "Our modular component libraries and agile pair-programming sprints cut standard development cycles in half." },
    ],
    testimonials: [
      { quote: "Foxmen Studio completely rebuilt our core web application in 8 weeks. Our conversion rate jumped by 42% in the first month, and our page load speed dropped from 4.2 seconds to 600 milliseconds.", name: "Marcus Vance", title: "VP of Product, Apex FinTech", avatar: "#6b46c1" },
      { quote: "Working with Foxmen felt like having an elite internal engineering team. Their attention to UI/UX detail and clean TypeScript architecture set a new benchmark for our entire engineering org.", name: "Sarah Jenkins", title: "Founder & CEO, Lumina SaaS", avatar: "#10b981" },
      { quote: "They delivered a headless multi-vendor e-commerce platform capable of handling 50,000 concurrent shoppers during our Black Friday drop without a single glitch or slowdown. Simply incredible.", name: "David K.", title: "Head of Digital, Peak Gear", avatar: "#f97316" },
    ],
    team: [
      { name: "Alexander Fox", role: "Principal Architect & Founder", bio: "12+ years engineering high-scale web systems. Former senior tech lead specializing in distributed systems and Next.js performance.", color: "#e0e7ff" },
      { name: "Elena Rostova", role: "Head of UI/UX & Design Systems", bio: "Award-winning design director obsessed with micro-typography, golden ratio grids, and seamless design-to-code design systems.", color: "#fce7f3" },
      { name: "Liam Chen", role: "Lead Full-Stack Engineer", bio: "TypeScript and React compiler specialist. Architected real-time WebSocket trading engines and high-throughput PostgreSQL databases.", bio: "Expert in edge computing and modern state management.", color: "#d1fae5" },
      { name: "Sofia Martinez", role: "VP of Growth & Technical SEO", bio: "Data scientist and technical SEO strategist who engineered organic search funnels generating $20M+ in pipeline revenue.", color: "#ffedd5" },
      { name: "Julian Vance", role: "Principal Motion & WebGL Engineer", bio: "Pioneer in browser GPU acceleration, custom Three.js shaders, and buttery smooth 60 FPS interactive animations.", color: "#f3e8ff" },
    ],
    faqs: [
      { q: "How long does a custom website or web application project typically take?", a: "A tailored marketing website or redesign typically takes 4 to 6 weeks from initial discovery to production launch. A comprehensive custom web application or multi-vendor e-commerce platform usually spans 8 to 12 weeks depending on integration complexity and feature scope." },
      { q: "What is the difference between custom web development and website builders like WordPress or Wix?", a: "Website builders rely on bloated generic templates and third-party plugins that severely degrade page speed, create security vulnerabilities, and limit design freedom. Our custom Next.js architectures are engineered from scratch—delivering instant sub-second load times, impenetrable security, custom business logic, and 100/100 Google Core Web Vitals scores." },
      { q: "Do you provide ongoing maintenance, hosting, and support after launch?", a: "Yes. We offer dedicated SLA support packages that include 24/7 infrastructure monitoring, automated security patches, Next.js framework upgrades, and a dedicated monthly engineering retainer for continuous feature scaling and optimization." },
      { q: "How do we get started and what does the onboarding process look like?", a: "Getting started is simple: submit an inquiry through our form below or schedule an exploratory call. We'll review your brief, conduct a technical architecture audit, and deliver a detailed scope of work with guaranteed timeline milestones within 48 hours." },
      { q: "Can you integrate our new website with our existing CRM, ERP, and payment gateways?", a: "Absolutely. We specialize in deep API integrations. Whether you use Salesforce, HubSpot, SAP, NetSuite, Stripe Connect, or proprietary internal databases, we build secure, automated middleware and real-time synchronization pipelines." },
    ],
  },
};

/* Fallback for other slugs */
const DEFAULT_DATA: ServicePageData = {
  ...SERVICES_DATA["web-design-development"],
  title: "Custom Digital Product & Software Engineering",
  subtitle: "End-to-end product design, full-stack engineering, and scalable digital transformation tailored to your exact business specifications.",
};

export default function ServiceDetailClient({ slug }: { slug: string }) {
  useScrollReveal(".reveal, .fade");
  const data = SERVICES_DATA[slug] || {
    ...DEFAULT_DATA,
    title: slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") + " Services",
  };

  const [openWhy, setOpenWhy] = useState<number | null>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  /* Form State */
  const [formState, setFormState] = useState({
    name: "", email: "", company: "", budget: "$15k–$50k", desc: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ background: "#f8f9fb", minHeight: "100vh", color: "#0d0020", fontFamily: "var(--f-sans)", overflowX: "hidden" }}>
      
      {/* ── TOP BREADCRUMB BAR ── */}
      <div style={{ background: "#fff", borderBottom: "1px solid rgba(0,0,0,0.06)", padding: "16px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/services" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--f-mono)", fontSize: 13, color: "rgba(13,0,32,0.6)", textDecoration: "none", fontWeight: 600 }}>
          <span style={{ transform: "rotate(180deg)", display: "inline-block" }}>↗</span> Back to all services
        </Link>
        <span style={{ fontFamily: "var(--f-mono)", fontSize: 12, color: "rgba(13,0,32,0.4)", textTransform: "uppercase", letterSpacing: ".12em" }}>
          {data.heroBadge}
        </span>
      </div>

      {/* ── 1. HERO SECTION ── */}
      <section className="reveal" style={{ padding: "80px 40px 100px", maxWidth: 1400, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 60, alignItems: "center" }}>
        <div>
          <span style={{ display: "inline-block", padding: "6px 14px", borderRadius: 999, background: "#0d0020", color: "#fff", fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 24 }}>
            {slug.replace(/-/g, " ")}
          </span>
          <h1 style={{ fontSize: "clamp(40px, 5.5vw, 76px)", fontWeight: 900, lineHeight: 1.02, letterSpacing: "-.035em", margin: "0 0 24px", color: "#0d0020" }}>
            {data.title}
          </h1>
          <p style={{ fontSize: "clamp(18px, 1.6vw, 22px)", lineHeight: 1.6, color: "rgba(13,0,32,0.72)", margin: "0 0 40px", maxWidth: 620, fontWeight: 400 }}>
            {data.subtitle}
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a href="#inquiry-form" className="btn btn--brand" style={{ padding: "14px 32px", fontSize: 16, minHeight: 56 }}>
              <span className="label">Start a project</span>
              <span className="chip" style={{ width: 34, height: 34 }}><ArrowIcon size={18} /></span>
            </a>
            <Link href="/services" className="btn" style={{ "--bg": "rgba(0,0,0,0.06)", "--fg": "#0d0020", "--chip": "rgba(0,0,0,0.12)", "--chipfg": "#0d0020", padding: "14px 28px", fontSize: 16, minHeight: 56 } as React.CSSProperties}>
              <span className="label">Explore other services</span>
            </Link>
          </div>
        </div>

        <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
          <div style={{ width: "100%", maxWidth: 680, aspectRatio: "4/3", borderRadius: 28, overflow: "hidden", boxShadow: "0 36px 90px rgba(0,0,0,0.18)", background: "#fff", border: "8px solid #fff", position: "relative" }}>
            <img src={data.heroImage} alt={data.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          {/* Floating badge */}
          <div style={{ position: "absolute", bottom: -20, left: 30, background: "#0d0020", color: "#fff", padding: "16px 24px", borderRadius: 16, boxShadow: "0 16px 40px rgba(0,0,0,0.3)", display: "flex", alignItems: "center", gap: 14, zIndex: 5 }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 12px #10b981" }} />
            <span style={{ fontFamily: "var(--f-mono)", fontSize: 13, letterSpacing: ".08em", fontWeight: 700 }}>100/100 LIGHTHOUSE SCORE GUARANTEED</span>
          </div>
        </div>
      </section>

      {/* ── 2. LOGO CLOUD BAR ── */}
      <section style={{ background: "#fff", padding: "48px 40px", borderTop: "1px solid rgba(0,0,0,0.06)", borderBottom: "1px solid rgba(0,0,0,0.06)", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: ".18em", color: "rgba(13,0,32,0.45)", textTransform: "uppercase", margin: "0 0 28px", fontWeight: 700 }}>
          TRUSTED BY LEADING BRANDS & ARCHITECTED WITH ELITE TECH STACKS
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14, maxWidth: 1200, margin: "0 auto" }}>
          {data.logos.map((logo, i) => (
            <span key={i} style={{ padding: "10px 20px", borderRadius: 999, background: "#f3f5f8", color: "#0d0020", fontFamily: "var(--f-mono)", fontSize: 13, fontWeight: 600, border: "1px solid rgba(0,0,0,0.04)" }}>
              {logo}
            </span>
          ))}
        </div>
      </section>

      {/* ── 3. FEATURED HIGHLIGHT BANNER ── */}
      <section className="reveal" style={{ padding: "80px 40px", maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ background: "#fff", borderRadius: 32, padding: "48px", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 20px 60px rgba(0,0,0,0.04)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 48, alignItems: "center" }}>
          <div style={{ background: data.bannerColor, borderRadius: 24, padding: "40px", minHeight: 320, display: "flex", flexDirection: "column", justifyContent: "space-between", color: "#fff", position: "relative", overflow: "hidden", boxShadow: "0 20px 50px rgba(255,117,151,0.3)" }}>
            <span style={{ fontFamily: "var(--f-mono)", fontSize: 14, fontWeight: 800, letterSpacing: ".12em", background: "rgba(0,0,0,0.25)", padding: "6px 14px", borderRadius: 999, alignSelf: "flex-start" }}>
              {data.bannerTag}
            </span>
            <div style={{ zIndex: 2 }}>
              <h3 style={{ fontSize: 32, fontWeight: 900, margin: "0 0 8px", lineHeight: 1.1 }}>3.4x Faster</h3>
              <p style={{ margin: 0, fontSize: 16, opacity: 0.9 }}>Average conversion velocity post-launch</p>
            </div>
            <div style={{ position: "absolute", right: -20, bottom: -20, width: 220, height: 220, background: "rgba(255,255,255,0.15)", borderRadius: "50%", filter: "blur(20px)" }} />
          </div>

          <div>
            <span style={{ fontFamily: "var(--f-mono)", fontSize: 12, color: "#ff7597", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase" }}>TRANSFORMATION AT SCALE</span>
            <h2 style={{ fontSize: "clamp(30px, 3.5vw, 44px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-.025em", margin: "12px 0 20px" }}>
              {data.bannerTitle}
            </h2>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: "rgba(13,0,32,0.7)", margin: "0 0 32px" }}>
              {data.bannerDesc}
            </p>
            <Link href="/work" className="btn btn--brand" style={{ padding: "12px 28px" }}>
              <span className="label">View our case studies</span>
              <span className="chip"><ArrowIcon size={16} /></span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4. COMPREHENSIVE SERVICES GRID (9 ITEMS) ── */}
      <section className="reveal" style={{ background: "#fff", padding: "100px 40px", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: 800, margin: "0 auto 60px" }}>
            <h2 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 900, letterSpacing: "-.03em", margin: "0 0 16px", lineHeight: 1.1 }}>
              {data.gridTitle}
            </h2>
            <p style={{ fontSize: 18, color: "rgba(13,0,32,0.65)", margin: 0, lineHeight: 1.6 }}>
              {data.gridSub}
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 24 }}>
            {data.gridItems.map((item, i) => (
              <div key={i} style={{ background: "#f8f9fb", borderRadius: 24, padding: "36px", border: "1px solid rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", justifyContent: "space-between", transition: "transform 0.25s ease, box-shadow 0.25s ease" }}
                   onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 20px 40px rgba(0,0,0,0.08)"; }}
                   onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "none"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                    <span style={{ padding: "6px 14px", borderRadius: 999, background: item.color, color: "#0d0020", fontFamily: "var(--f-mono)", fontSize: 11, fontWeight: 700, letterSpacing: ".08em" }}>
                      {item.tag}
                    </span>
                    <span style={{ fontFamily: "var(--f-mono)", fontSize: 13, color: "rgba(13,0,32,0.3)", fontWeight: 700 }}>
                      0{i + 1}
                    </span>
                  </div>
                  <h3 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 14px", letterSpacing: "-.015em", color: "#0d0020" }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: 16, lineHeight: 1.6, color: "rgba(13,0,32,0.68)", margin: 0 }}>
                    {item.desc}
                  </p>
                </div>
                <div style={{ marginTop: 28, paddingTop: 20, borderTop: "1px solid rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--f-mono)", fontSize: 12, fontWeight: 700, color: "#0d0020" }}>
                  <span>Explore capabilities</span> <ArrowIcon size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. DARK FEATURE ROWS / CASE STUDIES ── */}
      <section style={{ background: "#0d0020", color: "#fff", padding: "100px 40px" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", flexDirection: "column", gap: 80 }}>
          {data.darkRows.map((row, i) => (
            <div key={i} className="reveal" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 60, alignItems: "center", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 32, padding: "48px", overflow: "hidden" }}>
              <div style={{ order: i % 2 === 1 ? 2 : 1 }}>
                <span style={{ display: "inline-block", padding: "6px 14px", borderRadius: 999, background: "rgba(255,255,255,0.1)", color: "#eab308", fontFamily: "var(--f-mono)", fontSize: 11, fontWeight: 700, letterSpacing: ".12em", marginBottom: 20 }}>
                  {row.tag}
                </span>
                <h3 style={{ fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-.025em", margin: "0 0 20px", color: "#fff" }}>
                  {row.title}
                </h3>
                <p style={{ fontSize: 18, lineHeight: 1.6, color: "rgba(255,255,255,0.72)", margin: "0 0 32px" }}>
                  {row.desc}
                </p>
                <Link href="/work" className="btn" style={{ "--bg": "#eab308", "--fg": "#0d0020", "--chip": "rgba(0,0,0,0.15)", "--chipfg": "#0d0020", padding: "12px 28px", fontWeight: 700 } as React.CSSProperties}>
                  <span className="label">View Case Study</span>
                  <span className="chip"><ArrowIcon size={16} /></span>
                </Link>
              </div>
              <div style={{ order: i % 2 === 1 ? 1 : 2, borderRadius: 20, overflow: "hidden", aspectRatio: "16/10", boxShadow: "0 24px 60px rgba(0,0,0,0.5)", background: "#161622", position: "relative" }}>
                <img src={row.image} alt={row.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. WHY PARTNER WITH US (ACCORDION + GRAPHIC) ── */}
      <section className="reveal" style={{ padding: "100px 40px", maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 60, alignItems: "flex-start" }}>
          <div style={{ position: "sticky", top: 100 }}>
            <span style={{ fontFamily: "var(--f-mono)", fontSize: 12, color: "#6b46c1", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase" }}>THE FOXMEN ADVANTAGE</span>
            <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-.03em", margin: "12px 0 24px" }}>
              {data.whyTitle}
            </h2>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: "rgba(13,0,32,0.7)", margin: "0 0 36px" }}>
              We discard standard agency bureaucracy in favor of direct, agile pair-programming sprints. Here is how our engineering model guarantees superior results.
            </p>
            <a href="#inquiry-form" className="btn btn--brand" style={{ padding: "14px 32px" }}>
              <span className="label">Schedule an exploratory call</span>
              <span className="chip"><ArrowIcon size={16} /></span>
            </a>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {data.whyItems.map((item, idx) => {
              const isOpen = openWhy === idx;
              return (
                <div key={idx} 
                     onClick={() => setOpenWhy(isOpen ? null : idx)}
                     style={{ background: "#fff", borderRadius: 20, padding: "28px", border: isOpen ? "2px solid #0d0020" : "1px solid rgba(0,0,0,0.06)", cursor: "pointer", transition: "all 0.25s ease", boxShadow: isOpen ? "0 16px 40px rgba(0,0,0,0.06)" : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
                    <h3 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: "#0d0020" }}>
                      {idx + 1}. {item.title}
                    </h3>
                    <AccordionIcon isOpen={isOpen} />
                  </div>
                  {isOpen && (
                    <p style={{ margin: "16px 0 0", fontSize: 16, lineHeight: 1.6, color: "rgba(13,0,32,0.72)", paddingTop: 16, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                      {item.desc}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 7. OUR INDUSTRY EXPERTISE GRID ── */}
      <section className="reveal" style={{ background: "#fff", padding: "100px 40px", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: 700, margin: "0 auto 60px" }}>
            <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 900, letterSpacing: "-.03em", margin: "0 0 16px" }}>
              Our Industry Expertise
            </h2>
            <p style={{ fontSize: 18, color: "rgba(13,0,32,0.65)", margin: 0 }}>
              We bring specialized domain knowledge across high-compliance and high-velocity sectors.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
            {data.industries.map((ind, i) => (
              <div key={i} style={{ background: "#f8f9fb", borderRadius: 24, padding: "32px 28px", border: "1px solid rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 220, position: "relative", overflow: "hidden" }}>
                <div>
                  <h3 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 12px", color: "#0d0020" }}>
                    {ind.name}
                  </h3>
                  <p style={{ fontSize: 15, lineHeight: 1.6, color: "rgba(13,0,32,0.68)", margin: 0 }}>
                    {ind.desc}
                  </p>
                </div>
                <div style={{ marginTop: 24, width: 44, height: 6, borderRadius: 3, background: ind.color }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. WHY MODERNIZE TODAY / METRICS ── */}
      <section className="reveal" style={{ padding: "100px 40px", maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ textAlign: "center", maxWidth: 750, margin: "0 auto 60px" }}>
          <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 900, letterSpacing: "-.03em", margin: "0 0 16px" }}>
            Why Modernize Your Web Stack Today?
          </h2>
          <p style={{ fontSize: 18, color: "rgba(13,0,32,0.68)", margin: 0 }}>
            Outdated architectures actively leak conversion revenue. Here are the documented benchmarks our clients achieve post-replatforming.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {data.metrics.map((m, idx) => (
            <div key={idx} style={{ background: "#fff", borderRadius: 24, padding: "36px 32px", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 12px 36px rgba(0,0,0,0.03)" }}>
              <div style={{ fontFamily: "var(--f-mono)", fontSize: "clamp(36px, 4vw, 48px)", fontWeight: 900, color: "#6b46c1", lineHeight: 1.0, marginBottom: 12 }}>
                {m.val}
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 10px", color: "#0d0020" }}>
                {m.label}
              </h3>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: "rgba(13,0,32,0.68)", margin: 0 }}>
                {m.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 9. TESTIMONIALS / CLIENT REVIEWS ── */}
      <section className="reveal" style={{ background: "#fff", padding: "100px 40px", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: 700, margin: "0 auto 60px" }}>
            <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 900, letterSpacing: "-.03em", margin: "0 0 16px" }}>
              What Our Clients Say
            </h2>
            <p style={{ fontSize: 18, color: "rgba(13,0,32,0.65)", margin: 0 }}>
              Read verified feedback from founders and VP of Engineering partners.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 24 }}>
            {data.testimonials.map((t, i) => (
              <div key={i} style={{ background: "#f8f9fb", borderRadius: 24, padding: "36px", border: "1px solid rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", gap: 4, color: "#eab308", marginBottom: 20, fontSize: 18 }}>
                    ★ ★ ★ ★ ★
                  </div>
                  <p style={{ fontSize: 17, lineHeight: 1.6, color: "#0d0020", fontStyle: "italic", margin: "0 0 28px" }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 14, paddingTop: 20, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: t.avatar, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--f-mono)", fontWeight: 700, fontSize: 16 }}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 16, color: "#0d0020" }}>{t.name}</div>
                    <div style={{ fontSize: 13, color: "rgba(13,0,32,0.56)", fontFamily: "var(--f-mono)" }}>{t.title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. THE TEAM SECTION ── */}
      <section className="reveal" style={{ padding: "100px 40px", maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ textAlign: "center", maxWidth: 700, margin: "0 auto 60px" }}>
          <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 900, letterSpacing: "-.03em", margin: "0 0 16px" }}>
            The Web Design & Development Team
          </h2>
          <p style={{ fontSize: 18, color: "rgba(13,0,32,0.65)", margin: 0 }}>
            Meet the senior architects, UI/UX directors, and full-stack specialists building your digital assets.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 24 }}>
          {data.team.map((m, idx) => (
            <div key={idx} style={{ background: "#fff", borderRadius: 24, padding: "28px", border: "1px solid rgba(0,0,0,0.06)", textAlign: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.03)" }}>
              <div style={{ width: 88, height: 88, borderRadius: "50%", background: m.color, margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--f-mono)", fontSize: 28, fontWeight: 800, color: "#0d0020", boxShadow: "0 8px 20px rgba(0,0,0,0.08)" }}>
                {m.name.split(" ").map(n => n[0]).join("")}
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 6px", color: "#0d0020" }}>
                {m.name}
              </h3>
              <div style={{ fontFamily: "var(--f-mono)", fontSize: 12, color: "#6b46c1", fontWeight: 700, marginBottom: 14 }}>
                {m.role}
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.5, color: "rgba(13,0,32,0.65)", margin: 0 }}>
                {m.bio}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 11. DARK CTA BANNER ── */}
      <section className="reveal" style={{ padding: "0 40px 100px", maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ background: "linear-gradient(135deg, #0d0020 0%, #2a0a6b 100%)", borderRadius: 36, padding: "60px 48px", color: "#fff", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 48, alignItems: "center", boxShadow: "0 30px 80px rgba(42,10,107,0.3)", position: "relative", overflow: "hidden" }}>
          <div style={{ zIndex: 2 }}>
            <span style={{ fontFamily: "var(--f-mono)", fontSize: 12, color: "#eab308", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase" }}>GUARANTEED LAUNCH VELOCITY</span>
            <h2 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-.03em", margin: "16px 0 20px", color: "#fff" }}>
              Ready to build a website that commands attention and drives revenue?
            </h2>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: "rgba(255,255,255,0.78)", margin: "0 0 36px", maxWidth: 540 }}>
              Let&apos;s schedule a 30-minute technical discovery session. We will audit your current architecture and outline a custom roadmap.
            </p>
            <a href="#inquiry-form" className="btn" style={{ "--bg": "#eab308", "--fg": "#0d0020", "--chip": "rgba(0,0,0,0.15)", "--chipfg": "#0d0020", padding: "14px 32px", fontSize: 16, fontWeight: 800 } as React.CSSProperties}>
              <span className="label">Get in touch now</span>
              <span className="chip"><ArrowIcon size={18} /></span>
            </a>
          </div>

          <div style={{ position: "relative", display: "flex", justifyContent: "center", zIndex: 2 }}>
            <div style={{ width: "100%", maxWidth: 420, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 24, padding: 32, backdropFilter: "blur(16px)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <span style={{ fontFamily: "var(--f-mono)", fontSize: 12, color: "#eab308" }}>● LIVE ENGINE STATUS</span>
                <span style={{ fontFamily: "var(--f-mono)", fontSize: 12 }}>60 FPS</span>
              </div>
              <div style={{ height: 180, borderRadius: 16, background: "linear-gradient(45deg, #ff7597, #6b46c1)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 24, letterSpacing: "-.02em" }}>
                FOXMEN STUDIO v3.0
              </div>
            </div>
          </div>
          <div style={{ position: "absolute", right: "-10%", bottom: "-20%", width: 500, height: 500, background: "radial-gradient(circle, rgba(255,117,151,0.25) 0%, rgba(0,0,0,0) 70%)", pointerEvents: "none" }} />
        </div>
      </section>

      {/* ── 12. FAQ SECTION ── */}
      <section className="reveal" style={{ background: "#fff", padding: "100px 40px", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: 60, alignItems: "flex-start" }}>
          <div>
            <span style={{ fontFamily: "var(--f-mono)", fontSize: 12, color: "#6b46c1", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase" }}>GOT QUESTIONS?</span>
            <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-.03em", margin: "12px 0 20px" }}>
              Frequently Asked Questions
            </h2>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: "rgba(13,0,32,0.7)", margin: "0 0 32px" }}>
              Have a specific technical or onboarding question not answered here? Reach out to our engineering team directly.
            </p>
            <a href="#inquiry-form" className="btn" style={{ "--bg": "rgba(0,0,0,0.06)", "--fg": "#0d0020", "--chip": "rgba(0,0,0,0.12)", "--chipfg": "#0d0020", padding: "12px 28px" } as React.CSSProperties}>
              <span className="label">Ask a custom question</span>
              <span className="chip"><ArrowIcon size={16} /></span>
            </a>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {data.faqs.map((f, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx}
                     onClick={() => setOpenFaq(isOpen ? null : idx)}
                     style={{ background: "#f8f9fb", borderRadius: 20, padding: "28px", border: isOpen ? "2px solid #0d0020" : "1px solid rgba(0,0,0,0.05)", cursor: "pointer", transition: "all 0.25s ease" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: "#0d0020", lineHeight: 1.3 }}>
                      {f.q}
                    </h3>
                    <AccordionIcon isOpen={isOpen} />
                  </div>
                  {isOpen && (
                    <p style={{ margin: "16px 0 0", fontSize: 16, lineHeight: 1.6, color: "rgba(13,0,32,0.72)", paddingTop: 16, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                      {f.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 13. PROJECT INQUIRY FORM SECTION ── */}
      <section id="inquiry-form" className="reveal" style={{ padding: "100px 40px", maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ background: "#fff", borderRadius: 36, padding: "60px", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 20px 60px rgba(0,0,0,0.04)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 60 }}>
          <div>
            <span style={{ fontFamily: "var(--f-mono)", fontSize: 12, color: "#6b46c1", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase" }}>PROJECT INQUIRY</span>
            <h2 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-.03em", margin: "12px 0 24px" }}>
              Have a project in mind? Let&apos;s get started.
            </h2>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: "rgba(13,0,32,0.7)", margin: "0 0 40px" }}>
              Fill out the form with your initial project brief. Our principal architects will review your requirements and respond within 24 hours.
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px", borderRadius: 20, background: "#f8f9fb", border: "1px solid rgba(0,0,0,0.05)", maxWidth: 360 }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#6b46c1", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--f-mono)", fontSize: 22, fontWeight: 800 }}>
                AF
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16, color: "#0d0020" }}>Alexander Fox</div>
                <div style={{ fontSize: 13, color: "rgba(13,0,32,0.6)", fontFamily: "var(--f-mono)" }}>Principal Architect & Founder</div>
              </div>
            </div>
          </div>

          <div>
            {submitted ? (
              <div style={{ background: "#ecfdf5", border: "1px solid #10b981", borderRadius: 24, padding: "48px", textAlign: "center" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#10b981", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 20px" }}>✓</div>
                <h3 style={{ fontSize: 28, fontWeight: 800, color: "#065f46", margin: "0 0 12px" }}>Inquiry Received!</h3>
                <p style={{ fontSize: 16, color: "#047857", margin: "0 0 24px", lineHeight: 1.6 }}>
                  Thank you for reaching out, {formState.name || "partner"}. We have received your project brief and our engineering team will get back to you within 24 hours.
                </p>
                <button onClick={() => setSubmitted(false)} className="btn btn--brand" style={{ margin: "0 auto" }}>
                  <span className="label">Send another inquiry</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <label style={{ display: "block", fontFamily: "var(--f-mono)", fontSize: 12, fontWeight: 700, marginBottom: 8, color: "rgba(13,0,32,0.7)", textTransform: "uppercase" }}>Your Name *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Marcus Vance"
                    value={formState.name}
                    onChange={e => setFormState({ ...formState, name: e.target.value })}
                    style={{ width: "100%", padding: "16px 20px", borderRadius: 14, border: "1px solid rgba(0,0,0,0.12)", background: "#f8f9fb", fontSize: 16, outline: "none", fontFamily: "var(--f-sans)", transition: "border 0.2s ease" }}
                    onFocus={e => (e.target.style.borderColor = "#0d0020")}
                    onBlur={e => (e.target.style.borderColor = "rgba(0,0,0,0.12)")}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
                  <div>
                    <label style={{ display: "block", fontFamily: "var(--f-mono)", fontSize: 12, fontWeight: 700, marginBottom: 8, color: "rgba(13,0,32,0.7)", textTransform: "uppercase" }}>Work Email *</label>
                    <input
                      required
                      type="email"
                      placeholder="marcus@company.com"
                      value={formState.email}
                      onChange={e => setFormState({ ...formState, email: e.target.value })}
                      style={{ width: "100%", padding: "16px 20px", borderRadius: 14, border: "1px solid rgba(0,0,0,0.12)", background: "#f8f9fb", fontSize: 16, outline: "none", fontFamily: "var(--f-sans)" }}
                      onFocus={e => (e.target.style.borderColor = "#0d0020")}
                      onBlur={e => (e.target.style.borderColor = "rgba(0,0,0,0.12)")}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontFamily: "var(--f-mono)", fontSize: 12, fontWeight: 700, marginBottom: 8, color: "rgba(13,0,32,0.7)", textTransform: "uppercase" }}>Company / Organization</label>
                    <input
                      type="text"
                      placeholder="Apex FinTech"
                      value={formState.company}
                      onChange={e => setFormState({ ...formState, company: e.target.value })}
                      style={{ width: "100%", padding: "16px 20px", borderRadius: 14, border: "1px solid rgba(0,0,0,0.12)", background: "#f8f9fb", fontSize: 16, outline: "none", fontFamily: "var(--f-sans)" }}
                      onFocus={e => (e.target.style.borderColor = "#0d0020")}
                      onBlur={e => (e.target.style.borderColor = "rgba(0,0,0,0.12)")}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontFamily: "var(--f-mono)", fontSize: 12, fontWeight: 700, marginBottom: 8, color: "rgba(13,0,32,0.7)", textTransform: "uppercase" }}>Estimated Budget</label>
                  <select
                    value={formState.budget}
                    onChange={e => setFormState({ ...formState, budget: e.target.value })}
                    style={{ width: "100%", padding: "16px 20px", borderRadius: 14, border: "1px solid rgba(0,0,0,0.12)", background: "#f8f9fb", fontSize: 16, outline: "none", fontFamily: "var(--f-sans)", cursor: "pointer" }}
                  >
                    <option value="< $15k">&lt; $15k (Landing Page / MVP Feature)</option>
                    <option value="$15k–$50k">$15k – $50k (Full Custom Web Build)</option>
                    <option value="$50k–$150k">$50k – $150k (Multi-Platform Ecosystem)</option>
                    <option value="$150k+">$150k+ (Enterprise Transformation)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontFamily: "var(--f-mono)", fontSize: 12, fontWeight: 700, marginBottom: 8, color: "rgba(13,0,32,0.7)", textTransform: "uppercase" }}>Project Scope & Timeline *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us about your objectives, current tech stack, and target launch date..."
                    value={formState.desc}
                    onChange={e => setFormState({ ...formState, desc: e.target.value })}
                    style={{ width: "100%", padding: "16px 20px", borderRadius: 14, border: "1px solid rgba(0,0,0,0.12)", background: "#f8f9fb", fontSize: 16, outline: "none", fontFamily: "var(--f-sans)", resize: "vertical" }}
                    onFocus={e => (e.target.style.borderColor = "#0d0020")}
                    onBlur={e => (e.target.style.borderColor = "rgba(0,0,0,0.12)")}
                  />
                </div>

                <button type="submit" className="btn btn--brand" style={{ width: "100%", justifyContent: "center", padding: "16px 28px", fontSize: 16, marginTop: 10 }}>
                  <span className="label">Submit Project Inquiry</span>
                  <span className="chip"><ArrowIcon size={18} /></span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
