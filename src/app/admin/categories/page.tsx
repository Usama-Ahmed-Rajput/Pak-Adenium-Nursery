import React from "react";
import { getCategories } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import CategoryManager from "./CategoryManager";

export const revalidate = 0;

export default async function AdminCategoriesPage() {
  await requireAdmin();
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-botanical-200">
        <span className="text-xs uppercase tracking-widest text-clay font-medium">
          Taxonomy & Grouping
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-botanical-950 mt-1">
          Botanical Categories
        </h1>
        <p className="text-xs text-charcoal-muted mt-1">
          Organize specimens into intuitive botanical classifications for storefront navigation.
        </p>
      </div>

      <CategoryManager initialCategories={categories} />
    </div>
  );
}

