import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  /* Try exact slug match first */
  let rows = await sql`SELECT * FROM projects WHERE slug = ${slug} LIMIT 1`;

  /* Fallback: match by name-derived slug for projects saved before slug column existed */
  if (!rows.length) {
    rows = await sql`
      SELECT * FROM projects
      WHERE lower(regexp_replace(trim(name), '[^a-zA-Z0-9]+', '-', 'g')) = ${slug}
      LIMIT 1
    `;
  }

  if (!rows.length) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(rows[0]);
}
