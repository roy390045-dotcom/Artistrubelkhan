import Loading from "./loading";
import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArtworkCard } from "@/components/artwork-card";
import { AddToCart } from "@/components/artwork/add-to-cart";
import { ShareLinks } from "@/components/artwork/share";
import { ArtworkViewer } from "@/components/artwork/viewer";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { Price } from "@/components/price";
import { getAllArtworks, getArtwork, getCategories, getCollections, getRelated } from "@/lib/api";
import { availabilityLabel, editionLabel, formatMoney, formatSize, formatSizeMetric } from "@/lib/format";
import { shippingZones, site } from "@/lib/site";

export async function generateStaticParams() {
  return (await getAllArtworks()).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata(props: PageProps<"/artwork/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const a = await getArtwork(slug);
  if (!a) return {};
  const priceText = a.status === "available" ? `, ${formatMoney(a.price)}` : "";
  const description =
    a.seo?.metaDescription ??
    `${a.title} by Rubel Khan. ${a.medium}, ${formatSize(a)}, ${a.year}${priceText}. ${availabilityLabel(a)}.`;
  return {
    title: a.seo?.metaTitle ?? `${a.title}, ${a.medium.toLowerCase()}`,
    description,
    alternates: { canonical: `/artwork/${a.slug}` },
    openGraph: { type: "website", title: `${a.title} by ${site.name}`, description, url: `/artwork/${a.slug}` },
    twitter: { card: "summary_large_image", title: `${a.title} by ${site.name}`, description },
    other: {
      // Open Graph product tags read by Facebook, Instagram Shopping and Pinterest.
      "product:price:amount": String(a.price.amount / 100),
      "product:price:currency": a.price.currency,
      "product:availability": a.status === "available" ? "in stock" : "out of stock",
      "product:condition": "new",
      "product:retailer_item_id": a.sku,
    },
  };
}

async function ArtworkPageContent(props: PageProps<"/artwork/[slug]">) {
  const { slug } = await props.params;
  const a = await getArtwork(slug);
  if (!a) notFound();
  const [categories, collections, related] = await Promise.all([getCategories(), getCollections(), getRelated(a)]);
  const category = categories.find((c) => c.id === a.categoryId);
  const inCollections = collections.filter((c) => a.collectionIds.includes(c.id));
  const url = `${site.url}/artwork/${a.slug}`;
  const ogImage = `${site.url}/artwork/${a.slug}/opengraph-image`;

  const specs = [
    { k: "Medium", v: a.medium },
    { k: "Size", v: `${formatSize(a)} (${formatSizeMetric(a)})` },
    { k: "Year", v: String(a.year) },
    { k: "Edition", v: editionLabel(a) },
    { k: "Framing", v: a.isFramed ? "Framed, ready to hang" : "Unframed, shipped flat or rolled" },
    { k: "Reference", v: a.sku },
  ];

  return (
    <>
      <div className="wrap pt-8 pb-20">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Paintings", href: "/shop" },
            ...(category ? [{ label: category.name, href: `/shop/${category.slug}` }] : []),
            { label: a.title },
          ]}
        />
        <div className="mt-8 grid gap-12 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-7">
            <ArtworkViewer images={a.images} title={a.title} slug={a.slug} />
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <div className="grid gap-8 lg:sticky lg:top-[calc(var(--nav)+32px)]">
              <div className="grid gap-3">
                <h1 className="t-h2">{a.title}</h1>
                <p className="t-lead text-muted">
                  {a.medium}, {formatSize(a)}, {a.year}
                </p>
              </div>

              <div className="grid gap-5 border-t border-line pt-6">
                <Price artwork={a} size="lg" />
                {a.status === "available" && (
                  <p className="t-small text-muted">{editionLabel(a)}. Pay by bKash, Nagad or card; international cards accepted.</p>
                )}
                <AddToCart artwork={a} />
              </div>

              <dl className="divide-y divide-line border-y border-line">
                {specs.map((s) => (
                  <div key={s.k} className="grid grid-cols-[120px_1fr] gap-4 py-3 text-[15px]">
                    <dt className="text-muted">{s.k}</dt>
                    <dd className="tabular">{s.v}</dd>
                  </div>
                ))}
              </dl>

              <div className="grid gap-3">
                <p className="leading-relaxed">{a.description}</p>
                {inCollections.length > 0 && (
                  <p className="t-small text-muted">
                    In{" "}
                    {inCollections.map((c, i) => (
                      <span key={c.slug}>
                        {i > 0 && (i === inCollections.length - 1 ? " and " : ", ")}
                        <Link href={`/collections/${c.slug}`} className="link text-ink">
                          {c.name}
                        </Link>
                      </span>
                    ))}
                    .
                  </p>
                )}
              </div>

              {a.status === "available" && (
                <div className="grid gap-2">
                  <p className="t-label text-muted">Delivery</p>
                  <ul className="grid gap-1.5 text-[15px]">
                    {shippingZones.map((z) => (
                      <li key={z.id} className="flex justify-between gap-4">
                        <span>
                          {z.name}, {z.eta}
                        </span>
                        <span className="tabular text-muted">{formatMoney(z.rate)}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/delivery" className="link t-small justify-self-start text-muted">
                    Read delivery and returns
                  </Link>
                </div>
              )}

              <ShareLinks url={url} title={`${a.title} by ${site.name}`} image={ogImage} />
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-h" className="section wrap border-t border-line">
          <h2 id="related-h" className="t-h2 mb-12">
            More like this.
          </h2>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-12 max-sm:gap-x-3 lg:grid-cols-4">
            {related.map((r) => (
              <li key={r.id}>
                <ArtworkCard artwork={r} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": ["VisualArtwork", "Product"],
          name: a.title,
          description: a.description,
          url,
          image: `${site.url}/art/${a.images[0].id}-og.jpg`,
          sku: a.sku,
          creator: { "@type": "Person", name: site.name, url: site.url },
          brand: { "@type": "Brand", name: site.name },
          artform: category?.name === "Printmaking" ? "Print" : category?.name === "Sketches" ? "Drawing" : "Painting",
          artMedium: a.medium,
          artworkSurface: a.medium.split(" on ")[1] ?? undefined,
          dateCreated: String(a.year),
          width: { "@type": "QuantitativeValue", value: a.width, unitCode: a.dimensionUnit === "in" ? "INH" : "CMT" },
          height: { "@type": "QuantitativeValue", value: a.height, unitCode: a.dimensionUnit === "in" ? "INH" : "CMT" },
          ...(a.editionType === "limited_print" && a.editionSize ? { artEdition: a.editionSize } : {}),
          ...(a.status !== "not_for_sale"
            ? {
                offers: {
                  "@type": "Offer",
                  url,
                  price: (a.price.amount / 100).toFixed(2),
                  priceCurrency: a.price.currency,
                  availability: a.status === "available" ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
                  itemCondition: "https://schema.org/NewCondition",
                  seller: { "@type": "Person", name: site.name },
                },
              }
            : {}),
        }}
      />
    </>
  );
}

/** Params are read inside Suspense so navigation shows the loading shell at once (instant navigation). */
export default function ArtworkPage(props: PageProps<"/artwork/[slug]">) {
  return (
    <Suspense fallback={<Loading />}>
      <ArtworkPageContent {...props} />
    </Suspense>
  );
}
