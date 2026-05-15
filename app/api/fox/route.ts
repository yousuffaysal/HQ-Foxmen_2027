import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM = `You are Fox — the AI discovery assistant for Foxmen Studio, a premium international digital product studio.
Your job: qualify visitors, understand their project, then provide a personalised estimate.

PERSONALITY:
- Warm, direct, concise. No corporate fluff.
- Ask ONE question at a time. Never two.
- Short messages: 2–3 lines max.
- Use → for options/bullets.
- Light emoji use (max 1 per message).

FOXMEN'S SERVICES & PRICING (USD):
- Website: Simple $3k–8k | Medium $8k–20k | Advanced $20k–50k | Enterprise $50k–150k
- Mobile App: Simple $8k–20k | Medium $20k–50k | Advanced $50k–120k | Enterprise $100k–300k
- E-commerce: Simple $5k–15k | Medium $15k–40k | Advanced $40k–100k | Enterprise $80k–200k
- AI Tool / Integration: Simple $10k–25k | Medium $25k–60k | Advanced $60k–150k
- Branding & Design: Simple $3k–8k | Medium $8k–20k | Advanced $20k–50k
- ASAP timeline adds ~25%. Flexible timeline saves ~15%.

CONVERSATION FLOW:
Step 1 — Understand what they want to build (they'll reply to your greeting).
Step 2 — Ask 1–2 targeted questions about features/scope based on project type.
Step 3 — Ask about timeline (ASAP / Standard / Flexible).
Step 4 — After 3+ user messages you have enough context. Present the estimate.

WHEN READY TO ESTIMATE:
Respond with this exact JSON (no markdown fences, no other text):
{"message":"your warm estimate message here — mention the plan name and price range, and offer to book a call or get the estimate emailed","stage":"estimate","plan":"Standard E-commerce","priceMin":8000,"priceMax":20000,"delivery":"8–10 weeks"}

Example estimate message:
"Based on what you've shared, you're looking at our Standard E-commerce plan — around $8,000–$20,000, delivered in 8–10 weeks. Want me to book a free discovery call, or should I email you a full breakdown?"

FOR ALL DISCOVERY MESSAGES respond with this exact JSON:
{"message":"your message here","stage":"discovery"}

RULES:
- Never mention competitors.
- Never invent services we don't offer.
- If someone asks something off-topic, redirect warmly.
- Always be honest about timelines.
- You do NOT start the conversation — the first greeting is pre-populated.`;

type ChatMsg = { role: "user" | "assistant"; content: string };

function emailHtml(email: string, msgs: ChatMsg[], plan: string, priceMin: number, priceMax: number, delivery: string) {
  const min = Number(priceMin).toLocaleString();
  const max = Number(priceMax).toLocaleString();
  const transcript = msgs
    .map(m => `<tr><td style="padding:6px 0;vertical-align:top;width:80px;font-size:12px;color:${m.role==="assistant"?"#b86cf9":"#666"};font-weight:600;font-family:monospace;">${m.role==="assistant"?"Fox":"You"}</td><td style="padding:6px 0;font-size:13px;color:#333;line-height:1.5;">${m.content.replace(/\n/g,"<br/>")}</td></tr>`)
    .join("");

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f0eff0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 16px;">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,.12);">
  <tr><td style="background:linear-gradient(135deg,#0f0f0f,#1a0a2e);padding:32px 36px;">
    <img src="https://res.cloudinary.com/dduyaqvk3/image/upload/v1778821968/Foxmen_Studio_copy_ulz2ih.png" width="160" style="display:block;"/>
    <div style="height:1px;background:rgba(255,255,255,.08);margin:20px 0;"></div>
    <div style="font-size:12px;color:#9b7fd4;letter-spacing:.12em;text-transform:uppercase;margin-bottom:8px;">Your discovery chat summary</div>
    <div style="font-size:22px;font-weight:700;color:#fff;">Your project estimate<br/><span style="font-size:15px;font-weight:400;color:#aaa;">from Fox, Foxmen Studio AI</span></div>
  </td></tr>
  <tr><td style="padding:32px 36px 0;">
    <div style="font-size:11px;color:#999;letter-spacing:.12em;text-transform:uppercase;margin-bottom:6px;">Estimated Investment</div>
    <div style="font-size:44px;font-weight:800;color:#0a0a0a;letter-spacing:-.02em;line-height:1;">$${min}&thinsp;–&thinsp;$${max}</div>
    <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap;">
      <span style="background:#ede1ff;color:#7c3aed;font-size:12px;font-weight:600;padding:5px 12px;border-radius:999px;">${plan}</span>
      <span style="background:#f0f0ee;color:#333;font-size:12px;padding:5px 12px;border-radius:999px;">⏱ ${delivery}</span>
    </div>
  </td></tr>
  <tr><td style="padding:24px 36px;">
    <div style="background:#fafaf9;border:1px solid #eee;border-radius:12px;padding:20px;">
      <div style="font-size:11px;color:#999;letter-spacing:.12em;text-transform:uppercase;margin-bottom:12px;">Your conversation with Fox</div>
      <table width="100%" cellpadding="0" cellspacing="0">${transcript}</table>
    </div>
  </td></tr>
  <tr><td style="padding:0 36px 36px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#0f0f0f,#1a0a2e);border-radius:14px;">
      <tr><td style="padding:28px;text-align:center;">
        <div style="font-size:18px;font-weight:700;color:#fff;margin-bottom:6px;">Ready to move forward?</div>
        <div style="font-size:13px;color:#aaa;margin-bottom:20px;">Book a free 20-min discovery call — we'll confirm exact pricing within 24 hours.</div>
        <a href="https://foxmenstudio.com/contact" style="display:inline-block;background:#b86cf9;color:#fff;font-size:14px;font-weight:700;text-decoration:none;padding:13px 32px;border-radius:999px;">Book a Free Call →</a>
        <div style="margin-top:12px;font-size:12px;color:#555;">Or reply to this email — we respond within 24 hours</div>
      </td></tr>
    </table>
  </td></tr>
  <tr><td style="background:#0a0a0a;padding:20px 36px;text-align:center;">
    <div style="font-size:11px;color:#555;">foxmenstudio.com · yousuf.h.faysal@foxmenstudio.com</div>
    <div style="font-size:10px;color:#3d3d3d;margin-top:6px;">This is a preliminary estimate. Final pricing confirmed after discovery call.</div>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;
}

export async function POST(req: Request) {
  try {
    const { messages, email, estimate } = await req.json();

    // ── Save lead + send email ──────────────────────────────
    if (email) {
      const lastUser = [...messages].reverse().find((m: ChatMsg) => m.role === "user");
      await sql`
        INSERT INTO messages (av, sender, subject, preview, body, source, interested, budget, country, unread)
        VALUES (
          ${email.slice(0, 2).toUpperCase()},
          ${email},
          ${"Fox Chat Lead"},
          ${lastUser?.content?.slice(0, 100) ?? "Discovery chat via Fox AI"},
          ${JSON.stringify({ conversation: messages, estimate })},
          ${"fox-chat"},
          ${estimate?.plan ?? "Discovery chat"},
          ${estimate ? `$${Number(estimate.priceMin).toLocaleString()} – $${Number(estimate.priceMax).toLocaleString()}` : "TBD"},
          ${"Unknown"},
          ${true}
        )
      `;

      if (process.env.RESEND_API_KEY && estimate) {
        const html = emailHtml(email, messages, estimate.plan, estimate.priceMin, estimate.priceMax, estimate.delivery);
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from: `Foxmen Studio <${process.env.FROM_EMAIL ?? "hello@foxmen.studio"}>`,
            to: email,
            subject: `Your project estimate — $${Number(estimate.priceMin).toLocaleString()} to $${Number(estimate.priceMax).toLocaleString()}`,
            html,
          }),
        });
      }
      return NextResponse.json({ saved: true });
    }

    // ── AI chat ─────────────────────────────────────────────
    const chat = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM },
        ...messages.map((m: ChatMsg) => ({ role: m.role, content: m.content })),
      ],
      temperature: 0.35,
      max_tokens: 400,
    });

    const raw = chat.choices[0]?.message?.content ?? "";
    const jsonMatch = raw.match(/\{[\s\S]*\}/);

    try {
      const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : raw);
      return NextResponse.json(parsed);
    } catch {
      return NextResponse.json({ message: raw.trim() || "I'm here! What are you trying to build?", stage: "discovery" });
    }
  } catch (err) {
    console.error("Fox error:", err);
    return NextResponse.json({ message: "Hit a snag — please try again!", stage: "discovery" });
  }
}
