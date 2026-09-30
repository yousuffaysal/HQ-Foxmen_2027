"use client";
import { useState, type ChangeEvent, type KeyboardEvent } from "react";
import ToolsView from "../views/ToolsView";
import { useSite } from "../SiteChrome";
import { pickVals } from "../values";
import { AI_TOOLS, SERVICES, type ToolSettings } from "@/lib/site/data";
import ThinkingLoader from "../tools/ThinkingLoader";
import { useToolRun } from "../tools/useToolRun";
import { outBlocks } from "../tools/blocks";

// `settings` hides tools switched off in Admin → AI tools.
export default function ToolsPage({ settings }: { settings: ToolSettings[] }) {
  const { go, cur: currency, mobile: M, narrow, pendingTool, navigate } = useSite();
  const live = AI_TOOLS.filter(t => settings.find(x => x.id === t.id)?.enabled !== false);
  const usd = currency === "usd";
  // A tool picked on another page (home teaser) arrives as the initial selection.
  const [tool, setTool] = useState(() => (pendingTool && AI_TOOLS.some(x => x.id === pendingTool) ? pendingTool : "copy"));
  const [toolText, setToolText] = useState("");
  const [toolLen, setToolLen] = useState(1);
  const [pickOpen, setPickOpen] = useState(false);
  const [toolCat, setToolCat] = useState("All");
  const { out: toolOut, waiting, busy, run, reset } = useToolRun();
  const [copied, setCopied] = useState(false);
  const [est, setEst] = useState<number[]>([0]);

  const choose = (id: string) => { setTool(id); reset(); setPickOpen(false); };

  const runChat = () => {
    const text = toolText.trim();
    if (busy || !text) return;
    setCopied(false); setPickOpen(false);
    run({ tool, text, len: toolLen });
  };

  const t = AI_TOOLS.find(x => x.id === tool) || AI_TOOLS[0];
  const estSum = est.reduce((a, i) => ({ b: a.b + SERVICES[i].nb, u: a.u + SERVICES[i].nu }), { b: 0, u: 0 });
  // Each tool in the list opens its own product page.
  const use = (id: string) => () => { const x = AI_TOOLS.find(y => y.id === id)!; navigate(`/tools/${x.slug}`, x.name); };

  const v = {
    go,
    curTool: { name: t.name, desc: t.desc, short: t.name.replace(/ (Writer|Generator|Builder|Helper|Ideas|Checkup)$/, ""), num: String(AI_TOOLS.indexOf(t) + 1).padStart(2, "0"), ph: "e.g. " + (t.fields || []).map(f => f.ph).join(". ") },
    toolText, onToolText: (e: ChangeEvent<HTMLTextAreaElement>) => setToolText(e.target.value),
    onToolKey: (e: KeyboardEvent) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); runChat(); } },
    runChat: () => runChat(), notBusy: !busy, toolBusy: busy,
    sendBg: toolText.trim() || busy ? "#1F1712" : "#EAE3D6", sendFg: toolText.trim() || busy ? "#F3EEE4" : "#8F8278",
    pickOpen, togglePick: () => setPickOpen(o => !o), pickBg: pickOpen ? "#EAE3D6" : "#F3EEE4", pickRot: pickOpen ? "rotate(180deg)" : "none",
    pickList: live.map((x, i) => ({ name: x.name, cat: x.cat, num: String(i + 1).padStart(2, "0"), bg: tool === x.id ? "#EAE3D6" : "transparent", pick: () => choose(x.id) })),
    quickTools: ["copy", "ads", "social", "reply"].map(id => { const x = AI_TOOLS.find(y => y.id === id)!; const on = tool === id; return { name: x.name, bg: on ? "#1F1712" : "transparent", fg: on ? "#F3EEE4" : "#1F1712", pick: () => choose(id) }; }),
    lenLabel: ["Short", "Standard", "Detailed"][toolLen], cycleLen: () => setToolLen(l => (l + 1) % 3),
    lenBars: [6, 10, 14].map((h, i) => ({ h: h + "px", o: i <= toolLen ? 1 : 0.3 })),
    hasOut: !!toolOut, outBlocks: outBlocks(toolOut),
    showLoader: waiting, loaderNode: <ThinkingLoader tool={tool} />,
    copyLabel: copied ? "Copied" : "Copy",
    copyOut: () => { navigator.clipboard?.writeText(toolOut).catch(() => {}); setCopied(true); },
    aiCount: String(live.length),
    libCols: narrow ? "minmax(0,1fr)" : M ? "40px minmax(0,1fr) minmax(0,1fr) auto" : "48px minmax(0,1.1fr) minmax(0,1fr) auto",
    aiOffers: [{ n: "01", t: "AI chatbots for your website", d: "An assistant that answers your customers 24/7 in their language, trained on your business." }, { n: "02", t: "AI agents for routine work", d: "Agents that handle bookings, orders, follow-ups and reports so your team can focus." }, { n: "03", t: "Custom AI tools", d: "Tools like these, built around your own data and workflow, inside your website or app." }],
    toolCats: ["All", "Writing", "Marketing", "Business", "AI", "Language"].map(f => ({ label: f, ...pickVals(toolCat, f, setToolCat) })),
    toolList: live.filter(x => toolCat === "All" || x.cat === toolCat).map(x => ({ ...x, num: String(AI_TOOLS.indexOf(x) + 1).padStart(2, "0"), use: use(x.id) })),
    estRows: SERVICES.map((s, i) => { const on = est.includes(i); return { title: s.title, price: usd ? s.usd : s.bdt, bg: on ? "#B86CF9" : "#FAF7F1", box: on ? "#1F1712" : "transparent", toggle: () => setEst(on ? est.filter(x => x !== i) : [...est, i]) }; }),
    estTotal: est.length ? `BDT ${estSum.b.toLocaleString("en-IN")}  |  USD ${estSum.u.toLocaleString("en-US")}` : "Pick a service",
  };
  return <ToolsView v={v} />;
}
