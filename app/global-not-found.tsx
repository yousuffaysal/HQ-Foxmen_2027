import type { Metadata } from "next";
import Link from "next/link";
import "@fontsource/inter/400.css";
import "@fontsource/inter/800.css";
import "./(site)/site.css";

export const metadata: Metadata = { title: "Page not found · Foxmen Studio", robots: { index: false } };

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", gap: 28, padding: "clamp(20px,4.5vw,64px)", maxWidth: 1440, margin: "0 auto" }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13 }}>(404)</div>
          <h1 style={{ margin: 0, fontSize: "clamp(52px,10vw,176px)", fontWeight: 800, letterSpacing: "-0.068em", lineHeight: 0.9 }}>This page<br />is not here.</h1>
          <div>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 18, padding: "6px 6px 6px 26px", borderRadius: 999, background: "#1F1712", color: "#F3EEE4", fontWeight: 600, fontSize: 16 }}>
              Back home
              <span style={{ width: 44, height: 44, borderRadius: 999, background: "#F3EEE4", color: "#1F1712", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M9 7h8v8"></path></svg>
              </span>
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
