import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { auth } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS project_messages (
      id           SERIAL PRIMARY KEY,
      project_id   INTEGER      NOT NULL,
      sender_id    INTEGER      NOT NULL,
      sender_name  TEXT         NOT NULL,
      sender_role  VARCHAR(20)  NOT NULL DEFAULT 'client',
      message      TEXT         NOT NULL,
      created_at   TIMESTAMPTZ  NOT NULL DEFAULT now()
    )
  `;
}

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await ensureTable();

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("project_id");
  if (!projectId) return NextResponse.json({ error: "project_id required" }, { status: 400 });

  const uid = (session.user as { id?: string }).id;
  const role = (session.user as { role?: string }).role;

  if (role !== "admin") {
    const owns = await sql`SELECT id FROM client_projects WHERE id = ${projectId} AND user_id = ${uid}`;
    if (!owns.length) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const rows = await sql`SELECT * FROM project_messages WHERE project_id = ${projectId} ORDER BY created_at ASC`;
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await ensureTable();

  const uid = (session.user as { id?: string }).id;
  const role = (session.user as { role?: string }).role;
  const { project_id, message } = await req.json();
  if (!project_id || !message?.trim()) return NextResponse.json({ error: "project_id and message required" }, { status: 400 });

  if (role !== "admin") {
    const owns = await sql`SELECT id FROM client_projects WHERE id = ${project_id} AND user_id = ${uid}`;
    if (!owns.length) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const rows = await sql`
    INSERT INTO project_messages (project_id, sender_id, sender_name, sender_role, message)
    VALUES (${project_id}, ${uid}, ${session.user.name ?? "User"}, ${role ?? "client"}, ${message.trim()})
    RETURNING *
  `;
  const msg = rows[0];

  await pusherServer.trigger(`private-project-${project_id}`, "new-message", msg).catch(() => {});

  const projectRows = await sql`SELECT user_id, title FROM client_projects WHERE id = ${project_id}`;
  if (projectRows[0]) {
    const notifyUserId = role === "admin" ? projectRows[0].user_id : null;
    if (notifyUserId) {
      await pusherServer.trigger(`private-user-${notifyUserId}`, "notification", {
        type: "new_message",
        title: "New message",
        body: `${session.user.name} replied on "${projectRows[0].title}"`,
        link: `/portal/project/${project_id}`,
      }).catch(() => {});
    }
    if (role !== "admin") {
      await pusherServer.trigger("private-admin", "notification", {
        type: "new_message",
        title: "New client message",
        body: `${session.user.name} on "${projectRows[0].title}"`,
        link: `/admin`,
      }).catch(() => {});
    }
  }

  return NextResponse.json(msg, { status: 201 });
}
