"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Product, Category, ProductImage } from "@/types";
import { formatPrice } from "@/lib/utils";
import ImageUploadManager from "@/components/admin/ImageUploadManager";
import {
  Plus,
  Minus,
  Search,
  AlertTriangle,
  Check,
  Edit2,
  X,
  Loader2,
  Filter,
  CheckCircle2,
  AlertCircle,
  Package,
  Layers,
  ArrowUpDown,
  ExternalLink,
} from "lucide-react";

interface InventoryManagerProps {
  initialProducts: Product[];
  categories: Category[];
  initialEditId?: string;
}

export default function InventoryManager({ initialProducts, categories, initialEditId }: InventoryManagerProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [stockFilter, setStockFilter] = useState<"all" | "in_stock" | "low_stock" | "out_of_stock">("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const initialMatch = initialEditId
    ? initialProducts.find((p) => p.id === initialEditId) ?? null
    : null;

  // Edit Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(
    initialMatch ? { ...initialMatch, images: initialMatch.images ? [...initialMatch.images] : [] } : null
  );
  const [isModalOpen, setIsModalOpen] = useState(Boolean(initialMatch));
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  // Notification Toast
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4000);
  };

  // Filtering
  const filtered = products.filter((p) => {
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.variety.toLowerCase().includes(q) ||
      p.species.toLowerCase().includes(q);

    const matchesCategory = selectedCategory === "all" || p.category_id === selectedCategory;

    let matchesStock = true;
    if (stockFilter === "out_of_stock") {
      matchesStock = p.stock_quantity === 0;
    } else if (stockFilter === "low_stock") {
      matchesStock = p.stock_quantity > 0 && p.stock_quantity <= p.low_stock_threshold;
    } else if (stockFilter === "in_stock") {
      matchesStock = p.stock_quantity > p.low_stock_threshold;
    }

    return matchesSearch && matchesCategory && matchesStock;
  });

  // KPI Calculations
  const totalItems = products.length;
  const outOfStockCount = products.filter((p) => p.stock_quantity === 0).length;
  const lowStockCount = products.filter((p) => p.stock_quantity > 0 && p.stock_quantity <= p.low_stock_threshold).length;
  const adequateCount = products.filter((p) => p.stock_quantity > p.low_stock_threshold).length;

  // Quick Stock Step (+1 / -1)
  const handleQuickStep = async (productId: string, newQty: number) => {
    if (newQty < 0) return;
    setUpdatingId(productId);

    try {
      const res = await fetch("/api/admin/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: newQty }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, stock_quantity: newQty } : p))
        );
        showNotification(`Stock count for ${data.product.name} updated to ${newQty}.`, "success");
        router.refresh();
      } else {
        showNotification(data.error || "Failed to adjust stock count.", "error");
      }
    } catch {
      showNotification("Network error while updating stock.", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  // Open Full Edit Modal
  const handleOpenEdit = (p: Product) => {
    setEditingProduct({ ...p, images: p.images ? [...p.images] : [] });
    setFormError("");
    setIsDirty(false);
    setIsModalOpen(true);
  };

  // Cancel with unsaved check
  const handleCancel = () => {
    if (isDirty) {
      if (!confirm("You have unsaved changes. Are you sure you want to discard them?")) {
        return;
      }
    }
    setIsModalOpen(false);
    setEditingProduct(null);
    setIsDirty(false);
  };

  // Save Full Product & Inventory Changes
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (!editingProduct.name.trim()) {
      setFormError("Product name is required.");
      return;
    }
    if (editingProduct.price <= 0) {
      setFormError("Price must be greater than 0 PKR.");
      return;
    }
    if (editingProduct.stock_quantity < 0) {
      setFormError("Stock quantity cannot be negative.");
      return;
    }

    setIsSaving(true);
    setFormError("");

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProduct),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setFormError(data.error || "Failed to persist product changes.");
        setIsSaving(false);
        return;
      }

      const saved: Product = data.product;
      setProducts((prev) => {
        const idx = prev.findIndex((p) => p.id === saved.id);
        if (idx >= 0) {
          const clone = [...prev];
          clone[idx] = saved;
          return clone;
        }
        return [saved, ...prev];
      });

      showNotification(`Product "${saved.name}" saved and synced successfully.`, "success");
      setIsModalOpen(false);
      setEditingProduct(null);
      setIsDirty(false);
      router.refresh();
    } catch {
      setFormError("Network error while saving changes.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl shadow-2xl flex items-center gap-3 border text-xs transition-all ${
            notification.type === "success"
              ? "bg-emerald-950 text-emerald-100 border-emerald-700/60"
              : "bg-red-950 text-red-100 border-red-700/60"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          onClick={() => setStockFilter("all")}
          className={`p-4 rounded-2xl bg-white border cursor-pointer transition-all shadow-subtle ${
            stockFilter === "all" ? "border-botanical-800 ring-2 ring-botanical-800/10" : "border-botanical-200"
          }`}
        >
          <span className="text-[11px] font-medium text-charcoal-muted uppercase tracking-wider block">
            Total Catalog
          </span>
          <span className="text-xl font-bold font-mono text-botanical-950 mt-1 block">
            {totalItems}
          </span>
          <span className="text-[10px] text-charcoal-muted">Products tracked</span>
        </div>

        <div
          onClick={() => setStockFilter("in_stock")}
          className={`p-4 rounded-2xl bg-white border cursor-pointer transition-all shadow-subtle ${
            stockFilter === "in_stock" ? "border-emerald-600 ring-2 ring-emerald-600/10" : "border-botanical-200"
          }`}
        >
          <span className="text-[11px] font-medium text-emerald-700 uppercase tracking-wider block">
            Adequate Stock
          </span>
          <span className="text-xl font-bold font-mono text-emerald-800 mt-1 block">
            {adequateCount}
          </span>
          <span className="text-[10px] text-charcoal-muted">Above alert threshold</span>
        </div>

        <div
          onClick={() => setStockFilter("low_stock")}
          className={`p-4 rounded-2xl bg-white border cursor-pointer transition-all shadow-subtle ${
            stockFilter === "low_stock" ? "border-amber-600 ring-2 ring-amber-600/10" : "border-botanical-200"
          }`}
        >
          <span className="text-[11px] font-medium text-amber-700 uppercase tracking-wider block">
            Low Stock Alerts
          </span>
          <span className="text-xl font-bold font-mono text-amber-800 mt-1 block">
            {lowStockCount}
          </span>
          <span className="text-[10px] text-charcoal-muted">Requires nursery restock</span>
        </div>

        <div
          onClick={() => setStockFilter("out_of_stock")}
          className={`p-4 rounded-2xl bg-white border cursor-pointer transition-all shadow-subtle ${
            stockFilter === "out_of_stock" ? "border-red-600 ring-2 ring-red-600/10" : "border-botanical-200"
          }`}
        >
          <span className="text-[11px] font-medium text-red-700 uppercase tracking-wider block">
            Out of Stock
          </span>
          <span className="text-xl font-bold font-mono text-red-800 mt-1 block">
            {outOfStockCount}
          </span>
          <span className="text-[10px] text-charcoal-muted">Zero bench inventory</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-botanical-200 shadow-subtle">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative w-44 flex-shrink-0">
            <input
              type="text"
              placeholder="Search name, SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-ivory border border-botanical-300 rounded-xl pl-8 pr-3 py-2 text-xs text-botanical-950 focus:outline-none focus:border-botanical-700"
            />
            <Search className="w-3.5 h-3.5 text-botanical-400 absolute left-2.5 top-2.5" />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-ivory border border-botanical-300 rounded-xl px-3 py-2 text-xs text-botanical-950 focus:outline-none focus:border-botanical-700"
          >
            <option value="all">All Categories ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Stock Filter Dropdown */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as unknown as "all")}
            className="bg-ivory border border-botanical-300 rounded-xl px-3 py-2 text-xs text-botanical-950 focus:outline-none focus:border-botanical-700"
          >
            <option value="all">All Stock Statuses</option>
            <option value="in_stock">In Stock (Adequate)</option>
            <option value="low_stock">Low Stock Alerts</option>
            <option value="out_of_stock">Out of Stock Only</option>
          </select>
        </div>
      </div>

      {/* Showing count — above table, left-aligned */}
      <div className="flex items-center justify-between px-1">
        <p className="text-xs text-charcoal-muted">
          Showing{" "}
          <span className="font-bold text-botanical-950 text-sm">{filtered.length}</span>
          {" "}of{" "}
          <span className="font-semibold text-botanical-950">{products.length}</span>
          {" "}products
        </p>
      </div>

      {/* Inventory Table (Desktop & Tablet) */}
      <div className="hidden md:block rounded-2xl bg-white border border-botanical-200/80 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs">
            <thead className="bg-botanical-50 border-b border-botanical-200 text-botanical-800">
              <tr>
                <th className="py-3 px-2 xl:px-3 font-semibold">Product &amp; Variety</th>
                <th className="py-3 px-2 xl:px-3 font-semibold hidden xl:table-cell">Category</th>
                <th className="py-3 px-2 xl:px-3 font-semibold whitespace-nowrap hidden xl:table-cell">SKU</th>
                <th className="py-3 px-2 xl:px-3 font-semibold text-right">Unit Price</th>
                <th className="py-3 px-2 xl:px-3 font-semibold text-center">Alert Status</th>
                <th className="py-3 px-1.5 xl:px-3 font-semibold text-center">Stock</th>
                <th className="py-3 px-1.5 xl:px-3 font-semibold text-center">Quick Adjust</th>
                <th className="py-3 px-2 xl:px-4 font-semibold text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-botanical-100">
              {filtered.map((prod) => {
                const isOut = prod.stock_quantity === 0;
                const isLow = prod.stock_quantity <= prod.low_stock_threshold && !isOut;
                const isUpdating = updatingId === prod.id;
                const primaryThumb =
                  prod.images?.find((img) => img.is_primary)?.image_url ||
                  prod.images?.[0]?.image_url ||
                  "https://images.unsplash.com/photo-1596724806740-d9962a93fa21?q=80&w=400&auto=format&fit=crop";

                return (
                  <tr key={prod.id} className="group hover:bg-ivory/60 transition-colors">
                    <td className="py-3 px-2 xl:px-3">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(prod)}
                        className="flex items-center gap-2 xl:gap-2.5 text-left group/item w-full min-w-0"
                        title="Click to edit product name, picture & inventory"
                      >
                        <div className="w-9 h-9 xl:w-10 xl:h-10 rounded-lg overflow-hidden bg-ivory-sand border border-botanical-200 flex-shrink-0">
                          <img
                            src={primaryThumb}
                            alt={prod.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <span className="font-semibold text-botanical-950 group-hover/item:text-clay transition-colors block truncate max-w-[120px] lg:max-w-[140px] xl:max-w-[230px]">
                            {prod.name}
                          </span>
                          <span className="text-charcoal-muted text-[11px] block truncate max-w-[120px] lg:max-w-[140px] xl:max-w-[230px]">
                            <span className="xl:hidden font-mono">{prod.sku} · </span>
                            {prod.species} · {prod.variety}
                          </span>
                        </div>
                      </button>
                    </td>

                    <td className="py-3 px-2 xl:px-3 text-charcoal-muted font-medium whitespace-nowrap hidden xl:table-cell">
                      {prod.category_name || "Grafted"}
                    </td>

                    <td className="py-3 px-2 xl:px-3 font-mono text-charcoal-muted whitespace-nowrap hidden xl:table-cell">
                      {prod.sku}
                    </td>

                    <td className="py-3 px-2 xl:px-3 text-right font-mono font-semibold text-botanical-950 whitespace-nowrap">
                      {formatPrice(prod.sale_price ?? prod.price)}
                    </td>

                    <td className="py-3 px-2 xl:px-3 text-center whitespace-nowrap">
                      {isOut ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-semibold text-[10px]">
                          <AlertTriangle className="w-3 h-3 text-red-600" /> Out of Stock
                        </span>
                      ) : isLow ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold text-[10px]">
                          Low (≤ {prod.low_stock_threshold})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                          <Check className="w-3 h-3" /> Adequate
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-1.5 xl:px-3 text-center">
                      <span
                        className={`font-mono text-sm font-bold px-1.5 xl:px-2 py-0.5 rounded ${
                          isOut
                            ? "bg-red-50 text-red-700"
                            : isLow
                            ? "bg-amber-50 text-amber-700"
                            : "text-botanical-950"
                        }`}
                      >
                        {prod.stock_quantity}
                      </span>
                    </td>

                    {/* Quick Adjust Buttons */}
                    <td className="py-3 px-1.5 xl:px-3 text-center">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleQuickStep(prod.id, prod.stock_quantity - 1)}
                          disabled={prod.stock_quantity <= 0 || isUpdating}
                          className="p-1 rounded-lg border border-botanical-300 hover:bg-botanical-100 text-botanical-900 disabled:opacity-30 transition-colors"
                          title="Decrease stock by 1"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleQuickStep(prod.id, prod.stock_quantity + 1)}
                          disabled={isUpdating}
                          className="p-1 rounded-lg border border-botanical-300 hover:bg-botanical-100 text-botanical-900 transition-colors"
                          title="Increase stock by 1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Actions Column (Edit & Storefront Preview) */}
                    <td className="py-3 px-2 xl:px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(prod)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-botanical-800 text-white hover:bg-botanical-900 font-medium text-xs transition-colors shadow-xs"
                          title="Edit product name, pictures, prices & inventory"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <a
                          href={`/shop/${prod.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-botanical-500 hover:text-botanical-950 hover:bg-botanical-100 transition-colors inline-flex items-center justify-center"
                          title="Preview on live storefront"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-charcoal-muted">
                    <p className="font-medium text-sm">No products match your search or filter criteria.</p>
                    <p className="text-[11px] mt-1">Try resetting the category or stock status filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Inventory Cards (Edit button always visible without horizontal scrolling) */}
      <div className="md:hidden space-y-3">
        {filtered.map((prod) => {
          const isOut = prod.stock_quantity === 0;
          const isLow = prod.stock_quantity <= prod.low_stock_threshold && !isOut;
          const isUpdating = updatingId === prod.id;
          const primaryThumb =
            prod.images?.find((img) => img.is_primary)?.image_url ||
            prod.images?.[0]?.image_url ||
            "https://images.unsplash.com/photo-1596724806740-d9962a93fa21?q=80&w=400&auto=format&fit=crop";

          return (
            <div
              key={prod.id}
              className="rounded-2xl bg-white border border-botanical-200/80 p-4 shadow-subtle space-y-3 text-xs"
            >
              <div className="flex items-start justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(prod)}
                  className="flex items-center gap-3 min-w-0 text-left flex-1"
                  title="Click to edit product name, picture & inventory"
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-ivory-sand border border-botanical-200 flex-shrink-0">
                    <img src={primaryThumb} alt={prod.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-botanical-950 truncate">{prod.name}</h3>
                    <p className="text-[11px] text-charcoal-muted truncate">
                      {prod.sku} · {prod.category_name || "Grafted"}
                    </p>
                    <p className="font-mono font-semibold text-botanical-900 mt-0.5">
                      {formatPrice(prod.sale_price ?? prod.price)}
                    </p>
                  </div>
                </button>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(prod)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-botanical-800 text-white hover:bg-botanical-900 font-medium text-xs transition-colors shadow-xs"
                    title="Edit product name, pictures, prices & inventory"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <a
                    href={`/shop/${prod.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg text-botanical-500 hover:text-botanical-950 hover:bg-botanical-100 transition-colors flex-shrink-0"
                    title="Preview on live storefront"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-botanical-100">
                <div>
                  {isOut ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 font-semibold text-[10px]">
                      <AlertTriangle className="w-3 h-3 text-red-600" /> Out of Stock
                    </span>
                  ) : isLow ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold text-[10px]">
                      Low Stock ({prod.stock_quantity})
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                      <Check className="w-3 h-3" /> In Stock ({prod.stock_quantity})
                    </span>
                  )}
                </div>

                <div className="inline-flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickStep(prod.id, prod.stock_quantity - 1)}
                    disabled={prod.stock_quantity <= 0 || isUpdating}
                    className="p-1.5 rounded-lg border border-botanical-300 hover:bg-botanical-100 text-botanical-900 disabled:opacity-30"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono font-bold text-sm text-botanical-950 min-w-[2ch] text-center">
                    {prod.stock_quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleQuickStep(prod.id, prod.stock_quantity + 1)}
                    disabled={isUpdating}
                    className="p-1.5 rounded-lg border border-botanical-300 hover:bg-botanical-100 text-botanical-900"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="rounded-2xl bg-white border border-botanical-200 p-8 text-center text-charcoal-muted">
            <p className="font-medium text-sm">No products match your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* Full Edit Modal */}
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-botanical-950/60 backdrop-blur-sm"
            onClick={handleCancel}
          />

          <div className="relative w-full max-w-3xl bg-white rounded-3xl border border-botanical-200 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-botanical-100">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-ivory-sand border border-botanical-200 flex-shrink-0">
                  <img
                    src={
                      editingProduct.images?.find((img) => img.is_primary)?.image_url ||
                      editingProduct.images?.[0]?.image_url ||
                      "https://images.unsplash.com/photo-1596724806740-d9962a93fa21?q=80&w=400&auto=format&fit=crop"
                    }
                    alt={editingProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-clay font-semibold block">
                    Inventory &amp; Product Editor · {editingProduct.sku}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-botanical-950 truncate">
                    Edit: {editingProduct.name || "Untitled Plant"}
                  </h2>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCancel}
                className="p-1.5 text-botanical-400 hover:text-botanical-950 rounded-lg hover:bg-botanical-100 transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-6 text-xs">
              {/* Primary Identity Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-medium text-botanical-900 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) => {
                      setEditingProduct({ ...editingProduct, name: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 text-botanical-950 focus:outline-none focus:border-botanical-700 font-medium"
                  />
                </div>

                {/* Integrated Image & Media Manager (Right below Name for quick picture & name updates) */}
                <div className="sm:col-span-2 p-4 rounded-2xl bg-ivory/60 border border-botanical-200">
                  <ImageUploadManager
                    images={editingProduct.images || []}
                    onChange={(imgs: ProductImage[]) => {
                      setEditingProduct({ ...editingProduct, images: imgs });
                      setIsDirty(true);
                    }}
                    label="Product Photographs & Main Picture"
                    helperText="Click 'Change Main Photo' to replace the primary photo right away, or upload/paste multiple gallery images."
                  />
                </div>

                <div>
                  <label className="block font-medium text-botanical-900 mb-1">
                    SKU Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.sku}
                    onChange={(e) => {
                      setEditingProduct({ ...editingProduct, sku: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 font-mono text-botanical-950"
                  />
                </div>

                <div>
                  <label className="block font-medium text-botanical-900 mb-1">
                    Product Category *
                  </label>
                  <select
                    value={editingProduct.category_id}
                    onChange={(e) => {
                      const catId = e.target.value;
                      const catName = categories.find((c) => c.id === catId)?.name || "";
                      setEditingProduct({
                        ...editingProduct,
                        category_id: catId,
                        category_name: catName,
                      });
                      setIsDirty(true);
                    }}
                    className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 text-botanical-950 font-medium"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-botanical-900 mb-1">
                    Species Lineage
                  </label>
                  <input
                    type="text"
                    value={editingProduct.species}
                    onChange={(e) => {
                      setEditingProduct({ ...editingProduct, species: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5"
                  />
                </div>

                <div>
                  <label className="block font-medium text-botanical-900 mb-1">
                    Plant Variety & Cultivar
                  </label>
                  <input
                    type="text"
                    value={editingProduct.variety}
                    onChange={(e) => {
                      setEditingProduct({ ...editingProduct, variety: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5"
                  />
                </div>

                <div>
                  <label className="block font-medium text-botanical-900 mb-1">
                    Flower Color & Pattern
                  </label>
                  <input
                    type="text"
                    value={editingProduct.flower_color || ""}
                    onChange={(e) => {
                      setEditingProduct({ ...editingProduct, flower_color: e.target.value });
                      setIsDirty(true);
                    }}
                    placeholder="e.g. Deep Velvet Dark Crimson"
                    className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5"
                  />
                </div>

                <div>
                  <label className="block font-medium text-botanical-900 mb-1">
                    Petal Layer Form
                  </label>
                  <select
                    value={editingProduct.petal_type || "Single"}
                    onChange={(e) => {
                      setEditingProduct({ ...editingProduct, petal_type: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5"
                  >
                    <option value="Single">Single</option>
                    <option value="Double Layer">Double Layer</option>
                    <option value="Triple Layer">Triple Layer</option>
                    <option value="Rosette">Rosette / Multi</option>
                  </select>
                </div>
              </div>

              {/* Pricing & Stock Management Section */}
              <div className="p-4 rounded-2xl bg-ivory/80 border border-botanical-200 space-y-4">
                <span className="text-sm font-semibold text-botanical-950 block">
                  Stock Safeguards & Pricing (PKR)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block font-medium text-botanical-900 mb-1">
                      Selling Price (PKR) *
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={editingProduct.price}
                      onChange={(e) => {
                        setEditingProduct({ ...editingProduct, price: Number(e.target.value) });
                        setIsDirty(true);
                      }}
                      className="w-full bg-white border border-botanical-300 rounded-xl px-3 py-2 font-mono text-botanical-950 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-botanical-900 mb-1">
                      Sale Price (Optional)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={editingProduct.sale_price ?? ""}
                      placeholder="e.g. 4500"
                      onChange={(e) => {
                        setEditingProduct({
                          ...editingProduct,
                          sale_price: e.target.value ? Number(e.target.value) : null,
                        });
                        setIsDirty(true);
                      }}
                      className="w-full bg-white border border-botanical-300 rounded-xl px-3 py-2 font-mono text-botanical-950"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-botanical-900 mb-1">
                      Available Stock Qty *
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={editingProduct.stock_quantity}
                      onChange={(e) => {
                        setEditingProduct({
                          ...editingProduct,
                          stock_quantity: Math.max(0, parseInt(e.target.value, 10) || 0),
                        });
                        setIsDirty(true);
                      }}
                      className="w-full bg-white border border-botanical-300 rounded-xl px-3 py-2 font-mono text-botanical-950 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-botanical-900 mb-1">
                      Low Stock Threshold *
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={editingProduct.low_stock_threshold}
                      onChange={(e) => {
                        setEditingProduct({
                          ...editingProduct,
                          low_stock_threshold: Math.max(0, parseInt(e.target.value, 10) || 0),
                        });
                        setIsDirty(true);
                      }}
                      className="w-full bg-white border border-botanical-300 rounded-xl px-3 py-2 font-mono text-botanical-950"
                    />
                  </div>
                </div>

                {/* Dynamic Status Preview */}
                <div className="pt-2 flex items-center justify-between text-xs border-t border-botanical-200">
                  <span className="text-charcoal-muted">Computed Stock Rule:</span>
                  <div>
                    {editingProduct.stock_quantity === 0 ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-800 font-bold text-[11px]">
                        <AlertTriangle className="w-3.5 h-3.5" /> Out of Stock (Sold Out on Storefront)
                      </span>
                    ) : editingProduct.stock_quantity <= editingProduct.low_stock_threshold ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px]">
                        <AlertCircle className="w-3.5 h-3.5" /> Low Stock Warning Triggered
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                        <Check className="w-3.5 h-3.5" /> Adequate Stock Inventory
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Botanical Form Factors */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-medium text-botanical-900 mb-1">
                    Caudex Circumference
                  </label>
                  <input
                    type="text"
                    value={editingProduct.caudex_size || ""}
                    onChange={(e) => {
                      setEditingProduct({ ...editingProduct, caudex_size: e.target.value });
                      setIsDirty(true);
                    }}
                    placeholder="e.g. 18cm girth"
                    className="w-full bg-ivory border border-botanical-300 rounded-xl px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block font-medium text-botanical-900 mb-1">
                    Plant Age
                  </label>
                  <input
                    type="text"
                    value={editingProduct.plant_age || ""}
                    onChange={(e) => {
                      setEditingProduct({ ...editingProduct, plant_age: e.target.value });
                      setIsDirty(true);
                    }}
                    placeholder="e.g. 3 Years"
                    className="w-full bg-ivory border border-botanical-300 rounded-xl px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block font-medium text-botanical-900 mb-1">
                    Pot Size / Root Packing
                  </label>
                  <input
                    type="text"
                    value={editingProduct.pot_size || ""}
                    onChange={(e) => {
                      setEditingProduct({ ...editingProduct, pot_size: e.target.value });
                      setIsDirty(true);
                    }}
                    placeholder="e.g. 8-inch Nursery Pot"
                    className="w-full bg-ivory border border-botanical-300 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-medium text-botanical-900 mb-1">
                  Botanical Description & Provenance *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingProduct.description || ""}
                  onChange={(e) => {
                    setEditingProduct({ ...editingProduct, description: e.target.value });
                    setIsDirty(true);
                  }}
                  className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 text-botanical-950"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-botanical-100">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-botanical-900">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_published}
                    onChange={(e) => {
                      setEditingProduct({ ...editingProduct, is_published: e.target.checked });
                      setIsDirty(true);
                    }}
                    className="w-4 h-4 rounded text-clay"
                  />
                  <span>Active & Published on Public Storefront</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium text-botanical-900">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_featured}
                    onChange={(e) => {
                      setEditingProduct({ ...editingProduct, is_featured: e.target.checked });
                      setIsDirty(true);
                    }}
                    className="w-4 h-4 rounded text-clay"
                  />
                  <span>Featured on Homepage Showcase</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium text-botanical-900">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_grafted}
                    onChange={(e) => {
                      setEditingProduct({ ...editingProduct, is_grafted: e.target.checked });
                      setIsDirty(true);
                    }}
                    className="w-4 h-4 rounded text-clay"
                  />
                  <span>Grafted Scion</span>
                </label>
              </div>

              {/* Modal Action Buttons */}
              <div className="pt-4 border-t border-botanical-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-5 py-2.5 rounded-xl border border-botanical-300 text-botanical-700 hover:bg-botanical-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-7 py-2.5 rounded-xl bg-botanical-900 text-ivory font-semibold hover:bg-botanical-950 shadow-card flex items-center gap-2 disabled:opacity-50 transition-colors"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>Save Inventory Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
