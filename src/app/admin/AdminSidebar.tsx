"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  FolderTree,
  BookOpen,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  AlertTriangle,
  Users,
  Image as ImageIcon,
  User,
} from "lucide-react";

export default function AdminSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { label: "Dashboard Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Products Catalog", href: "/admin/products", icon: Package },
    { label: "Inventory Levels", href: "/admin/inventory", icon: Layers },
    { label: "Customer Orders", href: "/admin/orders", icon: ShoppingBag },
    { label: "Categories", href: "/admin/categories", icon: FolderTree },
    { label: "Customers", href: "/admin/customers", icon: Users },
    { label: "Media Library", href: "/admin/media", icon: ImageIcon },
    { label: "Growing Journal", href: "/admin/journal", icon: BookOpen },
    { label: "Nursery Settings", href: "/admin/settings", icon: Settings },
    { label: "Admin Profile", href: "/admin/profile", icon: User },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <>
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-botanical-950 text-ivory p-4 flex items-center justify-between border-b border-botanical-800">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-ivory text-botanical-950 flex items-center justify-center font-bold text-sm">
            P
          </div>
          <span className="font-bold text-base tracking-tight">Pak Adenium Admin</span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-1.5 rounded-lg text-ivory hover:bg-botanical-800"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-botanical-950 text-ivory flex flex-col justify-between border-r border-botanical-900 transition-transform lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 space-y-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-ivory text-botanical-950 flex items-center justify-center font-bold text-base">
                P
              </div>
              <div>
                <span className="text-lg font-bold text-ivory block leading-none tracking-tight">
                  Pak Adenium
                </span>
                <span className="text-[9px] uppercase tracking-widest text-clay font-medium">
                  Management Desk
                </span>
              </div>
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1 text-ivory/70 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive =
                pathname === link.href ||
                (link.href !== "/admin" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-botanical-800 text-clay font-semibold shadow-subtle"
                      : "text-ivory/70 hover:text-ivory hover:bg-botanical-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Quick Actions */}
        <div className="p-6 border-t border-botanical-900 space-y-3">
          <div className="text-xs">
            <span className="text-ivory/40 block text-[10px] uppercase tracking-wider">
              Signed in as
            </span>
            <span className="font-mono text-ivory/80 truncate block">{userEmail}</span>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-botanical-900 text-xs text-ivory/80 hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5" />
                Live Storefront
              </span>
              <span className="text-[10px] text-clay">Open ↗</span>
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-botanical-950/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}

