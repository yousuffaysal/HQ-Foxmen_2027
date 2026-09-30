import "server-only";
import { GROQ_MODEL } from "@/lib/ai";
import { AI_TOOLS } from "./data";

// Tool prompts from the design, kept server-side so clients can only pick a tool id,
// never supply their own instructions.
type V = Record<string, string>;
const PROMPTS: Record<string, (v: V) => string> = {
  copy: v => `Write website copy for this business: ${v.biz}. Customers: ${v.aud}. Give a hero headline, a one-sentence subheadline, three short sections with titles, and a call to action.`,
  seo: v => `Create SEO metadata for: ${v.page}. Keywords: ${v.kw}. Give 3 page title options (under 60 characters), 3 meta descriptions (under 155 characters) and 8 related keywords.`,
  prod: v => `Write a product description for "${v.p}". Details: ${v.d}. Give a short English description (60 words), 4 bullet points, then the same description in Bangla.`,
  name: v => `Suggest 12 business names for: ${v.what}. Style: ${v.style}. For each give the name and a one-line reason.`,
  faq: v => `Based on this business information, write 10 FAQ questions customers would ask and short, friendly answers: ${v.info}`,
  tr: v => `Detect the language of this text. If it is Bangla, translate it into natural English. If it is English, translate it into natural Bangla. Only return the translation.\n\n${v.t}`,
  social: v => `Write 3 social media posts for ${v.plat} about: ${v.topic}. Keep them short, friendly and include a call to action and 3 hashtags each.`,
  reply: v => `Write a reply to this customer message. Tone: ${v.tone}. Keep it short and helpful. Message: ${v.msg}`,
  brief: v => `Turn this idea into a clear project brief for a web agency: ${v.idea}. Include goal, target users, must-have pages or features, nice-to-have features, and questions to answer before starting.`,
  ads: v => `Write 10 short ad headlines (under 40 characters) and 5 ad descriptions (under 90 characters) for: ${v.offer}`,
  audit: v => `A business describes its homepage: ${v.home}. Goal: ${v.goal}. Give a short checkup: what works, what to fix first, and 5 practical improvements ranked by impact.`,
};

export const SYSTEM = 'You help small business owners. Write in simple, clear English that anyone can understand (use Bangla only when asked). Never use em dashes. Use plain text: short headings on their own line and bullet points starting with "- ". Do not use markdown symbols like ** or #.';

export const MAX_INPUT = 4000;

// Mirrors the design's runChat(): one free-text box covering all of the tool's fields.
export function buildToolPrompt(id: string, text: string, len: number): string | null {
  const t = AI_TOOLS.find(x => x.id === id);
  const prompt = PROMPTS[id];
  if (!t || !prompt) return null;
  const fill = Object.fromEntries((t.fields || []).map(f => [f.k, "(see the user input above)"]));
  const lenLine = ["Keep the answer short and to the point.", "", "Give a detailed, thorough answer."][len] ?? "";
  return 'You are the "' + t.name + '" tool. ' + t.desc + "\nThe user wrote (it may cover: " + (t.fields || []).map(f => f.label).join("; ") + "):\n\n" + text + "\n\nTask: " + prompt(fill) + " " + lenLine;
}

// Product pages send one value per field: the prompt gets the real values instead of the
// free-text box plus a "(see above)" placeholder, which is shorter and more precise.
export function buildFieldsPrompt(id: string, raw: Record<string, unknown>, len: number): { prompt: string; input: string } | null {
  const t = AI_TOOLS.find(x => x.id === id);
  const prompt = PROMPTS[id];
  if (!t || !prompt || !t.fields) return null;
  const v: Record<string, string> = {};
  for (const f of t.fields) {
    const val = typeof raw[f.k] === "string" ? (raw[f.k] as string).trim().slice(0, f.long ? 2500 : 300) : "";
    v[f.k] = val || "(not specified)";
  }
  if (t.fields.every(f => v[f.k] === "(not specified)")) return null;
  const lenLine = ["Keep the answer short and to the point.", "", "Give a detailed, thorough answer."][len] ?? "";
  return { prompt: (prompt(v) + " " + lenLine).trim(), input: t.fields.map(f => v[f.k]).join(" | ") };
}

// Cheaper, faster model for simple tools; the large one where reasoning quality matters.
export const FAST_MODEL = process.env.GROQ_MODEL_FAST || "openai/gpt-oss-20b";
export const modelFor = (id: string) => (AI_TOOLS.find(t => t.id === id)?.tier === "fast" ? FAST_MODEL : GROQ_MODEL);

// Output budget per length setting (includes the model's short reasoning pass).
export const maxTokensFor = (len: number) => [700, 1200, 2000][len] ?? 1200;

export const cleanOutput = (s: string) => s.replace(/\s*—\s*/g, ", ").replace(/\*\*/g, "").replace(/^#+\s*/gm, "");
