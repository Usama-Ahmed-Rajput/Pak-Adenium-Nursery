import React, { Suspense } from "react";
import { getOrders } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import OrderManager from "./OrderManager";

export const revalidate = 0;

interface AdminOrdersPageProps {
  searchParams: Promise<{ highlight?: string }>;
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  await requireAdmin();
  const { highlight } = await searchParams;
  const orders = await getOrders();

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-botanical-200">
        <span className="text-xs uppercase tracking-widest text-clay font-medium">
          Fulfillment & Logistics
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-botanical-950 mt-1">
          Customer Orders Management
        </h1>
        <p className="text-xs text-charcoal-muted mt-1">
          Review customer orders, transition dispatch statuses, and message buyers directly on WhatsApp.
        </p>
      </div>

      <Suspense fallback={<div className="py-8 text-xs text-charcoal-muted">Loading orders...</div>}>
        <OrderManager initialOrders={orders} highlightId={highlight} />
      </Suspense>
    </div>
  );
}
