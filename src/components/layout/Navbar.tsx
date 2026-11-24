"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  MessageCircle,
  ArrowRight,
  ChevronDown,
  ShieldCheck,
  PackageCheck,
  Sparkles,
} from "lucide-react";
import SearchModal from "@/components/ui/SearchModal";

interface NavbarProps {
  announcement?: {
    enabled: boolean;
    text: string;
    link: string;
    bg_color: string;
    text_color: string;
  };
  whatsappNumber?: string;
}

export default function Navbar({
  announcement = {
    enabled: true,
    text: "Spring 2026 Flowering Collection Available — Safe Delivery Nationwide Across Pakistan",
    link: "/shop",
    bg_color: "#15271E",
    text_color: "#F5F2E9",
  },
  whatsappNumber = "923001234567",
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { totalItems, setIsCartOpen } = useCart();

  const isHomepage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setShopDropdownOpen(false);
  }, [pathname]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShopDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Plant categories for the dropdown menu (in clear, descriptive English)
  const plantCategories = [
    {
      name: "All Plants & Collections",
      href: "/shop",
      description: "Browse our complete catalog of hand-raised specimens",
      isAll: true,
    },
    {
      name: "Grafted Flowering Varieties",
      href: "/shop?category=grafted-varieties",
      description: "Multi-petal layered blooms in vibrant colors",
    },
    {
      name: "Desert Rose Bonsai",
      href: "/shop?category=adenium-arabicum",
      description: "Sculptural wide-base specimen trees with thick trunks",
    },
    {
      name: "Specimen Bonsai Trays",
      href: "/shop?category=specimen-bonsai",
      description: "Mature 4 to 8-year root-trained trees in artisan clay pots",
    },
    {
      name: "Rare Collector Hybrids",
      href: "/shop?category=rare-collector-hybrids",
      description: "Curled leaf varieties, variegated foliage, and rare mutations",
    },
    {
      name: "Seeds & Plant Food",
      href: "/shop?category=seeds-and-care",
      description: "Porous mineral potting media, plant food, and fresh seeds",
    },
  ];

  // Primary top-level navigation links
  const primaryLinks = [
    { label: "Plant Finder", href: "/plant-finder" },
    { label: "Care Guides", href: "/journal" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const isDarkNav = isHomepage && !isScrolled;
  const isShopActive = pathname.startsWith("/shop");

  return (
    <>
      <header className="sticky top-0 z-40 w-full transition-all duration-200 font-sans">
        {/* Top Announcement Bar — Sleek & Compact */}
        {announcement.enabled && (
          <div
            style={{
              backgroundColor: isDarkNav ? "rgba(10, 20, 15, 0.96)" : "#15271E",
              color: "#F5F2E9",
            }}
            className="border-b border-white/10 text-[11px] py-1 px-4 transition-colors"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              {/* Left location tag */}
              <div className="hidden md:flex items-center gap-1.5 text-white/80 font-normal">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Nursery &amp; Gardens · Multan, Pakistan</span>
              </div>

              {/* Center announcement text */}
              <div className="flex-1 text-center truncate">
                <Link
                  href={announcement.link || "/shop"}
                  className="inline-flex items-center gap-1.5 font-medium hover:text-clay transition-colors"
                >
                  <span className="truncate">{announcement.text}</span>
                  <ArrowRight className="w-3 h-3 opacity-70 flex-shrink-0" />
                </Link>
              </div>

              {/* Right Order Tracking & Helpline */}
              <div className="hidden sm:flex items-center gap-3 text-white/80">
                <Link
                  href="/order-lookup"
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  <PackageCheck className="w-3 h-3 text-clay" />
                  <span>Track Order</span>
                </Link>
                <span className="text-white/30">|</span>
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  <MessageCircle className="w-3 h-3 text-emerald-400" />
                  <span>Help: +92 300 1234567</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Main Navigation Bar — Slim, Modern & Elegant */}
        <div
          className={`transition-all duration-200 border-b ${
            isDarkNav
              ? "bg-[#0d1813]/90 backdrop-blur-md border-white/10 text-white py-2"
              : isScrolled
              ? "bg-white/95 backdrop-blur-md border-[#E5E0D8] shadow-sm text-neutral-900 py-2"
              : "bg-white border-[#E5E0D8] text-neutral-900 py-2.5"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className={`p-1.5 -ml-1.5 rounded-md transition-colors ${
                  isDarkNav
                    ? "text-white hover:bg-white/10"
                    : "text-neutral-900 hover:text-clay hover:bg-neutral-100"
                }`}
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5 stroke-[2]" />
              </button>
            </div>

            {/* Brand Logo — Streamlined & Compact */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-serif text-sm font-bold transition-all shadow-sm ${
                  isDarkNav
                    ? "bg-[#FBF9F4] text-[#15271E] group-hover:bg-white"
                    : "bg-[#15271E] text-white group-hover:bg-[#233D2E]"
                }`}
              >
                <span>P</span>
              </div>
              <div className="flex flex-col">
                <span
                  className={`font-serif text-lg sm:text-xl font-normal tracking-tight transition-colors leading-tight ${
                    isDarkNav
                      ? "text-white group-hover:text-ivory"
                      : "text-[#15271E] group-hover:text-neutral-800"
                  }`}
                >
                  Pak Adenium
                </span>
                <span className="text-[9px] tracking-wider uppercase text-clay font-semibold">
                  Desert Rose Nursery
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Menu with Clean Dropdown */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-[13px] font-medium">
              {/* "Shop Plants" with Dropdown */}
              <div
                ref={dropdownRef}
                className="relative py-1"
                onMouseEnter={() => setShopDropdownOpen(true)}
                onMouseLeave={() => setShopDropdownOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setShopDropdownOpen(!shopDropdownOpen)}
                  className={`inline-flex items-center gap-1.5 py-1 transition-colors relative ${
                    isShopActive
                      ? isDarkNav
                        ? "text-white font-semibold"
                        : "text-[#15271E] font-semibold"
                      : isDarkNav
                      ? "text-white/80 hover:text-white"
                      : "text-neutral-700 hover:text-[#15271E]"
                  }`}
                  aria-expanded={shopDropdownOpen}
                >
                  <span>Shop Plants</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 opacity-70 ${
                      shopDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                  {isShopActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-clay rounded-full" />
                  )}
                </button>

                {/* Dropdown Menu Card */}
                {shopDropdownOpen && (
                  <div className="absolute top-full left-0 pt-1.5 z-50">
                    <div
                      className={`w-80 rounded-xl border p-2 shadow-2xl transition-all duration-150 ease-out ${
                        isDarkNav
                          ? "bg-[#112018]/98 backdrop-blur-md border-white/15 text-white"
                          : "bg-white border-[#E5E0D8] text-neutral-900"
                      }`}
                    >
                      <div className="space-y-1">
                        {plantCategories.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setShopDropdownOpen(false)}
                            className={`group/item flex flex-col px-3 py-2 rounded-lg transition-colors ${
                              item.isAll
                                ? isDarkNav
                                  ? "bg-white/10 hover:bg-white/15 text-white font-medium"
                                  : "bg-neutral-50 hover:bg-neutral-100 text-[#15271E] font-medium"
                                : isDarkNav
                                ? "hover:bg-white/10 text-white/90"
                                : "hover:bg-neutral-50 text-neutral-800"
                            }`}
                          >
                            <div className="flex items-center justify-between text-[13px] font-medium">
                              <span className="group-hover/item:text-clay transition-colors">
                                {item.name}
                              </span>
                              <ArrowRight className="w-3 h-3 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-0.5 transition-all text-clay" />
                            </div>
                            <span
                              className={`text-[11px] leading-snug line-clamp-1 mt-0.5 ${
                                isDarkNav ? "text-white/60" : "text-neutral-500"
                              }`}
                            >
                              {item.description}
                            </span>
                          </Link>
                        ))}
                      </div>

                      <div
                        className={`mt-2 pt-2 border-t flex items-center justify-between px-3 py-1 text-[11px] ${
                          isDarkNav
                            ? "border-white/10 text-white/60"
                            : "border-neutral-100 text-neutral-500"
                        }`}
                      >
                        <span>Looking for advice?</span>
                        <Link
                          href="/plant-finder"
                          onClick={() => setShopDropdownOpen(false)}
                          className="text-clay hover:underline font-semibold"
                        >
                          Try Plant Finder &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Remaining Primary English Links */}
              {primaryLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`py-1 transition-colors relative ${
                      isActive
                        ? isDarkNav
                          ? "text-white font-semibold"
                          : "text-[#15271E] font-semibold"
                        : isDarkNav
                        ? "text-white/80 hover:text-white"
                        : "text-neutral-700 hover:text-[#15271E]"
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-clay rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Cluster */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                className={`p-1.5 sm:p-2 rounded-full transition-colors ${
                  isDarkNav
                    ? "text-white/80 hover:text-white hover:bg-white/10"
                    : "text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100"
                }`}
                aria-label="Search catalog"
                title="Search plants"
              >
                <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2]" />
              </button>

              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className={`relative p-1.5 sm:p-2 rounded-full transition-colors ${
                  isDarkNav
                    ? "text-white/80 hover:text-white hover:bg-white/10"
                    : "text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100"
                }`}
                aria-label="View shopping bag"
                title="View cart"
              >
                <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2]" />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 min-w-[16px] h-[16px] px-1 rounded-full bg-clay text-white text-[9px] font-bold flex items-center justify-center font-sans shadow-sm">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* WhatsApp Button (Clean English Text & Icon) */}
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                  "Hello! I would like to inquire about Desert Rose plants from Pak Adenium."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm ${
                  isDarkNav
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                    : "bg-[#15271E] text-white hover:bg-[#233D2E]"
                }`}
                title="Direct WhatsApp Consultation"
              >
                <MessageCircle className="w-3.5 h-3.5 text-white" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>

              {/* Admin Portal Quick Link */}
              <Link
                href="/admin"
                className={`p-1.5 rounded-full transition-colors hidden xl:block opacity-50 hover:opacity-100 ${
                  isDarkNav ? "text-white hover:text-white" : "text-neutral-500 hover:text-neutral-900"
                }`}
                title="Admin Portal"
                aria-label="Admin portal"
              >
                <ShieldCheck className="w-4 h-4 stroke-[1.75]" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 w-4/5 max-w-xs bg-white shadow-xl flex flex-col justify-between p-5 overflow-y-auto">
            <div>
              {/* Mobile Drawer Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-[#E5E0D8]">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2"
                >
                  <div className="w-7 h-7 rounded-full bg-[#15271E] flex items-center justify-center text-white font-serif font-bold text-xs">
                    P
                  </div>
                  <div>
                    <span className="font-serif text-base font-normal text-[#15271E] block">
                      Pak Adenium
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-clay font-medium block">
                      Desert Rose Nursery
                    </span>
                  </div>
                </Link>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-neutral-500 hover:text-neutral-900 rounded-md"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 stroke-[2]" />
                </button>
              </div>

              {/* Mobile Links */}
              <nav className="mt-4 space-y-1">
                {/* Collapsible Shop Section */}
                <div className="border-b border-neutral-100 pb-1 mb-1">
                  <button
                    onClick={() => setMobileShopOpen(!mobileShopOpen)}
                    className="w-full flex items-center justify-between py-2.5 px-2.5 rounded-md text-sm font-semibold text-[#15271E] hover:bg-neutral-50"
                  >
                    <span>Shop Plants &amp; Varieties</span>
                    <ChevronDown
                      className={`w-4 h-4 text-neutral-400 transition-transform ${
                        mobileShopOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {mobileShopOpen && (
                    <div className="pl-3 pr-1 py-1 space-y-1">
                      {plantCategories.map((cat) => (
                        <Link
                          key={cat.name}
                          href={cat.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center justify-between py-2 px-2 rounded-md text-xs text-neutral-700 hover:text-[#15271E] hover:bg-neutral-50"
                        >
                          <span>{cat.name}</span>
                          <ArrowRight className="w-3 h-3 text-neutral-300" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {primaryLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between py-2.5 px-2.5 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-neutral-100 text-[#15271E] font-semibold"
                          : "text-neutral-700 hover:bg-neutral-50"
                      }`}
                    >
                      <span>{link.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                    </Link>
                  );
                })}

                <Link
                  href="/order-lookup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2.5 px-2.5 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                >
                  <span className="flex items-center gap-2">
                    <PackageCheck className="w-4 h-4 text-clay" />
                    Track Your Order
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                </Link>
              </nav>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[#E5E0D8] space-y-2.5">
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                  "Hello! I would like to inquire about Desert Rose plants from Pak Adenium."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>

              <div className="flex items-center justify-between text-xs text-neutral-500 pt-1 px-1">
                <Link
                  href="/order-lookup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-neutral-900"
                >
                  Order Lookup
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-neutral-900"
                >
                  Admin Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
