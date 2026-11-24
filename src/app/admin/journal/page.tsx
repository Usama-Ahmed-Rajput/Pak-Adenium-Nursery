import React from "react";
import { getAllArticlesAdmin } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import JournalAdminManager from "./JournalAdminManager";

export const revalidate = 0;

export default async function AdminJournalPage() {
  await requireAdmin();
  const articles = await getAllArticlesAdmin();

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-botanical-200">
        <span className="text-xs uppercase tracking-widest text-clay font-semibold">
          Editorial & Care Education
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-botanical-950 mt-1">
          The Growing Journal Editor
        </h1>
        <p className="text-xs text-charcoal-muted mt-1">
          Publish guides, seasonal care tips, and training articles for your customers.
        </p>
      </div>

      <JournalAdminManager initialArticles={articles} />
    </div>
  );
}

