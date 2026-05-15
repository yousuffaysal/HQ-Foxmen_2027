export interface HeadingParts { pre: string; it: string; post?: string }
export interface TitleLine   { text: string; it?: boolean }
export interface Pillar       { ix: string; pre: string; it: string; p: string }
export interface BentoTile    { cls: string; dark?: boolean; label: string; sym: string }
export interface Stat         { k: string; v: string; it?: string; small?: string; ctx: string }
export interface TeamMember   { name: string; role: string }

export interface ProjectData {
  slug:       string;
  num:        string;        // "01"
  caseLabel:  string;        // "Case 01 / 08"
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
  {
    slug: "nestaro", num: "01", caseLabel: "Case 01 / 08",
    name: "Nestaro", industry: "Real Estate", scope: "Web · iOS · Android",
    year: "2025", client: "Nestaro", badge: "Live · nestaro.com",
    titleLines: [
      { text: "Nestaro —" },
      { text: "real-estate", it: true },
      { text: "operating system" },
    ],
    sub: "A search-first listings platform with map clustering, agent CRMs, mortgage tooling and AI-generated property summaries. We rebuilt the search index from scratch and shaved page-loads from 4.1 s to 380 ms.",
    keys: [{ k:"Client", v:"Nestaro" }, { k:"Industry", v:"Real Estate" }, { k:"Year", v:"2025" }, { k:"Scope", v:"Design · Build · AI" }],

    overview: {
      title: { pre: "The brief was simple: ", it: "make finding a home", post: " feel like Spotify." },
      sideItems: ["14-week build","Pod of 6","Postgres + Algolia","Mapbox","Swift & Kotlin"],
      lede: "Nestaro came to us with three legacy products, a brokerage CRM bolted to a consumer site, and a team that had stopped shipping. We replaced the lot with a single platform — and a single, opinionated design language.",
      body: "Across 14 weeks we shipped a new buyer site, a redesigned agent dashboard, an AI assistant trained on the listings corpus, and a mobile app sharing one design system.",
      stats: [{ k:"Project length", v:"14", it:" wks" }, { k:"Team size", v:"6", it:"" }, { k:"Surfaces shipped", v:"4", it:"" }],
    },

    challenge: {
      title: { pre: "Listings nobody could ", it: "actually search." },
      sideLabel: "The pain",
      sideItems: ["4.1s page loads","SQL LIKE queries","3 disconnected apps","Stopped shipping"],
      lede: "The legacy stack used a single SQL table and full-text LIKE queries — slow, brittle, and scary to touch.",
      body: ["Agents called every Friday to ask why their listings weren't appearing. Buyers gave up before reaching the third page of results.", "We had to make search instant, defensible at portfolio scale, and flexible enough that the product team could ship new facets without engineering involvement."],
      metric: { before:"4.1", u1:"s", after:"380", u2:"ms" },
      splitLabels: ["Before · legacy listings", "After · new search"],
    },

    approach: {
      title: { pre: "A new index, a new ", it: "grammar", post: ", a new app." },
      lede: "Four parallel work streams, four shared rituals: weekly demos, design critiques on Tuesdays, eval reviews on Fridays, and a single Linear triage at 10 AM every weekday.",
      pillars: [
        { ix:"01", pre:"Rebuild the ", it:"index.", p:"A Postgres + Algolia search layer with geospatial clustering, faceted filters, and instant typeahead." },
        { ix:"02", pre:"Design ", it:"a system.", p:"Tokens, components, motion. One library used by the buyer site, agent dashboard, and the iOS / Android apps." },
        { ix:"03", pre:"Embed ", it:"AI.", p:"An assistant trained on the listings corpus that writes property summaries, surfaces comparables, and helps agents draft buyer follow-ups." },
        { ix:"04", pre:"Ship a ", it:"brand.", p:"A new identity, photography direction, and tone of voice that read the same from billboard to push notification." },
      ],
      bento: [
        { cls:"t1", dark:true,  label:"01 — Search",    sym:"Search" },
        { cls:"t2", dark:true,  label:"02 — Listings",  sym:"N" },
        { cls:"t3",             label:"03 — Tokens",    sym:"A" },
        { cls:"t4", dark:true,  label:"04 — Agent CRM", sym:"CRM" },
        { cls:"t5", dark:true,  label:"05 — iOS app",   sym:"iOS" },
        { cls:"t6",             label:"06 — Brand",     sym:"B" },
      ],
    },

    quote: { text: "Foxmen turned a vague pitch deck into a product our investors actually used during the round.", av:"SK", who:"Sara Köhler", role:"CEO · Nestaro" },

    solution: {
      title: { pre: "One platform, ", it: "four surfaces", post: " — shipping weekly." },
      sideLabel: "Surfaces",
      sideItems: ["Buyer site","Agent dashboard","iOS app","Android app"],
      lede: "The new Nestaro stack is one design system, one search index, and one set of APIs feeding four surfaces.",
      body: "The buyer site loads in under 400 ms on cold cache. Agents work in a dashboard built around the daily flow. The mobile apps share the design tokens and 70% of the product code.",
      stack: ["Next.js","Postgres","Algolia","Mapbox","Swift","Kotlin"],
      splitLabels: ["Buyer site", "Agent dashboard"],
    },

    results: {
      h1: "05 — Results",
      h2: { pre: "Six months in.", it: "Shipping again." },
      metrics: [
        { k:"Search speed",          v:"10", it:"×",    ctx:"From 4.1s page loads to 380ms — a tenfold improvement." },
        { k:"Monthly active buyers", v:"3",  it:"×",    ctx:"Three times the user base, six months post-launch." },
        { k:"Listings viewed",       v:"+47",it:"%",    ctx:"Per-session listings viewed climbed by 47%." },
        { k:"Lighthouse",            v:"98", it:"/100", ctx:"Accessibility, performance, SEO, best practices." },
        { k:"Agent network",         v:"2",  it:"×",    ctx:"Agent network size doubled in the first quarter." },
        { k:"App Store rating",      v:"4.8",small:" ★",ctx:"In the top 3 of EU real-estate apps." },
        { k:"Time to ship",          v:"5",  it:" days",ctx:"From 6 weeks pre-rebuild to a 5-day average." },
        { k:"Eng. team retained",    v:"100",it:"%",    ctx:"Zero attrition in the 12 months following launch." },
      ],
    },

    credits: {
      title: { pre: "A small, senior pod & a ", it: "deliberate", post: " stack." },
      desc: "Six people, fourteen weeks, one shared roadmap.",
      tech: ["Next.js 15","React 19","Postgres","Algolia","Mapbox","Swift","Kotlin","OpenAI","Pinecone","Stripe","Vercel","Sentry"],
      team: [{ name:"Arif Rahman", role:"Studio Lead" },{ name:"Sara Köhler", role:"Design Director" },{ name:"Devon Arias", role:"AI Lead" },{ name:"Marta Vidal", role:"Principal Engineer" },{ name:"Yuki Ono", role:"iOS Engineer" },{ name:"Rina Mehta", role:"Project Lead" }],
    },

    next: { caseNum:"02 / 08", slug:"pulse", name:"Pulse", nameSep:" —", nameIt:"AI", nameIt2:"copilot", meta:["B2B SaaS","AI · UX · Build","2025"] },
    shareTitle: "Nestaro — real-estate OS",
  },

  // ─── PULSE ───────────────────────────────────────────────────────────────
  {
    slug: "pulse", num: "02", caseLabel: "Case 02 / 08",
    name: "Pulse", industry: "B2B SaaS", scope: "Web · AI · API",
    year: "2025", client: "Pulse AI", badge: "Live · pulse.ai",
    titleLines: [
      { text: "Pulse —" },
      { text: "AI sales", it: true },
      { text: "copilot" },
    ],
    sub: "A RAG-powered copilot that surfaces CRM context, competitor intel, and deal history the moment a rep opens a call. Custom embeddings, agent tooling, eval-driven iteration.",
    keys: [{ k:"Client", v:"Pulse AI" }, { k:"Industry", v:"B2B SaaS" }, { k:"Year", v:"2025" }, { k:"Scope", v:"AI · Design · Build" }],

    overview: {
      title: { pre: "The ask: make every rep ", it: "know everything", post: " before the first word." },
      sideItems: ["10-week build","Pod of 5","RAG + embeddings","OpenAI","Postgres + Pinecone"],
      lede: "Pulse came with a problem: their top reps out-closed the median by 4× — not because of talent, but because they researched obsessively. The goal was to give every rep that edge automatically.",
      body: "We built a retrieval layer over CRM data, call transcripts, competitor filings, and LinkedIn signals — surfaced inside a sidebar that opens the moment a rep joins a call.",
      stats: [{ k:"Project length", v:"10", it:" wks" }, { k:"Team size", v:"5", it:"" }, { k:"Integrations", v:"9", it:"" }],
    },

    challenge: {
      title: { pre: "Reps were drowning in ", it: "tabs, not insights." },
      sideLabel: "The friction",
      sideItems: ["12 open tabs per call","3 mins avg. pre-call prep","CRM data stale >48 h","No signal, only noise"],
      lede: "The average Pulse rep had twelve browser tabs open during a call — CRM, LinkedIn, news, their own notes — context spread across tools with no synthesis.",
      body: ["Deal intelligence was locked in a CRM nobody updated in real time. Competitor intel lived in a Notion wiki nobody read.", "The brief: close the gap between what top performers know intuitively and what every rep could know with the right retrieval layer."],
      metric: { before:"12", u1:" tabs", after:"1", u2:" surface" },
      splitLabels: ["Before · scattered context", "After · unified copilot"],
    },

    approach: {
      title: { pre: "One surface, ", it: "all signals." },
      lede: "Three work streams running in parallel: embedding pipeline, UX layer, and an eval harness that graded every retrieval response before shipping.",
      pillars: [
        { ix:"01", pre:"Build the ", it:"pipeline.", p:"Chunk, embed, and index CRM records, call transcripts, and competitor data. Pinecone vector store, OpenAI embeddings, hybrid search." },
        { ix:"02", pre:"Design the ", it:"surface.", p:"A sidebar that opens on call start. Scannable, not chatty. Context cards ranked by deal stage and recency." },
        { ix:"03", pre:"Wire the ", it:"agents.", p:"Tool-calling agents that pull live LinkedIn, news, and pricing data during a call — freshness within 15 minutes." },
        { ix:"04", pre:"Eval every ", it:"answer.", p:"A gold-set eval harness with 200 fixture deals. Every model change ran evals before it touched production." },
      ],
      bento: [
        { cls:"t1", dark:true,  label:"01 — RAG pipeline",  sym:"⚡" },
        { cls:"t2", dark:true,  label:"02 — Embeddings",    sym:"∿" },
        { cls:"t3",             label:"03 — UX sidebar",    sym:"UI" },
        { cls:"t4", dark:true,  label:"04 — Agent tooling", sym:"⊕" },
        { cls:"t5", dark:true,  label:"05 — Eval harness",  sym:"E" },
        { cls:"t6",             label:"06 — Integrations",  sym:"9×" },
      ],
    },

    quote: { text: "Our median rep now walks into calls better prepared than our best rep did six months ago.", av:"JT", who:"Jake Torres", role:"VP Sales · Pulse AI" },

    solution: {
      title: { pre: "One sidebar, ", it: "nine integrations", post: " — zero tab-switching." },
      sideLabel: "Surfaces",
      sideItems: ["Browser extension","Web app","API","Slack digest"],
      lede: "The Pulse copilot surfaces everything a rep needs — deal history, stakeholder map, competitor positioning — in a single scrollable sidebar.",
      body: "Nine CRM and signal integrations feed a shared embedding store. Retrieval latency averages 420 ms. The agent tool-calls run in parallel, not serially.",
      stack: ["Next.js","FastAPI","Pinecone","OpenAI","Postgres","LangChain","Stripe","Vercel","Sentry"],
      splitLabels: ["Copilot sidebar · live call", "Deal intelligence · pre-call"],
    },

    results: {
      h1: "05 — Results",
      h2: { pre: "Three months in.", it: "Quota crushed." },
      metrics: [
        { k:"Win rate uplift",      v:"+31", it:"%",    ctx:"Reps using Pulse closed 31% more deals in Q1 2025." },
        { k:"Pre-call research",    v:"−80", it:"%",    ctx:"Average prep time fell from 18 minutes to under 4." },
        { k:"Pipeline coverage",    v:"3.2", it:"×",    ctx:"Pipeline generated per rep tripled in six months." },
        { k:"Context freshness",    v:"15",  it:" min", ctx:"Signal data refreshes every 15 minutes during active deals." },
        { k:"Eval pass rate",       v:"97",  it:"%",    ctx:"97% of retrieval responses pass the gold-set eval harness." },
        { k:"Time to value",        v:"4",   it:" days",ctx:"New reps reach productivity in 4 days, down from 3 weeks." },
        { k:"CRM data quality",     v:"+55", it:"%",    ctx:"Auto-logging raised CRM hygiene scores by 55%." },
        { k:"Retention",            v:"94",  it:"%",    ctx:"94% monthly retention six months post-launch." },
      ],
    },

    credits: {
      title: { pre: "Retrieval-first, ", it: "eval-driven", post: " from day one." },
      desc: "Five engineers, ten weeks, one shared gold-set.",
      tech: ["Next.js 15","FastAPI","Pinecone","OpenAI","LangChain","Postgres","Redis","Vercel","Sentry"],
      team: [{ name:"Arif Rahman", role:"Studio Lead" },{ name:"Devon Arias", role:"AI Lead" },{ name:"Imran Sheikh", role:"ML Engineer" },{ name:"Marta Vidal", role:"Principal Engineer" },{ name:"Léa Bouchard", role:"Product Design" }],
    },

    next: { caseNum:"03 / 08", slug:"marketo", name:"Marketo", nameSep:" —", nameIt:"multi-vendor", nameIt2:"marketplace", meta:["Ecommerce","Design · Build","2024"] },
    shareTitle: "Pulse — AI sales copilot",
  },

  // ─── MARKETO ─────────────────────────────────────────────────────────────
  {
    slug: "marketo", num: "03", caseLabel: "Case 03 / 08",
    name: "Marketo", industry: "Ecommerce", scope: "Web · Commerce · API",
    year: "2024", client: "Marketo", badge: "Live · marketo.io",
    titleLines: [
      { text: "Marketo —" },
      { text: "multi-vendor", it: true },
      { text: "marketplace" },
    ],
    sub: "A full-stack marketplace with vendor portals, Stripe Connect split payouts, and a buyer-facing storefront handling 50+ vendors and 10k SKUs.",
    keys: [{ k:"Client", v:"Marketo" }, { k:"Industry", v:"Ecommerce" }, { k:"Year", v:"2024" }, { k:"Scope", v:"Design · Build · Commerce" }],

    overview: {
      title: { pre: "One checkout. ", it: "Fifty vendors.", post: " Zero payout headaches." },
      sideItems: ["12-week build","Pod of 5","Medusa + Stripe Connect","Next.js storefront","Postgres"],
      lede: "Marketo launched as a directory. Vendors listed. Buyers browsed. Revenue didn't flow. We rebuilt it as a transactional marketplace — unified checkout, automatic split payouts, vendor dashboards.",
      body: "We chose Medusa as the commerce engine for its extensibility, wired Stripe Connect for non-US vendor payouts, and built a self-serve vendor portal that lets sellers go live without engineering help.",
      stats: [{ k:"Project length", v:"12", it:" wks" }, { k:"Vendors onboarded", v:"50", it:"+" }, { k:"SKUs at launch", v:"10k", it:"" }],
    },

    challenge: {
      title: { pre: "A directory pretending ", it: "to be a marketplace." },
      sideLabel: "The problem",
      sideItems: ["Manual invoice payouts","No vendor portal","3-day onboarding","Single storefront"],
      lede: "Vendors listed on Marketo but sold off-platform. Payouts were manual CSV exports emailed to an accountant every fortnight. Buyers had no unified cart.",
      body: ["The team had tried Shopify but hit its multi-vendor ceiling. WooCommerce was considered and rejected. They needed a commerce engine they could own.", "We had 12 weeks, a team of five, and a vendor base that ranged from solo ceramicists to a 200-SKU textile mill."],
      metric: { before:"14", u1:" days", after:"1", u2:" day" },
      splitLabels: ["Before · manual payouts", "After · Stripe Connect auto-split"],
    },

    approach: {
      title: { pre: "One engine. ", it: "Every vendor", post: " on autopilot." },
      lede: "Three tracks: storefront experience, vendor portal, and the payout infrastructure. All three shipped together — no half-measures.",
      pillars: [
        { ix:"01", pre:"Commerce ", it:"engine.", p:"Medusa as the headless backbone: products, orders, fulfillments, returns — all vendor-scoped, all API-first." },
        { ix:"02", pre:"Stripe Connect ", it:"payouts.", p:"Automatic split payouts to 50+ vendor Stripe accounts. Platform fee, refund logic, and tax-line separation built in." },
        { ix:"03", pre:"Vendor ", it:"portal.", p:"Self-serve onboarding, product uploads, order tracking, and payout history. Vendors go live in under 24 hours." },
        { ix:"04", pre:"Storefront ", it:"design.", p:"A fast, filterable storefront with per-vendor shops, unified cart, and a checkout that works across mixed-vendor baskets." },
      ],
      bento: [
        { cls:"t1", dark:true,  label:"01 — Storefront",     sym:"$" },
        { cls:"t2", dark:true,  label:"02 — Vendor portal",  sym:"V" },
        { cls:"t3",             label:"03 — Payouts",        sym:"⇄" },
        { cls:"t4", dark:true,  label:"04 — Product PIM",    sym:"≡" },
        { cls:"t5", dark:true,  label:"05 — Order routing",  sym:"↗" },
        { cls:"t6",             label:"06 — Analytics",      sym:"∑" },
      ],
    },

    quote: { text: "We went from emailing CSV files to watching payouts land automatically. It felt like a decade of progress in twelve weeks.", av:"OM", who:"Olivia Marsh", role:"CEO · Marketo" },

    solution: {
      title: { pre: "Unified cart, ", it: "automatic splits", post: " — one storefront for all." },
      sideLabel: "Deliverables",
      sideItems: ["Buyer storefront","Vendor portal","Admin dashboard","Payout API"],
      lede: "A Medusa-powered marketplace where 50+ vendors sell through one checkout, receive automatic split payouts, and manage their own storefronts.",
      body: "Vendors onboard in under 24 hours. Buyers check out with a single cart across multiple vendors. Payouts settle within 2 business days via Stripe Connect.",
      stack: ["Next.js","Medusa","Stripe Connect","Postgres","Algolia","Vercel","Cloudinary","Sentry"],
      splitLabels: ["Buyer storefront", "Vendor dashboard"],
    },

    results: {
      h1: "05 — Results",
      h2: { pre: "Six months live.", it: "GMV doubled." },
      metrics: [
        { k:"GMV growth",          v:"2.1", it:"×",    ctx:"Gross merchandise value more than doubled in 6 months." },
        { k:"Vendor onboarding",   v:"−93", it:"%",    ctx:"Time to go live fell from 14 days to under 24 hours." },
        { k:"Payout latency",      v:"2",   it:" days",ctx:"Automatic Stripe Connect settlement, down from 14 days." },
        { k:"Vendors onboarded",   v:"50",  it:"+",    ctx:"50 vendors live at launch, 80+ by month three." },
        { k:"Checkout conversion", v:"+28", it:"%",    ctx:"Unified cart lifted checkout conversion by 28%." },
        { k:"SKUs indexed",        v:"10k", it:"+",    ctx:"Full-text and faceted Algolia search across 10k+ products." },
        { k:"Lighthouse",          v:"96",  it:"/100", ctx:"Mobile performance score maintained at 96/100." },
        { k:"Support tickets",     v:"−60", it:"%",    ctx:"Self-serve portal cut vendor support tickets by 60%." },
      ],
    },

    credits: {
      title: { pre: "Commerce at ", it: "scale", post: " from week one." },
      desc: "Five engineers, twelve weeks, one commerce platform.",
      tech: ["Next.js 15","Medusa 2","Stripe Connect","Postgres","Algolia","Cloudinary","Vercel","Sentry"],
      team: [{ name:"Arif Rahman", role:"Studio Lead" },{ name:"Sara Köhler", role:"Design Director" },{ name:"Daniel Tan", role:"Commerce Engineer" },{ name:"Marta Vidal", role:"Principal Engineer" },{ name:"Rina Mehta", role:"Project Lead" }],
    },

    next: { caseNum:"04 / 08", slug:"atlas", name:"Atlas", nameSep:" —", nameIt:"iOS travel", nameIt2:"planner", meta:["Mobile · iOS","AI · Design · Build","2025"] },
    shareTitle: "Marketo — multi-vendor marketplace",
  },

  // ─── ATLAS ───────────────────────────────────────────────────────────────
  {
    slug: "atlas", num: "04", caseLabel: "Case 04 / 08",
    name: "Atlas", industry: "Travel · Mobile", scope: "iOS · AI · API",
    year: "2025", client: "Atlas Travel", badge: "Live · App Store",
    titleLines: [
      { text: "Atlas —" },
      { text: "AI travel", it: true },
      { text: "planner" },
    ],
    sub: "A native iOS travel planner that generates full itineraries from a single prompt, syncs offline maps, and learns your style across trips.",
    keys: [{ k:"Client", v:"Atlas Travel" }, { k:"Industry", v:"Travel" }, { k:"Year", v:"2025" }, { k:"Scope", v:"iOS · AI · Design" }],

    overview: {
      title: { pre: "From \"I want to go to Lisbon\" to a ", it: "full itinerary", post: " in 8 seconds." },
      sideItems: ["9-week build","Pod of 4","Swift · SwiftUI","OpenAI","Offline maps"],
      lede: "Atlas wanted to replace the three-browser-tab trip-planning ritual with a single prompt. We built a native iOS app that generates, refines, and syncs itineraries — no connection required once downloaded.",
      body: "From App Store submission to top-10 travel chart in 6 days. The generative itinerary engine respects pace, budget, and traveller type — not just destination.",
      stats: [{ k:"Build time", v:"9", it:" wks" }, { k:"App Store rating", v:"4.9", it:" ★" }, { k:"Day-1 downloads", v:"8k", it:"" }],
    },

    challenge: {
      title: { pre: "Planning a trip still ", it: "requires 14 browser tabs." },
      sideLabel: "The friction",
      sideItems: ["Avg. 4 hrs to plan 5-day trip","No offline access","Generic recommendations","No trip memory"],
      lede: "Travellers spend an average of four hours planning a five-day trip across flights, hotels, activities, and transport — all in separate tabs, none of it connected.",
      body: ["Existing apps either aggregated booking links or offered static guides. None generated a coherent, time-blocked itinerary personalised to your travel style.", "The technical challenge: fast enough to feel instant, smart enough to feel personal, and fully functional without cell signal on a mountain."],
      metric: { before:"4", u1:" hrs", after:"8", u2:" sec" },
      splitLabels: ["Before · tab chaos", "After · one-prompt itinerary"],
    },

    approach: {
      title: { pre: "Native performance. ", it: "Generative", post: " intelligence." },
      lede: "Three tracks: the AI itinerary engine, the SwiftUI interface, and the offline tile caching system — all shipping to the same weekly demo cadence.",
      pillars: [
        { ix:"01", pre:"Prompt-to-", it:"itinerary.", p:"OpenAI function calling + curated POI database. One prompt generates a full time-blocked plan in under 10 seconds." },
        { ix:"02", pre:"Native ", it:"Swift.", p:"SwiftUI throughout. Smooth 120fps scroll, haptic feedback, and native map integration that feels built by Apple." },
        { ix:"03", pre:"Offline-", it:"first.", p:"MapKit + custom tile caching. Download a trip, lose the signal — everything still works, including turn-by-turn." },
        { ix:"04", pre:"Trip ", it:"memory.", p:"Core Data synced to iCloud. Atlas learns pace, budget tolerance, and category preferences across every trip." },
      ],
      bento: [
        { cls:"t1", dark:true,  label:"01 — AI planner",   sym:"✈" },
        { cls:"t2", dark:true,  label:"02 — SwiftUI",      sym:"◻" },
        { cls:"t3",             label:"03 — Offline maps", sym:"⌖" },
        { cls:"t4", dark:true,  label:"04 — Trip memory",  sym:"M" },
        { cls:"t5", dark:true,  label:"05 — POI database", sym:"P" },
        { cls:"t6",             label:"06 — iCloud sync",  sym:"☁" },
      ],
    },

    quote: { text: "I planned my entire Patagonia trip on the flight over. Then used the app with zero signal for 10 days.", av:"YO", who:"Yuki Ono", role:"Traveller & iOS Engineer · Foxmen" },

    solution: {
      title: { pre: "One prompt.", it: "A full itinerary.", post: " Zero signal needed." },
      sideLabel: "Features",
      sideItems: ["Prompt-to-itinerary","Offline maps","Multi-trip sync","Budget tracker"],
      lede: "A native iOS app that generates a full, time-blocked itinerary from a single sentence. Works completely offline once a trip is downloaded.",
      body: "The AI engine calls five tools in parallel: POI search, weather, transport routing, hotel pricing, and user preference lookup. The itinerary arrives in under 10 seconds.",
      stack: ["Swift","SwiftUI","OpenAI","MapKit","Core Data","iCloud","CloudKit","Fastlane"],
      splitLabels: ["Itinerary view", "Offline map · no signal"],
    },

    results: {
      h1: "05 — Results",
      h2: { pre: "Six weeks live.", it: "Chart topper." },
      metrics: [
        { k:"App Store rating",   v:"4.9",  small:" ★", ctx:"Highest rated travel app in the UK App Store at launch." },
        { k:"Day-1 downloads",    v:"8k",   it:"",       ctx:"8,000 downloads on launch day without paid acquisition." },
        { k:"Itinerary speed",    v:"8",    it:" sec",   ctx:"Full 5-day itinerary generated in under 8 seconds." },
        { k:"Offline usage",      v:"62",   it:"%",      ctx:"62% of active sessions run with no network connection." },
        { k:"30-day retention",   v:"68",   it:"%",      ctx:"68% of users plan a second trip within 30 days." },
        { k:"AI accuracy",        v:"91",   it:"%",      ctx:"91% of AI-generated itinerary items rated 4★ or above." },
        { k:"Chart position",     v:"Top",  it:" 3",     ctx:"Travel category, UK App Store, week 1." },
        { k:"Downloads (3 mo.)",  v:"100k", it:"+",      ctx:"100k downloads in the first 90 days, organic only." },
      ],
    },

    credits: {
      title: { pre: "Native-first, ", it: "AI-powered", post: " from first principles." },
      desc: "Four engineers, nine weeks, one App Store submission.",
      tech: ["Swift 5.9","SwiftUI","OpenAI","MapKit","Core Data","CloudKit","Fastlane","Sentry"],
      team: [{ name:"Arif Rahman", role:"Studio Lead" },{ name:"Yuki Ono", role:"iOS Lead" },{ name:"Devon Arias", role:"AI Integration" },{ name:"Léa Bouchard", role:"Product Design" }],
    },

    next: { caseNum:"05 / 08", slug:"orbit", name:"Orbit", nameSep:" —", nameIt:"neobank", nameIt2:"for families", meta:["Fintech · Mobile","Design · Build","2024"] },
    shareTitle: "Atlas — iOS travel planner",
  },

  // ─── ORBIT ───────────────────────────────────────────────────────────────
  {
    slug: "orbit", num: "05", caseLabel: "Case 05 / 08",
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
      h1: "05 — Results",
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

    next: { caseNum:"06 / 08", slug:"hearth", name:"Hearth", nameSep:" —", nameIt:"wellness", nameIt2:"platform", meta:["Health · Mobile","Design · Build · AI","2024"] },
    shareTitle: "Orbit Bank — neobank for families",
  },

  // ─── HEARTH ──────────────────────────────────────────────────────────────
  {
    slug: "hearth", num: "06", caseLabel: "Case 06 / 08",
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
      h1: "05 — Results",
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

    next: { caseNum:"07 / 08", slug:"lumen", name:"Lumen", nameSep:" —", nameIt:"AI", nameIt2:"design canvas", meta:["Design Tool · AI","Product · Build","2023"] },
    shareTitle: "Hearth — wellness platform",
  },

  // ─── LUMEN ───────────────────────────────────────────────────────────────
  {
    slug: "lumen", num: "07", caseLabel: "Case 07 / 08",
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
      h1: "05 — Results",
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

    next: { caseNum:"08 / 08", slug:"northwind", name:"Northwind", nameSep:" —", nameIt:"fleet", nameIt2:"intelligence", meta:["Logistics · SaaS","Design · Build","2023"] },
    shareTitle: "Lumen — AI design canvas",
  },

  // ─── NORTHWIND ───────────────────────────────────────────────────────────
  {
    slug: "northwind", num: "08", caseLabel: "Case 08 / 08",
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
      h1: "05 — Results",
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

    next: { caseNum:"01 / 08", slug:"nestaro", name:"Nestaro", nameSep:" —", nameIt:"real-estate", nameIt2:"OS", meta:["Real Estate","Design · Build · AI","2025"] },
    shareTitle: "Northwind — fleet intelligence",
  },
];

export const projectMap = Object.fromEntries(projects.map((p) => [p.slug, p]));
export default projects;
