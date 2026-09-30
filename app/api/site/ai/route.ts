import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { GROQ_MODEL } from "@/lib/ai";
import { buildToolPrompt, cleanOutput, MAX_INPUT, SYSTEM } from "@/lib/site/ai-tools";
import { bumpAiRuns, clientIp, rateLimit } from "@/lib/site/store";

export const runtime = "nodejs";
export const maxDuration = 60;

// Free AI tools on /tools. 12 runs per IP per 10 minutes keeps the Groq bill bounded.
export async function POST(req: Request) {
  let body: { tool?: unknown; text?: unknown; len?: unknown };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const tool = typeof body.tool === "string" ? body.tool : "";
  const text = typeof body.text === "string" ? body.text.trim() : "";
  const len = Number.isInteger(body.len) ? Math.min(2, Math.max(0, body.len as number)) : 1;
  if (!text) return NextResponse.json({ error: "Please describe what you need." }, { status: 400 });
  if (text.length > MAX_INPUT) return NextResponse.json({ error: `Please keep it under ${MAX_INPUT} characters.` }, { status: 400 });
  const content = buildToolPrompt(tool, text, len);
  if (!content) return NextResponse.json({ error: "Unknown tool" }, { status: 400 });

  try {
    if (!(await rateLimit("ai-tool", clientIp(req), 12, 600))) {
      return NextResponse.json({ error: "You have used the tools a lot in a short time. Please try again in a few minutes." }, { status: 429 });
    }
  } catch (e) {
    console.error("[site/ai] rate limit unavailable", e);
    return NextResponse.json({ error: "Sorry, the tool could not respond right now. Please try again in a minute." }, { status: 503 });
  }

  if (!process.env.GROQ_API_KEY) return NextResponse.json({ error: "AI is not configured." }, { status: 503 });

  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const out = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [{ role: "system", content: SYSTEM }, { role: "user", content }],
      max_completion_tokens: 2000,
      temperature: 0.7,
      ...(GROQ_MODEL.startsWith("openai/gpt-oss") ? { reasoning_effort: "low" as const } : {}),
    });
    const answer = cleanOutput(out.choices[0]?.message?.content?.trim() || "");
    if (!answer) throw new Error("empty completion");
    bumpAiRuns().catch(e => console.error("[site/ai] run counter", e));
    return NextResponse.json({ output: answer });
  } catch (e) {
    console.error("[site/ai] completion failed", e);
    return NextResponse.json({ error: "Sorry, the tool could not respond right now. Please try again in a minute." }, { status: 502 });
  }
}
