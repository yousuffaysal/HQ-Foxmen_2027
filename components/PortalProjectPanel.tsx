"use client";
import { useState, useEffect, useRef } from "react";
import { getPusherClient } from "@/lib/pusher";

type Milestone = { id: number; title: string; status: string; description: string; due_date: string; completed_at: string | null };
type Project = {
  id: number; title: string; service_type: string; status: string;
  description: string; budget: string; timeline: string; website: string;
  admin_note: string; created_at: string; updated_at: string;
  milestones: Milestone[];
};
type Message = { id: number; project_id: number; sender_id: number; sender_name: string; sender_role: string; message: string; image_url?: string; had_image?: boolean; created_at: string };

interface Props {
  project: Project;
  onClose: () => void;
  defaultTab?: "details" | "milestones" | "chat";
  onUnread?: (projectId: number, count: number) => void;
}

const STATUS_COLOR: Record<string, string> = {
  pending: "#f59e0b", in_progress: "#b86cf9", review: "#3b82f6",
  completed: "#22c55e", on_hold: "#6b6b6b",
};
const STATUS_LABEL: Record<string, string> = {
  pending: "Pending", in_progress: "In Progress", review: "In Review",
  completed: "Completed", on_hold: "On Hold",
};
const MS_COLOR: Record<string, { bg: string; fg: string; dot: string }> = {
  completed: { bg: "#f0fdf4", fg: "#15803d", dot: "#22c55e" },
  in_progress: { bg: "rgba(184,108,249,.08)", fg: "#b86cf9", dot: "#b86cf9" },
  pending: { bg: "#f9fafb", fg: "#6b7280", dot: "#d1d5db" },
};

function inject() {
  if (document.getElementById("portal-panel-css")) return;
  const s = document.createElement("style");
  s.id = "portal-panel-css";
  s.textContent = `
    @keyframes ppSlide { from{transform:translateX(100%);opacity:0} to{transform:translateX(0);opacity:1} }
    @keyframes ppMsg   { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }
    .pp-panel { animation: ppSlide .28s cubic-bezier(.22,1,.36,1) both }
    .pp-msg   { animation: ppMsg .18s cubic-bezier(.22,1,.36,1) both }
    .pp-tab:hover { color: #0a0a0a !important }
    .pp-chat-input:focus { border-color:#b86cf9!important;box-shadow:0 0 0 3px rgba(184,108,249,.12)!important;outline:none }
    .pp-send:not(:disabled):hover { background:#a05ce8!important }
    .pp-img-btn:hover { background:rgba(184,108,249,.12)!important;color:#b86cf9!important }
    .pp-img-thumb { animation: ppMsg .2s both }
    .pp-ms-item { transition: box-shadow .15s }
    .pp-ms-item:hover { box-shadow: 0 2px 12px rgba(0,0,0,.08) }
    .pp-overlay { animation: ppFade .2s ease both }
    @keyframes ppFade { from{opacity:0} to{opacity:1} }
  `;
  document.head.appendChild(s);
}

export default function PortalProjectPanel({ project, onClose, defaultTab = "details", onUnread }: Props) {
  const [tab, setTab] = useState<"details" | "milestones" | "chat">(defaultTab);
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [imgPreview, setImgPreview] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const handledIds = useRef(new Set<number>());

  const done  = project.milestones.filter(m => m.status === "completed").length;
  const total = project.milestones.length;
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0;

  useEffect(() => { inject(); }, []);

  useEffect(() => {
    if (tab !== "chat") return;
    setLoadingMsgs(true);
    fetch(`/api/portal/messages?project_id=${project.id}`)
      .then(r => r.ok ? r.json() : [])
      .then(data => { setMsgs(Array.isArray(data) ? data : []); setLoadingMsgs(false); })
      .then(() => setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 80));
    setTimeout(() => inputRef.current?.focus(), 120);
  }, [tab, project.id]);

  useEffect(() => {
    const pusher = getPusherClient();
    if (!pusher) return;
    const ch = pusher.subscribe(`private-project-${project.id}`);
    ch.bind("new-message", (msg: Message) => {
      if (handledIds.current.has(msg.id)) return;
      setMsgs(prev => prev.some(m => m.id === msg.id) ? prev : [...prev, msg]);
      if (tab === "chat") setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
      else onUnread?.(project.id, 1);
    });
    return () => { pusher.unsubscribe(`private-project-${project.id}`); };
  }, [project.id, tab, onUnread]);

  function pickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgFile(file);
    setImgPreview(URL.createObjectURL(file));
    e.target.value = "";
  }

  function clearImage() {
    if (imgPreview) URL.revokeObjectURL(imgPreview);
    setImgFile(null);
    setImgPreview(null);
  }

  async function send(e: { preventDefault(): void }) {
    e.preventDefault();
    const text = input.trim();
    if ((!text && !imgFile) || sending) return;
    setSending(true);
    setInput("");

    let uploadedUrl = "";
    if (imgFile) {
      const fd = new FormData();
      fd.append("file", imgFile);
      const upRes = await fetch("/api/portal/upload", { method: "POST", body: fd });
      if (upRes.ok) uploadedUrl = (await upRes.json()).url as string;
      clearImage();
    }

    const optId = `opt-${Date.now()}`;
    const opt: Message = {
      id: optId as unknown as number, project_id: project.id,
      sender_id: 0, sender_name: "You", sender_role: "client",
      message: text, image_url: uploadedUrl || undefined,
      created_at: new Date().toISOString(),
    };
    setMsgs(prev => [...prev, opt]);
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 40);

    const res = await fetch("/api/portal/messages", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project_id: project.id, message: text, image_url: uploadedUrl }),
    });
    if (res.ok) {
      const msg = await res.json();
      handledIds.current.add(msg.id);
      setMsgs(prev => {
        const without = prev.filter(m => (m.id as unknown as string) !== optId);
        return without.some(m => m.id === msg.id) ? without : [...without, msg];
      });
    }
    setSending(false);
  }

  const TABS: { key: typeof tab; label: string; icon: React.ReactNode }[] = [
    {
      key: "details", label: "Details",
      icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 9h6M9 13h6M9 17h4"/></svg>,
    },
    {
      key: "milestones", label: "Timeline",
      icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4"/></svg>,
    },
    {
      key: "chat", label: "Chat",
      icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    },
  ];

  return (
    <>
      {/* Overlay */}
      <div className="pp-overlay" onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,.18)", backdropFilter: "blur(2px)" }} />

      {/* Lightbox */}
      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{ position: "fixed", inset: 0, zIndex: 400, background: "rgba(0,0,0,.88)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, cursor: "zoom-out" }}>
          <img src={lightbox} alt="full size" style={{ maxWidth: "100%", maxHeight: "90vh", borderRadius: 12, boxShadow: "0 24px 80px rgba(0,0,0,.5)", objectFit: "contain" }} />
          <button onClick={() => setLightbox(null)} style={{ position: "absolute", top: 20, right: 20, width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,.15)", border: "none", cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, lineHeight: 1 }}>×</button>
        </div>
      )}

      {/* Panel */}
      <div className="pp-panel" style={{
        position: "fixed", right: 0, top: 0, bottom: 0, width: 500,
        zIndex: 201, background: "#fff", display: "flex", flexDirection: "column",
        boxShadow: "-16px 0 60px rgba(0,0,0,.14)",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}>
        {/* Header */}
        <div style={{ padding: "18px 22px 0", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 50,
                  background: `${STATUS_COLOR[project.status] ?? "#888"}1a`,
                  color: STATUS_COLOR[project.status] ?? "#888",
                }}>
                  {STATUS_LABEL[project.status] ?? project.status}
                </span>
                {project.service_type && (
                  <span style={{ fontSize: 11, color: "#9a9a9a" }}>{project.service_type}</span>
                )}
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0a0a0a", letterSpacing: "-.02em", margin: 0, lineHeight: 1.2 }}>
                {project.title}
              </h2>
            </div>
            <button onClick={onClose}
              style={{ width: 32, height: 32, borderRadius: "50%", background: "#f4f3f1", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#6b6b6b", flexShrink: 0, transition: "background .15s" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#e7e5e2")}
              onMouseLeave={e => (e.currentTarget.style.background = "#f4f3f1")}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          {/* Progress bar */}
          {total > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: "#6b6b6b" }}>Progress</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: pct === 100 ? "#22c55e" : "#b86cf9" }}>{pct}%</span>
              </div>
              <div style={{ height: 5, background: "#f0ede8", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? "#22c55e" : "linear-gradient(90deg,#b86cf9,#7c3aed)", borderRadius: 99, transition: "width .6s cubic-bezier(.22,1,.36,1)" }} />
              </div>
            </div>
          )}

          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1.5px solid #f0ede8", gap: 0 }}>
            {TABS.map(t => (
              <button key={t.key} className="pp-tab" onClick={() => setTab(t.key)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "10px 16px", border: "none", background: "none", cursor: "pointer",
                  fontSize: 13, fontWeight: tab === t.key ? 600 : 400,
                  color: tab === t.key ? "#0a0a0a" : "#9a9a9a",
                  borderBottom: `2px solid ${tab === t.key ? "#b86cf9" : "transparent"}`,
                  marginBottom: "-1.5px", transition: "color .15s",
                }}>
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "thin", scrollbarColor: "#e7e5e2 transparent" }}>

          {/* ── DETAILS ── */}
          {tab === "details" && (
            <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
              {project.description && (
                <div style={{ background: "#fafaf8", border: "1.5px solid #f0ede8", borderRadius: 12, padding: "14px 16px" }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: "#9a9a9a", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 6 }}>Description</div>
                  <p style={{ fontSize: 13.5, color: "#333", lineHeight: 1.7, margin: 0 }}>{project.description}</p>
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { label: "Budget", value: project.budget },
                  { label: "Timeline", value: project.timeline },
                  { label: "Website", value: project.website },
                  { label: "Submitted", value: new Date(project.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) },
                ].map(({ label, value }) => value ? (
                  <div key={label} style={{ background: "#fafaf8", border: "1.5px solid #f0ede8", borderRadius: 10, padding: "12px 14px" }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: "#9a9a9a", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 13.5, fontWeight: 500, color: "#0a0a0a" }}>
                      {label === "Website" ? <a href={value} target="_blank" rel="noopener" style={{ color: "#b86cf9", textDecoration: "none" }}>{value}</a> : value}
                    </div>
                  </div>
                ) : null)}
              </div>
              {project.admin_note && (
                <div style={{ background: "rgba(184,108,249,.06)", border: "1.5px solid rgba(184,108,249,.2)", borderRadius: 12, padding: "14px 16px" }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: "#b86cf9", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 6 }}>Note from Foxmen</div>
                  <p style={{ fontSize: 13.5, color: "#333", lineHeight: 1.7, margin: 0 }}>{project.admin_note}</p>
                </div>
              )}
            </div>
          )}

          {/* ── MILESTONES ── */}
          {tab === "milestones" && (
            <div style={{ padding: "20px 22px" }}>
              {project.milestones.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px 20px", color: "#9a9a9a", fontSize: 13, lineHeight: 1.7 }}>
                  No milestones added yet.<br/>Your project team will add them soon.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {project.milestones.map((m, i) => {
                    const c = MS_COLOR[m.status] ?? MS_COLOR.pending;
                    return (
                      <div key={m.id} className="pp-ms-item" style={{
                        display: "flex", gap: 14, alignItems: "flex-start",
                        background: c.bg, border: `1.5px solid ${c.dot}28`,
                        borderRadius: 12, padding: "14px 16px",
                      }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 2, flexShrink: 0 }}>
                          <div style={{ width: 10, height: 10, borderRadius: "50%", background: c.dot, boxShadow: `0 0 0 3px ${c.dot}25` }} />
                          {i < project.milestones.length - 1 && (
                            <div style={{ width: 1.5, height: 24, background: "#e7e5e2", margin: "4px 0" }} />
                          )}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
                            <span style={{ fontSize: 13.5, fontWeight: 600, color: "#0a0a0a" }}>{m.title}</span>
                            <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 50, background: c.dot + "20", color: c.fg, whiteSpace: "nowrap" }}>
                              {m.status.replace("_", " ")}
                            </span>
                          </div>
                          {m.description && <p style={{ fontSize: 12.5, color: "#6b6b6b", margin: 0, lineHeight: 1.6 }}>{m.description}</p>}
                          {m.due_date && (
                            <div style={{ fontSize: 11, color: "#9a9a9a", marginTop: 5 }}>
                              Due: {new Date(m.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── CHAT ── */}
          {tab === "chat" && (
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <div style={{ flex: 1, padding: "16px 18px 8px", display: "flex", flexDirection: "column", gap: 8, overflowY: "auto" }}>
                {loadingMsgs && (
                  <div style={{ textAlign: "center", color: "#9a9a9a", fontSize: 13, paddingTop: 40 }}>Loading…</div>
                )}
                {!loadingMsgs && msgs.length === 0 && (
                  <div style={{ textAlign: "center", color: "#9a9a9a", fontSize: 13, paddingTop: 48, lineHeight: 1.8 }}>
                    No messages yet.<br/>Send a message to your project team.
                  </div>
                )}
                {msgs.map(m => {
                  const isClient = m.sender_role === "client";
                  return (
                    <div key={m.id} className="pp-msg" style={{ display: "flex", flexDirection: "column", alignItems: isClient ? "flex-end" : "flex-start" }}>
                      <div style={{ fontSize: 10, color: "#9a9a9a", marginBottom: 3, paddingLeft: 2, paddingRight: 2 }}>
                        {isClient ? "You" : "Foxmen Studio"}
                      </div>
                      <div style={{
                        maxWidth: "78%", padding: m.image_url && !m.message ? "4px" : "10px 14px",
                        borderRadius: isClient ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                        fontSize: 13.5, lineHeight: 1.55, wordBreak: "break-word",
                        background: isClient ? "#b86cf9" : "#f4f3f1",
                        color: isClient ? "#fff" : "#0a0a0a",
                        overflow: "hidden",
                      }}>
                        {m.image_url ? (
                          <img
                            src={m.image_url} alt="attachment"
                            onClick={() => setLightbox(m.image_url!)}
                            style={{ display: "block", maxWidth: "100%", maxHeight: 260, borderRadius: m.message ? "10px 10px 0 0" : 12, cursor: "zoom-in", objectFit: "cover" }}
                          />
                        ) : m.had_image ? (
                          <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, opacity: 0.6, padding: m.message ? "0 0 4px" : undefined }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                            Image expired
                          </span>
                        ) : null}
                        {m.message && (
                          <span style={{ display: "block", padding: (m.image_url || m.had_image) ? "8px 10px 4px" : undefined }}>{m.message}</span>
                        )}
                      </div>
                      <div style={{ fontSize: 10, color: "#b0b0b0", marginTop: 3, paddingLeft: 2, paddingRight: 2 }}>
                        {new Date(m.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  );
                })}
                <div ref={endRef} />
              </div>

              <div style={{ borderTop: "1.5px solid #f0ede8", background: "#fafaf8", flexShrink: 0 }}>
                {/* Image preview strip */}
                {imgPreview && (
                  <div className="pp-img-thumb" style={{ padding: "10px 14px 0", display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <div style={{ position: "relative", display: "inline-flex" }}>
                      <img src={imgPreview} alt="preview" style={{ height: 72, width: 72, objectFit: "cover", borderRadius: 10, border: "1.5px solid #e7e5e2" }} />
                      <button onClick={clearImage}
                        style={{ position: "absolute", top: -6, right: -6, width: 18, height: 18, borderRadius: "50%", background: "#0a0a0a", color: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, lineHeight: 1, fontWeight: 700 }}>
                        ×
                      </button>
                    </div>
                    <span style={{ fontSize: 11, color: "#9a9a9a", paddingTop: 4 }}>Image ready to send</span>
                  </div>
                )}
                <form onSubmit={send} style={{ padding: "10px 14px 16px", display: "flex", gap: 8, alignItems: "center" }}>
                  {/* Hidden file input */}
                  <input ref={fileRef} type="file" accept="image/*" hidden onChange={pickImage} />
                  {/* Attachment button */}
                  <button type="button" className="pp-img-btn" onClick={() => fileRef.current?.click()}
                    title="Attach image"
                    style={{ width: 38, height: 38, borderRadius: "50%", background: imgPreview ? "rgba(184,108,249,.15)" : "#f0ede8", color: imgPreview ? "#b86cf9" : "#9a9a9a", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background .15s, color .15s" }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.41 17.41a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                  </button>
                  <input
                    ref={inputRef}
                    className="pp-chat-input"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder={imgPreview ? "Add a caption… (optional)" : "Message the team…"}
                    style={{ flex: 1, padding: "11px 16px", borderRadius: 50, border: "1.5px solid #e7e5e2", fontSize: 13.5, fontFamily: "inherit", background: "#fff", color: "#0a0a0a", transition: "border-color .15s, box-shadow .15s" }}
                  />
                  <button type="submit" className="pp-send" disabled={(!input.trim() && !imgFile) || sending}
                    style={{ width: 44, height: 44, borderRadius: "50%", background: "#b86cf9", color: "#fff", border: "none", cursor: (!input.trim() && !imgFile) ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, opacity: (!input.trim() && !imgFile) ? 0.4 : 1, transition: "opacity .15s, background .15s" }}>
                    {sending
                      ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"/></svg>
                      : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 20-7z"/></svg>
                    }
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
