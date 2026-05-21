import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";

const LOGO        = "https://res.cloudinary.com/djofqa3vc/image/upload/v1778967518/logo_sn_fox_copy_e9sigm.png";
const BRAND_COLOR = "#B86CF9";
const BRAND_DARK  = "#8B5DFF";
const IS          = `'Instrument Serif',Georgia,'Times New Roman',serif`;

function applyInline(t: string): string {
  return t
    .replace(/\*\*(.+?)\*\*/g, '<strong style="font-weight:700;color:#0a0a0a;">$1</strong>')
    .replace(/\*(.+?)\*/g,     '<em style="font-style:italic;">$1</em>')
    .replace(/`(.+?)`/g,       '<code style="font-family:monospace;font-size:13px;background:#f4f4f2;padding:1px 5px;border-radius:3px;">$1</code>');
}

function ctaButton(label: string, url: string, color: string = "#0a0a0a"): string {
  const arrow = `<img class="em-arr" src="https://res.cloudinary.com/djofqa3vc/image/upload/v1778990209/arrow-northeast.svg" width="18" height="18" alt="" border="0" style="display:block;margin:0 auto;"/>`;
  return `<table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin:32px 0;"><tr><td align="center">
<a href="${url}" style="text-decoration:none;display:inline-block;">
<table class="em-cta-tbl" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background:${color};border-radius:999px;overflow:hidden;">
<tr>
  <td class="em-cta-lbl" style="font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;font-size:15px;font-weight:500;color:#ffffff;padding:11px 8px 11px 26px;white-space:nowrap;letter-spacing:-.01em;vertical-align:middle;">${label}</td>
  <td style="padding:8px 8px 8px 4px;vertical-align:middle;">
    <table cellpadding="0" cellspacing="0" border="0" role="presentation"><tr>
      <td class="em-cta-chip" style="width:42px;height:42px;background:#ffffff;border-radius:50%;text-align:center;vertical-align:middle;">${arrow}</td>
    </tr></table>
  </td>
</tr>
</table></a>
</td></tr></table>`;
}

function parseRawContent(raw: string, btnColor: string = "#0a0a0a"): string {
  const lines = raw.split(/\r?\n/);
  const out: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trimEnd();

    if (!line.trim()) { i++; continue; }

    if (line.startsWith("## ")) {
      out.push(`<h2 class="em-h2" style="font-family:${IS};font-size:24px;font-weight:400;font-style:italic;color:${BRAND_COLOR};margin:36px 0 12px;letter-spacing:-.01em;line-height:1.2;">${line.slice(3)}</h2>`);
    } else if (line.startsWith("### ")) {
      out.push(`<h3 class="em-h3" style="font-family:${IS};font-size:18px;font-weight:400;color:#1a1a1a;margin:28px 0 10px;line-height:1.3;">${line.slice(4)}</h3>`);
    } else if (line.trim() === "---") {
      out.push(`<div style="height:1px;background:#f0ede8;margin:32px 0;"></div>`);
    } else if (line.startsWith("> ")) {
      out.push(`<blockquote class="em-quote" style="margin:24px 0;padding:16px 24px;background:#faf8ff;border-left:3px solid ${BRAND_COLOR};font-family:${IS};font-size:16px;color:#4b4b4b;line-height:1.75;font-style:italic;">${line.slice(2)}</blockquote>`);
    } else if (/^!\[([^\]]*)\]\((https?:\/\/[^)]+)\)$/.test(line.trim())) {
      const m = line.trim().match(/^!\[([^\]]*)\]\((https?:\/\/[^)]+)\)$/)!;
      const caption = m[1];
      const url     = m[2];
      out.push(`<div class="em-img-wrap" style="margin:28px 0;text-align:center;">
  <img src="${url}" alt="${caption}" width="480" style="display:block;width:100%;max-width:480px;height:auto;border-radius:10px;margin:0 auto;border:0;"/>
  ${caption ? `<p style="margin:10px 0 0;font-family:${IS};font-size:13px;font-style:italic;color:#a0a0a0;">${caption}</p>` : ""}
</div>`);
    } else if (/^\[(.+)\]\((https?:\/\/[^)]+)\)(\{(#[0-9a-fA-F]{3,6})\})?$/.test(line.trim())) {
      const m = line.trim().match(/^\[(.+)\]\((https?:\/\/[^)]+)\)(\{(#[0-9a-fA-F]{3,6})\})?$/)!;
      out.push(ctaButton(m[1], m[2], m[4] ?? btnColor));
    } else if (/^[-•*]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-•*]\s/.test(lines[i].trimStart())) {
        const txt = lines[i].replace(/^[-•*]\s/, "");
        items.push(`<li class="em-li" style="padding:4px 0;font-family:${IS};font-size:16px;color:#3a3a3a;line-height:1.75;">${applyInline(txt)}</li>`);
        i++;
      }
      out.push(`<ul style="margin:12px 0 20px;padding-left:24px;">${items.join("")}</ul>`);
      continue;
    } else if (/^\d+[.)]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+[.)]\s/.test(lines[i].trimStart())) {
        const txt = lines[i].replace(/^\d+[.)]\s/, "");
        items.push(`<li class="em-li" style="padding:4px 0;font-family:${IS};font-size:16px;color:#3a3a3a;line-height:1.75;">${applyInline(txt)}</li>`);
        i++;
      }
      out.push(`<ol style="margin:12px 0 20px;padding-left:24px;">${items.join("")}</ol>`);
      continue;
    } else {
      out.push(`<p class="em-p" style="margin:0 0 18px;font-family:${IS};font-size:16px;line-height:1.85;color:#3a3a3a;">${applyInline(line)}</p>`);
    }
    i++;
  }
  return out.join("\n");
}

/* ── Hero image row ── */
function buildHeroSection(heroImage: string): string {
  if (!heroImage) return "";
  return `\n  <tr><td style="padding:0;margin:0;font-size:0;line-height:0;"><img src="${heroImage}" alt="" width="600" style="display:block;width:100%;max-width:600px;height:auto;border:0;"/></td></tr>`;
}

/* ── Shared email shell (header + accent line + footer) ── */
function emailShell(subject: string, bodyHtml: string, heroImage = ""): string {
  const year = new Date().getFullYear();
  const heroRow = buildHeroSection(heroImage);
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="color-scheme" content="light"/>
<meta name="x-apple-disable-message-reformatting"/>
<title>${subject}</title>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet"/>
<style>
.em-arr{display:block;}
@media only screen and (max-width:600px){
  .em-outer   { padding:0 !important; background:#0a0a0a !important; }
  .em-card    { border-radius:0 !important; box-shadow:none !important; }
  .em-hd      { padding:24px 20px 18px !important; }
  .em-hd-lpad { width:44px !important; padding-right:12px !important; }
  .em-hd-logo { width:36px !important; height:36px !important; }
  .em-hd-name { font-size:19px !important; }
  .em-hd-tag  { font-size:8px !important; margin-top:4px !important; }
  .em-hd-meta { display:none !important; font-size:0 !important; max-height:0 !important; overflow:hidden !important; }
  .em-hd-info { font-size:10px !important; padding-top:10px !important; }
  .em-body    { padding:28px 20px 24px !important; }
  .em-h2      { font-size:21px !important; margin:24px 0 9px !important; }
  .em-h3      { font-size:16px !important; margin:20px 0 7px !important; }
  .em-p       { font-size:15px !important; line-height:1.75 !important; margin:0 0 13px !important; }
  .em-li      { font-size:15px !important; }
  .em-quote   { padding:11px 14px !important; font-size:14px !important; margin:16px 0 !important; }
  .em-img-wrap { margin:18px 0 !important; }
  .em-cta-tbl { width:100% !important; border-radius:999px !important; }
  .em-cta-lbl { padding:13px 8px 13px 22px !important; font-size:14px !important; }
  .em-cta-chip { width:38px !important; height:38px !important; }
  .em-sig     { margin-top:24px !important; padding-top:18px !important; }
  .em-sig-name { font-size:18px !important; }
  .em-sig-logo { display:none !important; }
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
        <div class="em-hd-name" style="font-family:${IS};font-size:26px;font-weight:400;color:#ffffff;letter-spacing:-.02em;line-height:1.1;">Foxmen <em style="font-style:italic;color:${BRAND_COLOR};">Studio</em></div>
        <div style="font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:${BRAND_COLOR};margin-top:5px;">Code &middot; Craft &middot; Care</div>
      </td>
      <td class="em-hd-meta" style="text-align:right;vertical-align:middle;">
        <a href="https://foxmen.studio" style="display:block;font-size:11px;color:${BRAND_COLOR};text-decoration:none;letter-spacing:.01em;margin-bottom:5px;">https://foxmen.studio</a>
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
  <tr><td style="height:3px;background:linear-gradient(90deg,${BRAND_COLOR},${BRAND_DARK});font-size:0;line-height:0;">&nbsp;</td></tr>
${heroRow}
  <!-- BODY -->
  <tr><td class="em-body" style="padding:52px 60px 44px;">
    ${bodyHtml}

    <!-- SIGNATURE -->
    <table class="em-sig" width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-top:44px;padding-top:24px;border-top:1px solid #f0ede8;">
      <tr>
        <td style="vertical-align:bottom;">
          <p style="margin:0 0 3px;font-size:12px;color:#b8b5b0;letter-spacing:.01em;">Warm regards,</p>
          <p class="em-sig-name" style="margin:0 0 4px;font-family:${IS};font-size:22px;font-weight:400;color:#0a0a0a;font-style:italic;">The Foxmen Team</p>
          <p style="margin:0;font-size:11px;color:#c8c5c0;">foxmen.studio · contact@foxmenstudio.com</p>
        </td>
        <td class="em-sig-logo" style="text-align:right;vertical-align:bottom;width:44px;">
          <img src="${LOGO}" height="30" width="30" alt="" style="display:block;margin-left:auto;opacity:.15;"/>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- FOOTER -->
  <tr><td style="background:#0a0a0a;">
    <div style="height:2px;background:linear-gradient(90deg,${BRAND_COLOR},${BRAND_DARK});"></div>
    <div class="em-ft" style="padding:22px 60px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"><tr>
        <td style="vertical-align:middle;">
          <div class="em-ft-name" style="font-family:${IS};font-size:15px;color:rgba(255,255,255,.7);font-style:italic;">Foxmen Studio</div>
          <p style="margin:4px 0 0;font-size:10px;color:rgba(255,255,255,.45);line-height:1.8;">
            <a href="https://foxmen.studio" style="color:rgba(255,255,255,.65);text-decoration:none;">foxmen.studio</a>
            &nbsp;·&nbsp;contact@foxmenstudio.com<br/>
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

export function buildEmailCampaignHtml(subject: string, rawContent: string, btnColor: string = "#0a0a0a", heroImage = "", isCustom = false): string {
  const bodyHtml = isCustom ? rawContent : parseRawContent(rawContent, btnColor);
  return emailShell(subject, bodyHtml, heroImage);
}

/* ── Proposal email ── */
interface ProposalEmailData {
  clientName: string;
  projectTitle: string;
  summary: string;
  scopeItems: string[];
  timeline: string;
  investment: string;
  ctaUrl: string;
  subject: string;
  heroImage: string;
  btnColor: string;
}

function buildProposalHtml(data: ProposalEmailData): string {
  const scopeRows = (data.scopeItems || []).map(item =>
    `<tr><td style="padding:10px 0;border-bottom:1px solid #f0ede8;font-family:${IS};font-size:16px;color:#3a3a3a;line-height:1.6;">
      <span style="color:${BRAND_COLOR};margin-right:10px;">→</span>${item}
    </td></tr>`
  ).join("");

  const ctaHtml = data.ctaUrl ? ctaButton("Schedule a Call", data.ctaUrl, data.btnColor || "#0a0a0a") : "";

  const bodyHtml = `
    <!-- eyebrow -->
    <p style="margin:0 0 8px;font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:${BRAND_COLOR};">Prepared For</p>

    <!-- Client Name -->
    <h1 style="margin:0 0 24px;font-family:${IS};font-size:36px;font-weight:400;color:#0a0a0a;line-height:1.1;letter-spacing:-.02em;">${data.clientName || "Valued Client"}</h1>

    <!-- divider -->
    <div style="height:1px;background:#f0ede8;margin:0 0 24px;"></div>

    <!-- Project Title -->
    <h2 style="margin:0 0 20px;font-family:${IS};font-size:28px;font-weight:400;color:#1a1a1a;line-height:1.2;letter-spacing:-.01em;">${data.projectTitle || ""}</h2>

    <!-- Summary -->
    ${data.summary ? `<p class="em-p" style="margin:0 0 32px;font-family:${IS};font-size:16px;line-height:1.85;color:#3a3a3a;">${data.summary}</p>` : ""}

    <!-- 01 SCOPE -->
    <p style="margin:0 0 12px;font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:${BRAND_COLOR};">01 &nbsp; Scope of Work</p>
    ${scopeRows ? `<table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-bottom:32px;">${scopeRows}</table>` : ""}

    <!-- 02 TIMELINE -->
    <p style="margin:0 0 10px;font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:${BRAND_COLOR};">02 &nbsp; Timeline</p>
    <p class="em-p" style="margin:0 0 32px;font-family:${IS};font-size:16px;line-height:1.85;color:#3a3a3a;">${data.timeline || ""}</p>

    <!-- 03 INVESTMENT -->
    <p style="margin:0 0 12px;font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:${BRAND_COLOR};">03 &nbsp; Investment</p>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-bottom:32px;">
      <tr><td style="background:#0a0a0a;padding:28px 32px;border-radius:8px;">
        <div style="font-family:${IS};font-size:44px;font-weight:400;color:${BRAND_COLOR};line-height:1;letter-spacing:-.02em;">${data.investment || ""}</div>
      </td></tr>
    </table>

    ${ctaHtml}
  `;

  return emailShell(data.subject, bodyHtml, data.heroImage);
}

/* ── Payment email ── */
interface PaymentItem {
  service: string;
  amount: string;
}

interface PaymentEmailData {
  clientName: string;
  invoiceNum: string;
  dueDate: string;
  items: PaymentItem[];
  total: string;
  payLink: string;
  notes: string;
  subject: string;
  heroImage: string;
}

function buildPaymentHtml(data: PaymentEmailData): string {
  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const fmtDue = data.dueDate
    ? new Date(data.dueDate + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "";

  const itemRows = (data.items || []).filter(it => it.service || it.amount).map(it =>
    `<tr>
      <td style="padding:12px 0;border-bottom:1px solid #f0ede8;font-family:${IS};font-size:15px;color:#3a3a3a;line-height:1.5;">${it.service}</td>
      <td style="padding:12px 0;border-bottom:1px solid #f0ede8;font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;font-size:14px;color:#0a0a0a;text-align:right;white-space:nowrap;font-weight:600;">${it.amount}</td>
    </tr>`
  ).join("");

  const payBtnHtml = data.payLink ? ctaButton("Pay Now", data.payLink, "#0a0a0a") : "";

  const bodyHtml = `
    <!-- eyebrow -->
    <p style="margin:0 0 8px;font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:${BRAND_COLOR};">Payment Request</p>

    <!-- Invoice # -->
    <h2 style="margin:0 0 12px;font-family:${IS};font-size:28px;font-weight:400;color:#1a1a1a;line-height:1.2;letter-spacing:-.01em;">${data.invoiceNum || "Invoice"}</h2>

    <!-- Dates -->
    <p style="margin:0 0 8px;font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;font-size:12px;color:#888;">
      Issued: <strong style="color:#555;">${today}</strong>
      ${fmtDue ? `&nbsp;&middot;&nbsp; Due: <strong style="color:#555;">${fmtDue}</strong>` : ""}
    </p>

    <!-- Client -->
    ${data.clientName ? `<p style="margin:0 0 24px;font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;font-size:13px;color:#666;">Billed to: <strong style="color:#0a0a0a;">${data.clientName}</strong></p>` : "<div style='margin-bottom:24px;'></div>"}

    <!-- divider -->
    <div style="height:1px;background:#f0ede8;margin:0 0 20px;"></div>

    <!-- Line items -->
    ${itemRows ? `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-bottom:0;">
      <thead>
        <tr>
          <th style="padding:0 0 10px;font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#aaa;text-align:left;border-bottom:2px solid #f0ede8;">Service</th>
          <th style="padding:0 0 10px;font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#aaa;text-align:right;border-bottom:2px solid #f0ede8;">Amount</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
    </table>` : ""}

    <!-- Total row -->
    ${data.total ? `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-top:4px;margin-bottom:28px;">
      <tr><td style="background:#0a0a0a;padding:18px 24px;border-radius:0 0 8px 8px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"><tr>
          <td style="font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.6);">Total Due</td>
          <td style="font-family:${IS};font-size:26px;font-weight:400;color:#ffffff;text-align:right;letter-spacing:-.01em;">${data.total}</td>
        </tr></table>
      </td></tr>
    </table>` : ""}

    ${payBtnHtml}

    <!-- Notes -->
    ${data.notes ? `
    <div style="margin-top:24px;padding:16px 20px;background:#faf8ff;border-left:3px solid ${BRAND_COLOR};border-radius:0 4px 4px 0;">
      <p style="margin:0 0 6px;font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${BRAND_COLOR};">Notes</p>
      <p style="margin:0;font-family:${IS};font-size:15px;line-height:1.75;color:#4a4a4a;">${data.notes}</p>
    </div>` : ""}
  `;

  return emailShell(data.subject, bodyHtml, data.heroImage);
}

export async function POST(req: Request) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { template, to, subject, rawContent, btnColor, heroImage, proposalData, paymentData } = await req.json();

  if (!to)      return NextResponse.json({ error: "No recipient" },  { status: 400 });
  if (!subject) return NextResponse.json({ error: "No subject" },    { status: 400 });

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "RESEND_API_KEY not configured" }, { status: 500 });
  }

  let html: string;
  if (template === "proposal") {
    html = buildProposalHtml({ ...proposalData, subject, heroImage: heroImage ?? "", btnColor: btnColor ?? "#0a0a0a" });
  } else if (template === "payment") {
    html = buildPaymentHtml({ ...paymentData, subject, heroImage: heroImage ?? "" });
  } else {
    if (!rawContent) return NextResponse.json({ error: "No content" }, { status: 400 });
    html = buildEmailCampaignHtml(subject, rawContent, btnColor ?? "#0a0a0a", heroImage ?? "", template === "custom");
  }

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
