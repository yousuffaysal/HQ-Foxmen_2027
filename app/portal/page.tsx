"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getPusherClient } from "@/lib/pusher";
import PortalProjectPanel from "@/components/PortalProjectPanel";

type Milestone = { id: number; title: string; status: string; description: string; due_date: string; completed_at: string | null };
type Project = {
  id: number; title: string; service_type: string; status: string;
  description: string; budget: string; timeline: string; website: string;
  admin_note: string; created_at: string; updated_at: string;
  milestones: Milestone[];
};
type Offer = { id: number; title: string; description: string; price: string; status: string; created_at: string };
type Notification = { id: number; type: string; title: string; body: string; link: string; read: boolean; created_at: string };

const STATUS_COLOR: Record<string, string> = {
  pending: "#f59e0b", in_progress: "#b86cf9", review: "#3b82f6",
  completed: "#22c55e", on_hold: "var(--pt-muted)",
};
const STATUS_LABEL: Record<string, string> = {
  pending: "Pending", in_progress: "In Progress", review: "In Review",
  completed: "Completed", on_hold: "On Hold",
};

export default function PortalPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState<"dashboard" | "projects" | "offers" | "notifications" | "settings">("dashboard");
  const [projects, setProjects] = useState<Project[]>([]);
  const [offers,   setOffers]   = useState<Offer[]>([]);
  const [notifs,   setNotifs]   = useState<Notification[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // adjustable sidebar
  const [sidebarW,  setSidebarW]  = useState(248);
  const [collapsed, setCollapsed] = useState(false);
  const [draggingSb, setDraggingSb] = useState(false);

  // side panel
  const [sidePanel,    setSidePanel]    = useState<Project | null>(null);
  const [sidePanelTab, setSidePanelTab] = useState<"details" | "milestones" | "chat">("details");

  // topbar dropdowns
  const [chatDrop,  setChatDrop]  = useState(false);
  const [notifDrop, setNotifDrop] = useState(false);
  const chatDropRef  = useRef<HTMLDivElement>(null);
  const notifDropRef = useRef<HTMLDivElement>(null);

  // project unread chat counts
  const [projectUnreads, setProjectUnreads] = useState<Record<number, number>>({});

  // new project modal
  const [showNew,    setShowNew]    = useState(false);
  const [form,       setForm]       = useState({ title: "", service_type: "", description: "", budget: "", timeline: "", website: "" });
  const [submitting, setSubmitting] = useState(false);

  // settings
  const [settingName,      setSettingName]      = useState("");
  const [settingSaving,    setSettingSaving]    = useState(false);
  const [foxId,            setFoxId]            = useState<string | null>(null);
  const [settingAvatar,    setSettingAvatar]    = useState("");
  const [avatarUploading,  setAvatarUploading]  = useState(false);
  const [settingPwOld,     setSettingPwOld]     = useState("");
  const [settingPwNew,     setSettingPwNew]     = useState("");
  const [settingPwMsg,     setSettingPwMsg]     = useState("");

  const loadData = useCallback(async () => {
    const [pRes, oRes, nRes] = await Promise.all([
      fetch("/api/portal/projects"),
      fetch("/api/portal/offers"),
      fetch("/api/portal/notifications"),
    ]);
    if (pRes.ok) setProjects(await pRes.json());
    if (oRes.ok) setOffers(await oRes.json());
    if (nRes.ok) setNotifs(await nRes.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/login"); return; }
    if (status === "authenticated") {
      loadData();
      setSettingName(session.user?.name ?? "");
      fetch("/api/auth/profile").then(r => r.json()).then((d: { fox_id?: string; avatar?: string }) => {
        if (d.fox_id) setFoxId(d.fox_id);
        if (d.avatar) setSettingAvatar(d.avatar);
      }).catch(() => {});
    }
  }, [status, router, loadData, session]);

  // Pusher — notifications + project messages
  useEffect(() => {
    if (!session?.user) return;
    const uid = (session.user as { id?: string }).id;
    const pusher = getPusherClient();
    if (!pusher) return;
    const ch = pusher.subscribe(`private-user-${uid}`);
    ch.bind("notification", (data: Omit<Notification, "id" | "read" | "created_at">) => {
      setNotifs(prev => [{ ...data, id: Date.now(), read: false, created_at: new Date().toISOString() } as Notification, ...prev]);
    });
    return () => pusher.unsubscribe(`private-user-${uid}`);
  }, [session]);

  // Shift SiteLiveChat FAB when side panel is open
  useEffect(() => {
    if (sidePanel) {
      document.body.setAttribute("data-panel-open", "true");
    } else {
      document.body.removeAttribute("data-panel-open");
    }
    return () => document.body.removeAttribute("data-panel-open");
  }, [sidePanel]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (chatDropRef.current && !chatDropRef.current.contains(e.target as Node)) setChatDrop(false);
      if (notifDropRef.current && !notifDropRef.current.contains(e.target as Node)) setNotifDrop(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!document.getElementById("portal-mobile-css")) {
      const s = document.createElement("style");
      s.id = "portal-mobile-css";
      s.textContent = `
        .pt-root{
          --accent:#B86CF9;
          --accent-deep:color-mix(in srgb,#B86CF9,#2B1146 32%);
          --accent-soft:color-mix(in srgb,#B86CF9,#fff 76%);
          --accent-mist:color-mix(in srgb,#B86CF9,#fff 90%);
          --side-bg:#17121D;
          --pt-ink:#1A1523; --pt-muted:#6E6580; --pt-muted2:#8E82A3;
          --pt-line:#EFEAF6; --pt-line2:#F1ECF8; --pt-field:#FAF8FD;
        }
        @keyframes ptSlideIn{from{transform:translateX(-100%)}to{transform:translateX(0)}}
        @keyframes ptFadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
        @keyframes ptPop{from{opacity:0;transform:scale(.97) translateY(-4px)}to{opacity:1;transform:none}}
        @keyframes ptRise{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
        @keyframes ptGrowBar{from{width:0}}
        @keyframes ptGlow{0%,100%{box-shadow:0 0 0 0 rgba(184,108,249,.45)}50%{box-shadow:0 0 0 8px rgba(184,108,249,0)}}
        .pt-mob-drawer{animation:ptSlideIn .26s cubic-bezier(.22,1,.36,1) both}
        .pt-view{animation:ptRise .42s cubic-bezier(.22,1,.36,1) both}
        .pt-stat{animation:ptRise .5s cubic-bezier(.22,1,.36,1) both}
        .pt-rise{animation:ptRise .55s cubic-bezier(.22,1,.36,1) both}
        .pt-drop{animation:ptPop .18s cubic-bezier(.22,1,.36,1) both;transform-origin:top right}
        .pt-modal{animation:ptPop .22s cubic-bezier(.22,1,.36,1) both}
        .pt-sidebar{transition:width .34s cubic-bezier(.22,1,.36,1)}
        .pt-sidebar.pt-dragging{transition:none;user-select:none}
        .pt-navbtn{transition:background .18s cubic-bezier(.22,1,.36,1),color .18s,filter .18s}
        .pt-navbtn:hover{filter:brightness(1.18)}
        .pt-card{transition:transform .3s cubic-bezier(.22,1,.36,1),border-color .2s,box-shadow .3s}
        .pt-card:hover{transform:translateY(-3px);box-shadow:0 16px 32px -18px rgba(43,17,70,.28)}
        .pt-gbtn{background:linear-gradient(135deg,var(--accent),var(--accent-deep));color:#fff;border:none;box-shadow:0 6px 16px -6px rgba(140,70,220,.55);transition:filter .15s,transform .15s;cursor:pointer}
        .pt-gbtn:hover{filter:brightness(1.09)}
        .pt-gbtn:active{transform:scale(.98)}
        .pt-obtn{background:#fff;border:1px solid #E7DFF2;color:var(--pt-ink);transition:border-color .15s,color .15s;cursor:pointer}
        .pt-obtn:hover{border-color:var(--accent);color:var(--accent-deep)}
        .pt-press{transition:transform .12s ease}
        .pt-press:active{transform:scale(.95)}
        .pt-serif{font-family:var(--f-display);font-weight:400;letter-spacing:-.015em}
        .pt-resize{position:absolute;top:0;right:-3px;width:7px;height:100%;cursor:col-resize;z-index:60}
        .pt-resize::after{content:"";position:absolute;top:50%;right:2px;transform:translateY(-50%);width:3px;height:34px;border-radius:3px;background:rgba(255,255,255,.14);transition:background .2s,height .2s}
        .pt-resize:hover::after{background:rgba(184,108,249,.85);height:52px}
      `;
      document.head.appendChild(s);
    }
    function check() { setIsMobile(window.innerWidth <= 768); }
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // load + persist sidebar prefs
  useEffect(() => {
    const w = Number(localStorage.getItem("pt-sidebar-w"));
    if (w >= 208 && w <= 360) setSidebarW(w);
    if (localStorage.getItem("pt-sidebar-collapsed") === "1") setCollapsed(true);
  }, []);
  useEffect(() => { localStorage.setItem("pt-sidebar-w", String(sidebarW)); }, [sidebarW]);
  useEffect(() => { localStorage.setItem("pt-sidebar-collapsed", collapsed ? "1" : "0"); }, [collapsed]);

  const unread        = notifs.filter(n => !n.read).length;
  const pendingOffers = offers.filter(o => o.status === "pending");
  const activeProjects= projects.filter(p => p.status === "in_progress" || p.status === "review");
  const user          = session?.user as { name?: string; email?: string; id?: string; role?: string } | undefined;
  const initials      = (user?.name ?? "U").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  const totalChatUnread = Object.values(projectUnreads).reduce((a, b) => a + b, 0);

  async function markAllRead() {
    await fetch("/api/portal/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ read_all: true }) });
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  }

  async function submitProject(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch("/api/portal/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) {
      const proj = await res.json();
      setProjects(prev => [{ ...proj, milestones: [] }, ...prev]);
      setShowNew(false);
      setForm({ title: "", service_type: "", description: "", budget: "", timeline: "", website: "" });
    }
    setSubmitting(false);
  }

  async function respondOffer(id: number, s: "accepted" | "declined") {
    await fetch("/api/portal/offers", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status: s }) });
    setOffers(prev => prev.map(o => o.id === id ? { ...o, status: s } : o));
  }

  function openProjectPanel(p: Project, t: "details" | "milestones" | "chat" = "details") {
    setSidePanel(p);
    setSidePanelTab(t);
    if (t === "chat") setProjectUnreads(prev => ({ ...prev, [p.id]: 0 }));
  }

  function handleUnread(projectId: number, count: number) {
    setProjectUnreads(prev => ({ ...prev, [projectId]: (prev[projectId] ?? 0) + count }));
  }

  function startSidebarResize(e: React.MouseEvent) {
    e.preventDefault();
    setDraggingSb(true);
    const move = (ev: MouseEvent) => setSidebarW(Math.min(360, Math.max(208, ev.clientX)));
    const up = () => {
      setDraggingSb(false);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      document.body.style.userSelect = "";
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    document.body.style.userSelect = "none";
  }

  if (status === "loading" || loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#17121D" }}>
      <div style={{ color: "rgba(255,255,255,.3)", fontSize: 14 }}>Loading…</div>
    </div>
  );

  const navItems = [
    { key: "dashboard",     label: "Dashboard",      icon: <IconDashboard /> },
    { key: "projects",      label: "Projects",        icon: <IconProjects />,      badge: activeProjects.length || undefined },
    { key: "offers",        label: "Offers",          icon: <IconOffers />,        badge: pendingOffers.length || undefined },
    { key: "notifications", label: "Notifications",   icon: <IconBell />,          badge: unread || undefined },
    { key: "settings",      label: "Settings",        icon: <IconSettings /> },
  ];

  return (
    <div className="pt-root" style={{ display: "flex", minHeight: "100vh", height: isMobile ? "auto" : "100vh", gap: isMobile ? 0 : 14, padding: isMobile ? 0 : 14, boxSizing: "border-box", overflow: isMobile ? "visible" : "hidden", background: "#f8f8f8", fontFamily: "var(--f-sans)", color: "var(--pt-ink)" }}>

      {/* ── SIDEBAR ── */}
      <aside className={`pt-sidebar${draggingSb ? " pt-dragging" : ""}${collapsed ? " pt-collapsed" : ""}`} style={{ width: collapsed ? 74 : sidebarW, background: "var(--side-bg)", color: "#fff", display: isMobile ? "none" : "flex", flexDirection: "column", position: "relative", borderRadius: 22, flexShrink: 0, zIndex: 50 }}>
        {/* Brand */}
        <div style={{ padding: collapsed ? "22px 0 18px" : "22px 20px 18px", borderBottom: "1px solid rgba(255,255,255,.07)", display: "flex", justifyContent: collapsed ? "center" : "flex-start" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <img src="/assets/logo-mark.svg" alt="Foxmen" style={{ width: 34, height: 34, flexShrink: 0 }} />
            {!collapsed && (
              <div>
                <div style={{ fontWeight: 600, fontSize: 20, color: "#fff", fontFamily: "var(--f-display)", letterSpacing: "-.01em", whiteSpace: "nowrap", lineHeight: 1.1 }}>
                  Foxmen <em style={{ fontStyle: "italic", color: "#b86cf9" }}>Studio</em>
                </div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,.35)", letterSpacing: ".18em", textTransform: "uppercase", marginTop: 2 }}>Client Portal</div>
              </div>
            )}
          </a>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: collapsed ? "14px 8px" : "14px 10px", display: "flex", flexDirection: "column", gap: 2, overflowY: "auto", overflowX: "hidden" }}>
          {!collapsed && <div style={{ fontSize: 10.5, color: "rgba(255,255,255,.3)", letterSpacing: ".18em", textTransform: "uppercase", padding: "10px 10px 6px" }}>Menu</div>}
          {navItems.map(item => (
            <button key={item.key} className="pt-navbtn" onClick={() => setTab(item.key as typeof tab)} title={collapsed ? item.label : undefined}
              style={{ display: "flex", alignItems: "center", gap: 11, padding: collapsed ? "11px 0" : "11px 13px", justifyContent: collapsed ? "center" : "flex-start", borderRadius: 12, border: "none", cursor: "pointer", fontSize: 14.5, fontWeight: tab === item.key ? 600 : 500, width: "100%", textAlign: "left", background: tab === item.key ? "linear-gradient(135deg,var(--accent),var(--accent-deep))" : "transparent", color: tab === item.key ? "#fff" : "#B7ABC9", boxShadow: tab === item.key ? "0 8px 20px -6px rgba(140,70,220,.5)" : "none", position: "relative" }}>
              <span style={{ opacity: 0.92, flexShrink: 0, display: "flex" }}>{item.icon}</span>
              {!collapsed && <span style={{ flex: 1 }}>{item.label}</span>}
              {item.badge ? (
                collapsed
                  ? <span style={{ position: "absolute", top: 6, right: 13, width: 7, height: 7, borderRadius: "50%", background: "#b86cf9" }} />
                  : <span style={{ background: "linear-gradient(135deg,var(--accent),var(--accent-deep))", color: "#fff", fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 50, minWidth: 18, textAlign: "center" }}>{item.badge}</span>
              ) : null}
            </button>
          ))}

          {projects.length > 0 && !collapsed && (
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 10.5, color: "rgba(255,255,255,.3)", letterSpacing: ".18em", textTransform: "uppercase", padding: "10px 10px 6px" }}>Projects</div>
              {projects.slice(0, 5).map(p => (
                <button key={p.id} className="pt-navbtn" onClick={() => openProjectPanel(p)}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 12px", borderRadius: 8, border: "none", cursor: "pointer", width: "100%", textAlign: "left", background: "transparent" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,.05)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: STATUS_COLOR[p.status] ?? "#888", flexShrink: 0 }} />
                  <span style={{ fontSize: 14, color: "rgba(255,255,255,.55)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{p.title}</span>
                  {(projectUnreads[p.id] ?? 0) > 0 && <span style={{ background: "linear-gradient(135deg,var(--accent),var(--accent-deep))", color: "#fff", fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 50 }}>{projectUnreads[p.id]}</span>}
                </button>
              ))}
            </div>
          )}
        </nav>

        {/* Collapse toggle */}
        <div style={{ padding: collapsed ? "8px" : "8px 10px", borderTop: "1px solid rgba(255,255,255,.07)" }}>
          <button className="pt-navbtn" onClick={() => setCollapsed(c => !c)} title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            style={{ display: "flex", alignItems: "center", gap: 11, padding: collapsed ? "10px 0" : "10px 12px", justifyContent: collapsed ? "center" : "flex-start", borderRadius: 10, border: "none", cursor: "pointer", color: "rgba(255,255,255,.5)", fontSize: 14, fontWeight: 500, width: "100%", background: "transparent" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ flexShrink: 0, transform: collapsed ? "rotate(180deg)" : "none", transition: "transform .34s cubic-bezier(.22,1,.36,1)" }}><path d="M15 18l-6-6 6-6"/></svg>
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>

        {/* Home link */}
        <div style={{ padding: collapsed ? "0 8px 8px" : "0 10px 8px" }}>
          <a href="/" className="pt-navbtn" title={collapsed ? "Back to website" : undefined}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: collapsed ? "9px 0" : "9px 12px", justifyContent: collapsed ? "center" : "flex-start", borderRadius: 10, textDecoration: "none", color: "rgba(255,255,255,.5)", fontSize: 14, fontWeight: 500 }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,.06)"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,.5)"; }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ flexShrink: 0, opacity: 0.7 }}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            {!collapsed && "Back to website"}
          </a>
        </div>

        {/* User footer */}
        <div style={{ padding: collapsed ? "12px 0" : "12px 16px", borderTop: "1px solid rgba(255,255,255,.07)", display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, overflow: "hidden", background: "#b86cf9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>
            {settingAvatar
              ? <img src={settingAvatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : initials}
          </div>
          {!collapsed && (
            <>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 500, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.name}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,.35)", fontFamily: "var(--f-mono)", letterSpacing: ".04em" }}>{foxId ?? (user?.role ?? "client")}</div>
              </div>
              <button onClick={() => signOut({ callbackUrl: "/login" })} title="Sign out" className="pt-press"
                style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,.3)", padding: 4, borderRadius: 6, transition: "color .15s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,.3)")}>
                <IconSignOut />
              </button>
            </>
          )}
        </div>

        {/* Resize handle */}
        {!collapsed && <div className="pt-resize" onMouseDown={startSidebarResize} title="Drag to resize" />}
      </aside>

      {/* ── MAIN ── */}
      <main style={{ flex: 1, minWidth: 0, minHeight: 0, display: "flex", flexDirection: "column" }}>

        {/* ── TOPBAR ── */}
        <header style={{ background: "transparent", padding: isMobile ? "10px 14px" : "6px 10px 6px 4px", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          {isMobile && (
            <button onClick={() => setMobileSidebarOpen(o => !o)}
              style={{ width: 40, height: 40, borderRadius: "50%", background: "#fff", border: "1px solid var(--pt-line)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#4A4059", flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: isMobile ? 16 : 12, fontWeight: isMobile ? 600 : 500, color: isMobile ? "var(--pt-ink)" : "var(--pt-muted2)", letterSpacing: isMobile ? "0" : ".24em", textTransform: isMobile ? "none" : "uppercase" }}>
              {navItems.find(n => n.key === tab)?.label}
            </div>
          </div>

          {/* Action buttons */}
          {tab === "projects" && (
            <button onClick={() => setShowNew(true)} className="pt-gbtn"
              style={{ display: "flex", alignItems: "center", gap: 6, borderRadius: 999, padding: "10px 20px", fontSize: 14, fontWeight: 600, fontFamily: "inherit" }}>
              <span style={{ fontSize: 17, lineHeight: 1 }}>+</span> New Project
            </button>
          )}
          {tab === "notifications" && unread > 0 && (
            <button onClick={markAllRead} style={{ fontSize: 13, color: "var(--accent-deep)", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
              Mark all read
            </button>
          )}

          {/* Chat icon */}
          <div ref={chatDropRef} style={{ position: "relative" }}>
            <button onClick={() => { setChatDrop(o => !o); setNotifDrop(false); }}
              style={{ width: 40, height: 40, borderRadius: "50%", background: "#fff", border: `1px solid ${chatDrop ? "var(--accent)" : "var(--pt-line)"}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: chatDrop ? "var(--accent-deep)" : "#4A4059", position: "relative", transition: "all .15s" }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              {totalChatUnread > 0 && (
                <span style={{ position: "absolute", top: -3, right: -3, width: 16, height: 16, borderRadius: "50%", background: "linear-gradient(135deg,var(--accent),var(--accent-deep))", color: "#fff", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff" }}>
                  {totalChatUnread > 9 ? "9+" : totalChatUnread}
                </span>
              )}
            </button>
            {chatDrop && (
              <div className="pt-drop" style={{ position: "absolute", right: 0, top: 44, width: 300, background: "#fff", borderRadius: 14, boxShadow: "0 8px 40px rgba(0,0,0,.14)", border: "1px solid var(--pt-line)", zIndex: 100, overflow: "hidden" }}>
                <div style={{ padding: "12px 16px 8px", fontSize: 11, fontWeight: 600, color: "var(--pt-muted2)", letterSpacing: ".1em", textTransform: "uppercase" }}>Project Chats</div>
                {projects.length === 0 ? (
                  <div style={{ padding: "16px", fontSize: 13, color: "var(--pt-muted2)", textAlign: "center" }}>No projects yet</div>
                ) : projects.map(p => (
                  <button key={p.id} onClick={() => { openProjectPanel(p, "chat"); setChatDrop(false); }}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", border: "none", background: "none", cursor: "pointer", textAlign: "left", borderTop: "1px solid #f0ede8", transition: "background .1s" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#faf5ff")}
                    onMouseLeave={e => (e.currentTarget.style.background = "none")}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: STATUS_COLOR[p.status] ?? "#888", flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: "var(--pt-ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</span>
                    {(projectUnreads[p.id] ?? 0) > 0 && <span style={{ background: "linear-gradient(135deg,var(--accent),var(--accent-deep))", color: "#fff", fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 50 }}>{projectUnreads[p.id]}</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notification bell */}
          <div ref={notifDropRef} style={{ position: "relative" }}>
            <button onClick={() => { setNotifDrop(o => !o); setChatDrop(false); }}
              style={{ width: 40, height: 40, borderRadius: "50%", background: "#fff", border: `1px solid ${notifDrop ? "var(--accent)" : "var(--pt-line)"}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: notifDrop ? "var(--accent-deep)" : "#4A4059", position: "relative", transition: "all .15s" }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></svg>
              {unread > 0 && (
                <span style={{ position: "absolute", top: -3, right: -3, width: 16, height: 16, borderRadius: "50%", background: "#e11d48", color: "#fff", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff" }}>
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </button>
            {notifDrop && (
              <div className="pt-drop" style={{ position: "absolute", right: 0, top: 44, width: 320, background: "#fff", borderRadius: 14, boxShadow: "0 8px 40px rgba(0,0,0,.14)", border: "1px solid var(--pt-line)", zIndex: 100, overflow: "hidden" }}>
                <div style={{ padding: "12px 16px 8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "var(--pt-muted2)", letterSpacing: ".1em", textTransform: "uppercase" }}>Notifications</span>
                  {unread > 0 && <button onClick={() => { markAllRead(); setNotifDrop(false); }} style={{ fontSize: 11, color: "#b86cf9", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>Mark all read</button>}
                </div>
                {notifs.length === 0 ? (
                  <div style={{ padding: "16px", fontSize: 13, color: "var(--pt-muted2)", textAlign: "center" }}>All caught up</div>
                ) : notifs.slice(0, 6).map(n => (
                  <a key={n.id} href={n.link || "#"}
                    onClick={() => { if (!n.read) { fetch("/api/portal/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: n.id }) }); setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x)); } setNotifDrop(false); }}
                    style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 16px", borderTop: "1px solid #f0ede8", textDecoration: "none", background: n.read ? "#fff" : "#faf5ff", transition: "background .1s" }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: n.read ? "var(--pt-line)" : "#b86cf9", flexShrink: 0, marginTop: 5 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12.5, fontWeight: n.read ? 400 : 600, color: "var(--pt-ink)" }}>{n.title}</div>
                      {n.body && <div style={{ fontSize: 11.5, color: "var(--pt-muted2)", marginTop: 1 }}>{n.body}</div>}
                    </div>
                    <div style={{ fontSize: 10.5, color: "#b0b0b0", flexShrink: 0 }}>{new Date(n.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
                  </a>
                ))}
                {notifs.length > 6 && (
                  <button onClick={() => { setTab("notifications"); setNotifDrop(false); }} style={{ width: "100%", padding: "10px", background: "#fafaf8", border: "none", borderTop: "1px solid #f0ede8", fontSize: 12, color: "#b86cf9", fontWeight: 500, cursor: "pointer" }}>
                    View all {notifs.length} notifications
                  </button>
                )}
              </div>
            )}
          </div>
        </header>

        {/* ── CONTENT ── */}
        <div key={tab} className="pt-view" style={{ flex: 1, minHeight: 0, padding: isMobile ? "16px 14px 86px" : "6px 12px 28px 4px", overflowY: "auto" }}>

          {/* ══ DASHBOARD ══ */}
          {tab === "dashboard" && (
            <div>
              <div style={{ marginBottom: 22 }}>
                <h1 style={{ fontFamily: "var(--f-display)", fontSize: isMobile ? 34 : 50, fontWeight: 400, lineHeight: 1.05, letterSpacing: "-.015em", margin: 0, marginBottom: 8 }}>
                  Hello, <em style={{ fontStyle: "italic", color: "var(--accent)" }}>{user?.name?.split(" ")[0]}</em>
                </h1>
                <p style={{ color: "var(--pt-muted)", fontSize: 16, margin: 0 }}>Here&apos;s what&apos;s happening with your projects.</p>
              </div>

              {/* BENTO GRID */}
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gridTemplateRows: "auto", gap: 14 }}>

                {/* Stat cards */}
                {[
                  { label: "Total Projects", value: projects.length,                                     icon: <IconProjects />, variant: "dark"  },
                  { label: "Active now",     value: activeProjects.length,                               icon: <IconActivity />, variant: "mist"  },
                  { label: "Completed",      value: projects.filter(p => p.status === "completed").length, icon: <IconCheck />,  variant: "white" },
                  { label: "Pending Offers", value: pendingOffers.length,                                icon: <IconOffers />,   variant: "soft"  },
                ].map((s, i) => {
                  const dark = s.variant === "dark";
                  const cardBg = dark ? "linear-gradient(145deg,#2A1740,var(--side-bg) 70%)"
                    : s.variant === "mist" ? "var(--accent-mist)"
                    : s.variant === "soft" ? "linear-gradient(145deg,var(--accent-soft),var(--accent-mist))"
                    : "#fff";
                  const cardBorder = s.variant === "white" ? "1px solid var(--pt-line)"
                    : (s.variant === "mist" || s.variant === "soft") ? "1px solid var(--accent-soft)" : "none";
                  const iconTileBg = dark ? "rgba(255,255,255,.14)" : s.variant === "white" ? "#EAF6EE" : "#fff";
                  const iconColor = dark ? "#fff" : s.variant === "white" ? "#2E8B57" : "var(--accent-deep)";
                  const numColor = dark ? "#fff" : s.variant === "white" ? "var(--pt-ink)" : "var(--accent-deep)";
                  const lblColor = dark ? "#C9BEDB" : "var(--pt-muted)";
                  return (
                    <div key={s.label} className="pt-stat pt-card" style={{ animationDelay: `${i * 70}ms`, background: cardBg, border: cardBorder, borderRadius: 20, padding: 19, display: "flex", flexDirection: "column", gap: 15, position: "relative", overflow: "hidden", color: dark ? "#fff" : "inherit" }}>
                      {dark && <div style={{ position: "absolute", top: -50, right: -40, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle,var(--accent) 0%,transparent 70%)", opacity: 0.45 }} />}
                      <div style={{ width: 42, height: 42, borderRadius: 12, background: iconTileBg, display: "flex", alignItems: "center", justifyContent: "center", color: iconColor, position: "relative" }}>{s.icon}</div>
                      <div style={{ position: "relative" }}>
                        <div style={{ fontFamily: "var(--f-display)", fontSize: 40, lineHeight: 1, letterSpacing: "-.02em", color: numColor }}>{s.value}</div>
                        <div style={{ fontSize: 14, color: lblColor, marginTop: 5 }}>{s.label}</div>
                      </div>
                    </div>
                  );
                })}

                {/* Active projects — spans 3 cols */}
                <div style={{ gridColumn: isMobile ? "1 / -1" : "1 / 4", background: "#fff", border: "1px solid var(--pt-line)", borderRadius: 16, padding: "20px 22px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <h2 style={{ fontFamily: "var(--f-display)", fontSize: 24, fontWeight: 400, color: "var(--pt-ink)", margin: 0 }}>Active Projects</h2>
                    <button onClick={() => setTab("projects")} style={{ fontSize: 13, color: "#b86cf9", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>View all →</button>
                  </div>
                  {activeProjects.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "32px 0", color: "var(--pt-muted2)", fontSize: 13 }}>No active projects yet.</div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {activeProjects.map(p => (
                        <BentoProjectRow key={p.id} project={p}
                          onDetails={() => openProjectPanel(p, "details")}
                          onChat={() => openProjectPanel(p, "chat")}
                          chatUnread={projectUnreads[p.id] ?? 0}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Offers — 1 col, tall */}
                <div style={{ gridColumn: isMobile ? "1 / -1" : "4 / 5", gridRow: isMobile ? undefined : "2 / 4", background: "#fff", border: "1px solid var(--pt-line)", borderRadius: 16, padding: "20px 22px", display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <h2 style={{ fontFamily: "var(--f-display)", fontSize: 24, fontWeight: 400, color: "var(--pt-ink)", margin: 0 }}>Offers</h2>
                    {pendingOffers.length > 0 && <span style={{ background: "linear-gradient(135deg,var(--accent),var(--accent-deep))", color: "#fff", fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 50 }}>{pendingOffers.length}</span>}
                  </div>
                  {pendingOffers.length === 0 ? (
                    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--pt-muted2)", fontSize: 13, textAlign: "center", lineHeight: 1.7 }}>
                      No pending<br/>offers right now.
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                      {pendingOffers.slice(0, 3).map(o => (
                        <div key={o.id} style={{ background: "rgba(184,108,249,.06)", border: "1.5px solid rgba(184,108,249,.18)", borderRadius: 12, padding: "12px 14px" }}>
                          <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 3, color: "var(--pt-ink)" }}>{o.title}</div>
                          {o.price && <div style={{ fontSize: 13, color: "#b86cf9", fontWeight: 700, marginBottom: 8 }}>{o.price}</div>}
                          <div style={{ display: "flex", gap: 6 }}>
                            <button onClick={() => respondOffer(o.id, "accepted")} style={{ flex: 1, background: "linear-gradient(135deg,var(--accent),var(--accent-deep))", color: "#fff", border: "none", borderRadius: 8, padding: "6px 0", fontSize: 11.5, fontWeight: 600, cursor: "pointer" }}>Accept</button>
                            <button onClick={() => respondOffer(o.id, "declined")} style={{ flex: 1, background: "none", color: "var(--pt-muted)", border: "1px solid var(--pt-line)", borderRadius: 8, padding: "6px 0", fontSize: 11.5, cursor: "pointer" }}>Decline</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent activity — 3 cols */}
                <div style={{ gridColumn: isMobile ? "1 / -1" : "1 / 4", background: "#fff", border: "1px solid var(--pt-line)", borderRadius: 16, padding: "20px 22px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <h2 style={{ fontFamily: "var(--f-display)", fontSize: 24, fontWeight: 400, color: "var(--pt-ink)", margin: 0 }}>Recent Activity</h2>
                    <button onClick={() => setTab("notifications")} style={{ fontSize: 13, color: "#b86cf9", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>View all →</button>
                  </div>
                  {notifs.length === 0 ? (
                    <div style={{ color: "var(--pt-muted2)", fontSize: 13, textAlign: "center", padding: "16px 0" }}>No activity yet.</div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {notifs.slice(0, 4).map((n, i) => (
                        <div key={n.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < 3 ? "1px solid #f0ede8" : "none" }}>
                          <div style={{ width: 32, height: 32, borderRadius: "50%", background: n.read ? "#f3f4f6" : "rgba(184,108,249,.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <NotifIcon type={n.type} read={n.read} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 14.5, fontWeight: n.read ? 400 : 600, color: "var(--pt-ink)" }}>{n.title}</div>
                            {n.body && <div style={{ fontSize: 13, color: "var(--pt-muted2)" }}>{n.body}</div>}
                          </div>
                          <div style={{ fontSize: 12, color: "#b0b0b0", flexShrink: 0 }}>{new Date(n.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
                          {!n.read && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#b86cf9", flexShrink: 0 }} />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {projects.length === 0 && pendingOffers.length === 0 && (
                <div style={{ background: "#fff", border: "1.5px dashed var(--pt-line)", borderRadius: 16, padding: "52px 24px", textAlign: "center", marginTop: 14 }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(184,108,249,.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#b86cf9" strokeWidth="1.6"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10"/><path d="M12 8v4l3 3M16 2l2 2-2 2M18 4h-4"/></svg>
                  </div>
                  <div style={{ fontFamily: "var(--f-display)", fontWeight: 400, fontSize: 24, marginBottom: 8, letterSpacing: "-.01em" }}>No projects yet</div>
                  <div style={{ color: "var(--pt-muted)", fontSize: 15, marginBottom: 22 }}>Start by creating your first project request</div>
                  <button onClick={() => { setTab("projects"); setShowNew(true); }} style={{ background: "linear-gradient(135deg,var(--accent),var(--accent-deep))", color: "#fff", border: "none", borderRadius: 50, padding: "11px 26px", fontSize: 15, fontWeight: 500, cursor: "pointer" }}>
                    Create project
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ══ PROJECTS ══ */}
          {tab === "projects" && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <h1 style={{ fontFamily: "var(--f-display)", fontSize: isMobile ? 32 : 42, fontWeight: 400, lineHeight: 1.05, letterSpacing: "-.015em", marginBottom: 6 }}>Projects</h1>
                <p style={{ color: "var(--pt-muted)", fontSize: 14 }}>Track progress and chat with your project team.</p>
              </div>
              {projects.length === 0 ? (
                <div style={{ background: "#fff", border: "1.5px dashed var(--pt-line)", borderRadius: 16, padding: "52px 24px", textAlign: "center" }}>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(184,108,249,.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#b86cf9" strokeWidth="1.7"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                  </div>
                  <div style={{ fontFamily: "var(--f-display)", fontWeight: 400, fontSize: 22, marginBottom: 18, letterSpacing: "-.01em" }}>No projects yet</div>
                  <button onClick={() => setShowNew(true)} style={{ background: "linear-gradient(135deg,var(--accent),var(--accent-deep))", color: "#fff", border: "none", borderRadius: 50, padding: "11px 26px", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>+ New Project</button>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14 }}>
                  {projects.map(p => (
                    <ProjectCard key={p.id} project={p}
                      onDetails={() => openProjectPanel(p, "details")}
                      onChat={() => openProjectPanel(p, "chat")}
                      chatUnread={projectUnreads[p.id] ?? 0}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══ OFFERS ══ */}
          {tab === "offers" && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <h1 style={{ fontFamily: "var(--f-display)", fontSize: isMobile ? 32 : 42, fontWeight: 400, lineHeight: 1.05, letterSpacing: "-.015em", marginBottom: 6 }}>Offers & Upgrades</h1>
                <p style={{ color: "var(--pt-muted)", fontSize: 14 }}>Proposals and upgrade packages from Foxmen Studio.</p>
              </div>
              {offers.length === 0 ? (
                <div style={{ background: "#fff", border: "1.5px dashed var(--pt-line)", borderRadius: 16, padding: "52px 24px", textAlign: "center", color: "var(--pt-muted)", fontSize: 15 }}>No offers yet.</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {offers.map(o => (
                    <div key={o.id} style={{ background: "#fff", border: `1.5px solid ${o.status === "pending" ? "#e9d5ff" : "var(--pt-line)"}`, borderRadius: 14, padding: "18px 22px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                      <div style={{ flex: 1, minWidth: 200 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <span style={{ fontWeight: 600, fontSize: 17, letterSpacing: "-.01em" }}>{o.title}</span>
                          <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 50, background: { pending: "#faf5ff", accepted: "#f0fdf4", declined: "#fff1f2" }[o.status] ?? "#f3f4f6", color: { pending: "#b86cf9", accepted: "#16a34a", declined: "#e11d48" }[o.status] ?? "#888" }}>{o.status}</span>
                        </div>
                        {o.description && <div style={{ fontSize: 14, color: "var(--pt-muted)", marginBottom: 4 }}>{o.description}</div>}
                        {o.price && <div style={{ fontSize: 15, color: "#b86cf9", fontWeight: 600 }}>{o.price}</div>}
                      </div>
                      {o.status === "pending" && (
                        <div style={{ display: "flex", gap: 8 }}>
                          <button onClick={() => respondOffer(o.id, "accepted")} style={{ background: "linear-gradient(135deg,var(--accent),var(--accent-deep))", color: "#fff", border: "none", borderRadius: 8, padding: "9px 20px", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>Accept</button>
                          <button onClick={() => respondOffer(o.id, "declined")} style={{ background: "none", color: "var(--pt-muted)", border: "1px solid var(--pt-line)", borderRadius: 8, padding: "9px 20px", fontSize: 14, cursor: "pointer" }}>Decline</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══ NOTIFICATIONS ══ */}
          {tab === "notifications" && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <h1 style={{ fontFamily: "var(--f-display)", fontSize: isMobile ? 32 : 42, fontWeight: 400, lineHeight: 1.05, letterSpacing: "-.015em", marginBottom: 6 }}>Notifications</h1>
                <p style={{ color: "var(--pt-muted)", fontSize: 14 }}>{unread > 0 ? `${unread} unread` : "All caught up"}</p>
              </div>
              {notifs.length === 0 ? (
                <div style={{ background: "#fff", border: "1.5px dashed var(--pt-line)", borderRadius: 16, padding: "52px 24px", textAlign: "center", color: "var(--pt-muted)", fontSize: 15 }}>No notifications yet.</div>
              ) : (
                <div style={{ background: "#fff", border: "1px solid var(--pt-line)", borderRadius: 14, overflow: "hidden" }}>
                  {notifs.map((n, i) => (
                    <a key={n.id} href={n.link || "#"}
                      onClick={() => { if (!n.read) { fetch("/api/portal/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: n.id }) }); setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x)); } }}
                      style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", borderBottom: i < notifs.length - 1 ? "1px solid var(--pt-line)" : undefined, textDecoration: "none", background: n.read ? "#fff" : "#faf5ff" }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: n.read ? "#f3f4f6" : "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <NotifIcon type={n.type} read={n.read} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 15, fontWeight: n.read ? 400 : 600, color: "var(--pt-ink)", marginBottom: 2 }}>{n.title}</div>
                        {n.body && <div style={{ fontSize: 13, color: "var(--pt-muted)" }}>{n.body}</div>}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--pt-muted)", flexShrink: 0 }}>{new Date(n.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
                      {!n.read && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#b86cf9", flexShrink: 0 }} />}
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══ SETTINGS ══ */}
          {tab === "settings" && (
            <div style={{ maxWidth: 520 }}>
              <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontFamily: "var(--f-display)", fontSize: isMobile ? 32 : 42, fontWeight: 400, lineHeight: 1.05, letterSpacing: "-.015em", marginBottom: 6 }}>Settings</h1>
                <p style={{ color: "var(--pt-muted)", fontSize: 14 }}>Manage your account details.</p>
              </div>
              <div style={{ background: "#fff", border: "1px solid var(--pt-line)", borderRadius: 14, overflow: "hidden", marginBottom: 16 }}>
                <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--pt-line)", fontWeight: 600, fontSize: 16 }}>Profile</div>
                <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 16 }}>
                  {/* Avatar upload */}
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <label style={{ cursor: "pointer", position: "relative", flexShrink: 0 }}>
                      <input type="file" accept="image/*" hidden onChange={async e => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setAvatarUploading(true);
                        const fd = new FormData();
                        fd.append("file", file);
                        const res = await fetch("/api/portal/upload", { method: "POST", body: fd });
                        if (res.ok) {
                          const { url } = await res.json() as { url: string };
                          setSettingAvatar(url);
                        }
                        setAvatarUploading(false);
                        e.target.value = "";
                      }} />
                      <div style={{ width: 68, height: 68, borderRadius: "50%", background: settingAvatar ? "transparent" : "#b86cf9", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", border: "2px solid var(--pt-line)" }}>
                        {settingAvatar
                          ? <img src={settingAvatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          : <span style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>{(settingName || user?.name || "U").split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)}</span>
                        }
                        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.45)", display: "flex", alignItems: "center", justifyContent: "center", opacity: avatarUploading ? 1 : 0, transition: "opacity .15s" }}
                          onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                          onMouseLeave={e => (e.currentTarget.style.opacity = avatarUploading ? "1" : "0")}>
                          {avatarUploading
                            ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4"/></svg>
                            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                          }
                        </div>
                      </div>
                    </label>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: "var(--pt-ink)", marginBottom: 3 }}>Profile photo</div>
                      <div style={{ fontSize: 13, color: "var(--pt-muted2)", lineHeight: 1.5 }}>Click the circle to upload.<br/>JPG, PNG or WebP · max 10 MB</div>
                    </div>
                  </div>

                  {foxId && (
                    <div style={{ display: "flex", alignItems: "center", gap: 12, background: "linear-gradient(135deg,rgba(184,108,249,.08),rgba(124,58,237,.06))", border: "1.5px solid rgba(184,108,249,.2)", borderRadius: 12, padding: "12px 16px" }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#b86cf9,#7c3aed)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, color: "#9a6bc9", fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 2 }}>Your Foxmen ID</div>
                        <div style={{ fontFamily: "monospace", fontSize: 16, fontWeight: 800, color: "#6c3fc5", letterSpacing: ".06em" }}>{foxId}</div>
                      </div>
                    </div>
                  )}
                  <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "var(--pt-muted)" }}>Display name</span>
                    <input value={settingName} onChange={e => setSettingName(e.target.value)} style={inputS} />
                  </label>
                  <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "var(--pt-muted)" }}>Email</span>
                    <input value={user?.email ?? ""} disabled style={{ ...inputS, opacity: 0.5 }} />
                  </label>
                  <button disabled={settingSaving} onClick={async () => {
                    setSettingSaving(true);
                    await fetch("/api/auth/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: settingName, avatar: settingAvatar }) });
                    setSettingSaving(false);
                  }} style={{ alignSelf: "flex-start", background: "linear-gradient(135deg,var(--accent),var(--accent-deep))", color: "#fff", border: "none", borderRadius: 50, padding: "9px 22px", fontSize: 13, fontWeight: 500, cursor: "pointer", opacity: settingSaving ? 0.6 : 1 }}>
                    {settingSaving ? "Saving…" : "Save changes"}
                  </button>
                </div>
              </div>
              <div style={{ background: "#fff", border: "1px solid var(--pt-line)", borderRadius: 14, overflow: "hidden" }}>
                <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--pt-line)", fontWeight: 600, fontSize: 16 }}>Security</div>
                <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
                  <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "var(--pt-muted)" }}>Current password</span>
                    <input type="password" value={settingPwOld} onChange={e => setSettingPwOld(e.target.value)} placeholder="••••••••" style={inputS} />
                  </label>
                  <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "var(--pt-muted)" }}>New password</span>
                    <input type="password" value={settingPwNew} onChange={e => setSettingPwNew(e.target.value)} placeholder="Min 8 characters" style={inputS} />
                  </label>
                  {settingPwMsg && <div style={{ fontSize: 13, color: settingPwMsg.includes("successfully") ? "#16a34a" : "#e11d48" }}>{settingPwMsg}</div>}
                  <button onClick={async () => {
                    if (!settingPwOld || settingPwNew.length < 8) { setSettingPwMsg("New password must be at least 8 characters."); return; }
                    const res = await fetch("/api/auth/change-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ oldPassword: settingPwOld, newPassword: settingPwNew }) });
                    setSettingPwMsg(res.ok ? "Password changed successfully." : "Current password is incorrect.");
                    if (res.ok) { setSettingPwOld(""); setSettingPwNew(""); }
                  }} style={{ alignSelf: "flex-start", background: "linear-gradient(135deg,var(--accent),var(--accent-deep))", color: "#fff", border: "none", borderRadius: 50, padding: "9px 22px", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
                    Change password
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── SIDE PANEL ── */}
      {sidePanel && (
        <PortalProjectPanel
          project={sidePanel}
          defaultTab={sidePanelTab}
          onClose={() => setSidePanel(null)}
          onUnread={handleUnread}
        />
      )}

      {/* ── MOBILE SIDEBAR DRAWER ── */}
      {isMobile && mobileSidebarOpen && (
        <>
          <div onClick={() => setMobileSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.55)", zIndex: 60, backdropFilter: "blur(2px)" }} />
          <div className="pt-mob-drawer" style={{ position: "fixed", left: 0, top: 0, bottom: 0, width: 270, background: "var(--pt-ink)", zIndex: 70, display: "flex", flexDirection: "column", overflowY: "auto" }}>
            {/* Brand */}
            <div style={{ padding: "20px 18px 16px", borderBottom: "1px solid rgba(255,255,255,.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
                <img src="/assets/logo-mark.svg" alt="Foxmen" style={{ width: 26, height: 26 }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "#fff", fontFamily: "var(--f-display)" }}>Foxmen <em style={{ fontStyle: "italic", color: "#b86cf9" }}>Studio</em></div>
                  <div style={{ fontSize: 8, color: "rgba(255,255,255,.3)", letterSpacing: ".18em", textTransform: "uppercase" }}>Client Portal</div>
                </div>
              </a>
              <button onClick={() => setMobileSidebarOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,.4)", padding: 4, borderRadius: 8, display: "flex" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            {/* Nav items */}
            <nav style={{ padding: "14px 10px 0" }}>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,.25)", letterSpacing: ".2em", textTransform: "uppercase", padding: "0 10px 6px" }}>Menu</div>
              {navItems.map(item => (
                <button key={item.key} onClick={() => { setTab(item.key as typeof tab); setMobileSidebarOpen(false); }}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, width: "100%", textAlign: "left", background: tab === item.key ? "rgba(184,108,249,.15)" : "transparent", color: tab === item.key ? "#b86cf9" : "rgba(255,255,255,.6)", transition: "all .15s", marginBottom: 2 }}>
                  <span style={{ opacity: tab === item.key ? 1 : 0.7, flexShrink: 0 }}>{item.icon}</span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.badge ? <span style={{ background: "linear-gradient(135deg,var(--accent),var(--accent-deep))", color: "#fff", fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 50, minWidth: 18, textAlign: "center" }}>{item.badge}</span> : null}
                </button>
              ))}
            </nav>
            {/* Projects list */}
            {projects.length > 0 && (
              <div style={{ padding: "14px 10px 0" }}>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,.25)", letterSpacing: ".2em", textTransform: "uppercase", padding: "0 10px 8px" }}>Projects</div>
                {projects.map(p => (
                  <button key={p.id} onClick={() => { openProjectPanel(p); setMobileSidebarOpen(false); }}
                    style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderRadius: 8, border: "none", cursor: "pointer", width: "100%", textAlign: "left", background: "transparent" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: STATUS_COLOR[p.status] ?? "#888", flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,.6)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{p.title}</span>
                    {(projectUnreads[p.id] ?? 0) > 0 && <span style={{ background: "linear-gradient(135deg,var(--accent),var(--accent-deep))", color: "#fff", fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 50 }}>{projectUnreads[p.id]}</span>}
                  </button>
                ))}
              </div>
            )}
            <div style={{ flex: 1 }} />
            {/* User footer */}
            <div style={{ padding: "14px 16px", borderTop: "1px solid rgba(255,255,255,.07)", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, overflow: "hidden", background: "#b86cf9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>
                {settingAvatar ? <img src={settingAvatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : initials}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.name}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,.3)", fontFamily: "monospace" }}>{foxId ?? (user?.role ?? "client")}</div>
              </div>
              <button onClick={() => signOut({ callbackUrl: "/login" })} title="Sign out"
                style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,.4)", padding: 4, borderRadius: 6, display: "flex" }}>
                <IconSignOut />
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── MOBILE BOTTOM NAV ── */}
      {isMobile && (
        <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", borderTop: "1.5px solid var(--pt-line)", display: "flex", zIndex: 50, paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
          {navItems.map(item => (
            <button key={item.key} onClick={() => setTab(item.key as typeof tab)}
              style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "8px 4px 10px", border: "none", background: "none", cursor: "pointer", color: tab === item.key ? "#b86cf9" : "var(--pt-muted2)", position: "relative", minHeight: 56 }}>
              <span style={{ opacity: tab === item.key ? 1 : 0.6, transition: "opacity .15s" }}>{item.icon}</span>
              <span style={{ fontSize: 9, marginTop: 4, fontWeight: tab === item.key ? 700 : 400, letterSpacing: ".02em" }}>{item.label}</span>
              {item.badge ? <span style={{ position: "absolute", top: 7, left: "50%", transform: "translateX(3px)", background: "linear-gradient(135deg,var(--accent),var(--accent-deep))", color: "#fff", fontSize: 8, padding: "1px 4px", borderRadius: 50, minWidth: 14, textAlign: "center", lineHeight: "1.5" }}>{item.badge}</span> : null}
            </button>
          ))}
        </nav>
      )}

      {/* ── NEW PROJECT MODAL ── */}
      {showNew && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
          onClick={e => { if (e.target === e.currentTarget) setShowNew(false); }}>
          <div className="pt-modal" style={{ background: "#fff", borderRadius: 18, width: "100%", maxWidth: 500, maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ padding: "22px 24px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontFamily: "var(--f-display)", fontSize: 22, fontWeight: 400, letterSpacing: "-.01em" }}>New Project Request</h2>
              <button onClick={() => setShowNew(false)} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "var(--pt-muted)", lineHeight: 1 }}>×</button>
            </div>
            <form onSubmit={submitProject} style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
              <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: "var(--pt-muted)" }}>Project title *</span>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required placeholder="e.g. Modern eCommerce Website" style={inputS} />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: "var(--pt-muted)" }}>Service type</span>
                <input value={form.service_type} onChange={e => setForm(f => ({ ...f, service_type: e.target.value }))} placeholder="e.g. Web Development, Mobile App" style={inputS} />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: "var(--pt-muted)" }}>Description</span>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="Tell us about your project…" style={{ ...inputS, resize: "vertical" }} />
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "var(--pt-muted)" }}>Budget</span>
                  <input value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} placeholder="e.g. $5,000" style={inputS} />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "var(--pt-muted)" }}>Timeline</span>
                  <input value={form.timeline} onChange={e => setForm(f => ({ ...f, timeline: e.target.value }))} placeholder="e.g. 6 weeks" style={inputS} />
                </label>
              </div>
              <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: "var(--pt-muted)" }}>Existing website</span>
                <input value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} placeholder="https://example.com" style={inputS} />
              </label>
              <button type="submit" disabled={submitting || !form.title}
                style={{ background: "linear-gradient(135deg,var(--accent),var(--accent-deep))", color: "#fff", border: "none", borderRadius: 50, padding: "12px", fontSize: 14, fontWeight: 500, cursor: submitting || !form.title ? "not-allowed" : "pointer", opacity: submitting || !form.title ? 0.5 : 1, marginTop: 4 }}>
                {submitting ? "Submitting…" : "Submit Request"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Bento project row (dashboard) ── */
function BentoProjectRow({ project: p, onDetails, onChat, chatUnread }: { project: Project; onDetails: () => void; onChat: () => void; chatUnread: number }) {
  const done  = p.milestones.filter(m => m.status === "completed").length;
  const total = p.milestones.length;
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 14px", background: "#fafaf8", border: "1.5px solid #f0ede8", borderRadius: 12 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <span style={{ fontWeight: 600, fontSize: 15, color: "var(--pt-ink)" }}>{p.title}</span>
          <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 50, background: `${STATUS_COLOR[p.status]}18`, color: STATUS_COLOR[p.status] }}>
            {STATUS_LABEL[p.status]}
          </span>
        </div>
        {total > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ flex: 1, height: 4, background: "var(--pt-line)", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? "#22c55e" : "#b86cf9", borderRadius: 99 }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--pt-muted2)", flexShrink: 0 }}>{pct}%</span>
          </div>
        )}
      </div>
      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
        <button onClick={onDetails} style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid var(--pt-line)", background: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer", color: "var(--pt-ink)", transition: "border-color .15s" }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = "#b86cf9")}
          onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--pt-line)")}>
          Details
        </button>
        <button onClick={onChat} style={{ padding: "7px 14px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,var(--accent),var(--accent-deep))", color: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 5, position: "relative" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          Chat
          {chatUnread > 0 && <span style={{ position: "absolute", top: -5, right: -5, width: 15, height: 15, borderRadius: "50%", background: "#e11d48", color: "#fff", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff" }}>{chatUnread}</span>}
        </button>
      </div>
    </div>
  );
}

/* ── Project card (projects tab) ── */
function ProjectCard({ project: p, onDetails, onChat, chatUnread }: { project: Project; onDetails: () => void; onChat: () => void; chatUnread: number }) {
  const done  = p.milestones.filter(m => m.status === "completed").length;
  const total = p.milestones.length;
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0;
  return (
    <div className="pt-card" style={{ background: "#fff", border: "1px solid var(--pt-line)", borderRadius: 14, padding: "18px 20px" }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#b86cf9"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 14px 34px -18px rgba(184,108,249,.4)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--pt-line)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 10 }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 4, letterSpacing: "-.01em" }}>{p.title}</div>
          {p.service_type && <div style={{ fontSize: 13, color: "var(--pt-muted)" }}>{p.service_type}</div>}
        </div>
        <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 50, background: `${STATUS_COLOR[p.status]}18`, color: STATUS_COLOR[p.status], whiteSpace: "nowrap", flexShrink: 0 }}>
          {STATUS_LABEL[p.status] ?? p.status}
        </span>
      </div>
      {total > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ fontSize: 12, color: "var(--pt-muted)" }}>Progress</span>
            <span style={{ fontSize: 12, fontWeight: 600 }}>{pct}%</span>
          </div>
          <div style={{ height: 4, background: "#f3f4f6", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? "#22c55e" : "#b86cf9", borderRadius: 4 }} />
          </div>
        </div>
      )}
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={onDetails} style={{ flex: 1, padding: "9px 0", borderRadius: 9, border: "1px solid var(--pt-line)", background: "#fff", fontSize: 14, fontWeight: 500, cursor: "pointer", color: "var(--pt-ink)", transition: "all .15s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#b86cf9"; e.currentTarget.style.color = "#b86cf9"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--pt-line)"; e.currentTarget.style.color = "var(--pt-ink)"; }}>
          View Details
        </button>
        <button onClick={onChat} style={{ flex: 1, padding: "9px 0", borderRadius: 9, border: "none", background: "linear-gradient(135deg,var(--accent),var(--accent-deep))", color: "#fff", fontSize: 14, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, position: "relative" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          Open Chat
          {chatUnread > 0 && <span style={{ position: "absolute", top: -5, right: -5, width: 16, height: 16, borderRadius: "50%", background: "#e11d48", color: "#fff", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff" }}>{chatUnread}</span>}
        </button>
      </div>
    </div>
  );
}

const inputS: React.CSSProperties = { width: "100%", padding: "11px 14px", borderRadius: 9, border: "1px solid var(--pt-line)", fontSize: 15, background: "#fff", color: "var(--pt-ink)", outline: "none", fontFamily: "inherit", boxSizing: "border-box" };

// ── Icons ──
function IconDashboard() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>; }
function IconProjects() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18M8 5V3M16 5V3"/></svg>; }
function IconOffers() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"/></svg>; }
function IconBell() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></svg>; }
function IconSettings() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 4.7 15a1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.7 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 9 4.7a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A1.7 1.7 0 0 0 19.3 9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/></svg>; }
function IconSignOut() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>; }
function IconActivity() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>; }
function IconCheck() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>; }
function NotifIcon({ type, read }: { type: string; read: boolean }) {
  const c = read ? "var(--pt-muted2)" : "#b86cf9";
  if (type === "new_message") return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
  if (type === "project_update") return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>;
  if (type === "new_offer") return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"/></svg>;
  if (type === "offer_response") return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={read ? "var(--pt-muted2)" : "#22c55e"} strokeWidth="2.2"><polyline points="20 6 9 17 4 12"/></svg>;
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></svg>;
}
