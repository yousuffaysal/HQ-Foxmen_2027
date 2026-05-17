"use client";
import Link from "next/link";
import { useScrollReveal } from "@/hooks/useScrollReveal";

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h18M13 5l7 7-7 7" />
    </svg>
  );
}

const tools = [
  {
    href: "/tools/website-speed-checker",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    name: "Website Speed Checker",
    tagline: "Real Core Web Vitals via Google PageSpeed — LCP, FCP, CLS & TBT in seconds.",
  },
  {
    href: "/tools/roast-my-website",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
        <path d="M8 15s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2.8" />
        <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="2.8" />
      </svg>
    ),
    name: "Roast My Website",
    tagline: "Brutally honest AI feedback on your design, UX, conversion rate, and SEO.",
  },
  {
    href: "/tools/price-calculator",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="18" rx="2" />
        <line x1="8" y1="12" x2="16" y2="12" />
        <line x1="8" y1="8" x2="16" y2="8" />
        <line x1="8" y1="16" x2="12" y2="16" />
      </svg>
    ),
    name: "Price Calculator",
    tagline: "Get a realistic budget estimate for your project — and compare boutique vs agency rates.",
  },
  {
    href: "/tools/tech-stack-recommender",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4.03 3-9 3S3 13.66 3 12" />
        <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
    name: "Tech Stack Recommender",
    tagline: "AI picks the right frontend, backend, database, and infra for your exact requirements.",
  },
  {
    href: "/tools/agency-rate-comparator",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    name: "Agency Rate Comparator",
    tagline: "See what London, NYC, UAE, and Foxmen Studio actually charge — side by side.",
  },
];

export default function ToolsPage() {
  useScrollReveal();

  return (
    <>
      {/* HERO */}
      <section className="page-hero">
        <div className="wrap">
          <div className="crumbs fade in">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <span>Free Tools</span>
          </div>
          <h1>
            <span className="reveal in"><span className="reveal-inner">Free tools,</span></span>
            <span className="reveal in reveal-delay-1"><span className="reveal-inner">real <span className="it">insights.</span></span></span>
          </h1>
          <p className="lede fade in d2">
            No fluff, no paywalls. Five tools built by Foxmen Studio to help you make smarter decisions about your next digital project.
          </p>
        </div>
      </section>

      {/* TOOLS GRID */}
      <section className="section" style={{ paddingTop: 80 }}>
        <div className="wrap">
          <div className="fade in">
            <span className="eyebrow">05 tools · Always free</span>
          </div>
          <div className="tools-grid" style={{ marginTop: 48 }}>
            {tools.map((tool, i) => (
              <article
                key={tool.href}
                className={`tool-card fade${i > 0 ? ` d${Math.min(i, 5)}` : ""}`}
              >
                <div className="tool-card-icon">{tool.icon}</div>
                <h3 className="tool-card-name">{tool.name}</h3>
                <p className="tool-card-tagline">{tool.tagline}</p>
                <div className="tool-card-cta">
                  <Link href={tool.href} className="btn btn--sm btn--ghost">
                    <span className="label">Try free</span>
                    <span className="chip"><ArrowIcon /></span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
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
                <span className="chip"><ArrowIcon /></span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
