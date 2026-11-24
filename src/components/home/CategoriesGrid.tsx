import React from "react";
import Link from "next/link";
import { Category } from "@/types";
import { ArrowRight } from "lucide-react";

interface CategoriesGridProps {
  categories: Category[];
}

export default function CategoriesGrid({ categories }: CategoriesGridProps) {
  return (
    <section className="py-20 sm:py-28 bg-[#FBF9F4] border-b border-[#E5E0D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E5E0D8]">
          <div>
            <span className="text-xs uppercase tracking-wider text-clay font-semibold block">
              Plant Categories
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#15271E] mt-1">
              Browse by Variety &amp; Form
            </h2>
            <p className="text-sm text-[#525B52] max-w-xl mt-1.5">
              From layered multi-petal flowers and sculptural swollen caudexes to mature bonsai and specialized potting mixes.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#15271E] hover:text-clay transition-colors uppercase tracking-wider flex-shrink-0"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 6 Clean Category Cards (3 columns desktop, 2 tablet, 1 mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.slug}`}
              className="group flex flex-col justify-between bg-white rounded-lg border border-[#E5E0D8] hover:border-[#15271E]/40 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md"
            >
              {/* Image */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F5F2EB]">
                <img
                  src={category.image_url}
                  alt={category.name}
                  loading="lazy"
                  className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
              </div>

              {/* Text Info */}
              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div className="space-y-1.5">
                  <h3 className="font-serif text-xl font-normal text-[#15271E] group-hover:text-clay transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-[#525B52] leading-relaxed line-clamp-2">
                    {category.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F0EBE1] flex items-center justify-between text-xs font-semibold text-[#15271E] group-hover:text-clay transition-colors">
                  <span>Explore Plants</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
