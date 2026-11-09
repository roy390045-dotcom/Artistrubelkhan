import { getArtwork } from "@/lib/api";
import { artCard, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Rubel Khan: original paintings and prints";

export default async function Image() {
  const hero = await getArtwork("ghats-at-benares");
  if (!hero) return new Response("Not found", { status: 404 });
  return artCard({
    image: hero.images[0],
    eyebrow: "Original paintings and prints",
    title: "Original paintings from a Dhaka studio",
    lines: ["Watercolour, acrylic, oil and numbered prints", "Delivered across Bangladesh"],
  });
}
