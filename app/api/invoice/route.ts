import { NextResponse } from "next/server";

interface Item { desc: string; qty: number; rate: number }

function fmtDate(d: string) {
  if (!d) return "—";
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}
function fmtMoney(n: number) {
  return "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const PAYMENT_LABELS: Record<string, string> = {
  wise:   "Wise — hello@foxmen.studio",
  paypal: "PayPal — payments@foxmen.studio",
  bank:   "Bank Transfer — IBAN provided on request",
  crypto: "USDT / USDC — Wallet address provided on request",
};

function buildEmailHtml(data: {
  client: string; company: string; num: string; date: string; due: string;
  items: Item[]; notes: string; payment: string; total: number;
}) {
  const { client, company, num, date, due, items, notes, payment, total } = data;
  const payLabel = PAYMENT_LABELS[payment] ?? payment;
  const [payName, payDetail] = payLabel.split("—").map(s => s.trim());

  const rows = items.filter(it => it.desc || it.rate).map(it => `
    <tr>
      <td style="padding:14px 20px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#222;">${it.desc || "—"}</td>
      <td style="padding:14px 20px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#555;text-align:center;">${it.qty}</td>
      <td style="padding:14px 20px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#555;text-align:right;">${fmtMoney(it.rate)}</td>
      <td style="padding:14px 20px;border-bottom:1px solid #f0f0f0;font-size:14px;font-weight:700;color:#0a0a0a;text-align:right;">${fmtMoney(it.qty * it.rate)}</td>
    </tr>`).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Invoice ${num} — Foxmen Studio</title></head>
<body style="margin:0;padding:0;background:#f0eff0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:40px 16px;"><tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:620px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,.12);">

  <!-- HEADER -->
  <tr><td style="background:#0a0a0a;padding:40px 48px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td>
        <div style="font-size:22px;font-weight:700;color:#fff;letter-spacing:-.02em;">Foxmen <em style="font-style:italic;color:#b86cf9;">Studio</em></div>
        <div style="font-size:11px;color:rgba(255,255,255,.35);margin-top:4px;letter-spacing:.12em;text-transform:uppercase;">Code · Craft · Care</div>
        <div style="margin-top:14px;font-size:12px;color:rgba(255,255,255,.4);line-height:1.8;">hello@foxmen.studio<br/>foxmen.studio</div>
      </td>
      <td style="text-align:right;vertical-align:top;">
        <div style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:4px;">Invoice</div>
        <div style="font-size:28px;font-weight:800;color:#b86cf9;letter-spacing:-.02em;">${num}</div>
        <div style="margin-top:14px;font-size:12px;color:rgba(255,255,255,.45);line-height:1.9;text-align:right;">
          <div>Date &nbsp;<strong style="color:rgba(255,255,255,.7);">${fmtDate(date)}</strong></div>
          <div>Due &nbsp;<strong style="color:rgba(255,255,255,.7);">${fmtDate(due)}</strong></div>
        </div>
      </td>
    </tr></table>
  </td></tr>

  <!-- BILL TO -->
  <tr><td style="padding:36px 48px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="width:50%;vertical-align:top;">
        <div style="font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#aaa;margin-bottom:10px;">Bill to</div>
        <div style="font-size:18px;font-weight:700;">${client || "—"}</div>
        ${company ? `<div style="font-size:14px;color:#666;margin-top:2px;">${company}</div>` : ""}
      </td>
      <td style="width:50%;vertical-align:top;">
        <div style="font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#aaa;margin-bottom:10px;">From</div>
        <div style="font-size:18px;font-weight:700;">Foxmen Studio</div>
        <div style="font-size:14px;color:#666;margin-top:2px;">hello@foxmen.studio</div>
      </td>
    </tr></table>
  </td></tr>

  <!-- ITEMS TABLE -->
  <tr><td style="padding:28px 48px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #eee;border-radius:10px;overflow:hidden;">
      <thead style="background:#f7f7f5;">
        <tr>
          <th style="padding:12px 20px;font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:#999;font-weight:600;text-align:left;border-bottom:1px solid #eee;">Description</th>
          <th style="padding:12px 20px;font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:#999;font-weight:600;text-align:center;border-bottom:1px solid #eee;">Qty</th>
          <th style="padding:12px 20px;font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:#999;font-weight:600;text-align:right;border-bottom:1px solid #eee;">Rate</th>
          <th style="padding:12px 20px;font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:#999;font-weight:600;text-align:right;border-bottom:1px solid #eee;">Amount</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
      <tfoot style="background:#0a0a0a;">
        <tr>
          <td colspan="3" style="padding:18px 20px;font-size:14px;color:rgba(255,255,255,.5);text-align:right;">Total (USD)</td>
          <td style="padding:18px 20px;font-size:22px;font-weight:800;color:#b86cf9;text-align:right;">${fmtMoney(total)}</td>
        </tr>
      </tfoot>
    </table>
  </td></tr>

  <!-- PAYMENT -->
  <tr><td style="padding:24px 48px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fafaf9;border:1px solid #eee;border-radius:10px;"><tr><td style="padding:24px 28px;">
      <div style="font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#aaa;margin-bottom:12px;">Payment information</div>
      <div style="font-size:14px;color:#333;"><strong style="color:#0a0a0a;">${payName}</strong> — ${payDetail || ""}</div>
      ${notes ? `<div style="margin-top:14px;font-size:13px;color:#888;line-height:1.6;border-top:1px solid #eee;padding-top:14px;">${notes}</div>` : ""}
    </td></tr></table>
  </td></tr>

  <!-- FOOTER -->
  <tr><td style="padding:32px 48px;background:#0a0a0a;margin-top:32px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="font-size:14px;font-weight:600;color:rgba(255,255,255,.6);">Foxmen Studio</td>
      <td style="font-size:12px;color:rgba(255,255,255,.3);text-align:right;">Thank you for your business.</td>
    </tr></table>
  </td></tr>

</table>
</td></tr></table>
</body></html>`;
}

export async function POST(req: Request) {
  const body = await req.json();
  const { client, company, email, num, date, due, items, notes, payment, total } = body;

  if (!email) return NextResponse.json({ error: "No email address" }, { status: 400 });

  const html = buildEmailHtml({ client, company, num, date, due, items, notes, payment, total });

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
      from: `Foxmen Studio <${process.env.FROM_EMAIL ?? "hello@foxmen.studio"}>`,
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
