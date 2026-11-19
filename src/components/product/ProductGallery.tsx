"use client";

import React, { useState } from "react";
import { ProductImage } from "@/types";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);

  const validImages =
    images.length > 0
      ? images
      : [
          {
            id: "default-img",
            image_url:
              "https://images.unsplash.com/photo-1596724806740-d9962a93fa21?q=80&w=1200&auto=format&fit=crop",
            alt_text: productName,
            is_primary: true,
            display_order: 1,
          },
        ];

  const currentImage = validImages[selectedIdx] || validImages[0];

  return (
    <div className="space-y-4">
      {/* Primary Zoom View */}
      <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-ivory-sand/50 border border-botanical-200/80 shadow-subtle group">
        <img
          src={currentImage.image_url}
          alt={currentImage.alt_text || productName}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 rounded-full bg-ivory/90 backdrop-blur-sm text-[11px] font-mono uppercase tracking-wider text-botanical-900 border border-botanical-200">
            Actual Nursery Specimen
          </span>
        </div>
      </div>

      {/* Thumbnails */}
      {validImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {validImages.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setSelectedIdx(idx)}
              className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                selectedIdx === idx
                  ? "border-clay shadow-subtle scale-105"
                  : "border-botanical-200/70 hover:border-botanical-400 opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={img.image_url}
                alt={img.alt_text || `${productName} view ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

