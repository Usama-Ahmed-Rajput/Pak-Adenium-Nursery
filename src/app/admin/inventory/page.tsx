import React from "react";
import { getAllProductsAdmin, getCategories } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import InventoryManager from "./InventoryManager";

export const revalidate = 0;

export default async function AdminInventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  await requireAdmin();
  const [{ edit }, products, categories] = await Promise.all([
    searchParams,
    getAllProductsAdmin(),
    getCategories(),
  ]);

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-botanical-200">
        <span className="text-xs uppercase tracking-widest text-clay font-semibold">
          Stock Safeguards
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-botanical-950 mt-1">
          Inventory Tracking & Stock Management
        </h1>
        <p className="text-xs text-charcoal-muted mt-1">
          Monitor plant stock counts in real time, edit product names, photos, prices, and prevent overselling.
        </p>
      </div>

      <InventoryManager
        initialProducts={products}
        categories={categories}
        initialEditId={edit}
      />
    </div>
  );
}

