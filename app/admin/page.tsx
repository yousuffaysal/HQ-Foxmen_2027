"use client";
import { useState, useEffect, useRef, useCallback } from "react";

/* ================================================================
   TYPES
   ================================================================ */
type Project = { id:number; monogram:string; color_cls:string; name:string; industry:string; year:string; scope:string; status:string; updated_at:string; tagline:string; overview:string; challenge:string; solution:string; results:string; tech_stack:string; timeline_duration:string; client_name:string; live_url:string; hero_image:string; thumbnail:string; gallery:string; video_url:string; challenge_img1:string; challenge_img2:string; solution_img1:string; solution_img2:string; split1_label:string; split2_label:string; slug:string; challenge_img1_label:string; challenge_img2_label:string; solution_img1_label:string; solution_img2_label:string; challenge_img1_orient:string; challenge_img2_orient:string; solution_img1_orient:string; solution_img2_orient:string; client_quote:string; client_quote_author:string; client_quote_role:string; chapters:string };
type ChapterImage = { url:string; orient:"portrait"|"landscape"; label:string };
type ChapterStat  = { value:string; label:string; context:string };
type Chapter = { id:string; title:string; body:string; images:ChapterImage[]; video:string; stats:ChapterStat[]; img_layout:"side-by-side"|"stacked" };
type Post     = { id:number; title:string; category:string; author_init:string; author_name:string; read_time:string; status:string; published_at:string|null };
type Service  = { id:number; ord:number; name:string; descr:string; count:string; visible:boolean; badge:string|null; image:string|null };
type Testi    = { id:number; quote:string; name:string; role:string; av:string; hi:string };
type Client   = { id:number; name:string; industry:string; country:string; contact:string; eng:string; mrr:string; av:string; cls:string };
type Message  = { id:number; av:string; sender:string; subject:string; preview:string; body:string; source:string; interested:string; budget:string; country:string; unread:boolean; received_at:string };
type Member   = { id:number; av:string; name:string; role:string; bio:string };
type FoxPrice    = { id:number; category:string; feature_id:string; label:string; price_min:number; price_max:number; is_base:boolean; ord:number; note:string };
type InvoiceItem = { service:string; description:string; quantity:number; unit:string; rate:number };
type ProposalData= { executive_summary:string; scope_items:string[]; deliverables:string[]; timeline:{period:string;milestone:string;desc:string}[]; investment_note:string; terms:string };

/* ── PDF template helpers (open in new window → print as PDF) ── */
function proposalPdfHtml(client:string,company:string,service:string,timeline:string,budget:string,data:ProposalData):string{
  const today=new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});
  const num=`PROP-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;
  const li=(arr:string[])=>arr.map(s=>`<li><span class="arr">→</span>${s}</li>`).join("");
  const tl=(arr:{period:string;milestone:string;desc:string}[])=>arr.map(t=>`
    <div class="tl-row"><div class="tl-period">${t.period}</div><div class="tl-body"><h4>${t.milestone}</h4><p>${t.desc}</p></div></div>`).join("");
  return`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Proposal — ${client}</title>
<style>
@page{size:A4;margin:0}*{box-sizing:border-box;margin:0;padding:0}body{font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;color:#0a0a0a}
.cover{width:210mm;min-height:297mm;background:#0a0a0a;padding:64px;display:flex;flex-direction:column;justify-content:space-between;page-break-after:always}
.c-brand-name{font-size:22px;font-weight:700;color:#fff;letter-spacing:-.01em}.c-brand-name em{font-style:italic;color:#b86cf9}
.c-sub{font-size:10px;color:rgba(255,255,255,.3);letter-spacing:.12em;text-transform:uppercase;margin-top:3px}
.c-main{flex:1;display:flex;flex-direction:column;justify-content:center;padding:80px 0 60px}
.c-tag{font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:#b86cf9;margin-bottom:20px}
.c-title{font-size:62px;font-weight:800;line-height:1;color:#fff;letter-spacing:-.04em;margin-bottom:10px}
.c-title em{font-style:italic;color:rgba(255,255,255,.35);font-weight:300}
.c-divider{height:1px;background:rgba(255,255,255,.08);margin:44px 0}
.c-meta{display:grid;grid-template-columns:1fr 1fr}
.c-meta-item{padding:22px 0;border-top:1px solid rgba(255,255,255,.08)}
.c-meta-item:nth-child(odd){padding-right:32px;border-right:1px solid rgba(255,255,255,.08)}
.c-meta-item:nth-child(even){padding-left:32px}
.c-meta-label{font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.3);margin-bottom:6px}
.c-meta-val{font-size:18px;font-weight:600;color:#fff;letter-spacing:-.01em}
.c-meta-val.purple{color:#b86cf9}
.c-foot{display:flex;justify-content:space-between;font-size:11px;color:rgba(255,255,255,.25);letter-spacing:.06em}
.pg{width:210mm;padding:60px 64px}
.pg-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:52px;padding-bottom:18px;border-bottom:2px solid #0a0a0a}
.pg-head-brand{font-size:14px;font-weight:600}.pg-head-brand em{font-style:italic;color:#b86cf9}
.pg-head-right{text-align:right;font-size:11px;color:#999;line-height:1.7}
.sec{margin-bottom:48px}
.sec-label{font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:#b86cf9;margin-bottom:10px}
.sec h2{font-size:22px;font-weight:700;letter-spacing:-.02em;margin-bottom:14px}
.sec p{font-size:14px;line-height:1.78;color:#444}
ul.items{list-style:none;margin-top:12px}
ul.items li{display:flex;gap:12px;align-items:flex-start;padding:11px 0;border-bottom:1px solid #f0f0f0;font-size:14px;color:#333;line-height:1.55}
ul.items li .arr{color:#b86cf9;flex-shrink:0;margin-top:1px}
.tl-row{display:grid;grid-template-columns:110px 1fr;gap:24px;padding:16px 0;border-bottom:1px solid #f0f0f0}
.tl-period{font-size:11px;font-weight:700;color:#b86cf9;text-transform:uppercase;letter-spacing:.06em;line-height:1.5}
.tl-body h4{font-size:15px;font-weight:600;margin-bottom:4px}
.tl-body p{font-size:13px;color:#666;line-height:1.55}
.inv-box{background:#0a0a0a;padding:40px 48px;border-radius:8px;margin-top:14px}
.inv-box .amt{font-size:52px;font-weight:800;color:#b86cf9;letter-spacing:-.04em;line-height:1;margin-bottom:12px}
.inv-box .note{font-size:14px;color:rgba(255,255,255,.5);line-height:1.75}
.sig{display:grid;grid-template-columns:1fr 1fr;gap:48px;margin-top:56px}
.sig-line{border-top:2px solid #0a0a0a;padding-top:12px;font-size:12px;color:#888}
.sig-line .name{font-size:14px;font-weight:600;color:#0a0a0a;margin-top:4px}
.pg-foot{margin-top:60px;padding-top:18px;border-top:1px solid #eee;display:flex;justify-content:space-between;font-size:11px;color:#bbb}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style></head><body>
<div class="cover">
  <div><div class="c-brand-name">Foxmen <em>Studio</em></div><div class="c-sub">Code · Craft · Care</div></div>
  <div class="c-main">
    <div class="c-tag">Project Proposal · ${num}</div>
    <div class="c-title">Prepared<br/>for <em>${client}</em></div>
    <div class="c-divider"></div>
    <div class="c-meta">
      <div class="c-meta-item"><div class="c-meta-label">Service</div><div class="c-meta-val">${service}</div></div>
      <div class="c-meta-item"><div class="c-meta-label">Timeline</div><div class="c-meta-val">${timeline}</div></div>
      <div class="c-meta-item"><div class="c-meta-label">Investment</div><div class="c-meta-val purple">${budget}</div></div>
      <div class="c-meta-item"><div class="c-meta-label">Prepared on</div><div class="c-meta-val" style="font-size:16px">${today}</div></div>
    </div>
  </div>
  <div class="c-foot"><span>hello@foxmen.studio</span><span>foxmen.studio</span><span>Confidential · ${today}</span></div>
</div>
<div class="pg">
  <div class="pg-head">
    <div class="pg-head-brand">Foxmen <em>Studio</em> · Project Proposal</div>
    <div class="pg-head-right">${client}${company?` · ${company}`:""}<br/>${today}</div>
  </div>
  <div class="sec"><div class="sec-label">Executive Summary</div><h2>Project Overview</h2><p>${data.executive_summary.replace(/\n/g,"<br/>")}</p></div>
  <div class="sec"><div class="sec-label">Scope of Work</div><h2>What We're Building</h2><ul class="items">${li(data.scope_items||[])}</ul></div>
  <div class="sec"><div class="sec-label">Deliverables</div><h2>What You Receive</h2><ul class="items">${li(data.deliverables||[])}</ul></div>
  <div class="sec"><div class="sec-label">Timeline</div><h2>Project Schedule</h2>${tl(data.timeline||[])}</div>
  <div class="sec"><div class="sec-label">Investment</div><h2>Pricing</h2><div class="inv-box"><div class="amt">${budget}</div><div class="note">${data.investment_note}</div></div></div>
  <div class="sec"><div class="sec-label">Terms & Conditions</div><h2>Agreement</h2><p>${data.terms}</p></div>
  <div class="sig">
    <div class="sig-line"><div class="name">Foxmen Studio</div>Authorized Representative</div>
    <div class="sig-line"><div class="name">${client}</div>Client</div>
  </div>
  <div class="pg-foot"><span>Foxmen Studio · foxmen.studio · hello@foxmen.studio</span><span>${num}</span></div>
</div>
</body></html>`;}

function invoicePdfHtml(p:{
  status:string; client:string; company:string; email:string; phone:string;
  num:string; date:string; due:string;
  projectName:string; projectType:string; timeline:string;
  items:InvoiceItem[]; taxRate:number; discount:number;
  payment:string; notes:string;
}):string{
  const fmtD=(d:string)=>d?new Date(d+"T00:00:00").toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"}):"—";
  const fmtM=(n:number)=>"$"+Number(n).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
  const subtotal=p.items.reduce((s,it)=>s+(it.quantity*it.rate),0);
  const taxAmt=subtotal*(p.taxRate/100);
  const total=subtotal+taxAmt-p.discount;
  const PAY:Record<string,string>={wise:"Wise — contact@foxmenstudio.com",paypal:"PayPal — payments@foxmenstudio.com",bank:"Bank Transfer — IBAN on request",crypto:"USDT / USDC — Wallet on request"};
  const [pName,pDetail]=(PAY[p.payment]??p.payment).split("—").map(s=>s.trim());
  const STATUS_STYLE:Record<string,{color:string;bg:string;label:string}>={
    draft:{color:"#6b7280",bg:"#f9fafb",label:"Draft"},
    sent:{color:"#1d4ed8",bg:"#eff6ff",label:"Sent"},
    paid:{color:"#15803d",bg:"#f0fdf4",label:"Paid"},
    overdue:{color:"#b91c1c",bg:"#fef2f2",label:"Overdue"},
  };
  const st=STATUS_STYLE[p.status]??STATUS_STYLE.sent;
  const logoUrl="https://foxmen.studio/assets/logo-mark.svg";
  const rows=p.items.filter(it=>it.service||it.rate).map(it=>`
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #f8f7f5;vertical-align:top;">
        <div style="font-size:13px;font-weight:700;color:#0a0a0a;">${it.service||"—"}</div>
        ${it.description?`<div style="font-size:11px;color:#6b6b6b;margin-top:3px;line-height:1.55;">${it.description}</div>`:""}
      </td>
      <td style="padding:12px 0;border-bottom:1px solid #f8f7f5;font-size:12px;color:#0a0a0a;text-align:right;vertical-align:top;white-space:nowrap;">${it.quantity} ${it.unit}</td>
      <td style="padding:12px 0;border-bottom:1px solid #f8f7f5;font-size:12px;color:#6b6b6b;text-align:right;vertical-align:top;white-space:nowrap;">${fmtM(it.rate)}/${it.unit}</td>
      <td style="padding:12px 0;border-bottom:1px solid #f8f7f5;font-size:13px;font-weight:700;color:#0a0a0a;text-align:right;vertical-align:top;white-space:nowrap;">${fmtM(it.quantity*it.rate)}</td>
    </tr>`).join("");
  return`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Invoice ${p.num} — Foxmen Studio</title>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Playfair+Display:ital,wght@0,700;1,400&display=swap" rel="stylesheet"/>
<style>
@page{size:A4;margin:10mm 12mm}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Instrument Serif','Times New Roman',serif;color:#0a0a0a;background:#f1efe9}
.wrap{width:100%;background:#fff;border-radius:8px;overflow:hidden;min-height:270mm}
.hd{background:#0a0a0a;padding:2.5rem 3rem 2rem;position:relative;overflow:hidden;display:flex;justify-content:space-between;align-items:flex-start}
.hd::before{content:'';position:absolute;top:-60px;right:-60px;width:180px;height:180px;border:1.5px solid rgba(184,108,249,.12);border-radius:50%}
.hd::after{content:'';position:absolute;bottom:-80px;left:-40px;width:220px;height:220px;border:1.5px solid rgba(184,108,249,.07);border-radius:50%}
.hd-left,.hd-right{position:relative;z-index:1}
.hd-right{text-align:right}
.hd-top{display:flex;justify-content:space-between;align-items:flex-start}
.hd-brand{display:flex;flex-direction:column;gap:10px}
.hd-brand-main{display:flex;align-items:center;gap:14px}
.hd-brand-main img{height:46px;width:auto;object-fit:contain}
.hd-name{font-family:'Instrument Serif','Times New Roman',serif;font-size:2rem;font-weight:400;color:#fff;line-height:1}
.hd-name em{font-style:italic;color:#b86cf9;font-weight:400}
.hd-tag{font-family:monospace;font-size:.6rem;letter-spacing:.18em;text-transform:uppercase;color:#b86cf9;font-weight:700;margin-top:7px}
.hd-tag2{font-family:monospace;font-size:.58rem;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.9);font-weight:400;padding-top:8px;border-top:1px solid rgba(255,255,255,.07)}
.hd-para{font-size:.73rem;color:rgba(255,255,255,.45);line-height:1.8;margin-top:7px}
.hd-right{text-align:right}
.hd-label{font-family:monospace;font-size:.58rem;letter-spacing:.22em;text-transform:uppercase;color:rgba(255,255,255,.35)}
.hd-num{font-family:'Playfair Display',Georgia,serif;font-size:1.5rem;font-weight:700;color:#fff;margin-top:5px;word-break:break-all}
.hd-dates{margin-top:10px;font-size:.68rem;color:rgba(255,255,255,.38);line-height:2.1;text-align:right}
.hd-dates strong{color:rgba(255,255,255,.8);font-weight:600}
.hd-rule{height:1px;background:rgba(255,255,255,.1);margin:1.75rem 0 1.5rem;position:relative}
.hd-rule::before{content:'';position:absolute;left:0;top:-1px;width:48px;height:3px;background:linear-gradient(90deg,#b86cf9,#8c3bd9)}
.hd-bottom{display:flex;justify-content:space-between;align-items:center}
.hd-ct{font-size:.68rem;color:rgba(255,255,255,.38);line-height:1.9}
.hd-ct strong{color:rgba(255,255,255,.7);font-weight:500}
.badge{display:inline-flex;align-items:center;gap:7px;padding:5px 14px;border-radius:999px;font-size:.7rem;font-weight:700}
.badge .dot{width:7px;height:7px;border-radius:50%;display:inline-block}
.aline{height:3px;background:linear-gradient(90deg,#b86cf9,#8c3bd9,#6d28d9)}
.info-grid{display:grid;grid-template-columns:1fr 1fr 1fr;border-bottom:1px solid #f0ede8}
.ic{padding:1.25rem 1.75rem}
.ic:not(:last-child){border-right:1px solid #f0ede8}
.ic-label{font-size:.6rem;letter-spacing:.14em;text-transform:uppercase;color:#b86cf9;font-weight:700;margin-bottom:8px;display:block}
.ic-name{font-size:.875rem;font-weight:700;color:#0a0a0a}
.ic-det{font-size:.75rem;color:#6b6b6b;margin-top:4px;line-height:1.75}
.tbl-wrap{padding:1.5rem 3rem 1rem}
table{width:100%;border-collapse:collapse;table-layout:fixed}
th{font-size:.6rem;letter-spacing:.14em;text-transform:uppercase;color:#9a9a9a;font-weight:600;text-align:left;padding:0 0 10px;border-bottom:2px solid #f0ede8}
.col-svc{width:26%}.col-desc{width:30%}.col-qty{width:12%;text-align:right}.col-rate{width:15%;text-align:right}.col-tot{width:17%;text-align:right}
.tot-wrap{display:flex;justify-content:flex-end;padding:.5rem 3rem 1.5rem}
.tot-box{width:260px}
.tot-r{display:flex;justify-content:space-between;padding:5px 0;font-size:.78rem;color:#6b6b6b}
.tot-r.disc{color:#16a34a}
.tot-hr{border:none;border-top:1px solid #f0ede8;margin:8px 0}
.tot-final{display:flex;justify-content:space-between;align-items:baseline;padding-top:8px}
.tot-final .lbl{font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#0a0a0a}
.tot-final .amt{font-family:'Playfair Display',Georgia,serif;font-size:1.75rem;font-weight:700;color:#0a0a0a}
.notes-box{margin:0 3rem 1.5rem;background:#fafaf8;border:1px solid #f0ede8;border-radius:8px;padding:1rem 1.25rem}
.notes-lbl{font-size:.6rem;letter-spacing:.14em;text-transform:uppercase;color:#9a9a9a;font-weight:600;margin-bottom:6px;display:block}
.notes-txt{font-size:.78rem;color:#4b4b4b;line-height:1.7}
.ft{background:#0a0a0a;padding:1.75rem 3rem;display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-top:auto;position:relative}
.ft::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#b86cf9,#8c3bd9,#6d28d9)}
.ft-logo-row{display:flex;align-items:center;gap:10px}
.ft-logo-row img{height:32px;width:auto}
.ft-brand{font-family:'Instrument Serif','Times New Roman',serif;font-size:1rem;color:#fff;font-weight:400}
.ft-brand em{font-style:italic;color:#b86cf9}
.ft-sub{font-size:.6rem;color:rgba(255,255,255,.3);margin-top:5px;letter-spacing:.06em}
.ft-mid{text-align:center;font-size:.7rem;color:rgba(255,255,255,.4);line-height:2}
.ft-mid strong{color:rgba(255,255,255,.75);font-weight:500}
.ft-right{text-align:right;font-size:.65rem;color:rgba(255,255,255,.3);line-height:1.9}
@media print{body{background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}.wrap{border-radius:0}}
</style></head><body>
<div class="wrap">
<div class="hd">
  <div class="hd-top">
    <div>
      <div class="hd-brand">
        <div class="hd-brand-main">
          <img src="${logoUrl}" alt="Foxmen Studio"/>
          <div>
            <div class="hd-name">Foxmen <em>Studio</em></div>
            <div class="hd-tag">Code · Craft · Care</div>
          </div>
        </div>
        <div class="hd-tag2">Est. 2019 · AI-Powered Studio</div>
        <div class="hd-para">We architect AI-integrated digital products that define the next era of business.<br/>Precision-engineered software and elevated design — built to give your brand an unfair advantage.</div>
      </div>
    </div>
    <div class="hd-right">
      <div class="hd-label">Invoice</div>
      <div class="hd-num">${p.num}</div>
      <div class="hd-dates">
        <div>Issued: <strong>${fmtD(p.date)}</strong></div>
        ${p.due?`<div>Due: <strong>${fmtD(p.due)}</strong></div>`:""}
      </div>
    </div>
  </div>
  <div class="hd-rule"></div>
  <div class="hd-bottom">
    <div class="hd-ct"><strong>contact@foxmenstudio.com</strong> · foxmen.studio</div>
    <div class="badge" style="background:${st.bg};color:${st.color};">
      <span class="dot" style="background:${st.color};"></span>${st.label}
    </div>
  </div>
</div>
<div class="aline"></div>
<div class="info-grid">
  <div class="ic">
    <span class="ic-label">Bill To</span>
    <div class="ic-name">${p.client||"—"}</div>
    <div class="ic-det">${p.company?p.company+"<br/>":""}${p.email?p.email+"<br/>":""}${p.phone||""}</div>
  </div>
  <div class="ic">
    <span class="ic-label">Project</span>
    <div class="ic-name">${p.projectName||"—"}</div>
    <div class="ic-det">${p.projectType?p.projectType+"<br/>":""}${p.timeline||""}</div>
  </div>
  <div class="ic">
    <span class="ic-label">Payment Terms</span>
    <div class="ic-name">${p.due?fmtD(p.due):"Net 14"}</div>
    <div class="ic-det">${pName}<br/>${pDetail||""}</div>
  </div>
</div>
<div class="tbl-wrap">
<table>
  <thead><tr>
    <th class="col-svc">Service</th>
    <th class="col-desc">Description</th>
    <th class="col-qty" style="text-align:right">Hrs / Units</th>
    <th class="col-rate" style="text-align:right">Rate</th>
    <th class="col-tot" style="text-align:right">Total</th>
  </tr></thead>
  <tbody>${rows}</tbody>
</table>
</div>
<div class="tot-wrap">
  <div class="tot-box">
    <div class="tot-r"><span>Subtotal</span><span>${fmtM(subtotal)}</span></div>
    ${p.taxRate>0?`<div class="tot-r"><span>VAT ${p.taxRate}%</span><span>${fmtM(taxAmt)}</span></div>`:""}
    ${p.discount>0?`<div class="tot-r disc"><span>Discount</span><span>−${fmtM(p.discount)}</span></div>`:""}
    <hr class="tot-hr"/>
    <div class="tot-final"><span class="lbl">Total Due</span><span class="amt">${fmtM(total)}</span></div>
  </div>
</div>
${p.notes?`<div class="notes-box"><span class="notes-lbl">Project Notes</span><div class="notes-txt">${p.notes}</div></div>`:""}
<div class="ft">
  <div>
    <div class="ft-logo-row"><img src="${logoUrl}" alt=""/><div class="ft-brand">Foxmen <em>Studio</em></div></div>
    <div class="ft-sub">Code · Craft · Care · Est. 2019</div>
  </div>
  <div class="ft-mid"><strong>contact@foxmenstudio.com</strong><br/>foxmen.studio</div>
  <div class="ft-right">Payment due within 14 days of issue.<br/>Late payments subject to 2% monthly interest.</div>
</div>
</div>
</body></html>`;}

function openPdf(html:string){
  const w=window.open("","_blank","width=960,height=760");
  if(!w) return;
  w.document.write(html);
  w.document.close();
  setTimeout(()=>w.print(),700);
}

/* ================================================================
   HELPERS
   ================================================================ */
function relTime(d:string):string {
  const days = Math.floor((Date.now()-new Date(d).getTime())/(1000*60*60*24));
  if(days===0) return "Today"; if(days===1) return "Yesterday";
  if(days<7) return `${days} days ago`; if(days<30) return `${Math.floor(days/7)} weeks ago`;
  if(days<365) return `${Math.floor(days/30)} months ago`; return `${Math.floor(days/365)} years ago`;
}
function fmtDate(d:string|null):string {
  if(!d) return "—";
  return new Date(d).toLocaleDateString("en-US",{month:"short",day:"numeric"});
}
function autoAv(name:string):string {
  return name.split(" ").map(w=>w[0]||"").join("").slice(0,2).toUpperCase();
}
function toSlug(name:string):string {
  return name.toLowerCase().replace(/[—–]/g,"-").replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").trim();
}
const CLS_CYCLE = ["","b","c","d"];

/* ================================================================
   SMALL COMPONENTS
   ================================================================ */
const PlusChip = ()=><span className="chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg></span>;
const ArrowChip = ()=><span className="chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18M13 5l7 7-7 7"/></svg></span>;
const EditSvg  = ()=><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 20h4l10-10-4-4L4 16Z"/></svg>;
const TrashSvg = ()=><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14"/></svg>;
const MsgSvg   = ()=><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"/></svg>;

function Field({label,value,onChange,placeholder,type="text"}:{label:string;value:string;onChange:(v:string)=>void;placeholder?:string;type?:string}){
  return <div className="field"><label>{label}</label><input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/></div>;
}
function FieldArea({label,value,onChange,placeholder}:{label:string;value:string;onChange:(v:string)=>void;placeholder?:string}){
  return <div className="field"><label>{label}</label><textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/></div>;
}
function FieldSel({label,value,onChange,options}:{label:string;value:string;onChange:(v:string)=>void;options:string[]}){
  return <div className="field"><label>{label}</label><select value={value} onChange={e=>onChange(e.target.value)}>{options.map(o=><option key={o} value={o}>{o.charAt(0).toUpperCase()+o.slice(1)}</option>)}</select></div>;
}

function ImageUpload({label,value,onChange,accept="image/*,video/*",orient,onOrientChange,imageLabel,onLabelChange}:{label:string;value:string;onChange:(v:string)=>void;accept?:string;orient?:"portrait"|"landscape";onOrientChange?:(v:"portrait"|"landscape")=>void;imageLabel?:string;onLabelChange?:(v:string)=>void}){
  const [uploading,setUploading]=useState(false);
  const inputRef=useRef<HTMLInputElement>(null);
  const handleFile=async(file:File)=>{
    setUploading(true);
    const fd=new FormData(); fd.append("file",file);
    const res=await fetch("/api/upload",{method:"POST",body:fd});
    const json=await res.json();
    if(json.url) onChange(json.url);
    setUploading(false);
  };
  const isVideo=value&&/\.(mp4|webm|mov|ogg)$/i.test(value);
  const previewAspect=orient==="landscape"?"16/9":"4/5";
  return(
    <div className="field">
      <label>{label}</label>
      <div
        className={`img-drop${uploading?" uploading":""}`}
        style={onOrientChange&&value?{aspectRatio:previewAspect,height:"auto"}:undefined}
        onClick={()=>!uploading&&inputRef.current?.click()}
        onDrop={e=>{e.preventDefault();const f=e.dataTransfer.files[0];if(f)handleFile(f);}}
        onDragOver={e=>e.preventDefault()}
      >
        {uploading
          ? <span className="img-drop-hint">Uploading…</span>
          : value
            ? isVideo
              ? <video src={value} className="img-drop-preview" muted playsInline/>
              : <img src={value} alt="" className="img-drop-preview"/>
            : <span className="img-drop-hint">Click or drag to upload</span>
        }
        {value&&!uploading&&(
          <button className="img-drop-clear" onClick={e=>{e.stopPropagation();onChange("");}}>✕</button>
        )}
      </div>
      {onOrientChange&&(
        <div className="orient-toggle">
          <button className={orient==="portrait"?"on":""} onClick={()=>onOrientChange("portrait")}>Portrait (Mobile)</button>
          <button className={orient==="landscape"?"on":""} onClick={()=>onOrientChange("landscape")}>Landscape (Desktop)</button>
        </div>
      )}
      {onLabelChange&&(
        <input
          className="img-label-input"
          type="text"
          placeholder="Image label (overlaid on photo)"
          value={imageLabel||""}
          onChange={e=>onLabelChange(e.target.value)}
        />
      )}
      <input ref={inputRef} type="file" accept={accept} style={{display:"none"}}
        onChange={e=>{const f=e.target.files?.[0];if(f)handleFile(f);e.target.value="";}}/>
    </div>
  );
}

function GalleryUpload({label,value,onChange}:{label:string;value:string[];onChange:(v:string[])=>void}){
  const [uploading,setUploading]=useState(false);
  const inputRef=useRef<HTMLInputElement>(null);
  const handleFiles=async(files:FileList)=>{
    setUploading(true);
    const uploaded:string[]=[];
    for(const file of Array.from(files)){
      const fd=new FormData(); fd.append("file",file);
      const res=await fetch("/api/upload",{method:"POST",body:fd});
      const json=await res.json();
      if(json.url) uploaded.push(json.url);
    }
    onChange([...value,...uploaded]);
    setUploading(false);
  };
  const remove=(i:number)=>onChange(value.filter((_,j)=>j!==i));
  return(
    <div className="field">
      <label>{label}</label>
      <div className="gallery-upload">
        {value.map((url,i)=>{
          const isV=/\.(mp4|webm|mov|ogg)$/i.test(url);
          return(
            <div key={i} className="gallery-tile">
              {isV
                ? <video src={url} className="gallery-tile-media" muted playsInline/>
                : <img src={url} alt="" className="gallery-tile-media"/>}
              <button className="gallery-tile-rm" onClick={()=>remove(i)}>✕</button>
            </div>
          );
        })}
        <button className="gallery-add" onClick={()=>!uploading&&inputRef.current?.click()} disabled={uploading}>
          {uploading?"…":"+"}
        </button>
      </div>
      <input ref={inputRef} type="file" accept="image/*,video/*" multiple style={{display:"none"}}
        onChange={e=>{if(e.target.files)handleFiles(e.target.files);e.target.value="";}}/>
    </div>
  );
}

function VideoInput({value,onChange}:{value:string;onChange:(v:string)=>void}){
  const [uploading,setUploading]=useState(false);
  const [tab,setTab]=useState<"upload"|"link">(value&&!value.startsWith("blob:")?"link":"upload");
  const inputRef=useRef<HTMLInputElement>(null);
  const handleFile=async(file:File)=>{
    setUploading(true);
    const fd=new FormData(); fd.append("file",file);
    const res=await fetch("/api/upload",{method:"POST",body:fd});
    const json=await res.json();
    if(json.url){onChange(json.url);setTab("link");}
    setUploading(false);
  };
  return(
    <div className="field">
      <label>Video / showreel</label>
      <div className="video-tabs">
        <button className={tab==="upload"?"on":""} onClick={()=>setTab("upload")} type="button">Upload file</button>
        <button className={tab==="link"?"on":""} onClick={()=>setTab("link")} type="button">Paste URL</button>
      </div>
      {tab==="upload"?(
        <div className={`img-drop${uploading?" uploading":""}`} style={{aspectRatio:"16/9",minHeight:80}}
          onClick={()=>!uploading&&inputRef.current?.click()}
          onDrop={e=>{e.preventDefault();const f=e.dataTransfer.files[0];if(f)handleFile(f);}}
          onDragOver={e=>e.preventDefault()}>
          {uploading
            ?<span className="img-drop-hint">Uploading…</span>
            :value
              ?<video src={value} className="img-drop-preview" muted playsInline/>
              :<span className="img-drop-hint">Click or drag a video file</span>}
          {value&&!uploading&&<button className="img-drop-clear" onClick={e=>{e.stopPropagation();onChange("");}}>✕</button>}
        </div>
      ):(
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          <input
            className="field input"
            style={{marginTop:4}}
            value={value}
            onChange={e=>onChange(e.target.value)}
            placeholder="https://youtube.com/… or https://vimeo.com/… or direct .mp4 URL"
          />
          {value&&(value.includes("youtube")||value.includes("youtu.be")||value.includes("vimeo"))&&(
            <span style={{fontSize:10,fontFamily:"var(--f-mono)",color:"var(--ok)",letterSpacing:".1em"}}>✓ Embed URL detected</span>
          )}
          {value&&!value.includes("youtube")&&!value.includes("youtu.be")&&!value.includes("vimeo")&&value.startsWith("http")&&(
            <video src={value} controls style={{width:"100%",borderRadius:10,marginTop:4,maxHeight:160}}/>
          )}
        </div>
      )}
      <input ref={inputRef} type="file" accept="video/*" style={{display:"none"}}
        onChange={e=>{const f=e.target.files?.[0];if(f)handleFile(f);e.target.value="";}}/>
    </div>
  );
}

/* ── Chapter image uploader ── */
function ChapterImageItem({img,onChange,onRemove}:{img:ChapterImage;onChange:(img:ChapterImage)=>void;onRemove:()=>void}){
  const [uploading,setUploading]=useState(false);
  const inputRef=useRef<HTMLInputElement>(null);
  const handleFile=async(file:File)=>{
    setUploading(true);
    const fd=new FormData(); fd.append("file",file);
    const res=await fetch("/api/upload",{method:"POST",body:fd});
    const json=await res.json();
    if(json.url) onChange({...img,url:json.url});
    setUploading(false);
  };
  const aspect=img.orient==="portrait"?"4/5":"16/9";
  return(
    <div className="ch-img-item">
      <div
        className={`ch-img-drop${uploading?" uploading":""}`}
        style={{aspectRatio:aspect}}
        onClick={()=>!uploading&&inputRef.current?.click()}
        onDrop={e=>{e.preventDefault();const f=e.dataTransfer.files[0];if(f)handleFile(f);}}
        onDragOver={e=>e.preventDefault()}
      >
        {uploading?<span className="img-drop-hint">Uploading…</span>
          :img.url?<img src={img.url} alt="" className="ch-img-preview"/>
          :<span className="img-drop-hint">Click or drag image</span>}
        {img.url&&!uploading&&<button className="img-drop-clear" onClick={e=>{e.stopPropagation();onChange({...img,url:""});}}>✕</button>}
      </div>
      <div className="orient-toggle" style={{marginTop:6}}>
        <button type="button" className={img.orient==="portrait"?"on":""} onClick={()=>onChange({...img,orient:"portrait"})}>Portrait (Mobile)</button>
        <button type="button" className={img.orient==="landscape"?"on":""} onClick={()=>onChange({...img,orient:"landscape"})}>Landscape (Desktop)</button>
      </div>
      <input className="img-label-input" placeholder="Label (optional, shows over image)" value={img.label} onChange={e=>onChange({...img,label:e.target.value})}/>
      <button type="button" className="ch-img-rm-btn" onClick={onRemove}>Remove image</button>
      <input ref={inputRef} type="file" accept="image/*" style={{display:"none"}}
        onChange={e=>{const f=e.target.files?.[0];if(f)handleFile(f);e.target.value="";}}/>
    </div>
  );
}

/* ── Chapter card ── */
function ChapterCard({ch,index,total,onChange,onRemove,onMove}:{ch:Chapter;index:number;total:number;onChange:(ch:Chapter)=>void;onRemove:()=>void;onMove:(dir:-1|1)=>void}){
  const addImage=()=>onChange({...ch,images:[...(ch.images||[]),{url:"",orient:"landscape",label:""}]});
  const updateImg=(i:number,img:ChapterImage)=>onChange({...ch,images:(ch.images||[]).map((x,j)=>j===i?img:x)});
  const removeImg=(i:number)=>onChange({...ch,images:(ch.images||[]).filter((_,j)=>j!==i)});
  const stats:ChapterStat[]=ch.stats||[];
  const addStat=()=>onChange({...ch,stats:[...stats,{value:"",label:"",context:""}]});
  const updateStat=(i:number,s:ChapterStat)=>onChange({...ch,stats:stats.map((x,j)=>j===i?s:x)});
  const removeStat=(i:number)=>onChange({...ch,stats:stats.filter((_,j)=>j!==i)});
  return(
    <div className="ch-card">
      <div className="ch-card-head">
        <span className="ch-num">{String(index+1).padStart(2,"0")}</span>
        <input className="ch-title-input" placeholder="Chapter title, e.g. The Challenge" value={ch.title} onChange={e=>onChange({...ch,title:e.target.value})}/>
        <div className="ch-actions">
          <button type="button" onClick={()=>onMove(-1)} disabled={index===0} title="Move up">↑</button>
          <button type="button" onClick={()=>onMove(1)} disabled={index===total-1} title="Move down">↓</button>
          <button type="button" onClick={onRemove} className="ch-rm" title="Delete chapter">✕</button>
        </div>
      </div>
      <textarea className="ch-body-input" placeholder={"Chapter body text\n**bold** *italic* # Heading - List > Quote"} value={ch.body} onChange={e=>onChange({...ch,body:e.target.value})} rows={4}/>
      {/* Stats / metrics */}
      {stats.length>0&&(
        <div className="ch-stats-section">
          {stats.map((s,i)=>(
            <div key={i} className="ch-stat-row">
              <input className="ch-stat-val" placeholder="47%" value={s.value} onChange={e=>updateStat(i,{...s,value:e.target.value})}/>
              <input className="ch-stat-label" placeholder="Revenue increase" value={s.label} onChange={e=>updateStat(i,{...s,label:e.target.value})}/>
              <input className="ch-stat-ctx" placeholder="Context (optional)" value={s.context} onChange={e=>updateStat(i,{...s,context:e.target.value})}/>
              <button type="button" className="ch-stat-rm" onClick={()=>removeStat(i)}>✕</button>
            </div>
          ))}
        </div>
      )}
      <div className="ch-img-grid-admin">
        {(ch.images||[]).map((img,i)=>(
          <ChapterImageItem key={i} img={img} onChange={v=>updateImg(i,v)} onRemove={()=>removeImg(i)}/>
        ))}
      </div>
      {(ch.images||[]).filter(i=>i.url).length>=2&&(
        <div className="ch-layout-toggle">
          <span className="ch-layout-label">Image layout</span>
          <div className="orient-toggle">
            <button type="button" className={(ch.img_layout||"side-by-side")==="side-by-side"?"on":""} onClick={()=>onChange({...ch,img_layout:"side-by-side"})}>Side by side</button>
            <button type="button" className={ch.img_layout==="stacked"?"on":""} onClick={()=>onChange({...ch,img_layout:"stacked"})}>One after another</button>
          </div>
        </div>
      )}
      <div className="ch-add-row">
        <button type="button" className="ch-add-img-btn" onClick={addImage}>+ Add image</button>
        <button type="button" className="ch-add-stat-btn" onClick={addStat}>+ Add metric</button>
        <input className="ch-video-input" placeholder="Video URL (YouTube, Vimeo, or .mp4)" value={ch.video} onChange={e=>onChange({...ch,video:e.target.value})}/>
      </div>
    </div>
  );
}

/* ── Chapter builder ── */
function ChapterBuilder({value,onChange}:{value:string;onChange:(v:string)=>void}){
  const parse=():Chapter[]=>{try{const a=JSON.parse(value||"[]");return Array.isArray(a)?a:[];}catch{return[];}};
  const set=(chs:Chapter[])=>onChange(JSON.stringify(chs));
  const chapters=parse();
  const add=()=>set([...chapters,{id:Math.random().toString(36).slice(2),title:"",body:"",images:[],video:"",stats:[],img_layout:"side-by-side"}]);
  const update=(id:string,ch:Chapter)=>set(chapters.map(c=>c.id===id?ch:c));
  const remove=(id:string)=>set(chapters.filter(c=>c.id!==id));
  const move=(id:string,dir:-1|1)=>{
    const idx=chapters.findIndex(c=>c.id===id);
    if(idx<0)return;
    const ni=idx+dir;
    if(ni<0||ni>=chapters.length)return;
    const arr=[...chapters];
    [arr[idx],arr[ni]]=[arr[ni],arr[idx]];
    set(arr);
  };
  return(
    <div className="chapter-builder">
      {chapters.map((ch,i)=>(
        <ChapterCard key={ch.id} ch={ch} index={i} total={chapters.length}
          onChange={c=>update(ch.id,c)} onRemove={()=>remove(ch.id)} onMove={d=>move(ch.id,d)}/>
      ))}
      {chapters.length===0&&(
        <div className="ch-empty">No chapters yet. Add your first one below.</div>
      )}
      <button type="button" className="ch-add-btn" onClick={add}>+ Add Chapter</button>
    </div>
  );
}

/* modal title map */
const MODAL_TITLE:Record<string,string>={
  "new-project":"New project","edit-project":"Edit project",
  "new-post":"New post","edit-post":"Edit post",
  "new-testimonial":"New testimonial","edit-testimonial":"Edit testimonial",
  "new-client":"Add client",
  "new-team":"Invite member",
  "new-service":"New service",
};

/* ================================================================
   MAIN COMPONENT
   ================================================================ */
export default function AdminPage() {
  /* auth */
  const [loggedIn, setLoggedIn] = useState(false);
  const [page, setPage]         = useState("dashboard");

  /* data */
  const [projects,  setProjects]  = useState<Project[]>([]);
  const [posts,     setPosts]     = useState<Post[]>([]);
  const [services,  setServices]  = useState<Service[]>([]);
  const [testis,    setTestis]    = useState<Testi[]>([]);
  const [clients,   setClients]   = useState<Client[]>([]);
  const [msgs,      setMsgs]      = useState<Message[]>([]);
  const [team,      setTeam]      = useState<Member[]>([]);
  const [foxPrices, setFoxPrices] = useState<FoxPrice[]>([]);
  const [priceCat,  setPriceCat]  = useState("Website");
  const [localPrices, setLocalPrices] = useState<Record<number,{min:number;max:number}>>({});
  const [localNotes, setLocalNotes]   = useState<Record<string,string>>({});

  /* proposals */
  const [propClient,    setPropClient]    = useState("");
  const [propCompany,   setPropCompany]   = useState("");
  const [propService,   setPropService]   = useState("Mobile App (React Native)");
  const [propScope,     setPropScope]     = useState("");
  const [propTimeline,  setPropTimeline]  = useState("");
  const [propBudget,    setPropBudget]    = useState("");
  const [propData,      setPropData]      = useState<ProposalData|null>(null);
  const [propGenerating,setPropGenerating]= useState(false);

  /* invoices */
  const [invStatus,      setInvStatus]      = useState<"draft"|"sent"|"paid"|"overdue">("sent");
  const [invClient,      setInvClient]      = useState("");
  const [invCompany,     setInvCompany]     = useState("");
  const [invEmail,       setInvEmail]       = useState("");
  const [invPhone,       setInvPhone]       = useState("");
  const [invNum,         setInvNum]         = useState("INV-001");
  const [invDate,        setInvDate]        = useState(()=>new Date().toISOString().split("T")[0]);
  const [invDue,         setInvDue]         = useState("");
  const [invProjectName, setInvProjectName] = useState("");
  const [invProjectType, setInvProjectType] = useState("Web App + AI Integration");
  const [invTimeline,    setInvTimeline]    = useState("");
  const [invItems,       setInvItems]       = useState<InvoiceItem[]>([{service:"",description:"",quantity:1,unit:"hrs",rate:0}]);
  const [invTaxRate,     setInvTaxRate]     = useState(10);
  const [invDiscount,    setInvDiscount]    = useState(0);
  const [invPayment,     setInvPayment]     = useState("wise");
  const [invNotes,       setInvNotes]       = useState("Payment due within 14 days of issue. Late payments subject to 2% monthly interest.");
  const [invSending,     setInvSending]     = useState(false);
  const [invAiPrompt,    setInvAiPrompt]    = useState("");

  /* email campaign */
  const [emailTo,         setEmailTo]         = useState("");
  const [emailSubject,    setEmailSubject]    = useState("");
  const [emailRawContent, setEmailRawContent] = useState("");
  const [emailSending,    setEmailSending]    = useState(false);
  const [invAiLoading,   setInvAiLoading]   = useState(false);
  const [projAiPrompt,   setProjAiPrompt]   = useState("");
  const [projAiLoading,  setProjAiLoading]  = useState(false);
  const [loading,   setLoading]   = useState(false);

  /* modal */
  const [modalType,   setModalType]   = useState<string|null>(null);
  const [editTarget,  setEditTarget]  = useState<number|null>(null);
  const [form,        setForm]        = useState<Record<string,string>>({});
  const [submitting,  setSubmitting]  = useState(false);

  /* ui */
  const [toastMsg, setToastMsg]     = useState("");
  const [toastOn,  setToastOn]      = useState(false);
  const [sidebarOpen,setSidebarOpen]= useState(false);
  const [settingsTab,setSettingsTab]= useState("brand");
  const [activeIdx,  setActiveIdx]  = useState(0);
  const [brandT, setBrandT]         = useState([true,true,true,false]);
  const [seoT,   setSeoT]           = useState([true,true]);
  const [secT,   setSecT]           = useState([true,true,true,false]);

  const toastTimer = useRef<ReturnType<typeof setTimeout>|null>(null);

  /* ── toast ── */
  const toast = useCallback((msg:string)=>{
    if(toastTimer.current) clearTimeout(toastTimer.current);
    setToastMsg(msg); setToastOn(true);
    toastTimer.current = setTimeout(()=>setToastOn(false),2400);
  },[]);

  /* ── nav ── */
  const nav = useCallback((p:string)=>{ setPage(p); setSidebarOpen(false); },[]);

  /* ── fetch ── */
  const loadData = useCallback(async (p:string)=>{
    setLoading(true);
    try {
      if(p==="dashboard"){
        const [pr,ms] = await Promise.all([fetch("/api/projects").then(r=>r.json()), fetch("/api/messages").then(r=>r.json())]);
        setProjects(Array.isArray(pr)?pr:[]); setMsgs(Array.isArray(ms)?ms:[]);
      } else if(p==="projects"){ const r=await fetch("/api/projects").then(r=>r.json()); setProjects(Array.isArray(r)?r:[]); }
      else if(p==="blog"){        const r=await fetch("/api/blog").then(r=>r.json()); setPosts(Array.isArray(r)?r:[]); }
      else if(p==="services"){    const r=await fetch("/api/services").then(r=>r.json()); setServices(Array.isArray(r)?r:[]); }
      else if(p==="testimonials"){const r=await fetch("/api/testimonials").then(r=>r.json()); setTestis(Array.isArray(r)?r:[]); }
      else if(p==="clients"){     const r=await fetch("/api/clients").then(r=>r.json()); setClients(Array.isArray(r)?r:[]); }
      else if(p==="messages"){    const r=await fetch("/api/messages").then(r=>r.json()); setMsgs(Array.isArray(r)?r:[]); setActiveIdx(0); }
      else if(p==="leads"){       const r=await fetch("/api/messages").then(r=>r.json()); setMsgs(Array.isArray(r)?r:[]); }
      else if(p==="team"){        const r=await fetch("/api/team").then(r=>r.json()); setTeam(Array.isArray(r)?r:[]); }
      else if(p==="fox-prices"){
        const r=await fetch("/api/fox-prices").then(r=>r.json());
        if(Array.isArray(r)){
          setFoxPrices(r);
          setLocalPrices(Object.fromEntries(r.map((x:FoxPrice)=>[x.id,{min:x.price_min,max:x.price_max}])));
          const notes:Record<string,string>={};
          r.filter((x:FoxPrice)=>x.is_base).forEach((x:FoxPrice)=>{ notes[x.category]=x.note||""; });
          setLocalNotes(notes);
        }
      }
    } catch { toast("Error loading data"); }
    setLoading(false);
  },[toast]);

  useEffect(()=>{ if(loggedIn) loadData(page); },[loggedIn,page,loadData]);

  /* ── field helper ── */
  const sf = (k:string,v:string)=>setForm(f=>({...f,[k]:v}));

  /* ── modal helpers ── */
  const openModal = (type:string, prefill:Record<string,string>={}, id:number|null=null)=>{
    setModalType(type); setForm(prefill); setEditTarget(id);
  };
  const closeModal = ()=>{ setModalType(null); setForm({}); setEditTarget(null); };

  /* ── PROJECTS ── */
  const deleteProject = async(id:number)=>{
    if(!confirm("Delete this project? This cannot be undone.")) return;
    await fetch(`/api/projects/${id}`,{method:"DELETE"});
    setProjects(p=>p.filter(x=>x.id!==id)); toast("Project deleted");
  };
  const submitProject = async()=>{
    if(!form.name?.trim()){ toast("Project name is required"); return; }
    setSubmitting(true);
    const slugVal = form.slug?.trim()||toSlug(form.name);
    const body = { monogram:form.monogram||form.name[0].toUpperCase(), color_cls:form.color_cls||"", name:form.name, industry:form.industry||"", year:form.year||String(new Date().getFullYear()), scope:form.scope||"", status:form.status||"draft", tagline:form.tagline||"", overview:form.overview||"", challenge:form.challenge||"", solution:form.solution||"", results:form.results||"", tech_stack:form.tech_stack||"", timeline_duration:form.timeline_duration||"", client_name:form.client_name||"", live_url:form.live_url||"", hero_image:form.hero_image||"", thumbnail:form.thumbnail||"", gallery:form.gallery||"[]", video_url:form.video_url||"", challenge_img1:form.challenge_img1||"", challenge_img2:form.challenge_img2||"", solution_img1:form.solution_img1||"", solution_img2:form.solution_img2||"", split1_label:form.split1_label||"Challenge", split2_label:form.split2_label||"Solution", slug:slugVal, challenge_img1_label:form.challenge_img1_label||"", challenge_img2_label:form.challenge_img2_label||"", solution_img1_label:form.solution_img1_label||"", solution_img2_label:form.solution_img2_label||"", challenge_img1_orient:form.challenge_img1_orient||"portrait", challenge_img2_orient:form.challenge_img2_orient||"portrait", solution_img1_orient:form.solution_img1_orient||"portrait", solution_img2_orient:form.solution_img2_orient||"portrait", client_quote:form.client_quote||"", client_quote_author:form.client_quote_author||"", client_quote_role:form.client_quote_role||"", chapters:form.chapters||"[]" };
    const url  = editTarget ? `/api/projects/${editTarget}` : "/api/projects";
    const meth = editTarget ? "PATCH" : "POST";
    const res  = await fetch(url,{method:meth,headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
    if(res.ok){
      const row:Project = await res.json();
      setProjects(p=>editTarget ? p.map(x=>x.id===editTarget?row:x) : [row,...p]);
      closeModal(); toast(editTarget?"Project updated":"Project created");
    } else { toast("Error saving project"); }
    setSubmitting(false);
  };

  /* ── POSTS ── */
  const deletePost = async(id:number)=>{
    if(!confirm("Delete this post?")) return;
    await fetch(`/api/blog/${id}`,{method:"DELETE"});
    setPosts(p=>p.filter(x=>x.id!==id)); toast("Post deleted");
  };
  const submitPost = async()=>{
    if(!form.title?.trim()){ toast("Title is required"); return; }
    setSubmitting(true);
    const ai = autoAv(form.author_name||"");
    const body = { title:form.title, category:form.category||"Design", author_init:ai, author_name:form.author_name||"", read_time:form.read_time||"5 min", status:form.status||"draft", published_at:form.status==="live"?new Date().toISOString().split("T")[0]:null };
    const url  = editTarget ? `/api/blog/${editTarget}` : "/api/blog";
    const meth = editTarget ? "PATCH" : "POST";
    const res  = await fetch(url,{method:meth,headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
    if(res.ok){
      const row:Post = await res.json();
      setPosts(p=>editTarget ? p.map(x=>x.id===editTarget?row:x) : [row,...p]);
      closeModal(); toast(editTarget?"Post updated":"Post created");
    } else { toast("Error saving post"); }
    setSubmitting(false);
  };

  /* ── SERVICES ── */
  const toggleSvc = async(id:number,visible:boolean)=>{
    await fetch("/api/services",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id,visible})});
    setServices(s=>s.map(x=>x.id===id?{...x,visible}:x));
  };
  const editService = (s:Service)=>{
    setForm({name:s.name,descr:s.descr,count:s.count,badge:s.badge||"",image:s.image||""});
    setEditTarget(s.id);
    setModalType("new-service");
  };
  const submitService = async()=>{
    if(!form.name?.trim()){ toast("Name is required"); return; }
    setSubmitting(true);
    if(editTarget){
      const res = await fetch("/api/services",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:editTarget,name:form.name,descr:form.descr||"",count:form.count||"",badge:form.badge||null,image:form.image||null})});
      if(res.ok){ const row:Service=await res.json(); setServices(s=>s.map(x=>x.id===row.id?row:x)); closeModal(); toast("Service updated"); }
    } else {
      const res = await fetch("/api/services",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:form.name,descr:form.descr||"",count:form.count||"",visible:true,badge:form.badge||null,image:form.image||null})});
      if(res.ok){ const row:Service=await res.json(); setServices(s=>[...s,row]); closeModal(); toast("Service created"); }
    }
    setSubmitting(false);
  };

  /* ── TESTIMONIALS ── */
  const deleteTesti = async(id:number)=>{
    if(!confirm("Delete this testimonial?")) return;
    await fetch(`/api/testimonials/${id}`,{method:"DELETE"});
    setTestis(t=>t.filter(x=>x.id!==id)); toast("Testimonial deleted");
  };
  const editTesti = (t:Testi)=>{
    setForm({quote:t.quote,name:t.name,role:t.role,av:t.av,hi:t.hi||""});
    setEditTarget(t.id);
    setModalType("edit-testimonial");
  };
  const submitTesti = async()=>{
    if(!form.quote?.trim()||!form.name?.trim()){ toast("Quote and name are required"); return; }
    setSubmitting(true);
    if(editTarget){
      const res = await fetch(`/api/testimonials/${editTarget}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({quote:form.quote,name:form.name,role:form.role||"",av:autoAv(form.name),hi:form.hi||""})});
      if(res.ok){ const row:Testi=await res.json(); setTestis(t=>t.map(x=>x.id===editTarget?row:x)); closeModal(); toast("Testimonial updated"); }
    } else {
      const res = await fetch("/api/testimonials",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({quote:form.quote,name:form.name,role:form.role||"",av:autoAv(form.name),hi:form.hi||""})});
      if(res.ok){ const row:Testi=await res.json(); setTestis(t=>[...t,row]); closeModal(); toast("Testimonial added"); }
    }
    setSubmitting(false);
  };

  /* ── CLIENTS ── */
  const deleteClient = async(id:number)=>{
    if(!confirm("Remove this client?")) return;
    await fetch(`/api/clients/${id}`,{method:"DELETE"});
    setClients(c=>c.filter(x=>x.id!==id)); toast("Client removed");
  };
  const submitClient = async()=>{
    if(!form.name?.trim()){ toast("Client name is required"); return; }
    setSubmitting(true);
    const res = await fetch("/api/clients",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:form.name,industry:form.industry||"",country:form.country||"",contact:form.contact||"",eng:form.eng||"",mrr:form.mrr||"",av:form.name[0].toUpperCase(),cls:CLS_CYCLE[clients.length%4]})});
    if(res.ok){ const row:Client=await res.json(); setClients(c=>[...c,row]); closeModal(); toast("Client added"); }
    setSubmitting(false);
  };

  /* ── MESSAGES ── */
  const deleteMsg = async(id:number)=>{
    if(!confirm("Delete this message?")) return;
    await fetch(`/api/messages/${id}`,{method:"DELETE"});
    setMsgs(m=>{ const next=m.filter(x=>x.id!==id); setActiveIdx(i=>Math.min(i,Math.max(0,next.length-1))); return next; });
    toast("Message deleted");
  };
  const markRead = async(id:number)=>{
    await fetch(`/api/messages/${id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({unread:false})});
    setMsgs(m=>m.map(x=>x.id===id?{...x,unread:false}:x));
  };
  const handleThread = (i:number)=>{
    setActiveIdx(i);
    if(msgs[i]?.unread) markRead(msgs[i].id);
  };

  /* ── TEAM ── */
  const deleteMember = async(id:number)=>{
    if(!confirm("Remove this team member?")) return;
    await fetch(`/api/team/${id}`,{method:"DELETE"});
    setTeam(t=>t.filter(x=>x.id!==id)); toast("Member removed");
  };
  const submitMember = async()=>{
    if(!form.name?.trim()){ toast("Name is required"); return; }
    setSubmitting(true);
    const res = await fetch("/api/team",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({av:form.av||autoAv(form.name),name:form.name,role:form.role||"",bio:form.bio||""})});
    if(res.ok){ const row:Member=await res.json(); setTeam(t=>[...t,row]); closeModal(); toast("Member invited"); }
    setSubmitting(false);
  };

  /* ── FOX PRICES ── */
  const saveFoxPrice = async(id:number)=>{
    const lp = localPrices[id]; if(!lp) return;
    const res = await fetch("/api/fox-prices",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id,price_min:lp.min,price_max:lp.max})});
    if(res.ok){ const row:FoxPrice=await res.json(); setFoxPrices(p=>p.map(x=>x.id===id?row:x)); }
    else { toast("Error saving price"); }
  };
  const saveFoxNote = async(cat:string)=>{
    const baseRow = foxPrices.find(p=>p.category===cat&&p.is_base); if(!baseRow) return;
    const note = localNotes[cat]??"";
    const res = await fetch("/api/fox-prices",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:baseRow.id,note})});
    if(res.ok){ const row:FoxPrice=await res.json(); setFoxPrices(p=>p.map(x=>x.id===baseRow.id?row:x)); }
  };
  const saveFoxCat = async(cat:string)=>{
    const catPrices = foxPrices.filter(p=>p.category===cat);
    await Promise.all([...catPrices.map(p=>saveFoxPrice(p.id)), saveFoxNote(cat)]);
    toast(`${cat} pricing saved`);
  };

  /* ── SETTINGS SAVE ── */
  const saveSettings = async(tab:string)=>{
    const fields = document.querySelectorAll<HTMLInputElement|HTMLTextAreaElement>("[data-setting]");
    const data:Record<string,string>={};
    fields.forEach(el=>{ data[el.dataset.setting!]=el.value; });
    await fetch("/api/settings",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
    toast(`Saved · ${tab} settings`);
  };

  /* ── MODAL SUBMIT ROUTER ── */
  const submitModal = ()=>{
    if(modalType==="new-project"||modalType==="edit-project") submitProject();
    else if(modalType==="new-post"||modalType==="edit-post") submitPost();
    else if(modalType==="new-testimonial"||modalType==="edit-testimonial") submitTesti();
    else if(modalType==="new-client") submitClient();
    else if(modalType==="new-team") submitMember();
    else if(modalType==="new-service") submitService();
  };

  /* ── NEW button per page ── */
  const handleNewBtn = ()=>{
    if(page==="projects"||page==="dashboard") openModal("new-project");
    else if(page==="blog") openModal("new-post");
    else if(page==="testimonials") openModal("new-testimonial");
    else if(page==="clients") openModal("new-client");
    else if(page==="team") openModal("new-team");
    else if(page==="services") openModal("new-service");
    else toast("New item — opening editor");
  };

  /* ── page meta ── */
  const CRUMBS:Record<string,string>={ dashboard:"Workspace / Dashboard", analytics:"Workspace / Analytics", projects:"Content / Projects", blog:"Content / Journal", services:"Content / Services", testimonials:"Content / Testimonials", media:"Content / Media", clients:"People / Clients", messages:"People / Inbox", leads:"People / Leads", team:"People / Team", settings:"System / Settings", "fox-prices":"System / Fox Pricing", proposals:"Generate / Proposals", invoices:"Generate / Invoices", email:"Generate / Email Campaign" };
  const TITLES:Record<string,React.ReactNode>={ dashboard:<>Good evening, <span className="it">Arif.</span></>, analytics:"Analytics", projects:"Projects", blog:"Journal", services:"Services", testimonials:"Testimonials", media:"Media library", clients:"Clients", messages:"Inbox", leads:"Estimator Leads", team:"Team", settings:"Settings", "fox-prices":"Fox Pricing", proposals:"Proposals", invoices:"Invoices", email:"Email Campaign" };

  /* ── dashboard derived ── */
  const liveProjects = projects.filter(p=>p.status==="live").length;
  const unreadMsgs   = msgs.filter(m=>m.unread).length;

  const engStatus=(eng:string)=>eng==="Retainer"?"live":eng==="Active build"?"review":eng==="Discovery"?"review":"archived";

  /* ────────────────────────────────────────────────────────
     LOGIN
     ──────────────────────────────────────────────────────── */
  if(!loggedIn) return (
    <section className="login">
      <aside className="pane">
        <div className="brand"><img src="/assets/logo-mark.svg" alt=""/><span>Foxmen <em style={{fontStyle:"italic",color:"var(--brand)"}}>Studio</em></span></div>
        <h1>Welcome <span className="it">back.</span><br/>Let&apos;s ship<br/>something good.</h1>
        <div className="meta"><span>v 4.2 — admin</span><span>Foxmen Studio</span></div>
      </aside>
      <form onSubmit={e=>{e.preventDefault();setLoggedIn(true);}}>
        <h2>Sign in to <span className="it">admin.</span></h2>
        <p>Use your studio email to access the dashboard. Two-factor is required for owners.</p>
        <div className="field"><label>Work email</label><input type="email" defaultValue="admin@foxmen.studio" placeholder="you@foxmen.studio" required/></div>
        <div className="field"><label>Password</label><input type="password" defaultValue="•••••••••••••" required/></div>
        <div className="helper">
          <label style={{display:"flex",gap:8,alignItems:"center",cursor:"pointer"}}><input type="checkbox" defaultChecked style={{width:16,height:16,accentColor:"#0a0a0a"}}/> Remember this device</label>
          <a href="#">Forgot password?</a>
        </div>
        <button type="submit">Sign in to dashboard <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18M13 5l7 7-7 7"/></svg></button>
        <div className="or">or continue with</div>
        <div className="sso">
          <button type="button"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M21.35 11.1h-9.18v2.92h5.26c-.23 1.5-1.69 4.4-5.26 4.4-3.17 0-5.75-2.62-5.75-5.85s2.58-5.85 5.75-5.85c1.8 0 3.01.77 3.7 1.43l2.52-2.43C16.85 4.2 14.74 3.2 12.17 3.2 6.86 3.2 2.6 7.5 2.6 12.57s4.26 9.37 9.57 9.37c5.52 0 9.18-3.87 9.18-9.33 0-.63-.07-1.1-.15-1.51Z"/></svg>Google</button>
          <button type="button"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.92.58.1.79-.25.79-.55v-2.16c-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.27-1.69-1.27-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.69 1.25 3.34.95.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.27-5.24-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.17a11.05 11.05 0 0 1 5.78 0c2.21-1.48 3.18-1.17 3.18-1.17.62 1.58.23 2.75.11 3.04.73.8 1.18 1.82 1.18 3.07 0 4.4-2.69 5.36-5.25 5.65.41.36.78 1.05.78 2.12v3.14c0 .3.21.66.79.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z"/></svg>GitHub</button>
        </div>
      </form>
    </section>
  );

  /* ────────────────────────────────────────────────────────
     APP SHELL
     ──────────────────────────────────────────────────────── */
  const activeMsg = msgs[activeIdx];

  return (
    <div className="app">

      {/* ══ SIDEBAR ══ */}
      <aside className={`sidebar${sidebarOpen?" open":""}`}>
        <div className="side-brand"><img src="/assets/logo-mark.svg" alt=""/><div><div className="name">Foxmen <em style={{fontStyle:"italic",color:"var(--brand)"}}>Admin</em></div><span className="sub">Workspace · Studio</span></div></div>
        <label className="side-search"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/></svg><input type="search" placeholder="Quick search"/><kbd>⌘K</kbd></label>
        <nav className="side-nav">
          <span className="label">Workspace</span>
          {[["dashboard","Dashboard",<svg key="d" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>],
           ["analytics","Analytics",<svg key="a" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 3v18h18M7 14l4-4 4 4 5-7"/></svg>]
          ].map(([p,label,icon])=>(
            <a key={p as string} className={page===p?"active":""} onClick={()=>nav(p as string)}>{icon as React.ReactNode}{label as string}</a>
          ))}
          <span className="label">Content</span>
          {[["projects","Projects",<svg key="p" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18M8 5V3M16 5V3"/></svg>,`${projects.length||38}`],
           ["blog","Blog posts",<svg key="b" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 5h16M4 12h16M4 19h10"/></svg>,`${posts.length||24}`],
           ["services","Services",<svg key="s" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/></svg>,null],
           ["testimonials","Testimonials",<svg key="t" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"/></svg>,null],
           ["media","Media library",<svg key="m" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/></svg>,null],
          ].map(([p,label,icon,badge])=>(
            <a key={p as string} className={page===p?"active":""} onClick={()=>nav(p as string)}>{icon as React.ReactNode}{label as string}{badge&&<span className="badge">{badge as string}</span>}</a>
          ))}
          <span className="label">People</span>
          {[["clients","Clients",<svg key="c" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,`${clients.length||42}`],
           ["messages","Messages",<svg key="msg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 4h16v12H5l-1 4Z"/></svg>,unreadMsgs>0?String(unreadMsgs):null],
           ["leads","Est. Leads",<svg key="leads" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2a7 7 0 0 1 7 7c0 4-4 9-7 11C9 18 5 13 5 9a7 7 0 0 1 7-7Z"/><circle cx="12" cy="9" r="2.5"/></svg>,msgs.filter(m=>m.source==="estimator"&&m.unread).length>0?String(msgs.filter(m=>m.source==="estimator"&&m.unread).length):null],
           ["team","Team",<svg key="tm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>,null],
          ].map(([p,label,icon,badge])=>(
            <a key={p as string} className={page===p?"active":""} onClick={()=>nav(p as string)}>{icon as React.ReactNode}{label as string}{badge&&<span className="badge">{badge as string}</span>}</a>
          ))}
          <span className="label">Generate</span>
          <a className={page==="proposals"?"active":""} onClick={()=>nav("proposals")}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>Proposals</a>
          <a className={page==="invoices"?"active":""} onClick={()=>nav("invoices")}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4M14 15h4"/></svg>Invoices</a>
          <a className={page==="email"?"active":""} onClick={()=>nav("email")}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 4h16v16H4V4Z"/><path d="m4 4 8 9 8-9"/></svg>Email Campaign</a>
          <span className="label">System</span>
          <a className={page==="fox-prices"?"active":""} onClick={()=>nav("fox-prices")}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>Fox Pricing</a>
          <a className={page==="settings"?"active":""} onClick={()=>nav("settings")}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.8 1.3V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-2.8-1.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0-1.3-2.8H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.3-2.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 2.8-1.3V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 2.8 1.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0 1.3 2.8H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.3 2.8Z"/></svg>Settings</a>
        </nav>
        <div className="side-foot">
          <div className="av">AR</div>
          <div className="info"><div className="n">Arif Rahman</div><div className="r">Owner · admin</div></div>
          <a href="#" className="ic" title="Sign out" onClick={e=>{e.preventDefault();if(confirm("Sign out?"))setLoggedIn(false);}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
          </a>
        </div>
      </aside>

      {/* ══ MAIN ══ */}
      <main className="main">

        {/* TOPBAR */}
        <header className="topbar">
          <button className="ic-btn" style={{display:"none"}} aria-label="Menu" onClick={()=>setSidebarOpen(o=>!o)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
          <div><div className="crumb">{CRUMBS[page]}</div><h1>{TITLES[page]}</h1></div>
          <div className="spacer"/>
          <button className="ic-btn" title="Refresh" onClick={()=>loadData(page)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
          </button>
          <button className="ic-btn" title="Notifications"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21a2 2 0 0 0 4 0"/></svg><span className="dot"/></button>
          <a href="/" className="btn-ghost">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12s3-7 9-7 9 7 9 7-3 7-9 7-9-7-9-7Z"/><circle cx="12" cy="12" r="2.5"/></svg>View site
          </a>
          <button className="btn-primary" onClick={handleNewBtn}>New <PlusChip/></button>
        </header>

        {loading && <div className="load-bar"/>}

        {/* ══════════ DASHBOARD ══════════ */}
        {page==="dashboard" && (
          <section className="page active">
            <div className="stat-grid">
              <div className="stat"><div className="k">Total visitors · 30d</div><div className="v">48,210</div><div className="delta">↗ +18.4% vs prev</div></div>
              <div className="stat"><div className="k">Live projects</div><div className="v">{liveProjects||"—"}<span className="it">+</span></div><div className="delta">↗ from {projects.length} total</div></div>
              <div className="stat"><div className="k">Inbox</div><div className="v">{msgs.length||"—"}</div><div className="delta down">{unreadMsgs} unread</div></div>
              <div className="stat"><div className="k">Revenue · MTD</div><div className="v">$184<span style={{fontSize:24}}>k</span></div><div className="delta">↗ +12.1%</div></div>
            </div>
            <div className="row-2">
              <div className="chart">
                <div className="chart-head"><div><h3>Traffic overview</h3><div className="sub" style={{marginTop:4,color:"var(--muted)"}}>Sessions · last 30 days</div></div><div className="tabs"><button>7d</button><button className="on">30d</button><button>90d</button><button>1y</button></div></div>
                <svg className="chart-svg" viewBox="0 0 600 200" preserveAspectRatio="none"><defs><linearGradient id="g1" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#b86cf9" stopOpacity=".35"/><stop offset="100%" stopColor="#b86cf9" stopOpacity="0"/></linearGradient></defs><g stroke="#ececea" strokeWidth="1"><line x1="0" y1="40" x2="600" y2="40"/><line x1="0" y1="80" x2="600" y2="80"/><line x1="0" y1="120" x2="600" y2="120"/><line x1="0" y1="160" x2="600" y2="160"/></g><path d="M0,150 L40,130 L80,140 L120,110 L160,120 L200,90 L240,100 L280,70 L320,85 L360,60 L400,80 L440,45 L480,65 L520,40 L560,55 L600,30 L600,200 L0,200 Z" fill="url(#g1)"/><path d="M0,150 L40,130 L80,140 L120,110 L160,120 L200,90 L240,100 L280,70 L320,85 L360,60 L400,80 L440,45 L480,65 L520,40 L560,55 L600,30" fill="none" stroke="#b86cf9" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round"/></svg>
                <div className="legend"><span><i style={{background:"#b86cf9"}}/>This period · 48,210</span><span><i style={{background:"#0a0a0a"}}/>Previous · 40,720</span></div>
              </div>
              <div className="chart">
                <div className="chart-head"><h3>Traffic by source</h3></div>
                <svg className="chart-svg" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet" style={{height:180}}><circle cx="100" cy="100" r="70" fill="none" stroke="#ececea" strokeWidth="18"/><circle cx="100" cy="100" r="70" fill="none" stroke="#b86cf9" strokeWidth="18" strokeDasharray="180 440" transform="rotate(-90 100 100)"/><circle cx="100" cy="100" r="70" fill="none" stroke="#0a0a0a" strokeWidth="18" strokeDasharray="110 440" strokeDashoffset="-180" transform="rotate(-90 100 100)"/><circle cx="100" cy="100" r="70" fill="none" stroke="#8c3bd9" strokeWidth="18" strokeDasharray="60 440" strokeDashoffset="-290" transform="rotate(-90 100 100)"/><text x="100" y="96" textAnchor="middle" fontFamily="Instrument Serif" fontSize="32" fill="#0a0a0a">48k</text><text x="100" y="116" textAnchor="middle" fontFamily="Geist Mono" fontSize="8" fill="#6b6b6b" letterSpacing="2">VISITS · 30D</text></svg>
                <div className="legend" style={{flexDirection:"column",gap:6}}><span style={{display:"flex",justifyContent:"space-between"}}><span><i style={{background:"#b86cf9"}}/>Organic</span><b>41%</b></span><span style={{display:"flex",justifyContent:"space-between"}}><span><i style={{background:"#0a0a0a"}}/>Direct</span><b>25%</b></span><span style={{display:"flex",justifyContent:"space-between"}}><span><i style={{background:"#8c3bd9"}}/>Referral</span><b>14%</b></span></div>
              </div>
            </div>
            <div className="row-2">
              <div className="card">
                <div className="chart-head" style={{marginBottom:8}}><h3>Recent projects</h3><button className="btn-ghost" style={{padding:"4px 10px",fontSize:11}} onClick={()=>nav("projects")}>View all →</button></div>
                <div className="list">
                  {projects.slice(0,4).map((p,i)=>(
                    <div key={i} className="list-row"><div className={`thumb-mini ${p.color_cls}`}>{p.monogram}</div><div className="body"><div className="t">{p.name}</div><div className="s">{p.industry} · {p.scope}</div></div><span className={`status ${p.status}`}>{p.status}</span><span className="meta">{relTime(p.updated_at)}</span></div>
                  ))}
                </div>
              </div>
              <div className="card">
                <div className="chart-head" style={{marginBottom:8}}><h3>Latest messages</h3><button className="btn-ghost" style={{padding:"4px 10px",fontSize:11}} onClick={()=>nav("messages")}>Inbox →</button></div>
                <div className="list">
                  {msgs.slice(0,4).map((m,i)=>(
                    <div key={i} className="list-row"><div className="av">{m.av||m.sender.slice(0,2).toUpperCase()}</div><div className="body"><div className="t">{m.sender}</div><div className="s">{m.preview}</div></div><span className="meta">{relTime(m.received_at)}</span></div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ══════════ PROJECTS ══════════ */}
        {page==="projects" && (
          <section className="page active">
            <div className="page-head">
              <div><h2>Projects <span className="it">— {projects.length}</span></h2><p>Manage case studies, hero images, scope and status.</p></div>
              <div className="page-actions"><button className="btn-ghost">Export CSV</button><button className="btn-primary" onClick={()=>openModal("new-project")}>New project <PlusChip/></button></div>
            </div>
            <div className="table-wrap">
              <div className="table-tools"><div className="search"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/></svg><input placeholder="Search projects…"/></div><div className="spacer"/><button className="btn-ghost" onClick={()=>loadData("projects")}>Refresh</button></div>
              <table>
                <thead><tr><th>Project</th><th>Industry</th><th>Year</th><th>Scope</th><th>Status</th><th>Updated</th><th/></tr></thead>
                <tbody>
                  {projects.map(p=>(
                    <tr key={p.id}>
                      <td><div className="pair"><div className={`thumb-mini ${p.color_cls}`}>{p.monogram}</div><div><div className="ttl">{p.name}</div><div className="sub">/{p.name.split(" ")[0].toLowerCase()}</div></div></div></td>
                      <td>{p.industry}</td><td>{p.year}</td>
                      <td><span style={{color:"var(--muted)",fontSize:12}}>{p.scope}</span></td>
                      <td><span className={`status ${p.status}`}>{p.status}</span></td>
                      <td><span style={{color:"var(--muted)",fontFamily:"var(--f-mono)",fontSize:11}}>{relTime(p.updated_at)}</span></td>
                      <td><div className="acts">
                        <button className="btn-icon" title="Edit" onClick={()=>openModal("edit-project",{name:p.name,industry:p.industry,year:p.year,scope:p.scope,status:p.status,color_cls:p.color_cls,monogram:p.monogram,tagline:p.tagline||"",overview:p.overview||"",challenge:p.challenge||"",solution:p.solution||"",results:p.results||"",tech_stack:p.tech_stack||"",timeline_duration:p.timeline_duration||"",client_name:p.client_name||"",live_url:p.live_url||"",hero_image:p.hero_image||"",thumbnail:p.thumbnail||"",gallery:p.gallery||"[]",video_url:p.video_url||"",challenge_img1:p.challenge_img1||"",challenge_img2:p.challenge_img2||"",solution_img1:p.solution_img1||"",solution_img2:p.solution_img2||"",split1_label:p.split1_label||"Challenge",split2_label:p.split2_label||"Solution",slug:p.slug||toSlug(p.name),challenge_img1_label:p.challenge_img1_label||"",challenge_img2_label:p.challenge_img2_label||"",solution_img1_label:p.solution_img1_label||"",solution_img2_label:p.solution_img2_label||"",challenge_img1_orient:p.challenge_img1_orient||"portrait",challenge_img2_orient:p.challenge_img2_orient||"portrait",solution_img1_orient:p.solution_img1_orient||"portrait",solution_img2_orient:p.solution_img2_orient||"portrait",client_quote:p.client_quote||"",client_quote_author:p.client_quote_author||"",client_quote_role:p.client_quote_role||"",chapters:p.chapters||"[]"},p.id)}><EditSvg/></button>
                        <button className="btn-icon danger" title="Delete" onClick={()=>deleteProject(p.id)}><TrashSvg/></button>
                      </div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {projects.length===0&&<div style={{padding:32,textAlign:"center",color:"var(--muted)"}}>No projects yet — click New project to add one.</div>}
            </div>
          </section>
        )}

        {/* ══════════ BLOG ══════════ */}
        {page==="blog" && (
          <section className="page active">
            <div className="page-head">
              <div><h2>Journal <span className="it">— {posts.length}</span></h2><p>Essays, deep-dives and case notes.</p></div>
              <div className="page-actions"><button className="btn-primary" onClick={()=>openModal("new-post")}>New post <PlusChip/></button></div>
            </div>
            <div className="table-wrap">
              <div className="table-tools"><div className="search"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/></svg><input placeholder="Search posts…"/></div></div>
              <table>
                <thead><tr><th>Title</th><th>Category</th><th>Author</th><th>Read</th><th>Status</th><th>Date</th><th/></tr></thead>
                <tbody>
                  {posts.map(p=>(
                    <tr key={p.id}>
                      <td><div className="ttl">{p.title}</div></td>
                      <td><span style={{fontFamily:"var(--f-mono)",fontSize:11,letterSpacing:".12em",color:"var(--muted)",textTransform:"uppercase"}}>{p.category}</span></td>
                      <td><div className="pair"><div className="thumb-mini" style={{width:28,height:28,fontSize:11,borderRadius:"50%"}}>{p.author_init}</div>{p.author_name}</div></td>
                      <td>{p.read_time}</td>
                      <td><span className={`status ${p.status}`}>{p.status}</span></td>
                      <td><span style={{color:"var(--muted)",fontFamily:"var(--f-mono)",fontSize:11}}>{fmtDate(p.published_at)}</span></td>
                      <td><div className="acts">
                        <button className="btn-icon" title="Edit" onClick={()=>openModal("edit-post",{title:p.title,category:p.category,author_name:p.author_name,read_time:p.read_time,status:p.status},p.id)}><EditSvg/></button>
                        <button className="btn-icon danger" title="Delete" onClick={()=>deletePost(p.id)}><TrashSvg/></button>
                      </div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {posts.length===0&&<div style={{padding:32,textAlign:"center",color:"var(--muted)"}}>No posts yet.</div>}
            </div>
          </section>
        )}

        {/* ══════════ SERVICES ══════════ */}
        {page==="services" && (
          <section className="page active">
            <div className="page-head">
              <div><h2>Services <span className="it">— {services.length.toString().padStart(2,"0")}</span></h2><p>What we offer, and how the cards present on the site.</p></div>
              <div className="page-actions"><button className="btn-primary" onClick={()=>openModal("new-service")}>New service <PlusChip/></button></div>
            </div>
            <div className="team-grid">
              {services.map((s,i)=>(
                <div key={s.id} className="team-card" style={{padding:0,overflow:"hidden",gap:0}}>
                  {/* Image area */}
                  <div style={{position:"relative",height:140,background:"#111",flexShrink:0,cursor:"pointer"}} onClick={()=>editService(s)}>
                    {s.image
                      ? <img src={s.image} alt={s.name} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
                      : <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",color:"#333",fontSize:12,fontFamily:"var(--f-mono)",letterSpacing:".1em"}}>NO IMAGE · CLICK TO ADD</div>
                    }
                    <button onClick={e=>{e.stopPropagation();editService(s);}} style={{position:"absolute",top:8,right:8,background:"rgba(0,0,0,.6)",border:"none",borderRadius:8,padding:"5px 8px",cursor:"pointer",color:"#fff",display:"flex",alignItems:"center",gap:4,fontSize:11}}>
                      <EditSvg/> Edit
                    </button>
                  </div>
                  {/* Card body */}
                  <div style={{padding:"16px 18px",display:"flex",flexDirection:"column",gap:6,flex:1,background:"#fff"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"start"}}>
                      <div className="av" style={{borderRadius:12,width:40,height:40,fontSize:13}}>{String(i+1).padStart(2,"0")}</div>
                      {s.badge&&<span className="status review">{s.badge}</span>}
                    </div>
                    <div style={{fontFamily:"var(--f-display)",fontSize:20,lineHeight:1.15,marginTop:4}}>{s.name}</div>
                    <div className="bio" style={{fontSize:13,flex:1}}>{s.descr}</div>
                    <div className="adm-foot" style={{justifyContent:"space-between",alignItems:"center",width:"100%",marginTop:4}}>
                      <span style={{fontFamily:"var(--f-mono)",fontSize:11,color:"var(--muted)",letterSpacing:".12em",textTransform:"uppercase"}}>{s.count}</span>
                      <div className={`toggle ${s.visible?"on":""}`} onClick={()=>toggleSvc(s.id,!s.visible)} title={s.visible?"Hide":"Show"}/>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ══════════ TESTIMONIALS ══════════ */}
        {page==="testimonials" && (
          <section className="page active">
            <div className="page-head">
              <div><h2>Testimonials <span className="it">— {testis.length}</span></h2><p>Quotes from clients. Toggle visibility on the site.</p></div>
              <div className="page-actions"><button className="btn-primary" onClick={()=>openModal("new-testimonial")}>New testimonial <PlusChip/></button></div>
            </div>
            <div className="test-grid">
              {testis.map(t=>(
                <div key={t.id} className="test-card">
                  <div className="stars">★★★★★</div>
                  <div className="q">&ldquo;{t.quote}&rdquo;</div>
                  <div className="who"><div className="av">{t.av}</div><div><div className="n">{t.name}</div><div className="r">{t.role}</div></div></div>
                  <div style={{display:"flex",gap:6,marginTop:4}}>
                    <button className="btn-icon" title="Edit" onClick={()=>editTesti(t)}><EditSvg/></button>
                    <button className="btn-icon danger" title="Delete" onClick={()=>deleteTesti(t.id)}><TrashSvg/></button>
                  </div>
                </div>
              ))}
              {testis.length===0&&<div style={{padding:32,color:"var(--muted)"}}>No testimonials yet.</div>}
            </div>
          </section>
        )}

        {/* ══════════ MEDIA ══════════ */}
        {page==="media" && (
          <section className="page active">
            <div className="page-head">
              <div><h2>Media <span className="it">library</span></h2><p>Hero shots, OG images, brand assets.</p></div>
              <div className="page-actions"><button className="btn-ghost">Folders</button><button className="btn-primary" onClick={()=>toast("Upload — coming soon")}>Upload <PlusChip/></button></div>
            </div>
            <div className="media-grid">
              {[{n:"nestaro-hero.jpg",s:"1920×1080 · JPG · 480 KB",bg:"bg1",g:"N"},{n:"pulse-cover.png",s:"1600×900 · PNG · 1.2 MB",bg:"bg2",g:"P"},{n:"marketo-thumb.jpg",s:"1280×720 · JPG · 220 KB",bg:"bg3",g:"M"},{n:"atlas-app-shot.png",s:"1080×1920 · PNG · 880 KB",bg:"bg4",g:"A"},{n:"orbit-bank-hero.jpg",s:"1920×1080 · JPG · 540 KB",bg:"bg5",g:"O"},{n:"hearth-flow.png",s:"1600×900 · PNG · 1.0 MB",bg:"bg6",g:"H"},{n:"lumen-canvas.jpg",s:"1920×1080 · JPG · 480 KB",bg:"bg7",g:"L"},{n:"northwind-dash.png",s:"1600×900 · PNG · 760 KB",bg:"bg8",g:"N"},{n:"studio-team-1.jpg",s:"2400×1600 · JPG · 1.8 MB",bg:"bg1",g:"★"},{n:"logo-mark.svg",s:"Vector · 4 KB",bg:"bg2",g:"◆"},{n:"foxmen-wordmark.svg",s:"Vector · 6 KB",bg:"bg3",g:"F"},{n:"showreel-still.jpg",s:"1920×1080 · JPG · 420 KB",bg:"bg4",g:"▶"}].map((m,i)=>(
                <div key={i} className="media-tile"><div className={`thumb ${m.bg}`}>{m.g}</div><div className="info"><div className="n">{m.n}</div><div className="s">{m.s}</div></div></div>
              ))}
            </div>
          </section>
        )}

        {/* ══════════ ANALYTICS ══════════ */}
        {page==="analytics" && (
          <section className="page active">
            <div className="page-head"><div><h2>Analytics <span className="it">overview</span></h2><p>Real-time and historical metrics.</p></div><div className="page-actions"><button className="btn-ghost">May 2026 ↓</button><button className="btn-ghost">Export</button></div></div>
            <div className="stat-grid">
              <div className="stat"><div className="k">Page views · 30d</div><div className="v">126,840</div><div className="delta">↗ +22.1%</div></div>
              <div className="stat"><div className="k">Avg session</div><div className="v">3:48</div><div className="delta">↗ +14s</div></div>
              <div className="stat"><div className="k">Bounce rate</div><div className="v">32<span className="it">%</span></div><div className="delta down">↘ +1.2pt</div></div>
              <div className="stat"><div className="k">Conv. rate</div><div className="v">4.8<span className="it">%</span></div><div className="delta">↗ +0.6pt</div></div>
            </div>
            <div className="row-2">
              <div className="chart">
                <div className="chart-head"><h3>Page views — 90 days</h3><div className="tabs"><button>Views</button><button className="on">Sessions</button><button>Users</button></div></div>
                <svg className="chart-svg" viewBox="0 0 600 200" preserveAspectRatio="none"><defs><linearGradient id="g2" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#b86cf9" stopOpacity=".4"/><stop offset="100%" stopColor="#b86cf9" stopOpacity="0"/></linearGradient></defs><g stroke="#ececea"><line x1="0" y1="40" x2="600" y2="40"/><line x1="0" y1="100" x2="600" y2="100"/><line x1="0" y1="160" x2="600" y2="160"/></g><path d="M0,160 L30,140 L60,150 L90,120 L120,130 L150,110 L180,90 L210,100 L240,75 L270,90 L300,60 L330,80 L360,55 L390,70 L420,45 L450,60 L480,40 L510,55 L540,30 L570,45 L600,25 L600,200 L0,200 Z" fill="url(#g2)"/><path d="M0,160 L30,140 L60,150 L90,120 L120,130 L150,110 L180,90 L210,100 L240,75 L270,90 L300,60 L330,80 L360,55 L390,70 L420,45 L450,60 L480,40 L510,55 L540,30 L570,45 L600,25" fill="none" stroke="#b86cf9" strokeWidth="2.4" strokeLinejoin="round"/></svg>
              </div>
              <div className="card">
                <h3 style={{fontFamily:"var(--f-sans)",fontSize:15,fontWeight:600,margin:"0 0 16px"}}>Top pages</h3>
                <table style={{width:"100%"}}><tbody style={{fontSize:13}}>{[{p:"/projects/nestaro",v:"18,420"},{p:"/services",v:"12,180"},{p:"/",v:"9,860"},{p:"/blog/ai-features",v:"7,212"},{p:"/projects/pulse",v:"6,402"},{p:"/contact",v:"4,108"}].map((r,i)=><tr key={i}><td style={{padding:"10px 0",borderTop:i>0?"1px solid var(--line)":undefined}}>{r.p}</td><td style={{textAlign:"right",padding:"10px 0",borderTop:i>0?"1px solid var(--line)":undefined}}><b>{r.v}</b></td></tr>)}</tbody></table>
              </div>
            </div>
            <div className="row-3">
              <div className="card"><div className="sub">Devices</div><div style={{fontFamily:"var(--f-display)",fontSize:42,lineHeight:1,marginTop:6}}>68<span className="it" style={{color:"var(--brand)",fontStyle:"italic"}}>%</span></div><div style={{color:"var(--muted)",fontSize:13,marginTop:4}}>Desktop · 32% mobile</div></div>
              <div className="card"><div className="sub">Top country</div><div style={{fontFamily:"var(--f-display)",fontSize:42,lineHeight:1,marginTop:6}}>United States</div><div style={{color:"var(--muted)",fontSize:13,marginTop:4}}>22% · then Germany, UK, India</div></div>
              <div className="card"><div className="sub">Top referrer</div><div style={{fontFamily:"var(--f-display)",fontSize:42,lineHeight:1,marginTop:6}}>awwwards.com</div><div style={{color:"var(--muted)",fontSize:13,marginTop:4}}>5,840 referrals this month</div></div>
            </div>
          </section>
        )}

        {/* ══════════ CLIENTS ══════════ */}
        {page==="clients" && (
          <section className="page active">
            <div className="page-head">
              <div><h2>Clients <span className="it">— {clients.length}</span></h2><p>Active engagements, renewal dates, primary contacts.</p></div>
              <div className="page-actions"><button className="btn-primary" onClick={()=>openModal("new-client")}>Add client <PlusChip/></button></div>
            </div>
            <div className="table-wrap">
              <div className="table-tools"><div className="search"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/></svg><input placeholder="Search clients…"/></div></div>
              <table>
                <thead><tr><th>Client</th><th>Industry</th><th>Country</th><th>Contact</th><th>Engagement</th><th>MRR</th><th/></tr></thead>
                <tbody>
                  {clients.map(c=>(
                    <tr key={c.id}>
                      <td><div className="pair"><div className={`thumb-mini ${c.cls}`}>{c.av}</div><div><div className="ttl">{c.name}</div><div className="sub">/{c.name.toLowerCase()}</div></div></div></td>
                      <td>{c.industry}</td><td>{c.country}</td><td>{c.contact}</td>
                      <td><span className={`status ${engStatus(c.eng)}`}>{c.eng}</span></td>
                      <td><b>{c.mrr}</b></td>
                      <td><div className="acts"><button className="btn-icon danger" title="Remove" onClick={()=>deleteClient(c.id)}><TrashSvg/></button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {clients.length===0&&<div style={{padding:32,textAlign:"center",color:"var(--muted)"}}>No clients yet.</div>}
            </div>
          </section>
        )}

        {/* ══════════ MESSAGES ══════════ */}
        {page==="messages" && (
          <section className="page active">
            <div className="page-head">
              <div><h2>Inbox <span className="it">— {msgs.length}</span></h2><p>Leads from the contact form, press, partnerships, careers.</p></div>
              <div className="page-actions"><button className="btn-ghost" onClick={()=>{msgs.forEach(m=>{if(m.unread)markRead(m.id)});toast("All marked read");}}>Mark all read</button></div>
            </div>
            {msgs.length===0 ? (
              <div className="empty"><h3>Inbox <span style={{fontStyle:"italic",color:"var(--brand)"}}>zero.</span></h3><p>No messages yet. They&apos;ll appear here when someone sends from the contact form.</p></div>
            ) : (
              <div className="inbox">
                <aside className="col-list">
                  <div className="top"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/></svg><input placeholder="Search messages"/></div>
                  <div className="scroll">
                    {msgs.map((m,i)=>(
                      <div key={m.id} className={`thread${m.unread?" unread":""}${activeIdx===i?" on":""}`} onClick={()=>handleThread(i)}>
                        <div className="av">{m.av||m.sender.slice(0,2).toUpperCase()}</div>
                        <div className="body"><div className="row1"><div className="who">{m.sender}</div><div className="dt">{relTime(m.received_at)}</div></div><div className="sub">{m.subject}</div><div className="preview">{m.preview}</div></div>
                      </div>
                    ))}
                  </div>
                </aside>
                {activeMsg && (
                  <section className="col-msg">
                    <div className="msg-head">
                      <div className="av">{activeMsg.av||activeMsg.sender.slice(0,2).toUpperCase()}</div>
                      <div className="who"><h3>{activeMsg.sender}</h3><div className="em">{activeMsg.sender.toLowerCase().replace(/\s+/g,".")}@client.co</div></div>
                      <div className="spacer"/>
                      <button className="btn-icon" title="Delete" onClick={()=>deleteMsg(activeMsg.id)}><TrashSvg/></button>
                    </div>
                    <div className="msg-body">
                      <h2>{activeMsg.subject}</h2>
                      {(activeMsg.body||activeMsg.preview).split("\n").map((line,i)=><p key={i}>{line||<br/>}</p>)}
                    </div>
                    {(activeMsg.source||activeMsg.interested||activeMsg.budget||activeMsg.country) && (
                      <div className="msg-meta">
                        {activeMsg.source&&<div className="pair"><span className="k">Source</span><span>{activeMsg.source}</span></div>}
                        {activeMsg.interested&&<div className="pair"><span className="k">Interested in</span><span>{activeMsg.interested}</span></div>}
                        {activeMsg.budget&&<div className="pair"><span className="k">Budget</span><span>{activeMsg.budget}</span></div>}
                        {activeMsg.country&&<div className="pair"><span className="k">Country</span><span>{activeMsg.country}</span></div>}
                      </div>
                    )}
                    <div className="msg-foot">
                      <button className="btn-primary" onClick={()=>toast("Reply — email client integration coming soon")}>Reply <ArrowChip/></button>
                      <button className="btn-ghost" onClick={()=>{ openModal("new-client",{name:activeMsg.sender,contact:activeMsg.sender}); }}>Convert to client</button>
                    </div>
                  </section>
                )}
              </div>
            )}
          </section>
        )}

        {/* ══════════ LEADS ══════════ */}
        {page==="leads" && (()=>{
          const leads = msgs.filter(m=>m.source==="estimator");
          const parseLead = (m:Message)=>{ try{ return JSON.parse(m.body); }catch{ return null; } };
          return (
          <section className="page active">
            <div className="page-head">
              <div><h2>Estimator <span className="it">Leads</span></h2><p>{leads.length} lead{leads.length!==1?"s":""} from the AI Project Estimator — ready to follow up.</p></div>
              <div className="page-actions"><button className="btn-ghost" onClick={()=>loadData("leads")}>Refresh</button></div>
            </div>
            {leads.length===0 ? (
              <div className="empty"><h3>No leads <span style={{fontStyle:"italic",color:"var(--brand)"}}>yet.</span></h3><p>When someone uses the Project Estimator, their request shows up here.</p></div>
            ) : (
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))",gap:16}}>
                {leads.map(m=>{
                  const d = parseLead(m);
                  const est = d?.estimate ?? {};
                  const priceMin = est.price_min ? `$${Number(est.price_min).toLocaleString()}` : "";
                  const priceMax = est.price_max ? `$${Number(est.price_max).toLocaleString()}` : "";
                  return (
                    <div key={m.id} style={{background:"#fff",border:`1px solid ${m.unread?"var(--brand)":"var(--line)"}`,borderRadius:"var(--r)",overflow:"hidden",transition:"border-color .25s"}}>
                      {/* Card header */}
                      <div style={{padding:"16px 20px",borderBottom:"1px solid var(--line)",display:"flex",alignItems:"center",gap:12}}>
                        <div className="av" style={{width:40,height:40,borderRadius:"50%",background:"var(--brand-soft)",color:"var(--brand-deep)",display:"grid",placeItems:"center",fontWeight:600,fontSize:14,flexShrink:0}}>{m.av||m.sender.slice(0,2).toUpperCase()}</div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontWeight:600,fontSize:14,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.sender}</div>
                          <div style={{fontSize:11,color:"var(--muted)",fontFamily:"var(--f-mono)",letterSpacing:".1em"}}>{relTime(m.received_at)}</div>
                        </div>
                        {m.unread&&<span style={{background:"var(--brand)",color:"#fff",fontSize:10,fontFamily:"var(--f-mono)",letterSpacing:".1em",padding:"3px 8px",borderRadius:999}}>NEW</span>}
                      </div>
                      {/* Price */}
                      {priceMin&&<div style={{padding:"18px 20px 0",display:"flex",alignItems:"baseline",gap:6}}>
                        <span style={{fontFamily:"var(--f-display)",fontSize:36,fontWeight:400,lineHeight:1,letterSpacing:"-.02em"}}>{priceMin}</span>
                        <span style={{color:"var(--muted)",fontSize:18}}>– {priceMax}</span>
                      </div>}
                      {/* Tags */}
                      <div style={{padding:"12px 20px",display:"flex",gap:6,flexWrap:"wrap"}}>
                        {d?.type&&<span style={{background:"var(--brand-soft)",color:"var(--brand-deep)",fontSize:11,fontWeight:600,padding:"4px 10px",borderRadius:999}}>{d.type}</span>}
                        {d?.complexity&&<span style={{background:"var(--canvas)",color:"var(--muted)",fontSize:11,padding:"4px 10px",borderRadius:999}}>{d.complexity} complexity</span>}
                        {d?.timeline&&<span style={{background:"var(--canvas)",color:"var(--muted)",fontSize:11,padding:"4px 10px",borderRadius:999}}>{d.timeline}</span>}
                        {est.delivery&&<span style={{background:"var(--canvas)",color:"var(--muted)",fontSize:11,padding:"4px 10px",borderRadius:999}}>⏱ {est.delivery}</span>}
                      </div>
                      {/* Summary */}
                      {est.summary&&<div style={{padding:"0 20px 14px",fontSize:13,color:"#444",lineHeight:1.55}}>{est.summary}</div>}
                      {/* Stack */}
                      {est.recommended_stack&&<div style={{padding:"0 20px 16px",fontSize:11,fontFamily:"var(--f-mono)",color:"var(--muted)",letterSpacing:".1em"}}>{est.recommended_stack}</div>}
                      {/* Actions */}
                      <div style={{padding:"12px 20px",borderTop:"1px solid var(--line)",display:"flex",gap:8,background:"var(--canvas)"}}>
                        <button className="btn-primary" style={{flex:1,justifyContent:"center"}} onClick={()=>{ openModal("new-client",{name:m.sender,contact:m.sender,industry:d?.type||"",mrr:m.budget||""}); }}>Convert to client <ArrowChip/></button>
                        <button className="btn-ghost" onClick={()=>{ if(m.unread) markRead(m.id); }} style={{opacity:m.unread?1:.4,cursor:m.unread?"pointer":"default"}}>Mark read</button>
                        <button className="btn-icon danger" title="Delete" onClick={()=>deleteMsg(m.id)}><TrashSvg/></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
          );
        })()}

        {/* ══════════ TEAM ══════════ */}
        {page==="team" && (
          <section className="page active">
            <div className="page-head">
              <div><h2>Team <span className="it">— {team.length}</span></h2><p>The studio. Roles, locations, permissions.</p></div>
              <div className="page-actions"><button className="btn-primary" onClick={()=>openModal("new-team")}>Invite member <PlusChip/></button></div>
            </div>
            <div className="team-grid">
              {team.map(m=>(
                <div key={m.id} className="team-card">
                  <div className="av">{m.av}</div>
                  <div><div className="n">{m.name}</div><div className="r">{m.role}</div></div>
                  <div className="bio">{m.bio}</div>
                  <div className="adm-foot">
                    <button className="btn-icon" title="Message"><MsgSvg/></button>
                    <button className="btn-icon danger" title="Remove" onClick={()=>deleteMember(m.id)}><TrashSvg/></button>
                  </div>
                </div>
              ))}
              {team.length===0&&<div style={{padding:32,color:"var(--muted)"}}>No team members yet.</div>}
            </div>
          </section>
        )}

        {/* ══════════ PROPOSALS ══════════ */}
        {page==="proposals" && (()=>{
          const SERVICES=["Website (React / Next.js)","Mobile App (React Native)","Mobile App (Flutter)","E-commerce (Custom)","E-commerce (Shopify Plus)","AI Tool / Copilot","AI Agent / RAG System","Branding & Design System","Full-stack SaaS Platform"];

          const generate=async()=>{
            if(!propClient||!propService||!propScope||!propTimeline||!propBudget){toast("Fill all required fields");return;}
            setPropGenerating(true);
            try{
              const r=await fetch("/api/proposal",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({client:propClient,company:propCompany,service:propService,scope:propScope,timeline:propTimeline,budget:propBudget})});
              const d=await r.json();
              if(d.error){toast("AI generation failed. Try again.");}else{setPropData(d);}
            }catch{toast("Generation failed. Try again.");}
            setPropGenerating(false);
          };

          const download=()=>{
            if(!propData)return;
            openPdf(proposalPdfHtml(propClient,propCompany,propService,propTimeline,propBudget,propData));
          };

          const today=new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});

          return(
          <section className="page active">
            <div className="page-head">
              <div><h2>AI Proposal Generator</h2><p style={{fontSize:13,color:"var(--muted)",marginTop:4}}>Fill 5 fields → full branded proposal in 20 seconds. Ready to send or download as PDF.</p></div>
            </div>
            <div className="gen-layout">
              {/* FORM */}
              <div className="gen-form">
                <div><div className="gen-form-title">Proposal details</div><div className="gen-form-sub">AI writes the full proposal — you just fill the brief.</div></div>
                <div className="field-row">
                  <Field label="Client name *" value={propClient} onChange={setPropClient} placeholder="Ahmed Hassan"/>
                  <Field label="Company" value={propCompany} onChange={setPropCompany} placeholder="Hassan Co."/>
                </div>
                <FieldSel label="Service *" value={propService} onChange={setPropService} options={SERVICES}/>
                <FieldArea label="Project scope / brief *" value={propScope} onChange={setPropScope} placeholder="Paste the client brief or describe the project in detail…"/>
                <div className="field-row">
                  <Field label="Timeline *" value={propTimeline} onChange={setPropTimeline} placeholder="8 weeks"/>
                  <Field label="Investment *" value={propBudget} onChange={setPropBudget} placeholder="$7,500"/>
                </div>
                <button className="btn-generate" onClick={generate} disabled={propGenerating}>
                  {propGenerating
                    ?<><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{animation:"spin 1s linear infinite"}}><path d="M21 12a9 9 0 1 1-6.2-8.6"/></svg>Generating…</>
                    :<><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 1 0 10 10M18 2l4 4-4 4"/></svg>Generate with AI</>
                  }
                </button>
              </div>

              {/* PREVIEW */}
              <div className="gen-preview">
                <div className="gen-preview-head">
                  <span style={{fontSize:13,fontWeight:600}}>Proposal preview</span>
                  {propData&&<div style={{display:"flex",gap:8}}>
                    <button className="btn-ghost" onClick={download} style={{display:"flex",alignItems:"center",gap:6}}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>Download PDF
                    </button>
                  </div>}
                </div>
                <div className="gen-preview-body">
                  {!propData
                    ?<div className="gen-empty">
                        <div className="ico"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg></div>
                        <h4>Nothing generated yet</h4>
                        <p>Fill the form and click Generate with AI.</p>
                      </div>
                    :<>
                      <div className="prop-cover">
                        <div className="tag">Project Proposal · {today}</div>
                        <div className="headline">Prepared for {propClient}{propCompany&&` · ${propCompany}`}</div>
                        <div className="sub">{propService} · {propTimeline} · {propBudget}</div>
                      </div>
                      <div className="prop-section"><div className="prop-label">Executive Summary</div><p>{propData.executive_summary}</p></div>
                      <div className="prop-section"><div className="prop-label">Scope of Work</div><ul className="prop-list">{(propData.scope_items||[]).map((s,i)=><li key={i}>{s}</li>)}</ul></div>
                      <div className="prop-section"><div className="prop-label">Deliverables</div><ul className="prop-list">{(propData.deliverables||[]).map((s,i)=><li key={i}>{s}</li>)}</ul></div>
                      <div className="prop-section">
                        <div className="prop-label">Timeline</div>
                        {(propData.timeline||[]).map((t,i)=>(
                          <div key={i} className="prop-tl-row">
                            <div className="prop-tl-period">{t.period}</div>
                            <div className="prop-tl-content"><h4>{t.milestone}</h4><p>{t.desc}</p></div>
                          </div>
                        ))}
                      </div>
                      <div className="prop-section">
                        <div className="prop-label">Investment</div>
                        <div className="prop-invest-box"><div className="amount">{propBudget}</div><div className="note">{propData.investment_note}</div></div>
                      </div>
                      <div className="prop-section"><div className="prop-label">Terms</div><p>{propData.terms}</p></div>
                    </>
                  }
                </div>
              </div>
            </div>
          </section>
          );
        })()}

        {/* ══════════ INVOICES ══════════ */}
        {page==="invoices" && (()=>{
          const fmtM=(n:number)=>"$"+Number(n).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
          const fmtD=(d:string)=>d?new Date(d+"T00:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}):"—";

          const addItem=()=>setInvItems(p=>[...p,{service:"",description:"",quantity:1,unit:"hrs",rate:0}]);
          const removeItem=(i:number)=>setInvItems(p=>p.filter((_,idx)=>idx!==i));
          const updateItem=(i:number,f:keyof InvoiceItem,v:string)=>setInvItems(p=>p.map((it,idx)=>idx===i?{...it,[f]:f==="service"||f==="description"||f==="unit"?v:(parseFloat(v)||0)}:it));

          const PAY_LABELS:Record<string,string>={wise:"Wise — contact@foxmenstudio.com",paypal:"PayPal — payments@foxmenstudio.com",bank:"Bank Transfer — IBAN on request",crypto:"USDT / USDC — Wallet on request"};

          const subtotal=invItems.reduce((s,it)=>s+(it.quantity*it.rate),0);
          const taxAmt=subtotal*(invTaxRate/100);
          const total=subtotal+taxAmt-invDiscount;
          const STATUS_MAP={draft:{label:"Draft",color:"#6b7280",bg:"#f9fafb"},sent:{label:"Sent",color:"#1d4ed8",bg:"#eff6ff"},paid:{label:"Paid",color:"#15803d",bg:"#f0fdf4"},overdue:{label:"Overdue",color:"#b91c1c",bg:"#fef2f2"}};
          const stBadge=STATUS_MAP[invStatus];
          const download=()=>openPdf(invoicePdfHtml({status:invStatus,client:invClient,company:invCompany,email:invEmail,phone:invPhone,num:invNum,date:invDate,due:invDue,projectName:invProjectName,projectType:invProjectType,timeline:invTimeline,items:invItems,taxRate:invTaxRate,discount:invDiscount,payment:invPayment,notes:invNotes}));

          const send=async()=>{
            if(!invEmail){toast("Enter client email first");return;}
            setInvSending(true);
            try{
              const r=await fetch("/api/invoice",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({status:invStatus,client:invClient,company:invCompany,email:invEmail,phone:invPhone,num:invNum,date:invDate,due:invDue,projectName:invProjectName,projectType:invProjectType,timeline:invTimeline,items:invItems,taxRate:invTaxRate,discount:invDiscount,payment:invPayment,notes:invNotes,total})});
              if(r.ok){toast("Invoice sent to "+invEmail);}else{toast("Send failed — check RESEND_API_KEY");}
            }catch{toast("Send failed. Try again.");}
            setInvSending(false);
          };

          return(
          <section className="page active">
            <div className="page-head">
              <div><h2>Invoice Generator</h2><p style={{fontSize:13,color:"var(--muted)",marginTop:4}}>Professional branded invoices. Download PDF or send directly to client.</p></div>
            </div>
            <div className="gen-layout">
              {/* FORM */}
              <div className="gen-form">
                <div className="gen-form-title">Invoice details</div>

                {/* Status + Invoice # */}
                <div className="field-row">
                  <div className="field">
                    <label>Status</label>
                    <select value={invStatus} onChange={e=>setInvStatus(e.target.value as "draft"|"sent"|"paid"|"overdue")} style={{background:"var(--canvas)",border:"1px solid var(--line)",borderRadius:"var(--r-sm)",padding:"10px 12px",fontSize:14,width:"100%",fontFamily:"var(--f-sans)",color:"var(--ink)"}}>
                      <option value="draft">Draft</option>
                      <option value="sent">Sent</option>
                      <option value="paid">Paid</option>
                      <option value="overdue">Overdue</option>
                    </select>
                  </div>
                  <Field label="Invoice #" value={invNum} onChange={setInvNum} placeholder="INV-001"/>
                </div>

                {/* Dates */}
                <div className="field-row">
                  <Field label="Issue date" value={invDate} onChange={setInvDate} type="date"/>
                  <Field label="Due date" value={invDue} onChange={setInvDue} type="date"/>
                </div>

                {/* Client */}
                <div className="field-row">
                  <Field label="Client name" value={invClient} onChange={setInvClient} placeholder="Ahmed Hassan"/>
                  <Field label="Company" value={invCompany} onChange={setInvCompany} placeholder="Hassan Co."/>
                </div>
                <div className="field-row">
                  <Field label="Client email" value={invEmail} onChange={setInvEmail} placeholder="ahmed@co.com" type="email"/>
                  <Field label="Phone" value={invPhone} onChange={setInvPhone} placeholder="+1 234 567 8900"/>
                </div>

                {/* Project */}
                <div className="field-row">
                  <Field label="Project name" value={invProjectName} onChange={setInvProjectName} placeholder="E-commerce Rebuild"/>
                  <Field label="Project type" value={invProjectType} onChange={setInvProjectType} placeholder="Web App + AI Integration"/>
                </div>
                <Field label="Timeline" value={invTimeline} onChange={setInvTimeline} placeholder="8 weeks · Mar–Apr 2025"/>

                {/* AI fill */}
                <div className="inv-ai-box">
                  <div className="inv-ai-label">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                    AI Auto-fill
                  </div>
                  <textarea
                    className="inv-ai-textarea"
                    value={invAiPrompt}
                    onChange={e=>setInvAiPrompt(e.target.value)}
                    placeholder="Describe the work — e.g. &quot;Built a full e-commerce site with custom checkout, 3 months work, total budget $18,000. Also did brand identity and logo design.&quot;"
                  />
                  <button
                    className="inv-ai-btn"
                    disabled={invAiLoading||!invAiPrompt.trim()}
                    onClick={async()=>{
                      setInvAiLoading(true);
                      try{
                        const r=await fetch("/api/invoice-ai",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({description:invAiPrompt})});
                        const d=await r.json();
                        if(d.items?.length){
                          setInvItems(d.items.map((it:InvoiceItem)=>({service:it.service||"",description:it.description||"",quantity:Number(it.quantity)||1,unit:it.unit||"flat",rate:Number(it.rate)||0})));
                          if(d.notes) setInvNotes(d.notes);
                          toast("Invoice items filled by AI");
                        }else{ toast("AI returned no items — try rephrasing"); }
                      }catch{ toast("AI fill failed. Try again."); }
                      setInvAiLoading(false);
                    }}
                  >
                    {invAiLoading
                      ?<><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{animation:"spin 1s linear infinite"}}><path d="M21 12a9 9 0 1 1-6.2-8.6"/></svg>Generating…</>
                      :<><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>Fill Invoice with AI</>
                    }
                  </button>
                </div>

                {/* Line items */}
                <div className="field">
                  <label>Services</label>
                  <div style={{marginTop:8}}>
                    <div className="inv-items-wrap">
                      {invItems.map((it,i)=>(
                        <div key={i} className="inv-item-card">
                          <div className="inv-item-top">
                            <input value={it.service} onChange={e=>updateItem(i,"service",e.target.value)} placeholder="Service name"/>
                            <input value={it.description} onChange={e=>updateItem(i,"description",e.target.value)} placeholder="Brief description…"/>
                          </div>
                          <div className="inv-item-bottom">
                            <input type="number" min={0} value={it.quantity||""} onChange={e=>updateItem(i,"quantity",e.target.value)} placeholder="Qty" style={{textAlign:"center"}}/>
                            <select value={it.unit} onChange={e=>updateItem(i,"unit",e.target.value)}>
                              <option value="hrs">hrs</option>
                              <option value="days">days</option>
                              <option value="flat">flat</option>
                            </select>
                            <input type="number" min={0} value={it.rate||""} onChange={e=>updateItem(i,"rate",e.target.value)} placeholder="Rate $"/>
                            <span className="inv-item-amount">
                              {fmtM(it.quantity*it.rate)}
                              {invItems.length>1&&<button className="inv-remove-btn" onClick={()=>removeItem(i)}>×</button>}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="btn-ghost" style={{marginTop:8,width:"100%",justifyContent:"center",display:"flex"}} onClick={addItem}>+ Add service</button>
                  </div>
                </div>

                {/* Tax & Discount */}
                <div className="field-row">
                  <div className="field"><label>VAT / Tax (%)</label><input type="number" min={0} max={100} value={invTaxRate} onChange={e=>setInvTaxRate(parseFloat(e.target.value)||0)} style={{background:"var(--canvas)",border:"1px solid var(--line)",borderRadius:"var(--r-sm)",padding:"10px 12px",fontSize:14,width:"100%",fontFamily:"var(--f-sans)",color:"var(--ink)"}}/></div>
                  <div className="field"><label>Discount ($)</label><input type="number" min={0} value={invDiscount} onChange={e=>setInvDiscount(parseFloat(e.target.value)||0)} style={{background:"var(--canvas)",border:"1px solid var(--line)",borderRadius:"var(--r-sm)",padding:"10px 12px",fontSize:14,width:"100%",fontFamily:"var(--f-sans)",color:"var(--ink)"}}/></div>
                </div>

                {/* Payment method */}
                <div className="field">
                  <label>Payment method</label>
                  <select value={invPayment} onChange={e=>setInvPayment(e.target.value)} style={{background:"var(--canvas)",border:"1px solid var(--line)",borderRadius:"var(--r-sm)",padding:"10px 12px",fontSize:14,width:"100%",fontFamily:"var(--f-sans)",color:"var(--ink)"}}>
                    <option value="wise">Wise — contact@foxmenstudio.com</option>
                    <option value="paypal">PayPal — payments@foxmenstudio.com</option>
                    <option value="bank">Bank Transfer — IBAN on request</option>
                    <option value="crypto">USDT / USDC — Wallet on request</option>
                  </select>
                </div>

                <FieldArea label="Project notes" value={invNotes} onChange={setInvNotes} placeholder="Payment due within 14 days…"/>

                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,paddingTop:8}}>
                  <button onClick={download} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:9,padding:"15px 20px",borderRadius:999,background:"#0a0a0a",color:"#fff",border:"none",font:"600 14px/1 var(--f-sans)",cursor:"pointer",boxShadow:"3px 3px 0 rgba(0,0,0,.3)",transition:"transform .2s,box-shadow .2s",letterSpacing:".01em"}}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                    Download PDF
                  </button>
                  <button onClick={send} disabled={invSending} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:9,padding:"15px 20px",borderRadius:999,background:"linear-gradient(135deg,#b86cf9,#8c3bd9)",color:"#fff",border:"none",font:"600 14px/1 var(--f-sans)",cursor:"pointer",boxShadow:"0 4px 20px rgba(140,59,217,.45)",transition:"transform .2s,box-shadow .2s",letterSpacing:".01em",opacity:invSending?.6:1}}>
                    {invSending
                      ?<><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{animation:"spin 1s linear infinite"}}><path d="M21 12a9 9 0 1 1-6.2-8.6"/></svg>Sending…</>
                      :<><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>Send Invoice</>
                    }
                  </button>
                </div>
              </div>

              {/* LIVE PREVIEW */}
              <div className="gen-preview" style={{padding:0}}>
                <div className="gen-preview-head">
                  <span style={{fontSize:13,fontWeight:600}}>Live preview</span>
                  <span style={{fontSize:12,color:"var(--muted)"}}>Updates as you type</span>
                </div>
                <div className="gen-preview-body">
                  <div className="inv-doc">
                    {/* Dark header */}
                    <div className="inv-hd">
                      {/* Top row: brand + invoice meta */}
                      <div className="inv-hd-top">
                        <div className="inv-hd-left">
                          <div className="inv-hd-brand">
                            <div className="inv-hd-brand-main">
                              <img src="/assets/logo-mark.svg" alt=""/>
                              <div>
                                <div className="inv-hd-name">Foxmen <em>Studio</em></div>
                                <div className="inv-hd-tagline">Code · Craft · Care</div>
                              </div>
                            </div>
                            <div className="inv-hd-tagline2">Est. 2019 · AI-Powered Studio</div>
                            <div className="inv-hd-para">We architect AI-integrated digital products that define the next era of business.<br/>Precision-engineered software and elevated design — built to give your brand an unfair advantage.</div>
                          </div>
                        </div>
                        <div className="inv-hd-right">
                          <div className="inv-hd-label">Invoice</div>
                          <div className="inv-hd-num">{invNum||"INV-001"}</div>
                          <div className="inv-hd-dates">
                            <div>Issued: <strong>{fmtD(invDate)}</strong></div>
                            {invDue&&<div>Due: <strong>{fmtD(invDue)}</strong></div>}
                          </div>
                        </div>
                      </div>
                      {/* Horizontal rule with accent */}
                      <div className="inv-hd-rule"/>
                      {/* Bottom row: contact + status */}
                      <div className="inv-hd-bottom">
                        <div className="inv-hd-contact">
                          <strong>contact@foxmenstudio.com</strong> · foxmen.studio
                        </div>
                        <div className="inv-status" style={{background:stBadge.bg,color:stBadge.color}}>
                          <span className="sdot" style={{background:stBadge.color}}/>
                          {stBadge.label}
                        </div>
                      </div>
                    </div>
                    {/* Accent line */}
                    <div className="inv-accent-line"/>
                    {/* Three-col info */}
                    <div className="inv-info-grid">
                      <div className="inv-info-col">
                        <span className="inv-info-label">Bill To</span>
                        <div className="inv-info-name">{invClient||<span style={{color:"#ccc"}}>Client name</span>}</div>
                        <div className="inv-info-detail">
                          {invCompany&&<>{invCompany}<br/></>}
                          {invEmail&&<>{invEmail}<br/></>}
                          {invPhone||""}
                        </div>
                      </div>
                      <div className="inv-info-col">
                        <span className="inv-info-label">Project</span>
                        <div className="inv-info-name">{invProjectName||<span style={{color:"#ccc"}}>Project name</span>}</div>
                        <div className="inv-info-detail">
                          {invProjectType&&<>{invProjectType}<br/></>}
                          {invTimeline||""}
                        </div>
                      </div>
                      <div className="inv-info-col">
                        <span className="inv-info-label">Payment Terms</span>
                        <div className="inv-info-name">{invDue?fmtD(invDue):"Net 14"}</div>
                        <div className="inv-info-detail">
                          {(()=>{const[n,d]=(PAY_LABELS[invPayment]??"").split("—").map(s=>s.trim());return<>{n}<br/>{d}</>})()}
                        </div>
                      </div>
                    </div>
                    {/* Services table */}
                    <div className="inv-table-wrap">
                      <table className="inv-svc-table">
                        <thead><tr>
                          <th className="col-svc">Service</th>
                          <th className="col-desc">Description</th>
                          <th className="col-qty">Hrs / Units</th>
                          <th className="col-rate">Rate</th>
                          <th className="col-total">Total</th>
                        </tr></thead>
                        <tbody>
                          {invItems.filter(it=>it.service||it.rate).map((it,i)=>(
                            <tr key={i}>
                              <td className="td-svc">
                                <div className="svc-name">{it.service||"—"}</div>
                                {it.description&&<div className="svc-desc">{it.description}</div>}
                              </td>
                              <td><div className="svc-desc">{it.description||""}</div></td>
                              <td><div className="svc-qty">{it.quantity} {it.unit}</div></td>
                              <td><div className="svc-rate">{fmtM(it.rate)}/{it.unit}</div></td>
                              <td><div className="svc-total">{fmtM(it.quantity*it.rate)}</div></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {/* Totals */}
                    <div className="inv-totals-wrap">
                      <div className="inv-totals-inner">
                        <div className="inv-totals-row"><span>Subtotal</span><span>{fmtM(subtotal)}</span></div>
                        {invTaxRate>0&&<div className="inv-totals-row"><span>VAT {invTaxRate}%</span><span>{fmtM(taxAmt)}</span></div>}
                        {invDiscount>0&&<div className="inv-totals-row is-discount"><span>Discount</span><span>−{fmtM(invDiscount)}</span></div>}
                        <hr className="inv-totals-hr"/>
                        <div className="inv-totals-final">
                          <span className="tot-label">Total Due</span>
                          <span className="tot-amount">{fmtM(total)}</span>
                        </div>
                      </div>
                    </div>
                    {/* Notes */}
                    {invNotes&&(
                      <div className="inv-notes">
                        <span className="inv-notes-label">Project Notes</span>
                        <div className="inv-notes-text">{invNotes}</div>
                      </div>
                    )}
                    {/* Footer */}
                    <div className="inv-doc-footer">
                      <div>
                        <div className="ft-logo-row">
                          <img src="/assets/logo-mark.svg" alt=""/>
                          <div className="ft-brand">Foxmen <em>Studio</em></div>
                        </div>
                        <div className="ft-sub">Code · Craft · Care · Est. 2019</div>
                      </div>
                      <div className="ft-mid"><strong>contact@foxmenstudio.com</strong><br/>foxmen.studio</div>
                      <div className="ft-right">Payment due within 14 days of issue.<br/>Late payments subject to 2% monthly interest.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          );
        })()}

        {/* ══════════ EMAIL CAMPAIGN ══════════ */}
        {page==="email" && (()=>{
          const BRAND = "#B86CF9";

          /* client-side parser — mirrors the API route */
          function applyInline(t:string):string {
            return t
              .replace(/\*\*(.+?)\*\*/g,'<strong style="font-weight:700;color:#0a0a0a;">$1</strong>')
              .replace(/\*(.+?)\*/g,'<em style="font-style:italic;">$1</em>');
          }

          function parseContent(raw:string):string {
            const lines=raw.split(/\r?\n/);
            const out:string[]=[];
            let i=0;
            while(i<lines.length){
              const line=lines[i].trimEnd();
              if(!line.trim()){i++;continue;}
              if(line.startsWith("## ")){
                out.push(`<h2 style="font-size:18px;font-weight:700;color:#0a0a0a;margin:28px 0 10px;letter-spacing:-.01em;">${line.slice(3)}</h2>`);
              } else if(line.startsWith("### ")){
                out.push(`<h3 style="font-size:15px;font-weight:700;color:#0a0a0a;margin:22px 0 8px;">${line.slice(4)}</h3>`);
              } else if(line.trim()==="---"){
                out.push(`<div style="height:1px;background:#f0ede8;margin:24px 0;"></div>`);
              } else if(line.startsWith("> ")){
                out.push(`<blockquote style="margin:18px 0;padding:12px 18px;background:#faf8ff;border-left:3px solid ${BRAND};font-size:14px;color:#4b4b4b;line-height:1.7;font-style:italic;">${line.slice(2)}</blockquote>`);
              } else if(/^[-•*]\s/.test(line)){
                const items:string[]=[];
                while(i<lines.length&&/^[-•*]\s/.test(lines[i])){
                  items.push(`<li style="padding:3px 0;font-size:14px;color:#4b4b4b;line-height:1.7;">${applyInline(lines[i].replace(/^[-•*]\s/,""))}</li>`);
                  i++;
                }
                out.push(`<ul style="margin:10px 0 14px;padding-left:22px;">${items.join("")}</ul>`);
                continue;
              } else if(/^\[(.+)\]\((https?:\/\/[^)]+)\)$/.test(line.trim())){
                const m=line.trim().match(/^\[(.+)\]\((https?:\/\/[^)]+)\)$/);
                if(m) out.push(`<div style="text-align:center;margin:28px 0;"><a href="${m[2]}" style="display:inline-block;background:${BRAND};color:#fff;text-decoration:none;font-size:14px;font-weight:600;padding:13px 36px;border-radius:8px;">${m[1]}</a></div>`);
              } else if(/^https?:\/\/\S+$/.test(line.trim())){
                out.push(`<div style="text-align:center;margin:28px 0;"><a href="${line.trim()}" style="display:inline-block;background:${BRAND};color:#fff;text-decoration:none;font-size:14px;font-weight:600;padding:13px 36px;border-radius:8px;">View now →</a></div>`);
              } else {
                out.push(`<p style="margin:0 0 14px;font-size:15px;line-height:1.8;color:#4b4b4b;">${applyInline(line)}</p>`);
              }
              i++;
            }
            return out.join("\n");
          }

          function buildPreviewHtml():string {
            const yr=new Date().getFullYear();
            const body=emailRawContent
              ? parseContent(emailRawContent)
              : `<p style="color:#d0cdc8;font-size:15px;line-height:1.8;font-style:italic;">Start typing your email content on the left to see a live preview here…</p>`;
            return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet"/><style>*{box-sizing:border-box;}body{margin:0;padding:28px 12px;background:#f1efe9;font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;}</style></head><body>
<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 8px 48px rgba(0,0,0,.12);">

<!-- HEADER -->
<tr><td style="background:#0a0a0a;padding:34px 44px 26px;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
    <td style="vertical-align:middle;width:50px;padding-right:15px;">
      <img src="https://res.cloudinary.com/djofqa3vc/image/upload/v1778967518/logo_sn_fox_copy_e9sigm.png" height="44" width="44" style="display:block;"/>
    </td>
    <td style="vertical-align:middle;">
      <div style="font-family:'Instrument Serif',Georgia,'Times New Roman',serif;font-size:24px;font-weight:400;color:#fff;letter-spacing:-.02em;line-height:1.1;">Foxmen <em style="font-style:italic;color:${BRAND};">Studio</em></div>
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
<tr><td style="height:3px;background:linear-gradient(90deg,${BRAND},#6d28d9);font-size:0;">&nbsp;</td></tr>

<!-- BODY -->
<tr><td style="padding:44px 44px 36px;">
  ${body}
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:36px;padding-top:24px;border-top:1px solid #f0ede8;"><tr>
    <td style="vertical-align:bottom;">
      <p style="margin:0 0 3px;font-size:12px;color:#b8b5b0;letter-spacing:.01em;">Warm regards,</p>
      <p style="margin:0 0 4px;font-family:'Instrument Serif',Georgia,serif;font-size:20px;font-weight:400;color:#0a0a0a;font-style:italic;">The Foxmen Team</p>
      <p style="margin:0;font-size:11px;color:#c8c5c0;">foxmen.studio · contact@foxmenstudio.com</p>
    </td>
    <td style="text-align:right;vertical-align:bottom;width:44px;">
      <img src="https://res.cloudinary.com/djofqa3vc/image/upload/v1778967518/logo_sn_fox_copy_e9sigm.png" height="28" width="28" style="display:block;margin-left:auto;opacity:.15;"/>
    </td>
  </tr></table>
</td></tr>

<!-- FOOTER -->
<tr><td style="background:#0a0a0a;">
  <div style="height:2px;background:linear-gradient(90deg,${BRAND},#6d28d9);"></div>
  <div style="padding:20px 44px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td>
        <div style="font-family:'Instrument Serif',Georgia,serif;font-size:14px;color:rgba(255,255,255,.6);font-style:italic;">Foxmen Studio</div>
        <p style="margin:4px 0 0;font-size:10px;color:rgba(255,255,255,.42);line-height:1.8;">
          <a href="https://foxmen.studio" style="color:rgba(255,255,255,.6);text-decoration:none;">foxmen.studio</a> · contact@foxmenstudio.com<br/>
          © ${yr} Foxmen Studio. All rights reserved.
        </p>
      </td>
      <td style="text-align:right;vertical-align:middle;">
        <img src="https://res.cloudinary.com/djofqa3vc/image/upload/v1778967518/logo_sn_fox_copy_e9sigm.png" height="26" width="26" style="display:block;margin-left:auto;opacity:.15;"/>
      </td>
    </tr></table>
  </div>
</td></tr>

</table></td></tr></table></body></html>`;
          }

          const sendEmail=async()=>{
            if(!emailTo){toast("Enter a recipient email");return;}
            if(!emailSubject){toast("Enter a subject line");return;}
            if(!emailRawContent.trim()){toast("Write some email content first");return;}
            setEmailSending(true);
            try{
              const r=await fetch("/api/email-campaign",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({to:emailTo,subject:emailSubject,rawContent:emailRawContent})});
              if(r.ok){toast("Email sent to "+emailTo);}else{const d=await r.json();toast(d.error||"Send failed");}
            }catch{toast("Send failed. Try again.");}
            setEmailSending(false);
          };

          const copyHtml=()=>{
            const html=buildPreviewHtml();
            navigator.clipboard.writeText(html).then(()=>toast("HTML copied to clipboard")).catch(()=>toast("Copy failed"));
          };

          const preview=buildPreviewHtml();

          return(
          <section className="page active">
            <div className="page-head">
              <div>
                <h2>Email Campaign</h2>
                <p style={{fontSize:13,color:"var(--muted)",marginTop:4}}>Write your message, see the branded template live, then send with one click.</p>
              </div>
            </div>

            <div className="gen-layout">
              {/* ── FORM ── */}
              <div className="gen-form">
                <div className="gen-form-title">Compose</div>
                <div className="gen-form-sub">Paste or type your email — we'll wrap it in the Foxmen template automatically.</div>

                <Field label="To (recipient email)" value={emailTo} onChange={setEmailTo} placeholder="client@company.com" type="email"/>
                <Field label="Subject line" value={emailSubject} onChange={setEmailSubject} placeholder="Here's what we've been building…"/>

                <div className="field" style={{marginTop:8}}>
                  <label>Email content</label>
                  <div style={{fontSize:11,color:"var(--muted)",marginBottom:6,lineHeight:1.6}}>
                    Supports <code style={{background:"var(--line)",padding:"1px 4px",borderRadius:3,fontSize:10}}>## Heading</code>, <code style={{background:"var(--line)",padding:"1px 4px",borderRadius:3,fontSize:10}}>**bold**</code>, <code style={{background:"var(--line)",padding:"1px 4px",borderRadius:3,fontSize:10}}>- list</code>, <code style={{background:"var(--line)",padding:"1px 4px",borderRadius:3,fontSize:10}}>[Label](url)</code> for CTA button
                  </div>
                  <textarea
                    value={emailRawContent}
                    onChange={e=>setEmailRawContent(e.target.value)}
                    placeholder={`Hi Ahmed,\n\nHope you're doing well! I wanted to share a quick update on the project.\n\n## What we shipped this week\n- Redesigned the onboarding flow\n- Integrated the payment gateway\n- Performance improvements across the board\n\n> "The new design feels like a completely different product." — Early feedback\n\nWe're on track for the 14 June launch. Here's the staging link:\n\n[View the staging site](https://staging.example.com)\n\nLet us know if you have any questions.`}
                    style={{width:"100%",minHeight:320,resize:"vertical",fontFamily:"var(--f-mono)",fontSize:13,lineHeight:1.65,padding:"12px 14px",background:"var(--canvas)",border:"1px solid var(--line)",borderRadius:"var(--r-sm)",color:"var(--ink)",outline:"none"}}
                  />
                </div>

                <div style={{display:"flex",gap:10,marginTop:4}}>
                  <button className="btn-generate" onClick={sendEmail} disabled={emailSending} style={{flex:1}}>
                    {emailSending
                      ?<><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{animation:"spin 1s linear infinite"}}><path d="M21 12a9 9 0 1 1-6.2-8.6"/></svg>Sending…</>
                      :<><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z"/></svg>Send email</>
                    }
                  </button>
                  <button className="btn-ghost" onClick={copyHtml} style={{display:"flex",alignItems:"center",gap:6,padding:"10px 16px",fontSize:13}}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copy HTML
                  </button>
                </div>

                {/* Syntax guide */}
                <div style={{marginTop:20,padding:"14px 16px",background:"var(--line)",borderRadius:10}}>
                  <div style={{fontSize:11,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"var(--muted)",marginBottom:10}}>Formatting cheatsheet</div>
                  {[
                    ["## Section title","Large heading"],
                    ["**bold text**","Bold"],
                    ["*italic text*","Italic"],
                    ["- item","Bullet list"],
                    ["---","Horizontal divider"],
                    ["> quoted text","Highlighted quote"],
                    ["[Button label](url)","Purple CTA button"],
                    ["https://example.com","Auto CTA button"],
                  ].map(([syntax,desc])=>(
                    <div key={syntax} style={{display:"flex",gap:10,alignItems:"baseline",padding:"4px 0",borderBottom:"1px solid rgba(0,0,0,.04)"}}>
                      <code style={{fontFamily:"var(--f-mono)",fontSize:11,color:"var(--brand)",minWidth:180,flexShrink:0}}>{syntax}</code>
                      <span style={{fontSize:12,color:"var(--muted)"}}>{desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── PREVIEW ── */}
              <div className="gen-preview">
                <div className="gen-preview-head">
                  <span style={{fontSize:13,fontWeight:600}}>Live preview</span>
                  <span style={{fontSize:12,color:"var(--muted)"}}>Updates as you type</span>
                </div>
                <div className="gen-preview-body" style={{padding:0,background:"#f1efe9"}}>
                  <iframe
                    srcDoc={preview}
                    style={{width:"100%",border:"none",minHeight:600,display:"block",borderRadius:"0 0 var(--r) var(--r)"}}
                    title="Email preview"
                    sandbox="allow-same-origin"
                  />
                </div>
              </div>
            </div>
          </section>
          );
        })()}

        {/* ══════════ FOX PRICING ══════════ */}
        {page==="fox-prices" && (()=>{
          const CATS = ["Website","Mobile App","E-commerce","AI Tool","Branding"];
          const CAT_DESC:Record<string,string> = {
            "Website":    "Marketing sites, SaaS dashboards, web apps with user accounts.",
            "Mobile App": "Native iOS, Android, or cross-platform React Native / Flutter apps.",
            "E-commerce": "Shopify, custom storefronts, marketplace & multi-vendor platforms.",
            "AI Tool":    "LLM integrations, RAG pipelines, agents, copilots & AI dashboards.",
            "Branding":   "Logo, color system, typography, guidelines & full design systems.",
          };
          const catRows    = foxPrices.filter(p=>p.category===priceCat);
          const baseRow    = catRows.find(p=>p.is_base);
          const featureRows= catRows.filter(p=>!p.is_base);
          const lp         = localPrices;
          const setLp      = (id:number, field:"min"|"max", val:string)=>{
            const n = parseInt(val)||0;
            setLocalPrices(prev=>({...prev,[id]:{...(prev[id]??{min:0,max:0}),[field]:n}}));
          };
          const isDirty = (id:number, orig:{price_min:number;price_max:number})=>
            lp[id] && (lp[id].min!==orig.price_min||lp[id].max!==orig.price_max);
          const noteChanged = (localNotes[priceCat]??"") !== (baseRow?.note??"");
          const anyDirty   = catRows.some(r=>isDirty(r.id,r)) || noteChanged;
          /* totals */
          const baseMin = lp[baseRow?.id??-1]?.min ?? baseRow?.price_min ?? 0;
          const baseMax = lp[baseRow?.id??-1]?.max ?? baseRow?.price_max ?? 0;
          const addMin  = featureRows.reduce((s,f)=>s+(lp[f.id]?.min??f.price_min),0);
          const addMax  = featureRows.reduce((s,f)=>s+(lp[f.id]?.max??f.price_max),0);
          const fmt     = (n:number)=>`$${Number(n).toLocaleString()}`;
          return (
          <section className="page active">
            <div className="page-head">
              <div><h2>Fox <span className="it">Pricing</span></h2><p>Control what visitors see in the Fox AI chat — prices update instantly, no deploy needed.</p></div>
              <div className="page-actions">
                <button className="btn-primary" onClick={()=>saveFoxCat(priceCat)}>Save {priceCat} <ArrowChip/></button>
              </div>
            </div>

            {/* Category tabs */}
            <div style={{display:"flex",gap:4,marginBottom:20,padding:3,background:"var(--canvas)",borderRadius:999,width:"fit-content"}}>
              {CATS.map(c=>(
                <button key={c} onClick={()=>setPriceCat(c)} style={{padding:"7px 16px",borderRadius:999,fontSize:12,fontWeight:500,border:"none",cursor:"pointer",background:priceCat===c?"#fff":"transparent",color:priceCat===c?"var(--ink)":"var(--muted)",boxShadow:priceCat===c?"0 1px 4px rgba(0,0,0,.08)":"none",transition:"all .15s"}}>
                  {c}
                </button>
              ))}
            </div>

            {/* Overview card */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr auto",gap:12,marginBottom:20,alignItems:"stretch"}}>
              <div style={{background:"var(--canvas)",border:"1px solid var(--line)",borderRadius:12,padding:"16px 20px"}}>
                <div className="sub" style={{marginBottom:6}}>Category</div>
                <div style={{fontFamily:"var(--f-display)",fontSize:22,lineHeight:1.1}}>{priceCat}</div>
                <div style={{fontSize:12,color:"var(--muted)",marginTop:6,lineHeight:1.4}}>{CAT_DESC[priceCat]}</div>
              </div>
              <div style={{background:"var(--canvas)",border:"1px solid var(--line)",borderRadius:12,padding:"16px 20px"}}>
                <div className="sub" style={{marginBottom:6}}>Base Range</div>
                <div style={{fontFamily:"var(--f-display)",fontSize:22,lineHeight:1.1}}>{fmt(baseMin)} <span style={{color:"var(--muted)",fontSize:16}}>–</span> {fmt(baseMax)}</div>
                <div style={{fontSize:12,color:"var(--muted)",marginTop:6}}>Starting price, no add-ons</div>
              </div>
              <div style={{background:"var(--canvas)",border:"1px solid var(--line)",borderRadius:12,padding:"16px 20px"}}>
                <div className="sub" style={{marginBottom:6}}>Max Possible</div>
                <div style={{fontFamily:"var(--f-display)",fontSize:22,lineHeight:1.1}}>{fmt(baseMin+addMin)} <span style={{color:"var(--muted)",fontSize:16}}>–</span> {fmt(baseMax+addMax)}</div>
                <div style={{fontSize:12,color:"var(--muted)",marginTop:6}}>Base + all {featureRows.length} features</div>
              </div>
              <div style={{background:"linear-gradient(135deg,#0f0f0f,#1a0a2e)",border:"1px solid rgba(184,108,249,.2)",borderRadius:12,padding:"16px 20px",minWidth:120,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",gap:4}}>
                <div style={{color:"rgba(255,255,255,.4)",fontSize:10,fontFamily:"var(--f-mono)",letterSpacing:".14em",textTransform:"uppercase"}}>Features</div>
                <div style={{fontFamily:"var(--f-display)",fontSize:40,lineHeight:1,color:"#fff"}}>{featureRows.length}</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,.3)"}}>add-ons</div>
              </div>
            </div>

            {/* Notes / custom message */}
            <div style={{background:"var(--canvas)",border:`1.5px solid ${noteChanged?"var(--brand)":"var(--line)"}`,borderRadius:12,padding:"16px 20px",marginBottom:20,transition:"border-color .2s"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <div>
                  <div style={{fontWeight:600,fontSize:13,color:"var(--ink)"}}>Category Notes</div>
                  <div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>Internal memo — visible only to you. Use it to track pricing rationale, client feedback, or seasonal adjustments.</div>
                </div>
                {noteChanged&&<span style={{fontSize:11,color:"var(--brand)",fontFamily:"var(--f-mono)",letterSpacing:".1em"}}>unsaved</span>}
              </div>
              <textarea
                value={localNotes[priceCat]??""}
                onChange={e=>setLocalNotes(prev=>({...prev,[priceCat]:e.target.value}))}
                placeholder={`Notes for ${priceCat} pricing — e.g. "Reduced base by 20% for Q2 to win BD market. Revisit in July."`}
                rows={3}
                style={{width:"100%",padding:"10px 14px",borderRadius:8,border:"1.5px solid var(--line)",fontSize:13,lineHeight:1.55,resize:"vertical",outline:"none",background:"#fff",color:"var(--ink)",boxSizing:"border-box",fontFamily:"var(--f-sans)"}}
              />
            </div>

            {/* Price table */}
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th style={{width:160}}>Min (USD)</th>
                    <th style={{width:160}}>Max (USD)</th>
                    <th style={{width:60}}/>
                  </tr>
                </thead>
                <tbody>
                  {/* Base price row */}
                  {baseRow && (
                    <tr style={{background:"#fafaf8"}}>
                      <td>
                        <div className="ttl" style={{display:"flex",alignItems:"center",gap:8}}>
                          <span style={{background:"#0a0a0a",color:"#fff",fontSize:9,fontFamily:"var(--f-mono)",letterSpacing:".1em",padding:"3px 8px",borderRadius:999,textTransform:"uppercase",flexShrink:0}}>Base</span>
                          Starting price
                        </div>
                        <div className="sub">Shown before any feature is selected in Fox chat</div>
                      </td>
                      <td>
                        <input type="number" min={0} value={lp[baseRow.id]?.min??baseRow.price_min}
                          onChange={e=>setLp(baseRow.id,"min",e.target.value)}
                          style={{width:"100%",padding:"9px 12px",borderRadius:8,border:`1.5px solid ${isDirty(baseRow.id,baseRow)?"var(--brand)":"var(--line)"}`,fontSize:13,fontFamily:"var(--f-mono)",outline:"none",transition:"border-color .15s"}}/>
                      </td>
                      <td>
                        <input type="number" min={0} value={lp[baseRow.id]?.max??baseRow.price_max}
                          onChange={e=>setLp(baseRow.id,"max",e.target.value)}
                          style={{width:"100%",padding:"9px 12px",borderRadius:8,border:`1.5px solid ${isDirty(baseRow.id,baseRow)?"var(--brand)":"var(--line)"}`,fontSize:13,fontFamily:"var(--f-mono)",outline:"none",transition:"border-color .15s"}}/>
                      </td>
                      <td>
                        <button className="btn-icon" title="Save row" style={{opacity:isDirty(baseRow.id,baseRow)?1:.25,transition:"opacity .15s"}} onClick={()=>{saveFoxPrice(baseRow.id);toast("Base price saved");}}><ArrowChip/></button>
                      </td>
                    </tr>
                  )}
                  {/* Feature rows */}
                  {featureRows.map(f=>(
                    <tr key={f.id}>
                      <td>
                        <div className="ttl">{f.label}</div>
                        <div className="sub" style={{fontFamily:"var(--f-mono)",fontSize:10,letterSpacing:".1em",textTransform:"uppercase"}}>{f.feature_id}</div>
                      </td>
                      <td>
                        <input type="number" min={0} value={lp[f.id]?.min??f.price_min}
                          onChange={e=>setLp(f.id,"min",e.target.value)}
                          style={{width:"100%",padding:"9px 12px",borderRadius:8,border:`1.5px solid ${isDirty(f.id,f)?"var(--brand)":"var(--line)"}`,fontSize:13,fontFamily:"var(--f-mono)",outline:"none",transition:"border-color .15s"}}/>
                      </td>
                      <td>
                        <input type="number" min={0} value={lp[f.id]?.max??f.price_max}
                          onChange={e=>setLp(f.id,"max",e.target.value)}
                          style={{width:"100%",padding:"9px 12px",borderRadius:8,border:`1.5px solid ${isDirty(f.id,f)?"var(--brand)":"var(--line)"}`,fontSize:13,fontFamily:"var(--f-mono)",outline:"none",transition:"border-color .15s"}}/>
                      </td>
                      <td>
                        <button className="btn-icon" title="Save row" style={{opacity:isDirty(f.id,f)?1:.25,transition:"opacity .15s"}} onClick={()=>{saveFoxPrice(f.id);toast("Feature price saved");}}><ArrowChip/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {foxPrices.length===0&&<div style={{padding:40,textAlign:"center",color:"var(--muted)"}}>Loading pricing data…</div>}
            </div>

            <div style={{marginTop:14,display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",background:"var(--canvas)",borderRadius:10,fontSize:12,color:"var(--muted)",border:"1px solid var(--line)"}}>
              <span>All prices in USD. Fox visitors see a live estimate that updates as they check/uncheck features.</span>
              {anyDirty&&<button className="btn-primary" style={{fontSize:12,padding:"7px 16px"}} onClick={()=>saveFoxCat(priceCat)}>Save all changes <ArrowChip/></button>}
            </div>
          </section>
          );
        })()}

        {/* ══════════ SETTINGS ══════════ */}
        {page==="settings" && (
          <section className="page active">
            <div className="page-head">
              <div><h2>Settings</h2><p>Brand, SEO, integrations and security for the workspace.</p></div>
              <div className="page-actions">
                <div style={{display:"flex",gap:2,padding:2,background:"var(--canvas)",borderRadius:999}}>
                  {["brand","seo","integrations","security","billing"].map(tab=>(
                    <button key={tab} onClick={()=>setSettingsTab(tab)} style={{padding:"6px 14px",borderRadius:999,fontSize:12,background:settingsTab===tab?"#fff":"transparent",color:settingsTab===tab?"var(--ink)":"var(--muted)"}}>
                      {tab.charAt(0).toUpperCase()+tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="card" style={{padding:"0 28px"}}>
              {settingsTab==="brand" && <div>
                <div className="form-section"><div className="lhs"><h3>Brand identity</h3><p>Name, tagline and description.</p></div><div className="rhs">
                  <div className="field"><label>Studio name</label><input type="text" data-setting="studio_name" defaultValue="Foxmen Studio"/></div>
                  <div className="field"><label>Tagline</label><input type="text" data-setting="tagline" defaultValue="Code · Craft · Care"/></div>
                  <div className="field"><label>Brand description</label><textarea data-setting="brand_desc" defaultValue="International digital studio. We design, engineer, and grow products for ambitious teams across 17 countries."/></div>
                </div></div>
                <div className="form-section"><div className="lhs"><h3>Site behaviour</h3><p>Toggles for the live site.</p></div><div className="rhs">
                  {[["Custom cursor","Brand-colored cursor dot."],["Mask-reveal showreel","Full-screen video on homepage."],["Preloader animation","2.5-second branded splash."],["Print noise overlay","Editorial texture."]].map(([h,p],i)=>(
                    <div key={i} className="row-pair"><div className="text"><h4>{h}</h4><p>{p}</p></div><div className={`toggle ${brandT[i]?"on":""}`} onClick={()=>setBrandT(t=>t.map((x,j)=>j===i?!x:x))}/></div>
                  ))}
                </div></div>
                <div className="savebar"><div className="hint">Unsaved changes</div><div style={{display:"flex",gap:8}}><button className="btn-ghost">Discard</button><button className="btn-primary" onClick={()=>saveSettings("brand")}>Save changes <ArrowChip/></button></div></div>
              </div>}
              {settingsTab==="seo" && <div>
                <div className="form-section"><div className="lhs"><h3>Search defaults</h3><p>Used on pages without their own metadata.</p></div><div className="rhs">
                  <div className="field"><label>Title</label><input type="text" data-setting="seo_title" defaultValue="Foxmen Studio — Code. Craft. Care."/></div>
                  <div className="field"><label>Meta description</label><textarea data-setting="seo_desc" defaultValue="International digital agency building websites, mobile apps, AI-integrated software, ecommerce and real estate platforms."/></div>
                  <div className="field"><label>Canonical URL</label><input type="text" data-setting="canonical_url" defaultValue="https://foxmen.studio"/></div>
                  <div className="field-row"><div className="field"><label>Twitter handle</label><input type="text" data-setting="twitter_handle" defaultValue="@foxmenstudio"/></div><div className="field"><label>Google Analytics ID</label><input type="text" data-setting="ga_id" defaultValue="G-XXXXXXX2"/></div></div>
                </div></div>
                <div className="form-section"><div className="lhs"><h3>Robots</h3></div><div className="rhs">
                  {[["Index the site","Allow search engines to crawl."],["Auto-submit sitemap","Resubmits on every change."]].map(([h,p],i)=>(
                    <div key={i} className="row-pair"><div className="text"><h4>{h}</h4><p>{p}</p></div><div className={`toggle ${seoT[i]?"on":""}`} onClick={()=>setSeoT(t=>t.map((x,j)=>j===i?!x:x))}/></div>
                  ))}
                </div></div>
                <div className="savebar"><div className="hint">Unsaved changes</div><div style={{display:"flex",gap:8}}><button className="btn-ghost">Discard</button><button className="btn-primary" onClick={()=>saveSettings("seo")}>Save changes <ArrowChip/></button></div></div>
              </div>}
              {settingsTab==="integrations" && (
                <div className="form-section"><div className="lhs"><h3>Connected services</h3><p>OAuth integrations.</p></div><div className="rhs">
                  {[["Stripe","Invoices & payouts","live","Connected"],["Slack","Inbox & deploy notifications","live","Connected"],["Linear","Project tracking","live","Connected"],["OpenAI","For copy & AI features","live","Connected"],["HubSpot","CRM sync","draft","Not connected"],["Figma","Embed design files","draft","Not connected"]].map(([h,p,st,label],i)=>(
                    <div key={i} className="row-pair"><div className="text"><h4>{h}</h4><p>{p}</p></div><span className={`status ${st}`}>{label}</span></div>
                  ))}
                </div></div>
              )}
              {settingsTab==="security" && <div>
                <div className="form-section"><div className="lhs"><h3>Authentication</h3></div><div className="rhs">
                  {[["Require 2FA for owners","Authenticator app required."],["Allow Google SSO","Studio Google workspace."],["Allow GitHub SSO","Engineering team."],["Auto-logout after 24h","Inactive sessions expire."]].map(([h,p],i)=>(
                    <div key={i} className="row-pair"><div className="text"><h4>{h}</h4><p>{p}</p></div><div className={`toggle ${secT[i]?"on":""}`} onClick={()=>setSecT(t=>t.map((x,j)=>j===i?!x:x))}/></div>
                  ))}
                </div></div>
                <div className="form-section"><div className="lhs"><h3>Sessions</h3></div><div className="rhs">
                  <div className="row-pair"><div className="text"><h4>MacBook Pro · Chrome · Dhaka</h4><p>This device · active now</p></div><span className="status live">Active</span></div>
                  <div className="row-pair"><div className="text"><h4>iPhone 15 · Safari · Dhaka</h4><p>2 hours ago</p></div><button className="btn-ghost danger" onClick={()=>toast("Session ended")}>Sign out</button></div>
                </div></div>
              </div>}
              {settingsTab==="billing" && (
                <div className="form-section"><div className="lhs"><h3>Current plan</h3></div><div className="rhs">
                  <div className="card" style={{background:"var(--canvas)",border:"1px solid var(--line)"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",gap:14}}>
                      <div><div className="sub">Plan</div><div style={{fontFamily:"var(--f-display)",fontSize:36,lineHeight:1,marginTop:6}}>Studio <span className="it" style={{color:"var(--brand)",fontStyle:"italic"}}>Pro</span></div><div style={{color:"var(--muted)",fontSize:13,marginTop:6}}>Renews May 28, 2026 · $480/year</div></div>
                      <button className="btn-ghost">Manage</button>
                    </div>
                  </div>
                  <div className="row-pair"><div className="text"><h4>Workspace seats</h4><p>12 of 25 used</p></div><span className="status live">13 left</span></div>
                  <div className="row-pair"><div className="text"><h4>Storage</h4><p>482 MB of 50 GB</p></div><span className="status live">OK</span></div>
                  <div className="row-pair"><div className="text"><h4>AI tokens</h4><p>4.2M of 10M monthly</p></div><span className="status review">42%</span></div>
                </div></div>
              )}
            </div>
          </section>
        )}

      </main>

      {/* ══ MODAL ══ */}
      {modalType && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className={"modal-card"+((modalType||"").includes("project")?" wide":"")} onClick={e=>e.stopPropagation()}>
            <div className="modal-head">
              <h3>{modalType==="new-service"&&editTarget?"Edit service":(MODAL_TITLE[modalType]||"New item")}</h3>
              <button className="close" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              {/* PROJECT */}
              {(modalType==="new-project"||modalType==="edit-project") && <>
                <div className="inv-ai-box">
                  <div className="inv-ai-label">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                    AI Auto-fill
                  </div>
                  <textarea
                    className="inv-ai-textarea"
                    value={projAiPrompt}
                    onChange={e=>setProjAiPrompt(e.target.value)}
                    placeholder="Describe the project — e.g. &quot;We built a real estate platform for Nestaro Inc. in Dubai. Took 3 months, used Next.js and Supabase. Main challenge was multi-currency search. Result was 40% faster search and 2x listings.&quot;"
                  />
                  <button
                    className="inv-ai-btn"
                    disabled={projAiLoading||!projAiPrompt.trim()}
                    onClick={async()=>{
                      setProjAiLoading(true);
                      try{
                        const r=await fetch("/api/project-ai",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({description:projAiPrompt})});
                        const d=await r.json();
                        if(d.name){
                          setForm(f=>({...f,
                            name:d.name||f.name,
                            client_name:d.client_name||f.client_name,
                            industry:d.industry||f.industry,
                            year:d.year||f.year,
                            scope:d.scope||f.scope,
                            status:d.status||f.status||"draft",
                            tagline:d.tagline||f.tagline,
                            overview:d.overview||f.overview,
                            challenge:d.challenge||f.challenge,
                            solution:d.solution||f.solution,
                            results:d.results||f.results,
                            tech_stack:d.tech_stack||f.tech_stack,
                            timeline_duration:d.timeline_duration||f.timeline_duration,
                            live_url:d.live_url||f.live_url,
                            monogram:d.monogram||f.monogram,
                          }));
                          toast("Project fields filled by AI");
                        }else{ toast("AI returned nothing — try rephrasing"); }
                      }catch{ toast("AI fill failed. Try again."); }
                      setProjAiLoading(false);
                    }}
                  >
                    {projAiLoading
                      ?<><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{animation:"spin 1s linear infinite"}}><path d="M21 12a9 9 0 1 1-6.2-8.6"/></svg>Generating…</>
                      :<><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>Fill Project with AI</>
                    }
                  </button>
                </div>
                <div className="modal-section-label">Basic Info</div>
                <div className="modal-2col" style={{gridColumn:"1/-1"}}>
                  <div style={{gridColumn:"1/-1"}}><Field label="Project name *" value={form.name||""} onChange={v=>sf("name",v)} placeholder="e.g. Nestaro — real estate OS"/></div>
                  <Field label="Company / Brand" value={form.client_name||""} onChange={v=>sf("client_name",v)} placeholder="e.g. Nestaro Inc."/>
                  <Field label="Industry" value={form.industry||""} onChange={v=>sf("industry",v)} placeholder="e.g. Fintech"/>
                  <Field label="Year" value={form.year||String(new Date().getFullYear())} onChange={v=>sf("year",v)}/>
                  <FieldSel label="Status" value={form.status||"draft"} onChange={v=>sf("status",v)} options={["draft","live","review","archived"]}/>
                  <div style={{gridColumn:"1/-1"}}><Field label="Scope" value={form.scope||""} onChange={v=>sf("scope",v)} placeholder="Web · iOS · Android · AI"/></div>
                  <div style={{gridColumn:"1/-1"}}><Field label="Tagline" value={form.tagline||""} onChange={v=>sf("tagline",v)} placeholder="Short compelling subtitle for the case study"/></div>
                </div>
                <div className="modal-section-label">Overview &amp; Project Info</div>
                <FieldArea label="Short overview (shown in case study hero)" value={form.overview||""} onChange={v=>sf("overview",v)} placeholder="What was built and why — 2-3 sentences shown at the top of the case study"/>
                <div className="modal-section-label">Tech &amp; Links</div>
                <div className="modal-2col">
                  <Field label="Tech stack" value={form.tech_stack||""} onChange={v=>sf("tech_stack",v)} placeholder="Next.js, Supabase, OpenAI"/>
                  <Field label="Timeline" value={form.timeline_duration||""} onChange={v=>sf("timeline_duration",v)} placeholder="e.g. 8 weeks"/>
                  <Field label="Live URL" value={form.live_url||""} onChange={v=>sf("live_url",v)} placeholder="https://"/>
                  <Field label="Case study slug" value={form.slug||toSlug(form.name||"")} onChange={v=>sf("slug",v)} placeholder="auto-generated from name"/>
                </div>
                <div className="modal-section-label">Cover Images</div>
                <div className="modal-2col">
                  <ImageUpload label="Hero image — landscape (21:9 banner)" value={form.hero_image||""} onChange={v=>sf("hero_image",v)} accept="image/*"/>
                  <ImageUpload label="Thumbnail — card preview" value={form.thumbnail||""} onChange={v=>sf("thumbnail",v)} accept="image/*"/>
                </div>
                <div className="modal-section-label" style={{marginTop:8}}>Case Study Chapters</div>
                <p style={{fontSize:12,color:"var(--muted)",margin:"-4px 0 12px",lineHeight:1.5}}>
                  Add any number of chapters. Each chapter has a title, body text, and images (choose portrait for mobile screenshots, landscape for desktop). Images are never cropped — the whole image is always visible.
                </p>
                <ChapterBuilder value={form.chapters||"[]"} onChange={v=>sf("chapters",v)}/>
                <div className="modal-section-label" style={{marginTop:8}}>Client Quote (optional)</div>
                <FieldArea label="Quote text" value={form.client_quote||""} onChange={v=>sf("client_quote",v)} placeholder="What the client said about the project…"/>
                <div className="modal-2col">
                  <Field label="Author name" value={form.client_quote_author||""} onChange={v=>sf("client_quote_author",v)} placeholder="Sara Köhler"/>
                  <Field label="Author role" value={form.client_quote_role||""} onChange={v=>sf("client_quote_role",v)} placeholder="CEO · Nestaro"/>
                </div>
                <div className="modal-section-label" style={{marginTop:8}}>Gallery (additional media)</div>
                <GalleryUpload label="Additional images &amp; videos" value={form.gallery?JSON.parse(form.gallery):[]} onChange={v=>sf("gallery",JSON.stringify(v))}/>
                <div className="modal-section-label">Display</div>
                <div className="modal-2col">
                  <Field label="Monogram (2-char)" value={form.monogram||""} onChange={v=>sf("monogram",v)} placeholder="e.g. NE"/>
                  <FieldSel label="Color variant" value={form.color_cls||""} onChange={v=>sf("color_cls",v)} options={["(purple)","b","c","d"]}/>
                </div>
              </>}
              {/* POST */}
              {(modalType==="new-post"||modalType==="edit-post") && <>
                <Field label="Title *" value={form.title||""} onChange={v=>sf("title",v)} placeholder="e.g. Why AI features fail in production"/>
                <FieldSel label="Category" value={form.category||"Design"} onChange={v=>sf("category",v)} options={["AI","Design","Engineering","Studio","Case studies"]}/>
                <Field label="Author name" value={form.author_name||""} onChange={v=>sf("author_name",v)} placeholder="e.g. Devon Arias"/>
                <Field label="Read time" value={form.read_time||""} onChange={v=>sf("read_time",v)} placeholder="e.g. 8 min"/>
                <FieldSel label="Status" value={form.status||"draft"} onChange={v=>sf("status",v)} options={["draft","live","review"]}/>
              </>}
              {/* TESTIMONIAL */}
              {(modalType==="new-testimonial"||modalType==="edit-testimonial") && <>
                <FieldArea label="Quote *" value={form.quote||""} onChange={v=>sf("quote",v)} placeholder="What the client said…"/>
                <Field label="Client name *" value={form.name||""} onChange={v=>sf("name",v)} placeholder="e.g. Sara Köhler"/>
                <Field label="Role" value={form.role||""} onChange={v=>sf("role",v)} placeholder="e.g. CEO · Nestaro"/>
                <Field label="Highlight phrase" value={form.hi||""} onChange={v=>sf("hi",v)} placeholder="Word to italicise in the quote"/>
              </>}
              {/* CLIENT */}
              {modalType==="new-client" && <>
                <Field label="Company name *" value={form.name||""} onChange={v=>sf("name",v)} placeholder="e.g. Orbit Bank"/>
                <Field label="Industry" value={form.industry||""} onChange={v=>sf("industry",v)} placeholder="e.g. Fintech"/>
                <Field label="Country code" value={form.country||""} onChange={v=>sf("country",v)} placeholder="e.g. DE"/>
                <Field label="Primary contact" value={form.contact||""} onChange={v=>sf("contact",v)} placeholder="e.g. Julia Weber"/>
                <FieldSel label="Engagement type" value={form.eng||"Active build"} onChange={v=>sf("eng",v)} options={["Active build","Retainer","Discovery","Past project"]}/>
                <Field label="MRR / value" value={form.mrr||""} onChange={v=>sf("mrr",v)} placeholder="e.g. $12k/mo or $180k total"/>
              </>}
              {/* TEAM */}
              {modalType==="new-team" && <>
                <Field label="Full name *" value={form.name||""} onChange={v=>sf("name",v)} placeholder="e.g. Sara Köhler"/>
                <Field label="Role" value={form.role||""} onChange={v=>sf("role",v)} placeholder="e.g. Design Director"/>
                <FieldArea label="Bio" value={form.bio||""} onChange={v=>sf("bio",v)} placeholder="One sentence about what they do…"/>
                <Field label="Initials (optional — auto-generated)" value={form.av||""} onChange={v=>sf("av",v)} placeholder="e.g. SK"/>
              </>}
              {/* SERVICE */}
              {modalType==="new-service" && <>
                <Field label="Service name *" value={form.name||""} onChange={v=>sf("name",v)} placeholder="e.g. Mobile Design"/>
                <FieldArea label="Description" value={form.descr||""} onChange={v=>sf("descr",v)} placeholder="One sentence summary…"/>
                <Field label="Client count label" value={form.count||""} onChange={v=>sf("count",v)} placeholder="e.g. 12 clients"/>
                <Field label="Badge (optional)" value={form.badge||""} onChange={v=>sf("badge",v)} placeholder="e.g. New"/>
                <Field label="Image URL (optional)" value={form.image||""} onChange={v=>sf("image",v)} placeholder="https://…"/>
                {form.image && <img src={form.image} alt="preview" style={{width:"100%",height:120,objectFit:"cover",borderRadius:10,marginTop:4}}/>}
              </>}
            </div>
            <div className="modal-foot">
              <button className="btn-ghost" onClick={closeModal}>Cancel</button>
              <button className="btn-primary" onClick={submitModal} disabled={submitting}>{submitting?"Saving…":"Save"} <ArrowChip/></button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      <div className={`toast${toastOn?" show":""}`}><span className="dot"/><span>{toastMsg}</span></div>

    </div>
  );
}
