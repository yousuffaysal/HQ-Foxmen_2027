"use client";
import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("error") === "CredentialsSignin") setError("Invalid email or password.");
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const from = searchParams.get("from");
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) { setError("Invalid email or password."); return; }
    // check role to decide where to land
    const session = await fetch("/api/auth/session").then(r => r.json());
    const role = session?.user?.role;
    router.push(from ?? (role === "admin" ? "/admin" : "/portal"));
    router.refresh();
  }

  return (
    <div className="adm-root" style={{ position: "fixed", inset: 0, overflowY: "auto" }}>
      <section className="login">
        <aside className="pane">
          <Link href="/" className="brand" style={{ textDecoration: "none", color: "inherit" }}>
            <img src="/assets/logo-mark.svg" alt="" />
            <span>Foxmen <em style={{ fontStyle: "italic", color: "var(--brand)" }}>Studio</em></span>
          </Link>
          <h1>Welcome <span className="it">back.</span><br />Your work<br />is waiting.</h1>
          <div className="meta"><span>Client Portal</span><span>Foxmen Studio</span></div>
        </aside>

        <form onSubmit={handleSubmit}>
          <Link href="/" className="login-mobile-brand" style={{ textDecoration: "none", color: "inherit" }}>
            <img src="/assets/logo-mark.svg" alt="Foxmen Studio" />
            <div>
              <div className="lmb-name">Foxmen <em style={{ fontStyle: "italic", color: "var(--brand)" }}>Studio</em></div>
              <span className="lmb-sub">Client Portal</span>
            </div>
          </Link>
          <h2>Sign in to <span className="it">portal.</span></h2>
          <p>Enter your email and password to access your client dashboard.</p>

          <div className="field">
            <label>Email address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoFocus
            />
          </div>

          <div className="field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div style={{ background: "#fff0f0", border: "1px solid #ffd0d0", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#c00", marginTop: -8 }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
            {loading ? "Signing in…" : "Sign in to portal"}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18M13 5l7 7-7 7" /></svg>
          </button>

          <div className="or">or</div>

          <div style={{ textAlign: "center", fontSize: 13, color: "var(--muted)" }}>
            No account yet?{" "}
            <Link href="/register" style={{ color: "var(--brand)", fontWeight: 500 }}>Create one →</Link>
          </div>
        </form>
      </section>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
