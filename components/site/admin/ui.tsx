"use client";
import type { ReactNode } from "react";
import { S } from "../style";

// Admin building blocks in the design's admin language (cream cards, ink pills, 24px radii).

export async function call<T = unknown>(url: string, method: string, body?: unknown): Promise<T> {
  const r = await fetch(url, { method, headers: body === undefined ? undefined : { "Content-Type": "application/json" }, body: body === undefined ? undefined : JSON.stringify(body) });
  if (r.status === 401 || r.status === 403) { window.location.href = "/login?from=/admin"; throw new Error("auth"); }
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error((d as { error?: string }).error || "Request failed");
  return d as T;
}

export const card = "background:#FAF7F1;border:1px solid rgba(31,23,18,.1);border-radius:24px;";
export const label = "font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#5E5249;";
export const field = "width:100%;border:1px solid rgba(31,23,18,.18);background:#F3EEE4;border-radius:14px;padding:12px 14px;font-size:15px;color:#1F1712;outline:none;font-family:Inter,sans-serif;";

export function Pill({ children, onClick, dark = true, disabled, type = "button" }: { children: ReactNode; onClick?: () => void; dark?: boolean; disabled?: boolean; type?: "button" | "submit" }) {
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={S(`border:none;cursor:pointer;padding:10px 18px;border-radius:999px;font-size:14px;font-weight:600;white-space:nowrap;opacity:${disabled ? ".5" : "1"};${dark ? "background:#1F1712;color:#F3EEE4;" : "background:transparent;color:#1F1712;box-shadow:inset 0 0 0 1px rgba(31,23,18,.2);"}`)}>
      {children}
    </button>
  );
}

export function Toggle({ on, onClick, label: l }: { on: boolean; onClick: () => void; label?: string }) {
  return (
    <button type="button" onClick={onClick} aria-label={l} aria-pressed={on} style={S(`width:52px;height:30px;border-radius:999px;border:none;cursor:pointer;background:${on ? "#1F1712" : "rgba(31,23,18,.2)"};position:relative;transition:background .25s;padding:0;flex:none;`)}>
      <span style={S(`position:absolute;top:3px;left:3px;width:24px;height:24px;border-radius:999px;background:#FAF7F1;transition:transform .25s;transform:${on ? "translateX(22px)" : "none"};`)}></span>
    </button>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <div style={S(card + "padding:40px 24px;font-size:15px;color:#5E5249;")}>{children}</div>;
}
