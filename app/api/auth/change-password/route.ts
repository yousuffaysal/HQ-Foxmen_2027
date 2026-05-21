import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const uid = (session.user as { id?: string }).id;
  const { oldPassword, newPassword } = await req.json();

  if (!oldPassword || !newPassword)
    return NextResponse.json({ error: "Both passwords required" }, { status: 400 });
  if (newPassword.length < 8)
    return NextResponse.json({ error: "New password must be at least 8 characters" }, { status: 400 });

  const rows = await sql`SELECT password_hash FROM users WHERE id = ${uid} LIMIT 1` as { password_hash: string }[];
  if (!rows[0]) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const valid = await bcrypt.compare(oldPassword, rows[0].password_hash);
  if (!valid) return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });

  const hash = await bcrypt.hash(newPassword, 12);
  await sql`UPDATE users SET password_hash = ${hash} WHERE id = ${uid}`;

  return NextResponse.json({ ok: true });
}
