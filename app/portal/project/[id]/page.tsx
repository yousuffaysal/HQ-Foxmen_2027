"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { getPusherClient } from "@/lib/pusher";

type Milestone = { id: number; title: string; description: string; status: string; due_date: string; completed_at: string | null; ord: number };
type Message = { id: number; project_id: number; sender_id: number; sender_name: string; sender_role: string; message: string; created_at: string };
type Project = {
  id: number; title: string; service_type: string; status: string;
  description: string; budget: string; timeline: string; website: string;
  admin_note: string; created_at: string; updated_at: string;
  milestones: Milestone[];
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending", in_progress: "In Progress", review: "In Review",
  completed: "Completed", on_hold: "On Hold",
};
const STATUS_COLOR: Record<string, string> = {
  pending: "#f59e0b", in_progress: "var(--brand)", review: "#3b82f6",
  completed: "#22c55e", on_hold: "#888",
};
const MILESTONE_STATUS_COLOR: Record<string, string> = {
  pending: "#e5e7eb", active: "var(--brand)", completed: "#22c55e",
};

export default function ProjectDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"timeline" | "chat" | "details">("timeline");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const pusherRef = useRef<ReturnType<typeof getPusherClient>>(null);

  const load = useCallback(async () => {
    const [pRes, mRes] = await Promise.all([
      fetch(`/api/portal/projects/${projectId}`),
      fetch(`/api/portal/messages?project_id=${projectId}`),
    ]);
    if (pRes.status === 403 || pRes.status === 401) { router.push("/portal"); return; }
    if (pRes.ok) setProject(await pRes.json());
    if (mRes.ok) setMessages(await mRes.json());
    setLoading(false);
  }, [projectId, router]);

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/login"); return; }
    if (status === "authenticated") load();
  }, [status, router, load]);

  useEffect(() => {
    if (!session?.user) return;
    const pusher = getPusherClient();
    if (!pusher) return;
    pusherRef.current = pusher;

    const ch = pusher.subscribe(`private-project-${projectId}`);
    ch.bind("new-message", (msg: Message) => {
      setMessages(prev => {
        if (prev.some(m => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    });
    ch.bind("project-updated", (updated: Project) => {
      setProject(prev => prev ? { ...prev, ...updated } : updated);
    });
    ch.bind("milestone-added", (m: Milestone) => {
      setProject(prev => prev ? { ...prev, milestones: [...prev.milestones, m] } : prev);
    });
    ch.bind("milestone-updated", (m: Milestone) => {
      setProject(prev => prev ? {
        ...prev,
        milestones: prev.milestones.map(ms => ms.id === m.id ? m : ms),
      } : prev);
    });

    return () => {
      pusher.unsubscribe(`private-project-${projectId}`);
    };
  }, [session, projectId]);

  useEffect(() => {
    if (tab === "chat") chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, tab]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || sending) return;
    setSending(true);
    const res = await fetch("/api/portal/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project_id: projectId, message: text.trim() }),
    });
    if (res.ok) {
      const msg = await res.json();
      setMessages(prev => prev.some(m => m.id === msg.id) ? prev : [...prev, msg]);
      setText("");
    }
    setSending(false);
  }

  if (status === "loading" || loading) return <LoadingScreen />;
  if (!project) return <div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>Project not found.</div>;

  const uid = (session!.user as { id?: string }).id;
  const totalMilestones = project.milestones.length;
  const doneMilestones = project.milestones.filter(m => m.status === "completed").length;
  const pct = totalMilestones > 0 ? Math.round((doneMilestones / totalMilestones) * 100) : 0;

  return (
    <div style={{ minHeight: "100vh", background: "#f8f7f5" }}>
      {/* Header */}
      <header style={{ background: "#fff", borderBottom: "1px solid var(--line)", padding: "0 20px", height: 56, display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 0, zIndex: 100 }}>
        <button onClick={() => router.push("/portal")}
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", display: "flex", alignItems: "center", gap: 6, fontSize: 13, padding: "6px 0" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Portal
        </button>
        <span style={{ color: "var(--line)" }}>/</span>
        <span style={{ fontSize: 14, fontWeight: 500, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{project.title}</span>
        <StatusBadge status={project.status} />
      </header>

      <div style={{ maxWidth: 840, margin: "0 auto", padding: "24px 16px" }}>
        {/* Title block */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 26, fontWeight: 400, letterSpacing: "-0.02em", marginBottom: 6 }}>{project.title}</h1>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 13, color: "var(--muted)" }}>
            {project.service_type && <span>📌 {project.service_type}</span>}
            {project.budget && <span>💰 {project.budget}</span>}
            {project.timeline && <span>📅 {project.timeline}</span>}
          </div>
        </div>

        {/* Progress bar */}
        {totalMilestones > 0 && (
          <div style={{ background: "#fff", borderRadius: 14, border: "1.5px solid var(--line)", padding: "18px 20px", marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 14, fontWeight: 500 }}>Overall Progress</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: pct === 100 ? "#22c55e" : "var(--brand)" }}>{pct}%</span>
            </div>
            <div style={{ height: 6, background: "var(--line)", borderRadius: 6, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? "#22c55e" : "var(--brand)", borderRadius: 6, transition: "width 0.6s ease" }} />
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>{doneMilestones} of {totalMilestones} milestones complete</div>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 20, background: "#fff", borderRadius: 12, padding: 4, border: "1.5px solid var(--line)", width: "fit-content" }}>
          {(["timeline", "chat", "details"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding: "7px 18px", borderRadius: 9, border: "none", fontSize: 13, fontWeight: 500, cursor: "pointer", background: tab === t ? "var(--ink)" : "transparent", color: tab === t ? "#fff" : "var(--muted)", transition: "all 0.15s", position: "relative" }}>
              {t === "chat" && messages.length > 0 && tab !== "chat" && <span style={{ position: "absolute", top: 4, right: 4, width: 6, height: 6, borderRadius: "50%", background: "var(--brand)" }} />}
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Timeline tab */}
        {tab === "timeline" && (
          <div>
            {project.milestones.length === 0 ? (
              <div style={{ background: "#fff", borderRadius: 14, border: "1.5px dashed var(--line)", padding: "40px 24px", textAlign: "center", color: "var(--muted)", fontSize: 14 }}>
                Milestones will appear here once your project kicks off.
              </div>
            ) : (
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: 18, top: 0, bottom: 0, width: 2, background: "var(--line)", zIndex: 0 }} />
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {project.milestones.sort((a, b) => a.ord - b.ord).map((m, i) => (
                    <MilestoneRow key={m.id} milestone={m} index={i} />
                  ))}
                </div>
              </div>
            )}

            {project.admin_note && (
              <div style={{ marginTop: 20, background: "#fff", border: "1.5px solid var(--line)", borderRadius: 14, padding: "16px 20px" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Note from Foxmen</div>
                <div style={{ fontSize: 14, lineHeight: 1.6 }}>{project.admin_note}</div>
              </div>
            )}
          </div>
        )}

        {/* Chat tab */}
        {tab === "chat" && (
          <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 280px)", minHeight: 400 }}>
            <div style={{ flex: 1, overflowY: "auto", background: "#fff", borderRadius: 14, border: "1.5px solid var(--line)", padding: "16px", display: "flex", flexDirection: "column", gap: 12 }}>
              {messages.length === 0 && (
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", fontSize: 14 }}>
                  Send a message to start the conversation.
                </div>
              )}
              {messages.map(m => {
                const isMe = String(m.sender_id) === String(uid);
                const isAdmin = m.sender_role === "admin";
                return (
                  <div key={m.id} style={{ display: "flex", flexDirection: isMe ? "row-reverse" : "row", gap: 10, alignItems: "flex-end" }}>
                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: isAdmin ? "var(--brand)" : "var(--line)", color: isAdmin ? "#fff" : "var(--muted)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600 }}>
                      {m.sender_name.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ maxWidth: "70%" }}>
                      <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4, textAlign: isMe ? "right" : "left" }}>
                        {isAdmin ? "Foxmen Studio" : m.sender_name}
                        {" · "}{new Date(m.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                      <div style={{ background: isMe ? "var(--ink)" : "#f3f4f6", color: isMe ? "#fff" : "var(--ink)", borderRadius: isMe ? "14px 14px 4px 14px" : "14px 14px 14px 4px", padding: "10px 14px", fontSize: 14, lineHeight: 1.5, wordBreak: "break-word" }}>
                        {m.message}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={sendMessage} style={{ display: "flex", gap: 10, marginTop: 12 }}>
              <input
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Type a message…"
                style={{ flex: 1, padding: "12px 16px", borderRadius: 50, border: "1.5px solid var(--line)", fontSize: 14, background: "#fff", color: "var(--ink)", outline: "none", fontFamily: "inherit" }}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(e as unknown as React.FormEvent); } }}
              />
              <button type="submit" disabled={!text.trim() || sending}
                style={{ background: "var(--brand)", color: "#fff", border: "none", borderRadius: 50, width: 46, height: 46, cursor: !text.trim() || sending ? "not-allowed" : "pointer", opacity: !text.trim() || sending ? 0.5 : 1, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
              </button>
            </form>
          </div>
        )}

        {/* Details tab */}
        {tab === "details" && (
          <div style={{ background: "#fff", borderRadius: 14, border: "1.5px solid var(--line)", overflow: "hidden" }}>
            {[
              ["Service Type", project.service_type],
              ["Budget", project.budget],
              ["Timeline", project.timeline],
              ["Website", project.website],
              ["Description", project.description],
              ["Submitted", new Date(project.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })],
            ].filter(([, v]) => v).map(([k, v], i) => (
              <div key={k} style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 16, padding: "14px 20px", borderBottom: i < 5 ? "1px solid var(--line)" : undefined }}>
                <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 500 }}>{k}</span>
                <span style={{ fontSize: 14 }}>{v}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MilestoneRow({ milestone: m, index }: { milestone: Milestone; index: number }) {
  const isDone = m.status === "completed";
  const isActive = m.status === "active";
  return (
    <div style={{ display: "flex", gap: 16, position: "relative", paddingBottom: 24 }}>
      <div style={{ position: "relative", zIndex: 1, flexShrink: 0, width: 38, display: "flex", justifyContent: "center" }}>
        <div style={{ width: 18, height: 18, borderRadius: "50%", background: isDone ? "#22c55e" : isActive ? "var(--brand)" : "#fff", border: `2px solid ${isDone ? "#22c55e" : isActive ? "var(--brand)" : "var(--line)"}`, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2 }}>
          {isDone && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><path d="M5 12l5 5L20 7"/></svg>}
          {isActive && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />}
        </div>
      </div>
      <div style={{ flex: 1, background: "#fff", borderRadius: 12, border: `1.5px solid ${isDone ? "#dcfce7" : isActive ? "#ede1ff" : "var(--line)"}`, padding: "14px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: m.description ? 6 : 0 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: isDone ? "#166534" : "var(--ink)" }}>{m.title}</div>
          <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 50, background: `${MILESTONE_STATUS_COLOR[m.status]}22`, color: MILESTONE_STATUS_COLOR[m.status], flexShrink: 0 }}>
            {isDone ? "Done" : isActive ? "Active" : "Upcoming"}
          </span>
        </div>
        {m.description && <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>{m.description}</div>}
        {m.completed_at && <div style={{ fontSize: 12, color: "#22c55e", marginTop: 6 }}>Completed {new Date(m.completed_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>}
        {m.due_date && !m.completed_at && <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 6 }}>Due {m.due_date}</div>}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 50, background: `${STATUS_COLOR[status] ?? "#888"}22`, color: STATUS_COLOR[status] ?? "#888", whiteSpace: "nowrap" }}>
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}

function LoadingScreen() {
  return (
    <div style={{ minHeight: "100vh", background: "#f8f7f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "var(--muted)", fontSize: 14 }}>Loading project…</div>
    </div>
  );
}
