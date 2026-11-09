import type { MetadataRoute } from "next";
import { getAllArtworks, getCategories, getCollections, getPortfolio } from "@/lib/api";
import { site } from "@/lib/site";

/** sitemap.xml with image entries, so artworks show up in Google Images too. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [artworks, categories, collections, portfolio] = await Promise.all([getAllArtworks(), getCategories(), getCollections(), getPortfolio()]);
  const u = (path: string) => `${site.url}${path}`;
  const img = (id: string) => u(`/art/${id}-og.jpg`);

  return [
    { url: u("/"), changeFrequency: "weekly", priority: 1 },
    { url: u("/shop"), changeFrequency: "daily", priority: 0.9 },
    ...categories.map((c) => ({ url: u(`/shop/${c.slug}`), changeFrequency: "weekly" as const, priority: 0.7 })),
    { url: u("/collections"), changeFrequency: "weekly", priority: 0.6 },
    ...collections.map((c) => ({ url: u(`/collections/${c.slug}`), changeFrequency: "weekly" as const, priority: 0.7 })),
    ...artworks.map((a) => ({
      url: u(`/artwork/${a.slug}`),
      lastModified: a.createdAt,
      changeFrequency: "weekly" as const,
      priority: a.status === "available" ? 0.8 : 0.5,
      images: a.images.map((i) => img(i.id)),
    })),
    { url: u("/portfolio"), changeFrequency: "monthly", priority: 0.6 },
    ...portfolio.map((p) => ({ url: u(`/portfolio/${p.slug}`), changeFrequency: "monthly" as const, priority: 0.5, images: p.images.map((i) => img(i.id)) })),
    { url: u("/exhibitions"), changeFrequency: "monthly", priority: 0.5 },
    { url: u("/about"), changeFrequency: "monthly", priority: 0.6 },
    { url: u("/contact"), changeFrequency: "yearly", priority: 0.4 },
    { url: u("/delivery"), changeFrequency: "yearly", priority: 0.3 },
  ];
}
