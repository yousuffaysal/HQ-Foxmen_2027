"use client";
import { useState } from "react";
import WorkView from "../views/WorkView";
import { useSite } from "../SiteChrome";
import { pickVals, projectVals } from "../values";

const LAYOUT: [number, string, string, string, string][] = [
  [12, "21/9", "0px", "clamp(48px,7vw,112px)", "14vw"],
  [7, "4/3", "0px", "clamp(34px,3.6vw,56px)", "12vw"],
  [5, "4/5", "clamp(0px,10vw,160px)", "clamp(34px,3.6vw,56px)", "10vw"],
  [5, "4/5", "0px", "clamp(34px,3.6vw,56px)", "10vw"],
  [7, "4/3", "clamp(0px,10vw,160px)", "clamp(34px,3.6vw,56px)", "12vw"],
];

// Only visible projects reach the client (hidden ones are filtered in the layout's query).
export default function WorkPage() {
  const { openProject, mobile: M, narrow: N, projects } = useSite();
  const [filter, setFilter] = useState("All");
  const visible = projectVals(projects);
  const v = {
    workCount: visible.length,
    filters: ["All", "E-commerce", "AI", "Websites", "Platforms", "3D"].map(f => ({ label: f, ...pickVals(filter, f, setFilter) })),
    workList: visible.filter(p => filter === "All" || p.tags.includes(filter)).map((p, k) => {
      const L = LAYOUT[k % 5];
      return {
        ...p, open: openProject(p), span: N ? 12 : L[0], ratio: N ? "4/3" : L[1],
        mt: N ? "0px" : M && L[2] !== "0px" ? "clamp(0px,6vw,80px)" : L[2],
        titleSize: N ? "clamp(34px,8vw,56px)" : M && L[0] === 7 ? "clamp(28px,3.6vw,56px)" : M && L[0] === 5 ? "clamp(26px,3.2vw,56px)" : L[3],
        wm: L[4],
      };
    }),
  };
  return <WorkView v={v} />;
}
