import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  const rows = await sql`SELECT * FROM posts ORDER BY published_at DESC NULLS LAST, id DESC`;
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const { title, category, author_init, author_name, read_time, status, published_at } = await req.json();
  const rows = await sql`
    INSERT INTO posts (title, category, author_init, author_name, read_time, status, published_at)
    VALUES (${title}, ${category ?? ""}, ${author_init ?? ""}, ${author_name ?? ""}, ${read_time ?? ""}, ${status ?? "draft"}, ${published_at ?? null})
    RETURNING *
  `;
  return NextResponse.json(rows[0], { status: 201 });
}
