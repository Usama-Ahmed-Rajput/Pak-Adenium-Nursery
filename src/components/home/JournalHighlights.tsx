import React from "react";
import Link from "next/link";
import { Article } from "@/types";
import { formatDate } from "@/lib/utils";
import { ArrowRight, Clock } from "lucide-react";

interface JournalHighlightsProps {
  articles: Article[];
}

export default function JournalHighlights({ articles }: JournalHighlightsProps) {
  const leadArticle = articles[0];
  const sideArticles = articles.slice(1, 3);

  return (
    <section className="py-20 sm:py-28 bg-[#FBF9F4] border-b border-[#E5E0D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E5E0D8]">
          <div>
            <span className="text-xs uppercase tracking-wider text-clay font-semibold block">
              Plant Care &amp; Advice
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#15271E] mt-1">
              Growing Guides &amp; Nursery Notes
            </h2>
            <p className="text-sm text-[#525B52] max-w-xl mt-1.5">
              Practical cultivation tips written for Pakistan&rsquo;s intense summer heat, monsoon humidity, and winter dormancy cycles.
            </p>
          </div>

          <Link
            href="/journal"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#15271E] hover:text-clay transition-colors uppercase tracking-wider flex-shrink-0"
          >
            <span>Read All Guides ({articles.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 1 Lead Article + 2 Side Articles */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Lead Article (7 cols) */}
          {leadArticle && (
            <article className="lg:col-span-7 bg-white rounded-lg border border-[#E5E0D8] hover:border-[#15271E]/40 p-5 sm:p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group">
              <div className="space-y-4">
                <Link
                  href={`/journal/${leadArticle.slug}`}
                  className="block relative aspect-[16/10] rounded-md overflow-hidden bg-[#F5F2EB]"
                >
                  <img
                    src={leadArticle.featured_image}
                    alt={leadArticle.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded bg-[#15271E]/90 text-white text-[11px] font-semibold">
                      Featured Guide
                    </span>
                  </div>
                </Link>

                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 text-xs text-[#6B726A]">
                    <span className="text-clay font-semibold uppercase">{leadArticle.category}</span>
                    <span>·</span>
                    <span>{formatDate(leadArticle.created_at)}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {leadArticle.read_time_minutes} min read
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#15271E] group-hover:text-clay transition-colors leading-snug">
                    <Link href={`/journal/${leadArticle.slug}`}>{leadArticle.title}</Link>
                  </h3>

                  <p className="text-xs sm:text-sm text-[#525B52] leading-relaxed line-clamp-3">
                    {leadArticle.excerpt}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#F0EBE1] flex items-center justify-between">
                <span className="text-xs text-[#525B52] font-medium">
                  By {leadArticle.author_name}
                </span>
                <Link
                  href={`/journal/${leadArticle.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#15271E] group-hover:text-clay"
                >
                  <span>Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          )}

          {/* Side Articles (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            {sideArticles.map((article) => (
              <article
                key={article.id}
                className="p-5 sm:p-6 bg-white rounded-lg border border-[#E5E0D8] hover:border-[#15271E]/40 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3 group flex-1"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-[#6B726A]">
                    <span className="text-clay font-semibold uppercase">{article.category}</span>
                    <span>·</span>
                    <span>{article.read_time_minutes} min read</span>
                  </div>

                  <h4 className="font-serif text-xl font-normal text-[#15271E] group-hover:text-clay transition-colors leading-snug">
                    <Link href={`/journal/${article.slug}`}>{article.title}</Link>
                  </h4>

                  <p className="text-xs text-[#525B52] line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F0EBE1] flex items-center justify-between text-xs">
                  <span className="text-[#6B726A] text-[11px]">
                    {formatDate(article.created_at)}
                  </span>
                  <Link
                    href={`/journal/${article.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#15271E] group-hover:text-clay"
                  >
                    <span>Read article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
