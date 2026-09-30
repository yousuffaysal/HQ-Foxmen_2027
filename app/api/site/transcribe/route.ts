import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { clientIp, rateLimit } from "@/lib/site/store";
import { sameOrigin } from "@/lib/site/sanitize";

export const runtime = "nodejs";
export const maxDuration = 60;

const TYPES: Record<string, string> = { "audio/webm": "webm", "audio/mp4": "mp4", "audio/mpeg": "mp3", "audio/ogg": "ogg", "audio/wav": "wav", "audio/x-m4a": "m4a", "audio/aac": "m4a" };
const MAX = 8 * 1024 * 1024; // ~60 s of voice is well under this

// Voice typing for the site assistant: a short recording in, text out (Groq Whisper; English and Bangla).
export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const fd = await req.formData().catch(() => null);
  const file = fd?.get("audio");
  if (!(file instanceof File) || !file.size) return NextResponse.json({ error: "No audio received." }, { status: 400 });
  const type = file.type.split(";")[0];
  if (!TYPES[type]) return NextResponse.json({ error: "Unsupported audio format." }, { status: 415 });
  if (file.size > MAX) return NextResponse.json({ error: "That recording is too long. Please keep it under a minute." }, { status: 413 });

  try {
    if (!(await rateLimit("voice", clientIp(req), 20, 600))) return NextResponse.json({ error: "Too many voice messages. Please wait a few minutes." }, { status: 429 });
  } catch {
    return NextResponse.json({ error: "Voice typing is unavailable right now." }, { status: 503 });
  }
  if (!process.env.GROQ_API_KEY) return NextResponse.json({ error: "Voice typing is not configured." }, { status: 503 });

  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const named = new File([await file.arrayBuffer()], `voice.${TYPES[type]}`, { type });
    const r = await groq.audio.transcriptions.create({ file: named, model: process.env.GROQ_WHISPER_MODEL || "whisper-large-v3-turbo", response_format: "json", temperature: 0 });
    const text = (r.text || "").trim().slice(0, 2000);
    // Whisper "hears" these on silence or background noise; treat them as nothing said.
    if (!text || /^(you|thank you|thanks for watching|bye|\W+)[.!]*$/i.test(text)) {
      return NextResponse.json({ error: "I could not hear anything. Please try again, a little closer to the mic." }, { status: 422 });
    }
    return NextResponse.json({ text });
  } catch (e) {
    console.error("[site/transcribe]", e);
    return NextResponse.json({ error: "Sorry, I could not hear that clearly. Please try again." }, { status: 502 });
  }
}
