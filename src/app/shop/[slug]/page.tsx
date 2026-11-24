import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductGallery from "@/components/product/ProductGallery";
import ProductOrderPanel from "@/components/product/ProductOrderPanel";
import ProductCard from "@/components/product/ProductCard";
import { getProductBySlug, getProducts, getSiteSettings } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import {
  Sun,
  Droplets,
  Thermometer,
  Layers,
  Calendar,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return { title: "Plant Not Found" };
  }

  const priceFormatted = formatPrice(product.sale_price ?? product.price);

  return {
    title: product.seo_title || `${product.name} — Desert Rose Plant`,
    description:
      product.seo_description ||
      `Buy authentic ${product.name} (${product.species}) at Pak Adenium Nursery. ${priceFormatted}. Safe delivery in Pakistan.`,
    openGraph: {
      title: `${product.name} | Pak Adenium Nursery`,
      description: product.description.substring(0, 160),
      images: [
        {
          url:
            product.images[0]?.image_url ||
            "https://images.unsplash.com/photo-1596724806740-d9962a93fa21?q=80&w=1200&auto=format&fit=crop",
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([
    getProductBySlug(slug),
    getSiteSettings(),
  ]);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getProducts({
    categoryId: product.category_id,
    limit: 4,
  });
  const filteredRelated = relatedProducts.filter((p) => p.id !== product.id).slice(0, 3);

  // JSON-LD structured data for Google Search
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images.map((img) => img.image_url),
    description: product.description,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: "Pak Adenium Nursery",
    },
    offers: {
      "@type": "Offer",
      url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://pakadenium.pk"}/shop/${product.slug}`,
      priceCurrency: "PKR",
      price: product.sale_price ?? product.price,
      availability:
        product.stock_quantity > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
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
      />

      <main className="flex-1 bg-ivory py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs text-charcoal-muted font-medium">
            <Link href="/" className="hover:text-botanical-900">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-botanical-300" />
            <Link href="/shop" className="hover:text-botanical-900">
              Catalog
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-botanical-300" />
            <span className="text-botanical-950 truncate max-w-xs">{product.name}</span>
          </nav>

          {/* Main Stage: Gallery on Left, Specs & Buy Box on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Gallery Column */}
            <div className="lg:col-span-7">
              <ProductGallery images={product.images} productName={product.name} />
            </div>

            {/* Product Meta & Actions Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2 border-b border-botanical-200/70 pb-5">
                <div className="flex items-center justify-between text-xs font-mono text-charcoal-muted">
                  <span className="uppercase tracking-wider text-clay font-semibold">
                    {product.species}
                  </span>
                  <span>SKU: {product.sku}</span>
                </div>

                <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-botanical-950 leading-tight">
                  {product.name}
                </h1>

                <p className="text-xs text-botanical-700 font-medium">
                  {product.flower_color} · {product.petal_type}
                </p>
              </div>

              {/* Order Panel (Price, Stock, Add to Cart, WhatsApp) */}
              <ProductOrderPanel
                product={product}
                whatsappNumber={settings.general.whatsapp}
              />

              {/* Plant Physical Parameters Matrix */}
              <div className="rounded-2xl bg-white border border-botanical-200/80 p-5 space-y-3 shadow-subtle">
                <h3 className="font-serif text-sm font-semibold text-botanical-950 uppercase tracking-wider">
                  Plant Characteristics &amp; Details
                </h3>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="border-b border-botanical-100 pb-2">
                    <span className="text-charcoal-muted block">Caudex Girth</span>
                    <span className="font-medium text-botanical-950">{product.caudex_size}</span>
                  </div>
                  <div className="border-b border-botanical-100 pb-2">
                    <span className="text-charcoal-muted block">Plant Age</span>
                    <span className="font-medium text-botanical-950">{product.plant_age}</span>
                  </div>
                  <div className="border-b border-botanical-100 pb-2">
                    <span className="text-charcoal-muted block">Grafting Status</span>
                    <span className="font-medium text-botanical-950">
                      {product.is_grafted ? "Verified Multi-Petal Graft" : "Seed-Grown Plant"}
                    </span>
                  </div>
                  <div className="border-b border-botanical-100 pb-2">
                    <span className="text-charcoal-muted block">Pot Container</span>
                    <span className="font-medium text-botanical-950">{product.pot_size}</span>
                  </div>
                  <div className="col-span-2 pt-1">
                    <span className="text-charcoal-muted block">Variety & Form</span>
                    <span className="font-medium text-botanical-950">{product.variety}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Narrative & Care Protocol Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-10 border-t border-botanical-200/70">
            {/* Left: Detailed Story / Description */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-clay font-medium">
                  Plant Details
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-medium text-botanical-950 mt-1">
                  About this Plant
                </h2>
              </div>

              <div className="prose prose-botanical text-sm text-charcoal-light leading-relaxed space-y-4">
                <p>{product.description}</p>
              </div>

              {/* Provenance notes */}
              <div className="p-5 rounded-2xl bg-botanical-50 border border-botanical-200/70 space-y-2 text-xs text-botanical-900">
                <div className="flex items-center gap-2 font-semibold text-botanical-950">
                  <CheckCircle2 className="w-4 h-4 text-clay" />
                  Cultivated for Pakistan Climate Resilience
                </div>
                <p className="text-charcoal-muted leading-relaxed">
                  Unlike imported imports that arrive dehydrated and suffer shock under Pakistan&rsquo;s dry extreme summers, this plant has been fully acclimated outdoors in our Multan benches. It is actively metabolizing and rooted into fast-draining mineral media.
                </p>
              </div>
            </div>

            {/* Right: Specialized Care Matrix */}
            <div className="lg:col-span-5 space-y-5">
              <div>
                <span className="text-xs uppercase tracking-widest text-clay font-medium">
                  Cultivation Protocol
                </span>
                <h3 className="font-serif text-2xl font-medium text-botanical-950 mt-1">
                  Plant Care Guide
                </h3>
              </div>

              <div className="space-y-4 text-xs">
                {/* Sunlight */}
                <div className="p-4 rounded-xl bg-white border border-botanical-200/70 flex gap-3.5">
                  <Sun className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-botanical-950 mb-0.5">Sunlight Exposure</h4>
                    <p className="text-charcoal-muted leading-relaxed">{product.care_sunlight}</p>
                  </div>
                </div>

                {/* Watering */}
                <div className="p-4 rounded-xl bg-white border border-botanical-200/70 flex gap-3.5">
                  <Droplets className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-botanical-950 mb-0.5">Watering Protocol</h4>
                    <p className="text-charcoal-muted leading-relaxed">{product.care_watering}</p>
                  </div>
                </div>

                {/* Temperature */}
                <div className="p-4 rounded-xl bg-white border border-botanical-200/70 flex gap-3.5">
                  <Thermometer className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-botanical-950 mb-0.5">Temperature Tolerance</h4>
                    <p className="text-charcoal-muted leading-relaxed">{product.care_temperature}</p>
                  </div>
                </div>

                {/* Soil & Drainage */}
                <div className="p-4 rounded-xl bg-white border border-botanical-200/70 flex gap-3.5">
                  <Layers className="w-5 h-5 text-stone-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-botanical-950 mb-0.5">Soil & Drainage</h4>
                    <p className="text-charcoal-muted leading-relaxed">{product.care_soil}</p>
                  </div>
                </div>

                {/* Seasonal Dormancy */}
                {product.seasonal_notes && (
                  <div className="p-4 rounded-xl bg-white border border-botanical-200/70 flex gap-3.5">
                    <Calendar className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-botanical-950 mb-0.5">Seasonal Behavior</h4>
                      <p className="text-charcoal-muted leading-relaxed">{product.seasonal_notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Related Specimens */}
          {filteredRelated.length > 0 && (
            <div className="pt-14 border-t border-botanical-200/70 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase tracking-widest text-clay font-medium">
                    Botanical Companions
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-medium text-botanical-950">
                    Related Desert Rose Plants
                  </h3>
                </div>
                <Link
                  href="/shop"
                  className="text-xs font-semibold text-botanical-900 hover:text-clay transition-colors"
                >
                  View All Collection
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRelated.map((rel) => (
                  <ProductCard key={rel.id} product={rel} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

