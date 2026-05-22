"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import s from "./about.module.css";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
      <path d="M3 12h18M13 5l7 7-7 7" />
    </svg>
  );
}
function XIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2H21.5l-7.5 8.57L23 22h-6.844l-5.36-7.005L4.7 22H1.44l8.04-9.183L1 2h7.014l4.844 6.405L18.244 2Zm-1.2 18h1.84L7.04 4H5.07l11.974 16Z" /></svg>;
}
function LiIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6 0h3.84v1.71h.05c.54-1 1.87-2.08 3.84-2.08C20.6 8.63 22 11 22 14.18V21h-4v-6.06c0-1.45-.03-3.31-2.02-3.31-2.02 0-2.33 1.58-2.33 3.21V21H9V9Z" /></svg>;
}

export default function AboutPage() {
  useScrollReveal(".fade, .reveal");

  return (
    <>
      <style>{`
        .ab-hero { padding: 140px 0 80px; border-bottom: 1px solid var(--line); }
        .ab-eyebrow { display: flex; align-items: center; gap: 12px; margin-bottom: 32px; }
        .ab-eyebrow .pulse { width: 8px; height: 8px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 0 0 rgba(34,197,94,.4); animation: pulse 2s infinite; flex-shrink: 0; }
        @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,.4)} 70%{box-shadow:0 0 0 8px rgba(34,197,94,0)} }
        .ab-title { font-family: var(--f-display); font-size: clamp(40px, 6vw, 80px); line-height: .95; letter-spacing: -.03em; margin: 0 0 28px; max-width: 14ch; }
        .ab-title em { font-style: italic; color: var(--brand); }
        .ab-sub { font-size: 17px; line-height: 1.6; color: var(--muted); max-width: 52ch; margin: 0 0 40px; }
        .ab-acts { display: flex; gap: 12px; flex-wrap: wrap; }

        .ab-stats { display: grid; grid-template-columns: repeat(4,1fr); border-bottom: 1px solid var(--line); }
        .ab-stat { padding: 48px 32px; border-right: 1px solid var(--line); }
        .ab-stat:last-child { border-right: none; }
        .ab-stat-n { font-family: var(--f-display); font-size: clamp(32px,4vw,52px); letter-spacing: -.03em; line-height: 1; }
        .ab-stat-l { font-family: var(--f-mono); font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: var(--muted); margin-top: 8px; }
        @media(max-width:760px){ .ab-stats{grid-template-columns:1fr 1fr;} .ab-stat{border-right:none;border-bottom:1px solid var(--line);} .ab-stat:nth-child(odd){border-right:1px solid var(--line);} .ab-stat:last-child{border-bottom:none;} }
        @media(max-width:480px){ .ab-stats{grid-template-columns:1fr;} .ab-stat{border-right:none!important;} }

        .ab-story { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; padding: 80px 0; border-bottom: 1px solid var(--line); align-items: start; }
        .ab-story-h { font-family: var(--f-display); font-size: clamp(28px,3.5vw,48px); letter-spacing: -.03em; line-height: 1.05; margin: 0; }
        .ab-story-h em { font-style: italic; color: var(--brand); }
        .ab-story-body p { font-size: 16px; line-height: 1.75; color: var(--muted); margin: 0 0 18px; }
        .ab-story-body p:last-child { margin: 0; }
        @media(max-width:760px){ .ab-story{grid-template-columns:1fr;gap:32px;} }

        .ab-team { padding: 80px 0; border-bottom: 1px solid var(--line); }
        .ab-team-h { font-family: var(--f-display); font-size: clamp(28px,3.5vw,48px); letter-spacing: -.03em; line-height: 1.05; margin: 0 0 48px; }
        .ab-team-h em { font-style: italic; color: var(--brand); }
        .ab-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .ab-card { background: var(--surface); border: 1px solid var(--line); border-radius: 16px; padding: 32px; }
        .ab-card-head { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
        .ab-avatar { width: 52px; height: 52px; border-radius: 12px; background: var(--brand); display: flex; align-items: center; justify-content: center; font-family: var(--f-display); font-size: 18px; color: #fff; flex-shrink: 0; letter-spacing: .05em; }
        .ab-card-name { font-family: var(--f-display); font-size: 18px; letter-spacing: -.02em; margin: 0 0 2px; }
        .ab-card-role { font-family: var(--f-mono); font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
        .ab-card-bio { font-size: 15px; line-height: 1.7; color: var(--muted); margin: 0 0 20px; }
        .ab-socials { display: flex; gap: 12px; }
        .ab-socials a { color: var(--muted); transition: color .2s; }
        .ab-socials a:hover { color: var(--ink); }
        @media(max-width:680px){ .ab-cards{grid-template-columns:1fr;} }

        .ab-cta { padding: 80px 0; text-align: center; }
        .ab-cta-h { font-family: var(--f-display); font-size: clamp(28px,4vw,56px); letter-spacing: -.03em; line-height: 1; margin: 0 0 16px; }
        .ab-cta-h em { font-style: italic; color: var(--brand); }
        .ab-cta-sub { font-size: 16px; color: var(--muted); margin: 0 0 32px; }
        .ab-cta-acts { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
      `}</style>

      {/* HERO */}
      <section className="ab-hero">
        <div className="wrap">
          <div className="ab-eyebrow fade in">
            <span className="eyebrow">About Foxmen Studio</span>
            <span className="pulse" />
            <span style={{ fontSize: 13, color: "var(--muted)" }}>Open · Accepting new projects</span>
          </div>
          <h1 className="ab-title">
            <span className="reveal in"><span className="reveal-inner">We design, build,</span></span>{" "}
            <span className="reveal in reveal-delay-1"><span className="reveal-inner">and ship digital</span></span>{" "}
            <span className="reveal in reveal-delay-2"><span className="reveal-inner">products that <em>last.</em></span></span>
          </h1>
          <p className="ab-sub fade in d2">
            Foxmen Studio is a global digital product agency partnering with founders and growth-stage companies to build websites, apps, and AI-integrated products — from brief to launch and beyond.
          </p>
          <div className="ab-acts fade in d3">
            <Link href="/contact" className="btn btn--lg">
              <span className="label">Start a project</span>
              <span className="chip" aria-hidden="true"><ArrowIcon /></span>
            </Link>
            <Link href="/work" className="btn btn--ghost btn--lg">
              <span className="label">See our work</span>
              <span className="chip" aria-hidden="true"><ArrowIcon /></span>
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="ab-stats">
        {[
          { n: "105+",  l: "Brands scaled" },
          { n: "17+",   l: "Countries served" },
          { n: "< 14w", l: "Avg. time to launch" },
          { n: "4.9★",  l: "Client satisfaction" },
        ].map((s, i) => (
          <div key={i} className={`ab-stat fade d${i}`}>
            <div className="ab-stat-n">{s.n}</div>
            <div className="ab-stat-l">{s.l}</div>
          </div>
        ))}
      </div>

      {/* STORY */}
      <section>
        <div className="wrap">
          <div className="ab-story">
            <div>
              <span className="eyebrow fade">Our story</span>
              <h2 className="ab-story-h fade d1" style={{ marginTop: 16 }}>
                Why <em>Foxmen</em><br />exists.
              </h2>
            </div>
            <div className="ab-story-body fade d2">
              <p>
                Foxmen was founded on a conviction: exceptional digital work should not require a Fortune 500 budget. Not because quality is cheap — but because most of the cost at traditional agencies is structure, not skill. Layers of management, lengthy handoffs, and account teams whose job is to translate between the client and the people actually building.
              </p>
              <p>
                We removed all of it. The senior practitioners who run the discovery call are the same people writing the code and crafting the interface. The founder who pitched the project is accountable for what ships. No translation layer. No lost intent.
              </p>
              <p>
                <strong style={{ color: "var(--ink)" }}>Code · Craft · Care</strong> — the sequence we operate in, every project, every time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section>
        <div className="wrap">
          <div className="ab-team">
            <span className="eyebrow fade">Leadership</span>
            <h2 className="ab-team-h fade d1" style={{ marginTop: 16 }}>
              The people <em>accountable</em><br />for the work.
            </h2>
            <div className="ab-cards">
              {[
                {
                  initials: "YF",
                  name: "Yousuf H. Faysal",
                  role: "Founder & CEO",
                  bio: "Yousuf leads strategy, client partnerships, and design direction. He has shipped digital products for brands across the US, UK, Middle East, and Southeast Asia — and believes the best agencies are indistinguishable from great product teams.",
                  delay: "",
                },
                {
                  initials: "RA",
                  name: "Rayhan Ahmed",
                  role: "Co-founder · Head of Engineering",
                  bio: "Rayhan leads engineering and system architecture. He enforces one rule across every project: the senior engineer writes the production code. Performance is an architectural choice made before the first component is written.",
                  delay: "d1",
                },
              ].map((f) => (
                <article key={f.name} className={`ab-card fade${f.delay ? ` ${f.delay}` : ""}`}>
                  <div className="ab-card-head">
                    <div className="ab-avatar">{f.initials}</div>
                    <div>
                      <div className="ab-card-name">{f.name}</div>
                      <div className="ab-card-role">{f.role}</div>
                    </div>
                  </div>
                  <p className="ab-card-bio">{f.bio}</p>
                  <div className="ab-socials">
                    <a href="#" aria-label={`${f.name} on X`}><XIcon /></a>
                    <a href="#" aria-label={`${f.name} on LinkedIn`}><LiIcon /></a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ borderTop: "1px solid var(--line)" }}>
        <div className="wrap">
          <div className="ab-cta">
            <span className="eyebrow fade" style={{ display: "block", marginBottom: 20 }}>Let&apos;s build</span>
            <h2 className="ab-cta-h fade d1">
              Working on something<br /><em>that matters?</em>
            </h2>
            <p className="ab-cta-sub fade d2">
              We reply within 24 hours, Monday to Friday. A real person from the studio — no automated responses.
            </p>
            <div className="ab-cta-acts fade d3">
              <Link href="/contact" className="btn btn--lg">
                <span className="label">Start a project</span>
                <span className="chip"><ArrowIcon /></span>
              </Link>
              <Link href="/work" className="btn btn--ghost btn--lg">
                <span className="label">See our work</span>
                <span className="chip"><ArrowIcon /></span>
              </Link>
            </div>
            <div className="ic fade d4" style={{ marginTop: 24 }}>Open · Accepting new projects · Mon–Fri · 9am–6pm GMT</div>
          </div>
        </div>
      </section>
    </>
  );
}
