"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";

const BG_IMAGE =
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260713_140344_79e1296a-86d7-43fd-9b5f-63ffe560f291.png&w=1280&q=85";
const HERO_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260713_162101_0d7498c5-29bb-47bf-a99f-2773c0a880a9.mp4";
const OVERLAY_IMAGE =
  "https://soft-zoom-63098134.figma.site/_assets/v11/3f10f1876e118f72a396e05a6c2d099569478272.png";

const SPOT_RADIUS = 260;
/* Feathered edge — same falloff as the source spec, expressed as a CSS mask instead of a
   per-frame canvas dataURL so the reveal composites on the GPU. */
const spotlightMask = (x: number, y: number) =>
  `radial-gradient(circle ${SPOT_RADIUS}px at ${x}px ${y}px, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,.75) 60%, rgba(0,0,0,.4) 75%, rgba(0,0,0,.12) 88%, rgba(0,0,0,0) 100%)`;

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
      <path d="M3 12h18M13 5l7 7-7 7" />
    </svg>
  );
}

export default function AboutHero({ isOpen }: { isOpen: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /* Desktop only: a cursor spotlight has nothing to follow on touch, and the
       extra video layer is dead weight there. Mobile keeps the still hero. */
    if (window.matchMedia("(pointer: coarse), (prefers-reduced-motion: reduce)").matches) return;

    const section = sectionRef.current;
    const spot = spotRef.current;
    const grid = gridRef.current;
    if (!section || !spot || !grid) return;

    const target = { x: -9999, y: -9999 };
    const smooth = { x: -9999, y: -9999 };
    const gridTarget = { x: 0, y: 0 };
    const gridSmooth = { x: 0, y: 0 };
    let raf = 0;
    let running = false;
    let visible = true;

    // Lerp until settled, then stop the loop — so a still cursor (e.g. while the
    // user scrolls the page) does no per-frame mask repaint. onMove wakes it again.
    const tick = () => {
      smooth.x += (target.x - smooth.x) * 0.1;
      smooth.y += (target.y - smooth.y) * 0.1;
      gridSmooth.x += (gridTarget.x - gridSmooth.x) * 0.06;
      gridSmooth.y += (gridTarget.y - gridSmooth.y) * 0.06;
      const mask = spotlightMask(smooth.x, smooth.y);
      spot.style.webkitMaskImage = mask;
      spot.style.maskImage = mask;
      grid.style.transform = `translate3d(${gridSmooth.x}px, ${gridSmooth.y}px, 0)`;
      const settled =
        Math.abs(target.x - smooth.x) < 0.4 && Math.abs(target.y - smooth.y) < 0.4 &&
        Math.abs(gridTarget.x - gridSmooth.x) < 0.05 && Math.abs(gridTarget.y - gridSmooth.y) < 0.05;
      if (settled) { running = false; return; }
      raf = requestAnimationFrame(tick);
    };
    const wake = () => { if (!running && visible) { running = true; raf = requestAnimationFrame(tick); } };

    const onMove = (e: PointerEvent) => {
      const r = section.getBoundingClientRect();
      target.x = e.clientX - r.left;
      target.y = e.clientY - r.top;
      if (smooth.x === -9999) { smooth.x = target.x; smooth.y = target.y; }
      gridTarget.x = (target.x / r.width - 0.5) * 16;
      gridTarget.y = (target.y / r.height - 0.5) * 16;
      wake();
    };
    const onLeave = () => { spot.style.opacity = "0"; };
    const onEnter = () => { spot.style.opacity = "1"; };

    // Kill the loop entirely once the hero leaves the viewport.
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (!visible) { cancelAnimationFrame(raf); running = false; }
    });
    io.observe(section);

    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerenter", onEnter);
    section.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerenter", onEnter);
      section.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section ref={sectionRef} className="ab-hero">
      {/* ── grid, parallaxed by the cursor ── */}
      <div ref={gridRef} className="ab-hero-grid" aria-hidden="true">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="ab-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#64748b" strokeWidth="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ab-grid)" />
        </svg>
      </div>

      {/* ── base plate ── */}
      <div className="ab-hero-bg" style={{ backgroundImage: `url(${BG_IMAGE})` }} aria-hidden="true" />
      <img src={OVERLAY_IMAGE} alt="" className="ab-hero-overlay" aria-hidden="true" />

      {/* ── the reveal: video shows only under the cursor, and only in the lower 60% ── */}
      <div ref={spotRef} className="ab-hero-spot" aria-hidden="true">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          src={HERO_VIDEO}
          className="ab-hero-video"
        />
      </div>

      {/* keeps the type legible wherever the footage or the plate goes bright */}
      <div className="ab-hero-scrim" aria-hidden="true" />

      <div className="ab-hero-content">
        <div className="wrap">
          <div className="ab-badge fade in">
            <span className={`ab-dot${isOpen ? "" : " off"}`} />
            About Foxmen Studio &nbsp;·&nbsp; {isOpen ? "Available now" : "Open · Q3 2026"}
          </div>

          <h1 className="ab-h1">
            <span className="reveal in">
              <span className="ab-r"><span className="ab-ri">We design, build,</span></span>
            </span>
            <span className="reveal in ab-d1">
              <span className="ab-r"><span className="ab-ri">and ship digital</span></span>
            </span>
            <span className="reveal in ab-d2">
              <span className="ab-r"><span className="ab-ri">products that <em>last.</em></span></span>
            </span>
          </h1>

          <p className="ab-sub fade in d2">
            Foxmen Studio is a global digital product agency partnering with founders and growth-stage companies to build websites, apps, and AI-integrated products — from brief to launch and beyond.
          </p>

          <div className="ab-acts fade in d3">
            <Link href="/contact" className="btn btn--on-dark">
              <span className="label">Start a project</span>
              <span className="chip" aria-hidden="true"><ArrowIcon /></span>
            </Link>
            <Link href="/work" className="btn btn--ghost btn--on-dark">
              <span className="label">See our work</span>
              <span className="chip" aria-hidden="true"><ArrowIcon /></span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
