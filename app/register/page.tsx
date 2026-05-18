"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      const j = await res.json();
      setError(j.error ?? "Registration failed");
      setLoading(false);
      return;
    }
    const sign = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (sign?.error) { setError("Account created but login failed. Try logging in."); return; }
    router.push("/portal");
    router.refresh();
  }

  return (
    <div className="adm-root" style={{ position: "fixed", inset: 0, overflowY: "auto" }}>
      <section className="login">
        <aside className="pane">
          <div className="brand">
            <img src="/assets/logo-mark.svg" alt="" />
            <span>Foxmen <em style={{ fontStyle: "italic", color: "var(--brand)" }}>Studio</em></span>
          </div>
          <h1>Let&apos;s build<br /><span className="it">something</span><br />great.</h1>
          <div className="meta"><span>New account</span><span>Foxmen Studio</span></div>
        </aside>

        <form onSubmit={handleSubmit}>
          <h2>Create <span className="it">account.</span></h2>
          <p>Get access to your client portal and track your projects in real-time.</p>

          <div className="field">
            <label>Full name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Jane Smith"
              required
              autoFocus
            />
          </div>

          <div className="field">
            <label>Email address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Min 8 characters"
              required
              minLength={8}
            />
          </div>

          {error && (
            <div style={{ background: "#fff0f0", border: "1px solid #ffd0d0", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#c00", marginTop: -8 }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{ opacity: loading ? 0.7 : 1, background: "var(--brand)" }}>
            {loading ? "Creating account…" : "Create account"}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18M13 5l7 7-7 7" /></svg>
          </button>

          <div className="or">or</div>

          <div style={{ textAlign: "center", fontSize: 13, color: "var(--muted)" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "var(--brand)", fontWeight: 500 }}>Sign in →</Link>
          </div>
        </form>
      </section>
    </div>
  );
}
