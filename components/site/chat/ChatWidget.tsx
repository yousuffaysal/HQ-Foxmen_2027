"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { BorderBeam } from "@/components/ui/border-beam";
import { S } from "../style";

// Floating AI assistant "Isaac". Opens with a "genie" motion (pulled out of the button through a
// funnel) while an SVG turbulence filter ripples it like water. Full-screen on phones.
// Replies appear word by word after a typing indicator; the mic records voice for transcription.

type Msg = { role: "user" | "assistant"; content: string; booked?: string; sent?: boolean; fresh?: boolean };

const GREETING: Msg = {
  role: "assistant",
  content: "Good day, sir. I am Isaac, the Foxmen Studio assistant. I can answer questions about our services, prices and work, or book a free consultation with our team. How may I help you?",
};
const QUICK = ["Book a consultation", "What do you build?", "How much does a website cost?", "Show me your work"];
const STORE = "fx-assistant-v2";
const EASE = "cubic-bezier(.2,.85,.25,1)";
const AVATAR = "/assets/isaac.svg"; // "Notionists" by Zoish, CC0 1.0 (via DiceBear)
const MAX_REC_MS = 60_000;

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
  try { const v = JSON.parse(sessionStorage.getItem(STORE) || "null"); return Array.isArray(v) && v.length ? v.map((m: Msg) => ({ ...m, fresh: false })) : [GREETING]; } catch { return [GREETING]; }
}

const isPhone = () => typeof matchMedia !== "undefined" && matchMedia("(max-width: 600px)").matches;
const reduced = () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

function Avatar({ size, online }: { size: number; online?: boolean }) {
  return (
    <span style={S(`position:relative;width:${size}px;height:${size}px;flex:none;`)}>
      <img src={AVATAR} alt="Isaac" width={size} height={size} style={S(`width:${size}px;height:${size}px;border-radius:999px;display:block;box-shadow:0 0 0 2px #1F1712;`)} />
      {online ? <span style={S("position:absolute;right:-1px;bottom:-1px;width:11px;height:11px;border-radius:999px;background:#3BA55C;box-shadow:0 0 0 2px #1F1712;")}></span> : null}
    </span>
  );
}

// Reveals an assistant message word by word, like someone typing it.
function TypedText({ text, onDone, onTick }: { text: string; onDone: () => void; onTick: () => void }) {
  const words = text.split(/(\s+)/);
  const [n, setN] = useState(() => (reduced() ? words.length : 0)); // reduced motion: show it all at once
  useEffect(() => {
    if (reduced()) { onDone(); return; }
    const per = Math.max(14, Math.min(55, 2600 / Math.max(1, words.length))); // longer replies type faster
    let i = 0;
    const t = setInterval(() => {
      i += 2; // a word and the space after it
      setN(i); onTick();
      if (i >= words.length) { clearInterval(t); onDone(); }
    }, per);
    return () => clearInterval(t);
  }, [text]); // eslint-disable-line react-hooks/exhaustive-deps -- run once per message
  return <>{words.slice(0, n).join("")}{n < words.length ? <span className="fx-caret" aria-hidden="true" /> : null}</>;
}

// Voice typing: MediaRecorder -> /api/site/transcribe (Whisper). Level bars come from an AnalyserNode.
function useVoice(onText: (t: string) => void) {
  const [state, setState] = useState<"idle" | "recording" | "working">("idle");
  const [levels, setLevels] = useState<number[]>([0, 0, 0, 0, 0]);
  const [secs, setSecs] = useState(0);
  const [err, setErr] = useState("");
  const rec = useRef<MediaRecorder | null>(null);
  const stopAll = useRef<() => void>(() => {});
  const supported = typeof window !== "undefined" && !!navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== "undefined";

  const start = async () => {
    setErr("");
    let stream: MediaStream;
    try { stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } }); }
    catch { setErr("Microphone access was blocked. Allow it in your browser to use voice."); return; }
    const mime = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg"].find(m => MediaRecorder.isTypeSupported(m)) || "";
    const r = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
    const chunks: BlobPart[] = [];
    r.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
    const ctx = new AudioContext(), an = ctx.createAnalyser();
    ctx.createMediaStreamSource(stream).connect(an); an.fftSize = 64;
    const buf = new Uint8Array(an.frequencyBinCount);
    const t0 = Date.now();
    let raf = 0;
    const tick = () => {
      an.getByteFrequencyData(buf);
      setLevels([2, 5, 8, 11, 14].map(i => Math.min(1, buf[i] / 200)));
      setSecs(Math.floor((Date.now() - t0) / 1000));
      if (Date.now() - t0 > MAX_REC_MS) r.stop(); else raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    stopAll.current = () => { cancelAnimationFrame(raf); stream.getTracks().forEach(t => t.stop()); ctx.close().catch(() => {}); };
    r.onstop = async () => {
      stopAll.current();
      const blob = new Blob(chunks, { type: (r.mimeType || mime || "audio/webm").split(";")[0] });
      if (blob.size < 1200) { setState("idle"); return; } // tap without speaking
      setState("working");
      try {
        const fd = new FormData(); fd.append("audio", blob, "voice");
        const res = await fetch("/api/site/transcribe", { method: "POST", body: fd });
        const d = await res.json().catch(() => ({}));
        if (res.ok && d.text) onText(d.text); else setErr(d.error || "Sorry, I could not hear that clearly.");
      } catch { setErr("Could not reach the server. Please try again."); }
      setState("idle");
    };
    rec.current = r; r.start(); setSecs(0); setState("recording");
  };
  const stop = () => { if (rec.current?.state === "recording") rec.current.stop(); };
  useEffect(() => () => { stopAll.current(); }, []);
  return { state, levels, secs, err, setErr, supported, start, stop };
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false); // mounted (stays true during the closing animation)
  const [msgs, setMsgs] = useState<Msg[]>([GREETING]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [typing, setTyping] = useState(false); // a reply is being "typed" out
  const [phone, setPhone] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const disp = useRef<SVGFEDisplacementMapElement>(null);
  const turb = useRef<SVGFETurbulenceElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const loaded = useRef(false);

  const voice = useVoice(t => { setText(v => (v.trim() ? v.trim() + " " : "") + t); setTimeout(() => input.current?.focus(), 50); });

  useEffect(() => { setMsgs(load()); loaded.current = true; }, []); // eslint-disable-line react-hooks/set-state-in-effect -- restore after hydration
  useEffect(() => { if (loaded.current) try { sessionStorage.setItem(STORE, JSON.stringify(msgs.slice(-40))); } catch { /* storage blocked */ } }, [msgs]);
  const toBottom = useCallback((smooth = true) => { const l = list.current; if (l) l.scrollTo({ top: l.scrollHeight, behavior: smooth ? "smooth" : "auto" }); }, []);
  useEffect(() => { toBottom(); }, [msgs, busy, shown, toBottom]);

  // Phones: full-screen sheet that follows the visible viewport (on-screen keyboard) and locks page scroll.
  useEffect(() => {
    if (!shown) return;
    const ph = isPhone(); setPhone(ph); // eslint-disable-line react-hooks/set-state-in-effect -- sync to viewport when opening
    if (!ph) return;
    const root = document.documentElement, prev = root.style.overflow;
    root.style.overflow = "hidden";
    const vv = window.visualViewport;
    const fit = () => { const el = panel.current; if (el && vv) { el.style.setProperty("--fx-vvh", `${vv.height}px`); el.style.setProperty("--fx-vvt", `${vv.offsetTop}px`); toBottom(false); } };
    fit(); vv?.addEventListener("resize", fit); vv?.addEventListener("scroll", fit);
    return () => { root.style.overflow = prev; vv?.removeEventListener("resize", fit); vv?.removeEventListener("scroll", fit); };
  }, [shown, toBottom]);

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
    if (!isPhone()) setTimeout(() => input.current?.focus(), 350); // don't pop the keyboard on phones
  }, [shown, open, ripple]);

  const toggle = () => {
    const el = panel.current;
    if (!open) { setShown(true); setOpen(true); return; }
    setOpen(false); voice.stop();
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
    if (!content || busy || typing) return;
    const next: Msg[] = [...msgs, { role: "user", content }];
    setMsgs(next); setText(""); setBusy(true); voice.setErr("");
    let reply: Msg;
    try {
      const r = await fetch("/api/site/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.filter(m => m !== GREETING && m.content !== GREETING.content).map(({ role, content }) => ({ role, content })) }),
      });
      const d = await r.json().catch(() => ({}));
      reply = r.ok
        ? { role: "assistant", content: String(d.reply || ""), booked: d.booked, sent: d.messageSent, fresh: true }
        : { role: "assistant", content: String(d.error || "I am sorry, sir, something went wrong. Please try again."), fresh: true };
    } catch {
      reply = { role: "assistant", content: "I am sorry, sir, I could not reach our server. Please check your connection and try again.", fresh: true };
    }
    setBusy(false); setTyping(true);
    setMsgs(m => [...m, reply]);
  };

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => { if (e.key === "Enter" && !e.shiftKey && !isPhone()) { e.preventDefault(); send(); } };
  const reset = () => { setMsgs([GREETING]); setText(""); setTyping(false); };
  const onlyGreeting = msgs.length === 1;
  const finishTyping = (i: number) => { setTyping(false); setMsgs(m => m.map((x, k) => (k === i ? { ...x, fresh: false } : x))); };
  const rec = voice.state === "recording", working = voice.state === "working";
  const canSend = !!text.trim() && !busy && !typing;
  const chip = "display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 12px;border:none;border-radius:36px;font-size:12px;color:#CACCD2;background:rgba(255,255,255,.04);box-shadow:inset 0 0 0 1px rgba(255,255,255,.03);white-space:nowrap;";

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
          aria-modal={phone || undefined}
          aria-label="Isaac, Foxmen Studio assistant"
          className="fx-chat-panel"
          style={S("position:fixed;right:clamp(12px,2vw,28px);bottom:calc(clamp(12px,2vw,28px) + 76px);z-index:80;width:min(400px,calc(100vw - 24px));height:min(640px,calc(100vh - 120px));transform-origin:calc(100% - 32px) calc(100% + 44px);will-change:transform,clip-path;border-radius:24px;")}
        >
          <BorderBeam size="md" colorVariant="ocean" theme="dark" active={!phone} style={{ height: "100%", borderRadius: phone ? 0 : 24 }}>
            <div className="fx-chat-inner" style={S("height:100%;display:flex;flex-direction:column;background:#1F1712;color:#F3EEE4;border-radius:24px;overflow:hidden;box-shadow:0 30px 70px rgba(31,23,18,.35), inset 0 0 0 1px rgba(243,238,228,.06);font-family:Inter,sans-serif;")}>
              <div className="fx-chat-head" style={S("display:flex;align-items:center;gap:12px;padding:12px 12px 12px 14px;border-bottom:1px solid rgba(243,238,228,.1);")}>
                <Avatar size={42} online />
                <div style={S("min-width:0;flex:1;")}>
                  <div style={S("font-weight:700;font-size:15px;letter-spacing:-0.01em;")}>Isaac <span style={S("font-weight:500;color:rgba(243,238,228,.55);")}>· Foxmen Studio</span></div>
                  <div style={S("font-size:12px;color:rgba(243,238,228,.6);")}>{busy || typing ? <span style={S("color:#B86CF9;")}>typing<span className="fx-ellipsis" /></span> : "Online · books consultations"}</div>
                </div>
                {!onlyGreeting ? <button onClick={reset} style={S("border:none;background:transparent;color:rgba(243,238,228,.6);font-size:12px;font-weight:600;cursor:pointer;padding:8px;")}>New chat</button> : null}
                <button onClick={toggle} aria-label="Close assistant" style={S("width:40px;height:40px;border-radius:999px;border:none;background:#B86CF9;color:#1F1712;font-size:20px;line-height:1;cursor:pointer;flex:none;")}>×</button>
              </div>

              <div ref={list} data-lenis-prevent="1" style={S("flex:1;overflow-y:auto;padding:16px 14px;display:flex;flex-direction:column;gap:12px;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;")}>
                {msgs.map((m, i) => {
                  const mine = m.role === "user";
                  const showCard = !m.fresh;
                  return (
                    <div key={i} className="fx-msg" style={S(`display:flex;gap:8px;align-items:flex-end;${mine ? "justify-content:flex-end;" : ""}`)}>
                      {!mine ? <Avatar size={28} /> : null}
                      <div style={S(`display:flex;flex-direction:column;align-items:${mine ? "flex-end" : "flex-start"};gap:8px;max-width:82%;min-width:0;`)}>
                        <div className="fx-bubble" style={S(`padding:10px 14px;border-radius:18px;font-size:14px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere;${mine ? "background:#B86CF9;color:#1F1712;border-bottom-right-radius:6px;" : "background:rgba(243,238,228,.08);color:#F3EEE4;border-bottom-left-radius:6px;"}`)}>
                          {m.fresh && !mine ? <TypedText text={m.content} onDone={() => finishTyping(i)} onTick={() => toBottom(false)} /> : m.content}
                        </div>
                        {showCard && m.booked ? (
                          <div className="fx-fadeup" style={S("display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:14px;background:#F3EEE4;color:#1F1712;font-size:13px;font-weight:600;")}>
                            <span style={S("width:24px;height:24px;border-radius:999px;background:#B86CF9;display:flex;align-items:center;justify-content:center;flex:none;")}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1F1712" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7" /></svg></span>
                            Consultation requested · <span style={S("font-family:'JetBrains Mono',monospace;")}>{m.booked}</span>
                          </div>
                        ) : null}
                        {showCard && m.sent ? <div style={S("font-size:12px;color:rgba(243,238,228,.6);")}>Message delivered to the Foxmen team</div> : null}
                      </div>
                    </div>
                  );
                })}
                {busy ? (
                  <div className="fx-msg" style={S("display:flex;gap:8px;align-items:flex-end;")} role="status" aria-label="Isaac is typing">
                    <Avatar size={28} />
                    <div style={S("display:flex;gap:5px;align-items:center;padding:13px 16px;border-radius:18px;border-bottom-left-radius:6px;background:rgba(243,238,228,.08);")}>
                      <span className="fx-dot" /><span className="fx-dot" /><span className="fx-dot" />
                    </div>
                  </div>
                ) : null}
                {onlyGreeting ? (
                  <div style={S("display:flex;flex-wrap:wrap;gap:8px;margin-top:2px;padding-left:36px;")}>
                    {QUICK.map(q => <button key={q} onClick={() => send(q)} style={S("border:none;cursor:pointer;padding:9px 14px;border-radius:999px;font-size:13px;font-weight:600;background:transparent;color:#F3EEE4;box-shadow:inset 0 0 0 1px rgba(243,238,228,.22);")} className="hv13">{q}</button>)}
                  </div>
                ) : null}
              </div>

              <div className="fx-chat-foot" style={S("padding:10px;")}>
                {voice.err ? <div role="alert" style={S("font-size:12px;color:#F1B8AE;padding:0 6px 8px;")}>{voice.err}</div> : null}
                <div style={S(`border-radius:20px;background:#2A211B;box-shadow:inset 0 0 0 1px ${rec ? "rgba(239,67,53,.55)" : "rgba(243,238,228,.08)"}, inset 0 0 50px 0 rgba(255,255,255,.02);padding:8px;display:flex;flex-direction:column;gap:6px;transition:box-shadow .3s;`)}>
                  {rec || working ? (
                    <div style={S("display:flex;align-items:center;gap:12px;min-height:54px;padding:6px 8px;")} aria-live="polite">
                      {rec ? <span className="fx-rec-dot" /> : <span className="fx-orb" style={S("width:22px;height:22px;")}><span className="fx-orb-core" /></span>}
                      <span style={S("font-size:14px;font-weight:600;")}>{rec ? "Listening" : "Turning your voice into text"}{working ? <span className="fx-ellipsis" /> : null}</span>
                      {rec ? (
                        <span style={S("display:flex;align-items:center;gap:3px;height:22px;margin-left:auto;")}>
                          {voice.levels.map((l, k) => <span key={k} style={S(`width:4px;border-radius:2px;background:#B86CF9;height:${Math.round(4 + l * 18)}px;transition:height .08s;`)} />)}
                          <span style={S("font-family:'JetBrains Mono',monospace;font-size:12px;color:rgba(243,238,228,.6);margin-left:8px;")}>0:{String(voice.secs).padStart(2, "0")}</span>
                        </span>
                      ) : null}
                    </div>
                  ) : (
                    <textarea
                      ref={input}
                      value={text}
                      onChange={e => setText(e.target.value.slice(0, 2000))}
                      onKeyDown={onKey}
                      rows={2}
                      enterKeyHint="send"
                      placeholder="Type or tap the mic to speak..."
                      aria-label="Message Isaac"
                      className="fx-chat-input"
                      style={S("width:100%;border:none;background:transparent;resize:none;outline:none;color:#F3EEE4;font-size:14px;line-height:1.5;padding:6px 6px 0;font-family:Inter,sans-serif;")}
                    />
                  )}
                  <div style={S("display:flex;align-items:center;gap:8px;")}>
                    <span style={S(chip)}>Agent</span>
                    <button onClick={() => send("I would like to book a consultation.")} disabled={busy || typing || rec || working} style={S(chip + "cursor:pointer;")}>Book a call</button>
                    {voice.supported ? (
                      <button
                        onClick={() => (rec ? voice.stop() : voice.start())}
                        disabled={working || busy}
                        aria-label={rec ? "Stop recording" : "Speak your message"}
                        aria-pressed={rec}
                        style={S(`margin-left:auto;width:36px;height:36px;border-radius:999px;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex:none;background:${rec ? "#EF4335" : "rgba(255,255,255,.06)"};color:${rec ? "#fff" : "#CACCD2"};transition:background .2s;`)}
                      >
                        {rec
                          ? <span style={S("width:11px;height:11px;border-radius:3px;background:#fff;")} />
                          : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></svg>}
                      </button>
                    ) : null}
                    <button onClick={() => send()} disabled={!canSend || rec || working} aria-label="Send" style={S(`${voice.supported ? "" : "margin-left:auto;"}width:36px;height:36px;border-radius:999px;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex:none;background:${canSend ? "#B86CF9" : "rgba(255,255,255,.06)"};color:${canSend ? "#1F1712" : "#8B8B8B"};transition:background .2s;`)}>
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
        className={`fx-fab${open ? " fx-fab-open" : ""}`}
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
