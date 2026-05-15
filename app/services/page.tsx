"use client";
import React from "react";
import Link from "next/link";
import { useScrollReveal } from "@/hooks/useScrollReveal";

function ArrowIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h18M13 5l7 7-7 7" />
    </svg>
  );
}

function Dot() {
  return <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--brand)", flex: "0 0 auto", display: "inline-block" }} />;
}

function WhiteDot() {
  return <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", flex: "0 0 auto", display: "inline-block" }} />;
}

const monoLabel: React.CSSProperties = {
  fontFamily: "var(--f-mono)",
  fontSize: 11,
  letterSpacing: ".18em",
  color: "var(--muted)",
  textTransform: "uppercase",
};

const monoLabelWhite: React.CSSProperties = {
  ...monoLabel,
  color: "rgba(255,255,255,.7)",
};

const arrowCircle = (
  <span style={{ border: "1px solid var(--ink)", width: 38, height: 38, borderRadius: "50%", display: "grid", placeItems: "center" }}>
    <ArrowIcon />
  </span>
);

export default function ServicesPage() {
  useScrollReveal();

  return (
    <>
      <section className="page-hero">
        <div className="wrap page-hero-split">
          <div>
            <div className="crumbs fade in">
              <Link href="/">Home</Link><span className="sep">/</span><span>Services</span>
            </div>
            <h1 className="display">
              <span className="reveal in"><span className="reveal-inner">One studio,</span></span>
              <span className="reveal in reveal-delay-1"><span className="reveal-inner">every</span></span>
              <span className="reveal in reveal-delay-2"><span className="reveal-inner it">layer.</span></span>
            </h1>
            <p className="lede fade in d2">
              From the first sketch to the millionth user. We&apos;re a senior, integrated team that designs, engineers, and grows digital products — without handoffs.
            </p>
          </div>
          <div className="page-hero-right" aria-hidden="true">
            <div className="ph-stats">
              {([
                { v: "120+", k: "Products shipped"   },
                { v: "07",   k: "Core capabilities"  },
                { v: "17",   k: "Countries served"   },
                { v: "98%",  k: "Client retention"   },
              ] as { v: string; k: string }[]).map(({ v, k }, i) => (
                <div key={i} className="ph-stat" style={{ "--di": i } as React.CSSProperties}>
                  <div className="v">{v}</div>
                  <div className="k">{k}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CAPABILITIES GRID */}
      <section className="section" style={{ paddingTop: 80 }}>
        <div className="wrap">
          <div className="svc-modern-head">
            <div className="smh-left">
              <div className="fade"><span className="eyebrow">07 capabilities · One team</span></div>
              <h2 className="display fade d1">
                Modular by <span className="it">design.</span><br />
                Pick a craft, or pick all of them.
              </h2>
            </div>
            <div className="smh-right fade d2" aria-hidden="true">
              <div className="smh-tags">
                {["Next.js","React Native","Swift","Flutter","OpenAI","Anthropic","Figma","Stripe","Mapbox","Postgres","Sanity","Framer"].map((t, i) => (
                  <span key={i} className="smh-tag" style={{ "--di": i } as React.CSSProperties}>{t}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="svc-grid">
            {/* Web — wide */}
            <a href="#web" className="svc-card wide fade" id="web">
              <span className="pill-tag">Most popular</span>
              <div className="visual-tile"><span className="ic">&lt;/&gt;</span></div>
              <div className="body">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 12 }}>
                  <span style={monoLabel}>01 — Web</span>
                  <span className="head">{arrowCircle}</span>
                </div>
                <h3>Web Design <span className="it">&amp; Development</span></h3>
                <p>Marketing sites, SaaS dashboards, and bespoke web apps. Built on Next.js, React, and headless CMS — buttery animations, 100/100 Lighthouse out of the box.</p>
                <div className="tags">
                  <span>Next.js</span><span>React</span><span>Sanity</span><span>Framer Motion</span><span>Webflow</span>
                </div>
              </div>
            </a>

            {/* Mobile */}
            <a href="#mobile" className="svc-card normal brand-tile fade d1" id="mobile">
              <div className="visual-tile"><span className="ic">▢</span></div>
              <div className="body">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 12 }}>
                  <span style={monoLabel}>02 — Mobile</span>
                  <span className="arrow"><ArrowIcon /></span>
                </div>
                <h3>iOS, Android <span className="it">apps</span></h3>
                <p>MVP to App Store in 8–12 weeks. Native or React Native + Flutter when the brief fits.</p>
                <div className="tags"><span>Swift</span><span>Kotlin</span><span>RN</span><span>Flutter</span></div>
              </div>
            </a>

            {/* AI — tall */}
            <a href="#ai" className="svc-card tall fade d2" id="ai">
              <span className="pill-tag">New · 2026</span>
              <div className="visual-tile">
                <span className="ic" style={{ fontSize: 84 }}><em style={{ fontStyle: "italic" }}>AI</em></span>
              </div>
              <div className="body">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 12 }}>
                  <span style={monoLabel}>03 — AI</span>
                  <span className="arrow"><ArrowIcon /></span>
                </div>
                <h3><span className="it">AI&#8209;Integrated</span> Software</h3>
                <p>Production-grade RAG, agentic workflows, and fine-tuned models. We embed intelligence where it matters — fewer clicks, faster answers, defensible moats.</p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
                  {["Retrieval-augmented generation", "Vector search & embeddings", "Agent orchestration", "Fine-tuning & evals"].map((item) => (
                    <li key={item} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 13 }}><Dot />{item}</li>
                  ))}
                </ul>
                <div className="tags"><span>OpenAI</span><span>Anthropic</span><span>Pinecone</span><span>LangChain</span></div>
              </div>
            </a>

            {/* Ecommerce */}
            <a href="#commerce" className="svc-card normal fade" id="commerce">
              <div className="visual-tile"><span className="ic">$</span></div>
              <div className="body">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 12 }}>
                  <span style={monoLabel}>04 — Commerce</span>
                  <span className="arrow"><ArrowIcon /></span>
                </div>
                <h3>Ecommerce <span className="it">&amp; Multi-vendor</span></h3>
                <p>Shopify, Medusa, custom marketplaces with vendor portals and Stripe Connect payouts.</p>
                <div className="tags"><span>Shopify Plus</span><span>Medusa</span><span>Stripe Connect</span></div>
              </div>
            </a>

            {/* Real Estate */}
            <a href="#real-estate" className="svc-card normal bone-tile fade d1" id="real-estate">
              <div className="visual-tile"><span className="ic" style={{ color: "var(--ink)" }}>⌖</span></div>
              <div className="body">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 12 }}>
                  <span style={monoLabel}>05 — Real Estate</span>
                  <span className="arrow"><ArrowIcon /></span>
                </div>
                <h3>Real-estate <span className="it">platforms</span></h3>
                <p>Listings, brokerage CRMs, map clustering, mortgage tooling. Performant at portfolio scale.</p>
                <div className="tags"><span>Mapbox</span><span>Algolia</span><span>Postgres</span></div>
              </div>
            </a>

            {/* Brand */}
            <a href="#brand" className="svc-card normal fade d2" id="brand">
              <div className="visual-tile"><span className="ic">A</span></div>
              <div className="body">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 12 }}>
                  <span style={monoLabel}>06 — Brand</span>
                  <span className="arrow"><ArrowIcon /></span>
                </div>
                <h3>UI · UX <span className="it">&amp; Brand</span></h3>
                <p>Identity, design systems, motion principles. We design for clarity, then make it sing.</p>
                <div className="tags"><span>Figma</span><span>Tokens</span><span>Motion</span></div>
              </div>
            </a>

            {/* Growth */}
            <a href="#growth" className="svc-card normal fade" id="growth">
              <div className="visual-tile"><span className="ic">↗</span></div>
              <div className="body">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 12 }}>
                  <span style={monoLabel}>07 — Growth</span>
                  <span className="arrow"><ArrowIcon /></span>
                </div>
                <h3>Performance <span className="it">marketing</span></h3>
                <p>Funnels, paid acquisition, SEO, lifecycle. Growth wired to the same analytics as the product.</p>
                <div className="tags"><span>SEO</span><span>Paid</span><span>Lifecycle</span></div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" style={{ padding: "80px 0" }}>
        <div className="process">
          <div className="wrap">
            <div className="process-head">
              <div><div className="fade"><span className="eyebrow" style={{ color: "#bdbdbd" }}>How we work</span></div></div>
              <h2 className="fade d1">A <span style={{ fontStyle: "italic", color: "var(--brand)" }}>deliberate</span> process — four chapters from brief to launch.</h2>
            </div>
            <div className="steps">
              {[
                { num: "01", title: "Discover", copy: "Workshops, audits, user research. We unpack the problem from every angle and write a brief that everyone agrees on.", items: ["Audit", "Stakeholder map", "JTBD"] },
                { num: "02", title: "Design", copy: "Information architecture, flows, components, prototypes. We design in the browser so what you see is what ships.", items: ["IA", "Design system", "Hi-fi prototypes"] },
                { num: "03", title: "Build", copy: "Production engineering with weekly demos. CI, observability and analytics from day one — never bolted on.", items: ["Next.js · Swift", "Postgres", "CI / CD"] },
                { num: "04", title: "Care", copy: "Launch is a milestone, not the finish line. We retain a pod after launch to ship the next 90 days.", items: ["SLA", "Experiments", "Roadmap"] },
              ].map((s, i) => (
                <div className={`step fade${i > 0 ? ` d${i}` : ""}`} key={s.num}>
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

      {/* PRICING */}
      <section className="section" style={{ paddingTop: 80 }}>
        <div className="wrap">
          <div className="svc-modern-head">
            <div className="smh-left">
              <div className="fade"><span className="eyebrow">How to engage</span></div>
              <h2 className="display fade d1">Three ways to <span className="it">work</span> with us.</h2>
            </div>
            <div className="smh-right fade d2" aria-hidden="true">
              <div className="smh-bars">
                <div className="smh-bars-title">How clients engage</div>
                {([
                  { l: "Sprint", pct: "22%", w: "22%", hi: false },
                  { l: "Build",  pct: "68%", w: "68%", hi: true  },
                  { l: "Care",   pct: "82%", w: "82%", hi: false },
                ] as { l: string; pct: string; w: string; hi: boolean }[]).map((r, i) => (
                  <div key={i} className="smh-bar-row" style={{ "--di": i } as React.CSSProperties}>
                    <span className="smh-bar-label">{r.l}</span>
                    <div className="smh-bar-track">
                      <div className={`smh-bar-fill${r.hi ? " hi" : ""}`} style={{ "--w": r.w, "--di": i } as React.CSSProperties} />
                    </div>
                    <span className="smh-bar-pct">{r.pct}</span>
                  </div>
                ))}
                <p className="smh-bar-note">of active clients layer all three over time</p>
              </div>
            </div>
          </div>

          <div className="svc-grid">
            {/* Sprint */}
            <div className="svc-card normal fade" style={{ gridColumn: "span 2" }}>
              <div className="body">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 12 }}>
                  <span style={monoLabel}>Sprint</span>
                  <span style={{ fontFamily: "var(--f-display)", fontSize: 32, lineHeight: 1, color: "var(--brand)" }}>$25k+</span>
                </div>
                <h3 style={{ marginTop: 20 }}>A <span className="it">2-week</span> design or AI sprint.</h3>
                <p>Audit, prototype, validate. Best for de-risking a single feature, or shaping a Series A pitch.</p>
                <ul style={{ listStyle: "none", padding: 0, margin: "14px 0 0", display: "grid", gap: 8 }}>
                  {["2 weeks · 1 designer + 1 strategist", "Hi-fi prototypes & eval plan", "Async-first, daily demos"].map((it) => (
                    <li key={it} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 13 }}><Dot />{it}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Build — recommended */}
            <div className="svc-card tall brand-tile fade d1" style={{ gridColumn: "span 2", gridRow: "span 1" }}>
              <span className="pill-tag">Recommended</span>
              <div className="body" style={{ background: "var(--brand)", color: "#fff" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 12 }}>
                  <span style={monoLabelWhite}>Build</span>
                  <span style={{ fontFamily: "var(--f-display)", fontSize: 32, lineHeight: 1, color: "#fff" }}>$75k+</span>
                </div>
                <h3 style={{ marginTop: 20, color: "#fff" }}>A <span style={{ fontStyle: "italic", color: "#fff", textDecoration: "underline", textDecorationColor: "rgba(255,255,255,.5)" }}>8-14 week</span> end-to-end build.</h3>
                <p style={{ color: "rgba(255,255,255,.85)" }}>Brief to launch with a full pod: strategy, design, engineering. The way 80% of our clients engage.</p>
                <ul style={{ listStyle: "none", padding: 0, margin: "14px 0 0", display: "grid", gap: 8 }}>
                  {["Full team · weekly demos", "Production deploy", "30-day post-launch care"].map((it) => (
                    <li key={it} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 13, color: "rgba(255,255,255,.9)" }}><WhiteDot />{it}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Care */}
            <div className="svc-card normal fade d2" style={{ gridColumn: "span 2" }}>
              <div className="body">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 12 }}>
                  <span style={monoLabel}>Care</span>
                  <span style={{ fontFamily: "var(--f-display)", fontSize: 32, lineHeight: 1, color: "var(--brand)" }}>$15k/mo</span>
                </div>
                <h3 style={{ marginTop: 20 }}>A <span className="it">retained</span> product team.</h3>
                <p>Quarterly contracts with a senior pod. For teams shipping a continuous roadmap without hiring out.</p>
                <ul style={{ listStyle: "none", padding: 0, margin: "14px 0 0", display: "grid", gap: 8 }}>
                  {["3-person pod · quarterly", "SLA & on-call", "Quarterly roadmap reviews"].map((it) => (
                    <li key={it} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 13 }}><Dot />{it}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" style={{ padding: "60px 0" }}>
        <div className="cta">
          <div className="wrap-tight">
            <div className="fade in"><span className="eyebrow">Let&apos;s build</span></div>
            <h2 className="fade in d1">Pick a craft. <span className="it">Or all of them.</span></h2>
            <div className="row fade in d2">
              <Link href="/contact" className="btn btn--lg">
                <span className="label">Start a project</span>
                <span className="chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18M13 5l7 7-7 7" /></svg></span>
              </Link>
              <Link href="/work" className="btn btn--ghost btn--lg">
                <span className="label">See the work</span>
                <span className="chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18M13 5l7 7-7 7" /></svg></span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
