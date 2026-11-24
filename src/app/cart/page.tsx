"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import {
  ShoppingBag,
  ArrowRight,
  Plus,
  Minus,
  Trash2,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SiteSettings } from "@/types";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, subtotal, totalItems } = useCart();
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .catch(() => {});
  }, []);

  const freeShippingThreshold = settings?.shipping?.free_shipping_threshold ?? 6000;
  const standardRate = settings?.shipping?.default_shipping_fee ?? 350;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shippingFee = isFreeShipping ? 0 : standardRate;
  const grandTotal = subtotal + shippingFee;

  return (
    <>
      <Navbar
        announcement={settings?.announcement}
        whatsappNumber={settings?.general?.whatsapp}
        phone={settings?.general?.phone}
        address={settings?.general?.address}
        nurseryName={settings?.general?.nursery_name}
      />
      <main className="flex-1 bg-ivory py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <span className="text-xs uppercase tracking-wider text-clay font-semibold">
              Review Selection
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#15271E] mt-1">
              Shopping Cart
            </h1>
          </div>

          {items.length === 0 ? (
            <div className="rounded-lg border border-[#E5E0D8] bg-white p-12 sm:p-16 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700 mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h2 className="font-serif text-2xl font-normal text-[#15271E]">
                Your cart is empty
              </h2>
              <p className="text-sm text-[#525B52] max-w-md mx-auto">
                Explore our collection of Desert Roses, sculptural Arabicum caudex bonsai, and fresh hand-pollinated seeds.
              </p>
              <div className="pt-2">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[#15271E] text-white text-xs font-semibold hover:bg-[#233D2E] transition-colors"
                >
                  <span>Browse Plant Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Items List */}
              <div className="lg:col-span-8 space-y-4">
                <div className="rounded-2xl bg-white border border-botanical-200/80 p-6 shadow-subtle divide-y divide-botanical-100">
                  {items.map((item) => {
                    const currentPrice = item.sale_price ?? item.price;
                    return (
                      <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4 sm:gap-6 items-center">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-ivory-sand flex-shrink-0 border border-botanical-200/60">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-[11px] font-mono text-charcoal-muted uppercase">
                                {item.species} · {item.sku}
                              </span>
                              <h3 className="font-sans text-base font-semibold text-[#15271E]">
                                <Link href={`/shop/${item.slug}`} className="hover:text-clay transition-colors">
                                  {item.name}
                                </Link>
                              </h3>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-botanical-400 hover:text-red-600 transition-colors p-1"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center border border-botanical-200 rounded-lg bg-ivory">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1.5 hover:bg-botanical-100 rounded-l-lg text-botanical-800"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="px-3 text-xs font-semibold text-botanical-950 font-mono">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={item.quantity >= item.max_stock}
                                className="p-1.5 hover:bg-botanical-100 rounded-r-lg text-botanical-800 disabled:opacity-30"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="text-right">
                              <span className="font-mono text-base font-semibold text-botanical-950">
                                {formatPrice(currentPrice * item.quantity)}
                              </span>
                              {item.quantity > 1 && (
                                <span className="block text-[11px] text-charcoal-muted">
                                  {formatPrice(currentPrice)} each
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center text-xs text-charcoal-muted px-2">
                  <Link href="/shop" className="hover:text-botanical-900 inline-flex items-center gap-1 font-medium">
                    ← Continue discovering plants
                  </Link>
                  <span>{totalItems} items in bag</span>
                </div>
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-4 space-y-4">
                <div className="rounded-2xl bg-white border border-botanical-200/80 p-6 shadow-subtle space-y-5">
                  <h2 className="font-serif text-lg font-medium text-botanical-950 pb-3 border-b border-botanical-100">
                    Order Summary
                  </h2>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-charcoal-muted">
                      <span>Bag Subtotal</span>
                      <span className="font-mono text-botanical-950 font-medium">
                        {formatPrice(subtotal)}
                      </span>
                    </div>

                    <div className="flex justify-between text-charcoal-muted">
                      <span>Standard Courier Delivery</span>
                      <span className="font-mono text-botanical-950">
                        {isFreeShipping ? (
                          <span className="text-emerald-700 font-semibold">FREE</span>
                        ) : (
                          formatPrice(shippingFee)
                        )}
                      </span>
                    </div>

                    {!isFreeShipping && (
                      <div className="p-2.5 rounded-lg bg-botanical-50 text-[11px] text-botanical-800">
                        Add <span className="font-bold text-clay">{formatPrice(freeShippingThreshold - subtotal)}</span> more for Free Delivery!
                      </div>
                    )}

                    <div className="border-t border-botanical-200 pt-3 flex justify-between font-serif text-xl font-semibold text-botanical-950">
                      <span>Grand Total</span>
                      <span>{formatPrice(grandTotal)}</span>
                    </div>
                  </div>

                  <Link
                    href="/checkout"
                    className="w-full py-4 px-6 rounded-xl bg-botanical-900 hover:bg-botanical-950 text-ivory font-medium text-sm flex items-center justify-center gap-2 shadow-card transition-all"
                  >
                    Proceed to Delivery & Payment
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <div className="space-y-2 pt-2 border-t border-botanical-100 text-xs text-charcoal-muted">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-clay" />
                      <span>Safe bare-root / potted express dispatch</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-clay" />
                      <span>Cash on Delivery & Bank Transfer available</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer
        nurseryName={settings?.general?.nursery_name}
        tagline={settings?.general?.tagline}
        phone={settings?.general?.phone}
        email={settings?.general?.email}
        address={settings?.general?.address}
        social={settings?.social}
        whatsappNumber={settings?.general?.whatsapp}
      />
    </>
  );
}

