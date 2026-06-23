import type { Metadata } from "next";
import Link from "next/link";
import { sql } from "@/lib/db";
import WorkGrid from "./WorkGrid";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Case studies and selected work from Foxmen Studio — websites, mobile apps, AI products, ecommerce stores, and real estate platforms built for global clients.",
  keywords: [
    "web design portfolio", "agency case studies", "web development projects",
    "mobile app portfolio", "AI product portfolio", "ecommerce portfolio",
    "Foxmen Studio work", "digital product design",
  ],
  openGraph: {
    title: "Work — Foxmen Studio",
    description:
      "Selected projects and case studies — websites, apps, AI products, ecommerce, and real estate platforms.",
    url: "https://foxmen.studio/work",
    images: [{ url: "https://ik.imagekit.io/hkhhsyhak/foxmen-og-01.png", width: 1200, height: 630, alt: "Foxmen Studio Work" }],
  },
  twitter: {
    title: "Work — Foxmen Studio",
    description: "Selected projects and case studies from Foxmen Studio.",
    images: ["https://ik.imagekit.io/hkhhsyhak/foxmen-og-01.png"],
  },
  alternates: { canonical: "https://foxmen.studio/work" },
};

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h18M13 5l7 7-7 7" />
    </svg>
  );
}

type DbProject = {
  id: number; name: string; tagline: string; industry: string;
  year: string; scope: string; status: string;
  thumbnail: string; hero_image: string; color_cls: string;
  live_url: string; slug: string;
};

export default async function WorkPage() {
  let projects: DbProject[] = [];
  try {
    const rows = await sql`
      SELECT id, name, tagline, industry, year, scope, status,
             thumbnail, hero_image, color_cls, live_url, slug
      FROM projects
      WHERE status != 'archived'
      ORDER BY id DESC
    `;
    projects = rows as unknown as DbProject[];
  } catch {
    projects = [];
  }

  return (
    <>
      {/* ── HERO ── */}
      <section className="page-hero">
        <div className="wrap">
          <div className="crumbs fade in">
            <Link href="/">Home</Link><span className="sep">/</span><span>Work</span>
          </div>
          <h1 className="display">
            <span className="reveal in"><span className="reveal-inner">Selected</span></span>
            <span className="reveal in reveal-delay-1"><span className="reveal-inner it">work.</span></span>
          </h1>
          <p className="lede fade in d2">
            Products built end to end — from seed-stage MVPs to multi-vendor platforms shipping at scale.
          </p>
        </div>
      </section>

      {/* ── GRID + FILTERS (client component) ── */}
      <WorkGrid projects={projects} />

      {/* ── CTA ── */}
      <section id="contact" style={{ padding: "60px 0" }}>
        <div className="cta">
          <div className="wrap-tight">
            <div className="fade in"><span className="eyebrow">Let&apos;s build</span></div>
            <h2 className="fade in d1">Got a brief? <span className="it">Or just</span><br />a half-formed idea?</h2>
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
