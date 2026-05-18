"use client";
import { useState, useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getPusherClient } from "@/lib/pusher";

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
  completed: "#22c55e", on_hold: "#6b6b6b",
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
  const [offers, setOffers] = useState<Offer[]>([]);
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // new project modal
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ title: "", service_type: "", description: "", budget: "", timeline: "", website: "" });
  const [submitting, setSubmitting] = useState(false);

  // settings
  const [settingName, setSettingName] = useState("");
  const [settingSaving, setSettingSaving] = useState(false);
  const [settingPwOld, setSettingPwOld] = useState("");
  const [settingPwNew, setSettingPwNew] = useState("");
  const [settingPwMsg, setSettingPwMsg] = useState("");

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
    }
  }, [status, router, loadData, session]);

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

  const unread = notifs.filter(n => !n.read).length;
  const pendingOffers = offers.filter(o => o.status === "pending");
  const activeProjects = projects.filter(p => p.status === "in_progress" || p.status === "review");
  const user = session?.user as { name?: string; email?: string; id?: string } | undefined;
  const initials = (user?.name ?? "U").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

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

  if (status === "loading" || loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0a" }}>
      <div style={{ color: "rgba(255,255,255,.4)", fontSize: 14 }}>Loading…</div>
    </div>
  );

  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: <IconDashboard /> },
    { key: "projects", label: "Projects", icon: <IconProjects />, badge: activeProjects.length || undefined },
    { key: "offers", label: "Offers", icon: <IconOffers />, badge: pendingOffers.length || undefined },
    { key: "notifications", label: "Notifications", icon: <IconBell />, badge: unread || undefined },
    { key: "settings", label: "Settings", icon: <IconSettings /> },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f7f6f4", fontFamily: "var(--f-sans)" }}>

      {/* ── SIDEBAR ── */}
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 40, display: "none" }} className="sidebar-overlay" />}
      <aside style={{
        width: 240, background: "#0a0a0a", color: "#fff", display: "flex", flexDirection: "column",
        position: "sticky", top: 0, height: "100vh", flexShrink: 0, zIndex: 50,
      }}>
        {/* Brand */}
        <div style={{ padding: "22px 20px 18px", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <img src="/assets/logo-mark.svg" alt="Foxmen" style={{ width: 28, height: 28 }} />
            <div>
              <div style={{ fontWeight: 600, fontSize: 15, color: "#fff", fontFamily: "var(--f-display)", letterSpacing: "-.01em" }}>
                Foxmen <em style={{ fontStyle: "italic", color: "#b86cf9" }}>Studio</em>
              </div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,.3)", letterSpacing: ".18em", textTransform: "uppercase", marginTop: 1 }}>Client Portal</div>
            </div>
          </a>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "14px 10px", display: "flex", flexDirection: "column", gap: 2, overflowY: "auto" }}>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,.25)", letterSpacing: ".2em", textTransform: "uppercase", padding: "8px 10px 6px" }}>Menu</div>
          {navItems.map(item => (
            <button key={item.key} onClick={() => setTab(item.key as typeof tab)}
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10,
                border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, width: "100%", textAlign: "left",
                background: tab === item.key ? "rgba(184,108,249,.15)" : "transparent",
                color: tab === item.key ? "#b86cf9" : "rgba(255,255,255,.6)",
                transition: "all .15s",
              }}>
              <span style={{ opacity: tab === item.key ? 1 : 0.7, flexShrink: 0 }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge ? (
                <span style={{ background: "#b86cf9", color: "#fff", fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 50, minWidth: 18, textAlign: "center" }}>{item.badge}</span>
              ) : null}
            </button>
          ))}

          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,.25)", letterSpacing: ".2em", textTransform: "uppercase", padding: "8px 10px 6px" }}>Projects</div>
            {projects.slice(0, 5).map(p => (
              <button key={p.id} onClick={() => router.push(`/portal/project/${p.id}`)}
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 12px", borderRadius: 8, border: "none", cursor: "pointer", width: "100%", textAlign: "left", background: "transparent", transition: "background .15s" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,.05)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: STATUS_COLOR[p.status] ?? "#888", flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: "rgba(255,255,255,.5)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</span>
              </button>
            ))}
            {projects.length > 5 && <div style={{ fontSize: 11, color: "rgba(255,255,255,.25)", padding: "4px 12px" }}>+{projects.length - 5} more</div>}
          </div>
        </nav>

        {/* User foot */}
        <div style={{ padding: "14px 16px", borderTop: "1px solid rgba(255,255,255,.07)", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#b86cf9", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.name}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,.3)" }}>Client</div>
          </div>
          <button onClick={() => signOut({ callbackUrl: "/login" })} title="Sign out"
            style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,.3)", padding: 4, borderRadius: 6, transition: "color .15s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,.3)")}>
            <IconSignOut />
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>

        {/* Topbar */}
        <header style={{ background: "#fff", borderBottom: "1px solid #e7e5e2", padding: "0 28px", height: 60, display: "flex", alignItems: "center", gap: 14, position: "sticky", top: 0, zIndex: 30 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: "#6b6b6b", letterSpacing: ".06em", textTransform: "uppercase" }}>
              {navItems.find(n => n.key === tab)?.label}
            </div>
          </div>
          {tab === "projects" && (
            <button onClick={() => setShowNew(true)}
              style={{ display: "flex", alignItems: "center", gap: 6, background: "#0a0a0a", color: "#fff", border: "none", borderRadius: 50, padding: "8px 18px", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
              <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> New Project
            </button>
          )}
          {tab === "notifications" && unread > 0 && (
            <button onClick={markAllRead}
              style={{ fontSize: 12, color: "#b86cf9", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>
              Mark all read
            </button>
          )}
        </header>

        {/* Content */}
        <div style={{ flex: 1, padding: "28px", overflowY: "auto" }}>

          {/* ── DASHBOARD ── */}
          {tab === "dashboard" && (
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 400, letterSpacing: "-.02em", marginBottom: 4 }}>
                Hello, <em style={{ fontStyle: "italic", color: "#b86cf9" }}>{user?.name?.split(" ")[0]}</em>
              </h1>
              <p style={{ color: "#6b6b6b", fontSize: 14, marginBottom: 28 }}>Here's what's happening with your projects.</p>

              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 28 }}>
                {[
                  { label: "Total Projects", value: projects.length, color: "#b86cf9" },
                  { label: "Active", value: activeProjects.length, color: "#3b82f6" },
                  { label: "Completed", value: projects.filter(p => p.status === "completed").length, color: "#22c55e" },
                  { label: "Pending Offers", value: pendingOffers.length, color: "#f59e0b" },
                ].map(s => (
                  <div key={s.label} style={{ background: "#fff", border: "1.5px solid #e7e5e2", borderRadius: 14, padding: "18px 20px" }}>
                    <div style={{ fontSize: 28, fontWeight: 600, color: s.color, lineHeight: 1, marginBottom: 6 }}>{s.value}</div>
                    <div style={{ fontSize: 12, color: "#6b6b6b" }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Active projects */}
              {activeProjects.length > 0 && (
                <div style={{ marginBottom: 28 }}>
                  <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "#0a0a0a" }}>Active Projects</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {activeProjects.map(p => <ProjectCard key={p.id} project={p} onClick={() => router.push(`/portal/project/${p.id}`)} />)}
                  </div>
                </div>
              )}

              {/* Pending offers */}
              {pendingOffers.length > 0 && (
                <div style={{ marginBottom: 28 }}>
                  <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "#0a0a0a" }}>Offers from Foxmen</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {pendingOffers.map(o => (
                      <div key={o.id} style={{ background: "linear-gradient(135deg,#faf5ff,#fff)", border: "1.5px solid #e9d5ff", borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                        <div style={{ flex: 1, minWidth: 180 }}>
                          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3 }}>{o.title}</div>
                          {o.description && <div style={{ fontSize: 13, color: "#6b6b6b" }}>{o.description}</div>}
                          {o.price && <div style={{ fontSize: 13, color: "#b86cf9", fontWeight: 600, marginTop: 4 }}>{o.price}</div>}
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button onClick={() => respondOffer(o.id, "accepted")} style={{ background: "#b86cf9", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Accept</button>
                          <button onClick={() => respondOffer(o.id, "declined")} style={{ background: "none", color: "#6b6b6b", border: "1px solid #e7e5e2", borderRadius: 8, padding: "8px 16px", fontSize: 13, cursor: "pointer" }}>Decline</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent notifications */}
              {notifs.slice(0, 3).length > 0 && (
                <div>
                  <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "#0a0a0a" }}>Recent Activity</h2>
                  <div style={{ background: "#fff", border: "1.5px solid #e7e5e2", borderRadius: 14, overflow: "hidden" }}>
                    {notifs.slice(0, 3).map((n, i) => (
                      <a key={n.id} href={n.link || "#"} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 18px", borderBottom: i < 2 ? "1px solid #e7e5e2" : undefined, textDecoration: "none", background: n.read ? "#fff" : "#faf5ff" }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: n.read ? "#e7e5e2" : "#b86cf9", flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 500, color: "#0a0a0a" }}>{n.title}</div>
                          {n.body && <div style={{ fontSize: 12, color: "#6b6b6b" }}>{n.body}</div>}
                        </div>
                        <div style={{ fontSize: 11, color: "#6b6b6b", flexShrink: 0 }}>{new Date(n.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {projects.length === 0 && pendingOffers.length === 0 && (
                <div style={{ background: "#fff", border: "1.5px dashed #e7e5e2", borderRadius: 16, padding: "52px 24px", textAlign: "center" }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(184,108,249,.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#b86cf9" strokeWidth="1.6"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10"/><path d="M12 8v4l3 3"/><path d="M16 2l2 2-2 2M18 4h-4"/></svg>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 17, marginBottom: 8 }}>No projects yet</div>
                  <div style={{ color: "#6b6b6b", fontSize: 14, marginBottom: 20 }}>Start by creating your first project request</div>
                  <button onClick={() => { setTab("projects"); setShowNew(true); }}
                    style={{ background: "#b86cf9", color: "#fff", border: "none", borderRadius: 50, padding: "10px 24px", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
                    Create project
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── PROJECTS ── */}
          {tab === "projects" && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <h1 style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-.01em", marginBottom: 4 }}>Projects</h1>
                <p style={{ color: "#6b6b6b", fontSize: 13 }}>Track progress, chat with the team and manage your builds.</p>
              </div>
              {projects.length === 0 ? (
                <div style={{ background: "#fff", border: "1.5px dashed #e7e5e2", borderRadius: 16, padding: "52px 24px", textAlign: "center" }}>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(184,108,249,.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#b86cf9" strokeWidth="1.7"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                  </div>
                  <div style={{ fontWeight: 500, fontSize: 16, marginBottom: 16 }}>No projects yet</div>
                  <button onClick={() => setShowNew(true)} style={{ background: "#0a0a0a", color: "#fff", border: "none", borderRadius: 50, padding: "10px 24px", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>+ New Project</button>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14 }}>
                  {projects.map(p => <ProjectCard key={p.id} project={p} onClick={() => router.push(`/portal/project/${p.id}`)} />)}
                </div>
              )}
            </div>
          )}

          {/* ── OFFERS ── */}
          {tab === "offers" && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <h1 style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-.01em", marginBottom: 4 }}>Offers & Upgrades</h1>
                <p style={{ color: "#6b6b6b", fontSize: 13 }}>Proposals and upgrade packages from Foxmen Studio.</p>
              </div>
              {offers.length === 0 ? (
                <div style={{ background: "#fff", border: "1.5px dashed #e7e5e2", borderRadius: 16, padding: "52px 24px", textAlign: "center", color: "#6b6b6b", fontSize: 14 }}>No offers yet.</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {offers.map(o => (
                    <div key={o.id} style={{ background: "#fff", border: `1.5px solid ${o.status === "pending" ? "#e9d5ff" : "#e7e5e2"}`, borderRadius: 14, padding: "18px 22px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                      <div style={{ flex: 1, minWidth: 200 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <span style={{ fontWeight: 600, fontSize: 15 }}>{o.title}</span>
                          <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 50, background: { pending: "#faf5ff", accepted: "#f0fdf4", declined: "#fff1f2" }[o.status] ?? "#f3f4f6", color: { pending: "#b86cf9", accepted: "#16a34a", declined: "#e11d48" }[o.status] ?? "#888" }}>{o.status}</span>
                        </div>
                        {o.description && <div style={{ fontSize: 13, color: "#6b6b6b", marginBottom: 4 }}>{o.description}</div>}
                        {o.price && <div style={{ fontSize: 14, color: "#b86cf9", fontWeight: 600 }}>{o.price}</div>}
                      </div>
                      {o.status === "pending" && (
                        <div style={{ display: "flex", gap: 8 }}>
                          <button onClick={() => respondOffer(o.id, "accepted")} style={{ background: "#b86cf9", color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Accept</button>
                          <button onClick={() => respondOffer(o.id, "declined")} style={{ background: "none", color: "#6b6b6b", border: "1px solid #e7e5e2", borderRadius: 8, padding: "8px 18px", fontSize: 13, cursor: "pointer" }}>Decline</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── NOTIFICATIONS ── */}
          {tab === "notifications" && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <h1 style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-.01em", marginBottom: 4 }}>Notifications</h1>
                <p style={{ color: "#6b6b6b", fontSize: 13 }}>{unread > 0 ? `${unread} unread` : "All caught up"}</p>
              </div>
              {notifs.length === 0 ? (
                <div style={{ background: "#fff", border: "1.5px dashed #e7e5e2", borderRadius: 16, padding: "52px 24px", textAlign: "center", color: "#6b6b6b", fontSize: 14 }}>No notifications yet.</div>
              ) : (
                <div style={{ background: "#fff", border: "1.5px solid #e7e5e2", borderRadius: 14, overflow: "hidden" }}>
                  {notifs.map((n, i) => (
                    <a key={n.id} href={n.link || "#"}
                      onClick={() => { if (!n.read) { fetch("/api/portal/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: n.id }) }); setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x)); } }}
                      style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", borderBottom: i < notifs.length - 1 ? "1px solid #e7e5e2" : undefined, textDecoration: "none", background: n.read ? "#fff" : "#faf5ff", transition: "background .15s" }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: n.read ? "#f3f4f6" : "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <NotifIcon type={n.type} read={n.read} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: n.read ? 400 : 600, color: "#0a0a0a", marginBottom: 2 }}>{n.title}</div>
                        {n.body && <div style={{ fontSize: 12, color: "#6b6b6b" }}>{n.body}</div>}
                      </div>
                      <div style={{ fontSize: 11, color: "#6b6b6b", flexShrink: 0 }}>{new Date(n.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
                      {!n.read && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#b86cf9", flexShrink: 0 }} />}
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── SETTINGS ── */}
          {tab === "settings" && (
            <div style={{ maxWidth: 520 }}>
              <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-.01em", marginBottom: 4 }}>Settings</h1>
                <p style={{ color: "#6b6b6b", fontSize: 13 }}>Manage your account details.</p>
              </div>

              <div style={{ background: "#fff", border: "1.5px solid #e7e5e2", borderRadius: 14, overflow: "hidden", marginBottom: 16 }}>
                <div style={{ padding: "18px 22px", borderBottom: "1px solid #e7e5e2", fontWeight: 600, fontSize: 14 }}>Profile</div>
                <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
                  <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: "#6b6b6b" }}>Display name</span>
                    <input value={settingName} onChange={e => setSettingName(e.target.value)} style={inputS} />
                  </label>
                  <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: "#6b6b6b" }}>Email</span>
                    <input value={user?.email ?? ""} disabled style={{ ...inputS, opacity: 0.5 }} />
                  </label>
                  <button disabled={settingSaving} onClick={async () => {
                    setSettingSaving(true);
                    await fetch("/api/auth/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: (user as { id?: string })?.id, name: settingName, avatar: "" }) });
                    setSettingSaving(false);
                  }} style={{ alignSelf: "flex-start", background: "#0a0a0a", color: "#fff", border: "none", borderRadius: 50, padding: "9px 22px", fontSize: 13, fontWeight: 500, cursor: "pointer", opacity: settingSaving ? 0.6 : 1 }}>
                    {settingSaving ? "Saving…" : "Save changes"}
                  </button>
                </div>
              </div>

              <div style={{ background: "#fff", border: "1.5px solid #e7e5e2", borderRadius: 14, overflow: "hidden" }}>
                <div style={{ padding: "18px 22px", borderBottom: "1px solid #e7e5e2", fontWeight: 600, fontSize: 14 }}>Security</div>
                <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
                  <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: "#6b6b6b" }}>Current password</span>
                    <input type="password" value={settingPwOld} onChange={e => setSettingPwOld(e.target.value)} placeholder="••••••••" style={inputS} />
                  </label>
                  <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: "#6b6b6b" }}>New password</span>
                    <input type="password" value={settingPwNew} onChange={e => setSettingPwNew(e.target.value)} placeholder="Min 8 characters" style={inputS} />
                  </label>
                  {settingPwMsg && <div style={{ fontSize: 13, color: settingPwMsg.includes("successfully") ? "#16a34a" : "#e11d48" }}>{settingPwMsg}</div>}
                  <button onClick={async () => {
                    if (!settingPwOld || settingPwNew.length < 8) { setSettingPwMsg("New password must be at least 8 characters."); return; }
                    const res = await fetch("/api/auth/change-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ oldPassword: settingPwOld, newPassword: settingPwNew }) });
                    setSettingPwMsg(res.ok ? "Password changed successfully." : "Current password is incorrect.");
                    if (res.ok) { setSettingPwOld(""); setSettingPwNew(""); }
                  }} style={{ alignSelf: "flex-start", background: "#0a0a0a", color: "#fff", border: "none", borderRadius: 50, padding: "9px 22px", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
                    Change password
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* New project modal */}
      {showNew && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
          onClick={e => { if (e.target === e.currentTarget) setShowNew(false); }}>
          <div style={{ background: "#fff", borderRadius: 18, width: "100%", maxWidth: 500, maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ padding: "22px 24px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontSize: 18, fontWeight: 500, letterSpacing: "-.01em" }}>New Project Request</h2>
              <button onClick={() => setShowNew(false)} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#6b6b6b", lineHeight: 1 }}>×</button>
            </div>
            <form onSubmit={submitProject} style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
              <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: "#6b6b6b" }}>Project title *</span>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required placeholder="e.g. Modern eCommerce Website" style={inputS} />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: "#6b6b6b" }}>Service type</span>
                <input value={form.service_type} onChange={e => setForm(f => ({ ...f, service_type: e.target.value }))} placeholder="e.g. Web Development, Mobile App" style={inputS} />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: "#6b6b6b" }}>Description</span>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="Tell us about your project…" style={{ ...inputS, resize: "vertical" }} />
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: "#6b6b6b" }}>Budget</span>
                  <input value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} placeholder="e.g. $5,000" style={inputS} />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: "#6b6b6b" }}>Timeline</span>
                  <input value={form.timeline} onChange={e => setForm(f => ({ ...f, timeline: e.target.value }))} placeholder="e.g. 6 weeks" style={inputS} />
                </label>
              </div>
              <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: "#6b6b6b" }}>Existing website</span>
                <input value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} placeholder="https://example.com" style={inputS} />
              </label>
              <button type="submit" disabled={submitting || !form.title}
                style={{ background: "#0a0a0a", color: "#fff", border: "none", borderRadius: 50, padding: "12px", fontSize: 14, fontWeight: 500, cursor: submitting || !form.title ? "not-allowed" : "pointer", opacity: submitting || !form.title ? 0.5 : 1, marginTop: 4 }}>
                {submitting ? "Submitting…" : "Submit Request"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project: p, onClick }: { project: Project; onClick: () => void }) {
  const done = p.milestones.filter(m => m.status === "completed").length;
  const total = p.milestones.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return (
    <div onClick={onClick}
      style={{ background: "#fff", border: "1.5px solid #e7e5e2", borderRadius: 14, padding: "18px 20px", cursor: "pointer", transition: "border-color .15s, box-shadow .15s" }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#b86cf9"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(184,108,249,.1)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#e7e5e2"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 10 }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 3 }}>{p.title}</div>
          {p.service_type && <div style={{ fontSize: 12, color: "#6b6b6b" }}>{p.service_type}</div>}
        </div>
        <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 50, background: `${STATUS_COLOR[p.status]}18`, color: STATUS_COLOR[p.status], whiteSpace: "nowrap", flexShrink: 0 }}>
          {STATUS_LABEL[p.status] ?? p.status}
        </span>
      </div>
      {total > 0 && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ fontSize: 11, color: "#6b6b6b" }}>Progress</span>
            <span style={{ fontSize: 11, fontWeight: 600 }}>{pct}%</span>
          </div>
          <div style={{ height: 4, background: "#f3f4f6", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? "#22c55e" : "#b86cf9", borderRadius: 4, transition: "width .5s" }} />
          </div>
        </div>
      )}
      <div style={{ fontSize: 12, color: "#b86cf9", fontWeight: 500 }}>Open project →</div>
    </div>
  );
}

const inputS: React.CSSProperties = {
  width: "100%", padding: "10px 13px", borderRadius: 9, border: "1.5px solid #e7e5e2",
  fontSize: 14, background: "#fff", color: "#0a0a0a", outline: "none", fontFamily: "inherit",
  boxSizing: "border-box",
};

// ── Icons ──
function IconDashboard() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>; }
function IconProjects() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18M8 5V3M16 5V3"/></svg>; }
function IconOffers() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"/></svg>; }
function IconBell() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></svg>; }
function IconSettings() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 4.7 15a1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.7 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 9 4.7a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A1.7 1.7 0 0 0 19.3 9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/></svg>; }
function IconSignOut() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>; }
function NotifIcon({ type, read }: { type: string; read: boolean }) {
  const c = read ? "#9a9a9a" : "#b86cf9";
  if (type === "new_message") return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
  if (type === "project_update") return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12"/></svg>;
  if (type === "new_offer") return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><path d="M12 22V7m0-5h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7zm0 0H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/></svg>;
  if (type === "offer_response") return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={read ? "#9a9a9a" : "#22c55e"} strokeWidth="2.2"><polyline points="20 6 9 17 4 12"/></svg>;
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></svg>;
}
