import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const LOGO  = "https://res.cloudinary.com/djofqa3vc/image/upload/v1778967518/logo_sn_fox_copy_e9sigm.png";
const BRAND = "#B86CF9";
const DARK  = "#8B5DFF";
const IS    = `'Instrument Serif',Georgia,'Times New Roman',serif`;

function buildInviteEmail(data: {
  client_name:   string;
  email:         string;
  password:      string;
  invite_url:    string;
  project_title: string;
  service_type?: string;
}): string {
  const year  = new Date().getFullYear();
  const first = data.client_name.split(" ")[0];

  const body = `
    <!-- eyebrow -->
    <p style="margin:0 0 8px;font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:${BRAND};">Client Portal · Invitation</p>

    <!-- headline -->
    <h1 style="margin:0 0 20px;font-family:${IS};font-size:36px;font-weight:400;color:#0a0a0a;line-height:1.1;letter-spacing:-.02em;">
      Welcome, <em style="font-style:italic;color:${BRAND};">${first}.</em>
    </h1>

    <p class="em-p" style="margin:0 0 28px;font-family:${IS};font-size:16px;line-height:1.85;color:#3a3a3a;">
      We're excited to have you on board. Your dedicated Foxmen Studio client portal is ready — a private space where you can track every milestone, review deliverables, and communicate directly with our team in real time.
    </p>

    <!-- Project card -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"
      style="background:#f9f8f7;border:1.5px solid #ede9e3;border-radius:12px;margin-bottom:32px;overflow:hidden;">
      <tr><td style="padding:22px 26px;">
        <p style="margin:0 0 6px;font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;font-size:9px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#b0b0b0;">Your project</p>
        <p style="margin:0 0 4px;font-family:${IS};font-size:22px;color:#0a0a0a;letter-spacing:-.02em;">${data.project_title}</p>
        ${data.service_type ? `<p style="margin:0 0 14px;font-size:12px;color:#888;font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;">${data.service_type}</p>` : `<div style="height:14px;"></div>`}
        <div style="height:1px;background:#ede9e3;margin-bottom:14px;"></div>
        <table cellpadding="0" cellspacing="0" border="0" role="presentation"><tr>
          <td style="background:rgba(184,108,249,.1);border-radius:50px;padding:5px 14px;">
            <span style="font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;font-size:11px;font-weight:700;color:${BRAND};">Pending Start</span>
          </td>
        </tr></table>
      </td></tr>
    </table>

    <!-- What you can do -->
    <h2 style="margin:0 0 14px;font-family:${IS};font-size:20px;font-weight:400;font-style:italic;color:${BRAND};">What's inside your portal</h2>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-bottom:32px;">
      ${[
        ["Project timeline &amp; milestones", "Track every phase from kickoff to launch, updated in real time."],
        ["Direct messaging with the team",   "Chat with us, share files, and get instant replies — no email threads."],
        ["Live project status",              "Always know where your project stands and what's coming next."],
        ["Offers &amp; upgrades",            "Review any additional scopes or enhancements we propose."],
      ].map(([title, desc]) => `
      <tr><td style="padding:10px 0;border-bottom:1px solid #f0ede8;">
        <p style="margin:0 0 2px;font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;font-size:13px;font-weight:600;color:#0a0a0a;">
          <span style="color:${BRAND};margin-right:8px;">→</span>${title}
        </p>
        <p style="margin:0 0 0 22px;font-family:${IS};font-size:14px;color:#777;line-height:1.6;">${desc}</p>
      </td></tr>`).join("")}
    </table>

    <!-- CTA button -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin:32px 0;">
      <tr><td align="center">
        <a href="${data.invite_url}" style="text-decoration:none;display:inline-block;">
          <table cellpadding="0" cellspacing="0" border="0" role="presentation" style="background:${BRAND};border-radius:999px;overflow:hidden;">
            <tr>
              <td style="font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;font-size:15px;font-weight:500;color:#ffffff;padding:12px 8px 12px 28px;white-space:nowrap;letter-spacing:-.01em;vertical-align:middle;">Access your portal</td>
              <td style="padding:8px 10px 8px 4px;vertical-align:middle;">
                <table cellpadding="0" cellspacing="0" border="0" role="presentation"><tr>
                  <td style="width:40px;height:40px;background:#ffffff;border-radius:50%;text-align:center;vertical-align:middle;">
                    <span style="font-size:18px;line-height:40px;color:${BRAND};font-weight:700;">↗</span>
                  </td>
                </tr></table>
              </td>
            </tr>
          </table>
        </a>
      </td></tr>
    </table>

    <!-- Divider -->
    <div style="height:1px;background:#f0ede8;margin:32px 0;"></div>

    <!-- Credentials -->
    <p style="margin:0 0 16px;font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#999;">Your login credentials</p>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-bottom:10px;">
      <tr>
        <td class="em-cred-cell" width="50%" style="padding-right:8px;vertical-align:top;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"
            style="background:#f4f3f1;border-radius:10px;overflow:hidden;">
            <tr><td style="padding:14px 16px;">
              <p style="margin:0 0 5px;font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;font-size:9px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#aaa;">Email</p>
              <p style="margin:0;font-family:monospace;font-size:13px;color:#0a0a0a;word-break:break-all;">${data.email}</p>
            </td></tr>
          </table>
        </td>
        <td class="em-cred-cell" width="50%" style="padding-left:8px;vertical-align:top;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"
            style="background:#f4f3f1;border-radius:10px;overflow:hidden;">
            <tr><td style="padding:14px 16px;">
              <p style="margin:0 0 5px;font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;font-size:9px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#aaa;">Password</p>
              <p style="margin:0;font-family:monospace;font-size:13px;color:#0a0a0a;font-weight:600;">${data.password}</p>
            </td></tr>
          </table>
        </td>
      </tr>
    </table>

    <p class="em-p" style="margin:16px 0 0;font-family:${IS};font-size:14px;color:#999;line-height:1.7;">
      This invite link expires in <strong style="color:#777;">14 days</strong>. We recommend changing your password after your first login from the portal settings.
    </p>
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="color-scheme" content="light"/>
<meta name="x-apple-disable-message-reformatting"/>
<title>You're invited — Foxmen Studio</title>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet"/>
<style>
@media only screen and (max-width:600px){
  .em-outer    { padding:0 !important; background:#0a0a0a !important; }
  .em-card     { border-radius:0 !important; box-shadow:none !important; }
  .em-hd       { padding:24px 20px 18px !important; }
  .em-hd-lpad  { width:44px !important; padding-right:12px !important; }
  .em-hd-logo  { width:36px !important; height:36px !important; }
  .em-hd-name  { font-size:20px !important; }
  .em-hd-tag   { font-size:8px !important; margin-top:4px !important; }
  .em-hd-meta  { display:none !important; font-size:0 !important; max-height:0 !important; overflow:hidden !important; }
  .em-hd-info  { font-size:10px !important; padding-top:10px !important; }
  .em-body     { padding:28px 20px 24px !important; }
  .em-p        { font-size:15px !important; line-height:1.75 !important; }
  .em-cred-cell{ display:block !important; width:100% !important; padding:0 0 10px !important; }
  .em-sig      { margin-top:24px !important; padding-top:18px !important; }
  .em-sig-name { font-size:18px !important; }
  .em-sig-logo { display:none !important; }
  .em-ft       { padding:14px 20px !important; }
  .em-ft-name  { font-size:13px !important; }
  .em-ft-logo  { display:none !important; }
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
          <p style="margin:0 0 3px;font-size:12px;color:#b8b5b0;letter-spacing:.01em;">Warm regards,</p>
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
    const { client_name, email, password, invite_url, project_title, service_type } = body;

    if (!email || !invite_url || !client_name) {
      return NextResponse.json({ error: "client_name, email, invite_url required" }, { status: 400 });
    }

    const html = buildInviteEmail({ client_name, email, password, invite_url, project_title, service_type });

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from:    `Foxmen Studio <${process.env.FROM_EMAIL ?? "contact@foxmenstudio.com"}>`,
        to:      email,
        subject: `You're invited to your Foxmen Studio client portal`,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("[invite/send-email]", err);
      return NextResponse.json({ error: "Failed to send email.", details: err }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[invite/send-email]", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Server error." }, { status: 500 });
  }
}
