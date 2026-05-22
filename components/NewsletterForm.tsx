"use client";
import { useState } from "react";

export default function NewsletterForm({ dark }: { dark?: boolean } = {}) {
  const [sent, setSent] = useState(false);
  if (dark) {
    return (
      <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} style={{ display:"flex", flexDirection:"column", gap:10 }}>
        <input
          type="email" placeholder="your@email.com" aria-label="Email"
          style={{ padding:"10px 14px", borderRadius:10, border:"1px solid rgba(255,255,255,.15)", background:"rgba(255,255,255,.08)", color:"#fff", fontFamily:"var(--f-sans)", fontSize:13, outline:"none" }}
        />
        <button type="submit" style={{ padding:"10px 14px", borderRadius:10, border:"none", background:"var(--brand)", color:"#fff", fontFamily:"var(--f-sans)", fontSize:13, fontWeight:500, cursor:"pointer" }}>
          {sent ? "Subscribed ✓" : "Subscribe"}
        </button>
      </form>
    );
  }
  return (
    <form className="news" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
      <input type="email" placeholder="you@studio.com" aria-label="Email" />
      <button type="submit">{sent ? "Sent ✓" : "Subscribe"}</button>
    </form>
  );
}
