import React from "react";
import { requireAdmin } from "@/lib/auth";
import MediaManager from "./MediaManager";

export const revalidate = 0;

export default async function AdminMediaPage() {
  await requireAdmin();
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-botanical-200">
        <span className="text-xs uppercase tracking-widest text-clay font-semibold">
          Digital Assets
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-botanical-950 mt-1">
          Nursery Media & Photography Storage
        </h1>
        <p className="text-xs text-charcoal-muted mt-1">
          Upload, manage, and retrieve product images stored on the nursery server.
        </p>
      </div>

      <MediaManager />
    </div>
  );
}

