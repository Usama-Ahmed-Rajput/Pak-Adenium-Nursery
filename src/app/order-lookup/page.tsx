import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getOrderByIdOrNumber, getSiteSettings } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { Search, Package, Clock, Truck, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Track Your Order — Pak Adenium Nursery",
  description: "Check the status, payment verification, and dispatch details of your Pak Adenium order.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

interface OrderLookupProps {
  searchParams: Promise<{ order?: string }>;
}

function maskPhone(phone: string): string {
  if (!phone || phone.length < 7) return phone;
  return phone.slice(0, 4) + "****" + phone.slice(-3);
}

function maskAddress(addr: string): string {
  if (!addr) return "";
  const parts = addr.split(",");
  if (parts.length > 1) {
    return "***, " + parts.slice(1).join(",").trim();
  }
  return addr.length > 8 ? addr.slice(0, 4) + "..." : addr;
}

export default async function OrderLookupPage({ searchParams }: OrderLookupProps) {
  const { order: orderQuery } = await searchParams;
  const [order, settings] = await Promise.all([
    orderQuery ? getOrderByIdOrNumber(orderQuery) : null,
    getSiteSettings(),
  ]);

  return (
    <>
      <Navbar
        announcement={settings.announcement}
        whatsappNumber={settings.general.whatsapp}
        phone={settings.general.phone}
        address={settings.general.address}
        nurseryName={settings.general.nursery_name}
      />
      <main className="flex-1 bg-ivory py-12 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Header */}
          <div className="text-center space-y-3">
            <span className="text-xs uppercase tracking-widest text-clay font-medium">
              Customer Concierge
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-botanical-950">
              Track Your Botanical Order
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-muted max-w-md mx-auto">
              Enter your Order Number (e.g. PAK-2601) to view status, payment verification, and packing updates.
            </p>
          </div>

          {/* Search Form */}
          <form className="flex gap-3 max-w-md mx-auto" method="GET">
            <div className="relative flex-1">
              <input
                type="text"
                name="order"
                defaultValue={orderQuery || ""}
                placeholder="Enter Order Number (e.g. PAK-2601)"
                required
                className="w-full bg-white border border-botanical-300 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm font-mono text-botanical-950 placeholder-charcoal-muted focus:outline-none focus:border-botanical-700 shadow-subtle"
              />
              <Search className="w-4 h-4 text-botanical-400 absolute left-3.5 top-3.5" />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-botanical-900 hover:bg-botanical-950 text-ivory text-xs font-semibold shadow-card transition-colors flex-shrink-0"
            >
              Track Order
            </button>
          </form>

          {/* Order Result Card */}
          {orderQuery && (
            <div>
              {order ? (
                <div className="rounded-3xl bg-white border border-botanical-200/80 p-6 sm:p-8 shadow-card space-y-6">
                  {/* Status header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-botanical-100 gap-4">
                    <div>
                      <span className="text-xs text-charcoal-muted font-mono block">Order Reference</span>
                      <h2 className="font-serif text-2xl font-bold text-botanical-950">
                        #{order.order_number}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Status: {order.order_status}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-botanical-100 text-botanical-800 text-xs font-medium">
                        Payment: {order.payment_status}
                      </span>
                    </div>
                  </div>

                  {/* Customer details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <span className="text-charcoal-muted">Recipient Name:</span>
                      <p className="font-medium text-botanical-950">{order.customer_name}</p>
                      <p className="text-charcoal-muted font-mono">{maskPhone(order.customer_phone)}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-charcoal-muted">Delivery Destination:</span>
                      <p className="font-medium text-botanical-950 leading-relaxed">
                        {maskAddress(order.shipping_address)}, {order.city}, {order.province}
                      </p>
                    </div>

                    {order.tracking_number && (
                      <div className="space-y-1 sm:col-span-2 p-3 rounded-xl bg-botanical-50 border border-botanical-200">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-botanical-800 block">
                          Logistics & Tracking
                        </span>
                        <p className="font-mono text-botanical-950">
                          {order.courier_name || "Courier"}: <strong className="font-bold text-clay">{order.tracking_number}</strong>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Items */}
                  <div className="pt-2 border-t border-botanical-100 space-y-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-botanical-700 block">
                      Ordered Plants ({order.items.length})
                    </span>

                    <div className="divide-y divide-botanical-100">
                      {order.items.map((item) => (
                        <div key={item.id} className="py-2.5 flex justify-between items-center text-xs">
                          <div>
                            <span className="font-medium text-botanical-950">{item.product_name}</span>
                            <span className="text-charcoal-muted font-mono block">
                              SKU: {item.product_sku} · Qty: {item.quantity}
                            </span>
                          </div>
                          <span className="font-mono font-semibold text-botanical-950">
                            {formatPrice(item.total_price)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-botanical-200 flex justify-between items-center text-sm font-serif font-bold text-botanical-950">
                      <span>Total Invoice Amount</span>
                      <span className="font-mono">{formatPrice(order.total)}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-botanical-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                    <span className="text-charcoal-muted">
                      Need updates or live video of your packed parcel?
                    </span>
                    <a
                      href={`https://wa.me/${settings.general.whatsapp}?text=${encodeURIComponent(
                        `Hello, I am inquiring about Order #${order.order_number}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-clay hover:underline font-semibold"
                    >
                      WhatsApp Concierge Desk →
                    </a>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center space-y-3">
                  <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
                  <h3 className="font-serif text-lg font-medium text-red-950">
                    No Order Found for &ldquo;{orderQuery}&rdquo;
                  </h3>
                  <p className="text-xs text-red-800 max-w-sm mx-auto">
                    Please double-check the order number or contact our WhatsApp support team with your phone number.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer
        nurseryName={settings.general.nursery_name}
        tagline={settings.general.tagline}
        phone={settings.general.phone}
        email={settings.general.email}
        address={settings.general.address}
        social={settings.social}
        whatsappNumber={settings.general.whatsapp}
      />
    </>
  );
}

