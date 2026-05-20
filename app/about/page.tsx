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
function DownIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
      <path d="M12 5v14M5 12l7 7 7-7" />
    </svg>
  );
}
function XIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2H21.5l-7.5 8.57L23 22h-6.844l-5.36-7.005L4.7 22H1.44l8.04-9.183L1 2h7.014l4.844 6.405L18.244 2Zm-1.2 18h1.84L7.04 4H5.07l11.974 16Z" /></svg>;
}
function LiIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6 0h3.84v1.71h.05c.54-1 1.87-2.08 3.84-2.08C20.6 8.63 22 11 22 14.18V21h-4v-6.06c0-1.45-.03-3.31-2.02-3.31-2.02 0-2.33 1.58-2.33 3.21V21H9V9Z" /></svg>;
}
function GhIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.94c.58.1.79-.25.79-.55v-2.1c-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.74-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.3-.51-1.47.11-3.07 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.18-1.5 3.14-1.18 3.14-1.18.63 1.6.24 2.77.12 3.07.74.81 1.18 1.84 1.18 3.1 0 4.43-2.7 5.4-5.26 5.69.41.35.78 1.05.78 2.12v3.14c0 .3.21.66.8.55A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z" /></svg>;
}

/* ── clocks ── */
function useTime(tz: string) {
  const [t, setT] = useState("—:—");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: tz });
    const update = () => setT(fmt.format(new Date()));
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, [tz]);
  return t;
}
function useIsWorking(tz: string) {
  const [live, setLive] = useState(false);
  useEffect(() => {
    const check = () => {
      const h = parseInt(new Intl.DateTimeFormat("en-US", { hour: "numeric", hour12: false, timeZone: tz }).format(new Date()), 10);
      setLive(h >= 9 && h < 18);
    };
    check();
    const id = setInterval(check, 30000);
    return () => clearInterval(id);
  }, [tz]);
  return live;
}

function TzRow({ city, tz, utc, isHq = false }: { city: string; tz: string; utc: string; isHq?: boolean }) {
  const time = useTime(tz);
  const live = useIsWorking(tz);
  return (
    <div className={`${s.tzRow} ${live ? s.tzRowLive : ""}`}>
      <span className={s.tzCity}>
        {city}
        {isHq && <span className={s.hqBadge}>HQ</span>}
      </span>
      <span className={s.tzUtc}>{utc}</span>
      <span className={s.tzTime}>{time}</span>
      <span className={s.tzDot} />
    </div>
  );
}

const currentlyItems = [
  { sym: <span className={s.lv} />,   text: "Shipping ", it: "three client projects" },
  { sym: "◆",                         text: "Quietly building ", it: "the Foxmen client portal" },
  { sym: "●",                         text: "On rotation ", it: "Brian Eno · Music for Films" },
  { sym: "✦",                         text: "Open for ", it: "two new projects (Q3 2026)" },
  { sym: "⌬",                         text: `Reading `, it: `"Designing Programmes" — KGB` },
  { sym: "◐",                         text: "Brewing ", it: "five free AI tools — soon" },
];

/* ═══════════════════════════════════════════════════════════════ */
export default function AboutPage() {
  useScrollReveal(".fade, .reveal");
  const dhkClock = useTime("Asia/Dhaka");

  return (
    <>

      {/* ═══════════ HERO ═══════════ */}
      <section className={s.aboutHero}>
        <div className="wrap">

          {/* Eyebrow strip */}
          <div className={`${s.heroEyerow} fade in`}>
            <span className="eyebrow">About the studio</span>
            <div className={s.heroStatus}>
              <span className={s.pulse} />
              <span>Open · Accepting new projects Q3 2026</span>
            </div>
          </div>

          {/* Main split */}
          <div className={s.heroSplit}>

            {/* Left — statement + sub + CTA */}
            <div className={s.heroLeft}>
              <h1 className={s.heroHead}>
                <span className="reveal in"><span className="reveal-inner">We build digital</span></span>
                <span className="reveal in reveal-delay-1"><span className="reveal-inner">products that ship —</span></span>
                <span className="reveal in reveal-delay-2"><span className="reveal-inner">without the <em className={s.heroIt}>overhead.</em></span></span>
              </h1>
              <p className={`${s.heroSub} fade in d3`}>
                A small senior studio from Dhaka, building websites, apps and AI-integrated products for ambitious teams in the US, UK and beyond. No account managers, no junior pool, no handoff gap — just two founders and a tight senior team, shipping real software on real deadlines.
              </p>
              <div className={`${s.heroActs} fade in d4`}>
                <Link href="/contact" className="btn btn--lg">
                  <span className="label">Start a project</span>
                  <span className="chip" aria-hidden="true"><ArrowIcon /></span>
                </Link>
                <a href="#founders" className="tlink">Meet the team ↓</a>
              </div>
            </div>

            {/* Right — minimal facts card */}
            <aside className={`${s.heroFacts} fade in d2`} aria-label="Studio at a glance">
              <div className={s.factTop}>
                <span className={s.factTri}>Code · Craft · Care</span>
                <span className={s.factTopSub}>The order we work in</span>
              </div>
              <dl className={s.factList}>
                <div className={s.factRow}>
                  <dt>Status</dt>
                  <dd><span className={s.ddDot} />Open · Q3 2026</dd>
                </div>
                <div className={s.factRow}>
                  <dt>Founded</dt>
                  <dd>2024 — Dhaka, Bangladesh</dd>
                </div>
                <div className={s.factRow}>
                  <dt>Team</dt>
                  <dd>5–10 senior contributors</dd>
                </div>
                <div className={s.factRow}>
                  <dt>Clients</dt>
                  <dd>17+ countries</dd>
                </div>
                <div className={s.factRow}>
                  <dt>Hours</dt>
                  <dd>9am–6pm GMT</dd>
                </div>
                <div className={s.factRow}>
                  <dt>Now</dt>
                  <dd><em className={s.clockEm}>{dhkClock} · DHK</em></dd>
                </div>
              </dl>
            </aside>

          </div>
        </div>

        {/* Currently ticker */}
        <div className={s.heroCurrently}>
          <span className={s.currentlyLabel}>Currently</span>
          <div className={s.currentlyTrack}>
            {[...currentlyItems, ...currentlyItems].map((item, i) => (
              <span key={i}>
                {typeof item.sym === "string" ? item.sym : item.sym}
                {" "}{item.text}<span className={s.cIt}>{item.it}</span>
              </span>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════ ORIGIN ═══════════ */}
      <section className="section" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div className="wrap">
          <div className={s.origin}>
            <div>
              <div className="fade"><span className="eyebrow">Our story</span></div>
              <h2 className="display fade d1" style={{ marginTop: 18, fontSize: "clamp(36px,5vw,72px)", lineHeight: .95 }}>
                Why <span className="it">Foxmen</span> exists.
              </h2>
            </div>
            {/* TODO(founder): rewrite in Yousuf's own voice */}
            <div className={`${s.originBody} fade d2`}>
              <p>
                Foxmen started in 2024 with a simple frustration: the gap between studios that ship beautiful work for <strong>$200k+</strong> and shops that ship average work for <strong>$5k</strong> is enormous — and almost nobody is building in the middle. Senior craft has quietly been <span className="it">commoditized.</span>
              </p>
              <p>
                We thought: what if a small, senior, remote team could deliver the work of the expensive studios at a price the middle market can actually pay? Not by cutting corners — by cutting the overhead. No agency layers, no account managers, no Figma-to-code handoff, no junior pool. Just two founders and a small senior team, shipping like a product team.
              </p>
              <p>
                We named it <span className="it">Foxmen</span> because foxes are small, fast, and disproportionately effective. <span className="it">Studio</span> because we work the way studios used to work — closely, carefully, with our names on the door. <strong>Code · Craft · Care</strong> is not a tagline; it&apos;s the order we work in.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════ HOW WE WORK ═══════════ */}
      <section className="section" style={{ paddingTop: 60, paddingBottom: 80, borderTop: "1px solid var(--line)" }}>
        <div className="wrap">
          <div className="svc-head">
            <div className="fade"><span className="eyebrow">How we work</span></div>
            <h2 className="display fade d1">Built for clients across <span className="it">time zones.</span></h2>
          </div>
          <div className={s.howGrid}>
            {[
              { num: "/ 01", title: <>Your morning brief. <span className="it">Our overnight ship.</span></>, body: "Async-first by design. Send a brief at end of day, wake up to progress, demos, or a working prototype. Time zones become an unfair advantage, not a coordination tax." },
              { num: "/ 02", title: <>Direct line to the <span className="it">makers.</span></>, body: "No account managers, no project managers in the middle. You talk to the senior people writing the code and shipping the pixels. Every call, every message.", delay: "d1" },
              { num: "/ 03", title: <>Overlapping hours: <span className="it">9am–6pm GMT.</span></>, body: "Full overlap with the UK working day. Morning overlap with US East Coast. Evening overlap with US West Coast. Real-time when it matters.", delay: "d2" },
              { num: "/ 04", title: <>Weekly demos. <span className="it">Daily written updates.</span></>, body: "Loom videos, Linear tickets, written end-of-day notes. Everything documented, everything reviewable. No surprises at the demo.", delay: "d3" },
            ].map((c, i) => (
              <div key={i} className={`${s.howCard} fade${c.delay ? ` ${c.delay}` : ""}`}>
                <div className={s.howNum}>{c.num}</div>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════ THE FOXMEN OS ═══════════ */}
      <section style={{ padding: "40px 0 80px" }}>
        <div className={s.osSection}>
          <div className={s.osWrap}>
            <div className={s.osHead}>
              <div className="fade"><span className="eyebrow">What makes us different</span></div>
              <h2 className="fade d1">
                Not just a studio. A studio with its own <span className="it">operating system.</span>
              </h2>
            </div>

            <div className={s.osIntro}>
              <p className="fade">
                Every agency promises modern technology. Most of them then communicate over scattered email chains, lose proposals in shared drives, send PDFs as attachments, and disappear into Slack channels no one reads. Foxmen is <span className="it">different</span> — because we built our own product to run the work.
              </p>
              <p className="fade d1">
                What you see on this website isn&apos;t a marketing site. It&apos;s a working piece of software — the same kind we build for clients, running on itself. Browse the tools. Open the portal. Talk to Fox. This is the studio, and it&apos;s <span className="it">also a demo</span> of what we do.
              </p>
            </div>

            <div className={s.osGrid}>
              {[
                { sym: "⌬", lbl: "Client portal",      href: "/portal",   title: <>A private dashboard for <span className="it">every client.</span></>, body: "Track projects, milestones, deliverables, offers and conversations in one place. No email chains, no missing files, no \"did you see my message?\" Just one URL, always up to date.", more: "See the portal", delay: "" },
                { sym: "◈", lbl: "Live chat — built in", href: "/contact",  title: <>Talk to the team. <span className="it">From inside your project.</span></>, body: "Real-time chat per project, powered by Pusher. No Slack invites, no Discord guilt, no Teams confusion — just talk to the people building your product, where the work lives.", more: "Start a conversation", delay: "d1" },
                { sym: "✦", lbl: "Branded · Automatic",  href: "/contact",  title: <>AI-generated <span className="it">proposals &amp; invoices.</span></>, body: "When we send you a proposal, it's not a Google Doc someone formatted at 11pm. It's a polished branded PDF — generated by our own system, tracked in your portal, exported on demand.", more: "See a sample proposal", delay: "d2" },
                { sym: "⊕", lbl: "Free · No signup",     href: "/tools",   title: <>Five AI-powered tools — <span className="it">before you even hire us.</span></>, body: "Website Speed Checker. Roast My Website. Price Calculator. Tech Stack Recommender. Agency Rate Comparator. Try them — they're our pitch, and they actually work.", more: "Open the tools", delay: "" },
                { sym: "◐", lbl: "Instant",              href: "/#contact", title: <>Real cost &amp; timeline <span className="it">in 30 seconds.</span></>, body: "Tell our estimator what you're building, your complexity, your timeline. Get a real cost range, delivery estimate, and scope outline — instantly. No \"let me get back to you with a quote.\"", more: "Try the estimator", delay: "d1" },
                { sym: "⟁", lbl: "24/7 · No bot tax",   href: "/",        title: <>Fox — our <span className="it">AI discovery assistant.</span></>, body: "A chat assistant that qualifies projects, answers questions about our services, and routes you to the right person. Not a chatbot tax — a useful one, trained on what we actually do.", more: "Try the chat in the corner", delay: "d2" },
              ].map((c, i) => (
                <Link key={i} href={c.href} className={`${s.osCard} fade${c.delay ? ` ${c.delay}` : ""}`}>
                  <div className={s.osCardTop}>
                    <div className={s.osSym}>{c.sym}</div>
                    <span className={s.osLbl}>{c.lbl}</span>
                  </div>
                  <h3>{c.title}</h3>
                  <p>{c.body}</p>
                  <span className={s.osMore}>{c.more}</span>
                </Link>
              ))}
            </div>

            <div className={s.osFoot}>
              <p className={`${s.osCloser} fade`}>
                If our website feels like a product, that&apos;s because it <span className="it">is.</span>
              </p>
              <div className={`${s.stackLine} fade d1`}>
                Built with the same stack we ship for clients
                <span className={s.stackDot}>·</span> Next.js 16
                <span className={s.stackDot}>·</span> React 19
                <span className={s.stackDot}>·</span> Postgres
                <span className={s.stackDot}>·</span> Pusher
                <span className={s.stackDot}>·</span> Groq AI
                <span className={s.stackDot}>·</span> TypeScript
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════ CODE · CRAFT · CARE ═══════════ */}
      <section className="section" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div className="wrap">
          <div className="svc-head">
            <div className="fade"><span className="eyebrow">Our principles</span></div>
            <h2 className="display fade d1">Three words we <span className="it">work by.</span></h2>
          </div>
          <div className="svc-list">
            <a className="svc-row" href="#">
              <span className="idx">/ 01</span>
              <span className="title"><em style={{ fontStyle: "italic", color: "var(--brand)" }}>Code</em></span>
              <span className="desc">We ship real software. Working code beats polished decks every time, and we&apos;d rather show you a prototype on day five than a slide on day fifteen.</span>
              <span className="tags">Production · Real · Working</span>
              <span className="arrow"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M3 12h18M13 5l7 7-7 7"/></svg></span>
              <span className="preview" style={{ fontFamily: "var(--f-mono)", fontSize: 54, fontStyle: "normal" }}>&lt;/&gt;</span>
            </a>
            <a className="svc-row" href="#">
              <span className="idx">/ 02</span>
              <span className="title"><em style={{ fontStyle: "italic", color: "var(--brand)" }}>Craft</em></span>
              <span className="desc">Design and engineering are one job, not two. The same people doing the Figma are doing the React. No handoff gap, no telephone-game, no lost intent.</span>
              <span className="tags">Design · Code · One Team</span>
              <span className="arrow"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M3 12h18M13 5l7 7-7 7"/></svg></span>
              <span className="preview">✱</span>
            </a>
            <a className="svc-row" href="#">
              <span className="idx">/ 03</span>
              <span className="title"><em style={{ fontStyle: "italic", color: "var(--brand)" }}>Care</em></span>
              <span className="desc">Launch is the start of the work, not the end. We retain a small pod after launch to ship the next 90 days, tune for growth, and stand behind what we built.</span>
              <span className="tags">Post-launch · SLA · Growth</span>
              <span className="arrow"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M3 12h18M13 5l7 7-7 7"/></svg></span>
              <span className="preview">♥</span>
            </a>
          </div>
        </div>
      </section>


      {/* ═══════════ WHO WE WORK WITH ═══════════ */}
      <section className="section" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <div className="wrap">
          <div className="svc-head" style={{ marginBottom: 32 }}>
            <div className="fade"><span className="eyebrow">Who we work with</span></div>
            <h2 className="display fade d1">Built for ambitious teams in the US, UK, <span className="it">and beyond.</span></h2>
          </div>
          <div className={s.whoBlock}>
            <div />
            <div>
              <p className="fade">
                We work best with <strong>early-stage founders</strong> shipping their first product, <strong>product teams</strong> at growth-stage startups who need to move faster than their in-house roadmap allows, <strong>agencies</strong> that need a senior engineering partner without the overhead, and <strong>brands</strong> looking to embed AI into a product that already works.
              </p>
              <div className={`${s.regionRow} fade d1`}>
                {["US", "UK", "EU", "Worldwide", "Remote-first"].map((r) => (
                  <span key={r} className={s.pill}>{r}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════ FOUNDERS ═══════════ */}
      <section className="section" id="founders" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <div className="wrap">
          <div className="svc-head">
            <div className="fade"><span className="eyebrow">The team</span></div>
            <h2 className="display fade d1">Two founders. <span className="it">One studio.</span></h2>
          </div>
          <div className={s.founders}>
            {[
              {
                initials: "YF",
                name: "Yousuf H. Faysal",
                role: "Founder & CEO",
                bio: "Yousuf founded Foxmen in 2024 after years of building digital products for international teams. He leads strategy, design direction, and client partnerships. He believes the best agencies feel like product teams, and the best product teams feel like small studios — and Foxmen is built at that intersection.",
                delay: "",
              },
              {
                initials: "RA",
                name: "Rayhan Ahmed",
                role: "Co-founder & Head of Engineering",
                bio: "Rayhan leads engineering, architecture, and the technical craft Foxmen is built on. He's the one quietly enforcing the rule that the senior person ships the code. He believes performance is a design choice, AI is a layer rather than a feature, and a working prototype beats a meeting.",
                delay: "d1",
              },
            ].map((f) => (
              <article key={f.name} className={`${s.founderCard} fade${f.delay ? ` ${f.delay}` : ""}`}>
                <div className={s.founderHead}>
                  <div className={s.founderAvatar}>
                    {f.initials}
                    <span className={s.photoSoon}>Photo coming soon</span>
                  </div>
                  <div className={s.founderWho}>
                    <h3>{f.name}</h3>
                    <div className={s.founderRole}>{f.role}</div>
                  </div>
                </div>
                {/* TODO(founder): rewrite bio in your own voice */}
                <p className={s.founderBio}>{f.bio}</p>
                <div className={s.founderSocials}>
                  <a href="#" aria-label={`${f.name} on Twitter / X`}><XIcon /></a>
                  <a href="#" aria-label={`${f.name} on LinkedIn`}><LiIcon /></a>
                  <a href="#" aria-label={`${f.name} on GitHub`}><GhIcon /></a>
                </div>
              </article>
            ))}
          </div>
          <p className={`${s.foundersFoot} fade d2`}>A small senior team works alongside the founders on every project.</p>
        </div>
      </section>


      {/* ═══════════ GLOBALLY DISTRIBUTED ═══════════ */}
      <section className="section" style={{ paddingTop: 40, paddingBottom: 80, borderTop: "1px solid var(--line)" }}>
        <div className="wrap">
          <div className={s.geo}>
            <div className={s.geoLeft}>
              <h3 className="fade">Globally <span className="it">distributed.</span></h3>
              <p className="fade d1">
                Foxmen is a remote-first studio. The founders work from Dhaka, Bangladesh. Our clients are in New York, London, Berlin, Amsterdam, Toronto, Dubai — and growing.
              </p>
            </div>
            <div className="fade d2">
              <div className={s.tzBoard}>
                <TzRow city="Dhaka"    tz="Asia/Dhaka"        utc="GMT+6" isHq />
                <TzRow city="London"   tz="Europe/London"     utc="GMT"        />
                <TzRow city="New York" tz="America/New_York"  utc="GMT−5"      />
                <TzRow city="Berlin"   tz="Europe/Berlin"     utc="GMT+1"      />
              </div>
            </div>
          </div>
          <div className={`${s.geoHonesty} fade d3`}>
            No fake offices. No virtual HQs. <span className="it">Just the truth — and a great Wi-Fi connection.</span>
          </div>
        </div>
      </section>


      {/* ═══════════ OPINIONS ═══════════ */}
      <section className="section" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <div className="wrap">
          <div className="svc-head">
            <div className="fade"><span className="eyebrow">Opinions</span></div>
            <h2 className="display fade d1">Things we believe — <span className="it">strongly.</span></h2>
          </div>
          <div className={s.opinions} style={{ marginTop: 40 }}>
            {[
              { num: "/ 01", h: <>AI is a <span className="it">layer</span>, not a feature.</>, p: "It should sit underneath your product, doing the heavy lifting invisibly — not bolted onto the homepage as a chatbot.", delay: "" },
              { num: "/ 02", h: <>Static mockups <span className="it">waste a week.</span></>, p: "We design in the browser, against real data, in code from day three. What you see is what ships.", delay: "d1" },
              { num: "/ 03", h: <>Performance is a <span className="it">design decision.</span></>, p: "Speed isn't something the engineer fixes at the end. It's something the designer decides at the start.", delay: "d2" },
              { num: "/ 04", h: <>The senior person <span className="it">writes the code.</span></>, p: "Not a junior on a margin. Not an outsourced shop you've never met. The same person who pitched you is the person shipping it.", delay: "" },
              { num: "/ 05", h: <>Launch is the <span className="it">start</span>, not the finish.</>, p: "The first 90 days after launch decide whether a product works. That's when we stay, not when we leave.", delay: "d1" },
              { num: "/ 06", h: <>Small is <span className="it">the product.</span></>, p: "Five to ten people is not a phase we'll grow out of. It's the answer. Most great work comes from teams this size.", delay: "d2" },
            ].map((op, i) => (
              <div key={i} className={`${s.opinionCard} fade${op.delay ? ` ${op.delay}` : ""}`}>
                <div className={s.opNum}>{op.num}</div>
                <h3>{op.h}</h3>
                <p>{op.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════ CTA ═══════════ */}
      <section style={{ padding: "40px 0 80px" }}>
        <div className="cta">
          <div className="wrap-tight">
            <div className="fade"><span className="eyebrow">Let&apos;s build</span></div>
            <h2 className="fade d1">
              Working on something ambitious? Let&apos;s <span className="it">talk.</span>
            </h2>
            <p className="fade d2" style={{ color: "#bdbdbd", fontSize: 16, margin: "8px auto 0", maxWidth: "46ch" }}>
              We reply within 24 hours, Monday to Friday.
            </p>
            <div className={`${s.ctaEmails} fade d2`}>
              <a href="mailto:contact@foxmenstudio.com">
                contact@foxmenstudio.com
                <span className={s.emailLbl}>New projects · General</span>
              </a>
              <a href="mailto:team@foxmenstudio.com">
                team@foxmenstudio.com
                <span className={s.emailLbl}>Existing clients · Collab · Hiring</span>
              </a>
            </div>
            <div className="row fade d3">
              <Link href="/contact" className="btn btn--lg">
                <span className="label">Start a project</span>
                <span className="chip"><ArrowIcon /></span>
              </Link>
              <Link href="/work" className="btn btn--ghost btn--lg">
                <span className="label">See our work</span>
                <span className="chip"><ArrowIcon /></span>
              </Link>
            </div>
            <div className="ic fade d4">Open · Accepting new projects · Mon–Fri 9am–6pm GMT</div>
          </div>
        </div>
      </section>

    </>
  );
}
