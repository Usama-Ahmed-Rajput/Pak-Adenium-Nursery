import { MetadataRoute } from "next";
import { getProducts, getArticles } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://pakadenium.pk").replace(/\/$/, "");

  const [products, articles] = await Promise.all([
    getProducts(),
    getArticles(),
  ]);

  const latestProductDate = products.reduce((latest, p) => {
    const d = new Date(p.updated_at || p.created_at);
    return d > latest ? d : latest;
  }, new Date("2026-01-01T00:00:00Z"));

  const latestArticleDate = articles.reduce((latest, a) => {
    const d = new Date(a.updated_at || a.created_at);
    return d > latest ? d : latest;
  }, new Date("2026-01-01T00:00:00Z"));

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: latestProductDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: latestProductDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/plant-finder`,
      lastModified: latestProductDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/journal`,
      lastModified: latestArticleDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date("2026-01-01T00:00:00Z"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date("2026-01-01T00:00:00Z"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${baseUrl}/shop/${p.slug}`,
    lastModified: new Date(p.updated_at || p.created_at),
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${baseUrl}/journal/${a.slug}`,
    lastModified: new Date(a.updated_at || a.created_at),
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  return [...staticRoutes, ...productRoutes, ...articleRoutes];
}
