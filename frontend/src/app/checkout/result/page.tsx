import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { ClearCartOnSuccess } from "@/components/checkout/clear-cart";

export const metadata: Metadata = { title: "Order status", robots: { index: false, follow: false } };

/**
 * Where SSLCommerz and Stripe send the buyer back. The query string is NOT proof of payment:
 * in Phase 3 this page asks the server for the order's payment_status, which only the
 * verified IPN/webhook sets. Here it renders the three states for review.
 */
export default function ResultPage(props: PageProps<"/checkout/result">) {
  return (
    <div className="wrap grid min-h-[70svh] place-items-center py-20">
      <Suspense fallback={<p className="text-muted">Checking your payment…</p>}>
        <ResultBody searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}

async function ResultBody({ searchParams }: { searchParams: PageProps<"/checkout/result">["searchParams"] }) {
  const sp = await searchParams;
  const state = sp.status === "paid" ? "paid" : sp.status === "failed" ? "failed" : "pending";
  const order = typeof sp.order === "string" ? sp.order.replace(/[^A-Z0-9-]/gi, "").slice(0, 20) : "";

  if (state === "paid") {
    return (
      <div className="grid max-w-xl justify-items-start gap-5">
        <ClearCartOnSuccess />
        <CheckCircle2 size={40} strokeWidth={1.4} aria-hidden="true" className="text-success" />
        <h1 className="t-h2">Thank you. Your order is paid.</h1>
        <p className="t-lead text-muted">
          {order ? `Order ${order}. ` : ""}A receipt is on its way to your email. You get the courier&apos;s tracking number as soon as the painting is packed.
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          <Link href="/account/orders" className="btn btn--primary">
            See your orders
          </Link>
          <Link href="/shop" className="btn btn--secondary">
            Keep looking
          </Link>
        </div>
      </div>
    );
  }
  if (state === "failed") {
    return (
      <div className="grid max-w-xl justify-items-start gap-5">
        <XCircle size={40} strokeWidth={1.4} aria-hidden="true" className="text-danger" />
        <h1 className="t-h2">The payment did not go through.</h1>
        <p className="t-lead text-muted">Nothing was charged. The paintings stay reserved for you for 15 minutes, so you can try again or pick another method.</p>
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          <Link href="/checkout" className="btn btn--primary">
            Try the payment again
          </Link>
          <Link href="/contact" className="btn btn--secondary">
            Contact the studio
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="grid max-w-xl justify-items-start gap-5">
      <h1 className="t-h2">Waiting for the payment confirmation.</h1>
      <p className="t-lead text-muted">The provider is confirming your payment. This page updates on its own; you can also check your email in a minute.</p>
    </div>
  );
}
