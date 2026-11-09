"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart-store";

/** Empties the local cart once the server has confirmed the order is paid. */
export function ClearCartOnSuccess() {
  const clear = useCart((s) => s.clear);
  useEffect(() => clear(), [clear]);
  return null;
}
