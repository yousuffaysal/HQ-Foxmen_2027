import "server-only";
import { createHash } from "node:crypto";
import { sql } from "@/lib/db";

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
    await sql`ALTER TABLE site_inquiries ADD COLUMN IF NOT EXISTS is_read BOOLEAN NOT NULL DEFAULT false`;
    await sql`ALTER TABLE site_inquiries ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'Contact form'`;
    await sql`
      CREATE TABLE IF NOT EXISTS site_consultations (
        id             SERIAL PRIMARY KEY,
        name           TEXT        NOT NULL,
        email          TEXT        NOT NULL,
        phone          TEXT        NOT NULL DEFAULT '',
        company        TEXT        NOT NULL DEFAULT '',
        service        TEXT        NOT NULL DEFAULT '',
        budget         TEXT        NOT NULL DEFAULT '',
        preferred_date TEXT        NOT NULL DEFAULT '',
        preferred_time TEXT        NOT NULL DEFAULT '',
        timezone       TEXT        NOT NULL DEFAULT '',
        notes          TEXT        NOT NULL DEFAULT '',
        status         VARCHAR(20) NOT NULL DEFAULT 'Requested',
        created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
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
  isRead: boolean; source: string;
};

export async function addInquiry(q: Omit<Inquiry, "id" | "status" | "date" | "isRead" | "source">, source = "Contact form") {
  await ensureSiteTables();
  const rows = await sql`
    INSERT INTO site_inquiries (name, email, phone, company, services, budget, message, source)
    VALUES (${q.name}, ${q.email}, ${q.phone}, ${q.company}, ${q.services}, ${q.budget}, ${q.message}, ${source})
    RETURNING id` as { id: number }[];
  return rows[0].id;
}

export async function listInquiries(): Promise<Inquiry[]> {
  await ensureSiteTables();
  const rows = await sql`
    SELECT id, name, email, phone, company, services, budget, message, status, source,
           is_read AS "isRead", to_char(created_at, 'YYYY-MM-DD HH24:MI') AS date
    FROM site_inquiries ORDER BY created_at DESC, id DESC LIMIT 500`;
  return rows as Inquiry[];
}

// True when this email sent the same message in the last 30 minutes (assistant retries).
export async function recentMessage(email: string, message: string) {
  await ensureSiteTables();
  return (await sql`SELECT 1 FROM site_inquiries WHERE lower(email) = lower(${email}) AND message = ${message}
    AND created_at > now() - interval '30 minutes' LIMIT 1` as unknown[]).length > 0;
}

export async function setInquiryStatus(id: number, status: string) {
  await ensureSiteTables();
  const rows = await sql`UPDATE site_inquiries SET status = ${status} WHERE id = ${id} RETURNING id` as unknown[];
  return rows.length > 0;
}

export async function setInquiryRead(id: number, read: boolean) {
  await ensureSiteTables();
  return (await sql`UPDATE site_inquiries SET is_read = ${read} WHERE id = ${id} RETURNING id` as unknown[]).length > 0;
}

export async function deleteInquiry(id: number) {
  await ensureSiteTables();
  const rows = await sql`DELETE FROM site_inquiries WHERE id = ${id} RETURNING id` as unknown[];
  return rows.length > 0;
}

/* ── Consultations (booked by the AI assistant) ────────────────── */

export type Consultation = {
  id: number; name: string; email: string; phone: string; company: string; service: string; budget: string;
  preferredDate: string; preferredTime: string; timezone: string; notes: string; status: string; created: string;
};

export async function addConsultation(c: Omit<Consultation, "id" | "status" | "created">) {
  await ensureSiteTables();
  // The same client booking again within 30 minutes updates their request instead of duplicating it.
  const existing = await sql`
    SELECT id FROM site_consultations WHERE lower(email) = lower(${c.email}) AND status = 'Requested'
      AND created_at > now() - interval '30 minutes' ORDER BY id DESC LIMIT 1` as { id: number }[];
  if (existing[0]) {
    await sql`
      UPDATE site_consultations SET name = ${c.name}, phone = ${c.phone}, company = ${c.company}, service = ${c.service},
        budget = ${c.budget}, preferred_date = ${c.preferredDate}, preferred_time = ${c.preferredTime},
        timezone = ${c.timezone}, notes = ${c.notes}
      WHERE id = ${existing[0].id}`;
    return existing[0].id;
  }
  const rows = await sql`
    INSERT INTO site_consultations (name, email, phone, company, service, budget, preferred_date, preferred_time, timezone, notes)
    VALUES (${c.name}, ${c.email}, ${c.phone}, ${c.company}, ${c.service}, ${c.budget}, ${c.preferredDate}, ${c.preferredTime}, ${c.timezone}, ${c.notes})
    RETURNING id` as { id: number }[];
  return rows[0].id;
}

export async function listConsultations(): Promise<Consultation[]> {
  await ensureSiteTables();
  return await sql`
    SELECT id, name, email, phone, company, service, budget, preferred_date AS "preferredDate", preferred_time AS "preferredTime",
           timezone, notes, status, to_char(created_at, 'YYYY-MM-DD HH24:MI') AS created
    FROM site_consultations ORDER BY created_at DESC LIMIT 500` as Consultation[];
}

export async function setConsultationStatus(id: number, status: string) {
  await ensureSiteTables();
  return (await sql`UPDATE site_consultations SET status = ${status} WHERE id = ${id} RETURNING id` as unknown[]).length > 0;
}

export async function deleteConsultation(id: number) {
  await ensureSiteTables();
  return (await sql`DELETE FROM site_consultations WHERE id = ${id} RETURNING id` as unknown[]).length > 0;
}

/* ── Settings-backed values ────────────────────────────────────── */

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
