import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { url, description } = await req.json() as { url: string; description?: string };

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Service not configured" }, { status: 500 });
  }

  const userPrompt =
    `Roast this website: ${url}.` +
    (description ? ` Additional context: ${description}.` : "") +
    ` Provide feedback in exactly these sections: FIRST IMPRESSIONS, DESIGN & UX, CONVERSION ISSUES, SEO SIGNALS, TOP 3 FIXES. Be specific, direct, and actionable. No sugarcoating.`;

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
              "You are a brutally honest senior web consultant with 20 years of experience. You give direct, actionable feedback on websites. No sugarcoating — you call out problems plainly. You care deeply about conversion rates, design clarity, and real user outcomes.",
          },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.8,
        max_tokens: 1200,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Groq error:", err);
      return NextResponse.json({ error: "AI analysis failed" }, { status: 502 });
    }

    const data = await res.json() as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const roast = data.choices?.[0]?.message?.content ?? "";
    return NextResponse.json({ roast });
  } catch {
    return NextResponse.json({ error: "Failed to generate roast" }, { status: 500 });
  }
}
