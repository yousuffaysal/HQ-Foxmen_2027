import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { auth } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const session_id = searchParams.get("session_id");
  const chat_id    = searchParams.get("chat_id");

  if (!session_id && !chat_id)
    return NextResponse.json({ error: "session_id or chat_id required" }, { status: 400 });

  let chatId = chat_id;
  if (session_id) {
    const rows = await sql`SELECT id FROM live_chats WHERE session_id = ${session_id}` as { id: number }[];
    if (!rows[0]) return NextResponse.json([]);
    chatId = String(rows[0].id);
  }

  const msgs = await sql`
    SELECT * FROM live_chat_messages WHERE chat_id = ${chatId} ORDER BY created_at ASC
  `;
  return NextResponse.json(msgs);
}

export async function POST(req: Request) {
  const session   = await auth().catch(() => null);
  const role      = session?.user ? (session.user as { role?: string }).role : null;
  const adminName = session?.user?.name ?? "Foxmen Studio";

  const { session_id, chat_id, message, sender_name } = await req.json();
  if (!message?.trim()) return NextResponse.json({ error: "message required" }, { status: 400 });
  if (!session_id && !chat_id) return NextResponse.json({ error: "session_id or chat_id required" }, { status: 400 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let chatRow: any = null;

  if (session_id) {
    const rows = await sql`SELECT * FROM live_chats WHERE session_id = ${session_id}` as Record<string, unknown>[];
    chatRow = rows[0] ?? null;
  } else {
    const rows = await sql`SELECT * FROM live_chats WHERE id = ${chat_id}` as Record<string, unknown>[];
    chatRow = rows[0] ?? null;
  }

  if (!chatRow) return NextResponse.json({ error: "Chat session not found" }, { status: 404 });

  const senderType = role === "admin" ? "admin" : "visitor";
  const senderName = senderType === "admin" ? adminName : (sender_name?.trim() || chatRow.visitor_name || "Visitor");

  const msgRows = await sql`
    INSERT INTO live_chat_messages (chat_id, sender_type, sender_name, message, read)
    VALUES (${chatRow.id}, ${senderType}, ${senderName}, ${message.trim()}, ${senderType === "admin"})
    RETURNING *
  ` as Record<string, unknown>[];
  const msg = msgRows[0];

  await sql`
    UPDATE live_chats SET last_message_at = now() WHERE id = ${chatRow.id}
  `;

  await pusherServer.trigger(`chat-${chatRow.session_id}`, "new-message", msg).catch(() => {});

  if (senderType === "visitor") {
    await pusherServer.trigger("private-admin", "live-chat-message", {
      chat_id: chatRow.id,
      session_id: chatRow.session_id,
      visitor_name: chatRow.visitor_name,
      message: message.trim(),
      created_at: msg.created_at,
    }).catch(() => {});
  }

  return NextResponse.json(msg, { status: 201 });
}
