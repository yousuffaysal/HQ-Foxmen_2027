import { NextResponse, after } from "next/server";
import Groq from "groq-sdk";
import { buildFieldsPrompt, buildToolPrompt, cleanOutput, MAX_INPUT, maxTokensFor, modelFor, SYSTEM } from "@/lib/site/ai-tools";
import { bumpAiRuns, clientIp, rateLimit } from "@/lib/site/store";
import { bumpToolRuns, cacheGet, cacheKey, cachePut, getToolSettings } from "@/lib/site/tools-store";
import { sameOrigin } from "@/lib/site/sanitize";

export const runtime = "nodejs";
export const maxDuration = 60;

const FAIL = "Sorry, the tool could not respond right now. Please try again in a minute.";
const err = (error: string, status: number) => NextResponse.json({ error }, { status });

// Free AI tools. Body: { tool, len, fields } from a product page, or { tool, len, text } from the
// quick runner on /tools. Replies stream as plain text; errors before streaming are JSON.
// Token savings: identical requests are served from ai_cache, simple tools use the small model,
// and each length setting has a fixed output budget.
export async function POST(req: Request) {
  if (!sameOrigin(req)) return err("Forbidden", 403);
  let b: { tool?: unknown; text?: unknown; len?: unknown; fields?: unknown };
  try { b = await req.json(); } catch { return err("Invalid JSON", 400); }

  const tool = typeof b.tool === "string" ? b.tool : "";
  const len = Number.isInteger(b.len) ? Math.min(2, Math.max(0, b.len as number)) : 1;
  let content: string | null, input: string;
  if (b.fields && typeof b.fields === "object") {
    const r = buildFieldsPrompt(tool, b.fields as Record<string, unknown>, len);
    if (!r) return err("Please fill in at least one field.", 400);
    content = r.prompt; input = r.input;
  } else {
    const text = typeof b.text === "string" ? b.text.trim() : "";
    if (!text) return err("Please describe what you need.", 400);
    if (text.length > MAX_INPUT) return err(`Please keep it under ${MAX_INPUT} characters.`, 400);
    content = buildToolPrompt(tool, text, len); input = text;
  }
  if (!content) return err("Unknown tool", 400);

  const settings = (await getToolSettings({ live: true })).find(s => s.id === tool);
  if (settings && !settings.enabled) return err("This tool is not available right now.", 403);

  try {
    if (!(await rateLimit("ai-tool", clientIp(req), 12, 600))) return err("You have used the tools a lot in a short time. Please try again in a few minutes.", 429);
  } catch (e) {
    console.error("[site/ai] rate limit unavailable", e);
    return err(FAIL, 503);
  }

  const key = cacheKey(tool, len, (b.fields ? "f:" : "t:") + input);
  const cached = await cacheGet(key);
  const headers = { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
  if (cached) {
    after(async () => { await Promise.allSettled([bumpAiRuns(), bumpToolRuns(tool)]); });
    return new Response(cached, { headers: { ...headers, "X-Cache": "hit" } });
  }

  if (!process.env.GROQ_API_KEY) return err("AI is not configured.", 503);
  const model = modelFor(tool);
  let stream;
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    stream = await groq.chat.completions.create({
      model, stream: true, temperature: 0.7, max_completion_tokens: maxTokensFor(len),
      messages: [{ role: "system", content: SYSTEM }, { role: "user", content }],
      ...(model.startsWith("openai/gpt-oss") ? { reasoning_effort: "low" as const, include_reasoning: false } : {}),
    });
  } catch (e) {
    console.error("[site/ai] completion failed", e);
    return err(FAIL, 502);
  }

  const enc = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      let full = "";
      try {
        for await (const chunk of stream) {
          const piece = chunk.choices[0]?.delta?.content;
          if (piece) { full += piece; controller.enqueue(enc.encode(piece)); }
        }
        const clean = cleanOutput(full.trim());
        if (clean) {
          // Written before closing: the function stays alive until the stream ends.
          await Promise.allSettled([cachePut(key, tool, clean), bumpAiRuns(), bumpToolRuns(tool)]);
        } else {
          controller.enqueue(enc.encode(FAIL));
        }
      } catch (e) {
        console.error("[site/ai] stream failed", e);
        controller.enqueue(enc.encode(full ? "\n\n(The answer was cut short. Please try again.)" : FAIL));
      }
      controller.close();
    },
  });
  return new Response(body, { headers: { ...headers, "X-Cache": "miss", "X-Model": model } });
}
