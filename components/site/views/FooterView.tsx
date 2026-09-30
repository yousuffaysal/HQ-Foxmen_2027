/* eslint-disable */
// GENERATED from "foxmen new/Foxmen Studio.dc.html" by the design converter. Markup and
// inline styles are kept 1:1 with the design; behaviour lives in the page components.
"use client";
import { Fragment } from "react";
import { S } from "../style";
import Btn from "../Btn";
import ImageSlot from "../ImageSlot";

export default function FooterView({ v }: { v: any }) {
  return (
    <>
    <footer style={S("font-family:Inter,sans-serif;background:#1F1712;color:#F3EEE4;padding:clamp(64px,8vw,120px) clamp(20px,4.5vw,64px) 28px;overflow:hidden;")}>
      <div style={S("max-width:1440px;margin:0 auto;")}>
        <div style={S("display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:32px;padding-bottom:clamp(48px,6vw,80px);border-bottom:1px solid rgba(243,238,228,.16);")}>
          <h2 style={S("margin:0;font-size:clamp(40px,6vw,96px);font-weight:800;letter-spacing:-0.062em;line-height:.94;color:#F3EEE4;")}>
            {"Have a project"}
            <br />
            {"in mind?"}
          </h2>
          <Btn label="Contact us" variant="cream" href="/contact" onClick={v.go.contact} />
        </div>
        <div style={S("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr));gap:32px;padding:48px 0;")}>
          <div style={S("display:flex;flex-direction:column;gap:12px;")}>
            <div style={S("font-size:13px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;opacity:.6;")}>
              {"Pages"}
            </div>
            {(v.navLinks || []).map((l: any, l$i: number) => (
              <Fragment key={l$i}>
              <a href={l.href} onClick={l.go} style={S("color:#F3EEE4;font-size:17px;")}>
                {l.label}
              </a>
              </Fragment>
            ))}
          </div>
          <div style={S("display:flex;flex-direction:column;gap:12px;")}>
            <div style={S("font-size:13px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;opacity:.6;")}>
              {"Services"}
            </div>
            {(v.services || []).map((s: any, s$i: number) => (
              <Fragment key={s$i}>
              <a href="/services" onClick={v.go.services} style={S("color:#F3EEE4;font-size:17px;")}>
                {s.title}
              </a>
              </Fragment>
            ))}
          </div>
          <div style={S("display:flex;flex-direction:column;gap:12px;")}>
            <div style={S("font-size:13px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;opacity:.6;")}>
              {"Contact"}
            </div>
            <span style={S("font-size:17px;")}>
              {v.contactEmail}
            </span>
            {v.contactPhone ? (
              <>
              <span style={S("font-size:17px;")}>
                {v.contactPhone}
              </span>
              </>
            ) : null}
            <span style={S("font-size:17px;")}>
              {"foxmen.studio"}
            </span>
          </div>
        </div>
        <div data-scale="1" style={S("overflow:hidden;")}>
          <div style={S("font-size:clamp(64px,19.5vw,330px);font-weight:800;letter-spacing:-0.068em;line-height:.8;color:#F3EEE4;white-space:nowrap;transform-origin:50% 100%;")}>
            {"FOXMEN"}
          </div>
        </div>
        <div style={S("display:flex;flex-wrap:wrap;justify-content:space-between;gap:16px;padding-top:28px;font-size:14px;opacity:.7;")}>
          <span>
            {"© 2026 Foxmen Studio. Web, AI and Custom Software for Growing Businesses."}
          </span>
        </div>
      </div>
    </footer>
    </>
  );
}
