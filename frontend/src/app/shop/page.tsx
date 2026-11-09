import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FilterBar } from "@/components/shop/filter-bar";
import { ResultsSkeleton, ShopResults } from "@/components/shop/results";
import { getCategories, getCollections } from "@/lib/api";
import { parseFilters } from "@/lib/filters";

export const metadata: Metadata = {
  title: "Paintings and prints for sale",
  description: "Every original painting, sketch and limited-edition print by Rubel Khan, with prices in taka. Filter by medium, collection and price.",
  alternates: { canonical: "/shop" },
};

export default function ShopPage(props: PageProps<"/shop">) {
  return (
    <div className="wrap pt-10 pb-24">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Paintings" }]} />
      <div className="mt-6 mb-10 grid gap-4 md:grid-cols-12 md:items-end">
        <h1 className="t-h1 md:col-span-7">Paintings and prints</h1>
        <p className="t-lead text-muted md:col-span-4 md:col-start-9">
          Originals, sketches and numbered prints. Sold works stay listed so you can see the whole body of work.
        </p>
      </div>
      <Suspense fallback={<ResultsSkeleton />}>
        <ShopBody searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}

async function ShopBody({ searchParams }: { searchParams: PageProps<"/shop">["searchParams"] }) {
  const [raw, categories, collections] = await Promise.all([searchParams, getCategories(), getCollections()]);
  const filters = parseFilters(raw);
  return (
    <>
      <FilterBar
        action="/shop"
        categories={categories}
        collections={collections}
        values={{
          medium: filters.medium,
          collection: filters.collection,
          availability: filters.availability,
          min: filters.minPrice,
          max: filters.maxPrice,
          sort: filters.sort,
          q: filters.q,
        }}
      />
      <ShopResults filters={filters} basePath="/shop" />
    </>
  );
}
