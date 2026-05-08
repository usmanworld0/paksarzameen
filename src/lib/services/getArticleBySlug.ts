import type { Article } from "@/lib/models/Article";
import { getArticles } from "@/lib/services/getArticles";

export async function getArticleBySlug(
  slug: string,
): Promise<Article | undefined> {
  const articles = await getArticles();
  return articles.find((article) => article.slug === slug);
}
