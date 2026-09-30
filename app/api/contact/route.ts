import { esc } from "@/lib/site/sanitize";
import { clientIp, rateLimit } from "@/lib/site/store";
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

const NOTIFY_TO = "yousuf.h.faysal@foxmen.studio";
const FROM      = "Foxmen Studio <team@foxmen.studio>";

export async function POST(req: Request) {
  if (!(await rateLimit("contact", clientIp(req), 5, 600))) return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  const { name, email, company, whatsapp, message, budget, service, sources, trial } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "name, email and message are required" }, { status: 400 });
  }

  const lines = [
    `From: ${email}`,
    company        ? `Company: ${company}`                   : null,
    whatsapp       ? `WhatsApp: ${whatsapp}`                 : null,
    budget         ? `Budget: ${budget}`                     : null,
    service        ? `Service: ${service}`                   : null,
    sources?.length ? `Heard via: ${sources.join(", ")}`     : null,
    trial          ? `Trial requested: Yes (20hrs)`          : null,
    ``,
    message,
  ].filter(l => l !== null).join("\n");

  // Save to inbox
  await sql`
    INSERT INTO messages (av, sender, subject, preview, body, source, interested, budget, country)
    VALUES (
      ${name.slice(0, 2).toUpperCase()},
      ${name},
      ${"New enquiry from " + name},
      ${message.slice(0, 80)},
      ${lines},
      ${"Contact form · /contact"},
      ${service ?? ""},
      ${budget ?? ""},
      ${""}
    )
  `;

  // Send email notification (fire-and-forget — don't fail the response if email errors)
  if (process.env.RESEND_API_KEY) {
    const e = (v: unknown) => esc(String(v ?? ""));
    const rows = [
      company  && `<tr><td style="color:#888;padding:3px 0;width:110px;vertical-align:top">Company</td><td style="padding:3px 0">${e(company)}</td></tr>`,
      whatsapp && `<tr><td style="color:#888;padding:3px 0;width:110px;vertical-align:top">WhatsApp</td><td style="padding:3px 0">${e(whatsapp)}</td></tr>`,
      budget   && `<tr><td style="color:#888;padding:3px 0;width:110px;vertical-align:top">Budget</td><td style="padding:3px 0">${e(budget)}</td></tr>`,
      service  && `<tr><td style="color:#888;padding:3px 0;width:110px;vertical-align:top">Service</td><td style="padding:3px 0">${e(service)}</td></tr>`,
      sources?.length && `<tr><td style="color:#888;padding:3px 0;width:110px;vertical-align:top">Heard via</td><td style="padding:3px 0">${e(sources.join(", "))}</td></tr>`,
      trial    && `<tr><td style="color:#888;padding:3px 0;width:110px;vertical-align:top">Trial</td><td style="padding:3px 0">Yes (20 hrs)</td></tr>`,
    ].filter(Boolean).join("");

    const html = `
<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f8f5f0;font-family:-apple-system,sans-serif;">
<div style="max-width:560px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #f0ede8;">
  <div style="background:#0a0a0a;padding:24px 32px;display:flex;align-items:center;gap:12px;">
    <img src="https://res.cloudinary.com/djofqa3vc/image/upload/v1778967518/logo_sn_fox_copy_e9sigm.png" width="36" height="36" style="border-radius:8px;" alt=""/>
    <span style="color:#fff;font-size:16px;letter-spacing:-.01em;">Foxmen <em style="font-style:italic;color:#b86cf9;">Studio</em></span>
  </div>
  <div style="padding:32px;">
    <p style="margin:0 0 4px;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#b86cf9;font-weight:700;">New Enquiry</p>
    <h1 style="margin:0 0 24px;font-size:24px;color:#0a0a0a;font-weight:400;letter-spacing:-.02em;">${e(name)}</h1>
    <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:24px;">
      <tr><td style="color:#888;padding:3px 0;width:110px;vertical-align:top">Email</td><td style="padding:3px 0"><a href="mailto:${e(email)}" style="color:#b86cf9;">${e(email)}</a></td></tr>
      ${rows}
    </table>
    <div style="background:#f8f5f0;border-radius:12px;padding:20px 24px;font-size:15px;line-height:1.7;color:#0a0a0a;white-space:pre-wrap;">${e(message)}</div>
    <div style="margin-top:24px;">
      <a href="mailto:${e(email)}?subject=Re: Your enquiry to Foxmen Studio" style="display:inline-block;background:#b86cf9;color:#fff;padding:10px 22px;border-radius:999px;font-size:13px;text-decoration:none;">Reply to ${e(name)}</a>
    </div>
  </div>
  <div style="padding:16px 32px;border-top:1px solid #f0ede8;font-size:11px;color:#aaa;">Foxmen Studio · foxmen.studio</div>
</div>
</body></html>`;

    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to: [NOTIFY_TO], reply_to: email, subject: `New enquiry from ${String(name).replace(/[\r\n]/g, " ")}`, html }),
    }).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
