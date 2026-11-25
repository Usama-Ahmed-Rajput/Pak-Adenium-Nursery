"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";
import { Product } from "@/types";
import {
  Compass,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Check,
} from "lucide-react";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";

interface Question {
  id: string;
  title: string;
  subtitle: string;
  options: {
    label: string;
    description: string;
    value: string;
    icon?: string;
  }[];
}

const QUESTIONS: Question[] = [
  {
    id: "experience",
    title: "What is your experience cultivating Adenium Desert Roses?",
    subtitle: "We tailor root care recommendations to your growing journey.",
    options: [
      {
        label: "Beginner / First Desert Rose",
        description: "Looking for hardy, forgiving rootstocks with vigorous seasonal blooms.",
        value: "beginner",
      },
      {
        label: "Enthusiast / Bonsai Practitioner",
        description: "Experienced with succulent care, root-raising, and pruning.",
        value: "enthusiast",
      },
      {
        label: "Collector Seeking Rare Lineages",
        description: "Seeking Dorset Horn, Thai Socotranum, or multi-petal hybrids.",
        value: "collector",
      },
    ],
  },
  {
    id: "aesthetic",
    title: "Which botanical aesthetic speaks to you most?",
    subtitle: "The Desert Rose offers both flower art and sculptural trunk architecture.",
    options: [
      {
        label: "Multi-Petal Layered Flowers",
        description: "Densely ruffled blooms mimicking camellias, roses, and dark velvet midnight hues.",
        value: "flowers",
      },
      {
        label: "Sculptural Caudex & Bonsai Trunk",
        description: "Massive swollen bases, exposed root flares, and stout baobab silhouettes.",
        value: "caudex",
      },
      {
        label: "Curled / Dwarf Rare Foliage",
        description: "Tightly curled ram-horn leaves or compact micro branching.",
        value: "foliage",
      },
      {
        label: "Grow from Seed",
        description: "Hand-pollinated fresh seeds to raise unique genetic seedlings.",
        value: "seed",
      },
    ],
  },
  {
    id: "location",
    title: "Where will your plant be situated?",
    subtitle: "Sunlight is vital to maintain tight internodes and vibrant flower pigmentation.",
    options: [
      {
        label: "Full Direct Sun (Rooftop / Open Lawn)",
        description: "6+ hours of intense unfiltered sun. Ideal for all Arabicum and dark blooms.",
        value: "full_sun",
      },
      {
        label: "Sunny Balcony / Porch",
        description: "Bright morning sun with light midday shade.",
        value: "balcony",
      },
      {
        label: "Greenhouse / Sheltered Patio",
        description: "Protected from monsoon rains and winter morning frost.",
        value: "patio",
      },
    ],
  },
  {
    id: "budget",
    title: "What is your preferred budget range?",
    subtitle: "Prices reflect plant age, flower variety, and base trunk thickness.",
    options: [
      {
        label: "Under Rs. 3,000",
        description: "Fresh seeds, mineral potting mix, and young starter plants.",
        value: "budget_starter",
      },
      {
        label: "Rs. 4,000 — Rs. 8,000",
        description: "Mature 2-3 year flowering grafted varieties and compact bonsai.",
        value: "budget_mid",
      },
      {
        label: "Rs. 9,000 — Rs. 25,000+",
        description: "Rare 3-6 year collector plants and master bonsai trays.",
        value: "budget_specimen",
      },
    ],
  },
];

export default function PlantFinderPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const currentQ = QUESTIONS[currentStep];

  const handleSelectOption = (value: string) => {
    const updatedAnswers = { ...answers, [currentQ.id]: value };
    setAnswers(updatedAnswers);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      // Finished all questions! Calculate recommendations
      calculateRecommendations(updatedAnswers);
    }
  };

  const calculateRecommendations = async (finalAnswers: Record<string, string>) => {
    setIsLoading(true);
    try {
      // Fetch all products
      const res = await fetch("/api/search?q=");
      const data = await res.json();
      const all: Product[] = data.products || [];

      let matched: Product[] = [];

      // Filter logic based on choices
      if (finalAnswers.aesthetic === "caudex") {
        matched = all.filter(
          (p) =>
            p.species.includes("Arabicum") ||
            p.category_name?.includes("Arabicum") ||
            p.category_name?.includes("Bonsai")
        );
      } else if (finalAnswers.aesthetic === "foliage") {
        matched = all.filter(
          (p) =>
            p.variety.includes("Dorset") ||
            p.name.includes("Dorset") ||
            p.species.includes("Hybrid")
        );
      } else if (finalAnswers.aesthetic === "seed") {
        matched = all.filter((p) => p.sku.includes("SD") || p.name.includes("Seeds"));
      } else {
        // Flowers
        matched = all.filter(
          (p) => p.is_grafted || p.petal_type.includes("Layer") || p.petal_type.includes("Triple")
        );
      }

      // Budget filter
      if (finalAnswers.budget === "budget_starter") {
        const filtered = matched.filter((p) => (p.sale_price ?? p.price) <= 3000);
        if (filtered.length > 0) matched = filtered;
      } else if (finalAnswers.budget === "budget_mid") {
        const filtered = matched.filter(
          (p) => (p.sale_price ?? p.price) >= 3000 && (p.sale_price ?? p.price) <= 8500
        );
        if (filtered.length > 0) matched = filtered;
      } else if (finalAnswers.budget === "budget_specimen") {
        const filtered = matched.filter((p) => (p.sale_price ?? p.price) >= 8000);
        if (filtered.length > 0) matched = filtered;
      }

      // Fallback if none matched
      if (matched.length === 0) {
        matched = all.slice(0, 3);
      }

      setRecommendations(matched);
      setHasCompleted(true);
    } catch (err) {
      console.error("Error calculating recommendations", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentStep(0);
    setHasCompleted(false);
    setRecommendations([]);
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-ivory py-12 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-clay/15 border border-clay/30 text-clay text-xs uppercase tracking-wider font-medium">
              <Compass className="w-3.5 h-3.5" />
              Botanical Concierge
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-botanical-950">
              Desert Rose Recommendation Wizard
            </h1>
            <p className="text-sm text-charcoal-muted max-w-lg mx-auto">
              Answer 4 simple questions about your sunlight, space, and aesthetic preferences. We will pair you with plants proven to thrive.
            </p>
          </div>

          {!hasCompleted ? (
            <div className="rounded-3xl bg-white border border-botanical-200/80 p-6 sm:p-10 shadow-card space-y-8">
              {/* Progress Steps */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono text-charcoal-muted">
                  <span>Question {currentStep + 1} of {QUESTIONS.length}</span>
                  <span>{Math.round(((currentStep + 1) / QUESTIONS.length) * 100)}% Complete</span>
                </div>
                <div className="w-full bg-botanical-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-clay h-full transition-all duration-300"
                    style={{
                      width: `${((currentStep + 1) / QUESTIONS.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Question Stage */}
              <div className="space-y-2">
                <h2 className="font-serif text-2xl sm:text-3xl font-medium text-botanical-950">
                  {currentQ.title}
                </h2>
                <p className="text-xs sm:text-sm text-charcoal-muted">
                  {currentQ.subtitle}
                </p>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 gap-3.5">
                {currentQ.options.map((opt) => {
                  const isSelected = answers[currentQ.id] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleSelectOption(opt.value)}
                      className={`text-left p-4 sm:p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 group ${
                        isSelected
                          ? "border-botanical-900 bg-botanical-50/70 shadow-subtle"
                          : "border-botanical-200/80 hover:border-botanical-400 bg-white hover:bg-ivory/50"
                      }`}
                    >
                      <div className="space-y-1">
                        <h3 className="font-serif text-base sm:text-lg font-medium text-botanical-950 group-hover:text-clay transition-colors">
                          {opt.label}
                        </h3>
                        <p className="text-xs text-charcoal-muted leading-relaxed">
                          {opt.description}
                        </p>
                      </div>

                      <div
                        className={`w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 mt-1 transition-colors ${
                          isSelected
                            ? "border-botanical-900 bg-botanical-900 text-ivory"
                            : "border-botanical-300 group-hover:border-botanical-600"
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Back / Navigation Buttons */}
              <div className="pt-4 flex items-center justify-between border-t border-botanical-100 text-xs">
                {currentStep > 0 ? (
                  <button
                    onClick={() => setCurrentStep((s) => s - 1)}
                    className="text-botanical-700 hover:text-botanical-950 font-medium"
                  >
                    ← Previous Question
                  </button>
                ) : (
                  <div />
                )}
                <span className="text-charcoal-muted">Click an option to proceed</span>
              </div>
            </div>
          ) : (
            /* Results View */
            <div className="space-y-10 animate-fade-in">
              <div className="rounded-2xl bg-botanical-50 border border-botanical-200/80 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-clay font-medium block">
                    Tailored Matching Complete
                  </span>
                  <h2 className="font-serif text-2xl font-medium text-botanical-950 mt-1">
                    Your Curated Plant Matches
                  </h2>
                  <p className="text-xs text-charcoal-muted mt-1">
                    Based on your preferences for {answers.aesthetic} and {answers.location?.replace("_", " ")}.
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <button
                    onClick={handleRestart}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-botanical-300 bg-white text-xs font-medium text-botanical-900 hover:bg-botanical-100 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Retake Quiz
                  </button>
                </div>
              </div>

              {/* Recommended Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>

              {/* WhatsApp Specialist Fallback */}
              <div className="rounded-2xl bg-white border border-botanical-200 p-6 text-center space-y-3">
                <h3 className="font-serif text-lg font-medium text-botanical-950">
                  Need a specific variety or personalized plant video?
                </h3>
                <p className="text-xs text-charcoal-muted max-w-md mx-auto">
                  Our head grower can film live plants on our nursery benches and guide your selection via WhatsApp.
                </p>
                <a
                  href={`https://wa.me/923002560340?text=${encodeURIComponent(
                    `Hello Pak Adenium, I completed your Plant Finder quiz and would like personalized recommendations for: ${answers.aesthetic} in ${answers.location}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] text-botanical-950 font-semibold text-xs transition-colors shadow-subtle"
                >
                  <WhatsAppIcon className="w-4 h-4 text-botanical-950" />
                  Chat with Nursery Specialist
                </a>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

