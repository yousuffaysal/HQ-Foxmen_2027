import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/require-admin";
import { cleanProject, createProject, deleteProject, listProjects, reorderProjects, setProjectVisible, updateProject } from "@/lib/site/projects";
import { sameOrigin } from "@/lib/site/sanitize";

export const runtime = "nodejs";

async function guard(req: Request) {
  const deny = await requireAdmin(); if (deny) return deny;
  if (req.method !== "GET" && !sameOrigin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return null;
}
// Every public page reads the project list from the layout, so refresh them all.
const refresh = () => revalidatePath("/", "layout");
const body = (req: Request) => req.json().catch(() => ({})) as Promise<Record<string, unknown>>;

export async function GET(req: Request) {
  const g = await guard(req); if (g) return g;
  return NextResponse.json(await listProjects({ includeHidden: true }));
}

export async function POST(req: Request) {
  const g = await guard(req); if (g) return g;
  const c = cleanProject(await body(req));
  if ("error" in c) return NextResponse.json({ error: c.error }, { status: 400 });
  const p = await createProject(c.value);
  if (!p) return NextResponse.json({ error: "A project with this slug already exists." }, { status: 409 });
  refresh();
  return NextResponse.json(p, { status: 201 });
}

export async function PUT(req: Request) {
  const g = await guard(req); if (g) return g;
  const b = await body(req);
  if (!Number.isInteger(b.id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  const c = cleanProject(b);
  if ("error" in c) return NextResponse.json({ error: c.error }, { status: 400 });
  const p = await updateProject(b.id as number, c.value);
  if (p === "slug-taken") return NextResponse.json({ error: "Another project already uses this slug." }, { status: 409 });
  if (!p) return NextResponse.json({ error: "Not found" }, { status: 404 });
  refresh();
  return NextResponse.json(p);
}

// { id, visible } toggles visibility; { order: [ids] } saves a new ordering.
export async function PATCH(req: Request) {
  const g = await guard(req); if (g) return g;
  const b = await body(req);
  if (Array.isArray(b.order)) {
    const ids = b.order.filter((x): x is number => Number.isInteger(x)).slice(0, 500);
    await reorderProjects(ids);
  } else if (Number.isInteger(b.id) && typeof b.visible === "boolean") {
    if (!(await setProjectVisible(b.id as number, b.visible))) return NextResponse.json({ error: "Not found" }, { status: 404 });
  } else {
    return NextResponse.json({ error: "Send { id, visible } or { order }" }, { status: 400 });
  }
  refresh();
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const g = await guard(req); if (g) return g;
  const b = await body(req);
  if (!Number.isInteger(b.id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  if (!(await deleteProject(b.id as number))) return NextResponse.json({ error: "Not found" }, { status: 404 });
  refresh();
  return NextResponse.json({ ok: true });
}
