"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product, Category, ProductImage } from "@/types";
import { formatPrice } from "@/lib/utils";
import ImageUploadManager from "@/components/admin/ImageUploadManager";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Check,
  X,
  AlertCircle,
  Loader2,
  ExternalLink,
  CheckCircle2,
  Star,
  ToggleLeft,
  ToggleRight,
  Filter,
} from "lucide-react";

interface ProductManagerProps {
  initialProducts: Product[];
  categories: Category[];
}

export default function ProductManager({ initialProducts, categories }: ProductManagerProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft" | "featured">("all");

  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  // Delete Confirmation Modal
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast Notification
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4000);
  };

  const filtered = products.filter((p) => {
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.species.toLowerCase().includes(q) ||
      p.variety.toLowerCase().includes(q);

    const matchesCategory = categoryFilter === "all" || p.category_id === categoryFilter;

    let matchesStatus = true;
    if (statusFilter === "published") {
      matchesStatus = p.is_published;
    } else if (statusFilter === "draft") {
      matchesStatus = !p.is_published;
    } else if (statusFilter === "featured") {
      matchesStatus = p.is_featured;
    }

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleOpenCreate = () => {
    const firstCat = categories[0];
    setEditingProduct({
      name: "",
      slug: "",
      sku: `PAK-${Math.floor(100 + Math.random() * 900)}`,
      category_id: firstCat?.id || "cat-grafted",
      category_name: firstCat?.name || "Grafted Varieties",
      species: "Adenium Obesum",
      variety: "Hybrid Variety",
      flower_color: "Multi-Petal Rose Pink",
      petal_type: "Triple Layer",
      price: 4500,
      sale_price: null,
      stock_quantity: 5,
      low_stock_threshold: 2,
      caudex_size: "Medium (16cm girth)",
      plant_age: "2.5 Years",
      is_grafted: true,
      pot_size: "8-inch Nursery Pot",
      description: "Cultivated in our Karachi nursery beds with high sun exposure.",
      care_watering: "Water thoroughly only when topsoil is 100% bone dry.",
      care_sunlight: "Full direct sun (6-8 hours minimum).",
      care_temperature: "25°C to 45°C. Protect from heavy winter frost.",
      care_soil: "Porous mineral blend: pumice, river sand, brick chips, and aged compost.",
      seasonal_notes: "Flushes spring through autumn in Pakistan climate.",
      is_featured: false,
      is_published: true,
      images: [
        {
          id: "img-" + Math.random().toString(36).substring(2, 7),
          image_url:
            "https://images.unsplash.com/photo-1596724806740-d9962a93fa21?q=80&w=1200&auto=format&fit=crop",
          alt_text: "Adenium flower plant",
          is_primary: true,
          display_order: 1,
        },
      ],
    });
    setFormError("");
    setIsDirty(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct({ ...p, images: p.images ? [...p.images] : [] });
    setFormError("");
    setIsDirty(false);
    setIsModalOpen(true);
  };

  const handleCancelModal = () => {
    if (isDirty) {
      if (!confirm("Discard unsaved product changes?")) return;
    }
    setIsModalOpen(false);
    setEditingProduct(null);
    setIsDirty(false);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/products?id=${encodeURIComponent(deletingProduct.id)}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id));
        showNotification(`Product "${deletingProduct.name}" removed from catalog.`, "success");
        setDeletingProduct(null);
        router.refresh();
      } else {
        showNotification(data.error || "Failed to delete product.", "error");
      }
    } catch {
      showNotification("Network error while deleting product.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTogglePublished = async (product: Product) => {
    const updatedStatus = !product.is_published;
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...product, is_published: updatedStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, is_published: updatedStatus } : p))
        );
        showNotification(
          `"${product.name}" is now ${updatedStatus ? "Published" : "Draft (Hidden)"}.`,
          "success"
        );
        router.refresh();
      }
    } catch {
      showNotification("Failed to toggle publish status.", "error");
    }
  };

  const handleSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.price) {
      setFormError("Product name and price are required.");
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
        setFormError(data.error || "Failed to save product.");
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

      showNotification(`Product "${saved.name}" saved successfully.`, "success");
      setIsModalOpen(false);
      setEditingProduct(null);
      setIsDirty(false);
      router.refresh();
    } catch {
      setFormError("Network error while saving.");
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

      {/* Top Action Bar & Filters */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-botanical-200 shadow-subtle">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search products by name, SKU, species, variety..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-ivory border border-botanical-300 rounded-xl pl-9 pr-4 py-2 text-xs text-botanical-950 focus:outline-none focus:border-botanical-700"
            />
            <Search className="w-4 h-4 text-botanical-400 absolute left-3 top-2.5" />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-ivory border border-botanical-300 rounded-xl px-3 py-2 text-xs text-botanical-950 focus:outline-none focus:border-botanical-700"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as unknown as "all")}
            className="bg-ivory border border-botanical-300 rounded-xl px-3 py-2 text-xs text-botanical-950 focus:outline-none focus:border-botanical-700"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Drafts Only</option>
            <option value="featured">Featured On Homepage</option>
          </select>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-botanical-900 hover:bg-botanical-950 text-ivory text-xs font-semibold shadow-card transition-colors flex-shrink-0"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl bg-white border border-botanical-200/80 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-botanical-50 border-b border-botanical-200 text-botanical-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Product</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Species & Variety</th>
                <th className="py-3 px-4 font-semibold text-right">Price (PKR)</th>
                <th className="py-3 px-4 font-semibold text-center">Stock</th>
                <th className="py-3 px-4 font-semibold text-center">Storefront Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-botanical-100">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-ivory/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-ivory-sand border border-botanical-200 flex-shrink-0 relative">
                        <img
                          src={prod.images?.[0]?.image_url || "https://images.unsplash.com/photo-1596724806740-d9962a93fa21?q=80&w=400&auto=format&fit=crop"}
                          alt={prod.name}
                          className="w-full h-full object-cover"
                        />
                        {prod.is_featured && (
                          <div className="absolute top-0.5 right-0.5 bg-amber-500 text-white p-0.5 rounded-full" title="Featured on Homepage">
                            <Star className="w-2.5 h-2.5 fill-current" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="font-semibold text-botanical-950 block truncate max-w-xs">{prod.name}</span>
                        <span className="text-charcoal-muted font-mono text-[11px]">{prod.sku}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-charcoal-muted">
                    {prod.category_name || "Grafted Varieties"}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-botanical-900 font-medium block">{prod.species}</span>
                    <span className="text-charcoal-muted text-[11px]">{prod.variety} · {prod.flower_color}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-right">
                    <div className="font-semibold text-botanical-950">
                      {formatPrice(prod.sale_price ?? prod.price)}
                    </div>
                    {prod.sale_price && (
                      <span className="line-through text-charcoal-muted text-[10px]">
                        {formatPrice(prod.price)}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                        prod.stock_quantity === 0
                          ? "bg-red-100 text-red-700"
                          : prod.stock_quantity <= prod.low_stock_threshold
                          ? "bg-amber-100 text-amber-700"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {prod.stock_quantity}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleTogglePublished(prod)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all ${
                        prod.is_published
                          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                          : "bg-charcoal/10 text-charcoal hover:bg-charcoal/20"
                      }`}
                      title="Click to toggle publish status"
                    >
                      {prod.is_published ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/shop/${prod.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg text-botanical-500 hover:text-botanical-950 hover:bg-botanical-100 transition-colors"
                        title="View on Storefront"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleOpenEdit(prod)}
                        className="p-1.5 rounded-lg text-clay hover:bg-clay/10 transition-colors"
                        title="Edit Product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingProduct(prod)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-charcoal-muted">
                    <p className="font-medium text-sm">No products match your search or filter criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-botanical-950/60 backdrop-blur-sm"
            onClick={() => setDeletingProduct(null)}
          />

          <div className="relative w-full max-w-md bg-white rounded-3xl border border-botanical-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold tracking-tight text-botanical-950">
                  Delete Product?
                </h3>
                <span className="text-xs text-charcoal-muted">This action is permanent and cannot be undone.</span>
              </div>
            </div>

            <p className="text-xs text-botanical-900 leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-botanical-950">&ldquo;{deletingProduct.name}&rdquo;</strong> (SKU: {deletingProduct.sku}) from the catalog?
            </p>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingProduct(null)}
                className="px-4 py-2 rounded-xl border border-botanical-300 text-botanical-800 text-xs font-medium hover:bg-botanical-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteConfirm}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                <span>Delete Product</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-botanical-950/60 backdrop-blur-sm"
            onClick={handleCancelModal}
          />

          <div className="relative w-full max-w-3xl bg-white rounded-3xl border border-botanical-200 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-botanical-100">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-clay font-semibold">
                  Catalog Curator
                </span>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-botanical-950">
                  {editingProduct.id ? "Edit Product" : "Add New Product"}
                </h2>
              </div>
              <button
                onClick={handleCancelModal}
                className="p-1.5 text-botanical-400 hover:text-botanical-950 rounded-lg hover:bg-botanical-100"
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

            <form onSubmit={handleSaveSubmit} className="space-y-6 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-medium text-botanical-900 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name || ""}
                    onChange={(e) => {
                      setEditingProduct({ ...editingProduct, name: e.target.value });
                      setIsDirty(true);
                    }}
                    placeholder="e.g. Dorset Horn Adenium 'Khao Hin Khon'"
                    className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 text-botanical-950 focus:outline-none focus:border-botanical-700 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-medium text-botanical-900 mb-1">
                    SKU Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.sku || ""}
                    onChange={(e) => {
                      setEditingProduct({ ...editingProduct, sku: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 font-mono text-botanical-950"
                  />
                </div>

                <div>
                  <label className="block font-medium text-botanical-900 mb-1">
                    URL Slug (Unique path)
                  </label>
                  <input
                    type="text"
                    value={editingProduct.slug || ""}
                    placeholder="Auto-generated from name if left empty"
                    onChange={(e) => {
                      setEditingProduct({ ...editingProduct, slug: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 font-mono text-botanical-950"
                  />
                </div>

                <div>
                  <label className="block font-medium text-botanical-900 mb-1">
                    Category *
                  </label>
                  <select
                    value={editingProduct.category_id || ""}
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
                    value={editingProduct.species || ""}
                    onChange={(e) => {
                      setEditingProduct({ ...editingProduct, species: e.target.value });
                      setIsDirty(true);
                    }}
                    placeholder="e.g. Adenium Arabicum"
                    className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5"
                  />
                </div>

                <div>
                  <label className="block font-medium text-botanical-900 mb-1">
                    Variety & Form
                  </label>
                  <input
                    type="text"
                    value={editingProduct.variety || ""}
                    onChange={(e) => {
                      setEditingProduct({ ...editingProduct, variety: e.target.value });
                      setIsDirty(true);
                    }}
                    placeholder="e.g. Super Baobab Dwarf"
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

                <div>
                  <label className="block font-medium text-botanical-900 mb-1">
                    Price in PKR *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={editingProduct.price || 0}
                    onChange={(e) => {
                      setEditingProduct({ ...editingProduct, price: Number(e.target.value) });
                      setIsDirty(true);
                    }}
                    className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 font-mono font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-medium text-botanical-900 mb-1">
                    Sale Price (Leave empty if not on sale)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editingProduct.sale_price ?? ""}
                    onChange={(e) => {
                      setEditingProduct({
                        ...editingProduct,
                        sale_price: e.target.value ? Number(e.target.value) : null,
                      });
                      setIsDirty(true);
                    }}
                    placeholder="e.g. 4200"
                    className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-botanical-900 mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={editingProduct.stock_quantity ?? 0}
                    onChange={(e) => {
                      setEditingProduct({
                        ...editingProduct,
                        stock_quantity: Math.max(0, parseInt(e.target.value, 10) || 0),
                      });
                      setIsDirty(true);
                    }}
                    className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-medium text-botanical-900 mb-1">
                    Low Stock Threshold
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editingProduct.low_stock_threshold ?? 2}
                    onChange={(e) => {
                      setEditingProduct({
                        ...editingProduct,
                        low_stock_threshold: Math.max(0, parseInt(e.target.value, 10) || 0),
                      });
                      setIsDirty(true);
                    }}
                    className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 font-mono"
                  />
                </div>

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
                    className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5"
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
                    className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-medium text-botanical-900 mb-1">
                    Botanical Description *
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

                {/* Integrated Media Uploader */}
                <div className="sm:col-span-2">
                  <ImageUploadManager
                    images={editingProduct.images || []}
                    onChange={(imgs: ProductImage[]) => {
                      setEditingProduct({ ...editingProduct, images: imgs });
                      setIsDirty(true);
                    }}
                  />
                </div>

                {/* Toggles */}
                <div className="sm:col-span-2 flex flex-wrap items-center gap-6 pt-2 border-t border-botanical-100">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-botanical-900">
                    <input
                      type="checkbox"
                      checked={editingProduct.is_published ?? true}
                      onChange={(e) => {
                        setEditingProduct({ ...editingProduct, is_published: e.target.checked });
                        setIsDirty(true);
                      }}
                      className="w-4 h-4 rounded text-clay"
                    />
                    <span>Publish to Public Catalog</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-medium text-botanical-900">
                    <input
                      type="checkbox"
                      checked={editingProduct.is_featured ?? false}
                      onChange={(e) => {
                        setEditingProduct({ ...editingProduct, is_featured: e.target.checked });
                        setIsDirty(true);
                      }}
                      className="w-4 h-4 rounded text-clay"
                    />
                    <span>Feature on Homepage Showcase</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-medium text-botanical-900">
                    <input
                      type="checkbox"
                      checked={editingProduct.is_grafted ?? true}
                      onChange={(e) => {
                        setEditingProduct({ ...editingProduct, is_grafted: e.target.checked });
                        setIsDirty(true);
                      }}
                      className="w-4 h-4 rounded text-clay"
                    />
                    <span>Grafted Scion</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-botanical-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCancelModal}
                  className="px-5 py-2.5 rounded-xl border border-botanical-300 text-botanical-700 hover:bg-botanical-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-7 py-2.5 rounded-xl bg-botanical-900 text-ivory font-semibold hover:bg-botanical-950 shadow-card flex items-center gap-2 disabled:opacity-50 transition-colors"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>Save Product</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
