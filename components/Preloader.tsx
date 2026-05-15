"use client";
import { useEffect, useRef, useState } from "react";

export default function Preloader() {
  const ref = useRef<HTMLDivElement>(null);
  const [unmounted, setUnmounted] = useState(false);

  useEffect(() => {
    document.body.classList.add("loading");
    const timer = setTimeout(() => {
      ref.current?.classList.add("gone");
      document.body.classList.remove("loading");
      setTimeout(() => setUnmounted(true), 900);
    }, 2400);
    return () => clearTimeout(timer);
  }, []);

  if (unmounted) return null;

  return (
    <div id="preloader" ref={ref} aria-hidden="true">
      {/* noise layer */}
      <div className="pre-noise" />

      <div className="pre-inner">
        {/* Logo — identical to navbar: mark + wordmark */}
        <div className="pre-logo-wrap">
          <div className="pre-logo-row">
            <img src="/assets/logo-mark.svg" className="pre-mark" alt="" />
            <div className="pre-wordmark">
              <span className="pre-name">Foxmen <em>Studio</em></span>
              <span className="pre-tagline">Code · Craft · Care</span>
            </div>
          </div>
        </div>

        {/* thin fill bar */}
        <div className="pre-bar">
          <i />
        </div>
      </div>
    </div>
  );
}
