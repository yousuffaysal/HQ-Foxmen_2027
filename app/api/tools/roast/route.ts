import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    let body: { url?: string; description?: string };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { url: rawUrl, description } = body;
    if (!rawUrl?.trim()) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const url = /^https?:\/\//i.test(rawUrl.trim()) ? rawUrl.trim() : `https://${rawUrl.trim()}`;

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "AI service not configured — please add GROQ_API_KEY to .env.local" },
        { status: 500 }
      );
    }

    const userPrompt =
      `Please audit this website: ${url}.` +
      (description?.trim() ? ` Context about the site: ${description.trim()}.` : "") +
      ` Write your audit in exactly these five sections with these exact headings on their own line (no markdown hashes):

FIRST IMPRESSIONS
DESIGN & UX
CONVERSION ISSUES
SEO SIGNALS
TOP 3 FIXES

Rules: Start each section with its heading on a new line. Do not use ## or any markdown formatting. Do not use bullet points with dashes — use plain paragraphs. Each section should be 2–4 sentences. Be specific to this website. If something is done well, say so clearly. If something needs improvement, frame it as an opportunity with a specific recommendation. Never say a site is "terrible" or "bad" — instead say what it could do to improve. Keep the tone of a trusted advisor, not a critic.`;

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `You are a senior digital strategy consultant at a top agency with 20 years of experience. You provide balanced, professional website audits that clients genuinely find helpful. Your style: acknowledge what works well and is done right, then identify specific opportunities for improvement with actionable recommendations. You are direct and honest, but always constructive and professional. If a website has strong design, you say so — your credibility comes from being fair, not from being harsh. You never use dismissive language like "bad", "terrible", "uninspired", or "cluttered". Instead you say things like "the hero section would benefit from...", "a stronger call-to-action here could...", "the design foundation is solid — adding X would take it further". Your feedback helps people improve, not feel bad. Do not use markdown formatting like ## or ** — write in plain paragraphs.`,
          },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.6,
        max_tokens: 1400,
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
      const msg = groqData.error?.message ?? "AI analysis failed";
      console.error("[roast] Groq error:", msg);
      return NextResponse.json({ error: "AI analysis failed. Please try again." }, { status: 502 });
    }

    const roast = groqData.choices?.[0]?.message?.content ?? "";
    if (!roast) {
      return NextResponse.json({ error: "No response from AI. Please try again." }, { status: 502 });
    }

    return NextResponse.json({ roast });
  } catch (err) {
    console.error("[roast] Unhandled error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
