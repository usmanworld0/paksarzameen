import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __pszMainDbPool: Pool | undefined;
}

function createPool() {
  const databaseUrl =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.SUPABASE_DATABASE_URL ||
    process.env.SUPABASE_DB_URL ||
    process.env.PRISMA_DATABASE_URL ||
    "";

  if (!databaseUrl) {
    throw new Error("A Postgres connection URL is required for backend database access.");
  }

  return new Pool({
    connectionString: databaseUrl,
    ssl:
      process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : undefined,
  });
}

export function hasDatabaseConnection() {
  return Boolean(
    process.env.DATABASE_URL ||
      process.env.POSTGRES_URL ||
      process.env.POSTGRES_PRISMA_URL ||
      process.env.SUPABASE_DATABASE_URL ||
      process.env.SUPABASE_DB_URL ||
      process.env.PRISMA_DATABASE_URL
  );
}

export function getDbPool() {
  if (!global.__pszMainDbPool) {
    global.__pszMainDbPool = createPool();
  }

  return global.__pszMainDbPool;
}
