import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function GET() {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const rows = await sql`
    SELECT u.id, u.name, u.email, u.role, u.created_at,
           COUNT(cp.id)::int AS project_count
    FROM users u
    LEFT JOIN client_projects cp ON cp.user_id = u.id
    GROUP BY u.id
    ORDER BY u.created_at DESC
  `.catch(() => []);

  return NextResponse.json(rows);
}

export async function PATCH(req: Request) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { id, name, email, password } = await req.json();
    if (!id) return NextResponse.json({ error: "User ID required." }, { status: 400 });

    if (password?.trim()) {
      const hashed = await bcrypt.hash(password.trim(), 12);
      await sql`UPDATE users SET name = ${name}, email = ${email?.toLowerCase()}, password_hash = ${hashed} WHERE id = ${id}`;
    } else {
      await sql`UPDATE users SET name = ${name}, email = ${email?.toLowerCase()} WHERE id = ${id}`;
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "User ID required." }, { status: 400 });

    const existing = await sql`SELECT role FROM users WHERE id = ${id}`;
    if (!existing.length) return NextResponse.json({ error: "User not found." }, { status: 404 });
    if (existing[0].role === "admin") return NextResponse.json({ error: "Cannot delete admin users." }, { status: 403 });

    await sql`DELETE FROM users WHERE id = ${id}`;
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed" }, { status: 500 });
  }
}
