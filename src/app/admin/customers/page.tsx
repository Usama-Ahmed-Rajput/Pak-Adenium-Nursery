import React from "react";
import { getCustomers } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import CustomerManager from "./CustomerManager";

export const revalidate = 0;

export default async function AdminCustomersPage() {
  await requireAdmin();
  const customers = await getCustomers();

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-botanical-200">
        <span className="text-xs uppercase tracking-widest text-clay font-semibold">
          Customer Directory
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-botanical-950 mt-1">
          Customer Management
        </h1>
        <p className="text-xs text-charcoal-muted mt-1">
          Review customer profiles across Pakistan, order volume, and reach buyers directly on WhatsApp.
        </p>
      </div>

      <CustomerManager initialCustomers={customers} />
    </div>
  );
}

