import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";

// POST { items: [{id, home_order}] }
// Sets home_featured=true + order for listed ids, clears all others.
export async function POST(req: Request) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const { items } = await req.json() as { items: { id: number; home_order: number }[] };

  // Clear all
  await sql`UPDATE projects SET home_featured = false, home_order = 0`;

  // Set featured with order
  if (items && items.length > 0) {
    await Promise.all(
      items.map(({ id, home_order }) =>
        sql`UPDATE projects SET home_featured = true, home_order = ${home_order} WHERE id = ${id}`
      )
    );
  }

  return NextResponse.json({ ok: true });
}
