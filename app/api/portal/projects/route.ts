import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { auth } from "@/lib/auth";

async function ensureTables() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id            SERIAL PRIMARY KEY,
      name          TEXT         NOT NULL,
      email         TEXT         NOT NULL UNIQUE,
      password_hash TEXT         NOT NULL,
      role          VARCHAR(20)  NOT NULL DEFAULT 'client',
      avatar        TEXT         NOT NULL DEFAULT '',
      created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS client_projects (
      id           SERIAL PRIMARY KEY,
      user_id      INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title        TEXT         NOT NULL,
      service_type TEXT         NOT NULL DEFAULT '',
      status       VARCHAR(30)  NOT NULL DEFAULT 'pending',
      description  TEXT         NOT NULL DEFAULT '',
      budget       TEXT         NOT NULL DEFAULT '',
      timeline     TEXT         NOT NULL DEFAULT '',
      website      TEXT         NOT NULL DEFAULT '',
      admin_note   TEXT         NOT NULL DEFAULT '',
      created_at   TIMESTAMPTZ  NOT NULL DEFAULT now(),
      updated_at   TIMESTAMPTZ  NOT NULL DEFAULT now()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS project_milestones (
      id           SERIAL PRIMARY KEY,
      project_id   INTEGER      NOT NULL REFERENCES client_projects(id) ON DELETE CASCADE,
      title        TEXT         NOT NULL,
      description  TEXT         NOT NULL DEFAULT '',
      status       VARCHAR(20)  NOT NULL DEFAULT 'pending',
      due_date     TEXT         NOT NULL DEFAULT '',
      completed_at TIMESTAMPTZ,
      ord          INTEGER      NOT NULL DEFAULT 0,
      created_at   TIMESTAMPTZ  NOT NULL DEFAULT now()
    )
  `;
}

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await ensureTables();

  const uid = (session.user as { id?: string }).id;
  const role = (session.user as { role?: string }).role;

  const projects = (role === "admin"
    ? await sql`SELECT p.*, u.name as user_name, u.email as user_email FROM client_projects p JOIN users u ON u.id = p.user_id ORDER BY p.updated_at DESC`
    : await sql`SELECT p.*, u.name as user_name, u.email as user_email FROM client_projects p JOIN users u ON u.id = p.user_id WHERE p.user_id = ${uid} ORDER BY p.updated_at DESC`) as Record<string, unknown>[];

  for (const p of projects) {
    p.milestones = await sql`SELECT * FROM project_milestones WHERE project_id = ${p.id} ORDER BY ord, created_at`;
  }
  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await ensureTables();

  const uid = (session.user as { id?: string }).id;
  const { title, service_type, description, budget, timeline, website } = await req.json();
  if (!title) return NextResponse.json({ error: "title required" }, { status: 400 });

  const rows = await sql`
    INSERT INTO client_projects (user_id, title, service_type, description, budget, timeline, website)
    VALUES (${uid}, ${title}, ${service_type ?? ""}, ${description ?? ""}, ${budget ?? ""}, ${timeline ?? ""}, ${website ?? ""})
    RETURNING *
  ` as Record<string, unknown>[];
  return NextResponse.json(rows[0], { status: 201 });
}
