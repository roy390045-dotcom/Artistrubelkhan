import Link from "next/link";
import { site } from "@/lib/site";

/** The dealt "initial" mark: the letter R on an ink square, then the name in the display face. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-3 no-underline ${className}`} aria-label={`${site.name}, home`}>
      <span
        aria-hidden="true"
        className="grid size-8 place-items-center rounded-[6px] bg-ink font-display text-[19px] leading-none text-paper"
      >
        R
      </span>
      <span className="font-display text-[20px] leading-none tracking-[-0.01em]">{site.name}</span>
    </Link>
  );
}
