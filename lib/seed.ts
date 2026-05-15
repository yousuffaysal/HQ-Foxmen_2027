/**
 * Seed tables with the sample data from admin.html:  npx tsx lib/seed.ts
 */
import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);

async function seed() {
  /* projects */
  await sql`DELETE FROM projects`;
  await sql`
    INSERT INTO projects (monogram, color_cls, name, industry, year, scope, status, updated_at) VALUES
    ('N', '',  'Nestaro — real-estate OS',   'Real Estate', '2025', 'Web · iOS · Android',   'live',     now() - interval '2 days'),
    ('P', 'b', 'Pulse — AI copilot',          'SaaS · B2B',  '2025', 'AI · UX · Build',        'review',   now() - interval '5 days'),
    ('M', 'c', 'Marketo — multi-vendor',      'Ecommerce',   '2024', 'Platform · Brand',       'live',     now() - interval '14 days'),
    ('A', 'd', 'Atlas — travel app',          'Travel',      '2025', 'iOS · AI',               'draft',    now() - interval '21 days'),
    ('O', '',  'Orbit Bank — fintech',         'Fintech',     '2024', 'Mobile · Brand',         'live',     now() - interval '30 days'),
    ('H', 'b', 'Hearth — wellness',           'Health',      '2024', 'iOS · AI',               'live',     now() - interval '30 days'),
    ('L', 'c', 'Lumen — AI canvas',           'AI',          '2023', 'Web · AI',               'archived', now() - interval '120 days'),
    ('N', 'd', 'Northwind — logistics',       'Logistics',   '2023', 'Dashboard · Realtime',   'live',     now() - interval '150 days')
  `;

  /* posts */
  await sql`DELETE FROM posts`;
  await sql`
    INSERT INTO posts (title, category, author_init, author_name, read_time, status, published_at) VALUES
    ('Why AI features fail in production',      'AI',          'DA', 'Devon Arias',  '12 min', 'live',   '2026-05-12'),
    ('Designing in the browser, not Figma',     'Design',      'SK', 'Sara Köhler',  '6 min',  'live',   '2026-04-28'),
    ('The eval loop that saved our copilot',    'AI',          'IS', 'Imran Sheikh', '9 min',  'live',   '2026-04-14'),
    ('Sticky scroll, the right way',            'Engineering', 'MV', 'Marta Vidal',  '7 min',  'live',   '2026-03-30'),
    ('Tokens are a product, not a deliverable', 'Design',      'AP', 'Aiden Park',   '5 min',  'live',   '2026-03-11'),
    ('How we shipped Nestaro in 14 weeks',      'Studio',      'RM', 'Rina Mehta',   '14 min', 'live',   '2026-02-22'),
    ('A short defense of the italic headline',  'Design',      'LB', 'Léa Bouchard', '4 min',  'draft',  NULL),
    ('Retrieval, but make it boring',           'AI',          'IS', 'Imran Sheikh', '11 min', 'review', NULL)
  `;

  /* services */
  await sql`DELETE FROM services`;
  await sql`
    INSERT INTO services (ord, name, descr, count, visible, badge) VALUES
    (1, 'Web Design & Development',      'Marketing sites, SaaS dashboards, bespoke web apps.',  '18 clients', true,  NULL),
    (2, 'iOS, Android & Cross-platform', 'MVP to App Store in 8–12 weeks.',                       '12 clients', true,  NULL),
    (3, 'AI-Integrated Software',        'RAG, agents, fine-tuned models.',                       '14 clients', true,  'New'),
    (4, 'Ecommerce & Multi-vendor',      'Shopify, Medusa, marketplaces.',                        '9 clients',  true,  NULL),
    (5, 'Real-Estate Platforms',         'Listings, CRMs, mortgage tools.',                       '5 clients',  true,  NULL),
    (6, 'UI · UX & Brand Systems',       'Identity, design systems, motion.',                     '21 clients', true,  NULL),
    (7, 'Performance Marketing',         'Funnels, paid, SEO, lifecycle.',                        '7 clients',  false, NULL)
  `;

  /* testimonials */
  await sql`DELETE FROM testimonials`;
  await sql`
    INSERT INTO testimonials (quote, name, role, av, hi) VALUES
    ('Foxmen turned a vague pitch deck into a product our investors actually used during the round.', 'Sara Köhler',  'CEO · Nestaro',               'SK', 'actually used'),
    ('The AI copilot they built drove our activation rate from 28% to 71%.',                         'Devon Arias',  'Head of Product · Pulse',     'DA', '71%'),
    ('Care is in the name and it shows. Our launch had zero P0s in week one.',                        'Rina Mehta',   'CTO · Marketo',               'RM', 'zero'),
    ('A senior team that ships. We renewed for another year before our first deploy.',                'Julia Weber',  'Head of Product · Orbit Bank','JW', 'first deploy'),
    ('The design system they built absorbed three feature lines without a rewrite.',                  'Hina Park',    'Design Lead · Hearth',        'HP', 'without a rewrite'),
    ('We came in with an idea and left with a roadmap, a brand, and a launch.',                       'Tomás Vidal',  'Founder · Atlas',             'TV', 'launch')
  `;

  /* clients */
  await sql`DELETE FROM clients`;
  await sql`
    INSERT INTO clients (name, industry, country, contact, eng, mrr, av, cls) VALUES
    ('Nestaro',    'Real Estate', 'DE', 'Sara Köhler',  'Retainer',     '$15k/mo',    'N', ''),
    ('Pulse',      'B2B SaaS',    'US', 'Devon Arias',  'Active build', '$220k total','P', 'b'),
    ('Marketo',    'Ecommerce',   'IN', 'Rina Mehta',   'Retainer',     '$12k/mo',    'M', 'c'),
    ('Atlas',      'Travel',      'ES', 'Tomás Vidal',  'Past project', '—',          'A', 'd'),
    ('Orbit Bank', 'Fintech',     'DE', 'Julia Weber',  'Discovery',    '$40k sprint','O', ''),
    ('Hearth',     'Wellness',    'KR', 'Hina Park',    'Active build', '$180k total','H', 'b'),
    ('Lumen',      'AI',          'US', 'Maya Choi',    'Past project', '—',          'L', 'c'),
    ('Northwind',  'Logistics',   'CA', 'Daniel Tan',   'Retainer',     '$9k/mo',     'N', 'd')
  `;

  /* messages */
  await sql`DELETE FROM messages`;
  await sql`
    INSERT INTO messages (av, sender, subject, preview, body, source, interested, budget, country, unread) VALUES
    ('JW','Julia Weber',      'Discovery sprint for our mobile redesign',    'We came across the Nestaro case study…',           'Hey Foxmen team,\n\nWe came across the Nestaro case study (beautiful work) and wanted to reach out. We''re a Series B neobank operating across the EU — we have an iOS & Android app that''s grown organically into a bit of a feature-graveyard.\n\nWe''re looking at a 2-week discovery sprint to map a redesign for Q3, with a possible build engagement to follow. Budget for the sprint is around $40k, and the build engagement would likely sit in the $250–400k range.\n\nCould we get a call this week? I''ve reserved Wednesday at 4 PM CET as a placeholder — let me know if that works.\n\nThanks,\nJulia · Head of Product, Orbit Bank', 'Contact form · /contact', 'Mobile · UI · UX', '$250–400k', 'Germany', true),
    ('SK','Sara Köhler',      'Following up on the Nestaro launch',          'Quick note — the team loved the v2 design system…', '',                           '', '', '', '', true),
    ('DA','Devon Arias',      'Eval scores from the new Pulse build',        'Scores improved by 14% on the hard set this week…', '',                           '', '', '', '', true),
    ('RM','Rina Mehta',       'Final approval on the Marketo design',        'We''re aligned on the launch artwork. Sending…',    '',                           '', '', '', '', false),
    ('MP','Marco Pellegrini', 'Press inquiry · Wired',                       'Working on a piece about studios using AI…',        '',                           '', '', '', '', false),
    ('AT','Anh Tran',         'Careers — Senior product designer',           'I''d love to talk about the role opening…',         '',                           '', '', '', '', false),
    ('BN','Beatrice Nilsen',  'Partnership opportunity · Stockholm',         'We run a small studio in Stockholm and…',           '',                           '', '', '', '', false)
  `;

  /* team */
  await sql`DELETE FROM team`;
  await sql`
    INSERT INTO team (av, name, role, bio) VALUES
    ('AR','Arif Rahman',  'Owner · Studio Lead',   'Founded Foxmen in 2019. Leads strategy and client relationships.'),
    ('SK','Sara Köhler',  'Design Director',       'Leads design and motion. Previously at Linear, IDEO.'),
    ('DA','Devon Arias',  'Head of AI',            'Builds production-grade copilots. Ex-Anthropic applied team.'),
    ('MV','Marta Vidal',  'Principal Engineer',    'Engineering quality and platform. Owns the deploy pipeline.'),
    ('IS','Imran Sheikh', 'AI Engineer',           'RAG, evals, fine-tuning. Wrote our internal eval framework.'),
    ('LB','Léa Bouchard', 'Senior Designer',       'Brand systems and editorial design. Studio writer.'),
    ('AP','Aiden Park',   'Senior Designer',       'Design systems, tokens, accessibility.'),
    ('DT','Daniel Tan',   'Engineer',              'Fullstack. Owns the monorepo and CI.'),
    ('YO','Yuki Ono',     'Mobile Engineer',       'iOS / Swift specialist. Atlas, Hearth.'),
    ('RM','Rina Mehta',   'Project Lead',          'Production, project ops, client delivery.'),
    ('JH','James Holt',   'Strategist',            'Discovery, positioning, research.'),
    ('MC','Maya Choi',    'Designer · contract',   'Brand and identity, freelance.')
  `;

  console.log("✓ Seeded all tables");
}

seed().catch(console.error);
