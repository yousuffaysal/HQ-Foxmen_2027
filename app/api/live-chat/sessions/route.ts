import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  const role = session?.user ? (session.user as { role?: string }).role : null;
  if (role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const rows = await sql`
    SELECT
      lc.*,
      (SELECT COUNT(*) FROM live_chat_messages WHERE chat_id = lc.id AND read = false AND sender_type = 'visitor') AS unread,
      (SELECT message FROM live_chat_messages WHERE chat_id = lc.id ORDER BY created_at DESC LIMIT 1) AS last_message
    FROM live_chats lc
    ORDER BY lc.last_message_at DESC
    LIMIT 60
  `;
  return NextResponse.json(rows);
}

export async function PATCH(req: Request) {
  const session = await auth();
  const role = session?.user ? (session.user as { role?: string }).role : null;
  if (role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { chat_id } = await req.json();
  await sql`UPDATE live_chat_messages SET read = true WHERE chat_id = ${chat_id} AND sender_type = 'visitor'`;
  return NextResponse.json({ ok: true });
}
