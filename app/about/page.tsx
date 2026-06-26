"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
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
function BeIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9.01 13.57H5.03V16h4.3c.8 0 1.22-.45 1.22-1.22 0-.8-.46-1.21-1.54-1.21ZM9.3 10.06c0-.7-.45-1.06-1.3-1.06H5.03v2.2h2.82c.93 0 1.45-.44 1.45-1.14ZM14.5 10.64c-.97 0-1.6.6-1.66 1.56h3.28c-.08-.97-.65-1.56-1.62-1.56ZM22 3H2C.9 3 0 3.9 0 5v14c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2ZM11.7 16.3c-.56.56-1.32.84-2.28.84H3.5V7.87h5.6c1.03 0 1.83.25 2.38.76.55.5.82 1.12.82 1.84 0 1-.5 1.7-1.5 2.12 1.28.38 1.9 1.2 1.9 2.36 0 .96-.33 1.8-1 2.35Zm8.28-4.26h-5c0 1.2.65 1.87 1.82 1.87.66 0 1.2-.32 1.46-.9h1.62c-.47 1.56-1.6 2.4-3.12 2.4-2.04 0-3.38-1.38-3.38-3.38 0-2 1.34-3.4 3.34-3.4 2.1 0 3.3 1.4 3.3 3.55 0 .1 0 .2-.04.3Zm-2.64-4.74h-3.7v-.97h3.7v.97Z"/></svg>;
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
      behance: "",
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
      behance: "",
    },
    projects: 50,
    brands: 80,
    delay: "d1",
  },
  {
    initials: "SS",
    name: "Shohanur Sourav",
    role: "Head of Marketing Wing",
    tagline: "Brand growth, campaigns and digital presence — making the world notice every product we ship.",
    gradient: "linear-gradient(160deg,#fdba74 0%,#fb923c 40%,#ea580c 100%)",
    image: "https://ik.imagekit.io/2lax2ytm2/shohanursourav-foxmenstudio.png",
    socials: {
      twitter: "",
      linkedin: "https://www.linkedin.com/in/shohanursourav/",
      instagram: "",
      dribbble: "",
      behance: "https://www.behance.net/shohanursourav",
    },
    projects: 0,
    brands: 0,
    delay: "d2",
  },
];

function TypedText({ text, active, speed = 22 }: { text: string; active: boolean; speed?: number }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!active) { setI(0); return; }
    setI(0);
    let c = 0;
    const id = setInterval(() => { c++; setI(c); if (c >= text.length) clearInterval(id); }, speed);
    return () => clearInterval(id);
  }, [active, text, speed]);
  return <>{text.slice(0, i)}{i < text.length && <span className="ai-cursor" />}</>;
}

export default function AboutPage() {
  useScrollReveal(".fade, .reveal");
  const isOpen = useIsOpen();
  const [aiIn, setAiIn] = useState<Record<string, boolean>>({});
  const [chatStep, setChatStep] = useState(0);
  const [growthCounts, setGrowthCounts] = useState({ speed: 0, cost: 0, brief: 0 });
  const chatBodyRef = useRef<HTMLDivElement>(null);

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
    // 1=cursor appears  2=cursor moves  3=chat opens  4=ai greeting
    // 5=user msg1  6=typing dots  7=ai reply  8=user msg2  9=ai confirm
    const delays = [200, 1700, 3200, 4100, 5900, 8100, 9900, 11700, 13400];
    const ids = delays.map((d, i) => setTimeout(() => setChatStep(i + 1), d));
    return () => ids.forEach(clearTimeout);
  }, [aiIn.chat]);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatStep]);

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
        .ab-cards { display:grid; grid-template-columns:repeat(3,1fr); gap:32px; margin-top:56px; max-width:1100px; margin-left:auto; margin-right:auto; }

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

        @media(max-width:900px){ .ab-cards{grid-template-columns:1fr 1fr;max-width:760px;} }
        @media(max-width:600px){ .ab-cards{grid-template-columns:1fr;max-width:360px;} }

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

        /* ── Typing cursor ── */
        .ai-cursor { display:inline-block; width:2px; height:.82em; background:currentColor; vertical-align:text-bottom; margin-left:1px; border-radius:1px; animation:aicur .65s step-start infinite; }
        @keyframes aicur{0%,100%{opacity:1}50%{opacity:0}}

        /* ── Safari browser chrome ── */
        .safari { border-radius:14px; overflow:hidden; background:#e8e6e2; box-shadow:0 0 0 1px rgba(0,0,0,.15),0 60px 110px rgba(0,0,0,.55),0 20px 40px rgba(0,0,0,.2); }
        .sf-chrome { height:50px; background:linear-gradient(to bottom,#e0deda,#d8d5d0); border-bottom:1px solid rgba(0,0,0,.15); display:flex; align-items:center; padding:0 14px; gap:10px; flex-shrink:0; position:relative; box-shadow:inset 0 1px 0 rgba(255,255,255,.5); }
        .sf-dots { display:flex; gap:6px; flex-shrink:0; }
        .sf-dot { width:12px; height:12px; border-radius:50%; flex-shrink:0; box-shadow:inset 0 1px 0 rgba(255,255,255,.25); }
        .sf-nav { display:flex; gap:2px; flex-shrink:0; }
        .sf-nav-btn { width:28px; height:26px; background:none; border:none; border-radius:5px; display:grid; place-items:center; cursor:default; color:#888; padding:0; }
        .sf-addr { height:28px; background:rgba(255,255,255,.7); border-radius:7px; display:flex; align-items:center; gap:6px; padding:0 10px; border:1px solid rgba(0,0,0,.12); position:absolute; left:50%; transform:translateX(-50%); width:min(280px,44%); box-shadow:inset 0 1px 2px rgba(0,0,0,.06); }
        .sf-favicon { width:13px; height:13px; object-fit:contain; flex-shrink:0; }
        .sf-lock { color:#888; flex-shrink:0; }
        .sf-url { font-family:var(--f-mono); font-size:11.5px; color:#555; flex:1; letter-spacing:.02em; text-align:center; white-space:nowrap; overflow:hidden; }
        .sf-tbr { margin-left:auto; display:flex; gap:3px; flex-shrink:0; }
        .sf-tbr-btn { width:28px; height:26px; background:none; border:none; border-radius:5px; display:grid; place-items:center; cursor:default; color:#888; padding:0; }

        /* ── Full homepage inside browser ── */
        .sf-page {
          background-color:#f8f5f0;
          background-image:linear-gradient(rgba(0,0,0,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,.025) 1px,transparent 1px);
          background-size:44px 44px;
          position:relative; overflow:hidden; min-height:460px;
        }
        /* Page nav */
        .sf-pnav { height:44px; display:flex; align-items:center; padding:0 18px; gap:14px; background:rgba(248,245,240,.85); backdrop-filter:blur(8px); border-bottom:1px solid rgba(0,0,0,.06); position:relative; z-index:5; }
        .sf-plogo { display:flex; align-items:center; gap:6px; flex-shrink:0; }
        .sf-plogo-mark { width:20px; height:20px; flex-shrink:0; }
        .sf-plogo-text { font-family:var(--f-display); font-size:13px; letter-spacing:-.01em; color:#0a0a0a; }
        .sf-plogo-sub { font-family:var(--f-mono); font-size:7.5px; letter-spacing:.18em; text-transform:uppercase; color:#aaa; display:block; line-height:1; }
        .sf-pnav-links { display:flex; gap:12px; margin-left:12px; }
        .sf-pnav-lnk { font-size:11px; color:#444; font-family:var(--f-display); letter-spacing:-.01em; white-space:nowrap; }
        .sf-pnav-r { margin-left:auto; display:flex; align-items:center; gap:8px; }
        .sf-ptime { font-family:var(--f-mono); font-size:9px; color:#999; letter-spacing:.04em; display:flex; align-items:center; gap:5px; }
        .sf-ppulse { width:6px; height:6px; border-radius:50%; background:var(--brand); animation:abpulse 2s infinite; flex-shrink:0; }
        .sf-pnav-portal { padding:4px 10px; background:#f0ede8; border:1px solid rgba(0,0,0,.1); border-radius:999px; font-family:var(--f-display); font-size:10.5px; color:#0a0a0a; display:flex; align-items:center; gap:5px; white-space:nowrap; }
        .sf-pnav-cta { padding:5px 11px; background:#0a0a0a; border-radius:999px; font-family:var(--f-display); font-size:10.5px; color:#fff; display:flex; align-items:center; gap:4px; white-space:nowrap; }
        /* Hero eyebrow */
        .sf-eyebrow { font-family:var(--f-mono); font-size:9px; letter-spacing:.18em; text-transform:uppercase; color:#888; display:flex; align-items:center; gap:7px; padding:16px 18px 10px; position:relative; z-index:2; }
        .sf-eyepulse { width:5px; height:5px; border-radius:50%; background:var(--brand); animation:abpulse 2s infinite; flex-shrink:0; }
        /* Hero heading */
        .sf-h1 { font-family:var(--f-display); font-size:58px; line-height:.92; letter-spacing:-.04em; color:#0a0a0a; margin:0; padding:0 18px; position:relative; z-index:2; }
        .sf-h1 em { font-style:italic; color:var(--brand); }
        /* Orbit */
        .sf-orbit-el { position:absolute; top:50px; right:18px; width:120px; height:120px; pointer-events:none; z-index:2; animation:spin 22s linear infinite; }
        .sf-orbit-center { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); animation:spin 22s linear infinite reverse; }
        /* Bottom bar */
        .sf-pfoot { position:absolute; bottom:0; left:0; right:0; padding:14px 18px; display:grid; grid-template-columns:1fr auto auto; align-items:end; gap:16px; z-index:3; }
        .sf-pdesc { font-size:11px; color:#666; line-height:1.55; max-width:34ch; }
        .sf-pstats-n { font-family:var(--f-display); font-style:italic; font-size:26px; letter-spacing:-.025em; color:#0a0a0a; line-height:1; }
        .sf-pstats-l { font-family:var(--f-mono); font-size:8px; letter-spacing:.18em; text-transform:uppercase; color:#aaa; margin-top:2px; }
        .sf-psee { padding:8px 16px; background:#0a0a0a; border-radius:999px; color:#fff; font-family:var(--f-display); font-size:11px; display:inline-flex; align-items:center; gap:5px; white-space:nowrap; }

        /* ── Chat widget ── */
        .sf-cw { position:absolute; bottom:16px; right:16px; z-index:20; }
        .sf-cw-btn { width:46px; height:46px; border-radius:50%; background:var(--brand); display:grid; place-items:center; box-shadow:0 4px 22px rgba(184,108,249,.5); transition:opacity .25s,transform .25s; cursor:default; }
        .sf-cwp { width:272px; border-radius:14px; overflow:hidden; box-shadow:0 18px 60px rgba(0,0,0,.22),0 0 0 1px rgba(0,0,0,.08); transition:opacity .4s cubic-bezier(.16,1,.3,1),transform .4s cubic-bezier(.16,1,.3,1); }
        .sf-cwp-head { background:#0a0a0a; padding:12px 14px; display:flex; align-items:center; gap:9px; }
        .sf-cwp-logo { width:28px; height:28px; border-radius:7px; background:var(--brand); display:grid; place-items:center; flex-shrink:0; }
        .sf-cwp-title { font-family:var(--f-display); font-size:13px; color:#fff; letter-spacing:-.01em; line-height:1; }
        .sf-cwp-status { font-family:var(--f-mono); font-size:9px; color:#666; letter-spacing:.07em; display:flex; align-items:center; gap:4px; margin-top:2px; }
        .sf-cwp-sbtn { width:22px; height:22px; border-radius:5px; background:rgba(255,255,255,.08); border:none; display:grid; place-items:center; cursor:default; padding:0; flex-shrink:0; }
        .sf-cwp-body { background:#fff; padding:12px; display:flex; flex-direction:column; gap:8px; max-height:196px; overflow-y:auto; scroll-behavior:smooth; }
        .sf-cwp-body::-webkit-scrollbar { display:none; }
        .sf-cwp-aibub { background:#f3f3f5; border-radius:10px 10px 10px 2px; padding:9px 11px; font-size:11.5px; color:#0a0a0a; line-height:1.5; max-width:92%; }
        .sf-cwp-ubub { background:var(--brand); border-radius:10px 10px 2px 10px; padding:9px 11px; font-size:11.5px; color:#fff; line-height:1.5; max-width:86%; margin-left:auto; }
        .sf-cwp-label { font-family:var(--f-mono); font-size:9px; color:#bbb; letter-spacing:.06em; margin-bottom:4px; }
        .sf-cwp-ts { font-family:var(--f-mono); font-size:9px; color:#ccc; margin-top:3px; }
        .sf-cwp-visitor { font-family:var(--f-mono); font-size:9px; color:#aaa; margin-top:4px; letter-spacing:.06em; }
        .sf-cwp-input { display:flex; align-items:center; gap:8px; padding:9px 12px; background:#fff; border-top:1px solid #efefef; }
        .sf-cwp-placeholder { flex:1; font-size:12px; color:#bbb; font-family:var(--f-display); }
        .sf-cwp-send { width:28px; height:28px; border-radius:7px; background:var(--brand); display:grid; place-items:center; flex-shrink:0; }
        .sf-cwp-foot { padding:8px 12px; background:#fafafa; border-top:1px solid #f0f0f0; }
        .sf-cwp-powered { font-family:var(--f-mono); font-size:9px; color:#ccc; letter-spacing:.03em; }
        .sf-cwp-book { font-family:var(--f-display); font-size:11px; color:#0a0a0a; margin-top:2px; display:block; }

        /* ── Cursor ── */
        .sf-cursor { position:absolute; z-index:40; pointer-events:none; filter:drop-shadow(0 2px 4px rgba(0,0,0,.3)); }

        /* ── Logo avatar ── */
        .ai-avatar-logo { width:30px; height:30px; border-radius:8px; background:linear-gradient(135deg,var(--brand),#6366f1); flex-shrink:0; display:grid; place-items:center; margin-top:2px; overflow:hidden; }
        .ai-avatar-logo img { width:62%; height:62%; object-fit:contain; filter:brightness(0) invert(1); }

        @media(max-width:860px){ .sf-h1{font-size:44px} .sf-pnav-links{display:none} .sf-pnav-cta{display:none} }
        @media(max-width:600px){ .sf-h1{font-size:34px} .sf-pnav-portal{display:none} }

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

            {/* ── Safari browser mockup ── */}
            <div className="safari">
              {/* Browser chrome */}
              <div className="sf-chrome">
                <div className="sf-dots">
                  <span className="sf-dot" style={{ background: "#ff5f57" }} />
                  <span className="sf-dot" style={{ background: "#febc2e" }} />
                  <span className="sf-dot" style={{ background: "#28c840" }} />
                </div>
                <div className="sf-nav">
                  <button type="button" className="sf-nav-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                  </button>
                  <button type="button" className="sf-nav-btn" style={{ opacity: .3 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                  </button>
                </div>
                {/* Address bar — centred */}
                <div className="sf-addr">
                  <svg className="sf-lock" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <img src="/assets/logo-mark.svg" className="sf-favicon" alt="" />
                  <span className="sf-url">foxmen.studio</span>
                </div>
                {/* Right toolbar */}
                <div className="sf-tbr">
                  <button type="button" className="sf-tbr-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"/></svg>
                  </button>
                  <button type="button" className="sf-tbr-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                  </button>
                </div>
              </div>

              {/* Full homepage recreation */}
              <div className="sf-page">

                {/* Page nav */}
                <div className="sf-pnav">
                  <div className="sf-plogo">
                    <img src="/assets/logo-mark.svg" className="sf-plogo-mark" alt="" />
                    <div>
                      <div className="sf-plogo-text">Foxmen <em style={{ fontStyle: "italic", color: "var(--brand)" }}>Studio</em></div>
                      <span className="sf-plogo-sub">CODE · CRAFT · CARE</span>
                    </div>
                  </div>
                  <div className="sf-pnav-links">
                    {["Work", "Services", "About", "Journal", "Contact"].map(l => (
                      <span key={l} className="sf-pnav-lnk">{l}</span>
                    ))}
                  </div>
                  <div className="sf-pnav-r">
                    <div className="sf-ptime"><span className="sf-ppulse" />Live</div>
                    <div className="sf-pnav-portal">Client Portal</div>
                    <div className="sf-pnav-cta">Start a project</div>
                  </div>
                </div>

                {/* Eyebrow */}
                <div className="sf-eyebrow">
                  <span className="sf-eyepulse" />
                  INTERNATIONAL DIGITAL STUDIO — EST. 2025
                </div>

                {/* Hero heading */}
                <h1 className="sf-h1">
                  We build <em>digital</em><br />
                  products<br />
                  that <em>ship.</em>
                </h1>

                {/* Spinning orbit */}
                <div className="sf-orbit-el">
                  <svg viewBox="0 0 120 120" fill="none" width="120" height="120">
                    <circle cx="60" cy="60" r="52" stroke="rgba(0,0,0,.1)" strokeWidth="1" strokeDasharray="2 5" />
                    <defs>
                      <path id="sf-orb-path" d="M60,8 a52,52 0 1,1 -.001,0" />
                    </defs>
                    <text fontFamily="monospace" fontSize="8.5" letterSpacing="4.5" fill="#999">
                      <textPath href="#sf-orb-path" startOffset="0%">CODE · CRAFT · CARE ·</textPath>
                    </text>
                    <g className="sf-orbit-center">
                      <image href="/assets/logo-mark.svg" x="44" y="44" width="32" height="32" style={{ opacity: .35 }} />
                    </g>
                  </svg>
                </div>

                {/* Bottom stats bar */}
                <div className="sf-pfoot">
                  <p className="sf-pdesc">From custom AI to full-stack development — built with precision for founders and growth-stage companies.</p>
                  <div>
                    <div className="sf-pstats-n">50+</div>
                    <div className="sf-pstats-l">Products shipped</div>
                  </div>
                  <div className="sf-psee">See our work →</div>
                </div>

                {/* Chat widget */}
                <div className="sf-cw">
                  <div className="sf-cw-btn" style={{ opacity: chatStep >= 3 ? 0 : 1, transform: chatStep >= 3 ? "scale(.8)" : "scale(1)", transition: "opacity .3s, transform .3s", position: "absolute", bottom: 0, right: 0 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  </div>
                  <div className="sf-cwp" style={{ opacity: chatStep >= 3 ? 1 : 0, transform: chatStep >= 3 ? "translateY(0) scale(1)" : "translateY(14px) scale(.96)", pointerEvents: "none" }}>
                    <div className="sf-cwp-head">
                      <div className="sf-cwp-logo" style={{ background: "none", overflow: "hidden", padding: 0 }}>
                        <img src="/assets/logo_sn_fox.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 7 }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div className="sf-cwp-title">Foxmen Studio</div>
                        <div className="sf-cwp-status">
                          <svg width="6" height="6" viewBox="0 0 6 6"><circle cx="3" cy="3" r="3" fill="#22c55e"/></svg>
                          Live Support
                        </div>
                      </div>
                      <button type="button" className="sf-cwp-sbtn">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                      </button>
                    </div>
                    <div className="sf-cwp-body" ref={chatBodyRef}>
                      {chatStep >= 4 && (
                        <div>
                          <div className="sf-cwp-label">Foxmen Studio</div>
                          <div className="sf-cwp-aibub">
                            <TypedText text="Hi there! 👋 How can we help you today?" active={chatStep >= 4} speed={18} />
                          </div>
                          <div className="sf-cwp-ts">just now</div>
                        </div>
                      )}
                      {chatStep >= 5 && (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                          <div className="sf-cwp-visitor">You</div>
                          <div className="sf-cwp-ubub">
                            <TypedText text="I need a booking platform for my business." active={chatStep >= 5} speed={20} />
                          </div>
                        </div>
                      )}
                      {chatStep >= 6 && chatStep < 7 && (
                        <div>
                          <div className="sf-cwp-label">Foxmen Studio</div>
                          <div className="ai-dots" style={{ background: "#f3f3f5", border: "none" }}><span /><span /><span /></div>
                        </div>
                      )}
                      {chatStep >= 7 && (
                        <div>
                          <div className="sf-cwp-label">Foxmen Studio</div>
                          <div className="sf-cwp-aibub">
                            <TypedText text="Great! We can build that — Stripe payments, calendar sync, and an admin dashboard. Estimated 7 weeks." active={chatStep >= 7} speed={15} />
                          </div>
                        </div>
                      )}
                      {chatStep >= 8 && (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                          <div className="sf-cwp-visitor">You</div>
                          <div className="sf-cwp-ubub">
                            <TypedText text="Sounds perfect. Let's start Monday!" active={chatStep >= 8} speed={22} />
                          </div>
                        </div>
                      )}
                      {chatStep >= 9 && (
                        <div>
                          <div className="sf-cwp-label">Foxmen Studio</div>
                          <div className="sf-cwp-aibub" style={{ background: "rgba(34,197,94,.1)", border: "1px solid rgba(34,197,94,.22)", color: "#16a34a" }}>
                            <TypedText text="✓ Confirmed! Monday kickoff is locked. Can't wait to build this with you." active={chatStep >= 9} speed={18} />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="sf-cwp-input">
                      <span className="sf-cwp-placeholder">Type a message…</span>
                      <div className="sf-cwp-send">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z"/></svg>
                      </div>
                    </div>
                    <div className="sf-cwp-foot">
                      <div className="sf-cwp-powered">Powered by Foxmen Studio</div>
                      <span className="sf-cwp-book">Book a free call →</span>
                    </div>
                  </div>
                </div>

                {/* Animated cursor */}
                <div
                  className="sf-cursor"
                  style={{
                    position: "absolute",
                    bottom: 26,
                    right: 26,
                    opacity: chatStep >= 1 && chatStep < 4 ? 1 : 0,
                    transform: chatStep >= 3 ? "translate(0,0) scale(.7)" : chatStep >= 2 ? "translate(0,0)" : "translate(-220px,-160px)",
                    transition: chatStep >= 2 ? "transform 1.3s cubic-bezier(.16,1,.3,1), opacity .3s" : "opacity .4s",
                  }}
                >
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="white" stroke="#111" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 3l13.5 9-7.5 1.5L7 20z" fill="white" />
                  </svg>
                </div>

              </div>
            </div>

            {/* ── Outcome panel ── */}
            <div className={`ai-outcome${chatStep >= 8 ? " vis" : ""}`}>
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
              { name: "GPT-4o",     use: "Architecture planning, copy generation & client brief analysis",          bg: "rgba(16,163,127,.12)", bd: "rgba(16,163,127,.25)", logo: "/assets/logos/openai.svg" },
              { name: "Claude",     use: "Code review, logic analysis, QA automation & documentation",             bg: "rgba(210,100,60,.12)",  bd: "rgba(210,100,60,.28)",  logo: "/assets/logos/claude.svg" },
              { name: "Figma AI",   use: "Design-to-code conversion, auto-layout & component generation",         bg: "rgba(242,78,30,.1)",    bd: "rgba(242,78,30,.25)",  logo: "/assets/logos/figma.svg" },
              { name: "Vercel AI",  use: "Edge inference, streaming responses & zero-downtime deployment",         bg: "rgba(255,255,255,.06)", bd: "rgba(255,255,255,.1)", logo: "/assets/logos/vercel.svg" },
              { name: "Cursor",     use: "AI-pair programming that triples engineer output on every sprint",       bg: "rgba(99,102,241,.12)",  bd: "rgba(99,102,241,.25)", logo: "/assets/logos/cursor.svg" },
              { name: "Perplexity", use: "Real-time market research, competitor analysis & content fact-checking", bg: "rgba(31,184,205,.1)",   bd: "rgba(31,184,205,.22)", logo: "/assets/logos/perplexity.svg" },
            ].map((node, i) => (
              <div key={i} className={`ai-enode${aiIn.eco ? " vis" : ""}`} style={{ transitionDelay: `${i * 0.08}s` }}>
                <div className="ai-eicon" style={{ background: node.bg, border: `1px solid ${node.bd}` }}>
                  <img src={node.logo} alt={node.name} style={{ width: 22, height: 22, objectFit: "contain", filter: "brightness(0) invert(1)" }} />
                </div>
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
                        {f.socials.twitter && <a href={f.socials.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter / X" className="pc-soc-a"><XIcon /></a>}
                        {f.socials.linkedin && <a href={f.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="pc-soc-a"><LiIcon /></a>}
                        {f.socials.behance && <a href={f.socials.behance} target="_blank" rel="noopener noreferrer" aria-label="Behance" className="pc-soc-a"><BeIcon /></a>}
                        {f.socials.dribbble && <a href={f.socials.dribbble} target="_blank" rel="noopener noreferrer" aria-label="Dribbble" className="pc-soc-a"><IgIcon /></a>}
                        {f.socials.instagram && <a href={f.socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="pc-soc-a"><GhIcon /></a>}
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
