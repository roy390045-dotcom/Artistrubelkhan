import type { Metadata } from "next";
import Link from "next/link";
import { ArtImage } from "@/components/art-image";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getPortfolio } from "@/lib/api";
import { BrushSwash } from "@/components/art/brush-swash";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Series and projects by Rubel Khan: the Old Dhaka prints and the river paintings, shown as complete bodies of work.",
  alternates: { canonical: "/portfolio" },
};

export default async function PortfolioPage() {
  const projects = await getPortfolio();
  return (
    <div className="wrap pt-10 pb-24">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Portfolio" }]} />
      <div className="mt-6 mb-14 grid gap-4 md:grid-cols-12 md:items-end">
        <h1 className="t-h1 md:col-span-7">Portfolio of series</h1>
        <p className="t-lead text-muted md:col-span-4 md:col-start-9">Complete series, including works that are sold or not for sale.</p>
      </div>
      <ul className="grid gap-24">
        {projects.map((p, n) => (
          <li key={p.slug}>
            <Link href={`/portfolio/${p.slug}`} className="m-card grid gap-8 lg:grid-cols-12 lg:gap-6">
              <div className="grid content-start gap-3 lg:col-span-4">
                <p className="t-label text-muted tabular">{p.year}</p>
                <h2 className="m-card__title t-h2">{p.title}</h2>
                <p className="text-muted">{p.description}</p>
                <p className="t-small mt-2 text-muted">{p.images.length} works</p>
              </div>
              <div className="relative isolate grid grid-cols-2 gap-4 lg:col-span-8">
                <BrushSwash variant={n % 2 ? "fall" : "rise"} bleed={8} />
                {p.images.slice(0, 4).map((img) => (
                  <div key={img.id} className="m-zoom art-frame art-frame--center aspect-[4/3]">
                    <ArtImage image={img} sizes="(max-width: 1023px) 50vw, 33vw" />
                  </div>
                ))}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
