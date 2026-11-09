import Link from "next/link";
import { ArtImage } from "@/components/art-image";
import { ArtworkCard } from "@/components/artwork-card";
import { PictureDevelops } from "@/components/moments/picture-develops";
import { PinnedChapters } from "@/components/moments/pinned-chapters";
import { SectionHead } from "@/components/section-head";
import { placePhotos } from "@/data/catalog";
import { getArtwork, getByCollection, getCategories, getAllArtworks, getNewArrivals } from "@/lib/api";
import { formatMoney } from "@/lib/format";

/*
  Home. Kind: product (site-kind other). Deal: palette paper-grey-brass, type Besley / Albert Sans,
  hero "product" (the painting whole on the page ground), nav-cards, footer-columns, close-photo,
  dark-band rhythm, buttons arrow, mark initial. Moments: picture-develops (Rivers), pinned-chapters
  (From sketch to print). Hero entrance: the name arrives first, then what to do.
*/

export default async function HomePage() {
  const [hero, arrivals, all, categories, oldDhaka, sketch, watercolour, print] = await Promise.all([
    getArtwork("ghats-at-benares"),
    getNewArrivals(8),
    getAllArtworks(),
    getCategories(),
    getByCollection("old-dhaka", 4),
    getArtwork("ships-at-anchor"),
    getArtwork("river-morning-near-kara"),
    getArtwork("the-chowk-old-dhaka"),
  ]);
  const featured = await getArtwork("rock-in-the-ganges");
  const cheapest = Math.min(...all.filter((a) => a.status === "available").map((a) => a.price.amount));
  const newArrivals = arrivals.filter((a) => a.id !== hero?.id).slice(0, 4);
  const mediumCovers = categories.map((c) => ({ ...c, cover: all.find((a) => a.categoryId === c.id && a.id !== hero?.id) ?? null, count: all.filter((a) => a.categoryId === c.id).length }));

  return (
    <>
      {/* 1. Hero: the work itself, whole, on the wall */}
      <section aria-labelledby="hero-h" className="wrap flex min-h-[calc(100svh-var(--nav))] flex-col pt-12 pb-10 max-sm:pt-8">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h1 id="hero-h" className="t-h1 lg:col-span-7">
            <span className="enter-line">
              <span>Original paintings</span>
            </span>{" "}
            <span className="enter-line">
              <span style={{ animationDelay: "80ms" }}>from a Dhaka studio</span>
            </span>
          </h1>
          <div className="grid gap-6 lg:col-span-4 lg:col-start-9">
            <p className="t-lead enter-follow" style={{ animationDelay: "430ms" }}>
              Watercolours, acrylics, oils and numbered prints, sold by the artist and delivered across Bangladesh. Originals from{" "}
              {formatMoney({ amount: cheapest, currency: "BDT" })}.
            </p>
            <div className="btn-row flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link href="/shop?availability=available" className="btn btn--primary enter-follow" style={{ animationDelay: "490ms" }}>
                Buy a painting
              </Link>
              <Link href="/portfolio" className="btn btn--secondary enter-follow" style={{ animationDelay: "550ms" }}>
                See the portfolio
              </Link>
            </div>
          </div>
        </div>
        {hero && (
          <Link href={`/artwork/${hero.slug}`} className="relative mt-8 block min-h-[300px] flex-1" aria-label={`${hero.title}, ${formatMoney(hero.price)}`}>
            <div className="art-frame art-frame--center enter-object absolute inset-0">
              <ArtImage image={hero.images[0]} sizes="(max-width: 1023px) 100vw, 1280px" priority />
            </div>
          </Link>
        )}
      </section>

      {/* 2. New arrivals */}
      <section aria-labelledby="new-h" className="section wrap">
        <SectionHead
          id="new-h"
          title="New paintings."
          aside="Added this season."
          link={{ href: "/shop?sort=newest", label: "See all new paintings" }}
        />
        <ul className="grid grid-cols-2 gap-x-6 gap-y-12 max-sm:gap-x-3 max-sm:gap-y-8 lg:grid-cols-4">
          {newArrivals.map((a) => (
            <li key={a.id}>
              <ArtworkCard artwork={a} />
            </li>
          ))}
        </ul>
      </section>

      {/* 3. Moment: a river painting develops like a print */}
      {featured && (
        <section aria-labelledby="rivers-h" className="section wrap">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-6">
            <PictureDevelops className="lg:col-span-7">
              <Link href={`/artwork/${featured.slug}`} className="m-zoom art-frame art-frame--center block aspect-[7/5]">
                <ArtImage image={featured.images[0]} sizes="(max-width: 1023px) 100vw, 60vw" />
              </Link>
            </PictureDevelops>
            <div className="grid gap-6 lg:col-span-4 lg:col-start-9">
              <h2 id="rivers-h" className="t-h2">
                Rivers and ghats. <span className="muted">Boats, banks and still water.</span>
              </h2>
              <p className="t-lead text-muted">
                A series painted along the rivers of Bengal, most of it in watercolour, some in oil on canvas.
              </p>
              <dl className="grid grid-cols-2 gap-4 border-t border-line pt-6">
                <div>
                  <dt className="t-label text-muted">This painting</dt>
                  <dd className="mt-1">{featured.title}</dd>
                </div>
                <div>
                  <dt className="t-label text-muted">Price</dt>
                  <dd className="mt-1 tabular">{formatMoney(featured.price)}</dd>
                </div>
              </dl>
              <Link href="/collections/rivers" className="link justify-self-start font-medium">
                See the river paintings
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 4. By medium */}
      <section aria-labelledby="medium-h" className="section wrap">
        <SectionHead id="medium-h" title="Paintings by medium." aside="Six ways to start looking." />
        <ul className="grid grid-cols-2 gap-x-6 gap-y-10 max-sm:gap-x-3 md:grid-cols-3">
          {mediumCovers.map((c) => (
            <li key={c.slug}>
              <Link href={`/shop/${c.slug}`} className="m-card">
                <div className="m-zoom aspect-[4/3] overflow-hidden bg-surface">
                  {c.cover && (
                    <ArtImage
                      image={c.cover.images[0]}
                      fit="cover"
                      sizes="(max-width: 767px) 50vw, 33vw"
                      className="block h-full w-full"
                      imgClassName="h-full w-full"
                    />
                  )}
                </div>
                <div className="mt-4 flex items-baseline justify-between gap-3">
                  <h3 className="m-card__title font-sans text-[length:var(--t-card)] font-medium tracking-normal">{c.name}</h3>
                  <span className="t-small text-muted tabular">
                    {c.count} {c.count === 1 ? "work" : "works"}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* 5. Dark band: Old Dhaka in print */}
      <section aria-labelledby="dhaka-h" className="inverse section">
        <div className="wrap">
          <SectionHead
            id="dhaka-h"
            title="Old Dhaka in print."
            aside="Etchings and drawings of the old city."
            lead="Gates, mosques and market squares, printed in small numbered editions or drawn once in pen and ink."
            link={{ href: "/collections/old-dhaka", label: "See the Old Dhaka collection" }}
          />
          <ul className="grid grid-cols-2 gap-x-6 gap-y-12 max-sm:gap-x-3 max-sm:gap-y-8 lg:grid-cols-4">
            {oldDhaka.map((a) => (
              <li key={a.id}>
                <ArtworkCard artwork={a} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6. Moment: from sketch to print, pinned */}
      {sketch && watercolour && print && (
        <PinnedChapters
          heading={
            <>
              From sketch to print. <span className="muted">Three stages of one subject.</span>
            </>
          }
          intro="Most works start as a drawing made on the spot and end as a painting or a small edition of prints."
          chapters={[
            {
              title: "A sketch made on the spot",
              body: "Pen, ink and wash on paper, drawn on the street or the riverbank. The sketches are for sale too.",
              visual: <ChapterImage artwork={sketch} />,
            },
            {
              title: "A painting worked up in the studio",
              body: "The sketch becomes a watercolour or a canvas, with the colour and the light of the place kept in.",
              visual: <ChapterImage artwork={watercolour} />,
            },
            {
              title: "A print in a numbered edition",
              body: "Some subjects are etched and printed in editions of 15 to 20, each signed and numbered.",
              visual: <ChapterImage artwork={print} />,
            },
          ]}
        />
      )}

      {/* 7. About teaser */}
      <section aria-labelledby="about-h" className="section wrap">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-6">
          <div className="grid gap-6 lg:col-span-5">
            <h2 id="about-h" className="t-h2">
              About Rubel Khan. <span className="muted">A painter of streets and rivers.</span>
            </h2>
            <p className="t-lead text-muted">
              The work comes from walking: the lanes of Old Dhaka, the ghats, the boats on the Buriganga. Read about the artist, the studio and past exhibitions.
            </p>
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              <Link href="/about" className="link font-medium">
                Read about the artist
              </Link>
              <Link href="/exhibitions" className="link font-medium">
                See past exhibitions
              </Link>
            </div>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <div className="aspect-[4/3] overflow-hidden bg-surface">
              <ArtImage
                image={placePhotos.buriganga}
                fit="cover"
                sizes="(max-width: 1023px) 100vw, 50vw"
                className="block h-full w-full"
                imgClassName="h-full w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 8. Close: photograph with the one action on a solid box */}
      <section aria-labelledby="close-h" className="relative min-h-[80svh] overflow-hidden">
        <ArtImage
          image={placePhotos.boatDetail}
          fit="cover"
          sizes="100vw"
          className="absolute inset-0 block h-full w-full"
          imgClassName="h-full w-full"
        />
        <div className="wrap relative flex min-h-[80svh] items-end py-16">
          <div className="grid max-w-[520px] gap-5 rounded-[var(--r-md)] bg-bg p-8 max-sm:p-6">
            <h2 id="close-h" className="t-h2">
              Buy an original painting.
            </h2>
            <p className="text-muted">Pay by bKash, Nagad or card. Delivered inside Dhaka in 2 to 3 days, across Bangladesh in 3 to 5.</p>
            <Link href="/shop?availability=available" className="btn btn--primary justify-self-start">
              Buy a painting
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function ChapterImage({ artwork }: { artwork: NonNullable<Awaited<ReturnType<typeof getArtwork>>> }) {
  return (
    <div className="art-frame art-frame--center h-full min-h-[240px] w-full max-lg:aspect-[4/3]">
      <ArtImage image={artwork.images[0]} sizes="(max-width: 1023px) 50vw, 55vw" />
    </div>
  );
}
