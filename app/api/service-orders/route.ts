import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { clientIp, rateLimit } from "@/lib/site/store";
import { str } from "@/lib/site/sanitize";

export async function GET() {
  const deny = await requireAdmin(); if (deny) return deny;
  await sql`
    CREATE TABLE IF NOT EXISTS service_orders (
      id           SERIAL PRIMARY KEY,
      service_name TEXT         NOT NULL DEFAULT '',
      name         TEXT         NOT NULL,
      email        TEXT         NOT NULL,
      company      TEXT         NOT NULL DEFAULT '',
      description  TEXT         NOT NULL DEFAULT '',
      budget       TEXT         NOT NULL DEFAULT '',
      budget_custom TEXT        NOT NULL DEFAULT '',
      timeline     TEXT         NOT NULL DEFAULT '',
      website      TEXT         NOT NULL DEFAULT '',
      status       VARCHAR(20)  NOT NULL DEFAULT 'new',
      submitted_at TIMESTAMPTZ  NOT NULL DEFAULT now()
    )
  `;
  const rows = await sql`SELECT * FROM service_orders ORDER BY submitted_at DESC`;
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  await sql`
    CREATE TABLE IF NOT EXISTS service_orders (
      id           SERIAL PRIMARY KEY,
      service_name TEXT         NOT NULL DEFAULT '',
      name         TEXT         NOT NULL,
      email        TEXT         NOT NULL,
      company      TEXT         NOT NULL DEFAULT '',
      description  TEXT         NOT NULL DEFAULT '',
      budget       TEXT         NOT NULL DEFAULT '',
      budget_custom TEXT        NOT NULL DEFAULT '',
      timeline     TEXT         NOT NULL DEFAULT '',
      website      TEXT         NOT NULL DEFAULT '',
      status       VARCHAR(20)  NOT NULL DEFAULT 'new',
      submitted_at TIMESTAMPTZ  NOT NULL DEFAULT now()
    )
  `;
  if (!(await rateLimit("service-order", clientIp(req), 5, 600))) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  const b = await req.json().catch(() => ({}));
  const [service_name, name, email, company, description, budget, budget_custom, timeline, website] =
    [str(b.service_name, 200), str(b.name, 120), str(b.email, 254), str(b.company, 160), str(b.description, 5000), str(b.budget, 60), str(b.budget_custom, 60), str(b.timeline, 60), str(b.website, 300)];
  if (!name || !email) return NextResponse.json({ error: "name and email required" }, { status: 400 });
  const rows = await sql`
    INSERT INTO service_orders (service_name, name, email, company, description, budget, budget_custom, timeline, website)
    VALUES (${service_name ?? ""}, ${name}, ${email}, ${company ?? ""}, ${description ?? ""}, ${budget ?? ""}, ${budget_custom ?? ""}, ${timeline ?? ""}, ${website ?? ""})
    RETURNING id
  ` as Record<string, unknown>[];
  return NextResponse.json(rows[0], { status: 201 });
}

export async function PATCH(req: Request) {
  const deny = await requireAdmin(); if (deny) return deny;
  const { id, status } = await req.json();
  const rows = await sql`UPDATE service_orders SET status = ${status} WHERE id = ${id} RETURNING *` as Record<string, unknown>[];
  return NextResponse.json(rows[0]);
}

export async function DELETE(req: Request) {
  const deny = await requireAdmin(); if (deny) return deny;
  const { id } = await req.json();
  await sql`DELETE FROM service_orders WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}
