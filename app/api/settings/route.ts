import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  const rows = await sql`SELECT * FROM settings`;
  const obj: Record<string, string> = {};
  for (const r of rows) obj[r.key as string] = r.value as string;
  return NextResponse.json(obj);
}

export async function POST(req: Request) {
  const body = await req.json() as Record<string, string>;
  for (const [key, value] of Object.entries(body)) {
    await sql`INSERT INTO settings (key, value) VALUES (${key}, ${value}) ON CONFLICT (key) DO UPDATE SET value = ${value}`;
  }
  return NextResponse.json({ ok: true });
}
