import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { auth } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS admin_offers (
      id          SERIAL PRIMARY KEY,
      user_id     INTEGER      NOT NULL,
      project_id  INTEGER,
      title       TEXT         NOT NULL,
      description TEXT         NOT NULL DEFAULT '',
      price       TEXT         NOT NULL DEFAULT '',
      status      VARCHAR(20)  NOT NULL DEFAULT 'pending',
      created_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
    )
  `;
}

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await ensureTable();

  const uid = (session.user as { id?: string }).id;
  const role = (session.user as { role?: string }).role;
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("user_id");

  const rows = role === "admin"
    ? userId
      ? await sql`SELECT o.*, u.name as user_name FROM admin_offers o JOIN users u ON u.id = o.user_id WHERE o.user_id = ${userId} ORDER BY o.created_at DESC`
      : await sql`SELECT o.*, u.name as user_name FROM admin_offers o JOIN users u ON u.id = o.user_id ORDER BY o.created_at DESC`
    : await sql`SELECT * FROM admin_offers WHERE user_id = ${uid} ORDER BY created_at DESC`;

  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const role = (session.user as { role?: string }).role;
  if (role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await ensureTable();

  const { user_id, project_id, title, description, price } = await req.json();
  if (!user_id || !title) return NextResponse.json({ error: "user_id and title required" }, { status: 400 });

  const rows = await sql`
    INSERT INTO admin_offers (user_id, project_id, title, description, price)
    VALUES (${user_id}, ${project_id ?? null}, ${title}, ${description ?? ""}, ${price ?? ""})
    RETURNING *
  ` as Record<string, unknown>[];
  await pusherServer.trigger(`private-user-${user_id}`, "notification", {
    type: "new_offer",
    title: "New offer from Foxmen",
    body: title,
    link: "/portal",
  }).catch(() => {});

  return NextResponse.json(rows[0], { status: 201 });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const uid = (session.user as { id?: string }).id;
  const role = (session.user as { role?: string }).role;
  await ensureTable();

  const { id, status } = await req.json();
  const rows = (role === "admin"
    ? await sql`UPDATE admin_offers SET status = ${status} WHERE id = ${id} RETURNING *`
    : await sql`UPDATE admin_offers SET status = ${status} WHERE id = ${id} AND user_id = ${uid} RETURNING *`) as Record<string, unknown>[];

  if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (role !== "admin") {
    await pusherServer.trigger("private-admin", "notification", {
      type: "offer_response",
      title: `Offer ${status}`,
      body: `Client responded to offer: "${rows[0].title}"`,
      link: "/admin",
    }).catch(() => {});
  }
  return NextResponse.json(rows[0]);
}
