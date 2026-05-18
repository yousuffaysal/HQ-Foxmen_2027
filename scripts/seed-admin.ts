/**
 * Creates the admin user in the database.
 * Run once: npx tsx scripts/seed-admin.ts
 *
 * Edit EMAIL and PASSWORD below before running.
 */
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const NAME     = "Arif Rahman";
const EMAIL    = "admin@foxmen.studio";
const PASSWORD = "change-me-now";   // ← change this before running

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL not set in .env.local");
  const sql = neon(process.env.DATABASE_URL);

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id            SERIAL PRIMARY KEY,
      name          TEXT        NOT NULL,
      email         TEXT        NOT NULL UNIQUE,
      password_hash TEXT        NOT NULL,
      role          VARCHAR(20) NOT NULL DEFAULT 'client',
      avatar        TEXT        NOT NULL DEFAULT '',
      created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  const existing = await sql`SELECT id FROM users WHERE email = ${EMAIL}`;
  if (existing.length > 0) {
    console.log(`User ${EMAIL} already exists — updating password and role.`);
    const hash = await bcrypt.hash(PASSWORD, 12);
    await sql`UPDATE users SET password_hash = ${hash}, role = 'admin' WHERE email = ${EMAIL}`;
    console.log("Done.");
    return;
  }

  const hash = await bcrypt.hash(PASSWORD, 12);
  const rows = await sql`
    INSERT INTO users (name, email, password_hash, role)
    VALUES (${NAME}, ${EMAIL}, ${hash}, 'admin')
    RETURNING id, name, email, role
  `;
  console.log("Admin user created:", rows[0]);
}

main().catch(err => { console.error(err); process.exit(1); });
