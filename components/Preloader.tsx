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
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (unmounted) return null;

  return (
    <div id="preloader" ref={ref} aria-hidden="true">
      <div className="pre-inner">
        <img src="/assets/Logo_v_3-new.png" alt="Foxmen Studio" className="pre-logo" />
        <div className="pre-bar">
          <i />
        </div>
      </div>
    </div>
  );
}
