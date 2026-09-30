"use client";
import { useState, type FormEvent } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { S } from "../style";

// Only same-site paths are accepted as a post-login destination (no open redirects).
const safeFrom = (v: string | null) => (v && v.startsWith("/") && !v.startsWith("//") && !v.startsWith("/\\") ? v : null);

const input = "border:1px solid rgba(31,23,18,.18);background:#F3EEE4;border-radius:14px;padding:14px 16px;font-size:16px;color:#1F1712;outline:none;";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy) return;
    const fd = new FormData(e.currentTarget);
    setBusy(true); setError("");
    const res = await signIn("credentials", { email: String(fd.get("email") || ""), password: String(fd.get("password") || ""), redirect: false });
    if (!res || res.error) { setBusy(false); setError("Wrong email or password, or too many attempts. Please try again."); return; }
    const session = await getSession();
    const role = (session?.user as { role?: string } | undefined)?.role;
    router.replace(safeFrom(params.get("from")) ?? (role === "admin" ? "/admin" : "/portal"));
    router.refresh();
  };

  return (
    <main style={S("min-height:100vh;display:flex;align-items:center;justify-content:center;padding:clamp(20px,4.5vw,64px);background:#F3EEE4;color:#1F1712;font-family:Inter,sans-serif;")}>
      <div style={S("width:min(440px,100%);display:flex;flex-direction:column;gap:28px;")}>
        <Link href="/" aria-label="Foxmen Studio home" style={S("display:flex;align-items:center;gap:12px;")}>
          <img src="/assets/foxmen-logo.png" alt="Foxmen Studio" style={S("height:34px;width:auto;display:block;")} />
        </Link>
        <h1 style={S("margin:0;font-size:clamp(44px,6vw,72px);font-weight:800;letter-spacing:-0.068em;line-height:.92;")}>Sign in.</h1>
        <form onSubmit={submit} style={S("background:#FAF7F1;border:1px solid rgba(31,23,18,.1);border-radius:24px;padding:clamp(24px,3.5vw,36px);display:flex;flex-direction:column;gap:16px;")}>
          <label style={S("display:flex;flex-direction:column;gap:8px;font-size:14px;font-weight:600;")}>Email<input name="email" type="email" required autoComplete="email" style={S(input)} /></label>
          <label style={S("display:flex;flex-direction:column;gap:8px;font-size:14px;font-weight:600;")}>Password<input name="password" type="password" required autoComplete="current-password" style={S(input)} /></label>
          {error ? <div role="alert" style={S("font-size:14px;color:#8A2E1E;background:#F1D9D2;border-radius:14px;padding:12px 14px;")}>{error}</div> : null}
          <div>
            <button type="submit" disabled={busy} style={S(`display:inline-flex;align-items:center;gap:18px;padding:6px 6px 6px 26px;border-radius:999px;border:none;background:#1F1712;color:#F3EEE4;font-weight:600;font-size:16px;cursor:pointer;opacity:${busy ? ".6" : "1"};`)}>
              {busy ? "Signing in..." : "Sign in"}
              <span style={S("width:44px;height:44px;border-radius:999px;background:#F3EEE4;color:#1F1712;display:flex;align-items:center;justify-content:center;")}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M9 7h8v8"></path></svg></span>
            </button>
          </div>
        </form>
        <p style={S("margin:0;font-size:14px;color:#5E5249;")}>Client with an invite? Use the link in your email to set up your account.</p>
      </div>
    </main>
  );
}
