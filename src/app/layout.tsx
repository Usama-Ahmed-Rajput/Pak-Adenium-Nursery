import type { Metadata } from "next";
import { DM_Serif_Display, Manrope } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/cart/CartDrawer";
import { getSiteSettings } from "@/lib/db";
import { buildOrganizationSchema, buildWebsiteSchema, getSiteUrl } from "@/lib/seo";

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
  const metaTitle = settings.seo?.meta_title || `${siteName} — Buy Adenium & Desert Rose Plants in Pakistan`;
  const metaDescription =
    settings.seo?.meta_description ||
    "Pak Adenium is Pakistan's premier botanical nursery for Desert Rose (Adenium) plants, grafted multi-petal blooms, Adenium Arabicum caudex bonsai, and fresh Adenium seeds with nationwide delivery.";
  const ogImage =
    settings.seo?.og_image ||
    "https://images.unsplash.com/photo-1596724806740-d9962a93fa21?q=80&w=1200&auto=format&fit=crop";
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
    openGraph: {
      type: "website",
      locale: "en_PK",
      url: "/",
      siteName: siteName,
      title: `${siteName} — ${tagline}`,
      description: metaDescription,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${siteName} Desert Rose & Adenium Collection in Pakistan`,
        },
      ],
    },
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

