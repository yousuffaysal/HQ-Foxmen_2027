/* eslint-disable */
// GENERATED from "foxmen new/Foxmen Studio.dc.html" by the design converter. Markup and
// inline styles are kept 1:1 with the design; behaviour lives in the page components.
"use client";
import { Fragment } from "react";
import { S } from "../style";
import Btn from "../Btn";
import ImageSlot from "../ImageSlot";

export default function WorkView({ v }: { v: any }) {
  return (
    <>
    <main data-screen-label="Portfolio">
      <section style={S("padding:clamp(140px,20vh,200px) clamp(20px,4.5vw,64px) 48px;")}>
        <div style={S("max-width:1440px;margin:0 auto;")}>
          <h1 style={S("margin:0 0 40px;font-size:clamp(52px,10vw,176px);font-weight:800;letter-spacing:-0.068em;line-height:.9;")}>
            <div style={S("overflow:hidden;padding-bottom:.05em;")}>
              <div data-reveal="up">
                {"Selected"}
              </div>
            </div>
            <div style={S("overflow:hidden;padding-bottom:.05em;")}>
              <div data-reveal="up" data-delay="90">
                {"work"}
                <sup style={S("font-size:.28em;letter-spacing:-0.02em;vertical-align:top;margin-left:.1em;")}>
                  {"("}{v.workCount}{")"}
                </sup>
              </div>
            </div>
          </h1>
          <div data-reveal="1" data-delay="200" style={S("display:flex;flex-wrap:wrap;gap:8px;")}>
            {(v.filters || []).map((f: any, f$i: number) => (
              <Fragment key={f$i}>
              <button onClick={f.pick} style={S(`border:none;cursor:pointer;padding:12px 22px;border-radius:999px;font-size:15px;font-weight:600;background:${f.bg};color:${f.fg};box-shadow:inset 0 0 0 1px rgba(31,23,18,.15);transition:background .3s;`)}>
                {f.label}
              </button>
              </Fragment>
            ))}
          </div>
        </div>
      </section>
      <section style={S("padding:0 clamp(20px,4.5vw,64px) clamp(88px,10vw,140px);")}>
        <div style={S("max-width:1440px;margin:0 auto;display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:clamp(48px,6vw,96px) clamp(16px,2vw,28px);align-items:start;")}>
          {(v.workList || []).map((p: any, p$i: number) => (
            <Fragment key={p$i}>
            <article data-reveal="1" style={S(`grid-column:span ${p.span};margin-top:${p.mt};display:flex;flex-direction:column;gap:20px;min-width:0;`)}>
              <a href="/work" onClick={p.open} style={S(`display:block;position:relative;width:100%;aspect-ratio:${p.ratio};border-radius:clamp(20px,2.4vw,32px);overflow:hidden;background:${p.tint};`)} className="hv10">
                <div style={S("position:absolute;inset:0;background:repeating-linear-gradient(135deg,rgba(31,23,18,.05) 0 1px,transparent 1px 16px);transition:transform 1s cubic-bezier(.2,.7,.2,1);")} className="hv11">
                  {p.thumb ? (
                    <>
                    <img src={p.thumb} alt={p.name} loading="lazy" decoding="async" style={S("position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;")} />
                    </>
                  ) : null}
                </div>
                {p.noThumb ? (
                  <>
                  <div style={S(`position:absolute;left:0;right:0;bottom:-.14em;padding:0 clamp(16px,2vw,28px);font-size:clamp(64px,${p.wm},260px);font-weight:800;letter-spacing:-0.075em;line-height:1;color:rgba(31,23,18,.07);white-space:nowrap;overflow:hidden;pointer-events:none;`)}>
                    {p.name}
                  </div>
                  </>
                ) : null}
                <div style={S("position:absolute;top:clamp(14px,1.6vw,22px);left:clamp(14px,1.6vw,22px);right:clamp(14px,1.6vw,22px);display:flex;justify-content:space-between;align-items:flex-start;gap:12px;")}>
                  <span style={S("font-family:'JetBrains Mono',monospace;font-size:13px;padding:8px 12px;border-radius:999px;background:#F3EEE4;")}>
                    {p.num}
                  </span>
                  <div style={S("display:flex;flex-wrap:wrap;justify-content:flex-end;gap:6px;")}>
                    {p.latest ? (
                      <>
                      <span style={S("font-size:13px;font-weight:600;padding:8px 14px;border-radius:999px;background:#1F1712;color:#F3EEE4;")}>
                        {"Latest"}
                      </span>
                      </>
                    ) : null}
                    {(p.tags || []).map((t: any, t$i: number) => (
                      <Fragment key={t$i}>
                      <span style={S("font-size:13px;font-weight:500;padding:8px 14px;border-radius:999px;background:rgba(243,238,228,.8);backdrop-filter:blur(6px);")}>
                        {t}
                      </span>
                      </Fragment>
                    ))}
                  </div>
                </div>
              </a>
              <div style={S("display:flex;justify-content:space-between;align-items:flex-end;gap:16px 24px;flex-wrap:wrap;")}>
                <div style={S("min-width:0;flex:1 1 260px;")}>
                  <a href="/work" onClick={p.open} style={S(`display:block;font-size:${p.titleSize};font-weight:800;letter-spacing:-0.06em;line-height:.95;`)} className="hv8">
                    {p.name}
                  </a>
                  <div style={S("font-size:16px;color:#5E5249;margin-top:10px;max-width:32em;text-wrap:pretty;")}>
                    {p.type}
                  </div>
                </div>
                <div style={S("display:flex;gap:8px;flex-wrap:wrap;")}>
                  <a href="/work" onClick={p.open} style={S("display:inline-flex;align-items:center;gap:10px;height:48px;padding:0 8px 0 20px;border-radius:999px;background:#1F1712;color:#F3EEE4;font-size:15px;font-weight:600;")} className="hv12">
                    {"Case study"}
                    <span style={S("width:34px;height:34px;border-radius:999px;background:#B86CF9;color:#1F1712;display:flex;align-items:center;justify-content:center;")}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M13 6l6 6-6 6"></path>
                      </svg>
                    </span>
                  </a>
                  {p.hasUrl ? (
                    <>
                    <a href={p.href} target="_blank" rel="noopener" style={S("display:inline-flex;align-items:center;gap:8px;height:48px;padding:0 20px;border-radius:999px;box-shadow:inset 0 0 0 1px rgba(31,23,18,.22);font-size:15px;font-weight:600;transition:background .3s;")} className="hv13">
                      {"Live site"}
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 17L17 7M9 7h8v8"></path>
                      </svg>
                    </a>
                    </>
                  ) : null}
                </div>
              </div>
            </article>
            </Fragment>
          ))}
        </div>
      </section>
    </main>
    </>
  );
}
