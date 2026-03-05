import { dummyArticles, type Article } from "@/lib/models/Article";
import { delay } from "@/lib/utils/delay";

export async function getArticles(): Promise<Article[]> {
  await delay(500);
  return dummyArticles.map((article) => ({ ...article }));
}
