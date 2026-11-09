import type { Artwork } from "@/lib/types";
import { availabilityLabel, formatMoney } from "@/lib/format";

/** Price and availability as one line: "৳45,000", "৳10,000 ৳12,000 Sale", "Sold". */
export function Price({ artwork: a, className = "", size = "sm" }: { artwork: Artwork; className?: string; size?: "sm" | "lg" }) {
  const text = size === "lg" ? "text-[22px]" : "text-[length:var(--t-body)]";
  if (a.status === "sold" || a.status === "not_for_sale") {
    return (
      <p className={`flex items-center gap-2 ${className}`}>
        <span className="inline-flex items-center gap-1.5 text-[length:var(--t-small)] font-medium text-muted">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-[var(--p-danger)]" />
          {availabilityLabel(a)}
        </span>
      </p>
    );
  }
  const onSale = a.compareAtPrice && a.compareAtPrice.amount > a.price.amount;
  return (
    <p className={`flex flex-wrap items-baseline gap-x-2 tabular ${className}`}>
      <span className={`${text} font-medium`}>{formatMoney(a.price)}</span>
      {onSale && (
        <>
          <span className="sr-only">, was </span>
          <s className="text-[length:var(--t-small)] text-muted">{formatMoney(a.compareAtPrice!)}</s>
        </>
      )}
      {a.editionType === "limited_print" && (
        <span className="text-[length:var(--t-small)] text-muted">{availabilityLabel(a)}</span>
      )}
    </p>
  );
}
