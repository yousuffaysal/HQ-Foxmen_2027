import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

async function ensureColumns() {
  await sql`ALTER TABLE posts ADD COLUMN IF NOT EXISTS body         TEXT    NOT NULL DEFAULT ''`.catch(() => {});
  await sql`ALTER TABLE posts ADD COLUMN IF NOT EXISTS cover_image  TEXT    NOT NULL DEFAULT ''`.catch(() => {});
  await sql`ALTER TABLE posts ADD COLUMN IF NOT EXISTS excerpt      TEXT    NOT NULL DEFAULT ''`.catch(() => {});
  await sql`ALTER TABLE posts ADD COLUMN IF NOT EXISTS tags         TEXT    NOT NULL DEFAULT ''`.catch(() => {});
  await sql`ALTER TABLE posts ADD COLUMN IF NOT EXISTS slug         TEXT    NOT NULL DEFAULT ''`.catch(() => {});
}

export async function GET() {
  await ensureColumns();
  const rows = await sql`SELECT * FROM posts ORDER BY published_at DESC NULLS LAST, id DESC`;
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  await ensureColumns();
  const { title, category, author_init, author_name, read_time, status, published_at, body, cover_image, excerpt, tags, slug } = await req.json();
  const rows = await sql`
    INSERT INTO posts (title, category, author_init, author_name, read_time, status, published_at, body, cover_image, excerpt, tags, slug)
    VALUES (
      ${title},
      ${category ?? ""},
      ${author_init ?? ""},
      ${author_name ?? ""},
      ${read_time ?? ""},
      ${status ?? "draft"},
      ${published_at ?? null},
      ${body ?? ""},
      ${cover_image ?? ""},
      ${excerpt ?? ""},
      ${tags ?? ""},
      ${slug ?? ""}
    )
    RETURNING *
  `;
  return NextResponse.json(rows[0], { status: 201 });
}
