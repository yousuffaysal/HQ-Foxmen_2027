"use client";
import { useState } from "react";
import WorkView from "../views/WorkView";
import { useSite } from "../SiteChrome";
import { pickVals, projectVals } from "../values";

// Only visible projects reach the client (hidden ones are filtered in the layout's query).
export default function WorkPage() {
  const { openProject, narrow: N, projects } = useSite();
  const [filter, setFilter] = useState("All");
  const visible = projectVals(projects);
  const v = {
    workCount: visible.length,
    filters: ["All", "E-commerce", "AI", "Websites", "Platforms", "3D"].map(f => ({ label: f, ...pickVals(filter, f, setFilter) })),
    // Every card is the same size and 16:10, the ratio of the screenshots, so covers are never cropped.
    workList: visible.filter(p => filter === "All" || p.tags.includes(filter)).map(p => ({
      ...p, open: openProject(p), span: N ? 12 : 6, ratio: "16/10", mt: "0px",
      titleSize: N ? "clamp(34px,8vw,56px)" : "clamp(30px,3.4vw,56px)", wm: "10vw",
    })),
  };
  return <WorkView v={v} />;
}
