import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

const SEED = [
  { category: "Website",    feature_id: "__base__",     label: "Base Price",                price_min: 3000,  price_max: 6000,  is_base: true,  ord: 0 },
  { category: "Website",    feature_id: "cms",          label: "Content Management System", price_min: 1000,  price_max: 1800,  is_base: false, ord: 1 },
  { category: "Website",    feature_id: "blog",         label: "Blog / Journal",            price_min: 600,   price_max: 1200,  is_base: false, ord: 2 },
  { category: "Website",    feature_id: "contact",      label: "Contact Form + Leads",      price_min: 300,   price_max: 600,   is_base: false, ord: 3 },
  { category: "Website",    feature_id: "auth",         label: "User Accounts & Auth",      price_min: 1500,  price_max: 3000,  is_base: false, ord: 4 },
  { category: "Website",    feature_id: "animations",   label: "Premium Animations",        price_min: 1200,  price_max: 2500,  is_base: false, ord: 5 },
  { category: "Website",    feature_id: "multilang",    label: "Multi-language",            price_min: 1800,  price_max: 3500,  is_base: false, ord: 6 },
  { category: "Website",    feature_id: "analytics",    label: "Analytics Dashboard",       price_min: 800,   price_max: 1500,  is_base: false, ord: 7 },
  { category: "Website",    feature_id: "ecom",         label: "E-commerce Integration",    price_min: 3000,  price_max: 6000,  is_base: false, ord: 8 },

  { category: "Mobile App", feature_id: "__base__",     label: "Base Price",               price_min: 8000,  price_max: 15000, is_base: true,  ord: 0 },
  { category: "Mobile App", feature_id: "auth",         label: "User Authentication",      price_min: 1200,  price_max: 2500,  is_base: false, ord: 1 },
  { category: "Mobile App", feature_id: "push",         label: "Push Notifications",       price_min: 600,   price_max: 1200,  is_base: false, ord: 2 },
  { category: "Mobile App", feature_id: "offline",      label: "Offline Mode",             price_min: 1800,  price_max: 3500,  is_base: false, ord: 3 },
  { category: "Mobile App", feature_id: "camera",       label: "Camera & Media Upload",    price_min: 1000,  price_max: 2000,  is_base: false, ord: 4 },
  { category: "Mobile App", feature_id: "maps",         label: "Maps & Location",          price_min: 1200,  price_max: 2500,  is_base: false, ord: 5 },
  { category: "Mobile App", feature_id: "payments",     label: "In-app Payments",          price_min: 1800,  price_max: 3500,  is_base: false, ord: 6 },
  { category: "Mobile App", feature_id: "social",       label: "Social Features",          price_min: 2500,  price_max: 5000,  is_base: false, ord: 7 },
  { category: "Mobile App", feature_id: "admin",        label: "Web Admin Dashboard",      price_min: 2500,  price_max: 5000,  is_base: false, ord: 8 },

  { category: "E-commerce", feature_id: "__base__",     label: "Base Price",                price_min: 5000,  price_max: 10000, is_base: true,  ord: 0 },
  { category: "E-commerce", feature_id: "catalog",      label: "Product Catalog",           price_min: 1500,  price_max: 3000,  is_base: false, ord: 1 },
  { category: "E-commerce", feature_id: "cart",         label: "Cart & Checkout",           price_min: 1200,  price_max: 2500,  is_base: false, ord: 2 },
  { category: "E-commerce", feature_id: "payments",     label: "Payment Gateway",           price_min: 1000,  price_max: 2000,  is_base: false, ord: 3 },
  { category: "E-commerce", feature_id: "inventory",    label: "Inventory Management",      price_min: 1200,  price_max: 2500,  is_base: false, ord: 4 },
  { category: "E-commerce", feature_id: "multivendor",  label: "Multi-vendor / Marketplace",price_min: 4000,  price_max: 8000,  is_base: false, ord: 5 },
  { category: "E-commerce", feature_id: "reviews",      label: "Reviews & Ratings",         price_min: 600,   price_max: 1200,  is_base: false, ord: 6 },
  { category: "E-commerce", feature_id: "email",        label: "Email Marketing",           price_min: 1200,  price_max: 2500,  is_base: false, ord: 7 },
  { category: "E-commerce", feature_id: "analytics",    label: "Analytics Dashboard",       price_min: 1500,  price_max: 3000,  is_base: false, ord: 8 },

  { category: "AI Tool",    feature_id: "__base__",     label: "Base Price",               price_min: 10000, price_max: 20000, is_base: true,  ord: 0 },
  { category: "AI Tool",    feature_id: "llm",          label: "LLM Integration",          price_min: 1500,  price_max: 3000,  is_base: false, ord: 1 },
  { category: "AI Tool",    feature_id: "rag",          label: "RAG / Knowledge Base",     price_min: 2500,  price_max: 5000,  is_base: false, ord: 2 },
  { category: "AI Tool",    feature_id: "agents",       label: "AI Agents",                price_min: 3500,  price_max: 7000,  is_base: false, ord: 3 },
  { category: "AI Tool",    feature_id: "vectordb",     label: "Vector Database",          price_min: 1200,  price_max: 2500,  is_base: false, ord: 4 },
  { category: "AI Tool",    feature_id: "streaming",    label: "Streaming UI",             price_min: 600,   price_max: 1200,  is_base: false, ord: 5 },
  { category: "AI Tool",    feature_id: "finetune",     label: "Model Fine-tuning",        price_min: 4000,  price_max: 8000,  is_base: false, ord: 6 },
  { category: "AI Tool",    feature_id: "api",          label: "API / Webhook Layer",      price_min: 1500,  price_max: 3000,  is_base: false, ord: 7 },
  { category: "AI Tool",    feature_id: "dashboard",    label: "Usage Dashboard",          price_min: 2000,  price_max: 4000,  is_base: false, ord: 8 },

  { category: "Branding",   feature_id: "__base__",     label: "Base Price",               price_min: 3000,  price_max: 6000,  is_base: true,  ord: 0 },
  { category: "Branding",   feature_id: "logo",         label: "Logo Design",              price_min: 1500,  price_max: 3500,  is_base: false, ord: 1 },
  { category: "Branding",   feature_id: "colors",       label: "Color System",             price_min: 500,   price_max: 1000,  is_base: false, ord: 2 },
  { category: "Branding",   feature_id: "typography",   label: "Typography System",        price_min: 500,   price_max: 1000,  is_base: false, ord: 3 },
  { category: "Branding",   feature_id: "guidelines",   label: "Brand Guidelines PDF",     price_min: 1000,  price_max: 2000,  is_base: false, ord: 4 },
  { category: "Branding",   feature_id: "social",       label: "Social Media Templates",   price_min: 1200,  price_max: 2500,  is_base: false, ord: 5 },
  { category: "Branding",   feature_id: "motion",       label: "Motion Design",            price_min: 2000,  price_max: 4500,  is_base: false, ord: 6 },
  { category: "Branding",   feature_id: "designsystem", label: "Design System",            price_min: 3500,  price_max: 7000,  is_base: false, ord: 7 },
];

export async function GET() {
  // Create table (idempotent)
  await sql`
    CREATE TABLE IF NOT EXISTS fox_prices (
      id         SERIAL PRIMARY KEY,
      category   TEXT NOT NULL,
      feature_id TEXT NOT NULL,
      label      TEXT NOT NULL,
      price_min  INT  NOT NULL DEFAULT 0,
      price_max  INT  NOT NULL DEFAULT 0,
      is_base    BOOLEAN DEFAULT FALSE,
      ord        INT DEFAULT 0,
      note       TEXT DEFAULT ''
    )
  `;
  // Add note column if this is an older table without it
  await sql`ALTER TABLE fox_prices ADD COLUMN IF NOT EXISTS note TEXT DEFAULT ''`;

  const count = await sql`SELECT COUNT(*) AS n FROM fox_prices`;
  if (Number((count[0] as { n: string }).n) === 0) {
    for (const s of SEED) {
      await sql`
        INSERT INTO fox_prices (category, feature_id, label, price_min, price_max, is_base, ord, note)
        VALUES (${s.category}, ${s.feature_id}, ${s.label}, ${s.price_min}, ${s.price_max}, ${s.is_base}, ${s.ord}, '')
      `;
    }
  }

  const rows = await sql`SELECT * FROM fox_prices ORDER BY category, is_base DESC, ord ASC`;
  return NextResponse.json(rows);
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const { id } = body;

  if ("note" in body) {
    const rows = await sql`UPDATE fox_prices SET note = ${body.note} WHERE id = ${id} RETURNING *`;
    return NextResponse.json(rows[0]);
  }

  const rows = await sql`
    UPDATE fox_prices SET price_min = ${body.price_min}, price_max = ${body.price_max}
    WHERE id = ${id} RETURNING *
  `;
  return NextResponse.json(rows[0]);
}
