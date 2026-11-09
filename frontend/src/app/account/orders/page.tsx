import type { Metadata } from "next";
import { SignedOut } from "@/components/account/signed-out";

export const metadata: Metadata = { title: "Your orders", robots: { index: false, follow: false } };

export default function Page() {
  return <SignedOut title="Your orders" what="your orders, their payment status and tracking numbers" />;
}
