"use client";

import { useRouter } from "next/navigation";
import { useRef, useTransition } from "react";
import type { Category, Collection } from "@/lib/types";
import { priceBands } from "@/lib/filters";

interface Props {
  action: string;
  categories?: Category[];
  collections?: Collection[];
  values: { medium?: string; collection?: string; availability?: string; min?: number; max?: number; sort?: string; q?: string };
}

/**
 * A plain GET form: it works without JavaScript (the Apply button submits it) and every
 * filtered view has its own crawlable URL. With JavaScript it applies on change.
 */
export function FilterBar({ action, categories, collections, values }: Props) {
  const router = useRouter();
  const form = useRef<HTMLFormElement>(null);
  const [pending, start] = useTransition();
  const band = priceBands.findIndex((b) => b.min === values.min && b.max === values.max);

  const apply = () => {
    const f = form.current;
    if (!f) return;
    const data = new FormData(f);
    const params = new URLSearchParams();
    const price = priceBands[Number(data.get("price") ?? 0)];
    for (const [k, v] of data) {
      if (k === "price" || typeof v !== "string" || !v) continue;
      params.set(k, v);
    }
    if (price?.min !== undefined) params.set("min", String(price.min));
    if (price?.max !== undefined) params.set("max", String(price.max));
    const qs = params.toString();
    start(() => router.push(`${action}${qs ? `?${qs}` : ""}`, { scroll: false }));
  };

  return (
    <form
      ref={form}
      action={action}
      method="get"
      role="search"
      aria-label="Filter paintings"
      onChange={apply}
      onSubmit={(e) => {
        e.preventDefault();
        apply();
      }}
      className="grid gap-4 border-y border-line py-5 sm:grid-cols-2 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto] lg:items-end"
      aria-busy={pending}
    >
      {categories && (
        <div className="field">
          <label htmlFor="f-medium">Medium</label>
          <select id="f-medium" name="medium" defaultValue={values.medium ?? ""} className="input">
            <option value="">All mediums</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      )}
      {collections && (
        <div className="field">
          <label htmlFor="f-collection">Collection</label>
          <select id="f-collection" name="collection" defaultValue={values.collection ?? ""} className="input">
            <option value="">All collections</option>
            {collections.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="field">
        <label htmlFor="f-price">Price</label>
        <select id="f-price" name="price" defaultValue={String(Math.max(0, band))} className="input">
          {priceBands.map((b, i) => (
            <option key={b.label} value={i}>
              {b.label}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="f-sort">Sort</label>
        <select id="f-sort" name="sort" defaultValue={values.sort ?? "newest"} className="input">
          <option value="newest">Newest first</option>
          <option value="price-asc">Price, low to high</option>
          <option value="price-desc">Price, high to low</option>
        </select>
      </div>
      <label className="flex min-h-12 cursor-pointer items-center gap-3 lg:justify-self-start">
        <input
          type="checkbox"
          name="availability"
          value="available"
          defaultChecked={values.availability === "available"}
          className="size-5 accent-[var(--ink)]"
        />
        <span className="text-[15px] whitespace-nowrap">Available only</span>
      </label>
      {values.q && <input type="hidden" name="q" value={values.q} />}
      <noscript>
        <button type="submit" className="btn btn--outline">
          Apply filters
        </button>
      </noscript>
    </form>
  );
}
