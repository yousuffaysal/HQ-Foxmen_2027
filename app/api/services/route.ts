import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const onlyVisible = searchParams.get("visible") === "true";
  const rows = onlyVisible
    ? await sql`SELECT * FROM services WHERE visible = true ORDER BY ord ASC`
    : await sql`SELECT * FROM services ORDER BY ord ASC`;
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const { name, descr, count, visible, badge, image } = await req.json();
  const rows = await sql`
    INSERT INTO services (ord, name, descr, count, visible, badge, image)
    VALUES ((SELECT COALESCE(MAX(ord), 0) + 1 FROM services), ${name}, ${descr ?? ""}, ${count ?? ""}, ${visible ?? true}, ${badge ?? null}, ${image ?? null})
    RETURNING *
  `;
  return NextResponse.json(rows[0], { status: 201 });
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const { id } = body;

  if ("visible" in body && !("image" in body)) {
    const rows = await sql`UPDATE services SET visible = ${body.visible} WHERE id = ${id} RETURNING *`;
    return NextResponse.json(rows[0]);
  }

  const rows = await sql`
    UPDATE services SET
      name    = COALESCE(${body.name},    name),
      descr   = COALESCE(${body.descr},   descr),
      count   = COALESCE(${body.count},   count),
      badge   = COALESCE(${body.badge},   badge),
      image   = COALESCE(${body.image},   image),
      visible = COALESCE(${body.visible}, visible)
    WHERE id = ${id} RETURNING *
  `;
  return NextResponse.json(rows[0]);
}
