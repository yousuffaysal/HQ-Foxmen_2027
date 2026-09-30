/* eslint-disable */
// GENERATED from "foxmen new/Foxmen Studio.dc.html" by the design converter. Markup and
// inline styles are kept 1:1 with the design; behaviour lives in the page components.
"use client";
import { Fragment } from "react";
import { S } from "../style";
import Btn from "../Btn";
import ImageSlot from "../ImageSlot";

export default function HeaderView({ v }: { v: any }) {
  return (
    <>
    <header data-nav="bar" style={S("position:fixed;top:0;left:0;right:0;z-index:50;padding:14px clamp(16px,3vw,40px);display:flex;align-items:center;justify-content:space-between;gap:16px;transition:background .4s ease, box-shadow .4s ease, transform .55s cubic-bezier(.2,.7,.2,1);")}>
      <a href="/" onClick={v.go.home} aria-label="Foxmen Studio home" style={S("display:flex;align-items:center;gap:12px;flex:none;")}>
        <img src="/assets/foxmen-logo.png" alt="Foxmen Studio" style={S("height:clamp(28px,2.6vw,36px);width:auto;display:block;")} />
      </a>
      <div style={S("display:flex;align-items:center;gap:10px;")}>
        {v.desktop ? (
          <>
          <a href="/work" onClick={v.go.work} style={S("padding:12px 18px;border-radius:999px;font-size:15px;font-weight:600;white-space:nowrap;transition:background .3s;")} className="hv1">
            {"Work"}
          </a>
          <a href="/tools" onClick={v.go.tools} style={S("padding:12px 18px;border-radius:999px;font-size:15px;font-weight:600;white-space:nowrap;transition:background .3s;")} className="hv1">
            {"AI Tools"}
          </a>
          </>
        ) : null}
        <button onClick={v.toggleMenu} aria-label="Open menu" style={S("height:56px;padding:0 6px 0 22px;border-radius:999px;border:none;background:#1F1712;color:#F3EEE4;display:flex;align-items:center;gap:14px;cursor:pointer;font-size:16px;font-weight:600;flex:none;")}>
          {"Menu"}
          <span style={S("width:44px;height:44px;border-radius:999px;background:#B86CF9;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;")}>
            <span style={S("width:16px;height:2px;background:#1F1712;border-radius:2px;")}></span>
            <span style={S("width:16px;height:2px;background:#1F1712;border-radius:2px;")}></span>
          </span>
        </button>
      </div>
    </header>
    <div onClick={v.closeMenu} style={S(`position:fixed;inset:0;z-index:68;background:rgba(31,23,18,.28);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);opacity:${v.panelBackOp};pointer-events:${v.panelPE};transition:opacity .45s ease;`)}></div>
    <div data-lenis-prevent="1" style={S(`position:fixed;top:10px;right:clamp(10px,2vw,28px);z-index:69;width:min(460px,calc(100vw - 20px));max-height:calc(100vh - 20px);overflow:auto;background:#1F1712;color:#F3EEE4;border-radius:24px;padding:10px 10px 24px;transform-origin:calc(100% - 40px) 38px;transform:${v.panelT};opacity:${v.panelOp};pointer-events:${v.panelPE};transition:transform .6s cubic-bezier(.76,0,.24,1), opacity .35s ease;`)}>
      <div style={S("display:flex;justify-content:space-between;align-items:center;padding:0 0 0 14px;margin-bottom:12px;")}>
        <span style={S("font-size:13px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;opacity:.6;")}>
          {"Menu"}
        </span>
        <button onClick={v.closeMenu} aria-label="Close menu" style={S("width:56px;height:56px;border-radius:999px;border:none;background:#B86CF9;color:#1F1712;font-size:24px;line-height:1;cursor:pointer;")}>
          {"×"}
        </button>
      </div>
      <nav style={S("display:flex;flex-direction:column;padding:0 14px;")}>
        {(v.navLinks || []).map((l: any, l$i: number) => (
          <Fragment key={l$i}>
          <a href={l.href} onClick={l.go} style={S(`display:flex;align-items:center;justify-content:space-between;gap:16px;padding:10px 0;border-bottom:1px solid rgba(243,238,228,.12);color:${l.panelFg};transition:padding .35s cubic-bezier(.2,.7,.2,1);`)} className="hv2">
            <span style={S("font-size:clamp(34px,4.4vw,48px);font-weight:800;letter-spacing:-0.058em;line-height:1.05;")}>
              {l.label}
            </span>
            <span style={S("font-family:'JetBrains Mono',monospace;font-size:12px;opacity:.6;")}>
              {l.num}
            </span>
          </a>
          </Fragment>
        ))}
      </nav>
      <div style={S("display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:16px;padding:22px 14px 0;")}>
        <div style={S("font-size:14px;line-height:1.5;opacity:.7;")}>
          {v.contactEmail}
          {v.contactPhone ? (
            <>
            <br />
            {v.contactPhone}
            </>
          ) : null}
        </div>
        <Btn label="Contact us" variant="cream" href="/contact" onClick={v.go.contact} />
      </div>
    </div>
    </>
  );
}
