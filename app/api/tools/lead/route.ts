import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, tool, summary } = await req.json() as {
    email: string;
    tool: string;
    summary?: unknown;
  };

  if (!email) {
    return NextResponse.json({ ok: false, error: "Email is required" }, { status: 400 });
  }

  if (!process.env.RESEND_API_KEY) {
    // Gracefully degrade if Resend is not configured
    return NextResponse.json({ ok: true });
  }

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Foxmen Studio Tools <${process.env.FROM_EMAIL ?? "contact@foxmenstudio.com"}>`,
        to: process.env.FROM_EMAIL ?? "contact@foxmenstudio.com",
        subject: `New tool lead: ${tool} — ${email}`,
        html: `
          <p>A new lead captured via the <strong>${tool}</strong> tool.</p>
          <p>Email: <strong>${email}</strong></p>
          <hr />
          <pre style="background:#f5f5f5;padding:16px;border-radius:8px;font-size:13px;">${JSON.stringify(summary, null, 2)}</pre>
          <hr />
          <p style="color:#999;font-size:12px;">Foxmen Studio Free Tools — foxmenstudio.com</p>
        `,
      }),
    });
  } catch (err) {
    console.error("Resend error:", err);
    // Don't fail the user-facing response if email sending fails
  }

  return NextResponse.json({ ok: true });
}
