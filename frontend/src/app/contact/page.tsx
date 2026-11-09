import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { EnquiryForm } from "@/components/enquiry-form";
import { site, whatsappHref } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact the studio",
  description: "Ask Rubel Khan about a painting, a commission, framing or delivery. Replies come by email.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const wa = whatsappHref("Hello, I would like to ask about a painting.");
  return (
    <div className="wrap pt-10 pb-24">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
      <div className="mt-6 grid gap-12 lg:grid-cols-12 lg:gap-6">
        <div className="grid content-start gap-6 lg:col-span-5">
          <h1 className="t-h1">Contact the studio</h1>
          <p className="t-lead text-muted">Ask about a painting, a size, a commission, framing or delivery. Replies come by email.</p>
          <dl className="grid gap-4 border-t border-line pt-6">
            <div>
              <dt className="t-label text-muted">Email</dt>
              <dd className="mt-1">
                <a href={`mailto:${site.email}`} className="link italic">
                  {site.email}
                </a>
              </dd>
            </div>
            {wa && (
              <div>
                <dt className="t-label text-muted">WhatsApp</dt>
                <dd className="mt-1">
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="link">
                    Message on WhatsApp
                  </a>
                </dd>
              </div>
            )}
            <div>
              <dt className="t-label text-muted">Studio</dt>
              <dd className="mt-1">Dhaka, Bangladesh</dd>
            </div>
          </dl>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <div className="rounded-[var(--r-md)] border border-line bg-paper p-8 max-sm:p-5">
            <h2 className="t-h3 mb-6">Send an enquiry</h2>
            <EnquiryForm />
          </div>
        </div>
      </div>
    </div>
  );
}
