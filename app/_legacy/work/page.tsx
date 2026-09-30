import type { Metadata } from "next";
import Link from "next/link";
import { sql } from "@/lib/db";
import WorkGrid from "./WorkGrid";
import WorkHero from "./WorkHero";
import { WorkManifesto, WorkReel, WorkStats } from "./WorkStory";
import { constructMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export const metadata: Metadata = constructMetadata({
  title: "Work",
  description:
    "Case studies and selected work from Foxmen Studio: websites, mobile apps, AI products, ecommerce stores, and real estate platforms built for global clients.",
  url: "/work",
  keywords: [
    "web design portfolio", "agency case studies", "web development projects",
    "mobile app portfolio", "AI product portfolio", "ecommerce portfolio",
    "Foxmen Studio work", "digital product design",
  ],
});

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
      <WorkHero count={projects.length} />

      {/* ── SCROLL STORY: sticky manifesto → pinned horizontal reel → counters ── */}
      <WorkManifesto />
      <WorkReel projects={projects} />
      <WorkStats projects={projects} />

      {/* ── GRID + FILTERS (client component) ── */}
      <WorkGrid projects={projects} />

      {/* ── CTA ── */}
      <section id="contact" style={{ padding: "60px 0" }}>
        <div className="cta work-cta">
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
