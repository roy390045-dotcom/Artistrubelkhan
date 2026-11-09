/**
 * The single data swap point. Pages and components only ever import from here.
 *
 * UI phase: reads the typed mocks in src/data. Phase 2: each function calls the FastAPI
 * backend over localhost (API_URL) with the same return types. Every public read is
 * cached with `use cache` + a tag, so FastAPI can revalidate exactly what changed by
 * calling POST /api/revalidate with the tag (HMAC-signed) after an admin edit.
 */
import { cacheLife, cacheTag } from "next/cache";
import { artworks, categories, collections, exhibitions, portfolio } from "@/data/catalog";
import type { Artwork, Paginated, ShopFilters } from "./types";

export const PAGE_SIZE = 12;

export async function getCategories() {
  "use cache";
  cacheLife("days");
  cacheTag("categories");
  return categories;
}

export async function getCollections() {
  "use cache";
  cacheLife("days");
  cacheTag("collections");
  return collections;
}

export async function getAllArtworks(): Promise<Artwork[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("artworks");
  return artworks;
}

export async function getArtwork(slug: string): Promise<Artwork | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("artworks", `artwork:${slug}`);
  return artworks.find((a) => a.slug === slug) ?? null;
}

export async function getArtworksByIds(ids: number[]): Promise<Artwork[]> {
  const all = await getAllArtworks();
  return ids.map((id) => all.find((a) => a.id === id)).filter((a): a is Artwork => Boolean(a));
}

export async function getNewArrivals(limit = 8) {
  const all = await getAllArtworks();
  return all
    .filter((a) => a.isNewArrival)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}

export async function getAvailable(limit = 8) {
  const all = await getAllArtworks();
  return all.filter((a) => a.status === "available").slice(0, limit);
}

export async function getByCategory(slug: string, limit = 8) {
  const [all, cats] = await Promise.all([getAllArtworks(), getCategories()]);
  const cat = cats.find((c) => c.slug === slug);
  return cat ? all.filter((a) => a.categoryId === cat.id).slice(0, limit) : [];
}

export async function getByCollection(slug: string, limit = 8) {
  const [all, cols] = await Promise.all([getAllArtworks(), getCollections()]);
  const col = cols.find((c) => c.slug === slug);
  return col ? all.filter((a) => a.collectionIds.includes(col.id)).slice(0, limit) : [];
}

export async function getRelated(artwork: Artwork, limit = 4) {
  const all = await getAllArtworks();
  const score = (a: Artwork) =>
    (a.categoryId === artwork.categoryId ? 2 : 0) + a.collectionIds.filter((id) => artwork.collectionIds.includes(id)).length;
  return all
    .filter((a) => a.id !== artwork.id)
    .sort((a, b) => score(b) - score(a) || Number(b.status === "available") - Number(a.status === "available"))
    .slice(0, limit);
}

/** Server-side filtering, sorting and paging, mirroring the FastAPI query params. */
export async function searchArtworks(filters: ShopFilters & { q?: string }): Promise<Paginated<Artwork>> {
  const [all, cats, cols] = await Promise.all([getAllArtworks(), getCategories(), getCollections()]);
  let items = all;
  if (filters.q) {
    // Phase 2: PostgreSQL full-text search (GIN index) with pg_trgm for typos.
    const words = filters.q.toLowerCase().split(/\s+/).filter(Boolean);
    items = items.filter((a) => {
      const hay = `${a.title} ${a.medium} ${a.description}`.toLowerCase();
      return words.every((w) => hay.includes(w));
    });
  }
  const category = filters.category ?? filters.medium;
  if (category) {
    filters = { ...filters, category };
  }
  if (filters.category) {
    const cat = cats.find((c) => c.slug === filters.category);
    items = cat ? items.filter((a) => a.categoryId === cat.id) : [];
  }
  if (filters.collection) {
    const col = cols.find((c) => c.slug === filters.collection);
    items = col ? items.filter((a) => a.collectionIds.includes(col.id)) : [];
  }
  if (filters.availability === "available") items = items.filter((a) => a.status === "available");
  if (filters.minPrice != null) items = items.filter((a) => a.price.amount >= filters.minPrice! * 100);
  if (filters.maxPrice != null) items = items.filter((a) => a.price.amount <= filters.maxPrice! * 100);

  const sorted = [...items];
  switch (filters.sort) {
    case "price-asc":
      sorted.sort((a, b) => a.price.amount - b.price.amount);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.price.amount - a.price.amount);
      break;
    default:
      sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  // Sold and not-for-sale works stay visible (they sell the artist) but after the available ones.
  const rank = (a: Artwork) => (a.status === "available" ? 0 : a.status === "reserved" ? 1 : 2);
  sorted.sort((a, b) => rank(a) - rank(b));

  const total = sorted.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(Math.max(1, filters.page ?? 1), pageCount);
  return {
    items: sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    page,
    pageSize: PAGE_SIZE,
    total,
    pageCount,
  };
}

export async function getPortfolio() {
  "use cache";
  cacheLife("days");
  cacheTag("portfolio");
  return portfolio.filter((p) => p.isPublished).sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getPortfolioProject(slug: string) {
  const all = await getPortfolio();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function getExhibitions() {
  "use cache";
  cacheLife("days");
  cacheTag("exhibitions");
  return [...exhibitions].sort((a, b) => b.startsAt.localeCompare(a.startsAt));
}
