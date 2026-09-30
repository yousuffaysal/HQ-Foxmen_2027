// Shared pieces of the design's renderVals(), used by several pages.
import { CARD_BG, PRINCIPLES, PROCESS, SERVICES, TINTS, type SiteProject } from "@/lib/site/data";

export const serviceVals = (usd: boolean, mobile: boolean) =>
  SERVICES.map((s, i) => ({ ...s, top: `calc(${mobile ? 76 : 96}px + ${i * 14}px)`, bg: CARD_BG[i], price: usd ? s.usd : s.bdt, extra: s.xb ? (usd ? s.xu : s.xb) : "" }));

export const projectVals = (projects: SiteProject[]) =>
  projects.map((p, i) => ({ ...p, i, num: String(i + 1).padStart(2, "0"), tint: TINTS[i % TINTS.length], label: p.url ? `screenshot · ${p.url}` : "screenshot", hasUrl: !!p.url, href: "https://" + p.url, latest: !!p.latest }));

export const currencyVals = (usd: boolean, setCur: (c: "bdt" | "usd") => void) => ({
  setBdt: () => setCur("bdt"), setUsd: () => setCur("usd"),
  bdtBg: usd ? "transparent" : "#1F1712", bdtFg: usd ? "#1F1712" : "#F3EEE4", usdBg: usd ? "#1F1712" : "transparent", usdFg: usd ? "#F3EEE4" : "#1F1712",
});

export const pickVals = <T,>(cur: T, v: T, set: (v: T) => void) => ({
  bg: cur === v ? "#1F1712" : "transparent", fg: cur === v ? "#F3EEE4" : "#1F1712", pick: () => set(v),
});

export { PROCESS, PRINCIPLES };
