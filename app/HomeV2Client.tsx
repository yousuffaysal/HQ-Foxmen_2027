"use client";

/**
 * Home V2 — ported from Figma "FS Redesign" › Home V2 - Footer variation (4:641).
 * Desktop is the designed target (1920 canvas / 1728 container = .wrap).
 * Content falls back to the Figma copy whenever the DB tables come back empty.
 */

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import ProjectEstimator from "@/app/components/ProjectEstimator";
import NewsletterForm from "@/components/NewsletterForm";
import "./home-v2.css";

/* ── Data contracts (unchanged from HomeClient so page.tsx just swaps) ── */
type DbService = { id: number; ord: number; name: string; descr: string; count: string; visible: boolean; badge: string | null; image: string | null };
type DbProject = { id: number; name: string; tagline: string; industry: string; year: string; scope: string; status: string; thumbnail: string; slug: string; color_cls: string; live_url: string; home_featured: boolean; home_order: number };
type DbClient = { id: number; name: string; industry: string; country: string };
type DbTesti = { id: number; quote: string; name: string; role: string; av: string; hi: string; rating: number; img: string };

function Arrow({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 12h18M13 5l7 7-7 7" />
    </svg>
  );
}

function Plus() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

/* ── Figma fallback content ─────────────────────────────────── */

const FALLBACK_SERVICES = [
  { name: "UI • UX & Brand\nSystems", descr: "Identity, design systems, motion.", tags: ["UI UX Consulting", "UX Research", "Usability Testing", "UX Audit"] },
  { name: "Web Design &\nDevelopment", descr: "Marketing sites, SaaS dashboards, bespoke web apps.", tags: ["UI UX Consulting", "UX Research", "Usability Testing", "UX Audit"] },
  { name: "iOS, Android &\nCross-platform", descr: "Native and cross-platform apps that feel first-party.", tags: ["UI UX Consulting", "UX Research", "Usability Testing", "UX Audit"] },
  { name: "AI-Integrated\nSoftware", descr: "Agents, RAG pipelines and AI surfaces built to ship.", tags: ["UI UX Consulting", "UX Research", "Usability Testing", "UX Audit"] },
  { name: "Ecommerce &\nMulti-vendor", descr: "Storefronts and marketplaces that convert.", tags: ["UI UX Consulting", "UX Research", "Usability Testing", "UX Audit"] },
  { name: "Real-Estate\nPlatforms", descr: "Listings, CRM and operations in one system.", tags: ["UI UX Consulting", "UX Research", "Usability Testing", "UX Audit"] },
];

const CAPABILITIES = ["Web Design", "Mobile Apps", "AI Integration", "Ecommerce", "Real-Estate Platforms", "Multi-Vendor"];

const FALLBACK_CASES = [
  { name: "Redleaf", tagline: "Revolutionizing Ecommerce with AI", industry: "E-commerce", year: "2026", scope: "Web · AI · Design", thumbnail: "/redesign/case-redleaf.png", slug: "" },
  { name: "Skill-Bridge", tagline: "Revolutionizing Ecommerce with AI", industry: "E-Learning", year: "2026", scope: "Web · AI · Design", thumbnail: "/redesign/case-skillbridge.png", slug: "" },
  { name: "Celeste — AI-native marketplace", tagline: "One conversation, one cart, every verified vendor — shopping, intelligently calm.", industry: "E-commerce", year: "2026", scope: "Web · AI · Design", thumbnail: "/redesign/case-celeste.png", slug: "" },
];

const FALLBACK_TESTIS = Array.from({ length: 4 }, (_, i) => ({
  id: -(i + 1),
  quote: "I've been consistently impressed with the quality of service provided by this website. They have exceeded my expectations and delivered exceptional results. Highly recommended!",
  name: "Courtney Henry",
  role: "CEO · Noorvia",
  av: "CH",
  img: "/redesign/avatar.png",
  rating: 5,
}));

const AI_POINTS = [
  "Fine-tuned models scoped to your brand, data and tone",
  "Cost & latency budgets baked into every design choice",
  "Agentic workflows that plan, retrieve, and execute safely",
  "Production-grade RAG pipelines with eval-driven prompting",
];

const AI_CHIPS = ["Embeddings", "Fine-tuning", "RAG · Retrieval", "Agents"];

const PROCESS = [
  { n: "01", kicker: "Gather", h: "Discovering", d: "Workshops, audits, user research. We unpack the problem from every angle and write down what success means.", tags: ["AUDIT", "STAKEHOLDER JTBD", "MAP"] },
  { n: "02", kicker: "UI", h: "Design", d: "Information architecture, flows, components, prototypes. We design in the browser early and often.", tags: ["IA", "DESIGN SYSTEM", "HI-FI PROTOTYPES"] },
  { n: "03", kicker: "Build", h: "Build", d: "Production engineering with weekly demos. CI, observability and analytics from day one.", tags: ["NEXT. JS • SWIFT", "POSTGRES", "CI / CD"] },
  { n: "04", kicker: "Care", h: "Care", d: "Launch is a milestone, not the finish line. We retain a small pod after launch to iterate and improve.", tags: ["SLA", "EXPERIMENTS", "ROADMAP"] },
];

const PORTAL_STEPS = [
  { n: "/ 01", h: "Get invited", d: "A secure invite lands in your inbox on day one. One click and you're inside your private portal, zero setup, zero friction." },
  { n: "/ 02", h: "See everything", d: "Live status, file drops, sprint timelines and team progress, one clean view. No chasing emails, no wondering what's happening." },
  { n: "/ 03", h: "Stay notified", d: "Push alerts the moment a milestone lands, a design is ready, or something needs your eyes. Always in the loop without asking." },
  { n: "/ 04", h: "Approve & ship", d: "Review deliverables, drop comments, sign off on milestones right inside the portal. No email threads. Pure momentum." },
];

const SUPPORT_MODES = [
  { kicker: "Automated · GPT-powered", h: "Foxo AI", d: "Instant answers about services, pricing, timelines and case studies, round the clock.", when: "24 / 7" },
  { kicker: "Human · Founder-led", h: "Live Chat", d: "Real people from the team. For scoping, briefs, or anything that deserves a proper conversation.", when: "Mon – Fri" },
];

const CHAT = [
  { me: false, text: "How can we help you?", time: "1 min ago" },
  { me: false, text: "Typically 4-8 weeks from kickoff to launch, depending on scope.", time: "1 min ago" },
  { me: true, text: "And pricing?", time: "3 Sec ago" },
  { me: false, text: "Marketing sites are faster, 3-4 weeks. Full apps take 8-14 weeks.", time: "1 min ago" },
];

const FAQS = [
  {
    q: "What services does Foxmen Studio specialize in?",
    a: "We specialize in high-end UI/UX design, custom web development using modern frameworks, and brand identity. Our focus is on creating “radical simplicity”—functional, aesthetic digital experiences that prioritize user intent.",
  },
  {
    q: "What does your design process look like?",
    a: "Four chapters: Discover, Design, Build and Care. We start with workshops and research, move into information architecture and prototypes, ship production engineering with weekly demos, then stay on after launch to iterate.",
  },
  {
    q: "Do you provide design source files?",
    a: "Yes. You own everything we make — Figma files, design tokens, component libraries and the full source repository are handed over at the end of every engagement.",
  },
  {
    q: "How long does a typical project take?",
    a: "Marketing sites usually run 3–4 weeks. Full products and apps take 8–14 weeks depending on scope. Our average time to launch across all projects is 14 weeks.",
  },
  {
    q: "Is accessibility included in your design work?",
    a: "Always, and never as an afterthought. We design to WCAG 2.2 AA as a baseline — colour contrast, keyboard paths, focus states and screen-reader semantics are part of the component work itself.",
  },
  {
    q: "How do you approach minimalism in your designs?",
    a: "Minimalism is a result, not a style. We remove anything that doesn’t help someone finish what they came to do, then spend the recovered attention on the few moments that actually matter.",
  },
];

const FOOT_SERVICES = ["UI • UX & Brand Systems", "Web Design & Development", "AI-Integrated Software", "iOS, Android & Cross-platform", "Ecommerce & Multi-vendor", "Real-Estate Platforms"];
const FOOT_LINKS: [string, string][] = [["Home", "/"], ["About Us", "/about"], ["Work", "/work"], ["Services", "/services"], ["Journal", "/journal"], ["Tools", "/tools"], ["Contact Us", "/contact"]];
const FOOT_SUPPORT: [string, string][] = [["FAQ'S", "/contact"], ["Support Center", "/contact"], ["Client Portal", "/portal"], ["Privacy Policy", "/contact"], ["Terms", "/contact"]];

/* ── Page ───────────────────────────────────────────────────── */

export default function HomeV2Client({
  initialServices,
  initialProjects,
  initialTestis,
}: {
  initialServices: DbService[];
  initialProjects: DbProject[];
  initialClients: DbClient[];
  initialTestis: DbTesti[];
}) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  /* ProjectEstimator's markup uses the shared `.fade` class, which starts at
     opacity 0 until this hook adds `.in`. Without it the panel renders empty. */
  useScrollReveal();

  /* DB first, Figma copy as fallback */
  const services = initialServices.length
    ? initialServices.slice(0, 6).map((s) => ({
        name: s.name,
        descr: s.descr,
        tags: (s.count || "").split(/[,·]/).map((t) => t.trim()).filter(Boolean).slice(0, 4),
      }))
    : FALLBACK_SERVICES;

  const cases = initialProjects.length ? initialProjects.slice(0, 3) : FALLBACK_CASES;
  const testis = initialTestis.length ? initialTestis.slice(0, 4) : FALLBACK_TESTIS;

  /* Headline figures are the studio's claims from the design, not row counts —
     deriving them from the tables reads as "3+ projects" on a young database. */
  const stats = [
    { n: "50+", l: "Projects Delivered" },
    { n: "5+", l: "Countries served" },
    { n: "14w", l: "Avg. time to launch" },
    { n: "4.9", l: "Client satisfaction" },
  ];

  return (
    <div className="hv2">
      {/* ══ 1. HERO ══ */}
      <section className="hv2-hero" id="top">
        <div className="hv2-hero__grid" aria-hidden="true" />
        <div className="hv2-hero__flare" aria-hidden="true" />
        <div className="hv2-hero__glow" aria-hidden="true" />

        <div className="wrap hv2-hero__inner">
          <span className="hv2-hero__badge">Accepting new projects for Q3 2026</span>

          <h1 className="v2-display v2-display--light hv2-hero__title">
            We build digital products
            <br />
            that feel alive.
          </h1>

          <p className="hv2-hero__sub">
            Web development, mobile apps, AI-integrated applications, SaaS products &amp; digital marketing.
          </p>

          <div className="hv2-hero__cta">
            <Link href="/contact" className="v2-btn">
              Book a 20-minute call
              <span className="v2-btn__chip"><Arrow /></span>
            </Link>
            <span className="hv2-hero__reviews">
              <span className="hv2-hero__stars">★★★★★</span>
              4.9/5 from 2,400+ verified reviews
            </span>
          </div>
        </div>

        <div className="wrap hv2-hero__stats">
          {stats.map((s) => (
            <div className="hv2-stat" key={s.l}>
              <div className="hv2-stat__n">{s.n}</div>
              <div className="hv2-stat__l">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="hv2-sheet">
        {/* ══ 2. SERVICES ══ */}
        <section className="hv2-services" id="services">
          <div className="wrap">
            <div className="v2-head">
              <span className="v2-pill">What we do</span>
              <h2 className="v2-display v2-head__title">
                A deliberate process: four
                <br />
                chapters from brief to launch.
              </h2>
            </div>
          </div>

          <div className="wrap hv2-services__list">
            {services.map((s, i) => (
              <Link href="/services" className="hv2-svc" key={s.name}>
                <span className="hv2-svc__num">/ {String(i + 1).padStart(2, "0")}</span>
                <h3 className="hv2-svc__title">
                  {s.name.split("\n").map((line, k) => (
                    <span key={k}>
                      {line}
                      {k < s.name.split("\n").length - 1 && <br />}
                    </span>
                  ))}
                </h3>
                <div className="hv2-svc__right">
                  <span className="hv2-svc__rule" aria-hidden="true" />
                  <div>
                    <p className="hv2-svc__descr">{s.descr}</p>
                    {s.tags.length > 0 && (
                      <ul className="hv2-svc__tags">
                        {s.tags.map((t) => <li key={t}>{t}</li>)}
                      </ul>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ══ 3. CAPABILITIES MARQUEE ══ */}
        <section className="hv2-caps" aria-label="Capabilities">
          <div className="hv2-caps__track">
            {[0, 1].map((dup) => (
              <div className="hv2-caps__track-half" style={{ display: "flex", gap: 64 }} key={dup} aria-hidden={dup === 1}>
                {CAPABILITIES.map((c) => (
                  <span className="hv2-caps__item" key={c}>{c}</span>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* ══ 4. FEATURED WORK ══ */}
        <section className="hv2-work" id="work">
          <div className="wrap">
            <div className="hv2-work__head">
              <div>
                <p className="hv2-work__eyebrow">Featured work · 2024 / 2026</p>
                <h2 className="v2-display hv2-work__title">Selected recent projects</h2>
              </div>
              <Link href="/work" className="hv2-work__all">
                All case studies <Arrow size={16} />
              </Link>
            </div>

            <div className="hv2-work__list">
              {cases.map((p, i) => {
                const href = p.slug ? `/work/${p.slug}` : "/work";
                return (
                  <article className="hv2-case" key={p.name}>
                    <Link href={href} className="hv2-case__media">
                      {/* DB thumbnails come from arbitrary remote hosts, so plain
                          <img> here matches the rest of the codebase. */}
                      <img
                        src={p.thumbnail || "/redesign/case-redleaf.png"}
                        alt={p.name}
                        width={783}
                        height={443}
                        loading={i === 0 ? "eager" : "lazy"}
                      />
                    </Link>
                    <div>
                      <p className="hv2-case__kicker">Case {String(i + 1).padStart(2, "0")} / {String(cases.length).padStart(2, "0")}</p>
                      <h3 className="v2-display hv2-case__title">{p.name}</h3>
                      <p className="hv2-case__tagline">{p.tagline}</p>
                      <dl className="hv2-case__meta">
                        <div><dt>Scope</dt><dd>{p.scope}</dd></div>
                        <div><dt>Year</dt><dd>{p.year}</dd></div>
                        <div><dt>Industry</dt><dd>{p.industry}</dd></div>
                      </dl>
                      <Link href={href} className="hv2-case__link">
                        Case study <Arrow size={16} />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══ 5. TESTIMONIALS ══ */}
        <section className="hv2-testi">
          <div className="wrap">
            <div className="v2-head">
              <span className="v2-pill">Client Portal</span>
              <h2 className="v2-display v2-head__title">
                Chosen by 50+ growing
                <br />
                businesses worldwide!
              </h2>
            </div>

            <div className="hv2-testi__grid">
              {testis.map((t) => (
                <figure className="hv2-testi__card" key={t.id}>
                  <span className="hv2-testi__stars">{"★".repeat(Math.round(t.rating || 5))}</span>
                  <blockquote className="hv2-testi__quote">{t.quote}</blockquote>
                  <figcaption className="hv2-testi__who">
                    {/* `av` holds initials, `img` the photo URL — never swap them. */}
                    {t.img
                      ? <img className="hv2-testi__av" src={t.img} alt="" width={56} height={56} loading="lazy" />
                      : <span className="hv2-testi__av hv2-testi__av--initials">{t.av || t.name.slice(0, 2)}</span>}
                    <span>
                      <span className="hv2-testi__name">{t.name}</span>
                      <br />
                      <span className="hv2-testi__role">{t.role}</span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 6. AI ══ */}
        <section className="hv2-ai">
          <div className="wrap hv2-ai__inner">
            <div>
              <span className="v2-pill">AI is our sharpest tool</span>
              <h2 className="v2-display hv2-ai__title">
                We embed intelligence, not
                <br />
                bolt it on after launch.
              </h2>
              <p className="hv2-ai__body">
                AI is no longer a feature; it&rsquo;s a layer. We design product surfaces where AI does the heavy
                lifting invisibly, fewer clicks, faster answers, defensible moats.
              </p>
              <ul className="hv2-ai__list">
                {AI_POINTS.map((p) => <li key={p}>{p}</li>)}
              </ul>
              <Link href="/contact" className="v2-btn" style={{ marginTop: 48, background: "var(--v2-ink)", color: "#fff" }}>
                Book a 20-minute call
                <span className="v2-btn__chip"><Arrow /></span>
              </Link>
            </div>

            <div className="hv2-ai__panel">
              <div className="hv2-ai__chips">
                {AI_CHIPS.map((c) => <span className="hv2-ai__chip" key={c}>{c}</span>)}
              </div>
            </div>
          </div>
        </section>

        {/* ══ 7. PROCESS ══ */}
        <section className="hv2-card" id="process">
          <div className="hv2-card__pad">
            <p className="hv2-proc__eyebrow">HOW WE WORK</p>
            <h2 className="v2-display v2-display--light hv2-proc__title">
              A deliberate process: four
              <br />
              chapters from brief to launch.
            </h2>

            <div className="hv2-proc__steps">
              {PROCESS.map((s) => (
                <div className="hv2-proc__step" key={s.n}>
                  <div className="hv2-proc__n">{s.n}</div>
                  <p className="hv2-proc__kicker">{s.kicker}</p>
                  <h3 className="hv2-proc__h">{s.h}</h3>
                  <p className="hv2-proc__d">{s.d}</p>
                  <ul className="hv2-proc__tags">
                    {s.tags.map((t) => <li key={t}>{t}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 8. CLIENT PORTAL ══ */}
        <section className="hv2-portal" id="portal">
          <div className="wrap">
            <span className="v2-pill">Client Portal</span>
            <h2 className="v2-display hv2-portal__title">
              Your project, always
              <br />
              in the light.
            </h2>
            <p className="hv2-portal__intro">
              Every Foxmen project ships with a private client portal, real-time progress, files, milestones and a
              direct line to the team.
            </p>

            <div className="hv2-portal__inner">
              <div className="hv2-portal__steps">
                {PORTAL_STEPS.map((s) => (
                  <div className="hv2-portal__step" key={s.n}>
                    <span className="hv2-portal__n">{s.n}</span>
                    <h3 className="hv2-portal__h">{s.h}</h3>
                    <p className="hv2-portal__d">{s.d}</p>
                  </div>
                ))}
                <Link href="/portal" className="v2-btn" style={{ background: "var(--v2-ink)", color: "#fff", justifySelf: "start" }}>
                  Access client portal
                  <span className="v2-btn__chip"><Arrow /></span>
                </Link>
              </div>

              {/* Portal mock */}
              <div className="hv2-mock" aria-hidden="true">
                <div className="hv2-mock__bar">
                  <span className="hv2-mock__dots"><i /><i /><i /></span>
                  foxmen.studio/portal
                </div>
                <div className="hv2-mock__body">
                  <div className="hv2-mock__row">
                    <span className="hv2-mock__project">Nestaro · Real Estate OS</span>
                    <span className="hv2-mock__badge">In progress</span>
                  </div>

                  <div>
                    <div className="hv2-mock__row" style={{ marginBottom: 10 }}>
                      <span style={{ fontSize: 14, color: "rgba(255,255,255,.6)" }}>Sprint progress</span>
                      <span style={{ fontSize: 14 }}>26%</span>
                    </div>
                    <div className="hv2-mock__bar-prog"><i /></div>
                  </div>

                  <ul className="hv2-mock__tasks">
                    <li><span>Design System</span><span>Just done</span></li>
                    <li><span>Frontend Build</span><span>In progress</span></li>
                    <li><span>API Integration</span><span>Queued</span></li>
                    <li><span>QA &amp; Launch</span><span>Queued</span></li>
                  </ul>

                  <div className="hv2-mock__note">
                    <span className="hv2-mock__avatar">YF</span>
                    <span>
                      💬 Latest update — <strong>Welcome to your portal!</strong>
                      <br />
                      Your project starts tomorrow. · Yousuf · just now
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ 9. SUPPORT ══ */}
        <section className="hv2-card" id="support">
          <div className="hv2-card__pad">
            <div className="hv2-support__grid">
              <div>
                <span className="v2-pill v2-pill--light">Always-on support</span>
                <h2 className="v2-display v2-display--light hv2-support__title">
                  Help that&rsquo;s there when you need it.
                </h2>
                <p className="hv2-support__body">
                  Whether it&rsquo;s a quick question at midnight or a project kickoff call at noon, we&rsquo;re
                  covered. AI answers instantly, humans follow up when it matters.
                </p>

                <div className="hv2-support__modes">
                  {SUPPORT_MODES.map((m) => (
                    <div className="hv2-support__mode" key={m.h}>
                      <span className="hv2-support__kicker">{m.kicker}</span>
                      <span className="hv2-support__h">{m.h}</span>
                      <span className="hv2-support__d">{m.d}</span>
                      <span className="hv2-support__when">{m.when}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat mock */}
              <div className="hv2-chat" aria-hidden="true">
                <div className="hv2-chat__head">
                  <span className="hv2-chat__avatars">
                    <Image src="/redesign/chat-1.jpg" alt="" width={34} height={34} />
                    <Image src="/redesign/chat-2.jpg" alt="" width={34} height={34} />
                    <Image src="/redesign/chat-3.jpg" alt="" width={34} height={34} />
                    <Image src="/redesign/chat-4.jpg" alt="" width={34} height={34} />
                  </span>
                  <span>
                    <span className="hv2-chat__title">Got questions? Let us help.</span>
                    <br />
                    <span className="hv2-chat__sub">Typically replies under 15 mins.</span>
                  </span>
                </div>

                <div className="hv2-chat__stack">
                  {CHAT.map((m, i) => (
                    <div className={`hv2-chat__msg${m.me ? " hv2-chat__msg--me" : ""}`} key={i}>
                      {m.text}
                      <span className="hv2-chat__time">{m.time}</span>
                    </div>
                  ))}
                </div>

                <div className="hv2-chat__input">
                  Enter your Message...
                  <span className="hv2-chat__send"><Arrow size={16} /></span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ 10. ESTIMATOR ══ */}
        <section className="hv2-card hv2-est" id="estimate">
          <div className="hv2-card__pad">
            <div className="hv2-est__grid">
              <div>
                <span className="v2-pill v2-pill--light">✦ AI Project Estimator</span>
                <h2 className="v2-display v2-display--light hv2-est__title">
                  Get an instant price range
                  <br />
                  for your project
                </h2>
                <p className="hv2-est__body">
                  Answer 4 quick questions. Our AI generates a real estimate — no fluff, no forms.
                </p>
                <Link href="/contact" className="v2-btn v2-btn--ghost" style={{ marginTop: 40 }}>
                  Book a 20-minute call
                  <span className="v2-btn__chip"><Arrow /></span>
                </Link>
              </div>

              <div className="hv2-est__panel">
                <ProjectEstimator />
              </div>
            </div>
          </div>
        </section>

        {/* ══ 11. FAQ ══ */}
        <section className="hv2-faq" id="faq">
          <div className="wrap hv2-faq__inner">
            <div>
              <span className="v2-pill">FAQ</span>
              <h2 className="v2-display hv2-faq__title">
                Got a question?
                <br />
                We&rsquo;ve got answers.
              </h2>
              <p className="hv2-faq__intro">
                We dive deep into your goals, audience, and challenges to craft a strategy that drives clear
                direction and impact.
              </p>
            </div>

            <div className="hv2-faq__list">
              {FAQS.map((f, i) => (
                <div className="hv2-faq__item" data-open={openFaq === i} key={f.q}>
                  <button
                    className="hv2-faq__q"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                  >
                    {f.q}
                    <span className="hv2-faq__icon"><Plus /></span>
                  </button>
                  <div className="hv2-faq__a">
                    <div><p>{f.a}</p></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ══ 12. FOOTER ══ */}
      <footer className="hv2-foot">
        <div className="wrap">
          <div className="hv2-foot__top">
            <div>
              <h2 className="hv2-foot__brand">Foxmen Studio</h2>
              <p className="hv2-foot__blurb">
                This membership will help you plan and execute a variety of projects.
              </p>
              <Link href="/contact" className="v2-btn v2-btn--ghost">
                Contact us
                <span className="v2-btn__chip"><Arrow /></span>
              </Link>
            </div>

            <div className="hv2-foot__col">
              <h3>Services</h3>
              <ul>
                {FOOT_SERVICES.map((s) => (
                  <li key={s}><Link href="/services">{s}</Link></li>
                ))}
              </ul>
            </div>

            <div className="hv2-foot__col">
              <h3>Quick Link</h3>
              <ul>
                {FOOT_LINKS.map(([l, h]) => <li key={l}><Link href={h}>{l}</Link></li>)}
              </ul>
            </div>

            <div className="hv2-foot__col">
              <h3>Support</h3>
              <ul>
                {FOOT_SUPPORT.map(([l, h]) => <li key={l}><Link href={h}>{l}</Link></li>)}
              </ul>
            </div>

            <div className="hv2-foot__col">
              <h3>Contact</h3>
              <ul>
                <li><a href="mailto:hello@foxmen.studio">hello@foxmen.studio</a></li>
                <li><span>Subscribe Newsletter</span></li>
              </ul>
              <div className="hv2-foot__news">
                <NewsletterForm dark />
              </div>
            </div>
          </div>

          <div className="hv2-foot__bottom">
            <span>Copyright © {new Date().getFullYear()}. All Rights Reserved</span>
            <span>Foxmen Studio</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
