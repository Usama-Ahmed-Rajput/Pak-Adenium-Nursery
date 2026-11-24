"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Customer } from "@/types";
import { formatPrice, generateWhatsAppLink } from "@/lib/utils";
import {
  Search,
  Users,
  ShoppingBag,
  Banknote,
  MessageCircle,
  ExternalLink,
  MapPin,
  Calendar,
} from "lucide-react";

interface CustomerManagerProps {
  initialCustomers: Customer[];
}

export default function CustomerManager({ initialCustomers }: CustomerManagerProps) {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [search, setSearch] = useState("");

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase().trim();
    return (
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.whatsapp.includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.province.toLowerCase().includes(q)
    );
  });

  const totalSpendSum = customers.reduce((acc, c) => acc + c.total_spend, 0);
  const repeatCustomersCount = customers.filter((c) => c.total_orders > 1).length;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-botanical-200 shadow-subtle space-y-1">
          <div className="flex items-center justify-between text-charcoal-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Patrons</span>
            <div className="w-8 h-8 rounded-lg bg-botanical-100 text-botanical-800 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="font-mono text-2xl font-bold text-botanical-950">{customers.length}</div>
          <p className="text-[11px] text-charcoal-muted">Verified buyers who placed orders</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-botanical-200 shadow-subtle space-y-1">
          <div className="flex items-center justify-between text-charcoal-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">Repeat Collectors</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="font-mono text-2xl font-bold text-emerald-800">{repeatCustomersCount}</div>
          <p className="text-[11px] text-charcoal-muted">Customers with 2+ completed purchases</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-botanical-200 shadow-subtle space-y-1">
          <div className="flex items-center justify-between text-charcoal-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">Cumulative Spend</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <div className="font-mono text-2xl font-bold text-botanical-950">{formatPrice(totalSpendSum)}</div>
          <p className="text-[11px] text-charcoal-muted">Gross customer portfolio value</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by name, phone, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-botanical-300 rounded-xl pl-9 pr-4 py-2.5 text-xs text-botanical-950 focus:outline-none focus:border-botanical-700 shadow-subtle"
          />
          <Search className="w-4 h-4 text-botanical-400 absolute left-3 top-3" />
        </div>

        <div className="text-xs text-charcoal-muted">
          Showing <span className="font-semibold text-botanical-950">{filtered.length}</span> of {customers.length} patrons
        </div>
      </div>

      {/* Customers Table */}
      <div className="rounded-2xl bg-white border border-botanical-200/80 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-botanical-50 border-b border-botanical-200 text-botanical-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Collector Name</th>
                <th className="py-3 px-4 font-semibold">Contact Details</th>
                <th className="py-3 px-4 font-semibold">Location</th>
                <th className="py-3 px-4 font-semibold text-center">Orders</th>
                <th className="py-3 px-4 font-semibold text-right">Lifetime Spend</th>
                <th className="py-3 px-4 font-semibold">Last Purchase</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-botanical-100">
              {filtered.map((customer) => (
                <tr key={customer.id} className="hover:bg-ivory/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-botanical-950 block text-sm">
                      {customer.name}
                    </span>
                    {customer.email && (
                      <span className="text-charcoal-muted text-[11px]">{customer.email}</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-charcoal-muted">
                    <span className="block text-botanical-950 font-medium">{customer.phone}</span>
                    <span className="text-[10px]">WA: {customer.whatsapp}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-botanical-950 font-medium">
                      <MapPin className="w-3 h-3 text-clay" />
                      {customer.city}, {customer.province}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-botanical-100 text-botanical-900 font-bold font-mono text-[11px]">
                      {customer.total_orders}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono font-semibold text-botanical-950">
                    {formatPrice(customer.total_spend)}
                  </td>

                  <td className="py-3.5 px-4 text-charcoal-muted">
                    <span className="block font-medium text-botanical-950">
                      #{customer.last_order_number}
                    </span>
                    <span className="text-[10px]">
                      {new Date(customer.last_order_date).toLocaleDateString()}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={generateWhatsAppLink(
                          customer.whatsapp,
                          `Hello ${customer.name}, greetings from Pak Adenium Nursery.`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-[#25D366] text-botanical-950 font-semibold inline-flex items-center gap-1.5 shadow-subtle hover:bg-[#20ba59] transition-colors"
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-charcoal-muted">
                    No customers found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

