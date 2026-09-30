"use client";
import { useState, useSyncExternalStore, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import AdminView from "../views/AdminView";
import { useViewport } from "../SiteChrome";
import { S } from "../style";
import { call } from "../admin/ui";
import MessagesPanel from "../admin/MessagesPanel";
import ConsultationsPanel from "../admin/ConsultationsPanel";
import ProjectsPanel from "../admin/ProjectsPanel";
import ToolsPanel from "../admin/ToolsPanel";
import { SERVICES, TINTS, type SiteProject, type ToolSettings } from "@/lib/site/data";
import type { Consultation, Inquiry } from "@/lib/site/store";

const TITLES: Record<string, string> = { overview: "Overview", inquiries: "Inquiries", messages: "Messages", consultations: "Consultations", projects: "Projects", tools: "AI tools", services: "Services and prices" };
const STATUS_BG: Record<string, string> = { New: "#B86CF9", Contacted: "#EAE3D6", Won: "#CFE8D2", Lost: "#F1D9D2" };

const noSub = () => () => {};
const localToday = () => new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

export default function AdminPage({ initialInquiries, initialConsultations, initialProjects, initialTools, runs, dbError }: {
  initialInquiries: Inquiry[]; initialConsultations: Consultation[]; initialProjects: SiteProject[]; initialTools: ToolSettings[]; runs: number; dbError: boolean;
}) {
  const router = useRouter();
  const { mobile: M } = useViewport();
  const [tab, setTab] = useState("overview");
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [consults, setConsults] = useState(initialConsultations);
  const [projects, setProjects] = useState(initialProjects);
  const [openQ, setOpenQ] = useState<number | null>(null);
  // Viewer's local date; empty during server render so hydration matches.
  const today = useSyncExternalStore(noSub, localToday, () => "");
  const [err, setErr] = useState(dbError ? "Could not load data from the database." : "");

  const fail = (e: unknown) => { if ((e as Error).message !== "auth") setErr((e as Error).message); };
  // Optimistic update with rollback if the server refuses.
  const mutateInq = async (next: Inquiry[], req: () => Promise<unknown>) => {
    const prev = inquiries; setInquiries(next);
    try { await req(); } catch (e) { setInquiries(prev); fail(e); }
  };
  const mutateCon = async (next: Consultation[], req: () => Promise<unknown>) => {
    const prev = consults; setConsults(next);
    try { await req(); } catch (e) { setConsults(prev); fail(e); }
  };
  const setRead = (id: number, read: boolean) => mutateInq(inquiries.map(x => (x.id === id ? { ...x, isRead: read } : x)), () => call("/api/site/admin/inquiries", "PATCH", { id, read }));
  const delInq = (id: number) => mutateInq(inquiries.filter(x => x.id !== id), () => call("/api/site/admin/inquiries", "DELETE", { id }));

  const inqRows = inquiries.map(q => ({
    ...q, date: q.date.slice(0, 10), services: q.services, sBg: STATUS_BG[q.status] || "#EAE3D6", open: openQ === q.id,
    expand: () => { setOpenQ(openQ === q.id ? null : q.id); if (!q.isRead) setRead(q.id, true); },
    onStatus: (e: ChangeEvent<HTMLSelectElement>) => { const status = e.target.value; mutateInq(inquiries.map(x => (x.id === q.id ? { ...x, status } : x)), () => call("/api/site/admin/inquiries", "PATCH", { id: q.id, status })); },
    remove: () => { if (confirm(`Delete the inquiry from ${q.name}?`)) delInq(q.id); },
  }));
  const newCount = inquiries.filter(q => q.status === "New").length;
  const unread = inquiries.filter(q => !q.isRead).length;
  const requested = consults.filter(c => c.status === "Requested").length;
  const visibleCount = projects.filter(p => p.visible).length;
  const tabs: [string, string, string][] = [
    ["overview", "Overview", ""], ["inquiries", "Inquiries", String(newCount)], ["messages", "Messages", unread ? String(unread) : ""],
    ["consultations", "Consultations", requested ? String(requested) : ""], ["projects", "Projects", String(visibleCount)], ["tools", "AI tools", ""], ["services", "Services and prices", ""],
  ];

  const extra =
    tab === "messages" ? <MessagesPanel items={inquiries} narrow={M} onRead={setRead} onDelete={delInq} />
    : tab === "consultations" ? <ConsultationsPanel items={consults}
        onStatus={(id, status) => mutateCon(consults.map(c => (c.id === id ? { ...c, status } : c)), () => call("/api/site/admin/consultations", "PATCH", { id, status }))}
        onDelete={id => mutateCon(consults.filter(c => c.id !== id), () => call("/api/site/admin/consultations", "DELETE", { id }))} />
    : tab === "projects" ? <ProjectsPanel items={projects} setItems={setProjects} onError={setErr} />
    : tab === "tools" ? <ToolsPanel items={initialTools} onError={setErr} />
    : null;

  const v = {
    go: { home: (e?: { preventDefault(): void }) => { e?.preventDefault(); router.push("/"); } },
    signOut: () => signOut({ callbackUrl: "/login" }),
    adminDir: M ? "column" : "row", asideDir: M ? "row" : "column", asideW: M ? "100%" : "260px", asideH: M ? "auto" : "100vh",
    adminTabs: tabs.map(([k, l, c]) => ({ label: l, count: c, bg: tab === k ? "#B86CF9" : "transparent", pick: () => setTab(k) })),
    tabTo: { inquiries: () => setTab("inquiries") },
    adminTitle: TITLES[tab], today,
    tabOverview: tab === "overview", tabInquiries: tab === "inquiries", tabProjects: false, tabServices: tab === "services",
    tabExtra: !!extra, extraContent: extra,
    stats: [
      { label: "New inquiries", value: newCount, bg: "#B86CF9" },
      { label: "Unread messages", value: unread, bg: "#FAF7F1" },
      { label: "Consultations to confirm", value: requested, bg: "#FAF7F1" },
      { label: "Projects on site", value: visibleCount, bg: "#FAF7F1" },
      { label: "AI tool runs", value: runs, bg: "#EAE3D6" },
    ],
    recent: inqRows.slice(0, 5), inquiryRows: inqRows, noInquiries: !inqRows.length,
    projectRows: projects.map((p, i) => ({ ...p, num: String(i + 1).padStart(2, "0"), tint: TINTS[i % TINTS.length] })),
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
