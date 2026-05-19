import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const LOGO  = "https://res.cloudinary.com/djofqa3vc/image/upload/v1778967518/logo_sn_fox_copy_e9sigm.png";
const BRAND = "#B86CF9";
const DARK  = "#8B5DFF";
const IS    = `'Instrument Serif',Georgia,'Times New Roman',serif`;

function buildWelcomeEmail(data: {
  client_name: string;
  email:       string;
  fox_id:      string;
  portal_url:  string;
}): string {
  const year  = new Date().getFullYear();
  const first = data.client_name.split(" ")[0];

  const steps = [
    {
      num: "01",
      title: "Discovery",
      desc: "We go deep into your vision, your users, and your goals. No assumptions — only clarity.",
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${BRAND}" stroke-width="1.8" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/></svg>`,
    },
    {
      num: "02",
      title: "Build",
      desc: "Our engineers and designers work in tight loops — shipping, refining, and obsessing over every detail.",
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${BRAND}" stroke-width="1.8" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`,
    },
    {
      num: "03",
      title: "Launch",
      desc: "We deliver something that moves — then we stay with you to ensure it keeps performing.",
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${BRAND}" stroke-width="1.8" xmlns="http://www.w3.org/2000/svg"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`,
    },
  ];

  const perks = [
    ["A dedicated project team",     "Not freelancers. A real team — PM, engineers, designers — all in sync on your project."],
    ["Real-time milestone tracking",  "Every phase of your build is visible in your portal, updated as we work."],
    ["Direct line to your team",      "Message us any time through your portal. No email threads, no waiting."],
    ["Post-launch care",              "We don't disappear after go-live. Bugs, updates, iterations — we've got you."],
  ];

  const body = `
    <!-- eyebrow -->
    <p style="margin:0 0 10px;font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:${BRAND};">Welcome · Member since ${year}</p>

    <!-- headline -->
    <h1 style="margin:0 0 8px;font-family:${IS};font-size:40px;font-weight:400;color:#0a0a0a;line-height:1.08;letter-spacing:-.025em;">
      Welcome to the<br/><em style="font-style:italic;color:${BRAND};">family, ${first}.</em>
    </h1>
    <p style="margin:0 0 32px;font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;font-size:12px;color:#b8b5b0;letter-spacing:.01em;">You're now one of us.</p>

    <!-- Fox ID badge -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-bottom:36px;">
      <tr><td>
        <table cellpadding="0" cellspacing="0" border="0" role="presentation"
          style="background:linear-gradient(135deg,rgba(184,108,249,.08) 0%,rgba(139,93,255,.06) 100%);border:1.5px solid rgba(184,108,249,.25);border-radius:14px;overflow:hidden;">
          <tr><td style="padding:18px 24px;">
            <table cellpadding="0" cellspacing="0" border="0" role="presentation"><tr>
              <td style="vertical-align:middle;padding-right:16px;">
                <div style="width:40px;height:40px;background:rgba(184,108,249,.12);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;text-align:center;line-height:40px;">🦊</div>
              </td>
              <td style="vertical-align:middle;">
                <p style="margin:0 0 3px;font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;font-size:9px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:rgba(184,108,249,.7);">Your Foxmen ID</p>
                <p style="margin:0;font-family:monospace;font-size:22px;font-weight:800;color:${BRAND};letter-spacing:.04em;">${data.fox_id}</p>
              </td>
              <td style="vertical-align:middle;padding-left:24px;border-left:1px solid rgba(184,108,249,.2);">
                <p style="margin:0 0 2px;font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;font-size:9px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:#bbb;">Member</p>
                <p style="margin:0;font-size:11px;color:#777;font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;">Active · ${year}</p>
              </td>
            </tr></table>
          </td></tr>
        </table>
      </td></tr>
    </table>

    <!-- opening -->
    <p class="em-p" style="margin:0 0 16px;font-family:${IS};font-size:17px;line-height:1.9;color:#2a2a2a;">
      You've just joined a small, select group of founders and businesses who chose to build with intention — not just speed. At Foxmen Studio, we don't just write code. We craft digital products that feel alive.
    </p>
    <p class="em-p" style="margin:0 0 36px;font-family:${IS};font-size:17px;line-height:1.9;color:#2a2a2a;">
      Your Fox ID above is your permanent member identifier. It's yours — for every project, every milestone, every conversation we'll ever have together.
    </p>

    <!-- divider label -->
    <p style="margin:0 0 20px;font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:#bbb;">How we build your dreams</p>

    <!-- 3-step process -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-bottom:36px;">
      ${steps.map((s, i) => `
      <tr><td style="padding:${i === 0 ? "0" : "16px"} 0 0;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"
          style="background:#fafaf9;border:1px solid #f0ede8;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="width:56px;padding:20px 0 20px 22px;vertical-align:top;">
              <div style="font-family:monospace;font-size:11px;font-weight:700;color:${BRAND};letter-spacing:.06em;">${s.num}</div>
            </td>
            <td style="padding:20px 22px 20px 0;vertical-align:top;">
              <p style="margin:0 0 5px;font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;font-size:14px;font-weight:700;color:#0a0a0a;letter-spacing:-.01em;">${s.title}</p>
              <p style="margin:0;font-family:${IS};font-size:14px;color:#777;line-height:1.7;">${s.desc}</p>
            </td>
            <td style="width:40px;padding:20px 22px 20px 0;vertical-align:middle;text-align:right;opacity:.5;">${s.icon}</td>
          </tr>
        </table>
      </td></tr>`).join("")}
    </table>

    <!-- what's included -->
    <p style="margin:0 0 16px;font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:#bbb;">What you get</p>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-bottom:36px;">
      ${perks.map(([title, desc]) => `
      <tr><td style="padding:11px 0;border-bottom:1px solid #f0ede8;">
        <p style="margin:0 0 3px;font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;font-size:13px;font-weight:600;color:#0a0a0a;">
          <span style="color:${BRAND};margin-right:8px;">→</span>${title}
        </p>
        <p style="margin:0 0 0 22px;font-family:${IS};font-size:14px;color:#888;line-height:1.65;">${desc}</p>
      </td></tr>`).join("")}
    </table>

    <!-- CTA -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin:36px 0 32px;">
      <tr><td align="center">
        <a href="${data.portal_url}" style="text-decoration:none;display:inline-block;">
          <table cellpadding="0" cellspacing="0" border="0" role="presentation"
            style="background:#0a0a0a;border-radius:999px;overflow:hidden;">
            <tr>
              <td style="font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;font-size:14px;font-weight:600;color:#ffffff;padding:13px 8px 13px 30px;white-space:nowrap;letter-spacing:-.01em;vertical-align:middle;">Enter your portal</td>
              <td style="padding:8px 10px 8px 4px;vertical-align:middle;">
                <table cellpadding="0" cellspacing="0" border="0" role="presentation"><tr>
                  <td style="width:40px;height:40px;background:${BRAND};border-radius:50%;text-align:center;vertical-align:middle;">
                    <span style="font-size:18px;line-height:40px;color:#ffffff;font-weight:700;">↗</span>
                  </td>
                </tr></table>
              </td>
            </tr>
          </table>
        </a>
      </td></tr>
    </table>

    <div style="height:1px;background:#f0ede8;margin:32px 0;"></div>

    <!-- personal note -->
    <p class="em-p" style="margin:0 0 8px;font-family:${IS};font-size:16px;line-height:1.85;color:#555;font-style:italic;">
      "We started Foxmen Studio because great software shouldn't be a privilege. It should be available to anyone with a dream worth building — and the courage to pursue it."
    </p>
    <p style="margin:0;font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;font-size:11px;color:#bbb;letter-spacing:.01em;">— The Foxmen Studio Team</p>
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="color-scheme" content="light"/>
<meta name="x-apple-disable-message-reformatting"/>
<title>Welcome to Foxmen Studio</title>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet"/>
<style>
@media only screen and (max-width:600px){
  .em-outer   { padding:0 !important; background:#0a0a0a !important; }
  .em-card    { border-radius:0 !important; box-shadow:none !important; }
  .em-hd      { padding:24px 20px 18px !important; }
  .em-hd-lpad { width:44px !important; padding-right:12px !important; }
  .em-hd-logo { width:36px !important; height:36px !important; }
  .em-hd-name { font-size:20px !important; }
  .em-hd-tag  { font-size:8px !important; margin-top:4px !important; }
  .em-hd-meta { display:none !important; font-size:0 !important; max-height:0 !important; overflow:hidden !important; }
  .em-hd-info { font-size:10px !important; padding-top:10px !important; }
  .em-body    { padding:28px 20px 24px !important; }
  .em-p       { font-size:15px !important; line-height:1.75 !important; }
  .em-sig     { margin-top:24px !important; padding-top:18px !important; }
  .em-sig-name{ font-size:18px !important; }
  .em-sig-logo{ display:none !important; }
  .em-ft      { padding:14px 20px !important; }
  .em-ft-name { font-size:13px !important; }
  .em-ft-logo { display:none !important; }
}
</style>
</head>
<body style="margin:0;padding:0;background:#f1efe9;font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
<table class="em-outer" width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="padding:40px 16px;background:#f1efe9;">
<tr><td align="center">
<table class="em-card" width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 8px 48px rgba(0,0,0,.12);">

  <!-- HEADER -->
  <tr><td class="em-hd" style="background:#0a0a0a;padding:36px 60px 28px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"><tr>
      <td class="em-hd-lpad" style="vertical-align:middle;width:56px;padding-right:16px;">
        <img class="em-hd-logo" src="${LOGO}" height="46" width="46" alt="Foxmen Studio" style="display:block;border-radius:5px;"/>
      </td>
      <td style="vertical-align:middle;">
        <div class="em-hd-name" style="font-family:${IS};font-size:26px;font-weight:400;color:#ffffff;letter-spacing:-.02em;line-height:1.1;">Foxmen <em style="font-style:italic;color:${BRAND};">Studio</em></div>
        <div class="em-hd-tag" style="font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:${BRAND};margin-top:5px;">Code &middot; Craft &middot; Care</div>
      </td>
      <td class="em-hd-meta" style="text-align:right;vertical-align:middle;">
        <a href="https://foxmen.studio" style="display:block;font-size:11px;color:${BRAND};text-decoration:none;letter-spacing:.01em;margin-bottom:5px;">https://foxmen.studio</a>
        <div style="font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-bottom:5px;">US &middot; UK &middot; International</div>
        <div style="font-size:10px;color:rgba(255,255,255,.38);">contact@foxmenstudio.com</div>
      </td>
    </tr></table>
    <div style="height:1px;background:rgba(255,255,255,.15);margin:20px 0 16px;"></div>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
      <tr>
        <td class="em-hd-info" style="font-size:11px;color:rgba(255,255,255,.5);line-height:1.6;">Web apps &nbsp;·&nbsp; AI-integrated products &nbsp;·&nbsp; Mobile &amp; software</td>
        <td style="text-align:right;white-space:nowrap;font-size:11px;"><strong style="color:rgba(255,255,255,.75);font-weight:500;">contact@foxmenstudio.com</strong></td>
      </tr>
    </table>
  </td></tr>

  <!-- ACCENT LINE -->
  <tr><td style="height:3px;background:linear-gradient(90deg,${BRAND},${DARK});font-size:0;line-height:0;">&nbsp;</td></tr>

  <!-- BODY -->
  <tr><td class="em-body" style="padding:52px 60px 44px;">
    ${body}

    <!-- SIGNATURE -->
    <table class="em-sig" width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-top:44px;padding-top:24px;border-top:1px solid #f0ede8;">
      <tr>
        <td style="vertical-align:bottom;">
          <p style="margin:0 0 3px;font-size:12px;color:#b8b5b0;letter-spacing:.01em;">With excitement,</p>
          <p class="em-sig-name" style="margin:0 0 4px;font-family:${IS};font-size:22px;font-weight:400;color:#0a0a0a;font-style:italic;">The Foxmen Team</p>
          <p style="margin:0;font-size:11px;color:#c8c5c0;">foxmen.studio &nbsp;·&nbsp; contact@foxmenstudio.com</p>
        </td>
        <td class="em-sig-logo" style="text-align:right;vertical-align:bottom;width:44px;">
          <img src="${LOGO}" height="30" width="30" alt="" style="display:block;margin-left:auto;opacity:.15;"/>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- FOOTER -->
  <tr><td style="background:#0a0a0a;">
    <div style="height:2px;background:linear-gradient(90deg,${BRAND},${DARK});"></div>
    <div class="em-ft" style="padding:22px 60px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"><tr>
        <td style="vertical-align:middle;">
          <div class="em-ft-name" style="font-family:${IS};font-size:15px;color:rgba(255,255,255,.7);font-style:italic;">Foxmen Studio</div>
          <p style="margin:4px 0 0;font-size:10px;color:rgba(255,255,255,.45);line-height:1.8;">
            <a href="https://foxmen.studio" style="color:rgba(255,255,255,.65);text-decoration:none;">foxmen.studio</a>
            &nbsp;·&nbsp; contact@foxmenstudio.com<br/>
            &copy; ${year} Foxmen Studio. All rights reserved.
          </p>
        </td>
        <td class="em-ft-logo" style="text-align:right;vertical-align:middle;">
          <img src="${LOGO}" height="26" width="26" alt="" style="display:block;margin-left:auto;opacity:.15;"/>
        </td>
      </tr></table>
    </div>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

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

    const html = buildWelcomeEmail({ client_name, email, fox_id, portal_url: portal_url ?? "https://foxmen.studio/portal" });

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from:    `Foxmen Studio <${process.env.FROM_EMAIL ?? "contact@foxmenstudio.com"}>`,
        to:      email,
        subject: `Welcome to Foxmen Studio, ${client_name.split(" ")[0]} — let's build something extraordinary`,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("[welcome-email]", err);
      return NextResponse.json({ error: "Failed to send email", details: err }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[welcome-email]", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}
