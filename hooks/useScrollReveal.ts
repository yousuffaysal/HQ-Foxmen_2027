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
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    const observe = (root: Element | Document = document) => {
      root.querySelectorAll(selector).forEach((el) => {
        if (!el.classList.contains("in")) io.observe(el);
      });
    };

    observe();

    // Watch for elements added after initial render (async data loads)
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches(selector)) io.observe(node);
          node.querySelectorAll(selector).forEach((el) => {
            if (!el.classList.contains("in")) io.observe(el);
          });
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
