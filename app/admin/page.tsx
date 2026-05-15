"use client";
import { useState, useEffect, useRef, useCallback } from "react";

/* ================================================================
   TYPES
   ================================================================ */
type Project = { id:number; monogram:string; color_cls:string; name:string; industry:string; year:string; scope:string; status:string; updated_at:string };
type Post     = { id:number; title:string; category:string; author_init:string; author_name:string; read_time:string; status:string; published_at:string|null };
type Service  = { id:number; ord:number; name:string; descr:string; count:string; visible:boolean; badge:string|null; image:string|null };
type Testi    = { id:number; quote:string; name:string; role:string; av:string; hi:string };
type Client   = { id:number; name:string; industry:string; country:string; contact:string; eng:string; mrr:string; av:string; cls:string };
type Message  = { id:number; av:string; sender:string; subject:string; preview:string; body:string; source:string; interested:string; budget:string; country:string; unread:boolean; received_at:string };
type Member   = { id:number; av:string; name:string; role:string; bio:string };
type FoxPrice = { id:number; category:string; feature_id:string; label:string; price_min:number; price_max:number; is_base:boolean; ord:number };

/* ================================================================
   HELPERS
   ================================================================ */
function relTime(d:string):string {
  const days = Math.floor((Date.now()-new Date(d).getTime())/(1000*60*60*24));
  if(days===0) return "Today"; if(days===1) return "Yesterday";
  if(days<7) return `${days} days ago`; if(days<30) return `${Math.floor(days/7)} weeks ago`;
  if(days<365) return `${Math.floor(days/30)} months ago`; return `${Math.floor(days/365)} years ago`;
}
function fmtDate(d:string|null):string {
  if(!d) return "—";
  return new Date(d).toLocaleDateString("en-US",{month:"short",day:"numeric"});
}
function autoAv(name:string):string {
  return name.split(" ").map(w=>w[0]||"").join("").slice(0,2).toUpperCase();
}
const CLS_CYCLE = ["","b","c","d"];

/* ================================================================
   SMALL COMPONENTS
   ================================================================ */
const PlusChip = ()=><span className="chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg></span>;
const ArrowChip = ()=><span className="chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18M13 5l7 7-7 7"/></svg></span>;
const EditSvg  = ()=><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 20h4l10-10-4-4L4 16Z"/></svg>;
const TrashSvg = ()=><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14"/></svg>;
const MsgSvg   = ()=><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"/></svg>;

function Field({label,value,onChange,placeholder,type="text"}:{label:string;value:string;onChange:(v:string)=>void;placeholder?:string;type?:string}){
  return <div className="field"><label>{label}</label><input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/></div>;
}
function FieldArea({label,value,onChange,placeholder}:{label:string;value:string;onChange:(v:string)=>void;placeholder?:string}){
  return <div className="field"><label>{label}</label><textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/></div>;
}
function FieldSel({label,value,onChange,options}:{label:string;value:string;onChange:(v:string)=>void;options:string[]}){
  return <div className="field"><label>{label}</label><select value={value} onChange={e=>onChange(e.target.value)}>{options.map(o=><option key={o} value={o}>{o.charAt(0).toUpperCase()+o.slice(1)}</option>)}</select></div>;
}

/* modal title map */
const MODAL_TITLE:Record<string,string>={
  "new-project":"New project","edit-project":"Edit project",
  "new-post":"New post","edit-post":"Edit post",
  "new-testimonial":"New testimonial","edit-testimonial":"Edit testimonial",
  "new-client":"Add client",
  "new-team":"Invite member",
  "new-service":"New service",
};

/* ================================================================
   MAIN COMPONENT
   ================================================================ */
export default function AdminPage() {
  /* auth */
  const [loggedIn, setLoggedIn] = useState(false);
  const [page, setPage]         = useState("dashboard");

  /* data */
  const [projects,  setProjects]  = useState<Project[]>([]);
  const [posts,     setPosts]     = useState<Post[]>([]);
  const [services,  setServices]  = useState<Service[]>([]);
  const [testis,    setTestis]    = useState<Testi[]>([]);
  const [clients,   setClients]   = useState<Client[]>([]);
  const [msgs,      setMsgs]      = useState<Message[]>([]);
  const [team,      setTeam]      = useState<Member[]>([]);
  const [foxPrices, setFoxPrices] = useState<FoxPrice[]>([]);
  const [priceCat,  setPriceCat]  = useState("Website");
  const [localPrices, setLocalPrices] = useState<Record<number,{min:number;max:number}>>({});
  const [loading,   setLoading]   = useState(false);

  /* modal */
  const [modalType,   setModalType]   = useState<string|null>(null);
  const [editTarget,  setEditTarget]  = useState<number|null>(null);
  const [form,        setForm]        = useState<Record<string,string>>({});
  const [submitting,  setSubmitting]  = useState(false);

  /* ui */
  const [toastMsg, setToastMsg]     = useState("");
  const [toastOn,  setToastOn]      = useState(false);
  const [sidebarOpen,setSidebarOpen]= useState(false);
  const [settingsTab,setSettingsTab]= useState("brand");
  const [activeIdx,  setActiveIdx]  = useState(0);
  const [brandT, setBrandT]         = useState([true,true,true,false]);
  const [seoT,   setSeoT]           = useState([true,true]);
  const [secT,   setSecT]           = useState([true,true,true,false]);

  const toastTimer = useRef<ReturnType<typeof setTimeout>|null>(null);

  /* ── toast ── */
  const toast = useCallback((msg:string)=>{
    if(toastTimer.current) clearTimeout(toastTimer.current);
    setToastMsg(msg); setToastOn(true);
    toastTimer.current = setTimeout(()=>setToastOn(false),2400);
  },[]);

  /* ── nav ── */
  const nav = useCallback((p:string)=>{ setPage(p); setSidebarOpen(false); },[]);

  /* ── fetch ── */
  const loadData = useCallback(async (p:string)=>{
    setLoading(true);
    try {
      if(p==="dashboard"){
        const [pr,ms] = await Promise.all([fetch("/api/projects").then(r=>r.json()), fetch("/api/messages").then(r=>r.json())]);
        setProjects(Array.isArray(pr)?pr:[]); setMsgs(Array.isArray(ms)?ms:[]);
      } else if(p==="projects"){ const r=await fetch("/api/projects").then(r=>r.json()); setProjects(Array.isArray(r)?r:[]); }
      else if(p==="blog"){        const r=await fetch("/api/blog").then(r=>r.json()); setPosts(Array.isArray(r)?r:[]); }
      else if(p==="services"){    const r=await fetch("/api/services").then(r=>r.json()); setServices(Array.isArray(r)?r:[]); }
      else if(p==="testimonials"){const r=await fetch("/api/testimonials").then(r=>r.json()); setTestis(Array.isArray(r)?r:[]); }
      else if(p==="clients"){     const r=await fetch("/api/clients").then(r=>r.json()); setClients(Array.isArray(r)?r:[]); }
      else if(p==="messages"){    const r=await fetch("/api/messages").then(r=>r.json()); setMsgs(Array.isArray(r)?r:[]); setActiveIdx(0); }
      else if(p==="leads"){       const r=await fetch("/api/messages").then(r=>r.json()); setMsgs(Array.isArray(r)?r:[]); }
      else if(p==="team"){        const r=await fetch("/api/team").then(r=>r.json()); setTeam(Array.isArray(r)?r:[]); }
      else if(p==="fox-prices"){  const r=await fetch("/api/fox-prices").then(r=>r.json()); if(Array.isArray(r)){ setFoxPrices(r); setLocalPrices(Object.fromEntries(r.map((x:FoxPrice)=>[x.id,{min:x.price_min,max:x.price_max}]))); } }
    } catch { toast("Error loading data"); }
    setLoading(false);
  },[toast]);

  useEffect(()=>{ if(loggedIn) loadData(page); },[loggedIn,page,loadData]);

  /* ── field helper ── */
  const sf = (k:string,v:string)=>setForm(f=>({...f,[k]:v}));

  /* ── modal helpers ── */
  const openModal = (type:string, prefill:Record<string,string>={}, id:number|null=null)=>{
    setModalType(type); setForm(prefill); setEditTarget(id);
  };
  const closeModal = ()=>{ setModalType(null); setForm({}); setEditTarget(null); };

  /* ── PROJECTS ── */
  const deleteProject = async(id:number)=>{
    if(!confirm("Delete this project? This cannot be undone.")) return;
    await fetch(`/api/projects/${id}`,{method:"DELETE"});
    setProjects(p=>p.filter(x=>x.id!==id)); toast("Project deleted");
  };
  const submitProject = async()=>{
    if(!form.name?.trim()){ toast("Project name is required"); return; }
    setSubmitting(true);
    const body = { monogram:form.name[0].toUpperCase(), color_cls:form.color_cls||"", name:form.name, industry:form.industry||"", year:form.year||String(new Date().getFullYear()), scope:form.scope||"", status:form.status||"draft" };
    const url  = editTarget ? `/api/projects/${editTarget}` : "/api/projects";
    const meth = editTarget ? "PATCH" : "POST";
    const res  = await fetch(url,{method:meth,headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
    if(res.ok){
      const row:Project = await res.json();
      setProjects(p=>editTarget ? p.map(x=>x.id===editTarget?row:x) : [row,...p]);
      closeModal(); toast(editTarget?"Project updated":"Project created");
    } else { toast("Error saving project"); }
    setSubmitting(false);
  };

  /* ── POSTS ── */
  const deletePost = async(id:number)=>{
    if(!confirm("Delete this post?")) return;
    await fetch(`/api/blog/${id}`,{method:"DELETE"});
    setPosts(p=>p.filter(x=>x.id!==id)); toast("Post deleted");
  };
  const submitPost = async()=>{
    if(!form.title?.trim()){ toast("Title is required"); return; }
    setSubmitting(true);
    const ai = autoAv(form.author_name||"");
    const body = { title:form.title, category:form.category||"Design", author_init:ai, author_name:form.author_name||"", read_time:form.read_time||"5 min", status:form.status||"draft", published_at:form.status==="live"?new Date().toISOString().split("T")[0]:null };
    const url  = editTarget ? `/api/blog/${editTarget}` : "/api/blog";
    const meth = editTarget ? "PATCH" : "POST";
    const res  = await fetch(url,{method:meth,headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
    if(res.ok){
      const row:Post = await res.json();
      setPosts(p=>editTarget ? p.map(x=>x.id===editTarget?row:x) : [row,...p]);
      closeModal(); toast(editTarget?"Post updated":"Post created");
    } else { toast("Error saving post"); }
    setSubmitting(false);
  };

  /* ── SERVICES ── */
  const toggleSvc = async(id:number,visible:boolean)=>{
    await fetch("/api/services",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id,visible})});
    setServices(s=>s.map(x=>x.id===id?{...x,visible}:x));
  };
  const editService = (s:Service)=>{
    setForm({name:s.name,descr:s.descr,count:s.count,badge:s.badge||"",image:s.image||""});
    setEditTarget(s.id);
    setModalType("new-service");
  };
  const submitService = async()=>{
    if(!form.name?.trim()){ toast("Name is required"); return; }
    setSubmitting(true);
    if(editTarget){
      const res = await fetch("/api/services",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:editTarget,name:form.name,descr:form.descr||"",count:form.count||"",badge:form.badge||null,image:form.image||null})});
      if(res.ok){ const row:Service=await res.json(); setServices(s=>s.map(x=>x.id===row.id?row:x)); closeModal(); toast("Service updated"); }
    } else {
      const res = await fetch("/api/services",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:form.name,descr:form.descr||"",count:form.count||"",visible:true,badge:form.badge||null,image:form.image||null})});
      if(res.ok){ const row:Service=await res.json(); setServices(s=>[...s,row]); closeModal(); toast("Service created"); }
    }
    setSubmitting(false);
  };

  /* ── TESTIMONIALS ── */
  const deleteTesti = async(id:number)=>{
    if(!confirm("Delete this testimonial?")) return;
    await fetch(`/api/testimonials/${id}`,{method:"DELETE"});
    setTestis(t=>t.filter(x=>x.id!==id)); toast("Testimonial deleted");
  };
  const editTesti = (t:Testi)=>{
    setForm({quote:t.quote,name:t.name,role:t.role,av:t.av,hi:t.hi||""});
    setEditTarget(t.id);
    setModalType("edit-testimonial");
  };
  const submitTesti = async()=>{
    if(!form.quote?.trim()||!form.name?.trim()){ toast("Quote and name are required"); return; }
    setSubmitting(true);
    if(editTarget){
      const res = await fetch(`/api/testimonials/${editTarget}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({quote:form.quote,name:form.name,role:form.role||"",av:autoAv(form.name),hi:form.hi||""})});
      if(res.ok){ const row:Testi=await res.json(); setTestis(t=>t.map(x=>x.id===editTarget?row:x)); closeModal(); toast("Testimonial updated"); }
    } else {
      const res = await fetch("/api/testimonials",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({quote:form.quote,name:form.name,role:form.role||"",av:autoAv(form.name),hi:form.hi||""})});
      if(res.ok){ const row:Testi=await res.json(); setTestis(t=>[...t,row]); closeModal(); toast("Testimonial added"); }
    }
    setSubmitting(false);
  };

  /* ── CLIENTS ── */
  const deleteClient = async(id:number)=>{
    if(!confirm("Remove this client?")) return;
    await fetch(`/api/clients/${id}`,{method:"DELETE"});
    setClients(c=>c.filter(x=>x.id!==id)); toast("Client removed");
  };
  const submitClient = async()=>{
    if(!form.name?.trim()){ toast("Client name is required"); return; }
    setSubmitting(true);
    const res = await fetch("/api/clients",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:form.name,industry:form.industry||"",country:form.country||"",contact:form.contact||"",eng:form.eng||"",mrr:form.mrr||"",av:form.name[0].toUpperCase(),cls:CLS_CYCLE[clients.length%4]})});
    if(res.ok){ const row:Client=await res.json(); setClients(c=>[...c,row]); closeModal(); toast("Client added"); }
    setSubmitting(false);
  };

  /* ── MESSAGES ── */
  const deleteMsg = async(id:number)=>{
    if(!confirm("Delete this message?")) return;
    await fetch(`/api/messages/${id}`,{method:"DELETE"});
    setMsgs(m=>{ const next=m.filter(x=>x.id!==id); setActiveIdx(i=>Math.min(i,Math.max(0,next.length-1))); return next; });
    toast("Message deleted");
  };
  const markRead = async(id:number)=>{
    await fetch(`/api/messages/${id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({unread:false})});
    setMsgs(m=>m.map(x=>x.id===id?{...x,unread:false}:x));
  };
  const handleThread = (i:number)=>{
    setActiveIdx(i);
    if(msgs[i]?.unread) markRead(msgs[i].id);
  };

  /* ── TEAM ── */
  const deleteMember = async(id:number)=>{
    if(!confirm("Remove this team member?")) return;
    await fetch(`/api/team/${id}`,{method:"DELETE"});
    setTeam(t=>t.filter(x=>x.id!==id)); toast("Member removed");
  };
  const submitMember = async()=>{
    if(!form.name?.trim()){ toast("Name is required"); return; }
    setSubmitting(true);
    const res = await fetch("/api/team",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({av:form.av||autoAv(form.name),name:form.name,role:form.role||"",bio:form.bio||""})});
    if(res.ok){ const row:Member=await res.json(); setTeam(t=>[...t,row]); closeModal(); toast("Member invited"); }
    setSubmitting(false);
  };

  /* ── FOX PRICES ── */
  const saveFoxPrice = async(id:number)=>{
    const lp = localPrices[id]; if(!lp) return;
    const res = await fetch("/api/fox-prices",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id,price_min:lp.min,price_max:lp.max})});
    if(res.ok){ const row:FoxPrice=await res.json(); setFoxPrices(p=>p.map(x=>x.id===id?row:x)); toast("Price updated"); }
    else { toast("Error saving price"); }
  };
  const saveFoxCat = async(cat:string)=>{
    const catPrices = foxPrices.filter(p=>p.category===cat);
    await Promise.all(catPrices.map(p=>saveFoxPrice(p.id)));
    toast(`${cat} prices saved`);
  };

  /* ── SETTINGS SAVE ── */
  const saveSettings = async(tab:string)=>{
    const fields = document.querySelectorAll<HTMLInputElement|HTMLTextAreaElement>("[data-setting]");
    const data:Record<string,string>={};
    fields.forEach(el=>{ data[el.dataset.setting!]=el.value; });
    await fetch("/api/settings",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
    toast(`Saved · ${tab} settings`);
  };

  /* ── MODAL SUBMIT ROUTER ── */
  const submitModal = ()=>{
    if(modalType==="new-project"||modalType==="edit-project") submitProject();
    else if(modalType==="new-post"||modalType==="edit-post") submitPost();
    else if(modalType==="new-testimonial"||modalType==="edit-testimonial") submitTesti();
    else if(modalType==="new-client") submitClient();
    else if(modalType==="new-team") submitMember();
    else if(modalType==="new-service") submitService();
  };

  /* ── NEW button per page ── */
  const handleNewBtn = ()=>{
    if(page==="projects"||page==="dashboard") openModal("new-project");
    else if(page==="blog") openModal("new-post");
    else if(page==="testimonials") openModal("new-testimonial");
    else if(page==="clients") openModal("new-client");
    else if(page==="team") openModal("new-team");
    else if(page==="services") openModal("new-service");
    else toast("New item — opening editor");
  };

  /* ── page meta ── */
  const CRUMBS:Record<string,string>={ dashboard:"Workspace / Dashboard", analytics:"Workspace / Analytics", projects:"Content / Projects", blog:"Content / Journal", services:"Content / Services", testimonials:"Content / Testimonials", media:"Content / Media", clients:"People / Clients", messages:"People / Inbox", leads:"People / Leads", team:"People / Team", settings:"System / Settings", "fox-prices":"System / Fox Pricing" };
  const TITLES:Record<string,React.ReactNode>={ dashboard:<>Good evening, <span className="it">Arif.</span></>, analytics:"Analytics", projects:"Projects", blog:"Journal", services:"Services", testimonials:"Testimonials", media:"Media library", clients:"Clients", messages:"Inbox", leads:"Estimator Leads", team:"Team", settings:"Settings", "fox-prices":"Fox Pricing" };

  /* ── dashboard derived ── */
  const liveProjects = projects.filter(p=>p.status==="live").length;
  const unreadMsgs   = msgs.filter(m=>m.unread).length;

  const engStatus=(eng:string)=>eng==="Retainer"?"live":eng==="Active build"?"review":eng==="Discovery"?"review":"archived";

  /* ────────────────────────────────────────────────────────
     LOGIN
     ──────────────────────────────────────────────────────── */
  if(!loggedIn) return (
    <section className="login">
      <aside className="pane">
        <div className="brand"><img src="/assets/logo-mark.svg" alt=""/><span>Foxmen <em style={{fontStyle:"italic",color:"var(--brand)"}}>Studio</em></span></div>
        <h1>Welcome <span className="it">back.</span><br/>Let&apos;s ship<br/>something good.</h1>
        <div className="meta"><span>v 4.2 — admin</span><span>Foxmen Studio</span></div>
      </aside>
      <form onSubmit={e=>{e.preventDefault();setLoggedIn(true);}}>
        <h2>Sign in to <span className="it">admin.</span></h2>
        <p>Use your studio email to access the dashboard. Two-factor is required for owners.</p>
        <div className="field"><label>Work email</label><input type="email" defaultValue="admin@foxmen.studio" placeholder="you@foxmen.studio" required/></div>
        <div className="field"><label>Password</label><input type="password" defaultValue="•••••••••••••" required/></div>
        <div className="helper">
          <label style={{display:"flex",gap:8,alignItems:"center",cursor:"pointer"}}><input type="checkbox" defaultChecked style={{width:16,height:16,accentColor:"#0a0a0a"}}/> Remember this device</label>
          <a href="#">Forgot password?</a>
        </div>
        <button type="submit">Sign in to dashboard <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18M13 5l7 7-7 7"/></svg></button>
        <div className="or">or continue with</div>
        <div className="sso">
          <button type="button"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M21.35 11.1h-9.18v2.92h5.26c-.23 1.5-1.69 4.4-5.26 4.4-3.17 0-5.75-2.62-5.75-5.85s2.58-5.85 5.75-5.85c1.8 0 3.01.77 3.7 1.43l2.52-2.43C16.85 4.2 14.74 3.2 12.17 3.2 6.86 3.2 2.6 7.5 2.6 12.57s4.26 9.37 9.57 9.37c5.52 0 9.18-3.87 9.18-9.33 0-.63-.07-1.1-.15-1.51Z"/></svg>Google</button>
          <button type="button"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.92.58.1.79-.25.79-.55v-2.16c-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.27-1.69-1.27-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.69 1.25 3.34.95.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.27-5.24-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.17a11.05 11.05 0 0 1 5.78 0c2.21-1.48 3.18-1.17 3.18-1.17.62 1.58.23 2.75.11 3.04.73.8 1.18 1.82 1.18 3.07 0 4.4-2.69 5.36-5.25 5.65.41.36.78 1.05.78 2.12v3.14c0 .3.21.66.79.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z"/></svg>GitHub</button>
        </div>
      </form>
    </section>
  );

  /* ────────────────────────────────────────────────────────
     APP SHELL
     ──────────────────────────────────────────────────────── */
  const activeMsg = msgs[activeIdx];

  return (
    <div className="app">

      {/* ══ SIDEBAR ══ */}
      <aside className={`sidebar${sidebarOpen?" open":""}`}>
        <div className="side-brand"><img src="/assets/logo-mark.svg" alt=""/><div><div className="name">Foxmen <em style={{fontStyle:"italic",color:"var(--brand)"}}>Admin</em></div><span className="sub">Workspace · Studio</span></div></div>
        <label className="side-search"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/></svg><input type="search" placeholder="Quick search"/><kbd>⌘K</kbd></label>
        <nav className="side-nav">
          <span className="label">Workspace</span>
          {[["dashboard","Dashboard",<svg key="d" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>],
           ["analytics","Analytics",<svg key="a" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 3v18h18M7 14l4-4 4 4 5-7"/></svg>]
          ].map(([p,label,icon])=>(
            <a key={p as string} className={page===p?"active":""} onClick={()=>nav(p as string)}>{icon as React.ReactNode}{label as string}</a>
          ))}
          <span className="label">Content</span>
          {[["projects","Projects",<svg key="p" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18M8 5V3M16 5V3"/></svg>,`${projects.length||38}`],
           ["blog","Blog posts",<svg key="b" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 5h16M4 12h16M4 19h10"/></svg>,`${posts.length||24}`],
           ["services","Services",<svg key="s" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/></svg>,null],
           ["testimonials","Testimonials",<svg key="t" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"/></svg>,null],
           ["media","Media library",<svg key="m" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/></svg>,null],
          ].map(([p,label,icon,badge])=>(
            <a key={p as string} className={page===p?"active":""} onClick={()=>nav(p as string)}>{icon as React.ReactNode}{label as string}{badge&&<span className="badge">{badge as string}</span>}</a>
          ))}
          <span className="label">People</span>
          {[["clients","Clients",<svg key="c" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,`${clients.length||42}`],
           ["messages","Messages",<svg key="msg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 4h16v12H5l-1 4Z"/></svg>,unreadMsgs>0?String(unreadMsgs):null],
           ["leads","Est. Leads",<svg key="leads" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2a7 7 0 0 1 7 7c0 4-4 9-7 11C9 18 5 13 5 9a7 7 0 0 1 7-7Z"/><circle cx="12" cy="9" r="2.5"/></svg>,msgs.filter(m=>m.source==="estimator"&&m.unread).length>0?String(msgs.filter(m=>m.source==="estimator"&&m.unread).length):null],
           ["team","Team",<svg key="tm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>,null],
          ].map(([p,label,icon,badge])=>(
            <a key={p as string} className={page===p?"active":""} onClick={()=>nav(p as string)}>{icon as React.ReactNode}{label as string}{badge&&<span className="badge">{badge as string}</span>}</a>
          ))}
          <span className="label">System</span>
          <a className={page==="fox-prices"?"active":""} onClick={()=>nav("fox-prices")}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>Fox Pricing</a>
          <a className={page==="settings"?"active":""} onClick={()=>nav("settings")}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.8 1.3V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-2.8-1.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0-1.3-2.8H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.3-2.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 2.8-1.3V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 2.8 1.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0 1.3 2.8H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.3 2.8Z"/></svg>Settings</a>
        </nav>
        <div className="side-foot">
          <div className="av">AR</div>
          <div className="info"><div className="n">Arif Rahman</div><div className="r">Owner · admin</div></div>
          <a href="#" className="ic" title="Sign out" onClick={e=>{e.preventDefault();if(confirm("Sign out?"))setLoggedIn(false);}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
          </a>
        </div>
      </aside>

      {/* ══ MAIN ══ */}
      <main className="main">

        {/* TOPBAR */}
        <header className="topbar">
          <button className="ic-btn" style={{display:"none"}} aria-label="Menu" onClick={()=>setSidebarOpen(o=>!o)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
          <div><div className="crumb">{CRUMBS[page]}</div><h1>{TITLES[page]}</h1></div>
          <div className="spacer"/>
          <button className="ic-btn" title="Refresh" onClick={()=>loadData(page)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
          </button>
          <button className="ic-btn" title="Notifications"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21a2 2 0 0 0 4 0"/></svg><span className="dot"/></button>
          <a href="/" className="btn-ghost">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12s3-7 9-7 9 7 9 7-3 7-9 7-9-7-9-7Z"/><circle cx="12" cy="12" r="2.5"/></svg>View site
          </a>
          <button className="btn-primary" onClick={handleNewBtn}>New <PlusChip/></button>
        </header>

        {loading && <div className="load-bar"/>}

        {/* ══════════ DASHBOARD ══════════ */}
        {page==="dashboard" && (
          <section className="page active">
            <div className="stat-grid">
              <div className="stat"><div className="k">Total visitors · 30d</div><div className="v">48,210</div><div className="delta">↗ +18.4% vs prev</div></div>
              <div className="stat"><div className="k">Live projects</div><div className="v">{liveProjects||"—"}<span className="it">+</span></div><div className="delta">↗ from {projects.length} total</div></div>
              <div className="stat"><div className="k">Inbox</div><div className="v">{msgs.length||"—"}</div><div className="delta down">{unreadMsgs} unread</div></div>
              <div className="stat"><div className="k">Revenue · MTD</div><div className="v">$184<span style={{fontSize:24}}>k</span></div><div className="delta">↗ +12.1%</div></div>
            </div>
            <div className="row-2">
              <div className="chart">
                <div className="chart-head"><div><h3>Traffic overview</h3><div className="sub" style={{marginTop:4,color:"var(--muted)"}}>Sessions · last 30 days</div></div><div className="tabs"><button>7d</button><button className="on">30d</button><button>90d</button><button>1y</button></div></div>
                <svg className="chart-svg" viewBox="0 0 600 200" preserveAspectRatio="none"><defs><linearGradient id="g1" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#b86cf9" stopOpacity=".35"/><stop offset="100%" stopColor="#b86cf9" stopOpacity="0"/></linearGradient></defs><g stroke="#ececea" strokeWidth="1"><line x1="0" y1="40" x2="600" y2="40"/><line x1="0" y1="80" x2="600" y2="80"/><line x1="0" y1="120" x2="600" y2="120"/><line x1="0" y1="160" x2="600" y2="160"/></g><path d="M0,150 L40,130 L80,140 L120,110 L160,120 L200,90 L240,100 L280,70 L320,85 L360,60 L400,80 L440,45 L480,65 L520,40 L560,55 L600,30 L600,200 L0,200 Z" fill="url(#g1)"/><path d="M0,150 L40,130 L80,140 L120,110 L160,120 L200,90 L240,100 L280,70 L320,85 L360,60 L400,80 L440,45 L480,65 L520,40 L560,55 L600,30" fill="none" stroke="#b86cf9" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round"/></svg>
                <div className="legend"><span><i style={{background:"#b86cf9"}}/>This period · 48,210</span><span><i style={{background:"#0a0a0a"}}/>Previous · 40,720</span></div>
              </div>
              <div className="chart">
                <div className="chart-head"><h3>Traffic by source</h3></div>
                <svg className="chart-svg" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet" style={{height:180}}><circle cx="100" cy="100" r="70" fill="none" stroke="#ececea" strokeWidth="18"/><circle cx="100" cy="100" r="70" fill="none" stroke="#b86cf9" strokeWidth="18" strokeDasharray="180 440" transform="rotate(-90 100 100)"/><circle cx="100" cy="100" r="70" fill="none" stroke="#0a0a0a" strokeWidth="18" strokeDasharray="110 440" strokeDashoffset="-180" transform="rotate(-90 100 100)"/><circle cx="100" cy="100" r="70" fill="none" stroke="#8c3bd9" strokeWidth="18" strokeDasharray="60 440" strokeDashoffset="-290" transform="rotate(-90 100 100)"/><text x="100" y="96" textAnchor="middle" fontFamily="Instrument Serif" fontSize="32" fill="#0a0a0a">48k</text><text x="100" y="116" textAnchor="middle" fontFamily="Geist Mono" fontSize="8" fill="#6b6b6b" letterSpacing="2">VISITS · 30D</text></svg>
                <div className="legend" style={{flexDirection:"column",gap:6}}><span style={{display:"flex",justifyContent:"space-between"}}><span><i style={{background:"#b86cf9"}}/>Organic</span><b>41%</b></span><span style={{display:"flex",justifyContent:"space-between"}}><span><i style={{background:"#0a0a0a"}}/>Direct</span><b>25%</b></span><span style={{display:"flex",justifyContent:"space-between"}}><span><i style={{background:"#8c3bd9"}}/>Referral</span><b>14%</b></span></div>
              </div>
            </div>
            <div className="row-2">
              <div className="card">
                <div className="chart-head" style={{marginBottom:8}}><h3>Recent projects</h3><button className="btn-ghost" style={{padding:"4px 10px",fontSize:11}} onClick={()=>nav("projects")}>View all →</button></div>
                <div className="list">
                  {projects.slice(0,4).map((p,i)=>(
                    <div key={i} className="list-row"><div className={`thumb-mini ${p.color_cls}`}>{p.monogram}</div><div className="body"><div className="t">{p.name}</div><div className="s">{p.industry} · {p.scope}</div></div><span className={`status ${p.status}`}>{p.status}</span><span className="meta">{relTime(p.updated_at)}</span></div>
                  ))}
                </div>
              </div>
              <div className="card">
                <div className="chart-head" style={{marginBottom:8}}><h3>Latest messages</h3><button className="btn-ghost" style={{padding:"4px 10px",fontSize:11}} onClick={()=>nav("messages")}>Inbox →</button></div>
                <div className="list">
                  {msgs.slice(0,4).map((m,i)=>(
                    <div key={i} className="list-row"><div className="av">{m.av||m.sender.slice(0,2).toUpperCase()}</div><div className="body"><div className="t">{m.sender}</div><div className="s">{m.preview}</div></div><span className="meta">{relTime(m.received_at)}</span></div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ══════════ PROJECTS ══════════ */}
        {page==="projects" && (
          <section className="page active">
            <div className="page-head">
              <div><h2>Projects <span className="it">— {projects.length}</span></h2><p>Manage case studies, hero images, scope and status.</p></div>
              <div className="page-actions"><button className="btn-ghost">Export CSV</button><button className="btn-primary" onClick={()=>openModal("new-project")}>New project <PlusChip/></button></div>
            </div>
            <div className="table-wrap">
              <div className="table-tools"><div className="search"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/></svg><input placeholder="Search projects…"/></div><div className="spacer"/><button className="btn-ghost" onClick={()=>loadData("projects")}>Refresh</button></div>
              <table>
                <thead><tr><th>Project</th><th>Industry</th><th>Year</th><th>Scope</th><th>Status</th><th>Updated</th><th/></tr></thead>
                <tbody>
                  {projects.map(p=>(
                    <tr key={p.id}>
                      <td><div className="pair"><div className={`thumb-mini ${p.color_cls}`}>{p.monogram}</div><div><div className="ttl">{p.name}</div><div className="sub">/{p.name.split(" ")[0].toLowerCase()}</div></div></div></td>
                      <td>{p.industry}</td><td>{p.year}</td>
                      <td><span style={{color:"var(--muted)",fontSize:12}}>{p.scope}</span></td>
                      <td><span className={`status ${p.status}`}>{p.status}</span></td>
                      <td><span style={{color:"var(--muted)",fontFamily:"var(--f-mono)",fontSize:11}}>{relTime(p.updated_at)}</span></td>
                      <td><div className="acts">
                        <button className="btn-icon" title="Edit" onClick={()=>openModal("edit-project",{name:p.name,industry:p.industry,year:p.year,scope:p.scope,status:p.status,color_cls:p.color_cls},p.id)}><EditSvg/></button>
                        <button className="btn-icon danger" title="Delete" onClick={()=>deleteProject(p.id)}><TrashSvg/></button>
                      </div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {projects.length===0&&<div style={{padding:32,textAlign:"center",color:"var(--muted)"}}>No projects yet — click New project to add one.</div>}
            </div>
          </section>
        )}

        {/* ══════════ BLOG ══════════ */}
        {page==="blog" && (
          <section className="page active">
            <div className="page-head">
              <div><h2>Journal <span className="it">— {posts.length}</span></h2><p>Essays, deep-dives and case notes.</p></div>
              <div className="page-actions"><button className="btn-primary" onClick={()=>openModal("new-post")}>New post <PlusChip/></button></div>
            </div>
            <div className="table-wrap">
              <div className="table-tools"><div className="search"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/></svg><input placeholder="Search posts…"/></div></div>
              <table>
                <thead><tr><th>Title</th><th>Category</th><th>Author</th><th>Read</th><th>Status</th><th>Date</th><th/></tr></thead>
                <tbody>
                  {posts.map(p=>(
                    <tr key={p.id}>
                      <td><div className="ttl">{p.title}</div></td>
                      <td><span style={{fontFamily:"var(--f-mono)",fontSize:11,letterSpacing:".12em",color:"var(--muted)",textTransform:"uppercase"}}>{p.category}</span></td>
                      <td><div className="pair"><div className="thumb-mini" style={{width:28,height:28,fontSize:11,borderRadius:"50%"}}>{p.author_init}</div>{p.author_name}</div></td>
                      <td>{p.read_time}</td>
                      <td><span className={`status ${p.status}`}>{p.status}</span></td>
                      <td><span style={{color:"var(--muted)",fontFamily:"var(--f-mono)",fontSize:11}}>{fmtDate(p.published_at)}</span></td>
                      <td><div className="acts">
                        <button className="btn-icon" title="Edit" onClick={()=>openModal("edit-post",{title:p.title,category:p.category,author_name:p.author_name,read_time:p.read_time,status:p.status},p.id)}><EditSvg/></button>
                        <button className="btn-icon danger" title="Delete" onClick={()=>deletePost(p.id)}><TrashSvg/></button>
                      </div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {posts.length===0&&<div style={{padding:32,textAlign:"center",color:"var(--muted)"}}>No posts yet.</div>}
            </div>
          </section>
        )}

        {/* ══════════ SERVICES ══════════ */}
        {page==="services" && (
          <section className="page active">
            <div className="page-head">
              <div><h2>Services <span className="it">— {services.length.toString().padStart(2,"0")}</span></h2><p>What we offer, and how the cards present on the site.</p></div>
              <div className="page-actions"><button className="btn-primary" onClick={()=>openModal("new-service")}>New service <PlusChip/></button></div>
            </div>
            <div className="team-grid">
              {services.map((s,i)=>(
                <div key={s.id} className="team-card" style={{padding:0,overflow:"hidden",gap:0}}>
                  {/* Image area */}
                  <div style={{position:"relative",height:140,background:"#111",flexShrink:0,cursor:"pointer"}} onClick={()=>editService(s)}>
                    {s.image
                      ? <img src={s.image} alt={s.name} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
                      : <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",color:"#333",fontSize:12,fontFamily:"var(--f-mono)",letterSpacing:".1em"}}>NO IMAGE · CLICK TO ADD</div>
                    }
                    <button onClick={e=>{e.stopPropagation();editService(s);}} style={{position:"absolute",top:8,right:8,background:"rgba(0,0,0,.6)",border:"none",borderRadius:8,padding:"5px 8px",cursor:"pointer",color:"#fff",display:"flex",alignItems:"center",gap:4,fontSize:11}}>
                      <EditSvg/> Edit
                    </button>
                  </div>
                  {/* Card body */}
                  <div style={{padding:"16px 18px",display:"flex",flexDirection:"column",gap:6,flex:1,background:"#fff"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"start"}}>
                      <div className="av" style={{borderRadius:12,width:40,height:40,fontSize:13}}>{String(i+1).padStart(2,"0")}</div>
                      {s.badge&&<span className="status review">{s.badge}</span>}
                    </div>
                    <div style={{fontFamily:"var(--f-display)",fontSize:20,lineHeight:1.15,marginTop:4}}>{s.name}</div>
                    <div className="bio" style={{fontSize:13,flex:1}}>{s.descr}</div>
                    <div className="adm-foot" style={{justifyContent:"space-between",alignItems:"center",width:"100%",marginTop:4}}>
                      <span style={{fontFamily:"var(--f-mono)",fontSize:11,color:"var(--muted)",letterSpacing:".12em",textTransform:"uppercase"}}>{s.count}</span>
                      <div className={`toggle ${s.visible?"on":""}`} onClick={()=>toggleSvc(s.id,!s.visible)} title={s.visible?"Hide":"Show"}/>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ══════════ TESTIMONIALS ══════════ */}
        {page==="testimonials" && (
          <section className="page active">
            <div className="page-head">
              <div><h2>Testimonials <span className="it">— {testis.length}</span></h2><p>Quotes from clients. Toggle visibility on the site.</p></div>
              <div className="page-actions"><button className="btn-primary" onClick={()=>openModal("new-testimonial")}>New testimonial <PlusChip/></button></div>
            </div>
            <div className="test-grid">
              {testis.map(t=>(
                <div key={t.id} className="test-card">
                  <div className="stars">★★★★★</div>
                  <div className="q">&ldquo;{t.quote}&rdquo;</div>
                  <div className="who"><div className="av">{t.av}</div><div><div className="n">{t.name}</div><div className="r">{t.role}</div></div></div>
                  <div style={{display:"flex",gap:6,marginTop:4}}>
                    <button className="btn-icon" title="Edit" onClick={()=>editTesti(t)}><EditSvg/></button>
                    <button className="btn-icon danger" title="Delete" onClick={()=>deleteTesti(t.id)}><TrashSvg/></button>
                  </div>
                </div>
              ))}
              {testis.length===0&&<div style={{padding:32,color:"var(--muted)"}}>No testimonials yet.</div>}
            </div>
          </section>
        )}

        {/* ══════════ MEDIA ══════════ */}
        {page==="media" && (
          <section className="page active">
            <div className="page-head">
              <div><h2>Media <span className="it">library</span></h2><p>Hero shots, OG images, brand assets.</p></div>
              <div className="page-actions"><button className="btn-ghost">Folders</button><button className="btn-primary" onClick={()=>toast("Upload — coming soon")}>Upload <PlusChip/></button></div>
            </div>
            <div className="media-grid">
              {[{n:"nestaro-hero.jpg",s:"1920×1080 · JPG · 480 KB",bg:"bg1",g:"N"},{n:"pulse-cover.png",s:"1600×900 · PNG · 1.2 MB",bg:"bg2",g:"P"},{n:"marketo-thumb.jpg",s:"1280×720 · JPG · 220 KB",bg:"bg3",g:"M"},{n:"atlas-app-shot.png",s:"1080×1920 · PNG · 880 KB",bg:"bg4",g:"A"},{n:"orbit-bank-hero.jpg",s:"1920×1080 · JPG · 540 KB",bg:"bg5",g:"O"},{n:"hearth-flow.png",s:"1600×900 · PNG · 1.0 MB",bg:"bg6",g:"H"},{n:"lumen-canvas.jpg",s:"1920×1080 · JPG · 480 KB",bg:"bg7",g:"L"},{n:"northwind-dash.png",s:"1600×900 · PNG · 760 KB",bg:"bg8",g:"N"},{n:"studio-team-1.jpg",s:"2400×1600 · JPG · 1.8 MB",bg:"bg1",g:"★"},{n:"logo-mark.svg",s:"Vector · 4 KB",bg:"bg2",g:"◆"},{n:"foxmen-wordmark.svg",s:"Vector · 6 KB",bg:"bg3",g:"F"},{n:"showreel-still.jpg",s:"1920×1080 · JPG · 420 KB",bg:"bg4",g:"▶"}].map((m,i)=>(
                <div key={i} className="media-tile"><div className={`thumb ${m.bg}`}>{m.g}</div><div className="info"><div className="n">{m.n}</div><div className="s">{m.s}</div></div></div>
              ))}
            </div>
          </section>
        )}

        {/* ══════════ ANALYTICS ══════════ */}
        {page==="analytics" && (
          <section className="page active">
            <div className="page-head"><div><h2>Analytics <span className="it">overview</span></h2><p>Real-time and historical metrics.</p></div><div className="page-actions"><button className="btn-ghost">May 2026 ↓</button><button className="btn-ghost">Export</button></div></div>
            <div className="stat-grid">
              <div className="stat"><div className="k">Page views · 30d</div><div className="v">126,840</div><div className="delta">↗ +22.1%</div></div>
              <div className="stat"><div className="k">Avg session</div><div className="v">3:48</div><div className="delta">↗ +14s</div></div>
              <div className="stat"><div className="k">Bounce rate</div><div className="v">32<span className="it">%</span></div><div className="delta down">↘ +1.2pt</div></div>
              <div className="stat"><div className="k">Conv. rate</div><div className="v">4.8<span className="it">%</span></div><div className="delta">↗ +0.6pt</div></div>
            </div>
            <div className="row-2">
              <div className="chart">
                <div className="chart-head"><h3>Page views — 90 days</h3><div className="tabs"><button>Views</button><button className="on">Sessions</button><button>Users</button></div></div>
                <svg className="chart-svg" viewBox="0 0 600 200" preserveAspectRatio="none"><defs><linearGradient id="g2" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#b86cf9" stopOpacity=".4"/><stop offset="100%" stopColor="#b86cf9" stopOpacity="0"/></linearGradient></defs><g stroke="#ececea"><line x1="0" y1="40" x2="600" y2="40"/><line x1="0" y1="100" x2="600" y2="100"/><line x1="0" y1="160" x2="600" y2="160"/></g><path d="M0,160 L30,140 L60,150 L90,120 L120,130 L150,110 L180,90 L210,100 L240,75 L270,90 L300,60 L330,80 L360,55 L390,70 L420,45 L450,60 L480,40 L510,55 L540,30 L570,45 L600,25 L600,200 L0,200 Z" fill="url(#g2)"/><path d="M0,160 L30,140 L60,150 L90,120 L120,130 L150,110 L180,90 L210,100 L240,75 L270,90 L300,60 L330,80 L360,55 L390,70 L420,45 L450,60 L480,40 L510,55 L540,30 L570,45 L600,25" fill="none" stroke="#b86cf9" strokeWidth="2.4" strokeLinejoin="round"/></svg>
              </div>
              <div className="card">
                <h3 style={{fontFamily:"var(--f-sans)",fontSize:15,fontWeight:600,margin:"0 0 16px"}}>Top pages</h3>
                <table style={{width:"100%"}}><tbody style={{fontSize:13}}>{[{p:"/projects/nestaro",v:"18,420"},{p:"/services",v:"12,180"},{p:"/",v:"9,860"},{p:"/blog/ai-features",v:"7,212"},{p:"/projects/pulse",v:"6,402"},{p:"/contact",v:"4,108"}].map((r,i)=><tr key={i}><td style={{padding:"10px 0",borderTop:i>0?"1px solid var(--line)":undefined}}>{r.p}</td><td style={{textAlign:"right",padding:"10px 0",borderTop:i>0?"1px solid var(--line)":undefined}}><b>{r.v}</b></td></tr>)}</tbody></table>
              </div>
            </div>
            <div className="row-3">
              <div className="card"><div className="sub">Devices</div><div style={{fontFamily:"var(--f-display)",fontSize:42,lineHeight:1,marginTop:6}}>68<span className="it" style={{color:"var(--brand)",fontStyle:"italic"}}>%</span></div><div style={{color:"var(--muted)",fontSize:13,marginTop:4}}>Desktop · 32% mobile</div></div>
              <div className="card"><div className="sub">Top country</div><div style={{fontFamily:"var(--f-display)",fontSize:42,lineHeight:1,marginTop:6}}>United States</div><div style={{color:"var(--muted)",fontSize:13,marginTop:4}}>22% · then Germany, UK, India</div></div>
              <div className="card"><div className="sub">Top referrer</div><div style={{fontFamily:"var(--f-display)",fontSize:42,lineHeight:1,marginTop:6}}>awwwards.com</div><div style={{color:"var(--muted)",fontSize:13,marginTop:4}}>5,840 referrals this month</div></div>
            </div>
          </section>
        )}

        {/* ══════════ CLIENTS ══════════ */}
        {page==="clients" && (
          <section className="page active">
            <div className="page-head">
              <div><h2>Clients <span className="it">— {clients.length}</span></h2><p>Active engagements, renewal dates, primary contacts.</p></div>
              <div className="page-actions"><button className="btn-primary" onClick={()=>openModal("new-client")}>Add client <PlusChip/></button></div>
            </div>
            <div className="table-wrap">
              <div className="table-tools"><div className="search"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/></svg><input placeholder="Search clients…"/></div></div>
              <table>
                <thead><tr><th>Client</th><th>Industry</th><th>Country</th><th>Contact</th><th>Engagement</th><th>MRR</th><th/></tr></thead>
                <tbody>
                  {clients.map(c=>(
                    <tr key={c.id}>
                      <td><div className="pair"><div className={`thumb-mini ${c.cls}`}>{c.av}</div><div><div className="ttl">{c.name}</div><div className="sub">/{c.name.toLowerCase()}</div></div></div></td>
                      <td>{c.industry}</td><td>{c.country}</td><td>{c.contact}</td>
                      <td><span className={`status ${engStatus(c.eng)}`}>{c.eng}</span></td>
                      <td><b>{c.mrr}</b></td>
                      <td><div className="acts"><button className="btn-icon danger" title="Remove" onClick={()=>deleteClient(c.id)}><TrashSvg/></button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {clients.length===0&&<div style={{padding:32,textAlign:"center",color:"var(--muted)"}}>No clients yet.</div>}
            </div>
          </section>
        )}

        {/* ══════════ MESSAGES ══════════ */}
        {page==="messages" && (
          <section className="page active">
            <div className="page-head">
              <div><h2>Inbox <span className="it">— {msgs.length}</span></h2><p>Leads from the contact form, press, partnerships, careers.</p></div>
              <div className="page-actions"><button className="btn-ghost" onClick={()=>{msgs.forEach(m=>{if(m.unread)markRead(m.id)});toast("All marked read");}}>Mark all read</button></div>
            </div>
            {msgs.length===0 ? (
              <div className="empty"><h3>Inbox <span style={{fontStyle:"italic",color:"var(--brand)"}}>zero.</span></h3><p>No messages yet. They&apos;ll appear here when someone sends from the contact form.</p></div>
            ) : (
              <div className="inbox">
                <aside className="col-list">
                  <div className="top"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/></svg><input placeholder="Search messages"/></div>
                  <div className="scroll">
                    {msgs.map((m,i)=>(
                      <div key={m.id} className={`thread${m.unread?" unread":""}${activeIdx===i?" on":""}`} onClick={()=>handleThread(i)}>
                        <div className="av">{m.av||m.sender.slice(0,2).toUpperCase()}</div>
                        <div className="body"><div className="row1"><div className="who">{m.sender}</div><div className="dt">{relTime(m.received_at)}</div></div><div className="sub">{m.subject}</div><div className="preview">{m.preview}</div></div>
                      </div>
                    ))}
                  </div>
                </aside>
                {activeMsg && (
                  <section className="col-msg">
                    <div className="msg-head">
                      <div className="av">{activeMsg.av||activeMsg.sender.slice(0,2).toUpperCase()}</div>
                      <div className="who"><h3>{activeMsg.sender}</h3><div className="em">{activeMsg.sender.toLowerCase().replace(/\s+/g,".")}@client.co</div></div>
                      <div className="spacer"/>
                      <button className="btn-icon" title="Delete" onClick={()=>deleteMsg(activeMsg.id)}><TrashSvg/></button>
                    </div>
                    <div className="msg-body">
                      <h2>{activeMsg.subject}</h2>
                      {(activeMsg.body||activeMsg.preview).split("\n").map((line,i)=><p key={i}>{line||<br/>}</p>)}
                    </div>
                    {(activeMsg.source||activeMsg.interested||activeMsg.budget||activeMsg.country) && (
                      <div className="msg-meta">
                        {activeMsg.source&&<div className="pair"><span className="k">Source</span><span>{activeMsg.source}</span></div>}
                        {activeMsg.interested&&<div className="pair"><span className="k">Interested in</span><span>{activeMsg.interested}</span></div>}
                        {activeMsg.budget&&<div className="pair"><span className="k">Budget</span><span>{activeMsg.budget}</span></div>}
                        {activeMsg.country&&<div className="pair"><span className="k">Country</span><span>{activeMsg.country}</span></div>}
                      </div>
                    )}
                    <div className="msg-foot">
                      <button className="btn-primary" onClick={()=>toast("Reply — email client integration coming soon")}>Reply <ArrowChip/></button>
                      <button className="btn-ghost" onClick={()=>{ openModal("new-client",{name:activeMsg.sender,contact:activeMsg.sender}); }}>Convert to client</button>
                    </div>
                  </section>
                )}
              </div>
            )}
          </section>
        )}

        {/* ══════════ LEADS ══════════ */}
        {page==="leads" && (()=>{
          const leads = msgs.filter(m=>m.source==="estimator");
          const parseLead = (m:Message)=>{ try{ return JSON.parse(m.body); }catch{ return null; } };
          return (
          <section className="page active">
            <div className="page-head">
              <div><h2>Estimator <span className="it">Leads</span></h2><p>{leads.length} lead{leads.length!==1?"s":""} from the AI Project Estimator — ready to follow up.</p></div>
              <div className="page-actions"><button className="btn-ghost" onClick={()=>loadData("leads")}>Refresh</button></div>
            </div>
            {leads.length===0 ? (
              <div className="empty"><h3>No leads <span style={{fontStyle:"italic",color:"var(--brand)"}}>yet.</span></h3><p>When someone uses the Project Estimator, their request shows up here.</p></div>
            ) : (
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))",gap:16}}>
                {leads.map(m=>{
                  const d = parseLead(m);
                  const est = d?.estimate ?? {};
                  const priceMin = est.price_min ? `$${Number(est.price_min).toLocaleString()}` : "";
                  const priceMax = est.price_max ? `$${Number(est.price_max).toLocaleString()}` : "";
                  return (
                    <div key={m.id} style={{background:"#fff",border:`1px solid ${m.unread?"var(--brand)":"var(--line)"}`,borderRadius:"var(--r)",overflow:"hidden",transition:"border-color .25s"}}>
                      {/* Card header */}
                      <div style={{padding:"16px 20px",borderBottom:"1px solid var(--line)",display:"flex",alignItems:"center",gap:12}}>
                        <div className="av" style={{width:40,height:40,borderRadius:"50%",background:"var(--brand-soft)",color:"var(--brand-deep)",display:"grid",placeItems:"center",fontWeight:600,fontSize:14,flexShrink:0}}>{m.av||m.sender.slice(0,2).toUpperCase()}</div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontWeight:600,fontSize:14,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.sender}</div>
                          <div style={{fontSize:11,color:"var(--muted)",fontFamily:"var(--f-mono)",letterSpacing:".1em"}}>{relTime(m.received_at)}</div>
                        </div>
                        {m.unread&&<span style={{background:"var(--brand)",color:"#fff",fontSize:10,fontFamily:"var(--f-mono)",letterSpacing:".1em",padding:"3px 8px",borderRadius:999}}>NEW</span>}
                      </div>
                      {/* Price */}
                      {priceMin&&<div style={{padding:"18px 20px 0",display:"flex",alignItems:"baseline",gap:6}}>
                        <span style={{fontFamily:"var(--f-display)",fontSize:36,fontWeight:400,lineHeight:1,letterSpacing:"-.02em"}}>{priceMin}</span>
                        <span style={{color:"var(--muted)",fontSize:18}}>– {priceMax}</span>
                      </div>}
                      {/* Tags */}
                      <div style={{padding:"12px 20px",display:"flex",gap:6,flexWrap:"wrap"}}>
                        {d?.type&&<span style={{background:"var(--brand-soft)",color:"var(--brand-deep)",fontSize:11,fontWeight:600,padding:"4px 10px",borderRadius:999}}>{d.type}</span>}
                        {d?.complexity&&<span style={{background:"var(--canvas)",color:"var(--muted)",fontSize:11,padding:"4px 10px",borderRadius:999}}>{d.complexity} complexity</span>}
                        {d?.timeline&&<span style={{background:"var(--canvas)",color:"var(--muted)",fontSize:11,padding:"4px 10px",borderRadius:999}}>{d.timeline}</span>}
                        {est.delivery&&<span style={{background:"var(--canvas)",color:"var(--muted)",fontSize:11,padding:"4px 10px",borderRadius:999}}>⏱ {est.delivery}</span>}
                      </div>
                      {/* Summary */}
                      {est.summary&&<div style={{padding:"0 20px 14px",fontSize:13,color:"#444",lineHeight:1.55}}>{est.summary}</div>}
                      {/* Stack */}
                      {est.recommended_stack&&<div style={{padding:"0 20px 16px",fontSize:11,fontFamily:"var(--f-mono)",color:"var(--muted)",letterSpacing:".1em"}}>{est.recommended_stack}</div>}
                      {/* Actions */}
                      <div style={{padding:"12px 20px",borderTop:"1px solid var(--line)",display:"flex",gap:8,background:"var(--canvas)"}}>
                        <button className="btn-primary" style={{flex:1,justifyContent:"center"}} onClick={()=>{ openModal("new-client",{name:m.sender,contact:m.sender,industry:d?.type||"",mrr:m.budget||""}); }}>Convert to client <ArrowChip/></button>
                        <button className="btn-ghost" onClick={()=>{ if(m.unread) markRead(m.id); }} style={{opacity:m.unread?1:.4,cursor:m.unread?"pointer":"default"}}>Mark read</button>
                        <button className="btn-icon danger" title="Delete" onClick={()=>deleteMsg(m.id)}><TrashSvg/></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
          );
        })()}

        {/* ══════════ TEAM ══════════ */}
        {page==="team" && (
          <section className="page active">
            <div className="page-head">
              <div><h2>Team <span className="it">— {team.length}</span></h2><p>The studio. Roles, locations, permissions.</p></div>
              <div className="page-actions"><button className="btn-primary" onClick={()=>openModal("new-team")}>Invite member <PlusChip/></button></div>
            </div>
            <div className="team-grid">
              {team.map(m=>(
                <div key={m.id} className="team-card">
                  <div className="av">{m.av}</div>
                  <div><div className="n">{m.name}</div><div className="r">{m.role}</div></div>
                  <div className="bio">{m.bio}</div>
                  <div className="adm-foot">
                    <button className="btn-icon" title="Message"><MsgSvg/></button>
                    <button className="btn-icon danger" title="Remove" onClick={()=>deleteMember(m.id)}><TrashSvg/></button>
                  </div>
                </div>
              ))}
              {team.length===0&&<div style={{padding:32,color:"var(--muted)"}}>No team members yet.</div>}
            </div>
          </section>
        )}

        {/* ══════════ FOX PRICING ══════════ */}
        {page==="fox-prices" && (()=>{
          const CATS = ["Website","Mobile App","E-commerce","AI Tool","Branding"];
          const catRows = foxPrices.filter(p=>p.category===priceCat);
          const baseRow = catRows.find(p=>p.is_base);
          const featureRows = catRows.filter(p=>!p.is_base);
          const lp = localPrices;
          const setLp = (id:number, field:"min"|"max", val:string)=>{
            const n = parseInt(val)||0;
            setLocalPrices(prev=>({...prev,[id]:{...(prev[id]??{min:0,max:0}),[field]:n}}));
          };
          const isDirty = (id:number, orig:{price_min:number;price_max:number})=>
            lp[id] && (lp[id].min !== orig.price_min || lp[id].max !== orig.price_max);
          const anyDirty = catRows.some(r=>isDirty(r.id,r));
          return (
          <section className="page active">
            <div className="page-head">
              <div><h2>Fox <span className="it">Pricing</span></h2><p>Set the base and feature price ranges shown to visitors in the Fox AI chat. Changes apply immediately.</p></div>
              <div className="page-actions">
                <button className="btn-primary" disabled={!anyDirty} onClick={()=>saveFoxCat(priceCat)}>Save {priceCat} <ArrowChip/></button>
              </div>
            </div>
            {/* Category tabs */}
            <div style={{display:"flex",gap:4,marginBottom:20,padding:3,background:"var(--canvas)",borderRadius:999,width:"fit-content"}}>
              {CATS.map(c=>(
                <button key={c} onClick={()=>setPriceCat(c)} style={{padding:"7px 16px",borderRadius:999,fontSize:12,fontWeight:500,border:"none",cursor:"pointer",background:priceCat===c?"#fff":"transparent",color:priceCat===c?"var(--ink)":"var(--muted)",boxShadow:priceCat===c?"0 1px 4px rgba(0,0,0,.08)":"none",transition:"all .15s"}}>{c}</button>
              ))}
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Feature</th><th style={{width:140}}>Min ($)</th><th style={{width:140}}>Max ($)</th><th style={{width:80}}/></tr></thead>
                <tbody>
                  {/* Base price row */}
                  {baseRow && (
                    <tr style={{background:"#fafaf8"}}>
                      <td>
                        <div className="ttl" style={{display:"flex",alignItems:"center",gap:8}}>
                          <span style={{background:"#0a0a0a",color:"#fff",fontSize:9,fontFamily:"var(--f-mono)",letterSpacing:".1em",padding:"3px 8px",borderRadius:999,textTransform:"uppercase"}}>Base</span>
                          {baseRow.label}
                        </div>
                        <div className="sub">Starting price before any features are added</div>
                      </td>
                      <td><input type="number" value={lp[baseRow.id]?.min??baseRow.price_min} onChange={e=>setLp(baseRow.id,"min",e.target.value)} style={{width:"100%",padding:"8px 10px",borderRadius:8,border:`1.5px solid ${isDirty(baseRow.id,baseRow)?"var(--brand)":"var(--line)"}`,fontSize:13,fontFamily:"var(--f-mono)",outline:"none"}}/></td>
                      <td><input type="number" value={lp[baseRow.id]?.max??baseRow.price_max} onChange={e=>setLp(baseRow.id,"max",e.target.value)} style={{width:"100%",padding:"8px 10px",borderRadius:8,border:`1.5px solid ${isDirty(baseRow.id,baseRow)?"var(--brand)":"var(--line)"}`,fontSize:13,fontFamily:"var(--f-mono)",outline:"none"}}/></td>
                      <td><button className="btn-icon" title="Save" style={{opacity:isDirty(baseRow.id,baseRow)?1:.3}} onClick={()=>saveFoxPrice(baseRow.id)}><ArrowChip/></button></td>
                    </tr>
                  )}
                  {/* Feature rows */}
                  {featureRows.map(f=>(
                    <tr key={f.id}>
                      <td>
                        <div className="ttl">{f.label}</div>
                        <div className="sub" style={{fontFamily:"var(--f-mono)",fontSize:10,letterSpacing:".1em",color:"var(--muted)",textTransform:"uppercase"}}>{f.feature_id}</div>
                      </td>
                      <td><input type="number" value={lp[f.id]?.min??f.price_min} onChange={e=>setLp(f.id,"min",e.target.value)} style={{width:"100%",padding:"8px 10px",borderRadius:8,border:`1.5px solid ${isDirty(f.id,f)?"var(--brand)":"var(--line)"}`,fontSize:13,fontFamily:"var(--f-mono)",outline:"none"}}/></td>
                      <td><input type="number" value={lp[f.id]?.max??f.price_max} onChange={e=>setLp(f.id,"max",e.target.value)} style={{width:"100%",padding:"8px 10px",borderRadius:8,border:`1.5px solid ${isDirty(f.id,f)?"var(--brand)":"var(--line)"}`,fontSize:13,fontFamily:"var(--f-mono)",outline:"none"}}/></td>
                      <td><button className="btn-icon" title="Save" style={{opacity:isDirty(f.id,f)?1:.3}} onClick={()=>saveFoxPrice(f.id)}><ArrowChip/></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {foxPrices.length===0&&<div style={{padding:32,textAlign:"center",color:"var(--muted)"}}>Loading pricing data…</div>}
            </div>
            <div style={{marginTop:16,padding:"12px 16px",background:"var(--canvas)",borderRadius:10,fontSize:12,color:"var(--muted)",border:"1px solid var(--line)"}}>
              Prices shown in USD. The Fox chat shows a live estimate as visitors select features. Updated prices apply to all new visitors immediately — no redeploy needed.
            </div>
          </section>
          );
        })()}

        {/* ══════════ SETTINGS ══════════ */}
        {page==="settings" && (
          <section className="page active">
            <div className="page-head">
              <div><h2>Settings</h2><p>Brand, SEO, integrations and security for the workspace.</p></div>
              <div className="page-actions">
                <div style={{display:"flex",gap:2,padding:2,background:"var(--canvas)",borderRadius:999}}>
                  {["brand","seo","integrations","security","billing"].map(tab=>(
                    <button key={tab} onClick={()=>setSettingsTab(tab)} style={{padding:"6px 14px",borderRadius:999,fontSize:12,background:settingsTab===tab?"#fff":"transparent",color:settingsTab===tab?"var(--ink)":"var(--muted)"}}>
                      {tab.charAt(0).toUpperCase()+tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="card" style={{padding:"0 28px"}}>
              {settingsTab==="brand" && <div>
                <div className="form-section"><div className="lhs"><h3>Brand identity</h3><p>Name, tagline and description.</p></div><div className="rhs">
                  <div className="field"><label>Studio name</label><input type="text" data-setting="studio_name" defaultValue="Foxmen Studio"/></div>
                  <div className="field"><label>Tagline</label><input type="text" data-setting="tagline" defaultValue="Code · Craft · Care"/></div>
                  <div className="field"><label>Brand description</label><textarea data-setting="brand_desc" defaultValue="International digital studio. We design, engineer, and grow products for ambitious teams across 17 countries."/></div>
                </div></div>
                <div className="form-section"><div className="lhs"><h3>Site behaviour</h3><p>Toggles for the live site.</p></div><div className="rhs">
                  {[["Custom cursor","Brand-colored cursor dot."],["Mask-reveal showreel","Full-screen video on homepage."],["Preloader animation","2.5-second branded splash."],["Print noise overlay","Editorial texture."]].map(([h,p],i)=>(
                    <div key={i} className="row-pair"><div className="text"><h4>{h}</h4><p>{p}</p></div><div className={`toggle ${brandT[i]?"on":""}`} onClick={()=>setBrandT(t=>t.map((x,j)=>j===i?!x:x))}/></div>
                  ))}
                </div></div>
                <div className="savebar"><div className="hint">Unsaved changes</div><div style={{display:"flex",gap:8}}><button className="btn-ghost">Discard</button><button className="btn-primary" onClick={()=>saveSettings("brand")}>Save changes <ArrowChip/></button></div></div>
              </div>}
              {settingsTab==="seo" && <div>
                <div className="form-section"><div className="lhs"><h3>Search defaults</h3><p>Used on pages without their own metadata.</p></div><div className="rhs">
                  <div className="field"><label>Title</label><input type="text" data-setting="seo_title" defaultValue="Foxmen Studio — Code. Craft. Care."/></div>
                  <div className="field"><label>Meta description</label><textarea data-setting="seo_desc" defaultValue="International digital agency building websites, mobile apps, AI-integrated software, ecommerce and real estate platforms."/></div>
                  <div className="field"><label>Canonical URL</label><input type="text" data-setting="canonical_url" defaultValue="https://foxmen.studio"/></div>
                  <div className="field-row"><div className="field"><label>Twitter handle</label><input type="text" data-setting="twitter_handle" defaultValue="@foxmenstudio"/></div><div className="field"><label>Google Analytics ID</label><input type="text" data-setting="ga_id" defaultValue="G-XXXXXXX2"/></div></div>
                </div></div>
                <div className="form-section"><div className="lhs"><h3>Robots</h3></div><div className="rhs">
                  {[["Index the site","Allow search engines to crawl."],["Auto-submit sitemap","Resubmits on every change."]].map(([h,p],i)=>(
                    <div key={i} className="row-pair"><div className="text"><h4>{h}</h4><p>{p}</p></div><div className={`toggle ${seoT[i]?"on":""}`} onClick={()=>setSeoT(t=>t.map((x,j)=>j===i?!x:x))}/></div>
                  ))}
                </div></div>
                <div className="savebar"><div className="hint">Unsaved changes</div><div style={{display:"flex",gap:8}}><button className="btn-ghost">Discard</button><button className="btn-primary" onClick={()=>saveSettings("seo")}>Save changes <ArrowChip/></button></div></div>
              </div>}
              {settingsTab==="integrations" && (
                <div className="form-section"><div className="lhs"><h3>Connected services</h3><p>OAuth integrations.</p></div><div className="rhs">
                  {[["Stripe","Invoices & payouts","live","Connected"],["Slack","Inbox & deploy notifications","live","Connected"],["Linear","Project tracking","live","Connected"],["OpenAI","For copy & AI features","live","Connected"],["HubSpot","CRM sync","draft","Not connected"],["Figma","Embed design files","draft","Not connected"]].map(([h,p,st,label],i)=>(
                    <div key={i} className="row-pair"><div className="text"><h4>{h}</h4><p>{p}</p></div><span className={`status ${st}`}>{label}</span></div>
                  ))}
                </div></div>
              )}
              {settingsTab==="security" && <div>
                <div className="form-section"><div className="lhs"><h3>Authentication</h3></div><div className="rhs">
                  {[["Require 2FA for owners","Authenticator app required."],["Allow Google SSO","Studio Google workspace."],["Allow GitHub SSO","Engineering team."],["Auto-logout after 24h","Inactive sessions expire."]].map(([h,p],i)=>(
                    <div key={i} className="row-pair"><div className="text"><h4>{h}</h4><p>{p}</p></div><div className={`toggle ${secT[i]?"on":""}`} onClick={()=>setSecT(t=>t.map((x,j)=>j===i?!x:x))}/></div>
                  ))}
                </div></div>
                <div className="form-section"><div className="lhs"><h3>Sessions</h3></div><div className="rhs">
                  <div className="row-pair"><div className="text"><h4>MacBook Pro · Chrome · Dhaka</h4><p>This device · active now</p></div><span className="status live">Active</span></div>
                  <div className="row-pair"><div className="text"><h4>iPhone 15 · Safari · Dhaka</h4><p>2 hours ago</p></div><button className="btn-ghost danger" onClick={()=>toast("Session ended")}>Sign out</button></div>
                </div></div>
              </div>}
              {settingsTab==="billing" && (
                <div className="form-section"><div className="lhs"><h3>Current plan</h3></div><div className="rhs">
                  <div className="card" style={{background:"var(--canvas)",border:"1px solid var(--line)"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",gap:14}}>
                      <div><div className="sub">Plan</div><div style={{fontFamily:"var(--f-display)",fontSize:36,lineHeight:1,marginTop:6}}>Studio <span className="it" style={{color:"var(--brand)",fontStyle:"italic"}}>Pro</span></div><div style={{color:"var(--muted)",fontSize:13,marginTop:6}}>Renews May 28, 2026 · $480/year</div></div>
                      <button className="btn-ghost">Manage</button>
                    </div>
                  </div>
                  <div className="row-pair"><div className="text"><h4>Workspace seats</h4><p>12 of 25 used</p></div><span className="status live">13 left</span></div>
                  <div className="row-pair"><div className="text"><h4>Storage</h4><p>482 MB of 50 GB</p></div><span className="status live">OK</span></div>
                  <div className="row-pair"><div className="text"><h4>AI tokens</h4><p>4.2M of 10M monthly</p></div><span className="status review">42%</span></div>
                </div></div>
              )}
            </div>
          </section>
        )}

      </main>

      {/* ══ MODAL ══ */}
      {modalType && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-card" onClick={e=>e.stopPropagation()}>
            <div className="modal-head">
              <h3>{modalType==="new-service"&&editTarget?"Edit service":(MODAL_TITLE[modalType]||"New item")}</h3>
              <button className="close" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              {/* PROJECT */}
              {(modalType==="new-project"||modalType==="edit-project") && <>
                <Field label="Project name *" value={form.name||""} onChange={v=>sf("name",v)} placeholder="e.g. Nestaro — real estate OS"/>
                <Field label="Industry" value={form.industry||""} onChange={v=>sf("industry",v)} placeholder="e.g. Fintech"/>
                <Field label="Year" value={form.year||String(new Date().getFullYear())} onChange={v=>sf("year",v)}/>
                <Field label="Scope" value={form.scope||""} onChange={v=>sf("scope",v)} placeholder="e.g. Web · iOS · Android"/>
                <FieldSel label="Status" value={form.status||"draft"} onChange={v=>sf("status",v)} options={["draft","live","review","archived"]}/>
                <FieldSel label="Color variant" value={form.color_cls||""} onChange={v=>sf("color_cls",v)} options={["(purple)","b","c","d"]}/>
              </>}
              {/* POST */}
              {(modalType==="new-post"||modalType==="edit-post") && <>
                <Field label="Title *" value={form.title||""} onChange={v=>sf("title",v)} placeholder="e.g. Why AI features fail in production"/>
                <FieldSel label="Category" value={form.category||"Design"} onChange={v=>sf("category",v)} options={["AI","Design","Engineering","Studio","Case studies"]}/>
                <Field label="Author name" value={form.author_name||""} onChange={v=>sf("author_name",v)} placeholder="e.g. Devon Arias"/>
                <Field label="Read time" value={form.read_time||""} onChange={v=>sf("read_time",v)} placeholder="e.g. 8 min"/>
                <FieldSel label="Status" value={form.status||"draft"} onChange={v=>sf("status",v)} options={["draft","live","review"]}/>
              </>}
              {/* TESTIMONIAL */}
              {(modalType==="new-testimonial"||modalType==="edit-testimonial") && <>
                <FieldArea label="Quote *" value={form.quote||""} onChange={v=>sf("quote",v)} placeholder="What the client said…"/>
                <Field label="Client name *" value={form.name||""} onChange={v=>sf("name",v)} placeholder="e.g. Sara Köhler"/>
                <Field label="Role" value={form.role||""} onChange={v=>sf("role",v)} placeholder="e.g. CEO · Nestaro"/>
                <Field label="Highlight phrase" value={form.hi||""} onChange={v=>sf("hi",v)} placeholder="Word to italicise in the quote"/>
              </>}
              {/* CLIENT */}
              {modalType==="new-client" && <>
                <Field label="Company name *" value={form.name||""} onChange={v=>sf("name",v)} placeholder="e.g. Orbit Bank"/>
                <Field label="Industry" value={form.industry||""} onChange={v=>sf("industry",v)} placeholder="e.g. Fintech"/>
                <Field label="Country code" value={form.country||""} onChange={v=>sf("country",v)} placeholder="e.g. DE"/>
                <Field label="Primary contact" value={form.contact||""} onChange={v=>sf("contact",v)} placeholder="e.g. Julia Weber"/>
                <FieldSel label="Engagement type" value={form.eng||"Active build"} onChange={v=>sf("eng",v)} options={["Active build","Retainer","Discovery","Past project"]}/>
                <Field label="MRR / value" value={form.mrr||""} onChange={v=>sf("mrr",v)} placeholder="e.g. $12k/mo or $180k total"/>
              </>}
              {/* TEAM */}
              {modalType==="new-team" && <>
                <Field label="Full name *" value={form.name||""} onChange={v=>sf("name",v)} placeholder="e.g. Sara Köhler"/>
                <Field label="Role" value={form.role||""} onChange={v=>sf("role",v)} placeholder="e.g. Design Director"/>
                <FieldArea label="Bio" value={form.bio||""} onChange={v=>sf("bio",v)} placeholder="One sentence about what they do…"/>
                <Field label="Initials (optional — auto-generated)" value={form.av||""} onChange={v=>sf("av",v)} placeholder="e.g. SK"/>
              </>}
              {/* SERVICE */}
              {modalType==="new-service" && <>
                <Field label="Service name *" value={form.name||""} onChange={v=>sf("name",v)} placeholder="e.g. Mobile Design"/>
                <FieldArea label="Description" value={form.descr||""} onChange={v=>sf("descr",v)} placeholder="One sentence summary…"/>
                <Field label="Client count label" value={form.count||""} onChange={v=>sf("count",v)} placeholder="e.g. 12 clients"/>
                <Field label="Badge (optional)" value={form.badge||""} onChange={v=>sf("badge",v)} placeholder="e.g. New"/>
                <Field label="Image URL (optional)" value={form.image||""} onChange={v=>sf("image",v)} placeholder="https://…"/>
                {form.image && <img src={form.image} alt="preview" style={{width:"100%",height:120,objectFit:"cover",borderRadius:10,marginTop:4}}/>}
              </>}
            </div>
            <div className="modal-foot">
              <button className="btn-ghost" onClick={closeModal}>Cancel</button>
              <button className="btn-primary" onClick={submitModal} disabled={submitting}>{submitting?"Saving…":"Save"} <ArrowChip/></button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      <div className={`toast${toastOn?" show":""}`}><span className="dot"/><span>{toastMsg}</span></div>

    </div>
  );
}
