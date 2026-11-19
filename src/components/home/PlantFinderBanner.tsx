import React from "react";
import Link from "next/link";
import { ArrowRight, Sun, Flower2, Box, Award } from "lucide-react";

export default function PlantFinderBanner() {
  return (
    <section className="py-20 sm:py-28 bg-[#F5F2EB] border-b border-[#E5E0D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl bg-[#15271E] text-[#FBF9F4] p-8 sm:p-12 lg:p-14 border border-[#233D2E] shadow-md relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5">
              <span className="text-xs uppercase tracking-wider text-clay font-semibold block">
                Plant Recommendation
              </span>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-white leading-tight">
                Find the right Desert Rose for your space.
              </h2>

              <p className="text-sm sm:text-base text-[#D8DFD5] leading-relaxed max-w-xl">
                A rooftop terrace in Lahore requires different care than a coastal balcony in Karachi or an indoor bay in Islamabad. Answer 4 quick questions to discover varieties tailored to your light and space.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Link
                  href="/plant-finder"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md bg-clay hover:bg-clay-hover text-white font-semibold text-sm transition-colors shadow-sm"
                >
                  <span>Start Plant Finder</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <span className="text-xs text-[#CBD5C7]">Takes under 1 minute · Instant plant match</span>
              </div>
            </div>

            {/* Right Criteria Grid */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3.5 text-xs">
              <div className="p-4 rounded-lg bg-[#233D2E]/80 border border-[#32533F] space-y-1.5">
                <Sun className="w-4 h-4 text-amber-400" />
                <h3 className="font-sans text-sm font-semibold text-white">
                  Sunlight &amp; Heat
                </h3>
                <p className="text-[11px] text-[#CBD5C7] leading-relaxed">
                  Full rooftop sun vs. morning balcony shade.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[#233D2E]/80 border border-[#32533F] space-y-1.5">
                <Flower2 className="w-4 h-4 text-rose-300" />
                <h3 className="font-sans text-sm font-semibold text-white">
                  Bloom or Caudex
                </h3>
                <p className="text-[11px] text-[#CBD5C7] leading-relaxed">
                  Multi-petal dark flowers vs. thick fat bonsai roots.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[#233D2E]/80 border border-[#32533F] space-y-1.5">
                <Box className="w-4 h-4 text-clay" />
                <h3 className="font-sans text-sm font-semibold text-white">
                  Pot Size
                </h3>
                <p className="text-[11px] text-[#CBD5C7] leading-relaxed">
                  Compact 6-inch planters to 14-inch bonsai trays.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[#233D2E]/80 border border-[#32533F] space-y-1.5">
                <Award className="w-4 h-4 text-emerald-400" />
                <h3 className="font-sans text-sm font-semibold text-white">
                  Experience Level
                </h3>
                <p className="text-[11px] text-[#CBD5C7] leading-relaxed">
                  Hardy beginner plants to rare collector varieties.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
