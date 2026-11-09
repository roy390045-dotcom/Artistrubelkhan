import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap grid min-h-[70svh] content-center justify-items-start gap-5 py-20">
      <p className="t-label text-muted">Page not found</p>
      <h1 className="t-h1 max-w-[16ch]">This page is not on the wall.</h1>
      <p className="t-lead max-w-[48ch] text-muted">The painting may have been renamed or the link may be old. The full catalogue is one click away.</p>
      <div className="flex flex-wrap gap-x-6 gap-y-3">
        <Link href="/shop" className="btn btn--primary">
          See all paintings
        </Link>
        <Link href="/" className="btn btn--secondary">
          Go to the home page
        </Link>
      </div>
    </div>
  );
}
