import type { Metadata } from "next";
import Link from "next/link";
import { ProsePage } from "@/components/prose-page";

/* DRAFT TERMS: have them reviewed before launch. */

export const metadata: Metadata = {
  title: "Terms of sale",
  description: "The terms under which paintings and prints are sold on the Rubel Khan studio site.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <ProsePage title="Terms of sale">
      <h2>Prices</h2>
      <p>
        Prices are in Bangladeshi taka and include the work only; delivery is added at checkout. International card payments are charged in US
        dollars at the rate shown before you pay.
      </p>
      <h2>Originals and editions</h2>
      <p>
        An original is one of one. A print is part of a numbered edition whose size is stated on its page and is never exceeded. Copyright in
        every work stays with the artist; buying a work does not include the right to reproduce it.
      </p>
      <h2>Order and payment</h2>
      <p>
        An order is confirmed when the payment provider confirms the payment to the studio. A painting in a checkout is held for 15 minutes; if
        the payment is not completed in that time it becomes available again.
      </p>
      <h2>Delivery and returns</h2>
      <p>
        See <Link href="/delivery">delivery and returns</Link>.
      </p>
    </ProsePage>
  );
}
