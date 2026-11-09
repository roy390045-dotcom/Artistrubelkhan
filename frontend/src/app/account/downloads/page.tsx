import type { Metadata } from "next";
import { SignedOut } from "@/components/account/signed-out";

export const metadata: Metadata = { title: "Your downloads", robots: { index: false, follow: false } };

export default function Page() {
  return <SignedOut title="Your downloads" what="the files of digital works you bought" />;
}
