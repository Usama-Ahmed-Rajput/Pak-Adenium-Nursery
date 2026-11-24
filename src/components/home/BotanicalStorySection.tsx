import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface BotanicalStorySectionProps {
  title?: string;
  description?: string;
  badge?: string;
}

export default function BotanicalStorySection({
  title,
  description,
  badge = "Our Growing Standards",
}: BotanicalStorySectionProps) {
  return (
    <section
      id="botanical-philosophy"
      className="py-20 sm:py-28 bg-[#FBF9F4] text-[#1D211D] border-b border-[#E5E0D8]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Photograph */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-lg overflow-hidden bg-[#F5F2EB] border border-[#E5E0D8] shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1509423350716-97f9360b4e09?q=80&w=1200&auto=format&fit=crop"
                alt="Mature Adenium Arabicum Caudex Bonsai"
                className="w-full h-[480px] sm:h-[520px] object-cover transition-transform duration-700 hover:scale-[1.02]"
              />

              {/* Natural Caption Overlay */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-md bg-white/95 backdrop-blur-sm border border-[#E5E0D8] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-clay block font-semibold">
                    Desert Rose Bonsai
                  </span>
                  <span className="font-sans text-sm font-semibold text-[#15271E]">
                    5-Year Root-Trained Bonsai
                  </span>
                </div>
                <span className="text-neutral-500">Outdoor Growing Bench</span>
              </div>
            </div>
          </div>

          {/* Right Narrative & Nursery Standards */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-wider text-clay font-semibold">
                {badge}
              </span>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#15271E] leading-[1.15]">
                {title ? (
                  title
                ) : (
                  <>
                    Grown for Pakistan&rsquo;s heat. <br />
                    <span className="text-clay">Nurtured season by season.</span>
                  </>
                )}
              </h2>

              <p className="text-sm sm:text-base text-[#525B52] leading-relaxed pt-1">
                {description || "In our nursery, summer temperatures routinely cross 45°C. While delicate tropical plants struggle, the Desert Rose thrives in this intense sun—building a dense, water-storing caudex and producing rich multi-petal flower flushes."}
              </p>

              <p className="text-sm sm:text-base text-[#525B52] leading-relaxed">
                We do not sell fragile greenhouse imports potted in heavy wet peat. Every plant is acclimated outdoors in porous mineral substrates designed to withstand Pakistan&rsquo;s monsoon humidity and winter cold.
              </p>
            </div>

            {/* 3 Real Horticultural Principles */}
            <div className="space-y-4 pt-3 border-t border-[#E5E0D8]">
              <div className="flex items-start gap-3.5">
                <span className="w-6 h-6 rounded-full bg-[#15271E] text-white flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-[#15271E]">
                    Root-Trained Bonsai Architecture
                  </h3>
                  <p className="text-xs text-[#525B52] mt-0.5 leading-relaxed">
                    Seedlings are trained over horizontal discs in shallow pans, encouraging wide radial root flares that mimic ancient baobab silhouettes.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <span className="w-6 h-6 rounded-full bg-[#15271E] text-white flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-[#15271E]">
                    Monsoon-Safe Mineral Substrates
                  </h3>
                  <p className="text-xs text-[#525B52] mt-0.5 leading-relaxed">
                    Custom mixes of sieved pumice, gravel, and charcoal allow water to drain in seconds, preventing soft caudex rot during humid spells.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <span className="w-6 h-6 rounded-full bg-[#15271E] text-white flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-[#15271E]">
                    Verified Multi-Petal Lineages
                  </h3>
                  <p className="text-xs text-[#525B52] mt-0.5 leading-relaxed">
                    Every grafted bloom comes from documented mother stock—guaranteeing authentic double and triple petal layers that stay true to form.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#15271E] hover:text-clay transition-colors uppercase tracking-wider"
              >
                <span>Learn more about our nursery</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
