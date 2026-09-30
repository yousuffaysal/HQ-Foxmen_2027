import { NextResponse, after } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/require-admin";
import { PROJECTS_TAG, cleanProject, createProject, deleteProject, listProjects, reorderProjects, setProjectVisible, updateProject } from "@/lib/site/projects";
import { sameOrigin } from "@/lib/site/sanitize";

export const runtime = "nodejs";

async function guard(req: Request) {
  const deny = await requireAdmin(); if (deny) return deny;
  if (req.method !== "GET" && !sameOrigin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return null;
}
// Every public page carries the project list (via the layout). Invalidate the data and pages, then
// request each page once in the background: that first request absorbs the stale-while-revalidate
// response and triggers the rebuild, so the admin's next look at the site is already fresh.
const PAGES = ["/", "/about", "/services", "/work", "/tools", "/contact"];
function refresh(req: Request, ...slugs: (string | undefined)[]) {
  revalidateTag(PROJECTS_TAG, { expire: 0 });
  revalidatePath("/", "layout");
  const origin = new URL(req.url).origin;
  const paths = [...PAGES, ...slugs.filter(Boolean).map(s => `/work/${s}`)];
  after(async () => {
    await Promise.allSettled(paths.map(p => fetch(origin + p, { cache: "no-store", headers: { "x-foxmen-warm": "1" } })));
  });
}
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
  refresh(req, p.slug);
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
  refresh(req, p.slug, typeof b.oldSlug === "string" ? b.oldSlug : undefined);
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
  refresh(req, typeof b.slug === "string" ? b.slug : undefined);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const g = await guard(req); if (g) return g;
  const b = await body(req);
  if (!Number.isInteger(b.id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  if (!(await deleteProject(b.id as number))) return NextResponse.json({ error: "Not found" }, { status: 404 });
  refresh(req, typeof b.slug === "string" ? b.slug : undefined);
  return NextResponse.json({ ok: true });
}
