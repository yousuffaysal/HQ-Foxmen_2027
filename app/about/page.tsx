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

function IgIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>;
}
function GhIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.94c.58.1.79-.25.79-.55v-2.1c-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.74-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.3-.51-1.47.11-3.07 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.18-1.5 3.14-1.18 3.14-1.18.63 1.6.24 2.77.12 3.07.74.81 1.18 1.84 1.18 3.1 0 4.43-2.7 5.4-5.26 5.69.41.35.78 1.05.78 2.12v3.14c0 .3.21.66.8.55A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z"/></svg>;
}
function XIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2H21.5l-7.5 8.57L23 22h-6.844l-5.36-7.005L4.7 22H1.44l8.04-9.183L1 2h7.014l4.844 6.405L18.244 2Zm-1.2 18h1.84L7.04 4H5.07l11.974 16Z"/></svg>;
}
function LiIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6 0h3.84v1.71h.05c.54-1 1.87-2.08 3.84-2.08C20.6 8.63 22 11 22 14.18V21h-4v-6.06c0-1.45-.03-3.31-2.02-3.31-2.02 0-2.33 1.58-2.33 3.21V21H9V9Z"/></svg>;
}

function useIsOpen() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const check = () => {
      const tz = "Asia/Dhaka";
      const h = parseInt(new Intl.DateTimeFormat("en-US", { hour: "numeric", hour12: false, timeZone: tz }).format(new Date()), 10);
      const d = new Date().toLocaleString("en-US", { weekday: "short", timeZone: tz });
      setOpen(h >= 9 && h < 18 && !["Sat", "Sun"].includes(d));
    };
    check();
    const id = setInterval(check, 60000);
    return () => clearInterval(id);
  }, []);
  return open;
}

const FOUNDERS = [
  {
    initials: "YF",
    name: "Yousuf H. Faysal",
    role: "Founder & CEO",
    tagline: "Strategy, design and client partnerships — from brief to launch.",
    gradient: "linear-gradient(160deg,#c4b5fd 0%,#a78bfa 40%,#7c3aed 100%)",
    image: "https://ik.imagekit.io/2lax2ytm2/Gemini_Generated_Image_ug8ze2ug8ze2ug8z%20(1).jpeg",
    socials: {
      twitter: "https://x.com/FoxmenStudio",
      linkedin: "https://www.linkedin.com/company/foxmen-studio/",
      instagram: "https://www.instagram.com/foxmen_studio/",
      dribbble: "https://dribbble.com/foxmen-studio",
    },
    projects: 62,
    brands: 105,
    delay: "",
  },
  {
    initials: "RA",
    name: "Rayhan Ahmed",
    role: "Co-founder",
    tagline: "Senior engineer writes the production code. Every time, every project.",
    gradient: "linear-gradient(160deg,#a5b4fc 0%,#818cf8 40%,#4f46e5 100%)",
    image: "https://ik.imagekit.io/2lax2ytm2/Gemini_Generated_Image_pz9ph8pz9ph8pz9p.jpeg",
    socials: {
      twitter: "https://x.com/FoxmenStudio",
      linkedin: "https://www.linkedin.com/company/foxmen-studio/",
      instagram: "https://www.instagram.com/foxmen_studio/",
      dribbble: "https://dribbble.com/foxmen-studio",
    },
    projects: 50,
    brands: 80,
    delay: "d1",
  },
];

export default function AboutPage() {
  useScrollReveal(".fade, .reveal");
  const isOpen = useIsOpen();

  return (
    <>
      <style>{`
        /* ── text reveal ── */
        .ab-r  { display:block; overflow:hidden; }
        .ab-ri { display:block; transform:translateY(110%); transition:transform .9s cubic-bezier(.16,1,.3,1); }
        .reveal.in .ab-ri           { transform:translateY(0); }
        .reveal.in.ab-d1 .ab-ri    { transform:translateY(0); transition-delay:.14s; }
        .reveal.in.ab-d2 .ab-ri    { transform:translateY(0); transition-delay:.28s; }

        /* ── fade up ── */
        .fade        { opacity:0; transform:translateY(22px); transition:opacity .75s ease,transform .75s ease; }
        .fade.in     { opacity:1; transform:translateY(0); }
        .fade.in.d1  { transition-delay:.12s; }
        .fade.in.d2  { transition-delay:.22s; }
        .fade.in.d3  { transition-delay:.34s; }
        .fade.in.d4  { transition-delay:.46s; }

        /* ── hero ── */
        .ab-hero { padding:140px 0 100px; border-bottom:1px solid var(--line); }
        .ab-badge { display:inline-flex; align-items:center; gap:10px; margin-bottom:44px; padding:7px 16px 7px 12px; border:1px solid var(--line); border-radius:99px; font-family:var(--f-mono); font-size:12px; letter-spacing:.08em; text-transform:uppercase; color:var(--muted); }
        .ab-dot { width:7px; height:7px; border-radius:50%; background:#22c55e; animation:abpulse 2s infinite; flex-shrink:0; }
        .ab-dot.off { background:#ef4444; animation:none; }
        @keyframes abpulse { 0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,.4)} 70%{box-shadow:0 0 0 8px rgba(34,197,94,0)} }

        .ab-h1  { font-family:var(--f-display); font-size:clamp(64px,9.5vw,118px); line-height:.9; letter-spacing:-.045em; margin:0 0 36px; }
        .ab-h1 em { font-style:italic; color:var(--brand); }
        .ab-sub { font-size:20px; line-height:1.65; color:var(--muted); max-width:50ch; margin:0 0 44px; }
        .ab-acts { display:flex; gap:14px; flex-wrap:wrap; }

        /* ── stats ── */
        .ab-stats { display:grid; grid-template-columns:repeat(4,1fr); border-bottom:1px solid var(--line); }
        .ab-stat  { padding:56px 36px; border-right:1px solid var(--line); }
        .ab-stat:last-child { border-right:none; }
        .ab-stat-n { font-family:var(--f-display); font-size:clamp(44px,5.5vw,72px); letter-spacing:-.045em; line-height:1; }
        .ab-stat-l { font-family:var(--f-mono); font-size:11px; letter-spacing:.16em; text-transform:uppercase; color:var(--muted); margin-top:10px; }
        @media(max-width:760px){ .ab-stats{grid-template-columns:1fr 1fr;} .ab-stat{border-right:none;border-bottom:1px solid var(--line);} .ab-stat:nth-child(odd){border-right:1px solid var(--line);} .ab-stat:nth-child(3),.ab-stat:nth-child(4){border-bottom:none;} }
        @media(max-width:480px){ .ab-stats{grid-template-columns:1fr;} .ab-stat{border-right:none!important;border-bottom:1px solid var(--line)!important;} .ab-stat:last-child{border-bottom:none!important;} }

        /* ── story ── */
        .ab-story { display:grid; grid-template-columns:380px 1fr; gap:80px; padding:100px 0; border-bottom:1px solid var(--line); align-items:start; }
        .ab-ey { font-family:var(--f-mono); font-size:11px; letter-spacing:.16em; text-transform:uppercase; color:var(--muted); display:block; margin-bottom:20px; }
        .ab-h2  { font-family:var(--f-display); font-size:clamp(44px,5.5vw,72px); letter-spacing:-.045em; line-height:.92; margin:0; }
        .ab-h2 em { font-style:italic; color:var(--brand); }
        .ab-story-body p { font-size:18px; line-height:1.8; color:var(--muted); margin:0 0 22px; }
        .ab-story-body p:last-child { margin:0; }
        @media(max-width:860px){ .ab-story{grid-template-columns:1fr;gap:40px;} }

        /* ── team ── */
        .ab-team { padding:100px 0; border-bottom:1px solid var(--line); text-align:center; }
        .ab-cards { display:grid; grid-template-columns:1fr 1fr; gap:32px; margin-top:56px; max-width:760px; margin-left:auto; margin-right:auto; }

        /* ── profile card (Codepen pattern) ── */
        .pc {
          background: var(--surface);
          border-radius: 2rem;
          padding: 0.5rem;
          height: 34rem;
          overflow: clip;
          position: relative;
          border: 1px solid var(--line);
          box-shadow: 0 20px 60px rgba(0,0,0,.1);
        }

        /* frosted blur at bottom of image, slides away on hover */
        .pc::before {
          content:"";
          position:absolute;
          width:calc(100% - 1rem);
          height:30%;
          bottom:0.5rem;
          left:0.5rem;
          mask:linear-gradient(#0000,#000f 80%);
          -webkit-mask:linear-gradient(#0000,#000f 80%);
          backdrop-filter:blur(1rem);
          border-radius:0 0 1.5rem 1.5rem;
          translate:0 0;
          transition:translate 0.25s;
          pointer-events:none;
          z-index:1;
        }
        .pc:hover::before { translate:0 100%; }

        /* gradient image area */
        .pc-img {
          width:100%;
          aspect-ratio:2/3;
          border-radius:1.5rem;
          display:flex;
          align-items:center;
          justify-content:center;
          transition:aspect-ratio 0.35s cubic-bezier(.4,0,.2,1);
          overflow:hidden;
        }
        .pc:hover .pc-img { aspect-ratio:1/1; }

        .pc-initials {
          font-family:var(--f-display);
          font-size:84px;
          color:rgba(255,255,255,.85);
          letter-spacing:.03em;
          line-height:1;
          text-shadow:0 4px 40px rgba(0,0,0,.22);
          user-select:none;
        }

        /* text section — bottom ~38% of card */
        .pc-section {
          margin:1rem;
          height:calc(38% - 1rem);
          display:flex;
          flex-direction:column;
        }

        .pc-section h3 {
          margin:0;
          margin-block-end:1rem;
          font-family:var(--f-display);
          font-size:1.45rem;
          letter-spacing:-.03em;
          line-height:1.15;
          color:#fff;
          translate:0 -200%;
          transition:color 0.4s, margin-block-end 0.25s, translate 0.3s cubic-bezier(.4,0,.2,1);
        }
        .pc:hover .pc-section h3 { translate:0 0; margin-block-end:0.5rem; color:var(--ink); }

        .pc-role {
          font-family:var(--f-mono);
          font-size:10px;
          letter-spacing:.12em;
          text-transform:uppercase;
          color:var(--muted);
          opacity:0;
          translate:0 100%;
          transition:opacity 0.6s 0.15s, translate 0.3s 0.1s;
          margin:0 0 6px;
        }
        .pc:hover .pc-role { opacity:1; translate:0 0; }

        .pc-tagline {
          font-size:0.88rem;
          line-height:1.45;
          color:var(--muted);
          opacity:0;
          margin:0;
          translate:0 100%;
          flex:1;
          transition:opacity 0.7s 0.2s, translate 0.3s 0.15s;
        }
        .pc:hover .pc-tagline { translate:0 0; opacity:1; }

        /* stats + button row */
        .pc-foot {
          display:flex;
          align-items:flex-end;
          justify-content:space-between;
          opacity:0;
          transition:opacity 0.6s;
          margin-bottom:1rem;
        }
        .pc:hover .pc-foot { opacity:1; transition:opacity 0.5s 0.25s; }

        .pc-socials { display:flex; gap:8px; align-self:center; }
        .pc-soc-a { display:flex; align-items:center; justify-content:center; width:34px; height:34px; border-radius:8px; border:1px solid var(--line); color:var(--muted); transition:color .18s,border-color .18s,background .18s; }
        .pc-soc-a:hover { color:var(--ink); border-color:var(--ink); background:var(--paper); }

        .pc-btn {
          border:1px solid rgba(0,0,0,0);
          border-radius:1.25rem 1.25rem 1.5rem 1.25rem;
          font-size:0.95rem;
          padding:0.85rem 1.4rem 0.85rem 2.6rem;
          background:var(--paper);
          border:1px solid var(--line);
          transition:background 0.25s;
          outline-offset:2px;
          position:relative;
          color:var(--ink);
          cursor:pointer;
          white-space:nowrap;
          text-decoration:none;
          display:inline-block;
        }
        .pc-btn::before,.pc-btn::after {
          content:"";
          width:0.85rem;
          height:0.1rem;
          background:currentcolor;
          position:absolute;
          top:50%;
          left:1.25rem;
          border-radius:1rem;
        }
        .pc-btn::after { rotate:90deg; transition:rotate 0.15s; }
        .pc-btn:hover { background:var(--line); }

        @media(max-width:700px){ .ab-cards{grid-template-columns:1fr;max-width:360px;} }

        /* ── cta ── */
        .ab-cta { padding:100px 0; text-align:center; }
        .ab-cta-h  { font-family:var(--f-display); font-size:clamp(44px,7.5vw,100px); letter-spacing:-.045em; line-height:.9; margin:0 0 24px; }
        .ab-cta-h em { font-style:italic; color:var(--brand); }
        .ab-cta-sub { font-size:18px; line-height:1.65; color:var(--muted); margin:0 0 36px; }
        .ab-cta-row { display:flex; gap:14px; justify-content:center; flex-wrap:wrap; }

        @media(max-width:560px){
          .ab-h1 { font-size:58px; }
          .ab-h2 { font-size:42px; }
          .ab-cta-h { font-size:42px; }
          .ab-sub,.ab-cta-sub,.ab-story-body p { font-size:17px; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section className={s.aboutHero} style={{ padding: "140px 0 100px", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap">
          <div className="ab-badge fade in">
            <span className={`ab-dot${isOpen ? "" : " off"}`} />
            About Foxmen Studio &nbsp;·&nbsp; {isOpen ? "Available now" : "Open · Q3 2026"}
          </div>

          <h1 className="ab-h1">
            <span className="reveal in">
              <span className="ab-r"><span className="ab-ri">We design, build,</span></span>
            </span>
            <span className="reveal in ab-d1">
              <span className="ab-r"><span className="ab-ri">and ship digital</span></span>
            </span>
            <span className="reveal in ab-d2">
              <span className="ab-r"><span className="ab-ri">products that <em>last.</em></span></span>
            </span>
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

      {/* ── STATS ── */}
      <div className="ab-stats">
        {[
          { n: "105+",  l: "Brands scaled" },
          { n: "17+",   l: "Countries served" },
          { n: "< 14w", l: "Avg. time to launch" },
          { n: "4.9★",  l: "Client satisfaction" },
        ].map((st, i) => (
          <div key={i} className={`ab-stat fade d${i}`}>
            <div className="ab-stat-n">{st.n}</div>
            <div className="ab-stat-l">{st.l}</div>
          </div>
        ))}
      </div>

      {/* ── STORY ── */}
      <section>
        <div className="wrap">
          <div className="ab-story">
            <div>
              <span className="ab-ey fade">Our story</span>
              <h2 className="ab-h2">
                <span className="reveal">
                  <span className="ab-r"><span className="ab-ri">Why</span></span>
                </span>
                <span className="reveal ab-d1">
                  <span className="ab-r"><span className="ab-ri"><em>Foxmen</em></span></span>
                </span>
                <span className="reveal ab-d2">
                  <span className="ab-r"><span className="ab-ri">exists.</span></span>
                </span>
              </h2>
            </div>
            <div className="ab-story-body">
              <p className="fade d1">
                Foxmen was founded on a conviction: exceptional digital work should not require a Fortune 500 budget. Not because quality is cheap — but because most of the cost at traditional agencies is structure, not skill. Layers of management, lengthy handoffs, and account teams translating between the client and the people actually building.
              </p>
              <p className="fade d2">
                We removed all of it. The senior practitioners who run the discovery call are the same people writing the code. The founder who pitched the project is accountable for what ships. No translation layer. No lost intent.
              </p>
              <p className="fade d3">
                <strong style={{ color: "var(--ink)" }}>Code · Craft · Care</strong> — the sequence we operate in, every project, every time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section>
        <div className="wrap">
          <div className="ab-team">
            <span className="ab-ey fade">Leadership</span>
            <h2 className="ab-h2">
              <span className="reveal">
                <span className="ab-r"><span className="ab-ri">The people</span></span>
              </span>
              <span className="reveal ab-d1">
                <span className="ab-r"><span className="ab-ri"><em>accountable</em></span></span>
              </span>
              <span className="reveal ab-d2">
                <span className="ab-r"><span className="ab-ri">for the work.</span></span>
              </span>
            </h2>

            <div className="ab-cards">
              {FOUNDERS.map((f) => (
                <article key={f.name} className={`pc fade${f.delay ? ` ${f.delay}` : ""}`}>
                  {/* image / gradient area */}
                  <div className="pc-img" style={{ background: f.gradient }}>
                    {f.image
                      ? <img src={f.image} alt={f.name} style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center top", display:"block" }} />
                      : <span className="pc-initials">{f.initials}</span>
                    }
                  </div>

                  {/* text section — bottom third */}
                  <section className="pc-section">
                    <h3>{f.name}</h3>
                    <div className="pc-role">{f.role}</div>
                    <p className="pc-tagline">{f.tagline}</p>
                    <div className="pc-foot">
                      <div className="pc-socials">
                        <a href={f.socials.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter / X" className="pc-soc-a"><XIcon /></a>
                        <a href={f.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="pc-soc-a"><LiIcon /></a>
                        <a href={f.socials.dribbble} target="_blank" rel="noopener noreferrer" aria-label="Dribbble" className="pc-soc-a"><IgIcon /></a>
                        <a href={f.socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="pc-soc-a"><GhIcon /></a>
                      </div>
                      <Link href="/contact" className="pc-btn">Contact</Link>
                    </div>
                  </section>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ borderTop: "1px solid var(--line)" }}>
        <div className="wrap">
          <div className="ab-cta">
            <span className="ab-ey fade" style={{ display: "block", marginBottom: 24 }}>Let&apos;s build</span>
            <h2 className="ab-cta-h">
              <span className="reveal">
                <span className="ab-r"><span className="ab-ri">Working on something</span></span>
              </span>
              <span className="reveal ab-d1">
                <span className="ab-r"><span className="ab-ri"><em>that matters?</em></span></span>
              </span>
            </h2>
            <p className="ab-cta-sub fade d2">
              We reply within 24 hours, Monday to Friday.<br />A real person from the studio — no automated responses.
            </p>
            <div className="ab-cta-row fade d3">
              <Link href="/contact" className="btn btn--lg">
                <span className="label">Start a project</span>
                <span className="chip"><ArrowIcon /></span>
              </Link>
              <Link href="/work" className="btn btn--ghost btn--lg">
                <span className="label">See our work</span>
                <span className="chip"><ArrowIcon /></span>
              </Link>
            </div>
            <div className="ic fade d4" style={{ marginTop: 28 }}>
              Open · Accepting new projects · Mon–Fri · 9am–6pm GMT
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
