import { getCategories, getCollections, getNewArrivals } from "@/lib/api";
import { getByCollection } from "@/lib/api";
import { HeaderNav } from "./site-header-nav";

export async function SiteHeader() {
  const [categories, collections, arrivals] = await Promise.all([getCategories(), getCollections(), getNewArrivals(2)]);
  const collectionCovers = await Promise.all(
    collections.map(async (c) => ({ ...c, cover: (await getByCollection(c.slug, 1))[0]?.images[0] ?? null })),
  );
  return <HeaderNav categories={categories} collections={collectionCovers} arrivals={arrivals} />;
}
