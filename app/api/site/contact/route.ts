import { NextResponse, after } from "next/server";
import { addInquiry, clientIp, rateLimit } from "@/lib/site/store";
import { esc, isEmail, sameOrigin, str } from "@/lib/site/sanitize";

export const runtime = "nodejs";

const NOTIFY_TO = "yousuf.h.faysal@foxmen.studio";
const FROM = "Foxmen Studio <team@foxmen.studio>";

// Contact page form -> site_inquiries (shown in /admin) + email notification.
export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const q = {
    name: str(b.name, 120),
    email: str(b.email, 254).toLowerCase(),
    phone: str(b.phone, 40),
    company: str(b.company, 160),
    services: str(b.services, 300) || "Not sure yet",
    budget: str(b.budget, 60) || "Not sure",
    message: str(b.message, 5000) || "(No message)",
  };
  if (!q.name || !isEmail(q.email)) return NextResponse.json({ error: "Please enter your name and a valid email." }, { status: 400 });
  if (typeof b.website === "string" && b.website) return NextResponse.json({ ok: true }); // honeypot: bots fill every field

  try {
    if (!(await rateLimit("contact", clientIp(req), 5, 600))) {
      return NextResponse.json({ error: "Too many messages. Please try again in a few minutes." }, { status: 429 });
    }
    await addInquiry(q);
  } catch (e) {
    console.error("[site/contact] save failed", e);
    return NextResponse.json({ error: "Could not send your message right now. Please email us instead." }, { status: 500 });
  }

  if (process.env.RESEND_API_KEY) {
    const row = (k: string, v: string) => v ? `<tr><td style="color:#8F8278;padding:4px 0;width:120px;vertical-align:top">${k}</td><td style="padding:4px 0">${esc(v)}</td></tr>` : "";
    const html = `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#F3EEE4;font-family:Inter,-apple-system,sans-serif;color:#1F1712;">
<div style="max-width:560px;margin:32px auto;background:#FAF7F1;border-radius:24px;overflow:hidden;border:1px solid rgba(31,23,18,.1);">
  <div style="background:#1F1712;color:#F3EEE4;padding:22px 28px;font-weight:800;letter-spacing:-.03em;font-size:18px;">Foxmen Studio</div>
  <div style="padding:28px;">
    <p style="margin:0 0 6px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;font-weight:600;color:#5E5249;">New inquiry</p>
    <h1 style="margin:0 0 20px;font-size:28px;font-weight:800;letter-spacing:-.04em;">${esc(q.name)}</h1>
    <table style="width:100%;border-collapse:collapse;font-size:15px;margin-bottom:20px;">
      ${row("Email", q.email)}${row("Phone", q.phone)}${row("Business", q.company)}${row("Services", q.services)}${row("Budget", q.budget)}
    </table>
    <div style="background:#F3EEE4;border-radius:14px;padding:18px 20px;font-size:15px;line-height:1.6;white-space:pre-wrap;">${esc(q.message)}</div>
  </div>
</div></body></html>`;
    after(async () => {
      try {
        const r = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({ from: FROM, to: [NOTIFY_TO], reply_to: q.email, subject: `New inquiry from ${q.name.replace(/[\r\n]/g, " ")}`, html }),
        });
        if (!r.ok) console.error("[site/contact] resend", r.status, await r.text());
      } catch (e) {
        console.error("[site/contact] resend failed", e);
      }
    });
  }

  return NextResponse.json({ ok: true });
}
