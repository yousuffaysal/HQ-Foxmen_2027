"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { BorderBeam } from "@/components/ui/border-beam";
import { S } from "../style";
import ThinkingLoader from "../tools/ThinkingLoader";

// Floating AI assistant. Opens with a "genie" motion (the panel is pulled out of the button
// through a funnel) while an SVG turbulence/displacement filter ripples it like water.

type Msg = { role: "user" | "assistant"; content: string; booked?: string; sent?: boolean };

const GREETING: Msg = {
  role: "assistant",
  content: "Good day, sir. I am Isaac, the Foxmen Studio assistant. I can answer questions about our services, prices and work, or book a free consultation with our team. How may I help you?",
};
const QUICK = ["Book a consultation", "What do you build?", "How much does a website cost?", "Show me your work"];
const STORE = "fx-assistant-v2";
const EASE = "cubic-bezier(.2,.85,.25,1)";

// Genie keyframes: 4-point clip-paths so the browser can interpolate the funnel shape.
const GENIE: Keyframe[] = [
  { transform: "translate(0,0) scale(.06,.04)", clipPath: "polygon(46% 0,54% 0,100% 100%,0 100%)", opacity: 0, borderRadius: "999px" },
  { transform: "translate(0,0) scale(.38,.9)", clipPath: "polygon(30% 0,70% 0,96% 100%,4% 100%)", opacity: 1, borderRadius: "40px", offset: 0.38 },
  { transform: "translate(0,0) scale(1.03,.98)", clipPath: "polygon(0 0,100% 0,100% 100%,0 100%)", opacity: 1, borderRadius: "26px", offset: 0.72 },
  { transform: "none", clipPath: "polygon(0 0,100% 0,100% 100%,0 100%)", opacity: 1, borderRadius: "24px" },
];

// Closing plays the genie backwards; offsets must be mirrored to stay in increasing order.
const GENIE_CLOSE: Keyframe[] = [...GENIE].reverse().map(k => (k.offset == null ? { ...k } : { ...k, offset: 1 - (k.offset as number) }));

function load(): Msg[] {
  try { const v = JSON.parse(sessionStorage.getItem(STORE) || "null"); return Array.isArray(v) && v.length ? v : [GREETING]; } catch { return [GREETING]; }
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false); // mounted (stays true during the closing animation)
  const [msgs, setMsgs] = useState<Msg[]>([GREETING]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const disp = useRef<SVGFEDisplacementMapElement>(null);
  const turb = useRef<SVGFETurbulenceElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const loaded = useRef(false);

  useEffect(() => { setMsgs(load()); loaded.current = true; }, []); // eslint-disable-line react-hooks/set-state-in-effect -- restore after hydration
  useEffect(() => { if (loaded.current) try { sessionStorage.setItem(STORE, JSON.stringify(msgs.slice(-40))); } catch { /* storage blocked */ } }, [msgs]);
  useEffect(() => { list.current?.scrollTo({ top: list.current.scrollHeight, behavior: "smooth" }); }, [msgs, busy, shown]);

  const reduced = () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Water: the displacement starts strong and settles while the turbulence drifts.
  const ripple = useCallback((from: number, ms: number) => {
    const d = disp.current, t = turb.current, el = panel.current;
    if (!d || !t || !el) return;
    el.style.filter = "url(#fx-water)";
    const t0 = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / ms), e = 1 - Math.pow(1 - k, 3);
      d.setAttribute("scale", String(from * (1 - e)));
      t.setAttribute("baseFrequency", `${(0.012 + 0.01 * Math.sin(k * 6)).toFixed(4)} ${(0.03 + 0.02 * Math.cos(k * 5)).toFixed(4)}`);
      if (k < 1) requestAnimationFrame(step); else el.style.filter = "";
    };
    requestAnimationFrame(step);
  }, []);

  useLayoutEffect(() => {
    const el = panel.current;
    if (!shown || !open || !el) return;
    if (!reduced()) { el.animate(GENIE, { duration: 780, easing: EASE }); ripple(70, 1000); }
    setTimeout(() => input.current?.focus(), 350);
  }, [shown, open, ripple]);

  const toggle = () => {
    const el = panel.current;
    if (!open) { setShown(true); setOpen(true); return; }
    setOpen(false);
    if (!el || reduced()) { setShown(false); return; }
    ripple(40, 420);
    const a = el.animate(GENIE_CLOSE, { duration: 480, easing: "cubic-bezier(.55,0,.75,.2)", fill: "forwards" });
    a.onfinish = () => { setShown(false); a.cancel(); btn.current?.focus(); };
  };

  useEffect(() => {
    if (!open) return;
    const k = (e: globalThis.KeyboardEvent) => { if (e.key === "Escape") toggle(); };
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  });

  const send = async (raw?: string) => {
    const content = (raw ?? text).trim();
    if (!content || busy) return;
    const next: Msg[] = [...msgs, { role: "user", content }];
    setMsgs(next); setText(""); setBusy(true);
    try {
      const r = await fetch("/api/site/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.filter(m => m !== GREETING).map(({ role, content }) => ({ role, content })) }),
      });
      const d = await r.json().catch(() => ({}));
      setMsgs(m => [...m, r.ok
        ? { role: "assistant", content: String(d.reply || ""), booked: d.booked, sent: d.messageSent }
        : { role: "assistant", content: String(d.error || "I am sorry, sir, something went wrong. Please try again.") }]);
    } catch {
      setMsgs(m => [...m, { role: "assistant", content: "I am sorry, sir, I could not reach our server. Please check your connection and try again." }]);
    }
    setBusy(false);
  };

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } };
  const reset = () => { setMsgs([GREETING]); setText(""); };
  const onlyGreeting = msgs.length === 1;

  return (
    <>
      <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}>
        <filter id="fx-water" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence ref={turb} type="fractalNoise" baseFrequency="0.012 0.03" numOctaves="2" seed="7" result="n" />
          <feDisplacementMap ref={disp} in="SourceGraphic" in2="n" scale="0" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      {shown ? (
        <div
          ref={panel}
          role="dialog"
          aria-label="Isaac, Foxmen Studio assistant"
          style={S("position:fixed;right:clamp(12px,2vw,28px);bottom:calc(clamp(12px,2vw,28px) + 76px);z-index:80;width:min(400px,calc(100vw - 24px));height:min(620px,calc(100vh - 120px));transform-origin:calc(100% - 32px) calc(100% + 44px);will-change:transform,clip-path;border-radius:24px;")}
        >
          <BorderBeam size="md" colorVariant="ocean" theme="dark" style={{ height: "100%", borderRadius: 24 }}>
            <div style={S("height:100%;display:flex;flex-direction:column;background:#1F1712;color:#F3EEE4;border-radius:24px;overflow:hidden;box-shadow:0 30px 70px rgba(31,23,18,.35), inset 0 0 0 1px rgba(243,238,228,.06);font-family:Inter,sans-serif;")}>
              <div style={S("display:flex;align-items:center;gap:12px;padding:14px 14px 14px 16px;border-bottom:1px solid rgba(243,238,228,.1);")}>
                <span style={S("width:40px;height:40px;border-radius:999px;background:#120C09;box-shadow:inset 0 0 0 1px rgba(184,108,249,.35);display:flex;align-items:center;justify-content:center;flex:none;")}><img src="/assets/logo.png" alt="" style={S("width:22px;height:22px;")} /></span>
                <div style={S("min-width:0;flex:1;")}>
                  <div style={S("font-weight:700;font-size:15px;letter-spacing:-0.01em;")}>Isaac <span style={S("font-weight:500;color:rgba(243,238,228,.55);")}>· Foxmen Studio</span></div>
                  <div style={S("font-size:12px;color:rgba(243,238,228,.6);display:flex;align-items:center;gap:6px;")}><span style={S("width:7px;height:7px;border-radius:999px;background:#3BA55C;")}></span>Online · books consultations</div>
                </div>
                {!onlyGreeting ? <button onClick={reset} style={S("border:none;background:transparent;color:rgba(243,238,228,.6);font-size:12px;font-weight:600;cursor:pointer;padding:8px;")}>New chat</button> : null}
                <button onClick={toggle} aria-label="Close assistant" style={S("width:40px;height:40px;border-radius:999px;border:none;background:#B86CF9;color:#1F1712;font-size:20px;line-height:1;cursor:pointer;flex:none;")}>×</button>
              </div>

              <div ref={list} data-lenis-prevent="1" style={S("flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;overscroll-behavior:contain;")}>
                {msgs.map((m, i) => (
                  <div key={i} style={S(`display:flex;flex-direction:column;align-items:${m.role === "user" ? "flex-end" : "flex-start"};gap:8px;`)}>
                    <div style={S(`max-width:86%;padding:11px 14px;border-radius:16px;font-size:14px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere;${m.role === "user" ? "background:#B86CF9;color:#1F1712;border-bottom-right-radius:6px;" : "background:rgba(243,238,228,.08);color:#F3EEE4;border-bottom-left-radius:6px;"}`)}>{m.content}</div>
                    {m.booked ? (
                      <div style={S("display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:14px;background:#F3EEE4;color:#1F1712;font-size:13px;font-weight:600;")}>
                        <span style={S("width:24px;height:24px;border-radius:999px;background:#B86CF9;display:flex;align-items:center;justify-content:center;")}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1F1712" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7" /></svg></span>
                        Consultation requested · <span style={S("font-family:'JetBrains Mono',monospace;")}>{m.booked}</span>
                      </div>
                    ) : null}
                    {m.sent ? <div style={S("font-size:12px;color:rgba(243,238,228,.6);")}>Message delivered to the Foxmen team</div> : null}
                  </div>
                ))}
                {busy ? <div style={S("max-width:86%;")}><ThinkingLoader tool="chat" dark compact /></div> : null}
                {onlyGreeting ? (
                  <div style={S("display:flex;flex-wrap:wrap;gap:8px;margin-top:4px;")}>
                    {QUICK.map(q => <button key={q} onClick={() => send(q)} style={S("border:none;cursor:pointer;padding:9px 14px;border-radius:999px;font-size:13px;font-weight:600;background:transparent;color:#F3EEE4;box-shadow:inset 0 0 0 1px rgba(243,238,228,.22);")} className="hv13">{q}</button>)}
                  </div>
                ) : null}
              </div>

              <div style={S("padding:10px;")}>
                <div style={S("border-radius:20px;background:#2A211B;box-shadow:inset 0 0 0 1px rgba(243,238,228,.08), inset 0 0 50px 0 rgba(255,255,255,.02);padding:8px;display:flex;flex-direction:column;gap:6px;")}>
                  <textarea
                    ref={input}
                    value={text}
                    onChange={e => setText(e.target.value.slice(0, 2000))}
                    onKeyDown={onKey}
                    rows={2}
                    placeholder="Ask anything or book a call..."
                    aria-label="Message the assistant"
                    style={S("width:100%;border:none;background:transparent;resize:none;outline:none;color:#F3EEE4;font-size:14px;line-height:1.5;padding:6px 6px 0;font-family:Inter,sans-serif;")}
                  />
                  <div style={S("display:flex;align-items:center;gap:8px;")}>
                    <span style={S("display:inline-flex;align-items:center;height:26px;padding:0 10px;border-radius:36px;font-size:12px;color:#CACCD2;background:rgba(255,255,255,.04);box-shadow:inset 0 0 0 1px rgba(255,255,255,.03);")}>Agent</span>
                    <button onClick={() => send("I would like to book a consultation.")} disabled={busy} style={S("display:inline-flex;align-items:center;height:26px;padding:0 10px;border:none;cursor:pointer;border-radius:36px;font-size:12px;color:#CACCD2;background:rgba(255,255,255,.04);box-shadow:inset 0 0 0 1px rgba(255,255,255,.03);")}>Book a call</button>
                    <button onClick={() => send()} disabled={busy || !text.trim()} aria-label="Send" style={S(`margin-left:auto;width:34px;height:34px;border-radius:999px;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;background:${text.trim() && !busy ? "#B86CF9" : "rgba(255,255,255,.06)"};color:${text.trim() && !busy ? "#1F1712" : "#8B8B8B"};transition:background .2s;`)}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 12.6667V3.33333M12.6667 8L8 3.33333L3.33333 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                  </div>
                </div>
                <div style={S("font-size:11px;color:rgba(243,238,228,.45);text-align:center;padding-top:8px;")}>AI assistant. Details you share are sent to Foxmen Studio.</div>
              </div>
            </div>
          </BorderBeam>
        </div>
      ) : null}

      <button
        ref={btn}
        onClick={toggle}
        aria-label={open ? "Close assistant" : "Chat with Isaac, the Foxmen assistant"}
        aria-expanded={open}
        className="fx-fab"
        style={S("position:fixed;right:clamp(12px,2vw,28px);bottom:clamp(12px,2vw,28px);z-index:81;width:64px;height:64px;border-radius:999px;border:none;cursor:pointer;background:#1F1712;display:flex;align-items:center;justify-content:center;box-shadow:0 14px 34px rgba(31,23,18,.3);")}
      >
        <span className="fx-fab-ring" aria-hidden="true" />
        <span className="fx-fab-ring fx-fab-ring2" aria-hidden="true" />
        <span style={S(`width:48px;height:48px;border-radius:999px;background:#120C09;box-shadow:inset 0 0 0 1.5px rgba(184,108,249,.45);display:flex;align-items:center;justify-content:center;transition:transform .45s cubic-bezier(.2,.7,.2,1);transform:${open ? "rotate(135deg)" : "none"};`)}>
          {open
            ? <span style={S("font-size:28px;font-weight:400;line-height:1;color:#B86CF9;")}>+</span>
            : <img src="/assets/logo.png" alt="" style={S("width:28px;height:28px;")} />}
        </span>
      </button>
    </>
  );
}
