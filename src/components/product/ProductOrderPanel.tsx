"use client";

import React, { useState, useEffect } from "react";
import { Product } from "@/types";
import { formatPrice, buildProductInquiryWhatsApp } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Plus, Minus, Check, Truck } from "lucide-react";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

interface ProductOrderPanelProps {
  product: Product;
  whatsappNumber: string;
}

export default function ProductOrderPanel({ product, whatsappNumber }: ProductOrderPanelProps) {
  const { addToCart, setIsCartOpen } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [siteUrl, setSiteUrl] = useState("https://pak-adenium-nursery.vercel.app");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSiteUrl(window.location.origin);
    }
  }, []);

  const currentPrice = product.sale_price ?? product.price;
  const isSale = product.sale_price && product.sale_price < product.price;
  const isOutOfStock = product.stock_quantity <= 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= product.low_stock_threshold;

  const handleAdd = () => {
    if (product.stock_quantity > 0) {
      addToCart(product, quantity);
      setIsCartOpen(true);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const whatsappUrl = buildProductInquiryWhatsApp(product, whatsappNumber, siteUrl);

  return (
    <div className="space-y-6">
      {/* Price Display (Clean Manrope) */}
      <div className="flex items-baseline gap-3">
        <span className="font-sans text-3xl sm:text-4xl font-bold text-[#15271E]">
          {formatPrice(currentPrice)}
        </span>
        {isSale && (
          <span className="font-sans text-lg text-neutral-400 line-through">
            {formatPrice(product.price)}
          </span>
        )}
        {isSale && (
          <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-clay text-white">
            Special Offer
          </span>
        )}
      </div>

      {/* Stock Status */}
      <div>
        {isOutOfStock ? (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-neutral-100 text-neutral-700 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-neutral-500" />
            Currently Out of Stock — Inquire on WhatsApp for next bench batch
          </div>
        ) : isLowStock ? (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
            Limited: Only {product.stock_quantity} available in current batch
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            In Stock &amp; Ready for Dispatch ({product.stock_quantity} available)
          </div>
        )}
      </div>

      {/* Quantity & Add to Cart Controls */}
      <div className="pt-2 space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-[#D5DDD2] rounded-md bg-white p-1">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1 || isOutOfStock}
              className="p-2 hover:bg-neutral-100 rounded text-neutral-800 disabled:opacity-30"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 font-sans text-sm font-semibold text-[#15271E]">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => Math.min(product.stock_quantity, q + 1))}
              disabled={quantity >= product.stock_quantity || isOutOfStock}
              className="p-2 hover:bg-neutral-100 rounded text-neutral-800 disabled:opacity-30"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={isOutOfStock}
            className={`flex-1 py-3 px-6 rounded-md font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:cursor-not-allowed ${
              added
                ? "bg-emerald-700 text-white cursor-default"
                : isOutOfStock
                ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                : "bg-[#15271E] hover:bg-[#233D2E] text-white shadow-sm"
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4 stroke-[2.5]" /> Added to Cart
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </>
            )}
          </button>
        </div>

        {/* WhatsApp Direct Inquiry */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 px-6 rounded-md border border-[#25D366]/40 bg-emerald-50 hover:bg-emerald-100/60 text-[#128C7E] font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
        >
          <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
          <span>Inquire or Order via WhatsApp</span>
        </a>
      </div>

      {/* Transit Guarantee */}
      <div className="pt-3 border-t border-[#E5E0D8] text-xs text-[#525B52]">
        <div className="flex items-start gap-2.5">
          <Truck className="w-4 h-4 text-clay flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-[#15271E]">Live Plant Delivery Guarantee:</span> Plants are pre-conditioned to prevent moisture rot in transit, packed with custom cushioning, and shipped via express courier nationwide.
          </div>
        </div>
      </div>
    </div>
  );
}
