"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Article } from "@/types";
import { Plus, Edit2, Trash2, Check, X, Loader2, BookOpen, UploadCloud, CheckCircle2, AlertCircle, ExternalLink } from "lucide-react";

export default function JournalAdminManager({ initialArticles }: { initialArticles: Article[] }) {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Partial<Article> | null>(null);
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
    setEditingArticle({
      title: "",
      slug: "",
      category: "Bonsai & Training",
      excerpt: "",
      content: "## Overview\n\nNurturing healthy root architecture in the Pakistan climate...",
      featured_image:
        "https://images.unsplash.com/photo-1596724806740-d9962a93fa21?q=80&w=1200&auto=format&fit=crop",
      author_name: "Master Horticulturist, Pak Adenium",
      read_time_minutes: 5,
      is_published: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (a: Article) => {
    setEditingArticle({ ...a });
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
        setEditingArticle((prev) => (prev ? { ...prev, featured_image: data.url } : null));
        showNotification("Article cover image uploaded successfully.", "success");
      } else {
        showNotification(data.error || "Failed to upload image.", "error");
      }
    } catch {
      showNotification("Network error uploading image.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete article "${title}"? This cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/admin/journal?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setArticles((prev) => prev.filter((a) => a.id !== id));
        showNotification(`Article "${title}" deleted.`, "success");
        router.refresh();
      } else {
        showNotification("Failed to delete article.", "error");
      }
    } catch {
      showNotification("Error deleting article.", "error");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle?.title?.trim() || !editingArticle?.content?.trim()) return;

    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingArticle),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const saved: Article = data.article;
        setArticles((prev) => {
          const idx = prev.findIndex((a) => a.id === saved.id);
          if (idx >= 0) {
            const clone = [...prev];
            clone[idx] = saved;
            return clone;
          }
          return [saved, ...prev];
        });
        showNotification(`Care guide "${saved.title}" published successfully.`, "success");
        setIsModalOpen(false);
        router.refresh();
      } else {
        showNotification(data.error || "Failed to save article.", "error");
      }
    } catch {
      showNotification("Failed to save article.", "error");
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
          <Plus className="w-4 h-4" /> Write New Care Guide
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((art) => (
          <div
            key={art.id}
            className="rounded-3xl bg-white border border-botanical-200/80 shadow-subtle p-5 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-ivory-sand border border-botanical-200">
                <img src={art.featured_image} alt={art.title} className="w-full h-full object-cover" />
              </div>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-clay px-2 py-0.5 rounded bg-clay/10 inline-block">
                {art.category}
              </span>
              <h3 className="text-lg font-bold tracking-tight text-botanical-950 line-clamp-2">{art.title}</h3>
              <p className="text-xs text-charcoal-muted line-clamp-2 leading-relaxed">{art.excerpt}</p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-botanical-100 text-xs">
              <a
                href={`/journal/${art.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-clay hover:underline inline-flex items-center gap-1 font-medium"
              >
                <span>Read Public Article</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(art)}
                  className="p-1.5 rounded-lg text-clay hover:bg-clay/10 transition-colors"
                  title="Edit Guide"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(art.id, art.title)}
                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                  title="Delete Guide"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && editingArticle && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-botanical-950/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-botanical-200 shadow-2xl p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-botanical-100">
              <h3 className="text-lg font-bold tracking-tight text-botanical-950">
                {editingArticle.id ? "Edit Care Guide" : "Write New Care Guide"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-botanical-400 hover:text-botanical-950">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-botanical-900 mb-1">Article Title *</label>
                <input
                  type="text"
                  required
                  value={editingArticle.title || ""}
                  onChange={(e) =>
                    setEditingArticle({ ...editingArticle, title: e.target.value })
                  }
                  className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 font-medium text-botanical-950"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-botanical-900 mb-1">Article Category</label>
                  <select
                    value={editingArticle.category || "General Care"}
                    onChange={(e) =>
                      setEditingArticle({ ...editingArticle, category: e.target.value })
                    }
                    className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 text-botanical-950"
                  >
                    <option value="General Care">General Care</option>
                    <option value="Bonsai & Training">Bonsai & Training</option>
                    <option value="Grafting & Breeding">Grafting & Breeding</option>
                    <option value="Seasonal Acclimation">Seasonal Acclimation</option>
                    <option value="Pest & Disease Safeguards">Pest & Disease Safeguards</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-botanical-900 mb-1">Reading Time (Minutes)</label>
                  <input
                    type="number"
                    min={1}
                    value={editingArticle.read_time_minutes || 5}
                    onChange={(e) =>
                      setEditingArticle({
                        ...editingArticle,
                        read_time_minutes: Number(e.target.value),
                      })
                    }
                    className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5"
                  />
                </div>
              </div>

              {/* Cover Image */}
              <div>
                <label className="block font-medium text-botanical-900 mb-1">Featured Photograph</label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={editingArticle.featured_image || ""}
                      onChange={(e) =>
                        setEditingArticle({ ...editingArticle, featured_image: e.target.value })
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

                  {editingArticle.featured_image && (
                    <div className="w-full h-28 rounded-xl overflow-hidden bg-ivory-sand border border-botanical-200">
                      <img src={editingArticle.featured_image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-medium text-botanical-900 mb-1">Summary / Excerpt</label>
                <textarea
                  rows={2}
                  value={editingArticle.excerpt || ""}
                  onChange={(e) =>
                    setEditingArticle({ ...editingArticle, excerpt: e.target.value })
                  }
                  className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2 text-botanical-950"
                />
              </div>

              <div>
                <label className="block font-medium text-botanical-900 mb-1">Article Content (Markdown supported) *</label>
                <textarea
                  rows={8}
                  required
                  value={editingArticle.content || ""}
                  onChange={(e) =>
                    setEditingArticle({ ...editingArticle, content: e.target.value })
                  }
                  className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 font-mono text-botanical-950 text-xs leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-botanical-100">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-botanical-900">
                  <input
                    type="checkbox"
                    checked={editingArticle.is_published ?? true}
                    onChange={(e) =>
                      setEditingArticle({ ...editingArticle, is_published: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-clay"
                  />
                  <span>Published on Live Journal</span>
                </label>

                <div className="flex items-center gap-2">
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
                    <span>Save Guide</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
