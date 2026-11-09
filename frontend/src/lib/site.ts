import type { ShippingZone } from "./types";

/**
 * Site-wide settings. In Phase 2 these come from the SITE_SETTINGS table.
 * Contact details are deliberately not hard-coded: set them in .env.local.
 */
export const site = {
  name: "Rubel Khan",
  title: "Rubel Khan: original paintings and prints",
  description:
    "Original watercolours, acrylics, oils and limited-edition prints by the painter Rubel Khan, sold directly from the artist with delivery across Bangladesh and abroad.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en_US",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@artistrubelkhan.example",
  /** International format without +, e.g. 8801XXXXXXXXX. Unset hides WhatsApp links. */
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  socials: {
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? "",
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "",
    youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL ?? "",
  },
} as const;

export const shippingZones: ShippingZone[] = [
  { id: "inside_dhaka", name: "Inside Dhaka", rate: { amount: 15000, currency: "BDT" }, eta: "2 to 3 days" },
  { id: "outside_dhaka", name: "Outside Dhaka", rate: { amount: 30000, currency: "BDT" }, eta: "3 to 5 days" },
  { id: "international", name: "International", rate: { amount: 600000, currency: "BDT" }, eta: "7 to 14 days" },
];

export const nav = {
  primary: [
    { label: "Paintings", href: "/shop" },
    { label: "Collections", href: "/collections/old-dhaka" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Exhibitions", href: "/exhibitions" },
    { label: "About", href: "/about" },
  ],
};

export function whatsappHref(text: string) {
  if (!site.whatsapp) return null;
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
}
