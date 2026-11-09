import type { Metadata } from "next";
import Link from "next/link";
import { ProsePage } from "@/components/prose-page";
import { formatMoney } from "@/lib/format";
import { shippingZones } from "@/lib/site";

/* DRAFT POLICY: rates, times and the returns window must be confirmed by the studio before launch. */

export const metadata: Metadata = {
  title: "Delivery and returns",
  description: "Delivery times and prices inside Dhaka, across Bangladesh and abroad, and how returns work for paintings and prints.",
  alternates: { canonical: "/delivery" },
};

export default function DeliveryPage() {
  return (
    <ProsePage title="Delivery and returns">
      <h2>Delivery prices and times</h2>
      <ul>
        {shippingZones.map((z) => (
          <li key={z.id}>
            {z.name}: {formatMoney(z.rate)}, usually {z.eta} after the painting is packed.
          </li>
        ))}
      </ul>
      <p>
        Works on paper are shipped flat between boards or rolled in a tube; framed works travel in a wooden crate. You get the courier&apos;s
        tracking number by email as soon as your order leaves the studio.
      </p>
      <h2>Returns</h2>
      <p>
        If a painting arrives damaged, send a photo within 48 hours of delivery and it is replaced, repaired or refunded in full. Undamaged
        originals can be returned within 7 days in their original packing; the buyer pays the return delivery.
      </p>
      <h2>Questions</h2>
      <p>
        For anything about an order, <Link href="/contact">contact the studio</Link> with your order number.
      </p>
    </ProsePage>
  );
}
