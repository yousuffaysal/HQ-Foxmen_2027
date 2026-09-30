"use client";
import { useRef, useState } from "react";
import AboutView from "../views/AboutView";
import { useSite } from "../SiteChrome";
import { projectVals, PRINCIPLES, PROCESS } from "../values";

const PILLARS = [
  { w: "Web", n: "01", k: 12, t: "Websites and software", d: "Fast websites, online stores, 3D experiences and custom web apps, written in real code with Next.js, React and TypeScript. Fully yours.", bg: "#1F1712", fg: "#F3EEE4", iconBg: "#B86CF9", iconFg: "#1F1712" },
  { w: "+ AI", n: "02", k: 11, t: "Intelligence on top", d: "AI assistants that answer your customers, agents that handle routine work and AI features inside the tools your team already uses.", bg: "#B86CF9", fg: "#1F1712", iconBg: "#1F1712", iconFg: "#B86CF9" },
  { w: "= Business", n: "03", k: 17, t: "Results for your business", d: "Everything is built to bring in customers and save time. After launch we stay on to host, maintain and improve it on a simple monthly plan.", bg: "#FAF7F1", fg: "#1F1712", iconBg: "#1F1712", iconFg: "#B86CF9" },
];

export default function AboutPage() {
  const { go, openProject, mobile: M, narrow, projects } = useSite();
  const film = useRef<HTMLVideoElement | null>(null);
  const [filmOn, setFilmOn] = useState(false);
  const playFilm = () => {
    const v = film.current; if (!v) return;
    v.muted = false; v.loop = false; v.controls = true; v.currentTime = 0; v.play().catch(() => {});
    setFilmOn(true);
  };
  const v = {
    go,
    filmRef: (el: HTMLVideoElement | null) => { film.current = el; }, playFilm, filmIdle: !filmOn,
    pillars: PILLARS,
    cccH: M ? "240vh" : "320vh", cccCols: M ? "minmax(0,1fr)" : "minmax(0,1.1fr) minmax(0,1fr)", cccCardH: M ? "250px" : "440px", cccAlign: M ? "flex-start" : "center", cccPad: M ? "76px" : "clamp(84px,11vh,110px)", cccGap: M ? "20px" : "clamp(24px,5vw,80px)", cccDir: M ? "row" : "column", cccWord: M ? "clamp(32px,7.4vw,60px)" : "clamp(56px,8.2vw,150px)",
    brandSpanA: narrow ? 12 : 7, brandSpanB: narrow ? 12 : 5,
    globalFacts: [{ k: "Where", v: "Remote, worldwide" }, { k: "Language", v: "English and Bangla" }, { k: "Pricing", v: "USD or BDT" }, { k: "Engagement", v: "Project or hourly" }],
    belDescCol: M ? "1 / -1" : "auto",
    belCols: M ? "112px minmax(0,1fr)" : "112px minmax(0,1fr) minmax(0,1fr)",
    principles: PRINCIPLES, process: PROCESS,
    industriesLoop: [...Array(2)].flatMap(() => ["Clinics", "Coaching centers", "Restaurants", "Hotels", "Fashion", "Real estate", "Offices", "Personal brands"]),
    clientNames: projectVals(projects).map(p => ({ name: p.name, num: p.num, open: openProject(p) })),
  };
  return <AboutView v={v} />;
}
