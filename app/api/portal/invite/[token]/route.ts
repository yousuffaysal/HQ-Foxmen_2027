import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const rows = await sql`
    SELECT
      pi.id, pi.token, pi.used, pi.expires_at,
      u.name  AS user_name,  u.email,
      cp.id   AS project_id, cp.title AS project_title,
      cp.service_type, cp.status AS project_status,
      cp.description, cp.budget, cp.timeline
    FROM portal_invites pi
    JOIN users           u  ON u.id  = pi.user_id
    LEFT JOIN client_projects cp ON cp.id = pi.project_id
    WHERE pi.token = ${token}
      AND pi.used  = false
      AND (pi.expires_at IS NULL OR pi.expires_at > now())
  `;

  if (!rows[0]) {
    return NextResponse.json({ error: "Invalid or expired invite link." }, { status: 404 });
  }

  return NextResponse.json(rows[0]);
}
