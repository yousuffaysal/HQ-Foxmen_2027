import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await sql`DELETE FROM clients WHERE id = ${id}`;
  return new NextResponse(null, { status: 204 });
}
