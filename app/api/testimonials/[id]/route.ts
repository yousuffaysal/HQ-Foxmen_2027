import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const rows = await sql`
    UPDATE testimonials SET
      quote   = COALESCE(${body.quote ?? null},   quote),
      name    = COALESCE(${body.name  ?? null},   name),
      role    = COALESCE(${body.role  ?? null},   role),
      av      = COALESCE(${body.av    ?? null},   av),
      hi      = COALESCE(${body.hi    ?? null},   hi),
      visible = COALESCE(${body.visible ?? null}, visible),
      rating  = COALESCE(${body.rating  ?? null}, rating)
    WHERE id = ${id} RETURNING *
  `;
  if (!rows.length) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(rows[0]);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await sql`DELETE FROM testimonials WHERE id = ${id}`;
  return new NextResponse(null, { status: 204 });
}
