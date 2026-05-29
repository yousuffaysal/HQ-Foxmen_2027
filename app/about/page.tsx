"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
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
    projects: 50,
    brands: 50,
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
  const [aiIn, setAiIn] = useState<Record<string, boolean>>({});
  const [chatStep, setChatStep] = useState(0);
  const [growthCounts, setGrowthCounts] = useState({ speed: 0, cost: 0, brief: 0 });

  useEffect(() => {
    const obs = new IntersectionObserver(
      es => es.forEach(e => {
        if (e.isIntersecting) {
          const k = (e.target as HTMLElement).dataset.aiSection;
          if (k) setAiIn(p => ({ ...p, [k]: true }));
        }
      }),
      { threshold: 0.15 }
    );
    document.querySelectorAll("[data-ai-section]").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!aiIn.chat) return;
    const delays = [300, 1600, 3000, 4300, 5600];
    const ids = delays.map((d, i) => setTimeout(() => setChatStep(i + 1), d));
    return () => ids.forEach(clearTimeout);
  }, [aiIn.chat]);

  useEffect(() => {
    if (!aiIn.growth) return;
    const targets = { speed: 3, cost: 60, brief: 97 };
    let step = 0;
    const id = setInterval(() => {
      step++;
      const p = 1 - Math.pow(1 - step / 60, 3);
      setGrowthCounts({
        speed: Math.round(targets.speed * p * 10) / 10,
        cost: Math.round(targets.cost * p),
        brief: Math.round(targets.brief * p),
      });
      if (step >= 60) clearInterval(id);
    }, 30);
    return () => clearInterval(id);
  }, [aiIn.growth]);

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

        /* ═══════════════════════════════════════════════════
           AI SHOWCASE SECTIONS
           ═══════════════════════════════════════════════════ */
        .ai-ey { font-family:var(--f-mono); font-size:11px; letter-spacing:.16em; text-transform:uppercase; color:#666; display:block; margin-bottom:20px; }
        .ai-ey-dark { font-family:var(--f-mono); font-size:11px; letter-spacing:.16em; text-transform:uppercase; color:#555; display:block; margin-bottom:20px; }

        /* ── S1: Chat Demo ── */
        .ai-s1 { background:#0b0b0d; padding:120px 0; position:relative; overflow:hidden; }
        .ai-s1::before { content:""; position:absolute; inset:0; background:radial-gradient(50% 60% at 18% 55%,rgba(184,108,249,.11),transparent 68%),radial-gradient(35% 45% at 82% 28%,rgba(99,102,241,.08),transparent 65%); pointer-events:none; }
        .ai-chat-grid { display:grid; grid-template-columns:1.25fr 1fr; gap:60px; align-items:center; }

        .ai-win { border-radius:18px; overflow:hidden; border:1px solid rgba(255,255,255,.08); background:#111113; box-shadow:0 48px 96px rgba(0,0,0,.7),0 0 0 1px rgba(184,108,249,.07),inset 0 1px 0 rgba(255,255,255,.04); }
        .ai-win-bar { display:flex; align-items:center; gap:7px; padding:13px 18px; background:#181818; border-bottom:1px solid rgba(255,255,255,.05); }
        .ai-wdot { width:12px; height:12px; border-radius:50%; flex-shrink:0; }
        .ai-win-lbl { margin-left:auto; margin-right:auto; font-family:var(--f-mono); font-size:11px; letter-spacing:.12em; color:#444; text-transform:uppercase; }
        .ai-chat-body { padding:22px; min-height:320px; display:flex; flex-direction:column; gap:14px; }

        .ai-msg { display:flex; flex-direction:column; gap:5px; opacity:0; transform:translateY(10px); transition:opacity .45s cubic-bezier(.16,1,.3,1),transform .45s cubic-bezier(.16,1,.3,1); }
        .ai-msg.vis { opacity:1; transform:translateY(0); }
        .ai-msg-u { align-items:flex-end; }
        .ai-msg-a { align-items:flex-start; }
        .ai-ai-row { display:flex; align-items:flex-start; gap:10px; }
        .ai-avatar { width:30px; height:30px; border-radius:8px; background:linear-gradient(135deg,var(--brand),#6366f1); flex-shrink:0; display:grid; place-items:center; font-family:var(--f-display); font-style:italic; font-size:14px; color:#fff; margin-top:2px; }

        .ai-bub { padding:11px 15px; border-radius:13px; font-size:13.5px; line-height:1.55; max-width:88%; }
        .ai-bub-u { background:var(--brand); color:#fff; border-bottom-right-radius:3px; }
        .ai-bub-a { background:#1c1c1e; color:#ddd; border-bottom-left-radius:3px; border:1px solid rgba(255,255,255,.07); }
        .ai-bub-ok { background:rgba(34,197,94,.1); border:1px solid rgba(34,197,94,.22); color:#4ade80; border-bottom-left-radius:3px; }
        .ai-msg-ts { font-family:var(--f-mono); font-size:10px; color:#3a3a3a; letter-spacing:.07em; }

        .ai-dots { display:flex; align-items:center; gap:5px; padding:13px 16px; background:#1c1c1e; border-radius:13px; border-bottom-left-radius:3px; border:1px solid rgba(255,255,255,.07); width:fit-content; }
        .ai-dots span { width:7px; height:7px; border-radius:50%; background:#444; animation:aidots 1.2s ease infinite; }
        .ai-dots span:nth-child(2){animation-delay:.2s}
        .ai-dots span:nth-child(3){animation-delay:.4s}
        @keyframes aidots{0%,60%,100%{transform:translateY(0);background:#444}30%{transform:translateY(-5px);background:var(--brand)}}

        .ai-outcome { opacity:0; transform:translateX(22px); transition:opacity .8s cubic-bezier(.16,1,.3,1) .3s,transform .8s cubic-bezier(.16,1,.3,1) .3s; }
        .ai-outcome.vis { opacity:1; transform:translateX(0); }
        .ai-out-h { font-family:var(--f-display); font-size:clamp(36px,4.5vw,60px); letter-spacing:-.03em; line-height:.95; color:#fff; margin:0 0 36px; }
        .ai-metrics { display:flex; flex-direction:column; gap:10px; }
        .ai-mc { background:#0f0f11; border:1px solid rgba(255,255,255,.07); border-radius:13px; padding:18px 22px; display:flex; justify-content:space-between; align-items:center; transition:border-color .3s; }
        .ai-mc:hover { border-color:rgba(184,108,249,.28); }
        .ai-mc-n { font-family:var(--f-display); font-size:32px; letter-spacing:-.03em; color:#fff; line-height:1; }
        .ai-mc-l { font-family:var(--f-mono); font-size:10.5px; letter-spacing:.14em; text-transform:uppercase; color:#444; margin-top:4px; }

        /* ── S2: Time Compression ── */
        .ai-s2 { padding:120px 0; border-bottom:1px solid var(--line); }
        .ai-time-grid { display:grid; grid-template-columns:1fr 1.15fr; gap:80px; align-items:center; }
        .ai-bars { display:flex; flex-direction:column; gap:26px; }
        .ai-bar-row { display:flex; flex-direction:column; gap:10px; }
        .ai-bar-top { display:flex; justify-content:space-between; align-items:baseline; }
        .ai-bar-name { font-family:var(--f-mono); font-size:11.5px; letter-spacing:.12em; text-transform:uppercase; color:var(--muted); }
        .ai-bar-weeks { font-family:var(--f-display); font-style:italic; font-size:20px; letter-spacing:-.01em; }
        .ai-bar-track { height:10px; background:var(--line); border-radius:99px; overflow:hidden; }
        .ai-bar-fill { height:100%; border-radius:99px; width:0; transition:width 1.5s cubic-bezier(.16,1,.3,1); }
        .ai-bar-old { background:#c8c8c8; transition-delay:.3s; }
        .ai-bar-new { background:linear-gradient(90deg,var(--brand),#6366f1); transition-delay:.6s; }
        .ai-s2.in .ai-bar-old { width:100%; }
        .ai-s2.in .ai-bar-new { width:38%; }
        .ai-speed-badge { display:inline-flex; align-items:center; gap:9px; margin-top:32px; padding:10px 20px; background:rgba(184,108,249,.05); border:1px solid rgba(184,108,249,.18); border-radius:999px; font-family:var(--f-mono); font-size:11.5px; letter-spacing:.1em; text-transform:uppercase; color:var(--brand); }
        .ai-save-box { margin-top:20px; padding:22px 26px; background:rgba(184,108,249,.04); border:1px solid rgba(184,108,249,.12); border-radius:16px; }
        .ai-save-n { font-family:var(--f-display); font-size:48px; letter-spacing:-.04em; line-height:1; color:var(--ink); }
        .ai-save-n em { font-style:italic; color:var(--brand); }
        .ai-save-l { font-family:var(--f-mono); font-size:11px; letter-spacing:.14em; text-transform:uppercase; color:var(--muted); margin-top:8px; }

        /* ── S3: Pipeline ── */
        .ai-s3 { background:#0b0b0d; padding:120px 0; overflow:hidden; position:relative; }
        .ai-s3::before { content:""; position:absolute; inset:0; background:radial-gradient(60% 40% at 50% 100%,rgba(184,108,249,.08),transparent 70%); pointer-events:none; }
        .ai-s3-head { text-align:center; margin-bottom:72px; }
        .ai-pipeline { display:flex; align-items:flex-start; justify-content:space-between; position:relative; gap:0; }
        .ai-pipe-rail { position:absolute; top:30px; left:8%; right:8%; height:1px; background:rgba(184,108,249,.15); overflow:visible; }
        .ai-pipe-rail::after { content:""; position:absolute; top:-2px; left:-20%; width:28%; height:5px; background:linear-gradient(90deg,transparent,rgba(184,108,249,.85),rgba(99,102,241,.6),transparent); border-radius:99px; animation:railscan 3s cubic-bezier(.4,0,.6,1) infinite; }
        @keyframes railscan{0%{left:-28%}100%{left:110%}}
        .ai-pnode { display:flex; flex-direction:column; align-items:center; gap:14px; flex:1; position:relative; z-index:1; opacity:0; transform:translateY(18px); transition:opacity .55s cubic-bezier(.16,1,.3,1),transform .55s cubic-bezier(.16,1,.3,1); }
        .ai-pnode.vis { opacity:1; transform:translateY(0); }
        .ai-picon { width:60px; height:60px; border-radius:16px; display:grid; place-items:center; border:1px solid rgba(184,108,249,.22); background:rgba(184,108,249,.06); transition:background .3s,border-color .3s,box-shadow .3s; }
        .ai-picon svg { width:22px; height:22px; color:var(--brand); }
        .ai-pnode:hover .ai-picon { background:rgba(184,108,249,.14); border-color:rgba(184,108,249,.5); box-shadow:0 0 24px rgba(184,108,249,.18); }
        .ai-pname { font-family:var(--f-display); font-size:17px; letter-spacing:-.01em; color:#fff; text-align:center; }
        .ai-ptime { font-family:var(--f-mono); font-size:10px; letter-spacing:.14em; text-transform:uppercase; color:#484848; text-align:center; }

        /* ── S4: Growth Metrics ── */
        .ai-s4 { padding:120px 0; border-bottom:1px solid var(--line); }
        .ai-s4-inner { display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:start; }
        .ai-growth-cards { display:flex; flex-direction:column; gap:20px; }
        .ai-gc { border:1px solid var(--line); border-radius:20px; padding:32px; background:#fff; overflow:hidden; position:relative; opacity:0; transform:translateY(22px) scale(.985); transition:opacity .65s cubic-bezier(.16,1,.3,1),transform .65s cubic-bezier(.16,1,.3,1); }
        .ai-gc.vis { opacity:1; transform:translateY(0) scale(1); }
        .ai-gc::before { content:""; position:absolute; inset:0; background:linear-gradient(160deg,rgba(184,108,249,.04),transparent 55%); pointer-events:none; border-radius:20px; }
        .ai-gc-num { font-family:var(--f-display); font-size:clamp(48px,5.5vw,72px); letter-spacing:-.04em; line-height:1; color:var(--ink); }
        .ai-gc-suf { font-style:italic; color:var(--brand); }
        .ai-gc-lbl { font-family:var(--f-mono); font-size:11px; letter-spacing:.16em; text-transform:uppercase; color:var(--muted); margin-top:8px; display:block; }
        .ai-gc-desc { font-size:13.5px; color:#3a3a3a; line-height:1.55; margin-top:10px; max-width:38ch; }
        .ai-spark { margin-top:20px; width:100%; display:block; overflow:visible; }
        .ai-s4-left { position:sticky; top:120px; }

        /* ── S5: Ecosystem ── */
        .ai-s5 { background:#0b0b0d; padding:120px 0; overflow:hidden; position:relative; }
        .ai-s5::before { content:""; position:absolute; inset:0; background:radial-gradient(55% 65% at 50% 50%,rgba(184,108,249,.1),transparent 68%); pointer-events:none; }
        .ai-eco-top { text-align:center; margin-bottom:72px; }
        .ai-eco-hub { width:112px; height:112px; border-radius:28px; background:rgba(184,108,249,.09); border:1px solid rgba(184,108,249,.32); display:grid; place-items:center; margin:0 auto 32px; box-shadow:0 0 64px rgba(184,108,249,.22); animation:hubglow 3s ease-in-out infinite; }
        @keyframes hubglow{0%,100%{box-shadow:0 0 40px rgba(184,108,249,.2)}50%{box-shadow:0 0 90px rgba(184,108,249,.38),0 0 140px rgba(184,108,249,.12)}}
        .ai-eco-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; max-width:780px; margin:0 auto; }
        .ai-enode { border:1px solid rgba(255,255,255,.07); border-radius:16px; padding:22px; background:#0e0e10; display:flex; flex-direction:column; gap:10px; opacity:0; transform:translateY(14px); transition:opacity .55s cubic-bezier(.16,1,.3,1),transform .55s cubic-bezier(.16,1,.3,1),border-color .3s,background .3s; }
        .ai-enode.vis { opacity:1; transform:translateY(0); }
        .ai-enode:hover { border-color:rgba(184,108,249,.28); background:#121215; }
        .ai-eicon { width:40px; height:40px; border-radius:10px; display:grid; place-items:center; font-size:19px; flex-shrink:0; }
        .ai-ename { font-family:var(--f-display); font-size:19px; letter-spacing:-.01em; color:#fff; }
        .ai-euse { font-size:12.5px; color:#4a4a52; line-height:1.5; }

        /* ── AI responsive ── */
        @media(max-width:960px){
          .ai-chat-grid { grid-template-columns:1fr; }
          .ai-time-grid { grid-template-columns:1fr; gap:44px; }
          .ai-s4-inner { grid-template-columns:1fr; gap:44px; }
          .ai-s4-left { position:static; }
          .ai-growth-cards { display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px; }
          .ai-pipeline { flex-wrap:wrap; justify-content:center; gap:28px; }
          .ai-pipe-rail { display:none; }
          .ai-pnode { flex:0 0 calc(33% - 20px); min-width:90px; }
          .ai-eco-grid { grid-template-columns:1fr 1fr; }
        }
        @media(max-width:680px){
          .ai-s1,.ai-s2,.ai-s3,.ai-s4,.ai-s5 { padding:80px 0; }
          .ai-pnode { flex:0 0 calc(50% - 14px); }
          .ai-growth-cards { grid-template-columns:1fr; }
          .ai-eco-grid { grid-template-columns:1fr; max-width:100%; }
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
          { n: "50+",   l: "Projects completed" },
          { n: "5+",    l: "Countries served" },
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

      {/* ══════════════════════════════════════════════════
          AI SECTION 1 — Brief to Built (Chat Demo)
          ══════════════════════════════════════════════════ */}
      <section className="ai-s1" data-ai-section="chat">
        <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
          <span className="ai-ey-dark fade">AI in action</span>
          <h2 style={{ fontFamily: "var(--f-display)", fontSize: "clamp(40px,5.5vw,72px)", letterSpacing: "-.03em", lineHeight: .94, color: "#fff", margin: "0 0 64px", maxWidth: "20ch" }}>
            From first message to <em style={{ color: "var(--brand)", fontStyle: "italic" }}>live product.</em>
          </h2>
          <div className="ai-chat-grid">

            {/* ── Chat window ── */}
            <div className="ai-win">
              <div className="ai-win-bar">
                <span className="ai-wdot" style={{ background: "#ff5f57" }} />
                <span className="ai-wdot" style={{ background: "#febc2e" }} />
                <span className="ai-wdot" style={{ background: "#28c840" }} />
                <span className="ai-win-lbl">Foxmen Studio · Client Brief</span>
              </div>
              <div className="ai-chat-body">
                <div className={`ai-msg ai-msg-u${chatStep >= 1 ? " vis" : ""}`}>
                  <div className="ai-bub ai-bub-u">
                    We need a booking platform — online payments, automated reminders, and an admin dashboard for our team.
                  </div>
                  <span className="ai-msg-ts">Client · just now</span>
                </div>

                {chatStep >= 1 && chatStep < 3 && (
                  <div className="ai-msg ai-msg-a vis">
                    <div className="ai-ai-row">
                      <div className="ai-avatar">F</div>
                      <div className="ai-dots"><span /><span /><span /></div>
                    </div>
                  </div>
                )}

                {chatStep >= 3 && (
                  <div className="ai-msg ai-msg-a vis">
                    <div className="ai-ai-row">
                      <div className="ai-avatar">F</div>
                      <div className="ai-bub ai-bub-a">
                        Architecture mapped — Next.js frontend, Stripe payments, push notification layer, admin panel with role-based access. <strong style={{ color: "#fff" }}>Estimated: 8 weeks.</strong>
                      </div>
                    </div>
                  </div>
                )}

                {chatStep >= 4 && (
                  <div className="ai-msg ai-msg-u vis">
                    <div className="ai-bub ai-bub-u">Perfect. Let&apos;s start Monday.</div>
                  </div>
                )}

                {chatStep >= 5 && (
                  <div className="ai-msg ai-msg-a vis">
                    <div className="ai-ai-row">
                      <div className="ai-avatar">F</div>
                      <div className="ai-bub ai-bub-ok">
                        ✓ Delivered in 7 weeks — 1 week ahead of schedule. 4.9★ rating. 100% on brief.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Outcome panel ── */}
            <div className={`ai-outcome${chatStep >= 5 ? " vis" : ""}`}>
              <span className="ai-ey-dark">The result</span>
              <div className="ai-out-h">
                Live in<br /><em style={{ color: "var(--brand)", fontStyle: "italic" }}>7 weeks.</em>
              </div>
              <div className="ai-metrics">
                {[
                  { n: "1 week", l: "Ahead of schedule" },
                  { n: "100%",   l: "On-brief delivery" },
                  { n: "4.9 ★", l: "Client satisfaction" },
                ].map((m, i) => (
                  <div key={i} className="ai-mc">
                    <div>
                      <div className="ai-mc-n">{m.n}</div>
                      <div className="ai-mc-l">{m.l}</div>
                    </div>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(34,197,94,.6)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          AI SECTION 2 — Timeline Compression
          ══════════════════════════════════════════════════ */}
      <section className={`ai-s2${aiIn.time ? " in" : ""}`} data-ai-section="time">
        <div className="wrap">
          <div className="ai-time-grid">
            <div>
              <span className="ab-ey fade">Speed advantage</span>
              <h2 className="ab-h2">
                <span className="reveal"><span className="ab-r"><span className="ab-ri">We compress</span></span></span>
                <span className="reveal ab-d1"><span className="ab-r"><span className="ab-ri"><em>timelines.</em></span></span></span>
              </h2>
              <p style={{ fontSize: 17, lineHeight: 1.65, color: "var(--muted)", maxWidth: "40ch", marginTop: 22 }}>
                AI-assisted architecture, automated testing, and a direct-to-builder model eliminates the handoff lag that bloats traditional agency projects.
              </p>
              <div className="ai-speed-badge">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                Up to 65% faster than traditional agencies
              </div>
            </div>

            <div>
              <div className="ai-bars">
                <div className="ai-bar-row">
                  <div className="ai-bar-top">
                    <span className="ai-bar-name">Traditional agency</span>
                    <span className="ai-bar-weeks">20 weeks</span>
                  </div>
                  <div className="ai-bar-track"><div className="ai-bar-fill ai-bar-old" /></div>
                </div>
                <div className="ai-bar-row">
                  <div className="ai-bar-top">
                    <span className="ai-bar-name">Foxmen + AI</span>
                    <span className="ai-bar-weeks" style={{ color: "var(--brand)" }}>7 weeks</span>
                  </div>
                  <div className="ai-bar-track"><div className="ai-bar-fill ai-bar-new" /></div>
                </div>
              </div>
              <div className="ai-save-box">
                <div className="ai-save-n">13 <em>weeks</em></div>
                <div className="ai-save-l">saved per project on average</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          AI SECTION 3 — AI Production Pipeline
          ══════════════════════════════════════════════════ */}
      <section className="ai-s3" data-ai-section="pipeline">
        <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
          <div className="ai-s3-head">
            <span className="ai-ey-dark fade">How we work</span>
            <h2 style={{ fontFamily: "var(--f-display)", fontSize: "clamp(40px,5.5vw,72px)", letterSpacing: "-.03em", lineHeight: .94, color: "#fff", margin: 0 }}>
              AI-powered <em style={{ color: "var(--brand)", fontStyle: "italic" }}>production pipeline.</em>
            </h2>
            <p style={{ fontSize: 17, color: "#555", maxWidth: "50ch", margin: "20px auto 0", lineHeight: 1.65 }}>
              Every project runs through an AI-assisted workflow that eliminates bottlenecks, accelerates decisions, and ships on time.
            </p>
          </div>

          <div className="ai-pipeline">
            <div className="ai-pipe-rail" />
            {([
              { name: "Brief",       time: "Day 1",      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12h6M9 8h6M9 16h4M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/></svg> },
              { name: "AI Analysis", time: "Days 2–3",   icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg> },
              { name: "Design",      time: "Days 4–7",   icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18M9 21V9"/></svg> },
              { name: "Build",       time: "Weeks 2–7",  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg> },
              { name: "Launch",      time: "Week 8",     icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
            ] as { name: string; time: string; icon: React.ReactNode }[]).map((node, i) => (
              <div key={i} className={`ai-pnode${aiIn.pipeline ? " vis" : ""}`} style={{ transitionDelay: aiIn.pipeline ? `${i * 0.12}s` : "0s" }}>
                <div className="ai-picon">{node.icon}</div>
                <span className="ai-pname">{node.name}</span>
                <span className="ai-ptime">{node.time}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          AI SECTION 4 — Business Growth / Impact
          ══════════════════════════════════════════════════ */}
      <section className="ai-s4" data-ai-section="growth">
        <div className="wrap">
          <div className="ai-s4-inner">
            <div className="ai-s4-left">
              <span className="ab-ey fade">Real outcomes</span>
              <h2 className="ab-h2">
                <span className="reveal"><span className="ab-r"><span className="ab-ri">AI that drives</span></span></span>
                <span className="reveal ab-d1"><span className="ab-r"><span className="ab-ri"><em>growth.</em></span></span></span>
              </h2>
              <p style={{ fontSize: 17, lineHeight: 1.65, color: "var(--muted)", marginTop: 22, maxWidth: "40ch" }}>
                Not just faster delivery — measurably better business outcomes. Our AI integration reduces overhead, accelerates iteration, and keeps clients ahead of the market.
              </p>
            </div>
            <div className="ai-growth-cards">
              {[
                { num: growthCounts.speed, suf: "×", label: "Faster delivery",    desc: "AI-accelerated architecture and automated QA compress the traditional 20-week cycle to under 8.", path: "M0,44 C28,42 48,38 78,28 C108,18 138,11 168,6 L200,2" },
                { num: growthCounts.cost,  suf: "%", label: "Reduced overhead",   desc: "No agency markup. No management layers. AI handles the repetitive; our senior engineers handle everything that matters.", path: "M0,44 C20,41 44,36 72,26 C100,15 136,8 170,4 L200,2" },
                { num: growthCounts.brief, suf: "%", label: "On-brief delivery",  desc: "AI-assisted discovery means we understand the brief perfectly before a line of code is written. No surprises at launch.", path: "M0,46 C24,44 46,40 74,30 C104,19 136,10 168,5 L200,2" },
              ].map((c, i) => (
                <div key={i} className={`ai-gc${aiIn.growth ? " vis" : ""}`} style={{ transitionDelay: `${i * 0.13}s` }}>
                  <div className="ai-gc-num">{c.num}<span className="ai-gc-suf">{c.suf}</span></div>
                  <span className="ai-gc-lbl">{c.label}</span>
                  <p className="ai-gc-desc">{c.desc}</p>
                  <svg className="ai-spark" height="50" viewBox="0 0 200 50" fill="none" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id={`sg${i}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--brand)" stopOpacity=".25" />
                        <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d={`${c.path} L200,50 L0,50Z`} fill={`url(#sg${i})`} />
                    <path d={c.path} stroke="var(--brand)" strokeWidth="1.8" strokeDasharray="280"
                      style={{ strokeDashoffset: aiIn.growth ? 0 : 280, transition: `stroke-dashoffset 1.5s cubic-bezier(.16,1,.3,1) ${i * 0.18 + 0.4}s` }} />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          AI SECTION 5 — AI Integration Ecosystem
          ══════════════════════════════════════════════════ */}
      <section className="ai-s5" data-ai-section="eco">
        <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
          <div className="ai-eco-top">
            <span className="ai-ey-dark fade">Our AI stack</span>
            <div className="ai-eco-hub">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>
            <h2 style={{ fontFamily: "var(--f-display)", fontSize: "clamp(40px,5.5vw,72px)", letterSpacing: "-.03em", lineHeight: .94, color: "#fff", margin: "0 0 16px" }}>
              The <em style={{ color: "var(--brand)", fontStyle: "italic" }}>intelligence</em><br />behind the build.
            </h2>
            <p style={{ fontSize: 17, color: "#555", maxWidth: "44ch", margin: "0 auto", lineHeight: 1.65 }}>
              We embed the best AI tools directly into our production workflow — from first brief to live deployment.
            </p>
          </div>

          <div className="ai-eco-grid">
            {[
              { name: "GPT-4o",     use: "Architecture planning, copy generation & client brief analysis",          bg: "rgba(16,163,127,.12)", bd: "rgba(16,163,127,.25)", icon: "⬡" },
              { name: "Claude",     use: "Code review, logic analysis, QA automation & documentation",             bg: "rgba(184,108,249,.12)", bd: "rgba(184,108,249,.3)",  icon: "◈" },
              { name: "Figma AI",   use: "Design-to-code conversion, auto-layout & component generation",         bg: "rgba(255,100,50,.1)",   bd: "rgba(255,100,50,.22)", icon: "◉" },
              { name: "Vercel AI",  use: "Edge inference, streaming responses & zero-downtime deployment",         bg: "rgba(255,255,255,.06)", bd: "rgba(255,255,255,.1)", icon: "△" },
              { name: "Cursor",     use: "AI-pair programming that triples engineer output on every sprint",       bg: "rgba(99,102,241,.12)",  bd: "rgba(99,102,241,.25)", icon: "◧" },
              { name: "Perplexity", use: "Real-time market research, competitor analysis & content fact-checking", bg: "rgba(20,184,166,.1)",   bd: "rgba(20,184,166,.22)", icon: "◎" },
            ].map((node, i) => (
              <div key={i} className={`ai-enode${aiIn.eco ? " vis" : ""}`} style={{ transitionDelay: `${i * 0.08}s` }}>
                <div className="ai-eicon" style={{ background: node.bg, border: `1px solid ${node.bd}`, color: "#fff" }}>{node.icon}</div>
                <div className="ai-ename">{node.name}</div>
                <div className="ai-euse">{node.use}</div>
              </div>
            ))}
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
