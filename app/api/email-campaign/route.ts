import { NextResponse } from "next/server";

const LOGO = "https://res.cloudinary.com/djofqa3vc/image/upload/v1778967518/logo_sn_fox_copy_e9sigm.png";
const BRAND_COLOR = "#B86CF9";
const BRAND_DARK  = "#8B5DFF";

function parseRawContent(raw: string): string {
  const lines = raw.split(/\r?\n/);
  const out: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trimEnd();

    if (!line.trim()) { i++; continue; }

    if (line.startsWith("## ")) {
      out.push(`<h2 style="font-size:18px;font-weight:700;color:#0a0a0a;margin:32px 0 10px;letter-spacing:-.01em;">${line.slice(3)}</h2>`);
    } else if (line.startsWith("### ")) {
      out.push(`<h3 style="font-size:15px;font-weight:700;color:#0a0a0a;margin:24px 0 8px;">${line.slice(4)}</h3>`);
    } else if (line.trim() === "---") {
      out.push(`<div style="height:1px;background:#f0ede8;margin:28px 0;"></div>`);
    } else if (line.startsWith("> ")) {
      out.push(`<blockquote style="margin:20px 0;padding:14px 20px;background:#faf8ff;border-left:3px solid ${BRAND_COLOR};font-size:15px;color:#4b4b4b;line-height:1.7;font-style:italic;">${line.slice(2)}</blockquote>`);
    } else if (/^[-•*]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-•*]\s/.test(lines[i].trimStart())) {
        const txt = lines[i].replace(/^[-•*]\s/, "");
        items.push(`<li style="padding:3px 0;font-size:15px;color:#4b4b4b;line-height:1.7;">${applyInline(txt)}</li>`);
        i++;
      }
      out.push(`<ul style="margin:10px 0 16px;padding-left:22px;">${items.join("")}</ul>`);
      continue;
    } else if (/^\d+[.)]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+[.)]\s/.test(lines[i].trimStart())) {
        const txt = lines[i].replace(/^\d+[.)]\s/, "");
        items.push(`<li style="padding:3px 0;font-size:15px;color:#4b4b4b;line-height:1.7;">${applyInline(txt)}</li>`);
        i++;
      }
      out.push(`<ol style="margin:10px 0 16px;padding-left:22px;">${items.join("")}</ol>`);
      continue;
    } else if (/^\[(.+)\]\((https?:\/\/[^)]+)\)$/.test(line.trim())) {
      const m = line.trim().match(/^\[(.+)\]\((https?:\/\/[^)]+)\)$/);
      if (m) {
        out.push(`<div style="text-align:center;margin:32px 0;"><a href="${m[2]}" style="display:inline-block;background:${BRAND_COLOR};color:#fff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 40px;border-radius:8px;letter-spacing:-.01em;">${m[1]}</a></div>`);
      }
    } else if (/^https?:\/\/\S+$/.test(line.trim())) {
      out.push(`<div style="text-align:center;margin:32px 0;"><a href="${line.trim()}" style="display:inline-block;background:${BRAND_COLOR};color:#fff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 40px;border-radius:8px;letter-spacing:-.01em;">View now →</a></div>`);
    } else {
      out.push(`<p style="margin:0 0 16px;font-size:15px;line-height:1.8;color:#4b4b4b;">${applyInline(line)}</p>`);
    }
    i++;
  }
  return out.join("\n");
}

function applyInline(t: string): string {
  return t
    .replace(/\*\*(.+?)\*\*/g, '<strong style="font-weight:700;color:#0a0a0a;">$1</strong>')
    .replace(/\*(.+?)\*/g,     '<em style="font-style:italic;">$1</em>')
    .replace(/`(.+?)`/g,       '<code style="font-family:monospace;font-size:13px;background:#f4f4f2;padding:1px 5px;border-radius:3px;">$1</code>');
}

export function buildEmailCampaignHtml(subject: string, rawContent: string): string {
  const bodyHtml = parseRawContent(rawContent);
  const year = new Date().getFullYear();
  const IS = `'Instrument Serif',Georgia,'Times New Roman',serif`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="color-scheme" content="light"/>
<title>${subject}</title>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet"/>
</head>
<body style="margin:0;padding:40px 16px;background:#f1efe9;font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 48px rgba(0,0,0,.12);">

  <!-- HEADER -->
  <tr><td style="background:#0a0a0a;padding:36px 48px 28px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"><tr>
      <td style="vertical-align:middle;width:52px;padding-right:16px;">
        <img src="${LOGO}" height="46" width="46" alt="Foxmen Studio" style="display:block;"/>
      </td>
      <td style="vertical-align:middle;">
        <div style="font-family:${IS};font-size:26px;font-weight:400;color:#ffffff;letter-spacing:-.02em;line-height:1.1;">Foxmen <em style="font-style:italic;color:${BRAND_COLOR};">Studio</em></div>
        <div style="font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:rgba(255,255,255,.55);margin-top:7px;">Code · Craft · Care</div>
      </td>
      <td style="text-align:right;vertical-align:middle;">
        <div style="font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.38);line-height:1.9;">Est. 2019<br/>AI-Powered</div>
      </td>
    </tr></table>
    <div style="height:1px;background:rgba(255,255,255,.12);margin:20px 0 16px;"></div>
    <div style="font-size:11px;color:rgba(255,255,255,.5);">
      <strong style="color:rgba(255,255,255,.78);font-weight:500;">contact@foxmenstudio.com</strong> &nbsp;·&nbsp; foxmen.studio
    </div>
  </td></tr>

  <!-- ACCENT LINE -->
  <tr><td style="height:3px;background:linear-gradient(90deg,${BRAND_COLOR},${BRAND_DARK});font-size:0;line-height:0;">&nbsp;</td></tr>

  <!-- BODY -->
  <tr><td style="padding:48px 48px 40px;">
    ${bodyHtml}

    <!-- SIGNATURE -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-top:40px;padding-top:24px;border-top:1px solid #f0ede8;">
      <tr>
        <td style="vertical-align:bottom;">
          <p style="margin:0 0 3px;font-size:12px;color:#b8b5b0;letter-spacing:.01em;">Warm regards,</p>
          <p style="margin:0 0 4px;font-family:${IS};font-size:22px;font-weight:400;color:#0a0a0a;font-style:italic;">The Foxmen Team</p>
          <p style="margin:0;font-size:11px;color:#c8c5c0;">foxmen.studio · contact@foxmenstudio.com</p>
        </td>
        <td style="text-align:right;vertical-align:bottom;width:44px;">
          <img src="${LOGO}" height="30" width="30" alt="" style="display:block;margin-left:auto;opacity:.15;"/>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- FOOTER -->
  <tr><td style="background:#0a0a0a;">
    <div style="height:2px;background:linear-gradient(90deg,${BRAND_COLOR},${BRAND_DARK});"></div>
    <div style="padding:22px 48px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"><tr>
        <td style="vertical-align:middle;">
          <div style="font-family:${IS};font-size:15px;color:rgba(255,255,255,.6);font-style:italic;">Foxmen Studio</div>
          <p style="margin:4px 0 0;font-size:10px;color:rgba(255,255,255,.42);line-height:1.8;">
            <a href="https://foxmen.studio" style="color:rgba(255,255,255,.6);text-decoration:none;">foxmen.studio</a>
            &nbsp;·&nbsp;contact@foxmenstudio.com<br/>
            © ${year} Foxmen Studio. All rights reserved.
          </p>
        </td>
        <td style="text-align:right;vertical-align:middle;">
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
  const { to, subject, rawContent } = await req.json();

  if (!to)         return NextResponse.json({ error: "No recipient" },  { status: 400 });
  if (!subject)    return NextResponse.json({ error: "No subject" },    { status: 400 });
  if (!rawContent) return NextResponse.json({ error: "No content" },    { status: 400 });

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "RESEND_API_KEY not configured" }, { status: 500 });
  }

  const html = buildEmailCampaignHtml(subject, rawContent);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `Foxmen Studio <${process.env.FROM_EMAIL ?? "contact@foxmenstudio.com"}>`,
      to,
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error("Resend campaign error:", err);
    return NextResponse.json({ error: "Email failed", details: err }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
