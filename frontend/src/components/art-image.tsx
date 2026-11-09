import type { CSSProperties } from "react";
import type { ImageAsset } from "@/lib/types";

const srcset = (img: ImageAsset, ext: "avif" | "webp") =>
  img.widths.map((w) => `/art/${img.id}-${w}.${ext} ${w}w`).join(", ");

interface Props {
  image: ImageAsset;
  /** The rendered width, e.g. "(max-width: 639px) 100vw, 33vw". Always set it truthfully. */
  sizes: string;
  /** contain: never crop (artworks). cover: fill the frame (context photographs). */
  fit?: "contain" | "cover";
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  style?: CSSProperties;
}

/**
 * Serves the variants pre-built by scripts/build-images.mjs (AVIF first, WebP fallback),
 * with intrinsic width and height so nothing shifts, and a 16px blur of the image as the
 * background until it decodes. No runtime image processing on the server.
 */
export function ArtImage({ image, sizes, fit = "contain", priority, className, imgClassName, style }: Props) {
  const fallback = `/art/${image.id}-${image.widths.at(-1)}.webp`;
  return (
    <picture className={className} style={style}>
      <source type="image/avif" srcSet={srcset(image, "avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcset(image, "webp")} sizes={sizes} />
      {/* eslint-disable-next-line @next/next/no-img-element -- variants are pre-built; next/image would resize at runtime */}
      <img
        src={fallback}
        alt={image.alt}
        width={image.width}
        height={image.height}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding={priority ? "sync" : "async"}
        className={imgClassName}
        style={{
          objectFit: fit,
          backgroundColor: image.color,
          backgroundImage: `url("${image.blur}")`,
          backgroundSize: fit === "cover" ? "cover" : "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
    </picture>
  );
}
