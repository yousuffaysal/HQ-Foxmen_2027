import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { projectType, requirements, teamSize } = await req.json() as {
    projectType: string;
    requirements: string[];
    teamSize: string;
  };

  if (!projectType) {
    return NextResponse.json({ error: "Project type is required" }, { status: 400 });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Service not configured" }, { status: 500 });
  }

  const userPrompt =
    `I am building a ${projectType}. ` +
    (requirements?.length > 0 ? `Requirements: ${requirements.join(", ")}. ` : "") +
    `Team size: ${teamSize}. ` +
    `Recommend the ideal tech stack. Respond ONLY with a valid JSON object — no markdown, no code fences — with these keys: ` +
    `"frontend" (string), "backend" (string), "database" (string), "infrastructure" (string), ` +
    `"ai_layer" (string or null, only if AI/ML is needed), ` +
    `"rationale" (object with keys: "frontend", "backend", "database", "infrastructure", "ai_layer" — each value is one concise sentence). ` +
    `Be specific with technology names. Prioritise battle-tested, well-supported choices.`;

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "You are a senior software architect with expertise across web, mobile, AI, and cloud infrastructure. You give precise, battle-tested stack recommendations tailored to project requirements and team size. Always respond with valid JSON only — no markdown, no explanation outside the JSON.",
          },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.4,
        max_tokens: 600,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Groq error:", err);
      return NextResponse.json({ error: "AI recommendation failed" }, { status: 502 });
    }

    const data = await res.json() as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const rawContent = data.choices?.[0]?.message?.content ?? "{}";

    let parsed: unknown;
    try {
      // Strip any accidental markdown fences
      const cleaned = rawContent.replace(/```(?:json)?/g, "").replace(/```/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json({ error: "Failed to parse recommendation" }, { status: 500 });
    }

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to generate recommendation" }, { status: 500 });
  }
}
