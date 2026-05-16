import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const rows = await sql`
    UPDATE projects SET
      monogram          = COALESCE(${body.monogram},          monogram),
      color_cls         = COALESCE(${body.color_cls},         color_cls),
      name              = COALESCE(${body.name},              name),
      industry          = COALESCE(${body.industry},          industry),
      year              = COALESCE(${body.year},              year),
      scope             = COALESCE(${body.scope},             scope),
      status            = COALESCE(${body.status},            status),
      tagline           = COALESCE(${body.tagline},           tagline),
      overview          = COALESCE(${body.overview},          overview),
      challenge         = COALESCE(${body.challenge},         challenge),
      solution          = COALESCE(${body.solution},          solution),
      results           = COALESCE(${body.results},           results),
      tech_stack        = COALESCE(${body.tech_stack},        tech_stack),
      timeline_duration = COALESCE(${body.timeline_duration}, timeline_duration),
      client_name       = COALESCE(${body.client_name},       client_name),
      live_url          = COALESCE(${body.live_url},          live_url),
      github_url        = COALESCE(${body.github_url},        github_url),
      hero_image        = COALESCE(${body.hero_image},        hero_image),
      thumbnail         = COALESCE(${body.thumbnail},         thumbnail),
      gallery           = COALESCE(${body.gallery},           gallery),
      video_url         = COALESCE(${body.video_url},         video_url),
      challenge_img1    = COALESCE(${body.challenge_img1},    challenge_img1),
      challenge_img2    = COALESCE(${body.challenge_img2},    challenge_img2),
      solution_img1     = COALESCE(${body.solution_img1},     solution_img1),
      solution_img2     = COALESCE(${body.solution_img2},     solution_img2),
      split1_label           = COALESCE(${body.split1_label},           split1_label),
      split2_label           = COALESCE(${body.split2_label},           split2_label),
      slug                   = COALESCE(${body.slug},                   slug),
      challenge_img1_label   = COALESCE(${body.challenge_img1_label},   challenge_img1_label),
      challenge_img2_label   = COALESCE(${body.challenge_img2_label},   challenge_img2_label),
      solution_img1_label    = COALESCE(${body.solution_img1_label},    solution_img1_label),
      solution_img2_label    = COALESCE(${body.solution_img2_label},    solution_img2_label),
      challenge_img1_orient  = COALESCE(${body.challenge_img1_orient},  challenge_img1_orient),
      challenge_img2_orient  = COALESCE(${body.challenge_img2_orient},  challenge_img2_orient),
      solution_img1_orient   = COALESCE(${body.solution_img1_orient},   solution_img1_orient),
      solution_img2_orient   = COALESCE(${body.solution_img2_orient},   solution_img2_orient),
      client_quote           = COALESCE(${body.client_quote},           client_quote),
      client_quote_author    = COALESCE(${body.client_quote_author},    client_quote_author),
      client_quote_role      = COALESCE(${body.client_quote_role},      client_quote_role),
      updated_at             = now()
    WHERE id = ${id}
    RETURNING *
  `;
  if (!rows.length) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(rows[0]);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await sql`DELETE FROM projects WHERE id = ${id}`;
  return new NextResponse(null, { status: 204 });
}
