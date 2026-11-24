"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, ArrowRight, AlertCircle, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Invalid administrator credentials.");
        setIsLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Network error while connecting to nursery authentication server.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory-sand/40 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-botanical-900 text-ivory flex items-center justify-center font-bold text-xl">
            P
          </div>
          <span className="text-2xl font-bold tracking-tight text-botanical-950">
            Pak Adenium
          </span>
        </Link>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-botanical-950">
          Nursery Staff & Admin Portal
        </h2>
        <p className="text-xs text-charcoal-muted">
          Secure access for inventory, order processing, and plant catalog management.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-card rounded-3xl border border-botanical-200/80 sm:px-10 space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-botanical-900 mb-1">
                Admin Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@pakadenium.com"
                className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 text-xs text-botanical-950 focus:outline-none focus:border-botanical-700"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-botanical-900 mb-1">
                Security Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 text-xs text-botanical-950 focus:outline-none focus:border-botanical-700"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-botanical-900 hover:bg-botanical-950 text-ivory text-xs font-medium flex items-center justify-center gap-2 shadow-card transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying Credentials...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Sign In to Nursery Dashboard
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-botanical-100 text-center">
            <Link
              href="/"
              className="text-xs text-charcoal-muted hover:text-botanical-950 transition-colors inline-flex items-center gap-1 font-medium"
            >
              ← Back to Nursery Storefront
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

