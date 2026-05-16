import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

/* Run all column migrations once per process lifetime (not on every request) */
let migrated = false;
async function ensureMigrated() {
  if (migrated) return;
  await Promise.all([
    sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS tagline TEXT DEFAULT ''`,
    sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS overview TEXT DEFAULT ''`,
    sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS challenge TEXT DEFAULT ''`,
    sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS solution TEXT DEFAULT ''`,
    sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS results TEXT DEFAULT ''`,
    sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS tech_stack TEXT DEFAULT ''`,
    sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS timeline_duration TEXT DEFAULT ''`,
    sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS client_name TEXT DEFAULT ''`,
    sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS live_url TEXT DEFAULT ''`,
    sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS github_url TEXT DEFAULT ''`,
    sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS hero_image TEXT DEFAULT ''`,
    sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS thumbnail TEXT DEFAULT ''`,
    sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS gallery TEXT DEFAULT '[]'`,
    sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS video_url TEXT DEFAULT ''`,
    sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS challenge_img1 TEXT DEFAULT ''`,
    sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS challenge_img2 TEXT DEFAULT ''`,
    sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS solution_img1 TEXT DEFAULT ''`,
    sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS solution_img2 TEXT DEFAULT ''`,
    sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS split1_label TEXT DEFAULT 'Challenge'`,
    sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS split2_label TEXT DEFAULT 'Solution'`,
    sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS slug TEXT DEFAULT ''`,
    sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS challenge_img1_label TEXT DEFAULT ''`,
    sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS challenge_img2_label TEXT DEFAULT ''`,
    sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS solution_img1_label TEXT DEFAULT ''`,
    sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS solution_img2_label TEXT DEFAULT ''`,
    sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS challenge_img1_orient TEXT DEFAULT 'portrait'`,
    sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS challenge_img2_orient TEXT DEFAULT 'portrait'`,
    sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS solution_img1_orient TEXT DEFAULT 'portrait'`,
    sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS solution_img2_orient TEXT DEFAULT 'portrait'`,
    sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS client_quote TEXT DEFAULT ''`,
    sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS client_quote_author TEXT DEFAULT ''`,
    sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS client_quote_role TEXT DEFAULT ''`,
  ]);
  migrated = true;
}

export async function GET() {
  await ensureMigrated();
  const rows = await sql`SELECT * FROM projects ORDER BY id DESC`;
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  await ensureMigrated();
  const {
    monogram, color_cls, name, industry, year, scope, status,
    tagline, overview, challenge, solution, results,
    tech_stack, timeline_duration, client_name,
    live_url, hero_image, thumbnail,
    gallery, video_url, challenge_img1, challenge_img2, solution_img1, solution_img2,
    split1_label, split2_label, slug,
    challenge_img1_label, challenge_img2_label, solution_img1_label, solution_img2_label,
    challenge_img1_orient, challenge_img2_orient, solution_img1_orient, solution_img2_orient,
    client_quote, client_quote_author, client_quote_role,
  } = await req.json();
  const rows = await sql`
    INSERT INTO projects (
      monogram, color_cls, name, industry, year, scope, status,
      tagline, overview, challenge, solution, results,
      tech_stack, timeline_duration, client_name,
      live_url, hero_image, thumbnail,
      gallery, video_url, challenge_img1, challenge_img2, solution_img1, solution_img2,
      split1_label, split2_label, slug,
      challenge_img1_label, challenge_img2_label, solution_img1_label, solution_img2_label,
      challenge_img1_orient, challenge_img2_orient, solution_img1_orient, solution_img2_orient,
      client_quote, client_quote_author, client_quote_role
    )
    VALUES (
      ${monogram ?? ""}, ${color_cls ?? ""}, ${name}, ${industry ?? ""}, ${year ?? ""}, ${scope ?? ""}, ${status ?? "draft"},
      ${tagline ?? ""}, ${overview ?? ""}, ${challenge ?? ""}, ${solution ?? ""}, ${results ?? ""},
      ${tech_stack ?? ""}, ${timeline_duration ?? ""}, ${client_name ?? ""},
      ${live_url ?? ""}, ${hero_image ?? ""}, ${thumbnail ?? ""},
      ${gallery ?? "[]"}, ${video_url ?? ""}, ${challenge_img1 ?? ""}, ${challenge_img2 ?? ""}, ${solution_img1 ?? ""}, ${solution_img2 ?? ""},
      ${split1_label ?? "Challenge"}, ${split2_label ?? "Solution"}, ${slug ?? ""},
      ${challenge_img1_label ?? ""}, ${challenge_img2_label ?? ""}, ${solution_img1_label ?? ""}, ${solution_img2_label ?? ""},
      ${challenge_img1_orient ?? "portrait"}, ${challenge_img2_orient ?? "portrait"}, ${solution_img1_orient ?? "portrait"}, ${solution_img2_orient ?? "portrait"},
      ${client_quote ?? ""}, ${client_quote_author ?? ""}, ${client_quote_role ?? ""}
    )
    RETURNING *
  `;
  return NextResponse.json(rows[0], { status: 201 });
}
