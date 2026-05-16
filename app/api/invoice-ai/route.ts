import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM = `You are a billing specialist at Foxmen Studio, a premium digital agency.
The admin will describe the work they did for a client in plain language.
Your job is to break it down into professional invoice line items with realistic pricing.
Respond with valid JSON only — no markdown fences, no extra text.`;

export async function POST(req: Request) {
  const { description } = await req.json();
  if (!description?.trim()) {
    return NextResponse.json({ error: "No description provided" }, { status: 400 });
  }

  const prompt = `The admin says: "${description}"

Return this exact JSON shape:
{
  "items": [
    {
      "service": "<short service name, max 4 words>",
      "description": "<concise professional description, 1 sentence>",
      "quantity": <number>,
      "unit": "<hrs|days|flat>",
      "rate": <number — realistic market rate in USD>
    }
  ],
  "notes": "<optional payment/project note, 1 sentence, or empty string>"
}

Rules:
- Split the work into 2–5 logical line items (e.g. UI Design, Frontend Dev, Backend API, QA, Deployment)
- If admin mentions a total budget, distribute it across items so they sum close to that total
- If no budget mentioned, use realistic agency rates (design $95–150/hr, dev $120–180/hr, flat project $2k–15k)
- Use "flat" unit for deliverable-based work, "hrs" or "days" for time-based
- Keep service names professional and short`;

  try {
    const chat = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "system", content: SYSTEM }, { role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 800,
    });

    const raw = chat.choices[0]?.message?.content ?? "{}";
    const match = raw.match(/\{[\s\S]*\}/);
    const data = JSON.parse(match ? match[0] : raw);
    return NextResponse.json(data);
  } catch (err) {
    console.error("Invoice AI error:", err);
    return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
  }
}
