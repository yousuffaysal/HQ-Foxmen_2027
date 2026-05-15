import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM = `You are Fox — the AI discovery assistant for Foxmen Studio, a premium international digital product studio.
Your job: have a brief, smart conversation to understand the visitor's project, then hand off to the interactive feature-selector.

PERSONALITY:
- Warm, direct, concise. No corporate fluff.
- Ask ONE question at a time. Never two.
- Short messages: 2–3 lines max.
- Use → for options/bullets.
- No emoji — keep it clean and professional.
- Sound like a knowledgeable team member, not a bot.

FOXMEN'S SERVICES:
→ Website (marketing, SaaS, web app)
→ Mobile App (iOS, Android, cross-platform)
→ E-commerce (Shopify, custom, marketplace)
→ AI Tool (copilot, RAG, agents, integration)
→ Branding (identity, design system, brand)

CONVERSATION GOAL:
Ask enough to confidently classify the project into ONE of those five types.
Usually 2–3 exchanges are enough. Don't over-question.

Good follow-up questions by type:
- Website → Is it a marketing site, SaaS dashboard, or a web app with user accounts?
- Mobile App → iOS only, Android only, or both? Do you have a backend already?
- E-commerce → How many products? Do you need multi-vendor / marketplace features?
- AI Tool → What's the AI doing — answering questions, automating tasks, generating content?
- Branding → Starting from scratch, or refreshing an existing brand?

WHEN YOU HAVE ENOUGH CONTEXT (after 2–3 user messages):
Respond with this exact JSON — no markdown, no extra text:
{"message":"your short message acknowledging what they need and telling them you'll show them exactly what's included","stage":"features","projectType":"E-commerce"}

projectType MUST be exactly one of: "Website", "Mobile App", "E-commerce", "AI Tool", "Branding"

FOR ALL DISCOVERY MESSAGES respond with:
{"message":"your message","stage":"discovery"}

RULES:
- Never mention competitors.
- Never invent services we don't offer.
- Don't discuss pricing — the interactive tool handles that.
- If completely off-topic, redirect warmly.`;

type ChatMsg = { role: "user" | "assistant"; content: string };

type SelectedFeature = { id: string; label: string; priceMin: number; priceMax: number };

function emailHtml(
  _email: string,
  msgs: ChatMsg[],
  projectType: string,
  features: SelectedFeature[],
  totalMin: number,
  totalMax: number,
  process: { phase: string; duration: string; what: string }[]
) {
  const min = Number(totalMin).toLocaleString();
  const max = Number(totalMax).toLocaleString();

  const featureRows = features
    .map(f => `<tr>
      <td style="padding:10px 0;border-bottom:1px solid #efefef;font-size:14px;color:#333;">
        <table cellpadding="0" cellspacing="0"><tr>
          <td style="padding-right:10px;color:#b86cf9;font-size:15px;">✓</td>
          <td style="color:#333;font-size:14px;">${f.label}</td>
          <td style="color:#888;font-size:12px;padding-left:12px;white-space:nowrap;">+$${Number(f.priceMin).toLocaleString()}</td>
        </tr></table>
      </td></tr>`)
    .join("");

  const processRows = process
    .map((p, i) => `<tr><td style="padding:10px 0;border-bottom:1px solid #efefef;">
      <div style="font-size:11px;color:#b86cf9;font-family:monospace;letter-spacing:.1em;margin-bottom:2px;">0${i + 1} — ${p.phase} · ${p.duration}</div>
      <div style="font-size:13px;color:#555;">${p.what}</div>
    </td></tr>`)
    .join("");

  const transcript = msgs
    .slice(-8)
    .map(m => `<tr><td style="padding:5px 0;vertical-align:top;width:60px;font-size:11px;color:${m.role === "assistant" ? "#b86cf9" : "#888"};font-weight:600;font-family:monospace;">${m.role === "assistant" ? "Fox" : "You"}</td><td style="padding:5px 0;font-size:13px;color:#333;line-height:1.5;">${m.content.replace(/\n/g, "<br/>")}</td></tr>`)
    .join("");

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f0eff0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 16px;">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,.12);">
  <tr><td style="background:linear-gradient(135deg,#0f0f0f,#1a0a2e);padding:32px 36px;">
    <img src="https://res.cloudinary.com/dduyaqvk3/image/upload/v1778821968/Foxmen_Studio_copy_ulz2ih.png" width="160" style="display:block;"/>
    <div style="height:1px;background:rgba(255,255,255,.08);margin:20px 0;"></div>
    <div style="font-size:11px;color:#9b7fd4;letter-spacing:.14em;text-transform:uppercase;margin-bottom:8px;">Your custom project scope</div>
    <div style="font-size:22px;font-weight:700;color:#fff;">${projectType} Estimate<br/><span style="font-size:14px;font-weight:400;color:#aaa;">Built with Fox — Foxmen Studio AI</span></div>
  </td></tr>

  <tr><td style="padding:32px 36px 0;">
    <div style="font-size:11px;color:#999;letter-spacing:.12em;text-transform:uppercase;margin-bottom:6px;">Estimated Investment</div>
    <div style="font-size:48px;font-weight:800;color:#0a0a0a;letter-spacing:-.025em;line-height:1;">$${min}<span style="color:#ccc;font-weight:300;">&thinsp;–&thinsp;</span>$${max}</div>
    <div style="margin-top:12px;display:inline-block;background:#ede1ff;color:#7c3aed;font-size:12px;font-weight:600;padding:5px 12px;border-radius:999px;">${projectType}</div>
  </td></tr>

  <tr><td style="padding:24px 36px 0;">
    <div style="background:#fafaf9;border:1px solid #eee;border-radius:12px;overflow:hidden;">
      <div style="padding:16px 20px 8px;font-size:11px;color:#999;letter-spacing:.14em;text-transform:uppercase;">Selected Features</div>
      <div style="padding:0 20px 8px;"><table width="100%" cellpadding="0" cellspacing="0">${featureRows}</table></div>
    </div>
  </td></tr>

  <tr><td style="padding:16px 36px 0;">
    <div style="background:#fafaf9;border:1px solid #eee;border-radius:12px;overflow:hidden;">
      <div style="padding:16px 20px 8px;font-size:11px;color:#999;letter-spacing:.14em;text-transform:uppercase;">How We Work</div>
      <div style="padding:0 20px 8px;"><table width="100%" cellpadding="0" cellspacing="0">${processRows}</table></div>
    </div>
  </td></tr>

  <tr><td style="padding:24px 36px;">
    <div style="background:#fafaf9;border:1px solid #eee;border-radius:12px;padding:16px 20px;">
      <div style="font-size:11px;color:#999;letter-spacing:.14em;text-transform:uppercase;margin-bottom:10px;">Your conversation with Fox</div>
      <table width="100%" cellpadding="0" cellspacing="0">${transcript}</table>
    </div>
  </td></tr>

  <tr><td style="padding:0 36px 36px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#0f0f0f,#1a0a2e);border-radius:14px;">
      <tr><td style="padding:28px;text-align:center;">
        <div style="font-size:18px;font-weight:700;color:#fff;margin-bottom:6px;">Ready to move forward?</div>
        <div style="font-size:13px;color:#aaa;margin-bottom:20px;">Book a free 20-min discovery call — we'll confirm exact pricing within 24 hours.</div>
        <a href="https://foxmenstudio.com/contact" style="display:inline-block;background:#b86cf9;color:#fff;font-size:14px;font-weight:700;text-decoration:none;padding:13px 32px;border-radius:999px;">Book a Free Call</a>
        <div style="margin-top:12px;font-size:12px;color:#555;">Or reply to this email — we respond within 24 hours</div>
      </td></tr>
    </table>
  </td></tr>

  <tr><td style="background:#0a0a0a;padding:20px 36px;text-align:center;">
    <div style="font-size:11px;color:#555;">foxmenstudio.com · yousuf.h.faysal@foxmenstudio.com</div>
    <div style="font-size:10px;color:#3d3d3d;margin-top:4px;">Preliminary estimate. Final pricing confirmed after discovery call.</div>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;
}

export async function POST(req: Request) {
  try {
    const { messages, email, projectType, features, totalMin, totalMax, process } = await req.json();

    // ── Save lead + send estimate email ──────────────────────
    if (email) {
      const lastUser = [...messages].reverse().find((m: ChatMsg) => m.role === "user");
      await sql`
        INSERT INTO messages (av, sender, subject, preview, body, source, interested, budget, country, unread)
        VALUES (
          ${email.slice(0, 2).toUpperCase()},
          ${email},
          ${"Fox Chat Lead — " + (projectType ?? "Discovery")},
          ${lastUser?.content?.slice(0, 100) ?? "Feature-based estimate via Fox"},
          ${JSON.stringify({ conversation: messages, projectType, features, totalMin, totalMax })},
          ${"fox-chat"},
          ${projectType ?? "Discovery chat"},
          ${totalMin && totalMax ? `$${Number(totalMin).toLocaleString()} – $${Number(totalMax).toLocaleString()}` : "TBD"},
          ${"Unknown"},
          ${true}
        )
      `;

      if (process.env.RESEND_API_KEY && projectType) {
        const html = emailHtml(email, messages, projectType, features ?? [], totalMin ?? 0, totalMax ?? 0, process ?? []);
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from: `Foxmen Studio <${process.env.FROM_EMAIL ?? "hello@foxmen.studio"}>`,
            to: email,
            subject: `Your ${projectType} estimate — $${Number(totalMin).toLocaleString()} to $${Number(totalMax).toLocaleString()}`,
            html,
          }),
        });
      }
      return NextResponse.json({ saved: true });
    }

    // ── AI chat ──────────────────────────────────────────────
    const chat = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM },
        ...messages.map((m: ChatMsg) => ({ role: m.role, content: m.content })),
      ],
      temperature: 0.3,
      max_tokens: 300,
    });

    const raw = chat.choices[0]?.message?.content ?? "";
    const jsonMatch = raw.match(/\{[\s\S]*\}/);

    try {
      const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : raw);
      return NextResponse.json(parsed);
    } catch {
      return NextResponse.json({ message: raw.trim() || "I'm here — what are you building?", stage: "discovery" });
    }
  } catch (err) {
    console.error("Fox error:", err);
    return NextResponse.json({ message: "Hit a snag — try again!", stage: "discovery" });
  }
}
