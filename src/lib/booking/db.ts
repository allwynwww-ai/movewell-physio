/**
 * Postgres connection (Vercel Postgres / Neon, or any Postgres).
 * Uses DATABASE_URL, falling back to POSTGRES_URL. Tables are created on
 * first use from db/migrations, so `npm run db:migrate` is optional.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import postgres from "postgres";
import { databaseUrl } from "./env";

type Sql = postgres.Sql;

const globalForDb = globalThis as unknown as { __bookingSql?: Sql; __bookingSchema?: Promise<void> };

const MIGRATIONS = ["0001_online_booking.sql"];

export class DbNotConfiguredError extends Error {
  constructor() {
    super("Database is not configured (set DATABASE_URL or POSTGRES_URL).");
  }
}

function client(): Sql {
  const url = databaseUrl();
  if (!url) throw new DbNotConfiguredError();
  if (!globalForDb.__bookingSql) {
    globalForDb.__bookingSql = postgres(url, {
      max: 5,
      idle_timeout: 20,
      connect_timeout: 10,
      // Neon's pooled connection string runs through PgBouncer.
      prepare: false,
      onnotice: () => {},
    });
  }
  return globalForDb.__bookingSql;
}

async function ensureSchema(sql: Sql) {
  const exists = await sql<{ ok: boolean }[]>`
    SELECT to_regclass('public.appointments') IS NOT NULL
       AND to_regclass('public.blocked_dates') IS NOT NULL AS ok`;
  if (exists[0]?.ok) return;
  await sql.begin(async (tx) => {
    // Serialise concurrent cold starts.
    await tx`SELECT pg_advisory_xact_lock(724519)`;
    await tx`CREATE TABLE IF NOT EXISTS schema_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())`;
    for (const name of MIGRATIONS) {
      const file = readFileSync(join(process.cwd(), "db", "migrations", name), "utf8");
      await tx.unsafe(file);
      await tx`INSERT INTO schema_migrations (name) VALUES (${name}) ON CONFLICT DO NOTHING`;
    }
  });
  console.info("[booking] database tables created");
}

/** Ready-to-use SQL client; creates the tables the first time it is called. */
export async function db(): Promise<Sql> {
  const sql = client();
  if (!globalForDb.__bookingSchema) {
    globalForDb.__bookingSchema = ensureSchema(sql).catch((err) => {
      globalForDb.__bookingSchema = undefined;
      throw err;
    });
  }
  await globalForDb.__bookingSchema;
  return sql;
}

/** Postgres unique-violation (e.g. the slot was taken a moment ago). */
export function isUniqueViolation(err: unknown): boolean {
  return typeof err === "object" && err !== null && (err as { code?: string }).code === "23505";
}
