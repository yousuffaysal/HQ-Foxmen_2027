/* eslint-disable */
// GENERATED from "foxmen new/Foxmen Studio.dc.html" by the design converter. Markup and
// inline styles are kept 1:1 with the design; behaviour lives in the page components.
"use client";
import { Fragment } from "react";
import { S } from "../style";
import Btn from "../Btn";
import ImageSlot from "../ImageSlot";

export default function AboutView({ v }: { v: any }) {
  return (
    <>
    <main data-screen-label="About">
      <section style={S("min-height:100vh;padding:clamp(110px,14vh,140px) clamp(20px,4.5vw,64px) clamp(28px,4vw,48px);display:flex;flex-direction:column;justify-content:space-between;gap:48px;")}>
        <div data-reveal="1" style={S("max-width:1440px;width:100%;margin:0 auto;display:flex;flex-wrap:wrap;justify-content:space-between;gap:16px;font-family:'JetBrains Mono',monospace;font-size:13px;")}>
          <span>
            {"(About Foxmen Studio)"}
          </span>
          <span>
            {"Web and AI agency"}
          </span>
          <span>
            {"Serving businesses worldwide"}
          </span>
        </div>
        <div style={S("max-width:1440px;width:100%;margin:0 auto;")}>
          <h1 style={S("margin:0;font-size:clamp(52px,11.4vw,200px);font-weight:800;letter-spacing:-0.075em;line-height:.88;")}>
            <div style={S("overflow:hidden;padding-bottom:.05em;")}>
              <div data-reveal="up" style={S("display:flex;align-items:center;flex-wrap:wrap;gap:0 .18em;")}>
                <span>
                  {"Web"}
                </span>
                <span style={S("display:inline-block;position:relative;width:1.9em;height:.8em;border-radius:999px;overflow:hidden;background:#1F1712;flex:none;")}>
                  <video src="/assets/brand/logo-animation.mp4" autoPlay muted loop playsInline style={S("position:absolute;inset:0;width:100%;height:100%;object-fit:cover;")}></video>
                </span>
                <span>
                  {"AI"}
                </span>
              </div>
            </div>
            <div style={S("overflow:hidden;padding-bottom:.05em;")}>
              <div data-reveal="up" data-delay="90">
                {"for business,"}
              </div>
            </div>
            <div style={S("overflow:hidden;padding-bottom:.05em;")}>
              <div data-reveal="up" data-delay="180" style={S("display:flex;align-items:center;flex-wrap:wrap;gap:0 .2em;")}>
                <span style={S("color:#B86CF9;")}>
                  {"worldwide."}
                </span>
              </div>
            </div>
          </h1>
        </div>
        <div style={S("max-width:1440px;width:100%;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:24px 48px;align-items:end;padding-top:24px;border-top:1px solid rgba(31,23,18,.14);")}>
          <p data-reveal="1" style={S("margin:0;font-size:clamp(18px,1.6vw,22px);line-height:1.45;max-width:560px;text-wrap:pretty;")}>
            {"Foxmen Studio is a web and AI agency. We design and build websites, online stores, AI assistants and custom software for businesses all over the world."}
          </p>
          <div data-reveal="1" data-delay="120" style={S("display:flex;justify-content:flex-end;gap:12px;flex-wrap:wrap;")}>
            <Btn label="Work with us" variant="dark" href="/contact" onClick={v.go.contact} />
            <Btn label="See our work" variant="light" href="/work" onClick={v.go.work} />
          </div>
        </div>
      </section>
      <section style={S("background:#1F1712;color:#F3EEE4;padding:clamp(64px,8vw,120px) clamp(12px,2vw,24px) clamp(12px,2vw,24px);")}>
        <div style={S("max-width:1440px;margin:0 auto clamp(32px,4vw,56px);padding:0 clamp(8px,2.5vw,40px);display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,360px),1fr));gap:24px 48px;align-items:end;")}>
          <h2 data-reveal="1" style={S("margin:0;font-size:clamp(44px,7vw,120px);font-weight:800;letter-spacing:-0.07em;line-height:.9;")}>
            {"See how"}
            <br />
            {"we "}
            <span style={S("color:#B86CF9;")}>
              {"work."}
            </span>
          </h2>
          <p data-reveal="1" style={S("margin:0;justify-self:end;max-width:420px;font-size:17px;line-height:1.6;color:rgba(243,238,228,.75);")}>
            {"A short film on what Foxmen Studio does and how we bring web and AI together for your business."}
          </p>
        </div>
        <div data-scale="1" style={S("max-width:1560px;margin:0 auto;border-radius:clamp(20px,2.4vw,32px);overflow:hidden;")}>
          <div style={S("position:relative;aspect-ratio:16/9;max-height:88vh;width:100%;background:#000;transform-origin:50% 0%;")}>
            <video ref={v.filmRef} src="/assets/brand/explainer.mp4" autoPlay muted loop playsInline preload="metadata" style={S("position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;")}></video>
            {v.filmIdle ? (
              <>
              <button onClick={v.playFilm} aria-label="Play film with sound" style={S("position:absolute;inset:0;border:none;cursor:pointer;background:rgba(31,23,18,.35);display:flex;align-items:center;justify-content:center;color:#1F1712;")}>
                <span style={S("display:flex;align-items:center;gap:14px;padding:10px 26px 10px 10px;border-radius:999px;background:#F3EEE4;font-size:16px;font-weight:600;box-shadow:0 20px 50px rgba(0,0,0,.3);transition:transform .4s cubic-bezier(.2,.7,.2,1);")} className="hv6">
                  <span style={S("width:56px;height:56px;border-radius:999px;background:#B86CF9;display:flex;align-items:center;justify-content:center;")}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z"></path>
                    </svg>
                  </span>
                  {"Play the film"}
                </span>
              </button>
              </>
            ) : null}
          </div>
        </div>
      </section>
      <section style={S("padding:clamp(88px,10vw,150px) clamp(20px,4.5vw,64px) clamp(40px,5vw,72px);")}>
        <div style={S("max-width:1440px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,360px),1fr));gap:clamp(32px,5vw,80px);")}>
          <div>
            <div style={S("position:sticky;top:120px;display:flex;flex-direction:column;gap:20px;")}>
              <div style={S("display:flex;align-items:center;gap:10px;font-size:13px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#5E5249;")}>
                <span style={S("width:8px;height:8px;border-radius:2px;background:#B86CF9;")}></span>
                {"Our story"}
              </div>
              <div style={S("font-family:'JetBrains Mono',monospace;font-size:13px;color:#5E5249;")}>
                {"01 / 04"}
              </div>
            </div>
          </div>
          <div style={S("display:flex;flex-direction:column;gap:clamp(28px,3vw,40px);grid-column:span 2;min-width:0;")}>
            <p data-reveal="1" style={S("margin:0;font-size:clamp(28px,3.4vw,54px);font-weight:700;letter-spacing:-0.045em;line-height:1.08;text-wrap:pretty;")}>
              {"Most businesses have a website. Few have one that works with AI to bring in customers and save time. "}
              <span style={S("color:#8F8278;")}>
                {"That is the gap we close."}
              </span>
            </p>
            <div style={S("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:24px;")}>
              <p data-reveal="1" style={S("margin:0;font-size:17px;line-height:1.65;color:#5E5249;")}>
                {"We build the web side in real code: fast websites, online stores and custom apps that handle real payments and real traffic."}
              </p>
              <p data-reveal="1" data-delay="100" style={S("margin:0;font-size:17px;line-height:1.65;color:#5E5249;")}>
                {"Then we add AI where it earns its place: assistants that answer customers, agents that handle routine work and smarter tools inside your software."}
              </p>
            </div>
          </div>
        </div>
      </section>
      <section data-ccc="1" style={S(`position:relative;height:${v.cccH};`)}>
        <div style={S(`position:sticky;top:0;height:100vh;display:flex;align-items:${v.cccAlign};padding:${v.cccPad} clamp(20px,4.5vw,64px) 24px;`)}>
          <div style={S(`max-width:1440px;width:100%;margin:0 auto;display:grid;grid-template-columns:${v.cccCols};gap:${v.cccGap};align-items:center;`)}>
            <div style={S(`display:flex;flex-direction:${v.cccDir};flex-wrap:wrap;column-gap:18px;`)}>
              {(v.pillars || []).map((pl: any, pl$i: number) => (
                <Fragment key={pl$i}>
                <div data-cccw="1" style={S("display:flex;align-items:baseline;gap:clamp(12px,2vw,24px);opacity:.14;transition:opacity .5s ease, transform .6s cubic-bezier(.2,.7,.2,1);")}>
                  <span style={S("font-family:'JetBrains Mono',monospace;font-size:14px;")}>
                    {pl.n}
                  </span>
                  <span style={S(`font-size:${v.cccWord};font-weight:800;letter-spacing:-0.075em;line-height:.92;white-space:nowrap;`)}>
                    {pl.w}
                  </span>
                </div>
                </Fragment>
              ))}
            </div>
            <div style={S(`position:relative;min-height:${v.cccCardH};`)}>
              {(v.pillars || []).map((pl: any, pl$i: number) => (
                <Fragment key={pl$i}>
                <div data-cccc="1" style={S(`position:absolute;inset:0;background:${pl.bg};color:${pl.fg};border-radius:24px;padding:clamp(24px,3vw,40px);display:flex;flex-direction:column;justify-content:space-between;gap:28px;opacity:0;transform:translateY(24px);transition:opacity .5s ease, transform .6s cubic-bezier(.2,.7,.2,1);overflow:hidden;`)}>
                  <div style={S(`width:112px;height:84px;padding-top:12px;border-radius:14px;background:${pl.iconBg};color:${pl.iconFg};display:flex;align-items:center;justify-content:center;overflow:hidden;`)}>
                    <pre data-icon={pl.k} style={S("margin:0;font-family:'JetBrains Mono',monospace;font-size:11px;line-height:1.12;font-variant-ligatures:none;")}></pre>
                  </div>
                  <div>
                    <div style={S("font-size:clamp(28px,2.8vw,40px);font-weight:800;letter-spacing:-0.048em;line-height:1;margin-bottom:14px;")}>
                      {pl.t}
                    </div>
                    <div style={S("font-size:17px;line-height:1.6;opacity:.85;")}>
                      {pl.d}
                    </div>
                  </div>
                </div>
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section style={S("padding:clamp(40px,5vw,72px) clamp(12px,2vw,24px) 0;")}>
        <div style={S("max-width:1560px;margin:0 auto;background:#1F1712;color:#F3EEE4;border-radius:clamp(20px,2.4vw,32px);overflow:hidden;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,440px),1fr));")}>
          <div style={S("padding:clamp(32px,5vw,80px);display:flex;flex-direction:column;justify-content:space-between;gap:48px;")}>
            <div style={S("display:flex;justify-content:space-between;gap:16px;font-family:'JetBrains Mono',monospace;font-size:13px;color:#B86CF9;")}>
              <span>
                {"(Worldwide)"}
              </span>
              <span>
                {"02 / 04"}
              </span>
            </div>
            <div>
              <h2 data-reveal="1" style={S("margin:0 0 24px;font-size:clamp(44px,6.4vw,104px);font-weight:800;letter-spacing:-0.068em;line-height:.9;")}>
                {"One studio."}
                <br />
                {"Clients all over the world."}
              </h2>
              <p data-reveal="1" style={S("margin:0;font-size:18px;line-height:1.6;max-width:520px;color:rgba(243,238,228,.8);")}>
                {"We work remotely with businesses in any country and any time zone. You get the same process, the same care and the same quality, wherever you are."}
              </p>
            </div>
            <div style={S("display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 24px;")}>
              {(v.globalFacts || []).map((g: any, g$i: number) => (
                <Fragment key={g$i}>
                <div style={S("padding:16px 0;border-top:1px solid rgba(243,238,228,.16);")}>
                  <div style={S("font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:rgba(243,238,228,.6);margin-bottom:6px;")}>
                    {g.k}
                  </div>
                  <div style={S("font-size:17px;font-weight:600;")}>
                    {g.v}
                  </div>
                </div>
                </Fragment>
              ))}
            </div>
          </div>
          <div style={S("position:relative;min-height:clamp(320px,40vw,640px);background:#F3EEE4;")}>
            <img data-speed="-0.06" src="/assets/brand/dots-halftone.png" alt="Foxmen mark in halftone dots" style={S("position:absolute;inset:8%;width:84%;height:84%;object-fit:contain;mix-blend-mode:multiply;")} />
          </div>
        </div>
      </section>
      <section style={S("padding:clamp(88px,10vw,150px) clamp(20px,4.5vw,64px);")}>
        <div style={S("max-width:1440px;margin:0 auto;")}>
          <div style={S("display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:24px;margin-bottom:clamp(40px,5vw,64px);")}>
            <h2 data-reveal="1" style={S("margin:0;font-size:clamp(44px,7.5vw,120px);font-weight:800;letter-spacing:-0.068em;line-height:.9;")}>
              {"Built from"}
              <br />
              {"one shape."}
            </h2>
            <p data-reveal="1" style={S("margin:0;max-width:420px;font-size:17px;line-height:1.6;color:#5E5249;")}>
              {"Our mark is a single arm, rotated four times around one centre and drawn on a 60-unit grid."}
            </p>
          </div>
          <div style={S("display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:clamp(10px,1.4vw,20px);")}>
            <figure data-reveal="1" style={S(`margin:0;grid-column:span ${v.brandSpanA};border-radius:clamp(18px,2vw,28px);overflow:hidden;background:#1F1712;`)}>
              <img src="/assets/brand/construction.png" alt="Foxmen mark construction grid" style={S("display:block;width:100%;height:auto;")} />
            </figure>
            <figure data-reveal="1" data-delay="100" style={S(`margin:0;grid-column:span ${v.brandSpanB};border-radius:clamp(18px,2vw,28px);overflow:hidden;background:#F4F3F6;`)}>
              <img src="/assets/brand/rotation.png" alt="One arm rotated four times" style={S("display:block;width:100%;height:100%;object-fit:cover;")} />
            </figure>
            <figure data-reveal="1" style={S(`margin:0;grid-column:span ${v.brandSpanB};border-radius:clamp(18px,2vw,28px);overflow:hidden;background:#1E1B24;`)}>
              <img src="/assets/brand/clear-space.png" alt="Logo clear space" style={S("display:block;width:100%;height:100%;object-fit:cover;")} />
            </figure>
            <figure data-reveal="1" data-delay="100" style={S(`margin:0;grid-column:span ${v.brandSpanA};border-radius:clamp(18px,2vw,28px);overflow:hidden;background:#B066FA;`)}>
              <img src="/assets/brand/color-versions.png" alt="Logo colour versions" style={S("display:block;width:100%;height:auto;")} />
            </figure>
            <figure data-reveal="1" style={S("margin:0;grid-column:span 12;border-radius:clamp(18px,2vw,28px);overflow:hidden;background:#B066FA;")}>
              <img src="/assets/brand/palette.png" alt="Brand palette: Fox Purple, Ink, Lilac, Paper" style={S("display:block;width:100%;height:auto;")} />
            </figure>
          </div>
        </div>
      </section>
      <section style={S("padding:0 clamp(20px,4.5vw,64px) clamp(88px,10vw,140px);")}>
        <div style={S("max-width:1440px;margin:0 auto;")}>
          <div style={S("display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:24px;margin-bottom:clamp(40px,5vw,64px);")}>
            <h2 data-reveal="1" style={S("margin:0;font-size:clamp(44px,7.5vw,120px);font-weight:800;letter-spacing:-0.068em;line-height:.9;")}>
              {"What we"}
              <br />
              {"believe."}
            </h2>
            <div style={S("font-family:'JetBrains Mono',monospace;font-size:13px;color:#5E5249;")}>
              {"03 / 04"}
            </div>
          </div>
          <div style={S("border-top:1px solid rgba(31,23,18,.14);")}>
            {(v.principles || []).map((pr: any, pr$i: number) => (
              <Fragment key={pr$i}>
              <div data-reveal="1" style={S(`display:grid;grid-template-columns:${v.belCols};gap:clamp(16px,3vw,48px);align-items:center;padding:clamp(20px,2.4vw,32px) 0;border-bottom:1px solid rgba(31,23,18,.14);border-radius:14px;transition:background .4s ease, padding .4s ease;`)} className="hv7">
                <div style={S("width:112px;height:84px;padding-top:12px;border-radius:14px;background:#1F1712;color:#B86CF9;display:flex;align-items:center;justify-content:center;overflow:hidden;")}>
                  <pre data-icon={pr.k} style={S("margin:0;font-family:'JetBrains Mono',monospace;font-size:11px;line-height:1.12;font-variant-ligatures:none;")}></pre>
                </div>
                <div style={S("font-size:clamp(28px,3.4vw,52px);font-weight:800;letter-spacing:-0.055em;line-height:1;")}>
                  {pr.t}
                </div>
                <div style={S(`font-size:17px;line-height:1.6;color:#5E5249;max-width:420px;grid-column:${v.belDescCol};`)}>
                  {pr.d}
                </div>
              </div>
              </Fragment>
            ))}
          </div>
        </div>
      </section>
      <section style={S("padding:clamp(20px,3vw,32px) 0;overflow:hidden;background:#B86CF9;")}>
        <div data-marquee="1" style={S("display:flex;width:max-content;will-change:transform;")}>
          {(v.industriesLoop || []).map((m: any, m$i: number) => (
            <Fragment key={m$i}>
            <div style={S("display:flex;align-items:center;gap:32px;padding-right:32px;font-size:clamp(36px,5vw,80px);font-weight:800;letter-spacing:-0.06em;white-space:nowrap;")}>
              {m}
              <span style={S("width:.3em;height:.3em;border-radius:6px;background:#1F1712;transform:rotate(45deg);")}></span>
            </div>
            </Fragment>
          ))}
        </div>
      </section>
      <section style={S("padding:clamp(88px,10vw,140px) clamp(20px,4.5vw,64px);")}>
        <div style={S("max-width:1440px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr));gap:48px;")}>
          <div>
            <div style={S("position:sticky;top:120px;display:flex;flex-direction:column;gap:20px;")}>
              <div style={S("display:flex;align-items:center;gap:10px;font-size:13px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#5E5249;")}>
                <span style={S("width:8px;height:8px;border-radius:2px;background:#B86CF9;")}></span>
                {"How we work with you · 04 / 04"}
              </div>
              <h2 data-reveal="1" style={S("margin:0;font-size:clamp(40px,5.5vw,84px);font-weight:800;letter-spacing:-0.062em;line-height:.94;")}>
                {"Four clear steps. Any time zone."}
              </h2>
            </div>
          </div>
          <div style={S("position:relative;display:flex;flex-direction:column;gap:12px;")}>
            {(v.process || []).map((st: any, st$i: number) => (
              <Fragment key={st$i}>
              <div data-reveal="1" style={S(`position:sticky;top:${st.top};background:${st.bg};border:1px solid rgba(31,23,18,.1);border-radius:24px;padding:clamp(22px,3vw,36px);display:flex;gap:24px;align-items:flex-start;box-shadow:0 -10px 30px rgba(31,23,18,.05);`)}>
                <div style={S("width:112px;height:84px;padding-top:12px;border-radius:14px;background:#1F1712;color:#B86CF9;display:flex;align-items:center;justify-content:center;flex:none;overflow:hidden;position:relative;")}>
                  <pre data-icon={st.k} style={S("margin:0;font-family:'JetBrains Mono',monospace;font-size:11px;line-height:1.12;font-variant-ligatures:none;")}></pre>
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
      <section style={S("padding:clamp(64px,8vw,120px) clamp(20px,4.5vw,64px);border-top:1px solid rgba(31,23,18,.12);")}>
        <div style={S("max-width:1440px;margin:0 auto;")}>
          <div style={S("margin-bottom:clamp(32px,4vw,48px);")}>
            <div style={S("display:flex;align-items:center;gap:10px;font-size:13px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#5E5249;")}>
              <span style={S("width:8px;height:8px;border-radius:2px;background:#B86CF9;")}></span>
              {"Brands we have built for"}
            </div>
          </div>
          <div style={S("display:flex;flex-wrap:wrap;column-gap:clamp(20px,3vw,48px);row-gap:6px;")}>
            {(v.clientNames || []).map((c: any, c$i: number) => (
              <Fragment key={c$i}>
              <a href="/work" onClick={c.open} data-reveal="1" style={S("display:flex;align-items:baseline;gap:8px;font-size:clamp(34px,5vw,80px);font-weight:800;letter-spacing:-0.062em;line-height:1.05;color:#1F1712;transition:color .3s ease;")} className="hv8">
                {c.name}
                <sup style={S("font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:500;letter-spacing:0;color:#5E5249;")}>
                  {c.num}
                </sup>
              </a>
              </Fragment>
            ))}
          </div>
        </div>
      </section>
      <section style={S("padding:0 clamp(12px,2vw,24px) clamp(12px,2vw,24px);")}>
        <div style={S("position:relative;border-radius:clamp(20px,2.4vw,32px);overflow:hidden;background:#B066FA url(/assets/brand/pattern.png) center/cover;padding:clamp(24px,5vw,72px);")}>
          <div style={S("max-width:880px;background:#1F1712;color:#F3EEE4;border-radius:clamp(18px,2vw,28px);padding:clamp(32px,5vw,72px);display:flex;flex-direction:column;gap:28px;")}>
            <h2 style={S("margin:0;font-size:clamp(44px,6.6vw,112px);font-weight:800;letter-spacing:-0.07em;line-height:.9;")}>
              {"Wherever you are, "}
              <span style={S("color:#B86CF9;")}>
                {"let's build."}
              </span>
            </h2>
            <p style={S("margin:0;font-size:18px;line-height:1.55;max-width:460px;color:rgba(243,238,228,.8);")}>
              {"Tell us about your business. We will reply with a clear plan and price."}
            </p>
            <div>
              <Btn label="Contact us" variant="light" href="/contact" onClick={v.go.contact} />
            </div>
          </div>
        </div>
      </section>
    </main>
    </>
  );
}
