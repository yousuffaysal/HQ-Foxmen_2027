"use client";
import { useEffect, useState } from "react";

type TocItem = { text: string; id: string; level: number };

/* Renders the TOC links and highlights the section currently in view. */
export default function TocScrollspy({ toc }: { toc: TocItem[] }) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const headings = Array.from(document.querySelectorAll<HTMLElement>(".post-prose h1, .post-prose h2, .post-prose h3"));
    if (!headings.length) return;
    const obs = new IntersectionObserver((entries) => {
      const vis = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (vis[0]?.target.id) setActiveId(vis[0].target.id);
    }, { rootMargin: "-96px 0px -68% 0px" });
    headings.forEach(h => obs.observe(h));
    return () => obs.disconnect();
  }, []);

  return (
    <nav className="bd-toc">
      {toc.map((item) => (
        <a key={item.id} href={`#${item.id}`} className={`${item.level === 3 ? "l3" : ""}${activeId === item.id ? " active" : ""}`}>{item.text}</a>
      ))}
    </nav>
  );
}
