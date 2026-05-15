import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  const rows = await sql`SELECT * FROM projects ORDER BY updated_at DESC`;
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const { monogram, color_cls, name, industry, year, scope, status } = await req.json();
  const rows = await sql`
    INSERT INTO projects (monogram, color_cls, name, industry, year, scope, status)
    VALUES (${monogram ?? ""}, ${color_cls ?? ""}, ${name}, ${industry ?? ""}, ${year ?? ""}, ${scope ?? ""}, ${status ?? "draft"})
    RETURNING *
  `;
  return NextResponse.json(rows[0], { status: 201 });
}
