import Link from "next/link";
import { ViewTransition } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Artwork } from "@/lib/types";
import { formatSize } from "@/lib/format";
import { ArtImage } from "./art-image";
import { Price } from "./price";

interface Props {
  artwork: Artwork;
  sizes?: string;
  priority?: boolean;
  /** Position in its grid: staggers the scroll-driven entrance. */
  index?: number;
}

/**
 * One card style for every artwork. The painting sits whole on a shared baseline in a 5:4 box.
 * Motion: the card rises into place as it scrolls in (CSS view timeline), a paper mat and a
 * "View painting" label appear on hover, and the image carries a view-transition name so
 * opening the painting morphs it into the artwork page's large view.
 */
export function ArtworkCard({ artwork: a, sizes = "(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 25vw", priority, index = 0 }: Props) {
  return (
    // prefetch={true} loads the painting's static page (params included) ahead of the click, so it
    // renders in the same commit as the navigation and the shared-element morph can pair.
    <Link href={`/artwork/${a.slug}`} prefetch={true} className="m-card group rise" style={{ "--i": index % 4 } as React.CSSProperties}>
      <div className="card-mat -mx-[18px] -mt-[18px] rounded-[var(--r-md)] max-sm:-mx-2 max-sm:-mt-2 max-sm:p-2">
        <ViewTransition name={`art-${a.slug}`} share="morph" default="none">
          <div className="m-zoom art-frame aspect-[5/4]">
            <ArtImage image={a.images[0]} sizes={sizes} priority={priority} />
          </div>
        </ViewTransition>
        <span className="card-cta max-sm:hidden" aria-hidden="true">
          View painting <ArrowUpRight size={14} />
        </span>
      </div>
      <div className="mt-3 grid gap-1">
        <h3 className="m-card__title font-sans text-[length:var(--t-card)] leading-snug font-medium tracking-normal">{a.title}</h3>
        <p className="text-[length:var(--t-small)] text-muted">
          {a.medium}, {formatSize(a)}
        </p>
        <Price artwork={a} className="mt-1" />
      </div>
    </Link>
  );
}
