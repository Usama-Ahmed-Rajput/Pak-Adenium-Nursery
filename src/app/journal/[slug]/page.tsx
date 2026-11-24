import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getArticleBySlug, getArticles, getSiteSettings } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { ChevronRight, Clock, BookOpen, User, Share2, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Article Not Found" };

  return {
    title: article.seo_title || `${article.title} — Pak Adenium Journal`,
    description: article.seo_description || article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [{ url: article.featured_image }],
    },
  };
}

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const [article, settings] = await Promise.all([
    getArticleBySlug(slug),
    getSiteSettings(),
  ]);

  if (!article) {
    notFound();
  }

  const allArticles = await getArticles();
  const relatedArticles = allArticles.filter((a) => a.id !== article.id).slice(0, 2);

  // JSON-LD Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: [article.featured_image],
    datePublished: article.created_at,
    author: {
      "@type": "Person",
      name: article.author_name,
    },
    publisher: {
      "@type": "Organization",
      name: settings.general.nursery_name,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar
        announcement={settings.announcement}
        whatsappNumber={settings.general.whatsapp}
        phone={settings.general.phone}
        address={settings.general.address}
        nurseryName={settings.general.nursery_name}
      />
      <main className="flex-1 bg-ivory py-10 sm:py-16">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-charcoal-muted font-medium">
            <Link href="/" className="hover:text-botanical-900">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-botanical-300" />
            <Link href="/journal" className="hover:text-botanical-900">
              Growing Journal
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-botanical-300" />
            <span className="text-botanical-950 truncate max-w-xs">{article.category}</span>
          </nav>

          {/* Article Header */}
          <div className="space-y-4">
            <span className="px-3 py-1 rounded-full bg-botanical-100 text-botanical-900 text-xs font-semibold uppercase tracking-wider">
              {article.category}
            </span>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-botanical-950 leading-tight">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-charcoal-muted pt-2 border-b border-botanical-200 pb-4">
              <div className="flex items-center gap-1.5 font-medium text-botanical-900">
                <User className="w-4 h-4 text-clay" />
                <span>{article.author_name}</span>
              </div>
              <span>·</span>
              <span>Published {formatDate(article.created_at)}</span>
              <span>·</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{article.read_time_minutes} min read</span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="rounded-3xl overflow-hidden aspect-[16/9] bg-ivory-sand border border-botanical-200/80 shadow-subtle">
            <img
              src={article.featured_image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Body Content */}
          <div className="prose prose-botanical max-w-none text-charcoal-light leading-relaxed text-sm sm:text-base space-y-6 pt-4">
            {article.content.split("\n\n").map((para, i) => {
              if (para.startsWith("## ")) {
                return (
                  <h2 key={i} className="font-serif text-2xl sm:text-3xl font-medium text-botanical-950 pt-4">
                    {para.replace("## ", "")}
                  </h2>
                );
              }
              if (para.startsWith("### ")) {
                return (
                  <h3 key={i} className="font-serif text-xl sm:text-2xl font-medium text-botanical-950 pt-2">
                    {para.replace("### ", "")}
                  </h3>
                );
              }
              return <p key={i} className="leading-relaxed">{para}</p>;
            })}
          </div>

          {/* Author Box */}
          <div className="p-6 rounded-2xl bg-white border border-botanical-200/80 flex items-center gap-4 shadow-subtle">
            <div className="w-12 h-12 rounded-full bg-botanical-900 text-ivory flex items-center justify-center font-serif font-bold text-lg flex-shrink-0">
              P
            </div>
            <div>
              <h4 className="font-serif text-base font-medium text-botanical-950">
                {article.author_name}
              </h4>
              <p className="text-xs text-charcoal-muted">
                Pak Adenium Horticultural Research & Propagation Master. Cultivating Desert Roses in Pakistan since 2018.
              </p>
            </div>
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div className="pt-10 border-t border-botanical-200 space-y-6">
              <h3 className="font-serif text-2xl font-medium text-botanical-950">
                Further Horticultural Reading
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {relatedArticles.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/journal/${rel.slug}`}
                    className="p-5 rounded-2xl bg-white border border-botanical-200/80 shadow-subtle hover:shadow-card transition-all space-y-2 group"
                  >
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-clay">
                      {rel.category}
                    </span>
                    <h4 className="font-serif text-base font-medium text-botanical-950 group-hover:text-clay transition-colors leading-snug">
                      {rel.title}
                    </h4>
                    <p className="text-xs text-charcoal-muted line-clamp-2">
                      {rel.excerpt}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="pt-6">
            <Link
              href="/journal"
              className="inline-flex items-center gap-2 text-xs font-semibold text-botanical-900 hover:text-clay transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Growing Journal
            </Link>
          </div>
        </article>
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

