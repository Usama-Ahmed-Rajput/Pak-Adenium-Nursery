import type { Metadata } from "next";
import { DM_Serif_Display, Manrope } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/cart/CartDrawer";
import { getSiteSettings } from "@/lib/db";
import {
  buildOpenGraphMeta,
  buildOrganizationSchema,
  buildWebsiteSchema,
  DEFAULT_OG_IMAGE,
  fitMetaDescription,
  getSiteUrl,
} from "@/lib/seo";

const dmSerif = DM_Serif_Display({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const manrope = Manrope({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteName = settings.general.nursery_name || "Pak Adenium";
  const tagline = settings.general.tagline || "Living Sculptures. Grown with Care.";
  const defaultDescription =
    "Shop rare Desert Rose (Adenium) plants, grafted multi-petal blooms, Arabicum caudex bonsai & fresh seeds at Pak Adenium with safe delivery in Pakistan.";
  const metaTitle = settings.seo?.meta_title || `${siteName} — Desert Rose & Adenium Nursery Pakistan`;
  const metaDescription = fitMetaDescription(settings.seo?.meta_description, defaultDescription);
  const ogImage = settings.seo?.og_image || DEFAULT_OG_IMAGE;
  const metaKeywords =
    settings.seo?.meta_keywords && settings.seo.meta_keywords.length > 0
      ? settings.seo.meta_keywords
      : [
          "Pak Adenium",
          "Pak Adenium Pakistan",
          "Adenium Plants in Pakistan",
          "Buy Adenium Plants in Pakistan",
          "Desert Rose Plants Pakistan",
          "Adenium Seeds Pakistan",
          "Adenium Nursery Pakistan",
          "Grafted Adenium",
          "Adenium Arabicum bonsai",
          "Adenium Obesum",
        ];

  return {
    title: {
      default: metaTitle,
      template: `%s | ${siteName}`,
    },
    description: metaDescription,
    keywords: metaKeywords,
    authors: [{ name: `${siteName} Nursery` }],
    creator: `${siteName} Horticultural Farms`,
    metadataBase: new URL(getSiteUrl()),
    alternates: {
      canonical: "/",
    },
    openGraph: buildOpenGraphMeta({
      title: `${siteName} — ${tagline}`,
      description: metaDescription,
      url: "/",
      siteName,
      image: ogImage,
      imageAlt: `${siteName} Desert Rose & Adenium Collection in Pakistan`,
    }),
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  const organizationSchema = buildOrganizationSchema(settings);
  const websiteSchema = buildWebsiteSchema(settings.general.nursery_name);

  return (
    <html lang="en" dir="ltr" translate="no" className={`notranslate ${dmSerif.variable} ${manrope.variable}`}>
      <head>
        <meta httpEquiv="Content-Language" content="en" />
        <meta name="google" content="notranslate" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body translate="no" className="notranslate antialiased min-h-screen flex flex-col bg-ivory text-botanical-950 font-sans">
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}

