import React from "react";
import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getSiteSettings } from "@/lib/db";
import { buildBreadcrumbSchema } from "@/lib/seo";
import { Sparkles, Heart, Sun, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "About Pak Adenium — Desert Rose Nursery in Pakistan",
  description:
    "Learn about Pak Adenium, our Desert Rose propagation grounds in Karachi, and our outdoor acclimation standards for Adenium plants in Pakistan.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Pak Adenium — Desert Rose Nursery in Pakistan",
    description:
      "Learn about Pak Adenium, our Desert Rose propagation grounds, and our passion for nurturing sculptural Adenium bonsai in Pakistan.",
    url: "/about",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Pak Adenium — Desert Rose Nursery in Pakistan",
    description:
      "Specialist Adenium botanical nursery in Pakistan cultivating outdoor-acclimated Desert Rose plants and caudex bonsai.",
  },
};

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "About Pak Adenium", path: "/about" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Navbar
        announcement={settings.announcement}
        whatsappNumber={settings.general.whatsapp}
        phone={settings.general.phone}
        address={settings.general.address}
        nurseryName={settings.general.nursery_name}
      />
      <main className="flex-1 bg-ivory py-12 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="space-y-4 text-center max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-clay font-medium flex items-center justify-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              Our Propagation Heritage
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-botanical-950 leading-tight">
              Patience in Every Caudex. <br />
              Art in Every Bloom.
            </h1>
            <p className="text-sm sm:text-base text-charcoal-muted leading-relaxed">
              We started Pak Adenium with a single conviction: a Desert Rose is not merely another garden plant—it is a living sculpture that grows more majestic with each passing decade.
            </p>
          </div>

          {/* Photo Gallery Showcase */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="rounded-3xl overflow-hidden aspect-[4/3] bg-ivory-sand border border-botanical-200">
              <img
                src="https://images.unsplash.com/photo-1509423350716-97f9360b4e09?q=80&w=1000&auto=format&fit=crop"
                alt="Adenium bench cultivation"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-3xl overflow-hidden aspect-[4/3] bg-ivory-sand border border-botanical-200">
              <img
                src="https://images.unsplash.com/photo-1596724806740-d9962a93fa21?q=80&w=1000&auto=format&fit=crop"
                alt="Multi-petal grafted bloom study"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Editorial Philosophy */}
          <div className="rounded-3xl bg-white border border-botanical-200/80 p-8 sm:p-12 shadow-subtle space-y-6 text-sm text-charcoal-light leading-relaxed">
            <h2 className="font-serif text-2xl font-medium text-botanical-950">
              The Journey of Acclimation
            </h2>
            <p>
              Growing Adeniums in Pakistan requires deep understanding of regional microclimates. The coastal sun and warm humidity of Karachi accelerate photosynthesis and caudex water retention, yet the torrential monsoon rains can devastate root systems if drainage is compromised.
            </p>
            <p>
              From day one, we discarded peat-heavy, waterlogged potting mixes in favor of custom-sieved mineral substrates composed of crushed volcanic rock, washed river sand, and aged organic mulch. Every root system is given room to breathe, preventing fungal rot while encouraging dramatic radial flare.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-botanical-100 text-xs">
              <div className="space-y-1">
                <span className="font-semibold text-botanical-950 block">No Rush, No Shortcuts</span>
                <p className="text-charcoal-muted">
                  We allow rootstocks to mature 2 to 3 full years before precision grafting to ensure durable vascular fusion.
                </p>
              </div>
              <div className="space-y-1">
                <span className="font-semibold text-botanical-950 block">True-to-Lineage Scions</span>
                <p className="text-charcoal-muted">
                  Parent plants are strictly documented. What blooms in our photos is what blooms on your terrace.
                </p>
              </div>
              <div className="space-y-1">
                <span className="font-semibold text-botanical-950 block">Nationwide Doorstep Care</span>
                <p className="text-charcoal-muted">
                  Custom protective packaging protects every branch node and caudex contour from depot jostling.
                </p>
              </div>
            </div>
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

