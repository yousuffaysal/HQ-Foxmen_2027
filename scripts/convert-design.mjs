// Regenerates components/site/views/*.tsx and hover.css from the design file:
//   node scripts/convert-design.mjs ["path/to/Foxmen Studio.dc.html"]
import fs from "node:fs";
import { parseDocument } from "htmlparser2";

const ROOT = new URL("..", import.meta.url).pathname;
const SRC = process.argv[2] || ROOT + "foxmen new/Foxmen Studio.dc.html";
const OUT = ROOT + "components/site/views";
let raw = fs.readFileSync(SRC, "utf8");
// Contact placeholders in the design -> real values (phone rows only when a phone is configured).
raw = raw
  .replace('[Email]<br>[Phone / WhatsApp]</div>', '{{ contactEmail }}<sc-if value="{{ contactPhone }}"><br>{{ contactPhone }}</sc-if></div>')
  .replace(/(<div style="display:flex;justify-content:space-between;gap:16px;padding:18px 0;border-bottom:1px solid rgba\(31,23,18,\.14\);font-size:17px;"><span style="color:#5E5249;">Phone \/ WhatsApp<\/span><span style="font-weight:600;">)\[Phone \/ WhatsApp\](<\/span><\/div>)/, '<sc-if value="{{ contactPhone }}">$1{{ contactPhone }}$2</sc-if>')
  .replace(/\[Email\]/g, '{{ contactEmail }}')
  .replace('<span style="font-size:17px;">[Phone / WhatsApp]</span>', '<sc-if value="{{ contactPhone }}"><span style="font-size:17px;">{{ contactPhone }}</span></sc-if>');
// Honeypot for bots (visually hidden, out of flex flow); the API drops submissions that fill it.
raw = raw.replace('<form onSubmit="{{ submitContact }}" style="display:flex;flex-direction:column;gap:22px;">', m => m + '<input name="website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0;">');
// Admin sidebar: a sign-out control under "Back to site", styled like it.
const back = '<a href="#/" onClick="{{ go.home }}" style="padding:12px 16px;border-radius:14px;font-size:15px;font-weight:600;box-shadow:inset 0 0 0 1px rgba(31,23,18,.15);flex:none;white-space:nowrap;">Back to site</a>';
if (!raw.includes(back)) throw new Error("admin back link not found");
raw = raw.replace(back, back + '<button onClick="{{ signOut }}" style="border:none;cursor:pointer;background:transparent;text-align:left;padding:12px 16px;border-radius:14px;font-size:15px;font-weight:600;color:#5E5249;flex:none;white-space:nowrap;">Sign out</button>');
// Live project data: counts, uploaded screenshots in the deck browser frame.
const rep = (a, b) => { if (!raw.includes(a)) throw new Error("anchor not found: " + a.slice(0, 60)); raw = raw.replace(a, b); };
rep('label="All 13 projects"', 'label="All {{ projCount }} projects"');
rep('padding-bottom:14px;">/ 06</span>', 'padding-bottom:14px;">/ {{ featCount }}</span>');
rep('<div style="flex:1;display:flex;align-items:center;justify-content:center;background:repeating-linear-gradient(135deg,rgba(31,23,18,.05) 0 1px,transparent 1px 10px);font-family:\'JetBrains Mono\',monospace;font-size:12px;color:#5E5249;">screenshot</div>',
    '<div style="flex:1;position:relative;min-height:0;display:flex;align-items:center;justify-content:center;background:repeating-linear-gradient(135deg,rgba(31,23,18,.05) 0 1px,transparent 1px 10px);font-family:\'JetBrains Mono\',monospace;font-size:12px;color:#5E5249;">{{ p.shotText }}<sc-if value="{{ p.heroImage }}"><img src="{{ p.heroImage }}" alt="{{ p.name }}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:top;"></sc-if></div>');
// Admin: slot for tabs the design doesn't have (messages, consultations, project editor).
rep('<sc-if value="{{ tabServices }}"', '<sc-if value="{{ tabExtra }}"><div>{{ extraContent }}</div></sc-if>\n    <sc-if value="{{ tabServices }}"');
// No public link to the admin panel (it stays reachable at /admin for signed-in admins).
rep('<a href="#/admin" onClick="{{ go.admin }}" style="color:#F3EEE4;">Admin</a>', '');
// Hero: "Clutch Verified" badge beside the studio pill (links to the profile once CLUTCH_URL is set).
rep('Web, AI and custom software studio\n      </div>', 'Web, AI and custom software studio\n      </div>'
  + '<sc-if value="{{ clutchHref }}"><a data-reveal="1" data-delay="80" href="{{ clutchHref }}" target="_blank" rel="noopener" aria-label="Foxmen Studio is verified on Clutch" style="display:inline-flex;align-items:center;gap:10px;margin-left:8px;padding:8px 16px 8px 8px;border-radius:999px;background:#1F1712;color:#F3EEE4;font-size:14px;font-weight:600;margin-bottom:clamp(24px,4vh,40px);vertical-align:top;"><span style="width:22px;height:22px;border-radius:999px;background:#B86CF9;display:flex;align-items:center;justify-content:center;flex:none;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1F1712" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"></path></svg></span><span style="font-weight:800;font-size:15px;letter-spacing:-0.035em;">Clutch<span style="color:#EF4335;">.</span></span><span style="color:rgba(243,238,228,.72);">Verified agency</span></a></sc-if>'
  + '<sc-if value="{{ noClutchHref }}"><span data-reveal="1" data-delay="80" style="display:inline-flex;align-items:center;gap:10px;margin-left:8px;padding:8px 16px 8px 8px;border-radius:999px;background:#1F1712;color:#F3EEE4;font-size:14px;font-weight:600;margin-bottom:clamp(24px,4vh,40px);vertical-align:top;"><span style="width:22px;height:22px;border-radius:999px;background:#B86CF9;display:flex;align-items:center;justify-content:center;flex:none;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1F1712" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"></path></svg></span><span style="font-weight:800;font-size:15px;letter-spacing:-0.035em;">Clutch<span style="color:#EF4335;">.</span></span><span style="color:rgba(243,238,228,.72);">Verified agency</span></span></sc-if>');
// Tools hub: waiting animation slot shown while the AI is working.
rep('<sc-if value="{{ hasOut }}" hint-placeholder-val="{{ false }}">\n        <div style="margin-top:28px;background:#FAF7F1;', '<sc-if value="{{ showLoader }}"><div style="margin-top:28px;">{{ loaderNode }}</div></sc-if>\n      <sc-if value="{{ hasOut }}" hint-placeholder-val="{{ false }}">\n        <div style="margin-top:28px;background:#FAF7F1;');
if (raw.includes("[Phone")) throw new Error("unhandled phone placeholder");
const lines = raw.split("\n");
const slice = (a, b) => lines.slice(a - 1, b).join("\n");

const SECTIONS = [
  ["HeaderView", 41, 71],
  ["HomeView", 153, 583],
  ["AboutView", 588, 762],
  ["ServicesView", 767, 825],
  ["CaseView", 830, 891],
  ["WorkView", 896, 941],
  ["ToolsView", 946, 1097],
  ["ContactView", 1102, 1158],
  ["FooterView", 1163, 1193],
  ["AdminView", 1198, 1296],
];

const hover = new Map(); // css -> class
const hoverClass = css => {
  if (!hover.has(css)) hover.set(css, "hv" + (hover.size + 1));
  return hover.get(css);
};

const ATTR_MAP = {
  class: "className", for: "htmlFor", autoplay: "autoPlay", playsinline: "playsInline", tabindex: "tabIndex",
  "stroke-width": "strokeWidth", "stroke-linecap": "strokeLinecap", "stroke-linejoin": "strokeLinejoin",
  "fill-rule": "fillRule", "clip-rule": "clipRule", viewbox: "viewBox", readonly: "readOnly", autocomplete: "autoComplete", maxlength: "maxLength",
};
const BOOL = new Set(["autoplay", "muted", "loop", "playsinline", "required", "disabled", "checked"]);
const VOID = new Set(["img", "input", "br", "hr", "source", "meta", "link"]);

function exprOf(raw, scope) {
  const e = raw.trim();
  return e.replace(/^([A-Za-z_$][\w$]*)/, m => (scope.has(m) ? m : "v." + m));
}
const MUST = /\{\{\s*([^}]+?)\s*\}\}/g;
// attribute value -> JS expression string
function valueExpr(val, scope, { path = false } = {}) {
  const fix = s => (path ? fixPath(s) : s);
  const only = val.match(/^\{\{\s*([^}]+?)\s*\}\}$/);
  if (only) return exprOf(only[1], scope);
  if (!MUST.test(val)) return JSON.stringify(fix(val));
  MUST.lastIndex = 0;
  const t = fix(val).replace(/`/g, "\\`").replace(MUST, (_, e) => "${" + exprOf(e, scope) + "}");
  return "`" + t + "`";
}
function fixPath(s) {
  return s
    .replace(/^#\/$/, "/")
    .replace(/^#\/(.+)$/, "/$1")
    .replace(/(^|[("' ])assets\//g, "$1/assets/");
}

function attrs(el, scope) {
  const out = [];
  let cls = [];
  for (const [k0, val] of Object.entries(el.attribs)) {
    const k = k0;
    if (k.startsWith("hint-")) continue;
    if (!/^[a-zA-Z][\w:-]*$/.test(k)) continue; // junk from malformed quotes (browser ignores these too)
    if (k === "style") {
      const e = valueExpr(fixPath(val), scope);
      out.push(`style={S(${e})}`);
      continue;
    }
    if (k === "style-hover") { cls.push(hoverClass(val)); continue; }
    if (k === "class") { cls.push(val); continue; }
    if (/^on[A-Z]/.test(k) || k === "ref") { out.push(`${k}={${valueExpr(val, scope)}}`); continue; }
    if (BOOL.has(k.toLowerCase())) { out.push(ATTR_MAP[k.toLowerCase()] || k); continue; }
    const name = ATTR_MAP[k.toLowerCase()] || k;
    if (k === "rows" || k === "tabindex") { out.push(`${name}={${+val}}`); continue; }
    if (k === "value" && !MUST.test(val)) { MUST.lastIndex = 0; out.push(`value=${JSON.stringify(val)}`); continue; }
    MUST.lastIndex = 0;
    const e = valueExpr(val, scope, { path: k === "href" || k === "src" });
    out.push(e.startsWith('"') ? `${name}=${e}` : `${name}={${e}}`);
  }
  if (cls.length) out.push(`className=${JSON.stringify(cls.join(" "))}`);
  return out.length ? " " + out.join(" ") : "";
}

function text(t, scope) {
  if (!t.trim()) return t.includes("\n") ? "" : "{\" \"}";
  let body = t;
  if (/^\s*\n/.test(body)) body = body.replace(/^\s+/, "");
  if (/\n\s*$/.test(body)) body = body.replace(/\s+$/, "");
  const collapsed = body.replace(/\s+/g, " ");
  const parts = [];
  let last = 0; let m;
  const re = /\{\{\s*([^}]+?)\s*\}\}/g;
  while ((m = re.exec(collapsed))) {
    if (m.index > last) parts.push(JSON.stringify(collapsed.slice(last, m.index)));
    parts.push(exprOf(m[1], scope));
    last = re.lastIndex;
  }
  if (last < collapsed.length) parts.push(JSON.stringify(collapsed.slice(last)));
  return parts.map(p => "{" + p + "}").join("");
}

function node(n, scope, ind) {
  const pad = "  ".repeat(ind);
  if (n.type === "text") { const t = text(n.data, scope); return t ? pad + t : ""; }
  if (n.type === "comment") return pad + `{/* ${n.data.trim()} */}`;
  if (n.type !== "tag") return "";
  const tag = n.name;
  const kids = s => n.children.map(c => node(c, s, ind + 1)).filter(Boolean).join("\n");
  if (tag === "sc-for") {
    const list = valueExpr(n.attribs.list, scope), as = n.attribs.as;
    const s2 = new Set(scope); s2.add(as);
    return `${pad}{(${list} || []).map((${as}: any, ${as}$i: number) => (\n${pad}  <Fragment key={${as}$i}>\n${kids(s2)}\n${pad}  </Fragment>\n${pad}))}`;
  }
  if (tag === "sc-if") {
    const c = valueExpr(n.attribs.value, scope);
    return `${pad}{${c} ? (\n${pad}  <>\n${kids(scope)}\n${pad}  </>\n${pad}) : null}`;
  }
  if (tag === "dc-import") {
    const a = n.attribs;
    const lab = valueExpr(a.label, scope);
    const p = [lab.startsWith('"') ? `label=${lab}` : `label={${lab}}`, `variant=${JSON.stringify(a.variant)}`];
    if (a.href) p.push(`href=${JSON.stringify(fixPath(a.href))}`);
    if (a["on-click"]) p.push(`onClick={${valueExpr(a["on-click"], scope)}}`);
    return `${pad}<Btn ${p.join(" ")} />`;
  }
  if (tag === "image-slot") {
    const id = valueExpr(n.attribs.id, scope);
    return `${pad}<ImageSlot id={${id}} src={v.slots?.[${id}]} placeholder={${valueExpr(n.attribs.placeholder || "", scope)}} />`;
  }
  const a = attrs(n, scope);
  if (VOID.has(tag)) return `${pad}<${tag}${a} />`;
  const inner = kids(scope);
  if (!inner.trim()) return `${pad}<${tag}${a}></${tag}>`;
  return `${pad}<${tag}${a}>\n${inner}\n${pad}</${tag}>`;
}

fs.mkdirSync(OUT, { recursive: true });
for (const [name, a, b] of SECTIONS) {
  const html = slice(a, b);
  const doc = parseDocument(html, { lowerCaseAttributeNames: false, lowerCaseTags: true, recognizeSelfClosing: true, decodeEntities: true });
  const body = doc.children.map(c => node(c, new Set(), 2)).filter(Boolean).join("\n");
  const file = `/* eslint-disable */
// GENERATED from "foxmen new/Foxmen Studio.dc.html" by the design converter. Markup and
// inline styles are kept 1:1 with the design; behaviour lives in the page components.
"use client";
import { Fragment } from "react";
import { S } from "../style";
import Btn from "../Btn";
import ImageSlot from "../ImageSlot";

export default function ${name}({ v }: { v: any }) {
  return (
    <>
${body}
    </>
  );
}
`;
  fs.writeFileSync(`${OUT}/${name}.tsx`, file);
  console.log(name, file.length);
}
const css = [...hover].map(([decl, c]) => `.${c}:hover{${decl.split(";").filter(Boolean).map(d => d.trim() + "!important").join(";")}}`).join("\n");
fs.writeFileSync(ROOT + "components/site/hover.css", "/* GENERATED: style-hover rules from the design */\n" + css + "\n");
console.log("hover rules", hover.size);
