import React from "react";
import { getAllProductsAdmin, getCategories } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import InventoryManager from "./InventoryManager";

export const revalidate = 0;

export default async function AdminInventoryPage() {
  await requireAdmin();
  const [products, categories] = await Promise.all([
    getAllProductsAdmin(),
    getCategories(),
  ]);

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-botanical-200">
        <span className="text-xs uppercase tracking-widest text-clay font-medium">
          Stock Safeguards
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-botanical-950 mt-1">
          Inventory Tracking & Bench Balances
        </h1>
        <p className="text-xs text-charcoal-muted mt-1">
          Monitor plant stock counts in real time, set thresholds, and prevent overselling.
        </p>
      </div>

      <InventoryManager initialProducts={products} categories={categories} />
    </div>
  );
}

