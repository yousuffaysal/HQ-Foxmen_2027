"use client";
import { useEffect, useRef, useState } from "react";

interface P {
  x: number; y: number;
  vx: number; vy: number;
  size: number;
  color: string;
  delay: number;
}

const FOX_CHARS    = ['F','o','x','m','e','n'];
const STUDIO_CHARS = ['S','t','u','d','i','o'];
// dissolve: Studio 'o' first → 'F' in Foxmen last
const DISSOLVE_ORDER = [11,10,9,8,7,6, 5,4,3,2,1,0];

export default function Preloader() {
  const wrapRef    = useRef<HTMLDivElement>(null);
  const logoRef    = useRef<HTMLDivElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const rafRef     = useRef<number>(0);
  const charRefs   = useRef<(HTMLSpanElement | null)[]>([]);
  const markImgRef = useRef<HTMLImageElement>(null);
  const tagRef     = useRef<HTMLSpanElement>(null);
  const [unmounted, setUnmounted] = useState(false);

  useEffect(() => {
    document.body.classList.add("loading");
    const t = setTimeout(disintegrate, 1800);
    return () => { clearTimeout(t); cancelAnimationFrame(rafRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function disintegrate() {
    const logo   = logoRef.current;
    const canvas = canvasRef.current;
    const wrap   = wrapRef.current;
    if (!logo || !canvas || !wrap) return;

    const rect = logo.getBoundingClientRect();
    const pad  = 32;
    const lx   = rect.left   - pad;
    const ly   = rect.top    - pad;
    const lw   = rect.width  + pad * 2;
    const lh   = rect.height + pad * 2;

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    /* ── offscreen canvas: paint logo regions with real colors ── */
    const off = document.createElement("canvas");
    off.width  = Math.ceil(lw);
    off.height = Math.ceil(lh);
    const offCtx = off.getContext("2d", { willReadFrequently: true });

    if (offCtx) {
      // SVG mark — same-origin, should draw fine; fallback to solid purple
      const markImg = markImgRef.current;
      if (markImg) {
        const mr = markImg.getBoundingClientRect();
        try {
          offCtx.drawImage(markImg, mr.left - lx, mr.top - ly, mr.width, mr.height);
        } catch {
          offCtx.fillStyle = "#8c3bd9";
          offCtx.fillRect(mr.left - lx, mr.top - ly, mr.width, mr.height);
        }
      }

      // Each character span → colored rect (dark for Foxmen, purple for Studio)
      charRefs.current.forEach((span, idx) => {
        if (!span) return;
        const cr = span.getBoundingClientRect();
        offCtx.fillStyle = idx >= 6 ? "#c47dff" : "#111";
        // tighten vertically: cap-height approx (skip top 8% / bottom 18%)
        const vPad = cr.height * 0.08;
        offCtx.fillRect(
          cr.left - lx,
          cr.top  - ly + vPad,
          cr.width,
          cr.height * 0.74,
        );
      });

      // Tagline
      if (tagRef.current) {
        const tr = tagRef.current.getBoundingClientRect();
        offCtx.fillStyle = "#888";
        offCtx.fillRect(tr.left - lx, tr.top - ly, tr.width, tr.height);
      }
    }

    /* ── collect every non-transparent pixel as a possible particle origin ── */
    type LogoPx = { x: number; y: number; r: number; g: number; b: number };
    const logoPixels: LogoPx[] = [];

    if (offCtx) {
      try {
        const imgData = offCtx.getImageData(0, 0, off.width, off.height);
        const d = imgData.data;
        for (let py = 0; py < off.height; py++) {
          for (let px = 0; px < off.width; px++) {
            const i = (py * off.width + px) * 4;
            if (d[i + 3] < 40) continue;
            logoPixels.push({ x: lx + px, y: ly + py, r: d[i], g: d[i+1], b: d[i+2] });
          }
        }
      } catch { /* getImageData blocked — logoPixels stays empty → fallback */ }
    }

    /* ── build particles from sampled logo pixels ── */
    const particles: P[] = [];
    const COUNT    = 3200;
    const SWEEP_MS = 1300;

    for (let i = 0; i < COUNT; i++) {
      let px: number, py: number, r: number, g: number, b: number;

      if (logoPixels.length > 0) {
        const src = logoPixels[Math.floor(Math.random() * logoPixels.length)];
        px = src.x + (Math.random() - 0.5) * 2.5;
        py = src.y + (Math.random() - 0.5) * 2.5;
        r = src.r; g = src.g; b = src.b;
      } else {
        // fallback: spread across logo rect with region-based color
        px = lx + Math.random() * lw;
        py = ly + Math.random() * lh;
        const inMark = (px - rect.left) < rect.width * 0.22;
        const inStudio = (px - rect.left) > rect.width * 0.55;
        if (inMark || inStudio) { r = 180; g = 90; b = 255; }
        else                    { r = 15;  g = 15; b = 15;  }
      }

      const xRatio = Math.max(0, Math.min(1, (px - lx) / lw));
      const spread = Math.PI * 0.55;
      const angle  = -spread / 2 + Math.random() * spread;
      const speed  = 0.6 + Math.random() * 3.8;

      // subtle color variation per particle
      const v = (Math.random() - 0.5) * 30;
      const clamp = (n: number) => Math.min(255, Math.max(0, Math.round(n + v)));

      particles.push({
        x: px, y: py,
        vx: Math.cos(angle) * speed + 0.7,
        vy: Math.sin(angle) * speed - 0.3,
        size: Math.random() * 6 + 2,    // 2–8 px — large, visible shards
        color: `rgb(${clamp(r)},${clamp(g)},${clamp(b)})`,
        delay: (1 - xRatio) * SWEEP_MS, // right side first
      });
    }

    /* ── stagger character fade right→left ── */
    const CHAR_MS = 110;

    DISSOLVE_ORDER.forEach((charIdx, step) => {
      const span = charRefs.current[charIdx];
      if (!span) return;
      setTimeout(() => {
        span.style.transition = "opacity 0.45s ease-out";
        span.style.opacity = "0";
      }, step * CHAR_MS);
    });

    setTimeout(() => {
      if (tagRef.current) {
        tagRef.current.style.transition = "opacity 0.5s ease-out";
        tagRef.current.style.opacity = "0";
      }
    }, 5 * CHAR_MS);

    setTimeout(() => {
      if (markImgRef.current) {
        markImgRef.current.style.transition = "opacity 0.6s ease-out";
        markImgRef.current.style.opacity = "0";
      }
    }, DISSOLVE_ORDER.length * CHAR_MS + 120);

    /* ── rAF loop ── */
    const _ctx    = ctx;
    const _canvas = canvas;
    const _wrap   = wrap;

    let t0: number | null = null;
    const DUR = 1000;

    function tick(ts: number) {
      if (!t0) t0 = ts;
      const elapsed = ts - t0;
      _ctx.clearRect(0, 0, _canvas.width, _canvas.height);

      let alive = false;
      for (const p of particles) {
        const age = Math.max(0, elapsed - p.delay);
        if (age === 0) { alive = true; continue; }
        const alpha = Math.max(0, 1 - (age / DUR) * 1.35);
        if (alpha <= 0) continue;
        alive = true;
        _ctx.globalAlpha = alpha;
        _ctx.fillStyle   = p.color;
        _ctx.fillRect(
          p.x + p.vx * age * 0.065,
          p.y + p.vy * age * 0.065,
          p.size, p.size,
        );
      }
      _ctx.globalAlpha = 1;

      if (alive) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        document.body.classList.remove("loading");
        _wrap.style.transition = "opacity 0.55s cubic-bezier(.22,.61,.36,1)";
        _wrap.style.opacity    = "0";
        setTimeout(() => setUnmounted(true), 600);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
  }

  if (unmounted) return null;

  return (
    <div id="preloader" ref={wrapRef} aria-hidden="true">
      <div className="pre-noise" />

      <div className="pre-inner">
        <div ref={logoRef} className="pre-logo-wrap">
          <div className="pre-logo-row">
            <img
              ref={markImgRef}
              src="/assets/logo-mark.svg"
              className="pre-mark"
              alt=""
            />
            <div className="pre-wordmark">
              <span className="pre-name">
                {FOX_CHARS.map((ch, i) => (
                  <span key={i} ref={el => { charRefs.current[i] = el; }}>{ch}</span>
                ))}
                {' '}
                <em>
                  {STUDIO_CHARS.map((ch, i) => (
                    <span key={i} ref={el => { charRefs.current[6 + i] = el; }}>{ch}</span>
                  ))}
                </em>
              </span>
              <span ref={tagRef} className="pre-tagline">Code · Craft · Care</span>
            </div>
          </div>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        style={{
          position: "fixed", inset: 0,
          width: "100vw", height: "100vh",
          zIndex: 2, pointerEvents: "none",
        }}
      />
    </div>
  );
}
