"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h18M13 5l7 7-7 7" />
    </svg>
  );
}

const filters = ["All work","Web","Mobile","AI","Ecommerce","Real Estate","Brand"];

const projects = [
  { slug:"nestaro",  tone:"violet", label:"Case 01", year:"2025", name:"Nestaro",   sub:"— real estate OS",   desc:"Search-first listings platform with map clustering and AI summaries." },
  { slug:"pulse",    tone:"dark",   label:"Case 02", year:"2025", name:"Pulse",     sub:"— AI copilot",        desc:"RAG-powered sales copilot with custom embeddings, agent tooling." },
  { slug:"marketo",  tone:"brand",  label:"Case 03", year:"2024", name:"Marketo",   sub:"— marketplace",      desc:"Multi-vendor commerce with Stripe Connect split payouts." },
  { slug:"atlas",    tone:"bone",   label:"Case 04", year:"2025", name:"Atlas",     sub:"— travel app",       desc:"Native iOS travel planner with AI-generated itineraries." },
  { slug:"orbit",    tone:"dark",   label:"Case 05", year:"2024", name:"Orbit Bank",sub:"— fintech",          desc:"Mobile-first neobank with budget intelligence and family accounts." },
  { slug:"hearth",   tone:"brand",  label:"Case 06", year:"2024", name:"Hearth",    sub:"— wellness",         desc:"Connected wellness app pairing therapists with AI-assisted journaling." },
  { slug:"lumen",    tone:"violet", label:"Case 07", year:"2023", name:"Lumen",     sub:"— AI canvas",        desc:"Generative design canvas built for production marketing teams." },
  { slug:"northwind",tone:"bone",   label:"Case 08", year:"2023", name:"Northwind", sub:"— logistics",        desc:"Fleet dashboard with predictive routing and real-time SLA telemetry." },
];

type DbProject = { id:number; name:string; tagline:string; industry:string; year:string; scope:string; status:string; thumbnail:string; hero_image:string; color_cls:string; live_url:string; slug:string };
const TONE_MAP:Record<string,string> = { "(purple)":"violet","":"violet",b:"dark",c:"brand",d:"bone" };

export default function WorkPage() {
  useScrollReveal();
  const [active, setActive] = useState("All work");
  const [dbProjects, setDbProjects] = useState<DbProject[]>([]);

  useEffect(()=>{
    fetch("/api/projects").then(r=>r.json()).then(rows=>{
      if(Array.isArray(rows)) setDbProjects(rows.filter((p:DbProject)=>p.status==="live"));
    }).catch(()=>{});
  },[]);

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="crumbs fade in">
            <Link href="/">Home</Link><span className="sep">/</span><span>Work</span>
          </div>
          <h1 className="display">
            <span className="reveal in"><span className="reveal-inner">Selected</span></span>
            <span className="reveal in reveal-delay-1"><span className="reveal-inner it">work.</span></span>
          </h1>
          <p className="lede fade in d2">
            Six years of products built end to end — from seed-stage MVPs to multi-vendor platforms
            shipping at scale. Filter by craft below.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 48 }}>
        <div className="wrap">
          <div className="proj-filters fade in">
            {filters.map((f) => (
              <button
                key={f}
                className={active === f ? "on" : ""}
                onClick={() => setActive(f)}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="proj-grid">
            {(dbProjects.length > 0 ? dbProjects.map((p,i)=>{
              const tone = TONE_MAP[p.color_cls]??"violet";
              const label = `Case ${String(i+1).padStart(2,"0")}`;
              const img = p.thumbnail||p.hero_image||"";
              const href = p.slug ? `/work/${p.slug}` : p.live_url||"#";
              const isExternal = !p.slug && !!p.live_url;
              return(
                <a href={href} target={isExternal?"_blank":"_self"} rel="noopener noreferrer"
                  className={`item ${tone} fade${i%4===0?"":" d"+(i%4)}`} key={p.id}>
                  <div className="thumb" style={img?{backgroundImage:`url(${img})`,backgroundSize:"cover",backgroundPosition:"center"}:undefined}>
                    {!img&&"— Hero shot —"}
                  </div>
                  <div className="body">
                    <div className="meta"><span>{label}</span><span>{p.year}</span></div>
                    <h3>{p.name}</h3>
                    <p style={{color:"#3a3a3a",margin:0}}>{p.tagline}</p>
                  </div>
                </a>
              );
            }) : projects.map((p, i) => (
              <Link href={`/work/${p.slug}`} className={`item ${p.tone} fade${i % 4 === 0 ? "" : ` d${i % 4}`}`} key={p.slug}>
                <div className="thumb">— Hero shot —</div>
                <div className="body">
                  <div className="meta"><span>{p.label}</span><span>{p.year}</span></div>
                  <h3>{p.name} <span className="it">{p.sub}</span></h3>
                  <p style={{ color:"#3a3a3a", margin: 0 }}>{p.desc}</p>
                </div>
              </Link>
            )))}
          </div>
        </div>
      </section>

      <section id="contact" style={{ padding: "60px 0" }}>
        <div className="cta">
          <div className="wrap-tight">
            <div className="fade in"><span className="eyebrow">Let&apos;s build</span></div>
            <h2 className="fade in d1">Got a brief? <span className="it">Or just</span><br />a half-formed idea?</h2>
            <div className="row fade in d2">
              <Link href="/contact" className="btn btn--lg">
                <span className="label">Start a project</span>
                <span className="chip"><ArrowIcon /></span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
