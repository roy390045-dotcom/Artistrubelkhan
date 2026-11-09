"use client";

import { create } from "zustand";

interface EnquiryState {
  isOpen: boolean;
  artwork: string;
  open: (artwork?: string) => void;
  close: () => void;
}

/** Lets any page open the enquiry sheet, optionally about one artwork. */
export const useEnquiry = create<EnquiryState>()((set) => ({
  isOpen: false,
  artwork: "",
  open: (artwork = "") => set({ isOpen: true, artwork }),
  close: () => set({ isOpen: false }),
}));
