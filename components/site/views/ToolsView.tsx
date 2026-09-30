/* eslint-disable */
// GENERATED from "foxmen new/Foxmen Studio.dc.html" by the design converter. Markup and
// inline styles are kept 1:1 with the design; behaviour lives in the page components.
"use client";
import { Fragment } from "react";
import { S } from "../style";
import Btn from "../Btn";
import ImageSlot from "../ImageSlot";

export default function ToolsView({ v }: { v: any }) {
  return (
    <>
    <main data-screen-label="AI Tools">
      <section style={S("min-height:100vh;padding:clamp(120px,16vh,170px) clamp(20px,4.5vw,64px) clamp(56px,8vw,96px);display:flex;flex-direction:column;align-items:center;")}>
        <div data-reveal="1" style={S("display:inline-flex;align-items:center;gap:10px;padding:8px 16px 8px 10px;border-radius:999px;background:#FAF7F1;box-shadow:inset 0 0 0 1px rgba(31,23,18,.1);font-size:14px;font-weight:500;margin-bottom:28px;")}>
          <span style={S("width:8px;height:8px;border-radius:999px;background:#B86CF9;")}></span>
          {"Foxmen AI tools · Free for any business"}
        </div>
        <h1 style={S("margin:0;text-align:center;font-size:clamp(44px,7.4vw,124px);font-weight:800;letter-spacing:-0.07em;line-height:.9;max-width:12em;text-wrap:balance;")}>
          <div style={S("overflow:hidden;padding-bottom:.05em;")}>
            <div data-reveal="up">
              {"Put AI to work"}
            </div>
          </div>
          <div style={S("overflow:hidden;padding-bottom:.05em;")}>
            <div data-reveal="up" data-delay="90">
              {"on your "}
              <span style={S("color:#B86CF9;")}>
                {"business."}
              </span>
            </div>
          </div>
        </h1>
        <p data-reveal="1" data-delay="160" style={S("margin:24px 0 0;text-align:center;max-width:520px;font-size:18px;line-height:1.55;color:#5E5249;text-wrap:pretty;")}>
          {"Choose a tool, describe what you need and get a result in seconds."}
        </p>
        <div data-reveal="1" data-delay="220" style={S("width:100%;max-width:780px;margin-top:clamp(32px,5vw,56px);position:relative;")}>
          <div style={S("margin:0 22px;padding:10px 14px 18px;border-radius:18px 18px 0 0;background:#1F1712;color:#F3EEE4;display:flex;align-items:center;gap:12px;")}>
            <span style={S("font-family:'JetBrains Mono',monospace;font-size:12px;color:#B86CF9;flex:none;")}>
              {v.curTool.num}
            </span>
            <span style={S("font-size:14px;font-weight:600;flex:none;")}>
              {v.curTool.name}
            </span>
            <span style={S("font-size:14px;color:rgba(243,238,228,.65);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0;")}>
              {v.curTool.desc}
            </span>
          </div>
          <div style={S("position:relative;margin-top:-10px;background:#FAF7F1;border-radius:28px;box-shadow:0 0 0 1px rgba(31,23,18,.12), 0 30px 60px -20px rgba(31,23,18,.25);padding:18px 18px 12px;")}>
            <textarea value={v.toolText} onChange={v.onToolText} onKeyDown={v.onToolKey} placeholder={v.curTool.ph} rows={3} aria-label="Describe what you need" style={S("display:block;width:100%;border:none;background:transparent;resize:none;outline:none;font-family:Inter,sans-serif;font-size:18px;line-height:1.5;color:#1F1712;min-height:84px;padding:4px 6px;")}></textarea>
            <div style={S("display:flex;align-items:center;gap:6px;margin-top:8px;flex-wrap:wrap;")} className="fx-toolrow">
              <div style={S("position:relative;")}>
                <button type="button" onClick={v.togglePick} style={S(`display:flex;align-items:center;gap:8px;height:40px;padding:0 14px 0 8px;border-radius:999px;border:none;cursor:pointer;background:${v.pickBg};color:#1F1712;font-size:14px;font-weight:600;transition:background .25s;`)} className="fx-pick hv1">
                  <span style={S("width:26px;height:26px;border-radius:999px;background:#120C09;box-shadow:inset 0 0 0 1px rgba(184,108,249,.45);display:flex;align-items:center;justify-content:center;")}>
                    <img src="/assets/logo.png" alt="" style={S("width:15px;height:15px;")} />
                  </span>
                  <span className="fx-pick-label">
                    {v.curTool.short}
                  </span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" style={S(`transform:${v.pickRot};transition:transform .3s;`)}>
                    <path d="M6 9l6 6 6-6"></path>
                  </svg>
                </button>
                {v.pickOpen ? (
                  <>
                  <div data-lenis-prevent="1" style={S("position:absolute;top:calc(100% + 10px);left:0;z-index:30;width:min(360px,80vw);max-height:360px;overflow:auto;background:#FAF7F1;border-radius:20px;box-shadow:0 0 0 1px rgba(31,23,18,.12), 0 24px 50px -12px rgba(31,23,18,.3);padding:6px;")}>
                    {(v.pickList || []).map((o: any, o$i: number) => (
                      <Fragment key={o$i}>
                      <button type="button" onClick={o.pick} style={S(`display:grid;grid-template-columns:28px minmax(0,1fr) auto;gap:10px;align-items:center;width:100%;padding:10px 12px;border:none;border-radius:14px;cursor:pointer;text-align:left;background:${o.bg};color:#1F1712;`)} className="hv1">
                        <span style={S("font-family:'JetBrains Mono',monospace;font-size:11px;color:#5E5249;")}>
                          {o.num}
                        </span>
                        <span style={S("font-size:14px;font-weight:600;")}>
                          {o.name}
                        </span>
                        <span style={S("font-size:11px;font-weight:600;color:#5E5249;")}>
                          {o.cat}
                        </span>
                      </button>
                      </Fragment>
                    ))}
                  </div>
                  </>
                ) : null}
              </div>
              <button type="button" onClick={v.cycleLen} style={S("display:flex;align-items:center;gap:8px;height:40px;padding:0 14px 0 12px;border-radius:999px;border:none;cursor:pointer;background:transparent;color:#5E5249;font-size:14px;font-weight:600;")} className="fx-len hv14">
                <span style={S("display:flex;align-items:flex-end;gap:2px;height:14px;")}>
                  {(v.lenBars || []).map((lb: any, lb$i: number) => (
                    <Fragment key={lb$i}>
                    <span style={S(`width:3px;border-radius:2px;background:currentColor;height:${lb.h};opacity:${lb.o};`)}></span>
                    </Fragment>
                  ))}
                </span>
                {v.lenLabel}
              </button>
              <span style={S("margin-left:auto;font-size:12px;color:#8F8278;padding-right:6px;")} className="fx-hide-m">
                {"Enter to run"}
              </span>
              <button type="button" onClick={v.runChat} aria-label="Run tool" style={S(`width:44px;height:44px;border-radius:999px;border:none;cursor:pointer;background:${v.sendBg};color:${v.sendFg};display:flex;align-items:center;justify-content:center;transition:background .25s, transform .25s;`)} className="fx-send hv6">
                {v.notBusy ? (
                  <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 19V5M5 12l7-7 7 7"></path>
                  </svg>
                  </>
                ) : null}
                {v.toolBusy ? (
                  <>
                  <span style={S("display:flex;gap:3px;")}>
                    <span style={S("width:4px;height:4px;border-radius:9px;background:currentColor;animation:fxblink 1s infinite;")}></span>
                    <span style={S("width:4px;height:4px;border-radius:9px;background:currentColor;animation:fxblink 1s .15s infinite;")}></span>
                    <span style={S("width:4px;height:4px;border-radius:9px;background:currentColor;animation:fxblink 1s .3s infinite;")}></span>
                  </span>
                  </>
                ) : null}
              </button>
            </div>
          </div>
          <div style={S("display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin-top:18px;")}>
            <span style={S("font-size:13px;color:#5E5249;padding:8px 4px;")}>
              {"Try"}
            </span>
            {(v.quickTools || []).map((q: any, q$i: number) => (
              <Fragment key={q$i}>
              <button type="button" onClick={q.pick} style={S(`border:none;cursor:pointer;padding:8px 14px;border-radius:999px;font-size:13px;font-weight:600;background:${q.bg};color:${q.fg};box-shadow:inset 0 0 0 1px rgba(31,23,18,.15);transition:background .25s;`)}>
                {q.name}
              </button>
              </Fragment>
            ))}
          </div>
          {v.showLoader ? (
            <>
            <div style={S("margin-top:28px;")}>
              {v.loaderNode}
            </div>
            </>
          ) : null}
          {v.hasOut ? (
            <>
            <div style={S("margin-top:28px;background:#FAF7F1;border-radius:24px;box-shadow:0 0 0 1px rgba(31,23,18,.1);padding:clamp(20px,3vw,32px);")}>
              <div style={S("display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid rgba(31,23,18,.1);")}>
                <span style={S("display:flex;align-items:center;gap:10px;font-size:14px;font-weight:600;")}>
                  <span style={S("width:26px;height:26px;border-radius:999px;background:#120C09;box-shadow:inset 0 0 0 1px rgba(184,108,249,.45);display:flex;align-items:center;justify-content:center;")}>
                    <img src="/assets/logo.png" alt="" style={S("width:15px;height:15px;")} />
                  </span>
                  {v.curTool.name}
                </span>
                <button type="button" onClick={v.copyOut} style={S("border:none;cursor:pointer;padding:8px 16px;border-radius:999px;background:#1F1712;color:#F3EEE4;font-size:13px;font-weight:600;")}>
                  {v.copyLabel}
                </button>
              </div>
              <div style={S("display:flex;flex-direction:column;gap:12px;")}>
                {(v.outBlocks || []).map((ob: any, ob$i: number) => (
                  <Fragment key={ob$i}>
                  <div style={S(`display:grid;grid-template-columns:40px minmax(0,1fr);gap:14px;padding:18px 20px;border-radius:18px;background:${ob.bg};color:${ob.fg};`)}>
                    <span style={S(`font-family:'JetBrains Mono',monospace;font-size:12px;padding-top:4px;color:${ob.nc};`)}>
                      {ob.n}
                    </span>
                    <div style={S("display:flex;flex-direction:column;gap:10px;min-width:0;")}>
                      {ob.hasTitle ? (
                        <>
                        <div style={S("font-size:clamp(18px,1.6vw,22px);font-weight:800;letter-spacing:-0.03em;line-height:1.2;")}>
                          {ob.title}
                        </div>
                        </>
                      ) : null}
                      {(ob.paras || []).map((pp: any, pp$i: number) => (
                        <Fragment key={pp$i}>
                        <p style={S("margin:0;font-size:16px;line-height:1.6;text-wrap:pretty;")}>
                          {pp}
                        </p>
                        </Fragment>
                      ))}
                      {ob.hasList ? (
                        <>
                        <ul style={S("list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px;")}>
                          {(ob.items || []).map((li: any, li$i: number) => (
                            <Fragment key={li$i}>
                            <li style={S("display:flex;gap:12px;align-items:baseline;font-size:15px;line-height:1.55;")}>
                              <span style={S(`width:7px;height:7px;border-radius:2px;background:${ob.dot};flex:none;transform:translateY(-2px) rotate(45deg);`)}></span>
                              <span>
                                {li}
                              </span>
                            </li>
                            </Fragment>
                          ))}
                        </ul>
                        </>
                      ) : null}
                    </div>
                  </div>
                  </Fragment>
                ))}
              </div>
              <div style={S("margin-top:16px;font-size:12px;color:#8F8278;")}>
                {"Results are AI generated. Please review before use."}
              </div>
            </div>
            </>
          ) : null}
        </div>
      </section>
      <section style={S("padding:0 clamp(12px,2vw,24px);")}>
        <div style={S("max-width:1560px;margin:0 auto;background:#1F1712;color:#F3EEE4;border-radius:clamp(20px,2.4vw,32px);padding:clamp(40px,6vw,96px) clamp(24px,5vw,72px);display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr));gap:clamp(40px,5vw,80px);align-items:end;position:relative;overflow:hidden;")}>
          <div>
            <div style={S("font-family:'JetBrains Mono',monospace;font-size:13px;color:#B86CF9;margin-bottom:24px;")}>
              {"(Built by Foxmen Studio)"}
            </div>
            <h2 data-reveal="1" style={S("margin:0;font-size:clamp(44px,6.4vw,108px);font-weight:800;letter-spacing:-0.07em;line-height:.9;")}>
              {"Like these tools? We build them "}
              <span style={S("color:#B86CF9;")}>
                {"for you."}
              </span>
            </h2>
          </div>
          <div style={S("display:flex;flex-direction:column;gap:28px;")}>
            <div style={S("border-top:1px solid rgba(243,238,228,.16);")}>
              {(v.aiOffers || []).map((o: any, o$i: number) => (
                <Fragment key={o$i}>
                <div data-reveal="1" style={S("display:grid;grid-template-columns:40px minmax(0,1fr);gap:12px;padding:18px 0;border-bottom:1px solid rgba(243,238,228,.16);")}>
                  <span style={S("font-family:'JetBrains Mono',monospace;font-size:12px;color:#B86CF9;padding-top:4px;")}>
                    {o.n}
                  </span>
                  <div>
                    <div style={S("font-size:clamp(20px,1.8vw,26px);font-weight:700;letter-spacing:-0.03em;margin-bottom:4px;")}>
                      {o.t}
                    </div>
                    <div style={S("font-size:15px;line-height:1.5;color:rgba(243,238,228,.7);")}>
                      {o.d}
                    </div>
                  </div>
                </div>
                </Fragment>
              ))}
            </div>
            <div style={S("display:flex;gap:12px;flex-wrap:wrap;")}>
              <Btn label="Build my AI tool" variant="cream" href="/contact" onClick={v.go.contact} />
              <a href="/services" onClick={v.go.services} style={S("display:inline-flex;align-items:center;gap:8px;height:56px;padding:0 22px;border-radius:999px;box-shadow:inset 0 0 0 1px rgba(243,238,228,.3);color:#F3EEE4;font-size:16px;font-weight:600;")} className="hv8">
                {"See services "}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
      <section style={S("padding:clamp(88px,10vw,140px) clamp(20px,4.5vw,64px);")}>
        <div style={S("max-width:1440px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr));gap:clamp(40px,6vw,96px);align-items:start;")}>
          <div style={S("position:sticky;top:120px;display:flex;flex-direction:column;gap:20px;")} className="fx-unstick-m">
            <div style={S("display:flex;align-items:center;gap:10px;font-size:13px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#5E5249;")}>
              <span style={S("width:8px;height:8px;border-radius:2px;background:#B86CF9;")}></span>
              {"Project cost estimator"}
            </div>
            <h2 data-reveal="1" style={S("margin:0;font-size:clamp(40px,5.5vw,84px);font-weight:800;letter-spacing:-0.062em;line-height:.94;")}>
              {"What would your project cost?"}
            </h2>
            <p style={S("margin:0;max-width:420px;font-size:17px;line-height:1.6;color:#5E5249;")}>
              {"Pick the services you need to see a starting budget. We confirm the final price after a short call."}
            </p>
          </div>
          <div style={S("display:flex;flex-direction:column;gap:10px;")}>
            {(v.estRows || []).map((e: any, e$i: number) => (
              <Fragment key={e$i}>
              <button onClick={e.toggle} style={S(`display:flex;justify-content:space-between;align-items:center;gap:16px;padding:20px 22px;border-radius:18px;border:none;cursor:pointer;text-align:left;color:#1F1712;background:${e.bg};box-shadow:inset 0 0 0 1px rgba(31,23,18,.14);transition:background .25s;`)}>
                <span style={S("display:flex;align-items:center;gap:14px;font-size:17px;font-weight:600;")}>
                  <span style={S(`width:22px;height:22px;border-radius:6px;background:${e.box};box-shadow:inset 0 0 0 1.5px #1F1712;flex:none;`)}></span>
                  {e.title}
                </span>
                <span style={S("font-size:14px;text-align:right;")}>
                  {e.price}
                </span>
              </button>
              </Fragment>
            ))}
            <div style={S("margin-top:8px;background:#1F1712;color:#F3EEE4;border-radius:18px;padding:22px 24px;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:16px;")}>
              <div>
                <div style={S("font-size:13px;color:rgba(243,238,228,.65);margin-bottom:4px;")}>
                  {"Estimated starting budget"}
                </div>
                <div style={S("font-size:clamp(22px,2.4vw,30px);font-weight:800;letter-spacing:-0.048em;")}>
                  {v.estTotal}
                </div>
              </div>
              <Btn label="Get exact quote" variant="cream" href="/contact" onClick={v.go.contact} />
            </div>
          </div>
        </div>
      </section>
      <section style={S("padding:0 clamp(20px,4.5vw,64px) clamp(88px,10vw,140px);")}>
        <div style={S("max-width:1440px;margin:0 auto;")}>
          <div style={S("display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:24px;margin-bottom:clamp(32px,4vw,48px);")}>
            <h2 data-reveal="1" style={S("margin:0;font-size:clamp(44px,7vw,112px);font-weight:800;letter-spacing:-0.068em;line-height:.9;")}>
              {"All tools"}
              <sup style={S("font-size:.28em;letter-spacing:-0.02em;vertical-align:top;margin-left:.1em;")}>
                {"("}{v.aiCount}{")"}
              </sup>
            </h2>
            <div style={S("display:flex;flex-wrap:wrap;gap:8px;")}>
              {(v.toolCats || []).map((f: any, f$i: number) => (
                <Fragment key={f$i}>
                <button onClick={f.pick} style={S(`border:none;cursor:pointer;padding:10px 18px;border-radius:999px;font-size:14px;font-weight:600;background:${f.bg};color:${f.fg};box-shadow:inset 0 0 0 1px rgba(31,23,18,.15);`)}>
                  {f.label}
                </button>
                </Fragment>
              ))}
            </div>
          </div>
          <div style={S("border-top:1px solid rgba(31,23,18,.14);")}>
            {(v.toolList || []).map((t: any, t$i: number) => (
              <Fragment key={t$i}>
              <button onClick={t.use} data-reveal="1" style={S(`display:grid;grid-template-columns:${v.libCols};gap:12px clamp(16px,3vw,40px);align-items:center;width:100%;padding:clamp(18px,2vw,26px) 0;border:none;border-bottom:1px solid rgba(31,23,18,.14);background:transparent;cursor:pointer;text-align:left;color:#1F1712;transition:padding .35s ease, background .35s ease;border-radius:12px;`)} className="hv15">
                <span style={S("font-family:'JetBrains Mono',monospace;font-size:13px;color:#5E5249;")}>
                  {t.num}
                </span>
                <span style={S("font-size:clamp(22px,2.4vw,36px);font-weight:800;letter-spacing:-0.048em;line-height:1.05;")}>
                  {t.name}
                </span>
                <span style={S("font-size:15px;line-height:1.5;color:#5E5249;")}>
                  {t.desc}
                </span>
                <span style={S("display:inline-flex;align-items:center;gap:8px;justify-self:end;font-size:14px;font-weight:600;padding:10px 16px;border-radius:999px;background:#1F1712;color:#F3EEE4;white-space:nowrap;")}>
                  {"Use "}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6"></path>
                  </svg>
                </span>
              </button>
              </Fragment>
            ))}
          </div>
        </div>
      </section>
      <section style={S("padding:0 clamp(12px,2vw,24px) clamp(12px,2vw,24px);")}>
        <div style={S("position:relative;border-radius:clamp(20px,2.4vw,32px);overflow:hidden;background:#B066FA url(/assets/brand/pattern.png) center/cover;padding:clamp(24px,5vw,72px);display:flex;justify-content:flex-end;")}>
          <div style={S("max-width:720px;background:#F3EEE4;border-radius:clamp(18px,2vw,28px);padding:clamp(28px,4.5vw,64px);display:flex;flex-direction:column;gap:24px;")}>
            <h2 style={S("margin:0;font-size:clamp(40px,5.4vw,88px);font-weight:800;letter-spacing:-0.068em;line-height:.92;")}>
              {"Want AI that knows your business?"}
            </h2>
            <p style={S("margin:0;font-size:17px;line-height:1.6;color:#5E5249;max-width:460px;")}>
              {"We build custom assistants and agents trained on your products, prices and policies, for businesses all over the world."}
            </p>
            <div>
              <Btn label="Talk to us" variant="dark" href="/contact" onClick={v.go.contact} />
            </div>
          </div>
        </div>
      </section>
    </main>
    </>
  );
}
