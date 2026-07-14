"use client";
import Link from "next/link";
import { useCountUp, useInView, useParallax, useScrollProgress } from "@/hooks/useScrollFx";

type StoryProject = {
  id: number; name: string; tagline: string; industry: string;
  year: string; scope: string; thumbnail: string; hero_image: string; slug: string;
};

function toSlug(name: string): string {
  return name.toLowerCase().replace(/[—–]/g, "-").replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}
function shortName(name: string): string {
  return name.split(/\s+[—–]\s+/)[0].trim();
}

/* ────────────────────────────────────────────────────────────
   MANIFESTO — sticky pin, words lit one by one by scroll position
   ──────────────────────────────────────────────────────────── */

/** Every line sits at the full 112px section-head scale; the taper comes from line length alone. */
const MANIFESTO_LINES = [
  "We don't sell decks, we ship.",
  "Designed, engineered, launched",
  "by the same small team",
  "that answers you.",
];

/** Words ahead of the scroll head sit dim; a short ramp keeps the edge soft instead of binary. */
const RAMP = 4;

export function WorkManifesto() {
  const [ref, progress] = useScrollProgress<HTMLElement>("pin");

  const totalWords = MANIFESTO_LINES.reduce((n, l) => n + l.split(" ").length, 0);
  const head = progress * (totalWords + RAMP);

  let w = 0; // runs across lines, so the lighting reads as one continuous sentence

  return (
    <section className="wk-manifesto" ref={ref}>
      <div className="wk-manifesto-pin">
        <div className="wrap">
          <span className="eyebrow">How we work</span>
          <p className="wk-words">
            {MANIFESTO_LINES.map((line, li) => (
              <span key={li} className="wk-line">
                {line.split(" ").map((word, i) => {
                  const lit = Math.min(1, Math.max(0, (head - w++) / RAMP));
                  return (
                    <span key={i} className="wk-word" style={{ opacity: 0.14 + lit * 0.86 }}>
                      {word}{" "}
                    </span>
                  );
                })}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   REEL — pinned section; scrolling down drives the strip sideways
   ──────────────────────────────────────────────────────────── */

export function WorkReel({ projects }: { projects: StoryProject[] }) {
  const shots = projects.filter(p => p.thumbnail || p.hero_image);
  const [ref, progress] = useScrollProgress<HTMLElement>("pin");

  if (shots.length === 0) return null;

  // Tall enough that each card gets roughly a screen of scroll to travel through.
  const runway = 100 + shots.length * 55;

  return (
    <section className="wk-reel" ref={ref} style={{ height: `${runway}vh` }}>
      <div className="wk-reel-pin">
        <div className="wk-reel-head wrap">
          <h2>Recent <span className="it">shipments.</span></h2>
          <span className="wk-reel-count">
            Scroll <span className="wk-reel-arrow">→</span> {String(shots.length).padStart(2, "0")} projects
          </span>
        </div>

        {/* translate = p × (viewport − track); the calc stays in CSS so no width measuring is needed */}
        <div
          className="wk-reel-track"
          style={{ ["--p" as string]: progress }}
        >
          {shots.map((p, i) => (
            <Link
              key={p.id}
              href={`/work/${p.slug || toSlug(p.name)}`}
              className="wk-reel-card"
            >
              <span className="wk-reel-shot">
                <img
                  src={p.thumbnail || p.hero_image}
                  alt={p.name}
                  loading="lazy"
                  decoding="async"
                />
              </span>
              <span className="wk-reel-meta">
                <span className="wk-reel-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="wk-reel-name">{shortName(p.name)}</span>
                <span className="wk-reel-scope">{p.scope || p.industry}</span>
              </span>
            </Link>
          ))}
        </div>

        <div className="wk-reel-progress" aria-hidden="true">
          <span style={{ transform: `scaleX(${progress})` }} />
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   STATS — parallax band, numbers count up on entry
   ──────────────────────────────────────────────────────────── */

function Stat({ label, value, suffix, run, di }: {
  label: string; value: number; suffix?: string; run: boolean; di: number;
}) {
  const n = useCountUp(value, run, 1400 + di * 160);
  return (
    <div className="wk-stat">
      <dd>{String(n).padStart(2, "0")}{suffix}</dd>
      <dt>{label}</dt>
    </div>
  );
}

export function WorkStats({ projects }: { projects: StoryProject[] }) {
  const [ref, seen] = useInView<HTMLElement>(0.4);
  const glow = useParallax<HTMLDivElement>(0.12);

  const shipped    = projects.length;
  const industries = new Set(projects.map(p => p.industry).filter(Boolean)).size;
  const latest     = projects.map(p => p.year).filter(Boolean).sort().at(-1);

  if (shipped === 0) return null;

  return (
    <section className="wk-stats" ref={ref}>
      <div className="wk-stats-glow" ref={glow} aria-hidden="true" />
      <div className="wrap">
        <dl className="wk-stats-row">
          <Stat label="Products shipped" value={shipped}    run={seen} di={0} />
          <Stat label="Industries"       value={industries} run={seen} di={1} />
          {latest && (
            <div className="wk-stat">
              <dd>{latest}</dd>
              <dt>Most recent</dt>
            </div>
          )}
        </dl>
      </div>
    </section>
  );
}
