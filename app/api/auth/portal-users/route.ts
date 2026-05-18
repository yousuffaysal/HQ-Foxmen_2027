import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const role = (session.user as { role?: string }).role;
  if (role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const rows = await sql`SELECT id, name, email, role, created_at FROM users WHERE role = 'client' ORDER BY created_at DESC`.catch(() => []);
  return NextResponse.json(rows);
}
