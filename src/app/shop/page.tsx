import React, { Suspense } from "react";
import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CatalogView from "@/components/shop/CatalogView";
import { getProducts, getCategories, getSiteSettings } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Desert Rose Plants & Bonsai Catalog — Pak Adenium Nursery",
    description:
      "Explore hand-selected Desert Rose plants, grafted multi-petal varieties, and rare collector bonsai in Pakistan. Nationwide live delivery.",
  };
}

export default async function ShopPage() {
  const [products, categories, settings] = await Promise.all([
    getProducts(),
    getCategories(),
    getSiteSettings(),
  ]);

  return (
    <>
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
