"use client";

import { lazy, Suspense } from "react";
import { MessageCircle } from "lucide-react";
import { useEnquiry } from "@/lib/enquiry-store";
import { whatsappHref } from "@/lib/site";
import { Sheet } from "./sheet";

// The form (react-hook-form + zod) loads only when the sheet first opens, so it is not
// part of every page's JavaScript.
const EnquiryForm = lazy(() => import("./enquiry-form").then((m) => ({ default: m.EnquiryForm })));

/** The floating enquiry button (the reference site's side tab + WhatsApp, as one control). */
export function EnquiryDock() {
  const { isOpen, artwork, open, close } = useEnquiry();
  const wa = whatsappHref(artwork ? `Hello, I would like to ask about "${artwork}".` : "Hello, I would like to ask about a painting.");

  return (
    <>
      <button
        type="button"
        onClick={() => open()}
        aria-label="Ask a question"
        className="enquiry-dock btn btn--primary btn--noarrow fixed right-[max(16px,env(safe-area-inset-right))] bottom-[max(16px,env(safe-area-inset-bottom))] z-30 gap-2 rounded-full shadow-[0_10px_30px_-12px_rgb(24_23_21/0.6)] ring-1 ring-[color-mix(in_oklab,var(--p-paper)_22%,transparent)] max-sm:size-12 max-sm:!px-0 sm:!px-5"
      >
        <MessageCircle size={18} strokeWidth={1.8} aria-hidden="true" />
        <span className="max-sm:sr-only">Ask a question</span>
      </button>
      <Sheet open={isOpen} onClose={close} label="Ask about a painting">
        <div className="grid gap-6 px-6 py-8">
          <p className="text-muted">Ask about a painting, a size, framing or delivery. Replies come by email.</p>
          {wa && (
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn--outline justify-self-start">
              Message on WhatsApp
            </a>
          )}
          {isOpen && (
            <Suspense fallback={<div className="h-80 animate-pulse rounded-[var(--r-sm)] bg-surface" aria-busy="true" />}>
              <EnquiryForm key={artwork} artwork={artwork} />
            </Suspense>
          )}
        </div>
      </Sheet>
    </>
  );
}
