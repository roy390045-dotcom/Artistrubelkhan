"use client";

import { useSyncExternalStore } from "react";
import { useCart } from "@/lib/cart-store";
import { useEnquiry } from "@/lib/enquiry-store";
import type { Artwork } from "@/lib/types";

const subscribeNoop = () => () => {};

/** The artwork's main action: Add to cart when it can be bought, otherwise an enquiry. */
export function AddToCart({ artwork }: { artwork: Artwork }) {
  const add = useCart((s) => s.add);
  const openCart = useCart((s) => s.open);
  const inCart = useCart((s) => s.items.some((i) => i.artworkId === artwork.id));
  const openEnquiry = useEnquiry((s) => s.open);
  const hydrated = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const purchasable = artwork.status === "available" && artwork.stockQty > 0;
  const isOriginal = artwork.editionType === "original";

  if (!purchasable) {
    return (
      <div className="grid gap-3">
        <button type="button" className="btn btn--primary btn--block" onClick={() => openEnquiry(artwork.title)}>
          Ask about similar work
        </button>
        <p className="t-small text-muted">
          {artwork.status === "sold" ? "This painting has found a home." : "This work is in the artist's own collection."} Commissions and
          similar subjects can be discussed by enquiry.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {hydrated && inCart && isOriginal ? (
        <button type="button" className="btn btn--primary btn--block" onClick={openCart}>
          In your cart: view cart
        </button>
      ) : (
        <button type="button" className="btn btn--primary btn--block" onClick={() => add(artwork)}>
          Add to cart
        </button>
      )}
      <button type="button" className="btn btn--outline btn--block" onClick={() => openEnquiry(artwork.title)}>
        Ask about this painting
      </button>
    </div>
  );
}
