/** @type {import('next-sitemap').IConfig} */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://paksarzameenwfo.com";

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  changefreq: "weekly",
  priority: 0.7,
  sitemapSize: 5000,
  outDir: "public",
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    additionalSitemaps: [`${siteUrl}/sitemap.xml`],
  },
  additionalPaths: async (config) => {
    const importantPaths = [
      "/",
      "/about",
      "/projects",
      "/volunteer",
      "/contact",
      "/commonwealth",
      "/programs",
      "/get-involved",
      "/commonwealth-lab",
      "/news",
    ];

    return importantPaths.map((loc) => ({
      loc,
      changefreq: "weekly",
      priority: loc === "/" ? 1.0 : 0.8,
      lastmod: new Date().toISOString(),
      alternateRefs: config.alternateRefs ?? [],
    }));
  },
};
