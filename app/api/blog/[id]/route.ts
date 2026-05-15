import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const rows = await sql`
    UPDATE posts SET
      title        = COALESCE(${body.title},        title),
      category     = COALESCE(${body.category},     category),
      author_init  = COALESCE(${body.author_init},  author_init),
      author_name  = COALESCE(${body.author_name},  author_name),
      read_time    = COALESCE(${body.read_time},    read_time),
      status       = COALESCE(${body.status},       status),
      published_at = COALESCE(${body.published_at}, published_at)
    WHERE id = ${id}
    RETURNING *
  `;
  if (!rows.length) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(rows[0]);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await sql`DELETE FROM posts WHERE id = ${id}`;
  return new NextResponse(null, { status: 204 });
}
