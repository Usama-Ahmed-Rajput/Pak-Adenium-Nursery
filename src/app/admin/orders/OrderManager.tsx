"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Order, OrderStatus, PaymentStatus } from "@/types";
import { formatPrice, generateWhatsAppLink } from "@/lib/utils";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import {
  Search,
  Filter,
  Eye,
  Check,
  X,
  AlertCircle,
  Clock,
  Truck,
  CheckCircle2,
  Save,
  Loader2,
  FileText,
  MapPin,
  Calendar,
} from "lucide-react";

interface OrderManagerProps {
  initialOrders: Order[];
  highlightId?: string;
}

const ORDER_STATUSES: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Processing",
  "Ready to Ship",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const PAYMENT_STATUSES: PaymentStatus[] = [
  "Pending",
  "Verified",
  "Paid",
  "Failed",
  "Refunded",
];

const COURIER_OPTIONS = [
  "TCS Express",
  "Leopards Courier",
  "Daewoo FastEx (Live Plants)",
  "M&P Express Logistics",
  "Trax Logistics",
  "PostEx",
  "Direct Nursery Delivery (Multan/Lahore)",
];

export default function OrderManager({ initialOrders, highlightId }: OrderManagerProps) {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(
    initialOrders.find((o) => o.id === highlightId) || null
  );

  // Editable fields in Modal
  const [tempOrderStatus, setTempOrderStatus] = useState<OrderStatus>("Pending");
  const [tempPaymentStatus, setTempPaymentStatus] = useState<PaymentStatus>("Pending");
  const [tempAdminNotes, setTempAdminNotes] = useState("");
  const [tempTrackingNumber, setTempTrackingNumber] = useState("");
  const [tempCourierName, setTempCourierName] = useState("");

  const [isUpdating, setIsUpdating] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4000);
  };

  const handleOpenOrder = (order: Order) => {
    setSelectedOrder(order);
    setTempOrderStatus(order.order_status);
    setTempPaymentStatus(order.payment_status);
    setTempAdminNotes(order.admin_notes || "");
    setTempTrackingNumber(order.tracking_number || "");
    setTempCourierName(order.courier_name || COURIER_OPTIONS[0]);
  };

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      o.order_number.toLowerCase().includes(q) ||
      o.customer_name.toLowerCase().includes(q) ||
      o.customer_phone.includes(q) ||
      o.city.toLowerCase().includes(q);

    const matchesStatus =
      statusFilter === "all" || o.order_status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const handleSaveOrderChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setIsUpdating(true);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          orderStatus: tempOrderStatus,
          paymentStatus: tempPaymentStatus,
          adminNotes: tempAdminNotes,
          trackingNumber: tempTrackingNumber,
          courierName: tempCourierName,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setOrders((prev) => prev.map((o) => (o.id === selectedOrder.id ? data.order : o)));
        setSelectedOrder(data.order);
        showNotification(`Order #${data.order.order_number} updated successfully.`, "success");
        router.refresh();
      } else {
        showNotification(data.error || "Failed to update order status.", "error");
      }
    } catch {
      showNotification("Network error while updating order.", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "Confirmed":
      case "Delivered":
        return "bg-emerald-100 text-emerald-800";
      case "Pending":
      case "Processing":
        return "bg-amber-100 text-amber-800";
      case "Ready to Ship":
      case "Shipped":
        return "bg-blue-100 text-blue-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-botanical-100 text-botanical-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl shadow-2xl flex items-center gap-3 border text-xs transition-all ${
            notification.type === "success"
              ? "bg-emerald-950 text-emerald-100 border-emerald-700/60"
              : "bg-red-950 text-red-100 border-red-700/60"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* Search & Status Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by order #, name, phone, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-botanical-300 rounded-xl pl-9 pr-4 py-2.5 text-xs text-botanical-950 focus:outline-none focus:border-botanical-700 shadow-subtle"
          />
          <Search className="w-4 h-4 text-botanical-400 absolute left-3 top-3" />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium flex-shrink-0 transition-colors ${
              statusFilter === "all"
                ? "bg-botanical-900 text-ivory"
                : "bg-white border border-botanical-200 text-botanical-800 hover:bg-botanical-50"
            }`}
          >
            All ({orders.length})
          </button>
          {ORDER_STATUSES.map((st) => {
            const count = orders.filter((o) => o.order_status.toLowerCase() === st.toLowerCase()).length;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium flex-shrink-0 transition-colors ${
                  statusFilter.toLowerCase() === st.toLowerCase()
                    ? "bg-botanical-900 text-ivory"
                    : "bg-white border border-botanical-200 text-botanical-800 hover:bg-botanical-50"
                }`}
              >
                {st} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-white border border-botanical-200/80 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-botanical-50 border-b border-botanical-200 text-botanical-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Order Ref</th>
                <th className="py-3 px-4 font-semibold">Customer</th>
                <th className="py-3 px-4 font-semibold">Destination</th>
                <th className="py-3 px-4 font-semibold">Payment</th>
                <th className="py-3 px-4 font-semibold text-right">Total</th>
                <th className="py-3 px-4 font-semibold text-center">Fulfillment</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-botanical-100">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-ivory/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-medium text-botanical-950">
                    #{order.order_number}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-botanical-950 block">
                      {order.customer_name}
                    </span>
                    <span className="text-[11px] text-charcoal-muted font-mono">
                      {order.customer_phone}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-charcoal-muted">
                    {order.city}, {order.province}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="block font-medium text-botanical-950">
                      {order.payment_method}
                    </span>
                    <span
                      className={`text-[10px] font-semibold ${
                        order.payment_status === "Paid" || order.payment_status === "Verified"
                          ? "text-emerald-700"
                          : "text-amber-700"
                      }`}
                    >
                      {order.payment_status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-semibold text-botanical-950">
                    {formatPrice(order.total)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${getStatusBadge(
                        order.order_status
                      )}`}
                    >
                      {order.order_status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleOpenOrder(order)}
                      className="px-3 py-1.5 rounded-lg bg-botanical-900 hover:bg-botanical-950 text-ivory font-semibold inline-flex items-center gap-1.5 shadow-subtle transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" /> Manage
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-charcoal-muted">
                    No orders match your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail & Management Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-botanical-950/60 backdrop-blur-sm"
            onClick={() => setSelectedOrder(null)}
          />

          <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-botanical-200 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-botanical-100">
              <div>
                <span className="font-mono text-xs text-charcoal-muted">Customer Dispatch Console</span>
                <h2 className="text-2xl font-bold tracking-tight text-botanical-950">
                  Order #{selectedOrder.order_number}
                </h2>
                <span className="text-[11px] text-charcoal-muted flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3 h-3" />
                  Placed: {new Date(selectedOrder.created_at).toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-botanical-400 hover:text-botanical-950 rounded-lg hover:bg-botanical-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Address Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs p-4 rounded-2xl bg-ivory border border-botanical-200">
              <div className="space-y-1">
                <span className="font-semibold text-botanical-800 uppercase tracking-wider block">
                  Customer Profile
                </span>
                <p className="font-medium text-sm text-botanical-950">{selectedOrder.customer_name}</p>
                <p className="text-charcoal-muted">Phone: <span className="font-mono font-medium text-botanical-950">{selectedOrder.customer_phone}</span></p>
                <p className="text-charcoal-muted">WhatsApp: <span className="font-mono text-botanical-950">{selectedOrder.customer_whatsapp}</span></p>
                {selectedOrder.customer_email && (
                  <p className="text-charcoal-muted">Email: {selectedOrder.customer_email}</p>
                )}
              </div>

              <div className="space-y-1">
                <span className="font-semibold text-botanical-800 uppercase tracking-wider block">
                  Shipping Destination
                </span>
                <p className="text-botanical-950 leading-relaxed font-medium">
                  {selectedOrder.shipping_address}
                </p>
                <p className="text-charcoal-muted font-medium">
                  {selectedOrder.area ? `${selectedOrder.area}, ` : ""}{selectedOrder.city}, {selectedOrder.province}
                </p>
                {selectedOrder.order_notes && (
                  <p className="text-clay italic pt-1">Buyer instructions: &ldquo;{selectedOrder.order_notes}&rdquo;</p>
                )}
              </div>
            </div>

            {/* Ordered Line Items */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-botanical-900 uppercase tracking-wider block">
                Ordered Items ({selectedOrder.items.length})
              </span>
              <div className="divide-y divide-botanical-100 border border-botanical-200 rounded-2xl overflow-hidden">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-ivory/40">
                    <div className="flex items-center gap-3">
                      {item.image_url && (
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-ivory-sand flex-shrink-0">
                          <img src={item.image_url} alt={item.product_name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div>
                        <span className="font-semibold text-botanical-950 block">{item.product_name}</span>
                        <span className="text-charcoal-muted font-mono text-[11px]">{item.product_sku} · Qty: {item.quantity} × {formatPrice(item.unit_price)}</span>
                      </div>
                    </div>
                    <span className="font-mono font-semibold text-botanical-950">
                      {formatPrice(item.total_price)}
                    </span>
                  </div>
                ))}
                <div className="p-3.5 bg-botanical-50/70 flex justify-between items-center text-xs font-semibold text-botanical-950">
                  <div className="space-y-0.5">
                    <span>Grand Total</span>
                    <span className="block text-[10px] text-charcoal-muted font-normal">
                      Subtotal: {formatPrice(selectedOrder.subtotal)} + Shipping: {formatPrice(selectedOrder.shipping_fee)}
                    </span>
                  </div>
                  <span className="font-mono text-base font-bold text-botanical-950">{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>
            </div>

            {/* Form to Update Status, Courier Tracking, and Internal Admin Notes */}
            <form onSubmit={handleSaveOrderChanges} className="p-4 rounded-2xl border border-botanical-200 space-y-4 bg-white text-xs">
              <span className="text-sm font-semibold text-botanical-950 block">
                Fulfillment Controls & Dispatch Record
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-botanical-900 mb-1">
                    Order Fulfillment Status
                  </label>
                  <select
                    value={tempOrderStatus}
                    onChange={(e) => setTempOrderStatus(e.target.value as OrderStatus)}
                    className="w-full bg-ivory border border-botanical-300 rounded-xl px-3 py-2 text-botanical-950 font-medium"
                  >
                    {ORDER_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-botanical-900 mb-1">
                    Payment Verification Status
                  </label>
                  <select
                    value={tempPaymentStatus}
                    onChange={(e) => setTempPaymentStatus(e.target.value as PaymentStatus)}
                    className="w-full bg-ivory border border-botanical-300 rounded-xl px-3 py-2 text-botanical-950 font-medium"
                  >
                    {PAYMENT_STATUSES.map((pst) => (
                      <option key={pst} value={pst}>
                        {pst}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-botanical-900 mb-1">
                    Courier Partner
                  </label>
                  <select
                    value={tempCourierName}
                    onChange={(e) => setTempCourierName(e.target.value)}
                    className="w-full bg-ivory border border-botanical-300 rounded-xl px-3 py-2 text-botanical-950"
                  >
                    {COURIER_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-botanical-900 mb-1">
                    Courier Tracking # / Consignment ID
                  </label>
                  <input
                    type="text"
                    value={tempTrackingNumber}
                    placeholder="e.g. TCS-781928492"
                    onChange={(e) => setTempTrackingNumber(e.target.value)}
                    className="w-full bg-ivory border border-botanical-300 rounded-xl px-3 py-2 font-mono text-botanical-950"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-medium text-botanical-900 mb-1">
                    Internal Nursery Staff Notes (Not visible to customer)
                  </label>
                  <textarea
                    rows={2}
                    value={tempAdminNotes}
                    placeholder="e.g. Verified payment slip on WhatsApp. Bare root packed with moss wrap."
                    onChange={(e) => setTempAdminNotes(e.target.value)}
                    className="w-full bg-ivory border border-botanical-300 rounded-xl px-3 py-2 text-botanical-950"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-botanical-100">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2.5 rounded-xl bg-botanical-900 text-ivory text-xs font-semibold hover:bg-botanical-950 shadow-card flex items-center gap-2 disabled:opacity-50 transition-colors"
                >
                  {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save Order Updates</span>
                </button>
              </div>
            </form>

            {/* Direct WhatsApp Contact Link */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-botanical-100">
              <a
                href={generateWhatsAppLink(
                  selectedOrder.customer_whatsapp,
                  `Hello ${selectedOrder.customer_name}, this is Pak Adenium Nursery regarding your Order #${selectedOrder.order_number}. Your parcel status is currently: ${selectedOrder.order_status}.${selectedOrder.tracking_number ? ` Courier: ${selectedOrder.courier_name || 'Courier'}, Tracking Number: ${selectedOrder.tracking_number}.` : ''}`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#25D366] text-botanical-950 text-xs font-semibold flex items-center justify-center gap-2 shadow-subtle hover:bg-[#20ba59] transition-colors"
              >
                <WhatsAppIcon className="w-4 h-4 text-botanical-950" />
                <span>Message Customer on WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2.5 rounded-xl border border-botanical-300 text-botanical-800 text-xs font-medium hover:bg-botanical-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
