import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;

// Defer the error to query time so missing env var doesn't crash module loading
export const sql = url
  ? neon(url)
  : (() => { throw new Error("DATABASE_URL is not set — add it to .env.local or Vercel env vars"); }) as unknown as ReturnType<typeof neon>;
