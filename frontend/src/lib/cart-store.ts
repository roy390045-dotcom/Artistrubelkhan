"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Artwork, ImageAsset, Money } from "./types";

/**
 * Client cart. Each line keeps a display snapshot (title, price, image) so the drawer
 * renders without a round trip. The snapshot is for display only: at checkout the
 * server re-reads every price and stock level from the database and recalculates
 * every total. Nothing here is ever trusted for money.
 */
export interface CartItem {
  artworkId: number;
  slug: string;
  title: string;
  medium: string;
  price: Money;
  image: ImageAsset;
  quantity: number;
  maxQuantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  add: (a: Artwork) => void;
  setQuantity: (artworkId: number, quantity: number) => void;
  remove: (artworkId: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      add: (a) =>
        set((s) => {
          const max = a.editionType === "original" ? 1 : Math.max(1, a.stockQty);
          const existing = s.items.find((i) => i.artworkId === a.id);
          if (existing) {
            return {
              isOpen: true,
              items: s.items.map((i) =>
                i.artworkId === a.id ? { ...i, quantity: Math.min(max, i.quantity + 1) } : i,
              ),
            };
          }
          return {
            isOpen: true,
            items: [
              ...s.items,
              {
                artworkId: a.id,
                slug: a.slug,
                title: a.title,
                medium: a.medium,
                price: a.price,
                image: a.images[0],
                quantity: 1,
                maxQuantity: max,
              },
            ],
          };
        }),
      setQuantity: (artworkId, quantity) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.artworkId === artworkId ? { ...i, quantity: Math.min(i.maxQuantity, Math.max(1, quantity)) } : i,
          ),
        })),
      remove: (artworkId) => set((s) => ({ items: s.items.filter((i) => i.artworkId !== artworkId) })),
      clear: () => set({ items: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
    }),
    {
      name: "rk-cart",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ items: s.items }),
    },
  ),
);

export function cartSubtotal(items: CartItem[]): Money {
  return { amount: items.reduce((sum, i) => sum + i.price.amount * i.quantity, 0), currency: "BDT" };
}

export function cartCount(items: CartItem[]) {
  return items.reduce((n, i) => n + i.quantity, 0);
}
