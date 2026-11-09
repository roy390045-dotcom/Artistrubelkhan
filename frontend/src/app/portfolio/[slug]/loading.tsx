export default function Loading() {
  return (
    <div className="wrap pt-10 pb-24" aria-busy="true" aria-label="Loading the series">
      <div className="h-4 w-48 rounded bg-surface" />
      <div className="mt-6 mb-16 h-16 w-2/3 max-w-xl rounded bg-surface" />
      <div className="grid gap-6 md:grid-cols-2">
        <div className="aspect-[4/3] animate-pulse bg-surface" />
        <div className="aspect-[4/3] animate-pulse bg-surface" />
      </div>
    </div>
  );
}
