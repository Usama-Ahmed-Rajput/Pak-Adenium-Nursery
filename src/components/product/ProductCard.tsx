"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Product } from "@/types";
import { formatPrice, buildProductInquiryWhatsApp } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, MessageCircle, Check } from "lucide-react";

interface ProductCardProps {
  product: Product;
  whatsappNumber?: string;
}

export default function ProductCard({ product, whatsappNumber }: ProductCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const primaryImage =
    product.images.find((img) => img.is_primary)?.image_url ||
    product.images[0]?.image_url ||
    "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=1200&auto=format&fit=crop";

  const currentPrice = product.sale_price ?? product.price;
  const isSale = product.sale_price && product.sale_price < product.price;
  const isOutOfStock = product.stock_quantity <= 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= (product.low_stock_threshold || 2);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock_quantity > 0) {
      addToCart(product, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1600);
    }
  };

  const phone = whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923002560340";
  const siteUrl = typeof window !== "undefined" ? window.location.origin : "https://pakadenium.pk";
  const whatsappUrl = buildProductInquiryWhatsApp(product, phone, siteUrl);

  return (
    <div className="group flex flex-col justify-between bg-white rounded-lg border border-[#E5E0D8] hover:border-[#15271E]/40 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md">
      {/* 1. Large, Sharp Plant Photograph */}
      <Link
        href={`/shop/${product.slug}`}
        className="block relative aspect-[4/5] w-full overflow-hidden bg-[#F5F2EB]"
        aria-label={`View ${product.name}`}
      >
        <img
          src={primaryImage}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />

        {/* Discreet Badge (Sale / Out of Stock / Grafted) */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10 pointer-events-none">
          {isOutOfStock ? (
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#1D211D] text-white">
              Sold Out
            </span>
          ) : isSale ? (
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#B87555] text-white">
              Special Offer
            </span>
          ) : product.is_grafted ? (
            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-white/95 text-[#15271E] border border-[#CBD5C7]">
              Grafted
            </span>
          ) : null}
        </div>
      </Link>

      {/* 2. Structured Product Information */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
        <div className="space-y-1.5">
          {/* Category / Form descriptor */}
          <div className="text-[11px] font-medium uppercase tracking-wider text-[#B87555]">
            {product.category_name || product.species}
          </div>

          {/* Product Name (Clear, bold Manrope) */}
          <h3 className="font-sans text-base sm:text-lg font-semibold text-[#15271E] leading-snug line-clamp-1 group-hover:text-[#B87555] transition-colors">
            <Link href={`/shop/${product.slug}`}>{product.name}</Link>
          </h3>

          {/* Variety & Botanical Characteristic */}
          <p className="text-xs text-[#525B52] line-clamp-1">
            {product.flower_color} · {product.caudex_size || product.petal_type}
          </p>
        </div>

        {/* 3. Pricing & Availability */}
        <div className="pt-2 border-t border-[#F0EBE1]">
          <div className="flex items-baseline justify-between mb-1">
            <div className="flex items-baseline gap-2">
              <span className="font-sans text-base sm:text-lg font-bold text-[#15271E]">
                {formatPrice(currentPrice)}
              </span>
              {isSale && (
                <span className="font-sans text-xs text-neutral-400 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Availability */}
            <span className="text-[11px] font-medium">
              {isOutOfStock ? (
                <span className="text-neutral-500">Unavailable</span>
              ) : isLowStock ? (
                <span className="text-amber-700 font-semibold">Only {product.stock_quantity} left</span>
              ) : (
                <span className="text-emerald-700">In Stock</span>
              )}
            </span>
          </div>

          {/* 4. Practical Actions (Add to Cart + WhatsApp inquiry) */}
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={handleQuickAdd}
              disabled={isOutOfStock}
              className={`flex-1 py-2.5 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                added
                  ? "bg-emerald-700 text-white"
                  : isOutOfStock
                  ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                  : "bg-[#15271E] text-white hover:bg-[#233D2E] active:scale-[0.99]"
              }`}
              aria-label={`Add ${product.name} to cart`}
            >
              {added ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{isOutOfStock ? "Out of Stock" : "Add to Cart"}</span>
                </>
              )}
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-md border border-[#D5DDD2] text-[#25D366] hover:bg-emerald-50 hover:border-emerald-300 transition-colors flex items-center justify-center"
              title="Inquire about this plant on WhatsApp"
              aria-label={`Inquire about ${product.name} on WhatsApp`}
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
