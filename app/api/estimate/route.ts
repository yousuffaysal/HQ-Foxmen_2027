import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM = `You are a senior project estimator at Foxmen Studio, a premium international digital product studio.
Generate realistic, honest project estimates based on the inputs. Think carefully about scope.
Always respond with a valid JSON object only — no markdown fences, no extra text.`;

const buildPrompt = (type: string, complexity: string, timeline: string) => `
Generate a project cost estimate for:
- Project Type: ${type}
- Complexity: ${complexity}
- Timeline: ${timeline}

Rules for pricing (USD):
- Website: Simple $3k-8k, Medium $8k-20k, Advanced $20k-50k, Enterprise $50k-150k
- Mobile App: Simple $8k-20k, Medium $20k-50k, Advanced $50k-120k, Enterprise $100k-300k
- E-commerce: Simple $5k-15k, Medium $15k-40k, Advanced $40k-100k, Enterprise $80k-200k
- AI Tool: Simple $10k-25k, Medium $25k-60k, Advanced $60k-150k, Enterprise $150k-400k
- Branding: Simple $3k-8k, Medium $8k-20k, Advanced $20k-50k, Enterprise $50k-120k
- ASAP timeline: increase prices by 25%
- Flexible timeline: decrease prices by 15%

Respond with this exact JSON shape:
{
  "price_min": <integer>,
  "price_max": <integer>,
  "delivery": "<e.g. 6–8 weeks>",
  "summary": "<2 sentences about what we will build for this project>",
  "includes": ["<deliverable 1>", "<deliverable 2>", "<deliverable 3>", "<deliverable 4>", "<deliverable 5>"],
  "complexity_note": "<one sentence explaining the complexity level chosen>",
  "recommended_stack": "<comma-separated tech stack, e.g. Next.js, Postgres, Stripe>"
}`;

function emailHtml(type: string, complexity: string, timeline: string, r: Record<string, unknown>) {
  const min = Number(r.price_min).toLocaleString();
  const max = Number(r.price_max).toLocaleString();
  const includes = (r.includes as string[]) ?? [];

  const logoDark = `<img src="https://res.cloudinary.com/dduyaqvk3/image/upload/v1778821968/Foxmen_Studio_copy_ulz2ih.png" width="200" alt="Foxmen Studio" style="display:block;width:200px;max-width:100%;height:auto;border:0;" />`;

  const chip = (text: string, purple = false) =>
    `<span style="display:inline-block;background:${purple ? "#ede1ff" : "#f0f0ee"};color:${purple ? "#7c3aed" : "#333"};font-size:12px;font-weight:${purple ? "600" : "400"};padding:5px 13px;border-radius:999px;margin:3px 4px 3px 0;white-space:nowrap;">${text}</span>`;

  const includeRow = (item: string) =>
    `<tr><td style="padding:11px 0;border-bottom:1px solid #efefef;font-size:14px;color:#333;line-height:1.5;">
      <table cellpadding="0" cellspacing="0" border="0"><tr>
        <td style="padding-right:10px;color:#b86cf9;font-size:15px;vertical-align:top;line-height:1.5;">✓</td>
        <td style="color:#333;font-size:14px;line-height:1.5;">${item}</td>
      </tr></table>
    </td></tr>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
<title>Your Project Estimate — Foxmen Studio</title>
<style>
  @media only screen and (max-width:600px){
    .outer{padding:0!important;}
    .card{border-radius:0!important;}
    .hero-pad{padding:32px 24px!important;}
    .body-pad{padding:28px 24px!important;}
    .price{font-size:42px!important;line-height:1.1!important;}
    .cta-btn{display:block!important;text-align:center!important;width:100%!important;box-sizing:border-box!important;}
    .footer-pad{padding:20px 24px!important;}
  }
</style>
</head>
<body style="margin:0;padding:0;background:#f0eff0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" border="0" class="outer" style="padding:40px 16px;">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" border="0" class="card" style="max-width:580px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,.12);">

  <!-- ─── HEADER ─── -->
  <tr><td style="background:#0a0a0a;background:linear-gradient(135deg,#0f0f0f 0%,#1a0a2e 100%);padding:0;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td class="hero-pad" style="padding:36px 40px 32px;">

        <!-- Logo (dark bg version — includes wordmark) -->
        ${logoDark}

        <!-- Divider -->
        <div style="height:1px;background:rgba(255,255,255,.08);margin:24px 0;"></div>

        <!-- Tagline -->
        <div style="font-size:12px;color:#9b7fd4;letter-spacing:.14em;text-transform:uppercase;margin-bottom:10px;">Modern Web &nbsp;·&nbsp; Mobile Apps &nbsp;·&nbsp; AI Integration</div>
        <div style="font-size:24px;font-weight:700;color:#ffffff;line-height:1.25;">Your Project Estimate<br/><span style="font-weight:400;font-size:16px;color:#aaa;">is ready to review</span></div>

      </td></tr>

      <!-- Purple accent bar -->
      <tr><td style="height:4px;background:linear-gradient(90deg,#b86cf9,#8c3bd9,#b86cf9);"></td></tr>
    </table>
  </td></tr>

  <!-- ─── ESTIMATE HERO ─── -->
  <tr><td class="body-pad" style="padding:36px 40px 0;">
    <div style="font-size:11px;color:#999;letter-spacing:.14em;text-transform:uppercase;margin-bottom:8px;">Estimated Investment</div>
    <div class="price" style="font-size:52px;font-weight:800;color:#0a0a0a;line-height:1;letter-spacing:-.02em;margin-bottom:20px;">$${min}&thinsp;–&thinsp;$${max}</div>

    <!-- Chips -->
    <div style="margin-bottom:28px;line-height:2;">
      ${chip(type, true)}
      ${chip(complexity + " complexity")}
      ${chip(timeline)}
      ${chip("⏱ " + String(r.delivery))}
    </div>

    <!-- Divider -->
    <div style="height:1px;background:#f0f0f0;margin-bottom:28px;"></div>

    <!-- Summary -->
    <div style="font-size:11px;color:#999;letter-spacing:.12em;text-transform:uppercase;margin-bottom:10px;">Project Overview</div>
    <p style="font-size:15px;color:#444;line-height:1.7;margin:0 0 32px;">${r.summary}</p>
  </td></tr>

  <!-- ─── WHAT'S INCLUDED ─── -->
  <tr><td class="body-pad" style="padding:0 40px 32px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fafaf9;border:1px solid #eeeeec;border-radius:14px;overflow:hidden;">
      <tr><td style="padding:20px 24px 8px;">
        <div style="font-size:11px;color:#999;letter-spacing:.14em;text-transform:uppercase;margin-bottom:4px;">What's Included</div>
      </td></tr>
      <tr><td style="padding:0 24px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          ${includes.map(includeRow).join("")}
        </table>
      </td></tr>
    </table>
  </td></tr>

  <!-- ─── COMPLEXITY NOTE ─── -->
  ${r.complexity_note ? `<tr><td class="body-pad" style="padding:0 40px 28px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-left:3px solid #b86cf9;">
      <tr><td style="padding:8px 0 8px 16px;font-size:13px;color:#777;font-style:italic;line-height:1.6;">${r.complexity_note}</td></tr>
    </table>
  </td></tr>` : ""}

  <!-- ─── CTA ─── -->
  <tr><td class="body-pad" style="padding:0 40px 40px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:linear-gradient(135deg,#0f0f0f,#1a0a2e);border-radius:16px;">
      <tr><td style="padding:32px 28px;text-align:center;">
        <div style="font-size:20px;font-weight:700;color:#fff;margin-bottom:8px;">Ready to move forward?</div>
        <div style="font-size:14px;color:#aaa;margin-bottom:24px;line-height:1.5;">Book a free 20-min discovery call. We'll scope your project<br/>and confirm exact pricing within 24 hours.</div>
        <a href="https://foxmenstudio.com/contact" class="cta-btn" style="display:inline-block;background:#b86cf9;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;padding:15px 36px;border-radius:999px;letter-spacing:.02em;">Book a Free Call &rarr;</a>
        <div style="margin-top:16px;font-size:12px;color:#666;">Or reply to this email &mdash; we respond within 24 hours</div>
      </td></tr>
    </table>
  </td></tr>

  <!-- ─── SOCIAL PROOF STRIP ─── -->
  <tr><td style="background:#fafaf9;border-top:1px solid #eeeeec;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding:18px 20px;text-align:center;border-right:1px solid #eee;width:33%;">
          <div style="font-size:20px;font-weight:800;color:#0a0a0a;">120+</div>
          <div style="font-size:11px;color:#999;margin-top:2px;">Products shipped</div>
        </td>
        <td style="padding:18px 20px;text-align:center;border-right:1px solid #eee;width:33%;">
          <div style="font-size:20px;font-weight:800;color:#0a0a0a;">42</div>
          <div style="font-size:11px;color:#999;margin-top:2px;">Active clients</div>
        </td>
        <td style="padding:18px 20px;text-align:center;width:33%;">
          <div style="font-size:20px;font-weight:800;color:#0a0a0a;">17</div>
          <div style="font-size:11px;color:#999;margin-top:2px;">Countries</div>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- ─── FOOTER ─── -->
  <tr><td class="footer-pad" style="background:#0a0a0a;padding:28px 40px;text-align:center;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="padding-bottom:16px;">${logoDark}</td></tr></table>
    <div style="font-size:12px;color:#555;margin-bottom:12px;">foxmenstudio.com &nbsp;·&nbsp; yousuf.h.faysal@foxmenstudio.com</div>
    <div style="font-size:11px;color:#3d3d3d;line-height:1.6;">This is a preliminary estimate. Final scope &amp; pricing confirmed after discovery call.<br/>You received this because you used the Project Estimator on our website.</div>
  </td></tr>

</table>
</td></tr>
</table>

</body>
</html>`;
}

export async function POST(req: Request) {
  try {
    const { type, complexity, timeline, email } = await req.json();

    if (!type || !complexity || !timeline || !email) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Groq estimate
    const chat = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user",   content: buildPrompt(type, complexity, timeline) },
      ],
      temperature: 0.25,
      max_tokens: 600,
    });

    const raw = chat.choices[0]?.message?.content ?? "{}";
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    const estimate = JSON.parse(jsonMatch ? jsonMatch[0] : raw) as Record<string, unknown>;

    // Normalize recommended_stack — model sometimes returns an array
    if (Array.isArray(estimate.recommended_stack)) {
      estimate.recommended_stack = (estimate.recommended_stack as string[]).join(", ");
    }
    // Ensure includes is an array of strings
    if (!Array.isArray(estimate.includes)) {
      estimate.includes = [];
    }

    const priceRange = `$${Number(estimate.price_min).toLocaleString()} – $${Number(estimate.price_max).toLocaleString()}`;
    const bodyText = JSON.stringify({ type, complexity, timeline, estimate });

    // Save lead to DB
    await sql`
      INSERT INTO messages (av, sender, subject, preview, body, source, interested, budget, country, unread)
      VALUES (
        ${email.slice(0, 2).toUpperCase()},
        ${email},
        ${"Estimate: " + type + " (" + complexity + ")"},
        ${"Timeline: " + timeline + " · " + priceRange},
        ${bodyText},
        ${"estimator"},
        ${type},
        ${priceRange},
        ${"Unknown"},
        ${true}
      )
    `;

    // Send email if Resend is configured
    if (process.env.RESEND_API_KEY) {
      try {
        const emailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: `Foxmen Studio <${process.env.FROM_EMAIL ?? "hello@foxmen.studio"}>`,
            to: email,
            subject: `Your ${type} estimate — $${Number(estimate.price_min).toLocaleString()} to $${Number(estimate.price_max).toLocaleString()}`,
            html: emailHtml(type, complexity, timeline, estimate),
          }),
        });
        const emailJson = await emailRes.json();
        if (!emailRes.ok) {
          console.error("Resend error:", JSON.stringify(emailJson));
        } else {
          console.log("Email sent:", emailJson.id);
        }
      } catch (e) {
        console.error("Email send error:", e);
      }
    }

    return NextResponse.json(estimate);
  } catch (err) {
    console.error("Estimate error:", err);
    return NextResponse.json({ error: "Failed to generate estimate" }, { status: 500 });
  }
}
