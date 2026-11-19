"use client";

import React from "react";
import Link from "next/link";
import { Product } from "@/types";
import ProductCard from "@/components/product/ProductCard";
import { ArrowRight } from "lucide-react";

interface CuratedCollectionSectionProps {
  products: Product[];
}

export default function CuratedCollectionSection({ products }: CuratedCollectionSectionProps) {
  // Display up to 4 featured products
  const displayProducts = products.slice(0, 4);

  return (
    <section id="featured-collection" className="py-20 sm:py-28 bg-[#F5F2EB] border-b border-[#E5E0D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E0D9CD]">
          <div>
            <span className="text-xs uppercase tracking-wider text-clay font-semibold block">
              In Stock & Ready to Ship
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#15271E] mt-1">
              Featured Desert Rose Plants
            </h2>
            <p className="text-sm text-[#525B52] max-w-xl mt-1.5">
              Each plant is photographed on our nursery benches. You receive the exact plant variety and healthy root formation selected.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#15271E] hover:text-clay transition-colors uppercase tracking-wider flex-shrink-0"
          >
            <span>Browse All Plants ({products.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Clean, Professional Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
