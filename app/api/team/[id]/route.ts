import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  const body = await req.json();
  const rows = await sql`
    UPDATE team SET
      av   = COALESCE(${body.av},   av),
      name = COALESCE(${body.name}, name),
      role = COALESCE(${body.role}, role),
      bio  = COALESCE(${body.bio},  bio)
    WHERE id = ${id} RETURNING *
  ` as Record<string, unknown>[];
  if (!rows.length) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(rows[0]);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  await sql`DELETE FROM team WHERE id = ${id}`;
  return new NextResponse(null, { status: 204 });
}
