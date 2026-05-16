"use client";
import { useEffect } from "react";

export function useScrollReveal(selector = ".fade, .reveal") {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -20px 0px" }
    );

    const revealEl = (el: Element) => {
      if (el.classList.contains("in")) return;
      // If already in viewport, reveal immediately without waiting for callback
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 40 && rect.bottom > -40) {
        el.classList.add("in");
      } else {
        io.observe(el);
      }
    };

    const observe = (root: Element | Document = document) => {
      root.querySelectorAll<Element>(selector).forEach(revealEl);
    };

    observe();

    // Catch elements added after initial render (async data loads)
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches(selector)) revealEl(node);
          node.querySelectorAll<Element>(selector).forEach(revealEl);
        });
      }
    });

    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [selector]);
}
