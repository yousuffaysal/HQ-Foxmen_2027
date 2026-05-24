"use client";
import { useEffect, useRef, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const SERVICES = ["Web Design & Dev", "Mobile App", "AI Integration", "Ecommerce", "Real Estate", "Brand · UI/UX", "Marketing"];
const BUDGETS  = ["Under $2K", "$2K – $5K", "$5K – $10K", "$10K – $25K", "$25K+"];
const SOURCES  = ["Clutch", "ChatGPT", "Google", "Behance", "Dribbble", "Others"];

/* ── Country data ── */
const flag = (c: string) => c.toUpperCase().split("").map(l => String.fromCodePoint(0x1F1E6 + l.charCodeAt(0) - 65)).join("");
const COUNTRIES = [
  ["AF","Afghanistan","+93"],["AL","Albania","+355"],["DZ","Algeria","+213"],["AD","Andorra","+376"],["AO","Angola","+244"],
  ["AG","Antigua & Barbuda","+1-268"],["AR","Argentina","+54"],["AM","Armenia","+374"],["AU","Australia","+61"],["AT","Austria","+43"],
  ["AZ","Azerbaijan","+994"],["BS","Bahamas","+1-242"],["BH","Bahrain","+973"],["BD","Bangladesh","+880"],["BB","Barbados","+1-246"],
  ["BY","Belarus","+375"],["BE","Belgium","+32"],["BZ","Belize","+501"],["BJ","Benin","+229"],["BT","Bhutan","+975"],
  ["BO","Bolivia","+591"],["BA","Bosnia & Herzegovina","+387"],["BW","Botswana","+267"],["BR","Brazil","+55"],["BN","Brunei","+673"],
  ["BG","Bulgaria","+359"],["BF","Burkina Faso","+226"],["BI","Burundi","+257"],["CV","Cabo Verde","+238"],["KH","Cambodia","+855"],
  ["CM","Cameroon","+237"],["CA","Canada","+1"],["CF","Central African Republic","+236"],["TD","Chad","+235"],["CL","Chile","+56"],
  ["CN","China","+86"],["CO","Colombia","+57"],["KM","Comoros","+269"],["CG","Congo","+242"],["CR","Costa Rica","+506"],
  ["HR","Croatia","+385"],["CU","Cuba","+53"],["CY","Cyprus","+357"],["CZ","Czech Republic","+420"],["DK","Denmark","+45"],
  ["DJ","Djibouti","+253"],["DM","Dominica","+1-767"],["DO","Dominican Republic","+1-809"],["EC","Ecuador","+593"],["EG","Egypt","+20"],
  ["SV","El Salvador","+503"],["GQ","Equatorial Guinea","+240"],["ER","Eritrea","+291"],["EE","Estonia","+372"],["SZ","Eswatini","+268"],
  ["ET","Ethiopia","+251"],["FJ","Fiji","+679"],["FI","Finland","+358"],["FR","France","+33"],["GA","Gabon","+241"],
  ["GM","Gambia","+220"],["GE","Georgia","+995"],["DE","Germany","+49"],["GH","Ghana","+233"],["GR","Greece","+30"],
  ["GD","Grenada","+1-473"],["GT","Guatemala","+502"],["GN","Guinea","+224"],["GW","Guinea-Bissau","+245"],["GY","Guyana","+592"],
  ["HT","Haiti","+509"],["HN","Honduras","+504"],["HU","Hungary","+36"],["IS","Iceland","+354"],["IN","India","+91"],
  ["ID","Indonesia","+62"],["IR","Iran","+98"],["IQ","Iraq","+964"],["IE","Ireland","+353"],["IL","Israel","+972"],
  ["IT","Italy","+39"],["JM","Jamaica","+1-876"],["JP","Japan","+81"],["JO","Jordan","+962"],["KZ","Kazakhstan","+7"],
  ["KE","Kenya","+254"],["KI","Kiribati","+686"],["KW","Kuwait","+965"],["KG","Kyrgyzstan","+996"],["LA","Laos","+856"],
  ["LV","Latvia","+371"],["LB","Lebanon","+961"],["LS","Lesotho","+266"],["LR","Liberia","+231"],["LY","Libya","+218"],
  ["LI","Liechtenstein","+423"],["LT","Lithuania","+370"],["LU","Luxembourg","+352"],["MG","Madagascar","+261"],["MW","Malawi","+265"],
  ["MY","Malaysia","+60"],["MV","Maldives","+960"],["ML","Mali","+223"],["MT","Malta","+356"],["MH","Marshall Islands","+692"],
  ["MR","Mauritania","+222"],["MU","Mauritius","+230"],["MX","Mexico","+52"],["FM","Micronesia","+691"],["MD","Moldova","+373"],
  ["MC","Monaco","+377"],["MN","Mongolia","+976"],["ME","Montenegro","+382"],["MA","Morocco","+212"],["MZ","Mozambique","+258"],
  ["MM","Myanmar","+95"],["NA","Namibia","+264"],["NR","Nauru","+674"],["NP","Nepal","+977"],["NL","Netherlands","+31"],
  ["NZ","New Zealand","+64"],["NI","Nicaragua","+505"],["NE","Niger","+227"],["NG","Nigeria","+234"],["NO","Norway","+47"],
  ["OM","Oman","+968"],["PK","Pakistan","+92"],["PW","Palau","+680"],["PA","Panama","+507"],["PG","Papua New Guinea","+675"],
  ["PY","Paraguay","+595"],["PE","Peru","+51"],["PH","Philippines","+63"],["PL","Poland","+48"],["PT","Portugal","+351"],
  ["QA","Qatar","+974"],["RO","Romania","+40"],["RU","Russia","+7"],["RW","Rwanda","+250"],["KN","Saint Kitts & Nevis","+1-869"],
  ["LC","Saint Lucia","+1-758"],["VC","Saint Vincent","+1-784"],["WS","Samoa","+685"],["SM","San Marino","+378"],["ST","Sao Tome & Principe","+239"],
  ["SA","Saudi Arabia","+966"],["SN","Senegal","+221"],["RS","Serbia","+381"],["SC","Seychelles","+248"],["SL","Sierra Leone","+232"],
  ["SG","Singapore","+65"],["SK","Slovakia","+421"],["SI","Slovenia","+386"],["SB","Solomon Islands","+677"],["SO","Somalia","+252"],
  ["ZA","South Africa","+27"],["SS","South Sudan","+211"],["ES","Spain","+34"],["LK","Sri Lanka","+94"],["SD","Sudan","+249"],
  ["SR","Suriname","+597"],["SE","Sweden","+46"],["CH","Switzerland","+41"],["SY","Syria","+963"],["TW","Taiwan","+886"],
  ["TJ","Tajikistan","+992"],["TZ","Tanzania","+255"],["TH","Thailand","+66"],["TL","Timor-Leste","+670"],["TG","Togo","+228"],
  ["TO","Tonga","+676"],["TT","Trinidad & Tobago","+1-868"],["TN","Tunisia","+216"],["TR","Turkey","+90"],["TM","Turkmenistan","+993"],
  ["TV","Tuvalu","+688"],["UG","Uganda","+256"],["UA","Ukraine","+380"],["AE","United Arab Emirates","+971"],["GB","United Kingdom","+44"],
  ["US","United States","+1"],["UY","Uruguay","+598"],["UZ","Uzbekistan","+998"],["VU","Vanuatu","+678"],["VE","Venezuela","+58"],
  ["VN","Vietnam","+84"],["YE","Yemen","+967"],["ZM","Zambia","+260"],["ZW","Zimbabwe","+263"],
].map(([code, name, dial]) => ({ code: code as string, name: name as string, dial: dial as string, emoji: flag(code as string) }));

/* ── Country selector component ── */
function CountrySelect({ value, onChange }: { value: string; onChange: (dial: string) => void }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const selected = COUNTRIES.find(c => c.dial === value) ?? COUNTRIES.find(c => c.code === "US")!;
  const filtered = q ? COUNTRIES.filter(c => c.name.toLowerCase().includes(q.toLowerCase()) || c.dial.includes(q)) : COUNTRIES;

  useEffect(() => {
    function handler(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position:"relative", flexShrink:0 }}>
      <button
        type="button"
        onClick={() => setOpen(p => !p)}
        style={{ display:"flex", alignItems:"center", gap:4, padding:"8px 6px 10px 0", border:"none", background:"transparent", cursor:"pointer", fontSize:16 }}
      >
        <span>{selected.emoji}</span>
        <span style={{ fontFamily:"var(--f-sans)", fontSize:13, color:"#555" }}>{selected.dial}</span>
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ opacity:.5, marginLeft:2 }}>
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      </button>

      {open && (
        <div style={{ position:"absolute", top:"calc(100% + 4px)", left:0, zIndex:200, background:"#2a2a2a", borderRadius:12, boxShadow:"0 8px 32px rgba(0,0,0,.28)", width:260, maxHeight:300, display:"flex", flexDirection:"column" }}>
          <div style={{ padding:"10px 12px 8px" }}>
            <input
              autoFocus
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search country..."
              style={{ width:"100%", border:"none", background:"rgba(255,255,255,.08)", borderRadius:7, padding:"7px 10px", fontFamily:"var(--f-sans)", fontSize:13, color:"#fff", outline:"none" }}
            />
          </div>
          <div style={{ overflowY:"auto", flex:1 }}>
            {filtered.map(c => (
              <button
                key={c.code}
                type="button"
                onClick={() => { onChange(c.dial); setOpen(false); setQ(""); }}
                style={{ display:"flex", alignItems:"center", gap:10, width:"100%", padding:"9px 14px", border:"none", background: c.dial === value ? "rgba(255,255,255,.12)" : "transparent", cursor:"pointer", textAlign:"left" as const }}
              >
                <span style={{ fontSize:18, lineHeight:1 }}>{c.emoji}</span>
                <span style={{ fontFamily:"var(--f-sans)", fontSize:13, color:"rgba(255,255,255,.85)", flex:1 }}>{c.name}</span>
                <span style={{ fontFamily:"var(--f-mono)", fontSize:12, color:"rgba(255,255,255,.4)" }}>{c.dial}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ContactPage() {
  useScrollReveal();
  const [sent,     setSent]    = useState(false);
  const [loading,  setLoading] = useState(false);
  const [error,    setError]   = useState("");
  const [budget,   setBudget]  = useState("");
  const [service,  setService] = useState("");
  const [sources,  setSources] = useState<string[]>([]);
  const [trial,    setTrial]   = useState(false);
  const [dialCode, setDialCode] = useState("+1");
  const nameRef    = useRef<HTMLInputElement>(null);
  const emailRef   = useRef<HTMLInputElement>(null);
  const companyRef = useRef<HTMLInputElement>(null);
  const phoneRef   = useRef<HTMLInputElement>(null);
  const detailRef  = useRef<HTMLTextAreaElement>(null);

  function scrollToCalendar(e: React.MouseEvent) {
    e.preventDefault();
    document.getElementById("book-call")?.scrollIntoView({ behavior: "smooth" });
  }

  function toggleSource(s: string) {
    setSources(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:     nameRef.current?.value ?? "",
          email:    emailRef.current?.value ?? "",
          company:  companyRef.current?.value ?? "",
          whatsapp: dialCode + " " + (phoneRef.current?.value ?? ""),
          message:  detailRef.current?.value ?? "",
          budget,
          service,
          sources,
          trial,
        }),
      });
      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    const init = () => {
      if (w.Cal?.ns?.["project-discussion-call"]) {
        w.Cal.ns["project-discussion-call"]("inline", {
          elementOrSelector: "#cal-inline-contact",
          config: { layout: "month_view", useSlotsViewOnSmallScreen: "true" },
          calLink: "yousuf-faysal/project-discussion-call",
        });
        w.Cal.ns["project-discussion-call"]("ui", { hideEventTypeDetails: false, layout: "month_view" });
      } else {
        setTimeout(init, 150);
      }
    };
    init();
  }, []);

  return (
    <>
      <style>{`
        .cf-page { background: #f4f3f0; min-height: 100vh; padding: 160px 0 80px; }
        .cf-grid { display: grid; grid-template-columns: 1fr 1.35fr; gap: 80px; align-items: start; }
        /* LEFT */
        .cf-left-title { font-family: var(--f-display); font-size: clamp(38px,5vw,62px); line-height: 1.05; letter-spacing: -.03em; color: var(--ink); font-weight: 400; margin-bottom: 24px; }
        .cf-left-title em { font-style: italic; color: var(--ink); }
        .cf-left-desc { font-family: var(--f-sans); font-size: 15px; line-height: 1.65; color: #666; max-width: 400px; margin-bottom: 48px; }
        .cf-founder { display: flex; align-items: flex-end; gap: 20px; margin-bottom: 32px; }
        .cf-founder-photo { width: 90px; height: 90px; border-radius: 14px; overflow: hidden; background: var(--ink); flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-family: var(--f-display); font-size: 28px; color: rgba(255,255,255,.3); }
        .cf-founder-photo img { width: 100%; height: 100%; object-fit: cover; }
        .cf-founder-name { font-family: var(--f-sans); font-size: 17px; font-weight: 600; color: var(--ink); }
        .cf-founder-role { font-family: var(--f-sans); font-size: 13px; color: #888; margin-top: 3px; }
        .cf-proof { display: flex; align-items: center; gap: 14px; }
        .cf-avatars { display: flex; }
        .cf-avatar { width: 32px; height: 32px; border-radius: 50%; border: 2px solid #f4f3f0; background: var(--ink); margin-left: -10px; display: flex; align-items: center; justify-content: center; font-family: var(--f-mono); font-size: 9px; color: rgba(255,255,255,.6); }
        .cf-avatar:first-child { margin-left: 0; }
        .cf-proof-text { font-family: var(--f-sans); font-size: 13px; color: #666; }
        .cf-stars { display: flex; align-items: center; gap: 2px; color: #f59e0b; font-size: 14px; }
        /* RIGHT — form */
        .cf-form-wrap { background: #fff; border-radius: 24px; padding: 48px 44px; }
        .cf-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0 28px; }
        .cf-field { display: flex; flex-direction: column; margin-bottom: 28px; }
        .cf-label { font-family: var(--f-sans); font-size: 13px; font-weight: 500; color: var(--ink); margin-bottom: 8px; }
        .cf-input { border: none; border-bottom: 1.5px solid #d8d6d2; background: transparent; padding: 8px 0 10px; font-family: var(--f-sans); font-size: 15px; color: var(--ink); outline: none; transition: border-color .2s; width: 100%; }
        .cf-input::placeholder { color: #b0aea9; }
        .cf-input:focus { border-bottom-color: var(--ink); }
        .cf-select { border: none; border-bottom: 1.5px solid #d8d6d2; background: transparent; padding: 8px 0 10px; font-family: var(--f-sans); font-size: 15px; color: var(--ink); outline: none; cursor: pointer; width: 100%; -webkit-appearance: none; appearance: none; background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%23888' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 4px center; padding-right: 24px; }
        .cf-select:focus { border-bottom-color: var(--ink); }
        .cf-phone-wrap { display: flex; align-items: flex-end; gap: 0; border-bottom: 1.5px solid #d8d6d2; transition: border-color .2s; }
        .cf-phone-wrap:focus-within { border-bottom-color: var(--ink); }
        .cf-phone-flag { border: none; background: transparent; padding: 8px 8px 10px 0; font-size: 15px; cursor: pointer; display: flex; align-items: center; gap: 4px; color: var(--ink); font-family: var(--f-sans); flex-shrink: 0; }
        .cf-phone-flag svg { opacity: .5; }
        .cf-phone-input { border: none; background: transparent; padding: 8px 0 10px; font-family: var(--f-sans); font-size: 15px; color: var(--ink); outline: none; width: 100%; }
        .cf-phone-input::placeholder { color: #b0aea9; }
        .cf-pills { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 4px; }
        .cf-pill { padding: 7px 16px; border-radius: 999px; border: 1.5px solid #d8d6d2; background: transparent; font-family: var(--f-sans); font-size: 13px; color: var(--ink); cursor: pointer; transition: background .15s, border-color .15s, color .15s; }
        .cf-pill.on { background: var(--ink); border-color: var(--ink); color: #fff; }
        .cf-textarea { border: none; border-bottom: 1.5px solid #d8d6d2; background: transparent; padding: 8px 0 10px; font-family: var(--f-sans); font-size: 15px; color: var(--ink); outline: none; resize: none; width: 100%; min-height: 80px; transition: border-color .2s; }
        .cf-textarea::placeholder { color: #b0aea9; }
        .cf-textarea:focus { border-bottom-color: var(--ink); }
        .cf-check-row { display: flex; align-items: center; gap: 10px; margin-bottom: 32px; cursor: pointer; }
        .cf-check-box { width: 18px; height: 18px; border: 1.5px solid #d8d6d2; border-radius: 4px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; transition: background .15s, border-color .15s; }
        .cf-check-box.on { background: var(--ink); border-color: var(--ink); }
        .cf-check-label { font-family: var(--f-sans); font-size: 13px; color: #666; }
        .cf-form-foot { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
        .cf-submit { display: inline-flex; align-items: center; justify-content: center; padding: 14px 36px; border-radius: 999px; background: var(--ink); color: #fff; border: none; font-family: var(--f-sans); font-size: 15px; font-weight: 500; cursor: pointer; transition: opacity .2s; }
        .cf-submit:hover { opacity: .85; }
        .cf-book { font-family: var(--f-sans); font-size: 13px; color: #666; }
        .cf-book a { color: var(--ink); font-weight: 600; text-decoration: underline; text-underline-offset: 3px; }
        @media(max-width:900px){
          .cf-grid { grid-template-columns: 1fr; gap: 40px; }
          .cf-form-wrap { padding: 28px 20px; border-radius: 18px; }
          .cf-row { grid-template-columns: 1fr; }
          .cf-page { padding: 100px 0 60px; }
          .cf-left-title { font-size: clamp(32px, 8vw, 52px); }
          .cf-form-foot { flex-direction: column; align-items: flex-start; gap: 14px; }
        }
      `}</style>

      <div className="cf-page">
        <div className="wrap">
          <div className="cf-grid">

            {/* ── LEFT ── */}
            <div>
              <h1 className="cf-left-title">
                Have a project idea<br />
                <em>in mind?</em> Let&apos;s get<br />
                started
              </h1>
              <p className="cf-left-desc">
                We&apos;ll schedule a call to discuss your idea. After discovery sessions, we&apos;ll send a proposal, and upon approval, we&apos;ll get started.
              </p>

              <div className="cf-founder">
                <div className="cf-founder-photo">
                  <img src="https://ik.imagekit.io/2lax2ytm2/Gemini_Generated_Image_ug8ze2ug8ze2ug8z%20(1).jpeg" alt="Yousuf Faysal" />
                </div>
                <div>
                  <div className="cf-founder-name">Yousuf Faysal</div>
                  <div className="cf-founder-role">Founder &amp; CEO</div>
                </div>
              </div>

              <div className="cf-proof">
                <div className="cf-avatars">
                  {["DA","SK","IS","MV","AP"].map((i,n) => (
                    <div key={n} className="cf-avatar">{i}</div>
                  ))}
                </div>
                <div>
                  <div className="cf-stars">
                    {"★★★★★"} <span style={{ fontFamily:"var(--f-sans)", fontSize:12, color:"#888", marginLeft:4 }}>4.9</span>
                  </div>
                  <div className="cf-proof-text">105+ Brands Scaled</div>
                </div>
              </div>
            </div>

            {/* ── RIGHT — FORM ── */}
            <div className="cf-form-wrap">
              {sent ? (
                <div style={{ textAlign:"center", padding:"60px 0" }}>
                  <div style={{ fontFamily:"var(--f-display)", fontSize:40, marginBottom:16 }}>Got it ✓</div>
                  <p style={{ fontFamily:"var(--f-sans)", fontSize:16, color:"#666" }}>We&apos;ll be in touch within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>

                  {/* Name */}
                  <div className="cf-field">
                    <label className="cf-label">Your Name *</label>
                    <input ref={nameRef} className="cf-input" type="text" placeholder="John Smith" required />
                  </div>

                  {/* Email + Company */}
                  <div className="cf-row">
                    <div className="cf-field">
                      <label className="cf-label">Email *</label>
                      <input ref={emailRef} className="cf-input" type="email" placeholder="you@company.com" required />
                    </div>
                    <div className="cf-field">
                      <label className="cf-label">Company Name</label>
                      <input ref={companyRef} className="cf-input" type="text" placeholder="Your company" />
                    </div>
                  </div>

                  {/* WhatsApp + Budget */}
                  <div className="cf-row">
                    <div className="cf-field">
                      <label className="cf-label">WhatsApp Number</label>
                      <div className="cf-phone-wrap">
                        <CountrySelect value={dialCode} onChange={setDialCode} />
                        <input ref={phoneRef} className="cf-phone-input" type="tel" placeholder="(201) 555-0123" />
                      </div>
                    </div>
                    <div className="cf-field">
                      <label className="cf-label">Project Budget *</label>
                      <select className="cf-select" value={budget} onChange={e => setBudget(e.target.value)} required>
                        <option value="" disabled>Select range...</option>
                        {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Service Required */}
                  <div className="cf-field">
                    <label className="cf-label">Service Required *</label>
                    <select className="cf-select" value={service} onChange={e => setService(e.target.value)} required>
                      <option value="" disabled>Select service...</option>
                      {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  {/* Heard about us */}
                  <div className="cf-field">
                    <label className="cf-label">Heard About Us?</label>
                    <div className="cf-pills">
                      {SOURCES.map(s => (
                        <button key={s} type="button" className={`cf-pill${sources.includes(s) ? " on" : ""}`} onClick={() => toggleSource(s)}>{s}</button>
                      ))}
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="cf-field">
                    <label className="cf-label">Project Details *</label>
                    <textarea ref={detailRef} className="cf-textarea" placeholder="Tell us about your project" rows={3} required />
                  </div>

                  {/* Trial checkbox */}
                  <label className="cf-check-row" onClick={() => setTrial(p => !p)}>
                    <div className={`cf-check-box${trial ? " on" : ""}`}>
                      {trial && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L4 7L9 1" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </div>
                    <span className="cf-check-label">Happy to get once week trial (20hrs)</span>
                  </label>

                  {/* Error */}
                  {error && <p style={{ fontFamily:"var(--f-sans)", fontSize:13, color:"#e53e3e", marginBottom:16 }}>{error}</p>}

                  {/* Footer */}
                  <div className="cf-form-foot">
                    <button type="submit" className="cf-submit" disabled={loading} style={{ opacity: loading ? .6 : 1 }}>
                      {loading ? "Sending…" : "Send Inquiry"}
                    </button>
                    <span className="cf-book">
                      Prefer Email? <a href="#book-call" onClick={scrollToCalendar}>Book A Call Directly</a>
                    </span>
                  </div>

                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Inline calendar ── */}
      <section id="book-call" className="cal-section">
        <div className="wrap">
          <div className="fade in" style={{ marginBottom:10 }}>
            <span className="eyebrow">Or — book a call</span>
          </div>
          <h2 className="fade in d1" style={{ marginBottom:40 }}>
            A <span className="it">20-min</span> intro,<br />no slides.
          </h2>
          <div
            id="cal-inline-contact"
            className="fade in d2 cal-embed"
          />
        </div>
      </section>
      <style>{`
        .cal-section { padding: 80px 0 100px; }
        .cal-embed { width: 100%; height: 700px; overflow: auto; border-radius: 20px; border: 1px solid var(--line); background: var(--bone); }
        @media (max-width: 760px) {
          .cal-section { padding: 48px 0 64px; }
          .cal-embed { height: 900px; border-radius: 12px; }
          .cal-section h2 { font-size: clamp(28px, 7vw, 42px) !important; margin-bottom: 28px !important; }
        }
      `}</style>
    </>
  );
}
