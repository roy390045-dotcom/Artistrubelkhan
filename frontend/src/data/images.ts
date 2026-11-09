import type { ImageAsset } from "@/lib/types";
import manifest from "./images.generated.json";

type ManifestEntry = (typeof manifest)[keyof typeof manifest] & {
  credit?: { by: string; licence: string; licenceUrl: string; page: string; title: string };
};

const entries = manifest as Record<string, ManifestEntry>;

/** Looks up a pre-built image and gives it page-specific alt text. */
export function img(id: string, alt: string): ImageAsset {
  const m = entries[id];
  if (!m) throw new Error(`Unknown image id "${id}": run npm run images`);
  return { id, alt, width: m.width, height: m.height, widths: m.widths, blur: m.blur, color: m.color };
}

/** Licence lines for every stand-in image, shown on /credits. */
export function imageCredits() {
  return Object.entries(entries)
    .filter(([, m]) => m.credit)
    .map(([id, m]) => ({ id, ...m.credit! }));
}
