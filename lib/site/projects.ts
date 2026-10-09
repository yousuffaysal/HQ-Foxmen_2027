import "server-only";
import { unstable_cache } from "next/cache";
import { sql } from "@/lib/db";
import { PROJECT_TAGS, SEED_PROJECTS, slug as toSlug, type SiteProject } from "./data";
import { str } from "./sanitize";

// Admin-editable portfolio (site_projects). Seeded from the design's project list on first use;
// the old "site_hidden_projects" setting carries over as the visible flag.

type Row = {
  id: number; slug: string; name: string; type: string; url: string; tags: string; description: string;
  features: string; latest: boolean; visible: boolean; ord: number; hero_image: string; image_a: string; image_b: string;
  gallery: string;
};

const parse = (s: string): string[] => { try { const v = JSON.parse(s); return Array.isArray(v) ? v.map(String) : []; } catch { return []; } };

const fromRow = (r: Row): SiteProject => ({
  id: r.id, slug: r.slug, name: r.name, type: r.type, url: r.url, tags: parse(r.tags), desc: r.description,
  features: parse(r.features), latest: r.latest, visible: r.visible, ord: r.ord,
  heroImage: r.hero_image, imageA: r.image_a, imageB: r.image_b, gallery: parse(r.gallery ?? "[]"),
});

let ready: Promise<void> | null = null;
function ensure() {
  ready ??= (async () => {
    await sql`
      CREATE TABLE IF NOT EXISTS site_projects (
        id          SERIAL PRIMARY KEY,
        slug        TEXT        NOT NULL UNIQUE,
        name        TEXT        NOT NULL,
        type        TEXT        NOT NULL DEFAULT '',
        url         TEXT        NOT NULL DEFAULT '',
        tags        TEXT        NOT NULL DEFAULT '[]',
        description TEXT        NOT NULL DEFAULT '',
        features    TEXT        NOT NULL DEFAULT '[]',
        latest      BOOLEAN     NOT NULL DEFAULT false,
        visible     BOOLEAN     NOT NULL DEFAULT true,
        ord         INTEGER     NOT NULL DEFAULT 0,
        hero_image  TEXT        NOT NULL DEFAULT '',
        image_a     TEXT        NOT NULL DEFAULT '',
        image_b     TEXT        NOT NULL DEFAULT '',
        updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;
    await sql`ALTER TABLE site_projects ADD COLUMN IF NOT EXISTS gallery TEXT NOT NULL DEFAULT '[]'`;
    const n = (await sql`SELECT count(*)::int AS n FROM site_projects` as { n: number }[])[0].n;
    if (n > 0) { await refreshSeedContent(); await fixRedleafLinks(); return; }
    let hidden: string[] = [];
    try {
      const h = await sql`SELECT value FROM settings WHERE key = 'site_hidden_projects'` as { value: string }[];
      hidden = h[0] ? parse(h[0].value) : [];
    } catch { /* settings table missing: nothing hidden */ }
    for (const p of SEED_PROJECTS) {
      await sql`
        INSERT INTO site_projects (slug, name, type, url, tags, description, features, latest, visible, ord, hero_image, image_a, image_b, gallery)
        VALUES (${p.slug}, ${p.name}, ${p.type}, ${p.url}, ${JSON.stringify(p.tags)}, ${p.desc}, ${JSON.stringify(p.features)},
                ${!!p.latest}, ${p.visible && !hidden.includes(p.slug)}, ${p.ord}, ${p.heroImage}, ${p.imageA}, ${p.imageB}, ${JSON.stringify(p.gallery)})
        ON CONFLICT (slug) DO NOTHING`;
    }
  })().catch(e => { ready = null; throw e; });
  return ready;
}

// One-time refresh (2026-10): detailed copy and the bundled 16:10 screenshots, applied only to
// rows nobody has edited in the admin since the first seed, so admin changes are never overwritten.
const REFRESH_KEY = "site_projects_content_v2";
async function refreshSeedContent() {
  try {
    if ((await sql`SELECT 1 FROM settings WHERE key = ${REFRESH_KEY}` as unknown[]).length) return;
  } catch { return; } // settings table missing: nothing to mark progress with, so leave the rows alone
  for (const p of SEED_PROJECTS) {
    await sql`
      UPDATE site_projects SET type = ${p.type}, tags = ${JSON.stringify(p.tags)}, description = ${p.desc},
        features = ${JSON.stringify(p.features)}, hero_image = ${p.heroImage}, image_a = ${p.imageA}, image_b = ${p.imageB},
        gallery = ${JSON.stringify(p.gallery)}, visible = visible AND ${p.visible}, updated_at = now()
      WHERE slug = ${p.slug} AND updated_at < '2026-10-01'`;
  }
  await sql`INSERT INTO settings (key, value) VALUES (${REFRESH_KEY}, '1') ON CONFLICT (key) DO NOTHING`;
}

// One-time fix (2026-10): the Redleaf fashion store lives at ecom-x-frontend.vercel.app, and
// redleaf-bd.com is the separate Redleaf BD food store. Each row is only touched while it still
// has the old wrong address, so admin edits survive.
const REDLEAF_KEY = "site_projects_redleaf_v3";
async function fixRedleafLinks() {
  try {
    if ((await sql`SELECT 1 FROM settings WHERE key = ${REDLEAF_KEY}` as unknown[]).length) return;
  } catch { return; }
  const stale: Record<string, string> = { redleaf: "redleaf-bd.com", "redleaf-bd": "redleafbd.com" };
  for (const p of SEED_PROJECTS.filter(p => p.slug in stale)) {
    await sql`
      UPDATE site_projects SET type = ${p.type}, url = ${p.url}, tags = ${JSON.stringify(p.tags)}, description = ${p.desc},
        features = ${JSON.stringify(p.features)}, hero_image = ${p.heroImage}, image_a = ${p.imageA}, image_b = ${p.imageB},
        gallery = ${JSON.stringify(p.gallery)}, visible = ${p.visible}, updated_at = now()
      WHERE slug = ${p.slug} AND url = ${stale[p.slug]}`;
  }
  await sql`INSERT INTO settings (key, value) VALUES (${REDLEAF_KEY}, '1') ON CONFLICT (key) DO NOTHING`;
}

export const PROJECTS_TAG = "site-projects";

// Public reads are cached under PROJECTS_TAG; admin writes expire the tag so edits show up
// on the very next request (see app/api/site/admin/projects). The admin reads uncached.
const cachedVisible = unstable_cache(() => readProjects(false), ["site-projects-visible"], { tags: [PROJECTS_TAG], revalidate: 300 });

export async function listProjects({ includeHidden = false } = {}): Promise<SiteProject[]> {
  return includeHidden ? readProjects(true) : cachedVisible();
}

async function readProjects(includeHidden: boolean): Promise<SiteProject[]> {
  try {
    await ensure();
    const rows = (includeHidden
      ? await sql`SELECT * FROM site_projects ORDER BY ord ASC, id ASC`
      : await sql`SELECT * FROM site_projects WHERE visible ORDER BY ord ASC, id ASC`) as Row[];
    return rows.map(fromRow);
  } catch (e) {
    console.error("[projects] falling back to built-in list", e);
    return includeHidden ? SEED_PROJECTS : SEED_PROJECTS.filter(p => p.visible);
  }
}

export async function getProject(slug: string): Promise<SiteProject | null> {
  return (await listProjects()).find(p => p.slug === slug) ?? null;
}

/* ── Admin writes ──────────────────────────────────────────────── */

const cleanUrl = (v: unknown, max = 500) => {
  const s = str(v, max);
  if (!s) return "";
  // Screenshots must be https URLs or bundled files under /projects/; site addresses are stored without the scheme.
  return /^https:\/\/[^\s"'<>]+$/.test(s) || /^\/projects\/[\w./-]+$/.test(s) ? s : "";
};
const siteUrl = (v: unknown) => str(v, 200).replace(/^https?:\/\//, "").replace(/\/+$/, "").replace(/[\s"'<>]/g, "");
const list = (v: unknown, max: number, each: number) =>
  (Array.isArray(v) ? v : []).map(x => str(x, each)).filter(Boolean).slice(0, max);

export type ProjectInput = Record<string, unknown>;

// Validates admin input; returns an error message or the cleaned fields.
export function cleanProject(b: ProjectInput): { error: string } | { value: Omit<SiteProject, "id" | "ord"> } {
  const name = str(b.name, 80);
  if (!name) return { error: "Project name is required." };
  const slug = toSlug(str(b.slug, 80) || name).slice(0, 80);
  if (!slug) return { error: "Slug must contain letters or numbers." };
  return {
    value: {
      name, slug,
      type: str(b.type, 120),
      url: siteUrl(b.url),
      tags: list(b.tags, 6, 40).filter(t => PROJECT_TAGS.includes(t)),
      desc: str(b.desc, 600),
      features: list(b.features, 12, 240),
      latest: b.latest === true,
      visible: b.visible !== false,
      heroImage: cleanUrl(b.heroImage), imageA: cleanUrl(b.imageA), imageB: cleanUrl(b.imageB),
      gallery: (Array.isArray(b.gallery) ? b.gallery : []).map(x => cleanUrl(x)).filter(Boolean).slice(0, 12),
    },
  };
}

export async function createProject(p: Omit<SiteProject, "id" | "ord">) {
  await ensure();
  const rows = await sql`
    INSERT INTO site_projects (slug, name, type, url, tags, description, features, latest, visible, hero_image, image_a, image_b, gallery, ord)
    VALUES (${p.slug}, ${p.name}, ${p.type}, ${p.url}, ${JSON.stringify(p.tags)}, ${p.desc}, ${JSON.stringify(p.features)},
            ${p.latest}, ${p.visible}, ${p.heroImage}, ${p.imageA}, ${p.imageB}, ${JSON.stringify(p.gallery)},
            (SELECT COALESCE(MAX(ord), -1) + 1 FROM site_projects))
    ON CONFLICT (slug) DO NOTHING
    RETURNING *` as Row[];
  if (rows[0] && p.latest) await sql`UPDATE site_projects SET latest = false WHERE id <> ${rows[0].id}`;
  return rows[0] ? fromRow(rows[0]) : null;
}

export async function updateProject(id: number, p: Omit<SiteProject, "id" | "ord">) {
  await ensure();
  const clash = await sql`SELECT 1 FROM site_projects WHERE slug = ${p.slug} AND id <> ${id}` as unknown[];
  if (clash.length) return "slug-taken" as const;
  const rows = await sql`
    UPDATE site_projects SET slug = ${p.slug}, name = ${p.name}, type = ${p.type}, url = ${p.url},
      tags = ${JSON.stringify(p.tags)}, description = ${p.desc}, features = ${JSON.stringify(p.features)},
      latest = ${p.latest}, visible = ${p.visible}, hero_image = ${p.heroImage}, image_a = ${p.imageA}, image_b = ${p.imageB},
      gallery = ${JSON.stringify(p.gallery)}, updated_at = now()
    WHERE id = ${id} RETURNING *` as Row[];
  if (rows[0] && p.latest) await sql`UPDATE site_projects SET latest = false WHERE id <> ${id}`;
  return rows[0] ? fromRow(rows[0]) : null;
}

export async function setProjectVisible(id: number, visible: boolean) {
  await ensure();
  return (await sql`UPDATE site_projects SET visible = ${visible}, updated_at = now() WHERE id = ${id} RETURNING id` as unknown[]).length > 0;
}

export async function deleteProject(id: number) {
  await ensure();
  return (await sql`DELETE FROM site_projects WHERE id = ${id} RETURNING id` as unknown[]).length > 0;
}

// Persists a full ordering (list of ids, first = shown first).
export async function reorderProjects(ids: number[]) {
  await ensure();
  for (let i = 0; i < ids.length; i++) await sql`UPDATE site_projects SET ord = ${i} WHERE id = ${ids[i]}`;
}
