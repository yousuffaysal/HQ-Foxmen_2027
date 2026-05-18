import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { auth } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const role = (session.user as { role?: string }).role;
  if (role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { project_id, title, description, due_date, ord } = await req.json();
  const rows = await sql`
    INSERT INTO project_milestones (project_id, title, description, due_date, ord)
    VALUES (${project_id}, ${title}, ${description ?? ""}, ${due_date ?? ""}, ${ord ?? 0})
    RETURNING *
  `;
  await pusherServer.trigger(`private-project-${project_id}`, "milestone-added", rows[0]).catch(() => {});
  return NextResponse.json(rows[0], { status: 201 });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const role = (session.user as { role?: string }).role;
  if (role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id, status, title, description, due_date } = await req.json();
  const completedAt = status === "completed" ? new Date().toISOString() : null;
  const rows = await sql`
    UPDATE project_milestones
    SET
      status       = COALESCE(${status ?? null}, status),
      title        = COALESCE(${title ?? null}, title),
      description  = COALESCE(${description ?? null}, description),
      due_date     = COALESCE(${due_date ?? null}, due_date),
      completed_at = CASE WHEN ${status ?? null} = 'completed' THEN ${completedAt}::timestamptz ELSE completed_at END
    WHERE id = ${id}
    RETURNING *
  `;
  if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await pusherServer.trigger(`private-project-${rows[0].project_id}`, "milestone-updated", rows[0]).catch(() => {});
  return NextResponse.json(rows[0]);
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const role = (session.user as { role?: string }).role;
  if (role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await req.json();
  await sql`DELETE FROM project_milestones WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}
