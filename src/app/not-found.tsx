import React from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowRight, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-ivory flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-botanical-100 text-clay flex items-center justify-center mx-auto">
            <Compass className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-clay font-medium">
              Error 404 · Botanical Specimen Missing
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-medium text-botanical-950">
              Uprooted Pathway
            </h1>
            <p className="text-sm text-charcoal-muted leading-relaxed">
              The plant, guide, or specimen page you are looking for may have been repotted, renamed, or relocated.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/shop"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-botanical-900 text-ivory text-xs font-semibold hover:bg-botanical-950 shadow-card transition-colors inline-flex items-center justify-center gap-2"
            >
              <span>Explore Specimen Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-botanical-300 text-botanical-900 text-xs font-medium hover:bg-botanical-50 transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

