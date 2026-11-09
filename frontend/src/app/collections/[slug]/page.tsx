import Loading from "./loading";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FilterBar } from "@/components/shop/filter-bar";
import { ResultsSkeleton, ShopResults } from "@/components/shop/results";
import { getCategories, getCollections } from "@/lib/api";
import { parseFilters } from "@/lib/filters";

export async function generateStaticParams() {
  return (await getCollections()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(props: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const col = (await getCollections()).find((c) => c.slug === slug);
  if (!col) return {};
  return {
    title: col.seo?.metaTitle ?? `${col.name}: paintings and prints`,
    description: col.seo?.metaDescription ?? `${col.description} Originals and prints by Rubel Khan.`,
    alternates: { canonical: `/collections/${col.slug}` },
  };
}

async function CollectionPageContent(props: PageProps<"/collections/[slug]">) {
  const { slug } = await props.params;
  const col = (await getCollections()).find((c) => c.slug === slug);
  if (!col) notFound();

  return (
    <div className="wrap pt-10 pb-24">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Collections", href: "/collections" }, { label: col.name }]} />
      <div className="mt-6 mb-10 grid gap-4 md:grid-cols-12 md:items-end">
        <h1 className="t-h1 md:col-span-7">{col.name}</h1>
        <p className="t-lead text-muted md:col-span-4 md:col-start-9">{col.description}</p>
      </div>
      <Suspense fallback={<ResultsSkeleton />}>
        <CollectionBody slug={col.slug} searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}

async function CollectionBody({ slug, searchParams }: { slug: string; searchParams: PageProps<"/collections/[slug]">["searchParams"] }) {
  const [raw, categories] = await Promise.all([searchParams, getCategories()]);
  const filters = { ...parseFilters(raw), collection: slug };
  return (
    <>
      <FilterBar
        action={`/collections/${slug}`}
        categories={categories}
        values={{
          medium: filters.medium,
          availability: filters.availability,
          min: filters.minPrice,
          max: filters.maxPrice,
          sort: filters.sort,
        }}
      />
      <ShopResults filters={filters} basePath={`/collections/${slug}`} />
    </>
  );
}

/** Params are read inside Suspense so navigation shows the loading shell at once (instant navigation). */
export default function CollectionPage(props: PageProps<"/collections/[slug]">) {
  return (
    <Suspense fallback={<Loading />}>
      <CollectionPageContent {...props} />
    </Suspense>
  );
}
