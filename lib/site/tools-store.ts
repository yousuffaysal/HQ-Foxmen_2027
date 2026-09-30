import "server-only";
import { createHash } from "node:crypto";
import { unstable_cache } from "next/cache";
import { sql } from "@/lib/db";
import { AI_TOOLS, defaultToolSettings, type ToolSettings } from "./data";

// Per-tool product settings (price, on/off, run count) and the AI response cache.

let ready: Promise<void> | null = null;
function ensure() {
  ready ??= (async () => {
    await sql`
      CREATE TABLE IF NOT EXISTS site_tool_settings (
        id         TEXT PRIMARY KEY,
        enabled    BOOLEAN       NOT NULL DEFAULT true,
        price_usd  NUMERIC(10,2),
        price_bdt  NUMERIC(12,2),
        price_note TEXT          NOT NULL DEFAULT '',
        runs       INTEGER       NOT NULL DEFAULT 0
      )`;
    // Identical requests are answered from here instead of calling the model again.
    await sql`
      CREATE TABLE IF NOT EXISTS ai_cache (
        key        TEXT PRIMARY KEY,
        tool       TEXT        NOT NULL,
        output     TEXT        NOT NULL,
        hits       INTEGER     NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;
  })().catch(e => { ready = null; throw e; });
  return ready;
}

type Row = { id: string; enabled: boolean; price_usd: string | null; price_bdt: string | null; price_note: string; runs: number };

async function readSettings(): Promise<ToolSettings[]> {
  const byId = new Map<string, ToolSettings>();
  try {
    await ensure();
    for (const r of await sql`SELECT * FROM site_tool_settings` as Row[]) {
      byId.set(r.id, { id: r.id, enabled: r.enabled, priceUsd: r.price_usd === null ? null : Number(r.price_usd), priceBdt: r.price_bdt === null ? null : Number(r.price_bdt), priceNote: r.price_note, runs: r.runs });
    }
  } catch (e) {
    console.error("[tools] settings unavailable, using defaults", e);
  }
  return AI_TOOLS.map(t => byId.get(t.id) ?? defaultToolSettings(t.id));
}

export const TOOLS_TAG = "site-tools";
const cachedSettings = unstable_cache(readSettings, ["site-tool-settings"], { tags: [TOOLS_TAG], revalidate: 300 });

// Public pages read the cached copy; the admin and the AI route read live.
export const getToolSettings = ({ live = false } = {}) => (live ? readSettings() : cachedSettings());

export async function saveToolSettings(s: Omit<ToolSettings, "runs">) {
  await ensure();
  await sql`
    INSERT INTO site_tool_settings (id, enabled, price_usd, price_bdt, price_note)
    VALUES (${s.id}, ${s.enabled}, ${s.priceUsd}, ${s.priceBdt}, ${s.priceNote})
    ON CONFLICT (id) DO UPDATE SET enabled = EXCLUDED.enabled, price_usd = EXCLUDED.price_usd,
      price_bdt = EXCLUDED.price_bdt, price_note = EXCLUDED.price_note`;
}

export async function bumpToolRuns(id: string) {
  await ensure();
  await sql`
    INSERT INTO site_tool_settings (id, runs) VALUES (${id}, 1)
    ON CONFLICT (id) DO UPDATE SET runs = site_tool_settings.runs + 1`;
}

/* ── Response cache ────────────────────────────────────────────── */

// Normalised so trivial differences (case, spacing) still hit the cache.
export const cacheKey = (tool: string, len: number, input: string) =>
  createHash("sha256").update(`${tool}|${len}|${input.toLowerCase().replace(/\s+/g, " ").trim()}`).digest("hex");

export async function cacheGet(key: string): Promise<string | null> {
  try {
    await ensure();
    const rows = await sql`
      UPDATE ai_cache SET hits = hits + 1 WHERE key = ${key} AND created_at > now() - interval '14 days'
      RETURNING output` as { output: string }[];
    return rows[0]?.output ?? null;
  } catch {
    return null;
  }
}

export async function cachePut(key: string, tool: string, output: string) {
  await ensure();
  await sql`
    INSERT INTO ai_cache (key, tool, output) VALUES (${key}, ${tool}, ${output})
    ON CONFLICT (key) DO UPDATE SET output = EXCLUDED.output, created_at = now()`;
  // Keep the table small: drop entries past their useful life.
  if (Math.random() < 0.02) await sql`DELETE FROM ai_cache WHERE created_at < now() - interval '14 days'`;
}
