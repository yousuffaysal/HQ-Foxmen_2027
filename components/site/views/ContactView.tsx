/* eslint-disable */
// GENERATED from "foxmen new/Foxmen Studio.dc.html" by the design converter. Markup and
// inline styles are kept 1:1 with the design; behaviour lives in the page components.
"use client";
import { Fragment } from "react";
import { S } from "../style";
import Btn from "../Btn";
import ImageSlot from "../ImageSlot";

export default function ContactView({ v }: { v: any }) {
  return (
    <>
    <main data-screen-label="Contact">
      <section style={S("padding:clamp(140px,20vh,200px) clamp(20px,4.5vw,64px) clamp(88px,10vw,140px);")}>
        <div style={S("max-width:1440px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,440px),1fr));gap:clamp(40px,6vw,96px);")}>
          <div style={S("display:flex;flex-direction:column;justify-content:space-between;gap:48px;")}>
            <h1 style={S("margin:0;font-size:clamp(52px,8.5vw,148px);font-weight:800;letter-spacing:-0.068em;line-height:.9;")}>
              <div style={S("overflow:hidden;padding-bottom:.05em;")}>
                <div data-reveal="up">
                  {"Let's talk"}
                </div>
              </div>
              <div style={S("overflow:hidden;padding-bottom:.05em;")}>
                <div data-reveal="up" data-delay="90">
                  {"about your"}
                </div>
              </div>
              <div style={S("overflow:hidden;padding-bottom:.05em;")}>
                <div data-reveal="up" data-delay="180">
                  {"project."}
                </div>
              </div>
            </h1>
            <div data-reveal="1" style={S("display:flex;flex-direction:column;border-top:1px solid rgba(31,23,18,.14);")}>
              <div style={S("display:flex;justify-content:space-between;gap:16px;padding:18px 0;border-bottom:1px solid rgba(31,23,18,.14);font-size:17px;")}>
                <span style={S("color:#5E5249;")}>
                  {"Email"}
                </span>
                <span style={S("font-weight:600;")}>
                  {v.contactEmail}
                </span>
              </div>
              {v.contactPhone ? (
                <>
                <div style={S("display:flex;justify-content:space-between;gap:16px;padding:18px 0;border-bottom:1px solid rgba(31,23,18,.14);font-size:17px;")}>
                  <span style={S("color:#5E5249;")}>
                    {"Phone / WhatsApp"}
                  </span>
                  <span style={S("font-weight:600;")}>
                    {v.contactPhone}
                  </span>
                </div>
                </>
              ) : null}
              <div style={S("display:flex;justify-content:space-between;gap:16px;padding:18px 0;border-bottom:1px solid rgba(31,23,18,.14);font-size:17px;")}>
                <span style={S("color:#5E5249;")}>
                  {"Web"}
                </span>
                <span style={S("font-weight:600;")}>
                  {"foxmen.studio"}
                </span>
              </div>
              <div style={S("display:flex;justify-content:space-between;gap:16px;padding:18px 0;border-bottom:1px solid rgba(31,23,18,.14);font-size:17px;")}>
                <span style={S("color:#5E5249;")}>
                  {"Clients"}
                </span>
                <span style={S("font-weight:600;text-align:right;")}>
                  {"Businesses worldwide, working remotely"}
                </span>
              </div>
            </div>
          </div>
          <div data-reveal="1" data-delay="150" style={S("background:#FAF7F1;border:1px solid rgba(31,23,18,.1);border-radius:24px;padding:clamp(24px,3.5vw,48px);")}>
            {v.notSent ? (
              <>
              <form onSubmit={v.submitContact} style={S("display:flex;flex-direction:column;gap:22px;")}>
                <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={S("position:absolute;left:-9999px;width:1px;height:1px;opacity:0;")} />
                <div style={S("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));gap:14px;")}>
                  <label style={S("display:flex;flex-direction:column;gap:8px;font-size:14px;font-weight:600;")}>
                    {"Your name"}
                    <input name="name" required placeholder="Full name" style={S("border:1px solid rgba(31,23,18,.18);background:#F3EEE4;border-radius:14px;padding:14px 16px;font-size:16px;color:#1F1712;outline:none;")} />
                  </label>
                  <label style={S("display:flex;flex-direction:column;gap:8px;font-size:14px;font-weight:600;")}>
                    {"Email"}
                    <input name="email" type="email" required placeholder="you@business.com" style={S("border:1px solid rgba(31,23,18,.18);background:#F3EEE4;border-radius:14px;padding:14px 16px;font-size:16px;color:#1F1712;outline:none;")} />
                  </label>
                  <label style={S("display:flex;flex-direction:column;gap:8px;font-size:14px;font-weight:600;")}>
                    {"Phone or WhatsApp"}
                    <input name="phone" placeholder="Optional" style={S("border:1px solid rgba(31,23,18,.18);background:#F3EEE4;border-radius:14px;padding:14px 16px;font-size:16px;color:#1F1712;outline:none;")} />
                  </label>
                  <label style={S("display:flex;flex-direction:column;gap:8px;font-size:14px;font-weight:600;")}>
                    {"Business name"}
                    <input name="company" placeholder="Optional" style={S("border:1px solid rgba(31,23,18,.18);background:#F3EEE4;border-radius:14px;padding:14px 16px;font-size:16px;color:#1F1712;outline:none;")} />
                  </label>
                </div>
                <div>
                  <div style={S("font-size:14px;font-weight:600;margin-bottom:10px;")}>
                    {"What do you need?"}
                  </div>
                  <div style={S("display:flex;flex-wrap:wrap;gap:8px;")}>
                    {(v.cChips || []).map((c: any, c$i: number) => (
                      <Fragment key={c$i}>
                      <button type="button" onClick={c.toggle} style={S(`border:none;cursor:pointer;padding:11px 18px;border-radius:999px;font-size:14px;font-weight:600;background:${c.bg};color:${c.fg};box-shadow:inset 0 0 0 1px rgba(31,23,18,.18);transition:background .25s;`)}>
                        {c.label}
                      </button>
                      </Fragment>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={S("display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:10px;")}>
                    <div style={S("font-size:14px;font-weight:600;")}>
                      {"Budget"}
                    </div>
                    <div style={S("display:flex;gap:2px;padding:3px;border-radius:999px;box-shadow:inset 0 0 0 1px rgba(31,23,18,.18);")}>
                      {(v.curOpts || []).map((o: any, o$i: number) => (
                        <Fragment key={o$i}>
                        <button type="button" onClick={o.pick} style={S(`border:none;cursor:pointer;padding:6px 12px;border-radius:999px;font-size:12px;font-weight:600;background:${o.bg};color:${o.fg};`)}>
                          {o.label}
                        </button>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  <div style={S("display:flex;flex-wrap:wrap;gap:8px;")}>
                    {(v.bChips || []).map((c: any, c$i: number) => (
                      <Fragment key={c$i}>
                      <button type="button" onClick={c.toggle} style={S(`border:none;cursor:pointer;padding:11px 18px;border-radius:999px;font-size:14px;font-weight:600;background:${c.bg};color:${c.fg};box-shadow:inset 0 0 0 1px rgba(31,23,18,.18);transition:background .25s;`)}>
                        {c.label}
                      </button>
                      </Fragment>
                    ))}
                  </div>
                </div>
                <label style={S("display:flex;flex-direction:column;gap:8px;font-size:14px;font-weight:600;")}>
                  {"Tell us about the project"}
                  <textarea name="message" rows={5} placeholder="What does your business do, and what should the new website or app help with?" style={S("border:1px solid rgba(31,23,18,.18);background:#F3EEE4;border-radius:14px;padding:14px 16px;font-size:16px;color:#1F1712;resize:vertical;outline:none;")}></textarea>
                </label>
                <div>
                  <button type="submit" style={S("display:inline-flex;align-items:center;gap:18px;padding:6px 6px 6px 26px;border-radius:999px;border:none;background:#1F1712;color:#F3EEE4;font-weight:600;font-size:16px;cursor:pointer;")}>
                    {"Send message"}
                    <span style={S("width:44px;height:44px;border-radius:999px;background:#F3EEE4;color:#1F1712;display:flex;align-items:center;justify-content:center;")}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 17L17 7M9 7h8v8"></path>
                      </svg>
                    </span>
                  </button>
                </div>
              </form>
              </>
            ) : null}
            {v.sent ? (
              <>
              <div style={S("min-height:480px;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;gap:20px;")}>
                <div style={S("width:72px;height:72px;border-radius:999px;background:#B86CF9;display:flex;align-items:center;justify-content:center;")}>
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#1F1712" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12l5 5L20 7"></path>
                  </svg>
                </div>
                <h2 style={S("margin:0;font-size:clamp(36px,4vw,56px);font-weight:800;letter-spacing:-0.058em;line-height:1;")}>
                  {"Thanks. We got your message."}
                </h2>
                <p style={S("margin:0;font-size:17px;line-height:1.55;color:#5E5249;max-width:420px;")}>
                  {"We will reply by email soon. Meanwhile, take a look at our recent work."}
                </p>
                <Btn label="See our work" variant="dark" href="/work" onClick={v.go.work} />
              </div>
              </>
            ) : null}
          </div>
        </div>
      </section>
    </main>
    </>
  );
}
