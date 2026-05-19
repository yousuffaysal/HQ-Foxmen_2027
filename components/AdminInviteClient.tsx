"use client";
import { useState, useCallback } from "react";

type InviteResult = {
  invite_url: string;
  email: string;
  password: string;
  project_id: number;
  expires_at: string;
};

const SERVICE_TYPES = [
  "Website Design & Development",
  "Mobile App (React Native)",
  "Web App / SaaS Product",
  "E-Commerce Store",
  "AI Integration",
  "Brand Identity & Design",
  "SEO & Digital Marketing",
  "Custom Software",
  "Other",
];

function copyText(text: string, setCopied: (k: string) => void, key: string) {
  navigator.clipboard.writeText(text).then(() => {
    setCopied(key);
    setTimeout(() => setCopied(""), 1800);
  });
}

export default function AdminInviteClient() {
  const [form, setForm] = useState({
    name: "", email: "", password: "",
    project_title: "", service_type: SERVICE_TYPES[0],
    description: "", budget: "", timeline: "", website: "",
  });
  const [generating, setGenerating]   = useState(false);
  const [result, setResult]           = useState<InviteResult | null>(null);
  const [error, setError]             = useState("");
  const [copied, setCopied]           = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent,    setEmailSent]    = useState(false);
  const [emailErr,     setEmailErr]     = useState("");

  const sf = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }));

  function autoPass() {
    const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789!@#$";
    let p = "";
    for (let i = 0; i < 12; i++) p += chars[Math.floor(Math.random() * chars.length)];
    sf("password", p);
  }

  const submit = useCallback(async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setError(""); setResult(null);
    if (!form.name.trim() || !form.email.trim() || !form.project_title.trim()) {
      setError("Client name, email, and project title are required."); return;
    }
    setGenerating(true);
    let data: Record<string, unknown> = {};
    try {
      const res = await fetch("/api/portal/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const text = await res.text();
      try { data = text ? JSON.parse(text) : {}; } catch { data = {}; }
      setGenerating(false);
      if (!res.ok) { setError((data.error as string) ?? `Server error (${res.status}). Check console.`); return; }
      setResult(data as unknown as InviteResult);
    } catch (err) {
      setGenerating(false);
      setError(err instanceof Error ? err.message : "Network error. Please try again.");
    }
  }, [form]);

  function reset() {
    setResult(null); setError("");
    setEmailSent(false); setEmailErr("");
    setForm({ name: "", email: "", password: "", project_title: "", service_type: SERVICE_TYPES[0], description: "", budget: "", timeline: "", website: "" });
  }

  async function sendEmail() {
    if (!result) return;
    setEmailSending(true); setEmailErr("");
    try {
      const res  = await fetch("/api/portal/invite/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_name:   form.name,
          email:         result.email,
          password:      result.password,
          invite_url:    result.invite_url,
          project_title: form.project_title,
          service_type:  form.service_type,
        }),
      });
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      if (!res.ok) { setEmailErr(data.error ?? "Failed to send email."); }
      else { setEmailSent(true); }
    } catch (err) {
      setEmailErr(err instanceof Error ? err.message : "Network error.");
    }
    setEmailSending(false);
  }

  const fullMsg = result
    ? `Hi ${form.name.split(" ")[0]},\n\nYour Foxmen Studio client portal is ready. You can access your project updates, milestones, and chat with our team here:\n\nPortal: ${result.invite_url}\nEmail: ${result.email}\nPassword: ${result.password}\n\nThis link is valid for 14 days. After signing in you can change your password anytime.\n\nBest,\nFoxmen Studio`
    : "";

  return (
    <section className="page active" style={{ maxWidth: 900, paddingBottom: 60 }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-.02em", marginBottom: 6 }}>Invite a Client</h2>
        <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6 }}>
          Create a portal account for clients who reached out via LinkedIn, email, or any other channel outside the website.
          An invite link + credentials will be generated for you to share.
        </p>
      </div>

      {!result ? (
        <form onSubmit={submit}>
          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#dc2626", marginBottom: 20 }}>
              {error}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
            {/* Left: Client */}
            <div>
              <div style={sectionHead}>
                <div style={sectionDot("var(--brand)")} />
                Client Account
              </div>

              <div style={field}>
                <label style={lbl}>Full Name *</label>
                <input style={inp} placeholder="John Doe" value={form.name} onChange={e => sf("name", e.target.value)} />
              </div>

              <div style={field}>
                <label style={lbl}>Email Address *</label>
                <input style={inp} type="email" placeholder="john@company.com" value={form.email} onChange={e => sf("email", e.target.value)} />
              </div>

              <div style={field}>
                <label style={{ ...lbl, display: "flex", justifyContent: "space-between" }}>
                  <span>Password</span>
                  <button type="button" onClick={autoPass} style={{ fontSize: 11, color: "var(--brand)", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
                    Auto-generate
                  </button>
                </label>
                <input
                  style={inp}
                  placeholder="Leave blank to auto-generate"
                  value={form.password}
                  onChange={e => sf("password", e.target.value)}
                />
                <span style={{ fontSize: 11, color: "var(--muted)", marginTop: 5, display: "block" }}>
                  If left blank, a strong password is generated automatically.
                </span>
              </div>
            </div>

            {/* Right: Project */}
            <div>
              <div style={sectionHead}>
                <div style={sectionDot("#22c55e")} />
                Project Details
              </div>

              <div style={field}>
                <label style={lbl}>Project Title *</label>
                <input style={inp} placeholder="e.g. Hermes – SaaS Dashboard" value={form.project_title} onChange={e => sf("project_title", e.target.value)} />
              </div>

              <div style={field}>
                <label style={lbl}>Service Type</label>
                <select style={{ ...inp, appearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", paddingRight: 36 }} value={form.service_type} onChange={e => sf("service_type", e.target.value)}>
                  {SERVICE_TYPES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              <div style={field}>
                <label style={lbl}>Budget</label>
                <input style={inp} placeholder="e.g. $5,000–$8,000" value={form.budget} onChange={e => sf("budget", e.target.value)} />
              </div>

              <div style={field}>
                <label style={lbl}>Timeline</label>
                <input style={inp} placeholder="e.g. 6–8 weeks" value={form.timeline} onChange={e => sf("timeline", e.target.value)} />
              </div>
            </div>
          </div>

          <div style={{ marginTop: 4 }}>
            <div style={field}>
              <label style={lbl}>Project Description</label>
              <textarea style={{ ...inp, height: 90, resize: "vertical", lineHeight: 1.6 }} placeholder="Brief overview of what we're building…" value={form.description} onChange={e => sf("description", e.target.value)} />
            </div>
            <div style={field}>
              <label style={lbl}>Client Website / Reference</label>
              <input style={inp} placeholder="https://example.com" value={form.website} onChange={e => sf("website", e.target.value)} />
            </div>
          </div>

          <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
            <button
              type="submit"
              disabled={generating}
              style={{ background: generating ? "#d4a8f8" : "var(--brand)", color: "#fff", border: "none", borderRadius: 10, padding: "11px 28px", fontSize: 14, fontWeight: 700, cursor: generating ? "not-allowed" : "pointer", transition: "background .15s" }}
            >
              {generating ? "Creating…" : "Create account & generate invite"}
            </button>
          </div>
        </form>
      ) : (
        /* ── Result card ── */
        <div>
          <div style={{ background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: 14, padding: "18px 22px", marginBottom: 20, display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#15803d" }}>Account &amp; project created!</div>
              <div style={{ fontSize: 13, color: "#16a34a", marginTop: 2 }}>
                Share the invite link and credentials with your client.
                Link expires in 14 days.
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            {[
              { label: "Invite Link", value: result.invite_url, key: "url" },
              { label: "Email", value: result.email, key: "email" },
              { label: "Password", value: result.password, key: "pass" },
            ].map(item => (
              <div key={item.key} style={{ background: "#fff", border: "1.5px solid var(--line)", borderRadius: 12, padding: "14px 16px" }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 6 }}>{item.label}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <code style={{ flex: 1, fontSize: 13, fontFamily: "var(--f-mono, monospace)", color: "#0a0a0a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {item.value}
                  </code>
                  <button
                    onClick={() => copyText(item.value, setCopied, item.key)}
                    style={{ flexShrink: 0, background: copied === item.key ? "#22c55e" : "var(--brand)", color: "#fff", border: "none", borderRadius: 7, padding: "5px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer", transition: "background .2s", whiteSpace: "nowrap" }}
                  >
                    {copied === item.key ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
            ))}

            {/* Full message to copy */}
            <div style={{ gridColumn: "1 / -1", background: "#fff", border: "1.5px solid var(--line)", borderRadius: 12, padding: "14px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".06em" }}>Ready-to-send message</div>
                <button
                  onClick={() => copyText(fullMsg, setCopied, "msg")}
                  style={{ background: copied === "msg" ? "#22c55e" : "var(--brand)", color: "#fff", border: "none", borderRadius: 7, padding: "5px 14px", fontSize: 11, fontWeight: 600, cursor: "pointer", transition: "background .2s" }}
                >
                  {copied === "msg" ? "Copied!" : "Copy message"}
                </button>
              </div>
              <pre style={{ fontSize: 12.5, fontFamily: "-apple-system, sans-serif", color: "#444", lineHeight: 1.7, whiteSpace: "pre-wrap", margin: 0, background: "#f9f8f7", borderRadius: 8, padding: "12px 14px" }}>
                {fullMsg}
              </pre>
            </div>
          </div>

          {emailErr && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 16px", fontSize: 13, color: "#dc2626", marginBottom: 14 }}>
              {emailErr}
            </div>
          )}

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button onClick={reset} style={{ background: "var(--ink)", color: "#fff", border: "none", borderRadius: 10, padding: "10px 22px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              Invite another client
            </button>
            <button
              onClick={sendEmail}
              disabled={emailSending || emailSent}
              style={{
                background: emailSent ? "#22c55e" : "var(--brand)",
                color: "#fff", border: "none", borderRadius: 10,
                padding: "10px 22px", fontSize: 14, fontWeight: 600,
                cursor: emailSending || emailSent ? "not-allowed" : "pointer",
                opacity: emailSending ? 0.7 : 1,
                display: "flex", alignItems: "center", gap: 7, transition: "background .2s",
              }}
            >
              {emailSent ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                  Email sent!
                </>
              ) : emailSending ? (
                "Sending…"
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16v12H5l-1 4Z"/></svg>
                  Send invite email
                </>
              )}
            </button>
            <a href="/portal" target="_blank" rel="noopener" style={{ background: "none", border: "1.5px solid var(--line)", borderRadius: 10, padding: "9px 20px", fontSize: 14, fontWeight: 500, cursor: "pointer", color: "var(--ink)", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12s3-7 9-7 9 7 9 7-3 7-9 7-9-7-9-7Z"/><circle cx="12" cy="12" r="2.5"/></svg>
              Preview portal
            </a>
          </div>
        </div>
      )}
    </section>
  );
}

const field:       React.CSSProperties = { marginBottom: 16 };
const lbl:         React.CSSProperties = { display: "block", fontSize: 12, fontWeight: 600, color: "#444", marginBottom: 6, letterSpacing: ".01em" };
const inp:         React.CSSProperties = { width: "100%", padding: "10px 13px", borderRadius: 9, border: "1.5px solid var(--line)", fontSize: 13.5, color: "#0a0a0a", outline: "none", boxSizing: "border-box", fontFamily: "inherit", background: "#fff", transition: "border-color .15s" };
const sectionHead: React.CSSProperties = { display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: "#444", marginBottom: 18, paddingBottom: 10, borderBottom: "1px solid var(--line)" };
const sectionDot   = (color: string): React.CSSProperties => ({ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 });
