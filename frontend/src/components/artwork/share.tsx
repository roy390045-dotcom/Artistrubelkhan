"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";

/** Share links (plain URLs, no third-party scripts or trackers) and copy link. */
export function ShareLinks({ url, title, image }: { url: string; title: string; image: string }) {
  const [copied, setCopied] = useState(false);
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const links = [
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { label: "WhatsApp", href: `https://wa.me/?text=${t}%20${u}` },
    { label: "Pinterest", href: `https://pinterest.com/pin/create/button/?url=${u}&media=${encodeURIComponent(image)}&description=${t}` },
    { label: "X", href: `https://x.com/intent/post?url=${u}&text=${t}` },
  ];
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
      <span className="t-label text-muted">Share</span>
      {links.map((l) => (
        <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="navlink inline-flex min-h-11 items-center text-[15px]">
          {l.label}
        </a>
      ))}
      <button
        type="button"
        className="navlink inline-flex min-h-11 items-center gap-1.5 text-[15px]"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1800);
          } catch {
            /* clipboard blocked: the visible URL bar still works */
          }
        }}
      >
        {copied ? <Check size={15} aria-hidden="true" /> : <Link2 size={15} aria-hidden="true" />}
        <span aria-live="polite">{copied ? "Link copied" : "Copy link"}</span>
      </button>
    </div>
  );
}
