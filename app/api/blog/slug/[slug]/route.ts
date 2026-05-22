import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const rows = await sql`
      SELECT * FROM posts WHERE slug = ${slug} AND status = 'live' LIMIT 1
    ` as Record<string, unknown>[];
    if (!rows.length) return NextResponse.json({ error: "not found" }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch {
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
