"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  label: string;
  side?: "right" | "full";
  children: ReactNode;
  /** Shown in the sheet's top bar; the label is used when absent. */
  title?: ReactNode;
}

/**
 * Native <dialog> sheet: focus trap, Escape and the top layer come from the browser.
 * Opens with a 240ms slide (right) or fade (full) and closes in 160ms; under reduced
 * motion it simply appears. Clicking the backdrop closes it.
 */
export function Sheet({ open, onClose, label, side = "right", children, title }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const onCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };
    d.addEventListener("cancel", onCancel);
    return () => d.removeEventListener("cancel", onCancel);
  }, [onClose]);

  return (
    <dialog
      ref={ref}
      aria-label={label}
      data-side={side}
      className="sheet"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="sheet__panel">
        <div className="sheet__bar">
          <p className="font-display text-[22px] leading-none">{title ?? label}</p>
          <button type="button" onClick={onClose} className="sheet__close" aria-label="Close">
            <X size={20} strokeWidth={1.6} aria-hidden="true" />
          </button>
        </div>
        <div className="sheet__body">{children}</div>
      </div>
    </dialog>
  );
}
