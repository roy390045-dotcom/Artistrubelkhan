import Link from "next/link";
import { site } from "@/lib/site";
import { JsonLd } from "./json-ld";

export interface Crumb {
  label: string;
  href?: string;
}

/** Visible breadcrumbs plus the matching BreadcrumbList structured data. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <>
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px] text-muted">
          {items.map((c, i) => (
            <li key={c.label} className="flex items-center gap-2">
              {c.href ? (
                <Link href={c.href} className="navlink text-muted">
                  {c.label}
                </Link>
              ) : (
                <span aria-current="page" className="text-ink">
                  {c.label}
                </span>
              )}
              {i < items.length - 1 && <span aria-hidden="true">/</span>}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: items.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.label,
            ...(c.href ? { item: `${site.url}${c.href}` } : {}),
          })),
        }}
      />
    </>
  );
}
