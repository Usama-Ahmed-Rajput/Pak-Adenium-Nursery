"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight, Sparkles } from "lucide-react";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.products || []);
        }
      } catch (err) {
        console.error("Search fetch failed", err);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleFullSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      router.push(`/shop?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20">
      <div
        className="fixed inset-0 bg-botanical-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative mx-auto max-w-2xl transform rounded-2xl bg-ivory border border-botanical-200/80 shadow-2xl overflow-hidden transition-all">
        {/* Search Input Bar */}
        <form onSubmit={handleFullSearch} className="relative flex items-center border-b border-botanical-200/60 px-4">
          <Search className="h-5 w-5 text-botanical-500 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by variety, flower color, species (e.g. Dorset Horn, Black King, Bonsai)..."
            className="h-16 w-full bg-transparent pr-4 text-sm md:text-base text-botanical-950 placeholder-charcoal-muted focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 rounded-full text-botanical-400 hover:text-botanical-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="ml-2 text-xs font-mono text-botanical-500 border border-botanical-200 px-2 py-1 rounded"
          >
            ESC
          </button>
        </form>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-4">
          {isLoading && (
            <div className="py-8 text-center text-sm text-charcoal-muted">
              Searching botanical catalog...
            </div>
          )}

          {!isLoading && query && results.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-sm text-botanical-900 font-medium mb-1">
                No matching plants found for &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs text-charcoal-muted max-w-sm mx-auto mb-4">
                Looking for a specific collector hybrid or custom graft? Inquire directly with our nursery team on WhatsApp.
              </p>
              <a
                href={`https://wa.me/923001234567?text=${encodeURIComponent(`Hello, I am searching for ${query} at Pak Adenium Nursery.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-clay hover:underline"
              >
                Inquire via WhatsApp <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs uppercase tracking-wider text-botanical-600 font-medium px-2 pb-1">
                Catalog Results ({results.length})
              </div>
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/shop/${product.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-3.5 p-2.5 rounded-xl hover:bg-botanical-100/70 transition-colors group"
                >
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-ivory-sand flex-shrink-0 border border-botanical-200/40">
                    <img
                      src={product.images[0]?.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-botanical-950 truncate group-hover:text-clay transition-colors">
                      {product.name}
                    </h4>
                    <p className="text-xs text-charcoal-muted font-mono">{product.sku} · {product.species}</p>
                    <p className="text-xs text-botanical-700 font-medium">{product.flower_color}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-sm font-semibold text-botanical-900 font-mono">
                      {formatPrice(product.sale_price ?? product.price)}
                    </span>
                    <div className="text-[11px] text-emerald-700 font-medium">
                      {product.stock_quantity > 0 ? "In Stock" : "Reserve"}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!query && (
            <div className="py-6 px-2 space-y-4">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-botanical-700">
                <Sparkles className="w-3.5 h-3.5 text-clay" />
                Popular Botanical Searches
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "Dorset Horn",
                  "Triple Black King",
                  "Super Baobab Arabicum",
                  "White Diamond",
                  "Grafted Multi-Petal",
                  "Bonsai Caudex",
                  "Fresh Seeds",
                ].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="text-xs px-3 py-1.5 rounded-full bg-botanical-100/80 hover:bg-botanical-200/80 text-botanical-900 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

