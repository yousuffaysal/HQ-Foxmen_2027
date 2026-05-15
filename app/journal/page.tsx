"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import NewsletterForm from "@/components/NewsletterForm";

const cats = ["All", "Design", "Engineering", "AI", "Studio notes", "Case studies"];

const articles = [
  { thumb: "t1", tag: "Design",       read: "6 min",  sym: "B", title: <>Designing in the <span className="it">browser</span>, not in Figma.</>, desc: "Why our team retired the static mock six months ago — and what we replaced it with. The case for designing live, in code, against real data.", av: "SK", who: "Sara Köhler",  date: "Apr 28", delay: ""  },
  { thumb: "t2", tag: "AI",           read: "9 min",  sym: "⊕", title: <>The <span className="it">eval loop</span> that saved our copilot.</>,     desc: "A practical, boring system for catching regressions before users do. Fixtures, scorecards, gold sets, and the meeting we run every Friday.", av: "IS", who: "Imran Sheikh", date: "Apr 14", delay: "d1" },
  { thumb: "t3", tag: "Engineering",  read: "7 min",  sym: "↧", title: <>Sticky scroll, the <span className="it">right</span> way.</>,               desc: "The four CSS techniques we use to make stacks, panels, and reveals feel buttery — without scroll-jacking or scroll-jank.", av: "MV", who: "Marta Vidal",  date: "Mar 30", delay: "d2" },
  { thumb: "t4", tag: "Design",       read: "5 min",  sym: "◇", title: <>Tokens are a <span className="it">product</span>, not a deliverable.</>,    desc: "Five years of design systems taught us this: tokens need a roadmap, a release notes channel, and somebody whose job it is to ship them.", av: "AP", who: "Aiden Park",   date: "Mar 11", delay: ""  },
  { thumb: "t5", tag: "Studio notes", read: "14 min", sym: "N", title: <>How we shipped Nestaro <span className="it">in 14 weeks.</span></>,         desc: "A behind-the-scenes look at our biggest 2025 launch: the brief, the timeline, the moments that nearly broke us, the call that saved it.", av: "RM", who: "Rina Mehta",   date: "Feb 22", delay: "d1" },
  { thumb: "t6", tag: "Design",       read: "4 min",  sym: "i", title: <>A short defense of the <span className="it">italic</span> headline.</>,     desc: "One typographic choice — and the eight reasons it shows up in every Foxmen brief. Yes, including this one.", av: "LB", who: "Léa Bouchard", date: "Feb 04", delay: "d2" },
  { thumb: "t7", tag: "AI",           read: "11 min", sym: "R", title: <>Retrieval, <span className="it">but make it boring.</span></>,              desc: "RAG is mostly plumbing. Here's our hard-won checklist for a retrieval stack you can actually leave alone for a quarter.", av: "IS", who: "Imran Sheikh", date: "Jan 19", delay: ""  },
  { thumb: "t8", tag: "Engineering",  read: "8 min",  sym: "≡", title: <>The case for <span className="it">monorepos</span> in design agencies.</>,  desc: "Why our 38 active client codebases live in one repo, what it cost to get there, and the day it paid for itself ten times over.", av: "DT", who: "Daniel Tan",   date: "Jan 06", delay: "d1" },
  { thumb: "t9", tag: "Case studies", read: "10 min", sym: "A", title: <>Atlas: shipping an iOS travel app <span className="it">in 9 weeks.</span></>, desc: "From Figma to App Store, with AI-generated itineraries and offline maps. A complete project breakdown — scope, stack, sprint cadence.", av: "YO", who: "Yuki Ono",     date: "Dec 18", delay: "d2" },
];

export default function JournalPage() {
  useScrollReveal();
  const [activeCat, setActiveCat] = useState("All");

  const visible = activeCat === "All"
    ? articles
    : articles.filter((a) => a.tag === activeCat);

  return (
    <>
      <section className="page-hero">
        <div className="wrap page-hero-split">
          <div>
            <div className="crumbs fade in">
              <Link href="/">Home</Link><span className="sep">/</span><span>Journal</span>
            </div>
            <h1 className="display">
              <span className="reveal in"><span className="reveal-inner">Notes</span></span>
              <span className="reveal in reveal-delay-1"><span className="reveal-inner">from the</span></span>
              <span className="reveal in reveal-delay-2"><span className="reveal-inner it">studio.</span></span>
            </h1>
            <p className="lede fade in d2">
              Essays, deep-dives and case notes from the team — what we&apos;re learning about design systems, AI products, and the craft of shipping.
            </p>
          </div>
          <div className="page-hero-right" aria-hidden="true">
            <div className="ph-feed">
              {([
                { tag: "AI",          who: "Imran Sheikh", date: "Apr 14" },
                { tag: "Design",      who: "Sara Köhler",  date: "Apr 28" },
                { tag: "Engineering", who: "Marta Vidal",  date: "Mar 30" },
                { tag: "Case study",  who: "Rina Mehta",   date: "Feb 22" },
                { tag: "AI",          who: "Imran Sheikh", date: "Jan 19" },
              ] as { tag: string; who: string; date: string }[]).map((a, i) => (
                <div key={i} className="ph-feed-row" style={{ "--di": i } as React.CSSProperties}>
                  <span className="fi-tag">{a.tag}</span>
                  <div className="fi-meta"><span>{a.who}</span><span>{a.date}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section style={{ padding: "80px 0 0" }}>
        <div className="wrap">
          <div className="blog-featured">
            <div className="img fade">
              <div className="badge-row">
                <span className="pill">Featured · Essay</span>
                <span>12 min read</span>
              </div>
            </div>
            <div className="body">
              <div>
                <div className="fade"><span className="eyebrow">May 12, 2026 · Devon Arias</span></div>
                <h2 className="fade d1" style={{ marginTop: 18 }}>Why <span className="it">AI features</span> fail in production — and what to ship instead.</h2>
                <p className="excerpt fade d2">
                  After deploying retrieval pipelines for fourteen products in 2025, a pattern emerged: most AI features die not from bad models but from bad surfaces. Here&apos;s our playbook for shipping copilots users actually open — five principles, eight anti-patterns, and the eval loop that saved our biggest launch.
                </p>
              </div>
              <div className="author-row fade d3">
                <div className="av">DA</div>
                <div>
                  <div style={{ color: "var(--ink)", fontFamily: "var(--f-sans)", textTransform: "none", letterSpacing: 0, fontSize: 15 }}>Devon Arias</div>
                  <div style={{ marginTop: 4 }}>Head of AI · Foxmen Studio</div>
                </div>
              </div>
              <div className="actions fade d4">
                <a href="#" className="btn btn--lg">
                  <span className="label">Read the essay</span>
                  <span className="chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18M13 5l7 7-7 7" /></svg></span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className="section" style={{ paddingTop: 48 }}>
        <div className="wrap">
          <div className="blog-toolbar fade in">
            <div className="cats">
              {cats.map((c) => (
                <button key={c} className={activeCat === c ? "on" : ""} onClick={() => setActiveCat(c)}>{c}</button>
              ))}
            </div>
            <label className="search">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" /></svg>
              <input type="search" placeholder="Search the journal" />
            </label>
          </div>

          <div className="blog-grid">
            {visible.map((a, i) => (
              <article key={i} className={`card fade${a.delay ? ` ${a.delay}` : ""}`}>
                <div className={`thumb ${a.thumb}`}>
                  <div className="inner" />
                  <span className="tag">{a.tag}</span>
                  <span className="read">{a.read}</span>
                  <span className="badge-sym">{a.sym}</span>
                </div>
                <div className="body">
                  <h3>{a.title}</h3>
                  <p>{a.desc}</p>
                  <div className="foot">
                    <div className="av">{a.av}</div>
                    <span className="who">{a.who}</span>
                    <span className="date">{a.date}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "center", marginTop: 48 }}>
            <a href="#" className="btn btn--ghost btn--lg">
              <span className="label">Load more articles</span>
              <span className="chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18M13 5l7 7-7 7" /></svg></span>
            </a>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section style={{ padding: "80px 24px" }}>
        <div className="cta">
          <div className="wrap-tight">
            <div className="fade in"><span className="eyebrow">Monthly</span></div>
            <h2 className="fade in d1">One <span className="it">considered</span> essay,<br />once a month.</h2>
            <div style={{ marginTop: 40 }}>
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
