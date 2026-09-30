"use client";
import { useCallback, useRef, useState } from "react";

const FAIL = "Sorry, the tool could not respond right now. Please try again in a minute.";
const clean = (s: string) => s.replace(/\s*—\s*/g, ", ").replace(/\*\*/g, "").replace(/^#+\s*/gm, "");

// Calls /api/site/ai and streams the answer in as it is written.
// `waiting` = request sent, no text yet (show the loader); `streaming` = text arriving.
export function useToolRun() {
  const [out, setOut] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [cached, setCached] = useState(false);
  const abort = useRef<AbortController | null>(null);

  const run = useCallback(async (body: Record<string, unknown>) => {
    abort.current?.abort();
    const ac = (abort.current = new AbortController());
    setOut(""); setCached(false); setWaiting(true); setStreaming(false);
    try {
      const r = await fetch("/api/site/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), signal: ac.signal });
      if (!r.ok || !r.body || (r.headers.get("content-type") || "").includes("application/json")) {
        const d = await r.json().catch(() => ({}));
        setOut(String(d.error || FAIL));
        return;
      }
      setCached(r.headers.get("x-cache") === "hit");
      const reader = r.body.getReader(), dec = new TextDecoder();
      let text = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        text += dec.decode(value, { stream: true });
        if (text) { setWaiting(false); setStreaming(true); setOut(clean(text)); }
      }
      if (!text) setOut(FAIL);
    } catch (e) {
      if ((e as Error).name !== "AbortError") setOut(FAIL);
    } finally {
      if (abort.current === ac) { setWaiting(false); setStreaming(false); }
    }
  }, []);

  const reset = useCallback(() => { abort.current?.abort(); setOut(""); setWaiting(false); setStreaming(false); }, []);
  return { out, waiting, streaming, busy: waiting || streaming, cached, run, reset };
}
