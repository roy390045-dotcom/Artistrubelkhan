import Link from "next/link";
import { cacheLife } from "next/cache";
import { getCategories, getCollections } from "@/lib/api";
import { site } from "@/lib/site";
import { Logo } from "./mark";

export async function SiteFooter() {
  "use cache";
  cacheLife("days");
  const [categories, collections] = await Promise.all([getCategories(), getCollections()]);
  const socials = Object.entries(site.socials).filter(([, url]) => url);

  const columns = [
    { title: "Paintings", links: categories.map((c) => ({ label: c.name, href: `/shop/${c.slug}` })) },
    { title: "Collections", links: collections.map((c) => ({ label: c.name, href: `/collections/${c.slug}` })) },
    {
      title: "Studio",
      links: [
        { label: "Portfolio", href: "/portfolio" },
        { label: "Exhibitions", href: "/exhibitions" },
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Buying",
      links: [
        { label: "Delivery and returns", href: "/delivery" },
        { label: "Your account", href: "/account" },
        { label: "Your orders", href: "/account/orders" },
      ],
    },
  ];

  return (
    <footer className="border-t border-line">
      <div className="wrap grid gap-12 py-16 lg:grid-cols-12 lg:gap-6">
        <div className="grid content-start gap-4 lg:col-span-4">
          <Logo />
          <p className="max-w-[34ch] text-muted">Original paintings and limited prints, sold directly from the artist&apos;s studio.</p>
          {socials.length > 0 && (
            <ul className="flex gap-5">
              {socials.map(([name, url]) => (
                <li key={name}>
                  <a href={url} className="navlink capitalize" target="_blank" rel="noopener noreferrer">
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 lg:col-span-8">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="t-label mb-4 font-sans text-muted">{col.title}</h3>
              <ul className="grid gap-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="navlink inline-flex min-h-7 items-center text-[15px]">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="wrap flex flex-col gap-3 border-t border-line py-6 text-[13px] text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {site.name}. Prices in Bangladeshi taka.
        </p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          <li>
            <Link href="/privacy" className="navlink text-muted">
              Privacy
            </Link>
          </li>
          <li>
            <Link href="/terms" className="navlink text-muted">
              Terms
            </Link>
          </li>
          <li>
            <Link href="/credits" className="navlink text-muted">
              Image credits
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
