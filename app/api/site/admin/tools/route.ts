import { NextResponse, after } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/require-admin";
import { AI_TOOLS } from "@/lib/site/data";
import { TOOLS_TAG, getToolSettings, saveToolSettings } from "@/lib/site/tools-store";
import { sameOrigin, str } from "@/lib/site/sanitize";

export const runtime = "nodejs";

export async function GET() {
  const deny = await requireAdmin(); if (deny) return deny;
  return NextResponse.json(await getToolSettings({ live: true }));
}

const price = (v: unknown): number | null | "bad" => {
  if (v === null || v === undefined || v === "") return null;
  const n = typeof v === "number" ? v : Number(String(v).replace(/,/g, ""));
  return Number.isFinite(n) && n >= 0 && n < 1e9 ? Math.round(n * 100) / 100 : "bad";
};

// Saves one tool's price and on/off switch, then refreshes the public tool pages.
export async function PUT(req: Request) {
  const deny = await requireAdmin(); if (deny) return deny;
  if (!sameOrigin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const b = await req.json().catch(() => ({}));
  const t = AI_TOOLS.find(x => x.id === b.id);
  if (!t) return NextResponse.json({ error: "Unknown tool" }, { status: 400 });
  const usd = price(b.priceUsd), bdt = price(b.priceBdt);
  if (usd === "bad" || bdt === "bad") return NextResponse.json({ error: "Prices must be positive numbers (or empty for Free)." }, { status: 400 });
  await saveToolSettings({ id: t.id, enabled: b.enabled !== false, priceUsd: usd, priceBdt: bdt, priceNote: str(b.priceNote, 60) });
  revalidateTag(TOOLS_TAG, { expire: 0 });
  revalidatePath("/tools", "layout");
  const origin = new URL(req.url).origin;
  after(async () => { await Promise.allSettled(["/tools", `/tools/${t.slug}`].map(p => fetch(origin + p, { cache: "no-store" }))); });
  return NextResponse.json((await getToolSettings({ live: true })).find(s => s.id === t.id));
}
