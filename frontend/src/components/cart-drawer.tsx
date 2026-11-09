"use client";

import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { cartCount, cartSubtotal, useCart, type CartItem } from "@/lib/cart-store";
import { formatMoney } from "@/lib/format";
import { ArtImage } from "./art-image";
import { Sheet } from "./sheet";

const subscribeNoop = () => () => {};

export function CartDrawer() {
  const { items, isOpen, close, remove, restore, setQuantity } = useCart();
  const hydrated = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const [removed, setRemoved] = useState<CartItem | null>(null);
  const list = hydrated ? items : [];
  const count = cartCount(list);

  const removeWithUndo = (item: CartItem) => {
    setRemoved(item);
    remove(item.artworkId);
  };

  const undoBar = removed && (
    <div className="mx-6 mt-4 flex items-center justify-between gap-4 rounded-[var(--r-sm)] bg-surface px-4 py-2" role="status">
      <p className="t-small">Removed {removed.title}.</p>
      <button
        type="button"
        className="link t-small min-h-11 font-medium"
        onClick={() => {
          restore(removed);
          setRemoved(null);
        }}
      >
        Undo
      </button>
    </div>
  );

  return (
    <Sheet
      open={isOpen}
      onClose={() => {
        setRemoved(null);
        close();
      }}
      label="Cart"
      title={count ? `Cart (${count})` : "Cart"}
    >
      {undoBar}
      {list.length === 0 ? (
        <div className="grid gap-4 px-6 py-10">
          <p className="t-lead">Your cart is empty.</p>
          <p className="text-muted">Originals are one of one, so they leave the shop once someone buys them.</p>
          <Link href="/shop?availability=available" onClick={close} className="btn btn--primary mt-2 justify-self-start">
            See available paintings
          </Link>
        </div>
      ) : (
        <div className="flex h-full flex-col">
          <ul className="flex-1 divide-y divide-line px-6">
            {list.map((i) => (
              <li key={i.artworkId} className="grid grid-cols-[88px_1fr] gap-4 py-5">
                <Link href={`/artwork/${i.slug}`} onClick={close} className="art-frame art-frame--center aspect-square">
                  <ArtImage image={i.image} sizes="88px" />
                </Link>
                <div className="grid content-start gap-1">
                  <Link href={`/artwork/${i.slug}`} onClick={close} className="font-medium leading-snug">
                    {i.title}
                  </Link>
                  <p className="t-small text-muted">{i.medium}</p>
                  <p className="tabular">{formatMoney(i.price)}</p>
                  <div className="mt-2 flex items-center gap-4">
                    {i.maxQuantity > 1 ? (
                      <div className="flex items-center rounded-[var(--r-sm)] border border-line-strong" role="group" aria-label={`Quantity of ${i.title}`}>
                        <button
                          type="button"
                          className="grid size-11 place-items-center disabled:opacity-40"
                          onClick={() => setQuantity(i.artworkId, i.quantity - 1)}
                          disabled={i.quantity <= 1}
                          aria-label="One fewer"
                        >
                          <Minus size={16} aria-hidden="true" />
                        </button>
                        <output className="w-6 text-center tabular" aria-live="polite">
                          {i.quantity}
                        </output>
                        <button
                          type="button"
                          className="grid size-11 place-items-center disabled:opacity-40"
                          onClick={() => setQuantity(i.artworkId, i.quantity + 1)}
                          disabled={i.quantity >= i.maxQuantity}
                          aria-label="One more"
                        >
                          <Plus size={16} aria-hidden="true" />
                        </button>
                      </div>
                    ) : (
                      <p className="t-small text-muted">Original, one of one</p>
                    )}
                    <button type="button" onClick={() => removeWithUndo(i)} className="link t-small min-h-11">
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="sticky bottom-0 grid gap-3 border-t border-line bg-bg px-6 pt-5 pb-[max(20px,env(safe-area-inset-bottom))]">
            <div className="flex items-baseline justify-between">
              <span>Subtotal</span>
              <span className="text-[20px] font-medium tabular">{formatMoney(cartSubtotal(list))}</span>
            </div>
            <p className="t-small text-muted">Delivery and payment are on the next step. Prices are checked again before you pay.</p>
            <Link href="/checkout" onClick={close} className="btn btn--primary btn--block">
              Go to checkout
            </Link>
          </div>
        </div>
      )}
    </Sheet>
  );
}
