"use client";
import { useState, type FormEvent } from "react";
import { S } from "../style";
import { call, card, field, label, Pill, Toggle } from "./ui";
import { PROJECT_TAGS, TINTS, slug as toSlug, type SiteProject } from "@/lib/site/data";

type Draft = {
  id?: number; name: string; slug: string; slugTouched: boolean; type: string; url: string; desc: string;
  features: string; tags: string[]; latest: boolean; visible: boolean; heroImage: string; imageA: string; imageB: string; gallery: string[];
};

const blank: Draft = { name: "", slug: "", slugTouched: false, type: "", url: "", desc: "", features: "", tags: [], latest: false, visible: true, heroImage: "", imageA: "", imageB: "", gallery: [] };
const toDraft = (p: SiteProject): Draft => ({ id: p.id, name: p.name, slug: p.slug, slugTouched: true, type: p.type, url: p.url, desc: p.desc, features: p.features.join("\n"), tags: p.tags, latest: !!p.latest, visible: p.visible, heroImage: p.heroImage, imageA: p.imageA, imageB: p.imageB, gallery: p.gallery });

export default function ProjectsPanel({ items, setItems, onError }: { items: SiteProject[]; setItems: (p: SiteProject[]) => void; onError: (m: string) => void }) {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState("");

  const fail = (e: unknown) => { if ((e as Error).message !== "auth") onError((e as Error).message); };

  const toggleVisible = async (p: SiteProject) => {
    const prev = items;
    setItems(items.map(x => (x.id === p.id ? { ...x, visible: !x.visible } : x)));
    try { await call("/api/site/admin/projects", "PATCH", { id: p.id, visible: !p.visible, slug: p.slug }); } catch (e) { setItems(prev); fail(e); }
  };

  const move = async (i: number, d: -1 | 1) => {
    const j = i + d; if (j < 0 || j >= items.length) return;
    const prev = items, next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    setItems(next);
    try { await call("/api/site/admin/projects", "PATCH", { order: next.map(p => p.id) }); } catch (e) { setItems(prev); fail(e); }
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!draft || saving) return;
    setSaving(true);
    const oldSlug = draft.id ? items.find(x => x.id === draft.id)?.slug : undefined;
    const body = { ...draft, oldSlug, features: draft.features.split("\n").map(s => s.trim()).filter(Boolean) };
    try {
      if (draft.id) {
        const p = await call<SiteProject>("/api/site/admin/projects", "PUT", body);
        setItems(items.map(x => (x.id === p.id ? p : p.latest ? { ...x, latest: false } : x)));
      } else {
        const p = await call<SiteProject>("/api/site/admin/projects", "POST", body);
        setItems([...items.map(x => (p.latest ? { ...x, latest: false } : x)), p]);
      }
      setDraft(null);
    } catch (err) { fail(err); }
    setSaving(false);
  };

  const remove = async () => {
    if (!draft?.id || !confirm(`Delete "${draft.name}"? Its case study page will disappear from the site.`)) return;
    try { await call("/api/site/admin/projects", "DELETE", { id: draft.id, slug: draft.slug }); setItems(items.filter(x => x.id !== draft.id)); setDraft(null); } catch (e) { fail(e); }
  };

  // "gallery" appends to the extra screenshots; the named slots are replaced.
  const upload = async (key: "heroImage" | "imageA" | "imageB" | "gallery", file: File) => {
    setUploading(key);
    try {
      const fd = new FormData(); fd.append("file", file);
      const r = await fetch("/api/upload", { method: "POST", body: fd });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d.url) throw new Error(d.error ? "Upload failed: " + String(d.error).slice(0, 120) : "Upload failed");
      setDraft(dr => (!dr ? dr : key === "gallery" ? { ...dr, gallery: [...dr.gallery, d.url] } : { ...dr, [key]: d.url }));
    } catch (e) { fail(e); }
    setUploading("");
  };

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft(d => (d ? { ...d, [k]: v } : d));

  return (
    <>
      <div style={S("display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px;margin-bottom:16px;")}>
        <div style={S("font-size:15px;color:#5E5249;")}>{items.filter(p => p.visible).length} of {items.length} projects shown on the site. The first six appear on the home page.</div>
        <Pill onClick={() => setDraft({ ...blank })}>+ Add project</Pill>
      </div>
      <div style={S(card + "padding:8px 24px;")}>
        {items.map((p, i) => (
          <div key={p.id} style={S("display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:16px;padding:16px 0;border-bottom:1px solid rgba(31,23,18,.08);")}>
            <div style={S("display:flex;align-items:center;gap:16px;min-width:0;")}>
              <span style={S("font-family:'JetBrains Mono',monospace;font-size:13px;width:24px;")}>{String(i + 1).padStart(2, "0")}</span>
              <div style={S(`width:56px;height:42px;border-radius:14px;flex:none;background:${p.heroImage ? `center/cover no-repeat url("${p.heroImage}")` : `repeating-linear-gradient(135deg,rgba(31,23,18,.07) 0 1px,transparent 1px 8px),${TINTS[i % TINTS.length]}`};`)}></div>
              <div style={S("min-width:0;")}>
                <div style={S("font-weight:600;font-size:16px;display:flex;align-items:center;gap:8px;")}>{p.name}{p.latest ? <span style={S("font-size:11px;font-weight:600;padding:3px 8px;border-radius:999px;background:#1F1712;color:#F3EEE4;")}>Latest</span> : null}</div>
                <div style={S("font-size:14px;color:#5E5249;")}>{p.type || "No type yet"}</div>
              </div>
            </div>
            <div style={S("display:flex;align-items:center;gap:8px;")}>
              <button onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up" style={S(`width:34px;height:34px;border-radius:999px;border:none;background:#EAE3D6;cursor:pointer;opacity:${i === 0 ? ".35" : "1"};`)}>↑</button>
              <button onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Move down" style={S(`width:34px;height:34px;border-radius:999px;border:none;background:#EAE3D6;cursor:pointer;opacity:${i === items.length - 1 ? ".35" : "1"};`)}>↓</button>
              <Pill dark={false} onClick={() => setDraft(toDraft(p))}>Edit</Pill>
              <span style={S("font-size:14px;color:#5E5249;width:52px;text-align:right;")}>{p.visible ? "Visible" : "Hidden"}</span>
              <Toggle on={p.visible} onClick={() => toggleVisible(p)} label={`Show ${p.name} on the site`} />
            </div>
          </div>
        ))}
      </div>

      {draft ? (
        <div onClick={() => !saving && setDraft(null)} style={S("position:fixed;inset:0;z-index:40;background:rgba(31,23,18,.35);backdrop-filter:blur(3px);display:flex;justify-content:center;align-items:flex-start;padding:clamp(12px,4vh,48px) 12px;overflow:auto;")} data-lenis-prevent="1">
          <form onSubmit={save} onClick={e => e.stopPropagation()} style={S(card + "background:#FAF7F1;width:min(760px,100%);padding:clamp(20px,3vw,36px);display:flex;flex-direction:column;gap:18px;box-shadow:0 30px 70px rgba(31,23,18,.25);")}>
            <div style={S("display:flex;justify-content:space-between;align-items:center;gap:12px;")}>
              <h2 style={S("margin:0;font-size:clamp(26px,3vw,36px);font-weight:800;letter-spacing:-0.048em;")}>{draft.id ? "Edit project" : "New project"}</h2>
              <button type="button" onClick={() => setDraft(null)} aria-label="Close" style={S("width:44px;height:44px;border-radius:999px;border:none;background:#EAE3D6;font-size:22px;cursor:pointer;")}>×</button>
            </div>

            <div style={S("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:14px;")}>
              <label style={S("display:flex;flex-direction:column;gap:8px;font-size:14px;font-weight:600;")}>Name
                <input required maxLength={80} value={draft.name} onChange={e => { const v = e.target.value; setDraft(d => (d ? { ...d, name: v, slug: d.slugTouched ? d.slug : toSlug(v) } : d)); }} style={S(field)} /></label>
              <label style={S("display:flex;flex-direction:column;gap:8px;font-size:14px;font-weight:600;")}>Page address
                <div style={S("display:flex;align-items:center;gap:6px;")}><span style={S("font-size:14px;color:#5E5249;")}>/work/</span>
                  <input required maxLength={80} value={draft.slug} onChange={e => setDraft(d => (d ? { ...d, slug: toSlug(e.target.value), slugTouched: true } : d))} style={S(field)} /></div></label>
              <label style={S("display:flex;flex-direction:column;gap:8px;font-size:14px;font-weight:600;")}>Project type
                <input maxLength={120} value={draft.type} placeholder="AI-Powered Fashion E-Commerce" onChange={e => set("type", e.target.value)} style={S(field)} /></label>
              <label style={S("display:flex;flex-direction:column;gap:8px;font-size:14px;font-weight:600;")}>Live website (optional)
                <input maxLength={200} value={draft.url} placeholder="example.com" onChange={e => set("url", e.target.value)} style={S(field)} /></label>
            </div>

            <label style={S("display:flex;flex-direction:column;gap:8px;font-size:14px;font-weight:600;")}>Overview (one or two sentences)
              <textarea rows={3} maxLength={600} value={draft.desc} onChange={e => set("desc", e.target.value)} style={S(field + "resize:vertical;")} /></label>
            <label style={S("display:flex;flex-direction:column;gap:8px;font-size:14px;font-weight:600;")}>What we built (one per line)
              <textarea rows={5} value={draft.features} onChange={e => set("features", e.target.value)} style={S(field + "resize:vertical;")} /></label>

            <div>
              <div style={S("font-size:14px;font-weight:600;margin-bottom:10px;")}>Categories (used by the Work page filters)</div>
              <div style={S("display:flex;flex-wrap:wrap;gap:8px;")}>
                {PROJECT_TAGS.map(t => { const on = draft.tags.includes(t); return (
                  <button type="button" key={t} onClick={() => set("tags", on ? draft.tags.filter(x => x !== t) : [...draft.tags, t])} style={S(`border:none;cursor:pointer;padding:10px 16px;border-radius:999px;font-size:14px;font-weight:600;background:${on ? "#1F1712" : "transparent"};color:${on ? "#F3EEE4" : "#1F1712"};box-shadow:inset 0 0 0 1px rgba(31,23,18,.18);`)}>{t}</button>
                ); })}
              </div>
            </div>

            <div>
              <div style={S("font-size:14px;font-weight:600;margin-bottom:10px;")}>Screenshots (16:10, e.g. a 1440×900 browser capture; the cover also shows on the home and work pages)</div>
              <div style={S("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr));gap:12px;")}>
                {([["heroImage", "Cover"], ["imageA", "Screenshot 2"], ["imageB", "Screenshot 3"]] as const).map(([k, l]) => (
                  <div key={k} style={S("display:flex;flex-direction:column;gap:8px;")}>
                    <div style={S(label)}>{l}</div>
                    <div style={S(`aspect-ratio:16/10;border-radius:14px;overflow:hidden;background:${draft[k] ? `center/cover no-repeat url("${draft[k]}")` : "repeating-linear-gradient(135deg,rgba(31,23,18,.06) 0 1px,transparent 1px 10px),#EAE3D6"};`)}></div>
                    <div style={S("display:flex;gap:6px;")}>
                      <label style={S("flex:1;text-align:center;cursor:pointer;padding:9px 12px;border-radius:999px;font-size:13px;font-weight:600;background:#1F1712;color:#F3EEE4;")}>
                        {uploading === k ? "Uploading..." : draft[k] ? "Replace" : "Upload"}
                        <input type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={e => { const f = e.target.files?.[0]; if (f) upload(k, f); e.target.value = ""; }} />
                      </label>
                      {draft[k] ? <button type="button" onClick={() => set(k, "")} style={S("border:none;cursor:pointer;padding:9px 12px;border-radius:999px;font-size:13px;font-weight:600;background:#EAE3D6;")}>Remove</button> : null}
                    </div>
                  </div>
                ))}
              </div>
              <div style={S(label + "margin:16px 0 8px;")}>More screenshots (shown after screenshot 3)</div>
              <div style={S("display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,160px),1fr));gap:12px;")}>
                {draft.gallery.map((src, i) => (
                  <div key={src + i} style={S("display:flex;flex-direction:column;gap:8px;")}>
                    <div style={S(`aspect-ratio:16/10;border-radius:14px;overflow:hidden;background:center/cover no-repeat url("${src}");`)}></div>
                    <button type="button" onClick={() => set("gallery", draft.gallery.filter((_, j) => j !== i))} style={S("border:none;cursor:pointer;padding:9px 12px;border-radius:999px;font-size:13px;font-weight:600;background:#EAE3D6;")}>Remove</button>
                  </div>
                ))}
                {draft.gallery.length < 12 ? (
                  <label style={S("aspect-ratio:16/10;border-radius:14px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:13px;font-weight:600;box-shadow:inset 0 0 0 1px rgba(31,23,18,.18);")}>
                    {uploading === "gallery" ? "Uploading..." : "+ Add screenshot"}
                    <input type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={e => { const f = e.target.files?.[0]; if (f) upload("gallery", f); e.target.value = ""; }} />
                  </label>
                ) : null}
              </div>
            </div>

            <div style={S("display:flex;flex-wrap:wrap;gap:24px;")}>
              <label style={S("display:flex;align-items:center;gap:12px;font-size:15px;font-weight:600;")}><Toggle on={draft.visible} onClick={() => set("visible", !draft.visible)} label="Visible" />Show on the site</label>
              <label style={S("display:flex;align-items:center;gap:12px;font-size:15px;font-weight:600;")}><Toggle on={draft.latest} onClick={() => set("latest", !draft.latest)} label="Latest" />Mark as latest project</label>
            </div>

            <div style={S("display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px;padding-top:8px;border-top:1px solid rgba(31,23,18,.1);")}>
              <div style={S("display:flex;gap:8px;")}>
                {draft.id ? <Pill dark={false} onClick={remove}>Delete project</Pill> : null}
                {draft.id && draft.visible ? <a href={`/work/${draft.slug}`} target="_blank" rel="noopener" style={S("padding:10px 18px;border-radius:999px;font-size:14px;font-weight:600;box-shadow:inset 0 0 0 1px rgba(31,23,18,.2);")}>View page</a> : null}
              </div>
              <div style={S("display:flex;gap:8px;")}>
                <Pill dark={false} onClick={() => setDraft(null)}>Cancel</Pill>
                <Pill type="submit" disabled={saving || !!uploading}>{saving ? "Saving..." : draft.id ? "Save changes" : "Add project"}</Pill>
              </div>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}
