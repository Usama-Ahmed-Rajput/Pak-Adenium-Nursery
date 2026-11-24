import React from "react";
import { requireAdmin } from "@/lib/auth";
import ProfileManager from "./ProfileManager";

export const revalidate = 0;

export default async function AdminProfilePage() {
  const session = await requireAdmin();

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-botanical-200">
        <span className="text-xs uppercase tracking-widest text-clay font-semibold">
          Staff Identity
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-botanical-950 mt-1">
          Administrator Credentials & Profile
        </h1>
        <p className="text-xs text-charcoal-muted mt-1">
          Review authenticated nursery personnel details, active session token, and security controls.
        </p>
      </div>

      <ProfileManager user={session} />
    </div>
  );
}

