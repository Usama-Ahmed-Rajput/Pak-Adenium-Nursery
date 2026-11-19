import React from "react";
import { getAllProductsAdmin, getCategories } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import ProductManager from "./ProductManager";

export const revalidate = 0;

export default async function AdminProductsPage() {
  await requireAdmin();
  const [products, categories] = await Promise.all([
    getAllProductsAdmin(),
    getCategories(),
  ]);

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-botanical-200">
        <span className="text-xs uppercase tracking-widest text-clay font-medium">
          Inventory Control
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-botanical-950 mt-1">
          Catalog & Specimen Management
        </h1>
        <p className="text-xs text-charcoal-muted mt-1">
          Manage Desert Rose specimens, graft forms, pricing, and botanical care attributes.
        </p>
      </div>

      <ProductManager initialProducts={products} categories={categories} />
    </div>
  );
}

