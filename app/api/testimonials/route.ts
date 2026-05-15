import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  const rows = await sql`SELECT * FROM testimonials ORDER BY id ASC`;
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const { quote, name, role, av, hi } = await req.json();
  const rows = await sql`
    INSERT INTO testimonials (quote, name, role, av, hi)
    VALUES (${quote}, ${name}, ${role ?? ""}, ${av ?? ""}, ${hi ?? ""})
    RETURNING *
  `;
  return NextResponse.json(rows[0], { status: 201 });
}
