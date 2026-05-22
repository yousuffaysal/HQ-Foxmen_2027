import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(req: Request) {
  const { name, email, company, whatsapp, message, budget, service, sources, trial } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "name, email and message are required" }, { status: 400 });
  }

  const lines = [
    `From: ${email}`,
    company   ? `Company: ${company}`                  : null,
    whatsapp  ? `WhatsApp: ${whatsapp}`                : null,
    budget    ? `Budget: ${budget}`                    : null,
    service   ? `Service: ${service}`                  : null,
    sources?.length ? `Heard via: ${sources.join(", ")}` : null,
    trial     ? `Trial requested: Yes (20hrs)`         : null,
    ``,
    message,
  ].filter(l => l !== null).join("\n");

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

  return NextResponse.json({ ok: true });
}
