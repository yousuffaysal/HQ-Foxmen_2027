"use client";
import CaseView from "../views/CaseView";
import { useSite } from "../SiteChrome";
import { projectVals } from "../values";
import { slug } from "@/lib/site/data";

export default function CasePage({ index }: { index: number }) {
  const { go, openProject } = useSite();
  const proj = projectVals();
  const ci = Math.min(index, proj.length - 1), cs = proj[ci], nx = proj[(ci + 1) % proj.length];
  const v = {
    go,
    cs: { ...cs, slug: slug(cs.name), total: String(proj.length).padStart(2, "0"), services: cs.tags.join(", "), site: cs.hasUrl ? cs.url : "Private build", feats: cs.features.map((f, k) => ({ f, n: String(k + 1).padStart(2, "0") })) },
    nx: { ...nx, open: openProject(nx.i) },
  };
  return <CaseView v={v} />;
}
