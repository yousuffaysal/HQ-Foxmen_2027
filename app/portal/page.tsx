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

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending", in_progress: "In Progress", review: "In Review",
  completed: "Completed", on_hold: "On Hold",
};
const STATUS_COLOR: Record<string, string> = {
  pending: "#f59e0b", in_progress: "var(--brand)", review: "#3b82f6",
  completed: "#22c55e", on_hold: "var(--muted)",
};

export default function PortalPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showNewProject, setShowNewProject] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", service_type: "", description: "", budget: "", timeline: "", website: "" });
  const [submitting, setSubmitting] = useState(false);

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
    if (status === "authenticated") loadData();
  }, [status, router, loadData]);

  useEffect(() => {
    if (!session?.user) return;
    const uid = (session.user as { id?: string }).id;
    const pusher = getPusherClient();
    if (!pusher) return;
    const ch = pusher.subscribe(`private-user-${uid}`);
    ch.bind("notification", (data: Notification) => {
      setNotifs(prev => [{ ...data, id: Date.now(), read: false, created_at: new Date().toISOString() }, ...prev]);
    });
    return () => { pusher.unsubscribe(`private-user-${uid}`); };
  }, [session]);

  const unread = notifs.filter(n => !n.read).length;

  async function markAllRead() {
    await fetch("/api/portal/notifications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ read_all: true }) });
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  }

  async function submitProject(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch("/api/portal/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const proj = await res.json();
      setProjects(prev => [{ ...proj, milestones: [] }, ...prev]);
      setShowNewProject(false);
      setForm({ title: "", service_type: "", description: "", budget: "", timeline: "", website: "" });
    }
    setSubmitting(false);
  }

  async function respondOffer(id: number, status: "accepted" | "declined") {
    await fetch("/api/portal/offers", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    setOffers(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  }

  if (status === "loading" || loading) return <PortalSkeleton />;

  const user = session!.user as { name?: string; email?: string; id?: string };
  const initials = (user.name ?? "U").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  const pendingOffers = offers.filter(o => o.status === "pending");

  return (
    <div style={{ minHeight: "100vh", background: "#f8f7f5", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header style={{ background: "#fff", borderBottom: "1px solid var(--line)", padding: "0 24px", height: 60, display: "flex", alignItems: "center", gap: 16, position: "sticky", top: 0, zIndex: 100 }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", flexShrink: 0 }}>
          <img src="/assets/logo-mark.svg" alt="Foxmen" style={{ height: 24 }} />
          <span style={{ fontWeight: 600, fontSize: 14 }}>Foxmen <em style={{ fontStyle: "italic", color: "var(--brand)" }}>Studio</em></span>
        </a>
        <div style={{ flex: 1 }} />
        <div style={{ position: "relative" }}>
          <button onClick={() => { setShowNotifs(o => !o); if (!showNotifs && unread > 0) markAllRead(); }}
            style={{ position: "relative", background: "none", border: "none", cursor: "pointer", padding: "6px", borderRadius: 8, color: "var(--ink)", display: "flex", alignItems: "center" }}>
            <BellIcon />
            {unread > 0 && <span style={{ position: "absolute", top: 2, right: 2, width: 8, height: 8, borderRadius: "50%", background: "var(--brand)" }} />}
          </button>
          {showNotifs && (
            <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", width: 320, background: "#fff", border: "1px solid var(--line)", borderRadius: 14, boxShadow: "0 8px 32px rgba(0,0,0,.12)", zIndex: 200, overflow: "hidden" }}>
              <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--line)", fontWeight: 600, fontSize: 13 }}>Notifications</div>
              {notifs.length === 0
                ? <div style={{ padding: 20, color: "var(--muted)", fontSize: 13, textAlign: "center" }}>No notifications</div>
                : notifs.slice(0, 8).map(n => (
                  <a key={n.id} href={n.link || "#"} style={{ display: "block", padding: "12px 16px", borderBottom: "1px solid var(--line)", textDecoration: "none", background: n.read ? "#fff" : "rgba(184,108,249,.04)" }}
                    onClick={() => setShowNotifs(false)}>
                    <div style={{ fontWeight: 500, fontSize: 13, color: "var(--ink)" }}>{n.title}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{n.body}</div>
                  </a>
                ))
              }
            </div>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--brand)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600 }}>{initials}</div>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
            <span style={{ fontSize: 13, fontWeight: 500 }}>{user.name}</span>
            <span style={{ fontSize: 11, color: "var(--muted)" }}>Client Portal</span>
          </div>
          <button onClick={() => signOut({ callbackUrl: "/login" })}
            style={{ marginLeft: 8, background: "none", border: "1px solid var(--line)", borderRadius: 8, padding: "5px 10px", fontSize: 12, color: "var(--muted)", cursor: "pointer" }}>
            Sign out
          </button>
        </div>
      </header>

      <div style={{ flex: 1, maxWidth: 960, margin: "0 auto", width: "100%", padding: "32px 20px" }}>
        {/* Welcome */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 400, letterSpacing: "-0.02em", marginBottom: 4 }}>
            Hello, {user.name?.split(" ")[0]} 👋
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 14 }}>Here&apos;s an overview of your projects and activity.</p>
        </div>

        {/* Pending offers */}
        {pendingOffers.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14, color: "var(--ink)" }}>
              🎁 Offers from Foxmen
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {pendingOffers.map(o => (
                <div key={o.id} style={{ background: "linear-gradient(135deg,#f5eeff,#fff)", border: "1.5px solid #e0c7ff", borderRadius: 14, padding: "18px 20px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{o.title}</div>
                    <div style={{ fontSize: 13, color: "var(--muted)" }}>{o.description}</div>
                    {o.price && <div style={{ fontSize: 13, color: "var(--brand)", fontWeight: 500, marginTop: 4 }}>{o.price}</div>}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => respondOffer(o.id, "accepted")}
                      style={{ background: "var(--brand)", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
                      Accept
                    </button>
                    <button onClick={() => respondOffer(o.id, "declined")}
                      style={{ background: "none", color: "var(--muted)", border: "1px solid var(--line)", borderRadius: 8, padding: "8px 16px", fontSize: 13, cursor: "pointer" }}>
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 500, letterSpacing: "-0.01em" }}>Your Projects</h2>
          <button onClick={() => setShowNewProject(true)}
            style={{ background: "var(--ink)", color: "#fff", border: "none", borderRadius: 50, padding: "9px 20px", fontSize: 13, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> New Project
          </button>
        </div>

        {projects.length === 0 ? (
          <div style={{ background: "#fff", border: "1.5px dashed var(--line)", borderRadius: 16, padding: "48px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🚀</div>
            <div style={{ fontWeight: 500, fontSize: 16, marginBottom: 8 }}>No projects yet</div>
            <div style={{ color: "var(--muted)", fontSize: 14, marginBottom: 20 }}>Start by creating your first project request</div>
            <button onClick={() => setShowNewProject(true)}
              style={{ background: "var(--brand)", color: "#fff", border: "none", borderRadius: 50, padding: "10px 24px", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
              Create project
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {projects.map(p => <ProjectCard key={p.id} project={p} onClick={() => router.push(`/portal/project/${p.id}`)} />)}
          </div>
        )}
      </div>

      {/* New project modal */}
      {showNewProject && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
          onClick={e => { if (e.target === e.currentTarget) setShowNewProject(false); }}>
          <div style={{ background: "#fff", borderRadius: 18, width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ padding: "24px 24px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontSize: 20, fontWeight: 500, letterSpacing: "-0.01em" }}>New Project Request</h2>
              <button onClick={() => setShowNewProject(false)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "var(--muted)", lineHeight: 1 }}>×</button>
            </div>
            <form onSubmit={submitProject} style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
              <Field label="Project title *" value={form.title} onChange={v => setForm(f => ({ ...f, title: v }))} placeholder="e.g. Modern eCommerce Website" required />
              <Field label="Service type" value={form.service_type} onChange={v => setForm(f => ({ ...f, service_type: v }))} placeholder="e.g. Web Development, Mobile App, AI Integration" />
              <Field label="Description" value={form.description} onChange={v => setForm(f => ({ ...f, description: v }))} placeholder="Tell us about your project goals…" multiline />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Field label="Budget" value={form.budget} onChange={v => setForm(f => ({ ...f, budget: v }))} placeholder="e.g. $5,000" />
                <Field label="Timeline" value={form.timeline} onChange={v => setForm(f => ({ ...f, timeline: v }))} placeholder="e.g. 6 weeks" />
              </div>
              <Field label="Website (if any)" value={form.website} onChange={v => setForm(f => ({ ...f, website: v }))} placeholder="https://example.com" />
              <button type="submit" disabled={submitting || !form.title}
                style={{ background: "var(--ink)", color: "#fff", border: "none", borderRadius: 50, padding: "13px", fontSize: 15, fontWeight: 500, cursor: submitting || !form.title ? "not-allowed" : "pointer", opacity: submitting || !form.title ? 0.6 : 1, marginTop: 4 }}>
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
  const total = p.milestones.length;
  const done = p.milestones.filter(m => m.status === "completed").length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div onClick={onClick} style={{ background: "#fff", borderRadius: 14, border: "1.5px solid var(--line)", padding: "20px 22px", cursor: "pointer", transition: "border-color 0.15s, box-shadow 0.15s" }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--brand)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(184,108,249,.12)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--line)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>{p.title}</div>
          {p.service_type && <div style={{ fontSize: 12, color: "var(--muted)" }}>{p.service_type}</div>}
        </div>
        <StatusBadge status={p.status} />
      </div>
      {total > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: "var(--muted)" }}>Progress</span>
            <span style={{ fontSize: 12, fontWeight: 500 }}>{done}/{total} milestones</span>
          </div>
          <div style={{ height: 4, background: "var(--line)", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? "#22c55e" : "var(--brand)", borderRadius: 4, transition: "width 0.5s" }} />
          </div>
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 12, color: "var(--muted)" }}>
          Updated {new Date(p.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </div>
        <div style={{ fontSize: 12, color: "var(--brand)", fontWeight: 500 }}>View details →</div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 50, background: `${STATUS_COLOR[status] ?? "#888"}22`, color: STATUS_COLOR[status] ?? "#888", whiteSpace: "nowrap", letterSpacing: "0.02em" }}>
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}

function Field({ label, value, onChange, placeholder, required, multiline }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; required?: boolean; multiline?: boolean;
}) {
  const s: React.CSSProperties = { width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid var(--line)", fontSize: 14, background: "#fff", color: "var(--ink)", outline: "none", fontFamily: "inherit", boxSizing: "border-box", resize: "vertical" };
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <span style={{ fontSize: 13, fontWeight: 500 }}>{label}</span>
      {multiline
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} style={s} />
        : <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required={required} style={s} />
      }
    </label>
  );
}

function BellIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></svg>;
}

function PortalSkeleton() {
  return (
    <div style={{ minHeight: "100vh", background: "#f8f7f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "var(--muted)", fontSize: 14 }}>Loading your portal…</div>
    </div>
  );
}
