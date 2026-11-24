"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";

interface HeroSectionProps {
  headline?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryText?: string;
  secondaryLink?: string;
  location?: string;
}

export default function HeroSection({
  headline = "Nature, shaped by patience.",
  description = "Sculptural caudex forms, multi-petal grafted blooms, and mature desert rose bonsai—cultivated under Pakistan's natural sun and shipped safely nationwide in custom protective packing.",
  ctaText = "Explore Collection",
  ctaLink = "/shop",
  secondaryText = "About Our Nursery",
  secondaryLink = "/about",
  location = "Botanical Nursery · Karachi, Pakistan",
}: HeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setPrefersReducedMotion(true);
      return;
    }

    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video
        .play()
        .then(() => setIsVideoLoaded(true))
        .catch(() => {
          setIsVideoLoaded(false);
        });
    }
  }, []);

  const scrollToContent = () => {
    const el = document.getElementById("featured-collection");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full min-h-[85vh] lg:min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#0D1813] text-[#FBF9F4]">
      {/* 1. Real 15s Adenium Nursery Garden Video Background */}
      <div className="hero-video-container pointer-events-none select-none">
        {!prefersReducedMotion ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/images/hero-poster.jpg"
            onLoadedData={() => setIsVideoLoaded(true)}
            className={`hero-video-media transition-opacity duration-1000 ${
              isVideoLoaded ? "opacity-100" : "opacity-90"
            }`}
          >
            <source src="/videos/hero-garden.mp4" type="video/mp4" />
            <source src="/Adenium_nursery_garden_website_hero_ffcdb007.mp4" type="video/mp4" />
          </video>
        ) : (
          <img
            src="/images/hero-poster.jpg"
            alt="Pak Adenium Botanical Nursery Garden"
            className="hero-video-media"
          />
        )}

        {/* Natural photographic contrast vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/50" />
      </div>

      {/* 2. Editorial Typography & Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col justify-between min-h-[75vh] lg:min-h-[82vh]">
        {/* Top Location Note */}
        <div className="pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-black/40 backdrop-blur-sm border border-white/15 text-xs text-[#F5F2E9] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-clay" />
            <span>{location}</span>
          </div>
        </div>

        {/* Center Editorial Headline (DM Serif Display + Manrope) */}
        <div className="max-w-3xl my-auto space-y-6 pt-10 pb-8">
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-wider text-clay font-semibold block">
              Desert Rose Plants & Bonsai
            </span>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-white leading-[1.08]">
              {headline}
            </h1>
          </div>

          <p className="text-base sm:text-lg text-[#E9E4D7] max-w-xl font-normal leading-relaxed">
            {description}
          </p>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            <Link
              href={ctaLink}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-md bg-white text-[#15271E] hover:bg-[#F5F2E9] font-semibold text-sm transition-all shadow-sm"
            >
              <span>{ctaText}</span>
              <ArrowRight className="w-4 h-4 text-clay" />
            </Link>

            <Link
              href={secondaryLink}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-md bg-black/40 hover:bg-black/60 border border-white/20 text-white font-medium text-sm backdrop-blur-sm transition-all"
            >
              <span>{secondaryText}</span>
            </Link>
          </div>
        </div>

        {/* Bottom Highlights & Scroll */}
        <div className="pt-6 border-t border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#E9E4D7]">
          <div className="flex flex-wrap items-center gap-5 sm:gap-8 font-medium">
            <span>• Sun-Acclimated Varieties</span>
            <span>• Mineral-Rich Root Mixes</span>
            <span>• Nationwide Live Arrival Guarantee</span>
          </div>

          <button
            onClick={scrollToContent}
            className="hidden lg:inline-flex items-center gap-1.5 text-white/70 hover:text-white transition-colors cursor-pointer"
            aria-label="Scroll to collection"
          >
            <span>Scroll down</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
