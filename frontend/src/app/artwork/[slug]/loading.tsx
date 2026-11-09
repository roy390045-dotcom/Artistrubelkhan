export default function Loading() {
  return (
    <div className="wrap pt-8 pb-20" aria-busy="true" aria-label="Loading the painting">
      <div className="h-4 w-64 rounded bg-surface" />
      <div className="mt-8 grid gap-12 lg:grid-cols-12 lg:gap-6">
        <div className="aspect-[6/5] animate-pulse bg-surface lg:col-span-7" />
        <div className="grid content-start gap-5 lg:col-span-4 lg:col-start-9">
          <div className="h-10 w-4/5 rounded bg-surface" />
          <div className="h-5 w-3/5 rounded bg-surface" />
          <div className="mt-6 h-12 rounded bg-surface" />
          <div className="h-12 rounded bg-surface" />
        </div>
      </div>
    </div>
  );
}
