import Link from "next/link";
import type { Artwork } from "@/lib/types";
import { formatSize } from "@/lib/format";
import { ArtImage } from "./art-image";
import { Price } from "./price";

interface Props {
  artwork: Artwork;
  sizes?: string;
  priority?: boolean;
}

/**
 * One card style for every artwork on the site. The painting sits on a shared baseline in
 * a 5:4 box, never cropped; title, medium and size, then price and availability.
 */
export function ArtworkCard({ artwork: a, sizes = "(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 25vw", priority }: Props) {
  return (
    <Link href={`/artwork/${a.slug}`} className="m-card group">
      <div className="m-zoom art-frame aspect-[5/4]">
        <ArtImage image={a.images[0]} sizes={sizes} priority={priority} />
      </div>
      <div className="mt-4 grid gap-1">
        <h3 className="m-card__title font-sans text-[length:var(--t-card)] leading-snug font-medium tracking-normal">
          {a.title}
        </h3>
        <p className="text-[length:var(--t-small)] text-muted">
          {a.medium}, {formatSize(a)}
        </p>
        <Price artwork={a} className="mt-1" />
      </div>
    </Link>
  );
}
