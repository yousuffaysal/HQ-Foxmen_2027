import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { auth } from "@/lib/auth";

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS notifications (
      id         SERIAL PRIMARY KEY,
      user_id    INTEGER      NOT NULL,
      type       VARCHAR(50)  NOT NULL,
      title      TEXT         NOT NULL,
      body       TEXT         NOT NULL DEFAULT '',
      link       TEXT         NOT NULL DEFAULT '',
      read       BOOLEAN      NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ  NOT NULL DEFAULT now()
    )
  `;
}

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await ensureTable();
  const uid = (session.user as { id?: string }).id;
  const rows = await sql`SELECT * FROM notifications WHERE user_id = ${uid} ORDER BY created_at DESC LIMIT 50`;
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const role = (session.user as { role?: string }).role;
  if (role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await ensureTable();

  const { user_id, type, title, body, link } = await req.json();
  const rows = await sql`
    INSERT INTO notifications (user_id, type, title, body, link)
    VALUES (${user_id}, ${type}, ${title}, ${body ?? ""}, ${link ?? ""})
    RETURNING *
  `;
  return NextResponse.json(rows[0], { status: 201 });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const uid = (session.user as { id?: string }).id;
  const { id, read_all } = await req.json();
  if (read_all) {
    await sql`UPDATE notifications SET read = true WHERE user_id = ${uid}`;
  } else {
    await sql`UPDATE notifications SET read = true WHERE id = ${id} AND user_id = ${uid}`;
  }
  return NextResponse.json({ ok: true });
}
