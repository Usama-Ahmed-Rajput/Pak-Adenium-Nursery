import React, { Suspense } from "react";
import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CatalogView from "@/components/shop/CatalogView";
import { getProducts, getCategories, getSiteSettings } from "@/lib/db";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Botanical Specimen Catalog — Desert Roses & Adenium Bonsai",
    description:
      "Explore hand-selected Adenium Obesum, Arabicum, grafted multi-petal varieties, and rare collector bonsai specimens in Pakistan. Nationwide live delivery.",
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
      <Footer />
    </>
  );
}
