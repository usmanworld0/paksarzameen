import type { MetadataRoute } from "next";

import { impactCategories } from "@/content/impact";
import { siteConfig } from "@/config/site";
import { getArticles } from "@/lib/services/getArticles";
import { getPrograms } from "@/lib/services/getPrograms";

function priorityForPath(path: string) {
  if (path === "/") {
    return 1;
  }

  if (
    [
      "/about",
      "/impact",
      "/programs",
      "/get-involved",
      "/blood-bank",
      "/contact",
      "/news",
    ].includes(path)
  ) {
    return 0.9;
  }

  if (path.startsWith("/impact/") || path.startsWith("/programs/")) {
    return 0.8;
  }

  if (path.startsWith("/news/")) {
    return 0.75;
  }

  return 0.7;
}

function changeFrequencyForPath(path: string): MetadataRoute.Sitemap[number]["changeFrequency"] {
  if (path === "/" || path === "/news") {
    return "weekly";
  }

  if (
    path === "/impact" ||
    path === "/programs" ||
    path === "/get-involved" ||
    path === "/blood-bank"
  ) {
    return "monthly";
  }

  return "yearly";
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, programs] = await Promise.all([getArticles(), getPrograms()]);

  const impactPaths = impactCategories.flatMap((category) => [
    category.href,
    ...category.items.map((item) => item.href),
  ]);

  const staticPaths = [
    "/",
    "/about",
    "/blood-bank",
    "/programs",
    "/impact",
    "/get-involved",
    "/news",
    "/contact",
    "/commonwealth-lab",
    "/policies",
  ];

  const dynamicPaths = [
    ...programs.map((program) => `/programs/${program.slug}`),
    ...articles.map((article) => `/news/${article.slug}`),
  ];

  const lastModified = new Date();
  const uniquePaths = Array.from(
    new Set([...staticPaths, ...impactPaths, ...dynamicPaths])
  );

  return uniquePaths.map((path) => ({
    url: `${siteConfig.siteUrl}${path}`,
    lastModified,
    changeFrequency: changeFrequencyForPath(path),
    priority: priorityForPath(path),
  }));
}
