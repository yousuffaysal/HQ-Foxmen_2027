import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/require-admin";
import { setHiddenProjects } from "@/lib/site/store";
import { sameOrigin } from "@/lib/site/sanitize";

export const runtime = "nodejs";

// Replaces the set of project slugs hidden from the Work page.
export async function PUT(req: Request) {
  const deny = await requireAdmin(); if (deny) return deny;
  if (!sameOrigin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { hidden } = await req.json().catch(() => ({}));
  if (!Array.isArray(hidden) || hidden.some(s => typeof s !== "string")) {
    return NextResponse.json({ error: "hidden must be a list of project slugs" }, { status: 400 });
  }
  const saved = await setHiddenProjects(hidden);
  revalidatePath("/work");
  return NextResponse.json({ hidden: saved });
}
