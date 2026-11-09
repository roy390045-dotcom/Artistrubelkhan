"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Check, MessageCircle, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { useEnquiry } from "@/lib/enquiry-store";
import { useToasts } from "@/lib/toast-store";
import type { Artwork } from "@/lib/types";

const subscribeNoop = () => () => {};

/**
 * The artwork's main action. Adding gives three answers at once: the button turns green with
 * a tick for 1.6 s, the cart badge pops, and a toast shows the painting with a link to the cart.
 * Sold or not-for-sale works offer an enquiry instead.
 */
export function AddToCart({ artwork }: { artwork: Artwork }) {
  const add = useCart((s) => s.add);
  const openCart = useCart((s) => s.open);
  const inCart = useCart((s) => s.items.some((i) => i.artworkId === artwork.id));
  const openEnquiry = useEnquiry((s) => s.open);
  const toast = useToasts((s) => s.show);
  const hydrated = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const [justAdded, setJustAdded] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const purchasable = artwork.status === "available" && artwork.stockQty > 0;
  const isOriginal = artwork.editionType === "original";

  if (!purchasable) {
    return (
      <div className="grid gap-3">
        <button type="button" className="btn btn--primary btn--noarrow btn--block" onClick={() => openEnquiry(artwork.title)}>
          <MessageCircle size={18} aria-hidden="true" />
          Ask about similar work
        </button>
        <p className="t-small text-muted">
          {artwork.status === "sold" ? "This painting has found a home." : "This work stays in the studio."} Similar subjects and commissions can
          be discussed by enquiry.
        </p>
      </div>
    );
  }

  const onAdd = () => {
    add(artwork, { open: false });
    setJustAdded(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setJustAdded(false), 1600);
    toast({
      tone: "added",
      title: "Added to your cart",
      body: artwork.title,
      image: artwork.images[0],
      action: { label: "View cart", run: openCart },
    });
  };

  const showInCart = hydrated && inCart && isOriginal && !justAdded;

  return (
    <div className="grid gap-3">
      {showInCart ? (
        <button type="button" className="btn btn--outline btn--block" onClick={openCart}>
          <Check size={18} className="text-success" aria-hidden="true" />
          In your cart, view cart
        </button>
      ) : (
        <button
          type="button"
          className={`btn btn--primary btn--noarrow btn--block ${justAdded ? "!bg-success" : ""}`}
          onClick={onAdd}
          aria-live="polite"
        >
          <span className="relative grid size-5 place-items-center" aria-hidden="true">
            <ShoppingBag
              size={18}
              className={`absolute transition-[opacity,transform] duration-200 ${justAdded ? "scale-50 opacity-0" : "opacity-100"}`}
            />
            <Check size={19} className={`absolute transition-[opacity,transform] duration-200 ${justAdded ? "opacity-100" : "scale-50 opacity-0"}`} />
          </span>
          {justAdded ? "Added to cart" : "Add to cart"}
        </button>
      )}
      <button type="button" className="btn btn--outline btn--block" onClick={() => openEnquiry(artwork.title)}>
        <MessageCircle size={18} aria-hidden="true" />
        Ask about this painting
      </button>
    </div>
  );
}
