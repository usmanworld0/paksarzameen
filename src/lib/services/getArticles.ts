import { dummyArticles, type Article } from "@/lib/models/Article";

/**
 * Fetch all articles.
 * Currently returns dummy data; swap for Supabase call when migrating.
 */
export async function getArticles(): Promise<Article[]> {
  return dummyArticles.map((article) => ({ ...article }));
}
