import type { Artwork, Money } from "./types";

const formatters = new Map<string, Intl.NumberFormat>();

function formatter(currency: string) {
  let f = formatters.get(currency);
  if (!f) {
    f = new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency,
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: 0,
    });
    formatters.set(currency, f);
  }
  return f;
}

/** ৳45,000 from { amount: 4500000, currency: "BDT" }. */
export function formatMoney(m: Money) {
  return formatter(m.currency).format(m.amount / 100);
}

export function formatSize(a: Pick<Artwork, "width" | "height" | "dimensionUnit">) {
  const unit = a.dimensionUnit === "in" ? "in" : "cm";
  return `${a.width} × ${a.height} ${unit}`;
}

export function formatSizeMetric(a: Pick<Artwork, "width" | "height" | "dimensionUnit">) {
  if (a.dimensionUnit === "cm") return formatSize(a);
  const cm = (n: number) => Math.round(n * 2.54);
  return `${cm(a.width)} × ${cm(a.height)} cm`;
}

export function availabilityLabel(a: Pick<Artwork, "status" | "editionType" | "stockQty" | "editionSize">) {
  switch (a.status) {
    case "sold":
      return "Sold";
    case "not_for_sale":
      return "Not for sale";
    case "reserved":
      return "Reserved";
    default:
      if (a.editionType === "limited_print" && a.editionSize) return `${a.stockQty} of ${a.editionSize} left`;
      return "Available";
  }
}

export function editionLabel(a: Pick<Artwork, "editionType" | "editionSize">) {
  switch (a.editionType) {
    case "limited_print":
      return a.editionSize ? `Limited edition of ${a.editionSize}` : "Limited edition";
    case "open_print":
      return "Open edition print";
    case "digital":
      return "Digital download";
    default:
      return "Original, one of one";
  }
}

const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });
export function formatDate(iso: string) {
  return dateFmt.format(new Date(iso));
}

export function formatDateRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const sameYear = s.getFullYear() === e.getFullYear();
  const startFmt = new Intl.DateTimeFormat("en-GB", sameYear ? { day: "numeric", month: "long" } : { day: "numeric", month: "long", year: "numeric" });
  return `${startFmt.format(s)} to ${dateFmt.format(e)}`;
}
