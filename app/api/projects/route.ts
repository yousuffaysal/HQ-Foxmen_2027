import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  // Add new case study columns if they don't exist yet (Neon / PostgreSQL 15)
  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS tagline TEXT DEFAULT ''`;
  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS overview TEXT DEFAULT ''`;
  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS challenge TEXT DEFAULT ''`;
  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS solution TEXT DEFAULT ''`;
  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS results TEXT DEFAULT ''`;
  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS tech_stack TEXT DEFAULT ''`;
  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS timeline_duration TEXT DEFAULT ''`;
  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS client_name TEXT DEFAULT ''`;
  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS live_url TEXT DEFAULT ''`;
  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS github_url TEXT DEFAULT ''`;
  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS hero_image TEXT DEFAULT ''`;
  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS thumbnail TEXT DEFAULT ''`;
  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS gallery TEXT DEFAULT '[]'`;
  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS video_url TEXT DEFAULT ''`;
  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS challenge_img1 TEXT DEFAULT ''`;
  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS challenge_img2 TEXT DEFAULT ''`;
  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS solution_img1 TEXT DEFAULT ''`;
  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS solution_img2 TEXT DEFAULT ''`;

  const rows = await sql`SELECT * FROM projects ORDER BY updated_at DESC`;
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const {
    monogram, color_cls, name, industry, year, scope, status,
    tagline, overview, challenge, solution, results,
    tech_stack, timeline_duration, client_name,
    live_url, github_url, hero_image, thumbnail,
    gallery, video_url, challenge_img1, challenge_img2, solution_img1, solution_img2,
  } = await req.json();
  const rows = await sql`
    INSERT INTO projects (
      monogram, color_cls, name, industry, year, scope, status,
      tagline, overview, challenge, solution, results,
      tech_stack, timeline_duration, client_name,
      live_url, github_url, hero_image, thumbnail,
      gallery, video_url, challenge_img1, challenge_img2, solution_img1, solution_img2
    )
    VALUES (
      ${monogram ?? ""}, ${color_cls ?? ""}, ${name}, ${industry ?? ""}, ${year ?? ""}, ${scope ?? ""}, ${status ?? "draft"},
      ${tagline ?? ""}, ${overview ?? ""}, ${challenge ?? ""}, ${solution ?? ""}, ${results ?? ""},
      ${tech_stack ?? ""}, ${timeline_duration ?? ""}, ${client_name ?? ""},
      ${live_url ?? ""}, ${github_url ?? ""}, ${hero_image ?? ""}, ${thumbnail ?? ""},
      ${gallery ?? "[]"}, ${video_url ?? ""}, ${challenge_img1 ?? ""}, ${challenge_img2 ?? ""}, ${solution_img1 ?? ""}, ${solution_img2 ?? ""}
    )
    RETURNING *
  `;
  return NextResponse.json(rows[0], { status: 201 });
}
