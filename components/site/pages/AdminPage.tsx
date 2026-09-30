"use client";
import { useState, useSyncExternalStore, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import AdminView from "../views/AdminView";
import { useViewport } from "../SiteChrome";
import { S } from "../style";
import { projectVals } from "../values";
import { SERVICES, slug } from "@/lib/site/data";
import type { Inquiry } from "@/lib/site/store";

const TITLES: Record<string, string> = { overview: "Overview", inquiries: "Inquiries", projects: "Projects", services: "Services and prices" };
const STATUS_BG: Record<string, string> = { New: "#B86CF9", Contacted: "#EAE3D6", Won: "#CFE8D2", Lost: "#F1D9D2" };

const noSub = () => () => {};
const localToday = () => new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

async function call(url: string, method: string, body: unknown) {
  const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (r.status === 401 || r.status === 403) { window.location.href = "/login?from=/admin"; throw new Error("auth"); }
  if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || "Request failed");
  return r.json();
}

export default function AdminPage({ initialInquiries, initialHidden, runs, dbError }: { initialInquiries: Inquiry[]; initialHidden: string[]; runs: number; dbError: boolean }) {
  const router = useRouter();
  const { mobile: M } = useViewport();
  const [tab, setTab] = useState("overview");
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [hidden, setHidden] = useState(initialHidden);
  const [openQ, setOpenQ] = useState<number | null>(null);
  // Viewer's local date; empty during server render so hydration matches.
  const today = useSyncExternalStore(noSub, localToday, () => "");
  const [err, setErr] = useState(dbError ? "Could not load inquiries from the database." : "");

  // Optimistic update with rollback if the server refuses.
  const mutate = async (next: Inquiry[], req: () => Promise<unknown>) => {
    const prev = inquiries;
    setInquiries(next);
    try { await req(); setErr(""); } catch (e) { setInquiries(prev); if ((e as Error).message !== "auth") setErr((e as Error).message); }
  };

  const proj = projectVals();
  const visible = proj.filter(p => !hidden.includes(slug(p.name)));
  const inqRows = inquiries.map(q => ({
    ...q, sBg: STATUS_BG[q.status] || "#EAE3D6", open: openQ === q.id,
    expand: () => setOpenQ(openQ === q.id ? null : q.id),
    onStatus: (e: ChangeEvent<HTMLSelectElement>) => { const status = e.target.value; mutate(inquiries.map(x => (x.id === q.id ? { ...x, status } : x)), () => call("/api/site/admin/inquiries", "PATCH", { id: q.id, status })); },
    remove: () => { if (confirm(`Delete the inquiry from ${q.name}?`)) mutate(inquiries.filter(x => x.id !== q.id), () => call("/api/site/admin/inquiries", "DELETE", { id: q.id })); },
  }));
  const newCount = inquiries.filter(q => q.status === "New").length;
  const tabs: [string, string, string][] = [["overview", "Overview", ""], ["inquiries", "Inquiries", String(newCount)], ["projects", "Projects", String(visible.length)], ["services", "Services and prices", ""]];

  const v = {
    go: { home: (e?: { preventDefault(): void }) => { e?.preventDefault(); router.push("/"); } },
    signOut: () => signOut({ callbackUrl: "/login" }),
    adminDir: M ? "column" : "row", asideDir: M ? "row" : "column", asideW: M ? "100%" : "260px", asideH: M ? "auto" : "100vh",
    adminTabs: tabs.map(([k, l, c]) => ({ label: l, count: c, bg: tab === k ? "#B86CF9" : "transparent", pick: () => setTab(k) })),
    tabTo: { inquiries: () => setTab("inquiries") },
    adminTitle: TITLES[tab], today,
    tabOverview: tab === "overview", tabInquiries: tab === "inquiries", tabProjects: tab === "projects", tabServices: tab === "services",
    stats: [
      { label: "New inquiries", value: newCount, bg: "#B86CF9" },
      { label: "Total inquiries", value: inquiries.length, bg: "#FAF7F1" },
      { label: "Projects on site", value: visible.length, bg: "#FAF7F1" },
      { label: "AI tool runs", value: runs, bg: "#EAE3D6" },
    ],
    recent: inqRows.slice(0, 5), inquiryRows: inqRows, noInquiries: !inqRows.length,
    projectRows: proj.map(p => {
      const s = slug(p.name), on = !hidden.includes(s);
      return {
        ...p, visLabel: on ? "Visible" : "Hidden", trackBg: on ? "#1F1712" : "rgba(31,23,18,.2)", knob: on ? "translateX(22px)" : "none",
        toggle: async () => {
          const prev = hidden, next = on ? [...hidden, s] : hidden.filter(x => x !== s);
          setHidden(next);
          try { const d = await call("/api/site/admin/projects", "PUT", { hidden: next }); setHidden(d.hidden); setErr(""); }
          catch (e) { setHidden(prev); if ((e as Error).message !== "auth") setErr((e as Error).message); }
        },
      };
    }),
    adminServices: SERVICES.map(s => ({ ...s, featureCount: s.features.length })),
  };

  return (
    <div style={S("font-family:Inter,sans-serif;background:#F3EEE4;color:#1F1712;min-height:100vh;overflow-x:clip;")}>
      {err ? (
        <div role="alert" style={S("position:fixed;left:50%;bottom:20px;transform:translateX(-50%);z-index:80;padding:12px 18px;border-radius:999px;background:#1F1712;color:#F3EEE4;font-size:14px;font-weight:600;box-shadow:0 20px 40px rgba(31,23,18,.2);")}>
          {err} <button onClick={() => setErr("")} style={S("margin-left:10px;border:none;background:#B86CF9;color:#1F1712;border-radius:999px;padding:4px 10px;cursor:pointer;font-weight:600;")}>OK</button>
        </div>
      ) : null}
      <AdminView v={v} />
    </div>
  );
}
