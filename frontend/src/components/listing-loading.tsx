import { ResultsSkeleton } from "./shop/results";

/** Shared loading shell for listing routes (category, collection). */
export function ListingLoading() {
  return (
    <div className="wrap pt-10 pb-24" aria-busy="true" aria-label="Loading paintings">
      <div className="h-4 w-48 rounded bg-surface" />
      <div className="mt-6 mb-10 h-16 w-2/3 max-w-xl rounded bg-surface" />
      <div className="h-20 border-y border-line" />
      <ResultsSkeleton />
    </div>
  );
}
