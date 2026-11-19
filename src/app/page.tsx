import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import BotanicalStorySection from "@/components/home/BotanicalStorySection";
import CuratedCollectionSection from "@/components/home/CuratedCollectionSection";
import CategoriesGrid from "@/components/home/CategoriesGrid";
import PlantFinderBanner from "@/components/home/PlantFinderBanner";
import JournalHighlights from "@/components/home/JournalHighlights";
import { getProducts, getCategories, getArticles, getSiteSettings } from "@/lib/db";

export const revalidate = 60; // Incremental Static Regeneration

export default async function HomePage() {
  const [products, categories, articles, settings] = await Promise.all([
    getProducts({ limit: 8 }),
    getCategories(),
    getArticles(),
    getSiteSettings(),
  ]);

  return (
    <>
      <Navbar
        announcement={settings.announcement}
        whatsappNumber={settings.general.whatsapp}
      />
      <main className="flex-1">
        <HeroSection
          headline={settings.homepage?.hero_headline}
          description={settings.homepage?.hero_description}
          ctaText={settings.homepage?.hero_cta_text}
          ctaLink={settings.homepage?.hero_cta_link}
          secondaryText={settings.homepage?.hero_secondary_text}
          secondaryLink={settings.homepage?.hero_secondary_link}
        />
        <BotanicalStorySection
          badge={settings.homepage?.story_badge}
          title={settings.homepage?.story_title}
          description={settings.homepage?.story_description}
        />
        <CuratedCollectionSection products={products} />
        <CategoriesGrid categories={categories} />
        <PlantFinderBanner />
        <JournalHighlights articles={articles} />
      </main>
      <Footer
        nurseryName={settings.general.nursery_name}
        tagline={settings.general.tagline}
        phone={settings.general.phone}
        email={settings.general.email}
        address={settings.general.address}
        social={settings.social}
      />
    </>
  );
}

