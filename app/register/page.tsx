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
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--paper)", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 40, textDecoration: "none" }}>
          <img src="/assets/logo-mark.svg" alt="Foxmen" style={{ height: 28 }} />
          <span style={{ fontWeight: 600, fontSize: 15 }}>Foxmen <em style={{ fontStyle: "italic", color: "var(--brand)" }}>Studio</em></span>
        </a>

        <h1 style={{ fontSize: 32, fontWeight: 400, letterSpacing: "-0.02em", marginBottom: 8 }}>
          Create your account
        </h1>
        <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 32 }}>
          Get access to your client portal
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 500 }}>Full name</span>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Jane Smith" style={inputStyle} />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 500 }}>Email</span>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" style={inputStyle} />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 500 }}>Password</span>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} placeholder="Min 8 characters" style={inputStyle} />
          </label>

          {error && (
            <div style={{ background: "#fff0f0", border: "1px solid #ffd0d0", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#c00" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ marginTop: 8, background: "var(--brand)", color: "#fff", border: "none", borderRadius: 50, padding: "14px 28px", fontSize: 15, fontWeight: 500, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, transition: "opacity 0.15s" }}
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p style={{ marginTop: 28, fontSize: 13, color: "var(--muted)", textAlign: "center" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "var(--brand)", fontWeight: 500, textDecoration: "none" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: 10,
  border: "1.5px solid var(--line)",
  fontSize: 15,
  background: "var(--paper)",
  color: "var(--ink)",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
  transition: "border-color 0.15s",
};
