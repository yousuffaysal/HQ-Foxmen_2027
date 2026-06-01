import { NextResponse } from "next/server";

export const runtime = "nodejs";

/* ── Brand constants (mirrors email-campaign/route.ts) ── */
const LOGO        = "https://res.cloudinary.com/djofqa3vc/image/upload/v1778967518/logo_sn_fox_copy_e9sigm.png";
const BRAND       = "#B86CF9";
const BRAND_DARK  = "#8B5DFF";
const IS          = `'Instrument Serif',Georgia,'Times New Roman',serif`;
const ARROW_IMG   = `https://res.cloudinary.com/djofqa3vc/image/upload/v1778990209/arrow-northeast.svg`;
const YEAR        = new Date().getFullYear();

/* ── Shared email shell ── */
function emailShell(subject: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="color-scheme" content="light"/>
<title>${subject}</title>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet"/>
<style>
.em-arr{display:block;}
@media only screen and (max-width:600px){
  .em-outer{padding:0!important;background:#0a0a0a!important;}
  .em-card{border-radius:0!important;}
  .em-hd{padding:24px 20px 18px!important;}
  .em-hd-meta{display:none!important;font-size:0!important;max-height:0!important;overflow:hidden!important;}
  .em-body{padding:28px 20px 24px!important;}
  .em-p{font-size:15px!important;}
  .em-cta-tbl{width:100%!important;}
  .em-cta-lbl{padding:13px 8px 13px 22px!important;font-size:14px!important;}
  .em-cta-chip{width:38px!important;height:38px!important;}
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
      <td style="vertical-align:middle;width:56px;padding-right:16px;">
        <img src="${LOGO}" height="46" width="46" alt="Foxmen Studio" style="display:block;border-radius:5px;"/>
      </td>
      <td style="vertical-align:middle;">
        <div style="font-family:${IS};font-size:26px;font-weight:400;color:#ffffff;letter-spacing:-.02em;line-height:1.1;">Foxmen <em style="font-style:italic;color:${BRAND};">Studio</em></div>
        <div style="font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:${BRAND};margin-top:5px;">Code &middot; Craft &middot; Care</div>
      </td>
      <td class="em-hd-meta" style="text-align:right;vertical-align:middle;">
        <a href="https://foxmen.studio" style="display:block;font-size:11px;color:${BRAND};text-decoration:none;letter-spacing:.01em;margin-bottom:5px;">https://foxmen.studio</a>
        <div style="font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-bottom:5px;">US &middot; UK &middot; International</div>
        <div style="font-size:10px;color:rgba(255,255,255,.38);">contact@foxmen.studio</div>
      </td>
    </tr></table>
    <div style="height:1px;background:rgba(255,255,255,.15);margin:20px 0 16px;"></div>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
      <tr>
        <td style="font-size:11px;color:rgba(255,255,255,.5);line-height:1.6;">Web apps &nbsp;&middot;&nbsp; AI-integrated products &nbsp;&middot;&nbsp; Mobile &amp; software</td>
        <td style="text-align:right;white-space:nowrap;font-size:11px;"><strong style="color:rgba(255,255,255,.75);font-weight:500;">contact@foxmen.studio</strong></td>
      </tr>
    </table>
  </td></tr>

  <!-- ACCENT LINE -->
  <tr><td style="height:3px;background:linear-gradient(90deg,${BRAND},${BRAND_DARK});font-size:0;line-height:0;">&nbsp;</td></tr>

  <!-- BODY -->
  <tr><td class="em-body" style="padding:52px 60px 44px;">
    ${bodyHtml}

    <!-- SIGNATURE -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin-top:44px;padding-top:24px;border-top:1px solid #f0ede8;">
      <tr>
        <td>
          <p style="margin:0 0 3px;font-size:12px;color:#b8b5b0;">Warm regards,</p>
          <p style="margin:0 0 4px;font-family:${IS};font-size:22px;color:#0a0a0a;font-style:italic;">The Foxmen Team</p>
          <p style="margin:0;font-size:11px;color:#c8c5c0;">foxmen.studio &nbsp;&middot;&nbsp; contact@foxmen.studio</p>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- FOOTER -->
  <tr><td style="background:#0a0a0a;">
    <div style="height:2px;background:linear-gradient(90deg,${BRAND},${BRAND_DARK});"></div>
    <div style="padding:22px 60px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"><tr>
        <td>
          <div style="font-family:${IS};font-size:15px;color:rgba(255,255,255,.7);font-style:italic;">Foxmen Studio</div>
          <p style="margin:4px 0 0;font-size:10px;color:rgba(255,255,255,.45);line-height:1.8;">
            <a href="https://foxmen.studio" style="color:rgba(255,255,255,.65);text-decoration:none;">foxmen.studio</a>
            &nbsp;&middot;&nbsp;contact@foxmen.studio<br/>
            &copy; ${YEAR} Foxmen Studio. All rights reserved.
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

/* ── CTA button ── */
function ctaBtn(label: string, url: string): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin:32px 0 8px;"><tr><td align="center">
<a href="${url}" style="text-decoration:none;display:inline-block;">
<table class="em-cta-tbl" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background:#0a0a0a;border-radius:999px;overflow:hidden;">
<tr>
  <td class="em-cta-lbl" style="font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;font-size:15px;font-weight:500;color:#ffffff;padding:11px 8px 11px 26px;white-space:nowrap;vertical-align:middle;">${label}</td>
  <td style="padding:8px 8px 8px 4px;vertical-align:middle;">
    <table cellpadding="0" cellspacing="0" border="0" role="presentation"><tr>
      <td class="em-cta-chip" style="width:42px;height:42px;background:#ffffff;border-radius:50%;text-align:center;vertical-align:middle;">
        <img class="em-arr" src="${ARROW_IMG}" width="18" height="18" alt="" border="0" style="display:block;margin:0 auto;"/>
      </td>
    </tr></table>
  </td>
</tr>
</table></a>
</td></tr></table>`;
}

/* ── Metric row for speed report ── */
function metricRow(label: string, value: string, status: "good" | "warn" | "poor"): string {
  const color = status === "good" ? "#22c55e" : status === "warn" ? "#f59e0b" : "#ef4444";
  const dot   = `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${color};margin-right:8px;vertical-align:middle;"></span>`;
  return `<tr>
    <td style="padding:12px 0;border-bottom:1px solid #f0ede8;font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#888;">${dot}${label}</td>
    <td style="padding:12px 0;border-bottom:1px solid #f0ede8;text-align:right;font-family:${IS};font-size:22px;color:#0a0a0a;letter-spacing:-.02em;">${value ?? "—"}</td>
  </tr>`;
}

/* ── Stat box (dark) ── */
function statBox(value: string, label: string): string {
  return `<td align="center" style="padding:0 8px;width:25%;">
    <div style="background:#0a0a0a;border-radius:10px;padding:18px 8px;text-align:center;">
      <div style="font-family:${IS};font-size:26px;color:${BRAND};letter-spacing:-.02em;line-height:1;">${value}</div>
      <div style="font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.45);margin-top:6px;">${label}</div>
    </div>
  </td>`;
}

/* ── Section divider ── */
function sectionTitle(title: string): string {
  return `<div style="margin:36px 0 14px;">
    <div style="height:1px;background:#f0ede8;margin-bottom:18px;"></div>
    <div style="font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:${BRAND};font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;">${title}</div>
  </div>`;
}

/* ── Stack layer card ── */
function stackCard(layer: string, value: string, why: string): string {
  return `<tr><td style="padding:14px 0;border-bottom:1px solid #f0ede8;">
    <div style="font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:#aaa;font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;margin-bottom:4px;">${layer}</div>
    <div style="font-family:${IS};font-size:20px;color:#0a0a0a;margin-bottom:4px;">${value}</div>
    ${why ? `<div style="font-size:13px;color:#888;line-height:1.55;">${why}</div>` : ""}
  </td></tr>`;
}

/* ════════════════════════════════════════════
   TOOL-SPECIFIC EMAIL BUILDERS
════════════════════════════════════════════ */

function buildSpeedEmail(data: Record<string, unknown>): { subject: string; html: string } {
  const score = Number(data.score ?? 0);
  const url   = String(data.url ?? "your website");
  const scoreColor = score >= 90 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";
  const scoreLabel = score >= 90 ? "Fast" : score >= 50 ? "Needs work" : "Needs improvement";

  const s = (v: number) => v >= 0.9 ? "good" : v >= 0.5 ? "warn" : "poor";

  const body = `
    <p style="margin:0 0 6px;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:${BRAND};font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;">Your speed report</p>
    <h1 style="margin:0 0 8px;font-family:${IS};font-size:36px;font-weight:400;color:#0a0a0a;letter-spacing:-.02em;line-height:1.1;">Website Speed Report</h1>
    <p style="margin:0 0 32px;font-family:${IS};font-size:17px;color:#888;line-height:1.6;">Core Web Vitals analysis for <strong style="color:#0a0a0a;">${url}</strong></p>

    <!-- Score display -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background:#0a0a0a;border-radius:14px;overflow:hidden;margin:0 0 32px;">
      <tr>
        <td style="padding:32px 36px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"><tr>
            <td style="vertical-align:middle;">
              <div style="font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:8px;">Performance Score</div>
              <div style="font-family:${IS};font-size:72px;color:${scoreColor};letter-spacing:-.04em;line-height:1;">${score}</div>
              <div style="font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-top:8px;">${scoreLabel} · Mobile</div>
            </td>
            <td style="text-align:right;vertical-align:middle;">
              <div style="width:80px;height:80px;border-radius:50%;background:rgba(255,255,255,.06);border:3px solid ${scoreColor};display:inline-flex;align-items:center;justify-content:center;font-family:${IS};font-size:28px;color:${scoreColor};">${score}</div>
            </td>
          </tr></table>
        </td>
      </tr>
    </table>

    ${sectionTitle("Core Web Vitals")}
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
      ${metricRow("Largest Contentful Paint (LCP)", String(data.lcp ?? "—"), s(Number(data.lcpScore ?? 0)))}
      ${metricRow("First Contentful Paint (FCP)", String(data.fcp ?? "—"), s(Number(data.fcpScore ?? 0)))}
      ${metricRow("Cumulative Layout Shift (CLS)", String(data.cls ?? "—"), s(Number(data.clsScore ?? 0)))}
      ${metricRow("Total Blocking Time (TBT)", String(data.tbt ?? "—"), s(Number(data.tbtScore ?? 0)))}
      ${data.speedIndex ? metricRow("Speed Index", String(data.speedIndex), s(score >= 90 ? 1 : score >= 50 ? 0.6 : 0.2)) : ""}
    </table>

    ${sectionTitle("What this means")}
    <p style="margin:0 0 16px;font-family:${IS};font-size:16px;line-height:1.85;color:#3a3a3a;">
      ${score >= 90
        ? "Your site loads quickly and delivers an excellent user experience. Google rewards fast sites with better search rankings — keep it up and continue monitoring as you add new features."
        : score >= 50
        ? "Your site is in the average range. There are clear opportunities to improve load speed, which will directly impact user retention and SEO rankings. The metrics above highlight exactly where to focus."
        : "Your site has significant performance issues that are likely hurting both user experience and search rankings. Addressing the metrics above — especially LCP and TBT — should be the top priority."
      }
    </p>

    ${sectionTitle("Want us to fix this?")}
    <p style="margin:0 0 24px;font-family:${IS};font-size:16px;line-height:1.85;color:#3a3a3a;">
      At Foxmen Studio we specialise in building fast, optimised digital products. If you'd like a detailed technical audit and implementation plan, we're happy to help.
    </p>
    ${ctaBtn("Get a free consultation", "https://foxmen.studio/contact")}
  `;

  return {
    subject: `Your Website Speed Report — Score: ${score}/100`,
    html: emailShell(`Your Website Speed Report — Score: ${score}/100`, body),
  };
}

function buildRoastEmail(data: Record<string, unknown>): { subject: string; html: string } {
  const url   = String(data.url ?? "your website");
  const roast = String(data.roast ?? "");

  const SECTIONS = [
    { key: "FIRST IMPRESSIONS", label: "First Impressions" },
    { key: "DESIGN & UX",       label: "Design & UX" },
    { key: "CONVERSION ISSUES", label: "Conversion" },
    { key: "SEO SIGNALS",       label: "SEO Signals" },
    { key: "TOP 3 FIXES",       label: "Top 3 Actions" },
  ];

  function extractSection(raw: string, key: string, nextKey?: string): string {
    const re = new RegExp(`${key.replace(/[&]/g, "\\&")}[:\\s\\n]+`, "i");
    const start = raw.search(re);
    if (start === -1) return "";
    const bodyStart = start + raw.slice(start).search(/[:\s\n]+/) + 1;
    const end = nextKey ? raw.toUpperCase().indexOf(nextKey, bodyStart) : raw.length;
    return raw.slice(bodyStart, end === -1 ? raw.length : end).trim()
      .replace(/^#{1,6}\s*/gm, "").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\*(.*?)\*/g, "<em>$1</em>");
  }

  const sectionsHtml = SECTIONS.map(({ key, label }, i) => {
    const content = extractSection(roast, key, SECTIONS[i + 1]?.key);
    if (!content) return "";
    return `
      ${sectionTitle(label)}
      <p style="margin:0 0 8px;font-family:${IS};font-size:16px;line-height:1.85;color:#3a3a3a;">${content}</p>
    `;
  }).join("");

  const body = `
    <p style="margin:0 0 6px;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:${BRAND};font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;">Your website audit</p>
    <h1 style="margin:0 0 8px;font-family:${IS};font-size:36px;font-weight:400;color:#0a0a0a;letter-spacing:-.02em;line-height:1.1;">Website Audit Report</h1>
    <p style="margin:0 0 32px;font-family:${IS};font-size:17px;color:#888;line-height:1.6;">Professional analysis of <strong style="color:#0a0a0a;">${url}</strong></p>

    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background:#0a0a0a;border-radius:14px;margin:0 0 32px;">
      <tr><td style="padding:28px 36px;">
        <div style="font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:10px;">What we reviewed</div>
        <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"><tr>
          ${statBox("Design", "UX")}
          ${statBox("SEO", "Signals")}
          ${statBox("Conv.", "Rate")}
          ${statBox("5", "Sections")}
        </tr></table>
      </td></tr>
    </table>

    ${sectionsHtml || `<p style="font-family:${IS};font-size:16px;color:#3a3a3a;line-height:1.85;">${roast}</p>`}

    ${sectionTitle("Next steps")}
    <p style="margin:0 0 24px;font-family:${IS};font-size:16px;line-height:1.85;color:#3a3a3a;">
      If you'd like our team to implement any of the recommendations above, or want a full design and development proposal, we'd love to hear about your project.
    </p>
    ${ctaBtn("Start a project with Foxmen Studio", "https://foxmen.studio/contact")}
  `;

  return {
    subject: `Your Website Audit Report — ${url}`,
    html: emailShell(`Your Website Audit Report`, body),
  };
}

function buildPriceEmail(data: Record<string, unknown>): { subject: string; html: string } {
  const projectType = String(data.projectType ?? "Your project");
  const features    = Array.isArray(data.features) ? data.features as string[] : [];
  const timeline    = String(data.timeline ?? "");
  const location    = String(data.location ?? "");
  const prices      = data.prices as { boutique?: [number, number]; agency?: [number, number] } | undefined;

  function fmt(n: number) { return `$${n.toLocaleString("en-US")}`; }

  const boutiqueLow  = prices?.boutique?.[0] ?? 0;
  const boutiqueHigh = prices?.boutique?.[1] ?? 0;
  const agencyLow    = prices?.agency?.[0] ?? 0;
  const savings      = agencyLow - boutiqueHigh;

  const body = `
    <p style="margin:0 0 6px;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:${BRAND};font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;">Your cost estimate</p>
    <h1 style="margin:0 0 8px;font-family:${IS};font-size:36px;font-weight:400;color:#0a0a0a;letter-spacing:-.02em;line-height:1.1;">${projectType} Cost Estimate</h1>
    <p style="margin:0 0 32px;font-family:${IS};font-size:17px;color:#888;line-height:1.6;">Personalised budget breakdown based on your inputs</p>

    <!-- Foxmen Studio price -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background:#0a0a0a;border-radius:14px;overflow:hidden;margin:0 0 12px;position:relative;">
      <tr><td style="padding:32px 36px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"><tr>
          <td style="vertical-align:middle;">
            <div style="display:inline-block;font-size:9px;letter-spacing:.16em;text-transform:uppercase;background:${BRAND};color:#fff;padding:4px 10px;border-radius:999px;margin-bottom:12px;">Best Value</div>
            <div style="font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.45);margin-bottom:8px;">Foxmen Studio</div>
            <div style="font-family:${IS};font-size:42px;color:${BRAND};letter-spacing:-.03em;line-height:1;">${fmt(boutiqueLow)} – ${fmt(boutiqueHigh)}</div>
            <div style="font-size:12px;color:rgba(255,255,255,.45);margin-top:8px;">Boutique studio · Senior team · $65–95/hr</div>
          </td>
          <td style="text-align:right;vertical-align:top;">
            <img src="${LOGO}" height="40" width="40" alt="Foxmen Studio" style="display:block;margin-left:auto;border-radius:6px;"/>
          </td>
        </tr></table>
      </td></tr>
    </table>

    <!-- UK/US Agency price -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background:#f9f8f5;border:1px solid #f0ede8;border-radius:14px;margin:0 0 24px;">
      <tr><td style="padding:24px 36px;">
        <div style="font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:#aaa;margin-bottom:6px;">UK / US Agency</div>
        <div style="font-family:${IS};font-size:30px;color:#0a0a0a;letter-spacing:-.03em;">${fmt(prices?.agency?.[0] ?? 0)} – ${fmt(prices?.agency?.[1] ?? 0)}</div>
        <div style="font-size:12px;color:#aaa;margin-top:6px;">Traditional agency · $150–300/hr</div>
      </td></tr>
    </table>

    ${savings > 0 ? `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background:#f3edff;border:1px solid rgba(184,108,249,.3);border-radius:10px;margin:0 0 28px;">
      <tr><td style="padding:16px 24px;">
        <p style="margin:0;font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;font-size:15px;color:#5b21b6;font-weight:500;">
          Potential saving with Foxmen Studio: <strong>${fmt(savings)}+</strong>
        </p>
      </td></tr>
    </table>` : ""}

    ${sectionTitle("Your inputs")}
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
      <tr><td style="padding:10px 0;border-bottom:1px solid #f0ede8;font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;font-size:13px;color:#888;letter-spacing:.1em;text-transform:uppercase;">Project type</td>
          <td style="padding:10px 0;border-bottom:1px solid #f0ede8;text-align:right;font-family:${IS};font-size:16px;color:#0a0a0a;">${projectType}</td></tr>
      ${features.length > 0 ? `<tr><td style="padding:10px 0;border-bottom:1px solid #f0ede8;font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;font-size:13px;color:#888;letter-spacing:.1em;text-transform:uppercase;">Features</td>
          <td style="padding:10px 0;border-bottom:1px solid #f0ede8;text-align:right;font-family:${IS};font-size:15px;color:#0a0a0a;">${features.join(", ")}</td></tr>` : ""}
      ${timeline ? `<tr><td style="padding:10px 0;border-bottom:1px solid #f0ede8;font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;font-size:13px;color:#888;letter-spacing:.1em;text-transform:uppercase;">Timeline</td>
          <td style="padding:10px 0;border-bottom:1px solid #f0ede8;text-align:right;font-family:${IS};font-size:16px;color:#0a0a0a;">${timeline}</td></tr>` : ""}
      ${location ? `<tr><td style="padding:10px 0;font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;font-size:13px;color:#888;letter-spacing:.1em;text-transform:uppercase;">Team preference</td>
          <td style="padding:10px 0;text-align:right;font-family:${IS};font-size:16px;color:#0a0a0a;">${location}</td></tr>` : ""}
    </table>

    ${sectionTitle("Get an exact quote")}
    <p style="margin:0 0 24px;font-family:${IS};font-size:16px;line-height:1.85;color:#3a3a3a;">
      This estimate is based on typical project scope. For a precise, line-by-line quote tailored to your specific requirements, our team at Foxmen Studio would love to have a short call.
    </p>
    ${ctaBtn("Get an exact quote from Foxmen Studio", "https://foxmen.studio/contact")}
  `;

  return {
    subject: `Your ${projectType} Cost Estimate — Foxmen Studio`,
    html: emailShell(`Your ${projectType} Cost Estimate`, body),
  };
}

function buildTechStackEmail(data: Record<string, unknown>): { subject: string; html: string } {
  const projectType  = String(data.projectType ?? "Your project");
  const requirements = Array.isArray(data.requirements) ? data.requirements as string[] : [];
  const teamSize     = String(data.teamSize ?? "");
  const stack        = data.stack as Record<string, string> | undefined;
  const rationale    = (data.stack as Record<string, Record<string, string>>)?.rationale ?? {};

  const LAYERS: { key: string; label: string }[] = [
    { key: "frontend",       label: "Frontend" },
    { key: "backend",        label: "Backend" },
    { key: "database",       label: "Database" },
    { key: "infrastructure", label: "Infrastructure" },
    { key: "ai_layer",       label: "AI / ML Layer" },
  ];

  const stackRows = LAYERS
    .filter(l => stack?.[l.key])
    .map(l => stackCard(l.label, String(stack![l.key]), String(rationale[l.key] ?? "")))
    .join("");

  const body = `
    <p style="margin:0 0 6px;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:${BRAND};font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;">Your tech stack</p>
    <h1 style="margin:0 0 8px;font-family:${IS};font-size:36px;font-weight:400;color:#0a0a0a;letter-spacing:-.02em;line-height:1.1;">Recommended Tech Stack</h1>
    <p style="margin:0 0 32px;font-family:${IS};font-size:17px;color:#888;line-height:1.6;">AI-selected architecture for your <strong style="color:#0a0a0a;">${projectType}</strong></p>

    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background:#0a0a0a;border-radius:14px;margin:0 0 32px;">
      <tr><td style="padding:28px 36px;">
        <div style="font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:10px;">Project profile</div>
        <div style="font-family:${IS};font-size:22px;color:#fff;margin-bottom:8px;">${projectType}</div>
        ${requirements.length > 0 ? `<div style="font-size:12px;color:rgba(255,255,255,.4);">${requirements.join(" · ")}</div>` : ""}
        ${teamSize ? `<div style="font-size:12px;color:rgba(255,255,255,.4);margin-top:4px;">Team: ${teamSize}</div>` : ""}
      </td></tr>
    </table>

    ${sectionTitle("Your recommended stack")}
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
      ${stackRows}
    </table>

    ${sectionTitle("Why this stack?")}
    <p style="margin:0 0 24px;font-family:${IS};font-size:16px;line-height:1.85;color:#3a3a3a;">
      This combination is optimised for your team size, requirements, and scalability needs. Each layer was chosen for its maturity, community support, and compatibility with the others. If you'd like us to build this for you, our senior team at Foxmen Studio can take it from architecture to deployment.
    </p>
    ${ctaBtn("Build this with Foxmen Studio", "https://foxmen.studio/contact")}
  `;

  return {
    subject: `Your Tech Stack Recommendation — ${projectType}`,
    html: emailShell(`Your Tech Stack Recommendation`, body),
  };
}

function buildRateEmail(data: Record<string, unknown>): { subject: string; html: string } {
  const service = String(data.service ?? "Web");
  const hours   = Number(data.hours ?? 100);

  const RATES: Record<string, { name: string; flag: string; min: number; max: number; currency: string; note: string }[]> = {
    Web:    [{ name:"London Agency",flag:"🇬🇧",min:150,max:250,currency:"£",note:"Senior dev + PM overhead"},{name:"NYC Agency",flag:"🇺🇸",min:175,max:300,currency:"$",note:"Top-tier talent"},{name:"UAE Agency",flag:"🇦🇪",min:80,max:150,currency:"$",note:"Mid-market rates"},{name:"Foxmen Studio",flag:"★",min:65,max:95,currency:"$",note:"Senior team, boutique rates"}],
    Mobile: [{ name:"London Agency",flag:"🇬🇧",min:160,max:270,currency:"£",note:"iOS + Android"},{name:"NYC Agency",flag:"🇺🇸",min:185,max:320,currency:"$",note:"Native-first"},{name:"UAE Agency",flag:"🇦🇪",min:90,max:160,currency:"$",note:"React Native"},{name:"Foxmen Studio",flag:"★",min:70,max:100,currency:"$",note:"RN + native Swift/Kotlin"}],
    AI:     [{ name:"London Agency",flag:"🇬🇧",min:200,max:350,currency:"£",note:"ML engineers"},{name:"NYC Agency",flag:"🇺🇸",min:225,max:400,currency:"$",note:"AI/ML specialists"},{name:"UAE Agency",flag:"🇦🇪",min:100,max:180,currency:"$",note:"Growing talent pool"},{name:"Foxmen Studio",flag:"★",min:80,max:120,currency:"$",note:"RAG, agents, fine-tuning"}],
    Design: [{ name:"London Agency",flag:"🇬🇧",min:130,max:220,currency:"£",note:"Senior UX + brand"},{name:"NYC Agency",flag:"🇺🇸",min:150,max:275,currency:"$",note:"Top branding studios"},{name:"UAE Agency",flag:"🇦🇪",min:70,max:130,currency:"$",note:"Bilingual design"},{name:"Foxmen Studio",flag:"★",min:60,max:90,currency:"$",note:"UI/UX + design systems"}],
  };

  const agencies = RATES[service] ?? RATES.Web;
  const foxmen   = agencies[agencies.length - 1];
  const london   = agencies[0];

  const saving = (london.min - foxmen.min) * hours;

  const tableRows = agencies.map(a => {
    const isFox = a.name === "Foxmen Studio";
    const cost  = `${a.currency}${(a.min * hours).toLocaleString()} – ${a.currency}${(a.max * hours).toLocaleString()}`;
    return `<tr style="${isFox ? `background:#f3edff;` : ""}">
      <td style="padding:14px 20px;border-bottom:1px solid #f0ede8;font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;font-size:14px;font-weight:${isFox ? "600" : "400"};color:${isFox ? "#5b21b6" : "#0a0a0a"};">
        ${isFox ? "★ " : a.flag + " "}${a.name}
        <div style="font-size:11px;color:#aaa;font-weight:400;margin-top:2px;">${a.note}</div>
      </td>
      <td style="padding:14px 20px;border-bottom:1px solid #f0ede8;text-align:right;font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;font-size:12px;color:#aaa;">${a.currency}${a.min}–${a.currency}${a.max}/hr</td>
      <td style="padding:14px 20px;border-bottom:1px solid #f0ede8;text-align:right;font-family:'Instrument Serif',serif;font-size:18px;color:${isFox ? "#5b21b6" : "#0a0a0a"};">${cost}</td>
    </tr>`;
  }).join("");

  const body = `
    <p style="margin:0 0 6px;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:${BRAND};font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;">Agency rate report</p>
    <h1 style="margin:0 0 8px;font-family:${IS};font-size:36px;font-weight:400;color:#0a0a0a;letter-spacing:-.02em;line-height:1.1;">Agency Rate Comparison</h1>
    <p style="margin:0 0 32px;font-family:${IS};font-size:17px;color:#888;line-height:1.6;">${service} development · Based on <strong style="color:#0a0a0a;">${hours} hours</strong></p>

    <!-- Rate table -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="border:1px solid #f0ede8;border-radius:14px;overflow:hidden;margin-bottom:24px;">
      <tr style="background:#0a0a0a;">
        <td style="padding:12px 20px;font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.45);">Agency</td>
        <td style="padding:12px 20px;text-align:right;font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.45);">Rate/hr</td>
        <td style="padding:12px 20px;text-align:right;font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.45);">${hours}hrs total</td>
      </tr>
      ${tableRows}
    </table>

    ${saving > 0 ? `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background:#0a0a0a;border-radius:12px;margin:0 0 28px;">
      <tr><td style="padding:22px 28px;">
        <div style="font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:6px;">Potential saving at ${hours} hours</div>
        <div style="font-family:${IS};font-size:36px;color:${BRAND};letter-spacing:-.03em;">$${saving.toLocaleString()}+</div>
        <div style="font-size:12px;color:rgba(255,255,255,.4);margin-top:4px;">Choosing Foxmen Studio vs a London agency</div>
      </td></tr>
    </table>` : ""}

    ${sectionTitle("Why the difference?")}
    <p style="margin:0 0 24px;font-family:${IS};font-size:16px;line-height:1.85;color:#3a3a3a;">
      Traditional agencies carry significant overhead — large offices, account managers, and project coordinators. Foxmen Studio operates as a lean, senior-only boutique, so your budget goes directly into the work. Same quality. Clearer communication. Better value.
    </p>
    ${ctaBtn("Get a quote from Foxmen Studio", "https://foxmen.studio/contact")}
  `;

  return {
    subject: `Agency Rate Comparison — ${service} Development · ${hours}hrs`,
    html: emailShell(`Agency Rate Comparison`, body),
  };
}

/* ════════════════════════════════════════════
   ROUTE HANDLER
════════════════════════════════════════════ */

export async function POST(req: Request) {
  try {
    let body: { email?: string; tool?: string; summary?: unknown };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
    }

    const { email, tool, summary } = body;
    if (!email) return NextResponse.json({ ok: false, error: "Email required" }, { status: 400 });
    if (!process.env.RESEND_API_KEY) return NextResponse.json({ ok: true });

    const data = (summary && typeof summary === "object") ? summary as Record<string, unknown> : {};

    /* ── Build tool-specific email ── */
    let report: { subject: string; html: string };
    const toolLower = (tool ?? "").toLowerCase();

    if (toolLower.includes("speed"))      report = buildSpeedEmail(data);
    else if (toolLower.includes("roast")) report = buildRoastEmail(data);
    else if (toolLower.includes("price") || toolLower.includes("calculator")) report = buildPriceEmail(data);
    else if (toolLower.includes("tech") || toolLower.includes("stack"))       report = buildTechStackEmail(data);
    else if (toolLower.includes("rate") || toolLower.includes("agency"))      report = buildRateEmail(data);
    else {
      report = {
        subject: `Your report from Foxmen Studio`,
        html: emailShell("Your report from Foxmen Studio", `
          <h1 style="font-family:${IS};font-size:32px;color:#0a0a0a;margin:0 0 16px;">Thanks for using our tools</h1>
          <p style="font-family:${IS};font-size:16px;color:#3a3a3a;line-height:1.85;">Here's a summary of what you requested from Foxmen Studio.</p>
          ${ctaBtn("Visit Foxmen Studio", "https://foxmen.studio")}
        `),
      };
    }

    /* ── Send to user ── */
    const fromAddress = "team@foxmen.studio";
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: `Foxmen Studio <${fromAddress}>`,
        to: email,
        subject: report.subject,
        html: report.html,
      }),
    });

    /* ── Notify admin ── */
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: `Foxmen Studio Tools <${fromAddress}>`,
        to: fromAddress,
        subject: `New lead: ${tool ?? "Tool"} — ${email}`,
        html: `<p><strong>Tool:</strong> ${tool}</p><p><strong>Email:</strong> ${email}</p><pre style="background:#f5f5f5;padding:16px;border-radius:8px;font-size:12px;">${JSON.stringify(summary, null, 2)}</pre>`,
      }),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[lead]", err);
    return NextResponse.json({ ok: true }); // never block the user on email failure
  }
}
