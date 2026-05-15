"use client";
import { useEffect, useRef } from "react";

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor || !matchMedia("(hover:hover)").matches) return;

    let x = 0, y = 0, tx = 0, ty = 0;
    let raf: number;

    const onMove = (e: MouseEvent) => { tx = e.clientX; ty = e.clientY; };
    window.addEventListener("mousemove", onMove);

    const loop = () => {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      cursor.style.transform = `translate(${x}px, ${y}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const addLg = () => cursor.classList.add("lg");
    const remLg = () => cursor.classList.remove("lg");

    const attach = () => {
      document.querySelectorAll(".btn, .svc-row, a, .card a, .tlink, .pillar, .bento .tile, .next-project, .proj-grid .item").forEach((el) => {
        el.addEventListener("mouseenter", addLg);
        el.addEventListener("mouseleave", remLg);
      });
    };
    attach();

    // Re-attach after navigation (MutationObserver on body)
    const mo = new MutationObserver(attach);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      mo.disconnect();
    };
  }, []);

  return <div className="cursor" ref={cursorRef} aria-hidden="true" />;
}
