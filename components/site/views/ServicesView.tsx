/* eslint-disable */
// GENERATED from "foxmen new/Foxmen Studio.dc.html" by the design converter. Markup and
// inline styles are kept 1:1 with the design; behaviour lives in the page components.
"use client";
import { Fragment } from "react";
import { S } from "../style";
import Btn from "../Btn";
import ImageSlot from "../ImageSlot";

export default function ServicesView({ v }: { v: any }) {
  return (
    <>
    <main data-screen-label="Services">
      <section style={S("padding:clamp(140px,20vh,200px) clamp(20px,4.5vw,64px) clamp(56px,6vw,88px);")}>
        <div style={S("max-width:1440px;margin:0 auto;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:32px;")}>
          <h1 style={S("margin:0;font-size:clamp(52px,10vw,176px);font-weight:800;letter-spacing:-0.068em;line-height:.9;")}>
            <div style={S("overflow:hidden;padding-bottom:.05em;")}>
              <div data-reveal="up">
                {"Services"}
              </div>
            </div>
            <div style={S("overflow:hidden;padding-bottom:.05em;")}>
              <div data-reveal="up" data-delay="90">
                {"and prices."}
              </div>
            </div>
          </h1>
          <div data-reveal="1" data-delay="200" style={S("display:flex;flex-direction:column;gap:16px;align-items:flex-start;")}>
            <p style={S("margin:0;max-width:380px;font-size:18px;line-height:1.55;color:#5E5249;")}>
              {"Web, AI and custom software for growing businesses. Pick a starting point and we will shape it around you."}
            </p>
            <div style={S("display:flex;padding:5px;border-radius:999px;background:#FAF7F1;box-shadow:inset 0 0 0 1px rgba(31,23,18,.12);")}>
              <button onClick={v.setBdt} style={S(`border:none;cursor:pointer;padding:12px 22px;border-radius:999px;font-size:15px;font-weight:600;background:${v.bdtBg};color:${v.bdtFg};`)}>
                {"BDT"}
              </button>
              <button onClick={v.setUsd} style={S(`border:none;cursor:pointer;padding:12px 22px;border-radius:999px;font-size:15px;font-weight:600;background:${v.usdBg};color:${v.usdFg};`)}>
                {"USD"}
              </button>
            </div>
          </div>
        </div>
      </section>
      <section style={S("padding:0 clamp(20px,4.5vw,64px);")}>
        <div style={S("max-width:1440px;margin:0 auto;display:flex;flex-direction:column;")}>
          {(v.services || []).map((s: any, s$i: number) => (
            <Fragment key={s$i}>
            <article data-reveal="1" style={S("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr));gap:clamp(24px,4vw,56px);padding:clamp(40px,5vw,72px) 0;border-top:1px solid rgba(31,23,18,.14);")}>
              <div style={S("display:flex;gap:20px;align-items:flex-start;")}>
                <div style={S("width:56px;height:56px;border-radius:14px;background:#B86CF9;display:flex;align-items:center;justify-content:center;font-family:'JetBrains Mono',monospace;flex:none;")}>
                  {s.n}
                </div>
                <div>
                  <h2 style={S("margin:0 0 12px;font-size:clamp(30px,3.4vw,52px);font-weight:800;letter-spacing:-0.058em;line-height:1;")}>
                    {s.title}
                  </h2>
                  <p style={S("margin:0;font-size:17px;line-height:1.55;color:#5E5249;max-width:420px;")}>
                    {s.line}
                  </p>
                </div>
              </div>
              <ul style={S("list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:12px;")}>
                {(s.features || []).map((f: any, f$i: number) => (
                  <Fragment key={f$i}>
                  <li style={S("display:flex;gap:14px;align-items:baseline;font-size:16px;line-height:1.5;")}>
                    <span style={S("width:7px;height:7px;border-radius:2px;background:#1F1712;flex:none;transform:translateY(-2px);")}></span>
                    {f}
                  </li>
                  </Fragment>
                ))}
              </ul>
              <div style={S("background:#FAF7F1;border:1px solid rgba(31,23,18,.1);border-radius:24px;padding:28px;display:flex;flex-direction:column;justify-content:space-between;gap:28px;")}>
                <div>
                  <div style={S("font-size:13px;margin-bottom:4px;color:#5E5249;")}>
                    {s.from}
                  </div>
                  <div style={S("font-size:clamp(28px,3vw,40px);font-weight:800;letter-spacing:-0.048em;")}>
                    {s.price}
                  </div>
                  <div style={S("font-size:14px;margin-top:6px;color:#5E5249;")}>
                    {s.extra}
                  </div>
                </div>
                <div>
                  <Btn label="Get a quote" variant="dark" href="/contact" onClick={v.go.contact} />
                </div>
              </div>
            </article>
            </Fragment>
          ))}
        </div>
      </section>
      <section style={S("padding:clamp(56px,6vw,88px) clamp(20px,4.5vw,64px);")}>
        <div style={S("max-width:1440px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr));gap:16px;")}>
          <div data-reveal="1" style={S("background:#B86CF9;border-radius:24px;padding:clamp(28px,4vw,48px);display:flex;flex-direction:column;justify-content:space-between;gap:32px;min-height:280px;")}>
            <div style={S("font-size:13px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;")}>
              {"International clients"}
            </div>
            <div style={S("font-size:clamp(34px,4.4vw,64px);font-weight:800;letter-spacing:-0.058em;line-height:.98;")}>
              {"USD 25 to 40 per hour"}
            </div>
            <div style={S("font-size:16px;")}>
              {"Hourly work for international clients"}
            </div>
          </div>
          <div data-reveal="1" data-delay="100" style={S("background:#FAF7F1;border:1px solid rgba(31,23,18,.1);border-radius:24px;padding:clamp(28px,4vw,48px);")}>
            <div style={S("font-size:13px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#5E5249;margin-bottom:24px;")}>
              {"Tech we use"}
            </div>
            <div style={S("display:flex;flex-wrap:wrap;gap:8px;")}>
              {(v.tech || []).map((t: any, t$i: number) => (
                <Fragment key={t$i}>
                <span style={S("padding:9px 16px;border-radius:999px;border:1px solid rgba(31,23,18,.25);font-size:15px;font-weight:500;")}>
                  {t}
                </span>
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section data-scale="1" style={S("padding:clamp(40px,6vw,80px) clamp(12px,2vw,24px) clamp(12px,2vw,24px);overflow:hidden;")}>
        <div style={S("background:#EAE3D6;border-radius:24px;padding:clamp(48px,8vw,120px) clamp(24px,5vw,72px);transform-origin:50% 100%;")}>
          <h2 style={S("margin:0 0 40px;font-size:clamp(48px,8.5vw,148px);font-weight:800;letter-spacing:-0.068em;line-height:.9;")}>
            {"Not sure which one you need?"}
          </h2>
          <Btn label="Ask us" variant="dark" href="/contact" onClick={v.go.contact} />
        </div>
      </section>
    </main>
    </>
  );
}
