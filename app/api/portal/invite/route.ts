import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS portal_invites (
      id         SERIAL PRIMARY KEY,
      token      TEXT UNIQUE NOT NULL,
      user_id    INTEGER NOT NULL,
      project_id INTEGER,
      used       BOOLEAN DEFAULT false,
      expires_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT now()
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

export async function GET(req: Request) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await ensureTable();
  const rows = await sql`
    SELECT pi.*, u.name as user_name, u.email,
           cp.title as project_title, cp.service_type, cp.status as project_status
    FROM portal_invites pi
    JOIN users u ON u.id = pi.user_id
    LEFT JOIN client_projects cp ON cp.id = pi.project_id
    ORDER BY pi.created_at DESC
    LIMIT 50
  `;
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const role = (session?.user as { role?: string })?.role;
    if (role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await ensureTable();

    const body = await req.json().catch(() => ({}));
    const {
      name, email, password: rawPass,
      project_title, service_type, description,
      budget, timeline, website,
    } = body;

    if (!name?.trim() || !email?.trim() || !project_title?.trim()) {
      return NextResponse.json({ error: "Client name, email, and project title are required." }, { status: 400 });
    }

    const plainPass = rawPass?.trim() || randomBytes(8).toString("base64url");
    const hashed    = await bcrypt.hash(plainPass, 12);

    const emailLower = email.trim().toLowerCase();
    const existing   = await sql`SELECT id, role FROM users WHERE email = ${emailLower}`;
    let userId: number;

    if (existing.length > 0) {
      userId = existing[0].id;
      await sql`UPDATE users SET name = ${name.trim()}, password_hash = ${hashed} WHERE id = ${userId}`;
    } else {
      const rows = await sql`
        INSERT INTO users (name, email, password_hash, role)
        VALUES (${name.trim()}, ${emailLower}, ${hashed}, 'client')
        RETURNING id
      `;
      userId = rows[0].id;
    }
    const foxId    = await assignFoxId(userId);
    const isNewUser = existing.length === 0;

    const projectRows = await sql`
      INSERT INTO client_projects (user_id, title, service_type, description, budget, timeline, website, status)
      VALUES (${userId}, ${project_title.trim()}, ${service_type || ""}, ${description || ""}, ${budget || ""}, ${timeline || ""}, ${website || ""}, 'pending')
      RETURNING id
    `;
    const projectId = projectRows[0].id;

    const token     = randomBytes(28).toString("base64url");
    const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    await sql`
      INSERT INTO portal_invites (token, user_id, project_id, expires_at)
      VALUES (${token}, ${userId}, ${projectId}, ${expiresAt.toISOString()})
    `;

    const host      = req.headers.get("host") ?? "localhost:3000";
    const proto     = host.startsWith("localhost") ? "http" : "https";
    const inviteUrl = `${proto}://${host}/portal/invite/${token}`;

    // Fire welcome email for brand-new users — non-blocking, never fails the invite
    if (isNewUser && foxId) {
      fetch(`${proto}://${host}/api/portal/welcome-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // forward auth cookie so the admin check inside passes
          cookie: req.headers.get("cookie") ?? "",
        },
        body: JSON.stringify({
          client_name: name.trim(),
          email:       emailLower,
          fox_id:      foxId,
          portal_url:  `${proto}://${host}/portal`,
        }),
      }).catch((e) => console.error("[welcome-email trigger]", e));
    }

    return NextResponse.json({
      invite_url: inviteUrl,
      email:      emailLower,
      password:   plainPass,
      user_id:    userId,
      fox_id:     foxId,
      project_id: projectId,
      token,
      expires_at: expiresAt.toISOString(),
    }, { status: 201 });
  } catch (err) {
    console.error("[portal/invite POST]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error." },
      { status: 500 }
    );
  }
}
