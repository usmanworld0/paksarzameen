"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchValue = searchParams.get("search") || "";
  const [query, setQuery] = useState(searchValue);

  useEffect(() => {
    setQuery(searchValue);
  }, [searchValue]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) {
      params.set("search", query.trim());
    } else {
      params.delete("search");
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-md">
      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
      <Input
        type="search"
        placeholder="Search the collection"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="h-12 rounded-xl border-black/10 bg-white pl-11 pr-4 text-sm text-neutral-900 shadow-none placeholder:text-neutral-400 focus-visible:border-black/30 focus-visible:ring-0"
      />
    </form>
  );
}
