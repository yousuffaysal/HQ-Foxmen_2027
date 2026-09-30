"use client";
import { useState, type MouseEventHandler } from "react";
import { S } from "./style";

type Variant = "dark" | "purple" | "light" | "cream";

// Pill button from "foxmen new/Btn.dc.html": four variants, arrow disc rotates on hover.
const SKIN: Record<Variant, { a: string; disc: string }> = {
  dark: { a: "background:#1F1712;color:#F3EEE4;", disc: "background:#F3EEE4;color:#1F1712;" },
  purple: { a: "background:#B86CF9;color:#1F1712;", disc: "background:#1F1712;color:#F3EEE4;" },
  light: { a: "background:transparent;box-shadow:inset 0 0 0 1.5px #1F1712;color:#1F1712;", disc: "background:#1F1712;color:#F3EEE4;" },
  cream: { a: "background:#F3EEE4;color:#1F1712;", disc: "background:#1F1712;color:#F3EEE4;" },
};

export default function Btn({ label, variant = "dark", href = "#", onClick }: { label: string; variant?: string; href?: string; onClick?: MouseEventHandler<HTMLAnchorElement> }) {
  const [h, setH] = useState(false);
  const skin = SKIN[(variant as Variant)] ?? SKIN.dark;
  return (
    <a
      href={href}
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={S(`display:inline-flex;align-items:center;gap:18px;padding:6px 6px 6px 26px;border-radius:999px;${skin.a}text-decoration:none;font-family:Inter,sans-serif;font-weight:600;font-size:16px;letter-spacing:-0.01em;white-space:nowrap;cursor:pointer;${variant === "dark" ? "transition:transform .4s cubic-bezier(.2,.7,.2,1);" : ""}`)}
    >
      <span>{label}</span>
      <span style={S(`width:44px;height:44px;border-radius:999px;${skin.disc}display:flex;align-items:center;justify-content:center;flex:none;transition:transform .45s cubic-bezier(.2,.7,.2,1);transform:${h ? "rotate(45deg) scale(1.08)" : "none"};`)}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M9 7h8v8"></path></svg>
      </span>
    </a>
  );
}
