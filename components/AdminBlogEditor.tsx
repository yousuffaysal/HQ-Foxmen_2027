"use client";
import { useState, useEffect, useRef, useCallback } from "react";

type PostData = {
  id?: number;
  title: string;
  slug: string;
  category: string;
  author_name: string;
  author_init: string;
  read_time: string;
  status: string;
  published_at: string | null;
  excerpt: string;
  body: string;
  cover_image: string;
  tags: string;
};

type Props = {
  post: Partial<PostData>;
  onSave: (row: PostData) => void;
  onClose: () => void;
};

/* ── helpers ─────────────────────────────────────────────────────────────── */
function toSlug(t: string) {
  return t.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}
function autoInitials(name: string) {
  return name.split(" ").map(w => w[0] ?? "").join("").toUpperCase().slice(0, 2);
}
function calcReadTime(body: string) {
  const w = body.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(w / 220))} min read`;
}

/* ── markdown parser ─────────────────────────────────────────────────────── */
function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function inline(t: string): string {
  return t
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1"/>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    .replace(/`([^`]+)`/g, '<code class="ic">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/__([^_]+)__/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/_([^_]+)_/g, "<em>$1</em>")
    .replace(/~~([^~]+)~~/g, "<del>$1</del>");
}
function blockText(text: string): string {
  const lines = text.split("\n");
  const out: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const hm = line.match(/^(#{1,3})\s+(.+)/);
    if (hm) { out.push(`<h${hm[1].length}>${inline(hm[2])}</h${hm[1].length}>`); i++; continue; }
    if (/^(-{3,}|\*{3,})$/.test(line.trim())) { out.push("<hr/>"); i++; continue; }
    if (line.startsWith("> ")) {
      const ql: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) { ql.push(lines[i].slice(2)); i++; }
      out.push(`<blockquote>${blockText(ql.join("\n"))}</blockquote>`); continue;
    }
    if (/^[-*+]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*+]\s/.test(lines[i])) { items.push(`<li>${inline(lines[i].slice(2))}</li>`); i++; }
      out.push(`<ul>${items.join("")}</ul>`); continue;
    }
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) { items.push(`<li>${inline(lines[i].replace(/^\d+\.\s/, ""))}</li>`); i++; }
      out.push(`<ol>${items.join("")}</ol>`); continue;
    }
    if (!line.trim()) { out.push("<br/>"); i++; continue; }
    const pl: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^#/.test(lines[i]) && !/^[-*+]\s/.test(lines[i]) && !/^\d+\.\s/.test(lines[i]) && !lines[i].startsWith("> ") && !/^(-{3,}|\*{3,})$/.test(lines[i].trim())) {
      pl.push(lines[i]); i++;
    }
    out.push(`<p>${inline(pl.join(" "))}</p>`);
  }
  return out.join("\n");
}
function parseMarkdown(raw: string): string {
  const segs: Array<{ code: true; lang: string; content: string } | { code: false; content: string }> = [];
  const re = /```(\w*)\n?([\s\S]*?)```/g;
  let last = 0; let m: RegExpExecArray | null;
  while ((m = re.exec(raw)) !== null) {
    if (m.index > last) segs.push({ code: false, content: raw.slice(last, m.index) });
    segs.push({ code: true, lang: m[1] || "text", content: m[2] });
    last = m.index + m[0].length;
  }
  if (last < raw.length) segs.push({ code: false, content: raw.slice(last) });
  return segs.map(s => {
    if (!s.code) return blockText(s.content);
    if (s.lang === "mermaid") return `<div class="mermaid">${esc(s.content.trim())}</div>`;
    if (s.lang === "chart") {
      try {
        const d = JSON.parse(s.content);
        return `<div class="chart-wrap" data-chart='${esc(s.content)}'></div>`;
      } catch { /* fall through */ }
    }
    const langHl = syntaxHighlight(s.content, s.lang);
    return `<pre class="cb" data-lang="${esc(s.lang)}"><code>${langHl}</code></pre>`;
  }).join("");
}
function syntaxHighlight(code: string, lang: string): string {
  let h = esc(code);
  if (["js","ts","jsx","tsx","javascript","typescript"].includes(lang)) {
    h = h.replace(/(\/\/[^\n]*)/g, '<span class="cm">$1</span>');
    h = h.replace(/(&quot;(?:[^&]|&(?!quot;))*&quot;|&#39;[^]*?&#39;)/g, '<span class="cs">$1</span>');
    h = h.replace(/\b(const|let|var|function|return|if|else|for|while|class|import|export|default|async|await|try|catch|throw|new|typeof|null|undefined|true|false|void|type|interface|extends|implements)\b/g, '<span class="ck">$1</span>');
    h = h.replace(/\b(\d+\.?\d*)\b/g, '<span class="cn">$1</span>');
  }
  if (["css","scss"].includes(lang)) {
    h = h.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="cm">$1</span>');
    h = h.replace(/([.#][\w-]+)/g, '<span class="cs">$1</span>');
    h = h.replace(/\b(color|background|margin|padding|font|display|flex|grid|width|height|border|position|top|left|right|bottom|opacity|transform|transition|overflow)\b/g, '<span class="ck">$1</span>');
  }
  if (["html","xml"].includes(lang)) {
    h = h.replace(/(&lt;[^&]*&gt;)/g, '<span class="ct">$1</span>');
    h = h.replace(/(&quot;[^&quot;]*&quot;)/g, '<span class="cs">$1</span>');
  }
  if (["python","py"].includes(lang)) {
    h = h.replace(/(#[^\n]*)/g, '<span class="cm">$1</span>');
    h = h.replace(/(&quot;[^&]*&quot;|&#39;[^]*?&#39;)/g, '<span class="cs">$1</span>');
    h = h.replace(/\b(def|class|import|from|return|if|else|elif|for|while|in|not|and|or|True|False|None|try|except|with|as|lambda|pass|break|continue)\b/g, '<span class="ck">$1</span>');
  }
  if (["sql"].includes(lang)) {
    h = h.replace(/\b(SELECT|FROM|WHERE|JOIN|LEFT|RIGHT|INNER|ON|AND|OR|NOT|IN|IS|NULL|ORDER|BY|GROUP|HAVING|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|DROP|INDEX|LIMIT|OFFSET|AS|DISTINCT|COUNT|SUM|AVG|MAX|MIN)\b/gi, '<span class="ck">$1</span>');
  }
  return h;
}

/* ── preview HTML ─────────────────────────────────────────────────────────── */
function buildPreview(body: string, title: string, cover: string, excerpt: string, author: string, category: string): string {
  const html = parseMarkdown(body);
  const hasMermaid = body.includes("```mermaid");
  const hasChart = body.includes("```chart");
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,'Segoe UI',sans-serif;color:#0a0a0a;background:#fff;padding:40px 48px 80px;max-width:760px;margin:0 auto;line-height:1.72;font-size:15px}
h1{font-size:2.2em;font-weight:800;letter-spacing:-.04em;margin:1.4em 0 .4em;line-height:1.1}
h2{font-size:1.5em;font-weight:700;letter-spacing:-.03em;margin:1.3em 0 .4em}
h3{font-size:1.2em;font-weight:700;margin:1.1em 0 .3em}
p{margin:0 0 1.1em}
strong{font-weight:700}em{font-style:italic}del{text-decoration:line-through;color:#888}
a{color:#b86cf9;text-decoration:none}a:hover{text-decoration:underline}
img{max-width:100%;border-radius:10px;display:block;margin:1em 0}
ul,ol{margin:0 0 1.1em;padding-left:1.8em}li{margin-bottom:.35em}
blockquote{border-left:3px solid #b86cf9;margin:1.4em 0;padding:10px 18px;background:#faf5ff;border-radius:0 10px 10px 0;color:#444}
hr{border:none;border-top:2px solid #f0ede8;margin:2em 0}
pre.cb{background:#0f0f0f;color:#e4e4e7;border-radius:12px;padding:20px 22px;overflow-x:auto;margin:1.4em 0;position:relative;font-size:13px;line-height:1.65;font-family:'SF Mono','Fira Code',monospace}
pre.cb::before{content:attr(data-lang);position:absolute;top:10px;right:14px;font-size:10px;color:#555;text-transform:uppercase;letter-spacing:.1em;font-family:monospace}
code.ic{background:#f4f0ff;color:#6c3fc5;padding:2px 7px;border-radius:5px;font-size:.88em;font-family:'SF Mono','Fira Code',monospace}
.cm{color:#6b7280}.cs{color:#86efac}.ck{color:#93c5fd;font-weight:600}.cn{color:#fbbf24}.ct{color:#f9a8d4}
.cover-img{width:100%;max-height:380px;object-fit:cover;border-radius:14px;margin-bottom:28px}
.meta{display:flex;align-items:center;gap:10px;font-size:13px;color:#888;margin-bottom:20px;flex-wrap:wrap}
.meta .cat{background:#f0e9ff;color:#6c3fc5;padding:3px 11px;border-radius:50;font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:.06em}
.post-title{font-size:2.5em;font-weight:800;letter-spacing:-.04em;line-height:1.1;margin-bottom:12px}
.excerpt{font-size:1.1em;color:#555;line-height:1.65;margin-bottom:32px;font-style:italic}
.divider{height:1px;background:#f0ede8;margin:28px 0}
.mermaid{margin:1.4em 0;overflow:auto}
.chart-wrap{margin:1.4em 0}
</style>
${hasMermaid ? `<script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>` : ""}
${hasChart ? `<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>` : ""}
</head><body>
${cover ? `<img src="${esc(cover)}" class="cover-img" alt="${esc(title)}"/>` : ""}
<div class="meta">${category ? `<span class="cat">${esc(category)}</span>` : ""}${author ? `<span>${esc(author)}</span>` : ""}</div>
${title ? `<div class="post-title">${esc(title)}</div>` : ""}
${excerpt ? `<div class="excerpt">${esc(excerpt)}</div><div class="divider"></div>` : ""}
<div class="body-content">${html}</div>
${hasMermaid ? `<script>mermaid.initialize({startOnLoad:true,theme:"default"});</script>` : ""}
${hasChart ? `<script>
document.querySelectorAll('.chart-wrap').forEach(el=>{
  try{
    const d=JSON.parse(el.dataset.chart||'{}');
    const canvas=document.createElement('canvas');
    el.appendChild(canvas);
    new Chart(canvas,{type:d.type||'bar',data:{labels:d.labels||[],datasets:[{data:d.data||[],backgroundColor:d.colors||['#b86cf9','#7c3aed','#60a5fa','#34d399','#fbbf24','#f87171']}]},options:{responsive:true,plugins:{legend:{display:!!d.legend}}}});
  }catch(e){}
});
</script>` : ""}
</body></html>`;
}

/* ── toolbar insert ───────────────────────────────────────────────────────── */
function insertText(ta: HTMLTextAreaElement, before: string, after = "", placeholder = "") {
  const s = ta.selectionStart, e = ta.selectionEnd;
  const sel = ta.value.slice(s, e) || placeholder;
  const next = ta.value.slice(0, s) + before + sel + after + ta.value.slice(e);
  const npos = s + before.length + sel.length;
  Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")!.set!.call(ta, next);
  ta.dispatchEvent(new Event("input", { bubbles: true }));
  ta.setSelectionRange(npos, npos);
  ta.focus();
}

/* ── toolbar button ───────────────────────────────────────────────────────── */
function TB({ title, onClick, children, sep }: { title: string; onClick: () => void; children: React.ReactNode; sep?: boolean }) {
  return (
    <>
      {sep && <span style={{ width: 1, height: 18, background: "#e5e2de", flexShrink: 0 }} />}
      <button title={title} onClick={onClick} style={{ padding: "5px 7px", border: "none", background: "none", cursor: "pointer", color: "#444", borderRadius: 5, display: "flex", alignItems: "center", gap: 3, fontSize: 12, fontWeight: 600, transition: "background .12s" }}
        onMouseEnter={e => (e.currentTarget.style.background = "#f0ede8")} onMouseLeave={e => (e.currentTarget.style.background = "none")}>
        {children}
      </button>
    </>
  );
}

/* ── main component ───────────────────────────────────────────────────────── */
export default function AdminBlogEditor({ post, onSave, onClose }: Props) {
  const [data, setData] = useState<PostData>({
    title: post.title ?? "",
    slug: post.slug ?? "",
    category: post.category ?? "Design",
    author_name: post.author_name ?? "",
    author_init: post.author_init ?? "",
    read_time: post.read_time ?? "",
    status: post.status ?? "draft",
    published_at: post.published_at ?? null,
    excerpt: post.excerpt ?? "",
    body: post.body ?? "",
    cover_image: post.cover_image ?? "",
    tags: post.tags ?? "",
    id: post.id,
  });
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");
  const [uploadingImg, setUploadingImg] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [toast, setToast] = useState("");
  const taRef = useRef<HTMLTextAreaElement>(null);
  const inlineImgRef = useRef<HTMLInputElement>(null);
  const coverImgRef = useRef<HTMLInputElement>(null);

  const set = useCallback(<K extends keyof PostData>(k: K, v: PostData[K]) => {
    setData(d => ({ ...d, [k]: v }));
  }, []);

  // auto-slug from title (only if slug is empty or was auto-generated from previous title)
  useEffect(() => {
    if (!post.id) set("slug", toSlug(data.title));
  }, [data.title]);

  // rebuild preview HTML
  useEffect(() => {
    if (!showPreview) return;
    setPreviewHtml(buildPreview(data.body, data.title, data.cover_image, data.excerpt, data.author_name, data.category));
  }, [showPreview, data.body, data.title, data.cover_image, data.excerpt, data.author_name, data.category]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const save = async () => {
    if (!data.title.trim()) { showToast("Title is required."); return; }
    setSaving(true);
    const payload = { ...data, author_init: data.author_init || autoInitials(data.author_name), read_time: data.read_time || calcReadTime(data.body), published_at: data.status === "live" && !data.published_at ? new Date().toISOString() : data.published_at };
    const url = data.id ? `/api/blog/${data.id}` : "/api/blog";
    const res = await fetch(url, { method: data.id ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }).catch(() => null);
    if (res?.ok) {
      const row = await res.json();
      onSave({ ...payload, ...row });
      showToast("Saved!");
    } else {
      showToast("Error saving post.");
    }
    setSaving(false);
  };

  const uploadCover = async (file: File) => {
    setUploadingCover(true);
    const fd = new FormData(); fd.append("file", file);
    const r = await fetch("/api/upload", { method: "POST", body: fd }).then(r => r.json()).catch(() => ({}));
    if (r.url) set("cover_image", r.url); else showToast("Upload failed.");
    setUploadingCover(false);
  };

  const uploadInlineImg = async (file: File) => {
    setUploadingImg(true);
    const fd = new FormData(); fd.append("file", file);
    const r = await fetch("/api/upload", { method: "POST", body: fd }).then(r => r.json()).catch(() => ({}));
    if (r.url && taRef.current) {
      insertText(taRef.current, `![${file.name}](${r.url})`);
      set("body", taRef.current.value);
    } else showToast("Upload failed.");
    setUploadingImg(false);
  };

  const ta = taRef.current;
  const ins = (before: string, after = "", ph = "") => { if (ta) { insertText(ta, before, after, ph); set("body", ta.value); } };

  const CATS = ["Design","Engineering","AI","Studio","Case studies","Product","Opinion"];
  const STATUSES = [{ v: "draft", label: "Draft", col: "#888" }, { v: "review", label: "In Review", col: "#d97706" }, { v: "live", label: "Live", col: "#16a34a" }];

  return (
    <div style={{ position: "fixed", inset: 0, background: "#f7f6f4", zIndex: 500, display: "flex", flexDirection: "column", fontFamily: "var(--f-sans)" }}>

      {/* ── TOP BAR ── */}
      <div style={{ background: "#fff", borderBottom: "1.5px solid #e5e2de", padding: "0 20px", height: 56, display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <button onClick={onClose} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "#666", fontSize: 13, padding: "5px 8px", borderRadius: 7 }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#f0ede8"; }} onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "none"; }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
          Journal
        </button>
        <div style={{ width: 1, height: 20, background: "#e5e2de" }} />
        <input value={data.title} onChange={e => set("title", e.target.value)} placeholder="Post title…"
          style={{ flex: 1, border: "none", background: "none", fontSize: 16, fontWeight: 700, color: "#0a0a0a", outline: "none", letterSpacing: "-.01em" }} />
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {/* Status selector */}
          <div style={{ display: "flex", gap: 2, background: "#f7f6f4", border: "1.5px solid #e5e2de", borderRadius: 8, padding: 3 }}>
            {STATUSES.map(s => (
              <button key={s.v} onClick={() => set("status", s.v)} style={{ padding: "4px 12px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, background: data.status === s.v ? "#fff" : "transparent", color: data.status === s.v ? s.col : "#888", boxShadow: data.status === s.v ? "0 1px 4px rgba(0,0,0,.08)" : "none", transition: "all .12s", letterSpacing: ".02em" }}>
                {s.label}
              </button>
            ))}
          </div>
          <button onClick={() => setShowPreview(p => !p)} style={{ padding: "7px 14px", border: "1.5px solid #e5e2de", borderRadius: 8, background: showPreview ? "#f0e9ff" : "#fff", color: showPreview ? "var(--brand)" : "#444", cursor: "pointer", fontSize: 12, fontWeight: 600, transition: "all .12s" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 5, verticalAlign: "middle" }}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            Preview
          </button>
          <button onClick={save} disabled={saving} style={{ padding: "8px 20px", border: "none", borderRadius: 8, background: saving ? "#d4a8f8" : "var(--brand)", color: "#fff", fontWeight: 700, fontSize: 13, cursor: saving ? "not-allowed" : "pointer" }}>
            {saving ? "Saving…" : data.id ? "Update" : "Publish"}
          </button>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* ── SIDEBAR ── */}
        <div style={{ width: 260, flexShrink: 0, borderRight: "1.5px solid #e5e2de", background: "#fff", overflowY: "auto", padding: "18px 16px", display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Cover image */}
          <div>
            <label style={lbl}>Cover image</label>
            {data.cover_image ? (
              <div style={{ position: "relative", marginBottom: 6 }}>
                <img src={data.cover_image} style={{ width: "100%", height: 100, objectFit: "cover", borderRadius: 8, border: "1.5px solid #e5e2de" }} alt="" />
                <button onClick={() => set("cover_image", "")} style={{ position: "absolute", top: 6, right: 6, width: 22, height: 22, borderRadius: "50%", background: "rgba(0,0,0,.6)", border: "none", cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>×</button>
              </div>
            ) : (
              <div onClick={() => coverImgRef.current?.click()} style={{ border: "2px dashed #e5e2de", borderRadius: 8, padding: "16px 10px", textAlign: "center", cursor: "pointer", background: "#faf9f8", transition: "border-color .15s" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--brand)")} onMouseLeave={e => (e.currentTarget.style.borderColor = "#e5e2de")}>
                {uploadingCover ? <span style={{ fontSize: 12, color: "#888" }}>Uploading…</span> : <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.8" style={{ display: "block", margin: "0 auto 6px" }}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/></svg>
                  <span style={{ fontSize: 11, color: "#888" }}>Click to upload cover</span>
                </>}
              </div>
            )}
            <input ref={coverImgRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => { if (e.target.files?.[0]) uploadCover(e.target.files[0]); e.target.value = ""; }} />
          </div>

          {/* Slug */}
          <div>
            <label style={lbl}>Slug</label>
            <input value={data.slug} onChange={e => set("slug", e.target.value)} style={inp} placeholder="auto-generated" />
          </div>

          {/* Category */}
          <div>
            <label style={lbl}>Category</label>
            <select value={data.category} onChange={e => set("category", e.target.value)} style={{ ...inp, background: "#fff" }}>
              {CATS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label style={lbl}>Tags <span style={{ fontWeight: 400, color: "#aaa" }}>(comma-separated)</span></label>
            <input value={data.tags} onChange={e => set("tags", e.target.value)} style={inp} placeholder="react, design, ai" />
          </div>

          {/* Author */}
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1 }}>
              <label style={lbl}>Author name</label>
              <input value={data.author_name} onChange={e => set("author_name", e.target.value)} style={inp} placeholder="Devon Arias" />
            </div>
            <div style={{ width: 60 }}>
              <label style={lbl}>Initials</label>
              <input value={data.author_init} onChange={e => set("author_init", e.target.value)} style={inp} placeholder={autoInitials(data.author_name) || "DA"} maxLength={2} />
            </div>
          </div>

          {/* Read time */}
          <div>
            <label style={{ ...lbl, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              Read time
              <button onClick={() => set("read_time", calcReadTime(data.body))} style={{ fontSize: 10, color: "var(--brand)", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Auto-calc</button>
            </label>
            <input value={data.read_time} onChange={e => set("read_time", e.target.value)} style={inp} placeholder="5 min read" />
          </div>

          {/* Excerpt */}
          <div>
            <label style={lbl}>Excerpt / description</label>
            <textarea value={data.excerpt} onChange={e => set("excerpt", e.target.value)} rows={3} style={{ ...inp, resize: "vertical", lineHeight: 1.55 }} placeholder="One or two sentences about the post…" />
          </div>

          {/* Published date */}
          <div>
            <label style={lbl}>Published date</label>
            <input type="date" value={data.published_at ? data.published_at.slice(0, 10) : ""} onChange={e => set("published_at", e.target.value ? new Date(e.target.value).toISOString() : null)} style={inp} />
          </div>
        </div>

        {/* ── EDITOR ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Toolbar */}
          <div style={{ background: "#fff", borderBottom: "1.5px solid #e5e2de", padding: "5px 12px", display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap", flexShrink: 0 }}>
            <TB title="Heading 1" onClick={() => ins("# ", "", "Heading 1")}><b>H1</b></TB>
            <TB title="Heading 2" onClick={() => ins("## ", "", "Heading 2")}><b>H2</b></TB>
            <TB title="Heading 3" onClick={() => ins("### ", "", "Heading 3")}><b>H3</b></TB>
            <TB title="Bold" sep onClick={() => ins("**", "**", "bold text")}><b>B</b></TB>
            <TB title="Italic" onClick={() => ins("*", "*", "italic text")}><i>I</i></TB>
            <TB title="Strikethrough" onClick={() => ins("~~", "~~", "text")}><del>S</del></TB>
            <TB title="Inline code" sep onClick={() => ins("`", "`", "code")}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            </TB>
            <TB title="Code block" onClick={() => ins("```js\n", "\n```", "// your code here")}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M8 10l-3 2 3 2M16 10l3 2-3 2M12 8l-2 8"/></svg>
              Block
            </TB>
            <TB title="Blockquote" sep onClick={() => ins("> ", "", "quote")}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
            </TB>
            <TB title="Horizontal rule" onClick={() => ins("\n---\n")}>—</TB>
            <TB title="Unordered list" sep onClick={() => ins("- ", "", "list item")}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1.5" fill="currentColor"/><circle cx="4" cy="12" r="1.5" fill="currentColor"/><circle cx="4" cy="18" r="1.5" fill="currentColor"/></svg>
            </TB>
            <TB title="Ordered list" onClick={() => ins("1. ", "", "list item")}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4M4 10h2M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>
            </TB>
            <TB title="Link" sep onClick={() => ins("[", "](https://)", "link text")}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            </TB>
            <TB title="Insert image" onClick={() => inlineImgRef.current?.click()}>
              {uploadingImg ? "…" : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/></svg>}
            </TB>
            <TB title="Mermaid diagram" sep onClick={() => ins("```mermaid\ngraph TD\n    A[Start] --> B{Decision}\n    B -->|Yes| C[Action]\n    B -->|No| D[End]\n```\n")}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><line x1="12" y1="7" x2="5" y2="17"/><line x1="12" y1="7" x2="19" y2="17"/></svg>
              Diagram
            </TB>
            <TB title="Chart (JSON data)" onClick={() => ins('```chart\n{\n  "type": "bar",\n  "labels": ["Jan","Feb","Mar"],\n  "data": [12, 25, 18],\n  "legend": false\n}\n```\n')}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>
              Chart
            </TB>
          </div>

          {/* Editor + Preview split */}
          <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
            <textarea
              ref={taRef}
              value={data.body}
              onChange={e => set("body", e.target.value)}
              onKeyDown={e => {
                if (e.key === "Tab") {
                  e.preventDefault();
                  insertText(e.currentTarget, "  ");
                  set("body", e.currentTarget.value);
                }
              }}
              placeholder={`Start writing in Markdown…\n\n# Use headings to structure your post\n\nWrite **bold** or *italic* text, or add \`inline code\`.\n\n\`\`\`javascript\n// Fenced code blocks get syntax highlighting\nconst hello = "world";\n\`\`\`\n\nUse the toolbar above to insert diagrams, charts, images, and more.`}
              style={{ flex: 1, border: "none", outline: "none", padding: "24px 28px", fontSize: 14, lineHeight: 1.75, fontFamily: "'SF Mono','Fira Code',monospace", background: "#fafaf8", resize: "none", color: "#1a1a1a", height: "100%" }}
              spellCheck
            />
            {showPreview && (
              <div style={{ flex: 1, borderLeft: "1.5px solid #e5e2de", overflow: "hidden" }}>
                <iframe srcDoc={previewHtml} style={{ width: "100%", height: "100%", border: "none" }} title="preview" sandbox="allow-scripts allow-same-origin" />
              </div>
            )}
          </div>

          {/* Status bar */}
          <div style={{ background: "#fff", borderTop: "1px solid #e5e2de", padding: "5px 16px", display: "flex", gap: 16, fontSize: 11, color: "#aaa", flexShrink: 0 }}>
            <span>{data.body.trim().split(/\s+/).filter(Boolean).length} words</span>
            <span>{data.body.length} chars</span>
            <span>{calcReadTime(data.body)}</span>
            {data.slug && <span>/{data.slug}</span>}
          </div>
        </div>
      </div>

      {/* hidden inputs */}
      <input ref={inlineImgRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => { if (e.target.files?.[0]) uploadInlineImg(e.target.files[0]); e.target.value = ""; }} />

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "#0a0a0a", color: "#fff", padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600, zIndex: 600, pointerEvents: "none" }}>
          {toast}
        </div>
      )}
    </div>
  );
}

const lbl: React.CSSProperties = { display: "block", fontSize: 10, fontWeight: 700, color: "#888", marginBottom: 5, letterSpacing: ".06em", textTransform: "uppercase" };
const inp: React.CSSProperties = { width: "100%", padding: "8px 10px", border: "1.5px solid #e5e2de", borderRadius: 8, fontSize: 12, outline: "none", boxSizing: "border-box", fontFamily: "inherit", color: "#0a0a0a" };
