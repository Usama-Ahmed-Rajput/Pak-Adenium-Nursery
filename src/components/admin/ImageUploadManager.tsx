"use client";

import React, { useState, useRef } from "react";
import { ProductImage } from "@/types";
import { UploadCloud, Link as LinkIcon, Trash2, Star, Loader2, AlertCircle, Check } from "lucide-react";

interface ImageUploadManagerProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  label?: string;
  helperText?: string;
  maxImages?: number;
}

export default function ImageUploadManager({
  images,
  onChange,
  label = "Product Photographs & Media Gallery",
  helperText = "Upload high-resolution photographs or provide direct image URLs. Set one as the primary showcase image.",
  maxImages = 10,
}: ImageUploadManagerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setErrorMessage("");

    try {
      const newImages: ProductImage[] = [...images];

      for (let i = 0; i < files.length; i++) {
        if (newImages.length >= maxImages) {
          setErrorMessage(`Maximum limit of ${maxImages} images reached.`);
          break;
        }

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

        const isFirst = newImages.length === 0;
        newImages.push({
          id: "img-" + Math.random().toString(36).substring(2, 8),
          image_url: data.url,
          alt_text: file.name.replace(/\.[^/.]+$/, ""),
          is_primary: isFirst,
          display_order: newImages.length + 1,
        });
      }

      onChange(newImages);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error uploading file";
      setErrorMessage(msg);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    try {
      new URL(urlInput); // Validate format
    } catch {
      setErrorMessage("Please enter a valid HTTP/HTTPS image URL.");
      return;
    }

    const isFirst = images.length === 0;
    const newImage: ProductImage = {
      id: "img-" + Math.random().toString(36).substring(2, 8),
      image_url: urlInput.trim(),
      alt_text: "Specimen photograph",
      is_primary: isFirst,
      display_order: images.length + 1,
    };

    onChange([...images, newImage]);
    setUrlInput("");
    setShowUrlInput(false);
    setErrorMessage("");
  };

  const handleSetPrimary = (index: number) => {
    const updated = images.map((img, i) => ({
      ...img,
      is_primary: i === index,
    }));
    onChange(updated);
  };

  const handleRemove = (index: number) => {
    const wasPrimary = images[index]?.is_primary;
    const updated = images.filter((_, i) => i !== index);
    if (wasPrimary && updated.length > 0) {
      updated[0].is_primary = true;
    }
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <label className="block font-semibold text-botanical-950 text-xs">{label}</label>
          {helperText && <p className="text-[11px] text-charcoal-muted">{helperText}</p>}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[11px] font-medium text-clay hover:underline inline-flex items-center gap-1"
          >
            <LinkIcon className="w-3 h-3" />
            {showUrlInput ? "Hide URL input" : "Add via URL"}
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* URL Input Box */}
      {showUrlInput && (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://images.unsplash.com/... or /uploads/..."
            className="flex-1 bg-ivory border border-botanical-300 rounded-xl px-3 py-2 text-xs text-botanical-950 focus:outline-none focus:border-botanical-700 font-mono"
          />
          <button
            type="button"
            onClick={handleAddUrl}
            className="px-4 py-2 bg-botanical-900 text-ivory text-xs font-medium rounded-xl hover:bg-botanical-950"
          >
            Add Image
          </button>
        </div>
      )}

      {/* Drop / Upload Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files) {
            handleFileUpload(e.dataTransfer.files);
          }
        }}
        className="border-2 border-dashed border-botanical-300 hover:border-botanical-600 bg-ivory/60 hover:bg-ivory rounded-2xl p-6 text-center cursor-pointer transition-colors space-y-2"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/avif"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) handleFileUpload(e.target.files);
          }}
        />

        <div className="w-10 h-10 rounded-full bg-botanical-100 text-botanical-800 flex items-center justify-center mx-auto">
          {isUploading ? (
            <Loader2 className="w-5 h-5 animate-spin text-clay" />
          ) : (
            <UploadCloud className="w-5 h-5" />
          )}
        </div>

        <div>
          <span className="text-xs font-semibold text-botanical-950 block">
            {isUploading ? "Uploading photographs to nursery server..." : "Click to select or drag and drop photographs"}
          </span>
          <span className="text-[11px] text-charcoal-muted">
            Supports WebP, PNG, JPEG, AVIF up to 6MB each ({images.length}/{maxImages} loaded)
          </span>
        </div>
      </div>

      {/* Image Previews & Primary Selector */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-2">
          {images.map((img, idx) => (
            <div
              key={img.id || idx}
              className={`group relative rounded-xl overflow-hidden border-2 aspect-square bg-botanical-50 flex items-center justify-center transition-all ${
                img.is_primary ? "border-clay shadow-subtle ring-2 ring-clay/20" : "border-botanical-200"
              }`}
            >
              <img
                src={img.image_url}
                alt={img.alt_text || `Photo ${idx + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1596724806740-d9962a93fa21?q=80&w=400&auto=format&fit=crop";
                }}
              />

              {/* Primary badge */}
              {img.is_primary ? (
                <div className="absolute top-1.5 left-1.5 bg-clay text-ivory text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm flex items-center gap-0.5">
                  <Star className="w-2.5 h-2.5 fill-current" />
                  Primary
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSetPrimary(idx)}
                  className="absolute top-1.5 left-1.5 bg-black/60 hover:bg-clay text-white text-[9px] font-medium px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5"
                  title="Make this primary photograph"
                >
                  <Star className="w-2.5 h-2.5" />
                  Set Primary
                </button>
              )}

              {/* Delete action */}
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="absolute top-1.5 right-1.5 bg-red-600 hover:bg-red-700 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                title="Remove image"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

