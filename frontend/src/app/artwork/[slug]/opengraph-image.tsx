import { getAllArtworks, getArtwork } from "@/lib/api";
import { availabilityLabel, formatMoney, formatSize } from "@/lib/format";
import { artCard, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "A painting by Rubel Khan with its title and price";

export async function generateStaticParams() {
  return (await getAllArtworks()).map((a) => ({ slug: a.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = await getArtwork(slug);
  if (!a) return new Response("Not found", { status: 404 });
  return artCard({
    image: a.images[0],
    eyebrow: `${a.medium}, ${formatSize(a)}, ${a.year}`,
    title: a.title,
    lines: [a.status === "available" ? formatMoney(a.price) : availabilityLabel(a)],
  });
}
