import type { Metadata } from "next";
import { DM_Serif_Display, Manrope } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/cart/CartDrawer";
import { getSiteSettings } from "@/lib/db";

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
  const metaTitle = settings.seo?.meta_title || `${siteName} — Premium Desert Rose Nursery Pakistan`;
  const metaDescription =
    settings.seo?.meta_description ||
    "Pakistan's premier botanical nursery specializing in rare Desert Rose (Adenium) plants, multi-petal grafted blooms, sculptural Arabicum caudex bonsai, and fresh seeds. Nationwide safe delivery.";
  const metaKeywords =
    settings.seo?.meta_keywords && settings.seo.meta_keywords.length > 0
      ? settings.seo.meta_keywords
      : [
          "Adenium Pakistan",
          "Desert Rose plants",
          "Grafted Adenium",
          "Adenium Arabicum bonsai",
          "Adenium Obesum",
          "Dorset Horn Adenium",
          "Buy Adenium online Pakistan",
          "Adenium seeds Pakistan",
          "Lahore plant nursery",
          "Karachi succulent delivery",
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
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    openGraph: {
      type: "website",
      locale: "en_PK",
      url: "/",
      siteName: siteName,
      title: `${siteName} — ${tagline}`,
      description: metaDescription,
      images: [
        {
          url: settings.seo?.og_image || "https://images.unsplash.com/photo-1596724806740-d9962a93fa21?q=80&w=1200&auto=format&fit=crop",
          width: 1200,
          height: 630,
          alt: `${siteName} Desert Rose Collection`,
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "GardenStore",
    name: settings.general.nursery_name,
    description: "Specialist Adenium botanical nursery propagating Desert Roses in Pakistan.",
    telephone: settings.general.phone,
    email: settings.general.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.general.address,
      addressCountry: "PK",
    },
    currenciesAccepted: "PKR",
    paymentAccepted: "Cash, Bank Transfer, EasyPaisa, JazzCash",
    priceRange: "₨1,500 - ₨35,000",
  };

  return (
    <html lang="en" className={`${dmSerif.variable} ${manrope.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-ivory text-botanical-950 font-sans">
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}

