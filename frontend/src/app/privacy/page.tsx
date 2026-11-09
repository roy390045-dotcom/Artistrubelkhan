import type { Metadata } from "next";
import { ProsePage } from "@/components/prose-page";

/* DRAFT POLICY: have it reviewed before launch; update when analytics or a pixel is added. */

export const metadata: Metadata = {
  title: "Privacy",
  description: "What personal data the Rubel Khan studio site collects, why, and how long it is kept.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <ProsePage title="Privacy">
      <h2>What is collected</h2>
      <ul>
        <li>Your name, email, phone and delivery address when you order, to deliver the painting and send the receipt.</li>
        <li>Your name, email and message when you send an enquiry, to answer it.</li>
        <li>Your email and a hashed password if you create an account.</li>
      </ul>
      <h2>Payments</h2>
      <p>
        Card and mobile wallet payments are taken by SSLCommerz or Stripe on their own pages. Card numbers never reach this site; the studio
        keeps only the payment reference and status.
      </p>
      <h2>Cookies</h2>
      <p>
        The site uses only the cookies it needs to work: the sign-in session and the cart. There are no advertising cookies. If analytics are
        added later, they will be listed here and asked for first.
      </p>
      <h2>How long it is kept</h2>
      <p>
        Order records are kept as long as tax law requires. Enquiries are deleted after two years. You can ask for a copy of your data or for it
        to be deleted by contacting the studio.
      </p>
    </ProsePage>
  );
}
