"use client";
import { useState } from "react";

export default function NewsletterForm() {
  const [sent, setSent] = useState(false);
  return (
    <form
      className="news"
      onSubmit={(e) => { e.preventDefault(); setSent(true); }}
    >
      <input type="email" placeholder="you@studio.com" aria-label="Email" />
      <button type="submit">{sent ? "Sent ✓" : "Subscribe"}</button>
    </form>
  );
}
