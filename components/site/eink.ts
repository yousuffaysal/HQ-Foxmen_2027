// E-ink display mode: pure black on white, no motion, no smooth scroll.
// On when the browser reports a monochrome screen (Kindle, Boox, reMarkable), or when chosen
// with the footer switch / ?eink=1 (?eink=0 turns it off). The choice is remembered per browser.
// The class is set before first paint by EINK_INIT_SCRIPT; the styles live in app/(site)/site.css.
const KEY = "fx-eink";
export const EINK_CLASS = "fx-eink";

export const EINK_INIT_SCRIPT = `(function(){try{var k="${KEY}",q=new URLSearchParams(location.search).get("eink");if(q==="1"||q==="0")localStorage.setItem(k,q);var s=localStorage.getItem(k);var on=s?s==="1":matchMedia("(monochrome)").matches;if(on)document.documentElement.classList.add("${EINK_CLASS}")}catch(e){}})()`;

export const isEink = () => typeof document !== "undefined" && document.documentElement.classList.contains(EINK_CLASS);

// The motion runtime starts once per page load, so switching modes reloads the page.
export function setEink(on: boolean) {
  try { localStorage.setItem(KEY, on ? "1" : "0"); } catch {}
  const u = new URL(location.href);
  u.searchParams.delete("eink");
  location.replace(u);
}
