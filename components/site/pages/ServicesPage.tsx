"use client";
import ServicesView from "../views/ServicesView";
import { useSite } from "../SiteChrome";
import { currencyVals, serviceVals } from "../values";

export default function ServicesPage() {
  const { go, cur, setCur, mobile } = useSite();
  const usd = cur === "usd";
  const v = {
    go, services: serviceVals(usd, mobile), ...currencyVals(usd, setCur),
    tech: ["Next.js", "React", "TypeScript", "Node.js", "Prisma", "PostgreSQL", "Python", "Django", "Llama 3.3 via Groq", "Custom fine-tuning", "Cloudflare", "Vercel", "GSAP", "Framer Motion", "3D web graphics"],
  };
  return <ServicesView v={v} />;
}
