"use client";
import { useEffect, useState } from "react";
import { S } from "../style";

// Waiting state for AI work: a liquid orb, tool-specific status lines, a timer and skeleton lines.
const ACTIONS: Record<string, string> = {
  copy: "Writing your headline and sections", seo: "Crafting titles and descriptions", prod: "Writing in English and Bangla",
  name: "Brainstorming names", faq: "Drafting questions and answers", tr: "Translating naturally", social: "Writing your posts",
  reply: "Drafting a calm reply", brief: "Structuring your brief", ads: "Writing ad headlines", audit: "Checking your homepage",
  chat: "Isaac is thinking",
};

export default function ThinkingLoader({ tool, dark = false, compact = false }: { tool: string; dark?: boolean; compact?: boolean }) {
  const steps = tool === "chat" ? ["Isaac is thinking", "Checking our details", "Writing a reply"] : ["Reading your details", ACTIONS[tool] || "Working on it", "Polishing the wording", "Almost there"];
  const [i, setI] = useState(0);
  const [ms, setMs] = useState(0);
  useEffect(() => {
    const t0 = performance.now();
    const a = setInterval(() => setI(x => Math.min(x + 1, steps.length - 1)), 1700);
    const b = setInterval(() => setMs(performance.now() - t0), 100);
    return () => { clearInterval(a); clearInterval(b); };
  }, [steps.length]);

  const fg = dark ? "#F3EEE4" : "#1F1712", sub = dark ? "rgba(243,238,228,.6)" : "#8F8278";
  const bar = dark ? "rgba(243,238,228,.08)" : "rgba(31,23,18,.07)";
  return (
    <div role="status" aria-live="polite" style={S(`display:flex;flex-direction:column;gap:${compact ? 10 : 18}px;padding:${compact ? "12px 14px" : "22px"};border-radius:18px;background:${dark ? "rgba(243,238,228,.06)" : "#F3EEE4"};color:${fg};`)}>
      <div style={S("display:flex;align-items:center;gap:16px;")}>
        <span className="fx-orb" style={S(`width:${compact ? 30 : 52}px;height:${compact ? 30 : 52}px;`)}><span className="fx-orb-core" /></span>
        <div style={S("min-width:0;flex:1;")}>
          <div key={i} className="fx-fadeup" style={S(`font-size:${compact ? 14 : 17}px;font-weight:700;letter-spacing:-0.02em;`)}>{steps[i]}<span className="fx-ellipsis" /></div>
          {!compact ? <div style={S(`font-family:'JetBrains Mono',monospace;font-size:12px;color:${sub};margin-top:4px;`)}>{(ms / 1000).toFixed(1)}s · Foxmen AI</div> : null}
        </div>
      </div>
      {!compact ? (
        <>
          <div style={S(`height:3px;border-radius:999px;background:${bar};overflow:hidden;`)}><div className="fx-indet" /></div>
          <div style={S("display:flex;flex-direction:column;gap:10px;")}>
            {[92, 78, 64].map(w => <div key={w} className="fx-shimmer" style={S(`height:12px;width:${w}%;border-radius:999px;background-color:${bar};`)} />)}
          </div>
        </>
      ) : null}
    </div>
  );
}
