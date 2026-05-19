"use client";
import { useState, useEffect } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
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

const ROLE_COLOR: Record<string, { bg: string; color: string }> = {
  admin:  { bg: "#f0e9ff", color: "#6c3fc5" },
  client: { bg: "#e9f5ff", color: "#1a6fa8" },
};
const AV_COLOR: Record<string, string> = {
  admin:  "linear-gradient(135deg,#b86cf9,#7c3aed)",
  client: "linear-gradient(135deg,#60a5fa,#2563eb)",
};

export default function AdminManageUsers() {
  const [users,   setUsers]   = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");
  const [filter,  setFilter]  = useState<"all"|"admin"|"client">("all");
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editName,  setEditName]  = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPass,  setEditPass]  = useState("");
  const [saving,  setSaving]  = useState(false);
  const [toast,   setToast]   = useState("");

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
      showToast("User removed");
    } else {
      const t = await res.text();
      try { showToast(JSON.parse(t).error || "Error"); } catch { showToast("Error"); }
    }
  };

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchRole   = filter === "all" || u.role === filter;
    return matchSearch && matchRole;
  });

  const counts = { all: users.length, admin: users.filter(u => u.role === "admin").length, client: users.filter(u => u.role === "client").length };

  return (
    <section className="page active">
      <div className="page-head">
        <div>
          <h2>Manage Users <span className="it">— {users.length}</span></h2>
          <p>All registered accounts — portal clients and admin staff.</p>
        </div>
        <div className="page-actions">
          <button className="btn-ghost" onClick={load}>Refresh</button>
        </div>
      </div>

      {/* Search + filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            style={{ width: "100%", paddingLeft: 36, paddingRight: 12, paddingTop: 9, paddingBottom: 9, border: "1.5px solid var(--line)", borderRadius: 10, fontSize: 13, outline: "none", background: "#fff", boxSizing: "border-box" }}
          />
        </div>
        <div style={{ display: "flex", gap: 4, background: "var(--canvas)", border: "1.5px solid var(--line)", borderRadius: 10, padding: 3 }}>
          {(["all","admin","client"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: "6px 14px", borderRadius: 7, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600,
              background: filter === f ? "#fff" : "transparent",
              color: filter === f ? "var(--ink)" : "var(--muted)",
              boxShadow: filter === f ? "0 1px 4px rgba(0,0,0,.08)" : "none",
              transition: "all .15s",
            }}>
              {f.charAt(0).toUpperCase() + f.slice(1)} <span style={{ opacity: 0.55 }}>{counts[f]}</span>
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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 14 }}>
          {filtered.map(u => {
            const rc = ROLE_COLOR[u.role] ?? { bg: "#f0f0f0", color: "#666" };
            return (
              <div key={u.id} style={{
                background: "#fff", border: "1.5px solid var(--line)", borderRadius: 16,
                padding: "18px 20px", display: "flex", flexDirection: "column", gap: 14,
                transition: "box-shadow .2s, border-color .2s",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--brand)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(184,108,249,.1)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--line)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
              >
                {/* Header row */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
                    background: AV_COLOR[u.role] ?? "linear-gradient(135deg,#888,#555)",
                    display: "grid", placeItems: "center",
                    fontWeight: 700, fontSize: 14, color: "#fff", letterSpacing: ".02em",
                  }}>
                    {initials(u.name || u.email)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.name}</div>
                    <div style={{ fontSize: 11, color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "var(--f-mono)", letterSpacing: ".04em" }}>{u.email}</div>
                  </div>
                  <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 10, fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase", ...rc, flexShrink: 0 }}>
                    {u.role}
                  </span>
                </div>

                {/* Stats row */}
                <div style={{ display: "flex", gap: 0, borderTop: "1px solid var(--line)", paddingTop: 12 }}>
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "var(--ink)", letterSpacing: "-.03em" }}>{u.project_count}</div>
                    <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 1, fontWeight: 500, letterSpacing: ".06em", textTransform: "uppercase" }}>Projects</div>
                  </div>
                  <div style={{ width: 1, background: "var(--line)" }}/>
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{relTime(u.created_at)}</div>
                    <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 1, fontWeight: 500, letterSpacing: ".06em", textTransform: "uppercase" }}>Joined</div>
                  </div>
                  <div style={{ width: 1, background: "var(--line)" }}/>
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)" }}>#{u.id}</div>
                    <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 1, fontWeight: 500, letterSpacing: ".06em", textTransform: "uppercase" }}>User ID</div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => openEdit(u)} style={{
                    flex: 1, padding: "8px 0", border: "1.5px solid var(--line)", borderRadius: 9,
                    background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "var(--ink)",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all .15s",
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--brand)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--brand)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--line)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--ink)"; }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                    Edit
                  </button>
                  {u.role !== "admin" && (
                    <button onClick={() => deleteUser(u)} style={{
                      padding: "8px 12px", border: "1.5px solid #fee2e2", borderRadius: 9,
                      background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#ef4444",
                      display: "flex", alignItems: "center", gap: 6, transition: "all .15s",
                    }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#fef2f2"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#fff"; }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit modal */}
      {editUser && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", zIndex: 1100,
          display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
        }} onClick={e => { if (e.target === e.currentTarget) setEditUser(null); }}>
          <div style={{
            background: "#fff", borderRadius: 18, width: "100%", maxWidth: 440,
            boxShadow: "0 32px 80px rgba(0,0,0,.3)",
          }}>
            <div style={{ padding: "22px 24px 18px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16, color: "var(--ink)", letterSpacing: "-.02em" }}>Edit user</div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>#{editUser.id} · {editUser.role}</div>
              </div>
              <button onClick={() => setEditUser(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", padding: 4 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--ink)", marginBottom: 5, letterSpacing: ".04em", textTransform: "uppercase" }}>Full name *</label>
                <input value={editName} onChange={e => setEditName(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px", border: "1.5px solid var(--line)", borderRadius: 9, fontSize: 13, outline: "none", boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--ink)", marginBottom: 5, letterSpacing: ".04em", textTransform: "uppercase" }}>Email *</label>
                <input value={editEmail} onChange={e => setEditEmail(e.target.value)} type="email"
                  style={{ width: "100%", padding: "10px 12px", border: "1.5px solid var(--line)", borderRadius: 9, fontSize: 13, outline: "none", boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--ink)", marginBottom: 5, letterSpacing: ".04em", textTransform: "uppercase" }}>New password <span style={{ fontWeight: 400, color: "var(--muted)", textTransform: "none" }}>(leave blank to keep current)</span></label>
                <input value={editPass} onChange={e => setEditPass(e.target.value)} type="password" placeholder="••••••••"
                  style={{ width: "100%", padding: "10px 12px", border: "1.5px solid var(--line)", borderRadius: 9, fontSize: 13, outline: "none", boxSizing: "border-box" }}
                />
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

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
          background: "#0a0a0a", color: "#fff", padding: "10px 20px", borderRadius: 10,
          fontSize: 13, fontWeight: 600, zIndex: 2000, pointerEvents: "none",
          animation: "fadeInUp .2s ease",
        }}>
          {toast}
        </div>
      )}
    </section>
  );
}
