import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    let body: { projectType?: string; requirements?: string[]; teamSize?: string };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { projectType, requirements, teamSize } = body;
    if (!projectType) {
      return NextResponse.json({ error: "Project type is required" }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "AI service not configured — please add GROQ_API_KEY to .env.local" },
        { status: 500 }
      );
    }

    const userPrompt =
      `I am building a ${projectType}. ` +
      (requirements && requirements.length > 0 ? `Requirements: ${requirements.join(", ")}. ` : "") +
      `Team size: ${teamSize ?? "unknown"}. ` +
      `Recommend the ideal tech stack. Respond ONLY with a valid JSON object — no markdown, no code fences — with these keys: ` +
      `"frontend" (string), "backend" (string), "database" (string), "infrastructure" (string), ` +
      `"ai_layer" (string or null, only if AI/ML is needed), ` +
      `"rationale" (object with keys: "frontend", "backend", "database", "infrastructure", "ai_layer" — each value is one concise sentence). ` +
      `Be specific with technology names. Prioritise battle-tested, well-supported choices.`;

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are a senior software architect with expertise across web, mobile, AI, and cloud infrastructure. You give precise, battle-tested stack recommendations tailored to project requirements and team size. Always respond with valid JSON only — no markdown, no explanation outside the JSON.",
          },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.4,
        max_tokens: 600,
      }),
    });

    const ct = groqRes.headers.get("content-type") ?? "";
    if (!ct.includes("application/json")) {
      return NextResponse.json({ error: "AI service returned an unexpected response. Please try again." }, { status: 502 });
    }

    const groqData = await groqRes.json() as {
      choices?: Array<{ message?: { content?: string } }>;
      error?: { message?: string };
    };

    if (!groqRes.ok || groqData.error) {
      const msg = groqData.error?.message ?? "AI recommendation failed";
      console.error("[tech-stack] Groq error:", msg);
      return NextResponse.json({ error: "AI recommendation failed. Please try again." }, { status: 502 });
    }

    const rawContent = groqData.choices?.[0]?.message?.content ?? "{}";
    let parsed: unknown;
    try {
      const cleaned = rawContent.replace(/```(?:json)?/g, "").replace(/```/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json({ error: "Failed to parse AI response. Please try again." }, { status: 500 });
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("[tech-stack] Unhandled error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
