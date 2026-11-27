import React, { Suspense } from "react";
import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CatalogView from "@/components/shop/CatalogView";
import { getProducts, getCategories, getSiteSettings } from "@/lib/db";
import { buildBreadcrumbSchema, buildOpenGraphMeta } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Buy Adenium & Desert Rose in Pakistan";
  const description =
    "Explore grafted multi-petal Adenium plants, Adenium Arabicum caudex bonsai, rare hybrids, fresh seeds, and mineral potting soil with delivery in Pakistan.";

  return {
    title,
    description,
    alternates: {
      canonical: "/shop",
    },
    openGraph: buildOpenGraphMeta({
      title: `${title} | Pak Adenium`,
      description,
      url: "/shop",
    }),
    twitter: {
      card: "summary_large_image",
      title: `${title} | Pak Adenium`,
      description,
    },
  };
}

export default async function ShopPage() {
  const [products, categories, settings] = await Promise.all([
    getProducts(),
    getCategories(),
    getSiteSettings(),
  ]);

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Shop Adenium Plants", path: "/shop" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Navbar
        announcement={settings.announcement}
        whatsappNumber={settings.general.whatsapp}
        phone={settings.general.phone}
        address={settings.general.address}
        nurseryName={settings.general.nursery_name}
      />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="py-20 text-center text-sm text-charcoal-muted">
              Loading Botanical Catalog...
            </div>
          }
        >
          <CatalogView initialProducts={products} categories={categories} />
        </Suspense>
      </main>
      <Footer
        nurseryName={settings.general.nursery_name}
        tagline={settings.general.tagline}
        phone={settings.general.phone}
        email={settings.general.email}
        address={settings.general.address}
        social={settings.social}
        whatsappNumber={settings.general.whatsapp}
      />
    </>
  );
}
