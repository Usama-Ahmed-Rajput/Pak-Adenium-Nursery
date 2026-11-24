import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getArticles, getSiteSettings } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { BookOpen, Clock, ArrowRight } from "lucide-react";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "The Growing Journal — Adenium Care Protocols & Horticultural Notes",
    description:
      "Expert guides on cultivating Desert Rose plants in Pakistan. Learn caudex fattening, root training, monsoon rot prevention, and winter dormancy management.",
  };
}

export const dynamic = "force-dynamic";

export default async function JournalPage() {
  const [articles, settings] = await Promise.all([
    getArticles(),
    getSiteSettings(),
  ]);

  return (
    <>
      <Navbar
        announcement={settings.announcement}
        whatsappNumber={settings.general.whatsapp}
        phone={settings.general.phone}
        address={settings.general.address}
        nurseryName={settings.general.nursery_name}
      />
      <main className="flex-1 bg-ivory py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="max-w-3xl space-y-3">
            <span className="text-xs uppercase tracking-widest text-clay font-medium flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5" />
              Plant Care Knowledge Center
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-botanical-950">
              The Growing Journal
            </h1>
            <p className="text-sm sm:text-base text-charcoal-muted leading-relaxed">
              Field-tested cultivation wisdom formulated through years of caring for Desert Roses under Pakistan&rsquo;s intense climatic swings—from 47°C dry Multan heat to monsoon downpours and winter rest.
            </p>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <article
                key={article.id}
                className="group flex flex-col justify-between bg-white rounded-2xl border border-botanical-200/80 overflow-hidden shadow-subtle hover:shadow-card transition-all"
              >
                <Link
                  href={`/journal/${article.slug}`}
                  className="block relative aspect-[16/10] overflow-hidden bg-ivory-sand"
                >
                  <img
                    src={article.featured_image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-sm text-[10px] font-semibold uppercase tracking-wider text-botanical-800 border border-botanical-200">
                      {article.category}
                    </span>
                  </div>
                </Link>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-xs text-charcoal-muted">
                      <span>{formatDate(article.created_at)}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.read_time_minutes} min read
                      </span>
                    </div>

                    <h2 className="font-serif text-xl font-medium text-botanical-950 group-hover:text-clay transition-colors leading-snug">
                      <Link href={`/journal/${article.slug}`}>{article.title}</Link>
                    </h2>

                    <p className="text-xs text-charcoal-muted line-clamp-3 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-botanical-100 flex items-center justify-between">
                    <span className="text-xs text-botanical-800 font-medium">
                      {article.author_name}
                    </span>
                    <Link
                      href={`/journal/${article.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-clay hover:underline"
                    >
                      Read Guide <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer
        nurseryName={settings.general.nursery_name}
        tagline={settings.general.tagline}
        phone={settings.general.phone}
        email={settings.general.email}
        address={settings.general.address}
        social={settings.social}
        whatsappNumber={settings.general.whatsapp}
      />
    </>
  );
}

