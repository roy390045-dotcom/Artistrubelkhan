"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="wrap grid min-h-[70svh] content-center justify-items-start gap-5 py-20">
      <p className="t-label text-muted">Something went wrong</p>
      <h1 className="t-h1 max-w-[18ch]">This page did not load.</h1>
      <p className="t-lead max-w-[48ch] text-muted">It is a problem on our side, not yours. Try once more; your cart is kept.</p>
      <div className="flex flex-wrap gap-x-6 gap-y-3">
        <button type="button" onClick={reset} className="btn btn--primary">
          Load the page again
        </button>
        <Link href="/" className="btn btn--secondary">
          Go to the home page
        </Link>
      </div>
    </div>
  );
}
