import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
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
  const { service_name, name, email, company, description, budget, budget_custom, timeline, website } = await req.json();
  if (!name || !email) return NextResponse.json({ error: "name and email required" }, { status: 400 });
  const rows = await sql`
    INSERT INTO service_orders (service_name, name, email, company, description, budget, budget_custom, timeline, website)
    VALUES (${service_name ?? ""}, ${name}, ${email}, ${company ?? ""}, ${description ?? ""}, ${budget ?? ""}, ${budget_custom ?? ""}, ${timeline ?? ""}, ${website ?? ""})
    RETURNING *
  ` as Record<string, unknown>[];
  return NextResponse.json(rows[0], { status: 201 });
}

export async function PATCH(req: Request) {
  const { id, status } = await req.json();
  const rows = await sql`UPDATE service_orders SET status = ${status} WHERE id = ${id} RETURNING *` as Record<string, unknown>[];
  return NextResponse.json(rows[0]);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await sql`DELETE FROM service_orders WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}
