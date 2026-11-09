import type { Metadata } from "next";
import Link from "next/link";
import { ArtImage } from "@/components/art-image";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getByCollection, getCollections } from "@/lib/api";
import { BrushSwash } from "@/components/art/brush-swash";

export const metadata: Metadata = {
  title: "Collections",
  description: "Paintings and prints by Rubel Khan grouped by subject: Old Dhaka, rivers and ghats, and travel paintings.",
  alternates: { canonical: "/collections" },
};

export default async function CollectionsPage() {
  const collections = await getCollections();
  const withWorks = await Promise.all(collections.map(async (c) => ({ ...c, works: await getByCollection(c.slug, 50) })));

  return (
    <div className="wrap pt-10 pb-24">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Collections" }]} />
      <h1 className="t-h1 mt-6 mb-14">Collections by subject</h1>
      <ul className="grid gap-x-6 gap-y-16 md:grid-cols-3">
        {withWorks.map((c, i) => (
          <li key={c.slug} className="relative isolate">
            <BrushSwash variant={(["rise", "wave", "fall"] as const)[i % 3]} bleed={14} />
            <Link href={`/collections/${c.slug}`} className="m-card">
              <div className="m-zoom aspect-[4/5] overflow-hidden bg-surface">
                {c.works[0] && (
                  <ArtImage
                    image={c.works[0].images[0]}
                    fit="cover"
                    sizes="(max-width: 767px) 100vw, 33vw"
                    className="block h-full w-full"
                    imgClassName="h-full w-full"
                  />
                )}
              </div>
              <div className="mt-5 flex items-baseline justify-between gap-3">
                <h2 className="m-card__title t-h3">{c.name}</h2>
                <span className="t-small text-muted tabular">{c.works.length} works</span>
              </div>
              <p className="mt-2 text-muted">{c.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
