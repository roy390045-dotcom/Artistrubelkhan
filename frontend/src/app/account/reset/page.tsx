import type { Metadata } from "next";
import { AuthForm } from "@/components/account/auth-form";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata: Metadata = { title: "Reset your password", robots: { index: false, follow: false } };

export default function ResetPage() {
  return (
    <div className="wrap pt-10 pb-24">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Your account", href: "/account" }, { label: "Reset password" }]} />
      <div className="mt-6 max-w-[520px]">
        <h1 className="t-h2 mb-4">Reset your password</h1>
        <p className="mb-8 text-muted">Write the email you signed up with and a link to choose a new password arrives in your inbox.</p>
        <AuthForm mode="reset" />
      </div>
    </div>
  );
}
