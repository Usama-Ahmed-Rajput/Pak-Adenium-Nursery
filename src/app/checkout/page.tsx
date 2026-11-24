"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  Smartphone,
  ArrowRight,
  AlertCircle,
  Loader2,
  Lock,
} from "lucide-react";

const PAKISTAN_PROVINCES = [
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Islamabad Capital Territory",
  "Azad Jammu & Kashmir",
  "Gilgit-Baltistan",
];

const POPULAR_CITIES: Record<string, string[]> = {
  Punjab: ["Lahore", "Faisalabad", "Rawalpindi", "Multan", "Gujranwala", "Sialkot", "Bahawalpur", "Sargodha", "Sheikhupura", "Other Punjab City"],
  Sindh: ["Karachi", "Hyderabad", "Sukkur", "Larkana", "Mirpur Khas", "Nawabshah", "Other Sindh City"],
  "Khyber Pakhtunkhwa": ["Peshawar", "Mardan", "Abbottabad", "Swat", "Dera Ismail Khan", "Other KP City"],
  Balochistan: ["Quetta", "Gwadar", "Turbat", "Khuzdar", "Other Balochistan City"],
  "Islamabad Capital Territory": ["Islamabad"],
  "Azad Jammu & Kashmir": ["Muzaffarabad", "Mirpur", "Rawalakot", "Kotli"],
  "Gilgit-Baltistan": ["Gilgit", "Skardu", "Hunza"],
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    customer_whatsapp: "",
    customer_email: "",
    province: "Punjab",
    city: "Lahore",
    area: "",
    shipping_address: "",
    order_notes: "",
    payment_method: "Cash on Delivery",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const freeShippingThreshold = 6000;
  const shippingFee = subtotal >= freeShippingThreshold ? 0 : 350;
  const grandTotal = subtotal + shippingFee;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      // If province changes, reset city to the first city of that province
      if (name === "province") {
        updated.city = POPULAR_CITIES[value]?.[0] || "Other City";
      }
      return updated;
    });
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (items.length === 0) {
      setErrorMessage("Your shopping bag is empty. Please select plants first.");
      return;
    }

    if (!formData.customer_name || !formData.customer_phone || !formData.shipping_address) {
      setErrorMessage("Please fill in all required customer name, phone, and delivery address fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        customer_whatsapp: formData.customer_whatsapp || formData.customer_phone,
        customer_email: formData.customer_email,
        province: formData.province,
        city: formData.city,
        area: formData.area,
        shipping_address: formData.shipping_address,
        order_notes: formData.order_notes,
        payment_method: formData.payment_method,
        items: items.map((i) => ({
          product_id: i.id,
          quantity: i.quantity,
        })),
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMessage(data.error || "Failed to place order. Please review your details.");
        setIsSubmitting(false);
        return;
      }

      // Order placed successfully! Clear cart & redirect
      clearCart();
      router.push(`/checkout/success?order=${data.order.order_number}`);
    } catch (err) {
      console.error("Order submit exception", err);
      setErrorMessage("Network error occurred. Please check your connection or contact us via WhatsApp.");
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="flex-1 bg-ivory py-16 text-center">
          <div className="max-w-md mx-auto px-4 space-y-4">
            <h1 className="font-serif text-3xl font-medium text-botanical-950">
              No Plants in Cart
            </h1>
            <p className="text-sm text-charcoal-muted">
              Your bag is currently empty. Please explore our catalog to select plants.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-botanical-900 text-ivory text-sm font-medium"
            >
              Browse Catalog <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-ivory py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <span className="text-xs uppercase tracking-wider text-clay font-semibold">
              Secure Checkout
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#15271E] mt-1">
              Delivery &amp; Payment Details
            </h1>
          </div>

          {errorMessage && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Delivery Info & Payment Selector */}
            <div className="lg:col-span-7 space-y-8">
              {/* 1. Recipient Details */}
              <div className="rounded-2xl bg-white border border-botanical-200/80 p-6 shadow-subtle space-y-4">
                <h2 className="font-serif text-lg font-medium text-botanical-950 pb-3 border-b border-botanical-100 flex items-center justify-between">
                  <span>1. Recipient Contact</span>
                  <span className="text-xs font-sans text-charcoal-muted font-normal">
                    * Required for delivery coordination
                  </span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-botanical-900 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="customer_name"
                      required
                      value={formData.customer_name}
                      onChange={handleInputChange}
                      placeholder="e.g. Tariq Mahmood"
                      className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 text-sm text-botanical-950 focus:outline-none focus:border-botanical-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-botanical-900 mb-1">
                      Phone Number (Call / SMS) *
                    </label>
                    <input
                      type="tel"
                      name="customer_phone"
                      required
                      value={formData.customer_phone}
                      onChange={handleInputChange}
                      placeholder="03001234567"
                      className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 text-sm text-botanical-950 focus:outline-none focus:border-botanical-600 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-botanical-900 mb-1">
                      WhatsApp Number (For Unboxing Previews) *
                    </label>
                    <input
                      type="tel"
                      name="customer_whatsapp"
                      required
                      value={formData.customer_whatsapp}
                      onChange={handleInputChange}
                      placeholder="03001234567"
                      className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 text-sm text-botanical-950 focus:outline-none focus:border-botanical-600 font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-botanical-900 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      name="customer_email"
                      value={formData.customer_email}
                      onChange={handleInputChange}
                      placeholder="name@example.pk"
                      className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 text-sm text-botanical-950 focus:outline-none focus:border-botanical-600"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Destination Address in Pakistan */}
              <div className="rounded-2xl bg-white border border-botanical-200/80 p-6 shadow-subtle space-y-4">
                <h2 className="font-serif text-lg font-medium text-botanical-950 pb-3 border-b border-botanical-100">
                  2. Pakistan Delivery Address
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-botanical-900 mb-1">
                      Province / Region *
                    </label>
                    <select
                      name="province"
                      value={formData.province}
                      onChange={handleInputChange}
                      className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 text-sm text-botanical-950 focus:outline-none focus:border-botanical-600 cursor-pointer"
                    >
                      {PAKISTAN_PROVINCES.map((prov) => (
                        <option key={prov} value={prov}>
                          {prov}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-botanical-900 mb-1">
                      City *
                    </label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 text-sm text-botanical-950 focus:outline-none focus:border-botanical-600 cursor-pointer"
                    >
                      {(POPULAR_CITIES[formData.province] || ["Other City"]).map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-botanical-900 mb-1">
                      Area / Town / Sector (e.g. DHA Phase 5, Gulberg, Bahria Town, F-8)
                    </label>
                    <input
                      type="text"
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                      placeholder="e.g. DHA Phase 6, Sector C"
                      className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 text-sm text-botanical-950 focus:outline-none focus:border-botanical-600"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-botanical-900 mb-1">
                      Complete Street Address / House / Plot No. *
                    </label>
                    <textarea
                      name="shipping_address"
                      required
                      rows={2}
                      value={formData.shipping_address}
                      onChange={handleInputChange}
                      placeholder="House No., Street Name, Landmark"
                      className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 text-sm text-botanical-950 focus:outline-none focus:border-botanical-600"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-botanical-900 mb-1">
                      Special Horticultural or Delivery Instructions (Optional)
                    </label>
                    <input
                      type="text"
                      name="order_notes"
                      value={formData.order_notes}
                      onChange={handleInputChange}
                      placeholder="e.g. Please leave bare root / Request weekend dispatch"
                      className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 text-sm text-botanical-950 focus:outline-none focus:border-botanical-600"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Payment Method */}
              <div className="rounded-2xl bg-white border border-botanical-200/80 p-6 shadow-subtle space-y-4">
                <h2 className="font-serif text-lg font-medium text-botanical-950 pb-3 border-b border-botanical-100">
                  3. Select Payment Method
                </h2>

                <div className="space-y-3">
                  {/* COD */}
                  <label
                    className={`flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-all ${
                      formData.payment_method === "Cash on Delivery"
                        ? "border-botanical-900 bg-botanical-50/50"
                        : "border-botanical-200 hover:border-botanical-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value="Cash on Delivery"
                      checked={formData.payment_method === "Cash on Delivery"}
                      onChange={handleInputChange}
                      className="mt-1 text-botanical-900 focus:ring-botanical-900"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-emerald-700" />
                        <span className="text-sm font-semibold text-botanical-950">
                          Cash on Delivery (COD)
                        </span>
                      </div>
                      <p className="text-xs text-charcoal-muted mt-0.5">
                        Pay the courier rider in cash upon unboxing at your doorstep. Supported across all designated Pakistan cities.
                      </p>
                    </div>
                  </label>

                  {/* Bank Transfer */}
                  <label
                    className={`flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-all ${
                      formData.payment_method === "Bank Transfer"
                        ? "border-botanical-900 bg-botanical-50/50"
                        : "border-botanical-200 hover:border-botanical-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value="Bank Transfer"
                      checked={formData.payment_method === "Bank Transfer"}
                      onChange={handleInputChange}
                      className="mt-1 text-botanical-900 focus:ring-botanical-900"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-clay" />
                        <span className="text-sm font-semibold text-botanical-950">
                          Direct Bank Transfer / IBFT
                        </span>
                      </div>
                      <p className="text-xs text-charcoal-muted mt-0.5">
                        Transfer to our official Meezan Bank account. Instant dispatch priority.
                      </p>
                      {formData.payment_method === "Bank Transfer" && (
                        <div className="mt-3 p-3 rounded-lg bg-ivory border border-botanical-200 text-xs space-y-1 font-mono text-botanical-900">
                          <p>Bank: Meezan Bank Limited</p>
                          <p>Title: Pak Adenium Horticultural Farms</p>
                          <p>Account: 02010108928371</p>
                          <p>IBAN: PK45MEZN0002010108928371</p>
                        </div>
                      )}
                    </div>
                  </label>

                  {/* EasyPaisa / JazzCash */}
                  <label
                    className={`flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-all ${
                      formData.payment_method === "EasyPaisa/JazzCash"
                        ? "border-botanical-900 bg-botanical-50/50"
                        : "border-botanical-200 hover:border-botanical-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value="EasyPaisa/JazzCash"
                      checked={formData.payment_method === "EasyPaisa/JazzCash"}
                      onChange={handleInputChange}
                      className="mt-1 text-botanical-900 focus:ring-botanical-900"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-amber-600" />
                        <span className="text-sm font-semibold text-botanical-950">
                          EasyPaisa / JazzCash Wallet
                        </span>
                      </div>
                      <p className="text-xs text-charcoal-muted mt-0.5">
                        Send payment directly to our verified mobile business account.
                      </p>
                      {formData.payment_method === "EasyPaisa/JazzCash" && (
                        <div className="mt-3 p-3 rounded-lg bg-ivory border border-botanical-200 text-xs space-y-1 font-mono text-botanical-900">
                          <p>Account Title: Tariq Mahmood</p>
                          <p>Number: 0300-1234567</p>
                          <p className="text-[10px] text-charcoal-muted font-sans">
                            Share payment receipt screenshot on WhatsApp after placing order.
                          </p>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Order Review & Submission */}
            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-2xl bg-white border border-botanical-200/80 p-6 shadow-subtle space-y-5 sticky top-24">
                <h2 className="font-serif text-lg font-medium text-botanical-950 pb-3 border-b border-botanical-100">
                  Plants in Order ({items.length})
                </h2>

                <div className="max-h-60 overflow-y-auto divide-y divide-botanical-100 pr-1">
                  {items.map((item) => (
                    <div key={item.id} className="py-2.5 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-ivory-sand flex-shrink-0 border border-botanical-200">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-medium text-botanical-950 truncate">
                          {item.name}
                        </h4>
                        <span className="text-[11px] text-charcoal-muted font-mono">
                          {item.quantity} × {formatPrice(item.sale_price ?? item.price)}
                        </span>
                      </div>
                      <div className="text-right text-xs font-semibold text-botanical-950 font-mono">
                        {formatPrice((item.sale_price ?? item.price) * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-3 border-t border-botanical-200 text-sm">
                  <div className="flex justify-between text-charcoal-muted">
                    <span>Subtotal</span>
                    <span className="font-mono font-medium text-botanical-950">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-charcoal-muted">
                    <span>Courier Delivery (Pakistan)</span>
                    <span className="font-mono text-botanical-950">
                      {shippingFee === 0 ? (
                        <span className="text-emerald-700 font-semibold">FREE</span>
                      ) : (
                        formatPrice(shippingFee)
                      )}
                    </span>
                  </div>
                  <div className="border-t border-botanical-200 pt-3 flex justify-between font-serif text-xl font-semibold text-botanical-950">
                    <span>Total Due</span>
                    <span>{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-xl bg-botanical-900 hover:bg-botanical-950 text-ivory font-medium text-sm flex items-center justify-center gap-2 shadow-card transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Validating & Placing Order...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Confirm & Place Order ({formatPrice(grandTotal)})
                    </>
                  )}
                </button>

                <p className="text-center text-[11px] text-charcoal-muted">
                  Your plants are inspected and packed under breathable foam cradles before dispatch.
                </p>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}

