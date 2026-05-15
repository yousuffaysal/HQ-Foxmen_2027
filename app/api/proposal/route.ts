import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM = `You are a senior business development writer at Foxmen Studio, a premium international digital product studio.
Write compelling, professional project proposals that win high-value clients.
Respond with valid JSON only — no markdown fences, no extra text.`;

export async function POST(req: Request) {
  const { client, company, service, scope, timeline, budget } = await req.json();

  const prompt = `Write a full project proposal for:
- Client: ${client}${company ? ` (${company})` : ""}
- Service: ${service}
- Investment: ${budget}
- Timeline: ${timeline}
- Project Brief: ${scope}

Return this exact JSON shape (all values must be non-empty strings/arrays):
{
  "executive_summary": "<2-3 professional paragraphs about the project, value proposition, and why Foxmen Studio is the right partner>",
  "scope_items": ["<item 1>","<item 2>","<item 3>","<item 4>","<item 5>","<item 6>"],
  "deliverables": ["<deliverable 1>","<deliverable 2>","<deliverable 3>","<deliverable 4>","<deliverable 5>"],
  "timeline": [
    {"period":"<e.g. Week 1–2>","milestone":"<name>","desc":"<1-2 sentences>"},
    {"period":"<e.g. Week 3–5>","milestone":"<name>","desc":"<1-2 sentences>"},
    {"period":"<e.g. Week 6–8>","milestone":"<name>","desc":"<1-2 sentences>"},
    {"period":"<e.g. Week 9>","milestone":"<name>","desc":"<1-2 sentences>"}
  ],
  "investment_note": "<2 sentences on what the investment covers and payment terms>",
  "terms": "<3-4 sentences on payment schedule (50% upfront / 50% on delivery), IP ownership, NDA, and revision rounds>"
}`;

  try {
    const chat = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "system", content: SYSTEM }, { role: "user", content: prompt }],
      temperature: 0.45,
      max_tokens: 2400,
    });

    const raw = chat.choices[0]?.message?.content ?? "{}";
    const match = raw.match(/\{[\s\S]*\}/);
    const data = JSON.parse(match ? match[0] : raw);
    return NextResponse.json(data);
  } catch (err) {
    console.error("Proposal gen error:", err);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
