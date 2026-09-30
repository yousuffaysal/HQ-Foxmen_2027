// Content for the public site, ported 1:1 from the design ("foxmen new/Foxmen Studio.dc.html").
// Server and client both import this; keep it free of secrets and server-only code.

export const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// Fills the design's [Email] and [Phone / WhatsApp] placeholders.
export const CONTACT = {
  email: "hello@foxmen.studio",
  phone: "+8801753973892",
  web: "foxmen.studio",
};

// Clutch profile for the hero "Clutch Verified" badge. Paste the profile URL here to make it a link.
export const CLUTCH_URL = "";

export type Service = {
  n: string; title: string; line: string; features: string[]; from: string;
  bdt: string; usd: string; xb?: string; xu?: string; nb: number; nu: number;
};

export const SERVICES: Service[] = [
  { n: "01", title: "Business Websites", line: "Fast, mobile-first websites built to bring in customers, not just look good.", features: ["Custom design, no templates, no WordPress", "Built on Next.js for speed and search visibility", "On-page SEO, analytics and contact/lead forms included", "Ideal for clinics, coaching centers, restaurants, hotels, offices and personal brands"], from: "Starting from", bdt: "BDT 30,000", usd: "USD 800", nb: 30000, nu: 800 },
  { n: "02", title: "E-commerce Stores", line: "Your own online shop, so you stop depending only on a Facebook page.", features: ["Product catalog, cart, checkout and order tracking", "bKash, Nagad, SSLCommerz and Cash on Delivery", "Admin panel to manage products, stock and orders", "Built to handle real traffic and real payments"], from: "Starting from", bdt: "BDT 70,000", usd: "USD 2,000", nb: 70000, nu: 2000 },
  { n: "03", title: "3D and Interactive Websites", line: "Premium, immersive websites for brands that want to stand out.", features: ["3D visuals and motion that run smoothly in the browser", "Scroll-driven storytelling and interactive product views", "Optimized for both desktop and mobile", "Ideal for fashion, real estate, hospitality and product launches"], from: "Starting from", bdt: "BDT 80,000", usd: "USD 2,500", nb: 80000, nu: 2500 },
  { n: "04", title: "AI Chatbots for Your Website", line: "An assistant that answers customers 24/7 in Bangla and English.", features: ["Answers product and service questions instantly", "Recommends products and captures leads", "Trained on your own business information", "Hands over to a human when needed"], from: "Setup from", bdt: "BDT 25,000", usd: "USD 800", xb: "Monthly plan from BDT 5,000", xu: "Monthly plan from USD 100", nb: 25000, nu: 800 },
  { n: "05", title: "Custom Web Applications", line: "Software built around how your business actually works.", features: ["Booking systems, inventory, ERP, dashboards and learning platforms", "Role-based access, secure authentication and encrypted data", "AI features where they save real time"], from: "Starting from", bdt: "BDT 1,00,000", usd: "USD 3,000", nb: 100000, nu: 3000 },
  { n: "06", title: "Monthly Care Plan", line: "We keep your product running after launch.", features: ["Hosting, backups and security updates", "Bug fixes and small content or design changes", "Chatbot monitoring and improvements", "Monthly performance check"], from: "From", bdt: "BDT 5,000 per month", usd: "USD 150 per month", nb: 5000, nu: 150 },
];

export const CARD_BG = ["#FAF7F1", "#B86CF9", "#EAE3D6", "#FAF7F1", "#B86CF9", "#EAE3D6"];
export const TINTS = ["#E4D2F7", "#EAE3D6", "#DDD6CA", "#EFE3F9", "#E6DED1", "#D9CFF0"];

export type Project = {
  name: string; type: string; url: string; latest?: boolean; tags: string[]; desc: string; features: string[];
};

// A project as stored in site_projects (admin-editable). Images are optional screenshot URLs.
export type SiteProject = Project & {
  id: number; slug: string; visible: boolean; ord: number;
  heroImage: string; imageA: string; imageB: string;
};

export const PROJECT_TAGS = ["E-commerce", "AI", "Websites", "Platforms", "3D"];

// Initial content, used to seed the site_projects table and as a fallback if the DB is down.
export const PROJECTS: Project[] = [
  { name: "Lyverne", type: "3D Website and Premium Clothing Brand Store", url: "lyverne.com", latest: true, tags: ["3D", "E-commerce"], desc: "An immersive 3D web experience for a Bangladeshi clothing label.", features: ["3D product presentation that lets visitors explore the pieces", "Editorial, premium design with a strong visual identity", "Interactive Style Studio for building outfits", "Motion lookbook, customer accounts and store admin"] },
  { name: "Redleaf", type: "AI-Powered Fashion E-Commerce", url: "redleaf-bd.com", tags: ["AI", "E-commerce"], desc: "A live fashion store for a Bangladeshi brand with its own AI shopping assistant, \"Aria\".", features: ["Custom LLM assistant that helps shoppers find products through conversation", "Full e-commerce flow with local payment support", "Running in production for a real client"] },
  { name: "Redleaf BD", type: "[Project type]", url: "redleafbd.com", tags: ["Websites"], desc: "[One-line description of this second Redleaf project]", features: ["[Key feature]", "[Key feature]"] },
  { name: "Noorvia BD", type: "Modest Fashion E-Commerce", url: "noorviabd.com", tags: ["E-commerce"], desc: "An online store for a Bangladeshi women's modest fashion brand.", features: ["Clean, elegant storefront built for a fashion audience", "Full shopping flow from product browsing to checkout", "Mobile-first, since most of its customers shop from their phones"] },
  { name: "The Lebas Buying Int", type: "Garment Production Partner Website", url: "thelebasbuyingint.com", tags: ["Websites"], desc: "A corporate website for a garment buying and production company.", features: ["Positions the company as a trusted production partner for international buyers", "Professional presentation of services and manufacturing capability", "Built to generate B2B inquiries"] },
  { name: "Celeste", type: "AI Multi-Vendor Marketplace", url: "celeste-beryl.vercel.app", tags: ["AI", "E-commerce", "Platforms"], desc: "A marketplace where multiple sellers run their own stores on one platform.", features: ["Separate dashboards for vendors, admins and customers", "AI features built into search and product discovery", "Multi-platform architecture designed to scale"] },
  { name: "SkillBridge", type: "AI-Powered Learning Platform", url: "", tags: ["AI", "Platforms"], desc: "A learning management system with an AI tutor built in.", features: ["AI assistance powered by Llama 3.3 through Groq for fast responses", "Course management, progress tracking and learner dashboards"] },
  { name: "AI ERP", type: "Business Management System", url: "ai-erp-xjjh.vercel.app", tags: ["AI", "Platforms"], desc: "An ERP system that brings business operations into one place with AI assistance.", features: ["Centralized management of core business data and workflows", "AI layer to help with everyday operational tasks"] },
  { name: "Hotel Valentino", type: "Restaurant and Motel Platform with Agentic AI", url: "valentino-a-modern-resturent-and-mo.vercel.app", tags: ["AI", "Websites"], desc: "A modern website for a hotel and restaurant in Noakhali.", features: ["Real room prices and restaurant menu integrated", "Agentic AI system to assist guests with questions and bookings"] },
  { name: "BIRST", type: "Research Platform", url: "birstbd.com", tags: ["Websites", "Platforms"], desc: "A live research platform for a Bangladeshi research organization.", features: ["Structured publishing of research content", "Clean, professional presentation for an academic audience"] },
  { name: "E-Vangariwala", type: "Scrap Collection Service", url: "evangariwala.com", tags: ["Platforms"], desc: "A bilingual platform that connects households with scrap collectors.", features: ["Fully bilingual in Bangla and English", "Simple request flow designed for everyday users"] },
  { name: "Treax", type: "Student Collaboration Platform", url: "treax-icn9.vercel.app", tags: ["Platforms"], desc: "An open-source platform for Bangladeshi university students to collaborate.", features: ["Marketplace, networking and co-founder search in one place", "Open source and open to contributors"] },
  { name: "Folang", type: "[Project type]", url: "folang-web.vercel.app", tags: ["Platforms"], desc: "[One-line description of what Folang does]", features: ["[Key feature]", "[Key feature]"] },
];

export const SEED_PROJECTS: SiteProject[] = PROJECTS.map((p, i) => ({
  ...p, latest: !!p.latest, id: -(i + 1), slug: slug(p.name), visible: true, ord: i, heroImage: "", imageA: "", imageB: "",
}));

export type ToolField = { k: string; label: string; ph: string; long?: boolean };
export type Tool = {
  id: string; name: string; cat: string; desc: string; fields?: ToolField[]; est?: boolean;
  // Product-page content. `tier`: "fast" tools run on a smaller model (cheaper), "smart" on the large one.
  slug?: string; tagline?: string; about?: string; gets?: string[]; tier?: "fast" | "smart";
};

// Prompts live server-side in lib/site/ai-tools.ts; the client only needs the labels.
export const TOOLS: Tool[] = [
  { id: "copy", name: "Website Copy Writer", slug: "website-copy-writer", tagline: "Website copy that sells, written in minutes.", about: "Describe your business and customers. You get a hero headline, subheadline, three page sections and a call to action you can paste straight onto your site.", gets: ["A hero headline and one-line subheadline", "Three short page sections with titles", "A clear call to action", "Plain, confident language your customers understand"], tier: "smart", cat: "Writing", desc: "Get a headline, intro and page sections for your website.", fields: [{ k: "biz", label: "What does your business do?", ph: "A dental clinic in Dhanmondi" }, { k: "aud", label: "Who are your customers?", ph: "Families and working adults" }] },
  { id: "seo", name: "SEO Meta Generator", slug: "seo-meta-generator", tagline: "Show up on Google with titles that get clicked.", about: "Tell us what the page is about and the words people search for. You get search-ready page titles, meta descriptions and related keywords, all within Google's length limits.", gets: ["3 page titles under 60 characters", "3 meta descriptions under 155 characters", "8 related keywords to target", "Ready to paste into any website builder"], tier: "fast", cat: "Marketing", desc: "Page titles and meta descriptions that help you show up on Google.", fields: [{ k: "page", label: "What is the page about?", ph: "Home page of an online saree shop" }, { k: "kw", label: "Main keywords", ph: "saree, online saree Bangladesh" }] },
  { id: "prod", name: "Product Description Writer", slug: "product-description-writer", tagline: "Product descriptions in English and Bangla.", about: "Give the product name and a few details. You get a short description, key selling points and the same description in natural Bangla for your local customers.", gets: ["A 60-word English description", "4 bullet-point selling points", "The full description in Bangla", "Consistent tone across your catalogue"], tier: "fast", cat: "Writing", desc: "Clear product descriptions in English and Bangla.", fields: [{ k: "p", label: "Product name", ph: "Cotton kurti, rose print" }, { k: "d", label: "Key details", ph: "Size S to XL, soft cotton, machine washable", long: true }] },
  { id: "name", name: "Business Name Ideas", slug: "business-name-ideas", tagline: "Brand names that are easy to say and remember.", about: "Describe what you sell and the feel you want. You get a shortlist of twelve names, each with the thinking behind it, so you can pick with confidence.", gets: ["12 original name ideas", "A one-line reason for each", "Names that are short and easy to say", "A starting point for your domain search"], tier: "fast", cat: "Business", desc: "Fresh, simple name ideas for a new brand or product.", fields: [{ k: "what", label: "What will you sell or do?", ph: "Organic snacks delivered in Chattogram" }, { k: "style", label: "Style you like", ph: "Short, modern, easy to say" }] },
  { id: "faq", name: "Chatbot FAQ Builder", slug: "chatbot-faq-builder", tagline: "Turn your business info into chatbot answers.", about: "Paste your prices, hours and policies. You get the ten questions customers ask most with short, friendly answers, ready to train a chatbot or publish as an FAQ page.", gets: ["10 real customer questions", "Short, friendly answers", "Ready for a chatbot or FAQ page", "Built only from the info you give"], tier: "smart", cat: "AI", desc: "Turn your business info into questions and answers for a chatbot.", fields: [{ k: "info", label: "Describe your business, prices, hours and policies", ph: "We are a restaurant open 11am to 11pm...", long: true }] },
  { id: "tr", name: "Bangla English Translator", slug: "bangla-english-translator", tagline: "Natural Bangla and English, both ways.", about: "Paste business text in either language. The tool detects it and returns a natural, business-ready translation, not a word-by-word one.", gets: ["Automatic language detection", "Natural, fluent phrasing", "Keeps your business tone", "Ideal for posts, menus and messages"], tier: "fast", cat: "Language", desc: "Translate short business text between Bangla and English.", fields: [{ k: "t", label: "Text to translate", ph: "Paste Bangla or English text", long: true }] },
  { id: "social", name: "Social Post Writer", slug: "social-post-writer", tagline: "Ready-to-post captions for your next campaign.", about: "Tell us the topic and platform. You get three short posts, each with a call to action and hashtags, ready for Facebook or Instagram.", gets: ["3 ready-to-post captions", "A call to action in each", "3 hashtags per post", "Written for your chosen platform"], tier: "fast", cat: "Marketing", desc: "Ready-to-post captions for Facebook and Instagram.", fields: [{ k: "topic", label: "What is the post about?", ph: "Eid sale, 20% off all items" }, { k: "plat", label: "Platform", ph: "Facebook" }] },
  { id: "reply", name: "Customer Reply Helper", slug: "customer-reply-helper", tagline: "Calm, professional replies to any customer.", about: "Paste a customer message and pick a tone. You get a short, helpful reply that solves the problem and keeps the customer on your side.", gets: ["A polite reply in your chosen tone", "Short and easy to read", "Focused on solving the problem", "Good for complaints and questions"], tier: "fast", cat: "Business", desc: "Polite, clear replies to customer messages and complaints.", fields: [{ k: "msg", label: "Customer message", ph: "My order is late...", long: true }, { k: "tone", label: "Tone", ph: "Friendly and apologetic" }] },
  { id: "brief", name: "Project Brief Builder", slug: "project-brief-builder", tagline: "From rough idea to a clear project brief.", about: "Describe your website or app idea in your own words. You get a structured brief with goals, users, must-have features and the questions to answer before building.", gets: ["Project goal and target users", "Must-have and nice-to-have features", "Pages or screens to plan", "Questions to settle before you start"], tier: "smart", cat: "Business", desc: "Turn a rough idea into a clear website or app brief.", fields: [{ k: "idea", label: "Describe your idea", ph: "I want an online store for my bakery with home delivery", long: true }] },
  { id: "ads", name: "Ad Headline Generator", slug: "ad-headline-generator", tagline: "Short ad headlines people actually click.", about: "Tell us what you are promoting. You get ten headlines and five descriptions sized for Facebook and Google ads, ready to test.", gets: ["10 headlines under 40 characters", "5 descriptions under 90 characters", "Variations to A/B test", "Sized for Facebook and Google"], tier: "fast", cat: "Marketing", desc: "Short, clickable headlines for Facebook and Google ads.", fields: [{ k: "offer", label: "What are you promoting?", ph: "Free first consultation at our clinic" }] },
  { id: "audit", name: "Homepage Checkup", slug: "homepage-checkup", tagline: "A clear, prioritised checkup of your homepage.", about: "Describe what is on your homepage today and what it should achieve. You get what works, what to fix first and five improvements ranked by impact.", gets: ["What already works", "What to fix first", "5 improvements ranked by impact", "Practical steps, no jargon"], tier: "smart", cat: "AI", desc: "Describe your current homepage and get clear ideas to improve it.", fields: [{ k: "home", label: "What is on your homepage today?", ph: "A big photo slider, our logo, a phone number...", long: true }, { k: "goal", label: "What should it achieve?", ph: "More WhatsApp inquiries" }] },
  { id: "est", name: "Project Cost Estimator", cat: "Business", desc: "Pick the services you need and see a starting budget.", est: true },
];
export const AI_TOOLS = TOOLS.filter(t => !t.est);
export const toolBySlug = (slug: string) => AI_TOOLS.find(t => t.slug === slug);

// Price shown on a tool's product page, set in Admin → AI tools. Null prices mean "Free".
export type ToolSettings = { id: string; enabled: boolean; priceUsd: number | null; priceBdt: number | null; priceNote: string; runs: number };
export const defaultToolSettings = (id: string): ToolSettings => ({ id, enabled: true, priceUsd: null, priceBdt: null, priceNote: "", runs: 0 });

const ICON = (s: string) => `/assets/tech/${s}.svg`;
export const TECH = [
  { name: "Next.js", use: "Websites and apps", s: "nextdotjs", g: 0 },
  { name: "React", use: "Interfaces", s: "react", g: 0 },
  { name: "TypeScript", use: "Safe, clean code", s: "typescript", g: 0 },
  { name: "Node.js", use: "Servers and APIs", s: "nodedotjs", g: 1 },
  { name: "Prisma", use: "Database access", s: "prisma", g: 1 },
  { name: "PostgreSQL", use: "Reliable data", s: "postgresql", g: 1 },
  { name: "Python", use: "AI and automation", s: "python", g: 1 },
  { name: "Django", use: "Web platforms", s: "django", g: 1 },
  { name: "Llama 3.3 via Groq", use: "Fast AI answers", s: "meta", g: 2 },
  { name: "Custom fine-tuning", use: "AI trained on your data", s: "huggingface", g: 2 },
  { name: "Cloudflare", use: "Speed and security", s: "cloudflare", g: 3 },
  { name: "Vercel", use: "Hosting", s: "vercel", g: 3 },
  { name: "GSAP", use: "Smooth animation", s: "greensock", g: 4 },
  { name: "Framer Motion", use: "Interface motion", s: "framer", g: 4 },
  { name: "3D web graphics", use: "Immersive scenes", s: "threedotjs", g: 4 },
].map(t => ({ ...t, icon: ICON(t.s) }));
export const TECH_GROUPS = ["Frontend", "Backend and data", "AI", "Cloud", "Motion and 3D"];
export const HERO_WORDS = ["websites", "online stores", "AI chatbots", "custom apps", "3D websites"];

export const PAGES = ["home", "about", "services", "work", "tools", "contact"] as const;
export const LABELS: Record<string, string> = { home: "Home", about: "About", services: "Services", work: "Work", tools: "AI Tools", contact: "Contact", admin: "Admin" };
export const pathOf = (p: string) => (p === "home" ? "/" : "/" + p);

export const PROCESS = [
  { k: 10, n: "01", t: "Talk", d: "We learn how your business works and what the product needs to do." },
  { k: 11, n: "02", t: "Design", d: "We design every page for your brand and your customers. You review before we build." },
  { k: 12, n: "03", t: "Build", d: "We write it in code, test it on real phones and connect payments or AI." },
  { k: 13, n: "04", t: "Launch and care", d: "We launch, check the results and keep everything running on the care plan." },
].map((s, i) => ({ ...s, top: `calc(110px + ${i * 18}px)`, bg: ["#FAF7F1", "#EAE3D6", "#FAF7F1", "#B86CF9"][i] }));

export const PRINCIPLES = [
  { k: 14, n: "01", t: "No templates", d: "Every site is designed and coded for your business. No WordPress." },
  { k: 15, n: "02", t: "Speed first", d: "Built on Next.js, so pages load fast and show up in search." },
  { k: 16, n: "03", t: "Bangla and English", d: "Websites and chatbots that talk to customers in their language." },
  { k: 17, n: "04", t: "We stay after launch", d: "Hosting, backups, fixes and improvements on a simple monthly plan." },
];

export const INQUIRY_STATUSES = ["New", "Contacted", "Won", "Lost"] as const;
export const CONTACT_SERVICES = ["Business website", "E-commerce store", "3D website", "AI chatbot", "Custom web app", "Care plan"];
export const BUDGETS_USD = ["Under USD 1,000", "USD 1,000 to 5,000", "USD 5,000+", "Not sure"];
export const BUDGETS_BDT = ["Under BDT 50k", "BDT 50k to 1.5L", "BDT 1.5L+", "Not sure"];

export const FAQS = [
  { q: "Do you use WordPress or templates?", a: "No. Every website is custom designed and built in code with Next.js. That makes it faster, safer and easier to grow." },
  { q: "Can my store accept bKash and Nagad?", a: "Yes. Our e-commerce stores support bKash, Nagad, SSLCommerz and Cash on Delivery." },
  { q: "Does the chatbot understand Bangla?", a: "Yes. It answers customers in Bangla and English, trained on your own business information." },
  { q: "Do you work with clients outside Bangladesh?", a: "Yes. We work with international clients on projects or hourly, at USD 25 to 40 per hour." },
  { q: "What happens after my site goes live?", a: "On the Monthly Care Plan we handle hosting, backups, security updates, bug fixes and small changes, plus a monthly performance check." },
  { q: "How do we get started?", a: "Send us a message on the contact page. We will ask a few questions and send you a clear plan and price." },
];

export const CONSULT_STATUSES = ["Requested", "Confirmed", "Done", "Cancelled"] as const;
