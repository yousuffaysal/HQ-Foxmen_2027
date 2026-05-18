import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { auth } from "@/lib/auth";
import { randomUUID } from "crypto";

async function ensureTables() {
  await sql`
    CREATE TABLE IF NOT EXISTS live_chats (
      id              SERIAL PRIMARY KEY,
      session_id      TEXT UNIQUE NOT NULL,
      visitor_name    TEXT NOT NULL DEFAULT 'Visitor',
      visitor_email   TEXT,
      user_id         INTEGER,
      status          VARCHAR(20) NOT NULL DEFAULT 'active',
      created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
      last_message_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS live_chat_messages (
      id          SERIAL PRIMARY KEY,
      chat_id     INTEGER NOT NULL REFERENCES live_chats(id) ON DELETE CASCADE,
      sender_type VARCHAR(20) NOT NULL DEFAULT 'visitor',
      sender_name TEXT NOT NULL,
      message     TEXT NOT NULL,
      read        BOOLEAN NOT NULL DEFAULT false,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
}

export async function POST(req: Request) {
  await ensureTables();
  const session = await auth().catch(() => null);
  const { session_id, visitor_name, visitor_email } = await req.json().catch(() => ({}));

  const userId = session?.user ? (session.user as { id?: string }).id : null;
  const name = visitor_name?.trim() || session?.user?.name || "Visitor";

  if (session_id) {
    const rows = await sql`SELECT * FROM live_chats WHERE session_id = ${session_id}`;
    if (rows[0]) {
      if (visitor_name?.trim() || visitor_email) {
        await sql`
          UPDATE live_chats
          SET visitor_name  = ${name},
              visitor_email = ${visitor_email ?? rows[0].visitor_email}
          WHERE session_id  = ${session_id}
        `;
      }
      return NextResponse.json({ ...rows[0], visitor_name: name });
    }
  }

  const newId = randomUUID();
  const rows = await sql`
    INSERT INTO live_chats (session_id, visitor_name, visitor_email, user_id)
    VALUES (${newId}, ${name}, ${visitor_email ?? null}, ${userId ?? null})
    RETURNING *
  `;
  return NextResponse.json(rows[0], { status: 201 });
}

export async function GET(req: Request) {
  await ensureTables();
  const { searchParams } = new URL(req.url);
  const session_id = searchParams.get("session_id");
  if (!session_id) return NextResponse.json({ error: "session_id required" }, { status: 400 });
  const rows = await sql`SELECT * FROM live_chats WHERE session_id = ${session_id}`;
  if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(rows[0]);
}
