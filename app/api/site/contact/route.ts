import { NextResponse } from "next/server";
import { addInquiry, clientIp, rateLimit } from "@/lib/site/store";
import { isEmail, sameOrigin, str } from "@/lib/site/sanitize";

export const runtime = "nodejs";

// Contact page form -> site_inquiries, read in /admin → Inquiries.
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

  return NextResponse.json({ ok: true });
}
