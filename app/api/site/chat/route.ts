import { NextResponse } from "next/server";
import { runAgent, type ChatMsg } from "@/lib/site/agent";
import { clientIp, rateLimit } from "@/lib/site/store";
import { sameOrigin, str } from "@/lib/site/sanitize";

export const runtime = "nodejs";
export const maxDuration = 60;

// Site AI assistant. The client sends only the visible conversation (user/assistant text);
// tools run server-side. 40 turns per IP per 10 minutes.
export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const b = await req.json().catch(() => ({}));
  const raw: unknown[] = Array.isArray(b.messages) ? b.messages.slice(-24) : [];
  const history: ChatMsg[] = raw
    .map(m => m as Record<string, unknown>)
    .filter(m => m && (m.role === "user" || m.role === "assistant"))
    .map(m => ({ role: m.role as ChatMsg["role"], content: str(m.content, 2000) }))
    .filter(m => m.content);
  if (!history.length || history[history.length - 1].role !== "user") return NextResponse.json({ error: "Send the conversation ending with a user message." }, { status: 400 });

  const ip = clientIp(req);
  try {
    if (!(await rateLimit("agent-chat", ip, 40, 600))) return NextResponse.json({ error: "You are sending messages very quickly, sir. Please wait a few minutes." }, { status: 429 });
  } catch (e) {
    console.error("[site/chat] rate limit", e);
    return NextResponse.json({ error: "The assistant is unavailable right now." }, { status: 503 });
  }
  if (!process.env.GROQ_API_KEY) return NextResponse.json({ error: "The assistant is not configured." }, { status: 503 });

  try {
    return NextResponse.json(await runAgent(history, ip));
  } catch (e) {
    console.error("[site/chat] agent failed", e);
    return NextResponse.json({ error: "I am sorry, sir, the assistant could not respond just now. Please try again in a moment." }, { status: 502 });
  }
}
