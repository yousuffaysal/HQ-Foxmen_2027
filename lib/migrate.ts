/**
 * Run once to create all tables:  npx tsx lib/migrate.ts
 */
import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);

async function migrate() {
  await sql`
    CREATE TABLE IF NOT EXISTS projects (
      id          SERIAL PRIMARY KEY,
      monogram    VARCHAR(4)   NOT NULL DEFAULT '',
      color_cls   VARCHAR(8)   NOT NULL DEFAULT '',
      name        TEXT         NOT NULL,
      industry    TEXT         NOT NULL DEFAULT '',
      year        VARCHAR(4)   NOT NULL DEFAULT '',
      scope       TEXT         NOT NULL DEFAULT '',
      status      VARCHAR(20)  NOT NULL DEFAULT 'draft',
      updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS posts (
      id           SERIAL PRIMARY KEY,
      title        TEXT         NOT NULL,
      category     VARCHAR(50)  NOT NULL DEFAULT '',
      author_init  VARCHAR(4)   NOT NULL DEFAULT '',
      author_name  TEXT         NOT NULL DEFAULT '',
      read_time    VARCHAR(20)  NOT NULL DEFAULT '',
      status       VARCHAR(20)  NOT NULL DEFAULT 'draft',
      published_at DATE
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS services (
      id       SERIAL PRIMARY KEY,
      ord      INTEGER      NOT NULL DEFAULT 0,
      name     TEXT         NOT NULL,
      descr    TEXT         NOT NULL DEFAULT '',
      count    VARCHAR(30)  NOT NULL DEFAULT '',
      visible  BOOLEAN      NOT NULL DEFAULT true,
      badge    VARCHAR(20)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS testimonials (
      id    SERIAL PRIMARY KEY,
      quote TEXT        NOT NULL,
      name  TEXT        NOT NULL,
      role  TEXT        NOT NULL DEFAULT '',
      av    VARCHAR(4)  NOT NULL DEFAULT '',
      hi    TEXT        NOT NULL DEFAULT ''
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS clients (
      id       SERIAL PRIMARY KEY,
      name     TEXT        NOT NULL,
      industry TEXT        NOT NULL DEFAULT '',
      country  VARCHAR(4)  NOT NULL DEFAULT '',
      contact  TEXT        NOT NULL DEFAULT '',
      eng      TEXT        NOT NULL DEFAULT '',
      mrr      TEXT        NOT NULL DEFAULT '',
      av       VARCHAR(4)  NOT NULL DEFAULT '',
      cls      VARCHAR(8)  NOT NULL DEFAULT ''
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS messages (
      id          SERIAL PRIMARY KEY,
      av          VARCHAR(4)  NOT NULL DEFAULT '',
      sender      TEXT        NOT NULL,
      subject     TEXT        NOT NULL DEFAULT '',
      preview     TEXT        NOT NULL DEFAULT '',
      body        TEXT        NOT NULL DEFAULT '',
      source      TEXT        NOT NULL DEFAULT '',
      interested  TEXT        NOT NULL DEFAULT '',
      budget      TEXT        NOT NULL DEFAULT '',
      country     TEXT        NOT NULL DEFAULT '',
      unread      BOOLEAN     NOT NULL DEFAULT true,
      received_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS team (
      id   SERIAL PRIMARY KEY,
      av   VARCHAR(4) NOT NULL DEFAULT '',
      name TEXT       NOT NULL,
      role TEXT       NOT NULL DEFAULT '',
      bio  TEXT       NOT NULL DEFAULT ''
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS media (
      id          SERIAL PRIMARY KEY,
      filename    TEXT        NOT NULL,
      size_label  TEXT        NOT NULL DEFAULT '',
      bg_class    VARCHAR(8)  NOT NULL DEFAULT 'bg1',
      glyph       VARCHAR(4)  NOT NULL DEFAULT '',
      url         TEXT        NOT NULL DEFAULT '',
      uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS settings (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL DEFAULT ''
    )
  `;

  console.log("✓ All tables created");
}

migrate().catch(console.error);
