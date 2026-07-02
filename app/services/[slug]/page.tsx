import React from "react";
import { Metadata } from "next";
import ServiceDetailClient from "./ServiceDetailClient";

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
  return <ServiceDetailClient slug={slug} />;
}
