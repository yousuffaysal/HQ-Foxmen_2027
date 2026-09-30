"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";

type InviteData = {
  user_name: string;
  email: string;
  project_title: string;
  service_type: string;
  project_status: string;
  description: string;
  budget: string;
  timeline: string;
};

const STATUS_COLOR: Record<string, string> = {
  pending: "#f59e0b", in_progress: "#b86cf9",
  review: "#3b82f6", completed: "#22c55e", on_hold: "#6b6b6b",
};
const STATUS_LABEL: Record<string, string> = {
  pending: "Pending", in_progress: "In Progress",
  review: "In Review", completed: "Completed", on_hold: "On Hold",
};

export default function InvitePage() {
  const { token } = useParams<{ token: string }>();
  const router    = useRouter();

  const [data,    setData]    = useState<InviteData | null>(null);
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(true);
  const [email,   setEmail]   = useState("");
  const [pass,    setPass]    = useState("");
  const [signing, setSigning] = useState(false);
  const [authErr, setAuthErr] = useState("");

  useEffect(() => {
    fetch(`/api/portal/invite/${token}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) setError(d.error);
        else { setData(d); setEmail(d.email); }
        setLoading(false);
      })
      .catch(() => { setError("Could not load invite."); setLoading(false); });
  }, [token]);

  async function handleAccept(e: { preventDefault(): void }) {
    e.preventDefault();
    if (!pass.trim()) { setAuthErr("Enter your password."); return; }
    setSigning(true); setAuthErr("");
    const res = await signIn("credentials", { email, password: pass, redirect: false });
    if (res?.ok) {
      const s = await getSession();
      const role = (s?.user as { role?: string } | undefined)?.role;
      router.replace(role === "admin" ? "/admin" : "/portal");
    } else {
      setAuthErr("Incorrect password. Please check the credentials your manager sent you.");
      setSigning(false);
    }
  }

  if (loading) return (
    <div style={page}>
      <div style={{ color: "rgba(255,255,255,.5)", fontSize: 14 }}>Loading your invitation…</div>
    </div>
  );

  if (error) return (
    <div style={page}>
      <div style={card}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10"/>
            <path d="M15 9l-6 6M9 9l6 6"/>
          </svg>
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0a0a0a", marginBottom: 8 }}>Invite not found</h2>
        <p style={{ fontSize: 14, color: "#6b6b6b", lineHeight: 1.6 }}>{error}</p>
        <p style={{ fontSize: 13, color: "#9a9a9a", marginTop: 12 }}>
          This link may have expired or already been used.
          Please ask your project manager for a new one.
        </p>
      </div>
    </div>
  );

  return (
    <div style={page}>
      {/* Floating brand mark */}
      <div style={{ position: "absolute", top: 32, left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#b86cf9,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 18px rgba(184,108,249,.4)" }}>
          <img src="/assets/logo-mark.svg" alt="" style={{ width: 20, height: 20, filter: "brightness(0) invert(1)" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
        </div>
        <span style={{ fontWeight: 700, fontSize: 15, color: "#fff", letterSpacing: "-.01em" }}>
          Foxmen <em style={{ fontStyle: "italic", color: "#b86cf9" }}>Studio</em>
        </span>
      </div>

      <div style={card}>
        {/* Top badge */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "#b86cf9", background: "rgba(184,108,249,.1)", padding: "5px 14px", borderRadius: 50 }}>
            You have been invited
          </span>
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0a0a0a", letterSpacing: "-.03em", lineHeight: 1.2, marginBottom: 6, textAlign: "center" }}>
          Welcome, {data!.user_name.split(" ")[0]}
        </h1>
        <p style={{ fontSize: 14, color: "#6b6b6b", textAlign: "center", marginBottom: 24, lineHeight: 1.6 }}>
          Foxmen Studio has set up your dedicated client portal.
          Sign in below to track your project, chat with the team, and review milestones.
        </p>

        {/* Project card */}
        <div style={{ background: "#f9f8f7", border: "1.5px solid #ede9e3", borderRadius: 14, padding: "16px 18px", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
            <div>
              <div style={{ fontSize: 11, color: "#9a9a9a", marginBottom: 4, fontWeight: 500 }}>YOUR PROJECT</div>
              <div style={{ fontWeight: 700, fontSize: 17, color: "#0a0a0a", letterSpacing: "-.02em" }}>{data!.project_title}</div>
              {data!.service_type && <div style={{ fontSize: 12, color: "#6b6b6b", marginTop: 3 }}>{data!.service_type}</div>}
            </div>
            <span style={{
              fontSize: 11, fontWeight: 700, padding: "4px 11px", borderRadius: 50, whiteSpace: "nowrap",
              background: `${STATUS_COLOR[data!.project_status] ?? "#888"}18`,
              color: STATUS_COLOR[data!.project_status] ?? "#888",
            }}>
              {STATUS_LABEL[data!.project_status] ?? data!.project_status}
            </span>
          </div>
          {data!.description && (
            <p style={{ fontSize: 13, color: "#6b6b6b", marginTop: 10, lineHeight: 1.6, borderTop: "1px solid #ede9e3", paddingTop: 10 }}>
              {data!.description}
            </p>
          )}
          <div style={{ display: "flex", gap: 20, marginTop: 12, flexWrap: "wrap" }}>
            {data!.budget   && <div style={metaItem}><span style={metaLabel}>Budget</span><span style={metaVal}>{data!.budget}</span></div>}
            {data!.timeline && <div style={metaItem}><span style={metaLabel}>Timeline</span><span style={metaVal}>{data!.timeline}</span></div>}
          </div>
        </div>

        {/* Login form */}
        <form onSubmit={handleAccept}>
          <div style={{ marginBottom: 14 }}>
            <label style={lbl}>Email</label>
            <input value={email} readOnly style={{ ...inp, background: "#f5f4f2", color: "#6b6b6b", cursor: "default" }} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={lbl}>Password</label>
            <input
              type="password"
              placeholder="Enter the password from your invitation"
              value={pass}
              onChange={e => setPass(e.target.value)}
              style={inp}
              autoFocus
            />
          </div>
          {authErr && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#dc2626", marginBottom: 16 }}>
              {authErr}
            </div>
          )}
          <button type="submit" disabled={signing} style={{
            width: "100%", padding: "13px 20px", borderRadius: 12,
            background: signing ? "#d4a8f8" : "#b86cf9",
            color: "#fff", fontWeight: 700, fontSize: 15,
            border: "none", cursor: signing ? "not-allowed" : "pointer",
            transition: "background .15s, transform .1s",
            letterSpacing: "-.01em",
          }}>
            {signing ? "Signing in…" : "Access my portal →"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: 12, color: "#b0b0b0", marginTop: 18 }}>
          Having trouble? Contact your project manager.
        </p>
      </div>
    </div>
  );
}

const page: React.CSSProperties = {
  minHeight: "100vh",
  background: "linear-gradient(160deg, #0a0a0a 0%, #130d1f 60%, #0a0a0a 100%)",
  display: "flex", alignItems: "center", justifyContent: "center",
  padding: "80px 16px 40px",
  position: "relative",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};
const card: React.CSSProperties = {
  background: "#fff", borderRadius: 20,
  padding: "32px 32px 28px",
  width: "100%", maxWidth: 460,
  boxShadow: "0 32px 80px rgba(0,0,0,.35), 0 0 0 1px rgba(255,255,255,.06)",
};
const lbl: React.CSSProperties = {
  display: "block", fontSize: 12, fontWeight: 600,
  color: "#444", marginBottom: 6, letterSpacing: ".01em",
};
const inp: React.CSSProperties = {
  width: "100%", padding: "11px 14px", borderRadius: 10,
  border: "1.5px solid #e5e2de", fontSize: 14, color: "#0a0a0a",
  outline: "none", boxSizing: "border-box", transition: "border-color .15s",
  fontFamily: "inherit",
};
const metaItem: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 2 };
const metaLabel: React.CSSProperties = { fontSize: 10, fontWeight: 600, color: "#b0b0b0", letterSpacing: ".06em", textTransform: "uppercase" };
const metaVal: React.CSSProperties   = { fontSize: 13, fontWeight: 600, color: "#0a0a0a" };
