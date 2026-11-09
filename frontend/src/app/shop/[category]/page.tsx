import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FilterBar } from "@/components/shop/filter-bar";
import { ResultsSkeleton, ShopResults } from "@/components/shop/results";
import { getCategories, getCollections } from "@/lib/api";
import { parseFilters } from "@/lib/filters";

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata(props: PageProps<"/shop/[category]">): Promise<Metadata> {
  const { category } = await props.params;
  const cat = (await getCategories()).find((c) => c.slug === category);
  if (!cat) return {};
  return {
    title: cat.seo?.metaTitle ?? `${cat.name} paintings for sale`,
    description: cat.seo?.metaDescription ?? `${cat.description} Original works by Rubel Khan, priced in taka.`,
    alternates: { canonical: `/shop/${cat.slug}` },
  };
}

export default async function CategoryPage(props: PageProps<"/shop/[category]">) {
  const { category } = await props.params;
  const cat = (await getCategories()).find((c) => c.slug === category);
  if (!cat) notFound();

  return (
    <div className="wrap pt-10 pb-24">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Paintings", href: "/shop" }, { label: cat.name }]} />
      <div className="mt-6 mb-10 grid gap-4 md:grid-cols-12 md:items-end">
        <h1 className="t-h1 md:col-span-7">{cat.name}</h1>
        <p className="t-lead text-muted md:col-span-4 md:col-start-9">{cat.description}</p>
      </div>
      <Suspense fallback={<ResultsSkeleton />}>
        <CategoryBody slug={cat.slug} searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}

async function CategoryBody({ slug, searchParams }: { slug: string; searchParams: PageProps<"/shop/[category]">["searchParams"] }) {
  const [raw, collections] = await Promise.all([searchParams, getCollections()]);
  const filters = { ...parseFilters(raw), category: slug, medium: undefined };
  return (
    <>
      <FilterBar
        action={`/shop/${slug}`}
        collections={collections}
        values={{
          collection: filters.collection,
          availability: filters.availability,
          min: filters.minPrice,
          max: filters.maxPrice,
          sort: filters.sort,
        }}
      />
      <ShopResults filters={filters} basePath={`/shop/${slug}`} />
    </>
  );
}
