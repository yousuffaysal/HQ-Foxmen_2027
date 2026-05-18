"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { getPusherClient } from "@/lib/pusher";

type Session = {
  id: number; session_id: string; visitor_name: string; visitor_email: string | null;
  status: string; last_message_at: string; unread: number; last_message: string | null;
};
type Msg = {
  id: number; chat_id: number; sender_type: "visitor" | "admin";
  sender_name: string; message: string; read: boolean; created_at: string;
};

const BRAND = "#b86cf9";
const INK   = "#0a0a0a";

function fmt(ts: string) {
  const d = new Date(ts), now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 60000) return "now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
  if (diff < 86400000) return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function initials(name: string) {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

function inject() {
  if (document.getElementById("adm-live-chat-css")) return;
  const s = document.createElement("style");
  s.id = "adm-live-chat-css";
  s.textContent = `
    @keyframes alcOpen  { from{opacity:0;transform:translateY(16px) scale(.96)} to{opacity:1;transform:none} }
    @keyframes alcMsg   { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
    @keyframes alcBadge { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }
    .alc-panel { animation: alcOpen .22s cubic-bezier(.22,1,.36,1) both }
    .alc-msg   { animation: alcMsg .18s cubic-bezier(.22,1,.36,1) both }
    .alc-fab:hover { transform: scale(1.08) !important }
    .alc-badge { animation: alcBadge 1.6s ease-in-out infinite }
    .alc-send:not(:disabled):hover { background: #a05ce8 !important }
    .alc-input:focus { border-color: #b86cf9 !important; outline: none }
    .alc-row:hover { background: #faf5ff !important }
  `;
  document.head.appendChild(s);
}

export default function AdminLiveChat() {
  const [mounted,   setMounted]   = useState(false);
  const [open,      setOpen]      = useState(false);
  const [sessions,  setSessions]  = useState<Session[]>([]);
  const [session,   setSession]   = useState<Session | null>(null);
  const [msgs,      setMsgs]      = useState<Msg[]>([]);
  const [input,     setInput]     = useState("");
  const [sending,   setSending]   = useState(false);
  const [totalUnread, setTotal]   = useState(0);
  const endRef    = useRef<HTMLDivElement>(null);
  const pollRef   = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  useEffect(() => { setMounted(true); inject(); }, []);

  const loadSessions = useCallback(async () => {
    const r = await fetch("/api/live-chat/sessions").catch(() => null);
    if (!r?.ok) return;
    const data: Session[] = await r.json();
    setSessions(data);
    setTotal(data.reduce((s, x) => s + Number(x.unread), 0));
  }, []);

  useEffect(() => {
    if (!open) return;
    loadSessions();
    pollRef.current = setInterval(loadSessions, 8000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [open, loadSessions]);

  useEffect(() => {
    const pusher = getPusherClient();
    if (!pusher) return;
    const ch = pusher.subscribe("private-admin");
    ch.bind("live-chat-message", (data: { session_id: string; visitor_name: string; message: string; created_at: string }) => {
      setTotal(u => u + 1);
      setSessions(prev => {
        const idx = prev.findIndex(s => s.session_id === data.session_id);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = { ...updated[idx], unread: updated[idx].unread + 1, last_message: data.message, last_message_at: data.created_at };
          return [updated[idx], ...updated.filter((_, i) => i !== idx)];
        }
        return prev;
      });
      if (session?.session_id === data.session_id) {
        loadSessions();
      }
    });
    return () => { ch.unbind("live-chat-message"); };
  }, [session, loadSessions]);

  useEffect(() => {
    if (!session) return;
    const pusher = getPusherClient();
    if (!pusher) return;
    const ch = pusher.subscribe(`chat-${session.session_id}`);
    ch.bind("new-message", (msg: Msg) => {
      if (msg.sender_type === "visitor") {
        setMsgs(prev => prev.some(m => m.id === msg.id) ? prev : [...prev, msg]);
        setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
        setSessions(prev => prev.map(s =>
          s.session_id === session.session_id
            ? { ...s, unread: 0, last_message: msg.message, last_message_at: msg.created_at }
            : s
        ));
      }
    });
    return () => { pusher.unsubscribe(`chat-${session.session_id}`); };
  }, [session]);

  async function openSession(s: Session) {
    setSession(s);
    const r = await fetch(`/api/live-chat/messages?session_id=${s.session_id}`).then(r => r.json());
    setMsgs(Array.isArray(r) ? r : []);
    setSessions(prev => prev.map(x => x.id === s.id ? { ...x, unread: 0 } : x));
    setTotal(prev => Math.max(0, prev - Number(s.unread)));
    await fetch("/api/live-chat/sessions", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: s.id }),
    });
    setTimeout(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); inputRef.current?.focus(); }, 100);
  }

  async function send(e: { preventDefault(): void }) {
    e.preventDefault();
    if (!input.trim() || sending || !session) return;
    setSending(true);
    const text = input.trim();
    setInput("");
    const res = await fetch("/api/live-chat/messages", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: session.session_id, message: text }),
    });
    if (res.ok) {
      const msg = await res.json();
      setMsgs(prev => prev.some(m => m.id === msg.id) ? prev : [...prev, msg]);
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    }
    setSending(false);
  }

  if (!mounted) return null;

  const ui = (
    <>
      {/* FAB */}
      <button
        className="alc-fab"
        onClick={() => setOpen(o => !o)}
        title="Live Chat"
        style={{
          position: "fixed", bottom: 28, right: 28, zIndex: 99997,
          width: 54, height: 54, borderRadius: "50%",
          background: BRAND, color: "#fff",
          border: "none", cursor: "pointer",
          boxShadow: "0 4px 20px rgba(184,108,249,.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "transform .18s cubic-bezier(.22,1,.36,1), box-shadow .18s",
          fontFamily: "inherit",
        }}
      >
        {open
          ? <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
          : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
        }
        {!open && totalUnread > 0 && (
          <span className="alc-badge" style={{
            position: "absolute", top: -3, right: -3,
            width: 20, height: 20, borderRadius: "50%",
            background: "#e11d48", color: "#fff",
            fontSize: 11, fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "2.5px solid #fff",
          }}>
            {totalUnread > 9 ? "9+" : totalUnread}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="alc-panel" style={{
          position: "fixed", right: 0, top: 0, bottom: 0, width: 380,
          zIndex: 99996, background: "#fff",
          borderLeft: "1.5px solid #e7e5e2",
          display: "flex", flexDirection: "column",
          boxShadow: "-12px 0 60px rgba(0,0,0,.12)",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}>

          {/* Header */}
          <div style={{
            padding: "14px 18px", borderBottom: "1.5px solid #e7e5e2",
            display: "flex", alignItems: "center", gap: 10,
            background: INK, flexShrink: 0,
          }}>
            {session && (
              <button onClick={() => { setSession(null); setMsgs([]); }}
                style={{ background: "rgba(255,255,255,.1)", border: "none", cursor: "pointer", padding: "5px 7px", color: "rgba(255,255,255,.7)", display: "flex", alignItems: "center", borderRadius: 6, flexShrink: 0 }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,.18)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,.1)")}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
              </button>
            )}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={BRAND} strokeWidth="1.8" style={{ flexShrink: 0 }}>
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {session ? session.visitor_name : "Live Chat"}
              </div>
              {session
                ? <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)" }}>{session.visitor_email || "No email provided"}</div>
                : <div style={{ fontSize: 11, color: "rgba(255,255,255,.3)" }}>{sessions.length} conversation{sessions.length !== 1 ? "s" : ""}</div>
              }
            </div>
          </div>

          {!session ? (
            /* Session list */
            <div style={{ flex: 1, overflowY: "auto" }}>
              {sessions.length === 0 ? (
                <div style={{ padding: "56px 24px", textAlign: "center" }}>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(184,108,249,.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={BRAND} strokeWidth="1.7"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: INK, marginBottom: 6 }}>No chats yet</div>
                  <div style={{ fontSize: 13, color: "#6b6b6b", lineHeight: 1.6 }}>Conversations from site visitors<br />will appear here in real-time.</div>
                </div>
              ) : sessions.map(s => (
                <button key={s.id} className="alc-row" onClick={() => openSession(s)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 12,
                    padding: "13px 18px", background: "none", border: "none",
                    borderBottom: "1px solid #f0ede8", cursor: "pointer", textAlign: "left",
                    transition: "background .1s",
                  }}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                    background: `linear-gradient(135deg, ${BRAND}, #7c3aed)`,
                    color: "#fff", display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: 13, fontWeight: 700,
                    position: "relative",
                  }}>
                    {initials(s.visitor_name)}
                    {s.unread > 0 && (
                      <span style={{
                        position: "absolute", top: -2, right: -2,
                        width: 16, height: 16, borderRadius: "50%",
                        background: "#e11d48", color: "#fff",
                        fontSize: 9, fontWeight: 700,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        border: "2px solid #fff",
                      }}>{s.unread > 9 ? "9+" : s.unread}</span>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
                      <span style={{ fontSize: 13, fontWeight: s.unread > 0 ? 700 : 500, color: INK, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {s.visitor_name}
                      </span>
                      <span style={{ fontSize: 11, color: "#9a9a9a", flexShrink: 0, marginLeft: 8 }}>
                        {fmt(s.last_message_at)}
                      </span>
                    </div>
                    <div style={{
                      fontSize: 12, color: s.unread > 0 ? "#555" : "#9a9a9a",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      fontWeight: s.unread > 0 ? 500 : 400,
                    }}>
                      {s.last_message || "No messages yet"}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            /* Chat thread */
            <>
              <div style={{ flex: 1, overflowY: "auto", padding: "14px 14px 8px", display: "flex", flexDirection: "column", gap: 8, scrollbarWidth: "thin" }}>
                {msgs.length === 0 && (
                  <div style={{ textAlign: "center", color: "#9a9a9a", fontSize: 13, marginTop: 48, lineHeight: 1.8 }}>
                    No messages yet.
                  </div>
                )}
                {msgs.map(m => (
                  <div key={m.id} className="alc-msg" style={{ display: "flex", flexDirection: "column", alignItems: m.sender_type === "admin" ? "flex-end" : "flex-start" }}>
                    <div style={{ fontSize: 10, color: "#9a9a9a", marginBottom: 3, paddingLeft: 2, paddingRight: 2 }}>
                      {m.sender_type === "admin" ? "You (Admin)" : m.sender_name}
                    </div>
                    <div style={{
                      maxWidth: "80%", padding: "9px 13px",
                      borderRadius: m.sender_type === "admin" ? "14px 14px 3px 14px" : "14px 14px 14px 3px",
                      fontSize: 13, lineHeight: 1.55, wordBreak: "break-word",
                      background: m.sender_type === "admin" ? BRAND : "#f4f3f1",
                      color: m.sender_type === "admin" ? "#fff" : INK,
                    }}>{m.message}</div>
                    <div style={{ fontSize: 10, color: "#b0b0b0", marginTop: 3, paddingLeft: 2, paddingRight: 2 }}>
                      {new Date(m.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                ))}
                <div ref={endRef} />
              </div>

              <form onSubmit={send} style={{ padding: "10px 12px 14px", borderTop: "1.5px solid #e7e5e2", display: "flex", gap: 8, background: "#fafaf8", flexShrink: 0 }}>
                <input
                  ref={inputRef}
                  className="alc-input"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder={`Reply to ${session.visitor_name}…`}
                  style={{
                    flex: 1, padding: "10px 16px", borderRadius: 50,
                    border: "1.5px solid #e7e5e2", fontSize: 13,
                    fontFamily: "inherit", background: "#fff", color: INK,
                    transition: "border-color .15s",
                  }}
                />
                <button type="submit" className="alc-send" disabled={!input.trim() || sending}
                  style={{
                    width: 42, height: 42, borderRadius: "50%",
                    background: BRAND, color: "#fff", border: "none",
                    cursor: input.trim() ? "pointer" : "not-allowed",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, opacity: !input.trim() ? 0.45 : 1,
                    transition: "opacity .15s, background .15s",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M22 2L11 13" /><path d="M22 2L15 22l-4-9-9-4 20-7z" /></svg>
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );

  return createPortal(ui, document.body);
}
