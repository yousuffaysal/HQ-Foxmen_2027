import React from "react";
import { Metadata } from "next";
import { sql } from "@/lib/db";
import ServiceDetailClient, { DbProject } from "./ServiceDetailClient";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const titleName = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    title: `${titleName} | Services — Foxmen Studio`,
    description: `Explore custom ${titleName.toLowerCase()} services by Foxmen Studio. Award-winning design, modern tech stacks, and scalable architecture.`,
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let projects: DbProject[] = [];
  try {
    const rows = await sql`
      SELECT id, name, tagline, industry, scope, thumbnail, slug
      FROM projects
      WHERE status != 'archived'
      ORDER BY id DESC
      LIMIT 3
    `;
    projects = rows as unknown as DbProject[];
  } catch {
    projects = [];
  }
  return <ServiceDetailClient slug={slug} dbProjects={projects} />;
}
