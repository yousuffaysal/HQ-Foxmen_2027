import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { sql } from "@/lib/db";
import { sendWelcomeEmail } from "@/lib/welcome-email";

async function ensureUsersTable() {
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
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS fox_id TEXT UNIQUE`.catch(() => {});
}

async function assignFoxId(userId: number): Promise<string> {
  const existing = await sql`SELECT fox_id FROM users WHERE id = ${userId}`;
  if (existing[0]?.fox_id) return existing[0].fox_id as string;
  for (let i = 0; i < 10; i++) {
    const fid = "FXM-" + randomBytes(3).toString("hex").toUpperCase();
    const ok = await sql`UPDATE users SET fox_id = ${fid} WHERE id = ${userId} AND fox_id IS NULL`.catch(() => null);
    if (ok) return fid;
  }
  return "";
}

export async function POST(req: Request) {
  await ensureUsersTable();
  const { name, email, password } = await req.json();
  if (!name || !email || !password)
    return NextResponse.json({ error: "name, email and password required" }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email)))
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  if (password.length < 8)
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });

  const existing = await sql`SELECT id FROM users WHERE email = ${email} LIMIT 1`;
  if (existing.length > 0)
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });

  const hash = await bcrypt.hash(password, 12);
  const rows = await sql`
    INSERT INTO users (name, email, password_hash)
    VALUES (${name}, ${email}, ${hash})
    RETURNING id, name, email, role, created_at
  `;
  const user  = rows[0];
  const foxId = await assignFoxId(user.id);

  // Send welcome email — non-blocking, never fails the registration
  const host      = req.headers.get("host") ?? "foxmen.studio";
  const proto     = host.startsWith("localhost") ? "http" : "https";
  sendWelcomeEmail({
    client_name: name,
    email,
    fox_id:      foxId,
    portal_url:  `${proto}://${host}/portal`,
  }).catch((e) => console.error("[welcome-email]", e));

  return NextResponse.json({ ...user, fox_id: foxId }, { status: 201 });
}
