"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import ProjectEstimator from "@/app/components/ProjectEstimator";

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
          <span className="eyebrow">International Digital Studio — EST. 2019</span>
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
            <Link href="/work" className="btn btn--lg">
              <span className="label">See our work</span>
              <span className="chip" aria-hidden="true"><ArrowIcon /></span>
            </Link>
            <Link href="/contact" className="tlink">Book a 20-min call →</Link>
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
  { tone:"violet", num:"CASE 01 / 06", name:"Nestaro", sub:"— real-estate OS", copy:"A search-first listings platform with map clustering, saved searches, agent CRMs and mortgage tools. We rebuilt the search index from scratch — page-loads dropped from 4.1s to 380ms.", meta:[["Industry","Real Estate"],["Year","2025"],["Scope","Design · Build · AI"]], eyebrow:"Web · iOS · Android", screenTitle:"Nestaro", screenSub:"— real estate", lns:["w2","w1","w3","w4","w2"], ph:"Product · 01", phColor:undefined },
  { tone:"ink",    num:"CASE 02 / 06", name:"Pulse",   sub:"— AI copilot",     copy:"RAG-powered sales copilot for a B2B SaaS, with custom embeddings, agent tooling and an interface that feels closer to Linear than to ChatGPT. Adoption hit 92% in week one.", meta:[["Industry","B2B SaaS"],["Year","2025"],["Scope","AI · UX · Build"]], eyebrow:"LLMs · Vector DB", screenTitle:"Pulse", screenSub:"— ai copilot", lns:["w2","w3","w1","w2","w4"], ph:"Product · 02", phColor:undefined },
  { tone:"bone",   num:"CASE 03 / 06", name:"Marketo", sub:"— multi-vendor",   copy:"A multi-vendor marketplace with vendor onboarding, split payouts via Stripe Connect, ratings, and an opinionated commerce design language. Now hosts 2,400+ sellers.", meta:[["Industry","Ecommerce"],["Year","2024"],["Scope","Platform · Brand"]], eyebrow:"Medusa · Stripe", screenTitle:"Marketo", screenSub:"— marketplace", lns:["w1","w2","w3","w4","w2"], ph:"Product · 03", phColor:"rgba(10,10,10,.35)" },
  { tone:"brand",  num:"CASE 04 / 06", name:"Atlas",   sub:"— travel app",     copy:"A native iOS travel planner with AI-generated itineraries and offline maps. The first version shipped in 9 weeks; #6 in App Store Travel within a month.", meta:[["Industry","Travel"],["Year","2025"],["Scope","iOS · AI"]], eyebrow:"Swift · Mapbox", screenTitle:"Atlas", screenSub:"— mobile", lns:["w2","w1","w3","w2","w4"], ph:"Product · 04", phColor:"rgba(255,255,255,.55)" },
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

export default function Home() {
  useScrollReveal(".fade, .reveal, .bento .tile, .split .shot");

  const [dbServices, setDbServices] = useState<DbService[]>([]);
  useEffect(() => {
    fetch("/api/services?visible=true").then(r => r.json()).then(rows => {
      if (Array.isArray(rows) && rows.length > 0) setDbServices(rows);
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
                }))
              : svcRows
            ).map((s, i) => (
              <Link className="svc-row" href="/services" key={i}>
                <span className="idx">{s.idx}</span>
                <span className="title">{s.title}</span>
                <span className="desc">{s.desc}</span>
                <span className="tags">{s.tags}</span>
                <span className="arrow"><SmArrow /></span>
                <span className="preview">{s.preview}</span>
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
            {cards.map((c, i) => (
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
                      <Link href="/work/nestaro" className="btn">
                        <span className="label">Case study</span>
                        <span className="chip"><ArrowIcon /></span>
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
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
                42 active clients across <span className="it">17 countries</span> — from seed-stage to listed.
              </h3>
            </div>
            <Link href="/work" className="tlink fade d2">See the work →</Link>
          </div>
        </div>
        <div className="proof-grid fade">
          {proofCells.map((c, i) => (
            <div className="cell" key={i}>
              <span className="mk">{c.mk}</span> {c.name}
              <span className="badge">{c.badge}</span>
            </div>
          ))}
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

      {/* Testimonials */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="svc-head">
            <div className="fade"><span className="eyebrow">Words from clients</span></div>
            <h2 className="display fade d1">What it feels like to <span className="it">work</span> with us.</h2>
          </div>
          <div className="testimonials">
            {[
              { stars:"★★★★★", av:"SK", who:"Sara Köhler",  role:"CEO · Nestaro",            q:<>&ldquo;Foxmen turned a vague pitch deck into a product our investors <span className="it">actually used</span> during the round. They ship like a product team, not an agency.&rdquo;</> },
              { stars:"★★★★★", av:"DA", who:"Devon Arias",  role:"Head of Product · Pulse",   q:<>&ldquo;The AI copilot they built drove our <span className="it">activation rate</span> from 28% to 71%. Every meeting felt like we got our money back twice.&rdquo;</> },
              { stars:"★★★★★", av:"RM", who:"Rina Mehta",   role:"CTO · Marketo",             q:<>&ldquo;Care is in the name and it shows. Our launch had <span className="it">zero</span> P0s in week one — a first for us across three agencies.&rdquo;</> },
            ].map((t, i) => (
              <div className={`testimonial fade${i ? ` d${i}` : ""}`} key={i}>
                <div className="stars">{t.stars}</div>
                <p className="quote">{t.q}</p>
                <div className="meta">
                  <div className="avatar">{t.av}</div>
                  <div className="who">{t.who}<span>{t.role}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
              <Link href="/contact" className="btn btn--ghost btn--lg">
                <span className="label">Book a 20-min call</span>
                <span className="chip"><ArrowIcon /></span>
              </Link>
            </div>
            <div className="ic fade d3">Replies within 24 hours · Mon–Fri</div>
          </div>
        </div>
      </section>
    </>
  );
}
