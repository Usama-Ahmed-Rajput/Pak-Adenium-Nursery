"use client";

import React, { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Product, Category } from "@/types";
import ProductCard from "@/components/product/ProductCard";
import { Filter, X, SlidersHorizontal, ArrowUpDown, Search, RotateCcw } from "lucide-react";

interface CatalogViewProps {
  initialProducts: Product[];
  categories: Category[];
}

export default function CatalogView({ initialProducts, categories }: CatalogViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read state from URL query
  const activeCategory = searchParams.get("category") || "all";
  const activeSpecies = searchParams.get("species") || "all";
  const activeColor = searchParams.get("color") || "all";
  const activePetal = searchParams.get("petal") || "all";
  const activeSort = searchParams.get("sort") || "featured";
  const searchQuery = searchParams.get("q") || "";
  const inStockOnly = searchParams.get("in_stock") === "true";

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchQuery);

  // Derive unique filter options
  const speciesList = useMemo(() => {
    const set = new Set(initialProducts.map((p) => p.species));
    return Array.from(set);
  }, [initialProducts]);

  const colorList = useMemo(() => {
    const set = new Set(
      initialProducts.map((p) => {
        const c = p.flower_color.toLowerCase();
        if (c.includes("black") || c.includes("dark")) return "Black / Dark Velvet";
        if (c.includes("white")) return "Pure White";
        if (c.includes("yellow") || c.includes("sunset") || c.includes("apricot")) return "Yellow / Apricot";
        if (c.includes("star") || c.includes("bi-color") || c.includes("gold")) return "Bi-Color Star";
        if (c.includes("pink")) return "Pink / Rose";
        return "Classic Desert Rose";
      })
    );
    return Array.from(set);
  }, [initialProducts]);

  const petalTypes = useMemo(() => {
    const set = new Set(initialProducts.map((p) => p.petal_type));
    return Array.from(set);
  }, [initialProducts]);

  // Update query params cleanly
  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "all" || value === "false") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/shop?${params.toString()}`, { scroll: false });
  };

  const clearAllFilters = () => {
    setSearchInput("");
    router.push("/shop", { scroll: false });
  };

  // Client-side filtering & sorting for instant speed
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Category
    if (activeCategory !== "all") {
      const cat = categories.find((c) => c.slug === activeCategory);
      if (cat) {
        result = result.filter((p) => p.category_id === cat.id);
      }
    }

    // Species
    if (activeSpecies !== "all") {
      result = result.filter((p) => p.species === activeSpecies);
    }

    // Color
    if (activeColor !== "all") {
      result = result.filter((p) => {
        const c = p.flower_color.toLowerCase();
        if (activeColor === "Black / Dark Velvet") return c.includes("black") || c.includes("dark");
        if (activeColor === "Pure White") return c.includes("white");
        if (activeColor === "Yellow / Apricot") return c.includes("yellow") || c.includes("sunset") || c.includes("apricot");
        if (activeColor === "Bi-Color Star") return c.includes("star") || c.includes("bi-color") || c.includes("gold");
        if (activeColor === "Pink / Rose") return c.includes("pink");
        return true;
      });
    }

    // Petal type
    if (activePetal !== "all") {
      result = result.filter((p) => p.petal_type === activePetal);
    }

    // In-Stock
    if (inStockOnly) {
      result = result.filter((p) => p.stock_quantity > 0);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.variety.toLowerCase().includes(q) ||
          p.species.toLowerCase().includes(q) ||
          p.flower_color.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (activeSort === "price-asc") {
      result.sort((a, b) => (a.sale_price ?? a.price) - (b.sale_price ?? b.price));
    } else if (activeSort === "price-desc") {
      result.sort((a, b) => (b.sale_price ?? b.price) - (a.sale_price ?? a.price));
    } else if (activeSort === "newest") {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (activeSort === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
    }

    return result;
  }, [
    initialProducts,
    activeCategory,
    categories,
    activeSpecies,
    activeColor,
    activePetal,
    inStockOnly,
    searchQuery,
    activeSort,
  ]);

  const hasActiveFilters =
    activeCategory !== "all" ||
    activeSpecies !== "all" ||
    activeColor !== "all" ||
    activePetal !== "all" ||
    inStockOnly ||
    searchQuery.trim().length > 0;

  return (
    <div className="py-8 sm:py-12 bg-[#FBF9F4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* 1. Professional Page Header */}
        <div className="pb-6 border-b border-[#E5E0D8] space-y-3">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-clay font-semibold block">
                Nursery Storefront
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#15271E] mt-1">
                Desert Rose Collection
              </h1>
              <p className="text-sm text-[#525B52] max-w-xl mt-1.5">
                Acclimated varieties grown under Pakistan&rsquo;s sun. Dispatched safely in protective packaging nationwide.
              </p>
            </div>

            {/* Mobile Filter Trigger & Sort Dropdown */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-md border border-[#D5DDD2] bg-white text-xs font-semibold text-[#15271E] shadow-sm"
              >
                <SlidersHorizontal className="w-4 h-4 text-clay" />
                <span>Filters {hasActiveFilters && "(Active)"}</span>
              </button>

              <div className="relative flex items-center">
                <select
                  value={activeSort}
                  onChange={(e) => updateFilter("sort", e.target.value)}
                  className="appearance-none bg-white border border-[#D5DDD2] rounded-md px-3.5 py-2 pr-8 text-xs font-medium text-[#15271E] focus:outline-none focus:border-[#15271E] shadow-sm cursor-pointer"
                >
                  <option value="featured">Featured Plants</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                  <option value="name">Alphabetical (A - Z)</option>
                </select>
                <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* 2. Category Tabs & Search Bar */}
          <div className="pt-2 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Horizontal Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              <button
                onClick={() => updateFilter("category", "all")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium flex-shrink-0 transition-colors ${
                  activeCategory === "all"
                    ? "bg-[#15271E] text-white"
                    : "bg-white text-neutral-700 hover:bg-neutral-100 border border-[#E5E0D8]"
                }`}
              >
                All Plants
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => updateFilter("category", c.slug)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium flex-shrink-0 transition-colors ${
                    activeCategory === c.slug
                      ? "bg-[#15271E] text-white"
                      : "bg-white text-neutral-700 hover:bg-neutral-100 border border-[#E5E0D8]"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            {/* Clean Search Input */}
            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder="Search plant or variety..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") updateFilter("q", searchInput);
                }}
                className="w-full bg-white border border-[#D5DDD2] rounded-md pl-8 pr-8 py-1.5 text-xs text-[#15271E] placeholder-[#8A9488] focus:outline-none focus:border-[#15271E]"
              />
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
              {searchInput && (
                <button
                  onClick={() => {
                    setSearchInput("");
                    updateFilter("q", null);
                  }}
                  className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-neutral-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Active Filter Indicators */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
              <span className="text-neutral-500">Active filters:</span>
              {activeCategory !== "all" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-[#D5DDD2] text-[#15271E] font-medium">
                  {categories.find((c) => c.slug === activeCategory)?.name}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter("category", "all")} />
                </span>
              )}
              {activeSpecies !== "all" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-[#D5DDD2] text-[#15271E] font-medium">
                  {activeSpecies}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter("species", "all")} />
                </span>
              )}
              {activeColor !== "all" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-[#D5DDD2] text-[#15271E] font-medium">
                  {activeColor}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter("color", "all")} />
                </span>
              )}
              {inStockOnly && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium">
                  In Stock Only
                  <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter("in_stock", null)} />
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 font-medium">
                  &ldquo;{searchQuery}&rdquo;
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => {
                      setSearchInput("");
                      updateFilter("q", null);
                    }}
                  />
                </span>
              )}
              <button
                onClick={clearAllFilters}
                className="text-clay hover:underline inline-flex items-center gap-1 ml-1 font-semibold"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>
          )}
        </div>

        {/* 3. Catalog Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block space-y-6 sticky top-28">
            <div className="p-5 rounded-lg bg-white border border-[#E5E0D8] space-y-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE1]">
                <h3 className="font-sans text-sm font-semibold text-[#15271E] flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-clay" />
                  <span>Filter Collection</span>
                </h3>
                {hasActiveFilters && (
                  <button onClick={clearAllFilters} className="text-xs text-clay hover:underline font-medium">
                    Reset
                  </button>
                )}
              </div>

              {/* In Stock Toggle */}
              <div>
                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-[#15271E] select-none">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => updateFilter("in_stock", e.target.checked ? "true" : null)}
                    className="w-4 h-4 rounded text-clay focus:ring-clay border-[#CBD5C7]"
                  />
                  <span>In-Stock Plants Only</span>
                </label>
              </div>

              {/* Species Filter */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-neutral-700 block">
                  Species
                </span>
                <div className="space-y-1">
                  <button
                    onClick={() => updateFilter("species", "all")}
                    className={`block w-full text-left text-xs py-1.5 px-2.5 rounded-md ${
                      activeSpecies === "all"
                        ? "bg-[#15271E] text-white font-medium"
                        : "text-[#525B52] hover:bg-neutral-50"
                    }`}
                  >
                    All Species
                  </button>
                  {speciesList.map((sp) => (
                    <button
                      key={sp}
                      onClick={() => updateFilter("species", sp)}
                      className={`block w-full text-left text-xs py-1.5 px-2.5 rounded-md ${
                        activeSpecies === sp
                          ? "bg-[#15271E] text-white font-medium"
                          : "text-[#525B52] hover:bg-neutral-50"
                      }`}
                    >
                      {sp}
                    </button>
                  ))}
                </div>
              </div>

              {/* Flower Color Palette */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-neutral-700 block">
                  Flower Color
                </span>
                <div className="space-y-1">
                  <button
                    onClick={() => updateFilter("color", "all")}
                    className={`block w-full text-left text-xs py-1.5 px-2.5 rounded-md ${
                      activeColor === "all"
                        ? "bg-[#15271E] text-white font-medium"
                        : "text-[#525B52] hover:bg-neutral-50"
                    }`}
                  >
                    All Colors
                  </button>
                  {colorList.map((col) => (
                    <button
                      key={col}
                      onClick={() => updateFilter("color", col)}
                      className={`block w-full text-left text-xs py-1.5 px-2.5 rounded-md ${
                        activeColor === col
                          ? "bg-[#15271E] text-white font-medium"
                          : "text-[#525B52] hover:bg-neutral-50"
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>

              {/* Petal Layer Filter */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-neutral-700 block">
                  Petal Type
                </span>
                <div className="space-y-1">
                  <button
                    onClick={() => updateFilter("petal", "all")}
                    className={`block w-full text-left text-xs py-1.5 px-2.5 rounded-md ${
                      activePetal === "all"
                        ? "bg-[#15271E] text-white font-medium"
                        : "text-[#525B52] hover:bg-neutral-50"
                    }`}
                  >
                    All Petal Types
                  </button>
                  {petalTypes.map((pt) => (
                    <button
                      key={pt}
                      onClick={() => updateFilter("petal", pt)}
                      className={`block w-full text-left text-xs py-1.5 px-2.5 rounded-md ${
                        activePetal === pt
                          ? "bg-[#15271E] text-white font-medium"
                          : "text-[#525B52] hover:bg-neutral-50"
                      }`}
                    >
                      {pt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between text-xs text-neutral-500 mb-4 font-medium">
              <span>Showing {filteredProducts.length} {filteredProducts.length === 1 ? "plant" : "plants"}</span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="rounded-lg border border-[#E5E0D8] bg-white p-12 text-center space-y-4 shadow-sm">
                <h3 className="font-serif text-xl font-normal text-[#15271E]">
                  No matching plants found
                </h3>
                <p className="text-sm text-[#525B52] max-w-md mx-auto">
                  Try clearing some filters or send us a message on WhatsApp for custom orders and incoming nursery batches.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={clearAllFilters}
                    className="px-4 py-2 rounded-md bg-neutral-100 hover:bg-neutral-200 text-[#15271E] text-xs font-semibold transition-colors"
                  >
                    Reset Filters
                  </button>
                  <a
                    href="https://wa.me/923001234567"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-colors"
                  >
                    Ask on WhatsApp
                  </a>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-7">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Slide-Over Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-4/5 max-w-sm bg-white shadow-xl flex flex-col justify-between p-6 overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E0D8]">
                <h3 className="font-sans text-base font-semibold text-[#15271E]">
                  Filter Plants
                </h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1.5 text-neutral-500 hover:text-neutral-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* In-Stock */}
              <div>
                <label className="flex items-center gap-2.5 text-xs font-medium text-[#15271E]">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => updateFilter("in_stock", e.target.checked ? "true" : null)}
                    className="w-4 h-4 rounded text-clay"
                  />
                  <span>In-Stock Only</span>
                </label>
              </div>

              {/* Species */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-neutral-700 block">Species</span>
                <div className="space-y-1">
                  <button
                    onClick={() => updateFilter("species", "all")}
                    className={`block w-full text-left text-xs py-1.5 px-2.5 rounded-md ${
                      activeSpecies === "all" ? "bg-[#15271E] text-white" : "text-neutral-700"
                    }`}
                  >
                    All Species
                  </button>
                  {speciesList.map((sp) => (
                    <button
                      key={sp}
                      onClick={() => updateFilter("species", sp)}
                      className={`block w-full text-left text-xs py-1.5 px-2.5 rounded-md ${
                        activeSpecies === sp ? "bg-[#15271E] text-white" : "text-neutral-700"
                      }`}
                    >
                      {sp}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#E5E0D8] flex gap-3">
              <button
                onClick={clearAllFilters}
                className="flex-1 py-2.5 rounded-md bg-neutral-100 text-[#15271E] text-xs font-semibold"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 rounded-md bg-[#15271E] text-white text-xs font-semibold"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
