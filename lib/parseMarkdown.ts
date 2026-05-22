function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function inline(t: string): string {
  return t
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1"/>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    .replace(/`([^`]+)`/g, '<code class="ic">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/__([^_]+)__/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/_([^_]+)_/g, "<em>$1</em>")
    .replace(/~~([^~]+)~~/g, "<del>$1</del>");
}
function blockText(text: string): string {
  const lines = text.split("\n");
  const out: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const hm = line.match(/^(#{1,3})\s+(.+)/);
    if (hm) {
      const hid = hm[2].replace(/[*_`]/g,"").trim().toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
      out.push(`<h${hm[1].length} id="${hid}">${inline(hm[2])}</h${hm[1].length}>`);
      i++; continue;
    }
    if (/^(-{3,}|\*{3,})$/.test(line.trim())) { out.push("<hr/>"); i++; continue; }
    if (line.startsWith("> ")) {
      const ql: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) { ql.push(lines[i].slice(2)); i++; }
      out.push(`<blockquote>${blockText(ql.join("\n"))}</blockquote>`); continue;
    }
    if (/^[-*+]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*+]\s/.test(lines[i])) { items.push(`<li>${inline(lines[i].slice(2))}</li>`); i++; }
      out.push(`<ul>${items.join("")}</ul>`); continue;
    }
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) { items.push(`<li>${inline(lines[i].replace(/^\d+\.\s/, ""))}</li>`); i++; }
      out.push(`<ol>${items.join("")}</ol>`); continue;
    }
    if (!line.trim()) { out.push("<br/>"); i++; continue; }
    const pl: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^#/.test(lines[i]) && !/^[-*+]\s/.test(lines[i]) && !/^\d+\.\s/.test(lines[i]) && !lines[i].startsWith("> ") && !/^(-{3,}|\*{3,})$/.test(lines[i].trim())) {
      pl.push(lines[i]); i++;
    }
    out.push(`<p>${inline(pl.join(" "))}</p>`);
  }
  return out.join("\n");
}
function syntaxHighlight(code: string, lang: string): string {
  let h = esc(code);
  if (["js","ts","jsx","tsx","javascript","typescript"].includes(lang)) {
    h = h.replace(/(\/\/[^\n]*)/g, '<span class="cm">$1</span>');
    h = h.replace(/(&quot;(?:[^&]|&(?!quot;))*&quot;|&#39;[^]*?&#39;)/g, '<span class="cs">$1</span>');
    h = h.replace(/\b(const|let|var|function|return|if|else|for|while|class|import|export|default|async|await|try|catch|throw|new|typeof|null|undefined|true|false|void|type|interface|extends|implements)\b/g, '<span class="ck">$1</span>');
    h = h.replace(/\b(\d+\.?\d*)\b/g, '<span class="cn">$1</span>');
  }
  if (["css","scss"].includes(lang)) {
    h = h.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="cm">$1</span>');
    h = h.replace(/([.#][\w-]+)/g, '<span class="cs">$1</span>');
    h = h.replace(/\b(color|background|margin|padding|font|display|flex|grid|width|height|border|position|top|left|right|bottom|opacity|transform|transition|overflow)\b/g, '<span class="ck">$1</span>');
  }
  if (["html","xml"].includes(lang)) {
    h = h.replace(/(&lt;[^&]*&gt;)/g, '<span class="ct">$1</span>');
    h = h.replace(/(&quot;[^&quot;]*&quot;)/g, '<span class="cs">$1</span>');
  }
  if (["python","py"].includes(lang)) {
    h = h.replace(/(#[^\n]*)/g, '<span class="cm">$1</span>');
    h = h.replace(/(&quot;[^&]*&quot;|&#39;[^]*?&#39;)/g, '<span class="cs">$1</span>');
    h = h.replace(/\b(def|class|import|from|return|if|else|elif|for|while|in|not|and|or|True|False|None|try|except|with|as|lambda|pass|break|continue)\b/g, '<span class="ck">$1</span>');
  }
  if (["sql"].includes(lang)) {
    h = h.replace(/\b(SELECT|FROM|WHERE|JOIN|LEFT|RIGHT|INNER|ON|AND|OR|NOT|IN|IS|NULL|ORDER|BY|GROUP|HAVING|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|DROP|INDEX|LIMIT|OFFSET|AS|DISTINCT|COUNT|SUM|AVG|MAX|MIN)\b/gi, '<span class="ck">$1</span>');
  }
  return h;
}
export function parseMarkdown(raw: string): string {
  const segs: Array<{ code: true; lang: string; content: string } | { code: false; content: string }> = [];
  const re = /```(\w*)\n?([\s\S]*?)```/g;
  let last = 0; let m: RegExpExecArray | null;
  while ((m = re.exec(raw)) !== null) {
    if (m.index > last) segs.push({ code: false, content: raw.slice(last, m.index) });
    segs.push({ code: true, lang: m[1] || "text", content: m[2] });
    last = m.index + m[0].length;
  }
  if (last < raw.length) segs.push({ code: false, content: raw.slice(last) });
  return segs.map(s => {
    if (!s.code) return blockText(s.content);
    const langHl = syntaxHighlight(s.content, s.lang);
    return `<pre class="cb" data-lang="${esc(s.lang)}"><code>${langHl}</code></pre>`;
  }).join("");
}
