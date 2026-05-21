import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const runtime = "nodejs";

// Called daily by Vercel Cron. Clears image_url from project_messages older than 2 days.
// Vercel sends `Authorization: Bearer <CRON_SECRET>` — set CRON_SECRET in your Vercel env vars.
export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await sql`
    UPDATE project_messages
    SET image_url = ''
    WHERE image_url != ''
      AND created_at < now() - interval '2 days'
    RETURNING id
  ` as Record<string, unknown>[];

  return NextResponse.json({ cleared: rows.length });
}
