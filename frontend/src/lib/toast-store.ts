"use client";

import { create } from "zustand";
import type { ImageAsset } from "./types";

export type ToastTone = "added" | "removed" | "info";

export interface Toast {
  id: number;
  tone: ToastTone;
  title: string;
  body?: string;
  image?: ImageAsset;
  action?: { label: string; run: () => void };
  leaving?: boolean;
}

interface ToastState {
  toasts: Toast[];
  show: (t: Omit<Toast, "id">) => void;
  dismiss: (id: number) => void;
}

let seq = 0;
const LIFETIME = 4200;
const EXIT = 240;

/** One toast at a time on screen; a new one replaces the old (no stacking pile-up). */
export const useToasts = create<ToastState>()((set, get) => ({
  toasts: [],
  show: (t) => {
    const id = ++seq;
    set({ toasts: [{ ...t, id }] });
    window.setTimeout(() => get().dismiss(id), LIFETIME);
  },
  dismiss: (id) => {
    set((s) => ({ toasts: s.toasts.map((x) => (x.id === id ? { ...x, leaving: true } : x)) }));
    window.setTimeout(() => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })), EXIT);
  },
}));
