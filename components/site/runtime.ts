/* eslint-disable @typescript-eslint/no-explicit-any */
// DOM motion runtime, ported from the design's Component class (collect/tick/wave/ascii/icons).
// It drives every data-* hook in the generated views: reveals, marquees, sticky decks,
// word reveal, scale-in, ASCII art, the workforce 3D scene, nav hide and the progress bar.
import Lenis from "lenis";
import { isEink } from "./eink";

type El = HTMLElement & Record<string, any>;

export function asciiIcon(k: number, f: number): string {
  const pad = (s: string, n: number) => (s + " ".repeat(n)).slice(0, n);
  if (k === 10) { const d = [".  ", ".. ", "...", "   "][f % 4]; return " .-------. \n |  " + d + "  | \n " + "'" + "-. .---" + "'" + " \n   |/      "; }
  if (k === 11) { const P = [[0, 0], [1, 0], [2, 0], [3, 0], [3, 1], [3, 2], [2, 2], [1, 2], [0, 2], [0, 1]]; const g = [[" ", " ", " ", " "], [" ", " ", " ", " "], [" ", " ", " ", " "]]; const n = f % (P.length + 3); for (let i = 0; i < Math.min(n, P.length); i++) g[P[i][1]][P[i][0]] = "#"; if (n < P.length) g[P[n][1]][P[n][0]] = "+"; return g.map(r => "  " + r.join(" ") + "  ").join("\n"); }
  if (k === 12) { const code = ["const", "app =", "build()"]; const n = f % 16; const out: string[] = []; let c = n; for (const s of code) { const t = s.slice(0, Math.max(0, c)); c -= s.length; out.push(pad(" " + t + (c < 0 && c > -s.length - 1 && f % 2 ? "_" : ""), 10)); } return "</>" + "\n" + out.join("\n"); }
  if (k === 13) { const y = f % 7; const R = [" /\\ ", " |o| ", "/|_|\\", " ^^^ "]; const top = 5 - y; const s: string[] = []; for (let i = 0; i < 5; i++) { const ri = i - (top - 3); s.push(ri >= 0 && ri < 4 ? "  " + R[ri] + "  " : "         "); } return s.join("\n"); }
  if (k === 14) { const B = ["[#]", "[=]", "[~]", "[*]"]; const o = f % 4; const a = B.slice(o).concat(B.slice(0, o)); return " " + a[0] + " " + a[1] + " \n " + a[2] + " " + a[3] + " \n  custom  "; }
  if (k === 15) { const n = f % 8, W = 9; const bar = "=".repeat(n) + ">"; return " " + pad(bar, W) + "\n " + pad("=".repeat(Math.max(0, n - 2)) + ">", W) + "\n " + pad("=".repeat(Math.max(0, n - 1)) + ">", W) + "\n  " + String(90 + n) + " ms "; }
  if (k === 16) { const s = f % 6 < 3; return " .-----. \n |  " + (s ? "A" : "অ") + "  | \n " + "'" + "-----" + "'" + " \n  " + (s ? "EN ⇄ বাং" : "বাং ⇄ EN"); }
  if (k === 17) { const W = 11, n = f % W; let line = ""; for (let x = 0; x < W; x++) { const d = (x - n + W) % W; line += d === 0 ? "^" : d === 1 ? "v" : "-"; } return "  .---.  \n  | ♥ |  \n  " + "'" + "---" + "'" + "  \n" + line; }
  if (k === 0) { const w = "deploy"; const n = f % 12; return "┌──────────┐\n│" + pad(">" + w.slice(0, Math.min(n, 6)) + (f % 2 ? "█" : " "), 10) + "│\n│" + pad(n > 8 ? " ✓ live" : " ...", 10) + "│\n└──────────┘"; }
  if (k === 1) { const m = ["|  :  .", ":  .  |", ".  |  :"]; const q = m[f % 3]; return "  .----.  \n /" + q.slice(0, 6) + "\\ \n|" + q + "|\n \\" + q.slice(1, 7) + "/ \n  '----'  "; }
  if (k === 2) { const n = f % 4, w = ["   ", "  )", " ))", ")))"][n], l = ["   ", "(  ", "(( ", "((("][n]; return "    |    \n " + l + "●" + w + " \n    |    \n   /_\\   "; }
  if (k === 3) { const hs = [0, 1, 2, 3].map(i => 1 + (f + i * 2) % 4); let s = ""; for (let y = 4; y >= 1; y--) { s += " "; for (let i = 0; i < 4; i++) s += (hs[i] >= y ? "██" : "  ") + " "; s += "\n"; } return s + " └─────────┘"; }
  if (k === 4) { const g = ["|", "/", "─", "\\"][f % 4], g2 = ["─", "\\", "|", "/"][f % 4], d = ["→  ", " → ", "  →"][f % 3]; return " .-.     .-.\n( " + g + " )" + d + "( " + g2 + " )\n '-'     '-'"; }
  if (k === 5) { const n = f % 4; return "┌─────────┐\n│  " + pad("• ".repeat(n), 6) + " │\n└─┬───────┘\n  ▼  24/7  "; }
  const W = 11; const rows = ["", "", "", ""]; for (let x = 0; x < W; x++) { const y = Math.round(1.5 + 1.5 * Math.sin((x + f) * .7)); for (let r = 0; r < 4; r++) rows[r] += (3 - r) === y ? "•" : ((3 - r) < y ? "·" : " "); } return rows.join("\n") + "\n" + "─".repeat(W);
}

export class FxRuntime {
  root: HTMLElement;
  isMenuOpen: () => boolean;
  lenis: Lenis | null = null;
  els: any = null;
  pending: El[] = [];
  raf = 0; revealTimer: any; iconTimer: any; iconF = 0;
  mx = 0; my = 0; cx = 0; cy = 0; vel = 0; lastY: number | null = null; dirty = true;
  navOn: boolean | undefined; navHidden = false;
  lastW = 0; lastA = 0; aA = 0; aB = 0;
  wf: { host: Element; api: any } | null = null; wfP = 0;
  mo: MutationObserver | null = null; moT: any;
  // E-ink: no smooth scroll, reveals shown at once, time-driven art drawn once then held still.
  eink = isEink();

  constructor(root: HTMLElement, opts: { isMenuOpen: () => boolean }) {
    this.root = root;
    this.isMenuOpen = opts.isMenuOpen;
  }

  get mobile() { return innerWidth < 1100; }

  start() {
    addEventListener("resize", this.onResize);
    addEventListener("scroll", this.revealPending, { passive: true });
    addEventListener("pointermove", this.onMouse, { passive: true });
    this.revealTimer = setInterval(this.revealPending, 300);
    this.iconTimer = setInterval(() => {
      const ic = this.root.querySelectorAll<HTMLElement>("[data-icon]"); if (!ic.length) return;
      if (this.eink && this.iconF) return;
      const f = ++this.iconF;
      ic.forEach(el => { const rr = el.getBoundingClientRect(); if (rr.bottom < -50 || rr.top > innerHeight + 50) { if (el.textContent) return; } el.textContent = asciiIcon(+(el.dataset.icon || 0), f); });
    }, 140);
    if (!this.eink && !matchMedia("(pointer: coarse)").matches) { try { this.lenis = new Lenis({ lerp: 0.1, smoothWheel: true }); } catch { this.lenis = null; } }
    const loop = (t: number) => { if (this.lenis) this.lenis.raf(t); this.tick(t); this.raf = requestAnimationFrame(loop); };
    this.raf = requestAnimationFrame(loop);
    // Re-collect when React swaps page content (route change, filters, tabs).
    // Only element insertions/removals count: the ASCII art rewrites text nodes every frame.
    const isEl = (n: Node) => n.nodeType === 1 && (n as Element).tagName !== "CANVAS";
    this.mo = new MutationObserver(ms => {
      if (!ms.some(m => [...m.addedNodes].some(isEl) || [...m.removedNodes].some(isEl))) return;
      clearTimeout(this.moT); this.moT = setTimeout(() => this.collect(), 30);
    });
    this.mo.observe(this.root, { childList: true, subtree: true });
    setTimeout(() => this.collect(), 80);
    setTimeout(() => this.collect(), 900);
  }

  destroy() {
    cancelAnimationFrame(this.raf); clearInterval(this.revealTimer); clearInterval(this.iconTimer); clearTimeout(this.moT);
    if (this.wf && this.wf.api) this.wf.api.destroy();
    this.wf = null;
    this.mo?.disconnect();
    removeEventListener("pointermove", this.onMouse); removeEventListener("scroll", this.revealPending); removeEventListener("resize", this.onResize);
    if (this.lenis) this.lenis.destroy();
  }

  onResize = () => { this.layout(); };
  onMouse = (e: PointerEvent) => { this.mx = e.clientX / innerWidth - 0.5; this.my = e.clientY / innerHeight - 0.5; };

  scrollTop() { if (this.lenis) this.lenis.scrollTo(0, { immediate: true, force: true }); window.scrollTo(0, 0); }
  setScrollLock(on: boolean) { if (!this.lenis) return; if (on) this.lenis.stop(); else this.lenis.start(); }

  collect() {
    const r = this.root; if (!r) return;
    const q = (s: string) => [...r.querySelectorAll<El>(s)];
    this.els = { speed: q("[data-speed]"), rot: q("[data-rot]"), mq: q("[data-marquee]"), hs: q("[data-hscroll]"), deck: r.querySelector("[data-deck]"), words: q("[data-words]"), scale: q("[data-scale]"), wf: r.querySelector("[data-wf]"), ccc: r.querySelector("[data-ccc]"), ascii: r.querySelector("[data-ascii]"), wave: r.querySelector("[data-wave]"), depth: q("[data-depth]"), nav: r.querySelector("[data-nav]"), prog: r.querySelector("[data-progress]") };
    this.layout(); this.dirty = true; this.navOn = undefined; this.navHidden = false;
    this.pending = (this.pending || []).filter(t => t.isConnected);
    q("[data-reveal]").forEach(el => {
      if (el.__done) return; el.__done = 1;
      if (this.eink) return;
      const up = el.dataset.reveal === "up", d = +(el.dataset.delay || 0);
      el.style.transition = `opacity .9s cubic-bezier(.16,1,.3,1) ${d}ms, transform 1.1s cubic-bezier(.16,1,.3,1) ${d}ms`;
      el.style.opacity = up ? "1" : "0";
      el.style.transform = up ? "translateY(110%)" : "translateY(40px)";
      const t = (up ? el.parentElement : el) as El;
      if (!t.__rv) { t.__rv = []; this.pending.push(t); }
      t.__rv.push(el);
    });
    setTimeout(this.revealPending, 60);
    const wfc = r.querySelector("[data-wfcanvas]");
    if (this.wf && this.wf.host !== wfc) { if (this.wf.api) this.wf.api.destroy(); this.wf = null; }
    if (wfc && !this.wf) {
      const w = (this.wf = { host: wfc, api: null as any });
      import("./workforce-scene.js")
        .then(m => { if (this.wf === w && wfc.isConnected) w.api = m.mount(wfc, () => this.wfP || 0); })
        .catch(e => console.warn("3D scene failed", e));
    }
  }

  revealPending = () => {
    if (!this.pending || !this.pending.length) return;
    const vh = innerHeight;
    this.pending = this.pending.filter(tg => {
      if (!tg.isConnected) return false;
      const b = tg.getBoundingClientRect();
      if (b.top < vh * 0.94 && b.bottom > 0) { tg.__rv.forEach((el: El) => { el.style.opacity = "1"; el.style.transform = "none"; }); return false; }
      return true;
    });
  };

  layout() {
    if (!this.els) return;
    this.els.hs.forEach((el: El) => {
      const tr = el.querySelector<HTMLElement>("[data-track]"); if (!tr) return;
      const extra = Math.max(0, tr.scrollWidth - innerWidth);
      el.__extra = extra; el.style.height = (extra + innerHeight) + "px";
    });
    this.dirty = true;
  }

  tick(t: number) {
    const E = this.els; if (!E) return;
    const vh = innerHeight, sy = scrollY, cl = (v: number) => Math.max(0, Math.min(1, v));
    const dy = sy - (this.lastY ?? sy);
    const moved = dy !== 0 || this.dirty; this.dirty = false; this.lastY = sy;
    this.vel = (this.vel || 0) * 0.92 + dy * 0.08;
    const boost = 0.7 + Math.min(Math.abs(this.vel) * 0.6, 14);
    if (this.eink) { if (moved) this.still(); else return; }
    else E.mq.forEach((el: El) => {
      const dir = Number(el.dataset.marquee) || 1;
      el.__x = (el.__x || 0) + boost * dir;
      const half = el.__half || (el.__half = el.scrollWidth / 2);
      if (!half) return;
      let x = el.__x % half; if (x > 0) x -= half;
      el.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`;
    });
    if (E.depth.length && !this.eink) {
      this.cx = (this.cx || 0) + ((this.mx || 0) - (this.cx || 0)) * 0.06; this.cy = (this.cy || 0) + ((this.my || 0) - (this.cy || 0)) * 0.06;
      const fy = Math.sin(t / 1400);
      E.depth.forEach((el: El, i: number) => { const d = Number(el.dataset.depth); el.style.transform = `translate3d(${(this.cx * d).toFixed(1)}px,${(this.cy * d + fy * (6 + i * 3)).toFixed(1)}px,0)`; });
    }
    if (!this.eink && E.wave && E.wave.isConnected && t - (this.lastW || 0) > 60) {
      const b = E.wave.getBoundingClientRect();
      if (b.bottom > 0 && b.top < vh) { this.lastW = t; this.wave(E.wave, t / 1000, b); }
    }
    if (!this.eink && E.ascii && E.ascii.isConnected && t - (this.lastA || 0) > 45) {
      const b = E.ascii.getBoundingClientRect();
      if (b.bottom > 0 && b.top < vh) { this.lastA = t; this.ascii(E.ascii); }
    }
    if (!moved) return;
    if (E.nav) {
      const hide = sy > 240 && dy > 2 && !this.isMenuOpen() ? true : (dy < -2 || sy < 240 ? false : this.navHidden);
      if (hide !== this.navHidden) { this.navHidden = hide; E.nav.style.transform = hide ? "translateY(-140%)" : "none"; }
    }
    if (E.nav && E.nav.dataset.nav === "bar") {
      const on = sy > 30;
      if (on !== this.navOn) { this.navOn = on; E.nav.style.background = on ? "rgba(243,238,228,.82)" : "transparent"; E.nav.style.backdropFilter = on ? "blur(14px)" : "none"; E.nav.style.webkitBackdropFilter = on ? "blur(14px)" : "none"; E.nav.style.boxShadow = on ? "0 1px 0 rgba(31,23,18,.08)" : "none"; }
    }
    if (E.prog) { const h = document.documentElement.scrollHeight - vh; E.prog.style.transform = `scaleX(${h > 0 ? sy / h : 0})`; }
    E.speed.forEach((el: El) => { const b = el.parentElement!.getBoundingClientRect(); const c = b.top + b.height / 2 - vh / 2; el.style.transform = `translate3d(0,${(c * Number(el.dataset.speed)).toFixed(1)}px,0)`; });
    E.rot.forEach((el: El) => { el.style.transform = `rotate(${(sy * Number(el.dataset.rot)).toFixed(2)}deg)`; });
    E.hs.forEach((el: El) => {
      const b = el.getBoundingClientRect(), p = cl(-b.top / Math.max(1, b.height - vh));
      const tr = el.__tr || (el.__tr = el.querySelector("[data-track]"));
      const bar = el.__bar || (el.__bar = el.querySelector("[data-hbar]"));
      if (tr) tr.style.transform = `translate3d(${(-p * (el.__extra || 0)).toFixed(1)}px,0,0)`;
      if (bar) bar.style.transform = `scaleX(${p})`;
    });
    if (E.ccc) {
      const el = E.ccc as El, b = el.getBoundingClientRect(), p = cl(-b.top / Math.max(1, b.height - vh));
      const ws = el.__w || (el.__w = [...el.querySelectorAll("[data-cccw]")]), cs = el.__c || (el.__c = [...el.querySelectorAll("[data-cccc]")]);
      const act = Math.min(ws.length - 1, Math.floor(p * ws.length * 0.999));
      if (act !== el.__a) {
        el.__a = act;
        ws.forEach((w: El, i: number) => { w.style.opacity = i === act ? "1" : ".14"; w.style.transform = i === act ? "translateX(14px)" : "none"; });
        cs.forEach((c: El, i: number) => { c.style.opacity = i === act ? "1" : "0"; c.style.transform = i === act ? "none" : (i < act ? "translateY(-24px)" : "translateY(24px)"); });
      }
    }
    if (E.deck) {
      const el = E.deck as El, b = el.getBoundingClientRect(), p = cl(-b.top / Math.max(1, b.height - vh));
      const cards = el.__c || (el.__c = [...el.querySelectorAll("[data-deckcard]")]);
      const names = el.__n || (el.__n = [...el.querySelectorAll("[data-deckname]")]);
      const n = cards.length, s = cl(p * 1.16 - 0.06) * (n - 1);
      cards.forEach((c: El, i: number) => {
        const d = s - i;
        let tf;
        if (d <= -1) tf = "translate3d(0,115%,0) rotate(5deg)";
        else if (d < 0) { const u = -d; tf = `translate3d(0,${(u * 115).toFixed(2)}%,0) rotate(${(u * 5).toFixed(2)}deg)`; }
        else { const k = Math.min(d, 3); tf = `translate3d(0,${(-k * 3.2).toFixed(2)}%,0) scale(${(1 - k * .055).toFixed(3)})`; }
        c.style.transform = tf;
        c.style.zIndex = String(i + 1);
        c.style.filter = d > 0 ? `brightness(${(1 - Math.min(d, 3) * .1).toFixed(3)})` : "none";
      });
      const act = Math.min(n - 1, Math.round(s));
      if (act !== el.__a) {
        el.__a = act;
        names.forEach((nm: El, i: number) => { nm.style.opacity = i === act ? "1" : ".35"; nm.style.paddingLeft = i === act ? "14px" : "0"; });
        const cnt = el.__cnt || (el.__cnt = el.querySelector("[data-deckcount]"));
        if (cnt) cnt.style.transform = `translateY(${-act * 100 / n}%)`;
      }
      const bar = el.__bar || (el.__bar = el.querySelector("[data-deckbar]")); if (bar) bar.style.transform = `scaleX(${p})`;
    }
    E.words.forEach((el: El) => {
      const b = el.getBoundingClientRect(), p = cl(-b.top / Math.max(1, b.height - vh));
      const ws = el.__w || (el.__w = [...el.querySelectorAll("[data-w]")]); const n = ws.length;
      ws.forEach((w: El, i: number) => { const o = 0.14 + 0.86 * cl(p * 1.2 * n - i); if (Math.abs((w.__o || 0) - o) > 0.01) { w.__o = o; w.style.opacity = o.toFixed(2); } });
    });
    E.scale.forEach((el: El) => {
      const b = el.getBoundingClientRect(), p = cl((vh - b.top) / (vh * 0.9));
      const ch = el.firstElementChild as HTMLElement | null; if (ch) ch.style.transform = `scale(${(0.86 + 0.14 * p).toFixed(3)})`;
    });
    if (E.wf) {
      const el = E.wf as El, b = el.getBoundingClientRect(), p = cl(-b.top / Math.max(1, b.height - vh));
      this.wfP = p;
      const st = el.__s || (el.__s = [...el.querySelectorAll("[data-step]")]);
      const act = Math.round(p * 8) - 1, M = this.mobile;
      if (act !== el.__act || M !== el.__m) {
        el.__act = act; el.__m = M;
        st.forEach((c: El, i: number) => {
          const on = i === act;
          c.style.opacity = on ? "1" : (act < 0 || act > 6 ? ".75" : ".5");
          c.style.background = on ? "#FAF7F1" : "rgba(250,247,241,.82)";
          c.style.transform = on ? "translateX(-8px)" : "none";
          c.style.display = M && !on && act >= 0 && act <= 6 ? "none" : (M && (act < 0 || act > 6) && i > 0 ? "none" : "flex");
          const ib = c.querySelector("[data-iconbox]") as HTMLElement; ib.style.background = on ? "#B86CF9" : "#1F1712"; ib.style.color = on ? "#1F1712" : "#B86CF9";
          (c.querySelector("[data-desc]") as HTMLElement).style.gridTemplateRows = on ? "1fr" : "0fr";
        });
      }
      const tod = (9 + p * 24) % 24, hh = Math.floor(tod), mm = Math.floor((tod - hh) * 60 / 5) * 5;
      const night = .5 - .5 * Math.cos(2 * Math.PI * (tod - 13) / 24);
      const ck = el.__ck || (el.__ck = el.querySelector("[data-clock]")); ck.textContent = String(hh).padStart(2, "0") + ":" + String(mm).padStart(2, "0");
      const cl2 = el.__cl || (el.__cl = el.querySelector("[data-clocklabel]")); const lab = hh >= 7 && hh < 19 ? "Day shift" : "Night shift, still working"; if (cl2.textContent !== lab) cl2.textContent = lab;
      const hd = el.__hd || (el.__hd = el.querySelector("[data-wfhead]")); const col = night > .5 ? "#F3EEE4" : "#1F1712"; if (hd.style.color !== col) hd.style.color = col;
      const bar = el.__bar || (el.__bar = el.querySelector("[data-wfbar]")); bar.style.transform = `scaleX(${p})`;
    }
  }

  // E-ink: paint the wave and ASCII art once (their first frame), only while on screen.
  still() {
    const E = this.els, vh = innerHeight;
    for (const k of ["wave", "ascii"] as const) {
      const el = E[k] as El | null;
      if (!el || !el.isConnected || el.__still) continue;
      const b = el.getBoundingClientRect();
      if (b.bottom > 0 && b.top < vh) { el.__still = 1; if (k === "wave") this.wave(el, 0, b); else this.ascii(el); }
    }
  }

  wave(el: HTMLElement, T: number, b: DOMRect) {
    const cw = (parseFloat(getComputedStyle(el).fontSize) || 12) * 0.6, lh = cw / 0.6 * 1.15;
    const W = Math.min(220, Math.ceil(b.width / cw)), H = Math.min(70, Math.ceil(b.height / lh));
    const ch = " .·:-=+*#", L = ch.length - 1; let s = "";
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const v = Math.sin(x * 0.11 + T * 1.1) + Math.sin(y * 0.32 - T * 0.8) + Math.sin((x + y) * 0.045 + T * 0.5) + Math.sin(Math.hypot(x - W / 2, (y - H / 2) * 2) * 0.12 - T * 1.4);
        s += ch[Math.max(0, Math.min(L, Math.floor((v + 4) / 8 * (L + 1))))];
      }
      s += "\n";
    }
    el.textContent = s;
  }

  ascii(el: HTMLElement) {
    const A = (this.aA = (this.aA || 0) + 0.05), B = (this.aB = (this.aB || 0) + 0.025);
    const W = 60, H = 30, out = new Array(W * H).fill(" "), z = new Float32Array(W * H);
    const cA = Math.cos(A), sA = Math.sin(A), cB = Math.cos(B), sB = Math.sin(B), ch = ".,-~:;=!*#$@";
    for (let j = 0; j < 6.28; j += 0.08) {
      const ct = Math.cos(j), st = Math.sin(j);
      for (let i = 0; i < 6.28; i += 0.025) {
        const sp = Math.sin(i), cp = Math.cos(i), h = ct + 2, D = 1 / (sp * h * sA + st * cA + 5), tt = sp * h * cA - st * sA;
        const x = 0 | (W / 2 + W * 0.42 * D * (cp * h * cB - tt * sB)), y = 0 | (H / 2 + H * 0.78 * D * (cp * h * sB + tt * cB));
        const o = x + W * y, N = 0 | (8 * ((st * sA - sp * ct * cA) * cB - sp * ct * sA - st * cA - cp * ct * sB));
        if (y >= 0 && y < H && x >= 0 && x < W && D > z[o]) { z[o] = D; out[o] = ch[N > 0 ? N : 0]; }
      }
    }
    let s = ""; for (let r = 0; r < H; r++) s += out.slice(r * W, r * W + W).join("") + "\n";
    el.textContent = s;
  }
}
