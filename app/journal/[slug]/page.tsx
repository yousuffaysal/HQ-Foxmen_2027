"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { parseMarkdown } from "@/lib/parseMarkdown";
import NewsletterForm from "@/components/NewsletterForm";

/* ── types ── */
type Post = {
  id?: number; slug: string; title: string; category: string;
  author_init: string; author_name: string; read_time: string;
  published_at?: string; body: string; cover_image?: string;
  excerpt: string; tags: string; thumb?: string; sym?: string;
};

/* ── thumb gradients ── */
const THUMB_BG: Record<string, string> = {
  t1: "radial-gradient(60% 60% at 30% 30%, rgba(184,108,249,.6), transparent 60%), #0a0a0a",
  t2: "linear-gradient(140deg, #b86cf9, #1a0c2c)",
  t3: "radial-gradient(50% 60% at 70% 60%, rgba(184,108,249,.4), transparent 60%), #efece6",
  t4: "linear-gradient(160deg, #0a0a0a 0%, #1a0c2c 100%)",
  t5: "linear-gradient(140deg, #efece6, #b86cf9)",
  t6: "radial-gradient(60% 60% at 80% 80%, rgba(184,108,249,.6), transparent 60%), #0a0a0a",
  t7: "linear-gradient(180deg, #b86cf9, #5a26a8)",
  t8: "repeating-linear-gradient(45deg, #0a0a0a 0 14px, #1a0c2c 14px 28px)",
  t9: "radial-gradient(50% 60% at 30% 70%, rgba(184,108,249,.5), transparent 60%), #efece6",
  featured: "radial-gradient(60% 60% at 25% 30%, rgba(184,108,249,.55), transparent 60%), radial-gradient(50% 60% at 80% 80%, rgba(184,108,249,.25), transparent 60%), #0a0a0a",
};
const LIGHT_THUMBS = new Set(["t3","t5","t9"]);

/* ── static article content ── */
const STATIC: Record<string, Post> = {
  "why-ai-features-fail-in-production": {
    slug: "why-ai-features-fail-in-production",
    title: "Why AI features fail in production — and what to ship instead.",
    category: "AI", author_init: "DA", author_name: "Devon Arias",
    read_time: "12 min", published_at: "May 12, 2026",
    excerpt: "After deploying retrieval pipelines for fourteen products in 2025, a pattern emerged: most AI features die not from bad models but from bad surfaces.",
    tags: "AI, Product, Engineering",
    thumb: "featured", sym: "◈",
    body: `## The graveyard nobody talks about

After shipping AI features into fourteen products last year, I started keeping a private list. Not of wins — those go in the case studies. Of the features we quietly turned off three months after launch because nobody used them.

The count is embarrassing. Not because the models were wrong. The models were fine. GPT-4o, Claude 3.5, Gemini — they all answered the questions we threw at them. The features died because of **surface problems**: where we put the AI, how we framed what it could do, and what we assumed users would tolerate while waiting for an answer.

## The five failure modes we see most

### 1. The invisible assistant

You built a chat interface, buried it under Settings → Beta → AI Features → Enable. Nobody turned it on. Nobody used it. You called it low adoption. We call it low discoverability.

> The feature that lives in a drawer is not a feature. It's a proof of concept that shipped to production by accident.

The fix is almost always structural: bring the AI surface into the main workflow, not as a modal or sidebar, but as a first-class element. The question is *where does the user already feel stuck?* Put the AI there.

### 2. The blank canvas problem

"Ask me anything about your data" is the worst possible prompt. Users freeze. They don't know what the AI knows, what it can do, or where to start. The blank text field is a UX anti-pattern masquerading as flexibility.

Replace it with **opinionated entry points**:

\`\`\`
❌ "What would you like to know?"
✅ "Summarise last week's performance"
✅ "What drove the spike on Apr 14?"
✅ "Compare this quarter to Q4 2025"
\`\`\`

Give users three to five starting points. Let them feel competent on day one. They'll explore from there.

### 3. Latency without feedback

Seven seconds of spinner is a broken product. It doesn't matter that your RAG pipeline is doing something genuinely impressive underneath — the user already switched tabs.

Streaming is table stakes. But streaming alone isn't enough if the first token takes four seconds. The pattern we use:

\`\`\`tsx
// Show skeleton immediately, then stream into it
const [status, setStatus] = useState<"idle" | "thinking" | "streaming">("idle");

// "thinking" → show animated placeholder text
// "streaming" → swap to real content as tokens arrive
\`\`\`

The *thinking* state should feel purposeful, not empty. Show the query being processed. Show progress. Give users something to watch.

### 4. The hallucination timeout

RAG doesn't solve hallucinations. It reduces them. If your retrieval misses a document, or the user asks something genuinely outside the corpus, the model will still produce a confident-sounding answer.

Every AI response in a production product needs a **confidence signal** and an **escape hatch**:

- Show the source documents the answer was drawn from
- Rate the answer — one thumb up/down is enough
- "I'm not sure — search the docs instead" as a fallback action

Users will tolerate uncertainty. They will not tolerate discovering they acted on a wrong answer three weeks later.

### 5. Building for the demo, not the daily

The demo works because you know exactly what question to ask. Real users ask it eleven different ways. They use your product at 11pm when they're tired. They paste in data you didn't expect. They ask questions that are half-formed.

Build an eval suite before you ship. Run it every deploy. Not with vibes — with fixtures, expected outputs, and automated scoring. We run ours in CI. A regressions fails the build.

## What to ship instead

The AI features that survive twelve months of production look different from the ones that die at three. They share four properties:

1. **They live inside existing workflows**, not alongside them
2. **They reduce one specific decision** the user was already making
3. **They show their work** — sources, confidence, reasoning
4. **They fail gracefully** — the product still functions when the AI gets it wrong

The best AI feature we shipped last year was a two-line suggestion in a form field. Not a chat interface. Not a dashboard copilot. Two lines of text that said *"Based on your last three projects, this is usually quoted at $18k–$24k."* Conversion rate on that page went up 34%.

Find the moment of friction. Put something useful there. Ship it.`,
  },
  "designing-in-the-browser-not-in-figma": {
    slug: "designing-in-the-browser-not-in-figma",
    title: "Designing in the browser, not in Figma.",
    category: "Design", author_init: "SK", author_name: "Sara Köhler",
    read_time: "6 min", published_at: "Apr 28, 2026",
    excerpt: "Why our team retired the static mock six months ago — and what we replaced it with.",
    tags: "Design Systems, Workflow, Figma",
    thumb: "t1", sym: "B",
    body: `## The mock that lied

Six months ago we designed a dashboard in Figma. Beautiful. The client loved the review. We handed it to engineering and two sprints later the live product looked nothing like the mock — not because the engineers did it wrong, but because a static frame cannot capture state, loading, empty data, error conditions, or the way a table reflows when a column is 23 characters wide instead of eight.

The Figma file was a lie. A very attractive, carefully labelled lie.

## What we do now

We open a Next.js component file. We write real markup with real data. If the API isn't ready yet, we seed it with fixtures that reflect the actual shape of the data, not placeholder text that's always perfectly formatted.

The first hour feels slower. By day three it's faster — because every decision we make is a decision about the real product, not a proxy for it.

## The tools that make it work

- **Tailwind** for styling without context-switching to a separate file
- **MSW (Mock Service Worker)** for faking API responses that behave like the real thing
- **Storybook** for isolated component work
- **Chromatic** for visual regression on every PR

## What we actually lost

Stakeholder alignment got harder. Clients are used to reviewing a Figma link. A localhost URL requires more explanation. We solved this by recording short Loom walkthroughs for each review cycle — faster than a meeting, better than a static screenshot.

We still use Figma for identity work, icon sets, and initial concept exploration. It's the right tool for those jobs. For product UI, the browser won.`,
  },
  "the-eval-loop-that-saved-our-copilot": {
    slug: "the-eval-loop-that-saved-our-copilot",
    title: "The eval loop that saved our copilot.",
    category: "AI", author_init: "IS", author_name: "Imran Sheikh",
    read_time: "9 min", published_at: "Apr 14, 2026",
    excerpt: "A practical, boring system for catching regressions before users do. Fixtures, scorecards, gold sets, and the meeting we run every Friday.",
    tags: "AI, Testing, Engineering",
    thumb: "t2", sym: "⊕",
    body: `## The regression nobody saw coming

We shipped a retrieval improvement in week six of a copilot project. The benchmarks improved. The demo looked great. Two days later, three enterprise customers opened tickets saying the assistant had "gotten dumber" — it was no longer answering questions about their Q4 report, a document that had been working perfectly for a month.

We had improved the chunking strategy for new documents. In doing so, we broke the index for documents ingested under the old strategy. The eval suite we had at the time caught zero of this.

That was the week we rebuilt evals from the ground up.

## The system we use now

Every AI feature we ship has a gold set: a collection of (input, expected output) pairs that represent the behaviour the feature must maintain across every deploy.

\`\`\`
gold/
  copilot-retrieval.json     # 40 Q&A pairs
  copilot-tone.json          # 20 tone/format checks
  copilot-refusal.json       # 15 out-of-scope queries
\`\`\`

Each fixture has a question, a ground-truth answer, and a scoring rubric. The rubric can be exact match, semantic similarity, or an LLM-as-judge call — depending on how structured the output is.

## The Friday eval meeting

Every Friday at 2pm, the team running an AI product reviews the eval dashboard for that week. It takes twenty minutes. The agenda is always the same:

1. Which checks regressed this week?
2. What shipped that could explain the regression?
3. Which checks improved that we didn't expect?

The third question is the most important. Unexpected improvements are where you discover that a change you made for a different reason had a positive side effect on a behavior you care about. That's signal worth understanding.

## What CI actually checks

We run a subset of evals in CI on every PR — the fast, deterministic ones. The expensive LLM-as-judge evals run nightly. The rule: if a CI eval fails, the PR cannot merge.

This caught seventeen regressions in Q1. Two of them were showstoppers that would have reached production users on a Friday afternoon if CI hadn't blocked the deploy.

Boring infrastructure. Invaluable results.`,
  },
  "sticky-scroll-the-right-way": {
    slug: "sticky-scroll-the-right-way",
    title: "Sticky scroll, the right way.",
    category: "Engineering", author_init: "MV", author_name: "Marta Vidal",
    read_time: "7 min", published_at: "Mar 30, 2026",
    excerpt: "The four CSS techniques we use to make stacks, panels, and reveals feel buttery — without scroll-jacking or scroll-jank.",
    tags: "CSS, Performance, Animation",
    thumb: "t3", sym: "↧",
    body: `## Scroll-jacking is dead. Long live sticky.

Scroll-jacking — hijacking the browser's native scroll to drive custom animations — peaked around 2018 and has been dying ever since. Users hate it. Accessibility tools break on it. Mobile browsers ignore it.

But sticky positioning and scroll-driven effects done *correctly* are a different thing entirely. They feel native because they are native. The browser handles the math; you declare the intent.

## Technique 1: Sticky card stacks

The pattern: a container of cards where each card sticks to the top as you scroll, stacking into a pile.

\`\`\`css
.stack { position: relative; }

.card {
  position: sticky;
  top: calc(76px + var(--i) * 8px); /* offset per card */
}
\`\`\`

The key insight: sticky positioning respects the natural document flow. Each card takes up its full height in the flow, which means the stack container is tall — and that height is what drives the scrolling that causes the stacking effect.

## Technique 2: Scroll-driven opacity with @keyframes

Chrome 115+ supports scroll-driven animations natively:

\`\`\`css
@keyframes fade-in {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

.reveal {
  animation: fade-in linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 35%;
}
\`\`\`

No JavaScript. No IntersectionObserver. The browser handles everything. For browsers that don't support it yet, we use an IntersectionObserver polyfill with the same keyframe values.

## Technique 3: Parallax without jank

Pure CSS parallax using sticky + scale instead of translateY:

\`\`\`css
.parallax-bg {
  position: sticky;
  top: 0;
  will-change: transform;
  /* JS adds a tiny scale based on scroll progress */
  /* scale(1) → scale(1.04) over the viewport height */
}
\`\`\`

The \`will-change: transform\` moves the element to its own compositor layer. Transformations on compositor layers never cause layout or paint — they're applied by the GPU directly, giving you 60fps at no cost.

## Technique 4: The IntersectionObserver reveal

For the 20% of browsers where scroll-driven animations aren't supported:

\`\`\`tsx
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("in");
      obs.unobserve(e.target); // fire once
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(".fade, .reveal").forEach(el => obs.observe(el));
\`\`\`

The \`.in\` class triggers a CSS transition. One observer, zero per-element listeners, fires once per element, then cleans up. This is what we use in production today.`,
  },
  "tokens-are-a-product-not-a-deliverable": {
    slug: "tokens-are-a-product-not-a-deliverable",
    title: "Tokens are a product, not a deliverable.",
    category: "Design", author_init: "AP", author_name: "Aiden Park",
    read_time: "5 min", published_at: "Mar 11, 2026",
    excerpt: "Five years of design systems taught us this: tokens need a roadmap, a release notes channel, and somebody whose job it is to ship them.",
    tags: "Design Systems, Tokens, Process",
    thumb: "t4", sym: "◇",
    body: `## The token graveyard

Every design system I've worked on has a folder called something like \`tokens-v2\` or \`tokens-new\` or \`tokens-FINAL\`. It contains a perfectly organised set of semantic tokens — color, spacing, typography, radius, elevation — that nobody is using in production.

The tokens exist. The documentation is thorough. The Figma library is published. Engineers just... kept using the old hardcoded values because nobody was maintaining the bridge between design intent and code output.

## What treating tokens as a product looks like

**A roadmap.** Tokens have versions. \`v2.0\` ships the semantic layer. \`v2.1\` adds dark mode. \`v2.2\` adds a compact density variant. Each version has a release date, a migration guide, and a deprecation timeline for old values.

**Release notes.** Every token change gets a changelog entry in the same Slack channel as engineering releases. \`color.surface.elevated\` changed from \`#FFFFFF\` to \`#FAFAFA\` in v2.1 — here's why, here's the before/after.

**An owner.** One person whose job includes responding to questions about tokens, reviewing PRs that touch the token file, and deciding when to deprecate. Not a committee. One person.

**Automated output.** Tokens Studio → Style Dictionary → CSS custom properties + Tailwind config + iOS Swift enums + Android XML. The pipeline runs on every merge to the design token repo. Engineers never manually update a value.

## The most common objection

*"We're too small for this overhead."*

The overhead of a token product is about four hours per month at the maintenance stage. The overhead of *not* having one is the six-hour meeting every quarter when a designer wants to change the brand's primary blue and nobody knows how many hardcoded hex values are in the codebase.`,
  },
  "retrieval-but-make-it-boring": {
    slug: "retrieval-but-make-it-boring",
    title: "Retrieval, but make it boring.",
    category: "AI", author_init: "IS", author_name: "Imran Sheikh",
    read_time: "11 min", published_at: "Jan 19, 2026",
    excerpt: "RAG is mostly plumbing. Here's our hard-won checklist for a retrieval stack you can actually leave alone for a quarter.",
    tags: "AI, RAG, Engineering",
    thumb: "t7", sym: "R",
    body: `## The part nobody blogs about

Every RAG tutorial ends at the demo. "Look, it answers questions about my PDF!" And then you ship it to production, the first customer uploads a 400-page legal contract in a scanned image format, and your embedding pipeline falls over completely.

This is the post about the part that comes after the demo.

## The checklist

**Document ingestion**
- Handle PDF, DOCX, HTML, plain text, and scanned images (OCR fallback)
- Strip boilerplate — headers, footers, page numbers, repeated nav elements
- Preserve table structure — tables embedded in running text are the hardest problem in document processing
- Detect and split by logical sections, not fixed token counts
- Deduplicate on content hash before ingesting

**Chunking**
- Semantic chunking over fixed-size chunking almost always improves retrieval quality
- Overlap between chunks should be ~15–20% of chunk size
- Store chunk metadata: source document, page number, section heading, creation timestamp
- Never throw away the original — store both raw and processed versions

**Embedding**
- Use the same model at query time as at index time. This sounds obvious. It is violated constantly when teams upgrade the embedding model without re-indexing
- Normalise vectors before storing. Cosine similarity on unnormalised vectors is undefined behaviour
- Store embeddings alongside metadata in the same row — don't join across tables at query time

**Retrieval**
- Hybrid search (dense + sparse BM25) outperforms pure vector search on keyword-heavy queries
- Rerank the top-20 candidates with a cross-encoder before passing to the LLM — retrieval is cheap, generation is expensive
- Set a minimum similarity threshold. Returning a low-confidence chunk is worse than returning nothing

**Monitoring**
- Log every query and its retrieved chunks
- Track retrieval latency at p50, p95, p99
- Alert when the top result similarity drops below threshold — this means a document type you haven't handled well is entering your corpus

## The one thing that matters most

None of this beats good evaluation data. Build your gold set before you optimise your pipeline. Otherwise you're tuning by feel, and feel is unreliable.`,
  },
  "how-we-shipped-nestaro-in-14-weeks": {
    slug: "how-we-shipped-nestaro-in-14-weeks",
    title: "How we shipped Nestaro in 14 weeks.",
    category: "Studio notes", author_init: "RM", author_name: "Rina Mehta",
    read_time: "14 min", published_at: "Feb 22, 2026",
    excerpt: "A behind-the-scenes look at our biggest 2025 launch: the brief, the timeline, the moments that nearly broke us, the call that saved it.",
    tags: "Case Study, Process, Launch",
    thumb: "t5", sym: "N",
    body: `## The brief

Nestaro came to us in October 2025 with a deck and a deadline. A property management platform for boutique hotel operators — the kind of hotels that run on spreadsheets and WhatsApp groups and a prayer that the weekend maintenance guy shows up. The brief was to replace all of that with a single product.

Fourteen weeks to launch. MVP only.

We said yes.

## The first two weeks

We spent the first week not designing anything. We talked to six hotel operators — a B&B owner in Portugal, a mountain lodge operator in Colorado, a boutique hotel GM in Singapore. We wanted to know what they hated most about their current setup.

The answer was unanimous: communication. Not between the hotel and guests. Between staff. A maintenance request raised at 8am that the housekeeping team doesn't see until 3pm. A check-out that nobody communicated to the front desk. A broken shower that got fixed three days late because the message was buried in a WhatsApp thread from six months ago.

We threw out 40% of the features in the original brief. They didn't solve the real problem.

## The call that saved it

Week nine. The property management system integration — the API that synced bookings from their existing PMS — was returning inconsistent data for properties with multiple room types. Our backend lead spent three days on it. We were going to miss the sprint goal.

The call: we scoped it out. Nestaro v1 would not sync bookings automatically. Users would enter arrivals manually. It was a step backward from the brief, and the client was not thrilled.

But it meant we could ship. And shipping with a manual workaround is better than not shipping.

Week 14, we launched. The PMS integration shipped in v1.2, six weeks later, properly.

## What we learned

**Kill features, not timelines.** When a deadline is real, scope is the variable.

**Validation interviews before wireframes.** Every hour we spent with operators in week one saved three hours in week nine.

**Ship with a workaround.** The workaround ships; the right solution ships soon after. The alternative is shipping nothing.`,
  },
  "a-short-defense-of-the-italic-headline": {
    slug: "a-short-defense-of-the-italic-headline",
    title: "A short defense of the italic headline.",
    category: "Design", author_init: "LB", author_name: "Léa Bouchard",
    read_time: "4 min", published_at: "Feb 04, 2026",
    excerpt: "One typographic choice — and the eight reasons it shows up in every Foxmen brief.",
    tags: "Typography, Brand, Design",
    thumb: "t6", sym: "i",
    body: `## It started as a habit

The first time I italicised a key word in a display headline — *results*, in a SaaS hero — I thought it was a one-off. The client loved it. The next client asked if we could do the same. By the fourth project, I stopped thinking of it as a stylistic choice and started thinking of it as a system.

Now it's in every brief we write. Here's why.

## What italic does that bold can't

Bold says *this is important*. It's a weight signal — stop here, pay attention.

Italic says something different. It says *this is the thing*. It carries emphasis without aggression. In a display headline at 80px, bold weight creates visual competition between elements. Italic creates a rhythm — a slight lean that draws the eye through the line rather than stopping it.

> "The *right* client for the *right* product at the *right* moment."

Read that three times. The italics create a cadence. Remove them and the line is flat.

## The rules we follow

1. One italic phrase per headline, never two
2. The italic word should be the emotional core, not a qualifier
3. Pair with a display typeface that has a distinctive italic — not just a slanted roman
4. Works with Playfair, Canela, Editorial New, Freight Display, Domaine
5. Does not work with geometric sans-serifs (they have no true italic)
6. The italic element should resolve the headline — it's the landing pad
7. Test at mobile sizes — some display italics collapse at 32px
8. When in doubt, remove it. Italic used sparingly is powerful. Italic everywhere is noise.

## Why clients respond to it

Because it looks confident without looking like it's shouting. That's a hard balance to find in a headline. Italic finds it without trying.`,
  },
  "the-case-for-monorepos-in-design-agencies": {
    slug: "the-case-for-monorepos-in-design-agencies",
    title: "The case for monorepos in design agencies.",
    category: "Engineering", author_init: "DT", author_name: "Daniel Tan",
    read_time: "8 min", published_at: "Jan 06, 2026",
    excerpt: "Why our 38 active client codebases live in one repo, what it cost to get there, and the day it paid for itself ten times over.",
    tags: "Engineering, Monorepo, Workflow",
    thumb: "t8", sym: "≡",
    body: `## The problem with 38 repos

By mid-2024, we had 38 active client projects in 38 separate repositories. Maintaining shared utilities — auth helpers, API wrappers, component primitives, deployment configs — meant manually syncing changes across repos or watching the codebases diverge over time.

The divergence problem is subtle and fatal. A security fix in the image upload utility gets applied to 12 repos. The other 26 don't get it for three months because nobody remembers they exist until something breaks.

## The migration

We spent one sprint moving everything into a Turborepo monorepo. The architecture:

\`\`\`
apps/
  client-alpha/
  client-beta/
  ...
packages/
  ui/           # shared component library
  auth/         # auth utilities
  db/           # database helpers
  config/       # ESLint, TypeScript, Tailwind presets
\`\`\`

Turborepo's remote caching means CI doesn't rebuild unchanged packages. A change to the \`auth\` package triggers builds only for the apps that depend on it.

## The day it paid off

Three months after the migration, a critical vulnerability was disclosed in a dependency we use in the auth package. Fix, test, merge: one PR. Deployed to all 38 clients in the next CI run.

In the old world, that would have been 38 separate PRs, each requiring a manual deploy. At 15 minutes per repo, that's nine and a half hours of mechanical work.

We did it in 40 minutes.

## The real cost

The migration took one sprint. The cultural cost was higher — developers who were used to full autonomy over their repo had to learn Turborepo, agree on shared configs, and go through code review for changes to shared packages.

Worth it. Not painless.`,
  },
  "atlas-shipping-an-ios-travel-app-in-9-weeks": {
    slug: "atlas-shipping-an-ios-travel-app-in-9-weeks",
    title: "Atlas: shipping an iOS travel app in 9 weeks.",
    category: "Case studies", author_init: "YO", author_name: "Yuki Ono",
    read_time: "10 min", published_at: "Dec 18, 2025",
    excerpt: "From Figma to App Store, with AI-generated itineraries and offline maps. A complete project breakdown.",
    tags: "iOS, Mobile, AI, Case Study",
    thumb: "t9", sym: "A",
    body: `## The brief

Atlas is a travel planning app with one differentiator: it works offline. Not degraded-offline — fully offline. Maps, saved places, itineraries, even the AI suggestions. The client came to us after two other agencies said the offline-first requirement was "too complex."

We shipped it in nine weeks.

## The stack decision

React Native with Expo for the app layer. SQLite via \`expo-sqlite\` for local storage. A custom sync engine that reconciles local changes with the server when connectivity returns. Mapbox with \`@rnmapbox/maps\` for offline map tile caching — you can pre-cache a city's worth of tiles before a trip.

The AI itinerary generator runs client-side with a quantized model for basic suggestions, with a network fallback to Claude for richer planning when online. Users never see a loading spinner for the basic features.

## The sprint structure

- **Weeks 1–2**: Design system, navigation architecture, offline storage schema
- **Weeks 3–4**: Maps integration, place search, offline tile caching
- **Weeks 5–6**: Itinerary builder, AI integration, sync engine
- **Week 7**: Beta testing with 40 users, performance profiling
- **Week 8**: Polish, App Store assets, review submission
- **Week 9**: App Store review, launch

We submitted to App Store review on day 57. It was approved in 18 hours.

## What made it work

**Weekly TestFlight builds.** The client saw real app builds every Friday from week two onward. No surprises at week nine.

**Offline-first as a constraint, not a feature.** We didn't bolt offline support on at the end. Every data layer decision assumed offline first. This costs two extra days at the start and saves two weeks at the end.

**One engineer owned the sync engine.** Complex distributed systems problems need a single accountable mind. The sync engine had one author and one reviewer. No design-by-committee.

The app launched with a 4.7-star rating. Still there.`,
  },
};

/* ── table of contents ── */
function extractTOC(body: string): Array<{ text: string; id: string; level: number }> {
  const items: Array<{ text: string; id: string; level: number }> = [];
  for (const line of body.split("\n")) {
    const m = line.match(/^(#{2,3})\s+(.+)/);
    if (m) {
      const text = m[2].replace(/[*_`]/g, "").trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      items.push({ text, id, level: m[1].length });
    }
  }
  return items;
}

/* ── related articles ── */
function getRelated(slug: string, category: string): Post[] {
  return Object.values(STATIC).filter(p => p.slug !== slug && p.category === category).slice(0, 3);
}

/* ── arrow icon ── */
function ArrowIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h18M13 5l7 7-7 7" />
    </svg>
  );
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug as string;
  useScrollReveal(".fade, .reveal");

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    fetch(`/api/blog/slug/${slug}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => { setPost(data); setLoading(false); })
      .catch(() => {
        const s = STATIC[slug];
        if (s) { setPost(s); } else { setMissing(true); }
        setLoading(false);
      });
  }, [slug]);

  if (loading) return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="post-loader" />
    </div>
  );

  if (missing) return (
    <div style={{ minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
      <p style={{ fontFamily: "var(--f-mono)", fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--muted)" }}>404</p>
      <h1 style={{ fontFamily: "var(--f-display)", fontSize: "clamp(36px,6vw,72px)", letterSpacing: "-.03em" }}>Article not found.</h1>
      <Link href="/journal" className="btn"><span className="label">Back to journal</span><span className="chip"><ArrowIcon /></span></Link>
    </div>
  );

  if (!post) return null;

  const bg = post.cover_image ? undefined : (THUMB_BG[post.thumb ?? "t1"] ?? THUMB_BG.t1);
  const isLight = LIGHT_THUMBS.has(post.thumb ?? "");
  const bodyHtml = post.body ? parseMarkdown(post.body) : "";
  const related = getRelated(slug, post.category);
  const tagList = post.tags ? post.tags.split(",").map(t => t.trim()).filter(Boolean) : [];
  const dateStr = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "";

  const toc = extractTOC(post.body ?? "");

  return (
    <>
      <style>{`
        .post-prose { font-family:var(--f-sans); font-size:17px; line-height:1.76; color:var(--ink); }
        .post-prose h2 { font-family:var(--f-display); font-size:clamp(24px,3vw,34px); line-height:1.12; letter-spacing:-.022em; margin:52px 0 16px; color:var(--ink); scroll-margin-top:100px; }
        .post-prose h3 { font-family:var(--f-display); font-size:clamp(18px,2.2vw,24px); line-height:1.2; letter-spacing:-.018em; margin:36px 0 12px; color:var(--ink); scroll-margin-top:100px; }
        .post-prose p { margin:0 0 22px; }
        .post-prose strong { font-weight:600; }
        .post-prose em { font-style:italic; color:var(--brand); }
        .post-prose del { text-decoration:line-through; color:var(--muted); }
        .post-prose a { color:var(--brand); text-decoration:underline; text-underline-offset:3px; }
        .post-prose blockquote { margin:32px 0; padding:20px 28px; border-left:3px solid var(--brand); background:rgba(184,108,249,.06); border-radius:0 12px 12px 0; font-style:italic; }
        .post-prose blockquote p { margin:0; }
        .post-prose ul,.post-prose ol { margin:0 0 24px; padding-left:26px; }
        .post-prose li { margin-bottom:8px; }
        .post-prose hr { border:none; border-top:1px solid var(--line); margin:48px 0; }
        .post-prose img { max-width:100%; border-radius:18px; display:block; margin:32px auto; }
        .post-prose .ic { font-family:var(--f-mono); font-size:.86em; padding:2px 7px; background:var(--bone); border:1px solid var(--line); border-radius:6px; color:var(--ink); }
        .post-prose .cb { position:relative; margin:28px 0; padding:24px 28px; background:var(--ink); border-radius:14px; overflow-x:auto; }
        .post-prose .cb code { font-family:var(--f-mono); font-size:13px; line-height:1.72; color:rgba(255,255,255,.82); white-space:pre; display:block; }
        .post-prose .cb::before { content:attr(data-lang); position:absolute; top:10px; right:14px; font-family:var(--f-mono); font-size:9px; letter-spacing:.16em; text-transform:uppercase; color:rgba(255,255,255,.22); }
        .post-prose .cm{color:rgba(255,255,255,.32);} .post-prose .cs{color:#b9f0a0;} .post-prose .ck{color:#c792ea;} .post-prose .cn{color:#f78c6c;} .post-prose .ct{color:#89ddff;}
        .toc-link { display:block; padding:9px 0 9px 16px; border-left:2px solid var(--line); font-family:var(--f-sans); font-size:13.5px; line-height:1.4; color:var(--muted); text-decoration:none; transition:border-color .2s, color .2s; }
        .toc-link:hover,.toc-link.active { border-left-color:var(--ink); color:var(--ink); }
        .toc-link.l3 { padding-left:28px; font-size:12.5px; }
        @media(max-width:900px){
          .post-layout { grid-template-columns:1fr !important; }
          .post-sidebar { display:none !important; }
          .post-prose { font-size:16px; }
          .post-prose .cb { padding:18px; border-radius:10px; }
          .post-prose .cb code { font-size:12px; }
        }
      `}</style>

      {/* ── PAGE HEADER (full width) ── */}
      <div className="wrap" style={{ paddingTop:140, paddingBottom:0 }}>
        {/* meta row */}
        <div className="fade in" style={{ display:"flex", alignItems:"center", gap:12, marginBottom:28 }}>
          <span style={{ fontFamily:"var(--f-sans)", fontSize:13, color:"var(--muted)" }}>
            Last Update: <strong style={{ color:"var(--ink)", fontWeight:500 }}>{dateStr || post.published_at}</strong>
          </span>
          <span style={{ display:"inline-flex", alignItems:"center", padding:"5px 14px", borderRadius:999, background:"var(--ink)", color:"#fff", fontFamily:"var(--f-sans)", fontSize:12, fontWeight:500 }}>{post.category}</span>
          <span style={{ fontFamily:"var(--f-mono)", fontSize:11, color:"var(--muted)", letterSpacing:".06em" }}>{post.read_time} read</span>
        </div>
        {/* big title */}
        <h1 className="fade in" style={{ fontFamily:"var(--f-display)", fontSize:"clamp(36px,5.5vw,68px)", lineHeight:1.06, letterSpacing:"-.03em", color:"var(--ink)", fontWeight:400, maxWidth:920, marginBottom:56 }}>{post.title}</h1>
      </div>

      {/* ── TWO-COLUMN LAYOUT ── */}
      <div className="wrap post-layout" style={{ display:"grid", gridTemplateColumns:"268px 1fr", gap:"0 60px", alignItems:"start", paddingBottom:80 }}>

        {/* ── SIDEBAR ── */}
        <aside className="post-sidebar" style={{ position:"sticky", top:96 }}>
          {/* author card */}
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:32, paddingBottom:24, borderBottom:"1px solid var(--line)" }}>
            <div style={{ width:40, height:40, borderRadius:"50%", background:"var(--ink)", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--f-mono)", fontSize:11, letterSpacing:".07em", flexShrink:0 }}>{post.author_init}</div>
            <div>
              <div style={{ fontFamily:"var(--f-sans)", fontSize:14, fontWeight:500, color:"var(--ink)" }}>{post.author_name}</div>
              {tagList.length > 0 && <div style={{ fontFamily:"var(--f-mono)", fontSize:10, color:"var(--muted)", marginTop:2, letterSpacing:".08em" }}>{tagList[0]}</div>}
            </div>
          </div>

          {/* table of contents */}
          {toc.length > 0 && (
            <div style={{ marginBottom:32 }}>
              <div style={{ fontFamily:"var(--f-sans)", fontSize:11, fontWeight:600, letterSpacing:".1em", textTransform:"uppercase" as const, color:"var(--muted)", marginBottom:14 }}>Table of Contents</div>
              <nav>
                {toc.map((item, i) => (
                  <a key={i} href={`#${item.id}`} className={`toc-link${item.level === 3 ? " l3" : ""}`}>{item.text}</a>
                ))}
              </nav>
            </div>
          )}

          {/* newsletter CTA card */}
          <div style={{ background:"var(--ink)", borderRadius:18, padding:"28px 24px", color:"#fff" }}>
            <div style={{ fontFamily:"var(--f-display)", fontSize:20, lineHeight:1.25, letterSpacing:"-.02em", marginBottom:16 }}>Fresh insights,<br /><span style={{ color:"var(--brand)" }}>straight to you.</span></div>
            <NewsletterForm dark />
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <div style={{ minWidth:0 }}>
          {/* cover image / thumb */}
          <div style={{ position:"relative", width:"100%", height:"clamp(260px,42vw,480px)", borderRadius:20, overflow:"hidden", marginBottom:48 }}>
            {post.cover_image
              ? <img src={post.cover_image} alt={post.title} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
              : <div style={{ width:"100%", height:"100%", background: bg }} />
            }
            <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(10,10,10,.5) 0%, transparent 50%)", pointerEvents:"none" }} />
            {post.sym && (
              <span style={{ position:"absolute", bottom:-10, right:20, fontFamily:"var(--f-display)", fontSize:"clamp(80px,14vw,160px)", lineHeight:1, color: LIGHT_THUMBS.has(post.thumb ?? "") ? "rgba(10,10,10,.07)" : "rgba(255,255,255,.1)", pointerEvents:"none", userSelect:"none" as const }}>{post.sym}</span>
            )}
          </div>

          {/* prose body */}
          <article className="post-prose" dangerouslySetInnerHTML={{ __html: bodyHtml }} />

          {/* share row */}
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"28px 0", borderTop:"1px solid var(--line)", borderBottom:"1px solid var(--line)", marginTop:8, marginBottom:0, flexWrap:"wrap" as const }}>
            <span style={{ fontFamily:"var(--f-mono)", fontSize:10, letterSpacing:".14em", textTransform:"uppercase" as const, color:"var(--muted)", marginRight:4 }}>Share</span>
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://foxmenstudio.com/journal/${slug}`)}`} target="_blank" rel="noopener noreferrer" style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"7px 14px", borderRadius:999, border:"1px solid var(--line)", background:"transparent", cursor:"pointer", fontFamily:"var(--f-mono)", fontSize:10, letterSpacing:".1em", textTransform:"uppercase" as const, color:"var(--ink)", textDecoration:"none" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2H21.5l-7.5 8.57L23 22h-6.844l-5.36-7.005L4.7 22H1.44l8.04-9.183L1 2h7.014l4.844 6.405L18.244 2Zm-1.2 18h1.84L7.04 4H5.07l11.974 16Z"/></svg>
              Post on X
            </a>
            <button onClick={() => navigator.clipboard.writeText(window.location.href)} style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"7px 14px", borderRadius:999, border:"1px solid var(--line)", background:"transparent", cursor:"pointer", fontFamily:"var(--f-mono)", fontSize:10, letterSpacing:".1em", textTransform:"uppercase" as const, color:"var(--ink)" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              Copy link
            </button>
          </div>
        </div>
      </div>

      {/* ── RELATED ── */}
      {related.length > 0 && (
        <section style={{ borderTop:"1px solid var(--line)", padding:"60px 0 80px" }}>
          <div className="wrap">
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:32 }}>
              <span className="eyebrow">More from {post.category}</span>
              <Link href="/journal" style={{ fontFamily:"var(--f-mono)", fontSize:11, letterSpacing:".12em", textTransform:"uppercase" as const, color:"var(--muted)", textDecoration:"none" }}>All articles →</Link>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:20 }}>
              {related.map((r) => (
                <Link key={r.slug} href={`/journal/${r.slug}`} style={{ textDecoration:"none", display:"block", border:"1px solid var(--line)", borderRadius:20, overflow:"hidden", background:"var(--paper)" }}>
                  <div style={{ position:"relative", height:140, background: THUMB_BG[r.thumb ?? "t1"] }}>
                    {r.sym && <span style={{ position:"absolute", bottom:-6, right:14, fontFamily:"var(--f-display)", fontSize:80, lineHeight:1, color: LIGHT_THUMBS.has(r.thumb ?? "") ? "rgba(10,10,10,.08)" : "rgba(255,255,255,.13)", userSelect:"none" as const, pointerEvents:"none" }}>{r.sym}</span>}
                  </div>
                  <div style={{ padding:"18px 20px 20px", display:"flex", flexDirection:"column" as const, gap:5 }}>
                    <span style={{ fontFamily:"var(--f-mono)", fontSize:9, letterSpacing:".16em", textTransform:"uppercase" as const, color:"var(--brand)" }}>{r.category}</span>
                    <h4 style={{ fontFamily:"var(--f-display)", fontSize:16, lineHeight:1.25, letterSpacing:"-.015em", color:"var(--ink)", margin:0, fontWeight:400 }}>{r.title}</h4>
                    <p style={{ fontFamily:"var(--f-sans)", fontSize:12.5, lineHeight:1.5, color:"var(--muted)", margin:0, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" as const, overflow:"hidden" }}>{r.excerpt}</p>
                    <span style={{ fontFamily:"var(--f-mono)", fontSize:10, letterSpacing:".1em", textTransform:"uppercase" as const, color:"var(--muted)", marginTop:2 }}>{r.read_time} · {r.author_name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section style={{ padding:"60px 0" }}>
        <div className="cta">
          <div className="wrap-tight">
            <div className="fade in"><span className="eyebrow">Work with us</span></div>
            <h2 className="fade in d1">Got a project in mind?<br /><span className="it">Let&apos;s build it.</span></h2>
            <div className="row fade in d2">
              <Link href="/contact" className="btn btn--lg">
                <span className="label">Start a project</span>
                <span className="chip"><ArrowIcon /></span>
              </Link>
              <Link href="/work" className="btn btn--ghost btn--lg">
                <span className="label">See the work</span>
                <span className="chip"><ArrowIcon /></span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
