import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/account/auth-form";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata: Metadata = { title: "Your account", robots: { index: false, follow: false } };

export default function AccountPage() {
  return (
    <div className="wrap pt-10 pb-24">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Your account" }]} />
      <h1 className="t-h1 mt-6 mb-4">Your account</h1>
      <p className="t-lead mb-14 max-w-[56ch] text-muted">
        An account keeps your orders, downloads and addresses in one place. You can also buy as a guest without one.
      </p>
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-6">
        <section aria-labelledby="signin-h" className="rounded-[var(--r-md)] border border-line bg-paper p-8 max-sm:p-5 lg:col-span-5">
          <h2 id="signin-h" className="t-h3 mb-6">
            Sign in
          </h2>
          <AuthForm mode="sign-in" />
          <Link href="/account/reset" className="link t-small mt-2 inline-block text-muted">
            Forgot your password
          </Link>
        </section>
        <section aria-labelledby="register-h" className="rounded-[var(--r-md)] border border-line p-8 max-sm:p-5 lg:col-span-5 lg:col-start-8">
          <h2 id="register-h" className="t-h3 mb-6">
            Create an account
          </h2>
          <AuthForm mode="register" />
        </section>
      </div>
      <nav aria-label="Account sections" className="mt-16 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-8">
        <Link href="/account/orders" className="link">
          Your orders
        </Link>
        <Link href="/account/downloads" className="link">
          Your downloads
        </Link>
        <Link href="/account/addresses" className="link">
          Your addresses
        </Link>
      </nav>
    </div>
  );
}
