import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const uid = (session.user as { id?: string }).id;
  const rows = await sql`SELECT id, name, email, role, fox_id FROM users WHERE id = ${uid}`.catch(() => []);
  return NextResponse.json(rows[0] ?? {});
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const uid = (session.user as { id?: string }).id;
  const { name, avatar } = await req.json();

  if (!name?.trim()) return NextResponse.json({ error: "Name required" }, { status: 400 });

  const rows = await sql`
    UPDATE users
    SET name   = ${name.trim()},
        avatar = ${avatar ?? ""}
    WHERE id = ${uid}
    RETURNING id, name, avatar, role
  `;
  return NextResponse.json(rows[0]);
}
