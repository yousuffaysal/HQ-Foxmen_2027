import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { auth } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const uid = (session.user as { id?: string }).id;
  const role = (session.user as { role?: string }).role;

  const rows = await sql`
    SELECT p.*, u.name as user_name, u.email as user_email
    FROM client_projects p JOIN users u ON u.id = p.user_id
    WHERE p.id = ${id}
  ` as Record<string, unknown>[];
  if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (role !== "admin" && String((rows[0] as { user_id: unknown }).user_id) !== String(uid))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const project = rows[0] as Record<string, unknown>;
  project.milestones = await sql`SELECT * FROM project_milestones WHERE project_id = ${id} ORDER BY ord, created_at`;
  return NextResponse.json(project);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const role = (session.user as { role?: string }).role;
  if (role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await req.json();
  const { status, admin_note, title, service_type, description, budget, timeline, website } = body;

  const rows = await sql`
    UPDATE client_projects
    SET
      status       = COALESCE(${status ?? null}, status),
      admin_note   = COALESCE(${admin_note ?? null}, admin_note),
      title        = COALESCE(${title ?? null}, title),
      service_type = COALESCE(${service_type ?? null}, service_type),
      description  = COALESCE(${description ?? null}, description),
      budget       = COALESCE(${budget ?? null}, budget),
      timeline     = COALESCE(${timeline ?? null}, timeline),
      website      = COALESCE(${website ?? null}, website),
      updated_at   = now()
    WHERE id = ${id}
    RETURNING *
  ` as Record<string, unknown>[];
  if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await pusherServer.trigger(`private-project-${id}`, "project-updated", rows[0]).catch(() => {});
  const userRows = await sql`SELECT id FROM users WHERE id = (SELECT user_id FROM client_projects WHERE id = ${id})` as { id: number }[];
  if (userRows[0]) {
    await pusherServer.trigger(`private-user-${userRows[0].id}`, "notification", {
      type: "project_update",
      title: "Project updated",
      body: `Your project "${rows[0].title}" status: ${rows[0].status}`,
      link: `/portal/project/${id}`,
    }).catch(() => {});
  }

  return NextResponse.json(rows[0]);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const role = (session.user as { role?: string }).role;
  if (role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  await sql`DELETE FROM client_projects WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}
