"use client";
import CaseView from "../views/CaseView";
import { useSite } from "../SiteChrome";
import { projectVals } from "../values";

export default function CasePage({ slug }: { slug: string }) {
  const { go, openProject, projects } = useSite();
  const proj = projectVals(projects);
  const ci = Math.max(0, proj.findIndex(p => p.slug === slug)), cs = proj[ci], nx = proj[(ci + 1) % proj.length];
  const v = {
    go,
    cs: { ...cs, total: String(proj.length).padStart(2, "0"), services: cs.tags.join(", "), site: cs.hasUrl ? cs.url : "Private build", feats: cs.features.map((f, k) => ({ f, n: String(k + 1).padStart(2, "0") })) },
    nx: { ...nx, open: openProject(nx) },
    // Screenshots uploaded in the admin fill the design's image slots.
    slots: { [`case-${cs.slug}-hero`]: cs.heroImage, [`case-${cs.slug}-a`]: cs.imageA, [`case-${cs.slug}-b`]: cs.imageB },
  };
  return <CaseView v={v} />;
}
