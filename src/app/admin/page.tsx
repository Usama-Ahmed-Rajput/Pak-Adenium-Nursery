import React from "react";
import Link from "next/link";
import { getDashboardMetrics } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";
import {
  Banknote,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Package,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export const revalidate = 0; // Always fresh in admin

export default async function AdminDashboardOverview() {
  await requireAdmin();
  const metrics = await getDashboardMetrics();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-botanical-200">
        <div>
          <span className="text-xs uppercase tracking-widest text-clay font-semibold">
            Nursery Management Console
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-botanical-950 mt-1">
            Dashboard Overview
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="px-4 py-2 rounded-xl bg-botanical-900 hover:bg-botanical-950 text-ivory text-xs font-semibold shadow-subtle transition-colors"
          >
            + Add Product
          </Link>
          <Link
            href="/admin/orders"
            className="px-4 py-2 rounded-xl bg-white border border-botanical-300 text-botanical-900 text-xs font-semibold shadow-subtle hover:bg-botanical-50 transition-colors"
          >
            View Orders ({metrics.totalOrders})
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Sales */}
        <div className="p-4 rounded-2xl bg-white border border-botanical-200/80 shadow-subtle space-y-1.5">
          <div className="flex items-center justify-between text-charcoal-muted">
            <span className="text-[11px] font-medium uppercase tracking-wider">Total Sales</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Banknote className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="font-mono text-xl font-bold text-botanical-950">
            {formatPrice(metrics.totalSales)}
          </div>
          <p className="text-[10px] text-charcoal-muted">Excl. cancelled</p>
        </div>

        {/* Total Orders */}
        <div className="p-4 rounded-2xl bg-white border border-botanical-200/80 shadow-subtle space-y-1.5">
          <div className="flex items-center justify-between text-charcoal-muted">
            <span className="text-[11px] font-medium uppercase tracking-wider">Total Orders</span>
            <div className="w-7 h-7 rounded-lg bg-botanical-100 text-botanical-800 flex items-center justify-center">
              <ShoppingBag className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="font-mono text-xl font-bold text-botanical-950">
            {metrics.totalOrders}
          </div>
          <p className="text-[10px] text-charcoal-muted">{metrics.completedOrders} delivered</p>
        </div>

        {/* Pending Orders */}
        <div className="p-4 rounded-2xl bg-white border border-botanical-200/80 shadow-subtle space-y-1.5">
          <div className="flex items-center justify-between text-charcoal-muted">
            <span className="text-[11px] font-medium uppercase tracking-wider">Pending</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="font-mono text-xl font-bold text-amber-700">
            {metrics.pendingOrders}
          </div>
          <p className="text-[10px] text-charcoal-muted">Needs fulfillment</p>
        </div>

        {/* Total & Active Products */}
        <div className="p-4 rounded-2xl bg-white border border-botanical-200/80 shadow-subtle space-y-1.5">
          <div className="flex items-center justify-between text-charcoal-muted">
            <span className="text-[11px] font-medium uppercase tracking-wider">Catalog</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Package className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="font-mono text-xl font-bold text-botanical-950">
            {metrics.totalProducts}
          </div>
          <p className="text-[10px] text-charcoal-muted">{metrics.activeProducts} published active</p>
        </div>

        {/* Total Customers */}
        <Link
          href="/admin/customers"
          className="p-4 rounded-2xl bg-white border border-botanical-200/80 shadow-subtle space-y-1.5 hover:border-botanical-400 transition-colors block"
        >
          <div className="flex items-center justify-between text-charcoal-muted">
            <span className="text-[11px] font-medium uppercase tracking-wider">Customers</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="font-mono text-xl font-bold text-botanical-950">
            {metrics.totalCustomers}
          </div>
          <p className="text-[10px] text-charcoal-muted">Verified buyers</p>
        </Link>

        {/* Low Stock Alerts */}
        <Link
          href="/admin/inventory"
          className="p-4 rounded-2xl bg-white border border-botanical-200/80 shadow-subtle space-y-1.5 hover:border-red-300 transition-colors block"
        >
          <div className="flex items-center justify-between text-charcoal-muted">
            <span className="text-[11px] font-medium uppercase tracking-wider">Alerts</span>
            <div className="w-7 h-7 rounded-lg bg-red-50 text-red-700 flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="font-mono text-xl font-bold text-red-700">
            {metrics.lowStockCount + metrics.outOfStockCount}
          </div>
          <p className="text-[10px] text-charcoal-muted">
            {metrics.outOfStockCount} out · {metrics.lowStockCount} low
          </p>
        </Link>
      </div>

      {/* Main Content: Recent Orders & Stock Warnings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Orders Feed */}
        <div className="lg:col-span-8 rounded-2xl bg-white border border-botanical-200/80 p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-botanical-100">
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-botanical-950">
              Recent Customer Orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-clay hover:underline inline-flex items-center gap-1"
            >
              All Orders <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {metrics.recentOrders.length === 0 ? (
            <p className="py-8 text-center text-xs text-charcoal-muted">
              No orders placed yet. Orders will appear here live.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-charcoal-muted border-b border-botanical-100">
                  <tr>
                    <th className="pb-3 font-semibold">Order</th>
                    <th className="pb-3 font-semibold">Customer</th>
                    <th className="pb-3 font-semibold">Destination</th>
                    <th className="pb-3 font-semibold text-right">Amount</th>
                    <th className="pb-3 font-semibold text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-botanical-50">
                  {metrics.recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-ivory/50">
                      <td className="py-3 font-mono font-medium text-botanical-950">
                        <Link href={`/admin/orders?highlight=${order.id}`} className="hover:text-clay">
                          #{order.order_number}
                        </Link>
                      </td>
                      <td className="py-3">
                        <span className="font-medium text-botanical-950 block">
                          {order.customer_name}
                        </span>
                        <span className="text-[11px] text-charcoal-muted">{order.customer_phone}</span>
                      </td>
                      <td className="py-3 text-charcoal-muted">
                        {order.city}, {order.province}
                      </td>
                      <td className="py-3 text-right font-mono font-semibold text-botanical-950">
                        {formatPrice(order.total)}
                      </td>
                      <td className="py-3 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                            order.order_status === "Confirmed"
                              ? "bg-emerald-100 text-emerald-800"
                              : order.order_status === "Pending"
                              ? "bg-amber-100 text-amber-800"
                              : order.order_status === "Cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-botanical-100 text-botanical-800"
                          }`}
                        >
                          {order.order_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Low Stock Watchlist */}
        <div className="lg:col-span-4 rounded-2xl bg-white border border-botanical-200/80 p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-botanical-100">
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-botanical-950 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              Stock Alerts
            </h2>
            <Link
              href="/admin/inventory"
              className="text-xs font-semibold text-clay hover:underline"
            >
              Adjust
            </Link>
          </div>

          <div className="space-y-3">
            {[...metrics.outOfStockProducts, ...metrics.lowStockProducts].slice(0, 5).map((p) => (
              <div
                key={p.id}
                className="p-3 rounded-xl bg-ivory border border-botanical-200/70 flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0">
                  <h4 className="font-medium text-botanical-950 truncate">{p.name}</h4>
                  <span className="text-[10px] text-charcoal-muted font-mono">{p.sku}</span>
                </div>
                <div className="text-right flex-shrink-0">
                  <span
                    className={`font-mono font-bold px-2 py-0.5 rounded ${
                      p.stock_quantity === 0
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {p.stock_quantity === 0 ? "0 left" : `${p.stock_quantity} left`}
                  </span>
                </div>
              </div>
            ))}

            {metrics.outOfStockProducts.length === 0 && metrics.lowStockProducts.length === 0 && (
              <p className="py-6 text-center text-xs text-charcoal-muted">
                All catalog products have healthy inventory levels.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

