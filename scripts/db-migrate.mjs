#!/usr/bin/env node
/**
 * Applies every SQL file in db/migrations (in name order) that has not run yet.
 *   DATABASE_URL=postgres://… npm run db:migrate
 * Uses DATABASE_URL, falling back to POSTGRES_URL (set by Vercel Postgres / Neon).
 * The app also creates the tables automatically on first use, so this is optional.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import postgres from "postgres";

// Load .env.local / .env if present (e.g. after `vercel env pull .env.local`).
for (const file of [".env.local", ".env"]) {
  if (!existsSync(file)) continue;
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!url) {
  console.error("No DATABASE_URL or POSTGRES_URL set. Nothing to migrate.");
  process.exit(1);
}

const sql = postgres(url, { max: 1, onnotice: () => {}, prepare: false });
const dir = join(process.cwd(), "db", "migrations");

try {
  await sql`CREATE TABLE IF NOT EXISTS schema_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())`;
  const done = new Set((await sql`SELECT name FROM schema_migrations`).map((r) => r.name));
  const files = readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();
  for (const f of files) {
    if (done.has(f)) {
      console.log(`✓ ${f} (already applied)`);
      continue;
    }
    await sql.begin(async (tx) => {
      await tx.unsafe(readFileSync(join(dir, f), "utf8"));
      await tx`INSERT INTO schema_migrations (name) VALUES (${f})`;
    });
    console.log(`✓ ${f} applied`);
  }
  console.log("Database is up to date.");
} catch (err) {
  console.error("Migration failed:", err.message);
  process.exitCode = 1;
} finally {
  await sql.end();
}
