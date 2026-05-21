import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";

export async function GET() {
  const deny = await requireAdmin();
  if (deny) return deny;
  const rows = await sql`SELECT * FROM clients ORDER BY id ASC`;
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { name, industry, country, contact, eng, mrr, av, cls } = await req.json();
  const rows = await sql`
    INSERT INTO clients (name, industry, country, contact, eng, mrr, av, cls)
    VALUES (${name}, ${industry ?? ""}, ${country ?? ""}, ${contact ?? ""}, ${eng ?? ""}, ${mrr ?? ""}, ${av ?? ""}, ${cls ?? ""})
    RETURNING *
  ` as Record<string, unknown>[];
  return NextResponse.json(rows[0], { status: 201 });
}
