"use client";

import React, { useState, useEffect } from "react";
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
  ShieldCheck,
  Phone,
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
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const { totalItems, setIsCartOpen } = useCart();

  const isHomepage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: "Shop All", href: "/shop" },
    { label: "Grafted Varieties", href: "/shop?category=grafted-varieties" },
    { label: "Adenium Arabicum", href: "/shop?category=adenium-arabicum" },
    { label: "Bonsai Collection", href: "/shop?category=specimen-bonsai" },
    { label: "Plant Finder", href: "/plant-finder" },
    { label: "Care Guides", href: "/journal" },
    { label: "About Us", href: "/about" },
  ];

  // Visual mode: Dark overlay over Hero video at top of homepage; clean warm ivory everywhere else
  const isDarkNav = isHomepage && !isScrolled;

  return (
    <>
      <header className="sticky top-0 z-40 w-full transition-all duration-300 font-sans">
        {/* Top Info Bar */}
        {announcement.enabled && (
          <div
            style={{
              backgroundColor: isDarkNav ? "rgba(13, 24, 19, 0.95)" : "#15271E",
              color: "#F5F2E9",
            }}
            className="border-b border-white/10 text-xs py-2 px-4 transition-colors"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              {/* Left note */}
              <div className="hidden sm:flex items-center gap-2 text-ivory/80 text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Nursery & Gardens · Multan, Pakistan</span>
              </div>

              {/* Center announcement */}
              <div className="flex-1 text-center">
                <Link
                  href={announcement.link || "/shop"}
                  className="inline-flex items-center gap-1.5 font-medium hover:text-clay transition-colors"
                >
                  <span>{announcement.text}</span>
                  <ArrowRight className="w-3 h-3 opacity-70" />
                </Link>
              </div>

              {/* Right phone */}
              <div className="hidden md:flex items-center gap-3 text-ivory/80 text-[11px]">
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp: +92 300 1234567</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Main Navbar */}
        <div
          className={`transition-all duration-300 border-b ${
            isDarkNav
              ? "bg-botanical-950/80 backdrop-blur-md border-white/10 text-ivory py-4"
              : isScrolled
              ? "bg-white/95 backdrop-blur-md border-[#E5E0D8] shadow-sm text-neutral-900 py-3"
              : "bg-white border-[#E5E0D8] text-neutral-900 py-4"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6">
            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className={`p-2 -ml-2 rounded-md transition-colors ${
                  isDarkNav
                    ? "text-ivory hover:text-white hover:bg-white/10"
                    : "text-neutral-900 hover:text-clay hover:bg-neutral-100"
                }`}
                aria-label="Open navigation menu"
              >
                <Menu className="w-6 h-6 stroke-[1.75]" />
              </button>
            </div>

            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-serif text-base sm:text-lg font-bold transition-all ${
                  isDarkNav
                    ? "bg-ivory text-botanical-950 group-hover:bg-white"
                    : "bg-[#15271E] text-white group-hover:bg-[#233D2E]"
                }`}
              >
                <span>P</span>
              </div>
              <div className="flex flex-col">
                <span
                  className={`font-serif text-xl sm:text-2xl font-normal tracking-tight transition-colors ${
                    isDarkNav
                      ? "text-white group-hover:text-ivory"
                      : "text-[#15271E] group-hover:text-neutral-800"
                  }`}
                >
                  Pak Adenium
                </span>
                <span className="text-[10px] tracking-wider uppercase text-clay font-medium -mt-0.5">
                  Desert Rose Nursery
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links (Manrope, highly readable, natural case) */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`text-[13.5px] font-medium transition-colors relative py-1 ${
                      isActive
                        ? isDarkNav
                          ? "text-white font-semibold"
                          : "text-[#15271E] font-semibold"
                        : isDarkNav
                        ? "text-ivory/80 hover:text-white"
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
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                className={`p-2 rounded-full transition-colors ${
                  isDarkNav
                    ? "text-ivory/80 hover:text-white hover:bg-white/10"
                    : "text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100"
                }`}
                aria-label="Search catalog"
                title="Search plants"
              >
                <Search className="w-5 h-5 stroke-[1.75]" />
              </button>

              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className={`relative p-2 rounded-full transition-colors ${
                  isDarkNav
                    ? "text-ivory/80 hover:text-white hover:bg-white/10"
                    : "text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100"
                }`}
                aria-label="View shopping bag"
                title="View cart"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
                {totalItems > 0 && (
                  <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-clay text-white text-[10px] font-bold flex items-center justify-center font-sans shadow-sm">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* WhatsApp Button */}
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                  "Assalam-o-Alaikum, I am inquiring about Desert Rose plants from Pak Adenium."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`hidden md:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  isDarkNav
                    ? "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                    : "bg-[#15271E] text-white hover:bg-[#233D2E]"
                }`}
                title="Direct WhatsApp Consultation"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp Us</span>
              </a>

              {/* Admin Link */}
              <Link
                href="/admin"
                className={`p-2 rounded-full transition-colors hidden xl:block opacity-60 hover:opacity-100 ${
                  isDarkNav ? "text-ivory hover:text-white" : "text-neutral-500 hover:text-neutral-900"
                }`}
                title="Admin Dashboard"
                aria-label="Admin portal"
              >
                <ShieldCheck className="w-4 h-4 stroke-[1.5]" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white shadow-xl flex flex-col justify-between p-6 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E0D8]">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5"
                >
                  <div className="w-8 h-8 rounded-full bg-[#15271E] flex items-center justify-center text-white font-serif font-bold text-sm">
                    P
                  </div>
                  <div>
                    <span className="font-serif text-lg font-normal text-[#15271E] block">
                      Pak Adenium
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-clay font-medium block">
                      Desert Rose Nursery
                    </span>
                  </div>
                </Link>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded-md"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 stroke-[1.75]" />
                </button>
              </div>

              {/* Mobile Links */}
              <nav className="mt-6 space-y-1">
                {navLinks.map((link) => {
                  const isActive =
                    pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between py-3 px-3 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-neutral-100 text-[#15271E] font-semibold"
                          : "text-neutral-700 hover:bg-neutral-50"
                      }`}
                    >
                      <span>{link.label}</span>
                      <ArrowRight className="w-4 h-4 text-neutral-400" />
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-[#E5E0D8] space-y-3">
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>

              <div className="flex items-center justify-between text-xs text-neutral-500 pt-1">
                <Link
                  href="/order-lookup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-neutral-900"
                >
                  Track Order
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
