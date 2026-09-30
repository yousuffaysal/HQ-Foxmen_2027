import type { CSSProperties } from "react";

// Parses the design's inline CSS strings into React style objects, verbatim.
// Results are cached per string, so static styles are parsed once.
const cache = new Map<string, CSSProperties>();

const camel = (p: string) =>
  p.startsWith("--") ? p : p.replace(/^-(webkit|moz|ms)-/, (_, v: string) => v[0].toUpperCase() + v.slice(1) + "-").replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());

export function S(css: string): CSSProperties {
  const hit = cache.get(css);
  if (hit) return hit;
  const out: Record<string, string> = {};
  let depth = 0, quote = "", start = 0;
  const decls: string[] = [];
  for (let i = 0; i < css.length; i++) {
    const ch = css[i];
    if (quote) { if (ch === quote) quote = ""; continue; }
    if (ch === "'" || ch === '"') quote = ch;
    else if (ch === "(") depth++;
    else if (ch === ")") depth--;
    else if (ch === ";" && depth === 0) { decls.push(css.slice(start, i)); start = i + 1; }
  }
  decls.push(css.slice(start));
  for (const d of decls) {
    const k = d.indexOf(":");
    if (k < 0) continue;
    const prop = d.slice(0, k).trim(), val = d.slice(k + 1).trim();
    if (prop && val) out[camel(prop)] = val;
  }
  if (cache.size < 5000) cache.set(css, out);
  return out;
}
