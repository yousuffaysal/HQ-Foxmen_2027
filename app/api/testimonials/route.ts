import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";

let migrated = false;
async function ensureColumns() {
  if (migrated) return;
  await sql`ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS visible BOOLEAN NOT NULL DEFAULT true`.catch(() => {});
  await sql`ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS rating  INTEGER NOT NULL DEFAULT 5`.catch(() => {});
  await sql`ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS img     TEXT    NOT NULL DEFAULT ''`.catch(() => {});
  migrated = true;
}

export async function GET(req: Request) {
  await ensureColumns();
  const { searchParams } = new URL(req.url);
  const rows = searchParams.get("public") === "1"
    ? await sql`SELECT * FROM testimonials WHERE visible = true ORDER BY id ASC`
    : await sql`SELECT * FROM testimonials ORDER BY id ASC`;
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const deny = await requireAdmin();
  if (deny) return deny;
  await ensureColumns();
  const { quote, name, role, av, hi, rating, img } = await req.json();
  const rows = await sql`
    INSERT INTO testimonials (quote, name, role, av, hi, visible, rating, img)
    VALUES (${quote}, ${name}, ${role ?? ""}, ${av ?? ""}, ${hi ?? ""}, true, ${rating ?? 5}, ${img ?? ""})
    RETURNING *
  ` as Record<string, unknown>[];
  return NextResponse.json(rows[0], { status: 201 });
}
