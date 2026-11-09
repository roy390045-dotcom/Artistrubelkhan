import Loading from "./loading";
import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArtImage } from "@/components/art-image";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getPortfolio, getPortfolioProject } from "@/lib/api";

export async function generateStaticParams() {
  return (await getPortfolio()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/portfolio/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const p = await getPortfolioProject(slug);
  if (!p) return {};
  return { title: `${p.title}, ${p.year}`, description: p.description, alternates: { canonical: `/portfolio/${p.slug}` } };
}

async function ProjectPageContent(props: PageProps<"/portfolio/[slug]">) {
  const { slug } = await props.params;
  const p = await getPortfolioProject(slug);
  if (!p) notFound();
  return (
    <div className="wrap pt-10 pb-24">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Portfolio", href: "/portfolio" }, { label: p.title }]} />
      <div className="mt-6 mb-16 grid gap-4 md:grid-cols-12 md:items-end">
        <h1 className="t-h1 md:col-span-7">{p.title}</h1>
        <p className="t-lead text-muted md:col-span-4 md:col-start-9">
          {p.description} <span className="tabular">{p.year}</span>.
        </p>
      </div>
      <ul className="grid gap-x-6 gap-y-20 md:grid-cols-2">
        {p.images.map((img) => (
          <li key={img.id} className="art-frame art-frame--center aspect-[4/3]">
            <ArtImage image={img} sizes="(max-width: 767px) 100vw, 50vw" />
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Params are read inside Suspense so navigation shows the loading shell at once (instant navigation). */
export default function ProjectPage(props: PageProps<"/portfolio/[slug]">) {
  return (
    <Suspense fallback={<Loading />}>
      <ProjectPageContent {...props} />
    </Suspense>
  );
}
