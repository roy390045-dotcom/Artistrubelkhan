"use client";

import { useState, ViewTransition } from "react";
import { Maximize2 } from "lucide-react";
import type { ImageAsset } from "@/lib/types";
import { ArtImage } from "../art-image";
import { Sheet } from "../sheet";
import { BrushSwash } from "../art/brush-swash";

/**
 * The artwork, whole and large. A click opens it full screen; there a click toggles a
 * 2x zoom that follows the pointer (phones pinch-zoom natively).
 */
export function ArtworkViewer({ images, title, slug }: { images: ImageAsset[]; title: string; slug: string }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const current = images[index];

  return (
    <div className="relative isolate grid gap-4">
      <BrushSwash variant="rise" trigger="load" bleedX={6} bleedY={16} />
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative block aspect-[6/5] w-full cursor-zoom-in"
        aria-label={`View ${title} full screen`}
      >
        <ViewTransition name={`art-${slug}`} share="morph" default="none">
          <div className="art-frame art-frame--center absolute inset-0">
            <ArtImage image={current} sizes="(max-width: 1023px) 100vw, 60vw" priority />
          </div>
        </ViewTransition>
        <span className="absolute right-3 bottom-3 grid size-10 place-items-center rounded-full bg-bg/90 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100">
          <Maximize2 size={16} aria-hidden="true" />
        </span>
      </button>

      {images.length > 1 && (
        <ul className="flex gap-3" aria-label="More views">
          {images.map((img, i) => (
            <li key={img.id}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-current={i === index}
                aria-label={`View ${i + 1} of ${images.length}`}
                className={`art-frame art-frame--center block size-20 border ${i === index ? "border-ink" : "border-transparent"}`}
              >
                <ArtImage image={img} sizes="80px" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Sheet
        open={open}
        onClose={() => {
          setOpen(false);
          setZoom(false);
        }}
        label={`${title}, full screen`}
        title={title}
        side="full"
      >
        <button
          type="button"
          aria-pressed={zoom}
          aria-label={zoom ? "Zoom out" : "Zoom in to twice the size"}
          className={`relative block h-full w-full overflow-hidden ${zoom ? "cursor-zoom-out" : "cursor-zoom-in"}`}
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
            setZoom((z) => !z);
          }}
          onMouseMove={(e) => {
            if (!zoom) return;
            const r = e.currentTarget.getBoundingClientRect();
            setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
          }}
        >
          <div
            className="art-frame art-frame--center absolute inset-6 transition-transform duration-300 ease-[var(--ease)]"
            style={{ transform: zoom ? "scale(2)" : "none", transformOrigin: origin }}
          >
            <ArtImage image={current} sizes="100vw" />
          </div>
          <p className="t-small pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-bg/90 px-3 py-1 text-muted max-md:hidden">
            {zoom ? "Click to zoom out" : "Click to zoom in"}
          </p>
        </button>
      </Sheet>
    </div>
  );
}
