/* eslint-disable */
// GENERATED from "foxmen new/Foxmen Studio.dc.html" by the design converter. Markup and
// inline styles are kept 1:1 with the design; behaviour lives in the page components.
"use client";
import { Fragment } from "react";
import { S } from "../style";
import Btn from "../Btn";
import ImageSlot from "../ImageSlot";

export default function AdminView({ v }: { v: any }) {
  return (
    <>
    <div data-screen-label="Admin" style={S(`min-height:100vh;display:flex;flex-direction:${v.adminDir};background:#F3EEE4;`)}>
      <aside style={S(`background:#FAF7F1;border-right:1px solid rgba(31,23,18,.1);border-bottom:1px solid rgba(31,23,18,.1);padding:20px;display:flex;flex-direction:${v.asideDir};gap:8px;width:${v.asideW};flex:none;position:sticky;top:0;height:${v.asideH};overflow-x:auto;z-index:5;`)}>
        <div style={S("display:flex;align-items:center;gap:10px;padding:8px 10px 20px;flex:none;")}>
          <img src="/assets/logo.png" alt="" style={S("width:30px;height:30px;")} />
          <div>
            <div style={S("font-weight:700;font-size:15px;letter-spacing:-0.02em;")}>
              {"Foxmen Studio"}
            </div>
            <div style={S("font-size:12px;color:#5E5249;")}>
              {"Admin"}
            </div>
          </div>
        </div>
        {(v.adminTabs || []).map((t: any, t$i: number) => (
          <Fragment key={t$i}>
          <button onClick={t.pick} style={S(`border:none;cursor:pointer;text-align:left;padding:12px 16px;border-radius:14px;font-size:15px;font-weight:600;background:${t.bg};color:#1F1712;display:flex;justify-content:space-between;align-items:center;gap:12px;flex:none;`)}>
            {t.label}
            <span style={S("font-size:12px;font-family:'JetBrains Mono',monospace;")}>
              {t.count}
            </span>
          </button>
          </Fragment>
        ))}
        <div style={S("flex:1;")}></div>
        <a href="/" onClick={v.go.home} style={S("padding:12px 16px;border-radius:14px;font-size:15px;font-weight:600;box-shadow:inset 0 0 0 1px rgba(31,23,18,.15);flex:none;white-space:nowrap;")}>
          {"Back to site"}
        </a>
        <button onClick={v.signOut} style={S("border:none;cursor:pointer;background:transparent;text-align:left;padding:12px 16px;border-radius:14px;font-size:15px;font-weight:600;color:#5E5249;flex:none;white-space:nowrap;")}>
          {"Sign out"}
        </button>
      </aside>
      <div style={S("flex:1;min-width:0;padding:clamp(20px,3vw,40px);")}>
        <div style={S("display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:16px;margin-bottom:28px;")}>
          <div>
            <div style={S("font-size:14px;color:#5E5249;margin-bottom:6px;")}>
              {v.today}
            </div>
            <h1 style={S("margin:0;font-size:clamp(32px,3.6vw,48px);font-weight:800;letter-spacing:-0.048em;")}>
              {v.adminTitle}
            </h1>
          </div>
        </div>
        {v.tabOverview ? (
          <>
          <div style={S("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));gap:16px;margin-bottom:24px;")}>
            {(v.stats || []).map((s: any, s$i: number) => (
              <Fragment key={s$i}>
              <div style={S(`background:${s.bg};border:1px solid rgba(31,23,18,.1);border-radius:24px;padding:24px;display:flex;flex-direction:column;gap:28px;`)}>
                <div style={S("font-size:14px;font-weight:600;")}>
                  {s.label}
                </div>
                <div style={S("font-size:48px;font-weight:700;letter-spacing:-0.05em;line-height:1;")}>
                  {s.value}
                </div>
              </div>
              </Fragment>
            ))}
          </div>
          <div style={S("background:#FAF7F1;border:1px solid rgba(31,23,18,.1);border-radius:24px;padding:24px;")}>
            <div style={S("display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;")}>
              <div style={S("font-size:18px;font-weight:700;letter-spacing:-0.02em;")}>
                {"Recent inquiries"}
              </div>
              <button onClick={v.tabTo.inquiries} style={S("border:none;cursor:pointer;padding:9px 16px;border-radius:999px;background:#1F1712;color:#F3EEE4;font-size:14px;font-weight:600;")}>
                {"View all"}
              </button>
            </div>
            {(v.recent || []).map((q: any, q$i: number) => (
              <Fragment key={q$i}>
              <div style={S("display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px;padding:16px 0;border-top:1px solid rgba(31,23,18,.1);")}>
                <div style={S("min-width:0;")}>
                  <div style={S("font-weight:600;font-size:16px;")}>
                    {q.name}
                  </div>
                  <div style={S("font-size:14px;color:#5E5249;")}>
                    {q.services}
                  </div>
                </div>
                <div style={S("display:flex;align-items:center;gap:12px;")}>
                  <span style={S("font-size:13px;color:#5E5249;")}>
                    {q.date}
                  </span>
                  <span style={S(`font-size:13px;font-weight:600;padding:6px 12px;border-radius:999px;background:${q.sBg};`)}>
                    {q.status}
                  </span>
                </div>
              </div>
              </Fragment>
            ))}
          </div>
          </>
        ) : null}
        {v.tabInquiries ? (
          <>
          <div style={S("background:#FAF7F1;border:1px solid rgba(31,23,18,.1);border-radius:24px;overflow-x:auto;")}>
            <div style={S("min-width:880px;")}>
              <div style={S("display:grid;grid-template-columns:1.2fr 1.4fr 1.4fr .9fr .8fr 1fr 44px;gap:12px;padding:16px 24px;font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#5E5249;border-bottom:1px solid rgba(31,23,18,.1);")}>
                <span>
                  {"Name"}
                </span>
                <span>
                  {"Contact"}
                </span>
                <span>
                  {"Service"}
                </span>
                <span>
                  {"Budget"}
                </span>
                <span>
                  {"Date"}
                </span>
                <span>
                  {"Status"}
                </span>
                <span></span>
              </div>
              {(v.inquiryRows || []).map((q: any, q$i: number) => (
                <Fragment key={q$i}>
                <div style={S("border-bottom:1px solid rgba(31,23,18,.08);")}>
                  <div style={S("display:grid;grid-template-columns:1.2fr 1.4fr 1.4fr .9fr .8fr 1fr 44px;gap:12px;padding:16px 24px;align-items:center;font-size:15px;")}>
                    <button onClick={q.expand} style={S("border:none;background:transparent;padding:0;text-align:left;cursor:pointer;font-weight:600;font-size:15px;color:#1F1712;")}>
                      {q.name}
                    </button>
                    <div style={S("min-width:0;")}>
                      <div style={S("overflow:hidden;text-overflow:ellipsis;")}>
                        {q.email}
                      </div>
                      <div style={S("font-size:13px;color:#5E5249;")}>
                        {q.phone}
                      </div>
                    </div>
                    <span>
                      {q.services}
                    </span>
                    <span>
                      {q.budget}
                    </span>
                    <span style={S("color:#5E5249;")}>
                      {q.date}
                    </span>
                    <select value={q.status} onChange={q.onStatus} style={S(`border:none;border-radius:999px;padding:9px 12px;font-size:14px;font-weight:600;background:${q.sBg};color:#1F1712;cursor:pointer;outline:none;`)}>
                      <option value="New">
                        {"New"}
                      </option>
                      <option value="Contacted">
                        {"Contacted"}
                      </option>
                      <option value="Won">
                        {"Won"}
                      </option>
                      <option value="Lost">
                        {"Lost"}
                      </option>
                    </select>
                    <button onClick={q.remove} aria-label="Delete" style={S("width:36px;height:36px;border-radius:999px;border:none;background:#EAE3D6;cursor:pointer;font-size:18px;color:#1F1712;")}>
                      {"×"}
                    </button>
                  </div>
                  {q.open ? (
                    <>
                    <div style={S("padding:0 24px 20px;font-size:15px;line-height:1.55;color:#5E5249;max-width:760px;")}>
                      {q.message}
                    </div>
                    </>
                  ) : null}
                </div>
                </Fragment>
              ))}
              {v.noInquiries ? (
                <>
                <div style={S("padding:40px 24px;font-size:15px;color:#5E5249;")}>
                  {"No inquiries yet."}
                </div>
                </>
              ) : null}
            </div>
          </div>
          <p style={S("font-size:14px;color:#5E5249;margin-top:14px;")}>
            {"New messages from the contact page appear here. Click a name to read the message."}
          </p>
          </>
        ) : null}
        {v.tabProjects ? (
          <>
          <div style={S("background:#FAF7F1;border:1px solid rgba(31,23,18,.1);border-radius:24px;padding:8px 24px;")}>
            {(v.projectRows || []).map((p: any, p$i: number) => (
              <Fragment key={p$i}>
              <div style={S("display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:16px;padding:16px 0;border-bottom:1px solid rgba(31,23,18,.08);")}>
                <div style={S("display:flex;align-items:center;gap:16px;min-width:0;")}>
                  <span style={S("font-family:'JetBrains Mono',monospace;font-size:13px;width:24px;")}>
                    {p.num}
                  </span>
                  <div style={S(`width:56px;height:42px;border-radius:14px;background:repeating-linear-gradient(135deg,rgba(31,23,18,.07) 0 1px,transparent 1px 8px),${p.tint};flex:none;`)}></div>
                  <div style={S("min-width:0;")}>
                    <div style={S("font-weight:600;font-size:16px;")}>
                      {p.name}
                    </div>
                    <div style={S("font-size:14px;color:#5E5249;")}>
                      {p.type}
                    </div>
                  </div>
                </div>
                <div style={S("display:flex;align-items:center;gap:12px;")}>
                  <span style={S("font-size:14px;color:#5E5249;")}>
                    {p.visLabel}
                  </span>
                  <button onClick={p.toggle} aria-label="Toggle visibility" style={S(`width:52px;height:30px;border-radius:999px;border:none;cursor:pointer;background:${p.trackBg};position:relative;transition:background .25s;padding:0;`)}>
                    <span style={S(`position:absolute;top:3px;left:3px;width:24px;height:24px;border-radius:999px;background:#FAF7F1;transition:transform .25s;transform:${p.knob};`)}></span>
                  </button>
                </div>
              </div>
              </Fragment>
            ))}
          </div>
          </>
        ) : null}
        {v.tabExtra ? (
          <>
          <div>
            {v.extraContent}
          </div>
          </>
        ) : null}
        {v.tabServices ? (
          <>
          <div style={S("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:16px;")}>
            {(v.adminServices || []).map((s: any, s$i: number) => (
              <Fragment key={s$i}>
              <div style={S("background:#FAF7F1;border:1px solid rgba(31,23,18,.1);border-radius:24px;padding:24px;display:flex;flex-direction:column;gap:18px;")}>
                <div style={S("display:flex;justify-content:space-between;gap:12px;")}>
                  <div style={S("font-weight:700;font-size:18px;letter-spacing:-0.02em;")}>
                    {s.title}
                  </div>
                  <span style={S("font-family:'JetBrains Mono',monospace;font-size:13px;")}>
                    {s.n}
                  </span>
                </div>
                <div style={S("display:grid;grid-template-columns:1fr 1fr;gap:8px;")}>
                  <div style={S("background:#F3EEE4;border-radius:14px;padding:12px 14px;")}>
                    <div style={S("font-size:12px;color:#5E5249;")}>
                      {"BDT"}
                    </div>
                    <div style={S("font-weight:700;font-size:17px;")}>
                      {s.bdt}
                    </div>
                  </div>
                  <div style={S("background:#F3EEE4;border-radius:14px;padding:12px 14px;")}>
                    <div style={S("font-size:12px;color:#5E5249;")}>
                      {"USD"}
                    </div>
                    <div style={S("font-weight:700;font-size:17px;")}>
                      {s.usd}
                    </div>
                  </div>
                </div>
                <div style={S("font-size:14px;color:#5E5249;")}>
                  {s.from}{". "}{s.featureCount}{" features listed."}
                </div>
              </div>
              </Fragment>
            ))}
          </div>
          </>
        ) : null}
      </div>
    </div>
    </>
  );
}
