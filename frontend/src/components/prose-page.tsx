import type { ReactNode } from "react";
import { Breadcrumbs } from "./breadcrumbs";

/** Layout for policy and text pages: one readable column. */
export function ProsePage({ title, updated, children }: { title: string; updated?: string; children: ReactNode }) {
  return (
    <div className="wrap pt-10 pb-24">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: title }]} />
      <h1 className="t-h1 mt-6 mb-4">{title}</h1>
      {updated && <p className="t-small mb-12 text-muted">Last updated {updated}</p>}
      <div className="prose-body max-w-[68ch]">{children}</div>
    </div>
  );
}
