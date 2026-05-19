"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";

type ChatMsg = {
  id: number | string;
  chat_id?: number;
  sender_type: "visitor" | "admin";
  sender_name: string;
  message: string;
  read: boolean;
  created_at: string;
  optimistic?: boolean;
};

const BRAND = "#b86cf9";
const INK   = "#0a0a0a";

const WELCOME_MSG: ChatMsg = {
  id: "__welcome__",
  sender_type: "admin",
  sender_name: "Foxmen Studio",
  message: "Hi there! How can we help you today? Feel free to ask anything — no commitment, completely free.",
  read: true,
  created_at: new Date().toISOString(),
};

function fmt(ts: string) {
  const d = new Date(ts);
  const now = new Date();
  if (now.getTime() - d.getTime() < 60000) return "Just now";
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function inject() {
  if (document.getElementById("fox-live-chat-css")) return;
  const s = document.createElement("style");
  s.id = "fox-live-chat-css";
  s.textContent = `
    @keyframes flcOpen  { from{opacity:0;transform:scale(.92) translateY(18px)} to{opacity:1;transform:scale(1) translateY(0)} }
    @keyframes flcClose { from{opacity:1;transform:scale(1) translateY(0)} to{opacity:0;transform:scale(.92) translateY(18px)} }
    @keyframes flcMsg   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
    @keyframes flcPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.12)} }
    @keyframes flcDot   { 0%,80%,100%{transform:scale(0);opacity:.4} 40%{transform:scale(1);opacity:1} }
    .flc-panel { animation: flcOpen .26s cubic-bezier(.22,1,.36,1) both }
    .flc-panel.closing { animation: flcClose .2s cubic-bezier(.55,0,1,.45) both }
    .flc-msg   { animation: flcMsg .22s cubic-bezier(.22,1,.36,1) both }
    .flc-fab   { transition: transform .18s cubic-bezier(.22,1,.36,1), box-shadow .18s, right .3s cubic-bezier(.22,1,.36,1) }
    .flc-fab:hover { transform: scale(1.1) !important; box-shadow: 0 8px 32px rgba(184,108,249,.65) !important }
    body[data-panel-open] .flc-fab   { right: 528px !important }
    body[data-panel-open] .flc-panel { right: 528px !important }
    .flc-send:not(:disabled):hover { background: #a05ce8 !important }
    .flc-typing span { display:inline-block; width:7px; height:7px; border-radius:50%; background:#b86cf9; margin:0 2px;
      animation: flcDot 1.2s infinite ease-in-out; }
    .flc-typing span:nth-child(2) { animation-delay:.16s }
    .flc-typing span:nth-child(3) { animation-delay:.32s }
    .flc-input:focus { border-color: #b86cf9 !important; box-shadow: 0 0 0 3px rgba(184,108,249,.15) !important }
    .flc-name-input:focus { border-color: #b86cf9 !important }
    .flc-badge { animation: flcPulse 1.8s ease-in-out infinite }
  `;
  document.head.appendChild(s);
}

export default function SiteLiveChat() {
  const [mounted,  setMounted]  = useState(false);
  const [open,     setOpen]     = useState(false);
  const [closing,  setClosing]  = useState(false);
  const [msgs,     setMsgs]     = useState<ChatMsg[]>([WELCOME_MSG]);
  const [input,    setInput]    = useState("");
  const [sending,  setSending]  = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [visitorName, setVisitorName] = useState("Visitor");
  const [nameEdit, setNameEdit] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [unread,   setUnread]   = useState(0);
  const [typing,   setTyping]   = useState(false);

  const endRef     = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);
  const pusherRef  = useRef<{ channel: { unbind_all: () => void }; pusher: { unsubscribe: (c: string) => void } } | null>(null);

  useEffect(() => {
    setMounted(true);
    inject();
    const sid   = localStorage.getItem("fox_live_session_id");
    const sname = localStorage.getItem("fox_live_visitor_name");
    if (sid)   { setSessionId(sid); }
    if (sname) { setVisitorName(sname); setNameDraft(sname); }
  }, []);

  const scrollEnd = useCallback(() => {
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 60);
  }, []);

  useEffect(() => {
    if (!sessionId) return;
    fetch(`/api/live-chat/messages?session_id=${sessionId}`)
      .then(r => r.ok ? r.json() : [])
      .then((data: ChatMsg[]) => {
        if (data.length) setMsgs([WELCOME_MSG, ...data]);
      });
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) return;
    let channel: ReturnType<import("pusher-js").default["subscribe"]> | null = null;

    import("pusher-js").then(({ default: Pusher }) => {
      const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      });
      channel = pusher.subscribe(`chat-${sessionId}`);
      channel.bind("new-message", (msg: ChatMsg) => {
        if (msg.sender_type === "admin") {
          setMsgs(prev => prev.some(m => m.id === msg.id) ? prev : [...prev, msg]);
          if (!open) setUnread(u => u + 1);
          scrollEnd();
        }
      });
      pusherRef.current = { channel, pusher };
    });

    return () => {
      channel?.unbind_all();
    };
  }, [sessionId, open, scrollEnd]);

  function openPanel() {
    setClosing(false);
    setOpen(true);
    setUnread(0);
    setTimeout(() => { inputRef.current?.focus(); scrollEnd(); }, 80);
  }

  function closePanel() {
    setClosing(true);
    setTimeout(() => { setOpen(false); setClosing(false); }, 190);
  }

  async function getOrCreateSession() {
    if (sessionId) return sessionId;
    const res = await fetch("/api/live-chat/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitor_name: visitorName }),
    });
    const data = await res.json();
    const sid = data.session_id;
    setSessionId(sid);
    localStorage.setItem("fox_live_session_id", sid);
    localStorage.setItem("fox_live_visitor_name", visitorName);
    return sid;
  }

  async function send(e: { preventDefault(): void }) {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;
    setInput("");
    setSending(true);

    const optimisticId = `opt-${Date.now()}`;
    const optimistic: ChatMsg = {
      id: optimisticId, sender_type: "visitor",
      sender_name: visitorName, message: text,
      read: false, created_at: new Date().toISOString(), optimistic: true,
    };
    setMsgs(prev => [...prev, optimistic]);
    scrollEnd();

    const sid = await getOrCreateSession();

    setTyping(true);
    const res = await fetch("/api/live-chat/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sid, message: text, sender_name: visitorName }),
    });
    setTyping(false);

    if (res.ok) {
      const msg = await res.json();
      setMsgs(prev => prev.map(m => m.id === optimisticId ? { ...msg } : m));
    }
    setSending(false);
    scrollEnd();
  }

  async function saveName() {
    const n = nameDraft.trim() || "Visitor";
    setVisitorName(n);
    setNameEdit(false);
    localStorage.setItem("fox_live_visitor_name", n);
    if (sessionId) {
      await fetch("/api/live-chat/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, visitor_name: n }),
      });
    }
  }

  if (!mounted) return null;

  const ui = (
    <>
      {/* Floating button */}
      <button
        className="flc-fab"
        onClick={open ? closePanel : openPanel}
        aria-label="Chat with Foxmen"
        style={{
          position: "fixed", bottom: 28, right: 28, zIndex: 99997,
          width: 56, height: 56, borderRadius: "50%",
          background: INK, color: "#fff",
          border: "none", cursor: "pointer",
          boxShadow: "0 4px 20px rgba(0,0,0,.28), 0 0 0 1px rgba(255,255,255,.06)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "inherit",
        }}
      >
        {open
          ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M18 6L6 18M6 6l12 12" /></svg>
          : <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
        }
        {!open && unread > 0 && (
          <span className="flc-badge" style={{
            position: "absolute", top: -3, right: -3,
            width: 20, height: 20, borderRadius: "50%",
            background: "#ef4444", color: "#fff",
            fontSize: 11, fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "2px solid #fff",
          }}>
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          className={`flc-panel${closing ? " closing" : ""}`}
          style={{
            position: "fixed", bottom: 96, right: 28, zIndex: 99996,
            width: 368, borderRadius: 20,
            background: "#fff", overflow: "hidden",
            boxShadow: "0 24px 80px rgba(0,0,0,.18), 0 0 0 1px rgba(0,0,0,.07)",
            display: "flex", flexDirection: "column",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            maxHeight: "calc(100vh - 120px)",
          }}
        >
          {/* Header */}
          <div style={{
            background: INK, padding: "18px 20px 16px",
            display: "flex", alignItems: "center", gap: 12, flexShrink: 0,
          }}>
            <div style={{
              width: 42, height: 42, borderRadius: "50%",
              background: "linear-gradient(135deg, #b86cf9, #7c3aed)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, boxShadow: "0 2px 12px rgba(184,108,249,.4)",
            }}>
              <img src="/assets/logo-mark.svg" alt="" style={{ width: 22, height: 22, filter: "brightness(0) invert(1)" }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#fff", letterSpacing: "-.01em" }}>
                Foxmen <em style={{ fontStyle: "italic", color: BRAND }}>Studio</em>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 3 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "inline-block", boxShadow: "0 0 6px #22c55e" }} />
                <span style={{ fontSize: 11.5, color: "rgba(255,255,255,.45)" }}>Live Support</span>
              </div>
            </div>
            <button onClick={closePanel} style={{
              background: "rgba(255,255,255,.08)", border: "none", cursor: "pointer",
              width: 30, height: 30, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "rgba(255,255,255,.6)", transition: "background .15s",
            }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,.15)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,.08)")}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: "auto", padding: "16px 16px 8px",
            display: "flex", flexDirection: "column", gap: 10,
            scrollbarWidth: "none",
          }}>
            {msgs.map((m, i) => (
              <div
                key={m.id}
                className="flc-msg"
                style={{
                  display: "flex", flexDirection: "column",
                  alignItems: m.sender_type === "visitor" ? "flex-end" : "flex-start",
                  animationDelay: `${Math.min(i * 0.03, 0.15)}s`,
                }}
              >
                {m.sender_type === "admin" && i === 0 && (
                  <div style={{ fontSize: 11, color: "#9a9a9a", marginBottom: 4, paddingLeft: 2, fontWeight: 500 }}>
                    Foxmen Studio
                  </div>
                )}
                <div style={{
                  maxWidth: "82%", padding: "10px 14px",
                  borderRadius: m.sender_type === "visitor"
                    ? "16px 16px 4px 16px"
                    : "16px 16px 16px 4px",
                  fontSize: 13.5, lineHeight: 1.55, wordBreak: "break-word",
                  background: m.sender_type === "visitor"
                    ? BRAND
                    : "#f4f3f1",
                  color: m.sender_type === "visitor" ? "#fff" : INK,
                  opacity: m.optimistic ? 0.65 : 1,
                  transition: "opacity .3s",
                }}>
                  {m.message}
                </div>
                <div style={{ fontSize: 10.5, color: "#b0b0b0", marginTop: 4, paddingLeft: 2, paddingRight: 2 }}>
                  {fmt(m.created_at)}
                  {m.sender_type === "visitor" && m.optimistic && (
                    <span style={{ marginLeft: 4, color: "#ccc" }}>Sending…</span>
                  )}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flc-msg" style={{ display: "flex", alignItems: "flex-start" }}>
                <div style={{
                  padding: "12px 16px", borderRadius: "16px 16px 16px 4px",
                  background: "#f4f3f1", display: "inline-flex", alignItems: "center",
                }}>
                  <span className="flc-typing">
                    <span /><span /><span />
                  </span>
                </div>
              </div>
            )}

            <div ref={endRef} />
          </div>

          {/* Name row */}
          <div style={{ padding: "6px 16px 0", flexShrink: 0 }}>
            {nameEdit ? (
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <input
                  className="flc-name-input"
                  autoFocus
                  value={nameDraft}
                  onChange={e => setNameDraft(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") saveName(); if (e.key === "Escape") setNameEdit(false); }}
                  placeholder="Your name (optional)"
                  style={{
                    flex: 1, fontSize: 12, padding: "6px 10px",
                    border: "1.5px solid #e7e5e2", borderRadius: 8,
                    outline: "none", fontFamily: "inherit", color: INK,
                  }}
                />
                <button onClick={saveName} style={{
                  background: INK, color: "#fff", border: "none",
                  borderRadius: 7, padding: "6px 12px", fontSize: 12,
                  fontWeight: 500, cursor: "pointer",
                }}>Save</button>
                <button onClick={() => setNameEdit(false)} style={{
                  background: "none", color: "#9a9a9a", border: "none",
                  fontSize: 12, cursor: "pointer", padding: "6px 4px",
                }}>Cancel</button>
              </div>
            ) : (
              <button onClick={() => { setNameDraft(visitorName); setNameEdit(true); }} style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 11.5, color: "#9a9a9a", padding: "2px 0",
                display: "flex", alignItems: "center", gap: 4,
                fontFamily: "inherit",
              }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg>
                Chatting as <strong style={{ color: "#555" }}>{visitorName}</strong>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={BRAND} strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" /></svg>
              </button>
            )}
          </div>

          {/* Input */}
          <form onSubmit={send} style={{
            padding: "10px 14px 14px",
            display: "flex", gap: 8, flexShrink: 0,
          }}>
            <input
              ref={inputRef}
              className="flc-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Message us…"
              style={{
                flex: 1, padding: "11px 16px", borderRadius: 50,
                border: "1.5px solid #e7e5e2", fontSize: 13.5,
                fontFamily: "inherit", outline: "none",
                background: "#fafaf8", color: INK,
                transition: "border-color .15s, box-shadow .15s",
              }}
            />
            <button
              type="submit"
              className="flc-send"
              disabled={!input.trim() || sending}
              style={{
                width: 44, height: 44, borderRadius: "50%",
                background: BRAND, color: "#fff",
                border: "none", cursor: input.trim() ? "pointer" : "not-allowed",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, opacity: !input.trim() ? 0.45 : 1,
                transition: "opacity .15s, background .15s",
              }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M22 2L11 13" /><path d="M22 2L15 22l-4-9-9-4 20-7z" /></svg>
            </button>
          </form>

          {/* Footer */}
          <div style={{
            padding: "0 16px 12px", textAlign: "center",
            fontSize: 10.5, color: "#c0c0c0", flexShrink: 0,
          }}>
            Powered by <strong style={{ color: "#9a9a9a" }}>Foxmen Studio</strong> · Free, no commitment
          </div>
        </div>
      )}
    </>
  );

  return createPortal(ui, document.body);
}
