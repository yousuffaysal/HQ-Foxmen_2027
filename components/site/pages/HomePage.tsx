"use client";
import { useEffect, useRef, useState } from "react";
import HomeView from "../views/HomeView";
import { useSite } from "../SiteChrome";
import { currencyVals, projectVals, serviceVals, PRINCIPLES, PROCESS } from "../values";
import { FAQS, HERO_WORDS, TECH, TECH_GROUPS, TOOLS } from "@/lib/site/data";

const CHAT = [
  { u: 1, t: "Hi, do you have the rose print kurti in size M?" },
  { u: 0, t: "Yes! The Rose Kurti is in stock in size M. Want me to add it to your cart?" },
  { u: 1, t: "ডেলিভারি চার্জ কত?" },
  { u: 0, t: "ঢাকার ভিতরে ডেলিভারি চার্জ ৮০ টাকা। আপনি কি bKash বা ক্যাশ অন ডেলিভারিতে পেমেন্ট করবেন?" },
  { u: 1, t: "Can I talk to a person?" },
  { u: 0, t: "Of course. I am connecting you with our team now." },
];


const AGENTS = [
  { k: 0, n: "01", t: "Built by our team", d: "We set up and train every agent for your business." },
  { k: 1, n: "02", t: "Web agent", d: "Keeps your website and store updated, day and night." },
  { k: 2, n: "03", t: "Marketing agent", d: "Sends posts and campaigns at the best time." },
  { k: 3, n: "04", t: "Sales agent", d: "Follows up every new lead in minutes." },
  { k: 4, n: "05", t: "Automation agent", d: "Moves orders and data between your shop and CRM." },
  { k: 5, n: "06", t: "Support agent", d: "Answers customers in Bangla and English, 24/7." },
  { k: 6, n: "07", t: "Analytics agent", d: "Sends you a clear report every morning." },
];

export default function HomePage() {
  const { go, openProject, openTool, cur, setCur, mobile, projects } = useSite();
  const usd = cur === "usd";
  const [heroI, setHeroI] = useState(0);
  const [chat, setChat] = useState(0);
  const [faq, setFaq] = useState(0);
  const chatTimer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    const t = setInterval(() => setHeroI(i => i + 1), 2400);
    return () => clearInterval(t);
  }, []);

  // The demo chat only plays while it's on screen, like the design.
  useEffect(() => {
    const el = document.querySelector("[data-chat]");
    if (!el) return;
    const io = new IntersectionObserver(es => {
      clearInterval(chatTimer.current);
      if (es[0].isIntersecting) chatTimer.current = setInterval(() => setChat(c => (c >= 9 ? 0 : c + 1)), 1300);
    }, { threshold: 0.3 });
    io.observe(el);
    return () => { io.disconnect(); clearInterval(chatTimer.current); };
  }, []);

  const proj = projectVals(projects);
  const featured = proj.slice(0, 6);
  const shown = Math.min(chat, CHAT.length);
  const v = {
    go,
    heroWords: HERO_WORDS.map((w, i) => { const k = heroI % HERO_WORDS.length, prev = (k + HERO_WORDS.length - 1) % HERO_WORDS.length; return { word: w, t: i === k ? "none" : i === prev ? "translateY(-105%)" : "translateY(105%)" }; }),
    marquee: [...Array(2)].flatMap(() => ["Websites", "E-commerce", "3D Web", "AI Chatbots", "Custom Apps", "Care Plans"]),
    words: "We build fast websites, online stores, AI assistants and custom software for growing businesses. Everything is written in code, made to bring in customers and built to last.".split(" "),
    services: serviceVals(usd, mobile),
    featured: featured.map(p => ({ ...p, tags: p.tags.slice(0, 2), tagLine: p.tags.slice(0, 2).join(" · "), urlShow: p.url || "private project", open: openProject(p), shotText: p.heroImage ? "" : "screenshot" })),
    projCount: proj.length, featCount: String(featured.length).padStart(2, "0"),
    deckH: "520vh", deckCols: mobile ? "minmax(0,1fr)" : "minmax(0,5fr) minmax(0,7fr)", deckSide: mobile ? "none" : "flex",
    industries: ["Clinics", "Coaching centers", "Restaurants", "Hotels", "Offices", "Personal brands", "Fashion", "Real estate", "Hospitality", "Product launches"].map((n, i) => ({ name: n, n: String(i + 1).padStart(2, "0") })),
    agents: AGENTS,
    wfCardsW: mobile ? "auto" : "min(360px,34vw)", wfCardsLeft: mobile ? "clamp(12px,3vw,40px)" : "auto", wfBarDisplay: mobile ? "none" : "flex",
    botPrice: usd ? "USD 800" : "BDT 25,000",
    chatShown: CHAT.slice(0, shown).map(m => ({ t: m.t, align: m.u ? "flex-end" : "flex-start", bg: m.u ? "#1F1712" : "#EAE3D6", fg: m.u ? "#F3EEE4" : "#1F1712" })),
    chatTyping: shown < CHAT.length && shown > 0 && CHAT[shown].u === 0,
    process: PROCESS,
    techRowA: [...TECH.slice(0, 8), ...TECH.slice(0, 8)],
    techRowB: [...TECH.slice(8), ...TECH.slice(0, 1), ...TECH.slice(8), ...TECH.slice(0, 1)],
    techGroups: TECH_GROUPS.map((t, i) => { const items = TECH.filter(x => x.g === i); return { t, n: String(i + 1).padStart(2, "0"), items: items.slice(0, 3), list: items.map(x => x.name).join(", ") }; }),
    techCols: mobile ? "repeat(auto-fit,minmax(min(100%,220px),1fr))" : "repeat(5,minmax(0,1fr))",
    principles: PRINCIPLES,
    ...currencyVals(usd, setCur),
    toolTeaser: TOOLS.slice(0, 6).map(t => ({ name: t.name, cat: t.cat, open: openTool(t.id) })),
    faqs: FAQS.map((f, i) => ({ ...f, rows: faq === i ? "1fr" : "0fr", iconT: faq === i ? "rotate(45deg)" : "none", iconBg: faq === i ? "#B86CF9" : "#EAE3D6", toggle: () => setFaq(faq === i ? -1 : i) })),
  };
  return <HomeView v={v} />;
}
