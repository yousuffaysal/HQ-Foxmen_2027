import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const rows = await sql`SELECT * FROM projects WHERE slug = ${slug} LIMIT 1`;
  if (!rows.length) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(rows[0]);
}
