"use client";
import { useState, type FormEvent, type KeyboardEvent } from "react";
import { useSite } from "../SiteChrome";
import { S } from "../style";
import Btn from "../Btn";
import ThinkingLoader from "../tools/ThinkingLoader";
import { useToolRun } from "../tools/useToolRun";
import { outBlocks } from "../tools/blocks";
import { AI_TOOLS, type Tool, type ToolSettings } from "@/lib/site/data";

const LENS = ["Short", "Standard", "Detailed"];
const eyebrow = "display:flex;align-items:center;gap:10px;font-size:13px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#5E5249;";
const dot = "width:8px;height:8px;border-radius:2px;background:#B86CF9;";

export default function ToolProductPage({ toolId, settings, related }: { toolId: string; settings: ToolSettings; related: ToolSettings[] }) {
  const { go, navigate, cur } = useSite();
  const t = AI_TOOLS.find(x => x.id === toolId) as Tool;
  const num = String(AI_TOOLS.indexOf(t) + 1).padStart(2, "0");
  const [vals, setVals] = useState<Record<string, string>>({});
  const [len, setLen] = useState(1);
  const [copied, setCopied] = useState(false);
  const { out, waiting, streaming, busy, cached, run } = useToolRun();
  const filled = (t.fields || []).some(f => (vals[f.k] || "").trim());

  const submit = (e?: FormEvent) => { e?.preventDefault(); if (!filled || busy) return; setCopied(false); run({ tool: t.id, len, fields: vals }); };
  const onKey = (e: KeyboardEvent) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit(); };
  const download = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([out], { type: "text/plain" }));
    a.download = `${t.slug}.txt`; a.click(); URL.revokeObjectURL(a.href);
  };

  const usd = cur === "usd";
  const hasPrice = settings.priceUsd !== null || settings.priceBdt !== null;
  const price = !hasPrice ? "Free"
    : usd ? (settings.priceUsd !== null ? `USD ${settings.priceUsd.toLocaleString("en-US")}` : `BDT ${settings.priceBdt!.toLocaleString("en-IN")}`)
    : (settings.priceBdt !== null ? `BDT ${settings.priceBdt.toLocaleString("en-IN")}` : `USD ${settings.priceUsd!.toLocaleString("en-US")}`);
  const priceNote = hasPrice ? settings.priceNote : "Free during launch. No sign-up needed.";
  const blocks = outBlocks(out);
  const others = [...related.map(r => AI_TOOLS.find(x => x.id === r.id)!).filter(x => x.id !== t.id && x.cat === t.cat), ...AI_TOOLS.filter(x => x.id !== t.id && x.cat !== t.cat)]
    .filter(x => related.some(r => r.id === x.id && r.enabled)).slice(0, 3);
  const openTool = (x: Tool) => (e: { preventDefault(): void }) => { e.preventDefault(); navigate(`/tools/${x.slug}`, x.name); };

  const input = "width:100%;border:1px solid rgba(243,238,228,.14);background:#2A211B;border-radius:14px;padding:14px 16px;font-size:16px;color:#F3EEE4;outline:none;font-family:Inter,sans-serif;";

  return (
    <main data-screen-label={t.name}>
      {/* Hero */}
      <section style={S("padding:clamp(130px,18vh,190px) clamp(20px,4.5vw,64px) clamp(40px,5vw,64px);")}>
        <div style={S("max-width:1440px;margin:0 auto;")}>
          <div style={S("display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;margin-bottom:clamp(32px,5vw,64px);")}>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- curtain navigation handles the click */}
            <a href="/tools" onClick={go.tools} style={S("display:inline-flex;align-items:center;gap:10px;padding:10px 18px 10px 12px;border-radius:999px;box-shadow:inset 0 0 0 1px rgba(31,23,18,.18);font-size:15px;font-weight:600;")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 18l-6-6 6-6"></path></svg>All AI tools
            </a>
            <span style={S("font-family:'JetBrains Mono',monospace;font-size:13px;")}>Tool {num} / {String(AI_TOOLS.length).padStart(2, "0")} · {t.cat}</span>
          </div>
          <div style={S("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr));gap:clamp(28px,4vw,64px);align-items:end;")}>
            <div>
              <h1 style={S("margin:0;font-size:clamp(48px,8vw,136px);font-weight:800;letter-spacing:-0.07em;line-height:.9;text-wrap:balance;")}>
                <div style={S("overflow:hidden;padding-bottom:.06em;")}><div data-reveal="up">{t.name}</div></div>
              </h1>
              <p data-reveal="1" data-delay="120" style={S("margin:clamp(20px,3vw,32px) 0 0;font-size:clamp(20px,2vw,28px);font-weight:600;letter-spacing:-0.035em;line-height:1.2;max-width:22em;text-wrap:pretty;")}>{t.tagline}</p>
            </div>
            <div data-reveal="1" data-delay="200" style={S("background:#FAF7F1;border:1px solid rgba(31,23,18,.1);border-radius:24px;padding:clamp(22px,3vw,32px);display:flex;flex-direction:column;gap:22px;")}>
              <div style={S("display:flex;justify-content:space-between;align-items:center;gap:12px;")}>
                <span style={S(eyebrow)}><span style={S(dot)}></span>Price</span>
                <span style={S("display:inline-flex;align-items:center;gap:8px;padding:6px 12px 6px 6px;border-radius:999px;background:#1F1712;color:#F3EEE4;font-size:12px;font-weight:600;")}>
                  <span style={S("width:20px;height:20px;border-radius:999px;background:#120C09;box-shadow:inset 0 0 0 1px rgba(184,108,249,.45);display:flex;align-items:center;justify-content:center;")}><img src="/assets/logo.png" alt="" style={S("width:12px;height:12px;")} /></span>Foxmen AI
                </span>
              </div>
              <div>
                <div style={S("font-size:clamp(40px,4.4vw,64px);font-weight:800;letter-spacing:-0.058em;line-height:1;")}>{price}</div>
                {priceNote ? <div style={S("font-size:15px;color:#5E5249;margin-top:8px;")}>{priceNote}</div> : null}
              </div>
              <p style={S("margin:0;font-size:16px;line-height:1.6;color:#5E5249;")}>{t.about}</p>
              <div><Btn label="Try it now" variant="dark" href="#workbench" onClick={e => { e.preventDefault(); document.getElementById("workbench")?.scrollIntoView({ behavior: "smooth", block: "start" }); }} /></div>
            </div>
          </div>
        </div>
      </section>

      {/* Workbench */}
      <section id="workbench" style={S("padding:0 clamp(12px,2vw,24px) clamp(80px,10vw,140px);scroll-margin-top:90px;")}>
        <div style={S("max-width:1560px;margin:0 auto;background:#1F1712;color:#F3EEE4;border-radius:clamp(20px,2.4vw,32px);padding:clamp(20px,3.5vw,48px);display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr));gap:clamp(20px,3vw,40px);align-items:start;")}>
          <form onSubmit={submit} onKeyDown={onKey} style={S("display:flex;flex-direction:column;gap:18px;")}>
            <div style={S("display:flex;align-items:center;gap:12px;")}>
              <span style={S("font-family:'JetBrains Mono',monospace;font-size:12px;color:#B86CF9;")}>{num}</span>
              <span style={S("font-size:clamp(22px,2.2vw,30px);font-weight:800;letter-spacing:-0.045em;")}>Tell us what you need</span>
            </div>
            {(t.fields || []).map(f => (
              <label key={f.k} style={S("display:flex;flex-direction:column;gap:8px;font-size:14px;font-weight:600;color:rgba(243,238,228,.85);")}>
                {f.label}
                {f.long
                  ? <textarea rows={5} value={vals[f.k] || ""} maxLength={2500} placeholder={`e.g. ${f.ph}`} onChange={e => setVals(v => ({ ...v, [f.k]: e.target.value }))} style={S(input + "resize:vertical;line-height:1.5;")} />
                  : <input value={vals[f.k] || ""} maxLength={300} placeholder={`e.g. ${f.ph}`} onChange={e => setVals(v => ({ ...v, [f.k]: e.target.value }))} style={S(input)} />}
              </label>
            ))}
            <div style={S("display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:14px;margin-top:4px;")}>
              <div style={S("display:flex;padding:4px;border-radius:999px;background:#2A211B;")} role="radiogroup" aria-label="Answer length">
                {LENS.map((l, i) => (
                  <button type="button" key={l} role="radio" aria-checked={len === i} onClick={() => setLen(i)} style={S(`border:none;cursor:pointer;padding:9px 16px;border-radius:999px;font-size:13px;font-weight:600;background:${len === i ? "#F3EEE4" : "transparent"};color:${len === i ? "#1F1712" : "rgba(243,238,228,.7)"};`)}>{l}</button>
                ))}
              </div>
              <button type="submit" disabled={!filled || busy} style={S(`display:inline-flex;align-items:center;gap:18px;padding:6px 6px 6px 26px;border-radius:999px;border:none;cursor:${filled && !busy ? "pointer" : "default"};background:${filled && !busy ? "#B86CF9" : "rgba(243,238,228,.12)"};color:${filled && !busy ? "#1F1712" : "rgba(243,238,228,.5)"};font-weight:600;font-size:16px;transition:background .25s;`)}>
                {busy ? "Generating" : out ? "Generate again" : "Generate"}
                <span style={S("width:44px;height:44px;border-radius:999px;background:#1F1712;color:#F3EEE4;display:flex;align-items:center;justify-content:center;")}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M9 7h8v8"></path></svg></span>
              </button>
            </div>
            <div style={S("font-size:12px;color:rgba(243,238,228,.45);")}>Ctrl or ⌘ + Enter to generate. Results are AI generated; please review before use.</div>
          </form>

          <div style={S("background:#FAF7F1;color:#1F1712;border-radius:24px;padding:clamp(18px,2.6vw,28px);min-height:420px;display:flex;flex-direction:column;")} aria-live="polite">
            <div style={S("display:flex;justify-content:space-between;align-items:center;gap:12px;padding-bottom:14px;margin-bottom:16px;border-bottom:1px solid rgba(31,23,18,.1);")}>
              <span style={S("display:flex;align-items:center;gap:10px;font-size:14px;font-weight:600;")}>
                <span style={S("width:26px;height:26px;border-radius:999px;background:#120C09;display:flex;align-items:center;justify-content:center;")}><img src="/assets/logo.png" alt="" style={S("width:14px;height:14px;")} /></span>
                Result{cached && !busy ? <span style={S("font-size:11px;font-weight:600;padding:3px 8px;border-radius:999px;background:#EAE3D6;color:#5E5249;")}>instant</span> : null}
              </span>
              {out && !busy ? (
                <span style={S("display:flex;gap:6px;")}>
                  <button onClick={() => { navigator.clipboard?.writeText(out).catch(() => {}); setCopied(true); }} style={S("border:none;cursor:pointer;padding:8px 14px;border-radius:999px;background:#1F1712;color:#F3EEE4;font-size:13px;font-weight:600;")}>{copied ? "Copied" : "Copy"}</button>
                  <button onClick={download} style={S("border:none;cursor:pointer;padding:8px 14px;border-radius:999px;background:#EAE3D6;color:#1F1712;font-size:13px;font-weight:600;")}>Download</button>
                </span>
              ) : null}
            </div>
            {waiting ? <ThinkingLoader tool={t.id} /> : null}
            {!waiting && !out ? (
              <div style={S("flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;text-align:center;padding:24px;color:#5E5249;")}>
                <div style={S("width:112px;height:84px;padding-top:12px;border-radius:14px;background:#1F1712;color:#B86CF9;display:flex;align-items:center;justify-content:center;overflow:hidden;")}><pre data-icon="12" style={S("margin:0;font-family:'JetBrains Mono',monospace;font-size:11px;line-height:1.12;font-variant-ligatures:none;")}></pre></div>
                <div style={S("font-size:16px;max-width:22em;")}>Fill in the details and press Generate. Your result appears here in seconds.</div>
              </div>
            ) : null}
            {out ? (
              <div style={S("display:flex;flex-direction:column;gap:12px;")}>
                {blocks.map((ob, bi) => (
                  <div key={bi} style={S(`display:grid;grid-template-columns:40px minmax(0,1fr);gap:14px;padding:18px 20px;border-radius:18px;background:${ob.bg};color:${ob.fg};`)}>
                    <span style={S(`font-family:'JetBrains Mono',monospace;font-size:12px;padding-top:4px;color:${ob.nc};`)}>{ob.n}</span>
                    <div style={S("display:flex;flex-direction:column;gap:10px;min-width:0;")}>
                      {ob.hasTitle ? <div style={S("font-size:clamp(18px,1.6vw,22px);font-weight:800;letter-spacing:-0.03em;line-height:1.2;")}>{ob.title}</div> : null}
                      {ob.paras.map((pp, k) => <p key={k} style={S("margin:0;font-size:16px;line-height:1.6;text-wrap:pretty;overflow-wrap:anywhere;")}>{pp}</p>)}
                      {ob.hasList ? (
                        <ul style={S("list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px;")}>
                          {ob.items.map((li, k) => <li key={k} style={S("display:flex;gap:12px;align-items:baseline;font-size:15px;line-height:1.55;")}><span style={S(`width:7px;height:7px;border-radius:2px;background:${ob.dot};flex:none;transform:translateY(-2px) rotate(45deg);`)}></span><span style={S("overflow-wrap:anywhere;")}>{li}</span></li>)}
                        </ul>
                      ) : null}
                    </div>
                  </div>
                ))}
                {streaming ? <span className="fx-caret" aria-hidden="true" /> : null}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section style={S("padding:0 clamp(20px,4.5vw,64px) clamp(80px,10vw,140px);")}>
        <div style={S("max-width:1440px;margin:0 auto;")}>
          <div style={S("display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:24px;margin-bottom:clamp(32px,4vw,48px);")}>
            <h2 data-reveal="1" style={S("margin:0;font-size:clamp(44px,7vw,112px);font-weight:800;letter-spacing:-0.068em;line-height:.9;")}>What you get.</h2>
            <span style={S(eyebrow)}><span style={S(dot)}></span>{t.cat}</span>
          </div>
          <div style={S("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:16px;")}>
            {(t.gets || []).map((g, i) => (
              <div key={g} data-reveal="1" data-delay={String(i * 80)} className="hv4" style={S("background:#FAF7F1;border:1px solid rgba(31,23,18,.1);border-radius:24px;padding:28px;min-height:200px;display:flex;flex-direction:column;justify-content:space-between;gap:32px;transition:background .35s;")}>
                <span style={S("font-family:'JetBrains Mono',monospace;font-size:13px;")}>{String(i + 1).padStart(2, "0")}</span>
                <div style={S("font-size:clamp(20px,1.8vw,26px);font-weight:700;letter-spacing:-0.035em;line-height:1.15;")}>{g}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={S("padding:clamp(64px,8vw,120px) clamp(20px,4.5vw,64px);border-top:1px solid rgba(31,23,18,.12);")}>
        <div style={S("max-width:1440px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr));gap:48px;")}>
          <div><div style={S("position:sticky;top:120px;display:flex;flex-direction:column;gap:20px;")}>
            <span style={S(eyebrow)}><span style={S(dot)}></span>How it works</span>
            <h2 data-reveal="1" style={S("margin:0;font-size:clamp(40px,5.5vw,84px);font-weight:800;letter-spacing:-0.062em;line-height:.95;")}>Three steps. Seconds, not hours.</h2>
          </div></div>
          <div style={S("display:flex;flex-direction:column;gap:12px;")}>
            {[["01", "Describe", "Fill in a few short fields about your business. Plain words are fine.", 10], ["02", "Generate", "Our AI writes a first version in seconds, shaped for your customers.", 11], ["03", "Refine and use", "Change the length, generate again, then copy or download the result.", 15]].map(([n, h, d, k], i) => (
              <div key={n as string} data-reveal="1" style={S(`background:${["#FAF7F1", "#EAE3D6", "#B86CF9"][i]};border:1px solid rgba(31,23,18,.1);border-radius:24px;padding:clamp(22px,3vw,36px);display:flex;gap:24px;align-items:flex-start;`)}>
                <div style={S("width:112px;height:84px;padding-top:12px;border-radius:14px;background:#1F1712;color:#B86CF9;display:flex;align-items:center;justify-content:center;flex:none;overflow:hidden;position:relative;")}><pre data-icon={String(k)} style={S("margin:0;font-family:'JetBrains Mono',monospace;font-size:11px;line-height:1.12;font-variant-ligatures:none;")}></pre><span style={S("position:absolute;top:6px;left:8px;font-family:'JetBrains Mono',monospace;font-size:9px;opacity:.7;")}>{n}</span></div>
                <div><div style={S("font-size:clamp(24px,2.4vw,34px);font-weight:800;letter-spacing:-0.048em;margin-bottom:8px;")}>{h}</div><div style={S("font-size:17px;line-height:1.55;color:#5E5249;")}>{d}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* More tools */}
      {others.length ? (
        <section style={S("padding:clamp(40px,6vw,80px) clamp(20px,4.5vw,64px) clamp(80px,10vw,140px);")}>
          <div style={S("max-width:1440px;margin:0 auto;")}>
            <h2 data-reveal="1" style={S("margin:0 0 clamp(28px,4vw,48px);font-size:clamp(40px,6vw,96px);font-weight:800;letter-spacing:-0.068em;line-height:.9;")}>More tools.</h2>
            <div style={S("border-top:1px solid rgba(31,23,18,.14);")}>
              {others.map(x => (
                <a key={x.id} href={`/tools/${x.slug}`} onClick={openTool(x)} className="hv15" style={S("display:grid;grid-template-columns:48px minmax(0,1.1fr) minmax(0,1fr) auto;gap:12px clamp(16px,3vw,40px);align-items:center;padding:clamp(18px,2vw,26px) 0;border-bottom:1px solid rgba(31,23,18,.14);border-radius:12px;transition:padding .35s ease, background .35s ease;")}>
                  <span style={S("font-family:'JetBrains Mono',monospace;font-size:13px;color:#5E5249;")}>{String(AI_TOOLS.indexOf(x) + 1).padStart(2, "0")}</span>
                  <span style={S("font-size:clamp(22px,2.4vw,36px);font-weight:800;letter-spacing:-0.048em;line-height:1.05;")}>{x.name}</span>
                  <span style={S("font-size:15px;line-height:1.5;color:#5E5249;")}>{x.desc}</span>
                  <span style={S("display:inline-flex;align-items:center;gap:8px;justify-self:end;font-size:14px;font-weight:600;padding:10px 16px;border-radius:999px;background:#1F1712;color:#F3EEE4;white-space:nowrap;")}>Open</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* CTA */}
      <section style={S("padding:0 clamp(12px,2vw,24px) clamp(12px,2vw,24px);")}>
        <div style={S("position:relative;border-radius:clamp(20px,2.4vw,32px);overflow:hidden;background:#B066FA url(/assets/brand/pattern.png) center/cover;padding:clamp(24px,5vw,72px);display:flex;justify-content:flex-end;")}>
          <div style={S("max-width:720px;background:#F3EEE4;border-radius:clamp(18px,2vw,28px);padding:clamp(28px,4.5vw,64px);display:flex;flex-direction:column;gap:24px;")}>
            <h2 style={S("margin:0;font-size:clamp(40px,5.4vw,88px);font-weight:800;letter-spacing:-0.068em;line-height:.92;")}>Want this inside your business?</h2>
            <p style={S("margin:0;font-size:17px;line-height:1.6;color:#5E5249;max-width:460px;")}>We build custom AI tools like this one, trained on your products, prices and policies, and built into your website or app.</p>
            <div><Btn label="Talk to us" variant="dark" href="/contact" onClick={go.contact} /></div>
          </div>
        </div>
      </section>
    </main>
  );
}
