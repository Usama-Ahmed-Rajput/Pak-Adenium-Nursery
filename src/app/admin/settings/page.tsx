import React from "react";
import { getSiteSettings } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import SettingsManager from "./SettingsManager";

export const revalidate = 0;

export default async function AdminSettingsPage() {
  await requireAdmin();
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-botanical-200">
        <span className="text-xs uppercase tracking-widest text-clay font-semibold">
          Store Operations
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-botanical-950 mt-1">
          Nursery Configurations & Policies
        </h1>
        <p className="text-xs text-charcoal-muted mt-1">
          Customize nursery contact details, WhatsApp routing, announcement banner, and delivery charges.
        </p>
      </div>

      <SettingsManager initialSettings={settings} />
    </div>
  );
}

