import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  const rows = await sql`SELECT * FROM team ORDER BY id ASC`;
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const { av, name, role, bio } = await req.json();
  if (!name) return NextResponse.json({ error: "name is required" }, { status: 400 });
  const rows = await sql`
    INSERT INTO team (av, name, role, bio) VALUES (${av ?? ""}, ${name}, ${role ?? ""}, ${bio ?? ""}) RETURNING *
  `;
  return NextResponse.json(rows[0], { status: 201 });
}
