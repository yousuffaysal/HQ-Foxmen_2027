"use client";
import { useState } from "react";

export default function NewsletterCard() {
  const [sent, setSent] = useState(false);
  return (
    <div className="bd-news">
      <h3>Design insight,<br /><em style={{ fontStyle: "italic" }}>straight to your inbox.</em></h3>
      <form onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
        <input type="email" required placeholder="you@company.com" aria-label="Email" />
        <button type="submit">{sent ? "Subscribed ✓" : "Subscribe"}</button>
      </form>
      <p className="fine">By subscribing you agree to receive occasional emails from Foxmen Studio. No spam — unsubscribe anytime.</p>
    </div>
  );
}
