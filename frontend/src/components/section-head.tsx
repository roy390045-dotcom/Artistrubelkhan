import Link from "next/link";
import type { ReactNode } from "react";

/** A section's h2 (with an optional grey second sentence), a lead line, and one link at the right. */
export function SectionHead({
  id,
  title,
  aside,
  lead,
  link,
}: {
  id: string;
  title: ReactNode;
  aside?: ReactNode;
  lead?: ReactNode;
  link?: { href: string; label: string };
}) {
  return (
    <div className="mb-12 grid gap-6 max-sm:mb-8 md:grid-cols-12 md:items-end">
      <div className="grid gap-4 md:col-span-8">
        <h2 id={id} className="t-h2">
          {title}
          {aside && (
            <>
              {" "}
              <span className="muted">{aside}</span>
            </>
          )}
        </h2>
        {lead && <p className="t-lead measure text-muted">{lead}</p>}
      </div>
      {link && (
        <div className="md:col-span-4 md:justify-self-end">
          <Link href={link.href} className="link text-[16px] font-medium">
            {link.label}
          </Link>
        </div>
      )}
    </div>
  );
}
