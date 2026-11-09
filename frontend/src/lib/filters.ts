import type { ShopFilters } from "./types";

type Raw = Record<string, string | string[] | undefined>;

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() || undefined;
const int = (v: string | undefined) => {
  if (!v) return undefined;
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) && n >= 0 && n < 100_000_000 ? n : undefined;
};

/** Parses and whitelists URL params; anything unexpected is dropped, never passed on. */
export function parseFilters(raw: Raw): ShopFilters & { q?: string } {
  const sort = one(raw.sort);
  const availability = one(raw.availability);
  const q = one(raw.q);
  return {
    medium: one(raw.medium)?.slice(0, 40),
    collection: one(raw.collection)?.slice(0, 40),
    availability: availability === "available" ? "available" : undefined,
    minPrice: int(one(raw.min)),
    maxPrice: int(one(raw.max)),
    sort: sort === "price-asc" || sort === "price-desc" || sort === "newest" ? sort : undefined,
    page: int(one(raw.page)),
    q: q ? q.slice(0, 80) : undefined,
  };
}

/** Builds a shop URL from filters, keeping only set values. */
export function filtersToQuery(f: Record<string, string | number | undefined>) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(f)) if (v !== undefined && v !== "" && v !== null) p.set(k, String(v));
  const s = p.toString();
  return s ? `?${s}` : "";
}

export const priceBands = [
  { label: "Any price", min: undefined, max: undefined },
  { label: "Under ৳10,000", min: undefined, max: 10000 },
  { label: "৳10,000 to ৳30,000", min: 10000, max: 30000 },
  { label: "Over ৳30,000", min: 30000, max: undefined },
] as const;
