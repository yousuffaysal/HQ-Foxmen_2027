"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  fox_id: string | null;
  blocked: boolean;
  created_at: string;
  project_count: number;
};

function relTime(iso: string) {
  const d = Date.now() - new Date(iso).getTime();
  const days = Math.floor(d / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

function initials(name: string) {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

const ROLE_STYLE: Record<string, { bg: string; color: string }> = {
  admin:  { bg: "#f0e9ff", color: "#6c3fc5" },
  client: { bg: "#e9f0ff", color: "#1a52a8" },
};
const AV_GRAD: Record<string, string> = {
  admin:  "linear-gradient(135deg,#b86cf9,#7c3aed)",
  client: "linear-gradient(135deg,#60a5fa,#2563eb)",
};

export default function AdminManageUsers() {
  const { data: session } = useSession();
  const selfId = (session?.user as { id?: string })?.id;

  const [users,    setUsers]    = useState<User[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [filter,   setFilter]   = useState<"all"|"admin"|"client"|"blocked">("all");
  const [selected, setSelected] = useState<number | null>(null);
  const [editUser,  setEditUser]  = useState<User | null>(null);
  const [editName,  setEditName]  = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPass,  setEditPass]  = useState("");
  const [saving,   setSaving]   = useState(false);
  const [toast,    setToast]    = useState("");

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const r = await fetch("/api/admin/users").then(r => r.json()).catch(() => []);
    setUsers(Array.isArray(r) ? r : []);
    setLoading(false);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const openEdit = (u: User) => {
    setEditUser(u);
    setEditName(u.name);
    setEditEmail(u.email);
    setEditPass("");
  };

  const saveEdit = async () => {
    if (!editUser) return;
    if (!editName.trim() || !editEmail.trim()) { showToast("Name and email are required."); return; }
    setSaving(true);
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editUser.id, name: editName.trim(), email: editEmail.trim(), password: editPass }),
    });
    if (res.ok) {
      setUsers(prev => prev.map(u => u.id === editUser.id
        ? { ...u, name: editName.trim(), email: editEmail.trim().toLowerCase() }
        : u));
      setEditUser(null);
      showToast("User updated");
    } else {
      const t = await res.text();
      try { showToast(JSON.parse(t).error || "Error"); } catch { showToast("Error saving"); }
    }
    setSaving(false);
  };

  const deleteUser = async (u: User) => {
    if (u.role === "admin") { showToast("Cannot delete admin users."); return; }
    if (!confirm(`Remove ${u.name}? This cannot be undone.`)) return;
    const res = await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: u.id }),
    });
    if (res.ok) {
      setUsers(prev => prev.filter(x => x.id !== u.id));
      if (selected === u.id) setSelected(null);
      showToast("User removed");
    } else {
      const t = await res.text();
      try { showToast(JSON.parse(t).error || "Error"); } catch { showToast("Error"); }
    }
  };

  const changeRole = async (u: User, newRole: "admin" | "client") => {
    const action = newRole === "admin" ? "promote" : "demote";
    if (!confirm(`${newRole === "admin" ? "Make" : "Remove admin from"} ${u.name}? ${newRole === "admin" ? "They will have full access to this panel." : "They will lose admin access."}`)) return;
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: u.id, newRole }),
    });
    if (res.ok) {
      setUsers(prev => prev.map(x => x.id === u.id ? { ...x, role: newRole } : x));
      showToast(newRole === "admin" ? "User promoted to admin" : "Admin access removed");
    } else {
      const t = await res.json().catch(() => ({})) as { error?: string };
      showToast(t.error || "Error");
    }
    void action;
  };

  const toggleBlock = async (u: User) => {
    const blocking = !u.blocked;
    if (blocking && !confirm(`Block ${u.name}? They won't be able to log in.`)) return;
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: u.id, blocked: blocking }),
    });
    if (res.ok) {
      setUsers(prev => prev.map(x => x.id === u.id ? { ...x, blocked: blocking } : x));
      showToast(blocking ? "User blocked" : "User unblocked");
    } else {
      const t = await res.json().catch(() => ({})) as { error?: string };
      showToast(t.error || "Error");
    }
  };

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.fox_id ?? "").toLowerCase().includes(q);
    const matchRole = filter === "all" || (filter === "blocked" ? u.blocked : u.role === filter);
    return matchSearch && matchRole;
  });

  const counts = {
    all:     users.length,
    admin:   users.filter(u => u.role === "admin").length,
    client:  users.filter(u => u.role === "client").length,
    blocked: users.filter(u => u.blocked).length,
  };

  const selectedUser = selected !== null ? users.find(u => u.id === selected) : null;
  const isSelf = (u: User) => String(u.id) === String(selfId);

  return (
    <section className="page active">
      <div className="page-head">
        <div>
          <h2>Manage Users <span className="it">— {users.length}</span></h2>
          <p>All registered accounts. Every user has a unique Foxmen ID.</p>
        </div>
        <div className="page-actions">
          <button className="btn-ghost" onClick={load}>Refresh</button>
        </div>
      </div>

      {/* Search + filter */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
          <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email, or FXM ID…"
            style={{ width: "100%", paddingLeft: 36, paddingRight: 12, paddingTop: 9, paddingBottom: 9, border: "1.5px solid var(--line)", borderRadius: 10, fontSize: 13, outline: "none", background: "#fff", boxSizing: "border-box" }}
          />
        </div>
        <div style={{ display: "flex", gap: 4, background: "var(--canvas)", border: "1.5px solid var(--line)", borderRadius: 10, padding: 3 }}>
          {(["all","admin","client","blocked"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: "6px 14px", borderRadius: 7, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600,
              background: filter === f ? (f === "blocked" ? "#fef2f2" : "#fff") : "transparent",
              color: filter === f ? (f === "blocked" ? "#ef4444" : "var(--ink)") : "var(--muted)",
              boxShadow: filter === f ? "0 1px 4px rgba(0,0,0,.08)" : "none",
              transition: "all .15s",
            }}>
              {f.charAt(0).toUpperCase() + f.slice(1)} <span style={{ opacity: 0.5, fontWeight: 400 }}>{counts[f]}</span>
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ padding: 48, textAlign: "center", color: "var(--muted)", fontSize: 14 }}>Loading users…</div>
      ) : filtered.length === 0 ? (
        <div className="empty">
          <h3>No users <span style={{ fontStyle: "italic", color: "var(--brand)" }}>found.</span></h3>
          <p>{search ? "Try a different search term." : "No users match this filter."}</p>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>

          {/* ── LIST ── */}
          <div style={{ flex: 1, background: "#fff", border: "1.5px solid var(--line)", borderRadius: 16, overflow: "hidden" }}>
            {/* Table header */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1.4fr 110px 80px 90px 80px", gap: 0, padding: "10px 18px", borderBottom: "1.5px solid var(--line)", background: "var(--canvas)" }}>
              {["User", "Fox ID", "Role", "Projects", "Joined", ""].map((h, i) => (
                <div key={i} style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", letterSpacing: ".1em", textTransform: "uppercase" }}>{h}</div>
              ))}
            </div>

            {filtered.map((u, idx) => {
              const isSelected = selected === u.id;
              const rc = ROLE_STYLE[u.role] ?? { bg: "#f0f0f0", color: "#666" };
              return (
                <div key={u.id} onClick={() => setSelected(isSelected ? null : u.id)}
                  style={{
                    display: "grid", gridTemplateColumns: "2fr 1.4fr 110px 80px 90px 80px",
                    gap: 0, padding: "13px 18px", alignItems: "center", cursor: "pointer",
                    borderBottom: idx < filtered.length - 1 ? "1px solid var(--line)" : "none",
                    background: isSelected ? "rgba(184,108,249,.05)" : u.blocked ? "rgba(239,68,68,.03)" : "#fff",
                    borderLeft: isSelected ? "3px solid var(--brand)" : u.blocked ? "3px solid #ef4444" : "3px solid transparent",
                    opacity: u.blocked ? 0.75 : 1,
                    transition: "all .12s",
                  }}
                  onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = "#fafafa"; }}
                  onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = u.blocked ? "rgba(239,68,68,.03)" : "#fff"; }}
                >
                  {/* Name + email */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                      background: u.blocked ? "linear-gradient(135deg,#f87171,#dc2626)" : (AV_GRAD[u.role] ?? "#888"),
                      display: "grid", placeItems: "center",
                      fontWeight: 700, fontSize: 12, color: "#fff",
                    }}>
                      {initials(u.name || u.email)}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 13, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.name}</div>
                      <div style={{ fontSize: 11, color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.email}</div>
                    </div>
                  </div>

                  {/* Fox ID */}
                  <div style={{ fontFamily: "var(--f-mono)", fontSize: 12, fontWeight: 700, color: "var(--brand)", letterSpacing: ".06em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {u.fox_id ?? "—"}
                  </div>

                  {/* Role + blocked badge */}
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 10, fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase", ...rc }}>
                      {u.role}
                    </span>
                    {u.blocked && (
                      <span style={{ padding: "3px 8px", borderRadius: 999, fontSize: 10, fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase", background: "#fef2f2", color: "#ef4444" }}>
                        blocked
                      </span>
                    )}
                  </div>

                  {/* Projects */}
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{u.project_count}</div>

                  {/* Joined */}
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>{relTime(u.created_at)}</div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }} onClick={e => e.stopPropagation()}>
                    <button title="Edit" onClick={() => openEdit(u)} style={{
                      width: 30, height: 30, border: "1.5px solid var(--line)", borderRadius: 7,
                      background: "#fff", cursor: "pointer", display: "grid", placeItems: "center", color: "var(--muted)", transition: "all .12s",
                    }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--brand)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--brand)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--line)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--muted)"; }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                    </button>
                    {u.role !== "admin" && (
                      <button title="Delete" onClick={() => deleteUser(u)} style={{
                        width: 30, height: 30, border: "1.5px solid #fee2e2", borderRadius: 7,
                        background: "#fff", cursor: "pointer", display: "grid", placeItems: "center", color: "#ef4444", transition: "all .12s",
                      }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#fef2f2"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#fff"; }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── DETAIL PANEL ── */}
          {selectedUser && (
            <div style={{ width: 260, flexShrink: 0, background: "#fff", border: "1.5px solid var(--line)", borderRadius: 16, overflow: "hidden", position: "sticky", top: 80 }}>
              {/* Avatar + name */}
              <div style={{ background: "linear-gradient(160deg,#0a0a0a,#1a0f2e)", padding: "24px 20px 20px", textAlign: "center" }}>
                <div style={{
                  width: 56, height: 56, borderRadius: "50%", margin: "0 auto 12px",
                  background: selectedUser.blocked ? "linear-gradient(135deg,#f87171,#dc2626)" : (AV_GRAD[selectedUser.role] ?? "#888"),
                  display: "grid", placeItems: "center",
                  fontWeight: 800, fontSize: 18, color: "#fff",
                }}>
                  {initials(selectedUser.name || selectedUser.email)}
                </div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#fff", marginBottom: 3 }}>{selectedUser.name}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)" }}>{selectedUser.email}</div>
                <div style={{ marginTop: 14, display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(184,108,249,.15)", border: "1px solid rgba(184,108,249,.3)", padding: "6px 14px", borderRadius: 8 }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#b86cf9" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <span style={{ fontFamily: "var(--f-mono)", fontSize: 13, fontWeight: 700, color: "#b86cf9", letterSpacing: ".06em" }}>{selectedUser.fox_id ?? "—"}</span>
                </div>
              </div>
              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid var(--line)" }}>
                <div style={{ padding: "14px 16px", borderRight: "1px solid var(--line)", textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "var(--ink)", letterSpacing: "-.03em" }}>{selectedUser.project_count}</div>
                  <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 2, textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 600 }}>Projects</div>
                </div>
                <div style={{ padding: "14px 16px", textAlign: "center" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{relTime(selectedUser.created_at)}</div>
                  <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 2, textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 600 }}>Joined</div>
                </div>
              </div>
              {/* Info rows */}
              <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 10, color: "var(--muted)", fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 4 }}>Role</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <span style={{ padding: "3px 11px", borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase", ...(ROLE_STYLE[selectedUser.role] ?? { bg: "#f0f0f0", color: "#666" }) }}>
                      {selectedUser.role}
                    </span>
                    {selectedUser.blocked && (
                      <span style={{ padding: "3px 11px", borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase", background: "#fef2f2", color: "#ef4444" }}>
                        blocked
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: "var(--muted)", fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 4 }}>DB User ID</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)", fontFamily: "var(--f-mono)" }}>#{selectedUser.id}</div>
                </div>
              </div>
              {/* Actions */}
              <div style={{ padding: "0 18px 18px", display: "flex", flexDirection: "column", gap: 8 }}>
                <button onClick={() => openEdit(selectedUser)} style={{ width: "100%", padding: "9px 0", border: "1.5px solid var(--brand)", borderRadius: 9, background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 700, color: "var(--brand)", transition: "all .15s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(184,108,249,.06)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#fff"; }}
                >
                  Edit user
                </button>

                {/* Make Admin / Remove Admin */}
                {!isSelf(selectedUser) && selectedUser.role === "client" && (
                  <button onClick={() => changeRole(selectedUser, "admin")} style={{ width: "100%", padding: "9px 0", border: "1.5px solid #e9d5ff", borderRadius: 9, background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 700, color: "#7c3aed", transition: "all .15s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#faf5ff"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#fff"; }}
                  >
                    Make admin
                  </button>
                )}
                {!isSelf(selectedUser) && selectedUser.role === "admin" && (
                  <button onClick={() => changeRole(selectedUser, "client")} style={{ width: "100%", padding: "9px 0", border: "1.5px solid var(--line)", borderRadius: 9, background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 700, color: "var(--muted)", transition: "all .15s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#fafafa"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#fff"; }}
                  >
                    Remove admin
                  </button>
                )}

                {/* Block / Unblock */}
                {!isSelf(selectedUser) && (
                  <button onClick={() => toggleBlock(selectedUser)} style={{
                    width: "100%", padding: "9px 0", borderRadius: 9, cursor: "pointer", fontSize: 12, fontWeight: 700, transition: "all .15s",
                    border: selectedUser.blocked ? "1.5px solid #d1fae5" : "1.5px solid #fee2e2",
                    background: "#fff",
                    color: selectedUser.blocked ? "#059669" : "#ef4444",
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = selectedUser.blocked ? "#f0fdf4" : "#fef2f2"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#fff"; }}
                  >
                    {selectedUser.blocked ? "Unblock user" : "Block user"}
                  </button>
                )}

                {selectedUser.role !== "admin" && (
                  <button onClick={() => deleteUser(selectedUser)} style={{ width: "100%", padding: "9px 0", border: "1.5px solid #fee2e2", borderRadius: 9, background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 700, color: "#ef4444", transition: "all .15s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#fef2f2"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#fff"; }}
                  >
                    Remove user
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── EDIT MODAL ── */}
      {editUser && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
          onClick={e => { if (e.target === e.currentTarget) setEditUser(null); }}>
          <div style={{ background: "#fff", borderRadius: 18, width: "100%", maxWidth: 440, boxShadow: "0 32px 80px rgba(0,0,0,.3)" }}>
            <div style={{ padding: "22px 24px 18px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16, color: "var(--ink)", letterSpacing: "-.02em" }}>Edit user</div>
                <div style={{ fontSize: 12, color: "var(--brand)", marginTop: 2, fontFamily: "var(--f-mono)", fontWeight: 700 }}>{editUser.fox_id ?? `#${editUser.id}`}</div>
              </div>
              <button onClick={() => setEditUser(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", padding: 4 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--ink)", marginBottom: 5, letterSpacing: ".04em", textTransform: "uppercase" }}>Full name *</label>
                <input value={editName} onChange={e => setEditName(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px", border: "1.5px solid var(--line)", borderRadius: 9, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--ink)", marginBottom: 5, letterSpacing: ".04em", textTransform: "uppercase" }}>Email *</label>
                <input value={editEmail} onChange={e => setEditEmail(e.target.value)} type="email"
                  style={{ width: "100%", padding: "10px 12px", border: "1.5px solid var(--line)", borderRadius: 9, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--ink)", marginBottom: 5, letterSpacing: ".04em", textTransform: "uppercase" }}>
                  New password <span style={{ fontWeight: 400, color: "var(--muted)", textTransform: "none" }}>(blank = keep current)</span>
                </label>
                <input value={editPass} onChange={e => setEditPass(e.target.value)} type="password" placeholder="••••••••"
                  style={{ width: "100%", padding: "10px 12px", border: "1.5px solid var(--line)", borderRadius: 9, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
              </div>
            </div>
            <div style={{ padding: "14px 24px 22px", display: "flex", gap: 10 }}>
              <button onClick={() => setEditUser(null)} style={{ flex: 1, padding: "10px 0", border: "1.5px solid var(--line)", borderRadius: 9, background: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "var(--muted)" }}>
                Cancel
              </button>
              <button onClick={saveEdit} disabled={saving} style={{ flex: 2, padding: "10px 0", border: "none", borderRadius: 9, background: saving ? "#d4a8f8" : "var(--brand)", cursor: saving ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 700, color: "#fff" }}>
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div style={{ position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", background: "#0a0a0a", color: "#fff", padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600, zIndex: 2000, pointerEvents: "none" }}>
          {toast}
        </div>
      )}
    </section>
  );
}
