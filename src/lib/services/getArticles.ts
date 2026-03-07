import { dummyArticles, type Article } from "@/lib/models/Article";
<<<<<<< HEAD
import { delay } from "@/lib/utils/delay";

export async function getArticles(): Promise<Article[]> {
  await delay(500);
=======

/**
 * Fetch all articles.
 * Currently returns dummy data; swap for Supabase call when migrating.
 */
export async function getArticles(): Promise<Article[]> {
  // No artificial delay — keep instant for dummy-data layer
>>>>>>> 33c6b96 (Perf: lazy-load videos, optimize images, remove artificial delays, next/image and config, CSS perf hints, refactor HomeClient)
  return dummyArticles.map((article) => ({ ...article }));
}
