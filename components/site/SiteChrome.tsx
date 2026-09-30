"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore, type MouseEvent, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { S } from "./style";
import { FxRuntime } from "./runtime";
import HeaderView from "./views/HeaderView";
import FooterView from "./views/FooterView";
import { CONTACT, LABELS, PAGES, PROJECTS, SERVICES, pathOf, slug } from "@/lib/site/data";

type Go = Record<string, (e?: MouseEvent) => void>;
type Ctx = {
  go: Go;
  navigate: (href: string, label: string) => void;
  openProject: (i: number) => (e?: MouseEvent) => void;
  openTool: (id: string) => (e?: MouseEvent) => void;
  cur: "bdt" | "usd";
  setCur: (c: "bdt" | "usd") => void;
  pendingTool: string | null;
  mobile: boolean;
  narrow: boolean;
  scrollTop: () => void;
};

const SiteCtx = createContext<Ctx | null>(null);
export const useSite = () => {
  const c = useContext(SiteCtx);
  if (!c) throw new Error("useSite outside SiteChrome");
  return c;
};

// The design's two breakpoints (mobile < 1100px, narrow < 700px). Server render assumes desktop.
const subscribe = (cb: () => void) => { addEventListener("resize", cb); return () => removeEventListener("resize", cb); };
const bp = () => (innerWidth < 700 ? 2 : innerWidth < 1100 ? 1 : 0);
export function useViewport() {
  const b = useSyncExternalStore(subscribe, bp, () => 0);
  return useMemo(() => ({ mobile: b >= 1, narrow: b === 2 }), [b]);
}

const EASE = "cubic-bezier(.76,0,.24,1)";

export default function SiteChrome({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const rt = useRef<FxRuntime | null>(null);
  const busy = useRef(false);
  const outgoing = useRef<{ a: Animation; target: string; fallback: ReturnType<typeof setTimeout> } | null>(null);
  const [menu, setMenu] = useState(false);
  const menuRef = useRef(false);
  useEffect(() => { menuRef.current = menu; }, [menu]);
  const [nextLabel, setNextLabel] = useState("");
  const [cur, setCur] = useState<"bdt" | "usd">("bdt");
  const [pendingTool, setPendingTool] = useState<string | null>(null);
  const { mobile, narrow } = useViewport();

  useEffect(() => {
    const r = new FxRuntime(rootRef.current!, { isMenuOpen: () => menuRef.current });
    rt.current = r;
    r.start();
    PAGES.forEach(p => router.prefetch(pathOf(p)));
    return () => { r.destroy(); rt.current = null; };
  }, [router]);

  const lift = useCallback(() => {
    const c = curtainRef.current, o = outgoing.current;
    if (!c || !o) return;
    clearTimeout(o.fallback);
    outgoing.current = null;
    rt.current?.scrollTop();
    setTimeout(() => {
      rt.current?.collect();
      const b = c.animate([{ transform: "translateY(0%)" }, { transform: "translateY(-100%)" }], { duration: 700, easing: EASE, fill: "forwards" });
      b.onfinish = () => { busy.current = false; c.style.visibility = "hidden"; b.cancel(); o.a.cancel(); };
    }, 140);
  }, []);

  // The new route has rendered under the curtain: reset scroll, re-collect, then reveal it.
  useEffect(() => {
    if (outgoing.current && outgoing.current.target === pathname) lift();
  }, [pathname, lift]);

  const navigate = useCallback((href: string, label: string) => {
    setMenu(false);
    if (href === pathname) { rt.current?.scrollTop(); return; }
    const c = curtainRef.current;
    if (busy.current || !c) return;
    busy.current = true;
    setNextLabel(label);
    c.style.visibility = "visible";
    const a = c.animate([{ transform: "translateY(100%)" }, { transform: "translateY(0%)" }], { duration: 600, easing: EASE, fill: "forwards" });
    a.onfinish = () => {
      // If the route never resolves (network error), don't leave the curtain down.
      const fallback = setTimeout(() => { if (outgoing.current) lift(); }, 8000);
      outgoing.current = { a, target: href, fallback };
      router.push(href, { scroll: false });
    };
  }, [pathname, router, lift]);

  const go = useMemo(() => {
    const g: Go = {};
    [...PAGES, "admin"].forEach(p => {
      g[p] = (e?: MouseEvent) => {
        if (e && (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1)) return; // let new-tab clicks through
        e?.preventDefault();
        setPendingTool(null);
        if (p === "admin") { router.push("/admin"); return; }
        navigate(pathOf(p), LABELS[p]);
      };
    });
    return g;
  }, [navigate, router]);

  const openProject = useCallback((i: number) => (e?: MouseEvent) => {
    if (e && (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1)) return;
    e?.preventDefault();
    navigate("/work/" + slug(PROJECTS[i].name), PROJECTS[i].name);
  }, [navigate]);

  const openTool = useCallback((id: string) => (e?: MouseEvent) => {
    e?.preventDefault();
    setPendingTool(id);
    if (pathname === "/tools") rt.current?.scrollTop();
    else navigate("/tools", LABELS.tools);
  }, [navigate, pathname]);

  const ctx: Ctx = {
    go, navigate, openProject, openTool, cur, setCur, pendingTool, mobile, narrow,
    scrollTop: () => rt.current?.scrollTop(),
  };

  const navPage = pathname.startsWith("/work") ? "work" : pathname === "/" ? "home" : pathname.slice(1);
  const navLinks = PAGES.map((p, i) => ({
    num: String(i + 1).padStart(2, "0"),
    panelFg: navPage === p ? "#B86CF9" : "#F3EEE4",
    label: LABELS[p], href: pathOf(p), go: go[p],
    bg: navPage === p ? "#1F1712" : "transparent", fg: navPage === p ? "#F3EEE4" : "#1F1712",
  }));
  const chromeV = {
    go, navLinks, desktop: !mobile, mobile,
    contactEmail: CONTACT.email, contactPhone: CONTACT.phone,
    toggleMenu: () => setMenu(m => !m), closeMenu: () => setMenu(false),
    panelT: menu ? "none" : "scale(.2)", panelOp: menu ? "1" : "0", panelBackOp: menu ? "1" : "0", panelPE: menu ? "auto" : "none",
    services: SERVICES,
  };

  return (
    <SiteCtx.Provider value={ctx}>
      <div ref={rootRef} style={S("font-family:Inter,sans-serif;background:#F3EEE4;color:#1F1712;min-height:100vh;overflow-x:clip;")}>
        <div data-progress="1" style={S("position:fixed;left:0;top:0;height:3px;width:100%;background:#B86CF9;transform-origin:0 50%;transform:scaleX(0);z-index:60;")}></div>
        <div ref={curtainRef} style={S("position:fixed;inset:0;z-index:90;background:#1F1712;transform:translateY(100%);visibility:hidden;display:flex;align-items:center;justify-content:center;pointer-events:none;")}>
          <div style={S("display:flex;align-items:center;gap:20px;")}>
            <img src="/assets/logo.png" alt="" style={S("width:clamp(48px,6vw,80px);height:auto;")} />
            <div style={S("color:#F3EEE4;font-size:clamp(40px,7vw,96px);font-weight:800;letter-spacing:-0.062em;color:#F3EEE4;")}>{nextLabel}</div>
          </div>
        </div>
        <HeaderView v={chromeV} />
        {children}
        <FooterView v={chromeV} />
      </div>
    </SiteCtx.Provider>
  );
}
