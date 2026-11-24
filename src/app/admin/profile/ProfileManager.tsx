"use client";

import React, { useState } from "react";
import { AdminUser } from "@/lib/auth";
import { Shield, Key, UserCheck, CheckCircle2, AlertCircle, Loader2, Save, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfileManager({ user }: { user: AdminUser }) {
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ text: "Profile details updated successfully.", type: "success" });
      } else {
        setMessage({ text: data.error || "Failed to update profile.", type: "error" });
      }
    } catch {
      setMessage({ text: "Network error occurred.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6 text-xs">
      {message && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-2.5 ${
            message.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-3xl border border-botanical-200 p-6 sm:p-8 shadow-subtle space-y-6">
        <div className="flex items-center gap-4 pb-4 border-b border-botanical-100">
          <div className="w-14 h-14 rounded-2xl bg-botanical-900 text-ivory flex items-center justify-center text-2xl font-bold">
            {user.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-botanical-950">
              {user.name}
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono text-charcoal-muted">{user.email}</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                {user.role}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleUpdateName} className="space-y-4">
          <div>
            <label className="block font-medium text-botanical-900 mb-1">
              Administrator Display Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 text-botanical-950 focus:outline-none focus:border-botanical-700"
            />
          </div>

          <div>
            <label className="block font-medium text-botanical-900 mb-1">
              Registered Botanical Admin Email
            </label>
            <input
              type="email"
              disabled
              value={user.email}
              className="w-full bg-botanical-50 border border-botanical-200 rounded-xl px-4 py-2.5 font-mono text-charcoal-muted cursor-not-allowed"
            />
            <span className="text-[10px] text-charcoal-muted mt-1 block">
              Configured via ADMIN_DEFAULT_EMAIL in server environment variables.
            </span>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-botanical-900 hover:bg-botanical-950 text-ivory font-semibold text-xs flex items-center gap-2 shadow-subtle disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Profile Name</span>
            </button>
          </div>
        </form>
      </div>

      {/* Security Info Card */}
      <div className="bg-white rounded-3xl border border-botanical-200 p-6 sm:p-8 shadow-subtle space-y-4">
        <h3 className="text-base font-bold tracking-tight text-botanical-950 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-700" />
          <span>Active Session Protection</span>
        </h3>
        <p className="text-charcoal-muted leading-relaxed">
          Your administration token is protected by an HMAC-SHA256 signature and HttpOnly session cookies. Privileged actions require verified server-side validation.
        </p>

        <div className="pt-2 flex items-center justify-between border-t border-botanical-100">
          <span className="text-charcoal-muted">End current session securely:</span>
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-semibold inline-flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            {isLoggingOut ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LogOut className="w-3.5 h-3.5" />}
            <span>Log Out of Admin Panel</span>
          </button>
        </div>
      </div>
    </div>
  );
}

