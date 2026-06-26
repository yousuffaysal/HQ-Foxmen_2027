import type { Metadata } from "next";
import { cache } from "react";
import { sql } from "@/lib/db";

const BASE = "https://www.foxmen.studio";

/* Metadata for the hardcoded static posts so they also get per-post SEO */
const STATIC_META: Record<string, {
  title: string; excerpt: string; category: string;
  author_name: string; published_at: string; tags: string;
}> = {
  "why-ai-features-fail-in-production": {
    title: "Why AI features fail in production — and what to ship instead.",
    excerpt: "After deploying retrieval pipelines for fourteen products in 2025, a pattern emerged: most AI features die not from bad models but from bad surfaces.",
    category: "AI", author_name: "Devon Arias", published_at: "2026-05-12", tags: "AI, Product, Engineering",
  },
  "designing-in-the-browser-not-in-figma": {
    title: "Designing in the browser, not in Figma.",
    excerpt: "Why our team retired the static mock six months ago — and what we replaced it with.",
    category: "Design", author_name: "Sara Köhler", published_at: "2026-04-28", tags: "Design Systems, Workflow, Figma",
  },
  "the-eval-loop-that-saved-our-copilot": {
    title: "The eval loop that saved our copilot.",
    excerpt: "A practical, boring system for catching regressions before users do. Fixtures, scorecards, gold sets, and the meeting we run every Friday.",
    category: "AI", author_name: "Imran Sheikh", published_at: "2026-04-14", tags: "AI, Testing, Engineering",
  },
  "sticky-scroll-the-right-way": {
    title: "Sticky scroll, the right way.",
    excerpt: "The four CSS techniques we use to make stacks, panels, and reveals feel buttery — without scroll-jacking or scroll-jank.",
    category: "Engineering", author_name: "Marta Vidal", published_at: "2026-03-30", tags: "CSS, Performance, Animation",
  },
  "tokens-are-a-product-not-a-deliverable": {
    title: "Tokens are a product, not a deliverable.",
    excerpt: "Five years of design systems taught us this: tokens need a roadmap, a release notes channel, and somebody whose job it is to ship them.",
    category: "Design", author_name: "Aiden Park", published_at: "2026-03-11", tags: "Design Systems, Tokens, Process",
  },
  "how-we-shipped-nestaro-in-14-weeks": {
    title: "How we shipped Nestaro in 14 weeks.",
    excerpt: "A behind-the-scenes look at our biggest 2025 launch: the brief, the timeline, the moments that nearly broke us, the call that saved it.",
    category: "Studio notes", author_name: "Rina Mehta", published_at: "2026-02-22", tags: "Case Study, Process, Launch",
  },
  "a-short-defense-of-the-italic-headline": {
    title: "A short defense of the italic headline.",
    excerpt: "One typographic choice — and the eight reasons it shows up in every Foxmen brief.",
    category: "Design", author_name: "Léa Bouchard", published_at: "2026-02-04", tags: "Typography, Brand, Design",
  },
  "retrieval-but-make-it-boring": {
    title: "Retrieval, but make it boring.",
    excerpt: "RAG is mostly plumbing. Here's our hard-won checklist for a retrieval stack you can actually leave alone for a quarter.",
    category: "AI", author_name: "Imran Sheikh", published_at: "2026-01-19", tags: "AI, RAG, Engineering",
  },
  "the-case-for-monorepos-in-design-agencies": {
    title: "The case for monorepos in design agencies.",
    excerpt: "Why our 38 active client codebases live in one repo, what it cost to get there, and the day it paid for itself ten times over.",
    category: "Engineering", author_name: "Daniel Tan", published_at: "2026-01-06", tags: "Engineering, Monorepo, Workflow",
  },
  "atlas-shipping-an-ios-travel-app-in-9-weeks": {
    title: "Atlas: shipping an iOS travel app in 9 weeks.",
    excerpt: "From Figma to App Store, with AI-generated itineraries and offline maps. A complete project breakdown.",
    category: "Case studies", author_name: "Yuki Ono", published_at: "2025-12-18", tags: "iOS, Mobile, AI, Case Study",
  },
};

type PostMeta = {
  title: string; excerpt: string; category: string;
  author_name: string; published_at: string | null;
  tags: string; cover_image?: string; slug: string;
};

/* React cache deduplicates the DB call between generateMetadata and the layout render */
const fetchPost = cache(async (slug: string): Promise<PostMeta | null> => {
  try {
    const rows = await sql`
      SELECT title, excerpt, category, author_name, published_at, tags, cover_image, slug
      FROM posts WHERE slug = ${slug} AND status = 'live' LIMIT 1
    ` as Record<string, unknown>[];
    if (rows.length) return rows[0] as PostMeta;
  } catch { /* DB not available or post not found */ }
  const s = STATIC_META[slug];
  return s ? { ...s, cover_image: undefined, slug } : null;
});

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPost(slug);

  if (!post) {
    return {
      title: "Article",
      description: "An article from the Foxmen Studio journal — design craft, engineering, AI in production, and studio notes.",
    };
  }

  const title = post.title;
  const description = post.excerpt ||
    "An article from the Foxmen Studio journal — design craft, engineering, AI in production, and studio notes.";
  const url = `${BASE}/journal/${slug}`;
  const image = post.cover_image || `${BASE}/assets/og-image.png`;
  const keywords = post.tags
    ? post.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [post.category, "Foxmen Studio"];
  const publishedTime = post.published_at
    ? new Date(post.published_at).toISOString()
    : undefined;

  return {
    title,
    description,
    keywords,
    authors: [{ name: post.author_name || "Foxmen Studio", url: BASE }],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Foxmen Studio",
      type: "article",
      publishedTime,
      authors: post.author_name ? [post.author_name] : undefined,
      tags: keywords,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function JournalSlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await fetchPost(slug);

  const jsonLd = post
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: post.excerpt || "",
        author: { "@type": "Person", name: post.author_name || "Foxmen Studio" },
        publisher: {
          "@type": "Organization",
          name: "Foxmen Studio",
          url: BASE,
          logo: { "@type": "ImageObject", url: `${BASE}/assets/og-image.png` },
        },
        datePublished: post.published_at
          ? new Date(post.published_at).toISOString()
          : undefined,
        image: post.cover_image || `${BASE}/assets/og-image.png`,
        url: `${BASE}/journal/${slug}`,
        keywords: post.tags || post.category,
        mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE}/journal/${slug}` },
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  );
}
