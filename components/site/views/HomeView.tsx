/* eslint-disable */
// GENERATED from "foxmen new/Foxmen Studio.dc.html" by the design converter. Markup and
// inline styles are kept 1:1 with the design; behaviour lives in the page components.
"use client";
import { Fragment } from "react";
import { S } from "../style";
import Btn from "../Btn";
import ImageSlot from "../ImageSlot";

export default function HomeView({ v }: { v: any }) {
  return (
    <>
    <main data-screen-label="Home">
      {/* 01 Hero */}
      <section style={S("position:relative;padding:clamp(96px,12vh,124px) clamp(20px,4.5vw,64px) 0;")}>
        <div style={S("max-width:1440px;margin:0 auto;position:relative;")}>
          {v.clutchHref ? (
            <>
            <a data-reveal="1" href={v.clutchHref} target="_blank" rel="noopener" aria-label="Foxmen Studio is verified on Clutch" style={S("display:inline-flex;align-items:center;gap:10px;padding:8px 16px 8px 8px;border-radius:999px;background:#1F1712;color:#F3EEE4;font-size:14px;font-weight:600;margin-bottom:clamp(24px,4vh,40px);vertical-align:top;")}>
              <span style={S("width:22px;height:22px;border-radius:999px;background:#B86CF9;display:flex;align-items:center;justify-content:center;flex:none;")}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1F1712" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12l5 5L20 7"></path>
                </svg>
              </span>
              <span style={S("font-weight:800;font-size:15px;letter-spacing:-0.035em;")}>
                {"Clutch"}
                <span style={S("color:#EF4335;")}>
                  {"."}
                </span>
              </span>
              <span style={S("color:rgba(243,238,228,.72);")}>
                {"Verified agency"}
              </span>
            </a>
            </>
          ) : null}
          {v.noClutchHref ? (
            <>
            <span data-reveal="1" style={S("display:inline-flex;align-items:center;gap:10px;padding:8px 16px 8px 8px;border-radius:999px;background:#1F1712;color:#F3EEE4;font-size:14px;font-weight:600;margin-bottom:clamp(24px,4vh,40px);vertical-align:top;")}>
              <span style={S("width:22px;height:22px;border-radius:999px;background:#B86CF9;display:flex;align-items:center;justify-content:center;flex:none;")}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1F1712" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12l5 5L20 7"></path>
                </svg>
              </span>
              <span style={S("font-weight:800;font-size:15px;letter-spacing:-0.035em;")}>
                {"Clutch"}
                <span style={S("color:#EF4335;")}>
                  {"."}
                </span>
              </span>
              <span style={S("color:rgba(243,238,228,.72);")}>
                {"Verified agency"}
              </span>
            </span>
            </>
          ) : null}
          <h1 style={S("margin:0;font-size:clamp(52px,10.4vw,184px);font-weight:800;letter-spacing:-0.068em;line-height:.92;")}>
            <div style={S("overflow:hidden;padding-bottom:.04em;")}>
              <div data-reveal="up">
                {"We build"}
              </div>
            </div>
            <div style={S("overflow:hidden;padding-bottom:.04em;")}>
              <div data-reveal="up" data-delay="90">
                <span style={S("display:inline-grid;vertical-align:bottom;overflow:hidden;border-radius:.16em;")}>
                  {(v.heroWords || []).map((w: any, w$i: number) => (
                    <Fragment key={w$i}>
                    <span style={S(`grid-area:1/1;justify-self:start;background:#B86CF9;border-radius:.16em;padding:0 .14em .04em;white-space:nowrap;transform:${w.t};transition:transform .9s cubic-bezier(.76,0,.24,1);`)}>
                      {w.word}
                    </span>
                    </Fragment>
                  ))}
                </span>
              </div>
            </div>
            <div style={S("overflow:hidden;padding-bottom:.04em;")}>
              <div data-reveal="up" data-delay="180">
                {"that grow your business."}
              </div>
            </div>
          </h1>
          <div style={S("margin-top:clamp(32px,5vh,56px);display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:28px;")}>
            <p data-reveal="1" data-delay="300" style={S("margin:0;max-width:440px;font-size:clamp(17px,1.4vw,20px);line-height:1.5;color:#5E5249;text-wrap:pretty;")}>
              {"Fast websites, online stores, AI chatbots and custom software. Designed and coded by hand, with no templates."}
            </p>
            <div data-reveal="1" data-delay="400" style={S("display:flex;flex-wrap:wrap;gap:12px;")}>
              <Btn label="Start a project" variant="dark" href="/contact" onClick={v.go.contact} />
              <Btn label="See our work" variant="light" href="/work" onClick={v.go.work} />
            </div>
          </div>
        </div>
      </section>
      <section data-scale="1" style={S("padding:clamp(40px,6vh,64px) clamp(12px,2vw,24px) clamp(56px,8vw,96px);")}>
        <div style={S("position:relative;background:#1F1712;border-radius:24px;overflow:hidden;height:clamp(380px,62vh,640px);transform-origin:50% 0%;will-change:transform;")}>
          <pre data-wave="1" aria-hidden="true" style={S("position:absolute;inset:0;margin:0;padding:18px;font-family:'JetBrains Mono',monospace;font-size:clamp(9px,.9vw,13px);line-height:1.15;color:rgba(243,238,228,.28);overflow:hidden;white-space:pre;pointer-events:none;")}></pre>
          <div style={S("position:absolute;inset:0;background:radial-gradient(ellipse at 50% 60%,rgba(184,108,249,.28),rgba(31,23,18,0) 60%);pointer-events:none;")}></div>
          <div data-tilt="1" style={S("position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:24px;")}>
            <div style={S("position:relative;width:min(760px,100%);height:100%;")}>
              <div data-depth="18" style={S("position:absolute;left:0;top:14%;width:min(300px,78%);background:#F3EEE4;border-radius:24px;padding:18px;box-shadow:0 30px 60px rgba(0,0,0,.35);")}>
                <div style={S("display:flex;align-items:center;gap:10px;margin-bottom:12px;")}>
                  <img src="/assets/isaac.svg" alt="Isaac" style={S("width:30px;height:30px;border-radius:999px;display:block;flex:none;")} />
                  <span style={S("font-size:14px;font-weight:600;")}>
                    {"Store assistant"}
                  </span>
                  <span style={S("margin-left:auto;width:8px;height:8px;border-radius:999px;background:#3BA55C;")}></span>
                </div>
                <div style={S("background:#EAE3D6;border-radius:14px;padding:10px 12px;font-size:14px;line-height:1.4;")}>
                  {"Yes, the Rose Kurti is in stock in size M. Add it to your cart?"}
                </div>
              </div>
              <div data-depth="-26" style={S("position:absolute;right:0;top:6%;width:min(260px,70%);background:#B86CF9;border-radius:24px;padding:18px;box-shadow:0 30px 60px rgba(0,0,0,.35);")}>
                <div style={S("font-size:13px;font-weight:600;margin-bottom:22px;")}>
                  {"New order"}
                </div>
                <div style={S("font-size:30px;font-weight:700;letter-spacing:-0.04em;line-height:1;")}>
                  {"BDT 2,450"}
                </div>
                <div style={S("font-size:13px;margin-top:6px;")}>
                  {"Paid with bKash"}
                </div>
              </div>
              <div data-depth="34" style={S("position:absolute;right:8%;bottom:10%;width:min(320px,82%);background:#FAF7F1;border-radius:24px;padding:16px 18px;font-family:'JetBrains Mono',monospace;font-size:13px;line-height:1.7;box-shadow:0 30px 60px rgba(0,0,0,.35);")}>
                <div style={S("color:#5E5249;")}>
                  {"~/foxmen $ npm run build"}
                </div>
                <div>
                  {"Compiled successfully"}
                </div>
                <div style={S("display:flex;align-items:center;gap:8px;")}>
                  <span style={S("width:8px;height:8px;border-radius:2px;background:#B86CF9;")}></span>
                  {"Deployed to foxmen.studio"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* 02 Marquee */}
      <section style={S("padding:28px 0;border-top:1px solid rgba(31,23,18,.12);border-bottom:1px solid rgba(31,23,18,.12);overflow:hidden;")}>
        <div data-marquee="-1" style={S("display:flex;width:max-content;will-change:transform;")}>
          {(v.marquee || []).map((m: any, m$i: number) => (
            <Fragment key={m$i}>
            <div style={S("display:flex;align-items:center;gap:clamp(24px,3vw,48px);padding-right:clamp(24px,3vw,48px);font-size:clamp(44px,7vw,112px);font-weight:800;letter-spacing:-0.068em;line-height:1;white-space:nowrap;")}>
              {m}
              <span style={S("width:.32em;height:.32em;border-radius:6px;background:#B86CF9;transform:rotate(45deg);")}></span>
            </div>
            </Fragment>
          ))}
        </div>
      </section>
      {/* 03 Statement (sticky word reveal) */}
      <section data-words="1" style={S("position:relative;height:260vh;")}>
        <div style={S("position:sticky;top:0;height:100vh;display:flex;align-items:center;padding:0 clamp(20px,4.5vw,64px);")}>
          <div style={S("max-width:1280px;margin:0 auto;")}>
            <div style={S("display:flex;align-items:center;gap:10px;font-size:13px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#5E5249;margin-bottom:28px;")}>
              <span style={S("width:8px;height:8px;border-radius:2px;background:#B86CF9;")}></span>
              {"What we do"}
            </div>
            <p style={S("margin:0;font-size:clamp(30px,4.6vw,72px);font-weight:800;letter-spacing:-0.052em;line-height:1.06;")}>
              {(v.words || []).map((w: any, w$i: number) => (
                <Fragment key={w$i}>
                <span data-w="1" style={S("display:inline-block;margin-right:.24em;opacity:.14;transition:opacity .25s linear;")}>
                  {w}
                </span>
                </Fragment>
              ))}
            </p>
          </div>
        </div>
      </section>
      {/* 04 Services sticky stack */}
      <section style={S("padding:clamp(88px,10vw,140px) clamp(20px,4.5vw,64px) clamp(40px,6vw,80px);")}>
        <div style={S("max-width:1440px;margin:0 auto;")}>
          <div style={S("display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:24px;margin-bottom:clamp(40px,6vw,72px);")}>
            <div>
              <div data-reveal="1" style={S("display:inline-flex;align-items:center;gap:10px;padding:8px 16px 8px 8px;border-radius:999px;background:#FAF7F1;box-shadow:inset 0 0 0 1px rgba(31,23,18,.1);font-size:14px;font-weight:600;margin-bottom:24px;")}>
                <span style={S("width:26px;height:26px;border-radius:999px;background:#120C09;box-shadow:inset 0 0 0 1px rgba(184,108,249,.45);display:flex;align-items:center;justify-content:center;flex:none;")}>
                  <img src="/assets/logo.png" alt="" style={S("width:15px;height:15px;")} />
                </span>
                {"Web, AI and custom software studio"}
              </div>
              <h2 data-reveal="1" style={S("margin:0;font-size:clamp(44px,7.5vw,120px);font-weight:800;letter-spacing:-0.068em;line-height:.92;")}>
                {"Six ways"}
                <br />
                {"we can help."}
              </h2>
            </div>
            <div data-reveal="1" data-delay="120">
              <Btn label="All services" variant="light" href="/services" onClick={v.go.services} />
            </div>
          </div>
          <div style={S("display:flex;flex-direction:column;gap:24px;")}>
            {(v.services || []).map((s: any, s$i: number) => (
              <Fragment key={s$i}>
              <article style={S(`position:sticky;top:${s.top};background:${s.bg};border-radius:24px;border:1px solid rgba(31,23,18,.1);padding:clamp(24px,4vw,56px);min-height:min(72vh,560px);display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,380px),1fr));gap:clamp(24px,4vw,64px);box-shadow:0 -12px 40px rgba(31,23,18,.06);`)}>
                <div style={S("display:flex;flex-direction:column;justify-content:space-between;gap:32px;")}>
                  <div style={S("font-family:'JetBrains Mono',monospace;font-size:14px;font-weight:500;")}>
                    {s.n}{" / 06"}
                  </div>
                  <div>
                    <h3 style={S("margin:0 0 16px;font-size:clamp(34px,4.6vw,68px);font-weight:800;letter-spacing:-0.058em;line-height:.95;")}>
                      {s.title}
                    </h3>
                    <p style={S("margin:0;font-size:clamp(17px,1.4vw,20px);line-height:1.5;max-width:460px;text-wrap:pretty;")}>
                      {s.line}
                    </p>
                  </div>
                </div>
                <div style={S("display:flex;flex-direction:column;justify-content:space-between;gap:32px;")}>
                  <ul style={S("list-style:none;margin:0;padding:0;display:flex;flex-direction:column;")}>
                    {(s.features || []).map((f: any, f$i: number) => (
                      <Fragment key={f$i}>
                      <li style={S("display:flex;gap:14px;align-items:baseline;padding:14px 0;border-bottom:1px solid rgba(31,23,18,.14);font-size:16px;line-height:1.45;")}>
                        <span style={S("width:7px;height:7px;border-radius:2px;background:#1F1712;flex:none;transform:translateY(-2px);")}></span>
                        {f}
                      </li>
                      </Fragment>
                    ))}
                  </ul>
                  <div style={S("display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px;")}>
                    <div>
                      <div style={S("font-size:13px;font-weight:500;")}>
                        {s.from}
                      </div>
                      <div style={S("font-size:clamp(24px,2.4vw,32px);font-weight:800;letter-spacing:-0.048em;")}>
                        {s.price}
                      </div>
                    </div>
                    <Btn label="Get started" variant="dark" href="/contact" onClick={v.go.contact} />
                  </div>
                </div>
              </article>
              </Fragment>
            ))}
          </div>
        </div>
      </section>
      {/* 05 Industries */}
      <section style={S("padding:clamp(88px,10vw,140px) clamp(20px,4.5vw,64px);")}>
        <div style={S("max-width:1440px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr));gap:48px;")}>
          <div>
            <div style={S("position:sticky;top:120px;")}>
              <div data-reveal="1" style={S("display:flex;align-items:center;gap:10px;font-size:13px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#5E5249;margin-bottom:24px;")}>
                <span style={S("width:8px;height:8px;border-radius:2px;background:#B86CF9;")}></span>
                {"Who we build for"}
              </div>
              <h2 data-reveal="1" style={S("margin:0 0 20px;font-size:clamp(40px,5.5vw,84px);font-weight:800;letter-spacing:-0.062em;line-height:.95;")}>
                {"Businesses that want more customers."}
              </h2>
              <p data-reveal="1" style={S("margin:0;max-width:420px;font-size:18px;line-height:1.55;color:#5E5249;")}>
                {"From a neighborhood clinic to a fashion label selling across the country."}
              </p>
            </div>
          </div>
          <div style={S("border-top:1px solid rgba(31,23,18,.14);")}>
            {(v.industries || []).map((ind: any, ind$i: number) => (
              <Fragment key={ind$i}>
              <div data-reveal="1" style={S("display:flex;justify-content:space-between;align-items:center;padding:clamp(16px,2vw,24px) 20px;border-bottom:1px solid rgba(31,23,18,.14);border-radius:14px;font-size:clamp(28px,3.6vw,52px);font-weight:600;letter-spacing:-0.045em;transition:background .35s ease, padding .35s ease;cursor:default;")} className="hv3">
                <span>
                  {ind.name}
                </span>
                <span style={S("font-family:'JetBrains Mono',monospace;font-size:14px;font-weight:500;letter-spacing:0;")}>
                  {ind.n}
                </span>
              </div>
              </Fragment>
            ))}
          </div>
        </div>
      </section>
      {/* 06 Selected work: scroll-stacked deck */}
      <section data-deck="1" style={S(`position:relative;height:${v.deckH};`)}>
        <div style={S("position:sticky;top:0;height:100vh;overflow:hidden;padding:clamp(84px,11vh,110px) clamp(20px,4.5vw,64px) clamp(20px,3vh,36px);")}>
          <div style={S(`max-width:1440px;height:100%;margin:0 auto;display:grid;grid-template-columns:${v.deckCols};gap:clamp(24px,4vw,64px);`)} className="fx-deck-grid">
            <div style={S(`display:${v.deckSide};flex-direction:column;justify-content:space-between;gap:24px;min-height:0;`)} className="fx-deck-side">
              <div>
                <div style={S("display:flex;align-items:center;gap:10px;font-size:13px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#5E5249;margin-bottom:18px;")}>
                  <span style={S("width:8px;height:8px;border-radius:2px;background:#B86CF9;")}></span>
                  {"Selected work"}
                </div>
                <div style={S("display:flex;align-items:flex-end;gap:10px;line-height:.8;")}>
                  <div style={S("height:clamp(96px,11vw,170px);overflow:hidden;")} className="fx-deck-num">
                    <div data-deckcount="1" style={S("display:flex;flex-direction:column;transition:transform .8s cubic-bezier(.76,0,.24,1);")}>
                      {(v.featured || []).map((p: any, p$i: number) => (
                        <Fragment key={p$i}>
                        <span style={S("display:block;height:clamp(96px,11vw,170px);font-size:clamp(96px,11vw,170px);font-weight:800;letter-spacing:-0.075em;line-height:1;")}>
                          {p.num}
                        </span>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  <span style={S("font-family:'JetBrains Mono',monospace;font-size:14px;padding-bottom:14px;")}>
                    {"/ "}{v.featCount}
                  </span>
                </div>
              </div>
              <div style={S("display:flex;flex-direction:column;border-top:1px solid rgba(31,23,18,.14);")}>
                {(v.featured || []).map((p: any, p$i: number) => (
                  <Fragment key={p$i}>
                  <a href="/work" onClick={p.open} data-deckname="1" style={S("display:flex;justify-content:space-between;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid rgba(31,23,18,.14);opacity:.35;transition:opacity .4s ease, padding .5s cubic-bezier(.2,.7,.2,1);")}>
                    <span style={S("font-size:clamp(20px,1.8vw,26px);font-weight:800;letter-spacing:-0.042em;")}>
                      {p.name}
                    </span>
                    <span style={S("font-size:13px;color:#5E5249;text-align:right;")}>
                      {p.tagLine}
                    </span>
                  </a>
                  </Fragment>
                ))}
              </div>
              <div style={S("display:flex;align-items:center;gap:16px;flex-wrap:wrap;")}>
                <Btn label={`All ${v.projCount} projects`} variant="dark" href="/work" onClick={v.go.work} />
                <div style={S("width:120px;height:4px;border-radius:999px;background:rgba(31,23,18,.12);overflow:hidden;")}>
                  <div data-deckbar="1" style={S("height:100%;width:100%;background:#B86CF9;transform-origin:0 50%;transform:scaleX(0);")}></div>
                </div>
              </div>
            </div>
            <div style={S("position:relative;min-height:0;perspective:1600px;")} className="fx-deck-stage">
              {(v.featured || []).map((p: any, p$i: number) => (
                <Fragment key={p$i}>
                <a href="/work" onClick={p.open} data-deckcard="1" style={S(`position:absolute;inset:0;border-radius:24px;overflow:hidden;display:flex;flex-direction:column;background:${p.tint};box-shadow:0 30px 70px rgba(31,23,18,.18);transform-origin:50% 0%;will-change:transform;transform:translateY(115%) rotate(4deg);`)}>
                  <div style={S("position:absolute;inset:0;background:repeating-linear-gradient(135deg,rgba(31,23,18,.06) 0 1px,transparent 1px 16px);pointer-events:none;")}></div>
                  <div style={S("position:relative;display:flex;justify-content:space-between;align-items:flex-start;gap:12px;padding:clamp(16px,2vw,24px);")}>
                    <div style={S("display:flex;flex-wrap:wrap;gap:6px;")}>
                      {(p.tags || []).map((tg: any, tg$i: number) => (
                        <Fragment key={tg$i}>
                        <span style={S("font-size:13px;font-weight:600;padding:8px 14px;border-radius:999px;background:#F3EEE4;")}>
                          {tg}
                        </span>
                        </Fragment>
                      ))}
                      {p.latest ? (
                        <>
                        <span style={S("font-size:13px;font-weight:600;padding:8px 14px;border-radius:999px;background:#1F1712;color:#F3EEE4;")}>
                          {"Latest project"}
                        </span>
                        </>
                      ) : null}
                    </div>
                    <span style={S("width:52px;height:52px;border-radius:999px;background:#1F1712;color:#F3EEE4;display:flex;align-items:center;justify-content:center;flex:none;")}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 17L17 7M9 7h8v8"></path>
                      </svg>
                    </span>
                  </div>
                  <div style={S("position:relative;flex:1;display:flex;align-items:center;justify-content:center;padding:0 clamp(16px,3vw,40px);min-height:0;container-type:size;")}>
                    <div style={S("width:min(78%,640px,calc((100cqh - 48px) * 1.6));border-radius:14px;background:#FAF7F1;box-shadow:0 20px 50px rgba(31,23,18,.16);overflow:hidden;display:flex;flex-direction:column;")}>
                      <div style={S("display:flex;align-items:center;gap:6px;padding:10px 12px;border-bottom:1px solid rgba(31,23,18,.08);")}>
                        <span style={S("width:8px;height:8px;border-radius:999px;background:#1F1712;opacity:.25;")}></span>
                        <span style={S("width:8px;height:8px;border-radius:999px;background:#1F1712;opacity:.25;")}></span>
                        <span style={S("width:8px;height:8px;border-radius:999px;background:#1F1712;opacity:.25;")}></span>
                        <span style={S("margin-left:10px;font-family:'JetBrains Mono',monospace;font-size:11px;padding:4px 10px;border-radius:999px;background:#F3EEE4;")} className="fx-deck-url">
                          {p.urlShow}
                        </span>
                      </div>
                      <div style={S("flex:none;aspect-ratio:16/10;position:relative;display:flex;align-items:center;justify-content:center;background:repeating-linear-gradient(135deg,rgba(31,23,18,.05) 0 1px,transparent 1px 10px);font-family:'JetBrains Mono',monospace;font-size:12px;color:#5E5249;")}>
                        {p.shotText}
                        {p.heroImage ? (
                          <>
                          <img src={p.heroImage} alt={p.name} loading="lazy" decoding="async" style={S("position:absolute;inset:0;width:100%;height:100%;object-fit:cover;")} />
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div style={S("position:relative;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:12px;padding:clamp(16px,2vw,24px);")}>
                    <div style={S("font-size:clamp(40px,6vw,96px);font-weight:800;letter-spacing:-0.068em;line-height:.85;")}>
                      {p.name}
                    </div>
                    <div style={S("font-size:15px;font-weight:500;max-width:280px;text-align:right;")}>
                      {p.type}
                    </div>
                  </div>
                </a>
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* 07 3D AI workforce: scroll-driven camera */}
      <section data-wf="1" style={S("position:relative;height:760vh;")}>
        <div style={S("position:sticky;top:0;height:100vh;padding:clamp(8px,1.2vw,14px);")}>
          <div style={S("position:relative;height:100%;border-radius:24px;overflow:hidden;background:#EAE3D6;")}>
            <div data-wfcanvas="1" style={S("position:absolute;inset:0;")}></div>
            <div style={S("position:absolute;left:clamp(16px,3vw,40px);top:clamp(84px,12vh,120px);max-width:min(560px,70%);pointer-events:none;")}>
              <div style={S("display:inline-flex;align-items:center;gap:10px;padding:8px 14px;border-radius:999px;background:#FAF7F1;font-size:13px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;margin-bottom:18px;")}>
                <span style={S("width:8px;height:8px;border-radius:2px;background:#B86CF9;")}></span>
                {"AI agents"}
              </div>
              <h2 data-wfhead="1" style={S("margin:0;font-size:clamp(34px,5vw,80px);font-weight:800;letter-spacing:-0.062em;line-height:.94;color:#1F1712;transition:color .5s ease;")}>
                {"A team that works 24/7."}
              </h2>
            </div>
            <div style={S("position:absolute;right:clamp(16px,3vw,40px);top:clamp(84px,12vh,120px);display:flex;align-items:center;gap:12px;padding:8px 8px 8px 18px;border-radius:999px;background:#1F1712;color:#F3EEE4;pointer-events:none;")}>
              <span data-clocklabel="1" style={S("font-size:13px;font-weight:600;white-space:nowrap;")}>
                {"Day shift"}
              </span>
              <span data-clock="1" style={S("font-family:'JetBrains Mono',monospace;font-size:15px;font-weight:500;padding:8px 12px;border-radius:999px;background:#B86CF9;color:#1F1712;")}>
                {"09:00"}
              </span>
            </div>
            <div data-wfcards="1" style={S(`position:absolute;right:clamp(12px,3vw,40px);left:${v.wfCardsLeft};bottom:clamp(12px,3vh,40px);width:${v.wfCardsW};display:flex;flex-direction:column;gap:8px;`)}>
              {(v.agents || []).map((ag: any, ag$i: number) => (
                <Fragment key={ag$i}>
                <div data-step="1" style={S("display:flex;gap:14px;align-items:center;padding:8px 14px 8px 8px;border-radius:14px;background:rgba(250,247,241,.9);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);box-shadow:inset 0 0 0 1px rgba(31,23,18,.08);opacity:.55;transition:opacity .4s ease, background .4s ease, transform .5s cubic-bezier(.2,.7,.2,1);")}>
                  <div data-iconbox="1" style={S("width:72px;height:56px;flex:none;border-radius:10px;background:#1F1712;color:#B86CF9;display:flex;align-items:center;justify-content:center;overflow:hidden;transition:background .4s ease, color .4s ease;")}>
                    <pre data-icon={ag.k} style={S("margin:0;font-family:'JetBrains Mono',monospace;font-size:10px;font-variant-ligatures:none;font-feature-settings:'liga' 0,'calt' 0;line-height:1.12;letter-spacing:0;")}></pre>
                  </div>
                  <div style={S("min-width:0;")}>
                    <div style={S("display:flex;align-items:baseline;gap:10px;")}>
                      <span style={S("font-family:'JetBrains Mono',monospace;font-size:12px;")}>
                        {ag.n}
                      </span>
                      <span style={S("font-size:16px;font-weight:700;letter-spacing:-0.02em;")}>
                        {ag.t}
                      </span>
                    </div>
                    <div data-desc="1" style={S("display:grid;grid-template-rows:0fr;transition:grid-template-rows .5s cubic-bezier(.2,.7,.2,1);")}>
                      <div style={S("overflow:hidden;")}>
                        <div style={S("font-size:14px;line-height:1.45;color:#5E5249;padding-top:4px;")}>
                          {ag.d}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                </Fragment>
              ))}
            </div>
            <div style={S(`position:absolute;left:clamp(16px,3vw,40px);bottom:clamp(16px,3.4vh,44px);display:${v.wfBarDisplay};align-items:center;gap:12px;pointer-events:none;`)}>
              <div style={S("width:160px;height:4px;border-radius:999px;background:rgba(31,23,18,.15);overflow:hidden;")}>
                <div data-wfbar="1" style={S("height:100%;width:100%;background:#B86CF9;transform-origin:0 50%;transform:scaleX(0);")}></div>
              </div>
              <span style={S("font-family:'JetBrains Mono',monospace;font-size:12px;padding:6px 10px;border-radius:999px;background:#FAF7F1;")}>
                {"Scroll to follow the agents"}
              </span>
            </div>
          </div>
        </div>
      </section>
      {/* 08 Chatbot demo */}
      <section style={S("padding:clamp(88px,10vw,140px) clamp(20px,4.5vw,64px);")}>
        <div style={S("max-width:1440px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr));gap:clamp(32px,5vw,80px);align-items:center;")}>
          <div>
            <h2 data-reveal="1" style={S("margin:0 0 20px;font-size:clamp(40px,5.5vw,84px);font-weight:800;letter-spacing:-0.062em;line-height:.95;")}>
              {"Answers in Bangla and English. Day and night."}
            </h2>
            <p data-reveal="1" style={S("margin:0 0 32px;max-width:480px;font-size:18px;line-height:1.55;color:#5E5249;")}>
              {"Trained on your own business information. It recommends products, captures leads and hands over to a human when needed."}
            </p>
            <div data-reveal="1" style={S("display:flex;flex-wrap:wrap;gap:24px;align-items:center;")}>
              <Btn label="Add a chatbot" variant="purple" href="/contact" onClick={v.go.contact} />
              <div style={S("font-size:15px;color:#5E5249;")}>
                {"Setup from "}
                <b style={S("color:#1F1712;")}>
                  {v.botPrice}
                </b>
              </div>
            </div>
          </div>
          <div data-chat="1" data-reveal="1" style={S("background:#FAF7F1;border-radius:24px;border:1px solid rgba(31,23,18,.1);overflow:hidden;")}>
            <div style={S("display:flex;align-items:center;gap:12px;padding:18px 22px;border-bottom:1px solid rgba(31,23,18,.1);")}>
              <img src="/assets/isaac.svg" alt="Isaac" style={S("width:40px;height:40px;border-radius:999px;display:block;flex:none;")} />
              <div>
                <div style={S("font-weight:600;font-size:15px;")}>
                  {"Store assistant"}
                </div>
                <div style={S("font-size:13px;color:#5E5249;display:flex;align-items:center;gap:6px;")}>
                  <span style={S("width:7px;height:7px;border-radius:999px;background:#3BA55C;")}></span>
                  {"Online now"}
                </div>
              </div>
            </div>
            <div style={S("padding:22px;display:flex;flex-direction:column;gap:12px;min-height:420px;")}>
              {(v.chatShown || []).map((c: any, c$i: number) => (
                <Fragment key={c$i}>
                <div style={S(`display:flex;justify-content:${c.align};`)}>
                  <div style={S(`max-width:80%;padding:12px 16px;border-radius:14px;font-size:15px;line-height:1.45;background:${c.bg};color:${c.fg};`)}>
                    {c.t}
                  </div>
                </div>
                </Fragment>
              ))}
              {v.chatTyping ? (
                <>
                <div style={S("display:flex;gap:5px;padding:14px 16px;border-radius:14px;background:#EAE3D6;width:max-content;")}>
                  <span style={S("width:7px;height:7px;border-radius:999px;background:#1F1712;animation:fxblink 1s infinite;")}></span>
                  <span style={S("width:7px;height:7px;border-radius:999px;background:#1F1712;animation:fxblink 1s .2s infinite;")}></span>
                  <span style={S("width:7px;height:7px;border-radius:999px;background:#1F1712;animation:fxblink 1s .4s infinite;")}></span>
                </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </section>
      {/* 09 Process */}
      <section style={S("padding:clamp(88px,10vw,140px) clamp(20px,4.5vw,64px);border-top:1px solid rgba(31,23,18,.12);")}>
        <div style={S("max-width:1440px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr));gap:48px;")}>
          <div>
            <div style={S("position:sticky;top:120px;")}>
              <div style={S("display:flex;align-items:center;gap:10px;font-size:13px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#5E5249;margin-bottom:24px;")}>
                <span style={S("width:8px;height:8px;border-radius:2px;background:#B86CF9;")}></span>
                {"How we work"}
              </div>
              <h2 data-reveal="1" style={S("margin:0;font-size:clamp(40px,5.5vw,84px);font-weight:800;letter-spacing:-0.062em;line-height:.95;")}>
                {"Four clear steps. No surprises."}
              </h2>
            </div>
          </div>
          <div style={S("display:flex;flex-direction:column;gap:16px;")}>
            {(v.process || []).map((st: any, st$i: number) => (
              <Fragment key={st$i}>
              <div data-reveal="1" style={S("background:#FAF7F1;border:1px solid rgba(31,23,18,.1);border-radius:24px;padding:clamp(24px,3vw,40px);display:flex;gap:24px;align-items:flex-start;")}>
                <div style={S("width:112px;height:84px;padding-top:12px;border-radius:14px;background:#B86CF9;color:#1F1712;display:flex;align-items:center;justify-content:center;flex:none;overflow:hidden;position:relative;")}>
                  <pre data-icon={st.k} style={S("margin:0;font-family:'JetBrains Mono',monospace;font-size:11px;font-variant-ligatures:none;font-feature-settings:")}></pre>
                  <span style={S("position:absolute;top:6px;left:8px;font-family:'JetBrains Mono',monospace;font-size:9px;opacity:.7;")}>
                    {st.n}
                  </span>
                </div>
                <div>
                  <div style={S("font-size:clamp(24px,2.4vw,34px);font-weight:800;letter-spacing:-0.048em;margin-bottom:8px;")}>
                    {st.t}
                  </div>
                  <div style={S("font-size:17px;line-height:1.55;color:#5E5249;")}>
                    {st.d}
                  </div>
                </div>
              </div>
              </Fragment>
            ))}
          </div>
        </div>
      </section>
      {/* 10 ASCII */}
      <section style={S("padding:clamp(40px,6vw,80px) clamp(20px,4.5vw,64px);")}>
        <div style={S("max-width:1440px;margin:0 auto;background:#FAF7F1;border:1px solid rgba(31,23,18,.1);border-radius:24px;overflow:hidden;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr));")}>
          <div style={S("padding:clamp(28px,4vw,64px);display:flex;flex-direction:column;justify-content:space-between;gap:40px;")}>
            <div style={S("font-family:'JetBrains Mono',monospace;font-size:13px;")}>
              {"~/foxmen $ npm run build"}
            </div>
            <div>
              <h2 data-reveal="1" style={S("margin:0 0 20px;font-size:clamp(38px,5vw,76px);font-weight:800;letter-spacing:-0.058em;line-height:.95;")}>
                {"Written in code. Not dragged from a template."}
              </h2>
              <p data-reveal="1" style={S("margin:0;max-width:460px;font-size:18px;line-height:1.55;color:#5E5249;")}>
                {"Custom design, no WordPress. Your site loads fast, ranks well in search and is fully yours."}
              </p>
            </div>
          </div>
          <div style={S("background:#EAE3D6;display:flex;align-items:center;justify-content:center;padding:24px;min-height:360px;overflow:hidden;")}>
            <pre data-ascii="1" style={S("margin:0;font-family:'JetBrains Mono',monospace;font-size:clamp(7px,1vw,13px);line-height:1.05;color:#1F1712;letter-spacing:.05em;")}></pre>
          </div>
        </div>
      </section>
      {/* 11 Tech stack */}
      <section style={S("padding:clamp(88px,10vw,140px) 0;")}>
        <div style={S("max-width:1440px;margin:0 auto clamp(40px,5vw,64px);padding:0 clamp(20px,4.5vw,64px);display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:24px;")}>
          <div>
            <div style={S("display:flex;align-items:center;gap:10px;font-size:13px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#5E5249;margin-bottom:20px;")}>
              <span style={S("width:8px;height:8px;border-radius:2px;background:#B86CF9;")}></span>
              {"Tech we use"}
            </div>
            <h2 data-reveal="1" style={S("margin:0;font-size:clamp(44px,7.5vw,120px);font-weight:800;letter-spacing:-0.068em;line-height:.92;")}>
              {"Modern tools."}
              <br />
              {"Proven results."}
            </h2>
          </div>
          <p data-reveal="1" style={S("margin:0;max-width:380px;font-size:18px;line-height:1.55;color:#5E5249;")}>
            {"The same stack used by fast-growing product teams, picked for speed, security and easy growth."}
          </p>
        </div>
        <div style={S("display:flex;flex-direction:column;gap:8px;")}>
          <div style={S("overflow:hidden;padding:6px 0;")}>
            <div data-marquee="-1" style={S("display:flex;width:max-content;will-change:transform;")}>
              {(v.techRowA || []).map((t: any, t$i: number) => (
                <Fragment key={t$i}>
                <div style={S("padding-right:14px;")}>
                  <div style={S("display:flex;align-items:center;gap:16px;padding:12px 28px 12px 12px;border-radius:999px;background:#FAF7F1;box-shadow:inset 0 0 0 1px rgba(31,23,18,.1);transition:background .3s ease;")} className="hv4">
                    <span style={S("width:60px;height:60px;border-radius:999px;background:#F3EEE4;display:flex;align-items:center;justify-content:center;flex:none;")}>
                      <span aria-hidden="true" style={S(`width:28px;height:28px;display:block;background:center / contain no-repeat url(${t.icon});`)}></span>
                    </span>
                    <span style={S("display:flex;flex-direction:column;gap:2px;")}>
                      <span style={S("font-size:clamp(20px,2vw,28px);font-weight:800;letter-spacing:-0.042em;white-space:nowrap;")}>
                        {t.name}
                      </span>
                      <span style={S("font-size:13px;color:#5E5249;white-space:nowrap;")}>
                        {t.use}
                      </span>
                    </span>
                  </div>
                </div>
                </Fragment>
              ))}
            </div>
          </div>
          <div style={S("overflow:hidden;padding:6px 0;")}>
            <div data-marquee="1" style={S("display:flex;width:max-content;will-change:transform;")}>
              {(v.techRowB || []).map((t: any, t$i: number) => (
                <Fragment key={t$i}>
                <div style={S("padding-right:14px;")}>
                  <div style={S("display:flex;align-items:center;gap:16px;padding:12px 28px 12px 12px;border-radius:999px;background:#FAF7F1;box-shadow:inset 0 0 0 1px rgba(31,23,18,.1);transition:background .3s ease;")} className="hv4">
                    <span style={S("width:60px;height:60px;border-radius:999px;background:#F3EEE4;display:flex;align-items:center;justify-content:center;flex:none;")}>
                      <span aria-hidden="true" style={S(`width:28px;height:28px;display:block;background:center / contain no-repeat url(${t.icon});`)}></span>
                    </span>
                    <span style={S("display:flex;flex-direction:column;gap:2px;")}>
                      <span style={S("font-size:clamp(20px,2vw,28px);font-weight:800;letter-spacing:-0.042em;white-space:nowrap;")}>
                        {t.name}
                      </span>
                      <span style={S("font-size:13px;color:#5E5249;white-space:nowrap;")}>
                        {t.use}
                      </span>
                    </span>
                  </div>
                </div>
                </Fragment>
              ))}
            </div>
          </div>
        </div>
        <div style={S(`max-width:1440px;margin:clamp(40px,5vw,64px) auto 0;padding:0 clamp(20px,4.5vw,64px);display:grid;grid-template-columns:${v.techCols};gap:12px;`)}>
          {(v.techGroups || []).map((g: any, g$i: number) => (
            <Fragment key={g$i}>
            <div data-reveal="1" style={S("background:#FAF7F1;border:1px solid rgba(31,23,18,.1);border-radius:24px;padding:24px;display:flex;flex-direction:column;justify-content:space-between;gap:28px;min-height:200px;transition:background .35s ease, transform .35s ease;")} className="hv5">
              <div style={S("display:flex;justify-content:space-between;align-items:center;gap:12px;")}>
                <span style={S("font-family:'JetBrains Mono',monospace;font-size:13px;")}>
                  {g.n}
                </span>
                <div style={S("display:flex;")}>
                  {(g.items || []).map((it: any, it$i: number) => (
                    <Fragment key={it$i}>
                    <span style={S("width:40px;height:40px;margin-left:-8px;border-radius:999px;background:#F3EEE4;box-shadow:0 0 0 3px #FAF7F1;display:flex;align-items:center;justify-content:center;")}>
                      <span aria-hidden="true" style={S(`width:20px;height:20px;display:block;background:center / contain no-repeat url(${it.icon});`)}></span>
                    </span>
                    </Fragment>
                  ))}
                </div>
              </div>
              <div>
                <div style={S("font-size:clamp(22px,2vw,28px);font-weight:800;letter-spacing:-0.048em;margin-bottom:6px;")}>
                  {g.t}
                </div>
                <div style={S("font-size:15px;line-height:1.5;opacity:.75;")}>
                  {g.list}
                </div>
              </div>
            </div>
            </Fragment>
          ))}
        </div>
      </section>
      {/* 12 Pricing */}
      <section style={S("padding:clamp(40px,6vw,80px) clamp(20px,4.5vw,64px) clamp(88px,10vw,140px);")}>
        <div style={S("max-width:1440px;margin:0 auto;")}>
          <div style={S("display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:24px;margin-bottom:40px;")}>
            <h2 data-reveal="1" style={S("margin:0;font-size:clamp(44px,7.5vw,120px);font-weight:800;letter-spacing:-0.068em;line-height:.92;")}>
              {"Clear prices."}
            </h2>
            <div style={S("display:flex;padding:5px;border-radius:999px;background:#FAF7F1;box-shadow:inset 0 0 0 1px rgba(31,23,18,.12);")}>
              <button onClick={v.setBdt} style={S(`border:none;cursor:pointer;padding:12px 22px;border-radius:999px;font-size:15px;font-weight:600;background:${v.bdtBg};color:${v.bdtFg};`)}>
                {"BDT"}
              </button>
              <button onClick={v.setUsd} style={S(`border:none;cursor:pointer;padding:12px 22px;border-radius:999px;font-size:15px;font-weight:600;background:${v.usdBg};color:${v.usdFg};`)}>
                {"USD"}
              </button>
            </div>
          </div>
          <div style={S("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:16px;")}>
            {(v.services || []).map((s: any, s$i: number) => (
              <Fragment key={s$i}>
              <div data-reveal="1" style={S("background:#FAF7F1;border:1px solid rgba(31,23,18,.1);border-radius:24px;padding:28px;display:flex;flex-direction:column;justify-content:space-between;gap:40px;min-height:220px;transition:background .35s;")} className="hv4">
                <div style={S("display:flex;justify-content:space-between;gap:12px;")}>
                  <div style={S("font-size:20px;font-weight:600;letter-spacing:-0.02em;")}>
                    {s.title}
                  </div>
                  <span style={S("font-family:'JetBrains Mono',monospace;font-size:13px;")}>
                    {s.n}
                  </span>
                </div>
                <div>
                  <div style={S("font-size:13px;margin-bottom:4px;")}>
                    {s.from}
                  </div>
                  <div style={S("font-size:clamp(28px,3vw,40px);font-weight:800;letter-spacing:-0.048em;")}>
                    {s.price}
                  </div>
                  <div style={S("font-size:14px;margin-top:6px;")}>
                    {s.extra}
                  </div>
                </div>
              </div>
              </Fragment>
            ))}
          </div>
          <p style={S("margin:24px 0 0;font-size:16px;color:#5E5249;")}>
            {"Hourly work for international clients: USD 25 to 40 per hour"}
          </p>
        </div>
      </section>
      {/* 13 Why us */}
      <section style={S("padding:clamp(88px,10vw,140px) clamp(20px,4.5vw,64px);background:#EAE3D6;")}>
        <div style={S("max-width:1440px;margin:0 auto;")}>
          <h2 data-reveal="1" style={S("margin:0 0 clamp(40px,5vw,64px);font-size:clamp(44px,7.5vw,120px);font-weight:800;letter-spacing:-0.068em;line-height:.92;")}>
            {"Why Foxmen."}
          </h2>
          <div style={S("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:16px;")}>
            {(v.principles || []).map((pr: any, pr$i: number) => (
              <Fragment key={pr$i}>
              <div data-reveal="1" style={S("background:#F3EEE4;border-radius:24px;padding:32px;min-height:300px;display:flex;flex-direction:column;justify-content:space-between;gap:32px;")}>
                <div style={S("width:112px;height:84px;padding-top:12px;border-radius:14px;background:#1F1712;color:#B86CF9;display:flex;align-items:center;justify-content:center;flex:none;overflow:hidden;position:relative;")}>
                  <pre data-icon={pr.k} style={S("margin:0;font-family:'JetBrains Mono',monospace;font-size:11px;font-variant-ligatures:none;font-feature-settings:")}></pre>
                  <span style={S("position:absolute;top:6px;left:8px;font-family:'JetBrains Mono',monospace;font-size:9px;opacity:.7;")}>
                    {pr.n}
                  </span>
                </div>
                <div>
                  <div style={S("font-size:clamp(24px,2.2vw,32px);font-weight:800;letter-spacing:-0.048em;margin-bottom:10px;")}>
                    {pr.t}
                  </div>
                  <div style={S("font-size:16px;line-height:1.55;color:#5E5249;")}>
                    {pr.d}
                  </div>
                </div>
              </div>
              </Fragment>
            ))}
          </div>
        </div>
      </section>
      {/* 14 AI tools teaser */}
      <section style={S("padding:clamp(88px,10vw,140px) clamp(20px,4.5vw,64px);")}>
        <div style={S("max-width:1440px;margin:0 auto;background:#B86CF9;border-radius:24px;padding:clamp(28px,5vw,72px);display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr));gap:48px;overflow:hidden;position:relative;")}>
          <div style={S("display:flex;flex-direction:column;justify-content:space-between;gap:32px;position:relative;")}>
            <div style={S("font-size:13px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;")}>
              {"Free AI tools"}
            </div>
            <h2 data-reveal="1" style={S("margin:0;font-size:clamp(40px,5.5vw,88px);font-weight:800;letter-spacing:-0.062em;line-height:.94;")}>
              {"Try our AI tools for your business. Free."}
            </h2>
            <div>
              <Btn label="Open the tools" variant="dark" href="/tools" onClick={v.go.tools} />
            </div>
          </div>
          <div style={S("display:flex;flex-direction:column;position:relative;")}>
            {(v.toolTeaser || []).map((t: any, t$i: number) => (
              <Fragment key={t$i}>
              <a href="/tools" onClick={t.open} style={S("display:flex;justify-content:space-between;align-items:center;gap:16px;padding:18px 0;border-bottom:1px solid rgba(31,23,18,.25);font-size:clamp(20px,2vw,28px);font-weight:600;letter-spacing:-0.03em;transition:padding .3s;")} className="hv2">
                <span>
                  {t.name}
                </span>
                <span style={S("font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:500;letter-spacing:0;")}>
                  {t.cat}
                </span>
              </a>
              </Fragment>
            ))}
          </div>
        </div>
      </section>
      {/* 15 FAQ */}
      <section style={S("padding:clamp(40px,6vw,80px) clamp(20px,4.5vw,64px) clamp(88px,10vw,140px);")}>
        <div style={S("max-width:1100px;margin:0 auto;")}>
          <h2 data-reveal="1" style={S("margin:0 0 40px;font-size:clamp(44px,7.5vw,120px);font-weight:800;letter-spacing:-0.068em;line-height:.92;")}>
            {"Questions."}
          </h2>
          <div style={S("display:flex;flex-direction:column;gap:12px;")}>
            {(v.faqs || []).map((q: any, q$i: number) => (
              <Fragment key={q$i}>
              <div data-reveal="1" style={S("background:#FAF7F1;border:1px solid rgba(31,23,18,.1);border-radius:24px;overflow:hidden;")}>
                <button onClick={q.toggle} style={S("width:100%;border:none;background:transparent;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:20px;padding:24px 28px;text-align:left;color:#1F1712;font-size:clamp(18px,1.8vw,24px);font-weight:600;letter-spacing:-0.02em;")}>
                  <span>
                    {q.q}
                  </span>
                  <span style={S(`width:40px;height:40px;border-radius:999px;background:${q.iconBg};flex:none;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:400;transition:transform .4s cubic-bezier(.2,.7,.2,1), background .3s;transform:${q.iconT};`)}>
                    {"+"}
                  </span>
                </button>
                <div style={S(`display:grid;grid-template-rows:${q.rows};transition:grid-template-rows .5s cubic-bezier(.2,.7,.2,1);`)}>
                  <div style={S("overflow:hidden;")}>
                    <p style={S("margin:0;padding:0 28px 26px;font-size:17px;line-height:1.6;color:#5E5249;max-width:780px;")}>
                      {q.a}
                    </p>
                  </div>
                </div>
              </div>
              </Fragment>
            ))}
          </div>
        </div>
      </section>
      {/* 16 Big CTA */}
      <section data-scale="1" style={S("padding:clamp(40px,6vw,80px) clamp(12px,2vw,24px) clamp(12px,2vw,24px);overflow:hidden;")}>
        <div style={S("background:#B86CF9;border-radius:24px;padding:clamp(48px,9vw,140px) clamp(24px,5vw,72px);transform-origin:50% 100%;will-change:transform;")}>
          <h2 style={S("margin:0 0 48px;font-size:clamp(52px,10.5vw,184px);font-weight:800;letter-spacing:-0.068em;line-height:.88;")}>
            {"Let's build something that works for your business."}
          </h2>
          <div style={S("display:flex;flex-wrap:wrap;gap:12px;")}>
            <Btn label="Contact us" variant="dark" href="/contact" onClick={v.go.contact} />
            <Btn label="Our services" variant="light" href="/services" onClick={v.go.services} />
          </div>
        </div>
      </section>
    </main>
    </>
  );
}
