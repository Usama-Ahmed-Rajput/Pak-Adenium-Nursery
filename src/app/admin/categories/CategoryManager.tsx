"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Category } from "@/types";
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Loader2,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

export default function CategoryManager({ initialCategories }: { initialCategories: Category[] }) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4000);
  };

  const handleOpenCreate = () => {
    setEditingCategory({
      name: "",
      slug: "",
      description: "",
      image_url:
        "https://images.unsplash.com/photo-1596724806740-d9962a93fa21?q=80&w=1200&auto=format&fit=crop",
      display_order: categories.length + 1,
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Category) => {
    setEditingCategory({ ...c });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setEditingCategory((prev) => (prev ? { ...prev, image_url: data.url } : null));
        showNotification("Category image uploaded successfully.", "success");
      } else {
        showNotification(data.error || "Failed to upload image.", "error");
      }
    } catch {
      showNotification("Network error uploading image.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}"? Existing products in this category will remain safe.`)) return;

    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
        showNotification(`Category "${name}" removed successfully.`, "success");
        router.refresh();
      } else {
        showNotification("Failed to delete category.", "error");
      }
    } catch {
      showNotification("Error deleting category.", "error");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.name?.trim()) return;

    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingCategory),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const saved: Category = data.category;
        setCategories((prev) => {
          const idx = prev.findIndex((c) => c.id === saved.id);
          if (idx >= 0) {
            const clone = [...prev];
            clone[idx] = saved;
            return clone;
          }
          return [...prev, saved];
        });
        showNotification(`Category "${saved.name}" saved successfully.`, "success");
        setIsModalOpen(false);
        router.refresh();
      } else {
        showNotification(data.error || "Failed to save category.", "error");
      }
    } catch {
      showNotification("Failed to save category.", "error");
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

      <div className="flex justify-end">
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-botanical-900 hover:bg-botanical-950 text-ivory text-xs font-semibold shadow-card transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((c) => (
          <div
            key={c.id}
            className="rounded-3xl bg-white border border-botanical-200/80 shadow-subtle p-5 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-ivory-sand border border-botanical-200">
                <img src={c.image_url} alt={c.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-botanical-950">{c.name}</h3>
                  <span className="font-mono text-[11px] text-charcoal-muted">slug: {c.slug}</span>
                </div>
                <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-botanical-100 text-botanical-900 flex-shrink-0">
                  {c.product_count ?? 0} products
                </span>
              </div>
              <p className="text-xs text-charcoal-muted line-clamp-2 leading-relaxed">{c.description}</p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-botanical-100 text-xs">
              <a
                href={`/shop?category=${c.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-clay hover:underline inline-flex items-center gap-1 font-medium"
              >
                <span>View in Shop</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(c)}
                  className="p-1.5 rounded-lg text-clay hover:bg-clay/10 transition-colors"
                  title="Edit Category"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(c.id, c.name)}
                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                  title="Delete Category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-botanical-950/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-white rounded-3xl border border-botanical-200 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-botanical-100">
              <h3 className="text-lg font-bold tracking-tight text-botanical-950">
                {editingCategory.id ? "Edit Category" : "Add New Category"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-botanical-400 hover:text-botanical-950">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-botanical-900 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={editingCategory.name || ""}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, name: e.target.value })
                  }
                  className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 font-medium text-botanical-950"
                />
              </div>

              <div>
                <label className="block font-medium text-botanical-900 mb-1">Custom Slug (Optional)</label>
                <input
                  type="text"
                  value={editingCategory.slug || ""}
                  placeholder="Auto-generated if left empty"
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, slug: e.target.value })
                  }
                  className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 font-mono text-botanical-950"
                />
              </div>

              <div>
                <label className="block font-medium text-botanical-900 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingCategory.description || ""}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, description: e.target.value })
                  }
                  className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2 text-botanical-950"
                />
              </div>

              {/* Cover Image with Upload Button */}
              <div>
                <label className="block font-medium text-botanical-900 mb-1">Cover Photograph</label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={editingCategory.image_url || ""}
                      onChange={(e) =>
                        setEditingCategory({ ...editingCategory, image_url: e.target.value })
                      }
                      className="flex-1 bg-ivory border border-botanical-300 rounded-xl px-3 py-2 font-mono text-botanical-950"
                    />
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) handleImageUpload(e.target.files[0]);
                      }}
                    />
                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-2 rounded-xl bg-botanical-100 hover:bg-botanical-200 text-botanical-900 font-semibold inline-flex items-center gap-1 flex-shrink-0"
                    >
                      {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
                      <span>Upload</span>
                    </button>
                  </div>

                  {editingCategory.image_url && (
                    <div className="w-full h-28 rounded-xl overflow-hidden bg-ivory-sand border border-botanical-200">
                      <img src={editingCategory.image_url} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-botanical-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-botanical-300 text-botanical-700 hover:bg-botanical-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 rounded-xl bg-botanical-900 hover:bg-botanical-950 text-ivory font-semibold shadow-card flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>Save Category</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
