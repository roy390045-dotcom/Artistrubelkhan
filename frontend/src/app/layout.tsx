import type { Metadata, Viewport } from "next";
import { Albert_Sans, Besley } from "next/font/google";
import { CartDrawer } from "@/components/cart-drawer";
import { EnquiryDock } from "@/components/enquiry-dock";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/lib/site";
import "./globals.css";

const besley = Besley({
  subsets: ["latin"],
  variable: "--font-besley",
  display: "swap",
});

const albert = Albert_Sans({
  subsets: ["latin"],
  variable: "--font-albert",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    title: site.title,
    description: site.description,
    url: "/",
  },
  twitter: { card: "summary_large_image", title: site.title, description: site.description },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#e8e8e3",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const sameAs = Object.values(site.socials).filter(Boolean);
  return (
    <html lang="en" className={`${besley.variable} ${albert.variable}`}>
      <body>
        <SiteHeader />
        <main id="main" className="pt-[var(--nav)]">
          {children}
        </main>
        <SiteFooter />
        <CartDrawer />
        <EnquiryDock />
        <JsonLd
          data={[
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: site.name,
              url: site.url,
              potentialAction: {
                "@type": "SearchAction",
                target: `${site.url}/shop?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            },
            {
              "@context": "https://schema.org",
              "@type": "Person",
              name: site.name,
              jobTitle: "Painter",
              url: site.url,
              ...(sameAs.length ? { sameAs } : {}),
            },
          ]}
        />
      </body>
    </html>
  );
}
