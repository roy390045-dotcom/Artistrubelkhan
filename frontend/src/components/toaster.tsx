"use client";

import { CheckCircle2, Info, Trash2, X } from "lucide-react";
import { useToasts } from "@/lib/toast-store";
import { ArtImage } from "./art-image";

const tones = {
  added: { icon: CheckCircle2, color: "text-success", ring: "border-l-[var(--p-success)]" },
  removed: { icon: Trash2, color: "text-danger", ring: "border-l-[var(--p-danger)]" },
  info: { icon: Info, color: "text-ink", ring: "border-l-[var(--p-ink)]" },
} as const;

/** Bottom-left toast: rises from the bottom edge, leaves the same way, read out politely. */
export function Toaster() {
  const { toasts, dismiss } = useToasts();
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed bottom-[max(16px,env(safe-area-inset-bottom))] left-[max(16px,env(safe-area-inset-left))] z-50 w-[min(380px,calc(100vw-96px))]"
    >
      {toasts.map((t) => {
        const tone = tones[t.tone];
        const Icon = tone.icon;
        return (
          <div
            key={t.id}
            data-leaving={t.leaving || undefined}
            role="status"
            className={`toast pointer-events-auto grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-[var(--r-md)] border border-l-4 border-line ${tone.ring} bg-[var(--p-paper)] p-3 shadow-[0_18px_40px_-18px_rgb(27_33_64/0.45)]`}
          >
            {t.image ? (
              <div className="art-frame art-frame--center size-14">
                <ArtImage image={t.image} sizes="56px" />
              </div>
            ) : (
              <Icon size={22} className={tone.color} aria-hidden="true" />
            )}
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-[14px] font-medium">
                {t.image && <Icon size={15} className={tone.color} aria-hidden="true" />}
                {t.title}
              </p>
              {t.body && <p className="t-small truncate text-muted">{t.body}</p>}
              {t.action && (
                <button
                  type="button"
                  className="link mt-0.5 text-[14px] font-medium"
                  onClick={() => {
                    t.action!.run();
                    dismiss(t.id);
                  }}
                >
                  {t.action.label}
                </button>
              )}
            </div>
            <button type="button" onClick={() => dismiss(t.id)} aria-label="Dismiss" className="grid size-9 place-items-center rounded-full text-muted hover:bg-surface hover:text-ink">
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
