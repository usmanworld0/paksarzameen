import { redirect } from "next/navigation";

type SignInAliasPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function toSearchString(params: Record<string, string | string[] | undefined>) {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((entry) => search.append(key, entry));
      return;
    }

    if (typeof value === "string") {
      search.set(key, value);
    }
  });

  return search.toString();
}

export default async function SignInAliasPage({ searchParams }: SignInAliasPageProps) {
  const params = await searchParams;
  const query = toSearchString(params);

  redirect(query ? `/login?${query}` : "/login");
}
