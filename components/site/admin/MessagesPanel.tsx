"use client";
import { useState } from "react";
import { S } from "../style";
import { card, label, Pill, Empty } from "./ui";
import type { Inquiry } from "@/lib/site/store";

// Inbox view of everything visitors send (contact form + AI assistant messages).
export default function MessagesPanel({ items, narrow, onRead, onDelete }: {
  items: Inquiry[]; narrow: boolean;
  onRead: (id: number, read: boolean) => void; onDelete: (id: number) => void;
}) {
  const [sel, setSel] = useState<number | null>(items[0]?.id ?? null);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const shownItems = items.filter(m => filter === "all" || !m.isRead);
  const cur = items.find(m => m.id === sel) ?? null;

  const open = (m: Inquiry) => { setSel(m.id); if (!m.isRead) onRead(m.id, true); };

  if (!items.length) return <Empty>No messages yet. Messages from the contact page and the AI assistant appear here.</Empty>;

  const row = (k: string, v: string) => v ? (
    <div style={S("padding:10px 0;border-top:1px solid rgba(31,23,18,.08);display:grid;grid-template-columns:110px minmax(0,1fr);gap:12px;font-size:15px;")}>
      <span style={S("color:#5E5249;")}>{k}</span><span style={S("overflow-wrap:anywhere;")}>{v}</span>
    </div>
  ) : null;

  return (
    <div style={S(`display:grid;grid-template-columns:${narrow ? "minmax(0,1fr)" : "minmax(0,360px) minmax(0,1fr)"};gap:16px;align-items:start;`)}>
      <div style={S(card + "padding:8px;")}>
        <div style={S("display:flex;gap:4px;padding:6px;")}>
          {(["all", "unread"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={S(`border:none;cursor:pointer;padding:8px 14px;border-radius:999px;font-size:13px;font-weight:600;background:${filter === f ? "#1F1712" : "transparent"};color:${filter === f ? "#F3EEE4" : "#1F1712"};`)}>
              {f === "all" ? `All (${items.length})` : `Unread (${items.filter(m => !m.isRead).length})`}
            </button>
          ))}
        </div>
        <div style={S("max-height:70vh;overflow:auto;")} data-lenis-prevent="1">
          {shownItems.map(m => (
            <button key={m.id} onClick={() => open(m)} style={S(`display:block;width:100%;text-align:left;border:none;cursor:pointer;padding:14px 14px;border-radius:16px;margin-top:2px;background:${sel === m.id ? "#EAE3D6" : "transparent"};color:#1F1712;`)}>
              <div style={S("display:flex;align-items:center;gap:8px;")}>
                {!m.isRead ? <span style={S("width:8px;height:8px;border-radius:999px;background:#B86CF9;flex:none;")}></span> : null}
                <span style={S(`font-size:15px;font-weight:${m.isRead ? 500 : 700};overflow:hidden;text-overflow:ellipsis;white-space:nowrap;`)}>{m.name}</span>
                <span style={S("margin-left:auto;font-size:12px;color:#5E5249;white-space:nowrap;")}>{m.date.slice(0, 10)}</span>
              </div>
              <div style={S("font-size:13px;color:#5E5249;margin-top:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;")}>{m.message}</div>
              <div style={S("font-size:11px;font-weight:600;margin-top:6px;color:#8F8278;")}>{m.source}</div>
            </button>
          ))}
          {!shownItems.length ? <div style={S("padding:20px 14px;font-size:14px;color:#5E5249;")}>All caught up.</div> : null}
        </div>
      </div>

      {cur ? (
        <div style={S(card + "padding:clamp(20px,3vw,32px);")}>
          <div style={S("display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:18px;")}>
            <div>
              <div style={S(label + "margin-bottom:6px;")}>{cur.source} · {cur.date}</div>
              <div style={S("font-size:clamp(24px,2.4vw,32px);font-weight:800;letter-spacing:-0.04em;")}>{cur.name}</div>
            </div>
            <div style={S("display:flex;gap:8px;flex-wrap:wrap;")}>
              <a href={`mailto:${cur.email}?subject=${encodeURIComponent("Re: your message to Foxmen Studio")}`} style={S("padding:10px 18px;border-radius:999px;font-size:14px;font-weight:600;background:#1F1712;color:#F3EEE4;")}>Reply by email</a>
              <Pill dark={false} onClick={() => onRead(cur.id, !cur.isRead)}>{cur.isRead ? "Mark unread" : "Mark read"}</Pill>
              <Pill dark={false} onClick={() => { if (confirm(`Delete the message from ${cur.name}?`)) { onDelete(cur.id); setSel(null); } }}>Delete</Pill>
            </div>
          </div>
          <div style={S("background:#F3EEE4;border-radius:18px;padding:18px 20px;font-size:16px;line-height:1.65;white-space:pre-wrap;overflow-wrap:anywhere;margin-bottom:16px;")}>{cur.message}</div>
          {row("Email", cur.email)}{row("Phone", cur.phone)}{row("Business", cur.company)}{row("Needs", cur.services)}{row("Budget", cur.budget)}{row("Status", cur.status)}
        </div>
      ) : <Empty>Select a message to read it.</Empty>}
    </div>
  );
}
