import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  const rows = await sql`SELECT * FROM clients ORDER BY id ASC`;
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const { name, industry, country, contact, eng, mrr, av, cls } = await req.json();
  const rows = await sql`
    INSERT INTO clients (name, industry, country, contact, eng, mrr, av, cls)
    VALUES (${name}, ${industry ?? ""}, ${country ?? ""}, ${contact ?? ""}, ${eng ?? ""}, ${mrr ?? ""}, ${av ?? ""}, ${cls ?? ""})
    RETURNING *
  `;
  return NextResponse.json(rows[0], { status: 201 });
}
