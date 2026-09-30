import "server-only";
import { createHash } from "node:crypto";
import { sql } from "@/lib/db";
import { PROJECT_SLUGS } from "./data";

// Persistence for the redesigned site. Tables are created on first use so a fresh
// database works without a manual migration step.

let ready: Promise<void> | null = null;
export function ensureSiteTables() {
  ready ??= (async () => {
    await sql`
      CREATE TABLE IF NOT EXISTS site_inquiries (
        id          SERIAL PRIMARY KEY,
        name        TEXT        NOT NULL,
        email       TEXT        NOT NULL,
        phone       TEXT        NOT NULL DEFAULT '',
        company     TEXT        NOT NULL DEFAULT '',
        services    TEXT        NOT NULL DEFAULT '',
        budget      TEXT        NOT NULL DEFAULT '',
        message     TEXT        NOT NULL DEFAULT '',
        status      VARCHAR(20) NOT NULL DEFAULT 'New',
        created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;
    await sql`
      CREATE TABLE IF NOT EXISTS rate_limits (
        key          TEXT PRIMARY KEY,
        count        INTEGER     NOT NULL DEFAULT 0,
        window_start TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;
  })().catch(e => { ready = null; throw e; });
  return ready;
}

/* ── Rate limiting ─────────────────────────────────────────────── */

export function clientIp(req: Request) {
  const h = req.headers;
  return (h.get("x-real-ip") || h.get("x-forwarded-for")?.split(",")[0] || "unknown").trim();
}

// Fixed-window limiter shared by all serverless instances. The IP is hashed so no raw
// addresses are stored. Returns true when the call is allowed.
export async function rateLimit(bucket: string, ip: string, limit: number, windowSec: number) {
  await ensureSiteTables();
  const key = bucket + ":" + createHash("sha256").update(ip + (process.env.NEXTAUTH_SECRET ?? "")).digest("hex").slice(0, 32);
  const rows = await sql`
    INSERT INTO rate_limits (key, count, window_start) VALUES (${key}, 1, now())
    ON CONFLICT (key) DO UPDATE SET
      count        = CASE WHEN rate_limits.window_start < now() - (${windowSec}::int * interval '1 second') THEN 1 ELSE rate_limits.count + 1 END,
      window_start = CASE WHEN rate_limits.window_start < now() - (${windowSec}::int * interval '1 second') THEN now() ELSE rate_limits.window_start END
    RETURNING count` as { count: number }[];
  return (rows[0]?.count ?? 1) <= limit;
}

/* ── Inquiries ─────────────────────────────────────────────────── */

export type Inquiry = {
  id: number; name: string; email: string; phone: string; company: string;
  services: string; budget: string; message: string; status: string; date: string;
};

export async function addInquiry(q: Omit<Inquiry, "id" | "status" | "date">) {
  await ensureSiteTables();
  const rows = await sql`
    INSERT INTO site_inquiries (name, email, phone, company, services, budget, message)
    VALUES (${q.name}, ${q.email}, ${q.phone}, ${q.company}, ${q.services}, ${q.budget}, ${q.message})
    RETURNING id` as { id: number }[];
  return rows[0].id;
}

export async function listInquiries(): Promise<Inquiry[]> {
  await ensureSiteTables();
  const rows = await sql`
    SELECT id, name, email, phone, company, services, budget, message, status,
           to_char(created_at, 'YYYY-MM-DD') AS date
    FROM site_inquiries ORDER BY created_at DESC, id DESC LIMIT 500`;
  return rows as Inquiry[];
}

export async function setInquiryStatus(id: number, status: string) {
  await ensureSiteTables();
  const rows = await sql`UPDATE site_inquiries SET status = ${status} WHERE id = ${id} RETURNING id` as unknown[];
  return rows.length > 0;
}

export async function deleteInquiry(id: number) {
  await ensureSiteTables();
  const rows = await sql`DELETE FROM site_inquiries WHERE id = ${id} RETURNING id` as unknown[];
  return rows.length > 0;
}

/* ── Settings-backed values ────────────────────────────────────── */

// Slugs of projects hidden from the Work page (admin → Projects toggle).
export async function getHiddenProjects(): Promise<string[]> {
  try {
    const rows = await sql`SELECT value FROM settings WHERE key = 'site_hidden_projects'` as { value: string }[];
    const v = rows[0] ? JSON.parse(rows[0].value) : [];
    return Array.isArray(v) ? v.filter((s): s is string => PROJECT_SLUGS.includes(s)) : [];
  } catch {
    return []; // DB unreachable: show everything rather than fail the page
  }
}

export async function setHiddenProjects(slugs: string[]) {
  const clean = [...new Set(slugs.filter(s => PROJECT_SLUGS.includes(s)))];
  await sql`
    INSERT INTO settings (key, value) VALUES ('site_hidden_projects', ${JSON.stringify(clean)})
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`;
  return clean;
}

export async function getAiRuns(): Promise<number> {
  try {
    const rows = await sql`SELECT value FROM settings WHERE key = 'site_ai_runs'` as { value: string }[];
    return rows[0] ? parseInt(rows[0].value, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

export async function bumpAiRuns() {
  await sql`
    INSERT INTO settings (key, value) VALUES ('site_ai_runs', '1')
    ON CONFLICT (key) DO UPDATE SET value = ((COALESCE(NULLIF(settings.value, ''), '0'))::int + 1)::text`;
}
