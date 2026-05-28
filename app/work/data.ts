export interface HeadingParts { pre: string; it: string; post?: string }
export interface TitleLine   { text: string; it?: boolean }
export interface Pillar       { ix: string; pre: string; it: string; p: string }
export interface BentoTile    { cls: string; dark?: boolean; label: string; sym: string }
export interface Stat         { k: string; v: string; it?: string; small?: string; ctx: string }
export interface TeamMember   { name: string; role: string }

export interface ProjectData {
  slug:       string;
  num:        string;        // "01"
  caseLabel:  string;        // "Case 01 / 04"
  name:       string;
  industry:   string;
  scope:      string;
  year:       string;
  client:     string;
  badge:      string;
  titleLines: TitleLine[];
  sub:        string;
  keys:       { k: string; v: string }[];

  overview: {
    title:     HeadingParts;
    sideItems: string[];
    lede:      string;
    body:      string;
    stats:     { k: string; v: string; it: string }[];
  };

  challenge: {
    title:      HeadingParts;
    sideLabel:  string;
    sideItems:  string[];
    lede:       string;
    body:       string[];
    metric?:    { before: string; u1: string; after: string; u2: string };
    splitLabels: [string, string];
  };

  approach: {
    title:   HeadingParts;
    lede:    string;
    pillars: Pillar[];
    bento:   BentoTile[];
  };

  quote: { text: string; av: string; who: string; role: string };

  solution: {
    title:       HeadingParts;
    sideLabel:   string;
    sideItems:   string[];
    lede:        string;
    body:        string;
    stack:       string[];
    splitLabels: [string, string];
  };

  results: {
    h1: string;
    h2: HeadingParts;
    metrics: Stat[];
  };

  credits: {
    title: HeadingParts;
    desc:  string;
    tech:  string[];
    team:  TeamMember[];
  };

  next: {
    caseNum:  string;
    slug:     string;
    name:     string;
    nameSep:  string;
    nameIt:   string;
    nameIt2:  string;
    meta:     string[];
  };

  shareTitle: string;
}

const projects: ProjectData[] = [
  // ─── ORBIT ───────────────────────────────────────────────────────────────
  {
    slug: "orbit", num: "01", caseLabel: "Case 01 / 04",
    name: "Orbit Bank", industry: "Fintech", scope: "iOS · Android · API",
    year: "2024", client: "Orbit Bank", badge: "Live · App Store · Play Store",
    titleLines: [
      { text: "Orbit Bank —" },
      { text: "neobank", it: true },
      { text: "for families" },
    ],
    sub: "A mobile-first neobank with shared family wallets, AI budget intelligence, and spending nudges that feel helpful rather than nagging.",
    keys: [{ k:"Client", v:"Orbit Bank" }, { k:"Industry", v:"Fintech" }, { k:"Year", v:"2024" }, { k:"Scope", v:"Design · Mobile · AI" }],

    overview: {
      title: { pre: "The ask: make budgeting feel ", it: "effortless", post: " for whole families." },
      sideItems: ["14-week build","Pod of 7","React Native + Expo","Plaid","Postgres + TimescaleDB"],
      lede: "Orbit came to us with a banking licence, a Figma file, and a conviction that families deserved financial tooling as well-designed as their iPhones. We built the entire product from scratch.",
      body: "A shared family wallet with individual sub-accounts, AI-categorised spending, weekly budget digests, and gentle nudges — all in a single React Native app shipping to iOS and Android simultaneously.",
      stats: [{ k:"Project length", v:"14", it:" wks" }, { k:"Team size", v:"7", it:"" }, { k:"Family accounts", v:"4k", it:"+" }],
    },

    challenge: {
      title: { pre: "Traditional banking UX was ", it: "designed for accountants", post: ", not parents." },
      sideLabel: "The problem",
      sideItems: ["Avg. 22-step onboarding","No shared visibility","Manual categorisation","Alert fatigue"],
      lede: "The average banking app has 22 steps to onboard, no shared view between family members, and sends 11 push notifications a week that users ignore.",
      body: ["Families were using spreadsheets alongside their bank apps. Children had no visibility into shared budgets. Parents had no gentle way to nudge without nagging.", "We had to make budgeting feel like a feature of life, not a chore — without compromising on the regulatory and security requirements of a licensed bank."],
      metric: { before:"22", u1:" steps", after:"4", u2:" steps" },
      splitLabels: ["Before · legacy banking UX", "After · Orbit onboarding"],
    },

    approach: {
      title: { pre: "One wallet. ", it: "Every family member.", post: " Zero friction." },
      lede: "Four product streams: onboarding, shared wallet, AI intelligence, and the notification engine — all governed by a single design system.",
      pillars: [
        { ix:"01", pre:"Family ", it:"wallet.", p:"Shared pot with per-member sub-accounts and spending limits. Parents set guardrails; kids see their own view." },
        { ix:"02", pre:"AI budget ", it:"intelligence.", p:"Plaid transaction data categorised by a fine-tuned classifier. Weekly digest written in plain language, not finance jargon." },
        { ix:"03", pre:"Gentle ", it:"nudges.", p:"Smart notification timing based on spending velocity. Sent when useful, silent when not. Opt-out always one tap." },
        { ix:"04", pre:"Design ", it:"system.", p:"One token library, one component set — iOS and Android feel native, not like a cross-platform compromise." },
      ],
      bento: [
        { cls:"t1", dark:true,  label:"01 — Family wallet",  sym:"⌂" },
        { cls:"t2", dark:true,  label:"02 — AI budget",      sym:"∑" },
        { cls:"t3",             label:"03 — Notifications",  sym:"↑" },
        { cls:"t4", dark:true,  label:"04 — Design system",  sym:"D" },
        { cls:"t5", dark:true,  label:"05 — Plaid sync",     sym:"P" },
        { cls:"t6",             label:"06 — iOS + Android",  sym:"▢" },
      ],
    },

    quote: { text: "Our kids actually ask to check their budget now. That has never happened in the history of money.", av:"AH", who:"Aiden & Helena Park", role:"Orbit Beta users" },

    solution: {
      title: { pre: "Shared wallets, ", it: "AI budgets", post: " — one app, two stores." },
      sideLabel: "Surfaces",
      sideItems: ["iOS app","Android app","Parent dashboard","Kids view"],
      lede: "One React Native codebase shipping to iOS and Android simultaneously. A shared family wallet with per-member sub-accounts, AI categorisation, and a weekly digest that actually gets read.",
      body: "Onboarding takes 4 steps and 3 minutes. Plaid sync is automatic. The AI digest arrives every Sunday morning, written in plain English, and summarises the week in three sentences.",
      stack: ["React Native","Expo","Plaid","Postgres","TimescaleDB","OpenAI","Firebase","Vercel"],
      splitLabels: ["Family dashboard", "Kids spending view"],
    },

    results: {
      h1: "01 — Results",
      h2: { pre: "Quarter one.", it: "250k families." },
      metrics: [
        { k:"Users (3 months)",   v:"250k", it:"+",    ctx:"250,000 family accounts activated in the first quarter." },
        { k:"NPS",                v:"72",   it:"",      ctx:"Net Promoter Score of 72, above all tracked neobank peers." },
        { k:"Onboarding",         v:"−82",  it:"%",     ctx:"Steps to first transaction fell from 22 to 4." },
        { k:"Weekly digest open", v:"71",   it:"%",     ctx:"71% open rate on the Sunday AI budget digest." },
        { k:"Notification opt-out",v:"8",   it:"%",     ctx:"Only 8% of users mute notifications — industry avg. is 34%." },
        { k:"App Store rating",   v:"4.8",  small:" ★", ctx:"Rated 4.8 on iOS, 4.7 on Android at 10k+ reviews." },
        { k:"Family retention",   v:"89",   it:"%",     ctx:"89% of families still active at 90 days." },
        { k:"Budget hit rate",    v:"+44",  it:"%",     ctx:"Families using AI budgets hit their savings goals 44% more." },
      ],
    },

    credits: {
      title: { pre: "Mobile-first, ", it: "family-centred", post: " from day one." },
      desc: "Seven engineers, fourteen weeks, two app stores.",
      tech: ["React Native","Expo","Plaid","OpenAI","Postgres","TimescaleDB","Firebase","Stripe","Sentry"],
      team: [{ name:"Arif Rahman", role:"Studio Lead" },{ name:"Aiden Park", role:"Design Lead" },{ name:"Marta Vidal", role:"Principal Engineer" },{ name:"Yuki Ono", role:"Mobile Engineer" },{ name:"Imran Sheikh", role:"AI Engineer" },{ name:"Rina Mehta", role:"Project Lead" },{ name:"Daniel Tan", role:"Backend Engineer" }],
    },

    next: { caseNum:"02 / 04", slug:"hearth", name:"Hearth", nameSep:" —", nameIt:"wellness", nameIt2:"platform", meta:["Health · Mobile","Design · Build · AI","2024"] },
    shareTitle: "Orbit Bank — neobank for families",
  },

  // ─── HEARTH ──────────────────────────────────────────────────────────────
  {
    slug: "hearth", num: "02", caseLabel: "Case 02 / 04",
    name: "Hearth", industry: "Health & Wellness", scope: "iOS · Android · Web",
    year: "2024", client: "Hearth Health", badge: "Live · hearth.health",
    titleLines: [
      { text: "Hearth —" },
      { text: "wellness", it: true },
      { text: "platform" },
    ],
    sub: "A therapist-matching platform with AI-assisted journaling, mood tracking, and session summaries — making consistent mental health care feel accessible.",
    keys: [{ k:"Client", v:"Hearth Health" }, { k:"Industry", v:"Health & Wellness" }, { k:"Year", v:"2024" }, { k:"Scope", v:"Design · Build · AI" }],

    overview: {
      title: { pre: "Therapy, ", it: "between sessions", post: " — not just during them." },
      sideItems: ["12-week build","Pod of 6","HIPAA-compliant","React Native","OpenAI (GPT-4)"],
      lede: "Hearth's insight: the 167 hours between weekly therapy sessions are just as important as the one hour in them. We built a platform where journaling, mood tracking, and an AI companion fill that gap — safely.",
      body: "Therapists onboard and manage clients through a web dashboard. Clients use the mobile app for daily check-ins, AI-guided journaling, and session prep. Everything stays HIPAA-compliant end-to-end.",
      stats: [{ k:"Project length", v:"12", it:" wks" }, { k:"Therapists", v:"500", it:"+" }, { k:"HIPAA", v:"100", it:"%" }],
    },

    challenge: {
      title: { pre: "Therapy is expensive and ", it: "once a week", post: " isn't enough." },
      sideLabel: "The pain",
      sideItems: ["Avg. wait: 23 days","$180/session out-of-pocket","No support between sessions","Manual session notes"],
      lede: "The average wait for a first therapy appointment in the US is 23 days. Sessions cost $180 out-of-pocket. Between appointments, patients had nothing.",
      body: ["Therapists were spending 40 minutes per session writing notes that were only ever read by themselves. Client insight between sessions was zero.", "The regulatory constraint: every AI interaction had to be designed as a complement to therapy, not a replacement — and every data store had to be HIPAA-compliant."],
      metric: { before:"23", u1:" day wait", after:"24", u2:" hr match" },
      splitLabels: ["Before · 23-day wait", "After · 24-hour match"],
    },

    approach: {
      title: { pre: "AI as a ", it: "companion", post: ", never a replacement." },
      lede: "Three streams: the matching engine, the journaling AI, and the therapist dashboard — all built with HIPAA guardrails from the ground up.",
      pillars: [
        { ix:"01", pre:"Therapist ", it:"matching.", p:"A preference-and-availability matching engine. Clients matched in under 24 hours. Therapists control capacity." },
        { ix:"02", pre:"AI-guided ", it:"journaling.", p:"GPT-4 prompts that adapt to mood and recent session themes. Designed with licensed therapists to stay within scope." },
        { ix:"03", pre:"Session ", it:"summaries.", p:"Automatic session note drafts for therapists. Therapist reviews and approves — never raw AI output to the client record." },
        { ix:"04", pre:"HIPAA-", it:"compliant.", p:"End-to-end encryption, zero-log AI inference, BAA with every sub-processor. Audited before launch." },
      ],
      bento: [
        { cls:"t1", dark:true,  label:"01 — Matching engine", sym:"♡" },
        { cls:"t2", dark:true,  label:"02 — AI journaling",   sym:"J" },
        { cls:"t3",             label:"03 — Therapist dash",  sym:"T" },
        { cls:"t4", dark:true,  label:"04 — Session notes",   sym:"N" },
        { cls:"t5", dark:true,  label:"05 — Mood tracking",   sym:"~" },
        { cls:"t6",             label:"06 — HIPAA",           sym:"✓" },
      ],
    },

    quote: { text: "For the first time, my clients arrive at sessions having already done the work. The app holds the space I can't hold 24/7.", av:"RM", who:"Dr. Rina Mehta", role:"Therapist · Hearth Beta" },

    solution: {
      title: { pre: "One platform, ", it: "therapist and client", post: " — always in sync." },
      sideLabel: "Surfaces",
      sideItems: ["Client mobile app","Therapist web dashboard","Matching portal","Session notes"],
      lede: "A HIPAA-compliant platform where clients journal daily, therapists review AI-drafted session notes, and matching happens in under 24 hours.",
      body: "Mood data and journal themes surface as a weekly digest for therapists before each session. AI never surfaces raw data to clients — therapists hold the context.",
      stack: ["React Native","Next.js","OpenAI","Postgres","AWS (HIPAA)","Stripe","Twilio","Sentry"],
      splitLabels: ["Client journaling app", "Therapist dashboard"],
    },

    results: {
      h1: "02 — Results",
      h2: { pre: "Nine months in.", it: "15k clients." },
      metrics: [
        { k:"Clients matched",    v:"15k",  it:"+",    ctx:"15,000+ client-therapist matches in the first 9 months." },
        { k:"Match time",         v:"−95",  it:"%",    ctx:"Match time fell from 23 days to under 24 hours." },
        { k:"Journal completion", v:"72",   it:"%",    ctx:"72% of clients complete at least 4 check-ins per week." },
        { k:"Therapist NPS",      v:"81",   it:"",      ctx:"Therapist NPS of 81 — among the highest in the survey set." },
        { k:"Session retention",  v:"92",   it:"%",    ctx:"92% of clients attended their next session after journaling." },
        { k:"Note time saved",    v:"−68",  it:"%",    ctx:"AI drafts cut therapist note time from 40 min to 13 min." },
        { k:"App rating",         v:"4.9",  small:" ★",ctx:"Rated 4.9 in the Health & Fitness category." },
        { k:"HIPAA audits",       v:"2",    it:" passed",ctx:"Two independent HIPAA compliance audits passed before launch." },
      ],
    },

    credits: {
      title: { pre: "Care-first, ", it: "compliance-built", post: " from the first sprint." },
      desc: "Six engineers, twelve weeks, two HIPAA audits.",
      tech: ["React Native","Next.js","OpenAI","Postgres","AWS HIPAA","Stripe","Twilio","Sentry"],
      team: [{ name:"Arif Rahman", role:"Studio Lead" },{ name:"Léa Bouchard", role:"Design Director" },{ name:"Imran Sheikh", role:"AI Engineer" },{ name:"Marta Vidal", role:"Principal Engineer" },{ name:"Daniel Tan", role:"Backend Engineer" },{ name:"Rina Mehta", role:"Project Lead" }],
    },

    next: { caseNum:"03 / 04", slug:"lumen", name:"Lumen", nameSep:" —", nameIt:"AI", nameIt2:"design canvas", meta:["Design Tool · AI","Product · Build","2023"] },
    shareTitle: "Hearth — wellness platform",
  },

  // ─── LUMEN ───────────────────────────────────────────────────────────────
  {
    slug: "lumen", num: "03", caseLabel: "Case 03 / 04",
    name: "Lumen", industry: "Design Tools", scope: "Web · AI · Canvas",
    year: "2023", client: "Lumen Studio", badge: "Live · lumen.studio",
    titleLines: [
      { text: "Lumen —" },
      { text: "generative", it: true },
      { text: "design canvas" },
    ],
    sub: "A generative design canvas for production marketing teams — brand-safe AI generation, component libraries, and direct-to-CMS export in a single tool.",
    keys: [{ k:"Client", v:"Lumen Studio" }, { k:"Industry", v:"Design Tools" }, { k:"Year", v:"2023" }, { k:"Scope", v:"Product · AI · Build" }],

    overview: {
      title: { pre: "AI generation that ", it: "stays on-brand", post: " — by construction." },
      sideItems: ["16-week build","Pod of 6","Canvas rendering","OpenAI + Stability AI","Figma plugin"],
      lede: "Marketing teams were using Midjourney and getting outputs their legal team rejected. Lumen wanted a generative canvas where the brand guardrails were built into the generation itself.",
      body: "We built a web-based canvas where every AI generation runs through a brand filter trained on the client's own asset library — colours, typography, composition rules — before it renders.",
      stats: [{ k:"Project length", v:"16", it:" wks" }, { k:"Enterprise clients", v:"30", it:"+" }, { k:"Avg. output speed", v:"10", it:"×" }],
    },

    challenge: {
      title: { pre: "Generative AI was producing output ", it: "legal kept rejecting." },
      sideLabel: "The pain",
      sideItems: ["Off-brand generations","Manual legal review","3-day approval cycle","No CMS export"],
      lede: "Marketing teams had the creativity. Generative AI had the speed. Brand and legal had the veto — and they exercised it on roughly 70% of AI outputs.",
      body: ["The fundamental problem: existing AI tools had no concept of brand. Every generation started from scratch with no memory of what was allowed.", "We needed a system that constrained generation not after the fact (review), but during it — trained on the brand's own visual DNA."],
      metric: { before:"70", u1:"% rejected", after:"4", u2:"% rejected" },
      splitLabels: ["Before · generic AI output", "After · brand-safe generation"],
    },

    approach: {
      title: { pre: "Brand DNA baked ", it: "into the model", post: ", not bolted on." },
      lede: "Three parallel streams: the brand fine-tuning pipeline, the canvas rendering engine, and the CMS export connectors — all converging in a single browser-based tool.",
      pillars: [
        { ix:"01", pre:"Brand ", it:"fine-tuning.", p:"LoRA fine-tunes on the client's own asset library. Colour palettes, composition rules, and typography encoded as model constraints." },
        { ix:"02", pre:"Canvas ", it:"engine.", p:"A fabric.js-based canvas with layer management, snap-to-grid, and component slots. Feels like Figma, generates like Midjourney." },
        { ix:"03", pre:"CMS ", it:"export.", p:"Direct export to Contentful, Sanity, and WordPress with auto-populated metadata. No download-reupload cycle." },
        { ix:"04", pre:"Figma ", it:"plugin.", p:"Import existing Figma components as canvas templates. Designers set the frame; AI fills the content." },
      ],
      bento: [
        { cls:"t1", dark:true,  label:"01 — Brand fine-tune", sym:"AI" },
        { cls:"t2", dark:true,  label:"02 — Canvas engine",   sym:"▣" },
        { cls:"t3",             label:"03 — CMS export",      sym:"↑" },
        { cls:"t4", dark:true,  label:"04 — Figma plugin",    sym:"F" },
        { cls:"t5", dark:true,  label:"05 — Asset library",   sym:"L" },
        { cls:"t6",             label:"06 — Legal review",    sym:"✓" },
      ],
    },

    quote: { text: "We went from a 3-day content approval cycle to shipping 10× more assets with a 4% rejection rate. Lumen paid for itself in two weeks.", av:"LB", who:"Léa Bouchard", role:"Creative Director · early adopter" },

    solution: {
      title: { pre: "Brand-safe generation, ", it: "direct to CMS", post: " — no approval limbo." },
      sideLabel: "Features",
      sideItems: ["AI canvas","Brand fine-tuning","CMS export","Figma plugin"],
      lede: "A web-based generative canvas where AI outputs comply with brand guidelines by construction — not by post-generation review.",
      body: "Marketing teams generate, iterate, and export to CMS in a single session. Legal review time fell from 3 days to under 2 hours for 96% of outputs.",
      stack: ["Next.js","Fabric.js","Stability AI","OpenAI","Postgres","AWS S3","Contentful API","Vercel"],
      splitLabels: ["Brand-safe AI generation", "CMS export · one click"],
    },

    results: {
      h1: "03 — Results",
      h2: { pre: "Year one.", it: "30 enterprise clients." },
      metrics: [
        { k:"Enterprise clients",  v:"30",   it:"+",    ctx:"30+ enterprise clients in the first 12 months." },
        { k:"Rejection rate",      v:"−94",  it:"%",    ctx:"Legal rejection rate fell from 70% to 4% of outputs." },
        { k:"Output volume",       v:"10",   it:"×",    ctx:"Teams produce 10× more on-brand assets per week." },
        { k:"Approval cycle",      v:"−92",  it:"%",    ctx:"Content approval cycle fell from 3 days to under 4 hours." },
        { k:"Figma imports",       v:"85",   it:"%",    ctx:"85% of canvases start from an imported Figma template." },
        { k:"CMS export",          v:"1",    it:" click",ctx:"Direct Contentful/Sanity publish from the canvas." },
        { k:"MRR (12 months)",     v:"4.2",  it:"×",    ctx:"Monthly recurring revenue grew 4.2× in the first year." },
        { k:"NPS",                 v:"78",   it:"",      ctx:"NPS of 78 across enterprise accounts at 12-month mark." },
      ],
    },

    credits: {
      title: { pre: "Generative AI that ", it: "respects the brand", post: "." },
      desc: "Six engineers, sixteen weeks, one brand-safe canvas.",
      tech: ["Next.js","Fabric.js","Stability AI","OpenAI","Postgres","AWS S3","Contentful","Vercel"],
      team: [{ name:"Arif Rahman", role:"Studio Lead" },{ name:"Sara Köhler", role:"Design Director" },{ name:"Devon Arias", role:"AI Lead" },{ name:"Marta Vidal", role:"Principal Engineer" },{ name:"Aiden Park", role:"Canvas Engineer" },{ name:"Rina Mehta", role:"Project Lead" }],
    },

    next: { caseNum:"04 / 04", slug:"northwind", name:"Northwind", nameSep:" —", nameIt:"fleet", nameIt2:"intelligence", meta:["Logistics · SaaS","Design · Build","2023"] },
    shareTitle: "Lumen — AI design canvas",
  },

  // ─── NORTHWIND ───────────────────────────────────────────────────────────
  {
    slug: "northwind", num: "04", caseLabel: "Case 04 / 04",
    name: "Northwind", industry: "Logistics", scope: "Web · Real-time · API",
    year: "2023", client: "Northwind Logistics", badge: "Live · northwind.io",
    titleLines: [
      { text: "Northwind —" },
      { text: "fleet", it: true },
      { text: "intelligence" },
    ],
    sub: "A real-time fleet dashboard with predictive routing, SLA telemetry, and anomaly detection across 2,000+ vehicles — from a spreadsheet to a control room.",
    keys: [{ k:"Client", v:"Northwind Logistics" }, { k:"Industry", v:"Logistics" }, { k:"Year", v:"2023" }, { k:"Scope", v:"Design · Build · Real-time" }],

    overview: {
      title: { pre: "From spreadsheet to ", it: "real-time control room", post: " in 10 weeks." },
      sideItems: ["10-week build","Pod of 5","WebSockets","TimescaleDB","Mapbox + OSRM"],
      lede: "Northwind was running a 2,000-vehicle fleet from a combination of Google Sheets, a legacy TMS, and a dedicated WhatsApp group. SLA breaches were discovered after the fact. We changed that.",
      body: "A real-time operations dashboard that aggregates telematics data across 2,000+ vehicles, flags SLA risk 45 minutes before breach, and surfaces predictive routing alternatives automatically.",
      stats: [{ k:"Project length", v:"10", it:" wks" }, { k:"Vehicles tracked", v:"2k", it:"+" }, { k:"SLA improvement", v:"18", it:"%" }],
    },

    challenge: {
      title: { pre: "SLA breaches discovered ", it: "after the customer called." },
      sideLabel: "The problem",
      sideItems: ["Spreadsheet operations","Reactive SLA management","No live vehicle data","Manual route changes"],
      lede: "Northwind's operations team had no live visibility into their fleet. SLA breaches were discovered when customers called to complain — not before.",
      body: ["The telematics data existed — three different GPS vendors, two legacy APIs, one CSV export — but nothing aggregated it in real time.", "We had 10 weeks to build a system that ingested telemetry from 2,000+ vehicles, detected SLA risk, and surfaced re-routing options before a breach occurred."],
      metric: { before:"0", u1:" live view", after:"2k", u2:" vehicles live" },
      splitLabels: ["Before · spreadsheet ops", "After · real-time dashboard"],
    },

    approach: {
      title: { pre: "Predictive, ", it: "not reactive", post: " — 45 minutes of warning." },
      lede: "Three streams: the real-time ingestion layer, the predictive SLA engine, and the operations dashboard — all built to survive a 2,000-vehicle load spike.",
      pillars: [
        { ix:"01", pre:"Real-time ", it:"ingestion.", p:"WebSocket pipeline aggregating telemetry from 3 GPS vendors into a single normalised stream. TimescaleDB for time-series storage." },
        { ix:"02", pre:"SLA ", it:"prediction.", p:"A gradient-boost model trained on 18 months of historical breach data. Flags SLA risk with 45-minute lead time, 89% accuracy." },
        { ix:"03", pre:"Predictive ", it:"routing.", p:"OSRM integration with live traffic. Alternative routes surface automatically when the model detects risk — dispatchers confirm in one click." },
        { ix:"04", pre:"Operations ", it:"dashboard.", p:"A real-time map with vehicle clustering, SLA heat-map, anomaly alerts, and a shift-level performance view for ops managers." },
      ],
      bento: [
        { cls:"t1", dark:true,  label:"01 — Live telemetry", sym:"⌖" },
        { cls:"t2", dark:true,  label:"02 — SLA prediction", sym:"↗" },
        { cls:"t3",             label:"03 — Routing",        sym:"~" },
        { cls:"t4", dark:true,  label:"04 — Fleet map",      sym:"M" },
        { cls:"t5", dark:true,  label:"05 — Anomaly alerts", sym:"!" },
        { cls:"t6",             label:"06 — Shift reports",  sym:"≡" },
      ],
    },

    quote: { text: "We used to find out about SLA breaches when the customer called. Now we know 45 minutes before they even happen.", av:"DP", who:"David Park", role:"COO · Northwind Logistics" },

    solution: {
      title: { pre: "2,000 vehicles,", it: "one control room", post: " — 45 min early warning." },
      sideLabel: "Deliverables",
      sideItems: ["Operations dashboard","SLA predictor","Routing engine","Shift reporting"],
      lede: "A real-time operations platform that turns three GPS vendor feeds into a single live dashboard — with predictive SLA alerts and one-click re-routing.",
      body: "The ingestion layer handles 2,000+ concurrent WebSocket streams. The SLA model updates every 5 minutes. Re-routing alternatives calculate in under 3 seconds.",
      stack: ["Next.js","Node.js","WebSockets","TimescaleDB","Postgres","Mapbox","OSRM","Python (ML)","Vercel"],
      splitLabels: ["Fleet map · real-time", "SLA prediction · 45 min lead"],
    },

    results: {
      h1: "04 — Results",
      h2: { pre: "First full quarter.", it: "Zero missed SLAs." },
      metrics: [
        { k:"SLA breach rate",    v:"−100", it:"%",    ctx:"Zero SLA breaches in the first full quarter post-launch." },
        { k:"SLA lead time",      v:"45",   it:" min", ctx:"Risk flagged 45 minutes before predicted breach on average." },
        { k:"Fuel savings",       v:"18",   it:"%",    ctx:"Predictive routing reduced fleet fuel spend by 18%." },
        { k:"Ops team size",      v:"−40",  it:"%",    ctx:"Same throughput with 40% fewer operations coordinators." },
        { k:"Vehicles tracked",   v:"2k",   it:"+",    ctx:"2,000+ vehicles streaming live telemetry at launch." },
        { k:"Alert accuracy",     v:"89",   it:"%",    ctx:"SLA prediction model accuracy at 45-minute horizon." },
        { k:"Re-route accept",    v:"94",   it:"%",    ctx:"94% of suggested re-routes accepted by dispatchers." },
        { k:"Dashboard uptime",   v:"99.9", it:"%",    ctx:"99.9% uptime in the first 6 months of live operation." },
      ],
    },

    credits: {
      title: { pre: "Real-time by design, ", it: "predictive by default", post: "." },
      desc: "Five engineers, ten weeks, one control room.",
      tech: ["Next.js","Node.js","WebSockets","TimescaleDB","Postgres","Mapbox","OSRM","Python","Scikit-learn","Vercel"],
      team: [{ name:"Arif Rahman", role:"Studio Lead" },{ name:"Marta Vidal", role:"Principal Engineer" },{ name:"Imran Sheikh", role:"ML Engineer" },{ name:"Daniel Tan", role:"Backend Engineer" },{ name:"Aiden Park", role:"Dashboard Design" }],
    },

    next: { caseNum:"01 / 04", slug:"orbit", name:"Orbit Bank", nameSep:" —", nameIt:"neobank", nameIt2:"for families", meta:["Fintech · Mobile","Design · Build · AI","2024"] },
    shareTitle: "Northwind — fleet intelligence",
  },
];

export const projectMap = Object.fromEntries(projects.map((p) => [p.slug, p]));
export default projects;
