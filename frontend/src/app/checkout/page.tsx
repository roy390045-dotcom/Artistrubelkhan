import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { shippingZones } from "@/lib/site";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="wrap pt-10 pb-24">
      <h1 className="t-h2 mb-10">Checkout</h1>
      <CheckoutForm zones={shippingZones} />
    </div>
  );
}
