"use client";

import { MessageCircle } from "lucide-react";
import { useEnquiry } from "@/lib/enquiry-store";
import { whatsappHref } from "@/lib/site";
import { EnquiryForm } from "./enquiry-form";
import { Sheet } from "./sheet";

/** The floating enquiry button (the reference site's side tab + WhatsApp, as one control). */
export function EnquiryDock() {
  const { isOpen, artwork, open, close } = useEnquiry();
  const wa = whatsappHref(artwork ? `Hello, I would like to ask about "${artwork}".` : "Hello, I would like to ask about a painting.");

  return (
    <>
      <button
        type="button"
        onClick={() => open()}
        className="enquiry-dock btn btn--primary btn--noarrow fixed right-[max(16px,env(safe-area-inset-right))] bottom-[max(16px,env(safe-area-inset-bottom))] z-30 gap-2 rounded-full !px-5 shadow-[0_10px_30px_-12px_rgb(24_23_21/0.6)]"
      >
        <MessageCircle size={18} strokeWidth={1.8} aria-hidden="true" />
        Ask a question
      </button>
      <Sheet open={isOpen} onClose={close} label="Ask about a painting">
        <div className="grid gap-6 px-6 py-8">
          <p className="text-muted">Ask about a painting, a size, framing or delivery. Replies come by email.</p>
          {wa && (
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn--outline justify-self-start">
              Message on WhatsApp
            </a>
          )}
          <EnquiryForm key={artwork} artwork={artwork} />
        </div>
      </Sheet>
    </>
  );
}
