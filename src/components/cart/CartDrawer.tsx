"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice, generateWhatsAppLink } from "@/lib/utils";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, MessageCircle } from "lucide-react";

export default function CartDrawer() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    totalItems,
    subtotal,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 6000;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  // Generate WhatsApp order summary link
  const buildWhatsAppOrderLink = () => {
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923001234567";
    const itemsSummary = items
      .map((item, idx) => `${idx + 1}. ${item.name} (${item.sku}) × ${item.quantity} = ${formatPrice((item.sale_price ?? item.price) * item.quantity)}`)
      .join("\n");

    const message = [
      `Assalam-o-Alaikum Pak Adenium Nursery,`,
      ``,
      `I would like to place an order for the following specimens:`,
      itemsSummary,
      ``,
      `Subtotal: ${formatPrice(subtotal)}`,
      `Shipping: ${subtotal >= freeShippingThreshold ? "FREE" : "Standard Pakistan Courier"}`,
      ``,
      `Please let me know dispatch availability and bank/COD confirmation.`,
    ].join("\n");

    return generateWhatsAppLink(phone, message);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-botanical-950/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-ivory border-l border-botanical-300/30 shadow-drawer flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-botanical-200/60 flex items-center justify-between bg-ivory-warm">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-botanical-800" />
              <h2 className="font-sans text-lg font-semibold text-[#15271E]">
                Shopping Cart
              </h2>
              <span className="text-xs bg-neutral-100 text-neutral-800 font-medium px-2 py-0.5 rounded-full">
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full text-botanical-700 hover:text-botanical-950 hover:bg-botanical-200/50 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Bar */}
          {items.length > 0 && (
            <div className="px-5 py-3 bg-botanical-50 border-b border-botanical-200/40 text-xs text-botanical-800">
              {remainingForFreeShipping > 0 ? (
                <div className="space-y-1.5">
                  <p>
                    Add <span className="font-semibold text-clay">{formatPrice(remainingForFreeShipping)}</span> more for{" "}
                    <span className="font-semibold">Free Delivery across Pakistan</span>
                  </p>
                  <div className="w-full bg-botanical-200/60 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-clay h-full transition-all duration-300 rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-botanical-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
                  Your order qualifies for Free Nationwide Delivery!
                </div>
              )}
            </div>
          )}

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
                <div className="w-16 h-16 rounded-full bg-botanical-100 flex items-center justify-center text-botanical-600 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-sans text-base font-semibold text-[#15271E] mb-1">
                  Your cart is empty
                </h3>
                <p className="text-xs text-[#525B52] max-w-xs mb-6">
                  Explore our collection of grafted Desert Roses, caudex bonsai, and rare hybrids.
                </p>
                <Link
                  href="/shop"
                  onClick={() => setIsCartOpen(false)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#15271E] text-white font-semibold text-xs hover:bg-[#233D2E] transition-colors"
                >
                  Browse Plants
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              items.map((item) => {
                const currentPrice = item.sale_price ?? item.price;
                return (
                  <div
                    key={item.id}
                    className="flex gap-3.5 p-3 rounded-xl border border-botanical-200/60 bg-white/70 hover:bg-white transition-colors"
                  >
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-ivory-sand flex-shrink-0 border border-botanical-200/50">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-sm font-medium text-botanical-950 truncate">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-botanical-400 hover:text-red-600 transition-colors p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-charcoal-muted font-mono">{item.sku}</p>
                        {item.flower_color && (
                          <p className="text-xs text-botanical-600">{item.flower_color}</p>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center border border-botanical-200 rounded-lg bg-ivory">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-botanical-100 rounded-l-lg text-botanical-800"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2.5 text-xs font-medium text-botanical-950 font-mono">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.max_stock}
                            className="p-1 hover:bg-botanical-100 rounded-r-lg text-botanical-800 disabled:opacity-40"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-right">
                          <div className="text-sm font-semibold text-botanical-900">
                            {formatPrice(currentPrice * item.quantity)}
                          </div>
                          {item.quantity > 1 && (
                            <div className="text-[11px] text-charcoal-muted">
                              {formatPrice(currentPrice)} each
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Checkout actions */}
          {items.length > 0 && (
            <div className="p-5 border-t border-botanical-200/80 bg-ivory-warm space-y-3">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-charcoal-muted">
                  <span>Subtotal</span>
                  <span className="font-mono font-medium text-botanical-900">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-charcoal-muted text-xs">
                  <span>Shipping</span>
                  <span>
                    {subtotal >= freeShippingThreshold ? (
                      <span className="text-emerald-700 font-medium">FREE</span>
                    ) : (
                      "Calculated at checkout (Rs. 350)"
                    )}
                  </span>
                </div>
                <div className="border-t border-botanical-200/60 pt-2 flex justify-between font-serif text-lg font-semibold text-botanical-950">
                  <span>Estimated Total</span>
                  <span>
                    {formatPrice(
                      subtotal + (subtotal >= freeShippingThreshold ? 0 : 350)
                    )}
                  </span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-3.5 px-4 rounded-xl bg-botanical-900 hover:bg-botanical-950 text-ivory font-medium text-sm flex items-center justify-center gap-2 shadow-card transition-all"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href={buildWhatsAppOrderLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#128C7E] font-medium text-sm flex items-center justify-center gap-2 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  Order / Confirm via WhatsApp
                </a>
              </div>

              <p className="text-center text-[11px] text-charcoal-muted">
                Safe Bare-Root / Potted Dispatch across Pakistan with live unboxing guarantee.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

