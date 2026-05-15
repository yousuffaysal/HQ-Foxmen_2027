import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(req: Request) {
  const { name, email, message, budget, service } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "name, email and message are required" }, { status: 400 });
  }

  await sql`
    INSERT INTO messages (av, sender, subject, preview, body, source, interested, budget, country)
    VALUES (
      ${name.slice(0, 2).toUpperCase()},
      ${name},
      ${"New enquiry from " + name},
      ${message.slice(0, 80)},
      ${"From: " + email + "\n\n" + message},
      "Contact form · /contact",
      ${service ?? ""},
      ${budget ?? ""},
      ""
    )
  `;

  return NextResponse.json({ ok: true });
}
