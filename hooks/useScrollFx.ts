"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Scroll-effect toolkit.
 *
 * Every hook here is inert unless the viewport is desktop-width and the visitor
 * hasn't asked for reduced motion. When inert they apply no inline styles at
 * all, so the element falls back to its CSS resting state — which must always be
 * the *finished* state, never the "before" state, or the content would be stuck
 * invisible for those users.
 */

const DESKTOP = 1025;

function fxEnabled() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  return window.innerWidth >= DESKTOP;
}

/**
 * One rAF-coalesced scroll/resize subscription. The callback lives in a ref so
 * the listener is attached exactly once, yet always runs the latest closure.
 */
function useScrollEffect(fn: () => void) {
  const fnRef = useRef(fn);
  fnRef.current = fn;

  useEffect(() => {
    if (!fxEnabled()) return;
    let raf = 0;
    const tick = () => { raf = 0; fnRef.current(); };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick); };

    fnRef.current();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
}

/** Translate an element against the scroll. speed > 0 lags behind, < 0 runs ahead. */
export function useParallax<T extends HTMLElement>(speed = 0.15) {
  const ref = useRef<T>(null);

  useScrollEffect(() => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    // distance of the element's centre from the viewport centre
    const delta = (r.top + r.height / 2) - window.innerHeight / 2;
    el.style.transform = `translate3d(0, ${(-delta * speed).toFixed(2)}px, 0)`;
  });

  return ref;
}

/**
 * Progress of an element through the viewport, 0 → 1.
 * `enter` — element rising into view (reveal-style).
 * `pin`   — how far through a taller-than-viewport element we've scrolled
 *           (sticky/scrub-style). Only meaningful when height > viewport.
 * `exit`  — how far the element has scrolled *past* the top of the viewport.
 */
export function useScrollProgress<T extends HTMLElement>(mode: "enter" | "pin" | "exit" = "enter") {
  const ref = useRef<T>(null);
  // Must not depend on `fxEnabled()` — that reads the viewport, which the server
  // can't see, and the mismatched inline styles would break hydration. So start
  // at the value an inert client should keep forever: reveals ("enter"/"pin")
  // rest finished, while "exit" — which fades content *away* — rests at 0, or
  // the section would be invisible for reduced-motion visitors. On desktop the
  // scroll effect overwrites this on mount, and both sections sit below the
  // fold at load, so the correction is never seen.
  const [progress, setProgress] = useState(mode === "exit" ? 0 : 1);

  useScrollEffect(() => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;

    let p: number;
    if (mode === "pin")       p = -r.top / Math.max(1, r.height - vh);
    else if (mode === "exit") p = -r.top / Math.max(1, vh);
    else                      p = (vh - r.top) / Math.max(1, vh * 0.72);

    setProgress(Math.min(1, Math.max(0, p)));
  });

  return [ref, progress] as const;
}

/** True once the element has been seen. Latches — it never flips back to false. */
export function useInView<T extends HTMLElement>(threshold = 0.35) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setSeen(true); io.disconnect(); }
    }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, seen]);

  return [ref, seen] as const;
}

/** Count 0 → target once `run` goes true. Lands exactly on target. */
export function useCountUp(target: number, run: boolean, duration = 1600) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!run) return;
    if (!fxEnabled()) { setValue(target); return; }

    const start = performance.now();
    let raf = 0;
    const frame = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(eased * target));
      if (t < 1) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [target, run, duration]);

  return value;
}

export { fxEnabled };
