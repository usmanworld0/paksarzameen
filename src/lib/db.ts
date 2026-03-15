import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __pszMainDbPool: Pool | undefined;
}

function createPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required for Blood Bank backend.");
  }

  return new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:
      process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : undefined,
  });
}

export function getDbPool() {
  if (!global.__pszMainDbPool) {
    global.__pszMainDbPool = createPool();
  }

  return global.__pszMainDbPool;
}
