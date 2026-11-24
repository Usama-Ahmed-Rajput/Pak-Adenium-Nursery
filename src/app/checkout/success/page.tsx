import React from "react";
import Link from "next/link";
import { getOrderByIdOrNumber, getSiteSettings } from "@/lib/db";
import { formatPrice, buildOrderConfirmationWhatsApp } from "@/lib/utils";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PrintButton from "@/components/order/PrintButton";
import {
  CheckCircle2,
  Printer,
  MessageCircle,
  Truck,
  ArrowRight,
  ShieldCheck,
  Calendar,
} from "lucide-react";

interface SuccessPageProps {
  searchParams: Promise<{ order?: string }>;
}

export default async function OrderSuccessPage({ searchParams }: SuccessPageProps) {
  const { order: orderNumber } = await searchParams;
  const [order, settings] = await Promise.all([
    orderNumber ? getOrderByIdOrNumber(orderNumber) : null,
    getSiteSettings(),
  ]);

  if (!order) {
    return (
      <>
        <Navbar />
        <main className="flex-1 bg-ivory py-16 text-center">
          <div className="max-w-md mx-auto px-4 space-y-4">
            <h1 className="font-serif text-3xl font-medium text-botanical-950">
              Order Inquiry
            </h1>
            <p className="text-sm text-charcoal-muted">
              We could not find the requested order reference. Please check your order number or contact our WhatsApp desk.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-botanical-900 text-ivory text-sm font-medium"
            >
              Return to Nursery Home <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pakadenium.pk";
  const whatsappUrl = buildOrderConfirmationWhatsApp(
    order,
    settings.general.whatsapp,
    siteUrl
  );

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-ivory py-10 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header Banner */}
          <div className="rounded-3xl bg-botanical-900 text-ivory p-8 sm:p-10 text-center space-y-4 shadow-elevated">
            <div className="w-16 h-16 rounded-full bg-emerald-700/50 border border-emerald-400/40 text-emerald-300 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-clay font-medium">
                Order Received Successfully
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-medium text-ivory">
                Thank you, {order.customer_name}
              </h1>
              <p className="text-sm text-ivory/70 max-w-md mx-auto">
                Your botanical order <span className="font-mono font-bold text-white">#{order.order_number}</span> has been logged and assigned to our nursery bench for dispatch preparation.
              </p>
            </div>

            {/* Direct WhatsApp Confirmation CTA */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-botanical-950 font-semibold text-sm flex items-center justify-center gap-2 shadow-card transition-all"
              >
                <MessageCircle className="w-4 h-4 text-botanical-950" />
                <span>Confirm Order via WhatsApp</span>
              </a>

              <PrintButton />
            </div>
          </div>

          {/* Printable Invoice Card */}
          <div id="printable-invoice" className="rounded-2xl bg-white border border-botanical-200/80 p-6 sm:p-8 shadow-subtle space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-botanical-200 gap-4">
              <div>
                <span className="font-serif text-xl font-bold text-botanical-950 block">
                  Pak Adenium Nursery
                </span>
                <span className="text-xs text-charcoal-muted">
                  Official Invoice & Botanical Dispatch Slip
                </span>
              </div>
              <div className="text-left sm:text-right font-mono text-xs text-charcoal-muted">
                <p>Order Ref: <span className="font-bold text-botanical-950">#{order.order_number}</span></p>
                <p>Date: {new Date(order.created_at).toLocaleDateString("en-PK")}</p>
                <p>Status: <span className="text-emerald-700 font-bold">{order.order_status}</span></p>
              </div>
            </div>

            {/* Customer & Shipping Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div className="space-y-1">
                <span className="uppercase tracking-wider font-semibold text-botanical-700 block">
                  Customer & Shipping To:
                </span>
                <p className="font-medium text-botanical-950 text-sm">{order.customer_name}</p>
                <p className="text-charcoal-muted">Phone: {order.customer_phone}</p>
                <p className="text-charcoal-muted">WhatsApp: {order.customer_whatsapp}</p>
                <p className="text-botanical-950 pt-1 leading-relaxed">
                  {order.shipping_address}, {order.area ? `${order.area}, ` : ""}{order.city}, {order.province}
                </p>
              </div>

              <div className="space-y-1 sm:text-right">
                <span className="uppercase tracking-wider font-semibold text-botanical-700 block">
                  Payment Mode:
                </span>
                <p className="font-medium text-botanical-950 text-sm">{order.payment_method}</p>
                <p className="text-charcoal-muted">
                  Payment Status: <span className="font-medium text-botanical-900">{order.payment_status}</span>
                </p>
                {order.order_notes && (
                  <p className="pt-2 text-clay italic">Note: {order.order_notes}</p>
                )}
              </div>
            </div>

            {/* Line Items Table */}
            <div className="border border-botanical-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-botanical-50 border-b border-botanical-200 text-botanical-800">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Product &amp; Variety</th>
                    <th className="py-3 px-4 font-semibold">SKU</th>
                    <th className="py-3 px-4 font-semibold text-right">Unit Price</th>
                    <th className="py-3 px-4 font-semibold text-center">Qty</th>
                    <th className="py-3 px-4 font-semibold text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-botanical-100">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 px-4 font-medium text-botanical-950">
                        {item.product_name}
                      </td>
                      <td className="py-3 px-4 font-mono text-charcoal-muted">{item.product_sku}</td>
                      <td className="py-3 px-4 text-right font-mono">{formatPrice(item.unit_price)}</td>
                      <td className="py-3 px-4 text-center font-mono">{item.quantity}</td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-botanical-950">
                        {formatPrice(item.total_price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculations Breakdown */}
            <div className="flex justify-end text-xs">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-charcoal-muted">
                  <span>Subtotal:</span>
                  <span className="font-mono font-medium text-botanical-950">
                    {formatPrice(order.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-charcoal-muted">
                  <span>Courier Shipping (Pakistan):</span>
                  <span className="font-mono font-medium text-botanical-950">
                    {order.shipping_fee === 0 ? "FREE" : formatPrice(order.shipping_fee)}
                  </span>
                </div>
                <div className="border-t border-botanical-200 pt-2 flex justify-between text-sm font-serif font-bold text-botanical-950">
                  <span>Grand Total:</span>
                  <span className="font-mono">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Plant Acclimation & Parcel Arrival Notes */}
          <div className="rounded-2xl bg-botanical-50 border border-botanical-200/80 p-6 space-y-3 text-xs text-botanical-900">
            <div className="flex items-center gap-2 font-semibold text-botanical-950 text-sm">
              <ShieldCheck className="w-5 h-5 text-clay" />
              What Happens Next? (Nursery Preparation & Unboxing Advice)
            </div>
            <p className="leading-relaxed text-charcoal-muted">
              1. <strong>Pre-Transit Inspection:</strong> Our grower checks the caudex firmness and graft union. Live plants are dispatched on Mondays and Tuesdays via courier.
            </p>
            <p className="leading-relaxed text-charcoal-muted">
              2. <strong>Arrival Acclimation:</strong> Unpack your parcel in a shaded, well-ventilated porch. Do not place immediately into scorching midday sunlight. Wait 48 hours before the first light watering.
            </p>
          </div>

          <div className="text-center pt-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-botanical-900 hover:text-clay transition-colors"
            >
              <span>Return to Nursery Storefront</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
