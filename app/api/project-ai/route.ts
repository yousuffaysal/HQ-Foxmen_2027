import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM = `You are a senior copywriter and project manager at Foxmen Studio, a premium international digital agency.
The admin will describe a client project in plain language.
Your job is to turn that into a complete, professional case study entry.
Respond with valid JSON only — no markdown fences, no extra text.`;

export async function POST(req: Request) {
  const { description } = await req.json();
  if (!description?.trim())
    return NextResponse.json({ error: "No description provided" }, { status: 400 });

  const year = new Date().getFullYear();

  const prompt = `The admin describes this project: "${description}"

Return this exact JSON shape (all values are strings):
{
  "name": "<project name, max 6 words>",
  "client_name": "<client / company name>",
  "industry": "<one word industry, e.g. Fintech, Proptech, Health, E-commerce, SaaS>",
  "year": "<4-digit year, default ${year} if not mentioned>",
  "scope": "<2-4 scope tags separated by · e.g. Web · iOS · AI · Design>",
  "status": "<draft|live|review|archived — default draft>",
  "tagline": "<one compelling sentence subtitle for the case study, max 15 words>",
  "overview": "<2-3 sentence summary of what was built and why>",
  "challenge": "<2-3 sentences describing the core problem the client faced>",
  "solution": "<2-3 sentences describing how Foxmen Studio solved it>",
  "results": "<2-3 sentences with concrete outcomes, metrics, or impact if mentioned>",
  "tech_stack": "<comma-separated technologies, e.g. Next.js, Supabase, OpenAI, Stripe>",
  "timeline_duration": "<human-readable duration e.g. 8 weeks, 3 months>",
  "live_url": "<live URL if mentioned, else empty string>",
  "github_url": "<github URL if mentioned, else empty string>",
  "monogram": "<2 uppercase letters from project or client name, e.g. NE for Nestaro>"
}

Rules:
- Write in third-person professional agency voice
- If a detail is not mentioned, infer something reasonable from context
- Keep tagline punchy and memorable
- Results should be specific where possible; if no metrics mentioned, describe qualitative impact
- Tech stack should only include real technologies that fit the project type described`;

  try {
    const chat = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "system", content: SYSTEM }, { role: "user", content: prompt }],
      temperature: 0.4,
      max_tokens: 1200,
    });

    const raw = chat.choices[0]?.message?.content ?? "{}";
    const match = raw.match(/\{[\s\S]*\}/);
    const data = JSON.parse(match ? match[0] : raw);
    return NextResponse.json(data);
  } catch (err) {
    console.error("Project AI error:", err);
    return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
  }
}
