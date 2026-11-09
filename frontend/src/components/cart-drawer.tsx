"use client";

import Link from "next/link";
import { Lock, Minus, Plus, RotateCcw, ShoppingBag, Trash2 } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { cartCount, cartSubtotal, useCart, type CartItem } from "@/lib/cart-store";
import { formatMoney } from "@/lib/format";
import { ArtImage } from "./art-image";
import { Sheet } from "./sheet";

const subscribeNoop = () => () => {};
const LEAVE_MS = 260;

/**
 * The cart drawer. Lines slide in from the right; a removed line collapses out with a red
 * trash icon, and a notice offers Undo. Quantity steppers only appear for prints.
 */
export function CartDrawer() {
  const { items, isOpen, close, remove, restore, setQuantity } = useCart();
  const hydrated = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const [removed, setRemoved] = useState<CartItem | null>(null);
  const [leaving, setLeaving] = useState<number | null>(null);
  const list = hydrated ? items : [];
  const count = cartCount(list);

  const removeWithUndo = (item: CartItem) => {
    setLeaving(item.artworkId);
    window.setTimeout(() => {
      remove(item.artworkId);
      setLeaving(null);
      setRemoved(item);
    }, LEAVE_MS);
  };

  return (
    <Sheet
      open={isOpen}
      onClose={() => {
        setRemoved(null);
        close();
      }}
      label="Cart"
      title={count ? `Your cart (${count})` : "Your cart"}
    >
      {removed && (
        <div
          role="status"
          className="notice-in mx-6 mt-4 flex items-center justify-between gap-3 rounded-[var(--r-sm)] border-l-4 border-l-[var(--p-danger)] bg-[color-mix(in_oklab,var(--p-danger)_8%,var(--p-paper))] py-1 pr-2 pl-3"
        >
          <p className="t-small flex min-w-0 items-center gap-2">
            <Trash2 size={15} className="shrink-0 text-danger" aria-hidden="true" />
            <span className="truncate">Removed {removed.title}</span>
          </p>
          <button
            type="button"
            className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-[var(--r-sm)] px-2 text-[14px] font-medium hover:bg-[color-mix(in_oklab,var(--ink)_7%,transparent)]"
            onClick={() => {
              restore(removed);
              setRemoved(null);
            }}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Undo
          </button>
        </div>
      )}

      {list.length === 0 ? (
        <div className="grid justify-items-start gap-4 px-6 py-12">
          <span className="grid size-14 place-items-center rounded-full bg-surface text-muted">
            <ShoppingBag size={24} strokeWidth={1.5} aria-hidden="true" />
          </span>
          <p className="font-display text-[26px] leading-tight">Your cart is empty.</p>
          <p className="text-muted">Originals are one of one, so they leave the shop once someone buys them.</p>
          <Link href="/shop?availability=available" onClick={close} className="btn btn--primary mt-2">
            See available paintings
          </Link>
        </div>
      ) : (
        <div className="flex min-h-full flex-col">
          <ul className="flex-1 px-6">
            {list.map((i) => (
              <li key={i.artworkId} className="cart-line border-b border-line" data-leaving={leaving === i.artworkId || undefined}>
                <div>
                  <div className="grid grid-cols-[88px_1fr] gap-4 py-5">
                    <Link href={`/artwork/${i.slug}`} onClick={close} className="art-frame art-frame--center aspect-square">
                      <ArtImage image={i.image} sizes="88px" />
                    </Link>
                    <div className="grid content-start gap-1">
                      <div className="flex items-start justify-between gap-2">
                        <Link href={`/artwork/${i.slug}`} onClick={close} className="font-display text-[19px] leading-snug">
                          {i.title}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeWithUndo(i)}
                          aria-label={`Remove ${i.title} from the cart`}
                          className="-mt-2 -mr-2 grid size-11 shrink-0 place-items-center rounded-full text-muted transition-colors duration-150 hover:bg-[color-mix(in_oklab,var(--p-danger)_10%,transparent)] hover:text-danger"
                        >
                          <Trash2 size={17} aria-hidden="true" />
                        </button>
                      </div>
                      <p className="t-small text-muted">{i.medium}</p>
                      <div className="mt-2 flex items-center justify-between gap-3">
                        {i.maxQuantity > 1 ? (
                          <div className="flex items-center rounded-full border border-line-strong" role="group" aria-label={`Quantity of ${i.title}`}>
                            <button
                              type="button"
                              className="grid size-10 place-items-center rounded-full disabled:opacity-35"
                              onClick={() => setQuantity(i.artworkId, i.quantity - 1)}
                              disabled={i.quantity <= 1}
                              aria-label="One fewer"
                            >
                              <Minus size={15} aria-hidden="true" />
                            </button>
                            <output className="w-6 text-center tabular" aria-live="polite">
                              {i.quantity}
                            </output>
                            <button
                              type="button"
                              className="grid size-10 place-items-center rounded-full disabled:opacity-35"
                              onClick={() => setQuantity(i.artworkId, i.quantity + 1)}
                              disabled={i.quantity >= i.maxQuantity}
                              aria-label="One more"
                            >
                              <Plus size={15} aria-hidden="true" />
                            </button>
                          </div>
                        ) : (
                          <span className="pill pill--edition">Original, 1 of 1</span>
                        )}
                        <p className="font-medium tabular">{formatMoney({ amount: i.price.amount * i.quantity, currency: i.price.currency })}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="sticky bottom-0 grid gap-3 border-t border-line bg-[var(--p-paper)] px-6 pt-5 pb-[max(20px,env(safe-area-inset-bottom))]">
            <div className="flex items-baseline justify-between">
              <span>Subtotal</span>
              <span className="font-display text-[26px] tabular">{formatMoney(cartSubtotal(list))}</span>
            </div>
            <p className="t-small text-muted">Delivery is added at checkout. Prices are checked again on the server before you pay.</p>
            <Link href="/checkout" onClick={close} className="btn btn--primary btn--block">
              Go to checkout
            </Link>
            <p className="t-small flex items-center justify-center gap-1.5 text-muted">
              <Lock size={13} aria-hidden="true" /> bKash, Nagad, cards and international cards
            </p>
          </div>
        </div>
      )}
    </Sheet>
  );
}
