"use client";
import { useState, useRef, useEffect, useCallback } from "react";

type Msg = { role: "user" | "assistant"; content: string };
type Estimate = { plan: string; priceMin: number; priceMax: number; delivery: string };

const GREETING = "Hey 👋 I'm Fox — Foxmen Studio's AI assistant.\n\nWhat are you trying to build?";

function fmtPrice(n: number) {
  return n >= 1000 ? `$${Math.round(n / 1000)}k` : `$${n}`;
}

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center", padding: "4px 2px" }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#b86cf9", display: "inline-block", animation: `fox-dot 1.2s ${i * 0.2}s infinite` }} />
      ))}
    </div>
  );
}

export default function FoxChat() {
  const [open, setOpen]           = useState(false);
  const [msgs, setMsgs]           = useState<Msg[]>([{ role: "assistant", content: GREETING }]);
  const [input, setInput]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [stage, setStage]         = useState<"discovery" | "estimate">("discovery");
  const [estimate, setEstimate]   = useState<Estimate | null>(null);
  const [showEmail, setShowEmail] = useState(false);
  const [emailVal, setEmailVal]   = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [unread, setUnread]       = useState(0);
  const bottomRef                 = useRef<HTMLDivElement>(null);
  const inputRef                  = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, loading, showEmail]);

  useEffect(() => {
    if (open) { setUnread(0); setTimeout(() => inputRef.current?.focus(), 80); }
  }, [open]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;
    const updated: Msg[] = [...msgs, { role: "user", content: text }];
    setMsgs(updated);
    setInput("");
    setLoading(true);
    try {
      const res  = await fetch("/api/fox", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: updated }) });
      const data = await res.json();
      const reply = data.message ?? "I'm here — what are you building?";
      setMsgs(m => [...m, { role: "assistant", content: reply }]);
      if (data.stage === "estimate" && data.priceMin) {
        setStage("estimate");
        setEstimate({ plan: data.plan ?? "Custom", priceMin: data.priceMin, priceMax: data.priceMax, delivery: data.delivery ?? "TBD" });
      }
      if (!open) setUnread(u => u + 1);
    } catch {
      setMsgs(m => [...m, { role: "assistant", content: "Hit a snag — try again!" }]);
    }
    setLoading(false);
  }, [input, loading, msgs, open]);

  const submitEmail = useCallback(async () => {
    if (!emailVal.includes("@") || loading) return;
    setLoading(true);
    await fetch("/api/fox", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: msgs, email: emailVal, estimate }),
    });
    setEmailSent(true);
    setLoading(false);
    setShowEmail(false);
    setMsgs(m => [...m, { role: "assistant", content: `Done! 🚀 Estimate sent to ${emailVal}. Our team will follow up within 24 hours.` }]);
  }, [emailVal, loading, msgs, estimate]);

  return (
    <>
      {/* ── Chat window ───────────────────────────────────── */}
      {open && (
        <div className="fox-window" style={{ position: "fixed", bottom: 92, right: 24, width: 364, maxHeight: 568, background: "#fff", borderRadius: 22, boxShadow: "0 28px 80px rgba(0,0,0,.2), 0 0 0 1px rgba(0,0,0,.06)", display: "flex", flexDirection: "column", overflow: "hidden", zIndex: 9999, animation: "fox-in .32s cubic-bezier(.16,1,.3,1)" }}>

          {/* Header */}
          <div style={{ background: "linear-gradient(135deg,#0f0f0f 0%,#1a0a2e 100%)", padding: "16px 20px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg,#b86cf9,#8c3bd9)", display: "grid", placeItems: "center", fontSize: 22, flexShrink: 0, boxShadow: "0 4px 16px rgba(184,108,249,.4)" }}>🦊</div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, letterSpacing: "-.01em" }}>Fox</div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", flexShrink: 0 }} />
                <span style={{ color: "rgba(255,255,255,.45)", fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase" }}>Online · Foxmen Studio</span>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ marginLeft: "auto", background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 10, width: 30, height: 30, color: "rgba(255,255,255,.6)", cursor: "pointer", fontSize: 14, display: "grid", placeItems: "center", transition: "background .2s" }}>✕</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 10, background: "#fafaf8" }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", gap: 8, alignItems: "flex-end" }}>
                {m.role === "assistant" && (
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#b86cf9,#8c3bd9)", display: "grid", placeItems: "center", fontSize: 14, flexShrink: 0 }}>🦊</div>
                )}
                <div style={{ maxWidth: "78%", padding: "10px 14px", borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", background: m.role === "user" ? "#0a0a0a" : "#fff", color: m.role === "user" ? "#fff" : "#111", fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-wrap", boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}>
                  {m.content}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#b86cf9,#8c3bd9)", display: "grid", placeItems: "center", fontSize: 14, flexShrink: 0 }}>🦊</div>
                <div style={{ padding: "10px 14px", borderRadius: "18px 18px 18px 4px", background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}>
                  <TypingDots />
                </div>
              </div>
            )}

            {/* Estimate card */}
            {stage === "estimate" && estimate && !showEmail && !emailSent && (
              <div style={{ background: "linear-gradient(135deg,#0f0f0f,#1a0a2e)", borderRadius: 16, padding: "18px 18px 16px", marginTop: 4, boxShadow: "0 8px 32px rgba(0,0,0,.18)" }}>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,.45)", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 4 }}>Estimated Investment</div>
                <div style={{ fontSize: 30, fontWeight: 800, color: "#fff", letterSpacing: "-.02em", lineHeight: 1.1 }}>
                  {fmtPrice(estimate.priceMin)} <span style={{ color: "rgba(255,255,255,.4)", fontWeight: 400 }}>–</span> {fmtPrice(estimate.priceMax)}
                </div>
                <div style={{ fontSize: 12, color: "#b86cf9", marginTop: 6, marginBottom: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ background: "rgba(184,108,249,.15)", padding: "3px 10px", borderRadius: 999 }}>{estimate.plan}</span>
                  <span style={{ background: "rgba(255,255,255,.06)", padding: "3px 10px", borderRadius: 999, color: "rgba(255,255,255,.5)" }}>⏱ {estimate.delivery}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <button onClick={() => setShowEmail(true)} style={{ background: "#b86cf9", color: "#fff", border: "none", borderRadius: 999, padding: "11px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", width: "100%", transition: "background .2s" }}>
                    Send me the estimate 📧
                  </button>
                  <a href="/contact" style={{ display: "block", background: "rgba(255,255,255,.08)", color: "rgba(255,255,255,.8)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 999, padding: "10px 16px", fontSize: 13, fontWeight: 500, textAlign: "center", textDecoration: "none" }}>
                    Book a free call →
                  </a>
                </div>
              </div>
            )}

            {/* Email capture */}
            {showEmail && !emailSent && (
              <div style={{ background: "#fff", border: "1px solid #e5e3e0", borderRadius: 14, padding: "14px", boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}>
                <div style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>Where should we send it?</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="email"
                    value={emailVal}
                    onChange={e => setEmailVal(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && submitEmail()}
                    placeholder="your@email.com"
                    autoFocus
                    style={{ flex: 1, padding: "10px 14px", borderRadius: 999, border: "1px solid #e0dedd", fontSize: 13, outline: "none", background: "#fafaf8" }}
                  />
                  <button onClick={submitEmail} disabled={loading || !emailVal.includes("@")} style={{ background: "#0a0a0a", color: "#fff", border: "none", borderRadius: 999, padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: emailVal.includes("@") ? "pointer" : "default", opacity: emailVal.includes("@") ? 1 : .45, transition: "opacity .2s" }}>
                    Send
                  </button>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input bar */}
          {!emailSent && (
            <div style={{ padding: "12px 14px", borderTop: "1px solid #eeecea", display: "flex", gap: 8, flexShrink: 0, background: "#fff" }}>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder={loading ? "Fox is thinking…" : "Message Fox…"}
                disabled={loading}
                style={{ flex: 1, padding: "10px 16px", borderRadius: 999, border: "1px solid #e5e3e0", fontSize: 13, outline: "none", background: "#fafaf8", transition: "border-color .2s" }}
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                style={{ width: 40, height: 40, borderRadius: "50%", background: input.trim() && !loading ? "#0a0a0a" : "#e5e3e0", color: "#fff", border: "none", cursor: input.trim() && !loading ? "pointer" : "default", transition: "background .2s, transform .15s", display: "grid", placeItems: "center" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12h18M13 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Trigger button ────────────────────────────────── */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Chat with Fox"
        style={{ position: "fixed", bottom: 24, right: 24, width: 60, height: 60, borderRadius: "50%", background: open ? "#0a0a0a" : "linear-gradient(135deg,#b86cf9,#8c3bd9)", border: "none", cursor: "pointer", boxShadow: open ? "0 8px 24px rgba(0,0,0,.3)" : "0 8px 32px rgba(184,108,249,.5)", display: "grid", placeItems: "center", zIndex: 9999, transition: "background .3s, box-shadow .3s, transform .2s cubic-bezier(.16,1,.3,1)", transform: open ? "scale(.92)" : "scale(1)" }}
      >
        {open
          ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          : <span style={{ fontSize: 28, lineHeight: 1 }}>🦊</span>
        }
        {!open && unread > 0 && (
          <span style={{ position: "absolute", top: -2, right: -2, width: 20, height: 20, borderRadius: "50%", background: "#ef4444", color: "#fff", fontSize: 11, fontWeight: 700, display: "grid", placeItems: "center", border: "2px solid #fff", animation: "fox-ping .6s ease" }}>
            {unread}
          </span>
        )}
      </button>
    </>
  );
}
