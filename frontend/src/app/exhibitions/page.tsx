import type { Metadata } from "next";
import { ArtImage } from "@/components/art-image";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { getExhibitions } from "@/lib/api";
import { formatDateRange } from "@/lib/format";
import { site } from "@/lib/site";
import { BrushSwash } from "@/components/art/brush-swash";

export const metadata: Metadata = {
  title: "Exhibitions",
  description: "Solo and group exhibitions of paintings and prints by Rubel Khan, with dates and venues.",
  alternates: { canonical: "/exhibitions" },
};

export default async function ExhibitionsPage() {
  const exhibitions = await getExhibitions();
  return (
    <div className="wrap pt-10 pb-24">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Exhibitions" }]} />
      <h1 className="t-h1 mt-6 mb-16">Exhibitions</h1>
      <ul className="grid gap-20">
        {exhibitions.map((e, i) => (
          <li key={e.slug} className="grid items-center gap-8 lg:grid-cols-12 lg:gap-6">
            <div className="art-frame art-frame--center relative isolate aspect-[4/3] lg:col-span-6">
              <BrushSwash variant={i % 2 ? "fall" : "wave"} bleed={12} />
              <ArtImage image={e.image} sizes="(max-width: 1023px) 100vw, 50vw" />
            </div>
            <div className="grid content-start gap-3 lg:col-span-5 lg:col-start-8">
              <p className="t-label text-muted tabular">{formatDateRange(e.startsAt, e.endsAt)}</p>
              <h2 className="t-h2">{e.title}</h2>
              <p className="text-muted">
                {e.venue}, {e.city}
              </p>
              <p className="mt-2 leading-relaxed">{e.description}</p>
            </div>
          </li>
        ))}
      </ul>
      <JsonLd
        data={exhibitions.map((e) => ({
          "@context": "https://schema.org",
          "@type": "ExhibitionEvent",
          name: e.title,
          startDate: e.startsAt,
          endDate: e.endsAt,
          eventStatus: "https://schema.org/EventScheduled",
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          location: { "@type": "Place", name: e.venue, address: { "@type": "PostalAddress", addressLocality: e.city, addressCountry: "BD" } },
          image: `${site.url}/art/${e.image.id}-og.jpg`,
          description: e.description,
          performer: { "@type": "Person", name: site.name },
          organizer: { "@type": "Person", name: site.name, url: site.url },
        }))}
      />
    </div>
  );
}
