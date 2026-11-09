import type { Metadata } from "next";
import Link from "next/link";
import { ArtImage } from "@/components/art-image";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { placePhotos } from "@/data/catalog";
import { getExhibitions } from "@/lib/api";
import { formatDateRange } from "@/lib/format";
import { BrushSwash } from "@/components/art/brush-swash";

/* ASSUMED COPY: replace with the artist's own biography, education and statement (see docs/HANDOFF.md). */

export const metadata: Metadata = {
  title: "About the artist",
  description: "Rubel Khan paints the streets and rivers of Bangladesh in watercolour, acrylic and oil, and prints small editions of etchings.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const exhibitions = await getExhibitions();
  return (
    <>
      <div className="wrap pt-10 pb-24">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />
        <div className="mt-6 grid gap-12 lg:grid-cols-12 lg:gap-6">
          <div className="grid content-start gap-8 lg:col-span-6">
            <h1 className="t-h1">Rubel Khan, painter</h1>
            <div className="grid max-w-[60ch] gap-5 text-[17px] leading-relaxed">
              <p>
                Rubel Khan paints the places of everyday Bangladesh: the lanes and gates of Old Dhaka, the ghats and ferries of the rivers, the
                markets and the light that falls on them.
              </p>
              <p>
                Most works begin as a drawing made on the spot, in pen, ink and wash. Back in the studio the drawing becomes a watercolour, an
                acrylic or an oil on canvas; some subjects are etched and printed in small, numbered editions.
              </p>
              <p>
                Every painting on this site is sold directly from the studio, with delivery across Bangladesh and abroad. If you are looking for a
                particular place, size or medium, send an enquiry.
              </p>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              <Link href="/shop?availability=available" className="btn btn--primary">
                Buy a painting
              </Link>
              <Link href="/contact" className="btn btn--secondary">
                Contact the studio
              </Link>
            </div>
          </div>
          <div className="relative isolate lg:col-span-5 lg:col-start-8">
            <BrushSwash variant="fall" trigger="load" bleed={16} />
            <div className="aspect-[3/4] overflow-hidden bg-surface">
              <ArtImage
                image={placePhotos.oldDhakaStreet}
                fit="cover"
                sizes="(max-width: 1023px) 100vw, 40vw"
                priority
                className="block h-full w-full"
                imgClassName="h-full w-full"
              />
            </div>
          </div>
        </div>
      </div>

      <section aria-labelledby="ex-h" className="section wrap border-t border-line">
        <h2 id="ex-h" className="t-h2 mb-10">
          Exhibitions.
        </h2>
        <ul className="divide-y divide-line border-y border-line">
          {exhibitions.map((e) => (
            <li key={e.slug} className="grid gap-2 py-6 md:grid-cols-12 md:gap-6">
              <p className="t-small text-muted tabular md:col-span-3">{formatDateRange(e.startsAt, e.endsAt)}</p>
              <p className="t-h3 md:col-span-5">{e.title}</p>
              <p className="text-muted md:col-span-4">
                {e.venue}, {e.city}
              </p>
            </li>
          ))}
        </ul>
        <Link href="/exhibitions" className="link mt-8 inline-block font-medium">
          See the exhibitions with pictures
        </Link>
      </section>
    </>
  );
}
