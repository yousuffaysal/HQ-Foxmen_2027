"use client";
import { S } from "../style";
import { card, label, Pill, Empty } from "./ui";
import { CONSULT_STATUSES } from "@/lib/site/data";
import type { Consultation } from "@/lib/site/store";

const BG: Record<string, string> = { Requested: "#B86CF9", Confirmed: "#CFE8D2", Done: "#EAE3D6", Cancelled: "#F1D9D2" };
export const consultRef = (id: number) => `FX-${String(id).padStart(4, "0")}`;

// Consultations booked through the AI assistant.
export default function ConsultationsPanel({ items, onStatus, onDelete }: {
  items: Consultation[]; onStatus: (id: number, s: string) => void; onDelete: (id: number) => void;
}) {
  if (!items.length) return <Empty>No consultations yet. When the AI assistant books a call, it shows up here.</Empty>;
  const kv = (k: string, v: string) => v ? (
    <div style={S("min-width:0;")}><div style={S(label + "margin-bottom:4px;")}>{k}</div><div style={S("font-size:15px;overflow-wrap:anywhere;")}>{v}</div></div>
  ) : null;
  return (
    <div style={S("display:flex;flex-direction:column;gap:12px;")}>
      {items.map(c => (
        <div key={c.id} style={S(card + "padding:clamp(18px,2.4vw,28px);display:flex;flex-direction:column;gap:18px;")}>
          <div style={S("display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-start;gap:12px;")}>
            <div>
              <div style={S("font-family:'JetBrains Mono',monospace;font-size:12px;color:#5E5249;margin-bottom:6px;")}>{consultRef(c.id)} · requested {c.created}</div>
              <div style={S("font-size:clamp(22px,2.2vw,30px);font-weight:800;letter-spacing:-0.04em;")}>{c.name}</div>
              <div style={S("font-size:15px;color:#5E5249;margin-top:4px;")}>{c.service}</div>
            </div>
            <div style={S("display:flex;align-items:center;gap:8px;flex-wrap:wrap;")}>
              <select value={c.status} onChange={e => onStatus(c.id, e.target.value)} aria-label="Status" style={S(`border:none;border-radius:999px;padding:9px 12px;font-size:14px;font-weight:600;background:${BG[c.status] || "#EAE3D6"};color:#1F1712;cursor:pointer;outline:none;`)}>
                {CONSULT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <a href={`mailto:${c.email}?subject=${encodeURIComponent(`Your Foxmen Studio consultation (${consultRef(c.id)})`)}`} style={S("padding:10px 18px;border-radius:999px;font-size:14px;font-weight:600;background:#1F1712;color:#F3EEE4;")}>Email client</a>
              <Pill dark={false} onClick={() => { if (confirm(`Delete the consultation with ${c.name}?`)) onDelete(c.id); }}>Delete</Pill>
            </div>
          </div>
          <div style={S("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,180px),1fr));gap:16px;padding:16px;border-radius:18px;background:#F3EEE4;")}>
            {kv("Preferred date", c.preferredDate)}{kv("Time", c.preferredTime)}{kv("Time zone", c.timezone)}
            {kv("Email", c.email)}{kv("Phone", c.phone)}{kv("Business", c.company)}{kv("Budget", c.budget)}
          </div>
          {c.notes ? <div style={S("font-size:15px;line-height:1.6;color:#5E5249;white-space:pre-wrap;")}>{c.notes}</div> : null}
        </div>
      ))}
    </div>
  );
}
