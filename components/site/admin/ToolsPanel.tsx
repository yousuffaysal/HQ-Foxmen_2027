"use client";
import { useState } from "react";
import { S } from "../style";
import { call, card, field, label, Pill, Toggle } from "./ui";
import { AI_TOOLS, type ToolSettings } from "@/lib/site/data";

type Row = ToolSettings & { usdText: string; bdtText: string; dirty: boolean; saving: boolean };
const toRow = (s: ToolSettings): Row => ({ ...s, usdText: s.priceUsd === null ? "" : String(s.priceUsd), bdtText: s.priceBdt === null ? "" : String(s.priceBdt), dirty: false, saving: false });

// AI tools as products: price (shown on each tool page), on/off switch and usage.
export default function ToolsPanel({ items, onError }: { items: ToolSettings[]; onError: (m: string) => void }) {
  const [rows, setRows] = useState<Row[]>(items.map(toRow));
  const patch = (id: string, p: Partial<Row>) => setRows(r => r.map(x => (x.id === id ? { ...x, ...p } : x)));

  const save = async (row: Row, over: Partial<Row> = {}) => {
    const r = { ...row, ...over };
    patch(r.id, { ...over, saving: true });
    try {
      const s = await call<ToolSettings>("/api/site/admin/tools", "PUT", { id: r.id, enabled: r.enabled, priceUsd: r.usdText, priceBdt: r.bdtText, priceNote: r.priceNote });
      patch(r.id, { ...toRow(s) });
    } catch (e) {
      patch(r.id, { saving: false, ...(over.enabled !== undefined ? { enabled: row.enabled } : {}) });
      if ((e as Error).message !== "auth") onError((e as Error).message);
    }
  };

  const total = rows.reduce((a, r) => a + r.runs, 0);
  return (
    <>
      <div style={S("font-size:15px;color:#5E5249;margin-bottom:16px;max-width:760px;line-height:1.55;")}>
        Each tool has its own product page. Leave a price empty to show it as Free. Prices are displayed on the page; taking payments needs a payment gateway, which can be added later. {total} runs in total.
      </div>
      <div style={S("display:flex;flex-direction:column;gap:12px;")}>
        {rows.map((r, i) => {
          const t = AI_TOOLS.find(x => x.id === r.id)!;
          return (
            <div key={r.id} style={S(card + `padding:20px 24px;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,150px),1fr));gap:14px 18px;align-items:end;opacity:${r.enabled ? "1" : ".6"};`)}>
              <div style={S("grid-column:span 2;min-width:0;")}>
                <div style={S("display:flex;align-items:center;gap:10px;")}>
                  <span style={S("font-family:'JetBrains Mono',monospace;font-size:13px;")}>{String(i + 1).padStart(2, "0")}</span>
                  <a href={`/tools/${t.slug}`} target="_blank" rel="noopener" style={S("font-weight:700;font-size:17px;letter-spacing:-0.02em;")}>{t.name} ↗</a>
                </div>
                <div style={S("font-size:13px;color:#5E5249;margin-top:4px;")}>{t.cat} · {t.tier === "fast" ? "Fast model" : "Smart model"} · {r.runs} runs</div>
              </div>
              <label style={S("display:flex;flex-direction:column;gap:6px;")}><span style={S(label)}>Price USD</span>
                <input inputMode="decimal" placeholder="Free" value={r.usdText} onChange={e => patch(r.id, { usdText: e.target.value, dirty: true })} style={S(field + "padding:10px 12px;")} /></label>
              <label style={S("display:flex;flex-direction:column;gap:6px;")}><span style={S(label)}>Price BDT</span>
                <input inputMode="decimal" placeholder="Free" value={r.bdtText} onChange={e => patch(r.id, { bdtText: e.target.value, dirty: true })} style={S(field + "padding:10px 12px;")} /></label>
              <label style={S("display:flex;flex-direction:column;gap:6px;")}><span style={S(label)}>Price note</span>
                <input maxLength={60} placeholder="per use" value={r.priceNote} onChange={e => patch(r.id, { priceNote: e.target.value, dirty: true })} style={S(field + "padding:10px 12px;")} /></label>
              <div style={S("display:flex;align-items:center;justify-content:flex-end;gap:12px;")}>
                <span style={S("display:flex;align-items:center;gap:8px;font-size:13px;color:#5E5249;")}><Toggle on={r.enabled} onClick={() => save(r, { enabled: !r.enabled })} label={`Enable ${t.name}`} />{r.enabled ? "On" : "Off"}</span>
                <Pill onClick={() => save(r)} disabled={!r.dirty || r.saving}>{r.saving ? "Saving..." : r.dirty ? "Save" : "Saved"}</Pill>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
