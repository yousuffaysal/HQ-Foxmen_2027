import { NextResponse } from "next/server";

interface Item { service: string; description: string; quantity: number; unit: string; rate: number }

function fmtDate(d: string) {
  if (!d) return "—";
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}
function fmtMoney(n: number) {
  return "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const PAYMENT_LABELS: Record<string, string> = {
  wise:   "Wise — contact@foxmenstudio.com",
  paypal: "PayPal — payments@foxmenstudio.com",
  bank:   "Bank Transfer — IBAN on request",
  crypto: "USDT / USDC — Wallet on request",
};

const STATUS_STYLE: Record<string, { color: string; bg: string; label: string }> = {
  draft:   { color: "#6b7280", bg: "#f9fafb", label: "Draft" },
  sent:    { color: "#1d4ed8", bg: "#eff6ff", label: "Sent" },
  paid:    { color: "#15803d", bg: "#f0fdf4", label: "Paid" },
  overdue: { color: "#b91c1c", bg: "#fef2f2", label: "Overdue" },
};

function buildEmailHtml(data: {
  status: string; client: string; company: string; email: string; phone: string;
  num: string; date: string; due: string;
  projectName: string; projectType: string; timeline: string;
  items: Item[]; taxRate: number; discount: number;
  notes: string; payment: string; total: number;
}) {
  const { status, client, company, phone, num, date, due, projectName, projectType, timeline, items, taxRate, discount, notes, payment } = data;

  // Recalculate server-side — do not trust client total
  const subtotal = items.reduce((s, it) => s + (it.quantity * it.rate), 0);
  const taxAmt   = subtotal * (taxRate / 100);
  const total    = subtotal + taxAmt - discount;

  const payLabel  = PAYMENT_LABELS[payment] ?? payment;
  const [payName, payDetail] = payLabel.split("—").map(s => s.trim());
  const st = STATUS_STYLE[status] ?? STATUS_STYLE.sent;
  const logoUrl = "https://foxmen.studio/assets/logo-mark.svg";

  const rows = items.filter(it => it.service || it.rate).map(it => `
    <tr>
      <td style="padding:12px 16px;border-bottom:1px solid #f0ede8;vertical-align:top;">
        <div style="font-size:13px;font-weight:700;color:#0a0a0a;">${it.service || "—"}</div>
        ${it.description ? `<div style="font-size:11px;color:#6b6b6b;margin-top:3px;line-height:1.55;">${it.description}</div>` : ""}
      </td>
      <td style="padding:12px 16px;border-bottom:1px solid #f0ede8;font-size:12px;color:#0a0a0a;text-align:right;vertical-align:top;white-space:nowrap;">${it.quantity} ${it.unit}</td>
      <td style="padding:12px 16px;border-bottom:1px solid #f0ede8;font-size:12px;color:#6b6b6b;text-align:right;vertical-align:top;white-space:nowrap;">${fmtMoney(it.rate)}/${it.unit}</td>
      <td style="padding:12px 16px;border-bottom:1px solid #f0ede8;font-size:13px;font-weight:700;color:#0a0a0a;text-align:right;vertical-align:top;white-space:nowrap;">${fmtMoney(it.quantity * it.rate)}</td>
    </tr>`).join("");

  const taxRow    = taxRate > 0 ? `<tr><td style="padding:4px 0;font-size:12px;color:#6b6b6b;">VAT ${taxRate}%</td><td style="padding:4px 0;font-size:12px;color:#6b6b6b;text-align:right;">${fmtMoney(taxAmt)}</td></tr>` : "";
  const discRow   = discount > 0 ? `<tr><td style="padding:4px 0;font-size:12px;color:#16a34a;">Discount</td><td style="padding:4px 0;font-size:12px;color:#16a34a;text-align:right;">−${fmtMoney(discount)}</td></tr>` : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Invoice ${num} — Foxmen Studio</title>
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Playfair+Display:ital,wght@0,700;1,400&display=swap" rel="stylesheet"/>
</head>
<body style="margin:0;padding:32px 16px;background:#f1efe9;font-family:'Instrument Serif','Times New Roman',serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:640px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,.10);">

  <!-- DARK HEADER -->
  <tr><td style="background:#0a0a0a;padding:2.75rem 3rem 2.25rem;position:relative;overflow:hidden;">
    <!-- Top row: brand + invoice meta -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:0;"><tr>
      <td style="vertical-align:top;">
        <table cellpadding="0" cellspacing="0" border="0"><tr>
          <td style="vertical-align:middle;padding-right:14px;">
            <img src="${logoUrl}" height="46" width="46" alt="" style="display:block;"/>
          </td>
          <td style="vertical-align:middle;">
            <div style="font-family:'Instrument Serif','Times New Roman',serif;font-size:2rem;font-weight:400;color:#fff;line-height:1;">Foxmen <em style="font-style:italic;color:#b86cf9;font-weight:400;">Studio</em></div>
            <div style="font-family:monospace;font-size:.6rem;letter-spacing:.18em;text-transform:uppercase;color:#b86cf9;font-weight:700;margin-top:7px;">Code · Craft · Care</div>
            <div style="font-family:monospace;font-size:.58rem;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.9);font-weight:400;padding-top:8px;border-top:1px solid rgba(255,255,255,.07);">Est. 2019 · AI-Powered Studio</div>
            <div style="font-size:.73rem;color:rgba(255,255,255,.45);line-height:1.8;margin-top:7px;">We architect AI-integrated digital products that define the next era of business.<br/>Precision-engineered software and elevated design — built to give your brand an unfair advantage.</div>
          </td>
        </tr></table>
      </td>
      <td style="text-align:right;vertical-align:top;">
        <div style="font-family:monospace;font-size:.58rem;letter-spacing:.22em;text-transform:uppercase;color:rgba(255,255,255,.35);">Invoice</div>
        <div style="font-family:'Playfair Display',Georgia,serif;font-size:1.5rem;font-weight:700;color:#fff;margin-top:5px;word-break:break-all;">${num}</div>
        <div style="margin-top:10px;font-size:.68rem;color:rgba(255,255,255,.38);line-height:2.1;text-align:right;">
          <div>Issued: <strong style="color:rgba(255,255,255,.8);">${fmtDate(date)}</strong></div>
          ${due ? `<div>Due: <strong style="color:rgba(255,255,255,.8);">${fmtDate(due)}</strong></div>` : ""}
        </div>
      </td>
    </tr></table>
    <!-- Horizontal rule -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:1.75rem 0 1.5rem;"><tr>
      <td style="height:1px;background:rgba(255,255,255,.1);font-size:0;line-height:0;">&nbsp;</td>
    </tr></table>
    <!-- Bottom row: contact + status -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="font-size:.68rem;color:rgba(255,255,255,.38);line-height:1.9;vertical-align:middle;">
        <strong style="color:rgba(255,255,255,.7);font-weight:500;">contact@foxmenstudio.com</strong> · foxmen.studio
      </td>
      <td style="text-align:right;vertical-align:middle;">
        <span style="display:inline-flex;align-items:center;gap:7px;padding:5px 14px;border-radius:999px;font-size:.7rem;font-weight:700;background:${st.bg};color:${st.color};">
          <span style="width:7px;height:7px;border-radius:50%;background:${st.color};display:inline-block;"></span>${st.label}
        </span>
      </td>
    </tr></table>
  </td></tr>

  <!-- ACCENT LINE -->
  <tr><td style="background:linear-gradient(90deg,#b86cf9,#8c3bd9,#6d28d9);height:3px;font-size:0;line-height:0;">&nbsp;</td></tr>

  <!-- THREE-COL INFO BLOCK -->
  <tr><td>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-bottom:1px solid #f0ede8;"><tr>
      <td width="33%" style="padding:1.25rem 1.75rem;vertical-align:top;border-right:1px solid #f0ede8;">
        <div style="font-size:.6rem;letter-spacing:.14em;text-transform:uppercase;color:#b86cf9;font-weight:700;margin-bottom:8px;">Bill To</div>
        <div style="font-size:.875rem;font-weight:700;color:#0a0a0a;">${client || "—"}</div>
        <div style="font-size:.75rem;color:#6b6b6b;margin-top:4px;line-height:1.75;">
          ${company ? company + "<br/>" : ""}
          ${data.email ? data.email + "<br/>" : ""}
          ${phone || ""}
        </div>
      </td>
      <td width="33%" style="padding:1.25rem 1.75rem;vertical-align:top;border-right:1px solid #f0ede8;">
        <div style="font-size:.6rem;letter-spacing:.14em;text-transform:uppercase;color:#b86cf9;font-weight:700;margin-bottom:8px;">Project</div>
        <div style="font-size:.875rem;font-weight:700;color:#0a0a0a;">${projectName || "—"}</div>
        <div style="font-size:.75rem;color:#6b6b6b;margin-top:4px;line-height:1.75;">
          ${projectType ? projectType + "<br/>" : ""}
          ${timeline || ""}
        </div>
      </td>
      <td width="33%" style="padding:1.25rem 1.75rem;vertical-align:top;">
        <div style="font-size:.6rem;letter-spacing:.14em;text-transform:uppercase;color:#b86cf9;font-weight:700;margin-bottom:8px;">Payment Terms</div>
        <div style="font-size:.875rem;font-weight:700;color:#0a0a0a;">${due ? fmtDate(due) : "Net 14"}</div>
        <div style="font-size:.75rem;color:#6b6b6b;margin-top:4px;line-height:1.75;">${payName}<br/>${payDetail || ""}</div>
      </td>
    </tr></table>
  </td></tr>

  <!-- SERVICES TABLE -->
  <tr><td style="padding:1.5rem 2rem 1rem;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <thead>
        <tr style="border-bottom:2px solid #f0ede8;">
          <th style="font-size:.6rem;letter-spacing:.14em;text-transform:uppercase;color:#9a9a9a;font-weight:600;text-align:left;padding:0 16px 10px 0;width:28%;">Service</th>
          <th style="font-size:.6rem;letter-spacing:.14em;text-transform:uppercase;color:#9a9a9a;font-weight:600;text-align:left;padding:0 16px 10px;width:30%;">Description</th>
          <th style="font-size:.6rem;letter-spacing:.14em;text-transform:uppercase;color:#9a9a9a;font-weight:600;text-align:right;padding:0 16px 10px;width:14%;">Hrs / Units</th>
          <th style="font-size:.6rem;letter-spacing:.14em;text-transform:uppercase;color:#9a9a9a;font-weight:600;text-align:right;padding:0 16px 10px;width:14%;">Rate</th>
          <th style="font-size:.6rem;letter-spacing:.14em;text-transform:uppercase;color:#9a9a9a;font-weight:600;text-align:right;padding:0 0 10px;width:14%;">Total</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  </td></tr>

  <!-- TOTALS -->
  <tr><td style="padding:.5rem 2rem 1.5rem;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td>
      <table cellpadding="0" cellspacing="0" border="0" style="margin-left:auto;width:260px;">
        <tr><td style="padding:4px 0;font-size:12px;color:#6b6b6b;">Subtotal</td><td style="padding:4px 0;font-size:12px;color:#6b6b6b;text-align:right;">${fmtMoney(subtotal)}</td></tr>
        ${taxRow}
        ${discRow}
        <tr><td colspan="2" style="padding:8px 0;border-top:1px solid #f0ede8;font-size:0;">&nbsp;</td></tr>
        <tr>
          <td style="font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#0a0a0a;">Total Due</td>
          <td style="text-align:right;font-family:'Playfair Display',Georgia,serif;font-size:1.75rem;font-weight:700;color:#0a0a0a;">${fmtMoney(total)}</td>
        </tr>
      </table>
    </td></tr></table>
  </td></tr>

  ${notes ? `<!-- NOTES -->
  <tr><td style="padding:0 2rem 1.5rem;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fafaf8;border:1px solid #f0ede8;border-radius:8px;"><tr><td style="padding:1rem 1.25rem;">
      <div style="font-size:.6rem;letter-spacing:.14em;text-transform:uppercase;color:#9a9a9a;font-weight:600;margin-bottom:6px;">Project Notes</div>
      <div style="font-size:.78rem;color:#4b4b4b;line-height:1.7;">${notes}</div>
    </td></tr></table>
  </td></tr>` : ""}

  <!-- FOOTER -->
  <tr><td style="background:#0a0a0a;padding:0 0 3px;font-size:0;line-height:0;">
    <div style="height:3px;background:linear-gradient(90deg,#b86cf9,#8c3bd9,#6d28d9);"></div>
  </td></tr>
  <tr><td style="background:#0a0a0a;padding:1.75rem 3rem;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="vertical-align:top;width:33%;">
        <table cellpadding="0" cellspacing="0" border="0"><tr>
          <td style="vertical-align:middle;padding-right:10px;">
            <img src="${logoUrl}" height="32" width="32" alt="" style="display:block;"/>
          </td>
          <td style="vertical-align:middle;">
            <div style="font-family:'Instrument Serif','Times New Roman',serif;font-size:1rem;color:#fff;font-weight:400;">Foxmen <em style="font-style:italic;color:#b86cf9;">Studio</em></div>
          </td>
        </tr></table>
        <div style="font-size:.6rem;color:rgba(255,255,255,.3);margin-top:5px;letter-spacing:.06em;">Code · Craft · Care · Est. 2019</div>
      </td>
      <td style="text-align:center;vertical-align:top;width:33%;">
        <div style="font-size:.7rem;color:rgba(255,255,255,.4);line-height:2;"><strong style="color:rgba(255,255,255,.75);font-weight:500;">contact@foxmenstudio.com</strong><br/>foxmen.studio</div>
      </td>
      <td style="text-align:right;vertical-align:top;width:33%;">
        <div style="font-size:.65rem;color:rgba(255,255,255,.3);line-height:1.9;">Payment due within 14 days of issue.<br/>Late payments subject to 2% monthly interest.</div>
      </td>
    </tr></table>
  </td></tr>

</table>
</td></tr></table>
</body></html>`;
}

export async function POST(req: Request) {
  const body = await req.json();
  const { status, client, company, email, phone, num, date, due, projectName, projectType, timeline, items, taxRate, discount, notes, payment, total } = body;

  if (!email) return NextResponse.json({ error: "No email address" }, { status: 400 });

  const html = buildEmailHtml({ status, client, company, email, phone, num, date, due, projectName, projectType, timeline, items, taxRate, discount, notes, payment, total });

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "RESEND_API_KEY not configured" }, { status: 500 });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `Foxmen Studio <${process.env.FROM_EMAIL ?? "contact@foxmenstudio.com"}>`,
      to: email,
      subject: `Invoice ${num} from Foxmen Studio — ${new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}`,
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    console.error("Resend invoice error:", err);
    return NextResponse.json({ error: "Email failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
