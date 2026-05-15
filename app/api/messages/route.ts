import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  const rows = await sql`SELECT * FROM messages ORDER BY received_at DESC`;
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const { av, sender, subject, preview, body, source, interested, budget, country } = await req.json();
  if (!sender || !subject) {
    return NextResponse.json({ error: "sender and subject are required" }, { status: 400 });
  }
  const rows = await sql`
    INSERT INTO messages (av, sender, subject, preview, body, source, interested, budget, country)
    VALUES (${av ?? ""}, ${sender}, ${subject}, ${preview ?? ""}, ${body ?? ""}, ${source ?? ""}, ${interested ?? ""}, ${budget ?? ""}, ${country ?? ""})
    RETURNING *
  `;
  return NextResponse.json(rows[0], { status: 201 });
}
