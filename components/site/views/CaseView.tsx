/* eslint-disable */
// GENERATED from "foxmen new/Foxmen Studio.dc.html" by the design converter. Markup and
// inline styles are kept 1:1 with the design; behaviour lives in the page components.
"use client";
import { Fragment } from "react";
import { S } from "../style";
import Btn from "../Btn";
import ImageSlot from "../ImageSlot";

export default function CaseView({ v }: { v: any }) {
  return (
    <>
    <main data-screen-label="Case study">
      <section style={S("padding:clamp(130px,18vh,190px) clamp(20px,4.5vw,64px) clamp(40px,5vw,64px);")}>
        <div style={S("max-width:1440px;margin:0 auto;")}>
          <div style={S("display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;margin-bottom:clamp(32px,5vw,64px);")}>
            <a href="/work" onClick={v.go.work} style={S("display:inline-flex;align-items:center;gap:10px;padding:10px 18px 10px 12px;border-radius:999px;box-shadow:inset 0 0 0 1px rgba(31,23,18,.18);font-size:15px;font-weight:600;")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M11 18l-6-6 6-6"></path>
              </svg>
              {"All work"}
            </a>
            <span style={S("font-family:'JetBrains Mono',monospace;font-size:13px;white-space:nowrap;")}>
              {"Case study "}{v.cs.num}{" / "}{v.cs.total}
            </span>
          </div>
          <h1 style={S("margin:0;font-size:clamp(56px,12vw,210px);font-weight:800;letter-spacing:-0.07em;line-height:.88;text-wrap:balance;")}>
            <div style={S("overflow:hidden;padding-bottom:.06em;")}>
              <div data-reveal="up">
                {v.cs.name}
              </div>
            </div>
          </h1>
          <div style={S("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:clamp(24px,4vw,64px);margin-top:clamp(28px,4vw,56px);align-items:end;")}>
            <p data-reveal="1" style={S("margin:0;font-size:clamp(22px,2.2vw,32px);font-weight:600;letter-spacing:-0.035em;line-height:1.15;max-width:18em;text-wrap:pretty;")}>
              {v.cs.type}
            </p>
            <div data-reveal="1" data-delay="120" style={S("display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 24px;")}>
              <div style={S("padding:14px 0;border-top:1px solid rgba(31,23,18,.18);")}>
                <div style={S("font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#5E5249;margin-bottom:6px;")}>
                  {"Services"}
                </div>
                <div style={S("font-size:16px;font-weight:500;")}>
                  {v.cs.services}
                </div>
              </div>
              <div style={S("padding:14px 0;border-top:1px solid rgba(31,23,18,.18);")}>
                <div style={S("font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#5E5249;margin-bottom:6px;")}>
                  {"Website"}
                </div>
                <div style={S("font-size:16px;font-weight:500;overflow-wrap:anywhere;")}>
                  {v.cs.site}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section style={S("padding:0 clamp(12px,2vw,28px);")}>
        <div data-reveal="1" style={S(`max-width:1560px;margin:0 auto;aspect-ratio:16/9;border-radius:clamp(20px,2.4vw,32px);overflow:hidden;background:${v.cs.tint};`)}>
          <ImageSlot id={`case-${v.cs.slug}-hero`} placeholder={`Hero screenshot of ${v.cs.name}`} />
        </div>
      </section>
      <section style={S("padding:clamp(80px,10vw,150px) clamp(20px,4.5vw,64px);")}>
        <div style={S("max-width:1440px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:24px clamp(32px,6vw,96px);")}>
          <div style={S("font-family:'JetBrains Mono',monospace;font-size:13px;")}>
            {"(Overview)"}
          </div>
          <p data-reveal="1" style={S("grid-column:span 2;margin:0;font-size:clamp(28px,3.6vw,56px);font-weight:700;letter-spacing:-0.05em;line-height:1.08;text-wrap:pretty;min-width:0;")}>
            {v.cs.desc}
          </p>
        </div>
      </section>
      <section style={S("padding:0 clamp(20px,4.5vw,64px) clamp(80px,10vw,150px);")}>
        <div style={S("max-width:1440px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:24px clamp(32px,6vw,96px);")}>
          <div style={S("font-family:'JetBrains Mono',monospace;font-size:13px;")}>
            {"(What we built)"}
          </div>
          <ol style={S("grid-column:span 2;list-style:none;margin:0;padding:0;min-width:0;")}>
            {(v.cs.feats || []).map((f: any, f$i: number) => (
              <Fragment key={f$i}>
              <li data-reveal="1" style={S("display:grid;grid-template-columns:56px minmax(0,1fr);gap:16px;align-items:baseline;padding:clamp(20px,2.4vw,32px) 0;border-top:1px solid rgba(31,23,18,.18);")}>
                <span style={S("font-family:'JetBrains Mono',monospace;font-size:13px;color:#B86CF9;font-weight:500;")}>
                  {f.n}
                </span>
                <span style={S("font-size:clamp(20px,2vw,30px);font-weight:600;letter-spacing:-0.035em;line-height:1.2;text-wrap:pretty;")}>
                  {f.f}
                </span>
              </li>
              </Fragment>
            ))}
          </ol>
        </div>
      </section>
      <section style={S("padding:0 clamp(12px,2vw,28px) clamp(80px,10vw,150px);")}>
        <div style={S("max-width:1560px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr));gap:clamp(12px,1.6vw,24px);")}>
          <div data-reveal="1" style={S("aspect-ratio:4/5;border-radius:clamp(20px,2.4vw,32px);overflow:hidden;background:#EAE3D6;")}>
            <ImageSlot id={`case-${v.cs.slug}-a`} placeholder={"Mobile or detail screenshot"} />
          </div>
          <div data-reveal="1" data-delay="120" style={S("aspect-ratio:4/5;border-radius:clamp(20px,2.4vw,32px);overflow:hidden;background:#EAE3D6;")}>
            <ImageSlot id={`case-${v.cs.slug}-b`} placeholder={"Second screenshot"} />
          </div>
        </div>
        {v.cs.hasUrl ? (
          <>
          <div style={S("display:flex;justify-content:center;margin-top:clamp(48px,6vw,88px);")}>
            <a href={v.cs.href} target="_blank" rel="noopener" style={S("display:inline-flex;align-items:center;gap:18px;padding:6px 6px 6px 26px;border-radius:999px;background:#1F1712;color:#F3EEE4;font-weight:600;font-size:16px;")}>
              {"Visit "}{v.cs.url}
              <span style={S("width:44px;height:44px;border-radius:999px;background:#B86CF9;color:#1F1712;display:flex;align-items:center;justify-content:center;")}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7M9 7h8v8"></path>
                </svg>
              </span>
            </a>
          </div>
          </>
        ) : null}
      </section>
      <section style={S("padding:0 clamp(12px,2vw,28px) clamp(12px,2vw,28px);")}>
        <a href="/work" onClick={v.nx.open} style={S("display:block;max-width:1560px;margin:0 auto;background:#1F1712;color:#F3EEE4;border-radius:clamp(20px,2.4vw,32px);padding:clamp(40px,6vw,96px) clamp(24px,4.5vw,64px);transition:background .4s;")} className="hv9">
          <div style={S("display:flex;justify-content:space-between;gap:16px;font-family:'JetBrains Mono',monospace;font-size:13px;margin-bottom:clamp(20px,3vw,40px);")}>
            <span>
              {"Next project"}
            </span>
            <span>
              {v.nx.num}
            </span>
          </div>
          <div style={S("font-size:clamp(48px,10vw,176px);font-weight:800;letter-spacing:-0.07em;line-height:.9;color:#B86CF9;overflow-wrap:anywhere;")}>
            {v.nx.name}
          </div>
          <div style={S("font-size:clamp(16px,1.4vw,20px);margin-top:16px;color:#F3EEE4;")}>
            {v.nx.type}
          </div>
        </a>
      </section>
    </main>
    </>
  );
}
