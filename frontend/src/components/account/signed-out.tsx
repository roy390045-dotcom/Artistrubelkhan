import Link from "next/link";
import { Breadcrumbs } from "../breadcrumbs";

/** What an account sub-page shows before sign-in (the session check arrives in Phase 2). */
export function SignedOut({ title, what }: { title: string; what: string }) {
  return (
    <div className="wrap pt-10 pb-24">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Your account", href: "/account" }, { label: title }]} />
      <div className="mt-6 grid max-w-[560px] justify-items-start gap-5">
        <h1 className="t-h2">{title}</h1>
        <p className="t-lead text-muted">Sign in to see {what}.</p>
        <Link href="/account" className="btn btn--primary">
          Sign in to your account
        </Link>
      </div>
    </div>
  );
}
