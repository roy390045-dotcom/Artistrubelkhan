import Link from "next/link";
import { ArtworkCard } from "@/components/artwork-card";
import { searchArtworks } from "@/lib/api";
import { filtersToQuery } from "@/lib/filters";
import type { ShopFilters } from "@/lib/types";

/** Server-rendered result grid with numbered pagination links (crawlable, no infinite scroll). */
export async function ShopResults({ filters, basePath }: { filters: ShopFilters & { q?: string }; basePath: string }) {
  const result = await searchArtworks(filters);
  const query = (page: number) =>
    filtersToQuery({
      q: filters.q,
      medium: filters.medium,
      collection: basePath.startsWith("/collections") ? undefined : filters.collection,
      availability: filters.availability,
      min: filters.minPrice,
      max: filters.maxPrice,
      sort: filters.sort,
      page: page > 1 ? page : undefined,
    });

  if (result.total === 0) {
    return (
      <div className="grid justify-items-start gap-4 py-20">
        <p className="t-h3">No paintings match these filters.</p>
        <p className="text-muted">Try another price band or include sold works.</p>
        <Link href={basePath} className="btn btn--outline mt-2">
          Clear the filters
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="t-small mt-6 mb-8 text-muted" aria-live="polite">
        {result.total} {result.total === 1 ? "work" : "works"}
        {filters.q ? ` for “${filters.q}”` : ""}
      </p>
      <ul className="grid grid-cols-2 gap-x-6 gap-y-14 max-sm:gap-x-3 max-sm:gap-y-10 md:grid-cols-3 xl:grid-cols-4">
        {result.items.map((a, i) => (
          <li key={a.id}>
            <ArtworkCard artwork={a} priority={i < 2} />
          </li>
        ))}
      </ul>
      {result.pageCount > 1 && (
        <nav aria-label="Pages" className="mt-16 flex flex-wrap items-center gap-2">
          {Array.from({ length: result.pageCount }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`${basePath}${query(p)}`}
              aria-current={p === result.page ? "page" : undefined}
              className={`grid size-11 place-items-center rounded-[var(--r-sm)] border tabular ${
                p === result.page ? "border-ink bg-ink text-paper" : "border-line-strong"
              }`}
            >
              {p}
            </Link>
          ))}
        </nav>
      )}
    </>
  );
}

export function ResultsSkeleton() {
  return (
    <ul aria-hidden="true" className="mt-14 grid grid-cols-2 gap-x-6 gap-y-14 max-sm:gap-x-3 md:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }, (_, i) => (
        <li key={i} className="grid gap-4">
          <div className="aspect-[5/4] animate-pulse rounded-[2px] bg-surface" />
          <div className="h-4 w-3/4 rounded bg-surface" />
          <div className="h-3 w-1/2 rounded bg-surface" />
        </li>
      ))}
    </ul>
  );
}
