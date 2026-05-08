type AdminLoadResult<T> = {
  data: T;
  error: string | null;
};

export function getAdminDataErrorMessage(error: unknown) {
  if (!process.env.DATABASE_URL) {
    return "DATABASE_URL is missing for the store app. Add a valid database connection string and reload the admin panel.";
  }

  if (error instanceof Error) {
    if (error.message.includes("must start with the protocol `prisma://`")) {
      return "The current store DATABASE_URL does not match the Prisma client configuration. Update the store database URL and try again.";
    }

    if (
      error.message.includes("does not exist")
      || error.message.includes("Unknown field")
      || error.message.includes("column")
    ) {
      return "The store database schema is behind the current code. Apply the latest store schema updates, then reload this page.";
    }
  }

  return "The admin panel could not load live store data right now. Check the database connection and try again.";
}

export async function safeAdminLoad<T>(
  label: string,
  loader: () => Promise<T>,
  fallback: T
): Promise<AdminLoadResult<T>> {
  try {
    return {
      data: await loader(),
      error: null,
    };
  } catch (error) {
    console.error(`[admin] Failed to load ${label}`, error);

    return {
      data: fallback,
      error: getAdminDataErrorMessage(error),
    };
  }
}

export function getFirstAdminError(...errors: Array<string | null | undefined>) {
  return errors.find((error): error is string => Boolean(error)) ?? null;
}
