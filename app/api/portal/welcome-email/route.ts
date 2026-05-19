import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { sendWelcomeEmail } from "@/lib/welcome-email";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const role    = (session?.user as { role?: string })?.role;
    if (role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const { client_name, email, fox_id, portal_url } = body;

    if (!email || !client_name || !fox_id) {
      return NextResponse.json({ error: "client_name, email, and fox_id are required" }, { status: 400 });
    }

    await sendWelcomeEmail({
      client_name,
      email,
      fox_id,
      portal_url: portal_url ?? "https://foxmen.studio/portal",
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[welcome-email]", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}
