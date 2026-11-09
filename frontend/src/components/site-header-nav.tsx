"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ChevronDown, Menu, ShoppingBag } from "lucide-react";
import type { Artwork, Category, Collection, ImageAsset } from "@/lib/types";
import { cartCount, useCart } from "@/lib/cart-store";
import { Logo } from "./mark";
import { ArtImage } from "./art-image";
import { Sheet } from "./sheet";

type CollectionWithCover = Collection & { cover: ImageAsset | null };
type PanelId = "paintings" | "collections";

interface Props {
  categories: Category[];
  collections: CollectionWithCover[];
  arrivals: Artwork[];
}

const words: { label: string; href: string; panel?: PanelId }[] = [
  { label: "Paintings", href: "/shop", panel: "paintings" },
  { label: "Collections", href: "/collections", panel: "collections" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Exhibitions", href: "/exhibitions" },
  { label: "About", href: "/about" },
];

const subscribeNoop = () => () => {};

export function HeaderNav({ categories, collections, arrivals }: Props) {
  const pathname = usePathname();
  const [panel, setPanel] = useState<PanelId | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const openTimer = useRef<number>(0);
  const closeTimer = useRef<number>(0);
  const items = useCart((s) => s.items);
  const openCart = useCart((s) => s.open);
  // The cart lives in localStorage: render 0 on the server and the first client pass.
  const hydrated = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const count = hydrated ? cartCount(items) : 0;

  const clearTimers = () => {
    window.clearTimeout(openTimer.current);
    window.clearTimeout(closeTimer.current);
  };
  const intendOpen = (id: PanelId) => {
    clearTimers();
    // with one panel open the next word swaps it at once; otherwise wait 150ms of intent
    if (panel) setPanel(id);
    else openTimer.current = window.setTimeout(() => setPanel(id), 150);
  };
  const intendClose = () => {
    clearTimers();
    closeTimer.current = window.setTimeout(() => setPanel(null), 120);
  };
  const closeAll = useCallback(() => {
    clearTimers();
    setPanel(null);
  }, []);

  useEffect(() => {
    // Close panels and the menu whenever the route changes.
    const id = window.setTimeout(() => {
      closeAll();
      setMenuOpen(false);
    }, 0);
    return () => window.clearTimeout(id);
  }, [pathname, closeAll]);

  useEffect(() => {
    if (!panel) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeAll();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [panel, closeAll]);

  const isCurrent = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-bg" onMouseLeave={intendClose}>
      <div className="wrap relative flex h-[var(--nav)] items-center gap-6">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Logo />

        <nav aria-label="Main" className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-7">
            {words.map((w) => (
              <li key={w.href} className="flex items-center" onMouseEnter={() => (w.panel ? intendOpen(w.panel) : intendClose())}>
                <Link
                  href={w.href}
                  className="navlink text-[15px] font-medium whitespace-nowrap"
                  aria-current={isCurrent(w.href) ? "page" : undefined}
                >
                  {w.label}
                </Link>
                {w.panel && (
                  <button
                    type="button"
                    className="ml-0.5 grid size-7 place-items-center rounded-[6px] text-muted hover:text-ink"
                    aria-expanded={panel === w.panel}
                    aria-controls={`panel-${w.panel}`}
                    aria-label={`Show ${w.label.toLowerCase()} menu`}
                    onClick={() => setPanel((p) => (p === w.panel ? null : w.panel!))}
                  >
                    <ChevronDown size={14} strokeWidth={1.8} aria-hidden="true" className={panel === w.panel ? "rotate-180" : ""} />
                  </button>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-6">
          <button
            type="button"
            onClick={openCart}
            className="relative grid size-11 place-items-center rounded-[var(--r-sm)] hover:bg-[color-mix(in_oklab,var(--ink)_7%,transparent)]"
            aria-label={count ? `Cart, ${count} ${count === 1 ? "item" : "items"}` : "Cart, empty"}
          >
            <ShoppingBag size={20} strokeWidth={1.6} aria-hidden="true" />
            {count > 0 && (
              <span className="absolute top-1.5 right-1 grid min-w-[18px] place-items-center rounded-full bg-ink px-1 text-[11px] leading-[18px] font-medium text-paper tabular">
                {count}
              </span>
            )}
          </button>
          <Link href="/shop?availability=available" className="btn btn--primary hidden sm:inline-flex">
            Buy a painting
          </Link>
          <button
            type="button"
            className="btn btn--outline size-11 !px-0 lg:hidden"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={20} strokeWidth={1.6} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Full-width flat panels (desktop): no shadow, only the ground and a 1px line. */}
      <div
        id="panel-paintings"
        className="nav-panel"
        data-open={panel === "paintings" || undefined}
        inert={panel !== "paintings"}
        onMouseEnter={clearTimers}
      >
        <div className="wrap grid grid-cols-12 gap-6 py-10">
          <div className="col-span-3">
            <p className="t-label mb-4 text-muted">By medium</p>
            <ul className="grid gap-3">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/shop/${c.slug}`} className="navlink text-[17px]">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-3">
            <p className="t-label mb-4 text-muted">Shop</p>
            <ul className="grid gap-3">
              <li>
                <Link href="/shop?availability=available" className="navlink text-[17px]">
                  Available now
                </Link>
              </li>
              <li>
                <Link href="/shop" className="navlink text-[17px]">
                  All paintings
                </Link>
              </li>
              <li>
                <Link href="/shop?sort=price-asc" className="navlink text-[17px]">
                  Under ৳10,000 first
                </Link>
              </li>
            </ul>
          </div>
          {arrivals.map((a) => (
            <Link key={a.id} href={`/artwork/${a.slug}`} className="m-card col-span-3">
              <div className="m-zoom art-frame aspect-[4/3]">
                <ArtImage image={a.images[0]} sizes="300px" />
              </div>
              <p className="m-card__title mt-3 text-[15px] font-medium">{a.title}</p>
              <p className="t-label text-muted">New arrival</p>
            </Link>
          ))}
        </div>
      </div>

      <div
        id="panel-collections"
        className="nav-panel"
        data-open={panel === "collections" || undefined}
        inert={panel !== "collections"}
        onMouseEnter={clearTimers}
      >
        <div className="wrap grid grid-cols-3 gap-6 py-10">
          {collections.map((c) => (
            <Link key={c.slug} href={`/collections/${c.slug}`} className="m-card">
              {c.cover && (
                <div className="m-zoom aspect-[16/10] overflow-hidden bg-surface">
                  <ArtImage image={c.cover} sizes="400px" fit="cover" imgClassName="h-full w-full" className="block h-full w-full" />
                </div>
              )}
              <p className="m-card__title mt-3 text-[17px] font-medium">{c.name}</p>
              <p className="text-[length:var(--t-small)] text-muted">{c.description}</p>
            </Link>
          ))}
        </div>
      </div>

      <Sheet open={menuOpen} onClose={() => setMenuOpen(false)} label="Menu" side="full">
        <nav aria-label="Mobile" className="wrap py-4">
          <ul className="divide-y divide-line">
            {words.map((w) => (
              <li key={w.href}>
                <Link
                  href={w.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-14 items-center font-display text-[26px]"
                  aria-current={isCurrent(w.href) ? "page" : undefined}
                >
                  {w.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="t-label mt-8 mb-3 text-muted">By medium</p>
          <ul className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/shop/${c.slug}`}
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex min-h-11 items-center rounded-full border border-line-strong px-4 text-[15px]"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/shop?availability=available" onClick={() => setMenuOpen(false)} className="btn btn--primary btn--block mt-8">
            Buy a painting
          </Link>
          <div className="mt-6 flex gap-6 text-[15px]">
            <Link href="/account" onClick={() => setMenuOpen(false)} className="link">
              Your account
            </Link>
            <Link href="/contact" onClick={() => setMenuOpen(false)} className="link">
              Contact
            </Link>
          </div>
        </nav>
      </Sheet>
    </header>
  );
}
