// Splits plain-text AI output into titled blocks with paragraphs and bullet lists (the design's outBlocks).
export function outBlocks(text: string) {
  type Sec = { title: string; paras: string[]; items: string[] };
  const secs: Sec[] = []; let cur: Sec | null = null;
  const push = () => { if (cur && (cur.title || cur.paras.length || cur.items.length)) secs.push(cur); };
  String(text || "").split("\n").map(l => l.trim()).filter(Boolean).forEach(l => {
    const b = l.match(/^([-*•]|\d+[.)])\s+(.*)/);
    if (b) { if (!cur) cur = { title: "", paras: [], items: [] }; cur.items.push(b[2]); }
    else if (l.length < 70 && !/[.!?]$/.test(l)) { push(); cur = { title: l.replace(/:$/, ""), paras: [], items: [] }; }
    else { if (!cur || cur.items.length) { push(); cur = { title: "", paras: [], items: [] }; } cur.paras.push(l); }
  });
  push();
  return secs.map((c, i) => { const hi = i === 0 && secs.length > 1; return { ...c, n: String(i + 1).padStart(2, "0"), hasTitle: !!c.title, hasList: c.items.length > 0, bg: hi ? "#1F1712" : "#F3EEE4", fg: hi ? "#F3EEE4" : "#1F1712", nc: hi ? "#B86CF9" : "#8F8278", dot: "#B86CF9" }; });
}
