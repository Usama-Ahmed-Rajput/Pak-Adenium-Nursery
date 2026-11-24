"use client";

import React, { useState, useEffect, useRef } from "react";
import { UploadCloud, Trash2, Copy, Check, Search, Loader2, Image as ImageIcon, ExternalLink, AlertCircle } from "lucide-react";

interface MediaItem {
  filename: string;
  url: string;
  size: number;
  createdAt: string;
}

export default function MediaManager() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/media");
      const data = await res.json();
      if (res.ok && data.media) {
        setMedia(data.media);
      }
    } catch {
      setError("Failed to fetch media assets.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setError("");

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || `Failed to upload ${file.name}`);
        }
      }

      await fetchMedia();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error uploading files");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (filename: string) => {
    if (!confirm(`Delete image file "${filename}" permanently from storage?`)) return;

    try {
      const res = await fetch(`/api/admin/media?filename=${encodeURIComponent(filename)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMedia((prev) => prev.filter((m) => m.filename !== filename));
      } else {
        alert("Failed to delete file.");
      }
    } catch {
      alert("Network error.");
    }
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(window.location.origin + url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const filtered = media.filter((m) =>
    m.filename.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Upload Banner */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files) handleUpload(e.dataTransfer.files);
        }}
        className="rounded-3xl border-2 border-dashed border-botanical-300 hover:border-botanical-600 bg-white p-8 text-center cursor-pointer transition-colors space-y-3 shadow-subtle"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/avif"
          multiple
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
        />

        <div className="w-12 h-12 rounded-2xl bg-botanical-100 text-botanical-900 flex items-center justify-center mx-auto">
          {isUploading ? (
            <Loader2 className="w-6 h-6 animate-spin text-clay" />
          ) : (
            <UploadCloud className="w-6 h-6" />
          )}
        </div>

        <div>
          <h3 className="text-base font-bold tracking-tight text-botanical-950">
            {isUploading ? "Uploading photographs..." : "Drop new plant images here or browse files"}
          </h3>
          <p className="text-xs text-charcoal-muted mt-0.5">
            PNG, JPEG, WebP, AVIF up to 6MB. Images are saved permanently to the nursery storage.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Search and stats bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by filename..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-botanical-300 rounded-xl pl-9 pr-4 py-2 text-xs text-botanical-950 focus:outline-none focus:border-botanical-700 shadow-subtle"
          />
          <Search className="w-4 h-4 text-botanical-400 absolute left-3 top-2.5" />
        </div>

        <span className="text-xs text-charcoal-muted">
          Showing {filtered.length} of {media.length} files
        </span>
      </div>

      {/* Grid of uploaded images */}
      {isLoading ? (
        <div className="py-12 text-center text-xs text-charcoal-muted flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-clay" />
          <span>Loading nursery media library...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-xs text-charcoal-muted rounded-2xl bg-white border border-botanical-200">
          <ImageIcon className="w-8 h-8 text-botanical-300 mx-auto mb-2" />
          <p className="font-medium">No media files found in storage.</p>
          <p className="text-[11px] mt-1">Upload images using the drag & drop area above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((item) => (
            <div
              key={item.filename}
              className="group rounded-2xl bg-white border border-botanical-200 shadow-subtle overflow-hidden flex flex-col justify-between"
            >
              <div className="aspect-square bg-ivory-sand relative overflow-hidden">
                <img
                  src={item.url}
                  alt={item.filename}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Open full size"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="p-3 text-xs space-y-2">
                <div className="min-w-0">
                  <p className="font-mono text-[11px] text-botanical-950 truncate" title={item.filename}>
                    {item.filename}
                  </p>
                  <p className="text-[10px] text-charcoal-muted">
                    {(item.size / 1024).toFixed(0)} KB · {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-1 pt-1 border-t border-botanical-100">
                  <button
                    type="button"
                    onClick={() => handleCopy(item.url)}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-clay hover:underline"
                    title="Copy full public image link"
                  >
                    {copiedUrl === item.url ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.filename)}
                    className="p-1 rounded text-red-500 hover:bg-red-50"
                    title="Delete permanently"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

